// The copies an eval works in: the project at the case's commit, with every later commit gone, so neither arm can
// see how the owner's real build turned out. The plain copy also loses Off the Mode from all of its history.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { git, gitOr, sh } from "./run.mjs";
import { CaseError, caseEnv } from "./case.mjs";

const RULE_FILES = ["CLAUDE.md", "CLAUDE.local.md", ".claude/CLAUDE.md", "AGENTS.md", "GEMINI.md", ".github/copilot-instructions.md"];
const MENTION = "\\.offthemode|off the mode";
// Run by git filter-branch on every commit: drops .offthemode/ and Off the Mode's own Cursor rule, and takes the
// lines that mention it out of the project's rule files; a rule file left with nothing else goes too.
const STRIP = `git rm -r -q --cached --ignore-unmatch .offthemode .cursor/rules/offthemode.mdc
for f in ${RULE_FILES.join(" ")}; do
  git cat-file -e ":$f" 2>/dev/null || continue
  git cat-file blob ":$f" | grep -qiE '${MENTION}' || continue
  if git cat-file blob ":$f" | grep -viE '${MENTION}' | grep -q '[^[:space:]]'; then
    git update-index --cacheinfo "100644,$(git cat-file blob ":$f" | grep -viE '${MENTION}' | git hash-object -w --stdin),$f"
  else git rm -q --cached "$f"; fi
done`;

const CP_FLAGS = process.platform === "darwin" ? ["-cR"] : ["-R"]; // -c: an APFS clone, instant and free on a Mac

function forget(dir) {
  git(dir, "reflog", "expire", "--expire=now", "--all");
  git(dir, "gc", "-q", "--prune=now");
}

// Only the commit and its past stay: other branches, tags, remotes and the reflog go, then gc drops the rest.
function cutFuture(dir, commit) {
  git(dir, "checkout", "-q", "-B", "main", commit);
  git(dir, "remote", "remove", "origin");
  for (const ref of git(dir, "for-each-ref", "--format=%(refname)").split("\n").filter(Boolean)) {
    if (ref !== "refs/heads/main") git(dir, "update-ref", "-d", ref);
  }
  forget(dir);
}

function stripOffTheMode(dir) {
  execFileSync("git", ["filter-branch", "-f", "--index-filter", STRIP, "--", "main"],
    { cwd: dir, env: { ...process.env, FILTER_BRANCH_SQUELCH_WARNING: "1" }, stdio: "ignore" });
  for (const ref of gitOr(dir, "for-each-ref", "--format=%(refname)", "refs/original").split("\n").filter(Boolean)) {
    git(dir, "update-ref", "-d", ref);
  }
  forget(dir);
  if (existsSync(join(dir, ".offthemode")) || gitOr(dir, "status", "--porcelain")) {
    throw new CaseError(`plain copy at ${dir}: Off the Mode is still in the working tree after removing it from history`);
  }
}

// Files in the plain copy that still name Off the Mode (a code comment, a config line): shown in the report.
function mentions(dir) {
  return gitOr(dir, "grep", "-l", "-i", "-I", "-E", "offthemode|off the mode").split("\n").filter(Boolean);
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

function commitAll(dir, message) {
  git(dir, "add", "-A");
  if (gitOr(dir, "status", "--porcelain")) git(dir, "commit", "-q", "--no-verify", "-m", message);
}

async function mustSh(c, command, dir, logFile, what) {
  const r = await sh(command, { cwd: dir, env: caseEnv(c, dir), logFile });
  if (r.code !== 0) throw new CaseError(`${what} failed in ${dir} (exit ${r.code}); see ${logFile}`);
}

async function arrange(c, arm, dir, logFile) {
  if (arm === "plain") {
    stripOffTheMode(dir);
    if (c.plainSetup) await mustSh(c, c.plainSetup, dir, logFile, "plainSetup");
    commitAll(dir, "Tidy project files");
  }
  if (arm === "otm" && c.rulesText) {
    const rules = join(dir, ".offthemode", "RULES.md");
    if (!existsSync(rules)) throw new CaseError(`rules: the project has no .offthemode/RULES.md at ${c.commit}`);
    writeFileSync(rules, patchRules(readFileSync(rules, "utf8"), c.rulesText));
    commitAll(dir, "Update RULES.md");
  }
}

// What the copy needs to run but git doesn't hold; all of it stays out of git through .git/info/exclude.
async function furnish(c, dir, logFile) {
  const put = (from, to) => {
    if (!existsSync(from)) throw new CaseError(`copy: no ${from}`);
    if (existsSync(join(dir, to))) throw new CaseError(`files: ${to} is already in the project; pick another path`);
    mkdirSync(dirname(join(dir, to)), { recursive: true });
    execFileSync("cp", [...CP_FLAGS, from, join(dir, to)]);
    appendFileSync(join(dir, ".git", "info", "exclude"), `/${to}\n`);
  };
  for (const p of c.copy) put(join(c.repo, p), p);
  if (c.install) await mustSh(c, c.install, dir, logFile, "install");
  for (const [to, from] of Object.entries(c.files)) put(from, to);
}

// arm: "plain", "otm", or "base" (a clone of an arm copy at its start, for the baseline and the judges).
export async function makeCopy(c, { dir, arm, source = c.repo, commit = c.commit, logFile }) {
  mkdirSync(dirname(dir), { recursive: true });
  git(dirname(dir), "clone", "-q", "--no-hardlinks", source, dir);
  cutFuture(dir, commit);
  for (const key of ["user.name", "user.email", "core.hooksPath"]) {
    const value = gitOr(c.repo, "config", key);
    if (value) git(dir, "config", key, value);
  }
  await arrange(c, arm, dir, logFile);
  await furnish(c, dir, logFile);
  return { dir, base: git(dir, "rev-parse", "HEAD"), mentions: arm === "plain" ? mentions(dir) : [] };
}
