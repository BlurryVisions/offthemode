// One source (content/) -> every delivery: skills/ (committed, taken straight from GitHub),
// lib/content.generated.json (MCP server + website), public/method/, public/view/ and public/skills/*.zip.
// `--check` builds in memory and fails if skills/ on disk differs from content/ or the view page breaks its rules.
// With `--committed` (CI passes it) it also fails if skills/ in the last commit differs, so GitHub serves the same
// skills as the site.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { zipSync, strToU8 } from "fflate";
import { renderMethod } from "./render-method.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const COMMITTED = process.argv.includes("--committed");
const REPO_URL = "https://github.com/BlurryVisions/offthemode";
const SKILLS_ZIP_URL = "https://offthemode.vercel.app/skills/offthemode-skills.zip";
const fail = (msg) => { console.error(`build-content: ${msg}`); process.exit(1); };
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---------- parse ----------
const COMMAND_KEYS = new Set(["name", "title", "description", "argument", "argument_hint", "templates"]);
function parseFrontmatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) fail(`${file}: missing frontmatter`);
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) fail(`${file}: bad frontmatter line "${line}"`);
    if (!COMMAND_KEYS.has(kv[1])) fail(`${file}: unknown frontmatter key "${kv[1]}" (allowed: ${[...COMMAND_KEYS].join(", ")})`);
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
  // Agent Skills spec (and the skill-creator validator): kebab-case name matching the folder, no angle brackets in the
  // description. The spec allows 1024 characters, but claude.ai's skill upload allows 200 (support.claude.com article
  // 12512198), and the per-skill zips exist for that upload.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cmd.name) || cmd.name.length > 64) fail(`${f}: invalid name "${cmd.name}"`);
  if (`${cmd.name}.md` !== f) fail(`${f}: name "${cmd.name}" must match the file name`);
  if (!cmd.title || !cmd.description) fail(`${f}: title and description are required`);
  if (cmd.description.length > 200) fail(`${f}: description is ${cmd.description.length} characters; claude.ai's skill upload allows 200`);
  if (/[<>]/.test(cmd.description)) fail(`${f}: description can't contain < or >`);
  for (const t of cmd.templates) if (!templates[t]) fail(`${f}: unknown template "${t}"`);
  // The method page shows each body inside a fence, so a fence in the body would break it.
  if (/^(```|~~~)/m.test(body)) fail(`${f}: the body can't hold a code fence (the method shows it inside one)`);
  // The user's input is echoed on its own line, so a placeholder for it would show up raw next to it.
  if (cmd.argument && body.includes("{{")) fail(`${f}: takes an argument, so its body can't hold a {{placeholder}}`);
  return cmd;
});

const ENTRY = "offthemode";
if (!commands.some((c) => c.name === ENTRY)) fail(`the entry command "${ENTRY}" is missing`);
const known = new Set(commands.map((c) => c.name));
// A command named in a body, not as part of a path (.offthemode/) or a tool id (mcp__offthemode__x).
const mentions = (body, name) => new RegExp(`(?<![\\w./-])${name}(?![\\w/-])`).test(body);
for (const c of commands) {
  for (const ref of ["listrevisit", "reassess", "commentrevisit", "glossaryrevisit"]) {
    if (c.body.includes(ref) && !known.has(ref)) fail(`${c.name}: mentions "${ref}", which doesn't exist`);
  }
}

// The standing rule the server sends: this file is its only copy.
const instructions = read("content/server/instructions.md").trim();
if (!instructions.includes(".offthemode/")) fail("server/instructions.md: the standing rule must name the .offthemode/ folder");

