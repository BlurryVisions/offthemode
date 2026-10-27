// npm run eval: replays real asks through plain Claude Code and through Off the Mode, then measures and scores both.
//   npm run eval -- <case> [--arms plain,otm] [--runs N] [--prepare] [--no-judge]
//   npm run eval -- --rejudge <run folder>      runs the blind judges again on a finished run
//   npm run eval -- --measure <session .jsonl>   a session's tokens and the owner's hurdles, per turn
//   npm run eval -- --make-smoke                 writes the smoke case, a tiny project, to the cases folder
// A case is a folder outside this repo ($OTM_EVAL_CASES, default ~/.offthemode/evals; its fields are in
// scripts/eval/case.mjs). A run's records go to $OTM_EVAL_WORK (default ~/offthemode-evals); its copies go to
// $OTM_EVAL_COPIES (default ~/work-copies), each alone in a folder with a random name. Never /tmp, which macOS
// empties after 3 days.
// Each arm runs --runs times (default 2), each time in a fresh copy; the report shows every run and the spread,
// because one run is one sample. Every claude the eval starts runs in a macOS sandbox (scripts/eval/sandbox.mjs)
// that can't read the real project, the cases, the records, the other copies or other sessions' records, nor connect
// to another session; a probe proves it before any token is spent, and the run stops if it doesn't hold.
// --prepare makes the copies, proves the sandbox, and runs the check and scorer at the start, for no tokens.
import { parseArgs } from "node:util";
import { spawn, execFileSync } from "node:child_process";
import { chmodSync, closeSync, copyFileSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, readSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, userInfo } from "node:os";
import { randomBytes, randomUUID } from "node:crypto";
import { loadCase, CASES, CaseError, ARM_NAMES, caseEnv } from "./eval/case.mjs";
import { makeCopy, startDifferences } from "./eval/copy.mjs";
import { driveArm, cleanEnv } from "./eval/drive.mjs";
import { sessionFile, sessionUsage, printUsage } from "./eval/measure.mjs";
import { sessionHurdles } from "./eval/hurdles.mjs";
import { writeDiffs, pickLetters, judge } from "./eval/blind.mjs";
import { writeReport } from "./eval/report.mjs";
import { makeSmoke } from "./eval/smoke.mjs";
import { sh, say, logTo, M, gitOr } from "./eval/run.mjs";
import { canSandbox, fenceFor, profile, probe, probePlaces, probeLines, realish, sessionFolderName, within } from "./eval/sandbox.mjs";

// An empty variable counts as unset: resolve("") would be the folder the eval was started from.
const WORK = resolve(process.env.OTM_EVAL_WORK || join(homedir(), "offthemode-evals"));
const COPIES_AS_GIVEN = resolve(process.env.OTM_EVAL_COPIES || join(homedir(), "work-copies"));
const THIS_REPO = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PROJECTS = join(homedir(), ".claude", "projects");
const NAMES_IT = /offthemode|off[\s_-]*the[\s_-]*mode|revisit-(checklist|state|comments|glossary)|view-project|reassess/i;

const real = (p) => (existsSync(p) ? realpathSync.native(p) : resolve(p));

// The copies folder must stand apart: inside the records, the cases, the project or this repo, Claude Code would
// load the rule files of the folders above a copy.
let COPIES = COPIES_AS_GIVEN;
function useCopies(c) {
  mkdirSync(COPIES_AS_GIVEN, { recursive: true, mode: 0o700 });
  COPIES = real(COPIES_AS_GIVEN);
  chmodSync(COPIES, 0o700); // earlier versions locked it (0300) so arms couldn't list it; the sandbox does that now
  const apart = [["the records folder", WORK], ["the cases folder", CASES], ["the project", c.repo], ["this repo", THIS_REPO]];
  for (const [name, path] of apart.map(([n, p]) => [n, real(p)])) {
    if (within(COPIES, path) || within(path, COPIES)) throw new CaseError(`the copies folder (${COPIES}) and ${name} (${path}) must not sit inside each other; set OTM_EVAL_COPIES elsewhere`);
  }
  // Each arm's Claude Code keeps its messaging socket in its scratch folder; a Unix socket's path holds at most 103
  // bytes, and past that Claude Code puts it in /tmp, which the sandbox closes.
  const socket = join(COPIES, "12345678", "tmp", "cc-socks", "99999.sock");
  if (Buffer.byteLength(socket) > 103) throw new CaseError(`the copies folder's path (${COPIES}) is too long for the arms' messaging sockets (${socket} is over 103 bytes); set OTM_EVAL_COPIES to a shorter path`);
}

