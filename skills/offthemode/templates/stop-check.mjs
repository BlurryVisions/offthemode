// Off the Mode · the stop check. Setup copies it to .offthemode/stop-check.mjs and replaces it whole on update.
// When your AI says the work is done, it runs the checks .offthemode/RULES.md §Commands names (check, rule checks,
// screen checks), shows you what they found, and sends the AI back once when they don't show the work done.
// It runs nothing on any other reply, or when no file changed since it last ran. It makes no network call, and it
// writes only its own state file (inside .git/, or in the temp folder outside git).
// Run it yourself, or from any AI tool: node .offthemode/stop-check.mjs --now (exit 1 when the checks don't show it done)
// Claude Code runs it at each stop once .claude/settings.local.json holds this block, added only on the owner's yes:
// SETTINGS {"hooks":{"Stop":[{"hooks":[{"type":"command","command":"node","args":["${CLAUDE_PROJECT_DIR}/.offthemode/stop-check.mjs"],"timeout":900,"statusMessage":"Off the Mode is checking the work"}]}]}}
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, realpathSync, createReadStream } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

// The checks' time in seconds, under the hook's 900, so a hung check is reported, never dropped in silence.
// RULES.md §Budgets can set it with the key stop_check_seconds.
const SECONDS = 480;
const KINDS = { check: "check", "rule check": "rule", "rule checks": "rule", "screen check": "screen", "screen checks": "screen" };
// Only plain commands run by themselves: words joined by &&, nothing a shell would expand, redirect or chain.
const PLAIN = /^[\w@%+=:,./-]+(?: +[\w@%+=:,./-]+)*$/;
const NEVER = /^(?:rm|rmdir|del|sudo|curl|wget|ssh|scp|vercel|netlify)\b|^git (?:push|pull|fetch|clone|reset|clean|checkout|switch|restore|commit|merge|rebase|stash|rm|mv|tag|branch)\b|^(?:npm|pnpm|yarn) (?:publish|unpublish|deprecate)\b/;
const N = String.raw`(\d[\d,]*)`;
const RULE_LINE = new RegExp(String.raw`^RULE\s+"(.*)"\s*:\s*broke\s+${N}\s*[·|]\s*judged\s+${N}\s+of\s+${N}\s+(\S.*?)\s*$`);
const SCREEN_LINE = new RegExp(String.raw`^SCREEN\s+"(.*)"\s*:\s*wrong\s+${N}\s*[·|]\s*checked\s+${N}\s+of\s+${N}\s+(\S.*?)\s*$`);
const RULE_FORM = `RULE "<your words>": broke B · judged J of N <what it counts>`;
const SCREEN_FORM = `SCREEN "<page>": wrong W · checked C of R rows`;
const MARK = "Off the Mode's stop check";

// ---------- reading the reply ----------
// Measured on 610 real final replies from five projects before shipping; a miss lets the stop through unchecked.
const STRONG = "pushed|merged|deployed|shipped";
const SOFT = "done|fixed|finished|complete|verified|live|ready|in place|resolved|all set|committed|built|tested";
const DOUBT = new RegExp(String.raw`(?:\b(?:not|never|nothing|yet|once|when|whenever|if|unless|until|before|after|whether|will|would|should|could|can|to|be|being|needs?|gets?)|n't)\b(?:[ \t]+[\w'’]+){0,4}?[ \t]+(?:${STRONG}|${SOFT})\b|\bdone[- ]when\b`, "gi");
const CLAIMS = [
  new RegExp(String.raw`\b(?:${STRONG})\b(?!-)`, "i"),
  new RegExp(String.raw`\b(?:is|are|was|were|now|all|both)[ \t]+(?:now[ \t]+|all[ \t]+|also[ \t]+)?(?:${SOFT})\b(?!-)|['’](?:s|re)[ \t]+(?:now[ \t]+)?(?:${SOFT})\b(?!-)`, "i"),
  /\b(?:I|I've|I’ve|I have|we|we've)[ \t]+(?:now[ \t]+|just[ \t]+|also[ \t]+)?(?:fixed|finished|completed|verified|implemented|built)\b/i,
  /(?:^|[.!][ \t]+)[*_]*(?:done|fixed|finished|verified|all set|all done)[*_]*[ \t]*(?:[.!(—–]|$)/im,
  /\b(?:tests?|checks?|evals?|suite)[ \t]+(?:all[ \t]+|now[ \t]+|still[ \t]+)?pass(?:es|ed)?\b/i,
];
const CHECKPOINT = /\b(?:(?:for|await|awaiting) your review|so you can review|(?:stopping|stop|stopped|pausing|pause|paused) (?:here|there)|stop(?:ped|ping)? (?:after|at) (?:step|phase|piece|part|stage|round|item)\b|waiting (?:for|on) (?:you|your)|before I (?:go on|continue|start|build)|your (?:call|pick|go|yes)|say (?:yes|go|the word))\b/i;

/** "claim" when the reply says the work is done, "checkpoint" when it also stops for the owner, else "none". */
export function readReply(text) {
  const plain = String(text ?? "").replace(/```[\s\S]*?```|`[^`\n]*`|"[^"\n]*"|“[^”\n]*”/g, " ").replace(DOUBT, " ");
  if (!CLAIMS.some((re) => re.test(plain))) return "none";
  const last = plain.trim().split("\n").filter((l) => l.trim()).pop() ?? "";
  return CHECKPOINT.test(plain) || /\?[\s*_)]*$/.test(last) ? "checkpoint" : "claim";
}

// ---------- reading the notes ----------
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return null; } };
export const norm = (s) => String(s).normalize("NFKC").toLowerCase().replace(/[‘’ʼ`´]/g, "'").replace(/[“”«»„]/g, '"').replace(/\s+/g, " ").trim().replace(/[.!;,]+$/, "");
const fmt = (n) => n.toLocaleString("en-US");
const num = (s) => Number(s.replace(/,/g, ""));