// ---------- the method ----------
// Each copy of a command as a paste-in prompt is a marker line. The build expands it from content/commands,
// so the method can't hold a stale hand-written copy.
const rawBlueprint = read("content/method/BLUEPRINT.md");
const byName = new Map(commands.map((c) => [c.name, c]));
const byTitle = new Map(commands.map((c) => [c.title, c]));
for (const m of rawBlueprint.matchAll(/^```prompt title="([^"]*)"/gm)) {
  const c = byTitle.get(m[1]);
  if (c) fail(`BLUEPRINT.md: the prompt "${m[1]}" is a hand-written copy of a command; use <!-- offthemode:command ${c.name} --> instead`);
}
const CMD_MARKER = /^<!-- offthemode:command ([a-z0-9-]+) -->$/gm;
const markerCount = rawBlueprint.split("offthemode:command").length - 1;
if ([...rawBlueprint.matchAll(CMD_MARKER)].length !== markerCount) fail('BLUEPRINT.md: a command marker must be a line of its own, exactly "<!-- offthemode:command NAME -->"');
const blueprint = rawBlueprint.replace(CMD_MARKER, (_, name) => {
  const c = byName.get(name);
  if (!c) fail(`BLUEPRINT.md: <!-- offthemode:command ${name} --> names no command (known: ${[...known].join(", ")})`);
  return `\`\`\`prompt title="${c.title}"\n${c.body.trimEnd()}\n\`\`\``;
});

// A phase guide opens with short working rules for a change inside an existing product, between two marker lines.
// get_method and the skills hand out that block by default, and the whole guide on request.
const RULES_OPEN = "<!-- offthemode:rules -->";
const RULES_CLOSE = "<!-- /offthemode:rules -->";
const isPhaseGuide = (title) => /^P\d+ · /.test(title) || title === "Taming Complexity";
function workingRules(title, content) {
  const lines = content.split("\n");
  const open = lines.flatMap((l, i) => (l === RULES_OPEN ? [i] : []));
  const close = lines.flatMap((l, i) => (l === RULES_CLOSE ? [i] : []));
  if (content.split("offthemode:rules").length - 1 !== open.length + close.length) fail(`BLUEPRINT.md "${title}": a working-rules marker must be a line of its own`);
  if (open.length > 1 || open.length !== close.length || (open.length && close[0] < open[0])) fail(`BLUEPRINT.md "${title}": needs one working-rules block, opened and then closed`);
  if (!open.length) {
    if (isPhaseGuide(title)) fail(`BLUEPRINT.md "${title}": a phase guide needs a working-rules block after its Output line`);
    return null;
  }
  const block = lines.slice(open[0] + 1, close[0]).join("\n").trim();
  if (!block.startsWith("### Working rules")) fail(`BLUEPRINT.md "${title}": the working-rules block must start with "### Working rules"`);
  return block + "\n";
}

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
    const content = s.lines.join("\n").trim() + "\n";
    return { n: i, slug, title: s.title, origin: s.origin, content, rules: workingRules(s.title, content) };
  });
}

const sheets = splitSheets(blueprint);
if (sheets.length < 20) fail(`BLUEPRINT.md split into only ${sheets.length} sheets`);
// RULES.md §Guides routes work to sheets by name; a renamed sheet must not leave the map pointing at nothing.
const slugs = new Set(sheets.map((s) => s.slug));
const guideMap = templates["RULES.md"].split("## Guides")[1]?.split("\n## ")[0] ?? "";
const cited = [...guideMap.matchAll(/\| ([a-z0-9-]+(?:, [a-z0-9-]+)*) \|$/gm)].flatMap((m) => m[1].split(", "));
if (!cited.length) fail("RULES.md: §Guides map is missing or empty");
for (const g of cited) if (!slugs.has(g)) fail(`RULES.md §Guides cites "${g}", which is not a method sheet`);

