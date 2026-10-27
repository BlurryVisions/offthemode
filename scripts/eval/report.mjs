// The run's short report, in plain words, most trustworthy first: the case's own scorer (a script: the same code
// always gets the same number), the owner's hurdles counted from the session files, the cost, and only then the
// blind judges, whose scores move for the same diff. Every number is shown per run with its spread, because a
// difference smaller than the spread between runs of one arm is noise, not a result.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARM_NAMES } from "./case.mjs";
import { HURDLES } from "./hurdles.mjs";
import { M } from "./run.mjs";

const tail = (text, n = 12) => (text ?? "").trim().split("\n").slice(-n).join("\n");
const round = (x) => Math.round(x * 10) / 10;
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

// A scorer's result: its SUMMARY lines (a scorer prints them last, so a short tail still holds them), or else its
// last line.
export function summaryOf(out) {
  const lines = (out ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const marked = lines.filter((l) => /^SUMMARY\b/.test(l));
  return (marked.length ? marked : lines.slice(-1)).join(" | ");
}
const NUMBER = /-?\d+(?:\.\d+)?/g;
export const numbersOf = (line) => (line.match(NUMBER) ?? []).map(Number);
export const shapeOf = (line) => { let i = 0; return line.replace(NUMBER, () => `#${++i}`); };

// A summary's parts, split at " · " (and at " | " between SUMMARY lines), each named by its words with the numbers
// taken out, so runs are matched part by part: a part only some runs print (" · 2 fixes not scored") leaves the
// others comparable. A name that repeats in one summary gets its place added.
export function partsOf(summary) {
  const seen = new Map();
  return summary.split(/ [·|] /).map((text) => {
    const shape = shapeOf(text.trim()), n = (seen.get(shape) ?? 0) + 1;
    seen.set(shape, n);
    return { key: n > 1 ? `${shape} (${n})` : shape, numbers: numbersOf(text) };
  });
}

// A run that stopped early (it could not start, exited, hung or passed stopAt), failed in the eval, or never
// answered is not a sample of its arm: its copy holds none or part of the work. It is shown, but left out of every
// comparison.
export const fullRun = (a) => !a.error && !a.stoppedBy && (a.turns ?? []).some((t) => t.text);
const whyNotFull = (a) => (a.error ? "the eval failed on it" : a.stoppedBy ? `stopped early: ${a.stoppedBy}` : "it never answered");

// Two arms' values for one measure, one per run: the difference of their means against the spread (the widest
// range of one arm's own runs). Only a difference bigger than the spread is a result. An arm with no value (no full
// run) makes no result either.
export function compare(values) {
  const all = Object.keys(values), arms = all.filter((k) => values[k].length), none = all.filter((k) => !values[k].length);
  const shown = arms.map((k) => `${ARM_NAMES[k] ?? k} ${values[k].map(round).join(", ")}`).join(" · ") || "no full run";
  if (all.length < 2) return { shown, verdict: "" };
  if (none.length) return { shown, verdict: `no full run of ${none.map((k) => ARM_NAMES[k] ?? k).join(" or ")}, so not a result` };
  if (arms.some((k) => values[k].length < 2)) return { shown, verdict: "one run: no spread, so not a result" };
  const [a, b] = arms, diff = round(mean(values[b]) - mean(values[a]));
  const spread = round(Math.max(...arms.map((k) => Math.max(...values[k]) - Math.min(...values[k]))));
  const said = `${ARM_NAMES[b]} minus ${ARM_NAMES[a]} ${diff > 0 ? "+" : ""}${diff}, spread ${spread}`;
  return { shown, diff, spread, result: Math.abs(diff) > spread, verdict: `${said}: ${Math.abs(diff) > spread ? "a result" : "within the spread, not a result"}` };
}

// Each arm's values, one per run; kinds: every arm the run has, so an arm left with no value still shows.
const byArm = (arms, get, kinds = []) => {
  const out = Object.fromEntries(kinds.map((k) => [k, []]));
  for (const a of arms) {
    const v = get(a);
    out[a.arm] ??= [];
    if (Number.isFinite(v)) out[a.arm].push(v);
  }
  return out;
};
const line = (label, c) => `- ${label}: ${c.shown}${c.verdict ? `. ${c.verdict}.` : ""}`;

function minutes(turns) {
  return turns.reduce((s, t) => s + (Date.parse(t.ended ?? t.sent) - Date.parse(t.sent)), 0) / 60000;
}
function lastWords(text) {
  const words = (text ?? "").trim().split("\n").filter(Boolean).slice(-3).join(" ");
  return words.length > 300 ? `…${words.slice(-300)}` : words;
}
function checkLine(check) {
  if (!check) return "not run";
  return check.code === 0 ? "passed" : `failed (exit ${check.code}); the end of its output:\n\n\`\`\`\n${tail(check.out)}\n\`\`\``;
}
const order = (arms) => [...arms].sort((a, b) => Object.keys(ARM_NAMES).indexOf(a.arm) - Object.keys(ARM_NAMES).indexOf(b.arm) || a.run - b.run);
const who = (a) => `${ARM_NAMES[a.arm]} run ${a.run} (${a.letter})`;

function scoreSection(r, arms, kinds) {
  const out = ["## Scripted scores: the case's own scorer and the project's check (the same code always gets the same number)"];
  const left = arms.filter((a) => (a.error || a.stoppedBy || a.turns?.length) && !fullRun(a)); // played, but not in full
  if (left.length) out.push(`- Not full runs, so left out of every comparison in this report: ${left.map((a) => `${who(a)} (${whyNotFull(a)})`).join(", ")}.`);
  const base = r.baseline?.score ? summaryOf(r.baseline.score.out) : null;
  out.push(`- At the start: ${base ? `\`${base}\`` : "no scorer"} · check ${r.baseline?.check ? (r.baseline.check.code === 0 ? "passed" : "failed") : "not run"}`);
  const done = arms.filter((a) => a.check);
  for (const a of done) out.push(`- ${who(a)}: ${a.score ? `\`${summaryOf(a.score.out)}\`${a.score.code ? ` (the scorer exited ${a.score.code})` : ""}` : "no scorer"} · check ${a.check.code === 0 ? "passed" : "failed"}${fullRun(a) ? "" : " (not a full run)"}`);
  const full = done.filter(fullRun);
  const scored = full.filter((a) => a.score && a.score.code === 0).map((a) => ({ arm: a.arm, a, parts: partsOf(summaryOf(a.score.out)) }));
  const part = (s, key) => s.parts.find((p) => p.key === key);
  const keys = [...new Set(scored.flatMap((s) => s.parts.map((p) => p.key)))];
  const shared = keys.filter((k) => scored.every((s) => part(s, k)) && part(scored[0], k).numbers.length);
  if (shared.length) out.push("- Compared, number by number (#1, #2… are the numbers in each part of the scorer's summary):");
  for (const k of shared) {
    out.push(`  - \`${k}\``);
    part(scored[0], k).numbers.forEach((_, i) => out.push(`    ${line(`#${i + 1}`, compare(byArm(scored, (s) => part(s, k).numbers[i], kinds)))}`));
  }
  for (const k of keys.filter((x) => !scored.every((s) => part(s, x)))) {
    out.push(`- Only in some runs' summaries, so not compared: \`${k}\` (${scored.filter((s) => part(s, k)).map((s) => `${who(s.a)}: ${part(s, k).numbers.join(", ") || "present"}`).join(" · ")})`);
  }
  if (scored.length && !shared.length) out.push("- The scorer's summary lines share no part with numbers between runs, so they are compared by eye.");
  if (done.length) out.push(line("check passed (1 yes, 0 no)", compare(byArm(full, (a) => Number(a.check.code === 0), kinds))));
  return out.join("\n");
}

function hurdleSection(arms, kinds) {
  if (!arms.some((a) => a.hurdles)) return "";
  const measured = arms.filter((a) => a.hurdles && fullRun(a));
  const out = ["## The owner's hurdles, counted in each arm's session file (the patterns are in scripts/eval/hurdles.mjs)"];
  for (const [key, what] of HURDLES) out.push(line(what, compare(byArm(measured, (a) => a.hurdles[key], kinds))));
  return out.join("\n");
}

function costSection(arms, kinds) {
  if (!arms.some((a) => a.usage)) return "";
  const ran = arms.filter((a) => a.usage && fullRun(a));
  return ["## Cost",
    line("tokens read, in millions", compare(byArm(ran, (a) => a.usage.total / 1e6, kinds))),
    line("agents", compare(byArm(ran, (a) => a.usage.agents, kinds))),
    line("minutes working", compare(byArm(ran, (a) => minutes(a.turns), kinds))),
  ].join("\n");
}

function judgeSection(rounds, arms, kinds) {
  if (!rounds?.length) return "";
  const named = Object.fromEntries(arms.map((a) => [a.letter, `${ARM_NAMES[a.arm]}${fullRun(a) ? "" : " (not a full run)"}`]));
  const out = ["## Blind judges: the noisy part (scores 1-10, each the mean of two readings in opposite orders; findings in judges-run-N.json)",
    "The same diff has scored 1 to 3 points apart from one judging to the next. Trust the scripted scores and hurdles first; read a judge's findings before its number."];
  for (const { run, verdicts } of [...rounds].sort((a, b) => a.run - b.run)) {
    out.push(`Run ${run}:`);
    for (const v of verdicts) out.push(v.error
      ? `- ${v.name}: the judge failed (${v.error.slice(0, 200)})`
      : `- ${v.name}: ${v.ranking.map((l) => `${named[l] ?? l} ${v.scores[l] ?? "?"}`).join(", ")} (${v.tie ? "a tie" : v.agree ? "both reading orders agree" : "the two reading orders disagree, so treat it as a tie"}). ${v.verdict ?? ""}`);
  }
  const lenses = [...new Map(rounds.flatMap((x) => x.verdicts.filter((v) => !v.error).map((v) => [v.lens, v.name]))).entries()];
  if (rounds.length > 1) for (const [lens, name] of lenses) {
    const scores = Object.fromEntries(kinds.map((k) => [k, []]));
    for (const { verdicts } of rounds) for (const v of verdicts.filter((x) => x.lens === lens && !x.error)) {
      for (const a of arms.filter((x) => v.scores[x.letter] != null && fullRun(x))) (scores[a.arm] ??= []).push(v.scores[a.letter]);
    }
    out.push(line(`${name}, across runs`, compare(scores)));
  }
  const tokens = rounds.flatMap((x) => x.verdicts).reduce((s, v) => s + (v.tokens ?? 0), 0);
  out.push(`- The judges read ${M(tokens)} in all.`);
  return out.join("\n");
}

function runSection(a) {
  const u = a.usage, d = a.diff, h = a.hurdles;
  const out = [`### ${who(a)}`];
  if (u) {
    out.push(`- Tokens read: ${M(u.total)}. Main chat ${M(u.main)}; ${u.agents} agents ${M(u.agentsTotal)}.`);
    for (const w of u.workflows) out.push(`  - workflow ${w.name}: ${w.agents} agents, ${M(w.total)}`);
  }
  const mins = minutes(a.turns);
  out.push(`- Time working: ${mins < 2 ? `${Math.round(mins * 60)} s` : `${Math.round(mins)} min`} over ${a.turns.length} turns.`);
  a.turns.forEach((t, i) => {
    const hh = h?.perTurn?.[i];
    const said = [t.kind ? (t.kind === "ask" ? `ask ${t.step}` : `a reply to ask ${t.step}`) : null, t.asked ? "ended asking the owner" : "no question",
      hh?.goAhead && "asked to start, commit or push", hh?.ids && `${hh.ids} internal ids (${hh.idsSeen.join(", ")})`, hh && `${hh.chars} characters`,
      hh?.steps && `${hh.steps} hand steps ("${hh.stepLines[0]}")`, `${t.changed} files changed by its end`, t.error && `ended with ${t.error}`];
    out.push(`  - turn ${i + 1}: ${said.filter(Boolean).join(", ")}`);
  });
  if (a.error) out.push(`- The eval failed on this run: ${a.error.split("\n")[0]}`);
  if (a.stoppedBy) out.push(`- Stopped early: ${a.stoppedBy}. This run is not a full sample, so it is left out of the comparisons.`);
  else if (!a.error && a.turns.length && !fullRun(a)) out.push("- It never answered, so it is left out of the comparisons.");
  if (a.openTasks?.length) out.push(`- Still running when the session closed: ${a.openTasks.join("; ")}.`);
  if (a.denials) out.push(`- Actions the permission check refused: ${a.denials}.`);
  if (d) out.push(`- Changes: ${d.files} files, +${d.added} −${d.removed}, ${d.commits} commits, ${d.uncommitted} files left uncommitted.`);
  if (d?.unmerged?.length) out.push(`- Branches with work that never reached the copy, so the diff leaves it out: ${d.unmerged.join(", ")}.`);
  if (d?.marks) out.push(`- Off the Mode marks masked in its diff for the judges: ${d.marks}. A judge may still guess which arm this is.`);
  out.push(`- Check: ${checkLine(a.check)}`);
  if (a.score) out.push(`- Score, the end of its output:\n\n\`\`\`\n${tail(a.score.out, 20)}\n\`\`\``);
  if (a.turns.length) out.push(`- Last words to the owner: "${lastWords(a.turns.at(-1)?.text)}"`);
  out.push(`- Copy: ${a.dir} · session ${a.sid ?? "none"}`);
  return out.join("\n");
}

function asksLine(r) {
  const steps = r.steps ?? [];
  const one = (s) => `"${s.ask.slice(0, 240)}${s.ask.length > 240 ? "…" : ""}"${s.replies ? ` and ${s.replies} logged ${s.replies === 1 ? "reply" : "replies"}` : ""}`;
  if (steps.length === 1) return `The ask: ${one(steps[0])}.`;
  return `${steps.length} asks, sent one after another in one session:\n${steps.map((s, i) => `${i + 1}. ${one(s)}`).join("\n")}`;
}

function isolationLine(r) {
  if (!r.isolation?.length) return "";
  const bad = r.isolation.filter((x) => !x.ok);
  return bad.length ? `**The sandbox did not hold for ${bad.map((x) => x.who).join(", ")}: no arm ran.**`
    : `Every arm and judge runs in its own sandbox. Before the run, a probe tried cat, git, find and python on the places each must not read, and a connection to a socket in one (${r.isolation[0].denied} for the first), and all were refused; ${r.isolation[0].readOnly ? `the owner's shared files (~/.offthemode with ME.md, ~/.claude's rules, settings, skills, agents and commands) could be read but not written; ` : ""}no process outside its sandbox could be signalled (the rules that stop renaming or cloning a folder above a closed place are proven by npm run test:eval, never tried on the owner's folders); its own copy, folders and socket stayed open (sandbox-probe.txt in each run's folder).`;
}

export function writeReport(run, r) {
  const arms = order(r.arms), kinds = [...new Set(arms.map((a) => a.arm))];
  const parts = [
    `# ${r.case} · ${new Date(r.started).toLocaleString("sv-SE").slice(0, 16)}`,
    `${asksLine(r)}\nModel ${r.model} · settings ${JSON.stringify(r.settings)} · ${r.runs} ${r.runs === 1 ? "run" : "runs"} per arm, each in a fresh copy.`,
    isolationLine(r),
    scoreSection(r, arms, kinds),
    hurdleSection(arms, kinds),
    costSection(arms, kinds),
    judgeSection(r.judges, arms, kinds),
    `## Each run\n${arms.map(runSection).join("\n\n")}`,
    `## Read with care\n- A difference smaller than the spread between one arm's own runs is not a result. Two runs give a rough spread; more runs give a surer one.\n- "Asking the owner" means the turn's last words held a question; read the last words to be sure. The other hurdle counts are patterns too; their matched lines are in run.json.${r.warnings.length ? `\n- ${r.warnings.join("\n- ")}` : ""}`,
  ];
  writeFileSync(join(run, "report.md"), parts.filter(Boolean).join("\n\n") + "\n");
}
