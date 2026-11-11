// Off the Mode · the meter, on trial in this repo (STATE.md Next 2, D-034c); setup doesn't install it.
// At each stop it shows you one line: the tokens the chat and its agents read since the meter's last line, how
// large the chat is now (every further step re-reads all of it), and whether agents are still at work. It changes
// nothing: it never sends the AI back, runs no command and makes no network call. It reads only the token counts
// Claude Code keeps beside each model call in the session's own files (the chat's, and its agents' in the folder
// next to it), counted the way `npm run usage` counts them, except that a session continued from an earlier one
// leaves out the copies of that session's calls its file starts with: they were that session's spend. It writes
// one small file of its own in the temp folder: how far it has read. A turn you interrupt, or one that ends on an
// error, runs no hook, so the next line carries that work too. So does a step Claude Code hadn't written to the
// file yet when the hook ran: its docs say the file can lag, and `behind` in the meter's file counts those stops.
// Run it yourself on any session, with nothing saved: node scripts/meter.mjs <session .jsonl>
// To switch it on here, only on the owner's yes: copy this file to .offthemode/meter.mjs, list that copy in
// .git/info/exclude, and add this block to .claude/settings.local.json; Claude Code then runs the copy at each stop.
// SETTINGS {"hooks":{"Stop":[{"hooks":[{"type":"command","command":"node","args":["${CLAUDE_PROJECT_DIR}/.offthemode/meter.mjs"],"timeout":10}]}]}}
import { openSync, readSync, closeSync, fstatSync, readFileSync, writeFileSync, mkdirSync, readdirSync, realpathSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const MARK = "Off the Mode's meter";
// The same reading of a background task's status as the stop check's: these scripts are copied whole, so they share no file.
const ENDED = /complete|done|fail|kill|stop|cancel|error/i;
// No model call's line is this long (the longest of 104,399 real ones is 413 KB; a tool's output has reached
// 92 MB): a longer line is passed over without being held in memory, so one huge line can't slow or hang a stop.
const LONGEST = 16 << 20;

// One line of a session file. Claude Code repeats a call's counts on each line it writes for that call, so a call is
// counted on its first line and known again by its id; only the main chat's own calls say how large the chat is.
function count(line, got, seen) {
  if (!line.includes('"usage"')) return;
  let e;
  try { e = JSON.parse(line.toString("utf8")); } catch { return; }
  const m = e?.message, u = m?.usage;
  if (e?.type !== "assistant" || !u) return;
  if (got.own && typeof e.sessionId === "string" && e.sessionId !== got.own) { got.copies++; return; }
  const key = `${m.id}:${e.requestId}`;
  if (seen.has(key) || key === got.key) {
    if (got.last?.key === key) got.last.reason = m.stop_reason ?? got.last.reason;
    return;
  }
  seen.add(key);
  got.key = key;
  const read = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
  got.tokens += read;
  got.calls++;
  if (!e.isSidechain) got.last = { key, size: read + (u.output_tokens ?? 0), reason: m.stop_reason ?? null };
}

/** The model calls a file gained after `from` (how far the last read got, and the last call it counted), up to `upto`
 * bytes (the whole file when left out). A line still being written is left for the next read. With `own`, the
 * session's id, calls that carry another session's id are left out and counted as `copies`. `null`: unreadable. */
export function gained(file, from, upto = Infinity, own = null) {
  let fd;
  try {
    if (!statSync(file).isFile()) return null; // a folder opens as an empty file on Windows, and a pipe would never end
    fd = openSync(file, "r");
  } catch { return null; }
  try {
    const size = Math.min(fstatSync(fd).size, upto), start = from?.offset ?? 0;
    if (size < start) return { shrank: true };
    const got = { offset: start, key: from?.key ?? null, tokens: 0, calls: 0, last: null, own, copies: 0 }, seen = new Set();
    const chunk = Buffer.allocUnsafe(Math.max(1, Math.min(1 << 20, size - start)));
    let rest = [], held = 0; // a line longer than one read, in pieces, joined once at its end
    for (let at = start; at < size; ) {
      const n = readSync(fd, chunk, 0, Math.min(chunk.length, size - at), at);
      if (!n) break; // the file got shorter while it was read
      let i = 0;
      for (let nl; (nl = chunk.indexOf(10, i)) !== -1 && nl < n; i = nl + 1) {
        if (rest && held + nl - i <= LONGEST) count(rest.length ? Buffer.concat([...rest, chunk.subarray(i, nl)]) : chunk.subarray(i, nl), got, seen);
        rest = [];
        held = 0;
        got.offset = at + nl + 1;
      }
      if (i < n && rest) {
        held += n - i;
        if (held <= LONGEST) rest.push(Buffer.from(chunk.subarray(i, n))); else rest = null;
      }
      at += n;
    }
    return got;
  } finally {
    closeSync(fd);
  }
}

export function agentFiles(dir) {
  let found;
  try { found = readdirSync(dir, { withFileTypes: true }); } catch { return []; }
  return found.flatMap((d) => (d.isDirectory() ? agentFiles(join(dir, d.name)) : d.name.startsWith("agent-") && d.name.endsWith(".jsonl") ? [join(dir, d.name)] : [])).sort();
}

const sound = (was) => was?.v === 1 && was.files !== null && typeof was.files === "object" && Object.values(was.files).every((f) => Number.isInteger(f?.offset) && f.offset >= 0);

/** What a session gained since `was`, the meter's own record of how far it had read. With no sound record of this
 * chat, or a file shorter than the record says, everything so far is counted. `own` is the session's id (its file's
 * name when left out). `null`: the chat's file can't be read. */
export function measure(transcript, was, own = basename(transcript, ".jsonl")) {
  const known = sound(was) && was.files[transcript] ? was : null;
  const files = {}, reply = { fresh: !known, chat: 0, steps: 0, agents: 0, agentN: 0, size: known?.size ?? 0 };
  let main = gained(transcript, known?.files[transcript], undefined, own);
  if (!main) return null;
  if (main.shrank) return measure(transcript, null, own);
  // Every call in the file carries another session's id: the id isn't this file's after all, so nothing is left out.
  if (!known && !main.calls && main.copies) main = gained(transcript);
  files[transcript] = { offset: main.offset, key: main.key };
  reply.chat = main.tokens;
  reply.steps = main.calls;
  if (main.last) reply.size = main.last.size;
  for (const file of transcript.endsWith(".jsonl") ? agentFiles(join(transcript.slice(0, -".jsonl".length), "subagents")) : []) {
    const got = gained(file, known?.files[file]);
    if (!got) continue;
    if (got.shrank) return measure(transcript, null, own);
    files[file] = { offset: got.offset, key: got.key };
    reply.agents += got.tokens;
    if (got.calls) reply.agentN++;
  }
  const behind = !main.calls || main.last?.reason === "tool_use";
  return { reply, state: { v: 1, files, size: reply.size, runs: (known?.runs ?? 0) + 1, behind: (known?.behind ?? 0) + (behind ? 1 : 0) } };
}

const n = (x) => (x >= 99.5e6 ? `${Math.round(x / 1e6)}M` : x >= 1e6 ? `${(x / 1e6).toFixed(1)}M` : x >= 1e3 ? `${Math.round(x / 1e3)}k` : String(x));
const some = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function line(reply, working = false) {
  const parts = [reply.steps && `the chat ${n(reply.chat)} in ${some(reply.steps, "step")}`, reply.agentN && `${some(reply.agentN, "agent")} ${n(reply.agents)}`].filter(Boolean);
  return `${MARK} · ${reply.fresh ? "this session so far" : "this reply"}: ${n(reply.chat + reply.agents)} tokens${parts.length ? ` (${parts.join(", ")})` : ""}` +
    (reply.size ? ` · the chat is ${n(reply.size)} now, re-read at every further step` : "") +
    (working ? " · agents are still working, so the next line carries the rest" : "");
}

const working = (tasks) => (Array.isArray(tasks) ? tasks : []).some((t) => /subagent|workflow|teammate/i.test(t?.type ?? "") && !ENDED.test(t?.status ?? ""));

// The hook's input, taken as soon as it is whole: a runner that sends it and never closes the pipe isn't waited for,
// and one that sends nothing is given up on after 3 s.
function stdin() {
  if (process.stdin.isTTY) return Promise.resolve(null);
  return new Promise((ok) => {
    let text = "";
    const whole = () => { try { return JSON.parse(text); } catch { return undefined; } };
    const end = (v) => { clearTimeout(timer); process.stdin.destroy(); ok(v); };
    const timer = setTimeout(() => end(null), 3000);
    process.stdin.setEncoding("utf8").on("error", () => end(null)).on("end", () => end(whole() ?? null))
      .on("data", (d) => { text += d; const v = whole(); if (v !== undefined) end(v); });
  });
}

const show = (text) => process.stdout.write(JSON.stringify({ systemMessage: text }));

async function main() {
  const [byHand] = process.argv.slice(2);
  if (byHand) {
    const m = measure(byHand, null);
    if (!m) { console.error(`${MARK} can't read ${byHand}`); process.exitCode = 1; return; }
    console.log(line(m.reply));
    return;
  }
  const input = await stdin();
  if (typeof input?.transcript_path !== "string" || input.agent_id) return;
  const id = typeof input.session_id === "string" && input.session_id ? input.session_id : basename(input.transcript_path, ".jsonl");
  const record = join(tmpdir(), "offthemode-meter", `${id.replace(/[^\w-]/g, "_")}.json`);
  let was = null;
  try { was = JSON.parse(readFileSync(record, "utf8")); } catch { /* no record yet, or one cut short: everything so far is counted */ }
  const m = measure(input.transcript_path, was, id);
  if (!m) return show(`${MARK} couldn't read this session's file, so the next line carries this reply.`);
  try {
    mkdirSync(dirname(record), { recursive: true });
    writeFileSync(record, JSON.stringify(m.state));
  } catch { /* the record can't be kept: the next line counts the session so far again, and says so */ }
  if (m.reply.chat + m.reply.agents) show(line(m.reply, working(input.background_tasks)));
}

// Run as a script, also through a linked folder (a project path that is a link would otherwise switch it off in silence).
const isMain = () => { try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; } };
if (isMain()) main().catch((e) => show(`${MARK} couldn't count this reply: ${e?.message ?? e}`));