// Editors that keep a local history of every file saved in them, the real project's too (VS Code and its forks).
const EDITORS = ["Code", "Code - Insiders", "Cursor", "VSCodium", "Windsurf"];

// Files and folders beside the project whose names start with its name and go on with no letter (lasscrobits-keys,
// a spike, another worktree): the owner's side work and secrets for that project.
function besideProject(repo) {
  const r = real(repo), name = basename(r).toLowerCase(), parent = dirname(r);
  let entries = [];
  try { entries = readdirSync(parent, { withFileTypes: true }); } catch { return []; }
  return entries.filter((e) => e.name.toLowerCase().startsWith(name) && e.name.length > name.length && !/[a-z]/i.test(e.name[name.length]))
    .map((e) => join(parent, e.name));
}

// Loose files in the temp folders that name Off the Mode or the project (a check's log, a tool's cache of the real
// project's code): an arm could find them, so every fence closes them, each with the whole temp entry it sits in
// (tsx-501, say: hundreds of cached files). Two levels deep, the first MB of each file under 4 MB. The arms keep
// their own temp folder (TMPDIR), so they need none of these.
function strayFiles(c, closed) {
  let userTemp = "";
  try { userTemp = execFileSync("/usr/bin/getconf", ["DARWIN_USER_TEMP_DIR"], { encoding: "utf8" }).trim(); } catch { /* not a Mac */ }
  const project = real(c.repo), names = new RegExp(`${NAMES_IT.source}|${basename(project).replace(/[^\w]/g, "\\$&")}`, "i");
  const found = new Set(), buf = Buffer.alloc(1 << 20);
  const named = (file) => {
    if (names.test(basename(file))) return true;
    let fd;
    try { fd = openSync(file, "r"); return names.test(buf.toString("latin1", 0, readSync(fd, buf, 0, buf.length, 0))); } catch { return false; } finally { if (fd !== undefined) closeSync(fd); }
  };
  const walk = (dir, depth, top) => {
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (closed.some((d) => within(p, d)) || found.has(top ?? p)) continue;
      if (e.isDirectory() && depth > 1) walk(p, depth - 1, top ?? p);
      else if (e.isFile() && statSync(p, { throwIfNoEntry: false })?.size < 4 << 20 && named(p)) found.add(top ?? p);
    }
  };
  for (const dir of [...new Set(["/tmp", userTemp].filter(Boolean).map(real))]) walk(dir, 2);
  return [...found];
}

// The places no arm or judge may read, besides each other's copies: see sandbox.mjs for how.
function places(c) {
  const main = gitOr(THIS_REPO, "rev-parse", "--path-format=absolute", "--git-common-dir");
  const uid = userInfo().uid, support = join(homedir(), "Library", "Application Support");
  const where = {
    repo: c.repo, cases: CASES, records: WORK, copies: COPIES, projects: PROJECTS, fileHistory: join(homedir(), ".claude", "file-history"),
    alsoDeny: [
      // Off the Mode itself, which the plain arm must not find (and every worktree of it).
      ["this repo", THIS_REPO], ...(main ? [["this repo's main checkout", dirname(main)]] : []),
      // Claude Code's usual scratch folders, where earlier replays kept their copies with finished answers.
      ["Claude Code's scratch folders in /tmp", realish(`/tmp/claude-${uid}`)],
      // Other Claude Code sessions: the list of live ones (their names, folders and messaging keys), their messaging
      // sockets (the folders Claude Code's own sandbox closes too), and the editors' links to Claude Code with their
      // tokens. A session outside the sandbox can read the real project, so an arm must not reach one.
      ["the list of live Claude Code sessions", join(homedir(), ".claude", "sessions")],
      ["the editors' links to Claude Code", join(homedir(), ".claude", "ide")],
      ...["cc-socks", `cc-socks-${uid}`, `cc-daemon-${uid}`].map((n) => ["Claude Code's messaging sockets", realish(`/tmp/${n}`)]),
      // The desktop app's own records of sessions and notes.
      ["the desktop app's folder", join(support, "Claude")],
      ...besideProject(c.repo).map((p) => ["a folder beside the project, named after it", p]),
      ...EDITORS.map((e) => [`${e}'s local history of saved files`, join(support, e, "User", "History")]),
    ],
    // The owner's files every session reads: an arm reads them like any session, but its writes would reach the owner
    // and every later arm (an Off the Mode save adds lines to ME.md).
    shared: [
      ["the owner's Off the Mode folder (ME.md)", join(homedir(), ".offthemode")],
      ["the owner's Claude Code rules for every project", join(homedir(), ".claude", "CLAUDE.md")],
    ],
  };
  const closed = [where.repo, where.cases, where.records, where.copies, ...where.alsoDeny.map(([, p]) => p)].map(realish);
  where.alsoDeny.push(...strayFiles(c, closed).map((p) => ["a temp file or folder naming Off the Mode or the project", p]));
  return where;
}

