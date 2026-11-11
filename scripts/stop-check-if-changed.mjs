// npm run check runs the stop check's tests (20-55 s) only when a stop check file changed since origin/main, committed
// or not, so a stop in this repo stays about a second (D-038). CI runs them on every push, on Linux and Windows.
// Where git can't say (no origin/main, git failing), they run.
import { execFileSync, spawnSync } from "node:child_process";

const git = (...args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
};
const base = git("merge-base", "HEAD", "origin/main")?.trim();
const diff = base ? git("diff", "--name-only", base) : null;
const added = base ? git("ls-files", "--others", "--exclude-standard") : null;
const changed = diff === null || added === null ? null : `${diff}\n${added}`.split("\n").filter((p) => p.includes("stop-check"));

if (changed !== null && changed.length === 0) {
  console.log("test-stop-check: skipped, no stop check file changed since origin/main (CI runs it on every push)");
} else {
  const run = spawnSync(process.execPath, ["scripts/test-stop-check.mjs"], { stdio: "inherit" });
  process.exitCode = run.status ?? 1;
}
