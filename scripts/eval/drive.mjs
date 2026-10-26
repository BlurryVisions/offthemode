// Runs one arm the way the desktop app runs a session: stream-json in and out with stdin kept open, so background
// agents and workflows finish and report back. Never plain `claude -p` for this: its exit kills background agents.
// A turn ends after quietMinutes with no output and no agent file changing; then the next logged reply goes in,
// or the session closes.
import { spawn } from "node:child_process";
import { appendFileSync, createWriteStream, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { say, M } from "./run.mjs";
import { sessionFile, sessionUsage } from "./measure.mjs";
import { changedFiles } from "./blind.mjs";
import { ARM_NAMES } from "./case.mjs";

// The launching session's own settings (its id, effort, host socket) stay out of the runs, so a run started from
// a terminal and one started from inside Claude behave the same. The account settings stay.
const KEEP = new Set(["CLAUDE_CODE_OAUTH_SCOPES", "CLAUDE_CODE_ORGANIZATION_UUID", "CLAUDE_CODE_ACCOUNT_UUID", "CLAUDE_CODE_USER_EMAIL"]);
export const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("CLAUDE") || KEEP.has(k)));

function claudeArgs(c, arm, sid) {
  const args = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose",
    "--session-id", sid, "--model", c.model, "--settings", JSON.stringify(c.settings),
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
const limitHit = (text) => /(hit|reached) your .{0,40}limit|spend limit|usage limit/i.test(text);

class ArmSession {
  constructor({ c, arm, dir, base, logDir }, resolve) {
    Object.assign(this, { c, dir, base, logDir, resolve, name: ARM_NAMES[arm], sid: randomUUID() });
    this.messages = [c.askText, ...c.replyTexts];
    this.turns = [];
    Object.assign(this, { results: 0, last: Date.now(), result: null, denials: 0, stoppedBy: null, buf: "", done: false, minutes: 0 });
    this.stream = createWriteStream(join(logDir, "stream.jsonl"));
    this.child = spawn("claude", claudeArgs(c, arm, this.sid), { cwd: dir, env: cleanEnv(), stdio: ["pipe", "pipe", "pipe"] });
    this.child.stdout.on("data", (d) => this.read(d));
    this.child.stderr.on("data", (d) => appendFileSync(join(logDir, "stderr.log"), d));
    this.child.on("exit", (code) => this.closed(code));
    this.tick = setInterval(() => this.watch(), 15_000);
    this.brake = setInterval(() => this.measure(), 60_000);
    this.send();
  }

  send() {
    this.turns.push({ sent: new Date().toISOString(), resultsBefore: this.results });
    const content = this.messages[this.turns.length - 1];
    this.child.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content } }) + "\n");
    say(`${this.name}: turn ${this.turns.length} sent`);
  }

  read(data) {
    this.last = Date.now();
    this.stream.write(data);
    this.buf += data;
    let i;
    while ((i = this.buf.indexOf("\n")) >= 0) {
      const line = this.buf.slice(0, i);
      this.buf = this.buf.slice(i + 1);
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      if (e.type === "result") { this.results++; this.result = e; }
      if (e.type === "system" && e.subtype === "permission_denied") this.denials++;
    }
  }

  // Background agents keep writing their own files while the main chat is silent, so both must be quiet.
  watch() {
    const turn = this.turns.at(-1);
    if (this.results <= turn.resultsBefore) return;
    const file = sessionFile(this.sid);
    const activeAt = Math.max(this.last, newest(file && file.slice(0, -".jsonl".length)));
    if (Date.now() - activeAt < this.c.quietMinutes * 60_000) return;
    this.endTurn(activeAt);
    if (limitHit(turn.text)) this.finish("limit");
    else if (this.turns.length < this.messages.length) this.send();
    else this.finish(null);
  }

  endTurn(activeAt) {
    const turn = this.turns.at(-1), r = this.result, text = r?.result ?? "";
    const error = r && r.terminal_reason !== "completed" ? r.terminal_reason ?? "error" : null;
    Object.assign(turn, { ended: new Date(activeAt).toISOString(), text, asked: asksOwner(text), changed: changedFiles(this.dir, this.base), error });
    say(`${this.name}: turn ${this.turns.length} ended${turn.asked ? ", asking the owner" : ""}, ${turn.changed} files changed`);
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
    if (why === "stop-at") setTimeout(() => this.child.kill("SIGTERM"), 10_000);
  }

  closed(code) {
    if (!this.done) {
      if (!this.turns.at(-1).ended) this.endTurn(this.last);
      this.finish(code ? `exit ${code}` : "exit");
    }
    this.stream.end();
    say(`${this.name}: session closed`);
    const turns = this.turns.map(({ resultsBefore, ...t }) => t);
    this.resolve({ sid: this.sid, turns, denials: this.denials, stoppedBy: this.stoppedBy });
  }
}

export const driveArm = (opts) => new Promise((resolve) => new ArmSession(opts, resolve));
