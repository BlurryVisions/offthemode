// The tokens a session read, from Claude Code's own session files: the main chat, every agent, each workflow,
// and each turn (a turn starts at an owner message). Counted the same way as npm run usage.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { lines, calls, profile, agentFiles } from "../agent-usage.mjs";
import { M } from "./run.mjs";

const PROJECTS = join(homedir(), ".claude", "projects");

export function sessionFile(sid) {
  if (!existsSync(PROJECTS)) return null;
  for (const p of readdirSync(PROJECTS)) {
    const f = join(PROJECTS, p, `${sid}.jsonl`);
    if (existsSync(f)) return f;
  }
  return null;
}

// What the owner typed: user messages in the main chat, not tool results, notices or interruptions.
function ownerMessages(file) {
  return lines(file).flatMap((e) => {
    if (e.type !== "user" || e.isSidechain || e.isMeta || !e.timestamp) return [];
    const c = e.message?.content;
    const text = typeof c === "string" ? c : Array.isArray(c) ? c.filter((x) => x.type === "text").map((x) => x.text).join(" ") : "";
    return text && !text.startsWith("<") && !text.startsWith("[Request interrupted") ? [{ at: e.timestamp, text }] : [];
  });
}

function workflowName(dir, file) {
  const id = file.match(/\/subagents\/workflows\/([^/]+)\//)?.[1];
  if (!id) return null;
  try { return JSON.parse(readFileSync(join(dir, "workflows", `${id}.json`), "utf8")).workflowName ?? id; } catch { return id; }
}

export function sessionUsage(file) {
  const dir = file.slice(0, -".jsonl".length);
  const main = calls(file);
  const agents = agentFiles(join(dir, "subagents")).map((f) => ({ p: profile(f), workflow: workflowName(dir, f) })).filter((a) => a.p);
  const mainTotal = main.reduce((s, x) => s + x.memory, 0);
  const agentsTotal = agents.reduce((s, a) => s + a.p.total, 0);
  const workflows = new Map();
  for (const a of agents.filter((x) => x.workflow)) {
    const w = workflows.get(a.workflow) ?? { name: a.workflow, agents: 0, total: 0 };
    workflows.set(a.workflow, { ...w, agents: w.agents + 1, total: w.total + a.p.total });
  }
  const starts = ownerMessages(file).map((m) => Date.parse(m.at));
  const turnOf = (at) => starts.filter((s) => Date.parse(at) >= s).length - 1;
  const turns = starts.map((s) => ({ start: new Date(s).toISOString(), main: 0, agents: 0, total: 0 }));
  for (const c of main) { const t = turns[turnOf(c.at)]; if (t) { t.main += c.memory; t.total += c.memory; } }
  for (const a of agents) { const t = turns[turnOf(a.p.first)]; if (t) { t.agents++; t.total += a.p.total; } }
  return {
    total: mainTotal + agentsTotal, main: mainTotal, agents: agents.length, agentsTotal,
    workflows: [...workflows.values()].sort((a, b) => b.total - a.total), turns,
  };
}

export function printUsage(file) {
  const u = sessionUsage(file);
  console.log(`${file.split("/").at(-1)}: ${M(u.total)} read · main chat ${M(u.main)} · ${u.agents} agents ${M(u.agentsTotal)}`);
  for (const w of u.workflows) console.log(`  workflow ${w.name}: ${w.agents} agents, ${M(w.total)}`);
  u.turns.forEach((t, i) => console.log(`  turn ${i + 1} (${t.start.slice(5, 16)}): ${M(t.total)}, ${t.agents} agents`));
}