function section(md, name) {
  const lines = md.split(/\r?\n/);
  const at = lines.findIndex((l) => l.startsWith(`## ${name}`));
  if (at < 0) return [];
  const end = lines.findIndex((l, i) => i > at && l.startsWith("## "));
  return lines.slice(at + 1, end < 0 ? undefined : end);
}

// Splits "label `cmd` · label `cmd` (note `x`)" at each top-level ·; commands inside a (note) don't count.
function segments(line) {
  const out = [];
  let label = "", cmds = [], tick = null, depth = 0;
  for (const ch of line) {
    if (tick !== null) {
      if (ch === "`") { if (depth === 0) cmds.push(tick.trim()); tick = null; } else tick += ch;
    } else if (ch === "`") tick = "";
    else if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (ch === "·" && depth === 0) { out.push({ label, cmds }); label = ""; cmds = []; }
    else if (depth === 0 && !cmds.length) label += ch;
  }
  out.push({ label, cmds });
  return out.map((s) => ({ label: s.label.trim().toLowerCase(), cmds: s.cmds }));
}

/** The checks RULES.md §Commands names, in order: [{ kind, cmd, plain }]. */
export function parseCommands(rulesMd) {
  const found = [];
  for (const line of section(rulesMd, "Commands")) {
    for (const { label, cmds } of segments(line)) {
      const kind = KINDS[label];
      if (!kind) continue;
      for (const cmd of cmds) {
        if (!cmd || /^none$|^not set|\{\{/i.test(cmd)) continue;
        found.push({ kind, cmd, plain: cmd.split("&&").every((p) => PLAIN.test(p.trim()) && !NEVER.test(p.trim())) });
      }
    }
  }
  return found;
}

function budget(rulesMd) {
  const json = section(rulesMd, "Budgets").join("\n").match(/```json\s*([\s\S]*?)```/)?.[1];
  try { const s = JSON.parse(json).stop_check_seconds; return s > 0 ? s : SECONDS; } catch { return SECONDS; }
}

/** The owner's rules PRODUCT.md quotes: a line holding "owner's rule" and "<their words>", with "counted in <unit>". */
export function productRules(md) {
  const rules = [];
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.replace(/[“”]/g, '"');
    if (!/owner['’]s rule/i.test(line)) continue;
    const quote = line.match(/"(.*)"\s*(?:·|$)/)?.[1];
    if (quote && !quote.includes("{{")) rules.push({ key: norm(quote), quote, unit: line.match(/counted in ([^·]+?)\s*(?:·|$)/i)?.[1] ?? null });
  }
  return rules;
}
const quotesIn = (md) => new Set([...md.replace(/[“”]/g, '"').matchAll(/"([^"\n]+)"/g)].map((m) => norm(m[1])));

/** The RULE and SCREEN lines a check printed, and any line that starts like one but isn't in the form. */
export function parseLines(out) {
  const rules = [], screens = [], malformed = [];
  for (const raw of out.split(/\r?\n/)) {
    const line = raw.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").trim();
    if (/^RULE\b/.test(line)) {
      const m = line.match(RULE_LINE);
      if (m) rules.push({ line, quote: m[1], broke: num(m[2]), judged: num(m[3]), of: num(m[4]), unit: m[5] }); else malformed.push(line);
    } else if (/^SCREEN\b/.test(line)) {
      const m = line.match(SCREEN_LINE);
      if (m) screens.push({ line, page: m[1], wrong: num(m[2]), checked: num(m[3]), of: num(m[4]), unit: m[5] }); else malformed.push(line);
    }
  }
  return { rules, screens, malformed };
}

// ---------- running ----------
function git(args, cwd) {
  try { return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 256 * 1024 * 1024 }); } catch { return null; }
}

/** A hash of everything git sees in the work tree, or null outside git (then every claim runs the checks). */
function fingerprint(root) {
  if (git(["rev-parse", "--git-dir"], root) === null) return null;
  const status = git(["status", "--porcelain=v1", "-z", "--untracked-files=all"], root) ?? "";
  const h = createHash("sha256").update(git(["rev-parse", "HEAD"], root) ?? "no commit").update(status);
  h.update(git(["diff", "--binary", "--no-ext-diff"], root) ?? "").update(git(["diff", "--cached", "--binary", "--no-ext-diff"], root) ?? "");
  for (const entry of status.split("\0")) {
    if (!entry.startsWith("?? ")) continue;
    try { const s = statSync(join(root, entry.slice(3))); h.update(`${entry}:${s.size}:${s.mtimeMs}`); } catch { /* gone since */ }
  }
  for (const f of ["RULES.md", "PRODUCT.md"]) h.update(read(join(root, ".offthemode", f)) ?? "");
  return h.digest("hex");
}

function run(cmd, cwd, ms) {
  return new Promise((done) => {
    const started = Date.now(), win = process.platform === "win32";
    const child = spawn(cmd, { cwd, shell: true, detached: !win, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" } });
    let out = "", timedOut = false, ended = false;
    const take = (d) => { out += d; if (out.length > 400_000) out = out.slice(-200_000); };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    // The whole process group goes, so a dev server or browser the check started doesn't outlive it.
    const kill = (signal) => {
      try { if (win) spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]); else process.kill(-child.pid, signal); } catch { /* already gone */ }
    };
    const end = (code) => {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      child.stdout.destroy();
      child.stderr.destroy();
      done({ code: timedOut ? null : code, out, timedOut, ms: Date.now() - started });
    };
    const timer = setTimeout(() => { timedOut = true; kill("SIGKILL"); }, ms);
    child.on("error", (e) => { out += String(e.message); end(127); });
    child.on("close", (code) => end(code ?? 1));
    child.on("exit", (code) => { kill("SIGTERM"); setTimeout(() => end(code ?? 1), 2000).unref(); });
  });
}

async function runAll(commands, root, seconds) {
  const deadline = Date.now() + seconds * 1000, results = [];
  for (const c of commands) {
    const left = deadline - Date.now();
    if (!c.plain || left <= 0) { results.push({ c, skipped: c.plain ? "time" : "shape" }); continue; }
    const r = await run(c.cmd, root, left);
    results.push({ c, ...r, left, ...parseLines(r.out) });
  }
  return results;
}

// ---------- the owner's own words ----------
// A quote counts as the owner's when one of their own chat messages holds it (not the AI's, not a tool's output).
// Claude Code also files a workflow's or subagent's report, a reminder and a command's output as user lines, and those
// carry the AI's words, so they never count.
const NOT_SAID = /<(task-notification|system-reminder|bash-stdout|bash-stderr|local-command-stdout|local-command-stderr)>[\s\S]*?<\/\1>/g;
async function inOwnerMessages(keys, files) {
  const found = new Set();
  const probes = keys.map((k) => ({ k, probe: k.split(/[^a-z0-9]+/).sort((a, b) => b.length - a.length)[0] || k }));
  for (const f of files) {
    if (found.size === keys.length) break;
    const lines = createInterface({ input: createReadStream(f), crlfDelay: Infinity });
    for await (const line of lines) {
      if (!line.includes('"type":"user"')) continue;
      const low = line.toLowerCase();
      const open = probes.filter((p) => !found.has(p.k) && low.includes(p.probe));
      if (!open.length) continue;
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      if (e.type !== "user" || e.isSidechain || e.isMeta || (e.origin?.kind && e.origin.kind !== "human")) continue;
      const c = e.message?.content;
      const text = (typeof c === "string" ? c : Array.isArray(c) ? c.filter((b) => b?.type === "text").map((b) => b.text).join("\n") : "").replace(NOT_SAID, " ");
      if (text.includes(MARK)) continue;
      const said = norm(text);
      for (const p of open) if (said.includes(p.k)) found.add(p.k);
    }
  }
  return found;
}

/** Marks each quote true or false in state.rules; untouched (unknown) when there is no transcript to read. */
async function checkOwnerWords(keys, state, transcript) {
  if (!transcript || !existsSync(transcript)) return;
  const fresh = keys.filter((k) => state.rules[k].owner === undefined);
  const again = keys.filter((k) => state.rules[k].owner === false);
  if (!fresh.length && !again.length) return;
  const dir = dirname(transcript);
  const all = fresh.length ? readdirSync(dir).filter((f) => f.endsWith(".jsonl")).map((f) => join(dir, f)) : [];
  const files = [transcript, ...all.filter((f) => f !== transcript)];
  const found = await inOwnerMessages([...fresh, ...again], fresh.length ? files : [transcript]);
  for (const k of [...fresh, ...again]) state.rules[k].owner = found.has(k);
}

// ---------- judging ----------
function judgeRule(x, ctx) {
  const { issues, notes, pins, quoted, state, today } = ctx;
  const key = norm(x.quote), q = `"${x.quote}"`, pin = pins.find((p) => p.key === key);
  const s = (state.rules[key] ??= { quote: x.quote, first: today, unit: x.unit, n: x.of, broke: 0 });
  ctx.printed.add(key);
  if (!pin && !quoted.has(key)) issues.push(`RULE ${q} isn't word for word in .offthemode/PRODUCT.md, where your rules are kept as you said them.`);
  else s.inProduct = true;
  if (pin && !pin.unit) issues.push(`PRODUCT.md doesn't say what ${q} counts: the line with your words needs "counted in <what the code puts out, such as moves>".`);
  if (pin?.unit && norm(pin.unit) !== norm(x.unit)) issues.push(`${q} is counted in ${x.unit} here, but PRODUCT.md counts it in ${pin.unit}.`);
  if (!pin?.unit && s.unit && norm(s.unit) !== norm(x.unit)) issues.push(`${q} was counted in ${s.unit} until now; now it is counted in ${x.unit}.`);
  if (x.broke > 0) issues.push(`${fmt(x.broke)} ${x.unit} break your rule ${q}.`);
  if (x.judged < x.of) issues.push(`${fmt(x.of - x.judged)} of ${fmt(x.of)} ${x.unit} weren't judged against ${q}.`);
  if (x.judged > x.of) issues.push(`RULE ${q} judged ${fmt(x.judged)} of ${fmt(x.of)}, more than it covers.`);
  if (x.of < s.n) notes.push(`${q} now covers ${fmt(x.of)} ${x.unit}, down from ${fmt(s.n)}.`);
  Object.assign(s, { unit: x.unit, n: x.of, broke: Math.max(s.broke, x.broke) });
  if (s.broke === 0) notes.push(`${q} has never been seen to fail. Its rule check is trusted once it finds the breaks you reported, run on the code from before the change.`);
}

function judgeResult(r, ctx) {
  const { c } = r, { issues } = ctx, name = `\`${c.cmd}\``;
  if (r.skipped === "shape") return issues.push(`${name} didn't run: only a plain command, or plain commands joined by &&, runs by itself.`);
  if (r.skipped) return issues.push(`${name} didn't run: the checks used all their time (stop_check_seconds in RULES.md §Budgets).`);
  if (r.timedOut) return issues.push(`${name} didn't finish in ${Math.round(r.left / 1000)} s, so it judged nothing.`);
  if (r.code !== 0) issues.push(`${name} failed (exit ${r.code}).`);
  for (const bad of r.malformed) issues.push(`${name} printed "${bad}", which isn't in the form ${bad.startsWith("RULE") ? RULE_FORM : SCREEN_FORM}.`);
  if (c.kind === "rule" && !r.rules.length) issues.push(`${name} printed no line in the form ${RULE_FORM}, so nothing shows your rule was judged.`);
  if (c.kind === "screen" && !r.screens.length) issues.push(`${name} printed no line in the form ${SCREEN_FORM}, so nothing shows the screen was checked.`);
  for (const x of r.rules) judgeRule(x, ctx);
  for (const s of r.screens) {
    if (s.wrong > 0) issues.push(`${fmt(s.wrong)} ${s.unit} on "${s.page}" are wrong.`);
    if (s.checked < s.of) issues.push(`${fmt(s.of - s.checked)} of ${fmt(s.of)} ${s.unit} on "${s.page}" weren't checked.`);
  }
}

async function judge(results, product, state, transcript) {
  const today = new Date().toISOString().slice(0, 10);
  const pins = productRules(product);
  const ctx = { issues: [], notes: [], pins, quoted: new Set([...quotesIn(product), ...pins.map((p) => p.key)]), state, today, printed: new Set() };
  for (const p of ctx.pins) (state.rules[p.key] ??= { quote: p.quote, first: today, unit: p.unit ?? "", n: 0, broke: 0 }).inProduct = true;
  for (const r of results) judgeResult(r, ctx);
  for (const p of ctx.pins) if (!ctx.printed.has(p.key)) ctx.issues.push(`No rule check printed a RULE line for your rule "${p.quote}".`);
  for (const s of Object.values(state.rules)) {
    if (s.inProduct && !s.gone && !ctx.quoted.has(norm(s.quote))) { ctx.issues.push(`Your rule "${s.quote}" (first seen ${s.first}) is no longer in PRODUCT.md.`); s.gone = today; }
  }
  const keys = [...new Set([...ctx.pins.map((p) => p.key), ...ctx.printed])];
  await checkOwnerWords(keys, state, transcript);
  for (const k of keys) if (state.rules[k].owner === false) ctx.issues.push(`"${state.rules[k].quote}" isn't in any message you sent, so it may not be your words.`);
  return ctx;
}

// ---------- saying it ----------
const tail = (out, lines = 30) => out.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").trimEnd().split(/\r?\n/).slice(-lines).join("\n").slice(-2500);
const cap = (s, n = 9000) => (s.length > n ? `${s.slice(0, n - 30)}\n… (cut to fit)` : s);

function status(r) {
  if (r.skipped === "shape") return "didn't run (not one plain command)";
  if (r.skipped) return "didn't run (no time left)";
  if (r.timedOut) return `didn't finish in ${Math.round(r.left / 1000)} s`;
  const s = `${Math.round(r.ms / 1000)} s`;
  return r.code === 0 ? `passed (${s})` : `failed (exit ${r.code}, ${s})`;
}

function report(results, ctx, where, why) {
  const lines = [`Off the Mode checked ${where}${why}:`];
  for (const r of results) {
    lines.push(`- ${r.c.kind === "check" ? "check" : r.c.kind === "rule" ? "rule check" : "screen check"} \`${r.c.cmd}\`: ${status(r)}`);
    for (const x of [...(r.rules ?? []), ...(r.screens ?? [])]) lines.push(`  ${x.line}`);
  }
  if (!results.length) lines.push("- RULES.md §Commands names no check, rule check or screen check.");
  lines.push(...(ctx.issues.length ? ["Not done yet:", ...ctx.issues.map((i) => `- ${i}`)] : ["All passed."]));
  if (ctx.notes.length) lines.push("Also:", ...ctx.notes.map((n) => `- ${n}`));
  return lines.join("\n");
}

function sendBack(results, ctx, where) {
  const failed = results.filter((r) => r.timedOut || (r.code !== undefined && r.code !== 0));
  return cap([
    `${MARK} (.offthemode/stop-check.mjs) ran the checks RULES.md §Commands names, because the last reply says the work is done. On ${where} they don't show it done:`,
    ...ctx.issues.map((i) => `- ${i}`),
    ...failed.flatMap((r) => [`Last lines of \`${r.c.cmd}\`:`, tail(r.out)]),
    "The owner sees these lines. The work counts as done once these checks pass; until then the reply says plainly what isn't done. Where the owner asked for a stop at this point, the result and the stop are enough. This comes once for these numbers.",
  ].join("\n"));
}

// ---------- the run ----------
function findRoot(start) {
  for (let dir = resolve(start); ; dir = dirname(dir)) {
    if (existsSync(join(dir, ".offthemode", "RULES.md"))) return dir;
    if (dirname(dir) === dir) return null;
  }
}

function statePath(root) {
  const p = git(["rev-parse", "--git-path", "offthemode-stop.json"], root)?.trim();
  return p ? resolve(root, p) : join(tmpdir(), `offthemode-stop-${createHash("sha256").update(root).digest("hex").slice(0, 12)}.json`);
}

async function readInput() {
  if (process.argv.includes("--now") || process.stdin.isTTY) return null;
  let text = "";
  process.stdin.setEncoding("utf8");
  const got = await new Promise((ok) => {
    const t = setTimeout(() => ok(false), 3000);
    process.stdin.on("data", (d) => { text += d; });
    process.stdin.on("end", () => { clearTimeout(t); ok(true); });
  });
  process.stdin.destroy();
  if (!got || !text.trim()) return null;
  return JSON.parse(text);
}

const inFlight = (tasks) => (tasks ?? []).some((t) => /subagent|workflow|teammate|cloud/i.test(t?.type ?? "") && !/complete|done|fail|kill|stop|cancel|error/i.test(t?.status ?? ""));

async function main() {
  const input = await readInput();
  const hook = input !== null;
  const reply = hook ? readReply(input.last_assistant_message) : "manual";
  if (hook && (input.agent_id || reply === "none" || inFlight(input.background_tasks))) return;
  // The hook's cwd follows the AI into a worktree; CLAUDE_PROJECT_DIR stays on the main checkout.
  const root = findRoot(hook ? input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd() : process.cwd());
  if (!root) return hook ? undefined : console.log("No .offthemode/RULES.md here or above it, so there is nothing to check.");
  const rules = read(join(root, ".offthemode", "RULES.md")) ?? "", product = read(join(root, ".offthemode", "PRODUCT.md")) ?? "";
  const file = statePath(root);
  const state = { rules: {}, ...JSON.parse(read(file) ?? "{}") };
  const commands = parseCommands(rules);
  if (!commands.length && !productRules(product).length) {
    const say = "Off the Mode's stop check found nothing to run: RULES.md §Commands names no check, rule check or screen check.";
    if (!hook) return console.log(say);
    if (state.toldNothing) return;
    writeFileSync(file, JSON.stringify({ ...state, toldNothing: true }));
    return process.stdout.write(JSON.stringify({ systemMessage: say }));
  }
  if (hook && state.fingerprint && fingerprint(root) === state.fingerprint) return;
  const results = await runAll(commands, root, budget(rules));
  const ctx = await judge(results, product, state, hook ? input.transcript_path : null);
  const sha = git(["rev-parse", "--short", "HEAD"], root)?.trim(), branch = git(["branch", "--show-current"], root)?.trim();
  const dirty = sha && git(["status", "--porcelain"], root)?.trim() ? " with uncommitted changes" : "";
  const where = sha ? `${branch || "a detached HEAD"} at ${sha}${dirty}` : root;
  const owner = report(results, ctx, where, !hook ? "" : reply === "claim" ? ", because your AI said the work is done" : ", because your AI's reply says some work is done");
  if (!hook) {
    writeFileSync(file, JSON.stringify(state));
    console.log(owner);
    process.exitCode = ctx.issues.length ? 1 : 0;
    return;
  }
  const numbers = createHash("sha256").update(ctx.issues.join("\n")).digest("hex");
  const back = ctx.issues.length && !input.stop_hook_active && reply === "claim" && numbers !== state.sentBack;
  const outcome = !ctx.issues.length ? "" : back ? "Your AI was sent back once to fix this or tell you plainly what isn't done."
    : input.stop_hook_active ? "Your AI was already sent back once this turn, so it stops here."
    : reply === "checkpoint" ? "Your AI stopped for your answer, so it wasn't sent back."
    : "Same result as when your AI was last sent back, so it stops here.";
  Object.assign(state, { fingerprint: fingerprint(root), ...(back ? { sentBack: numbers } : {}) });
  writeFileSync(file, JSON.stringify(state));
  const out = { systemMessage: cap([owner, outcome].filter(Boolean).join("\n")) };
  if (back) out.hookSpecificOutput = { hookEventName: "Stop", additionalContext: sendBack(results, ctx, where) };
  process.stdout.write(JSON.stringify(out));
}

// Run as a script, not imported (the tests import it). Compared as real paths: macOS's temp folder is a symlink.
const isMain = () => { try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; } };
if (isMain()) {
  main().catch((e) => {
    const say = `${MARK} couldn't run, so nothing was checked: ${e?.message ?? e}`;
    if (process.argv.includes("--now") || process.stdin.isTTY) { console.error(say); process.exitCode = 2; } else process.stdout.write(JSON.stringify({ systemMessage: say }));
  });
}
