// What counts as a change: the stop check's fingerprint, which lets a claim reuse the last full run when no file
// changed, and must never do so when one did. Run by scripts/test-stop-check.mjs.
import { mkdirSync, rmSync, chmodSync, symlinkSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { BASE, OUT, project, edit, ran, hook, now, expect, git } from "./stop-check-harness.mjs";

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
  if (posix) symlinkSync("nowhere", join(dir, "dangling")), symlinkSync(OUT, join(dir, "to-a-folder"));
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
  await now(off);
  const record = await steps(off, [["committed after --now", () => commit(off)]]);
  // A link's id is hashed with the repository's own hash.
  const sha256 = project("sha256", { commands: "check `node count.mjs`", init: ["--object-format=sha256"] });
  symlinkSync("count.mjs", join(sha256, "link.mjs"));
  await now(sha256);
  const linked = await steps(sha256, [["committed after --now", () => commit(sha256)]]);
  expect(record === "committed after --now: 1 same" && linked === "committed after --now: 1 same",
    "with core.fileMode off git keeps the index's mode, and in a SHA-256 repository a link has a SHA-256 id: the fingerprint matches both, so a commit after --now reuses the run", `${record} | ${linked}`);
}

async function unreadable() {
  if (!posix || process.getuid?.() === 0) return; // Windows and root read a file whose mode says no
  const dir = project("unreadable", { commands: "check `node count.mjs`" });
  edit(dir, "secret.txt", "s");
  chmodSync(join(dir, "secret.txt"), 0);
  const record = await steps(dir, [["first"], ["again"]]);
  const crashed = (await hook(dir)).shown.includes("couldn't run");
  chmodSync(join(dir, "secret.txt"), 0o644);
  expect(record === "first: 1 ran, again: 2 ran" && !crashed, "a changed file it can't read leaves it unsure: no crash, and every claim runs the checks", record);
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

export const gitCases = [commitAfterNow, subfolder, nestedRepos, shapes, gitsOwnView, conflict, modes, unreadable, gitFails];