// The claude the arms run, by its full path: inside the sandbox, a PATH lookup could land elsewhere.
function claudeBin() {
  try { return realpathSync(execFileSync("/usr/bin/which", ["claude"], { encoding: "utf8" }).trim()); } catch { return "claude"; }
}

// Claude Code's own sandbox can't start inside the eval's (macOS refuses a sandbox inside a sandbox), so it is off
// in both arms; the eval's sandbox covers more anyway (sandbox.mjs).
function armSettings(c) {
  if (c.settings.sandbox?.enabled) throw new CaseError("the case turns Claude Code's own sandbox on, but each arm already runs in the eval's sandbox and macOS can't start one inside the other; leave sandbox out of the case's settings");
  return { ...c.settings, sandbox: { ...c.settings.sandbox, enabled: false } };
}

// A folder with a random name, holding one copy and its scratch folder (private, as Claude Code asks).
function newPlace() {
  const place = join(COPIES, randomBytes(4).toString("hex"));
  mkdirSync(join(place, "tmp"), { recursive: true, mode: 0o700 });
  return place;
}

// Where in a JSON value a text names Off the Mode, as key paths (autoMode.environment[2]).
function namedAt(value, path = "") {
  if (typeof value === "string") return NAMES_IT.test(value) ? [path || "(the whole file)"] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => namedAt(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => [...(NAMES_IT.test(k) ? [`${path ? `${path}.` : ""}${k}`] : []), ...namedAt(v, path ? `${path}.${k}` : k)]);
  return [];
}

// Off the Mode installed for the whole account reaches the plain arm too, and the account's own files that Claude
// Code needs stay readable in the sandbox: the report says what they hold.
function leaks() {
  const home = join(homedir(), ".claude"), out = [];
  const names = (dir, depth) => !existsSync(dir) || !depth ? [] : readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => [...(NAMES_IT.test(e.name) ? [join(dir, e.name)] : []), ...(e.isDirectory() ? names(join(dir, e.name), depth - 1) : [])]);
  const md = join(home, "CLAUDE.md");
  if (existsSync(md) && NAMES_IT.test(readFileSync(md, "utf8"))) out.push("~/.claude/CLAUDE.md names Off the Mode, and the plain arm reads it");
  const found = [...names(join(home, "skills"), 3), ...names(join(home, "plugins"), 3), ...names(join(home, "commands"), 2)];
  if (found.length) out.push(`Off the Mode is installed for the whole account (${found.slice(0, 5).join(", ")}), so the plain arm has it too`);
  // Claude Code loads these in both arms, so the sandbox leaves them open; the plain arm can read them too.
  for (const [file, shown, why] of [[join(home, "settings.json"), "~/.claude/settings.json", "Claude Code loads it in both arms (auto mode's checker reads autoMode.environment)"],
    [join(homedir(), ".claude.json"), "~/.claude.json", "Claude Code needs it, so it stays open in both arms"]]) {
    let at = [];
    try { at = namedAt(JSON.parse(readFileSync(file, "utf8"))); } catch { /* no file, or not JSON */ }
    if (at.length) out.push(`${shown} names Off the Mode (${at.slice(0, 4).join(", ")}${at.length > 4 ? ` and ${at.length - 4} more` : ""}); ${why}, and the plain arm can read it`);
  }
  return out;
}

