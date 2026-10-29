// Tests the stop check (content/templates/stop-check.mjs) the way Claude Code runs it: a Stop hook input on stdin, in
// throwaway git projects whose RULES.md names small check scripts. Prints only what failed, then one summary line.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, existsSync, readdirSync, statSync, copyFileSync, rmSync, realpathSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = join(ROOT, "content/templates/stop-check.mjs");
const SOURCE = readFileSync(SCRIPT, "utf8");
const { readReply, parseCommands, parseLines, productRules, productScreens, budget } = await import(SCRIPT);
const BASE = mkdtempSync(join(tmpdir(), "otm-stop-check-"));
const OUT = join(BASE, "outside");
mkdirSync(OUT);
let passed = 0;
const failed = [], pidFiles = [];
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
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
  "lab.mjs": "console.log('SCREEN \"/lab/fix/[state]\": wrong 0 · checked 10 of 10 rows');",
  "hang.mjs": `${here} import { spawn } from 'node:child_process'; const kid = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' }); appendFileSync(tag + '.pids', process.pid + ' ' + kid.pid); setInterval(() => {}, 1000);`,
};

const git = (dir, ...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", ...args], { cwd: dir, stdio: "ignore" });
function project(name, { commands, product = "", budgets = "", noGit = false }) {
  const dir = join(BASE, name);
  mkdirSync(join(dir, ".offthemode"), { recursive: true });
  writeFileSync(join(dir, ".offthemode/RULES.md"), `RULES · ${name}\n\n## Budgets\n\`\`\`json\n{ ${budgets} }\n\`\`\`\n\n## Commands (fill once the toolchain exists)\n${commands}\n\n## Done means verified\nChecks pass.\n`);
  writeFileSync(join(dir, ".offthemode/PRODUCT.md"), `PRODUCT · ${name}\n\n## Refusals and tie-breakers\n${product}\n`);
  for (const [f, text] of Object.entries(CHECKS)) writeFileSync(join(dir, f), text);
  copyFileSync(SCRIPT, join(dir, ".offthemode/stop-check.mjs"));
  if (noGit) return dir;
  git(dir, "init", "-q");
  git(dir, "add", "-A");
  git(dir, "commit", "-qm", "start");
  return dir;
}
const ownerLine = (quote, unit = "moves") => `- Owner's rule (2026-10-27): "${quote}" · counted in ${unit} · rule check \`node rule.mjs\``;
const edit = (dir, f, text) => writeFileSync(join(dir, f), text);
const ran = (dir, what = "count") => {
  const f = join(OUT, `${basename(dir)}.${what}`);
  if (what === "pids") pidFiles.push(f);
  return existsSync(f) ? readFileSync(f, "utf8") : "";
};
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
  const r = await node([join(dir, ".offthemode/stop-check.mjs")], dir, JSON.stringify({ hook_event_name: "Stop", session_id: "s1", cwd: dir, stop_hook_active: false, last_assistant_message: DONE, ...input }));
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
  // Owner checkpoints and replies that wait. Two the backtest found sent back (core-checks/backtest.md, scenario d); the
  // rest are shapes of the real replies wrongly read as claims in the hand-labelled set (core-checks/fixes/labels.txt),
  // reworded, since the real ones hold the owners' project text.
  for (const t of [CHECKPOINT, "Setup is finished and pushed. Shall I start step 1?", "Step 2 is done. As you asked, I stopped after step 2 so you can review it.", "Step 2 is done. Per your instructions, I'm pausing here for review.",
    "Pushed (`abc1234`). I'm waiting for the deploy, then I'll run the live test.", "The data is ready. Waiting on the review and the build checks.", "Setup is done apart from the checklist. I need two answers from you.",
    "Piece 1 is done, with all tests passing. Piece 2 is building in the background.", "All fixed, and the tests pass.\n\n**Commit and push now?** I recommend yes.", "The diagnostic is live. Please try once more, then tell me once you've tried.", "Step 2 is done. Over to you for review."]) {
    expect(readReply(t) === "checkpoint", `readReply · a checkpoint: ${t}`, readReply(t));
  }

  const cmds = parseCommands("## Commands (x)\ncheck `npm run check` · full check `npm run check && npm run build` · run `npm run dev` · rule checks `npm run check:bonus` (reads saved answers; `npm run fetch:mb` refreshes them) · screen checks `npx playwright test e2e/fix.spec.ts` · evals `none`\n\n## Done means verified\n");
  expect(JSON.stringify(cmds.map((c) => [c.kind, c.cmd, c.plain])) === JSON.stringify([["check", "npm run check", true], ["rule", "npm run check:bonus", true], ["screen", "npx playwright test e2e/fix.spec.ts", true]]),
    "parseCommands · runs check, rule checks and screen checks only, never a command inside a (note)", JSON.stringify(cmds));
  const odd = parseCommands("## Commands\ncheck `npm test; rm -rf /` · rule checks `git push` `node a.mjs && node b.mjs` `{{?RULE_CMDS}}` · screen checks `$(curl x)`\n");
  expect(JSON.stringify(odd.map((c) => c.plain)) === "[false,false,true,false]", "parseCommands · only plain commands (words joined by &&) run; a placeholder is skipped", JSON.stringify(odd));

  // The templates as setup writes them: unfilled placeholders are never run or taken for the owner's words.
  const tpl = (name) => readFileSync(join(ROOT, "content/templates", name), "utf8");
  expect(parseCommands(tpl("RULES.md")).length === 0 && productRules(tpl("PRODUCT.md")).length === 0 && productScreens(tpl("PRODUCT.md")).length === 0,
    "templates · RULES.md §Commands and PRODUCT.md's owner's-rule and screen check lines, unfilled, give no check, rule or screen", JSON.stringify([parseCommands(tpl("RULES.md")), productRules(tpl("PRODUCT.md"))]));
  expect(productRules("- Owner's rules: none yet").length === 0 && productScreens("- Screen checks: none yet").length === 0, "templates · the \"none yet\" lines give no rule and no screen");
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
  expect(budget("## Budgets\n```json\n{ \"stop_check_seconds\": 5000 }\n```\n") === 840 && budget("") === seconds, "stop_check_seconds is capped at 840 s, under the hook's 900 s timeout, so a slow check is reported, never dropped");
  const screens = productScreens("- Screen check: `/fix` · checked by npm run check:fix\n- Screen check: {{?route}} · checked by {{?cmd}}");
  expect(JSON.stringify(screens) === JSON.stringify([{ route: "/fix", by: "npm run check:fix" }]), "productScreens · reads PRODUCT.md's screen check lines, never an unfilled one", JSON.stringify(screens));
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
  expect(!h.back && ran(dir) === "x" && h.shown.includes("No file changed since") && h.shown.includes("failed (exit 1") && h.shown.includes("its run at") && h.shown.includes("Same result as when your AI was last sent back"),
    "no file changed since the last run: the check doesn't run again, its last result is shown, and the stop goes through", show(h));
  edit(dir, ".offthemode/STATE.md", "the notes change every reply");
  h = await hook(dir);
  expect(ran(dir) === "x" && h.shown.includes("No file changed since"), "a change to the notes alone doesn't run the checks again (RULES.md and PRODUCT.md do count)", show(h));
  h = await hook(dir, { session_id: "s2" });
  expect(h.back.includes("failed (exit 1)") && ran(dir) === "x", "a new session claiming done on the same failing result is sent back once, from the saved result", show(h));
  edit(dir, "notes.txt", "a change that fixes nothing");
  h = await hook(dir);
  expect(!h.back && h.shown.includes("Same result as when your AI was last sent back") && ran(dir) === "xx", "the same numbers again in a session are shown and the stop goes through", show(h));
  edit(dir, "fail.txt", "2");
  h = await hook(dir, { stop_hook_active: true });
  expect(!h.back && h.shown.includes("failed (exit 2") && h.shown.includes("already sent back once"), "stop_hook_active: new numbers are shown, never sent back, so it can't loop", show(h));
  edit(dir, "notes.txt", "another change");
  h = await hook(dir);
  expect(h.back.includes("failed (exit 2)"), "...and the same new numbers on a later claim do send back once", show(h));
  edit(dir, "fail.txt", "3");
  h = await hook(dir, { last_assistant_message: CHECKPOINT });
  expect(!h.back && ran(dir) === "xxxx" && h.shown.includes("only the rule checks run") && h.shown.includes("failed (exit 2") && h.shown.includes("stopped for your answer") && h.shown.includes("your AI's reply says some work is done"),
    "a reply that stops for the owner (a checkpoint) reruns only the rule checks, shows the rest as they last ran, and is never sent back", show(h));
  h = await hook(dir, { background_tasks: [{ id: "a", type: "workflow", status: "running" }] });
  expect(h.out === null, "a claim while a workflow is still running waits for it: nothing runs", show(h));
  const now = await node([join(dir, ".offthemode/stop-check.mjs"), "--now"], dir);
  expect(now.code === 1 && now.stdout.includes("Not done yet:") && now.stdout.includes("failed (exit 3"), "--now runs the same checks by hand and exits 1 when they don't show it done", now.stdout + now.stderr);
  h = await hook(dir);
  expect(ran(dir) === "xxxxx" && h.shown.includes("No file changed since") && h.back.includes("failed (exit 3)"),
    "--now saves its result, so the claim after it shows that result instead of running the check twice, and still sends back", show(h));
}

