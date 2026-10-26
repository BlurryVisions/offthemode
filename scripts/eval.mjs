// npm run eval: replays one real ask through plain Claude Code and through Off the Mode, then measures and scores both.
//   npm run eval -- <case> [--arms plain,otm] [--prepare] [--no-judge]
//   npm run eval -- --rejudge <run folder>      runs the blind judges again on a finished run
//   npm run eval -- --measure <session .jsonl>   a session's tokens per main chat, agent, workflow and turn
//   npm run eval -- --make-smoke                 writes the smoke case, a tiny project, to the cases folder
// A case is a folder outside this repo ($OTM_EVAL_CASES, default ~/.offthemode/evals; its fields are in
// scripts/eval/case.mjs). A run's records go to $OTM_EVAL_WORK (default ~/offthemode-evals); its copies go to
// $OTM_EVAL_COPIES (default ~/work-copies), each alone in a folder with a random name inside a folder that can't be
// listed, and each arm's file tools are denied the records, the cases, the real project and the other copies.
// Never /tmp, which macOS empties after 3 days.
// --prepare makes the copies and runs the check and scorer at the start, for no tokens.
import { parseArgs } from "node:util";
import { spawn } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";
import { randomBytes } from "node:crypto";
import { loadCase, CASES, CaseError, ARM_NAMES, caseEnv } from "./eval/case.mjs";
import { makeCopy, startDifferences } from "./eval/copy.mjs";
import { driveArm, cleanEnv } from "./eval/drive.mjs";
import { sessionFile, sessionUsage, printUsage } from "./eval/measure.mjs";
import { writeDiffs, pickLetters, judge } from "./eval/blind.mjs";
import { writeReport } from "./eval/report.mjs";
import { makeSmoke } from "./eval/smoke.mjs";
import { sh, say, logTo, M } from "./eval/run.mjs";

const WORK = process.env.OTM_EVAL_WORK ?? join(homedir(), "offthemode-evals");
const COPIES = process.env.OTM_EVAL_COPIES ?? join(homedir(), "work-copies");
const PROJECTS = join(homedir(), ".claude", "projects");
const NAMES_IT = /offthemode|off[\s_-]*the[\s_-]*mode|revisit-(checklist|state|comments|glossary)|view-project|reassess/i;

// A folder with a random name, holding one copy and its scratch folder (private, as Claude Code asks). The folder
// above can be entered but not listed (write and enter, no read), so an arm can't find the other copies.
function newPlace() {
  const place = join(COPIES, randomBytes(4).toString("hex"));
  mkdirSync(join(place, "tmp"), { recursive: true, mode: 0o700 });
  chmodSync(COPIES, 0o300);
  return place;
}

// Every copy folder there is, this run's and earlier runs' (the folder above them can't be listed, so it is opened
// for the moment it takes to read it).
function allPlaces() {
  if (!existsSync(COPIES)) return [];
  chmodSync(COPIES, 0o700);
  try { return readdirSync(COPIES).map((n) => join(COPIES, n)); } finally { chmodSync(COPIES, 0o300); }
}

// The places a session must not read: the records (the key), the cases (the owner's goals), the real project (its
// later commits), every copy but its own (earlier runs hold finished answers to the same ask), and Claude Code's
// session folders for the real project and those copies (the owner's real sessions, the other arm's live chat).
// Deny rules cover the file tools; a shell command can still reach them.
function fenced(c, places, own) {
  const others = [...new Set([...places, ...allPlaces()])].filter((p) => p !== own);
  const sessions = [c.repo, ...others].map((p) => `${join(PROJECTS, p.replace(/[^a-zA-Z0-9]/g, "-"))}*`);
  const deny = [WORK, CASES, c.repo, ...others, ...sessions].flatMap((p) => [`Read(/${p}/**)`, `Edit(/${p}/**)`]);
  const extra = c.settings.permissions ?? {};
  return { ...c.settings, permissions: { ...extra, deny: [...(extra.deny ?? []), ...deny] } };
}

