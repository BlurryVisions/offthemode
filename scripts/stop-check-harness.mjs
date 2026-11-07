// The harness scripts/test-stop-check.mjs and stop-check-git-cases.mjs share: throwaway git projects whose RULES.md
// names small check scripts, and the stop check run in them the way Claude Code runs it, a Stop hook input on stdin.
// OTM_STOP_CHECK=<file> tests another copy of the script (a deliberately broken one shows which test catches it).
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SCRIPT = resolve(process.env.OTM_STOP_CHECK || join(ROOT, "content/templates/stop-check.mjs"));
export const SOURCE = readFileSync(SCRIPT, "utf8");
export const BASE = mkdtempSync(join(tmpdir(), "otm-stop-check-"));
export const OUT = join(BASE, "outside");
mkdirSync(OUT);
let passed = 0;
const failed = [], pidFiles = [];
export const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
export const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
export const expect = (ok, what, detail = "") => (ok ? passed++ : failed.push(`FAIL ${what}${detail ? `\n     ${detail}` : ""}`));

export const DONE = "Done. The fix is live and all 12 tests pass.";
export const CHECKPOINT = "Step 1 is done. Stopping here for your review before I start step 2.";
export const PLAN = "Here is the plan: the queue first, then the runner. Which one first?";
export const OWNER = "i dont want to shift songs which are only on deluxe and not on normal album to normal album";
export const REWORDED = "We will not move a song that's only on a deluxe edition to the plain album";

// Check scripts a project's RULES.md names. Each records that it ran in OUT, outside the project.
const here = "import { appendFileSync, readFileSync } from 'node:fs'; import { basename, join } from 'node:path'; const tag = join(process.env.OTM_TEST_OUT, basename(process.cwd()));";
const CHECKS = {
  "count.mjs": `${here} appendFileSync(tag + '.count', 'x');`,
  "fail.mjs": `${here} console.log('1 test failed: adds up'); process.exit(Number(readFileSync('fail.txt', 'utf8')));`,
  "fail.txt": "1",
  "pass.mjs": "console.log('all good');",
  "old-rule.mjs": "console.log('0 breaks across all 109 edition families');",
  "rule.mjs": "import { readFileSync } from 'node:fs'; const r = JSON.parse(readFileSync('rule.json', 'utf8')); console.log(`RULE \"${r.quote}\": broke ${r.broke} · judged ${r.judged} of ${r.of} ${r.unit}`); process.exit(r.broke ? 1 : 0);",
  "rule.json": JSON.stringify({ quote: OWNER, broke: 0, judged: 5, of: 5, unit: "moves" }),
  "screen.mjs": "console.log('SCREEN \"/fix\": wrong 2 · checked 8 of 10 rows'); process.exit(1);",
  "noisy.mjs": `for (let i = 0; i < 200; i++) console.log('RULE bad line ' + i); console.log(${JSON.stringify(`RULE "${REWORDED}": broke 0 · judged 5 of 5 moves`)});`,
  "screen-ok.mjs": "console.log('SCREEN \"/queue\": wrong 0 · checked 3 of 3 rows');",
  "lab.mjs": "console.log('SCREEN \"/lab/fix/[state]\": wrong 0 · checked 10 of 10 rows');",
  "hang.mjs": `${here} import { spawn } from 'node:child_process'; const kid = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' }); appendFileSync(tag + '.pids', process.pid + ' ' + kid.pid); setInterval(() => {}, 1000);`,
};

export const git = (dir, ...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", "-c", "advice.addEmbeddedRepo=false", ...args], { cwd: dir, stdio: "ignore" });
/** A project named `name`; with `inside`, it is the folder `name` in a repository named `inside`. `init` adds git init
 * options, such as a SHA-256 repository. */
export function project(name, { commands, product = "", budgets = "", noGit = false, inside = "", init = [] }) {
  const repo = join(BASE, inside || name), dir = inside ? join(repo, name) : repo;
  mkdirSync(join(dir, ".offthemode"), { recursive: true });
  writeFileSync(join(dir, ".offthemode/RULES.md"), `RULES · ${name}\n\n## Budgets\n\`\`\`json\n{ ${budgets} }\n\`\`\`\n\n## Commands (fill once the toolchain exists)\n${commands}\n\n## Done means verified\nChecks pass.\n`);
  writeFileSync(join(dir, ".offthemode/PRODUCT.md"), `PRODUCT · ${name}\n\n## Refusals and tie-breakers\n${product}\n`);
  for (const [f, text] of Object.entries(CHECKS)) writeFileSync(join(dir, f), text);
  copyFileSync(SCRIPT, join(dir, ".offthemode/stop-check.mjs"));
  if (noGit) return dir;
  git(repo, "init", "-q", ...init);
  git(repo, "add", "-A");
  git(repo, "commit", "-qm", "start");
  return dir;
}
export const ownerLine = (quote, unit = "moves") => `- Owner's rule (2026-10-27): "${quote}" · counted in ${unit} · rule check \`node rule.mjs\``;
export const edit = (dir, f, text) => writeFileSync(join(dir, f), text);
export const ran = (dir, what = "count") => {
  const f = join(OUT, `${basename(dir)}.${what}`);
  if (what === "pids") pidFiles.push(f);
  return existsSync(f) ? readFileSync(f, "utf8") : "";
};
export const stateFile = (dir) => join(dir, ".git/offthemode-stop.json");

export function node(args, cwd, input) {
  return new Promise((ok) => {
    const child = spawn(process.execPath, args, { cwd, env: { ...process.env, OTM_TEST_OUT: OUT, CLAUDE_PROJECT_DIR: cwd } });
    let stdout = "", stderr = "";
    // A hook that hangs fails its test instead of hanging the check.
    const timer = setTimeout(() => { stderr += "killed after 30 s"; child.kill("SIGKILL"); }, 30000);
    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("close", (code) => { clearTimeout(timer); ok({ code, stdout, stderr }); });
    child.stdin.end(input ?? "");
  });
}
export async function hook(dir, input = {}) {
  const started = Date.now();
  const r = await node([join(dir, ".offthemode/stop-check.mjs")], dir, JSON.stringify({ hook_event_name: "Stop", session_id: "s1", cwd: dir, stop_hook_active: false, last_assistant_message: DONE, ...input }));
  let out = null;
  try { out = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { out = { raw: r.stdout, stderr: r.stderr }; }
  return { out, ms: Date.now() - started, back: out?.hookSpecificOutput?.additionalContext ?? "", shown: out?.systemMessage ?? "", stderr: r.stderr };
}
export const now = (dir) => node([join(dir, ".offthemode/stop-check.mjs"), "--now"], dir);
export const show = (h) => JSON.stringify(h.out).slice(0, 600);

/** Runs the cases side by side, ends what a failed one left running, removes the projects, and prints the result. */
export async function finish(name, cases) {
  try {
    await Promise.all(cases.map((c) => c()));
  } finally {
    for (const pid of pidFiles.flatMap((f) => (existsSync(f) ? readFileSync(f, "utf8").split(" ").filter(Boolean).map(Number) : []))) { try { process.kill(pid, "SIGKILL"); } catch { /* gone */ } }
    rmSync(BASE, { recursive: true, force: true });
  }
  for (const f of failed) console.error(f);
  console.log(`${name}: ${passed} passed${failed.length ? `, ${failed.length} failed` : ""}`);
  process.exit(failed.length ? 1 : 0);
}