async function passThenFail() {
  const dir = project("again", { commands: "check `node fail.mjs`" });
  const first = await hook(dir);
  edit(dir, "fail.txt", "0");
  const clean = await hook(dir);
  edit(dir, "fail.txt", "1");
  const h = await hook(dir);
  expect(first.back.includes("failed (exit 1)") && !clean.back && clean.shown.includes("The checks passed. No rule of yours is checked") && h.back.includes("failed (exit 1)"),
    "fail, pass, then the same failure again: sent back again, since a clean run forgets the last send-back; with no rule named it never says \"All passed\"", show(first) + show(clean) + show(h));
}

async function otherProject() {
  const home = project("home", { commands: "check `node count.mjs`" }), other = project("other-clone", { commands: "check `node count.mjs`" });
  const h = await hook(home, { cwd: other });
  expect(h.shown.includes("ran nothing") && ran(other) === "" && ran(home) === "", "when the AI works in another project with notes, none of that project's commands run", show(h));
  const tree = join(BASE, "home-tree");
  git(home, "worktree", "add", "-q", tree);
  const w = await hook(home, { cwd: tree });
  expect(ran(tree) === "x" && w.shown.includes("Off the Mode checked"), "a worktree of the same repository is checked where the AI works", show(w));
}

async function cancelled() {
  if (process.platform === "win32") return; // no process groups on Windows; the script kills the tree only while it runs
  await Promise.all(["SIGTERM", "SIGKILL"].map(async (sig) => {
    const dir = project(`cancel-${sig}`, { commands: "check `node hang.mjs`" });
    const child = spawn(process.execPath, [join(dir, ".offthemode/stop-check.mjs")], { cwd: dir, env: { ...process.env, OTM_TEST_OUT: OUT, CLAUDE_PROJECT_DIR: dir }, stdio: ["pipe", "ignore", "ignore"] });
    child.stdin.end(JSON.stringify({ hook_event_name: "Stop", session_id: "s1", cwd: dir, last_assistant_message: DONE }));
    for (let i = 0; i < 200 && ran(dir, "pids").split(" ").filter(Boolean).length < 2; i++) await sleep(50);
    child.kill(sig);
    await sleep(sig === "SIGKILL" ? 1200 : 400);
    const pids = ran(dir, "pids").split(" ").filter(Boolean).map(Number);
    expect(pids.length === 2 && !pids.some(alive), `a hook stopped with ${sig} mid-check (Esc, or the hook's timeout) leaves nothing of the check running`, `pids ${pids} alive ${pids.filter(alive)}`);
  }));
}

