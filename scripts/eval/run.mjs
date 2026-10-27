// Process helpers the eval steps share: git, a case's own shell commands, and the progress lines.
import { execFileSync, spawn } from "node:child_process";
import { appendFileSync } from "node:fs";

export function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 30 }).trim();
}

// git that may fail on purpose (a config key that isn't set, a grep with no match): the failure reads as empty.
export function gitOr(cwd, ...args) {
  try { return git(cwd, ...args); } catch { return ""; }
}

// Whatever the eval started stops with it, however it ends: case commands run in process groups of their own, which
// Ctrl-C no longer reaches, and the claude sessions are tracked too.
const live = new Set(), sessions = new Set();
function stopAll() {
  for (const pid of live) { try { process.kill(-pid, "SIGKILL"); } catch { /* already gone */ } }
  for (const child of sessions) child.kill("SIGTERM");
}
process.on("exit", stopAll);
for (const [signal, number] of [["SIGINT", 2], ["SIGTERM", 15]]) process.on(signal, () => { stopAll(); process.exit(128 + number); });

// A claude session the eval started, stopped with the eval if it is still running then.
export function track(child) {
  sessions.add(child);
  child.on("exit", () => sessions.delete(child));
  return child;
}

// A case's own command (setup, install, check, score), run by the shell in a copy, its output kept in a log file.
// It runs in its own process group: once the command exits, or at the timeout, whatever it left running (a watcher,
// a server) is stopped, so nothing holds the output open and the eval moves on with the command's own exit code.
export function sh(command, { cwd, env = {}, logFile, timeoutMin = 30 }) {
  return new Promise((resolve) => {
    const child = spawn("sh", ["-c", command], { cwd, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"], detached: true });
    let out = "", done = false;
    live.add(child.pid);
    const stopGroup = () => { try { process.kill(-child.pid, "SIGKILL"); } catch { /* the group is already gone */ } };
    const end = (code) => { if (!done) { done = true; stopGroup(); live.delete(child.pid); clearTimeout(timer); resolve({ code, out }); } };
    const take = (d) => { out += d; if (logFile) appendFileSync(logFile, d); };
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    const timer = setTimeout(() => { take(`\n(stopped after ${timeoutMin} minutes)\n`); end(124); }, timeoutMin * 60_000);
    child.on("error", (e) => { take(String(e)); end(127); });
    child.on("exit", (code) => setTimeout(() => end(code ?? 1), 2000));
    child.on("close", (code) => end(code ?? 1));
  });
}

let logFile = null;
export function logTo(file) { logFile = file; }

export function say(line) {
  const text = `${new Date().toTimeString().slice(0, 8)} ${line}`;
  console.log(text);
  if (logFile) appendFileSync(logFile, text + "\n");
}

export const M = (tokens) => (tokens < 1e6 ? `${Math.round(tokens / 1000)}k` : `${(tokens / 1e6).toFixed(1)}M`);
