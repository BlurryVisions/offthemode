// The copies an eval works in: the project as it stood at the case's commit, as one commit with no history, so
// neither arm can see later work and the plain copy holds no trace of Off the Mode, not even in old commit messages.
// Both copies get the case's setup, so they differ only in Off the Mode's own files (startDifferences checks it).
import { appendFileSync, existsSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname, isAbsolute, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { git, gitOr, sh } from "./run.mjs";
import { CaseError, caseEnv } from "./case.mjs";
import { SKILL_FOLDERS } from "../../lib/install.mjs";

const RULE_FILES = ["CLAUDE.md", "CLAUDE.local.md", ".claude/CLAUDE.md", "AGENTS.md", "GEMINI.md", ".github/copilot-instructions.md"];
const SETTINGS = [".claude/settings.json", ".claude/settings.local.json"];
const MENTION = /offthemode|off[\s_-]*the[\s_-]*mode/i;

// Off the Mode's skills installed inside the project rather than for the whole account.
const SKILLS = SKILL_FOLDERS.flatMap((n) => [`.claude/skills/${n}`, `.agents/skills/${n}`, `.claude/commands/${n}.md`]);
// Files the AI tool loads by itself: one of these naming Off the Mode would hand the plain arm the method.
const LOADED = /^(\.claude|\.agents|\.cursor)\/|^(CLAUDE|CLAUDE\.local|AGENTS|GEMINI)\.md$|^\.github\/copilot-instructions\.md$|^\.mcp\.json$/;

// Off the Mode's own files, and the files where it adds a line or an entry: the only places the two copies may differ.
export const isOwnFile = (path) => path.startsWith(".offthemode/") || path === ".cursor/rules/offthemode.mdc"
  || RULE_FILES.includes(path) || SETTINGS.includes(path) || path === ".mcp.json"
  || SKILLS.some((p) => path === p || path.startsWith(`${p}/`));

const CP_FLAGS = process.platform === "darwin" ? ["-cR"] : ["-R"]; // -c: an APFS clone, instant and free on a Mac

// A symlinked file becomes a plain file before it is changed, so the edit can't reach a file outside the copy.
function unlink(path) {
  if (!lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink()) return;
  let text = null;
  try { text = readFileSync(path, "utf8"); } catch { /* a dangling link has nothing to keep */ }
  rmSync(path);
  if (text !== null) writeFileSync(path, text);
}

function editJson(path, edit) {
  unlink(path);
  if (!existsSync(path)) return;
  let data;
  try { data = JSON.parse(readFileSync(path, "utf8")); } catch (e) { throw new CaseError(`${path}: ${e.message}`); }
  if (edit(data)) writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  else rmSync(path);
}

// Takes Off the Mode out of the plain copy's files: its folder, Cursor rule and project skills, the rule-file lines
// that name it (a rule file left with nothing else goes too), its MCP server entry, and its settings entries.
function stripOffTheMode(dir) {
  for (const p of [".offthemode", ".cursor/rules/offthemode.mdc", ...SKILLS]) rmSync(join(dir, p), { recursive: true, force: true });
  for (const f of RULE_FILES.filter((f) => existsSync(join(dir, f)))) {
    unlink(join(dir, f));
    if (!existsSync(join(dir, f))) continue;
    const kept = readFileSync(join(dir, f), "utf8").split("\n").filter((l) => !MENTION.test(l)).join("\n");
    if (kept.trim()) writeFileSync(join(dir, f), kept); else rmSync(join(dir, f));
  }
  editJson(join(dir, ".mcp.json"), (d) => {
    for (const k of Object.keys(d.mcpServers ?? {})) if (MENTION.test(k + JSON.stringify(d.mcpServers[k]))) delete d.mcpServers[k];
    return Object.keys(d.mcpServers ?? {}).length > 0 || Object.keys(d).some((k) => k !== "mcpServers");
  });
  for (const f of SETTINGS) {
    editJson(join(dir, f), (d) => {
      for (const k of ["allow", "ask", "deny"]) if (d.permissions?.[k]) d.permissions[k] = d.permissions[k].filter((x) => !MENTION.test(x));
      for (const k of ["enabledPlugins", "extraKnownMarketplaces"]) for (const name of Object.keys(d[k] ?? {})) if (MENTION.test(name + JSON.stringify(d[k][name]))) delete d[k][name];
      for (const event of Object.keys(d.hooks ?? {})) d.hooks[event] = d.hooks[event].filter((h) => !MENTION.test(JSON.stringify(h)));
      return true;
    });
  }
}

// Files in the plain copy that still name Off the Mode (a code comment, a script): shown in the report. One the AI
// tool loads by itself stops the eval, because the plain arm would then work with the method.
function mentions(dir) {
  const files = gitOr(dir, "grep", "-l", "-i", "-I", "-E", "offthemode|off[ _-]*the[ _-]*mode").split("\n").filter(Boolean);
  const loaded = files.filter((f) => LOADED.test(f));
  if (loaded.length) throw new CaseError(`the plain copy would still load Off the Mode from ${loaded.join(", ")}; take it out with the case's setup (it runs in both copies) or pick another commit`);
  return files;
}

// Each "## Heading" section of the variant replaces the RULES.md section whose heading has the same words before " (".
export function patchRules(text, variant) {
  const split = (t) => t.split(/^(?=## )/m);
  const key = (s) => s.split("\n")[0].replace(/^## /, "").split(" (")[0].trim().toLowerCase();
  const parts = split(text);
  for (const section of split(variant).filter((s) => s.startsWith("## "))) {
    const i = parts.findIndex((p) => p.startsWith("## ") && key(p) === key(section));
    if (i < 0) throw new CaseError(`rules: RULES.md has no "## ${key(section)}" section to replace`);
    parts[i] = section.trimEnd() + (parts[i].endsWith("\n\n") ? "\n\n" : "\n");
  }
  return parts.join("");
}

// The working tree becomes the only commit, dated and signed as the original; every other ref and object goes.
function squash(dir, commit) {
  const [date, name, email] = git(dir, "log", "-1", "--format=%aI%n%an%n%ae", commit).split("\n");
  git(dir, "checkout", "-q", "--orphan", "start");
  git(dir, "add", "-A");
  const who = { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date, GIT_AUTHOR_NAME: name, GIT_AUTHOR_EMAIL: email, GIT_COMMITTER_NAME: name, GIT_COMMITTER_EMAIL: email };
  execFileSync("git", ["commit", "-q", "--no-verify", "-m", `The project as it stood on ${date.slice(0, 10)}`], { cwd: dir, env: { ...process.env, ...who }, stdio: "ignore" });
  git(dir, "branch", "-M", "main");
  gitOr(dir, "remote", "remove", "origin");
  for (const ref of git(dir, "for-each-ref", "--format=%(refname)").split("\n").filter(Boolean)) {
    if (ref !== "refs/heads/main") git(dir, "update-ref", "-d", ref);
  }
  git(dir, "reflog", "expire", "--expire=now", "--all");
  git(dir, "gc", "-q", "--prune=now");
}

// Returns the files setup made that git ignores: they never reach the start commit, so the base copy gets them
// copied in, or it would start differently from the arms.
async function arrange(c, arm, dir, logFile) {
  if (arm === "base") return [];
  if (arm === "plain") stripOffTheMode(dir);
  if (c.setup) {
    const r = await sh(c.setup, { cwd: dir, env: caseEnv(c, dir), logFile });
    if (r.code !== 0) throw new CaseError(`setup failed in the ${arm} copy (exit ${r.code}); see ${logFile}`);
  }
  if (arm === "otm" && c.rulesText) {
    const rules = join(dir, ".offthemode", "RULES.md");
    if (!existsSync(rules)) throw new CaseError(`rules: the project has no .offthemode/RULES.md at ${c.commit}`);
    writeFileSync(rules, patchRules(readFileSync(rules, "utf8"), c.rulesText));
  }
  return git(dir, "status", "--porcelain", "--ignored").split("\n").filter((l) => l.startsWith("!! ")).map((l) => l.slice(3).replace(/\/$/, ""));
}

// What the copy needs to run but git doesn't hold; all of it stays out of git through .git/info/exclude.
async function furnish(c, dir, logFile, carry) {
  const put = (from, to) => {
    if (!existsSync(from)) throw new CaseError(`copy: no ${from}`);
    if (existsSync(join(dir, to))) throw new CaseError(`files: ${to} is already in the project; pick another path`);
    mkdirSync(dirname(join(dir, to)), { recursive: true });
    execFileSync("cp", [...CP_FLAGS, from, join(dir, to)]);
    appendFileSync(join(dir, ".git", "info", "exclude"), `/${to}\n`);
  };
  for (const [from, to] of carry) put(from, to);
  for (const p of c.copy) put(join(c.repo, p), p);
  if (c.install) {
    const r = await sh(c.install, { cwd: dir, env: caseEnv(c, dir), logFile });
    if (r.code !== 0) throw new CaseError(`install failed in ${dir} (exit ${r.code}); see ${logFile}`);
  }
  for (const [to, from] of Object.entries(c.files)) put(from, to);
}

// arm: "plain", "otm", or "base" (a clone of the plain copy's start, for the baseline and the judges; carry names
// the files setup made there that git ignores).
export async function makeCopy(c, { dir, arm, source = c.repo, commit = c.commit, logFile, carry = [] }) {
  mkdirSync(dirname(dir), { recursive: true });
  git(dirname(dir), "clone", "-q", "--no-hardlinks", "--no-checkout", source, dir);
  git(dir, "checkout", "-q", "--detach", commit);
  const setupFiles = await arrange(c, arm, dir, logFile);
  squash(dir, commit);
  for (const key of ["user.name", "user.email"]) {
    const value = gitOr(c.repo, "config", key);
    if (value) git(dir, "config", key, value);
  }
  // The project's own hooks, found inside the copy: a path into the source folder would show the arm where the
  // real project and its later history live.
  const hooks = gitOr(c.repo, "config", "--local", "core.hooksPath");
  const inside = hooks && (isAbsolute(hooks) ? relative(c.repo, hooks) : hooks);
  if (inside && !isAbsolute(inside) && !inside.startsWith("..")) git(dir, "config", "core.hooksPath", inside);
  await furnish(c, dir, logFile, carry);
  return { dir, base: git(dir, "rev-parse", "HEAD"), mentions: arm === "plain" ? mentions(dir) : [], setupFiles };
}

// Paths whose content differs between two starts, outside Off the Mode's own files: should be none.
export function startDifferences(a, b) {
  const files = (dir) => new Map(git(dir, "ls-tree", "-r", "HEAD").split("\n").filter(Boolean).map((l) => [l.split("\t")[1], l.split("\t")[0]]));
  const [x, y] = [files(a), files(b)];
  return [...new Set([...x.keys(), ...y.keys()])].filter((p) => !isOwnFile(p) && x.get(p) !== y.get(p));
}
