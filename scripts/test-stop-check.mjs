// Tests the stop check (content/templates/stop-check.mjs) the way Claude Code runs it: a Stop hook input on stdin, in
// throwaway git projects whose RULES.md names small check scripts. Prints only what failed, then one summary line.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, existsSync, readdirSync, statSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { tmpdir } from "node:os";
import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = join(ROOT, "content/templates/stop-check.mjs");
const SOURCE = readFileSync(SCRIPT, "utf8");
const { readReply, parseCommands, parseLines, productRules } = await import(SCRIPT);
const BASE = mkdtempSync(join(tmpdir(), "otm-stop-check-"));
const OUT = join(BASE, "outside");
mkdirSync(OUT);
let passed = 0;
const failed = [];
const expect = (ok, what, detail = "") => (ok ? passed++ : failed.push(`FAIL ${what}${detail ? `\n     ${detail}` : ""}`));

const DONE = "Done. The fix is live and all 12 tests pass.";
const CHECKPOINT = "Step 1 is done. Stopping here for your review before I start step 2.";
const PLAN = "Here is the plan: the queue first, then the runner. Which one first?";
const OWNER = "i dont want to shift songs which are only on deluxe and not on normal album to normal album";
const REWORDED = "We will not move a song that's only on a deluxe edition to the plain album";

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
  "hang.mjs": `${here} import { spawn } from 'node:child_process'; const kid = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' }); appendFileSync(tag + '.pids', process.pid + ' ' + kid.pid); setInterval(() => {}, 1000);`,
};

