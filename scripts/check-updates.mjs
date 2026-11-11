// Holds content/templates/UPDATES.md to the templates it names. The offthemode command updates an older project by
// these entries: each says which current line replaces an old one, by how that line starts or ends, or by its
// words. A reworded template line would leave a name pointing at nothing, and the update would silently skip it.
// Every quoted text after an entry's "Now:" is such a name, so a "Now:" quotes nothing else, in double quotes.
// Also holds the one line the points hang on: the save skips its points step in a project whose RULES.md lacks it
// (revisit-state, step 1; the p0-constitution guide's working rules say the same), so all three must agree.
// Not held: the order two names are said to stand in ("after the one starting ..."), only that each finds its line.
export const POINTS_LINE = "- Build from my points";
const QUOTED = /["“]([^"”]*)["”]/g;
const HOW = /\b(start|end)(?:ing|s with|s)\b/g;
// Between two names of one list ("A", "B" and "C"), the second is found the way the first is.
const JOINS = /^(?:, | and |, and | or |, or )$/;

export function updatesProblems(templates, { saveBody, blueprint }) {
  const problems = [];
  for (const entry of templates["UPDATES.md"].split("\n").filter((l) => /^[-*] /.test(l))) {
    const at = entry.lastIndexOf(" · Now: ");
    if (!entry.startsWith("- ") || at < 0) { problems.push(`UPDATES.md: an entry is not written as "- FILE · Was: ... · Now: ...", so it would not be checked: ${entry.slice(0, 70)}`); continue; }
    const was = entry.indexOf(" · Was: "), head = entry.slice(2, was < 0 || was > at ? at : was);
    const file = head.split(/[ ·]/)[0];
    if (!templates[file]) { problems.push(`UPDATES.md: an entry names "${file}", which is not a template`); continue; }
    const lines = templates[file].split("\n");
    // "RULES.md §Efficiency": the line must stand in that section, from its heading to the next one.
    const section = head.match(/§(.+)$/)?.[1].trim();
    let from = 0, to = lines.length;
    if (section) {
      from = lines.findIndex((l) => l === `## ${section}` || l.startsWith(`## ${section} (`));
      if (from < 0) { problems.push(`UPDATES.md: an entry names ${file} §${section}, and the template has no such section`); continue; }
      const next = lines.findIndex((l, i) => i > from && l.startsWith("## "));
      to = next < 0 ? lines.length : next;
    }
    const now = entry.slice(at + " · Now: ".length), names = [...now.matchAll(QUOTED)];
    if (!names.length && now.match(HOW)) problems.push(`UPDATES.md: an entry of ${head} says starting or ending and quotes no name in double quotes`);
    let prev = 0, last = "hold";
    for (const m of names) {
      const gap = now.slice(prev, m.index), how = [...gap.matchAll(HOW)].at(-1)?.[1] ?? (JOINS.test(gap) ? last : "hold");
      prev = m.index + m[0].length;
      last = how;
      const name = m[1], where = `${file}${section ? ` §${section}` : ""}`, said = how === "hold" ? "holding" : `${how}ing`;
      if (!name) { problems.push(`UPDATES.md: an entry of ${where} quotes an empty name`); continue; }
      const found = lines.slice(from, to).filter((l) => (how === "start" ? l.startsWith(name) : how === "end" ? l.endsWith(name) : l.includes(name))).length;
      if (found !== 1) problems.push(`UPDATES.md names a line of ${where} ${said} "${name}", and the template has ${found || "none"}; ${found ? "the name must find one line only" : "reword the name with the line"}`);
    }
  }
  const starts = templates["RULES.md"].split("\n").filter((l) => l.startsWith(POINTS_LINE)).length;
  if (starts !== 1) problems.push(`RULES.md: ${starts || "no"} line${starts > 1 ? "s start" : " starts"} with "${POINTS_LINE}"; revisit-state and UPDATES.md find the points by that one line`);
  const skip = `If the project's RULES.md has no line starting "${POINTS_LINE}", skip this step`;
  if (!saveBody.includes(skip)) problems.push(`revisit-state: step 1 must say '${skip}', so a project set up before the points keeps its checklist as it is`);
  const older = `Where RULES.md has no line starting "${POINTS_LINE}", the project was set up before the points`;
  if (!blueprint.includes(older)) problems.push(`BLUEPRINT.md: the p0-constitution working rules must say '${older}'`);
  return problems;
}