// The check and the scorer run outside the sandbox, at the start and once an arm's session has ended: nothing they
// read reaches an arm. (The scorer needs the case's folder; the setup, run while copies are made, the real project.)
async function checkAndScore(c, dir, logDir) {
  const env = caseEnv(c, dir);
  const check = await sh(c.check, { cwd: dir, env, logFile: join(logDir, "check.log") });
  const score = c.score ? await sh(c.score, { cwd: dir, env, logFile: join(logDir, "score.log") }) : null;
  return { check: { code: check.code, out: check.out.slice(-4000) }, score: score && { code: score.code, out: score.out.slice(-4000) } };
}

const nameOf = (a) => `${ARM_NAMES[a.arm]} run ${a.run} (${a.letter})`;

// Proves each fence before any token is spent: every denied place refused, every open one usable. Stops the run
// if one doesn't hold. The socket each probe serves in a denied place sits in a folder of the copies folder that no
// fence opens (a short path: a socket's path holds at most 103 bytes), removed after.
async function proveFences(c, run, w, all) {
  const sockets = join(COPIES, `.probe-${randomBytes(3).toString("hex")}`);
  const results = await Promise.all(all.map(async (x, i) => {
    const others = all.filter((o) => o !== x).map((o) => o.dir);
    const earlier = readdirSync(COPIES, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => join(COPIES, e.name))
      .filter((p) => !all.some((o) => o.place === p)).slice(0, 2);
    const repoSessions = join(PROJECTS, sessionFolderName(real(c.repo)));
    const list = probePlaces(w, x.fence, { copy: x.dir, tmp: x.tmp, others: [...others, ...earlier], caseDir: c.dir, records: run, repoSessions, socket: join(sockets, `${i}.sock`) });
    const r = await probe(profile(x.fence), list, { cwd: x.dir, env: cleanEnv(x.tmp, x.dir) });
    const lines = probeLines(r);
    writeFileSync(join(x.logDir, "sandbox-probe.txt"), lines.join("\n") + "\n");
    return { who: x.who, ok: r.ok, denied: r.results.filter((p) => p.expect === "denied").length, open: r.results.filter((p) => p.expect === "open").length, readOnly: r.results.filter((p) => p.expect === "read-only").length, lines };
  })).finally(() => rmSync(sockets, { recursive: true, force: true }));
  for (const r of results) say(`sandbox: ${r.who}: ${r.ok ? `held (${r.denied} places refused, ${r.readOnly} read only, ${r.open} open)` : "DID NOT HOLD"}`);
  const bad = results.filter((r) => !r.ok);
  if (bad.length) throw new CaseError(`the sandbox did not hold, so no arm runs:\n${bad.map((r) => `${r.who}:\n  ${r.lines.filter((l) => !/^(denied|open) /.test(l)).join("\n  ")}`).join("\n")}`);
  return results;
}

// For each run, one copy per arm; and a clean copy of the start for the baseline and the judges, with the diffs
// beside it. Every copy gets its session id and its fence now, so the probe can prove the fence before the run.
async function prepare(c, arms, runs, run) {
  const letters = pickLetters(arms.length * runs), copies = [], bin = claudeBin(), w = places(c);
  for (let n = 1; n <= runs; n++) {
    for (const arm of arms) {
      const letter = letters[copies.length], logDir = join(run, letter), place = newPlace();
      mkdirSync(logDir, { recursive: true });
      say(`${ARM_NAMES[arm]} run ${n}: making its copy`);
      const copy = await makeCopy(c, { dir: join(place, basename(c.repo)), arm, logFile: join(logDir, "setup.log") });
      copies.push({ arm, run: n, letter, logDir, place, tmp: join(place, "tmp"), sid: randomUUID(), turns: [], ...copy });
    }
  }
  const first = copies.find((a) => a.arm === "plain") ?? copies[0], place = newPlace();
  const base = { dir: join(place, basename(c.repo)), place, changesDir: join(place, "changes"), tmp: join(place, "tmp"), logDir: join(run, "base") };
  mkdirSync(base.changesDir);
  mkdirSync(base.logDir, { recursive: true });
  say("start: making a clean copy for the baseline and the judges");
  const carry = first.setupFiles.map((p) => [join(first.dir, p), p]);
  await makeCopy(c, { dir: base.dir, arm: "base", source: first.dir, commit: first.base, logFile: join(base.logDir, "setup.log"), carry });
  for (const a of copies) Object.assign(a, { who: nameOf(a), fence: fenceFor(w, { own: a.place, sid: a.sid, bin }) });
  Object.assign(base, { who: "the judges' start copy", fence: fenceFor(w, { own: place, bin }) });
  const isolation = await proveFences(c, run, w, [...copies, base]);
  return { copies, base, bin, isolation };
}