const git = (dir, ...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", ...args], { cwd: dir, stdio: "ignore" });
function project(name, { commands, product = "", budgets = "" }) {
  const dir = join(BASE, name);
  mkdirSync(join(dir, ".offthemode"), { recursive: true });
  writeFileSync(join(dir, ".offthemode/RULES.md"), `RULES · ${name}\n\n## Budgets\n\`\`\`json\n{ ${budgets} }\n\`\`\`\n\n## Commands (fill once the toolchain exists)\n${commands}\n\n## Done means verified\nChecks pass.\n`);
  writeFileSync(join(dir, ".offthemode/PRODUCT.md"), `PRODUCT · ${name}\n\n## Refusals and tie-breakers\n${product}\n`);
  for (const [f, text] of Object.entries(CHECKS)) writeFileSync(join(dir, f), text);
  copyFileSync(SCRIPT, join(dir, ".offthemode/stop-check.mjs"));
  git(dir, "init", "-q");
  git(dir, "add", "-A");
  git(dir, "commit", "-qm", "start");
  return dir;
}
const ownerLine = (quote, unit = "moves") => `- Owner's rule (2026-10-27): "${quote}" · counted in ${unit} · rule check \`node rule.mjs\``;
const edit = (dir, f, text) => writeFileSync(join(dir, f), text);
const ran = (dir, what = "count") => (existsSync(join(OUT, `${dir.split("/").pop()}.${what}`)) ? readFileSync(join(OUT, `${dir.split("/").pop()}.${what}`), "utf8") : "");
const stateFile = (dir) => join(dir, ".git/offthemode-stop.json");

function node(args, cwd, input) {
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
async function hook(dir, input = {}) {
  const started = Date.now();
  const r = await node([join(dir, ".offthemode/stop-check.mjs")], dir, JSON.stringify({ hook_event_name: "Stop", cwd: dir, stop_hook_active: false, last_assistant_message: DONE, ...input }));
  let out = null;
  try { out = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { out = { raw: r.stdout, stderr: r.stderr }; }
  return { out, ms: Date.now() - started, back: out?.hookSpecificOutput?.additionalContext ?? "", shown: out?.systemMessage ?? "" };
}
const show = (h) => JSON.stringify(h.out).slice(0, 600);

// ---------- the parts ----------
function parts() {
  for (const t of ["Done. The Undo fix is live (b0373a0), and all 1,283 tests pass.", "Pushed (`fc46e2d`), with the phone app included.", "All three fixes are live.", "I fixed the song checker and re-scored every run.", "Piece 1 is done: the queue's tables, with all 914 tests passing."]) {
    expect(readReply(t) === "claim", `readReply · a claim of done: ${t}`, readReply(t));
  }
  for (const t of [PLAN, "It isn't finished yet: the review is still running.", "Save the file, then tell me **\"done\"**.", "Each item has a done-when: a test by name.", "Spotify's built-in Last.fm link sends your plays.", "Once it's fixed, I'll push it and tell you.", "STATE.md was updated."]) {
    expect(readReply(t) === "none", `readReply · not a claim: ${t}`, readReply(t));
  }
  for (const t of [CHECKPOINT, "Setup is finished and pushed. Shall I start step 1?"]) expect(readReply(t) === "checkpoint", `readReply · a checkpoint: ${t}`, readReply(t));

  const cmds = parseCommands("## Commands (x)\ncheck `npm run check` · full check `npm run check && npm run build` · run `npm run dev` · rule checks `npm run check:bonus` (reads saved answers; `npm run fetch:mb` refreshes them) · screen checks `npx playwright test e2e/fix.spec.ts` · evals `none`\n\n## Done means verified\n");
  expect(JSON.stringify(cmds.map((c) => [c.kind, c.cmd, c.plain])) === JSON.stringify([["check", "npm run check", true], ["rule", "npm run check:bonus", true], ["screen", "npx playwright test e2e/fix.spec.ts", true]]),
    "parseCommands · runs check, rule checks and screen checks only, never a command inside a (note)", JSON.stringify(cmds));
  const odd = parseCommands("## Commands\ncheck `npm test; rm -rf /` · rule checks `git push` `node a.mjs && node b.mjs` `{{?RULE_CMDS}}` · screen checks `$(curl x)`\n");
  expect(JSON.stringify(odd.map((c) => c.plain)) === "[false,false,true,false]", "parseCommands · only plain commands (words joined by &&) run; a placeholder is skipped", JSON.stringify(odd));

  // The templates as setup writes them: unfilled placeholders are never run or taken for the owner's words.
  const tpl = (name) => readFileSync(join(ROOT, "content/templates", name), "utf8");
  expect(parseCommands(tpl("RULES.md")).length === 0 && productRules(tpl("PRODUCT.md")).length === 0,
    "templates · RULES.md §Commands and PRODUCT.md's owner's-rule line, unfilled, give no check and no rule", JSON.stringify([parseCommands(tpl("RULES.md")), productRules(tpl("PRODUCT.md"))]));
  const filled = productRules(`- Owner's rule (2026-10-12): "${OWNER}" · counted in moves · checked by npm run check:bonus`);
  expect(filled.length === 1 && filled[0].quote === OWNER && filled[0].unit === "moves", "productRules · reads the template's line once filled: the words and what it counts", JSON.stringify(filled));

  const lines = parseLines(`noise\n\x1b[32mRULE "${OWNER}": broke 15 · judged 870 of 1,690 moves\x1b[0m\nRULE "x": 0 breaks across all 109 edition families\nSCREEN "/fix": wrong 0 · checked 10 of 10 rows`);
  const r = lines.rules[0];
  expect(r?.broke === 15 && r.judged === 870 && r.of === 1690 && r.unit === "moves" && r.quote === OWNER && lines.malformed.length === 1 && lines.screens[0]?.checked === 10,
    "parseLines · reads RULE and SCREEN lines, numbers with commas, and flags a RULE line not in the form", JSON.stringify(lines));

  const settings = JSON.parse(SOURCE.match(/^\/\/ SETTINGS (\{.*\})$/m)?.[1] ?? "{}");
  const h = settings.hooks?.Stop?.[0]?.hooks?.[0];
  const seconds = Number(SOURCE.match(/^const SECONDS = (\d+);/m)?.[1]);
  expect(h?.type === "command" && h.command === "node" && h.args?.[0] === "${CLAUDE_PROJECT_DIR}/.offthemode/stop-check.mjs" && h.timeout > seconds + 60 && Object.keys(settings.hooks).join() === "Stop",
    `the settings block · one Stop hook running node on the script, its timeout (${h?.timeout} s) above the checks' time (${seconds} s)`);
  const net = SOURCE.match(/\bfrom\s*["'](?:node:)?(?:http2?|https|net|tls|dgram|dns)["']|\bimport\s*\(|\brequire\s*\(|\bfetch\s*\(|\bWebSocket\b/);
  expect(!net, "the script imports no network module and makes no network call", net?.[0]);
}

// ---------- the hook ----------
async function failingCheck() {
  const dir = project("failing", { commands: "check `node count.mjs && node fail.mjs` · full check `node pass.mjs`" });
  let h = await hook(dir, { last_assistant_message: PLAN });
  expect(h.out === null && ran(dir) === "" && !existsSync(stateFile(dir)), "a reply that doesn't claim done runs nothing, shows nothing and writes nothing", show(h));
  h = await hook(dir);
  expect(h.back.includes("`node count.mjs && node fail.mjs` failed (exit 1)") && h.back.includes("1 test failed: adds up") && h.shown.includes("sent back once") && ran(dir) === "x",
    "a done claim with a failing check sends the AI back, with the failing lines", show(h));
  h = await hook(dir);
  expect(h.out === null && ran(dir) === "x", "no file changed since the last run: nothing runs and nothing is shown", show(h));
  edit(dir, "notes.txt", "a change that fixes nothing");
  h = await hook(dir);
  expect(!h.back && h.shown.includes("Same result as when your AI was last sent back") && ran(dir) === "xx", "the same numbers again are shown and the stop goes through", show(h));
  edit(dir, "fail.txt", "2");
  h = await hook(dir, { stop_hook_active: true });
  expect(!h.back && h.shown.includes("failed (exit 2") && h.shown.includes("already sent back once"), "stop_hook_active: new numbers are shown, never sent back, so it can't loop", show(h));
  edit(dir, "notes.txt", "another change");
  h = await hook(dir);
  expect(h.back.includes("failed (exit 2)"), "...and the same new numbers on a later claim do send back once", show(h));
  edit(dir, "fail.txt", "3");
  h = await hook(dir, { last_assistant_message: CHECKPOINT });
  expect(!h.back && h.shown.includes("failed (exit 3") && h.shown.includes("stopped for your answer"), "a reply that stops for the owner (a checkpoint) is shown new numbers, never sent back", show(h));
  edit(dir, "notes.txt", "a fourth change");
  h = await hook(dir, { background_tasks: [{ id: "a", type: "workflow", status: "running" }] });
  expect(h.out === null, "a claim while a workflow is still running waits for it: nothing runs", show(h));
  const now = await node([join(dir, ".offthemode/stop-check.mjs"), "--now"], dir);
  expect(now.code === 1 && now.stdout.includes("Not done yet:") && now.stdout.includes("failed (exit 3"), "--now runs the same checks by hand and exits 1 when they don't show it done", now.stdout + now.stderr);
}

async function ruleChecks() {
  const dir = project("rules", { commands: "check `node pass.mjs` · rule checks `node old-rule.mjs`" });
  let h = await hook(dir);
  expect(h.back.includes("`node old-rule.mjs` printed no line in the form RULE \"<your words>\": broke B · judged J of N"), "a rule check that prints no \"judged J of N\" line is flagged (the check:bonus case)", show(h));

  const t = join(BASE, "transcripts");
  mkdirSync(t, { recursive: true });
  const transcript = join(t, "session.jsonl");
  writeFileSync(transcript, [
    { type: "user", message: { role: "user", content: `look, ${OWNER}. keep them on their edition` } },
    { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: `I'll write "${REWORDED}" into PRODUCT.md.` }] } },
    { type: "user", message: { role: "user", content: [{ type: "tool_result", content: `PRODUCT.md: ${REWORDED}` }] } },
  ].map((e) => JSON.stringify(e)).join("\n") + "\n");
  const words = project("words", { commands: "check `node pass.mjs` · rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  edit(words, "rule.json", JSON.stringify({ quote: REWORDED, broke: 0, judged: 5, of: 5, unit: "moves" }));
  h = await hook(words, { transcript_path: transcript });
  expect(h.back.includes(`RULE "${REWORDED}" isn't word for word in .offthemode/PRODUCT.md`) && h.back.includes(`No rule check printed a RULE line for your rule "${OWNER}"`) && h.back.includes(`"${REWORDED}" isn't in any message you sent`) && !h.back.includes(`"${OWNER}" isn't in any message`),
    "a RULE line whose words differ from PRODUCT.md is flagged, and only the owner's own messages count as their words", show(h));
  edit(words, "rule.json", JSON.stringify({ quote: OWNER, broke: 15, judged: 870, of: 1690, unit: "edition families" }));
  h = await hook(words, { transcript_path: transcript });
  expect(h.back.includes("15 edition families break your rule") && h.back.includes("820 of 1,690 edition families weren't judged") && h.back.includes("is counted in edition families here, but PRODUCT.md counts it in moves"),
    "breaks, cases not judged, and a unit that differs from PRODUCT.md are each flagged", show(h));
  edit(words, "rule.json", JSON.stringify({ quote: OWNER, broke: 0, judged: 1690, of: 1690, unit: "moves" }));
  h = await hook(words, { transcript_path: transcript });
  expect(!h.back && h.shown.includes("All passed.") && h.shown.includes(`RULE "${OWNER}": broke 0 · judged 1690 of 1690 moves`), "a rule check that judges every case and finds no break passes, and the owner sees its line", show(h));
  edit(words, ".offthemode/PRODUCT.md", `PRODUCT · words\n\n## Refusals and tie-breakers\n${ownerLine(REWORDED)}\n`);
  edit(words, "rule.json", JSON.stringify({ quote: REWORDED, broke: 0, judged: 1690, of: 1690, unit: "moves" }));
  h = await hook(words, { transcript_path: transcript });
  expect(h.back.includes(`Your rule "${OWNER}" (first seen`) && h.back.includes("is no longer in PRODUCT.md") && h.back.includes(`"${REWORDED}" isn't in any message you sent`),
    "a fixer who rewords the rule in PRODUCT.md and the check together is caught: the old words are gone, the new ones aren't the owner's", show(h));
}

async function screensAndShapes() {
  const dir = project("screens", { commands: "check `node pass.mjs` · screen checks `node screen.mjs` · rule checks `node rule.mjs; echo ok`" });
  const h = await hook(dir);
  expect(h.back.includes('2 rows on "/fix" are wrong') && h.back.includes('2 of 10 rows on "/fix" weren\'t checked') && h.back.includes("`node rule.mjs; echo ok` didn't run: only a plain command"),
    "a screen check's wrong and unchecked rows are flagged; a command that isn't plain is shown, never run", show(h));
}

async function hangingCheck() {
  const dir = project("hanging", { commands: "check `node hang.mjs` · rule checks `node rule.mjs`", budgets: '"stop_check_seconds": 1' });
  const h = await hook(dir);
  await new Promise((ok) => setTimeout(ok, 300));
  const pids = ran(dir, "pids").split(" ").filter(Boolean).map(Number);
  const alive = pids.filter((pid) => { try { process.kill(pid, 0); return true; } catch { return false; } });
  expect(h.ms < 8000 && h.back.includes("`node hang.mjs` didn't finish in 1 s, so it judged nothing") && h.back.includes("`node rule.mjs` didn't run: the checks used all their time"),
    `a hanging check is stopped at stop_check_seconds and reported as judging nothing (${h.ms} ms)`, show(h));
  expect(pids.length === 2 && !alive.length, "the hung check and the process it started are both gone afterwards", `pids ${pids} alive ${alive}`);
}

async function writesOnlyState() {
  const dir = project("quiet", { commands: "check `node pass.mjs` · rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const snap = () => {
    const files = (d) => readdirSync(d).flatMap((f) => (f === ".git" ? [] : statSync(join(d, f)).isDirectory() ? files(join(d, f)) : [join(d, f)]));
    return files(dir).map((f) => `${relative(dir, f)}:${statSync(f).mtimeMs}:${createHash("sha256").update(readFileSync(f)).digest("hex")}`).sort().join("\n");
  };
  const gitFiles = () => readdirSync(join(dir, ".git")).sort().join(",");
  const before = snap(), gitBefore = gitFiles();
  const h = await hook(dir);
  expect(snap() === before && gitFiles() === [...gitBefore.split(","), "offthemode-stop.json"].sort().join(",") && h.shown.includes("All passed."),
    "it writes nothing in the project but its own state file in .git/", show(h));
  const none = project("nothing", { commands: "check `{{?CHECK_CMD}}` · evals `none`" });
  const first = await hook(none), second = await hook(none);
  expect(first.shown.includes("found nothing to run") && second.out === null, "with no check named it says so once, then stays quiet", show(first) + show(second));
}

parts();
await Promise.all([failingCheck(), ruleChecks(), screensAndShapes(), hangingCheck(), writesOnlyState()]);
rmSync(BASE, { recursive: true, force: true });
for (const f of failed) console.error(f);
console.log(`test-stop-check: ${passed} passed${failed.length ? `, ${failed.length} failed` : ""}`);
process.exit(failed.length ? 1 : 0);