async function cutState() {
  const dir = project("cut", { commands: "check `node pass.mjs`" });
  writeFileSync(stateFile(dir), '{"rules":{');
  const h = await hook(dir), again = await hook(dir);
  expect(h.shown.includes("couldn't be read, so it started fresh") && h.shown.includes("The checks passed") && !again.shown.includes("couldn't be read") && again.shown.includes("No file changed since"),
    "a cut-short state file starts fresh with a note, and the next stop reads the new one", show(h) + show(again));
  const loose = project("plain-folder", { commands: "check `node count.mjs`", noGit: true });
  const a = await hook(loose), b = await hook(loose);
  rmSync(join(tmpdir(), `offthemode-stop-${createHash("sha256").update(realpathSync(loose)).digest("hex").slice(0, 12)}.json`), { force: true });
  expect(ran(loose) === "xx" && a.shown.includes("The checks passed") && b.shown.includes("The checks passed"), "outside git it works the same, and every claim runs the checks", show(a) + show(b));
}

async function ruleChecks() {
  const dir = project("rules", { commands: "check `node pass.mjs` · rule checks `node old-rule.mjs`" });
  let h = await hook(dir);
  expect(h.shown.includes("`node old-rule.mjs` doesn't say how many of your cases it judged, so nothing shows your rule holds") && !h.shown.includes("judged J of N") && h.back.includes('Each rule check prints RULE "<your words>": broke B · judged J of N'),
    "a rule check that prints no \"judged J of N\" line is flagged (the check:bonus case): plain words to the owner, the line's form only to the AI", show(h));

  const t = join(BASE, "transcripts");
  mkdirSync(t, { recursive: true });
  const transcript = join(t, "session.jsonl");
  writeFileSync(transcript, [
    { type: "user", message: { role: "user", content: `look, ${OWNER}. keep them on their edition` } },
    { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: `I'll write "${REWORDED}" into PRODUCT.md.` }] } },
    { type: "user", message: { role: "user", content: [{ type: "tool_result", content: `PRODUCT.md: ${REWORDED}` }] } },
    // A workflow's report and a reminder are filed as user lines too (the lasscrobits run's reworded rule came back this
    // way). One is caught by its origin, one by its tags, so each guard is needed.
    { type: "user", origin: { kind: "task-notification" }, promptSource: "system", message: { role: "user", content: `Result: PRODUCT.md now says "${REWORDED}".` } },
    { type: "user", message: { role: "user", content: `<task-notification>\n<result>PRODUCT.md: "${REWORDED}"</result>\n</task-notification>` } },
    { type: "user", origin: { kind: "human" }, message: { role: "user", content: `<system-reminder>PRODUCT.md: ${REWORDED}</system-reminder>\ngo on` } },
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
  expect(h.back.includes(`Your rule "${OWNER}" (first seen`) && h.back.includes("is no longer in PRODUCT.md") && h.shown.includes(`"${REWORDED}" isn't in any message you sent: say the rule once in chat`) && !h.back.includes(`"${REWORDED}" isn't in any message`),
    "a fixer who rewords the rule in PRODUCT.md and the check together is caught; words already flagged once come back as a note, not a send-back", show(h));
}

