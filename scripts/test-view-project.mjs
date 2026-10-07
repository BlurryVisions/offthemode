// Runs /view-project's own command line on a project, with the built page in place of the download, opens the result in
// headless Chrome, and checks that the page draws the checklist header's counts and the project is left as it was.
// usage: npm run test:view-project                     (this repo's .offthemode/)
//        npm run test:view-project -- ~/other-project
// Local only, not in CI: it needs Google Chrome (CHROME=/path/to/chrome for another one), Node 22 or later (for its
// WebSocket) and the built page (npm run content).
import { spawn, execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = resolve(process.argv[2] ?? ROOT);
const NOTES = join(PROJECT, ".offthemode");
const BUILT = join(ROOT, "public/view/index.html");
const LIVE = "https://offthemode.vercel.app/view";
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
function expect(ok, what) {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures++;
}
function stop(what) {
  console.error(`test-view-project: ${what}`);
  process.exit(1);
}
if (!existsSync(NOTES)) stop(`${PROJECT} has no .offthemode/ folder`);
if (!existsSync(BUILT)) stop("public/view/index.html is missing: run npm run content first");
if (!existsSync(CHROME)) stop(`no Chrome at ${CHROME}: set CHROME to its path`);

// 1. The line comes from the command itself, so the test runs what users run. Two swaps only: the built page in place
// of the live one, and echo in place of open, so the test opens no window of its own.
const body = readFileSync(join(ROOT, "content/commands/view-project.md"), "utf8");
const line = body.match(/`(OUT="\$\{TMPDIR[^`]*)`/)?.[1] ?? stop("content/commands/view-project.md: no macOS and Linux line found");
const cmd = line.replace(LIVE, pathToFileURL(BUILT).href).replace(/ && open "\$OUT"$/, ' && echo "$OUT"');
if (cmd.includes(LIVE) || !cmd.endsWith('echo "$OUT"')) stop("the line no longer downloads the view and ends with open; update this test with it");

// What "unchanged" means: git's view of the project, and the bytes of every note.
const status = () => {
  try {
    return execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: PROJECT, stdio: ["ignore", "pipe", "ignore"] }).toString();
  } catch {
    return null;
  }
};
const noteNames = readdirSync(NOTES).filter((f) => f.endsWith(".md")).sort();
const notesHash = () => createHash("sha256").update(noteNames.map((f) => f + readFileSync(join(NOTES, f), "latin1")).join("\0")).digest("hex");
const before = { git: status(), notes: notesHash() };

const tmp = mkdtempSync(join(tmpdir(), "offthemode-view-project-"));
const want = join(tmp, "offthemode-view.html");
let out;
try {
  out = execFileSync("/bin/sh", ["-c", cmd], { cwd: PROJECT, env: { ...process.env, TMPDIR: tmp } }).toString().trim();
} catch (e) {
  stop(`the line failed: ${e.message}`);
}
expect(out === want, `the line writes one temporary page · ${out}`);

// 2. The page is the built page, then one template per note holding that note's exact bytes.
const page = readFileSync(want, "utf8");
const built = readFileSync(BUILT, "utf8");
const embedded = [...page.slice(built.length).matchAll(/<template data-offthemode-file="([^"]+)">([^<]*)<\/template>/g)];
expect(page.startsWith(built), "page · starts with the built view page");
const names = embedded.map(([, name]) => name).sort();
expect(names.join() === noteNames.join() && embedded.every(([, name, b64]) => Buffer.from(b64, "base64").equals(readFileSync(join(NOTES, name)))),
  `page · ${embedded.length} notes embedded after </html>, each decoding to its file's bytes (${noteNames.join(", ")})`);

// 3. Headless Chrome opens the file the way a browser does after open, and draws the project with no folder picked.
const profile = mkdtempSync(join(tmpdir(), "offthemode-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--window-size=1440,900", "about:blank"], { stdio: "ignore" });
let drawn = null;
try {
  drawn = await draw(pathToFileURL(want).href);
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
  rmSync(tmp, { recursive: true, force: true });
}

const header = readFileSync(join(NOTES, "CHECKLIST.md"), "utf8").match(/^Last revisit:[^\n]*·\s*Verified\s*(\d+)\s*\/\s*(\d+)/m);
expect(Boolean(header), `CHECKLIST.md header · ${header ? `Verified ${header[1]}/${header[2]}` : "no Verified count"}`);
expect(header && drawn.verified === header[1] && drawn.total === header[2], `drawn at once · ${drawn.verified}/${drawn.total} verified, the same as the header`);
expect(/snapshot/i.test(drawn.status) && drawn.status.includes("/view-project"), `status line · says it is a snapshot made by /view-project: "${drawn.status}"`);
expect(!drawn.errors.length, `no script error${drawn.errors.length ? `: ${drawn.errors.join(" | ")}` : ""}`);
const away = drawn.requests.filter((u) => !/^(file:|data:|https:\/\/fonts\.(googleapis|gstatic)\.com\/)/.test(u));
expect(!away.length, `requests · only the file itself and its fonts (${drawn.requests.length} in all)${away.length ? `; also ${away.join(", ")}` : ""}`);

// 4. Nothing in the project changed.
const after = { git: status(), notes: notesHash() };
expect(after.notes === before.notes, "project · every .offthemode/ note is byte for byte the same");
if (before.git === null) console.log("note project · not a git repo, so git status was not compared");
else expect(after.git === before.git, `project · git status is the same as before (${before.git.split("\n").filter(Boolean).length} lines)`);

console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);

// Drives Chrome over the DevTools protocol: loads the page, waits for the stamp, and reads what it drew.
async function draw(url) {
  const portFile = join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const port = existsSync(portFile) ? readFileSync(portFile, "utf8").split("\n")[0] : stop("Chrome did not start");
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
    } catch {
      await sleep(100);
    }
  }
  if (!target) stop("Chrome has no page to drive");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener("open", r); ws.addEventListener("error", j); });
  let id = 0;
  const pending = new Map();
  const requests = [];
  const errors = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
    if (m.method === "Network.requestWillBeSent") requests.push(m.params.request.url.slice(0, 160));
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description?.split("\n")[0] ?? m.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  const value = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true })).result?.result?.value;
  await send("Network.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url });
  let read = null;
  for (let i = 0; i < 100 && !read; i++) {
    await sleep(100);
    read = await value(`(() => {
      const b = document.querySelector(".st-count b"), of = document.querySelector(".st-count .of");
      return b && of ? { verified: b.textContent.trim(), total: of.textContent.replace("/", "").trim(), status: document.getElementById("status")?.textContent.trim() ?? "" } : null;
    })()`);
  }
  // The status line may be written just after the stamp.
  await sleep(300);
  if (read) read.status = (await value(`document.getElementById("status")?.textContent.trim() ?? ""`)) || read.status;
  ws.close();
  return { verified: null, total: null, status: "", ...read, requests, errors };
}
