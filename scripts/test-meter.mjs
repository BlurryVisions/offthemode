// Tests the meter (scripts/meter.mjs): its counting on session files shaped the way Claude Code writes them (a line
// per content block, each repeating the call's id and counts), and the script run as a Stop hook, input on stdin.
// OTM_METER points the tests at another copy, so a deliberate break can be shown to fail. Prints only what failed.
import { appendFileSync, writeFileSync, mkdirSync, statSync, existsSync, readFileSync, readdirSync, symlinkSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, BASE, expect, node, finish } from "./stop-check-harness.mjs";
import { calls, agentFiles as usageAgentFiles } from "./agent-usage.mjs";

const METER = resolve(process.env.OTM_METER || join(ROOT, "scripts/meter.mjs")), SOURCE = readFileSync(METER, "utf8");
const { gained, measure, line, agentFiles } = await import(pathToFileURL(METER).href);

let ids = 0;
/** One model call: `read` tokens from cache plus 5 more read, so it counts as read + 5. */
const call = (read, { blocks = 2, out = 10, side = false, reason = "tool_use" } = {}) => {
  const id = ++ids;
  return Array.from({ length: blocks }, (_, i) => JSON.stringify({ type: "assistant", ...(side ? { isSidechain: true } : {}), timestamp: "2026-11-11T00:00:00.000Z", requestId: `req_${id}`,
    message: { id: `msg_${id}`, role: "assistant", stop_reason: i === blocks - 1 ? reason : null, content: [{ type: "text", text: "x" }],
      usage: { input_tokens: 2, cache_creation_input_tokens: 3, cache_read_input_tokens: read, output_tokens: out } } }));
};
const NOISE = [
  JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: 'the word "usage" in a tool result' }] } }),
  JSON.stringify({ type: "api-request-blob", message: { role: "assistant", content: "an untimed copy with no counts" } }),
  JSON.stringify({ type: "user", message: { role: "user", usage: { input_tokens: 999 } } }),
  JSON.stringify({ type: "system", subtype: "stop_hook_summary", hookCount: 1 }),
  '{"type":"assistant","message":{"usage":',
  "",
];
const put = (file, lines) => { mkdirSync(dirname(file), { recursive: true }); appendFileSync(file, lines.map((l) => `${l}\n`).join("")); };
const session = (name) => { const file = join(BASE, "meter", name, "chat.jsonl"); return { file, agents: join(BASE, "meter", name, "chat", "subagents") }; };
const sum = (file) => calls(file).reduce((s, c) => s + c.memory, 0);
const show = (x) => JSON.stringify(x).slice(0, 500);

async function countsOnce() {
  const s = session("once");
  put(s.file, [...call(100, { blocks: 3 }), ...NOISE, ...call(200)]);
  const got = gained(s.file);
  expect(got.calls === 2 && got.tokens === 310, "a call written on three lines is counted once, and lines that aren't model calls aren't counted", show(got));
  expect(got.offset === statSync(s.file).size, "a whole file is read to its end", show(got));
  expect(gained(join(BASE, "meter", "no-such.jsonl")) === null && measure(join(BASE, "meter", "no-such.jsonl"), null) === null, "a file that can't be read gives no count");
}

async function sameAsUsage() {
  const s = session("usage"), a = join(s.agents, "agent-a1.jsonl"), b = join(s.agents, "workflows", "wf_1", "agent-b2.jsonl");
  put(s.file, [...call(1000), ...NOISE, ...call(2000, { blocks: 4 }), ...call(3000, { reason: "end_turn" })]);
  put(a, [...call(40, { side: true }), ...call(50, { side: true })]);
  put(b, call(60, { side: true, blocks: 3 }));
  put(join(s.agents, "workflows", "wf_1", "journal.jsonl"), call(7000));
  put(join(s.agents, "agent-a1.meta.json"), call(8000));
  const m = measure(s.file, null), listed = usageAgentFiles(s.agents).sort();
  expect(m.reply.chat === sum(s.file) && m.reply.chat === 6015 && m.reply.steps === 3, "the chat's tokens are npm run usage's count for its file", show(m.reply));
  expect(m.reply.agents === listed.reduce((t, f) => t + sum(f), 0) && m.reply.agents === 165 && m.reply.agentN === 2, "the agents' tokens are npm run usage's count for their files, a workflow's included, and only agents' files count", show(m.reply));
  expect(show(agentFiles(s.agents)) === show(listed), "the meter and npm run usage find the same agent files", show(agentFiles(s.agents)));
  expect(m.reply.fresh && m.reply.size === 3015, "with no record everything so far is counted, and the chat's size is its last call's reading plus what it wrote", show(m.reply));
}

