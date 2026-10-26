// The run's short report, in plain words: what each arm cost, how it behaved, and how its result scored.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARM_NAMES } from "./case.mjs";
import { M } from "./run.mjs";

function working(turns) {
  const secs = Math.round(turns.reduce((s, t) => s + (Date.parse(t.ended ?? t.sent) - Date.parse(t.sent)), 0) / 1000);
  return secs < 120 ? `${secs} s` : `${Math.round(secs / 60)} min`;
}
function lastWords(text) {
  const words = (text ?? "").trim().split("\n").filter(Boolean).slice(-3).join(" ");
  return words.length > 300 ? `…${words.slice(-300)}` : words;
}
const tail = (text, n = 12) => (text ?? "").trim().split("\n").slice(-n).join("\n");

function checkLine(check) {
  if (!check) return "not run";
  return check.code === 0 ? "passed" : `failed (exit ${check.code}); the end of its output:\n\n\`\`\`\n${tail(check.out)}\n\`\`\``;
}

function armSection(a) {
  const u = a.usage, d = a.diff, stops = a.turns.filter((t) => t.asked).length;
  const out = [`## ${ARM_NAMES[a.arm]} (blind letter ${a.letter})`];
  if (u) {
    out.push(`- Tokens read: ${M(u.total)}. Main chat ${M(u.main)}; ${u.agents} agents ${M(u.agentsTotal)}.`);
    for (const w of u.workflows) out.push(`  - workflow ${w.name}: ${w.agents} agents, ${M(w.total)}`);
    u.turns.forEach((t, i) => out.push(`  - turn ${i + 1}: ${M(t.total)}, ${t.agents} agents`));
  }
  out.push(`- Time working: ${working(a.turns)} over ${a.turns.length} turns. Turns that ended asking the owner: ${stops}.`);
  a.turns.forEach((t, i) => out.push(`  - turn ${i + 1}: ${t.asked ? "asked the owner" : "no question"}, ${t.changed} files changed by its end${t.error ? `, ended with ${t.error}` : ""}`));
  if (a.error) out.push(`- The eval failed on this arm: ${a.error.split("\n")[0]}`);
  if (a.stoppedBy) out.push(`- Stopped early: ${a.stoppedBy}. This run is not a full sample.`);
  if (a.openTasks?.length) out.push(`- Still running when the session closed: ${a.openTasks.join("; ")}.`);
  if (a.denials) out.push(`- Actions the permission check refused: ${a.denials}.`);
  if (d) out.push(`- Changes: ${d.files} files, +${d.added} −${d.removed}, ${d.commits} commits, ${d.uncommitted} files left uncommitted.`);
  if (d?.unmerged?.length) out.push(`- Branches with work that never reached the copy, so the diff leaves it out: ${d.unmerged.join(", ")}.`);
  if (d?.marks) out.push(`- Off the Mode marks masked in its diff for the judges: ${d.marks}. A judge may still guess which arm this is.`);
  out.push(`- Check: ${checkLine(a.check)}`);
  if (a.score) out.push(`- Score:\n\n\`\`\`\n${tail(a.score.out, 20)}\n\`\`\``);
  out.push(`- Last words to the owner: "${lastWords(a.turns.at(-1)?.text)}"`);
  out.push(`- Copy: ${a.dir} · session ${a.sid ?? "none"}`);
  return out.join("\n");
}

function judgeSection(verdicts, arms) {
  if (!verdicts?.length) return "";
  const who = Object.fromEntries(arms.map((a) => [a.letter, ARM_NAMES[a.arm]]));
  const lines = verdicts.map((v) => v.error
    ? `- ${v.name}: the judge failed (${v.error.slice(0, 200)})`
    : `- ${v.name}: ${v.ranking.map((l) => `${who[l] ?? l} ${v.scores[l] ?? "?"}`).join(", ")} (${v.tie ? "a tie" : v.agree ? "both reading orders agree" : "the two reading orders disagree, so treat it as a tie"}). ${v.verdict ?? ""}`);
  const tokens = verdicts.reduce((s, v) => s + (v.tokens ?? 0), 0);
  return `## Blind judges (scores 1-10, best first, each the mean of two readings in opposite orders; findings in judges.json)\n${lines.join("\n")}\n- The judges read ${M(tokens)} in all. They are a model's opinion: read their findings before trusting a score.`;
}

export function writeReport(run, r) {
  const parts = [
    `# ${r.case} · ${new Date(r.started).toLocaleString("sv-SE").slice(0, 16)}`,
    `The ask: "${r.ask.slice(0, 240)}${r.ask.length > 240 ? "…" : ""}" · ${r.replies} logged ${r.replies === 1 ? "reply" : "replies"} · model ${r.model} · settings ${JSON.stringify(r.settings)}`,
    `## At the start (before either arm)\n- Check: ${checkLine(r.baseline?.check)}${r.baseline?.score ? `\n- Score:\n\n\`\`\`\n${tail(r.baseline.score.out, 20)}\n\`\`\`` : ""}`,
    ...r.arms.map(armSection),
    judgeSection(r.judges, r.arms),
    `## Read with care\n- One run per arm is one sample; the same ask can cost twice as much on a second run.\n- "Asking the owner" means the turn's last words held a question; read the last words to be sure.${r.warnings.length ? `\n- ${r.warnings.join("\n- ")}` : ""}`,
  ];
  writeFileSync(join(run, "report.md"), parts.filter(Boolean).join("\n\n") + "\n");
}
