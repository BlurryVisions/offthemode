// npm run eval: replays one real ask through plain Claude Code and through Off the Mode, then measures and scores both.
//   npm run eval -- <case> [--arms plain,otm] [--prepare] [--no-judge]
//   npm run eval -- --rejudge <run folder>      runs the blind judges again on a finished run
//   npm run eval -- --measure <session .jsonl>   a session's tokens per main chat, agent, workflow and turn
//   npm run eval -- --make-smoke                 writes the smoke case, a tiny project, to the cases folder
// A case is a folder outside this repo ($OTM_EVAL_CASES, default ~/.offthemode/evals; its fields are in
// scripts/eval/case.mjs). Runs go to $OTM_EVAL_WORK (default ~/offthemode-evals), never to /tmp, which macOS
// empties after 3 days. --prepare makes the copies and runs the check and scorer at the start, for no tokens.
import { parseArgs } from "node:util";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";
import { loadCase, CASES, CaseError, ARM_NAMES, caseEnv } from "./eval/case.mjs";
import { makeCopy } from "./eval/copy.mjs";
import { driveArm, cleanEnv } from "./eval/drive.mjs";
import { sessionFile, sessionUsage, printUsage } from "./eval/measure.mjs";
import { writeDiffs, pickLetters, judge } from "./eval/blind.mjs";
import { writeReport } from "./eval/report.mjs";
import { makeSmoke } from "./eval/smoke.mjs";
import { sh, say, logTo, M } from "./eval/run.mjs";

const WORK = process.env.OTM_EVAL_WORK ?? join(homedir(), "offthemode-evals");

// Off the Mode installed for the whole account reaches the plain arm too: the report says so.
function leaks() {
  const home = join(homedir(), ".claude"), out = [];
  const md = join(home, "CLAUDE.md");
  if (existsSync(md) && /offthemode|off the mode/i.test(readFileSync(md, "utf8"))) out.push("~/.claude/CLAUDE.md names Off the Mode, and the plain arm reads it");
  const skills = existsSync(join(home, "skills")) ? readdirSync(join(home, "skills")).filter((n) => /offthemode|revisit-|reassess|view-project/.test(n)) : [];
  if (skills.length) out.push(`Off the Mode's skills are installed for the whole account (${skills.join(", ")}), so the plain arm has them too`);
  return out;
}

async function checkAndScore(c, dir, logDir) {
  const env = caseEnv(c, dir);
  const check = await sh(c.check, { cwd: dir, env, logFile: join(logDir, "check.log") });
  const score = c.score ? await sh(c.score, { cwd: dir, env, logFile: join(logDir, "score.log") }) : null;
  return { check: { code: check.code, out: check.out.slice(-4000) }, score: score && { code: score.code, out: score.out.slice(-4000) } };
}

// One copy per arm, each in a folder named by its blind letter, and a clean copy of the start for the judges.
async function prepare(c, arms, run) {
  const letters = pickLetters(arms.length), copies = [];
  for (const [i, arm] of arms.entries()) {
    const logDir = join(run, letters[i]);
    mkdirSync(logDir, { recursive: true });
    say(`${ARM_NAMES[arm]}: making its copy`);
    const copy = await makeCopy(c, { dir: join(logDir, basename(c.repo)), arm, logFile: join(logDir, "setup.log") });
    copies.push({ arm, letter: letters[i], logDir, turns: [], ...copy });
  }
  const first = copies.find((a) => a.arm === "plain") ?? copies[0];
  const baseDir = join(run, "base", basename(c.repo));
  mkdirSync(join(run, "base"), { recursive: true });
  say("start: making a clean copy for the baseline and the judges");
  await makeCopy(c, { dir: baseDir, arm: "base", source: first.dir, commit: first.base, logFile: join(run, "base", "setup.log") });
  return { copies, baseDir };
}

function save(run, r) {
  writeFileSync(join(run, "run.json"), JSON.stringify(r, null, 2));
  writeReport(run, r);
}