async function resumes() {
  const s = session("resume"), a = join(s.agents, "agent-a1.jsonl"), idle = join(s.agents, "agent-idle.jsonl");
  put(s.file, [...call(100), ...call(200, { reason: "end_turn" })]);
  put(a, call(40, { side: true }));
  put(idle, call(70, { side: true }));
  const first = measure(s.file, null);
  put(s.file, [...NOISE, ...call(500, { out: 25, reason: "end_turn" })]);
  put(a, call(50, { side: true }));
  const second = measure(s.file, first.state);
  expect(!second.reply.fresh && second.reply.chat === 505 && second.reply.steps === 1, "a second read counts only the chat's new calls", show(second.reply));
  expect(second.reply.agents === 55 && second.reply.agentN === 1, "only an agent that worked since the last line is counted", show(second.reply));
  expect(first.reply.chat + second.reply.chat === sum(s.file) && first.reply.agents + second.reply.agents === sum(a) + sum(idle), "the lines add up to the session: every token is shown once", show([first.reply, second.reply]));
  expect(second.reply.size === 530, "the chat's size follows its newest call", show(second.reply));
  const third = measure(s.file, second.state);
  expect(third.reply.chat + third.reply.agents === 0 && third.reply.steps === 0 && third.reply.agentN === 0 && third.reply.size === 530, "with nothing new nothing is counted, and the chat's size is kept", show(third.reply));
}

async function splitCalls() {
  const s = session("split"), [one, two] = call(100);
  put(s.file, [one]);
  const a = measure(s.file, null);
  put(s.file, [two, ...call(200)]);
  const b = measure(s.file, a.state);
  expect(a.reply.chat === 105 && b.reply.chat === 205 && b.reply.steps === 1, "a call whose lines fall in two reads is counted once", show([a.reply, b.reply]));
  const [whole] = call(300, { blocks: 1 }), [done] = call(40, { blocks: 1 });
  appendFileSync(s.file, `${done}\n${whole.slice(0, 60)}`);
  const before = statSync(s.file).size - 60, c = measure(s.file, b.state);
  expect(c.reply.chat === 45 && c.state.files[s.file].offset === before, "a line still being written is left for the next read, the whole lines before it counted", show(c));
  appendFileSync(s.file, `${whole.slice(60)}\n`);
  const d = measure(s.file, c.state);
  expect(d.reply.chat === 305 && d.reply.steps === 1, "and counted once it is whole", show(d.reply));
}

async function longLines() {
  const s = session("long"), [edge] = call(400, { blocks: 1 });
  // A tool result longer than one read, then a call whose line starts just before the read's end and ends in the next.
  put(s.file, [JSON.stringify({ type: "user", message: { role: "user", content: "x".repeat(1_500_000) } })]);
  const filler = (1 << 20) - (statSync(s.file).size % (1 << 20)) - 30;
  put(s.file, [JSON.stringify({ type: "user", pad: "y".repeat(Math.max(0, filler - 30)) }), edge, ...call(500, { blocks: 1 })]);
  const got = gained(s.file);
  expect(got.calls === 2 && got.tokens === 910 && got.offset === statSync(s.file).size, "lines longer than one read, and a call's line cut by the read's end, are still counted", show(got));
  const half = gained(s.file, undefined, statSync(s.file).size - 5), rest = gained(s.file, half);
  expect(half.calls === 1 && half.tokens === 405 && rest.calls === 1 && rest.tokens === 505, "a file read up to a point and then from there gives the same count, each call once", show([half, rest]));
}

