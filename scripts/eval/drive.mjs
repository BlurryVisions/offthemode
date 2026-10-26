// Runs one arm the way the desktop app runs a session: stream-json in and out with stdin kept open and live output,
// so background agents and workflows finish and report back. Never plain `claude -p` for this: its exit kills
// background agents. A turn ends when the main chat has answered and is not working again, every background agent
// and workflow has reported back, and nothing has moved for quietMinutes (no output, no agent file changing); then
// the next logged reply goes in, or the session closes.
import { spawn } from "node:child_process";
import { appendFileSync, createWriteStream, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { say, M } from "./run.mjs";
import { sessionFile, sessionUsage } from "./measure.mjs";
import { changedFiles } from "./blind.mjs";
import { ARM_NAMES } from "./case.mjs";

// A background shell may never end (a dev server), so open shells hold a turn only this long. Nothing moving at all
// for HANG_MINUTES, with agents still open or no answer yet, is a hang: the arm stops and the report says so.
const SHELL_MINUTES = 20;
const HANG_MINUTES = 60;

// What the launcher's environment would tell an arm about the eval stays out: the launching Claude session's own
// settings (its id, effort, host socket), npm's variables (the package name, the eval script, this repo's path and
// its node_modules/.bin on PATH) and the eval's own folders. The account settings stay. tmp: Claude Code's scratch
// folder, kept next to the copy instead of /tmp, which macOS empties after 3 days.
const KEEP = new Set(["CLAUDE_CODE_OAUTH_SCOPES", "CLAUDE_CODE_ORGANIZATION_UUID", "CLAUDE_CODE_ACCOUNT_UUID", "CLAUDE_CODE_USER_EMAIL"]);
const DROP = (k) => (k.startsWith("CLAUDE") && !KEEP.has(k)) || /^(npm_|OTM_EVAL_)/i.test(k) || ["INIT_CWD", "OLDPWD", "PWD", "_"].includes(k);
export const cleanEnv = (tmp, cwd) => ({
  ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !DROP(k))),
  PATH: (process.env.PATH ?? "").split(":").filter((p) => !/node_modules\/\.bin$|node-gyp-bin/.test(p)).join(":"),
  PWD: cwd,
  CLAUDE_CODE_TMPDIR: tmp,
});

function claudeArgs(c, arm, sid, settings) {
  const args = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--include-partial-messages",
    "--session-id", sid, "--model", c.model, "--settings", JSON.stringify(settings),
    "--permission-mode", "auto", "--permission-prompts", "none",
    "--disallowedTools", "Bash(git push*)", ...c.disallow, "--strict-mcp-config"];
  if (arm === "otm") {
    args.push("--mcp-config", JSON.stringify({ mcpServers: { offthemode: { type: "http", url: c.mcp } } }), "--allowedTools", "mcp__offthemode");
  }
  return args;
}

function newest(dir) {
  if (!dir || !existsSync(dir)) return 0;
  let m = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    m = Math.max(m, e.isDirectory() ? newest(p) : statSync(p).mtimeMs);
  }
  return m;
}

// A turn asks the owner when its last words hold a question: the owner has to answer before the work goes on.
const asksOwner = (text) => text.replace(/```[\s\S]*?```/g, "").replace(/https?:\S+/g, "").trim().slice(-600).includes("?");
const DONE = new Set(["completed", "failed", "killed", "stopped", "cancelled"]);

class ArmSession {
  constructor({ c, arm, dir, base, logDir, tmp, settings }, resolve) {
    Object.assign(this, { c, dir, base, logDir, resolve, name: ARM_NAMES[arm], sid: randomUUID() });
    this.messages = [c.askText, ...c.replyTexts];
    this.turns = [];
    this.open = new Map();
    Object.assign(this, { results: 0, last: Date.now(), result: null, busy: true, denials: 0, stoppedBy: null, buf: "", done: false, minutes: 0 });
    this.stream = createWriteStream(join(logDir, "stream.jsonl"));
    this.child = spawn("claude", claudeArgs(c, arm, this.sid, settings), { cwd: dir, env: cleanEnv(tmp, dir), stdio: ["pipe", "pipe", "pipe"] });
    this.child.stdin.on("error", () => {}); // a session that died is reported by its exit, not by a failed write
    this.child.stdout.on("data", (d) => this.read(d));
    this.child.stderr.on("data", (d) => appendFileSync(join(logDir, "stderr.log"), d));
    this.child.on("error", (e) => { appendFileSync(join(logDir, "stderr.log"), `${e}\n`); this.closed(null, String(e)); });
    this.child.on("exit", (code) => this.closed(code));
    this.tick = setInterval(() => this.guard(() => this.watch()), 15_000);
    this.brake = setInterval(() => this.guard(() => this.measure()), 60_000);
    this.send();
  }

  // A failing check inside a timer must not crash the run and leave the session going unwatched.
  guard(fn) {
    try { fn(); } catch (e) { appendFileSync(join(this.logDir, "stderr.log"), `eval: ${e.stack ?? e}\n`); }
  }