async function screensAndShapes() {
  const dir = project("screens", { commands: "check `node pass.mjs` · screen checks `node screen.mjs` `node lab.mjs` · rule checks `node rule.mjs; echo ok`", product: "- Screen check: /queue · checked by node queue.mjs" });
  const h = await hook(dir);
  expect(h.back.includes('2 rows on "/fix" are wrong') && h.back.includes('2 of 10 rows on "/fix" weren\'t checked') && h.back.includes("`node rule.mjs; echo ok` didn't run: only a plain command"),
    "a screen check's wrong and unchecked rows are flagged; a command that isn't plain is shown, never run", show(h));
  expect(h.back.includes('"/lab/fix/[state]" is a lab or gallery page') && h.back.includes("No screen check printed a SCREEN line for /queue"),
    "a SCREEN line from a lab page is flagged, and so is a screen PRODUCT.md names that no screen check printed", show(h));
}

async function hangingCheck() {
  const dir = project("hanging", { commands: "check `node hang.mjs` · rule checks `node rule.mjs`", budgets: '"stop_check_seconds": 1' });
  const h = await hook(dir);
  await new Promise((ok) => setTimeout(ok, 300));
  const pids = ran(dir, "pids").split(" ").filter(Boolean).map(Number);
  expect(h.ms < 8000 && h.back.includes("`node hang.mjs` didn't finish in 1 s, so it judged nothing") && h.back.includes("`node rule.mjs` didn't run: the checks used all their time"),
    `a hanging check is stopped at stop_check_seconds and reported as judging nothing (${h.ms} ms)`, show(h));
  expect(pids.length === 2 && !pids.some(alive), "the hung check and the process it started are both gone afterwards", `pids ${pids} alive ${pids.filter(alive)}`);
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
try {
  await Promise.all([failingCheck(), passThenFail(), otherProject(), cancelled(), cutState(), ruleChecks(), screensAndShapes(), hangingCheck(), writesOnlyState()]);
} finally {
  // A check a failed test left running never outlives the test.
  for (const pid of pidFiles.flatMap((f) => (existsSync(f) ? readFileSync(f, "utf8").split(" ").filter(Boolean).map(Number) : []))) { try { process.kill(pid, "SIGKILL"); } catch { /* gone */ } }
  rmSync(BASE, { recursive: true, force: true });
}
for (const f of failed) console.error(f);
console.log(`test-stop-check: ${passed} passed${failed.length ? `, ${failed.length} failed` : ""}`);
process.exit(failed.length ? 1 : 0);