async function chatSize() {
  const s = session("size");
  put(s.file, [...call(1000, { out: 40, reason: "end_turn" }), ...call(70, { side: true })]);
  const m = measure(s.file, null);
  expect(m.reply.chat === 1080 && m.reply.size === 1045, "an agent's call inside the chat's file is counted, but the chat's size is its own last call's", show(m.reply));
}

async function startsOver() {
  const s = session("over"), a = join(s.agents, "agent-a1.jsonl");
  put(s.file, [...call(100), ...call(200)]);
  put(a, [...call(40, { side: true }), ...call(50, { side: true })]);
  const first = measure(s.file, null);
  writeFileSync(s.file, `${call(10).join("\n")}\n`);
  const shorter = measure(s.file, first.state);
  expect(shorter.reply.fresh && shorter.reply.chat === 15 && shorter.reply.agents === 100, "a chat file shorter than the record says is counted from its start, and the line says so", show(shorter.reply));
  writeFileSync(a, `${call(20, { side: true }).join("\n")}\n`);
  const agent = measure(s.file, shorter.state);
  expect(agent.reply.fresh && agent.reply.agents === 25, "so is a session whose agent file got shorter", show(agent.reply));
  expect(measure(s.file, { ...agent.state, v: 2 }).reply.fresh, "a record of another kind is not trusted");
  expect(measure(s.file, { v: 1, files: { [join(BASE, "other.jsonl")]: { offset: 5, key: null } } }).reply.fresh, "nor a record that doesn't know this chat");
  const odd = [{ v: 1, files: { [s.file]: { offset: "x", key: null } } }, { v: 1, files: { [s.file]: { offset: -5, key: null } } }, { v: 1, files: { [s.file]: { offset: 0, key: null }, [a]: null } }, { v: 1, files: null }, { v: 1, files: "text" }];
  expect(odd.every((was) => { const m = measure(s.file, was); return m.reply.fresh && m.reply.chat === 15 && m.reply.agents === 25; }), "nor one whose places aren't whole numbers from zero up: it never stops the count", show(odd.map((was) => { try { return measure(s.file, was).reply; } catch (e) { return String(e); } })));
}

async function countsBehind() {
  const s = session("behind");
  put(s.file, call(100, { reason: "tool_use" }));
  const a = measure(s.file, null);
  put(s.file, call(200, { reason: "end_turn" }));
  const b = measure(s.file, a.state), c = measure(s.file, b.state);
  expect(a.state.behind === 1 && b.state.behind === 1 && c.state.behind === 2 && c.state.runs === 3, "a stop whose file doesn't yet hold the reply's last call is counted as behind", show([a.state, b.state, c.state]));
}

async function wording() {
  const reply = { fresh: false, chat: 2_100_000, steps: 5, agents: 10_300_000, agentN: 4, size: 412_000 };
  expect(line(reply) === "Off the Mode's meter · this reply: 12.4M tokens (the chat 2.1M in 5 steps, 4 agents 10.3M) · the chat is 412k now, re-read at every further step", "the line for a reply with agents", line(reply));
  const small = line({ fresh: true, chat: 950, steps: 1, agents: 0, agentN: 0, size: 990 });
  expect(small === "Off the Mode's meter · this session so far: 950 tokens (the chat 950 in 1 step) · the chat is 990 now, re-read at every further step", "the line with no record and no agents", small);
  const waiting = line({ fresh: false, chat: 0, steps: 0, agents: 423e6, agentN: 1, size: 356_000 }, true);
  expect(waiting === "Off the Mode's meter · this reply: 423M tokens (1 agent 423M) · the chat is 356k now, re-read at every further step · agents are still working, so the next line carries the rest", "the line while agents are still at work", waiting);
  const sizes = [[99_400_000, "99.4M"], [99_600_000, "100M"], [1_040_000, "1.0M"], [999_400, "999k"], [1500, "2k"], [999, "999"]].map(([x, want]) => [line({ fresh: false, chat: x, steps: 2, agents: 0, agentN: 0, size: 0 }), `this reply: ${want} tokens (the chat ${want} in 2 steps)`]);
  expect(sizes.every(([got, want]) => got.endsWith(want)), "numbers are short, and a chat of unknown size isn't given one", show(sizes));
}

