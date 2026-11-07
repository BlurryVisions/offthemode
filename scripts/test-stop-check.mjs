// Tests the stop check (content/templates/stop-check.mjs) the way Claude Code runs it: a Stop hook input on stdin, in
// throwaway git projects whose RULES.md names small check scripts (scripts/stop-check-harness.mjs). What counts as a
// change is in stop-check-git-cases.mjs. Prints only what failed, then one summary line.
import { writeFileSync, readFileSync, existsSync, readdirSync, statSync, rmSync, realpathSync, mkdirSync, utimesSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { ROOT, SCRIPT, SOURCE, BASE, OUT, sleep, alive, expect, DONE, CHECKPOINT, PLAN, OWNER, REWORDED, git, project, ownerLine, edit, ran, stateFile, node, hook, show, finish } from "./stop-check-harness.mjs";
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
  // A send-back is cut to fit; a line cut off never reached the AI, so it isn't marked as said.
  const noisy = project("reword-cut", { commands: "rule checks `node noisy.mjs`", product: ownerLine(REWORDED) });
  const cut = await hook(noisy, { transcript_path });
  const flagged = JSON.parse(readFileSync(stateFile(noisy), "utf8")).rules[norm(REWORDED)]?.flagged;
  expect(cut.back.includes("(cut to fit)") && !cut.back.includes(`"${REWORDED}" isn't in any message you sent`) && flagged === undefined, "a line cut off the send-back isn't marked as said", `flagged ${flagged}`);
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

parts();
await finish("test-stop-check", [failingCheck, passThenFail, otherProject, cancelled, cutState, ruleChecks, rewordAfterSendBack, nowMarks, staleAtCheckpoint, screensAndShapes, hangingCheck, writesOnlyState, ...gitCases]);