// ---------- the view (public/view/index.html) ----------
// The page reads a project's .offthemode/ files in the browser and must send nothing anywhere (CHECKLIST F8.5).
// So it loads no outside script: the parser is pasted into its one module script, and a meta CSP written here
// allows no connection and runs only the inline scripts whose hashes it lists.
const PARSER_LINE = "/*__PARSER__*/";
const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
// The CSP blocks these anyway; failing here keeps one from shipping and failing silently in the browser.
const NETWORK_CALLS = [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/, /\bEventSource\b/, /\bsendBeacon\b/, /\bnew\s+Image\s*\(/];
const sha256 = (text) => `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;

function buildView() {
  // The browser reads CRLF as LF, so the hashes must be taken over LF text.
  const src = read("content/site/view-page.html").replace(/\r\n?/g, "\n");
  const parser = read("content/site/view-parse.mjs").replace(/\r\n?/g, "\n");
  const modules = [...src.matchAll(INLINE_SCRIPT)].filter((m) => /\stype=["']?module\b/.test(m[1]));
  if (modules.length !== 1) fail(`view-page.html: needs exactly one inline <script type="module">, found ${modules.length}`);
  if (modules[0][2].trimStart().split("\n")[0].trim() !== PARSER_LINE) fail(`view-page.html: the module script's first statement must be the line ${PARSER_LINE}`);
  if (src.split(PARSER_LINE).length !== 2) fail(`view-page.html: ${PARSER_LINE} must appear exactly once`);
  if (/<script\b[^>]*\ssrc\s*=/i.test(src)) fail("view-page.html: /view must load no outside script");
  if (/http-equiv=["']?content-security-policy/i.test(src)) fail("view-page.html: the build writes the Content-Security-Policy; remove the page's own");
  // The CSP allows hashed <script> blocks only, so inline handlers and javascript: links would silently do nothing.
  const markup = src.replace(INLINE_SCRIPT, "");
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(markup) || /javascript:/i.test(markup)) fail("view-page.html: no inline event handlers or javascript: links (the CSP blocks them); use addEventListener in the module script");
  if (/^\s*import\b/m.test(parser) || /<\/script/i.test(parser)) fail("view-parse.mjs: is pasted into the page, so it can't import or contain </script");
  const page = src.replace(/^[ \t]*\/\*__PARSER__\*\/[ \t]*$/m, () => parser.replace(/^export /gm, "").trimEnd());
  if (page.includes(PARSER_LINE)) fail(`view-page.html: ${PARSER_LINE} must be a line of its own`);
  for (const re of NETWORK_CALLS) {
    const hit = page.match(re);
    if (hit) fail(`view-page.html or view-parse.mjs: holds a network call (${hit[0]}); the view reads files only and sends nothing`);
  }
  const hashes = [...page.matchAll(INLINE_SCRIPT)].map((m) => sha256(m[2]));
  const csp = `default-src 'none'; script-src ${hashes.join(" ")}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'`;
  const head = page.match(/<head\b[^>]*>/i);
  if (!head) fail("view-page.html: no <head>");
  const at = head.index + head[0].length;
  const html = `${page.slice(0, at)}\n<meta http-equiv="Content-Security-Policy" content="${csp}">${page.slice(at)}`;
  // Browsers look for the charset in the first 1024 bytes, and the CSP line now comes before it.
  const charset = html.match(/<meta charset=[^>]*>/i);
  if (!charset || Buffer.byteLength(html.slice(0, charset.index + charset[0].length)) > 1024) fail("view-page.html: <meta charset> must come early in <head>, within the first 1024 bytes");
  return { html, scripts: hashes.length };
}
const view = buildView();

// ---------- skills ----------
// Only the keys the Agent Skills spec allows (the skill-creator validator's list); claude.ai rejects an upload
// with any other key.
const SKILL_KEYS = new Set(["name", "description", "license", "allowed-tools", "metadata", "compatibility"]);
const yamlString = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
const pad = (n) => String(n).padStart(2, "0");
const sheetFile = (s) => `${pad(s.n)}-${s.slug}.md`;

function skillFiles() {
  const files = {};
  for (const c of commands) {
    const dir = c.name;
    const fm = { name: c.name, description: yamlString(c.description), license: "MIT" };
    for (const k of Object.keys(fm)) if (!SKILL_KEYS.has(k)) fail(`${c.name}: SKILL.md frontmatter key "${k}" is not in the Agent Skills spec`);
    const siblings = commands.filter((o) => o.name !== c.name && mentions(c.body, o.name));
    const refs = [];
    if (c.argument) refs.push(`The user's ${c.argument}, if any, is whatever they typed after the command.`);
    if (c.templates.length) {
      refs.push("Templates are in `templates/` next to this file: " + c.templates.map((t) => `\`templates/${t}\``).join(", ") + ". Open one only when you are about to write that file or compare a filled file with it.");
      for (const t of c.templates) files[`${dir}/templates/${t}`] = templates[t];
    }
    if (c.name === ENTRY) {
      refs.push("The guides are in `method/`, one file per guide; `method/INDEX.md` lists them. For a change inside an existing product, open the guide's working rules in `method/rules/`. Open the whole guide in `method/` when you start that phase or change its structure. A guide with no file in `method/rules/` always comes whole.");
      files[`${dir}/method/INDEX.md`] =
        "# Off the Mode · the guides\n\n" +
        "One file per guide. Open only the guide for the work in front of you: RULES.md §Guides maps each kind of work to its guide.\n\n" +
        "- For a change inside an existing product, open the guide's working rules, in `rules/`. The phase guides have them.\n" +
        "- Open the whole guide, in this folder, when you start that phase or change its structure. A guide with no file in `rules/` always comes whole.\n\n" +
        sheets.map((s) => `- \`${sheetFile(s)}\` · ${s.title}${s.rules ? ` · working rules: \`rules/${sheetFile(s)}\`` : ""}`).join("\n") + "\n";
      for (const s of sheets) {
        files[`${dir}/method/${sheetFile(s)}`] = s.content;
        if (s.rules) {
          files[`${dir}/method/rules/${sheetFile(s)}`] =
            `## ${s.title}\n\n${s.rules}\nThese are the guide's working rules, for a change inside an existing product. Open the whole guide, \`../${sheetFile(s)}\`, when you start this phase or change its structure.\n`;
        }
      }
    } else {
      refs.push(`The guides and all the templates are in the ${ENTRY} skill, next to this one: \`../${ENTRY}/method/\` (\`INDEX.md\` lists the guides; their working rules are in \`../${ENTRY}/method/rules/\`) and \`../${ENTRY}/templates/\`.`);
    }
    if (siblings.length) {
      refs.push("The other commands named here are sibling skills in the same skills folder: " + siblings.map((o) => `${o.name} is \`../${o.name}/SKILL.md\``).join(", ") + ".");
    }
    refs.push(`Install all ${commands.length} Off the Mode skills together; they read each other's files.`);
    const fmText = Object.entries(fm).map(([k, v]) => `${k}: ${v}`).join("\n");
    files[`${dir}/SKILL.md`] = `---\n${fmText}\n---\n\n${c.body}\n## Files\n${refs.map((r) => `- ${r}`).join("\n")}\n`;
  }
  files["README.md"] = skillsReadme();
  return files;
}

