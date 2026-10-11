// Where a Claude Code session's tokens went: for the main chat and each agent, how many steps it took,
// how large its memory grew, how much it re-read in all, and what that re-reading carried.
// Usage: node scripts/agent-usage.mjs <session .jsonl> [top N agents, default 10]
// The proof for "Hand off, don't carry" (CHECKLIST, STATE.md Next 10): no builder past one piece.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const FILE_PRINT = /(^|[;&|]\s*)(cat|sed|head|tail|nl)\b/;

function lines(file) {
  return readFileSync(file, "utf8").split("\n").filter(Boolean).flatMap((l) => {
    try { return [JSON.parse(l)]; } catch { return []; }
  });
}

// One entry per model call, with the memory size it re-read and the tool output that arrived before it.
function calls(file) {
  const seen = new Set(), out = [], tools = new Map();
  let arrived = { files: 0, other: 0 };
  for (const e of lines(file)) {
    const content = Array.isArray(e.message?.content) ? e.message.content : [];
    for (const b of content) {
      if (b.type === "tool_use") tools.set(b.id, b);
      if (b.type !== "tool_result") continue;
      const use = tools.get(b.tool_use_id), size = JSON.stringify(b.content ?? "").length;
      const isFile = use?.name === "Read" || (use?.name === "Bash" && FILE_PRINT.test(use.input?.command ?? ""));
      arrived[isFile ? "files" : "other"] += size;
    }
    const u = e.message?.usage;
    if (e.type !== "assistant" || !u) continue;
    const key = `${e.message.id}:${e.requestId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const memory = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
    out.push({ memory, arrived });
    arrived = { files: 0, other: 0 };
  }
  return out;
}

// Each step's growth is carried by every later step: split it into files printed, other tool output
// and the agent's own work (what it wrote and thought), estimating tool output at 3.2 characters a token.
function profile(file) {
  const c = calls(file), n = c.length;
  if (!n) return null;
  const carried = { start: c[0].memory * n, files: 0, other: 0, own: 0 };
  for (let i = 1; i < n; i++) {
    const growth = Math.max(0, c[i].memory - c[i - 1].memory), later = n - i;
    const files = c[i].arrived.files / 3.2, other = c[i].arrived.other / 3.2;
    const tools = Math.min(growth, files + other), share = files + other ? tools / (files + other) : 0;
    carried.files += files * share * later;
    carried.other += other * share * later;
    carried.own += (growth - tools) * later;
  }
  const total = c.reduce((s, x) => s + x.memory, 0);
  return { steps: n, start: c[0].memory, peak: Math.max(...c.map((x) => x.memory)), total, carried };
}

function agentFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return agentFiles(p);
    return name.startsWith("agent-") && name.endsWith(".jsonl") ? [p] : [];
  });
}

const M = (x) => `${(x / 1e6).toFixed(1)}M`;
const K = (x) => `${Math.round(x / 1000)}k`;
const pct = (x, t) => `${Math.round((x / t) * 100)}%`;

function row(label, p) {
  const t = Object.values(p.carried).reduce((a, b) => a + b, 0) || 1;
  return `${M(p.total).padStart(8)}  ${String(p.steps).padStart(5)}  ${K(p.start).padStart(5)} → ${K(p.peak).padStart(5)}` +
    `  own ${pct(p.carried.own, t).padStart(4)}  files ${pct(p.carried.files, t).padStart(4)}  ${label}`;
}

const [session, topArg] = process.argv.slice(2);
if (!session?.endsWith(".jsonl") || !existsSync(session)) {
  console.error("Usage: node scripts/agent-usage.mjs <session .jsonl> [top N]");
  process.exit(1);
}
const agents = agentFiles(join(session.slice(0, -".jsonl".length), "subagents"))
  .map((f) => ({ label: f.split("/subagents/")[1], p: profile(f) }))
  .filter((a) => a.p)
  .sort((a, b) => b.p.total - a.p.total);
const main = profile(session);
const all = agents.reduce((s, a) => s + a.p.total, 0) + (main?.total ?? 0);
console.log(`${basename(session)}: ${M(all)} re-read, ${agents.length} agents (${pct(all - (main?.total ?? 0), all || 1)} of it)`);
console.log("re-read   steps  memory start → peak  carried: own work, files printed or read");
if (main) console.log(row("main chat", main));
for (const a of agents.slice(0, Number(topArg) || 10)) console.log(row(a.label, a.p));