async function judgeRun(c, run, r) {
  say("judges: three lenses, each reading the diffs in both orders");
  r.judges = await judge(c, r.arms, join(run, "blind"), join(run, "base", basename(c.repo)), cleanEnv());
  for (const v of r.judges) v.tokens = v.sids.map(sessionFile).reduce((s, f) => s + (f ? sessionUsage(f).total : 0), 0);
}

// Runs the judges again on a finished run, for when they failed or a lens changed; the arms are not run again.
async function rejudge(run) {
  if (!existsSync(join(run, "run.json"))) throw new CaseError(`no run.json in ${run}`);
  const r = JSON.parse(readFileSync(join(run, "run.json"), "utf8"));
  logTo(join(run, "eval.log"));
  await judgeRun(loadCase(r.caseDir), run, r);
  save(run, r);
  say(`done: ${join(run, "report.md")}`);
}

async function playArm(c, a, blindDir, save) {
  Object.assign(a, await driveArm({ c, arm: a.arm, dir: a.dir, base: a.base, logDir: a.logDir }));
  a.diff = writeDiffs(a, blindDir);
  Object.assign(a, await checkAndScore(c, a.dir, a.logDir));
  const file = sessionFile(a.sid);
  a.usage = file ? sessionUsage(file) : null;
  say(`${ARM_NAMES[a.arm]}: ${a.usage ? M(a.usage.total) : "?"} read, check ${a.check.code === 0 ? "passed" : "failed"}`);
  save();
}

async function runCase(arg, opts) {
  const c = loadCase(arg);
  const arms = opts.arms ? opts.arms.split(",") : c.arms;
  if (!arms.length || arms.some((a) => !ARM_NAMES[a])) throw new CaseError(`--arms takes ${Object.keys(ARM_NAMES).join(",")}`);
  const started = new Date();
  let run = join(WORK, c.name, started.toLocaleString("sv-SE").slice(0, 16).replace(":", "").replace(" ", "-"));
  while (existsSync(run)) run += "+";
  const blindDir = join(run, "blind");
  mkdirSync(blindDir, { recursive: true });
  logTo(join(run, "eval.log"));
  if (process.platform === "darwin") spawn("caffeinate", ["-i", "-w", String(process.pid)], { stdio: "ignore" }).unref();
  const warnings = leaks();
  warnings.forEach((w) => say(`warning: ${w}`));

  const { copies, baseDir } = await prepare(c, arms, run);
  for (const a of copies.filter((x) => x.mentions.length)) warnings.push(`the plain copy still names Off the Mode in ${a.mentions.join(", ")} (plainSetup can change that)`);
  say("start: running the check and the scorer");
  const r = { case: c.name, caseDir: c.dir, started: started.toISOString(), ask: c.askText, replies: c.replyTexts.length, model: c.model, settings: c.settings,
    baseline: await checkAndScore(c, baseDir, join(run, "base")), arms: copies, warnings, judges: null };
  writeFileSync(join(run, "key.json"), JSON.stringify(Object.fromEntries(copies.map((a) => [a.letter, a.arm]))) + "\n");
  save(run, r);
  if (opts.prepare) return say(`prepared, no tokens spent: ${join(run, "report.md")}`);

  say(`driving ${copies.map((a) => ARM_NAMES[a.arm]).join(" and ")} side by side`);
  await Promise.all(copies.map((a) => playArm(c, a, blindDir, () => save(run, r))));
  if (c.judge && !opts["no-judge"] && copies.length > 1) await judgeRun(c, run, r);
  save(run, r);
  say(`done: ${join(run, "report.md")}`);
}

const HELP = `npm run eval -- <case> [--arms plain,otm] [--prepare] [--no-judge]
npm run eval -- --rejudge <run folder>
npm run eval -- --measure <session .jsonl>
npm run eval -- --make-smoke
cases: ${CASES} · runs: ${WORK}`;

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
