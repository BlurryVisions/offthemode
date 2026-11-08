// Tests the stop check (content/templates/stop-check.mjs) the way Claude Code runs it: a Stop hook input on stdin, in
// throwaway git projects whose RULES.md names small check scripts (scripts/stop-check-harness.mjs). What counts as a
// change is in stop-check-git-cases.mjs. Prints only what failed, then one summary line.
import { writeFileSync, readFileSync, existsSync, readdirSync, statSync, rmSync, realpathSync, mkdirSync, utimesSync, openSync, closeSync, chmodSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { ROOT, SCRIPT, SOURCE, BASE, OUT, sleep, survivors, expect, DONE, CHECKPOINT, PLAN, OWNER, REWORDED, git, project, ownerLine, edit, ran, stateFile, node, hook, now, show, finish } from "./stop-check-harness.mjs";
import { gitCases } from "./stop-check-git-cases.mjs";

const { readReply, parseCommands, parseLines, productRules, productScreens, budget, norm } = await import(pathToFileURL(SCRIPT).href);

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
  // Pushes, deletes and deploys never run by themselves, however they are spelled: git's options before its command,
  // another letter case (macOS and Windows find the program anyway), Windows names, a path, or a command that runs one.
  const never = ["git -C . push", "git --no-pager push origin main", "git -c a=b push", "Git push", "GIT PUSH", "git.exe push", "/usr/bin/git push", "Del /q x", "DEL x", "RMDIR /s /q x", "rd /s /q build", "erase /q x",
    "cmd /c rd /s /q x", "powershell Remove-Item -Recurse -Force build", "env rm -rf dist", "/bin/rm -rf x", "npx rimraf dist", "npx vercel deploy", "npm.cmd publish", "node a.mjs && git push", "node a.mjs %PATH%"];
  const fine = ["npm test", "npx tsc --noEmit", "git diff --exit-code", "git -C sub status", "node scripts/rm-cache.mjs", "node scripts/check-push.mjs", "npx playwright test --grep push", "node a.mjs && git -c core.quotePath=false diff --exit-code"];
  const run = (cmds) => parseCommands(`## Commands\ncheck ${cmds.map((c) => `\`${c}\``).join(" ")}\n`).filter((c) => c.plain).map((c) => c.cmd);
  expect(run(never).length === 0 && run(fine).length === fine.length, "parseCommands · a push, delete or deploy never runs, however it is spelled, nor a %NAME% cmd.exe would expand; ordinary checks still run", `ran: ${run(never)} · didn't run: ${fine.filter((c) => !run(fine).includes(c))}`);

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
  expect(ran(dir) === "x" && h.shown.includes("(STATE.md, DECISIONS.md, CHECKLIST.md, REASSESS.md and files git ignores don't count), so the checks show their last run."),
    "a change to STATE.md alone doesn't run the checks again, and with no rule check named the owner isn't told one ran", show(h));
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
  expect(!h.back && ran(dir) === "xxxx" && h.shown.includes("At a stop for your review the checks show their last run.") && h.shown.includes("failed (exit 2") && h.shown.includes("stopped for your answer") && h.shown.includes("your AI's reply says some work is done"),
    "a reply that stops for the owner (a checkpoint) reruns only the rule checks (none here), shows the rest as they last ran, and is never sent back", show(h));
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