// Off the Mode installed for the whole account reaches the plain arm too: the report says so.
function leaks() {
  const home = join(homedir(), ".claude"), out = [];
  const names = (dir, depth) => !existsSync(dir) || !depth ? [] : readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => [...(NAMES_IT.test(e.name) ? [join(dir, e.name)] : []), ...(e.isDirectory() ? names(join(dir, e.name), depth - 1) : [])]);
  const md = join(home, "CLAUDE.md");
  if (existsSync(md) && NAMES_IT.test(readFileSync(md, "utf8"))) out.push("~/.claude/CLAUDE.md names Off the Mode, and the plain arm reads it");
  const found = [...names(join(home, "skills"), 3), ...names(join(home, "plugins"), 3), ...names(join(home, "commands"), 2)];
  if (found.length) out.push(`Off the Mode is installed for the whole account (${found.slice(0, 5).join(", ")}), so the plain arm has it too`);
  return out;
}

async function checkAndScore(c, dir, logDir) {
  const env = caseEnv(c, dir);
  const check = await sh(c.check, { cwd: dir, env, logFile: join(logDir, "check.log") });
  const score = c.score ? await sh(c.score, { cwd: dir, env, logFile: join(logDir, "score.log") }) : null;
  return { check: { code: check.code, out: check.out.slice(-4000) }, score: score && { code: score.code, out: score.out.slice(-4000) } };
}

// One copy per arm and a clean copy of the start for the baseline and the judges, with the diffs beside it.
async function prepare(c, arms, run) {
  const letters = pickLetters(arms.length), copies = [];
  for (const [i, arm] of arms.entries()) {
    const logDir = join(run, letters[i]), place = newPlace();
    mkdirSync(logDir, { recursive: true });
    say(`${ARM_NAMES[arm]}: making its copy`);
    const copy = await makeCopy(c, { dir: join(place, basename(c.repo)), arm, logFile: join(logDir, "setup.log") });
    copies.push({ arm, letter: letters[i], logDir, place, tmp: join(place, "tmp"), turns: [], ...copy });
  }
  const first = copies.find((a) => a.arm === "plain") ?? copies[0], place = newPlace();
  const base = { dir: join(place, basename(c.repo)), place, changesDir: join(place, "changes"), tmp: join(place, "tmp") };
  mkdirSync(base.changesDir);
  mkdirSync(join(run, "base"), { recursive: true });
  say("start: making a clean copy for the baseline and the judges");
  const carry = first.setupFiles.map((p) => [join(first.dir, p), p]);
  await makeCopy(c, { dir: base.dir, arm: "base", source: first.dir, commit: first.base, logFile: join(run, "base", "setup.log"), carry });
  const places = [...copies.map((a) => a.place), place];
  for (const a of copies) a.settings = fenced(c, places, a.place);
  base.settings = fenced(c, places, place);
  return { copies, base };
}

function save(run, r) {
  writeFileSync(join(run, "run.json"), JSON.stringify(r, null, 2));
  writeReport(run, r);
}

async function judgeRun(c, run, r) {
  say("judges: three lenses, each reading the diffs in both orders");
  const arms = [...r.arms].sort((a, b) => a.letter.localeCompare(b.letter));
  r.judges = await judge(c, arms, { changesDir: r.base.changesDir, baseDir: r.base.dir, recordDir: run, settings: r.base.settings, env: cleanEnv(r.base.tmp, r.base.dir) });
  for (const v of r.judges) v.tokens = v.sids.map(sessionFile).reduce((s, f) => s + (f ? sessionUsage(f).total : 0), 0);
}

// Runs the judges again on a finished run, for when they failed or a lens changed; the arms are not run again.
// The judges read the start from the run's base copy, so it must still be there; the diffs come from the records.
async function rejudge(run) {
  if (!existsSync(join(run, "run.json"))) throw new CaseError(`no run.json in ${run}`);
  const r = JSON.parse(readFileSync(join(run, "run.json"), "utf8"));
  if (!existsSync(r.base?.dir ?? "")) throw new CaseError(`this run's start copy is gone (${r.base?.dir}), so the judges have no code to read`);
  mkdirSync(r.base.changesDir, { recursive: true });
  for (const a of r.arms.filter((x) => x.diff)) copyFileSync(join(a.logDir, `${a.letter}.diff`), join(r.base.changesDir, `${a.letter}.diff`));
  logTo(join(run, "eval.log"));
  await judgeRun(loadCase(r.caseDir), run, r);
  save(run, r);
  say(`done: ${join(run, "report.md")}`);
}