function save(run, r) {
  writeFileSync(join(run, "run.json"), JSON.stringify(r, null, 2));
  writeReport(run, r);
}

// The judges for one run: they compare that run's arms, reading masked diffs from a folder of that run's own.
async function judgeRound(c, run, r, n) {
  const arms = r.arms.filter((a) => a.run === n && a.diff).sort((a, b) => a.letter.localeCompare(b.letter));
  if (arms.length < 2) return;
  say(`judges for run ${n}: three lenses, each reading the diffs in both orders`);
  const changesDir = join(r.base.changesDir, `run-${n}`), w = places(c);
  mkdirSync(changesDir, { recursive: true });
  for (const a of arms) copyFileSync(join(a.logDir, `${a.letter}.diff`), join(changesDir, `${a.letter}.diff`));
  const profileFor = (sid) => profile(fenceFor(w, { own: r.base.place, sid, bin: r.bin }));
  const verdicts = await judge(c, arms, { changesDir, baseDir: r.base.dir, recordDir: run, file: `judges-run-${n}.json`, settings: armSettings(c), env: cleanEnv(r.base.tmp, r.base.dir), profileFor, claude: r.bin });
  for (const v of verdicts) v.tokens = v.sids.map(sessionFile).reduce((s, f) => s + (f ? sessionUsage(f).total : 0), 0);
  r.judges = [...(r.judges ?? []).filter((j) => j.run !== n), { run: n, verdicts }];
}

// Runs the judges again on a finished run, for when they failed or a lens changed; the arms are not run again.
// The judges read the start from the run's base copy, so it must still be there; the diffs come from the records.
async function rejudge(run) {
  if (!existsSync(join(run, "run.json"))) throw new CaseError(`no run.json in ${run}`);
  const r = JSON.parse(readFileSync(join(run, "run.json"), "utf8"));
  if (!existsSync(r.base?.dir ?? "")) throw new CaseError(`this run's start copy is gone (${r.base?.dir}), so the judges have no code to read`);
  if (!r.runs) throw new CaseError("this run was made by an older eval (one run per arm, no sandbox); make a new run");
  const c = loadCase(r.caseDir);
  useCopies(c);
  logTo(join(run, "eval.log"));
  for (let n = 1; n <= r.runs; n++) await judgeRound(c, run, r, n);
  save(run, r);
  say(`done: ${join(run, "report.md")}`);
}

// One arm from its first turn to its score. A failure stays with that arm: the others run on.
async function playArm(c, a, bin, save) {
  try {
    Object.assign(a, await driveArm({ c, arm: a.arm, run: a.run, dir: a.dir, base: a.base, logDir: a.logDir, tmp: a.tmp, settings: armSettings(c), sid: a.sid, profile: profile(a.fence), claude: bin }));
    a.diff = writeDiffs(a, a.logDir);
    Object.assign(a, await checkAndScore(c, a.dir, a.logDir));
    const file = sessionFile(a.sid);
    a.usage = file ? sessionUsage(file) : null;
    a.hurdles = file ? sessionHurdles(file) : null;
    say(`${a.who}: ${a.usage ? M(a.usage.total) : "?"} read, check ${a.check.code === 0 ? "passed" : "failed"}`);
  } catch (e) {
    a.error = String(e.stack ?? e);
    say(`${a.who}: failed: ${String(e.message ?? e).slice(0, 300)}`);
  }
  save();
}

function startWarnings(copies) {
  const out = [...new Set(copies.filter((a) => a.mentions.length).map((a) => a.mentions.join(", ")))]
    .map((m) => `the plain copy still names Off the Mode in ${m} (the case's setup can change that)`);
  const newer = [...new Set(copies.flatMap((a) => a.newer ?? []))];
  if (newer.length) out.push(`what the case copies from the project holds ${newer.length} files written after the case's commit, which may record later work: ${newer.slice(0, 5).join(", ")}${newer.length > 5 ? " and more" : ""}. The case can build such a folder with its install (npm ci) instead of copying it`);
  for (const a of copies.slice(1)) {
    const differ = startDifferences(copies[0].dir, a.dir);
    if (differ.length) out.push(`${a.who} starts differently from ${copies[0].who} outside Off the Mode's own files: ${differ.slice(0, 8).join(", ")}`);
  }
  return out;
}

