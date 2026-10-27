// Tests for npm run eval that spend no tokens: the sandbox each claude runs in, the link and cache checks on the
// copies, the owner's hurdle counts, the report's spread rule and multi-ask cases. usage: npm run test:eval
// The sandbox test builds its own small world in a temporary folder (a real project, cases, records, two copies,
// session folders, a loose temp file, a socket served from outside) and runs the same fence, profile and probe the
// eval uses: every denied place must refuse cat, git, find, python and socket connections, the arm's own places
// must work, and a fence with a hole must be caught. Then the eval's driver runs a stand-in claude (a small script,
// no tokens) through the same wrapper and a multi-ask case.
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, utimesSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fenceFor, profile, probe, probePlaces, probeLines, canSandbox, sessionFolderName } from "./eval/sandbox.mjs";
import { makeCopy, linksOut } from "./eval/copy.mjs";
import { sessionHurdles, asksOwner, asksGoAhead, handSteps, INTERNAL } from "./eval/hurdles.mjs";
import { compare, summaryOf, shapeOf, numbersOf, partsOf, writeReport } from "./eval/report.mjs";
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

// On a Mac the world goes in /tmp: a Unix socket's path holds at most 104 bytes, and $TMPDIR there is long.
const root = realpathSync(mkdtempSync(join(process.platform === "darwin" ? "/tmp" : tmpdir(), "otm-eval-test-")));
const at = (...p) => join(root, ...p);
const put = (path, text) => { mkdirSync(join(path, ".."), { recursive: true }); writeFileSync(path, text); };
const gitRepo = (dir, files, date) => {
  for (const [f, t] of Object.entries(files)) put(join(dir, f), t);
  const env = { ...process.env, ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) };
  const g = (...a) => execFileSync("git", ["-C", dir, ...a], { stdio: "ignore", env });
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
    put(at("loose", "check.log"), "offthemode: npm run check passed\n");
    put(at("home-otm", "ME.md"), "# ME\n");
    symlinkSync(at("project"), join(own, "project", "link-out"));
    const where = { repo: at("project"), cases: at("cases"), records: at("records"), copies: at("copies"), projects: at("projects"),
      fileHistory: at("file-history"), alsoDeny: [["this repo", at("this-repo")], ["a loose temp file", at("loose", "check.log")]],
      shared: [["the owner's Off the Mode folder", at("home-otm")]] };
    const fence = fenceFor(where, { own, sid: "own-sid" });
    const copy = join(own, "project"), tmp = join(own, "tmp");
    const outsideSocket = at("copies", ".probe", "0.sock");
    const list = [
      ...probePlaces(where, fence, { copy, tmp, others: [join(other, "project")], caseDir: at("cases", "case1"), records: at("records", "run1"), repoSessions: at("projects", sessionFolderName(at("project"))), socket: outsideSocket }),
      { name: "the real project through a link in the copy", dir: join(copy, "link-out"), file: join(copy, "link-out", "secret.txt"), expect: "denied" },
      { name: "its own file history", dir: at("file-history", "own-sid"), expect: "open", write: true },
      { name: "a socket in the records, served from outside", dir: at("records", "s.sock"), expect: "denied", socket: true },
    ];
    const env = { ...process.env, TMPDIR: tmp };
    const r = await probe(profile(fence), list, { cwd: copy, env });
    console.log(probeLines(r).map((l) => `     ${l}`).join("\n"));
    expect(r.ok, `the sandbox held: ${r.results.filter((p) => p.expect === "denied").length} places refused every probe, ${r.results.filter((p) => p.expect === "open").length} stayed open`);
    const tried = new Set(r.results.flatMap((p) => p.tried.filter((t) => t.outside === 0).map((t) => t.probe)));
    expect(["cat", "git-log", "git-grep", "find", "python", "write", "connect"].every((x) => tried.has(x)), `every kind of probe counted somewhere (${[...tried].join(", ")})`);
    expect(r.results.find((p) => p.dir === at("loose", "check.log"))?.tried.some((t) => t.probe === "cat" && t.outside === 0 && t.inside !== 0), "a loose file among the denied places is refused to cat");
    expect(r.results.find((p) => p.dir === at("home-otm"))?.held && readFileSync(at("home-otm", "ME.md"), "utf8") === "# ME\n", "the owner's shared folder is read but not written");
    const unshared = await probe(profile({ ...fence, shared: [] }), list, { cwd: copy, env });
    expect(!unshared.ok && probeLines(unshared).some((l) => l.startsWith("WRITABLE") && l.includes(at("home-otm"))), "a fence that lets the shared folder be written is caught (WRITABLE)");
    // The probe must be able to fail: a fence that forgets the real project is caught.
    const holed = { ...fence, deny: fence.deny.filter((d) => d !== at("project")) };
    const h = await probe(profile(holed), list, { cwd: copy, env });
    expect(!h.ok && !h.results.find((p) => p.dir === at("project")).held, "a fence with a hole in it is caught (LEAK on the real project)");
    // File rules alone don't stop a connection to a socket in a denied place: without the socket rules, it leaks.
    const noSockets = profile(fence).split("\n").filter((l) => !l.includes("network-outbound")).join("\n");
    const n = await probe(noSockets, list, { cwd: copy, env });
    expect(!n.ok && !n.results.find((p) => p.dir === outsideSocket).held && n.results.find((p) => p.dir === join(copy, "link-out")).held, "without the socket rules, a socket served in a denied place is caught (LEAK), while its files stay refused");

    // The driver: a stand-in claude, started the way an arm is, answers each message and says what it could read.
    process.env.OTM_EVAL_TICK_MS = "200";
    const { driveArm } = await import("./eval/drive.mjs");
    const fake = at("bin", "claude.mjs");
    put(fake, `#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
const out = (e) => process.stdout.write(JSON.stringify(e) + "\\n");
import { connect } from "node:net";
const read = (p) => { try { readFileSync(p); return "read"; } catch (e) { return e.code; } };
const dial = (p) => new Promise((done) => { const s = connect(p, () => { s.destroy(); done("connected"); }); s.on("error", (e) => done(e.code)); });
let n = 0;
for await (const line of createInterface({ input: process.stdin })) {
  const text = \`turn \${++n} got "\${JSON.parse(line).message.content}"; the real project: \${read(process.env.EVAL_TEST_SECRET)}; its copy: \${read("app.js")}; a session's socket: \${await dial(process.env.EVAL_TEST_SOCKET)}. Shall I start?\`;
  out({ type: "system", subtype: "status", status: "requesting" });
  out({ type: "assistant", message: { content: [{ type: "text", text }] } });
  out({ type: "result", subtype: "success", is_error: false, terminal_reason: "completed", result: text });
}
`);
    chmodSync(fake, 0o755);
    process.env.EVAL_TEST_SECRET = at("project", "secret.txt");
    // Another session's messaging socket, served from outside the sandbox in a denied place.
    process.env.EVAL_TEST_SOCKET = at("records", "session.sock");
    const session = createServer((c) => c.destroy());
    await new Promise((done) => session.listen(process.env.EVAL_TEST_SOCKET, done));
    mkdirSync(at("drive-log"));
    const messages = [{ kind: "ask", step: 1, text: "first ask" }, { kind: "reply", step: 1, text: "a reply" }, { kind: "ask", step: 2, text: "whats next now ?" }];
    const c = { messages, quietMinutes: 0.005, model: "test", disallow: [], mcp: "" };
    const base = execFileSync("git", ["-C", copy, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const d = await driveArm({ c, arm: "plain", run: 1, dir: copy, base, logDir: at("drive-log"), tmp, settings: {}, sid: "test-sid", profile: profile(fence), claude: fake });
    const said = d.turns.map((t) => t.text);
    expect(d.turns.map((t) => `${t.kind}${t.step}`).join() === "ask1,reply1,ask2" && said.every((t, i) => t.includes(`got "${messages[i].text}"`)), `the driver sends each ask and reply once, in order, after the turn before ends (${d.turns.length} turns)`);
    session.close();
    expect(said.length > 0 && said.every((t) => t.includes("the real project: EPERM") && t.includes("its copy: read") && t.includes("a session's socket: EPERM")), `the claude the driver starts runs in the sandbox: the real project and another session's socket refused, its copy read ("${said[0]?.slice(0, 160)}")`);
    expect(d.turns.every((t) => t.asked) && !d.stoppedBy, "each turn ended on a question, and the session closed on its own");
  }

  // ---- 2. No path out by link: a link back into the project is re-pointed; any other link out stops the copy.
  //      No build cache comes along, and files written after the case's commit are named.
  {
    const project = at("linked");
    const commit = gitRepo(project, { "index.js": "1\n", ".gitignore": "node_modules\n" }, "2026-01-01T10:00:00Z");
    mkdirSync(join(project, "node_modules", "pkg"), { recursive: true });
    writeFileSync(join(project, "node_modules", "pkg", "index.js"), "1\n");
    utimesSync(join(project, "node_modules", "pkg", "index.js"), new Date("1985-10-26T08:15:00Z"), new Date("1985-10-26T08:15:00Z")); // as npm unpacks it
    symlinkSync(join(project, "node_modules"), join(project, "node_modules", "node_modules"));
    symlinkSync("../pkg/index.js", join(project, "node_modules", "pkg", "self.js"));
    // The owner's later work, as vitest's cache recorded it in the replays: the names of the tests of the real fix.
    put(join(project, "node_modules", ".vite", "vitest", "da39a3ee", "results.json"), '{"results":[["src/db/deluxe-stays.test.ts",{"duration":3}]]}\n');
    put(join(project, "node_modules", ".cache", "babel", "x.json"), "src/db/deluxe-stays.test.ts\n");
    put(join(project, "node_modules", ".DS_Store"), "x");
    put(join(project, "node_modules", "pkg", "later.txt"), "written after the commit\n");
    const c = { repo: project, commit, copy: ["node_modules"], files: {}, setup: null, install: null, rulesText: null };
    const dir = at("linkcopies", "a", "linked");
    const made = await makeCopy(c, { dir, arm: "otm", logFile: at("linkcopies", "a.log") });
    expect(linksOut(dir).length === 0, "node_modules/node_modules pointing at the real project is pointed back into the copy");
    expect(realpathSync(join(dir, "node_modules", "node_modules")) === realpathSync(join(dir, "node_modules")), "the re-pointed link still leads where the project meant it to");
    let named = "";
    try { named = execFileSync("grep", ["-rl", "deluxe-stays", dir], { encoding: "utf8" }); } catch { /* grep finds nothing: exit 1 */ }
    expect(!named && !existsSync(join(dir, "node_modules", ".vite")) && !existsSync(join(dir, "node_modules", ".DS_Store")) && existsSync(join(dir, "node_modules", "pkg", "index.js")), `build caches stay out of the copy: no file names the later test (${named.trim() || "none"}), the packages stay`);
    expect(made.newer.join() === "node_modules/pkg/later.txt", `a copied file written after the case's commit is named for the start warning (got ${made.newer.join(", ") || "none"})`);
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
    const inline = ["Done. I guarded `user?.name` in src/app.ts and the check passes.", "It now reads `a ? b : c`.", "It falls back with `x ?? y`.",
      "The page keeps its tab (`/progress?tab=done`), so reload and Back keep you where you were."];
    expect(inline.every((t) => !asksOwner(t)) && asksOwner("I guarded `user?.name`. Which album is the normal one?"), "a ? inside inline code is no question; one outside it still is");
    expect(asksGoAhead("…\nWant me to push it now?") && !asksGoAhead("Which album is the normal one?"), "a go-ahead is told apart from a real question");
    expect(!asksGoAhead("Then the next step is your call: keep waiting, or move renames to the phone app.") && !asksGoAhead("This changes which name gets suggested, so it's your call."),
      "\"your call\" alone hands over a decision: no go-ahead");
    expect(["**Your call:** ship the labels? My pick: yes.", "**Your call:** build this for real? My pick: yes.", "**Your calls:**\n1. **Go to push?** It sends 5 local commits.", "**Go to push?** Undo adds a migration."].every(asksGoAhead),
      "\"your call\" with ship, build or push, and \"Go to push?\", are go-aheads");
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

    // Runs that stopped early are left out of every comparison: an untouched copy keeps the start's score.
    const stopped = (a) => ({ ...a, stoppedBy: "exit 1", turns: [{ ...a.turns[0], text: "", error: "exit 1", changed: 0 }], score: { code: 0, out: "SUMMARY plan.json: deluxe-only onto the normal album 40 songs (400 plays)" } });
    const runDir2 = at("report-stopped");
    mkdirSync(runDir2);
    writeReport(runDir2, { case: "made-up", started: "2026-10-26T10:00:00Z", steps: [{ ask: "an ask", replies: 0 }], model: "m", settings: {}, runs: 2, isolation: [], baseline: { check: { code: 0 }, score: { code: 0, out: "SUMMARY x 40" } },
      arms: [arm("plain", 1, "F", 0, 100, 0), arm("plain", 2, "G", 0, 120, 0), stopped(arm("otm", 1, "H", 0, 1, 0)), stopped(arm("otm", 2, "J", 0, 1, 0))], judges: null, warnings: [] });
    const text2 = readFileSync(join(runDir2, "report.md"), "utf8");
    expect(!/: a result\./.test(text2) && text2.includes("#1: Plain Claude Code 0, 0. no full run of Off the Mode, so not a result."), "a run that stopped early never makes a result");
    expect(text2.includes("Not full runs, so left out of every comparison in this report: Off the Mode run 1 (H) (stopped early: exit 1), Off the Mode run 2 (J) (stopped early: exit 1)."), "the report says which runs were left out, and why");
    expect(/tokens read, in millions: Plain Claude Code 100, 120\. no full run of Off the Mode/.test(text2), "a stopped run's cost is left out too");

    // A part of the scorer's summary only some runs print leaves the other parts compared, number by number.
    expect(partsOf("SUMMARY a 40 songs (405 plays) · unknown 30 · 2 fixes not scored").map((p) => `${p.key}=${p.numbers}`).join(" | ") === "SUMMARY a #1 songs (#2 plays)=40,405 | unknown #1=30 | #1 fixes not scored=2", "a summary splits into parts named by their words");
    const tailed = (a, extra) => ({ ...a, score: { code: 0, out: `${a.score.out} · unknown ${a.run}${extra}` } });
    const runDir3 = at("report-tail");
    mkdirSync(runDir3);
    writeReport(runDir3, { case: "made-up", started: "2026-10-26T10:00:00Z", steps: [{ ask: "an ask", replies: 0 }], model: "m", settings: {}, runs: 2, isolation: [], baseline: null,
      arms: [tailed(arm("plain", 1, "F", 12, 100, 0), ""), tailed(arm("plain", 2, "G", 14, 120, 0), ""), tailed(arm("otm", 1, "H", 0, 90, 0), ""), tailed(arm("otm", 2, "J", 2, 150, 0), " · 2 fixes not scored")], judges: null, warnings: [] });
    const text3 = readFileSync(join(runDir3, "report.md"), "utf8");
    expect(text3.includes("#1: Plain Claude Code 12, 14 · Off the Mode 0, 2. Off the Mode minus Plain Claude Code -12, spread 2: a result.") && text3.includes("`unknown #1`"), "the parts every run prints are still compared, number by number");
    expect(text3.includes("Only in some runs' summaries, so not compared: `#1 fixes not scored` (Off the Mode run 2 (J): 2)"), "a part only some runs print is listed apart");
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
    write({});
    await throws(() => loadCase(dir), /give "ask" .* or "asks" [^]*\)$/, "a case with no ask is told to give one (not \"not both\")");
    write({ asks: [] });
    await throws(() => loadCase(dir), /"asks" lists no ask/, "an empty asks list is told it lists no ask");
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