const run = async (input, tmp, args = []) => {
  const r = await node([METER, ...args], BASE, typeof input === "string" ? input : JSON.stringify({ hook_event_name: "Stop", stop_hook_active: false, ...input }), { TMPDIR: tmp, TEMP: tmp, TMP: tmp });
  let out = null;
  try { out = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { out = { raw: r.stdout }; }
  return { ...r, out, said: out?.systemMessage ?? "", only: out ? Object.keys(out).join() : "" };
};
const temp = (name) => { const dir = join(BASE, "meter-tmp", name); mkdirSync(dir, { recursive: true }); return dir; };

async function asHook() {
  const s = session("hook"), tmp = temp("hook"), input = { transcript_path: s.file, session_id: "s1" };
  put(s.file, [...call(1_000_000), ...call(2_000_000, { reason: "end_turn", out: 5 })]);
  put(join(s.agents, "agent-a1.jsonl"), call(7_000_000, { side: true }));
  const first = await run(input, tmp);
  expect(first.code === 0 && first.only === "systemMessage" && first.said === "Off the Mode's meter · this session so far: 10.0M tokens (the chat 3.0M in 2 steps, 1 agent 7.0M) · the chat is 2.0M now, re-read at every further step", "as a hook with no record: one line for the owner and nothing else", show(first));
  put(s.file, call(2_500_000, { reason: "end_turn", out: 5 }));
  const second = await run(input, tmp);
  expect(second.code === 0 && second.only === "systemMessage" && second.said === "Off the Mode's meter · this reply: 2.5M tokens (the chat 2.5M in 1 step) · the chat is 2.5M now, re-read at every further step", "at the next stop: only what the reply added", show(second));
  const third = await run(input, tmp);
  expect(third.code === 0 && third.out === null, "a stop with nothing new shows nothing", show(third));
  const record = join(tmp, "offthemode-meter", "s1.json"), kept = existsSync(record) ? JSON.parse(readFileSync(record, "utf8")) : null;
  expect(kept && Object.keys(kept).join() === "v,files,size,runs,behind" && Object.values(kept.files).every((f) => Object.keys(f).join() === "offset,key"), "the meter's own file holds how far it read and nothing from the chat", show(kept));
  expect(readdirSync(join(tmp, "offthemode-meter")).join() === "s1.json", "and leaves no other file behind", readdirSync(join(tmp, "offthemode-meter")).join());
}

async function staysQuiet() {
  const s = session("quiet"), tmp = temp("quiet");
  put(s.file, call(100, { reason: "end_turn" }));
  const agent = await run({ transcript_path: s.file, session_id: "s2", agent_id: "a1" }, tmp);
  expect(agent.code === 0 && agent.out === null && !existsSync(join(tmp, "offthemode-meter")), "an agent's own stop shows nothing and records nothing", show(agent));
  const results = await Promise.all(["not json", "{}", "", "null", "[]", '{"transcript_path":123}', '{"transcript_path":{"a":1},"session_id":"s9"}'].map((text) => run(text, tmp)));
  expect(results.every((r) => r.code === 0 && r.out === null), "input that isn't a stop's shows nothing and fails nothing", show(results.map((r) => [r.code, r.stdout, r.stderr])));
  const missing = await run({ transcript_path: join(BASE, "meter", "gone.jsonl"), session_id: "s3" }, tmp);
  expect(missing.code === 0 && missing.only === "systemMessage" && missing.said === "Off the Mode's meter couldn't read this session's file, so the next line carries this reply.", "a session file that can't be read is said, in one line", show(missing));
  const folder = await run({ transcript_path: join(BASE, "meter", "quiet"), session_id: "s4" }, tmp);
  expect(folder.code === 0 && folder.only === "systemMessage" && folder.said === missing.said, "so is a folder where the file should be, on every system", show(folder));
}

async function stillWorking() {
  const s = session("working"), tmp = temp("working");
  const stop = async (id, background_tasks) => { put(s.file, call(100, { reason: "end_turn" })); return run({ transcript_path: s.file, session_id: id, background_tasks }, tmp); };
  const busy = await stop("w1", [{ id: "t1", type: "shell", status: "running" }, { id: "t2", type: "workflow", status: "running", name: "review" }]);
  const ended = await stop("w2", [{ id: "t2", type: "workflow", status: "completed" }, { id: "t3", type: "subagent", status: "failed" }]);
  const shell = await stop("w3", [{ id: "t1", type: "shell", status: "running" }]);
  const odd = await stop("w4", { not: "a list" });
  expect(busy.said.endsWith(" · agents are still working, so the next line carries the rest"), "a workflow still running is said", show(busy));
  expect([ended, shell, odd].every((r) => r.said.endsWith("re-read at every further step")), "ended agents, a shell command left running and a list that isn't one are not", show([ended.said, shell.said, odd.said]));
}

async function recordGuards() {
  const s = session("guards"), tmp = temp("guards"), blocked = join(temp("blocked"), "a-file");
  put(s.file, call(100, { reason: "end_turn" }));
  const named = await run({ transcript_path: s.file, session_id: "../../up/and away" }, tmp);
  expect(named.said && readdirSync(join(tmp, "offthemode-meter")).join() === "______up_and_away.json" && readdirSync(tmp).join() === "offthemode-meter", "a session id can't place the record outside the meter's folder", show(readdirSync(tmp)));
  writeFileSync(blocked, "");
  const a = await run({ transcript_path: s.file, session_id: "s5" }, blocked), b = await run({ transcript_path: s.file, session_id: "s5" }, blocked);
  expect([a, b].every((r) => r.code === 0 && r.said.includes("this session so far: 105 tokens")), "where the record can't be kept the line still shows, counting the session so far each time", show([a, b]));
  writeFileSync(join(tmp, "offthemode-meter", "s6.json"), "{ not json");
  const broken = await run({ transcript_path: s.file, session_id: "s6" }, tmp);
  expect(broken.code === 0 && broken.said.includes("this session so far: 105 tokens"), "a record that doesn't parse is started again", show(broken));
}

async function byHand() {
  const s = session("hand"), tmp = temp("hand");
  put(s.file, call(100, { reason: "end_turn" }));
  const ok = await run("", tmp, [s.file]), gone = await run("", tmp, [join(BASE, "meter", "gone.jsonl")]);
  expect(ok.code === 0 && ok.stdout.trim() === "Off the Mode's meter · this session so far: 105 tokens (the chat 105 in 1 step) · the chat is 115 now, re-read at every further step" && !existsSync(join(tmp, "offthemode-meter")), "run by hand on a session file it prints the line and keeps no record", show(ok));
  expect(gone.code === 1 && gone.stderr.includes("can't read") && !gone.stdout, "and says when it can't read the file", show(gone));
  const link = join(BASE, "meter-linked.mjs");
  try { symlinkSync(METER, link); } catch { return; } // Windows without the right to make links: nothing to test
  const linked = await node([link, s.file], BASE, "", { TMPDIR: tmp, TEMP: tmp, TMP: tmp });
  expect(linked.code === 0 && linked.stdout.includes("this session so far: 105 tokens"), "run through a link it still works", show(linked));
}

function promises() {
  const broken = SOURCE.match(/child_process|node:https?|node:net|node:dgram|\bfetch\(|\bimport\(|decision|additionalContext|hookSpecificOutput|exitCode = 2|exit\(2\)/g);
  expect(!broken, "the meter runs no command, makes no network call and has no way to send the AI back", String(broken));
}

promises();
await finish("test-meter", [countsOnce, sameAsUsage, resumes, splitCalls, longLines, chatSize, startsOver, countsBehind, wording, asHook, staysQuiet, stillWorking, recordGuards, byHand]);
