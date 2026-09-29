// One source (content/) -> every delivery: skills/ (committed, taken straight from GitHub),
// lib/content.generated.json (MCP server + website), public/method/ and public/skills/*.zip.
// `--check` builds in memory and fails if the committed skills/ has drifted from content/.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { zipSync, strToU8 } from "fflate";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const REPO_URL = "https://github.com/BlurryVisions/offthemode";
const fail = (msg) => { console.error(`build-content: ${msg}`); process.exit(1); };
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---------- parse ----------
function parseFrontmatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) fail(`${file}: missing frontmatter`);
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) fail(`${file}: bad frontmatter line "${line}"`);
    data[kv[1]] = kv[2].trim();
  }
  return { data, body: src.slice(m[0].length).trim() + "\n" };
}

const templates = Object.fromEntries(
  readdirSync(join(ROOT, "content/templates")).filter((f) => f.endsWith(".md")).sort()
    .map((f) => [f, read(`content/templates/${f}`)]),
);

const commands = readdirSync(join(ROOT, "content/commands")).filter((f) => f.endsWith(".md")).sort().map((f) => {
  const { data, body } = parseFrontmatter(read(`content/commands/${f}`), f);
  const cmd = {
    name: data.name,
    title: data.title,
    description: data.description,
    argument: data.argument || null,
    argumentHint: data.argument_hint || null,
    templates: data.templates ? data.templates.split(",").map((t) => t.trim()) : [],
    body,
  };
  // Agent Skills spec: lowercase letters, digits and hyphens, matching the folder; description <= 1024 chars.
  if (!/^[a-z0-9-]{1,64}$/.test(cmd.name)) fail(`${f}: invalid name "${cmd.name}"`);
  if (`${cmd.name}.md` !== f) fail(`${f}: name "${cmd.name}" must match the file name`);
  if (!cmd.title || !cmd.description) fail(`${f}: title and description are required`);
  if (cmd.description.length > 1024) fail(`${f}: description over 1024 characters`);
  for (const t of cmd.templates) if (!templates[t]) fail(`${f}: unknown template "${t}"`);
  return cmd;
});

const ENTRY = "offthemode";
if (!commands.some((c) => c.name === ENTRY)) fail(`the entry command "${ENTRY}" is missing`);
// Every command a body mentions by name must exist, so no instruction points at nothing.
const known = new Set(commands.map((c) => c.name));
for (const c of commands) {
  for (const ref of ["listrevisit", "reassess", "commentrevisit", "glossaryrevisit"]) {
    if (c.body.includes(ref) && !known.has(ref)) fail(`${c.name}: mentions "${ref}", which doesn't exist`);
  }
}

const blueprint = read("content/method/BLUEPRINT.md");
function splitSheets(md) {
  const lines = md.split("\n");
  const sheets = [];
  let inFence = false;
  let cur = { title: "Introduction", origin: "added", lines: [] };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) inFence = !inFence;
    if (!inFence && line.startsWith("## ")) {
      sheets.push(cur);
      const origin = (lines[i + 1] || "").match(/origin:\s*(yours|added|moved)/);
      cur = { title: line.slice(3).trim(), origin: origin ? origin[1] : "added", lines: [line] };
      continue;
    }
    cur.lines.push(line);
  }
  sheets.push(cur);
  if (inFence) fail("BLUEPRINT.md: unbalanced code fence");
  const used = new Set();
  return sheets.map((s, i) => {
    let slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `sheet-${i}`;
    while (used.has(slug)) slug += "-2";
    used.add(slug);
    return { n: i, slug, title: s.title, origin: s.origin, content: s.lines.join("\n").trim() + "\n" };
  });
}
const sheets = splitSheets(blueprint);
if (sheets.length < 20) fail(`BLUEPRINT.md split into only ${sheets.length} sheets`);

// ---------- skills ----------
const yamlString = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
const pad = (n) => String(n).padStart(2, "0");