// skills/README.md: where the folders go in each tool, and the one-paste install.
function skillsReadme() {
  const install = (dir) => `curl -fsSL ${SKILLS_ZIP_URL} -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ${dir}`;
  return (
    "# Off the Mode · skills\n\n" +
    "Generated from `content/` by `scripts/build-content.mjs`. Edit `content/`, never these files.\n\n" +
    `The ${commands.length} folders belong together: \`${ENTRY}\` sets up a project and runs the others, and the others read the guides and templates inside \`${ENTRY}/\`. Put all of them in your tool's skills folder:\n\n` +
    "- Claude Code: `.claude/skills/` in a project, or `~/.claude/skills/` for every project.\n" +
    "- Codex, Gemini CLI, Cursor and VS Code: `.agents/skills/` in a project, or `~/.agents/skills/` for every project.\n\n" +
    "One paste installs them for every project. Claude Code:\n\n" +
    "```sh\n" + install("~/.claude/skills") + "\n```\n\n" +
    "Codex, Gemini CLI, Cursor and VS Code (unzip makes only the last folder, so `mkdir -p` makes `~/.agents` first):\n\n" +
    "```sh\n" + `mkdir -p ~/.agents/skills && ${install("~/.agents/skills")}` + "\n```\n\n" +
    commands.map((c) => `- \`${c.name}\` · ${c.title}`).join("\n") + "\n\n" +
    "The site also offers one zip per skill, only because claude.ai takes one skill per upload. Upload all of them.\n\n" +
    `More: ${REPO_URL}\n`
  );
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

// skills/ as the last commit holds it, or null outside a git repo (a Vercel build, a downloaded copy).
function committedSkills() {
  const git = (args, input) => execFileSync("git", args, { cwd: ROOT, input, maxBuffer: 64 * 1024 * 1024, stdio: ["pipe", "pipe", "ignore"] });
  try {
    if (git(["rev-parse", "--is-inside-work-tree"]).toString().trim() !== "true") return null;
    git(["rev-parse", "--verify", "HEAD"]);
  } catch {
    return null;
  }
  const paths = git(["ls-tree", "-r", "--name-only", "HEAD", "--", "skills"]).toString().split("\n").filter(Boolean);
  if (!paths.length) return {};
  // One `git cat-file --batch` call reads every blob: "<oid> blob <size>\n<bytes>\n" per path, in order.
  const out = git(["cat-file", "--batch"], paths.map((p) => `HEAD:./${p}`).join("\n") + "\n");
  const files = {};
  let at = 0;
  for (const p of paths) {
    const nl = out.indexOf(10, at);
    const size = Number(out.subarray(at, nl).toString().split(" ")[2]);
    files[p.slice("skills/".length)] = out.subarray(nl + 1, nl + 1 + size).toString("utf8");
    at = nl + 1 + size + 1;
  }
  return files;
}

const skills = skillFiles();
const skillsDir = join(ROOT, "skills");
const withRules = sheets.filter((s) => s.rules);
const largestRules = Math.max(...withRules.map((s) => Buffer.byteLength(s.rules)));
const uncited = sheets.filter((s) => !cited.includes(s.slug)).map((s) => s.slug);

if (CHECK) {
  const diff = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => a[k] !== b[k]);
  const onDisk = Object.fromEntries(listFiles(skillsDir).map((p) => [relative(skillsDir, p), readFileSync(p, "utf8")]));
  const drift = diff(skills, onDisk);
  if (drift.length) fail(`skills/ is out of date (${drift.length} files, e.g. ${drift.slice(0, 3).join(", ")}). Run npm run content and commit.`);
  // Only on --committed: before a commit, skills/ in HEAD is behind by design, so a local check must not fail on it.
  const committed = COMMITTED ? committedSkills() : null;
  if (committed) {
    const stale = diff(skills, committed);
    if (stale.length) fail(`skills/ matches content/, but the last commit doesn't (${stale.length} files, e.g. ${stale.slice(0, 3).join(", ")}). Commit skills/ with the content/ change, so GitHub serves the same skills as the site.`);
  }
  console.log(`build-content: ok · ${commands.length} commands, ${Object.keys(templates).length} templates, ${sheets.length} sheets, skills/ in sync${committed ? " and committed" : COMMITTED ? " (not a git repo: commit check skipped)" : ""}, /view: ${view.scripts} script${view.scripts === 1 ? "" : "s"} pinned by hash, no network call`);
  console.log(`build-content: working rules in ${withRules.length} guides, largest ${(largestRules / 1024).toFixed(1)} KB · §Guides cites ${new Set(cited).size} of ${sheets.length} guides (not cited: ${uncited.join(", ")})`);
  process.exit(0);
}