  send() {
    this.turns.push({ sent: new Date().toISOString(), resultsBefore: this.results });
    this.busy = true;
    const content = this.messages[this.turns.length - 1];
    this.child.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content } }) + "\n");
    say(`${this.name}: turn ${this.turns.length} sent`);
  }

  // The main chat is working from a model call's start (status "requesting", live output, a message) to its answer.
  read(data) {
    this.last = Date.now();
    this.buf += data;
    let i;
    while ((i = this.buf.indexOf("\n")) >= 0) {
      const line = this.buf.slice(0, i);
      this.buf = this.buf.slice(i + 1);
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      if (e.type === "stream_event") { this.busy = true; continue; } // live output: activity, too much to log
      this.stream.write(line + "\n");
      if (e.type === "result") { this.results++; this.result = e; this.busy = false; continue; }
      if ((e.type === "assistant" || e.type === "user") && !e.parent_tool_use_id) this.busy = true;
      if (e.type !== "system") continue;
      if (e.subtype === "status" && e.status === "requesting") this.busy = true;
      if (e.subtype === "permission_denied") this.denials++;
      if (e.subtype === "task_started") this.open.set(e.task_id, { type: e.task_type, what: e.description ?? e.task_id });
      if (e.subtype === "task_notification" || (e.subtype === "task_updated" && DONE.has(e.patch?.status))) this.open.delete(e.task_id);
    }
  }

  // The last moment anything moved: the main chat's output or any file of the session's agents and workflows.
  activeAt() {
    const file = sessionFile(this.sid);
    return Math.max(this.last, newest(file && file.slice(0, -".jsonl".length)));
  }

  watch() {
    const turn = this.turns.at(-1), activeAt = this.activeAt();
    const idle = Date.now() - activeAt, tasks = [...this.open.values()];
    const agents = tasks.filter((t) => t.type !== "local_bash").length;
    if (idle > HANG_MINUTES * 60_000) {
      this.endTurn(activeAt, `nothing moved for ${HANG_MINUTES} min, ${agents ? `${agents} agents or workflows still open` : "no answer"}`);
      return this.finish("hung");
    }
    const quiet = idle >= this.c.quietMinutes * 60_000 && (agents === tasks.length || idle >= SHELL_MINUTES * 60_000);
    if (this.results <= turn.resultsBefore || this.busy || agents || !quiet) return;
    this.endTurn(activeAt);
    if (this.result?.is_error) this.finish(`error: ${(this.result.result ?? this.result.subtype ?? "").slice(0, 120)}`);
    else if (this.turns.length < this.messages.length) this.send();
    else this.finish(null);
  }

  // Only an answer given in this turn counts as its words: a turn that never answered has none.
  endTurn(activeAt, why = null) {
    const turn = this.turns.at(-1), answered = this.results > turn.resultsBefore;
    const r = answered ? this.result : null, text = r?.result ?? "";
    const failed = r && (r.is_error || (r.terminal_reason && r.terminal_reason !== "completed"));
    let changed = null;
    try { changed = changedFiles(this.dir, this.base); } catch { /* reported as unknown */ }
    const error = why ?? (failed ? r.terminal_reason ?? r.subtype ?? "error" : null);
    const ended = new Date(Math.max(activeAt, Date.parse(turn.sent))).toISOString();
    Object.assign(turn, { ended, text, asked: asksOwner(text), changed, error });
    say(`${this.name}: turn ${this.turns.length} ended${turn.asked ? ", asking the owner" : ""}, ${changed ?? "?"} files changed${error ? `, ${error}` : ""}`);
  }

  // A progress line every 5 minutes; with stopAt, the arm is measured every minute and stopped past it.
  measure() {
    this.minutes++;
    if (!this.c.stopAt && this.minutes % 5) return;
    const file = sessionFile(this.sid);
    if (!file) return;
    const u = sessionUsage(file);
    if (this.minutes % 5 === 0) say(`${this.name}: ${M(u.total)} read, ${u.agents} agents, ${this.minutes} min`);
    if (this.c.stopAt && u.total > this.c.stopAt * 1e6) {
      say(`${this.name}: past stopAt (${this.c.stopAt}M read), stopping`);
      this.finish("stop-at");
    }
  }

  finish(why) {
    if (this.done) return;
    this.done = true;
    this.stoppedBy ??= why;
    clearInterval(this.tick);
    clearInterval(this.brake);
    this.child.stdin.end();
    if (why) setTimeout(() => this.child.kill("SIGTERM"), 10_000);
  }

  closed(code, error = null) {
    if (this.resolved) return;
    this.resolved = true;
    const turn = this.turns.at(-1);
    if (turn && !turn.ended) this.guard(() => this.endTurn(this.activeAt(), error ?? (code ? `exit ${code}` : "the session closed")));
    this.finish(error ? "could not start" : code ? `exit ${code}` : "exit");
    this.stream.end();
    say(`${this.name}: session closed`);
    const turns = this.turns.map(({ resultsBefore, ...t }) => t);
    this.resolve({ sid: this.sid, turns, denials: this.denials, stoppedBy: this.stoppedBy, openTasks: [...this.open.values()].map((t) => t.what) });
  }
}

export const driveArm = (opts) => new Promise((resolve) => new ArmSession(opts, resolve));