async function runCase(arg, opts) {
  if (!canSandbox()) throw new CaseError("the eval keeps every arm in a macOS sandbox (sandbox-exec), so it runs on a Mac only");
  const c = loadCase(arg);
  const arms = opts.arms ? opts.arms.split(",") : c.arms;
  if (!arms.length || arms.some((a) => !ARM_NAMES[a])) throw new CaseError(`--arms takes ${Object.keys(ARM_NAMES).join(",")}`);
  const runs = Number(opts.runs ?? 2);
  if (!Number.isInteger(runs) || runs < 1 || runs * arms.length > 17) throw new CaseError("--runs takes a whole number, from 1 to 17 copies in all (there are 17 blind letters)");
  useCopies(c);
  const started = new Date();
  let run = join(WORK, c.name, started.toLocaleString("sv-SE").slice(0, 16).replace(":", "").replace(" ", "-"));
  while (existsSync(run)) run += "+";
  mkdirSync(run, { recursive: true });
  logTo(join(run, "eval.log"));
  if (process.platform === "darwin") spawn("caffeinate", ["-i", "-w", String(process.pid)], { stdio: "ignore" }).unref();
  const warnings = leaks();
  warnings.forEach((w) => say(`warning: ${w}`));
  if (runs === 1) warnings.push("one run per arm: there is no spread, so no difference in this report is a result");

  const { copies, base, bin, isolation } = await prepare(c, arms, runs, run);
  for (const w of startWarnings(copies)) { warnings.push(w); say(`warning: ${w}`); }
  say("start: running the check and the scorer");
  const r = { case: c.name, caseDir: c.dir, started: started.toISOString(), steps: c.steps.map((s) => ({ ask: s.askText, replies: s.replyTexts.length })),
    model: c.model, settings: armSettings(c), runs, bin, isolation, baseline: await checkAndScore(c, base.dir, base.logDir), base, arms: copies, warnings, judges: null };
  writeFileSync(join(run, "key.json"), JSON.stringify(Object.fromEntries(copies.map((a) => [a.letter, { arm: a.arm, run: a.run }]))) + "\n");
  save(run, r);
  if (opts.prepare) return say(`prepared, no tokens spent: ${join(run, "report.md")}`);

  // The runs go one after another; within a run the arms go side by side, so both meet the same hour and load.
  for (let n = 1; n <= runs; n++) {
    const round = copies.filter((a) => a.run === n);
    say(`run ${n} of ${runs}: driving ${round.map((a) => ARM_NAMES[a.arm]).join(" and ")} side by side`);
    await Promise.all(round.map((a) => playArm(c, a, bin, () => save(run, r))));
  }
  if (c.judge && !opts["no-judge"]) for (let n = 1; n <= runs; n++) await judgeRound(c, run, r, n);
  save(run, r);
  say(`done: ${join(run, "report.md")}`);
}

const HELP = `npm run eval -- <case> [--arms plain,otm] [--runs N] [--prepare] [--no-judge]
npm run eval -- --rejudge <run folder>
npm run eval -- --measure <session .jsonl>
npm run eval -- --make-smoke
cases: ${CASES} · records: ${WORK} · copies: ${COPIES}`;

try {
  const { values: opts, positionals } = parseArgs({ allowPositionals: true, options: {
    arms: { type: "string" }, runs: { type: "string" }, prepare: { type: "boolean" }, "no-judge": { type: "boolean" },
    measure: { type: "string" }, rejudge: { type: "string" }, "make-smoke": { type: "boolean" }, help: { type: "boolean" } } });
  if (opts.measure && !existsSync(opts.measure)) throw new CaseError(`no session file at ${opts.measure}`);
  if (opts.measure) printUsage(opts.measure);
  else if (opts.rejudge) await rejudge(opts.rejudge);
  else if (opts["make-smoke"]) console.log(`smoke case written: ${makeSmoke(CASES)}\nrun it: npm run eval -- smoke`);
  else if (positionals.length === 1 && !opts.help) await runCase(positionals[0], opts);
  else console.log(HELP);
} catch (e) {
  console.error(e instanceof CaseError || e.code === "ERR_PARSE_ARGS_UNKNOWN_OPTION" ? `eval: ${e.message}` : e);
  process.exit(1);
}
