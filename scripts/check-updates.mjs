// Holds content/templates/UPDATES.md to the templates it names. The offthemode command updates an older project by
// these entries: each says which current line replaces an old one, by how that line starts or ends, or by its
// words. A reworded template line would leave a name pointing at nothing, and the update would silently skip it.
// Every quoted text after an entry's "Now:" is such a name, so a "Now:" quotes nothing else.
// Also holds the one line the points hang on: the save skips its points step in a project whose RULES.md lacks it
// (revisit-state, step 1; the p0-constitution guide's working rules say the same), so all three must agree.
export const POINTS_LINE = "- Build from my points";
const QUOTED = /["“]([^"”]+)["”]/g;
const HOW = /\b(start|end)(?:ing|s with|s)\b/g;

export function updatesProblems(templates, { saveBody, blueprint }) {
  const problems = [];
  for (const entry of templates["UPDATES.md"].split("\n").filter((l) => l.startsWith("- ") && l.includes(" · Now: "))) {
    const was = entry.indexOf(" · Was: "), head = entry.slice(2, was < 0 ? entry.indexOf(" · Now: ") : was);
    const file = head.split(/[ ·]/)[0];
    if (!templates[file]) { problems.push(`UPDATES.md: an entry names "${file}", which is not a template`); continue; }
    const lines = templates[file].split("\n");
    // "RULES.md §Efficiency": the line must stand in that section, from its heading to the next one.
    const section = head.match(/§(.+)$/)?.[1].trim();
    let from = 0, to = lines.length;
    if (section) {
      from = lines.findIndex((l) => l.startsWith(`## ${section}`));
      if (from < 0) { problems.push(`UPDATES.md: an entry names ${file} §${section}, and the template has no such section`); continue; }
      const next = lines.findIndex((l, i) => i > from && l.startsWith("## "));
      to = next < 0 ? lines.length : next;
    }
    const now = entry.slice(entry.lastIndexOf(" · Now: ") + " · Now: ".length);
    for (const m of now.matchAll(QUOTED)) {
      const name = m[1], how = [...now.slice(0, m.index).matchAll(HOW)].at(-1)?.[1] ?? "hold";
      const found = lines.slice(from, to).filter((l) => (how === "start" ? l.startsWith(name) : how === "end" ? l.endsWith(name) : l.includes(name))).length;
      const where = `${file}${section ? ` §${section}` : ""}`, said = how === "hold" ? "holding" : `${how}ing`;
      if (found !== 1) problems.push(`UPDATES.md names a line of ${where} ${said} "${name}", and the template has ${found || "none"}; ${found ? "the name must find one line only" : "reword the name with the line"}`);
    }
  }
  const starts = templates["RULES.md"].split("\n").filter((l) => l.startsWith(POINTS_LINE)).length;
  if (starts !== 1) problems.push(`RULES.md: ${starts || "no"} line${starts > 1 ? "s start" : " starts"} with "${POINTS_LINE}"; revisit-state and UPDATES.md find the points by that one line`);
  const skip = `has no line starting "${POINTS_LINE}", skip this step`;
  if (!saveBody.includes(skip)) problems.push(`revisit-state: step 1 must say 'If the project's RULES.md ${skip}', so a project set up before the points keeps its checklist as it is`);
  const older = `has no line starting "${POINTS_LINE}", the project was set up before the points`;
  if (!blueprint.includes(older)) problems.push(`BLUEPRINT.md: the p0-constitution working rules must say 'Where RULES.md ${older}'`);
  return problems;
}
