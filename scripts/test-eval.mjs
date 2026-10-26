// Tests for npm run eval that spend no tokens: the sandbox each claude runs in, the link check on the copies, the
// owner's hurdle counts, the report's spread rule and multi-ask cases. usage: npm run test:eval
// The sandbox test builds its own small world in a temporary folder (a real project, cases, records, two copies,
// session folders) and runs the same fence, profile and probe the eval uses: every denied place must refuse cat,
// git, find and python, the arm's own places must work, and a fence with a hole must be caught. Then the eval's
// driver runs a stand-in claude (a small script, no tokens) through the same wrapper and a multi-ask case.
import { execFileSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fenceFor, profile, probe, probePlaces, probeLines, canSandbox, sessionFolderName } from "./eval/sandbox.mjs";
import { makeCopy, linksOut } from "./eval/copy.mjs";
import { sessionHurdles, asksOwner, asksGoAhead, handSteps, INTERNAL } from "./eval/hurdles.mjs";
import { compare, summaryOf, shapeOf, numbersOf, writeReport } from "./eval/report.mjs";
import { loadCase, CaseError } from "./eval/case.mjs";
import { sessionFile } from "./eval/measure.mjs";

let failures = 0;
function expect(ok, what) {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures++;
}
async function throws(fn, pattern, what) {
  try { await fn(); expect(false, `${what} (it did not stop)`); } catch (e) { expect(e instanceof CaseError && pattern.test(e.message), `${what}${e instanceof CaseError ? "" : `: ${e.message}`}`); }
}

const root = realpathSync(mkdtempSync(join(tmpdir(), "otm-eval-test-")));
const at = (...p) => join(root, ...p);
const put = (path, text) => { mkdirSync(join(path, ".."), { recursive: true }); writeFileSync(path, text); };
const gitRepo = (dir, files) => {
  for (const [f, t] of Object.entries(files)) put(join(dir, f), t);
  const g = (...a) => execFileSync("git", ["-C", dir, ...a], { stdio: "ignore" });
  g("init", "-q", "-b", "main");
  g("add", "-A");
  g("-c", "user.name=t", "-c", "user.email=t@example.invalid", "commit", "-q", "-m", "start");
  return execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
};