// One arm from its first turn to its score. A failure stays with that arm: the other one runs on. Its masked diff
// waits in the records until both arms are done, so the slower arm can't read the faster one's answer.
async function playArm(c, a, save) {
  try {
    Object.assign(a, await driveArm({ c, arm: a.arm, dir: a.dir, base: a.base, logDir: a.logDir, tmp: a.tmp, settings: a.settings }));
    a.diff = writeDiffs(a, a.logDir);
    Object.assign(a, await checkAndScore(c, a.dir, a.logDir));
    const file = sessionFile(a.sid);
    a.usage = file ? sessionUsage(file) : null;
    say(`${ARM_NAMES[a.arm]}: ${a.usage ? M(a.usage.total) : "?"} read, check ${a.check.code === 0 ? "passed" : "failed"}`);
  } catch (e) {
    a.error = String(e.stack ?? e);
    say(`${ARM_NAMES[a.arm]}: failed: ${String(e.message ?? e).slice(0, 300)}`);
  }
  save();
}

function startWarnings(copies) {
  const out = copies.filter((a) => a.mentions.length)
    .map((a) => `the plain copy still names Off the Mode in ${a.mentions.join(", ")} (the case's setup can change that)`);
  if (copies.length === 2) {
    const differ = startDifferences(copies[0].dir, copies[1].dir);
    if (differ.length) out.push(`the two copies start differently outside Off the Mode's own files: ${differ.slice(0, 8).join(", ")}`);
  }
  return out;
}

async function runCase(arg, opts) {
  const c = loadCase(arg);
  const arms = opts.arms ? opts.arms.split(",") : c.arms;
  if (!arms.length || arms.some((a) => !ARM_NAMES[a])) throw new CaseError(`--arms takes ${Object.keys(ARM_NAMES).join(",")}`);
  const started = new Date();
  let run = join(WORK, c.name, started.toLocaleString("sv-SE").slice(0, 16).replace(":", "").replace(" ", "-"));
  while (existsSync(run)) run += "+";
  mkdirSync(run, { recursive: true });
  logTo(join(run, "eval.log"));
  if (process.platform === "darwin") spawn("caffeinate", ["-i", "-w", String(process.pid)], { stdio: "ignore" }).unref();
  const warnings = leaks();
  warnings.forEach((w) => say(`warning: ${w}`));

  const { copies, base } = await prepare(c, arms, run);
  for (const w of startWarnings(copies)) { warnings.push(w); say(`warning: ${w}`); }
  say("start: running the check and the scorer");
  const r = { case: c.name, caseDir: c.dir, started: started.toISOString(), ask: c.askText, replies: c.replyTexts.length, model: c.model,
    settings: c.settings, baseline: await checkAndScore(c, base.dir, join(run, "base")), base, arms: copies, warnings, judges: null };
  writeFileSync(join(run, "key.json"), JSON.stringify(Object.fromEntries(copies.map((a) => [a.letter, a.arm]))) + "\n");
  save(run, r);
  if (opts.prepare) return say(`prepared, no tokens spent: ${join(run, "report.md")}`);

  say(`driving ${copies.map((a) => ARM_NAMES[a.arm]).join(" and ")} side by side`);
  await Promise.all(copies.map((a) => playArm(c, a, () => save(run, r))));
  for (const a of copies.filter((x) => x.diff)) copyFileSync(join(a.logDir, `${a.letter}.diff`), join(base.changesDir, `${a.letter}.diff`));
  if (c.judge && !opts["no-judge"] && copies.filter((a) => a.diff).length > 1) await judgeRun(c, run, r);
  save(run, r);
  say(`done: ${join(run, "report.md")}`);
}

const HELP = `npm run eval -- <case> [--arms plain,otm] [--prepare] [--no-judge]
npm run eval -- --rejudge <run folder>
npm run eval -- --measure <session .jsonl>
npm run eval -- --make-smoke
cases: ${CASES} · records: ${WORK} · copies: ${COPIES}`;

try {
  const { values: opts, positionals } = parseArgs({ allowPositionals: true, options: {
    arms: { type: "string" }, prepare: { type: "boolean" }, "no-judge": { type: "boolean" },
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
