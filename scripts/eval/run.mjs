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

// A case's own command (install, check, score), run by the shell in a copy, its output kept in a log file.
export function sh(command, { cwd, env = {}, logFile, timeoutMin = 30 }) {
  return new Promise((resolve) => {
    const child = spawn("sh", ["-c", command], { cwd, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    const take = (d) => { out += d; if (logFile) appendFileSync(logFile, d); };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    const timer = setTimeout(() => child.kill("SIGTERM"), timeoutMin * 60_000);
    child.on("close", (code) => { clearTimeout(timer); resolve({ code: code ?? 1, out }); });
  });
}

let logFile = null;
export function logTo(file) { logFile = file; }

export function say(line) {
  const text = `${new Date().toTimeString().slice(0, 8)} ${line}`;
  console.log(text);
  if (logFile) appendFileSync(logFile, text + "\n");
}

export const M = (tokens) => `${(tokens / 1e6).toFixed(1)}M`;