try {
  // ---- 1. The sandbox: denied outside, open inside, the same wrapper the arms run in.
  if (!canSandbox()) console.log("skip the sandbox test: it needs macOS sandbox-exec");
  else {
    const commit = gitRepo(at("project"), { "secret.txt": "the owner's later answer\n", ".gitignore": "node_modules\n" });
    put(at("cases", "case1", "case.json"), "{}\n");
    put(at("records", "run1", "key.json"), '{"F":"plain"}\n');
    const own = at("copies", "own12345"), other = at("copies", "oth67890");
    gitRepo(join(own, "project"), { "app.js": "export const x = 1;\n" });
    mkdirSync(join(own, "tmp"), { recursive: true });
    gitRepo(join(other, "project"), { "app.js": "export const x = 2; // the other arm's answer\n" });
    put(at("projects", sessionFolderName(at("project")), "real.jsonl"), "{}\n");
    put(at("projects", "-somewhere-else", "other.jsonl"), "{}\n");
    put(at("file-history", "other-sid", "f@v1"), "an edited file\n");
    put(at("this-repo", "content", "method.md"), "the method\n");
    symlinkSync(at("project"), join(own, "project", "link-out"));
    const where = { repo: at("project"), cases: at("cases"), records: at("records"), copies: at("copies"), projects: at("projects"),
      fileHistory: at("file-history"), alsoDeny: [["this repo", at("this-repo")]] };
    const fence = fenceFor(where, { own, sid: "own-sid" });
    const copy = join(own, "project"), tmp = join(own, "tmp");
    const list = [
      ...probePlaces(where, fence, { copy, tmp, others: [join(other, "project")], caseDir: at("cases", "case1"), records: at("records", "run1"), repoSessions: at("projects", sessionFolderName(at("project"))) }),
      { name: "the real project through a link in the copy", dir: join(copy, "link-out"), file: join(copy, "link-out", "secret.txt"), expect: "denied" },
      { name: "its own file history", dir: at("file-history", "own-sid"), expect: "open", write: true },
    ];
    const env = { ...process.env, TMPDIR: tmp };
    const r = await probe(profile(fence), list, { cwd: copy, env });
    console.log(probeLines(r).map((l) => `     ${l}`).join("\n"));
    expect(r.ok, `the sandbox held: ${r.results.filter((p) => p.expect === "denied").length} places refused every probe, ${r.results.filter((p) => p.expect === "open").length} stayed open`);
    const tried = new Set(r.results.flatMap((p) => p.tried.filter((t) => t.outside === 0).map((t) => t.probe)));
    expect(["cat", "git-log", "git-grep", "find", "python", "write"].every((x) => tried.has(x)), `every kind of probe counted somewhere (${[...tried].join(", ")})`);
    // The probe must be able to fail: a fence that forgets the real project is caught.
    const holed = { ...fence, deny: fence.deny.filter((d) => d !== at("project")) };
    const h = await probe(profile(holed), list, { cwd: copy, env });
    expect(!h.ok && !h.results.find((p) => p.dir === at("project")).held, "a fence with a hole in it is caught (LEAK on the real project)");

    // The driver: a stand-in claude, started the way an arm is, answers each message and says what it could read.
    process.env.OTM_EVAL_TICK_MS = "200";
    const { driveArm } = await import("./eval/drive.mjs");
    const fake = at("bin", "claude.mjs");
    put(fake, `#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
const out = (e) => process.stdout.write(JSON.stringify(e) + "\\n");
const read = (p) => { try { readFileSync(p); return "read"; } catch (e) { return e.code; } };
let n = 0;
for await (const line of createInterface({ input: process.stdin })) {
  const text = \`turn \${++n} got "\${JSON.parse(line).message.content}"; the real project: \${read(process.env.EVAL_TEST_SECRET)}; its copy: \${read("app.js")}. Shall I start?\`;
  out({ type: "system", subtype: "status", status: "requesting" });
  out({ type: "assistant", message: { content: [{ type: "text", text }] } });
  out({ type: "result", subtype: "success", is_error: false, terminal_reason: "completed", result: text });
}
`);
    chmodSync(fake, 0o755);
    process.env.EVAL_TEST_SECRET = at("project", "secret.txt");
    mkdirSync(at("drive-log"));
    const messages = [{ kind: "ask", step: 1, text: "first ask" }, { kind: "reply", step: 1, text: "a reply" }, { kind: "ask", step: 2, text: "whats next now ?" }];
    const c = { messages, quietMinutes: 0.005, model: "test", disallow: [], mcp: "" };
    const base = execFileSync("git", ["-C", copy, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const d = await driveArm({ c, arm: "plain", run: 1, dir: copy, base, logDir: at("drive-log"), tmp, settings: {}, sid: "test-sid", profile: profile(fence), claude: fake });
    const said = d.turns.map((t) => t.text);
    expect(d.turns.map((t) => `${t.kind}${t.step}`).join() === "ask1,reply1,ask2" && said.every((t, i) => t.includes(`got "${messages[i].text}"`)), `the driver sends each ask and reply once, in order, after the turn before ends (${d.turns.length} turns)`);
    expect(said.length > 0 && said.every((t) => t.includes("the real project: EPERM") && t.includes("its copy: read")), `the claude the driver starts runs in the sandbox: the real project refused, its copy read ("${said[0]?.slice(0, 120)}")`);
    expect(d.turns.every((t) => t.asked) && !d.stoppedBy, "each turn ended on a question, and the session closed on its own");
  }

  // ---- 2. No path out by link: a link back into the project is re-pointed; any other link out stops the copy.
  {
    const project = at("linked");
    const commit = gitRepo(project, { "index.js": "1\n", ".gitignore": "node_modules\n" });
    mkdirSync(join(project, "node_modules", "pkg"), { recursive: true });
    writeFileSync(join(project, "node_modules", "pkg", "index.js"), "1\n");
    symlinkSync(join(project, "node_modules"), join(project, "node_modules", "node_modules"));
    symlinkSync("../pkg/index.js", join(project, "node_modules", "pkg", "self.js"));
    const c = { repo: project, commit, copy: ["node_modules"], files: {}, setup: null, install: null, rulesText: null };
    const dir = at("linkcopies", "a", "linked");
    await makeCopy(c, { dir, arm: "otm", logFile: at("linkcopies", "a.log") });
    expect(linksOut(dir).length === 0, "node_modules/node_modules pointing at the real project is pointed back into the copy");
    expect(realpathSync(join(dir, "node_modules", "node_modules")) === realpathSync(join(dir, "node_modules")), "the re-pointed link still leads where the project meant it to");
    symlinkSync(at("project"), join(project, "node_modules", "escape"));
    await throws(() => makeCopy(c, { dir: at("linkcopies", "b", "linked"), arm: "otm", logFile: at("linkcopies", "b.log") }), /links that lead out of it.*escape ->/, "a link to another place outside the copy stops the run, naming the link");
    rmSync(join(project, "node_modules", "escape"));
    symlinkSync("/nowhere/real-project", join(project, "node_modules", "dangling"));
    await throws(() => makeCopy(c, { dir: at("linkcopies", "c", "linked"), arm: "otm", logFile: at("linkcopies", "c.log") }), /dangling -> \/nowhere\/real-project/, "a broken link naming a path outside the copy stops the run too");
  }

  // ---- 3. The owner's hurdles, on a session made up to hold one of each, then on a recorded one.
  {
    const ts = (m) => `2026-10-21T10:${String(m).padStart(2, "0")}:00.000Z`;
    const say = (m, text, extra = {}) => ({ type: "assistant", timestamp: ts(m), message: { id: `m${m}`, content: [{ type: "text", text }], usage: {} }, ...extra });
    const session = [
      { type: "user", timestamp: ts(0), message: { content: "add the deluxe switch" } },
      say(1, "I read .offthemode/STATE.md and D-012 first."),
      say(2, "An agent's own notes: D-099, F4.2, CHECKLIST.md", { isSidechain: true }),
      { type: "user", timestamp: ts(3), message: { content: [{ type: "tool_result", content: "ok" }] } },
      { type: "user", timestamp: ts(3), isMeta: true, message: { content: "a skill's text" } },
      { type: "user", timestamp: ts(3), message: { content: "<task-notification>done</task-notification>" } },
      say(4, "Plan is ready, item F4.2.\n\nShall I start?"),
      { type: "user", timestamp: ts(5), message: { content: "yes" } },
      say(6, "Done. Please run `npm run db:push` in your terminal.\n- Paste this into the SQL editor:\n1. Add the column (I did this).\nTapping a cover moves it."),
    ];
    const file = at("session.jsonl");
    writeFileSync(file, session.map((e) => JSON.stringify(e)).join("\n") + "\n");
    const h = sessionHurdles(file);
    expect(h.turns === 2, `owner turns: only what the owner typed starts one (got ${h.turns})`);
    expect(h.asked === 1 && h.perTurn[0].asked && !h.perTurn[1].asked, "a turn whose last words hold a question asked the owner");
    expect(h.goAhead === 1 && h.perTurn[0].goAhead, "\"Shall I start?\" asks for a go-ahead");
    expect(h.ids === 3 && h.perTurn[0].idsSeen.join() === ".offthemode/STATE.md,D-012,F4.2", `internal ids in the main chat only, each once (got ${h.ids}: ${h.perTurn[0].idsSeen})`);
    expect(h.steps === 2, `hand steps: "please run … in your terminal" and "Paste this", not the AI's own plan or a description (got ${h.steps}: ${h.perTurn[1].stepLines.join(" / ")})`);
    expect(h.perTurn[1].chars === session.at(-1).message.content[0].text.length, "characters read per turn are the main chat's text");
    expect(!asksOwner("See https://x.test/?q=1\n```\nwhy?\n```\nDone."), "a ? inside a link or a code block is no question");
    expect(asksGoAhead("…\nWant me to push it now?") && !asksGoAhead("Which album is the normal one?"), "a go-ahead is told apart from a real question");
    expect(handSteps("1. Add a test for the rule.\n2. Open the app in your browser and press Fix.").length === 1, "a numbered plan is not a hand step; \"Open the app\" is");
    expect(("see RULES.md, README.md, D-1 and R-12".match(INTERNAL) ?? []).join() === "RULES.md,R-12", "README.md and a one-digit D-1 are not internal ids");

    // A recorded session, found by its id among Claude Code's session folders, as the eval finds an arm's.
    const recorded = sessionFile("d8096511-9678-42d7-b067-31d9a13802f0");
    if (!recorded) console.log("skip the recorded session: it is only on the author's Mac");
    else {
      // r1-O1, a real Off the Mode replay: 2 owner turns; the second ends on "which version of this goes to main?";
      // ids counted by hand with grep: turn 1 DECISIONS.md, STATE.md; turn 2 D-111 ×5, DECISIONS.md, STATE.md ×5.
      const r = sessionHurdles(recorded);
      expect(r.turns === 2 && r.asked === 1 && r.goAhead === 0, `recorded session: 2 turns, 1 ending on a question, no go-ahead ask (got ${r.turns}, ${r.asked}, ${r.goAhead})`);
      expect(r.perTurn[0].ids === 2 && r.perTurn[1].ids === 11, `recorded session: 2 then 11 internal ids (got ${r.perTurn.map((t) => t.ids)})`);
      expect(r.steps === 0 && r.charsPerTurn === 3517, `recorded session: no hand steps, 3517 characters per turn (got ${r.steps}, ${r.charsPerTurn})`);
    }
  }

  // ---- 4. The report: scripted scores lined up number by number; a difference within the spread is no result.
  {
    const out = "  deluxe-only: 3 songs\nSUMMARY plan.json: deluxe-only onto the normal album 40 songs (405 plays) · unknown 30\n";
    expect(summaryOf(out) === "SUMMARY plan.json: deluxe-only onto the normal album 40 songs (405 plays) · unknown 30", "the scorer's SUMMARY line leads");
    expect(summaryOf("shout: 3 of 3 owner examples right\n") === "shout: 3 of 3 owner examples right", "without SUMMARY, its last line");
    expect(shapeOf(summaryOf(out)) === "SUMMARY plan.json: deluxe-only onto the normal album #1 songs (#2 plays) · unknown #3" && numbersOf(summaryOf(out)).join() === "40,405,30", "numbers are lined up by place");
    const a = compare({ plain: [12, 14], otm: [0, 2] }), b = compare({ plain: [3, 6], otm: [4, 4] }), one = compare({ plain: [3], otm: [9] });
    expect(a.result && a.diff === -12 && a.spread === 2, `a difference bigger than the spread is a result (${a.verdict})`);
    expect(!b.result && /within the spread, not a result/.test(b.verdict), `a difference within the spread is not (${b.verdict})`);
    expect(/one run: no spread, so not a result/.test(one.verdict), "one run per arm is never a result");

    // A whole report from a made-up finished run: the scorer leads, the judges come last and are called noisy.
    const arm = (a, run, letter, n, tokens, asked) => ({ arm: a, run, letter, dir: "/copy", sid: "s", turns: [{ sent: "2026-10-26T10:00:00Z", ended: "2026-10-26T10:30:00Z", text: "Done.", asked: false, changed: 3 }],
      check: { code: 0, out: "" }, score: { code: 0, out: `SUMMARY plan.json: deluxe-only onto the normal album ${n} songs (${n * 10} plays)` },
      usage: { total: tokens * 1e6, main: 1e6, agents: 2, agentsTotal: 1e6, workflows: [], turns: [] },
      hurdles: { asked, goAhead: 0, ids: a === "otm" ? 9 : 0, charsPerTurn: 2000, steps: 1, perTurn: [] } });
    const runDir = at("report");
    mkdirSync(runDir);
    writeReport(runDir, { case: "made-up", started: "2026-10-26T10:00:00Z", steps: [{ ask: "an ask", replies: 1 }], model: "m", settings: {}, runs: 2,
      isolation: [{ who: "x", ok: true, denied: 16, open: 3 }], baseline: { check: { code: 0 }, score: { code: 0, out: "SUMMARY plan.json: deluxe-only onto the normal album 40 songs (405 plays)" } },
      arms: [arm("plain", 1, "F", 12, 100, 1), arm("plain", 2, "G", 14, 120, 0), arm("otm", 1, "H", 0, 90, 0), arm("otm", 2, "J", 2, 150, 0)],
      judges: [{ run: 1, verdicts: [{ lens: "fit", name: "engineering fit", scores: { F: 6, H: 8 }, ranking: ["H", "F"], agree: true, verdict: "H is smaller." }] }], warnings: [] });
    const text = readFileSync(join(runDir, "report.md"), "utf8");
    const at_ = (h) => text.indexOf(h);
    expect(at_("## Scripted scores") > 0 && at_("## Scripted scores") < at_("## The owner's hurdles") && at_("## The owner's hurdles") < at_("## Cost") && at_("## Cost") < at_("## Blind judges: the noisy part"), "the report leads with scripted scores; judges come last, called the noisy part");
    expect(text.includes("At the start: `SUMMARY plan.json: deluxe-only onto the normal album 40 songs (405 plays)`"), "the baseline's summary line is shown");
    expect(text.includes("#1: Plain Claude Code 12, 14 · Off the Mode 0, 2. Off the Mode minus Plain Claude Code -12, spread 2: a result."), "each run's score is shown, with the difference and the spread");
    expect(/tokens read, in millions: Plain Claude Code 100, 120 · Off the Mode 90, 150\. .*within the spread, not a result/.test(text), "a cost difference within the spread is called no result");
  }

  // ---- 5. Multi-ask cases: several asks in order, each with its own replies.
  {
    const repo = at("project-multi"), commit = gitRepo(repo, { "a.txt": "a\n" }), dir = at("cases-test", "multi");
    for (const [f, t] of Object.entries({ "ask-1.md": "first ask", "reply-1a.md": "a reply", "ask-2.md": "whats next now ?" })) put(join(dir, f), t);
    const write = (c) => writeFileSync(join(dir, "case.json"), JSON.stringify({ repo, commit, check: "true", ...c }));
    write({ asks: [{ ask: "ask-1.md", replies: ["reply-1a.md"] }, { ask: "ask-2.md" }] });
    const c = loadCase(dir);
    expect(c.messages.map((m) => `${m.kind}${m.step}:${m.text}`).join(" | ") === "ask1:first ask | reply1:a reply | ask2:whats next now ?", "asks and replies go in, in order");
    write({ ask: "ask-1.md", asks: [{ ask: "ask-2.md" }] });
    await throws(() => loadCase(dir), /not both/, "a case gives ask or asks, not both");
    write({ asks: [{ ask: "ask-1.md", reply: ["reply-1a.md"] }] });
    await throws(() => loadCase(dir), /unknown field "reply"/, "a misspelt field in an ask is caught");
    write({ ask: "ask-1.md", replies: ["reply-1a.md"] });
    const single = loadCase(dir);
    expect(single.messages.length === 2 && single.steps.length === 1 && single.askText === "first ask", "a one-ask case still works as before");
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}

console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);