// On Windows both signals end the hook outright, and Windows ends the check's shell with it but not what runs under it.
async function cancelled() {
  await Promise.all(["SIGTERM", "SIGKILL"].map(async (sig) => {
    const dir = project(`cancel-${sig}`, { commands: "check `node hang.mjs`" });
    const input = join(BASE, `cancel-${sig}.json`); // a file, so the input ends at once (see node() in the harness)
    writeFileSync(input, JSON.stringify({ hook_event_name: "Stop", session_id: "s1", cwd: dir, last_assistant_message: DONE }));
    const fd = openSync(input, "r");
    const child = spawn(process.execPath, [join(dir, ".offthemode/stop-check.mjs")], { cwd: dir, env: { ...process.env, OTM_TEST_OUT: OUT, CLAUDE_PROJECT_DIR: dir }, stdio: [fd, "ignore", "ignore"] });
    closeSync(fd);
    for (let i = 0; i < 200 && ran(dir, "pids").split(" ").filter(Boolean).length < 3; i++) await sleep(50);
    child.kill(sig);
    const pids = ran(dir, "pids").split(" ").filter(Boolean).map(Number), left = await survivors(pids);
    expect(pids.length === 3 && !left.length, `a hook stopped with ${sig} mid-check (Esc, or the hook's timeout) leaves nothing of the check running, even in a group of its own`, `pids ${pids} alive ${left}`);
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

// A fixer who rewords the rule right after a send-back does it in the turn that follows, whose stop has stop_hook_active.
async function rewordAfterSendBack() {
  const t = join(BASE, "transcripts-reword"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: OWNER } }) + "\n");
  const dir = project("reword", { commands: "rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  edit(dir, "rule.json", JSON.stringify({ quote: OWNER, broke: 15, judged: 870, of: 870, unit: "moves" }));
  const first = await hook(dir, { transcript_path });
  edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · reword\n\n## Refusals and tie-breakers\n${ownerLine(REWORDED)}\n`);
  edit(dir, "rule.json", JSON.stringify({ quote: REWORDED, broke: 0, judged: 870, of: 870, unit: "moves" }));
  const inTurn = await hook(dir, { transcript_path, stop_hook_active: true });
  expect(first.back.includes("15 moves break your rule") && !inTurn.back && inTurn.shown.includes("is no longer in PRODUCT.md") && inTurn.shown.includes(`"${REWORDED}" isn't in any message you sent, so it may not be your words`),
    "sent back, then the rule reworded in PRODUCT.md and the check in the same turn: shown to the owner, not sent back (stop_hook_active)", show(first) + show(inTurn));
  const next = await hook(dir, { transcript_path });
  expect(next.back.includes(`Your rule "${OWNER}" (first seen`) && next.back.includes(`"${REWORDED}" isn't in any message you sent, so it may not be your words`),
    "...and the next claim sends the AI back with both lines, since they never reached it", show(next));
  const after = await hook(dir, { transcript_path });
  expect(!after.back && after.shown.includes("All passed.") && after.shown.includes("say the rule once in chat"), "...once they reached it, the reword is a note and the claim goes through", show(after));
  // A send-back is cut to fit. A line said only once goes first, so a long list never pushes it off; one cut off anyway
  // (too many of them) never reached the AI, so it isn't marked as said.
  const noisy = project("reword-cut", { commands: "rule checks `node noisy.mjs`", product: ownerLine(REWORDED) });
  const cut = await hook(noisy, { transcript_path });
  const flagged = JSON.parse(readFileSync(stateFile(noisy), "utf8")).rules[norm(REWORDED)]?.flagged;
  expect(cut.back.includes("(cut to fit)") && cut.back.includes(`"${REWORDED}" isn't in any message you sent`) && cut.shown.includes(`"${REWORDED}" isn't in any message you sent`) && flagged,
    "a send-back cut to fit still carries the line said only once, which goes first, and so does the owner's message", `flagged ${flagged}`);
  const cutAgain = await hook(noisy, { transcript_path });
  expect(cutAgain.shown.includes("Off the Mode checked") && !cutAgain.back, "...and the same result on the next claim isn't sent back again", show(cutAgain));
  const words = (i) => `words of rule number ${i} that nobody said`, many = project("reword-many", { commands: "rule checks `node many.mjs`" });
  edit(many, "many.mjs", `for (let i = 0; i < 150; i++) console.log(\`RULE "words of rule number \${i} that nobody said": broke 0 · judged 1 of 1 moves\`);`);
  const most = await hook(many, { transcript_path }), rules = JSON.parse(readFileSync(stateFile(many), "utf8")).rules;
  expect(most.back.includes("(cut to fit)") && most.back.includes(`"${words(0)}" isn't in any message`) && rules[norm(words(0))]?.flagged && !most.back.includes(`"${words(149)}" isn't in any message`) && rules[norm(words(149))]?.flagged === undefined,
    "a line cut off the send-back isn't marked as said", JSON.stringify(rules[norm(words(149))]));
  const mostAgain = await hook(many, { transcript_path });
  expect(mostAgain.shown.includes("Off the Mode checked") && !mostAgain.back, "...and the same failure on the next claim isn't sent back again for the lines it delivered", show(mostAgain));
}

// --now's output reaches the AI, so a line said only once counts as said there.
async function nowMarks() {
  const dir = project("now-marks", { commands: "rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  await hook(dir);
  edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · now-marks\n\n## Refusals and tie-breakers\n${ownerLine(REWORDED)}\n`);
  edit(dir, "rule.json", JSON.stringify({ quote: REWORDED, broke: 0, judged: 5, of: 5, unit: "moves" }));
  const now = await node([join(dir, ".offthemode/stop-check.mjs"), "--now"], dir);
  const h = await hook(dir);
  expect(now.code === 1 && now.stdout.includes("is no longer in PRODUCT.md") && !h.shown.includes("is no longer in PRODUCT.md") && !h.back,
    "a reworded rule --now showed isn't sent back again on the next claim", now.stdout + show(h));
}

async function staleAtCheckpoint() {
  const dir = project("stale", { commands: "check `node fail.mjs` · rule checks `node rule.mjs` · screen checks `node screen-ok.mjs`", product: `${ownerLine(OWNER)}\n- Screen check: /queue · checked by node screen-ok.mjs` });
  edit(dir, "fail.txt", "0");
  const first = await hook(dir, { last_assistant_message: CHECKPOINT });
  expect(first.shown.includes("The rule checks passed, but `node fail.mjs` hasn't run yet; `node screen-ok.mjs` hasn't run yet.") && !first.shown.includes("All passed") && !first.shown.includes("No screen check printed"),
    "the first stop is a checkpoint: the checks that never ran aren't called passed, and a screen whose check hasn't run isn't flagged", show(first));
  const claim = await hook(dir), same = await hook(dir);
  expect(claim.shown.includes("All passed.") && same.shown.includes("No file changed since") && same.shown.includes("All passed."), "a claim runs them all; with no file changed since, their last run still counts as passed", show(claim) + show(same));
  edit(dir, "fail.txt", "1");
  const h = await hook(dir, { last_assistant_message: CHECKPOINT });
  expect(h.shown.includes("before the latest changes)") && h.shown.includes("The rule checks passed, but `node fail.mjs` last ran at") && !h.shown.includes("All passed"),
    "a checkpoint after the code changed shows the last run as from before the changes, never \"All passed\"", show(h));
  const plain = project("stale-plain", { commands: "check `node pass.mjs`" });
  const p = await hook(plain, { last_assistant_message: CHECKPOINT });
  expect(p.shown.includes("No check failed, but `node pass.mjs` hasn't run yet. No rule of yours is checked") && !p.shown.includes("The checks passed"), "...and with no rule named, it never says \"The checks passed\" for a check that didn't run", show(p));
  const loose = project("stale-loose", { commands: "check `node pass.mjs`", noGit: true });
  await hook(loose);
  const l = await hook(loose, { last_assistant_message: CHECKPOINT });
  rmSync(join(tmpdir(), `offthemode-stop-${createHash("sha256").update(realpathSync(loose)).digest("hex").slice(0, 12)}.json`), { force: true });
  expect(l.shown.includes("last ran at") && l.shown.includes("perhaps before the latest changes"), "outside git, where it can't tell, a checkpoint says the last run is perhaps from before the latest changes", show(l));
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
  const dir = project("hanging", { commands: "check `node hang.mjs` · rule checks `node rule.mjs`", budgets: '"stop_check_seconds": 3' }); // time for node to start the check on a busy machine
  const h = await hook(dir);
  const pids = ran(dir, "pids").split(" ").filter(Boolean).map(Number), left = await survivors(pids);
  // Timed on the check's own run: the whole stop also starts node and git several times, slow on a busy Windows runner.
  const kept = JSON.parse(readFileSync(stateFile(dir), "utf8")).results?.["node hang.mjs"];
  expect(kept?.timedOut && kept.ms < 6000 && h.ms < 25000 && h.back.includes("`node hang.mjs` didn't finish in 3 s, so it judged nothing") && h.back.includes("`node rule.mjs` didn't run: the checks used all their time"),
    `a hanging check is stopped at stop_check_seconds and reported as judging nothing (its run ${kept?.ms} ms, the whole stop ${h.ms} ms)`, show(h));
  expect(pids.length === 3 && !left.length, "the hung check and what it started, even in a group of its own, are all gone afterwards", `pids ${pids} alive ${left}`);
  edit(dir, "a.txt", "a change after the hang");
  const later = await hook(dir, { last_assistant_message: CHECKPOINT });
  expect(/`node hang\.mjs`: didn't finish in 3 s, at \d\d:\d\d, before the latest changes/.test(later.shown), "at a checkpoint after a change, a hang from before it says so, as a pass or a failure would", show(later));
}

// The owner's words put back after a reword, then reworded again: the AI's own words never pass for the owner's rule,
// and each removal of the owner's rule is told.
async function rewordTwice() {
  const t = join(BASE, "transcripts-twice"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: OWNER } }) + "\n");
  const dir = project("reword-twice", { commands: "rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const say = (quote) => { edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · reword-twice\n\n## Refusals and tie-breakers\n${ownerLine(quote)}\n`); edit(dir, "rule.json", JSON.stringify({ quote, broke: 0, judged: 5, of: 5, unit: "moves" })); };
  await hook(dir, { transcript_path });
  say(REWORDED);
  const reworded = await hook(dir, { transcript_path });
  say(OWNER);
  const back = await hook(dir, { transcript_path }), still = await hook(dir, { transcript_path });
  say(REWORDED);
  const again = await hook(dir, { transcript_path });
  expect(still.shown.includes("All passed.") && !still.shown.includes("is no longer in PRODUCT.md") && !still.back, "...and at the next stop, with the reword still gone, it isn't told again", show(still));
  expect(reworded.back.includes(`Your rule "${OWNER}"`) && !back.back && back.shown.includes(`"${REWORDED}", which isn't in any message you sent, is no longer in PRODUCT.md.`) && !back.shown.includes(`Your rule "${REWORDED}"`) && back.shown.includes("All passed."),
    "the owner's words put back: the AI's reword isn't called the owner's rule and the AI isn't sent to put it back; the owner is told once", show(reworded) + show(back));
  expect(again.back.includes(`Your rule "${OWNER}" (first seen`) && again.back.includes("is no longer in PRODUCT.md"), "...and reworded a second time, the owner's rule gone is told and sent back again", show(again));
}

// A send-back carrying a line said only once, which the next stop no longer has: the same failure isn't sent back twice.
async function sendBackOnce() {
  const t = join(BASE, "transcripts-once"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: OWNER } }) + "\n");
  const dir = project("once", { commands: "check `node fail.mjs` · rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const first = await hook(dir, { transcript_path });
  edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · once\n\n## Refusals and tie-breakers\n${ownerLine(REWORDED)}\n`);
  edit(dir, "rule.json", JSON.stringify({ quote: REWORDED, broke: 0, judged: 5, of: 5, unit: "moves" }));
  const reworded = await hook(dir, { transcript_path }), same = await hook(dir, { transcript_path });
  expect(first.back.includes("failed (exit 1)") && reworded.back.includes("is no longer in PRODUCT.md") && !same.back && same.shown.includes("Same result as when your AI was last sent back"),
    "after a send-back with a line said once, the next claim on the same failure stops, as the send-back says", show(same));
}

// Where .git/ can't be written (an AI tool's sandbox), the result still shows, and the state goes to the temp folder.
async function readOnlyGit() {
  if (process.platform === "win32" || process.getuid?.() === 0) return; // Windows and root write where a mode says no
  const dir = project("read-only-git", { commands: "check `node fail.mjs`" }), kept = join(tmpdir(), `offthemode-stop-${createHash("sha256").update(realpathSync(dir)).digest("hex").slice(0, 12)}.json`);
  const shut = join(BASE, "read-only-tmp");
  mkdirSync(shut), chmodSync(join(dir, ".git"), 0o555), chmodSync(shut, 0o555);
  try {
    const n = await now(dir), h = await hook(dir), neither = await now(dir, { TMPDIR: shut });
    expect(n.code === 1 && n.stdout.includes("failed (exit 1") && existsSync(kept) && h.back.includes("failed (exit 1)") && !h.shown.includes("couldn't run"),
      "with .git/ read-only, --now still shows the checks' result and exits 1, and a claim is still sent back", n.stdout + n.stderr + show(h));
    expect(neither.code === 1 && neither.stdout.includes("failed (exit 1"), "...and where the temp folder can't be written either, the result still shows", neither.stdout + neither.stderr);
  } finally { chmodSync(join(dir, ".git"), 0o755), chmodSync(shut, 0o755); rmSync(kept, { force: true }); }
}

// A run from another day says the day, not just a time that may read as later today.
async function dayShown() {
  const dir = project("day", { commands: "check `node pass.mjs`" });
  await hook(dir);
  const s = JSON.parse(readFileSync(stateFile(dir), "utf8")), then = Date.now() - 25 * 3600_000;
  s.fullAt = then;
  for (const r of Object.values(s.results)) r.at = then;
  writeFileSync(stateFile(dir), JSON.stringify(s));
  const h = await hook(dir), when = `${new Date(then).toTimeString().slice(0, 5)} on ${new Date(then).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  expect(h.shown.includes(`No file changed since ${when}`) && h.shown.includes(`its run at ${when}`), "a time from another day carries its day", show(h));
}

async function writesOnlyState() {
  const dir = project("quiet", { commands: "check `node pass.mjs` · rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const snap = () => {
    const files = (d) => readdirSync(d).flatMap((f) => (f === ".git" ? [] : statSync(join(d, f)).isDirectory() ? files(join(d, f)) : [join(d, f)]));
    return files(dir).map((f) => `${relative(dir, f)}:${statSync(f).mtimeMs}:${createHash("sha256").update(readFileSync(f)).digest("hex")}`).sort().join("\n");
  };
  const gitFiles = () => readdirSync(join(dir, ".git")).sort().join(",");
  const index = () => { const f = join(dir, ".git/index"); return `${statSync(f).mtimeMs}:${createHash("sha256").update(readFileSync(f)).digest("hex")}`; };
  utimesSync(join(dir, "pass.mjs"), new Date(), new Date(Date.now() + 60_000)); // a touched file git status would refresh the index for
  const before = snap(), gitBefore = gitFiles(), indexBefore = index();
  const h = await hook(dir);
  expect(snap() === before && gitFiles() === [...gitBefore.split(","), "offthemode-stop.json"].sort().join(",") && index() === indexBefore && h.shown.includes("All passed."),
    "it writes nothing in the project but its own state file in .git/, and never rewrites git's index", show(h));
  const none = project("nothing", { commands: "check `{{?CHECK_CMD}}` · evals `none`" });
  const first = await hook(none), second = await hook(none);
  expect(first.shown.includes("found nothing to run") && second.out === null, "with no check named it says so once, then stays quiet", show(first) + show(second));
}

// Asked to stop first, a check cut off at its time can tidy up, as Playwright closes its browser and removes its profile.
async function tidyStop() {
  if (process.platform === "win32") return; // Windows ends a process outright: it has no SIGTERM
  const dir = project("tidy", { commands: "check `node tidy.mjs`", budgets: '"stop_check_seconds": 3' });
  const h = await hook(dir);
  expect(ran(dir, "tidy") === "x" && h.back.includes("`node tidy.mjs` didn't finish in 3 s"), "a check cut off at its time is asked to stop first, so it can tidy up", show(h));
}

// What a check leaves running when it ends is stopped too, even a process deaf to the first request.
async function leftovers() {
  const dir = project("leftover", { commands: "check `node leave.mjs`" });
  const h = await hook(dir);
  const pids = ran(dir, "pids").split(" ").filter(Boolean).map(Number), left = await survivors(pids, 5000);
  expect(pids.length === 2 && !left.length && h.shown.includes("The checks passed"), "what a check leaves running when it ends is stopped, even a process that ignores SIGTERM", `pids ${pids} alive ${left} · ${show(h)}`);
}

// An owner's rule the check can't find in this folder's transcripts (said in another tool, or in a session Claude Code
// has since cleaned up), dropped by the AI with its rule check after the "may not be your words" send-back: still told.
async function unfoundRuleDropped() {
  const t = join(BASE, "transcripts-unfound"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: "please fix the queue page" } }) + "\n");
  const dir = project("unfound", { commands: "check `node pass.mjs` · rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const first = await hook(dir, { transcript_path });
  edit(dir, ".offthemode/PRODUCT.md", "PRODUCT · unfound\n\n## Refusals and tie-breakers\n- Owner's rules: none yet\n");
  edit(dir, ".offthemode/RULES.md", "RULES · unfound\n\n## Budgets\n```json\n{  }\n```\n\n## Commands (fill once the toolchain exists)\ncheck `node pass.mjs`\n\n## Done means verified\nChecks pass.\n");
  const dropped = await hook(dir, { transcript_path });
  expect(first.back.includes("so it may not be your words") && dropped.back.includes(`Your rule "${OWNER}" (first seen`) && dropped.back.includes("is no longer in PRODUCT.md"),
    "an owner's rule found in no transcript, then dropped with its rule check, is still sent back as gone", show(first) + show(dropped));
}

// A reword undone after its removal was shown only to the owner (a stop_hook_active stop): the reword leaving is a note.
async function rewordUndoneEarly() {
  const t = join(BASE, "transcripts-early"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: OWNER } }) + "\n");
  const dir = project("undone-early", { commands: "rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const say = (quote) => { edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · undone-early\n\n## Refusals and tie-breakers\n${ownerLine(quote)}\n`); edit(dir, "rule.json", JSON.stringify({ quote, broke: 0, judged: 5, of: 5, unit: "moves" })); };
  await hook(dir, { transcript_path });
  say(REWORDED);
  const inTurn = await hook(dir, { transcript_path, stop_hook_active: true });
  say(OWNER);
  const back = await hook(dir, { transcript_path });
  expect(inTurn.shown.includes(`Your rule "${OWNER}"`) && !back.back && back.shown.includes(`"${REWORDED}", which isn't in any message you sent, is no longer in PRODUCT.md.`) && back.shown.includes("All passed."),
    "the owner's words back after a removal shown only to the owner: the AI's reword leaving is a note, not a send-back", show(inTurn) + show(back));
}

// A rule found in no transcript, reworded by the AI and then put back: the reword leaving is an undo, a note.
async function unfoundRewordUndone() {
  const t = join(BASE, "transcripts-unfound-undone"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: "please fix the queue page" } }) + "\n");
  const dir = project("unfound-undone", { commands: "rule checks `node rule.mjs`", product: ownerLine(OWNER) });
  const say = (quote) => { edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · unfound-undone\n\n## Refusals and tie-breakers\n${ownerLine(quote)}\n`); edit(dir, "rule.json", JSON.stringify({ quote, broke: 0, judged: 5, of: 5, unit: "moves" })); };
  await hook(dir, { transcript_path });
  say(REWORDED);
  const reworded = await hook(dir, { transcript_path });
  say(OWNER);
  const back = await hook(dir, { transcript_path });
  expect(reworded.back.includes(`Your rule "${OWNER}" (first seen`) && !back.back && back.shown.includes(`"${REWORDED}", which isn't in any message you sent, is no longer in PRODUCT.md.`),
    "a rule found in no transcript, reworded, is sent back as gone; put back, the reword leaving is a note", show(reworded) + show(back));
}

// The owner's rule on one branch, and a branch made before it: switching to it and back removes nothing, so the AI is
// sent back about it once, and a later reword of the owner's rule on the first branch is still told.
async function branchSwitch() {
  const t = join(BASE, "transcripts-branches"), transcript_path = join(t, "session.jsonl");
  mkdirSync(t, { recursive: true });
  writeFileSync(transcript_path, JSON.stringify({ type: "user", message: { role: "user", content: OWNER } }) + "\n");
  const dir = project("branches", { commands: "check `node pass.mjs`" });
  git(dir, "branch", "old");
  const say = (quote) => { edit(dir, ".offthemode/PRODUCT.md", `PRODUCT · branches\n\n## Refusals and tie-breakers\n${ownerLine(quote)}\n`); edit(dir, "rule.json", JSON.stringify({ quote, broke: 0, judged: 5, of: 5, unit: "moves" })); };
  say(OWNER);
  edit(dir, ".offthemode/RULES.md", readFileSync(join(dir, ".offthemode/RULES.md"), "utf8").replace("check `node pass.mjs`", "check `node pass.mjs` · rule checks `node rule.mjs`"));
  git(dir, "add", "-A"), git(dir, "commit", "-qm", "the owner's rule");
  const visits = [await hook(dir, { transcript_path })];
  for (const b of ["old", "@{-1}", "old", "@{-1}", "old"]) { git(dir, "checkout", "-q", b); visits.push(await hook(dir, { transcript_path })); }
  const told = visits.filter((h) => h.back.includes("is no longer in PRODUCT.md")).length;
  expect(told === 1, `a branch made before the owner's rule: switching to it and back sends the AI back about the rule once, not on every visit (sent back ${told} times)`, visits.map(show).join("\n"));
  git(dir, "checkout", "-q", "@{-1}");
  say(REWORDED); const first = await hook(dir, { transcript_path });
  say(OWNER); await hook(dir, { transcript_path });
  say(REWORDED); const second = await hook(dir, { transcript_path });
  expect(first.back.includes(`Your rule "${OWNER}" (first seen`) && second.back.includes(`Your rule "${OWNER}" (first seen`), "...and after those visits, each reword of the owner's rule on the first branch is still told and sent back", show(first) + "\n" + show(second));
}

/** Env that loads a module into the hook before the script: it breaks one thing the way a rare system does. */
const preload = (name, code) => { const f = join(BASE, name); writeFileSync(f, code); return { NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --import=${pathToFileURL(f).href}`.trim() }; };
const tempState = (dir) => join(tmpdir(), `offthemode-stop-${createHash("sha256").update(realpathSync(dir)).digest("hex").slice(0, 12)}.json`);

// The state file holds the checks' last lines, and outside git it sits in the temp folder, which on Linux is /tmp,
// shared by every user: only its owner can read it, and a file under its name another user left there isn't trusted.
async function stateGuards() {
  if (process.platform === "win32") return; // no file modes or owners as posix has them
  const dir = project("guarded", { commands: "check `node fail.mjs`", noGit: true }), kept = tempState(dir);
  try {
    const first = await hook(dir), same = await hook(dir), mode = statSync(kept).mode & 0o777;
    const foreign = await hook(dir, {}, preload("other-user.mjs", "process.getuid = () => 4242;"));
    expect(mode === 0o600 && first.back.includes("failed (exit 1)") && !same.back && foreign.back.includes("failed (exit 1)") && foreign.shown.includes("couldn't be read, so it started fresh"),
      `the state file can be read by its owner alone (mode ${mode.toString(8)}), and one owned by another user is ignored`, show(same) + show(foreign));
  } finally { rmSync(kept, { force: true }); }
}

// Where a save to .git/ fails though .git/ looks writable (on Windows, access() doesn't read ACLs), it goes to the temp folder.
async function saveFails() {
  const dir = project("save-fails", { commands: "check `node count.mjs`" }), kept = tempState(dir);
  mkdirSync(stateFile(dir)); // a folder where the state file goes, so renaming it into place fails
  try {
    const first = await hook(dir), second = await hook(dir);
    expect(ran(dir) === "x" && first.shown.includes("The checks passed") && second.shown.includes("No file changed since"), "a save to .git/ that fails goes to the temp folder, and the next stop reads it there", show(first) + show(second));
  } finally { rmSync(kept, { force: true }); }
}

// Node on musl libc (Alpine) without /proc mounted can't run realpath.native: plain realpath does instead.
async function noProc() {
  // musl is Linux, whose disks tell case apart: plain realpath keeps a path as spelled, so where the temp folder is
  // spelled otherwise than on disk (Windows short names, a TMPDIR in another case), it can't match, by design.
  if (process.platform === "win32" || realpathSync.native(BASE) !== realpathSync(BASE)) return;
  const env = preload("no-proc.mjs", 'import fs from "node:fs"; fs.realpathSync.native = () => { throw Object.assign(new Error("no /proc"), { code: "ENOENT" }); };');
  const home = project("no-proc", { commands: "check `node count.mjs`" }), tree = join(BASE, "no-proc-tree");
  git(home, "worktree", "add", "-q", tree);
  const w = await hook(home, { cwd: tree }, env), again = await hook(home, { cwd: tree }, env);
  expect(ran(tree) === "x" && w.shown.includes("Off the Mode checked") && again.shown.includes("No file changed since"), "without realpath.native, a worktree is still checked and an unchanged one still reuses its run", show(w) + show(again));
}

// A watcher that can't start (at the user's process limit) costs the cleanup after a kill, never the stop itself.
async function watcherFails() {
  const env = preload("no-watcher.mjs", 'import cp from "node:child_process"; import { syncBuiltinESMExports } from "node:module"; const real = cp.spawn; cp.spawn = function (cmd, args, ...rest) { return real.call(this, Array.isArray(args) && (args[0] === "-e" || args.includes("--watch")) ? "/nonexistent/otm-no-such-node" : cmd, args, ...rest); }; syncBuiltinESMExports();');
  const dir = project("no-watcher", { commands: "check `node count.mjs`" });
  const h = await hook(dir, {}, env);
  expect(ran(dir) === "x" && h.shown.includes("The checks passed"), "a watcher that can't start doesn't stop the check or its report", show(h) + h.stderr.slice(0, 300));
}

parts();
await finish("test-stop-check", [failingCheck, passThenFail, otherProject, cancelled, cutState, ruleChecks, rewordAfterSendBack, nowMarks, staleAtCheckpoint, screensAndShapes, hangingCheck, writesOnlyState, rewordTwice, sendBackOnce, readOnlyGit, dayShown,
  tidyStop, leftovers, stateGuards, saveFails, noProc, watcherFails, unfoundRuleDropped, rewordUndoneEarly, unfoundRewordUndone, branchSwitch, ...gitCases]);