function skillFiles() {
  const files = {};
  for (const c of commands) {
    const dir = c.name;
    const fm = [`name: ${c.name}`, `description: ${yamlString(c.description)}`, "license: MIT"];
    if (c.argumentHint) fm.push(`argument-hint: ${yamlString(`[${c.argumentHint}]`)}`);
    const refs = [];
    if (c.argument) refs.push(`The user's ${c.argument}, if any, is whatever they typed after the command.`);
    if (c.templates.length) {
      refs.push("Templates are in `templates/` next to this file: " + c.templates.map((t) => `\`templates/${t}\``).join(", ") + ". Open one only when you are about to write that file.");
      for (const t of c.templates) files[`${dir}/templates/${t}`] = templates[t];
    }
    if (c.name === ENTRY) {
      refs.push("The full method is in `method/`, one file per sheet; start with `method/INDEX.md` and open only the sheet for the phase you are in.");
      files[`${dir}/method/INDEX.md`] =
        "# Off the Mode · the method\n\nOne file per sheet. Open only the sheet for the phase you are in.\n\n" +
        sheets.map((s) => `- \`${pad(s.n)}-${s.slug}.md\` · ${s.title}`).join("\n") + "\n";
      for (const s of sheets) files[`${dir}/method/${pad(s.n)}-${s.slug}.md`] = s.content;
    }
    files[`${dir}/SKILL.md`] = `---\n${fm.join("\n")}\n---\n\n${c.body}${refs.length ? `\n## Files\n${refs.map((r) => `- ${r}`).join("\n")}\n` : ""}`;
  }
  files["README.md"] =
    "# Off the Mode · skills\n\n" +
    "Generated from `content/` by `scripts/build-content.mjs`. Edit `content/`, never these files.\n\n" +
    "Copy the folders you want into your tool's skills folder (Claude Code: `.claude/skills/` in a project, or `~/.claude/skills/` for all projects). " +
    "Each folder is one skill; `offthemode` is the one to start with.\n\n" +
    commands.map((c) => `- \`${c.name}\` · ${c.title}`).join("\n") + "\n\n" +
    `More: ${REPO_URL}\n`;
  return files;
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

const skills = skillFiles();
const skillsDir = join(ROOT, "skills");

if (CHECK) {
  const onDisk = Object.fromEntries(listFiles(skillsDir).map((p) => [relative(skillsDir, p), readFileSync(p, "utf8")]));
  const drift = [...new Set([...Object.keys(skills), ...Object.keys(onDisk)])].filter((k) => skills[k] !== onDisk[k]);
  if (drift.length) fail(`skills/ is out of date (${drift.length} files, e.g. ${drift.slice(0, 3).join(", ")}). Run npm run content and commit.`);
  console.log(`build-content: ok · ${commands.length} commands, ${Object.keys(templates).length} templates, ${sheets.length} sheets, skills/ in sync`);
  process.exit(0);
}

rmSync(skillsDir, { recursive: true, force: true });
for (const [rel, text] of Object.entries(skills)) {
  mkdirSync(dirname(join(skillsDir, rel)), { recursive: true });
  writeFileSync(join(skillsDir, rel), text);
}

// ---------- content for the MCP server and the website ----------
mkdirSync(join(ROOT, "lib"), { recursive: true });
writeFileSync(join(ROOT, "lib/content.generated.json"), JSON.stringify({
  commands,
  templates,
  sheets: sheets.map(({ n, slug, title, origin, content }) => ({ n, slug, title, origin, content })),
}));

// ---------- public/skills/*.zip ----------
const zipOut = join(ROOT, "public/skills");
rmSync(zipOut, { recursive: true, force: true });
mkdirSync(zipOut, { recursive: true });
const entries = (filter) => Object.fromEntries(Object.entries(skills).filter(([k]) => filter(k)).map(([k, v]) => [k, strToU8(v)]));
writeFileSync(join(zipOut, "offthemode-skills.zip"), zipSync(entries(() => true), { level: 9 }));
for (const c of commands) writeFileSync(join(zipOut, `${c.name}.zip`), zipSync(entries((k) => k.startsWith(`${c.name}/`)), { level: 9 }));

// ---------- public/method/index.html ----------
let page = read("content/site/method-page.html");
const swaps = [
  ["Your method, redlined · Rev A → Rev B", "The method, redlined · Rev A → Rev B"],
  ["['Drawn by', 'You']", "['Drawn by', 'BlurryVisions']"],
  ["['Date', '2026-09-28']", "['Date', '2026-09-29']"],
  ["yours: 'Rev A · your method'", "yours: 'Rev A · original method'"],
  [">Your step<", ">Original step<"],
  ["Yours, moved or reframed", "Original, moved or reframed"],
  ["Rev A: your method, in your order.", "Rev A: the original method, in its order."],
  ['<div class="index__kicker">Sheet set · Rev B</div>', '<a class="index__kicker" href="/">← Off the Mode</a>'],
];
for (const [from, to] of swaps) {
  if (!page.includes(from)) fail(`method-page.html: expected text not found: ${from}`);
  page = page.replace(from, () => to); // function form: no $-pattern expansion
}
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const payload = JSON.stringify(blueprint).replace(/</g, "\\u003c").replaceAll(LS, "\\u2028").replaceAll(PS, "\\u2029");
if (!page.includes('/*__MD__*/""')) fail("method-page.html: markdown slot missing");
// Function form, because the blueprint contains shell snippets like $'\n' that a replacement string would expand.
page = page.replace('/*__MD__*/""', () => payload).replace("__TITLE__", () => "Off the Mode · the method");
const split = page.indexOf('<div class="shell">');
if (split < 0) fail("method-page.html: shell marker missing");
const html =
  '<!doctype html>\n<html lang="en">\n<head>\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
  "<style>html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}.index__kicker{text-decoration:none}</style>\n" +
  page.slice(0, split) + "</head>\n<body>\n" + page.slice(split) + "\n</body>\n</html>\n";
mkdirSync(join(ROOT, "public/method"), { recursive: true });
writeFileSync(join(ROOT, "public/method/index.html"), html);

console.log(`build-content: ${commands.length} commands, ${Object.keys(templates).length} templates, ${sheets.length} sheets -> skills/ (${Object.keys(skills).length} files), lib/content.generated.json, public/method, public/skills (${commands.length + 1} zips)`);
