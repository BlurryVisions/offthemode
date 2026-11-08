// What counts as a change: the stop check's fingerprint, which lets a claim reuse the last full run when no file
// changed, and must never do so when one did. Run by scripts/test-stop-check.mjs.
import { mkdirSync, rmSync, chmodSync, symlinkSync, copyFileSync, renameSync, existsSync, readFileSync, writeFileSync, truncateSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { BASE, project, edit, ran, hook, now, expect, git, show, ownerLine, OWNER } from "./stop-check-harness.mjs";

const posix = process.platform !== "win32";
const reused = (h) => h.shown.includes("No file changed since");
const commit = (dir, message = "work") => { git(dir, "add", "-A"); git(dir, "commit", "-qm", message); };
/** Makes each change, then claims done; the record says how many times the check ran so far, and whether the claim
 * reused the last run. */
async function steps(dir, list) {
  const out = [];
  for (const [what, change] of list) {
    await change?.();
    const h = await hook(dir);
    out.push(`${what}: ${ran(dir).length} ${reused(h) ? "same" : "ran"}${h.stderr.includes("killed") ? " (hung)" : ""}`);
  }
  return out.join(", ");
}

async function commitAfterNow() {
  const dir = project("commit", { commands: "check `node count.mjs`" });
  edit(dir, ".gitattributes", "*.txt text eol=crlf\n");
  commit(dir, "line endings");
  edit(dir, "lines.txt", "one\r\ntwo\r\n"); // new, with line endings git's filter changes when it stores the file
  edit(dir, "fail.txt", "0");
  git(dir, "add", "fail.txt"); // staged before --now, as an AI often does
  git(dir, "mv", "old-rule.mjs", "moved-rule.mjs");
  rmSync(join(dir, "lab.mjs"));
  if (posix) symlinkSync("nowhere", join(dir, "dangling")), symlinkSync(join(dir, ".offthemode"), join(dir, "to-a-folder"));
  const n = await now(dir);
  const record = await steps(dir, [
    ["committed after --now", () => commit(dir)],
    ["a real change", () => edit(dir, "lines.txt", "one\r\nthree\r\n")],
    // Git on Windows ignores the executable bit.
    ...(posix ? [["a mode change", () => chmodSync(join(dir, "pass.mjs"), 0o755)], ["committed", () => commit(dir, "mode")]] : []),
  ]);
  const want = ["committed after --now: 1 same", "a real change: 2 ran", ...(posix ? ["a mode change: 3 ran", "committed: 3 same"] : [])].join(", ");
  expect(n.code === 0 && record === want, "--now, then a commit of the same work (new, changed, staged, renamed and deleted files, links, line endings a filter changes): the claim reuses the run; a real change or a mode change runs the checks", record);
}

async function subfolder() {
  const dir = project("app", { commands: "check `node count.mjs`", inside: "monorepo" }), top = join(BASE, "monorepo");
  edit(dir, "fail.txt", "0");
  edit(top, "top.txt", "t");
  await now(dir);
  const record = await steps(dir, [["committed from the top", () => commit(top)], ["a change outside the project's folder", () => edit(top, "top.txt", "u")]]);
  expect(record === "committed from the top: 1 same, a change outside the project's folder: 2 ran", "a project in a subfolder of its repository: a commit after --now reuses the run; a change anywhere in the repository runs the checks", record);
}

// A repository inside the project, untracked or a submodule, counts by the commit it's at, and runs the checks while it
// holds uncommitted work, whatever the owner's git settings say to hide.
async function nestedRepos() {
  const dir = project("nested", { commands: "check `node count.mjs`" }), inner = join(dir, "vendor/lib");
  mkdirSync(inner, { recursive: true });
  edit(dir, "vendor/lib/a.txt", "a");
  git(inner, "init", "-q");
  commit(inner, "a");
  git(inner, "config", "status.showUntrackedFiles", "no");
  const record = await steps(dir, [
    ["first"], ["untouched"],
    ["edited inside", () => edit(dir, "vendor/lib/a.txt", "b")],
    ["committed inside", () => git(inner, "commit", "-qam", "b")],
    ["a new file inside", () => edit(dir, "vendor/lib/new.txt", "n")],
    ["removed again", () => rmSync(join(inner, "new.txt"))],
    ["untouched again"],
    ["added as a submodule", () => { git(dir, "add", "vendor/lib"); git(dir, "commit", "-qm", "submodule"); git(dir, "config", "diff.ignoreSubmodules", "all"); }],
    ["submodule edited", () => edit(dir, "vendor/lib/a.txt", "c")],
    ["submodule committed", () => git(inner, "commit", "-qam", "c")],
    ["submodule untouched"],
  ]);
  const want = "first: 1 ran, untouched: 1 same, edited inside: 2 ran, committed inside: 3 ran, a new file inside: 4 ran, removed again: 5 ran, untouched again: 5 same, added as a submodule: 5 same, submodule edited: 6 ran, submodule committed: 7 ran, submodule untouched: 7 same";
  expect(record === want, "a repository inside the project, untracked or a submodule, whatever the git settings: unchanged, the claim reuses the run; uncommitted work or a new commit there runs the checks", record);
}

async function shapes() {
  if (!posix) return; // links need extra rights on Windows
  const dir = project("shapes", { commands: "check `node count.mjs`" }), x = join(dir, "pass.mjs");
  const record = await steps(dir, [
    ["first"],
    ["a file becomes a link", () => { rmSync(x); symlinkSync("count.mjs", x); }],
    ["committed", () => commit(dir)],
    ["the link becomes a folder", () => { rmSync(x); mkdirSync(x); edit(dir, "pass.mjs/inner.txt", "i"); }],
    ["committed", () => commit(dir)],
    ["the folder becomes a file", () => { rmSync(x, { recursive: true }); edit(dir, "pass.mjs", "back"); }],
    ["committed", () => commit(dir)],
    ["a pipe in its place", () => { rmSync(x); execFileSync("mkfifo", [x]); }],
  ]);
  const want = "first: 1 ran, a file becomes a link: 2 ran, committed: 2 same, the link becomes a folder: 3 ran, committed: 3 same, the folder becomes a file: 4 ran, committed: 4 same, a pipe in its place: 5 ran";
  expect(record === want, "a file that becomes a link, a folder, then a file again runs the checks each time, each commit reuses the run, and a pipe in its place leaves it unsure instead of hanging", record);
}

// The ways git itself says a file is as stored when it isn't, or stores it differently from what's on disk.
async function gitsOwnView() {
  const dir = project("own-view", { commands: "check `node count.mjs`" });
  copyFileSync(join(dir, "old-rule.mjs"), join(dir, "copy.mjs"));
  git(dir, "add", "-N", "copy.mjs"); // with the old file gone, git status reports a rename in the worktree
  git(dir, "update-index", "--assume-unchanged", "pass.mjs");
  git(dir, "update-index", "--skip-worktree", "screen.mjs");
  const record = await steps(dir, [
    ["first"],
    ["the renamed file's old path removed", () => rmSync(join(dir, "old-rule.mjs"))],
    ["an assume-unchanged file edited", () => edit(dir, "pass.mjs", "edited")],
    ["a skip-worktree file edited", () => edit(dir, "screen.mjs", "edited")],
  ]);
  expect(record === "first: 1 ran, the renamed file's old path removed: 2 ran, an assume-unchanged file edited: 3 ran, a skip-worktree file edited: 4 ran",
    "an old path git reports as renamed, and files git was told not to look at (assume-unchanged, skip-worktree), still count", record);
}

async function conflict() {
  const dir = project("conflict", { commands: "check `node count.mjs`" });
  const main = execFileSync("git", ["branch", "--show-current"], { cwd: dir, encoding: "utf8" }).trim();
  git(dir, "checkout", "-qb", "other");
  git(dir, "rm", "-q", "pass.mjs");
  git(dir, "commit", "-qm", "gone");
  git(dir, "checkout", "-q", main);
  edit(dir, "pass.mjs", "kept");
  git(dir, "commit", "-qam", "kept");
  try { git(dir, "merge", "-q", "other"); } catch { /* the modify/delete conflict this case needs */ }
  const record = await steps(dir, [["first"], ["the conflicted file edited", () => edit(dir, "pass.mjs", "edited")]]);
  expect(record === "first: 1 ran, the conflicted file edited: 2 ran", "a file in a modify/delete conflict still counts: editing it runs the checks", record);
}

async function modes() {
  if (!posix) return; // on Windows the index's mode is the usual case, and the cases above cover it
  const off = project("filemode-off", { commands: "check `node count.mjs`" });
  git(off, "config", "core.fileMode", "false");
  edit(off, "tool.sh", "echo hi");
  chmodSync(join(off, "tool.sh"), 0o755);
  chmodSync(join(off, "pass.mjs"), 0o755);
  symlinkSync("count.mjs", join(off, "link.mjs"));
  await now(off);
  // With core.fileMode off git status hides a mode change, and keeps a link's mode for a file in its place.
  const record = await steps(off, [
    ["committed after --now", () => commit(off)],
    ["a mode change git status hides", () => chmodSync(join(off, "tool.sh"), 0o644)],
    ["a link made a file holding its text", () => { rmSync(join(off, "link.mjs")); edit(off, "link.mjs", "count.mjs"); }],
  ]);
  // A link's id is hashed with the repository's own hash.
  const sha256 = project("sha256", { commands: "check `node count.mjs`", init: ["--object-format=sha256"] });
  symlinkSync("count.mjs", join(sha256, "link.mjs"));
  await now(sha256);
  const linked = await steps(sha256, [["committed after --now", () => commit(sha256)]]);
  expect(record === "committed after --now: 1 same, a mode change git status hides: 2 ran, a link made a file holding its text: 3 ran" && linked === "committed after --now: 1 same",
    "with core.fileMode off, and in a SHA-256 repository, a commit after --now reuses the run; a mode change git status hides, or a link made a file, still runs the checks", `${record} | ${linked}`);
}

async function unreadable() {
  if (!posix || process.getuid?.() === 0) return; // Windows and root read a file whose mode says no
  const dir = project("unreadable", { commands: "check `node count.mjs`" });
  edit(dir, "secret.txt", "s");
  chmodSync(join(dir, "secret.txt"), 0);
  const record = await steps(dir, [["first"], ["again"]]);
  const crashed = (await hook(dir)).shown.includes("couldn't run");
  chmodSync(join(dir, "secret.txt"), 0o644);
  // git status tells of a folder it can't enter only on stderr, and exits 0.
  const shut = project("unenterable", { commands: "check `node count.mjs`" }), lib = join(shut, "lib");
  mkdirSync(lib), edit(shut, "lib/x.js", "x"), commit(shut, "lib");
  const closed = await steps(shut, [["first"], ["a file edited in a folder git then can't enter", () => { edit(shut, "lib/x.js", "y"); chmodSync(lib, 0o600); }]]);
  chmodSync(lib, 0o755);
  expect(record === "first: 1 ran, again: 2 ran" && !crashed && closed === "first: 1 ran, a file edited in a folder git then can't enter: 2 ran",
    "a changed file it can't read, or in a folder git can't enter, leaves it unsure: no crash, and every claim runs the checks", `${record} | ${closed}`);
}

// git status fails on a submodule whose repository is gone, while git ls-files still works.
async function gitFails() {
  const dir = project("git-fails", { commands: "check `node count.mjs`" }), inner = join(dir, "vendor/lib");
  mkdirSync(inner, { recursive: true });
  edit(dir, "vendor/lib/a.txt", "a");
  git(inner, "init", "-q");
  commit(inner, "a");
  commit(dir, "submodule");
  rmSync(join(inner, ".git"), { recursive: true, force: true });
  edit(dir, "vendor/lib/.git", "gitdir: ../nowhere\n");
  const record = await steps(dir, [["first"], ["nothing changed"]]);
  expect(record === "first: 1 ran, nothing changed: 2 ran", "when git status fails it is unsure, never \"nothing changed\": every claim runs the checks", record);
}

// The notes a check reads count (the method's check-bans.sh reads DESIGN.md); STATE.md, which changes every reply,
// doesn't. RULES.md and PRODUCT.md count even when git ignores .offthemode/, a line moved from one to the other too.
async function notesCount() {
  const dir = project("notes", { commands: "check `node count.mjs`" }), out = project("notes-ignored", { commands: "check `node count.mjs`" });
  const record = await steps(dir, [["first"], ["STATE.md edited", () => edit(dir, ".offthemode/STATE.md", "where things stand")], ["DESIGN.md edited", () => edit(dir, ".offthemode/DESIGN.md", "### Unbans\n")]]);
  edit(out, ".gitignore", ".offthemode/\n"), git(out, "rm", "-rq", "--cached", ".offthemode"), commit(out, "notes kept out of git");
  const rules = readFileSync(join(out, ".offthemode/RULES.md"), "utf8"), product = readFileSync(join(out, ".offthemode/PRODUCT.md"), "utf8");
  const moved = await steps(out, [["first", () => edit(out, ".offthemode/RULES.md", `${rules}x\n`)], ["a line moved from RULES.md to PRODUCT.md", () => { edit(out, ".offthemode/RULES.md", rules); edit(out, ".offthemode/PRODUCT.md", `x\n${product}`); }]]);
  expect(record === "first: 1 ran, STATE.md edited: 1 same, DESIGN.md edited: 2 ran" && moved === "first: 1 ran, a line moved from RULES.md to PRODUCT.md: 2 ran",
    "a note a check reads counts as a change, STATE.md doesn't, and RULES.md and PRODUCT.md count even when git ignores .offthemode/", `${record} | ${moved}`);
}

// A file that changes while the checks run, here one a check writes: that run didn't check the files as they are now.
async function changedWhileRunning() {
  const dir = project("while-running", { commands: "check `node count.mjs && node write.mjs`" });
  edit(dir, "write.mjs", "import { writeFileSync } from 'node:fs'; writeFileSync('made.txt', 'made by the check');"), commit(dir, "a check that writes");
  const record = await steps(dir, [["first"], ["the check wrote made.txt while it ran"], ["it wrote the same bytes again"]]);
  expect(record === "first: 1 ran, the check wrote made.txt while it ran: 2 ran, it wrote the same bytes again: 2 same",
    "a file changed while the checks ran makes the next claim run them again; once a run leaves the files as it found them, it is reused", record);
}

// On a disk that ignores letter case (macOS's and Windows' default), a rename that changes only a letter's case.
async function caseRename() {
  const dir = project("case", { commands: "check `node count.mjs`" });
  edit(dir, "Button.txt", "b"), edit(dir, "Other.txt", "o"), commit(dir, "names");
  if (!existsSync(join(dir, "button.txt"))) return; // a disk that tells case apart: git sees the rename itself
  const record = await steps(dir, [["first"], ["Button.txt renamed button.txt", () => renameSync(join(dir, "Button.txt"), join(dir, "button.txt"))]]);
  git(dir, "mv", "Other.txt", "other.txt");
  await now(dir);
  const committed = await steps(dir, [["git mv Other.txt other.txt, --now, then committed", () => commit(dir)]]);
  expect(record === "first: 1 ran, Button.txt renamed button.txt: 2 ran" && committed === "git mv Other.txt other.txt, --now, then committed: 3 same",
    "a rename that changes only a letter's case runs the checks, and committed after --now it reuses the run", `${record} | ${committed}`);
}

// Repositories inside repositories count by their commit and their files at any depth, whatever their own git hides.
async function deepRepos() {
  const dir = project("deep", { commands: "check `node count.mjs`" }), lib = join(dir, "vendor/lib"), x = join(lib, "deps/x");
  mkdirSync(x, { recursive: true });
  edit(x, "a.txt", "a"), git(x, "init", "-q"), commit(x, "a");
  edit(lib, "b.txt", "b"), git(lib, "init", "-q"), commit(lib, "b"); // takes deps/x in as a repository inside it
  git(lib, "config", "diff.ignoreSubmodules", "all"), git(lib, "config", "status.showUntrackedFiles", "no"), commit(dir, "vendor/lib");
  const record = await steps(dir, [
    ["first"], ["untouched"], ["edited two deep", () => edit(x, "a.txt", "changed")],
    ["junk in the library", () => edit(lib, ".DS_Store", "finder")], ["untouched, junk and all"],
    ["a file the library's git was told not to look at, edited", () => { git(lib, "update-index", "--assume-unchanged", "b.txt"); edit(lib, "b.txt", "changed"); }],
    ["the library's folder emptied, as git submodule deinit leaves it", () => { rmSync(lib, { recursive: true, force: true }); mkdirSync(lib); }], ["untouched, emptied"],
    ["a file put in the empty folder, which git doesn't see", () => edit(lib, "stray.txt", "s")], ["untouched, unsure"],
  ]);
  const want = "first: 1 ran, untouched: 1 same, edited two deep: 2 ran, junk in the library: 3 ran, untouched, junk and all: 3 same, a file the library's git was told not to look at, edited: 4 ran, the library's folder emptied, as git submodule deinit leaves it: 5 ran, untouched, emptied: 5 same, a file put in the empty folder, which git doesn't see: 6 ran, untouched, unsure: 7 ran";
  expect(record === want, "repositories two deep: a change at any depth runs the checks, whatever their settings hide; junk in one costs one run, not every run", record);
}

async function linkOutside() {
  if (!posix) return;
  const dir = project("link-out", { commands: "check `node count.mjs`" }), shared = join(BASE, "shared-lib");
  mkdirSync(shared), edit(shared, "cfg.txt", "ok"), symlinkSync(shared, join(dir, "shared")), commit(dir, "a link out");
  const record = await steps(dir, [["first"], ["the file it points to edited", () => edit(shared, "cfg.txt", "BAD")]]);
  expect(record === "first: 1 ran, the file it points to edited: 2 ran", "a link out of the repository leaves it unsure, since what it points to can change with no file here changing", record);
}

// A check that runs git reads what a commit changes, so it runs again at a stop with no file changed.
async function gitCheck() {
  const dir = project("git-check", { commands: "check `node count.mjs && git diff --exit-code`" });
  edit(dir, "pass.mjs", "changed");
  const n = await now(dir);
  commit(dir);
  const h = await hook(dir);
  expect(n.code === 1 && ran(dir) === "xx" && h.shown.includes("so only the checks that run git ran again") && h.shown.includes("passed (") && !h.shown.includes("its run at") && !h.back,
    "a check that runs git (git diff --exit-code) fails on --now, then after a commit runs again and passes, with no file changed", show(h));
}

async function trailingSpace() {
  if (!posix) return; // Windows drops a trailing space from a folder's name
  const dir = project("space ", { commands: "check `node count.mjs`" });
  const record = await steps(dir, [["first"], ["a.txt made", () => edit(dir, "a.txt", "1")], ["a.txt edited", () => edit(dir, "a.txt", "2")], ["b.txt made", () => edit(dir, "b.txt", "1")], ["untouched"]]);
  expect(record === "first: 1 ran, a.txt made: 2 ran, a.txt edited: 3 ran, b.txt made: 4 ran, untouched: 4 same", "in a folder whose name ends with a space, every change runs the checks, and with none the claim reuses the run", record);
}

// Too much to read, here a 200 MB file and then 5,001 files git doesn't ignore, leaves it unsure instead of slowing every stop.
async function tooMuch() {
  const dir = project("too-much", { commands: "check `node count.mjs`" }), big = join(dir, "data.bin");
  const record = await steps(dir, [
    ["first", () => { writeFileSync(big, ""); truncateSync(big, 200 * 2 ** 20); }], ["nothing changed"],
    ["5,001 small files in its place", () => { rmSync(big); mkdirSync(join(dir, "many")); for (let i = 0; i <= 5000; i++) writeFileSync(join(dir, "many", `${i}.txt`), String(i)); }], ["nothing changed again"],
  ]);
  expect(record === "first: 1 ran, nothing changed: 2 ran, 5,001 small files in its place: 3 ran, nothing changed again: 4 ran", "more than 128 MB or 5,000 files to read leaves it unsure: every claim runs the checks", record);
}

// A project with no repository of its own, inside one that ignores everything (a home folder's dotfiles repository).
async function parentIgnores() {
  const dir = project("app-in-home", { commands: "check `node count.mjs`", noGit: true, inside: "home-dotfiles" }), home = join(BASE, "home-dotfiles");
  edit(home, ".gitignore", "*\n!.gitignore\n"), git(home, "init", "-q"), commit(home, "dotfiles");
  const record = await steps(dir, [["first"], ["a.txt edited", () => edit(dir, "a.txt", "1")]]);
  expect(record === "first: 1 ran, a.txt edited: 2 ran", "a project the repository above it ignores is outside git: every claim runs the checks", record);
}

// git --literal-pathspecs sets this for the programs it starts; it would make the ':/' and ':(exclude)' paths match nothing.
async function literalPathspecs() {
  const dir = project("literal", { commands: "check `node count.mjs`" }), env = { GIT_LITERAL_PATHSPECS: "1" };
  await hook(dir, {}, env);
  edit(dir, "a.txt", "1");
  const h = await hook(dir, {}, env);
  expect(ran(dir) === "xx" && !h.shown.includes("No file changed"), "with GIT_LITERAL_PATHSPECS=1 set, a change still runs the checks", show(h));
}

// Two projects in one repository each keep their own state: neither takes the other's rules or last results.
async function twoProjects() {
  const a = project("proj-a", { commands: "check `node pass.mjs` · rule checks `node rule.mjs`", product: ownerLine(OWNER), inside: "two-projects" });
  const b = project("proj-b", { commands: "check `node pass.mjs`", inside: "two-projects" });
  const first = await hook(a), h = await hook(b);
  expect(first.shown.includes("All passed.") && h.shown.includes("The checks passed.") && !h.shown.includes("is no longer in PRODUCT.md") && !h.back,
    "two projects in one repository keep their own state: the second never takes the first's rule for one it dropped", show(h));
  expect(first.shown.includes("has never been seen to fail. Before you trust its rule check, run it on the code from before the change. It must find"),
    "a rule never seen to fail comes with a plain note on when to trust its check", show(first));
}

export const gitCases = [commitAfterNow, subfolder, nestedRepos, shapes, gitsOwnView, conflict, modes, unreadable, gitFails, notesCount, changedWhileRunning, caseRename, deepRepos, linkOutside, gitCheck, trailingSpace, tooMuch, parentIgnores, literalPathspecs, twoProjects];
