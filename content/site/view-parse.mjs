// Reads a project's .offthemode/ files (plain markdown, as the templates write them) into one object for the view.
// Runs in the browser (the view page) and in Node (tests), so it uses no Node or DOM API. Unknown or missing
// sections become empty values, never errors: a half-filled folder still renders.

const lines = (md) => (md || "").replace(/\r\n?/g, "\n").split("\n");

// "## Heading" blocks: [{ title, body }]; text before the first heading is the preamble.
function sections(md, level = 2) {
  const mark = "#".repeat(level) + " ";
  const out = [];
  let cur = { title: "", body: [] };
  let fence = false;
  for (const line of lines(md)) {
    if (line.startsWith("```")) fence = !fence;
    if (!fence && line.startsWith(mark)) {
      out.push(cur);
      cur = { title: line.slice(mark.length).trim(), body: [] };
    } else cur.body.push(line);
  }
  out.push(cur);
  return out.map((s) => ({ title: s.title, body: s.body.join("\n").trim() }));
}

const MARKS = { " ": "todo", "~": "doing", x: "built", v: "verified", "-": "dropped" };

// "- [x] F1.2 text · done when: ... · guide: ... · evidence: ..." (or "· dropped ...: reason")
function parseItem(line) {
  const m = line.match(/^- \[([ ~xv-])\] (\S+) (.*)$/);
  if (!m) return null;
  const parts = m[3].split(" · ");
  const item = { id: m[2], mark: MARKS[m[1]], text: parts[0].trim(), doneWhen: "", guide: "", evidence: "", dropped: "" };
  // A " · " inside a field's own text (evidence often quotes test output) belongs to the field before it.
  let last = "text";
  for (const p of parts.slice(1)) {
    const kv = p.match(/^(done when|guide|evidence|dropped[^:]*):\s*(.*)$/);
    if (!kv) { item[last] += " · " + p.trim(); continue; }
    last = kv[1].startsWith("dropped") ? "dropped" : kv[1] === "done when" ? "doneWhen" : kv[1];
    item[last] = kv[2].trim();
  }
  return item;
}

function parseChecklist(md) {
  const all = lines(md);
  const header = all.find((l) => l.startsWith("Last revisit:")) || "";
  const hm = header.match(/Last revisit:\s*([^·]+?)\s*·\s*Verified\s*(\d+)\s*\/\s*(\d+)/);
  const out = {
    name: (all[0] || "").replace(/^#\s*Checklist\s*·\s*/, "").trim(),
    lastRevisit: hm ? hm[1].trim() : "",
    verified: hm ? Number(hm[2]) : null,
    total: hm ? Number(hm[3]) : null,
    vision: {}, fragments: [], foundation: [], qualityBars: [], changes: [],
  };
  let zone = "", frag = null;
  for (const line of all) {
    if (line.startsWith("## ")) { zone = line.slice(3).toLowerCase(); frag = null; continue; }
    const fm = line.match(/^### (F\d+) · (.+?) · depends on: (.+?) · Verify: (.+)$/);
    if (fm) {
      frag = { id: fm[1], name: fm[2].trim(), dependsOn: fm[3].trim(), verify: fm[4].trim(), forPerson: "", items: [] };
      out.fragments.push(frag);
      continue;
    }
    if (zone.startsWith("vision")) {
      const vm = line.match(/^- (Thesis|Moment of value|Core concept):\s*(.*)$/);
      if (vm) out.vision[{ Thesis: "thesis", "Moment of value": "moment", "Core concept": "core" }[vm[1]]] = vm[2].trim();
    } else if (zone.startsWith("fragments") && frag) {
      if (line.startsWith("For the person:")) frag.forPerson = line.slice(15).trim();
      const it = parseItem(line);
      if (it) frag.items.push(it);
    } else if (zone.startsWith("foundation")) {
      const it = parseItem(line);
      if (it) out.foundation.push(it);
    } else if (zone.startsWith("quality")) {
      if (line.startsWith("- ")) out.qualityBars.push(line.slice(2).trim());
    } else if (zone.startsWith("changes")) {
      const cm = line.match(/^- (\S+) · (.*)$/);
      if (cm) out.changes.push({ date: cm[1], text: cm[2].trim() });
    }
  }
  return out;
}

// DECISIONS.md: "### D-001 · Title · date · status" blocks.
function parseDecisions(md) {
  return sections(md, 3).filter((s) => /^D-\d+/.test(s.title)).map((s) => {
    const [id, title = "", date = "", ...rest] = s.title.split(" · ");
    return { id: id.trim(), title: title.trim(), date: date.trim(), status: rest.join(" · ").trim(), body: s.body };
  });
}

// GLOSSARY.md: "- Label: text" lines under "In plain words", and the Terms table.
function parseGlossary(md) {
  const secs = sections(md);
  const plainSec = secs.find((s) => /^In plain words/i.test(s.title));
  const termsSec = secs.find((s) => /^Terms/i.test(s.title));
  const plain = [];
  for (const line of lines(plainSec?.body)) {
    const m = line.match(/^- ([^:]+):\s*(.*)$/);
    if (m) plain.push({ label: m[1].trim(), text: m[2].trim(), points: [] });
    else if (/^\s+- /.test(line) && plain.length) plain[plain.length - 1].points.push(line.replace(/^\s+- /, "").trim());
  }
  const rows = lines(termsSec?.body).filter((l) => l.startsWith("|") && !/^\|\s*-/.test(l)).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  return { plain, terms: rows.length > 1 ? { head: rows[0], rows: rows.slice(1) } : null };
}

// "PRODUCT · name · status · reviewed date" and "STATE · updated date" style first lines.
const headerLine = (md) => (lines(md)[0] || "").split(" · ").map((s) => s.trim());

function parseProduct(md) {
  const h = headerLine(md);
  return { name: h[1] || "", status: h[2] || "", sections: sections(md).filter((s) => s.title) };
}

function parseState(md) {
  const h = headerLine(md);
  return {
    updated: (h[1] || "").replace(/^updated\s*/, ""),
    sections: sections(md).filter((s) => s.title).map((s) => ({
      title: s.title,
      items: lines(s.body).filter((l) => /^(- |\d+\. )/.test(l)).map((l) => l.replace(/^(- |\d+\. )/, "").trim()),
      body: s.body,
    })),
  };
}

// REASSESS.md: first line "REASSESS · date · alignment", then the report as written.
function parseReassess(md) {
  if (!md) return null;
  const h = headerLine(md);
  return { date: h[1] || "", alignment: (h[2] || "").toLowerCase(), body: lines(md).slice(1).join("\n").trim() };
}

/** files: { "CHECKLIST.md": text, "PRODUCT.md": text, ... } (any subset). */
export function parseProject(files) {
  const f = (n) => files[n] || "";
  const checklist = parseChecklist(f("CHECKLIST.md"));
  const product = parseProduct(f("PRODUCT.md"));
  return {
    name: product.name || checklist.name || "",
    checklist,
    product,
    state: parseState(f("STATE.md")),
    decisions: parseDecisions(f("DECISIONS.md")),
    glossary: parseGlossary(f("GLOSSARY.md")),
    reassess: parseReassess(files["REASSESS.md"]),
    present: Object.keys(files).filter((n) => files[n]).sort(),
  };
}