rmSync(skillsDir, { recursive: true, force: true });
for (const [rel, text] of Object.entries(skills)) {
  mkdirSync(dirname(join(skillsDir, rel)), { recursive: true });
  writeFileSync(join(skillsDir, rel), text);
}

// ---------- content for the MCP server and the website ----------
mkdirSync(join(ROOT, "lib"), { recursive: true });
writeFileSync(join(ROOT, "lib/content.generated.json"), JSON.stringify({ instructions, commands, templates, sheets }));

// ---------- public/skills/*.zip ----------
const zipOut = join(ROOT, "public/skills");
rmSync(zipOut, { recursive: true, force: true });
mkdirSync(zipOut, { recursive: true });
const entries = (filter) => Object.fromEntries(Object.entries(skills).filter(([k]) => filter(k)).map(([k, v]) => [k, strToU8(v)]));
writeFileSync(join(zipOut, "offthemode-skills.zip"), zipSync(entries(() => true), { level: 9 }));
for (const c of commands) writeFileSync(join(zipOut, `${c.name}.zip`), zipSync(entries((k) => k.startsWith(`${c.name}/`)), { level: 9 }));

// ---------- public/method/index.html ----------
// Rendered here, not in the browser, so the page reads without JavaScript and loads no third-party script.
let page = read("content/site/method-page.html");
const { slots, counts } = renderMethod(blueprint);
for (const [name, html] of Object.entries(slots)) {
  const slot = `<!--slot:${name}-->`;
  if (!page.includes(slot)) fail(`method-page.html: slot ${slot} missing`);
  page = page.replaceAll(slot, () => html); // a function, because the method holds text like $' that a string would expand
}
const left = page.match(/<!--slot:[a-zA-Z]+-->/);
if (left) fail(`method-page.html: ${left[0]} has no content`);
if (/<script[^>]*\ssrc=/.test(page)) fail("method-page.html: /method must load no outside script");
page = page.replace("__TITLE__", () => "Off the Mode · the method");
const split = page.indexOf('<div class="shell">');
if (split < 0) fail("method-page.html: shell marker missing");
// Without JavaScript nothing can copy, tick or open the drawer, so those controls hide and long templates unclamp.
const noJs =
  "html:not(.js) :is(.tpl__copy,.tpl__more,.sheet__copy,.code__bar button,.reg button,.pane__action,.index__foot,.mast__btn,.tabs){display:none}" +
  "html:not(.js) .tpl.is-clamped pre{max-height:none;-webkit-mask-image:none;mask-image:none}";
// The page's own head comes first, so its charset line stays within the first 1024 bytes.
const html =
  '<!doctype html>\n<html lang="en">\n<head>\n' + page.slice(0, split) +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
  "<script>document.documentElement.classList.add('js')</script>\n" +
  `<style>html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}.index__kicker{text-decoration:none}.prose li.task > p.task__p{display:contents}${noJs}</style>\n` +
  "</head>\n<body>\n" + page.slice(split) + "\n</body>\n</html>\n";
mkdirSync(join(ROOT, "public/method"), { recursive: true });
writeFileSync(join(ROOT, "public/method/index.html"), html);

// ---------- public/view/index.html ----------
mkdirSync(join(ROOT, "public/view"), { recursive: true });
writeFileSync(join(ROOT, "public/view/index.html"), view.html);

console.log(`build-content: ${commands.length} commands, ${Object.keys(templates).length} templates, ${sheets.length} sheets (${withRules.length} with working rules) -> skills/ (${Object.keys(skills).length} files), lib/content.generated.json, public/method (${counts.prompts} prompts, ${counts.files} file templates), public/view (${view.scripts} script${view.scripts === 1 ? "" : "s"} pinned by hash), public/skills (${commands.length + 1} zips)`);
