// Off the Mode · the stop check. Setup copies it to .offthemode/stop-check.mjs and replaces it whole on update.
// When your AI says the work is done, it runs the checks .offthemode/RULES.md §Commands names (check, rule checks,
// screen checks), shows you what they found, and sends the AI back once when they don't show the work done. At a stop
// for your review, or when no file outside .offthemode/ changed since the last full run, only the rule checks rerun and
// the others show their last run. A reply that claims nothing runs nothing. The checks run as if you typed them in a
// terminal, outside Claude Code's sandbox. This script makes no network call (a check it runs may), and writes only its
// own state file (inside .git/, or in the temp folder outside git).
// Run it yourself, or from any AI tool: node .offthemode/stop-check.mjs --now (exit 1 when the checks don't show it done)
// Claude Code runs it at each stop once .claude/settings.local.json holds this block, added only on the owner's yes:
// SETTINGS {"hooks":{"Stop":[{"hooks":[{"type":"command","command":"node","args":["${CLAUDE_PROJECT_DIR}/.offthemode/stop-check.mjs"],"timeout":900,"statusMessage":"Off the Mode is checking the work"}]}]}}
import { readFileSync, writeFileSync, renameSync, existsSync, statSync, readdirSync, realpathSync, createReadStream } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

// The checks' time in seconds, under the hook's 900, so a hung check is reported, never dropped in silence.
// RULES.md §Budgets can set it with the key stop_check_seconds, up to MOST: at the hook's timeout Claude Code cancels
// the hook and drops what it found.
const SECONDS = 480;
const MOST = 840;
const KINDS = { check: "check", "rule check": "rule", "rule checks": "rule", "screen check": "screen", "screen checks": "screen" };
// Only plain commands run by themselves: words joined by &&, nothing a shell would expand, redirect or chain.
const PLAIN = /^[\w@%+=:,./-]+(?: +[\w@%+=:,./-]+)*$/;
const NEVER = /^(?:rm|rmdir|del|sudo|curl|wget|ssh|scp|vercel|netlify)\b|^git (?:push|pull|fetch|clone|reset|clean|checkout|switch|restore|commit|merge|rebase|stash|rm|mv|tag|branch)\b|^(?:npm|pnpm|yarn) (?:publish|unpublish|deprecate)\b/;
const N = String.raw`(\d[\d,]*)`;
const RULE_LINE = new RegExp(String.raw`^RULE\s+"(.*)"\s*:\s*broke\s+${N}\s*[·|]\s*judged\s+${N}\s+of\s+${N}\s+(\S.*?)\s*$`);
const SCREEN_LINE = new RegExp(String.raw`^SCREEN\s+"(.*)"\s*:\s*wrong\s+${N}\s*[·|]\s*checked\s+${N}\s+of\s+${N}\s+(\S.*?)\s*$`);
const RULE_FORM = `RULE "<your words>": broke B · judged J of N <what it counts>`;
const SCREEN_FORM = `SCREEN "<route>": wrong W · checked C of R rows`;
// A page made to show states with invented rows, not the screen the owner uses.
const LAB = /(?:^|\/)(?:labs?|gallery|states|specimens?|storybook|playground)(?:\/|$)/i;
const MARK = "Off the Mode's stop check";

// ---------- reading the reply ----------
// Read with patterns, measured on 610 real final replies from five projects, 100 of them labelled by hand: 12 of the 18
// read as a claim say the work is done; of 18 that do, 12 read as a claim, 6 as a checkpoint (shown, never sent back).
// A reply wrongly read as a claim can be sent back once, so an unsure reply reads as a checkpoint.
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
// It waits on a job still running, or on a step only the owner can take.
const WAITING = /\b(?:I need [^.\n]{0,60}\bfrom you|needs you\b|your (?:one |only |next )?step now|I'll (?:continue|go on|carry on|pick (?:it|this) up|report back) (?:when|once|after)|(?:is|are) still running|(?:still )?waiting (?:on|for)|when (?:it|they|that|this|both|the \w+) (?:finish(?:es)?|ends?|reports?|lands?|comes? back|(?:is|are) in)|still to come|your steps|you need to do|please (?:try|open|run|tell|copy|paste|reply|answer|confirm|look|leave|log in)|tell me (?:once|when|it's|it is)|copy what|reply with|(?:answer|pick|choose) (?:\d|one|both|a or b)|in the background|(?:once|when) (?:you|they|it)(?:'re|'s| are| is)? (?:back|answer|reply|say|confirm)|I'll [^.\n]{0,60}\b(?:once|when) |can't [^.\n]{0,40}\byet|over to you|your turn|tell me to (?:go on|continue|start)|holding (?:here|there)|when you say so)\b/i;

/** "claim" when the reply says the work is done, "checkpoint" when it also stops for the owner, else "none". */
export function readReply(text) {
  const plain = String(text ?? "").replace(/```[\s\S]*?```|`[^`\n]*`|"[^"\n]*"|“[^”\n]*”/g, " ").replace(DOUBT, " ");
  if (!CLAIMS.some((re) => re.test(plain))) return "none";
  const end = plain.trim().split("\n").filter((l) => l.trim()).slice(-3).join("\n");
  return CHECKPOINT.test(plain) || WAITING.test(plain) || /\?[\s*_)]*(?:\n|$)|\?\*\*/.test(end) ? "checkpoint" : "claim";
}

// ---------- reading the notes ----------
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return null; } };
export const norm = (s) => String(s).normalize("NFKC").toLowerCase().replace(/[‘’ʼ`´]/g, "'").replace(/[“”«»„]/g, '"').replace(/\s+/g, " ").trim().replace(/[.!;,]+$/, "");
const fmt = (n) => n.toLocaleString("en-US");
const num = (s) => Number(s.replace(/,/g, ""));
const clock = (t) => (t ? new Date(t).toTimeString().slice(0, 5) : "an earlier stop");
function section(md, name) {
  const lines = md.split(/\r?\n/), at = lines.findIndex((l) => l.startsWith(`## ${name}`)), end = lines.findIndex((l, i) => i > at && l.startsWith("## "));
  return at < 0 ? [] : lines.slice(at + 1, end < 0 ? undefined : end);
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
  return [...out, { label, cmds }].map((s) => ({ label: s.label.trim().toLowerCase(), cmds: s.cmds }));
}
/** The checks RULES.md §Commands names, in order: [{ kind, cmd, plain }]. */
export const parseCommands = (rulesMd) => section(rulesMd, "Commands").flatMap(segments).filter((s) => KINDS[s.label]).flatMap(({ label, cmds }) =>
  cmds.filter((cmd) => cmd && !/^none$|^not set|\{\{/i.test(cmd)).map((cmd) => ({ kind: KINDS[label], cmd, plain: cmd.split("&&").every((p) => PLAIN.test(p.trim()) && !NEVER.test(p.trim())) })));
export function budget(rulesMd) {
  const json = section(rulesMd, "Budgets").join("\n").match(/```json\s*([\s\S]*?)```/)?.[1];
  try { const s = JSON.parse(json).stop_check_seconds; return s > 0 ? Math.min(s, MOST) : SECONDS; } catch { return SECONDS; }
}
/** The owner's rules PRODUCT.md quotes: "owner's rule", "<their words>", "counted in <unit>", "checked by <command>". */
export const productRules = (md) => md.replace(/[“”]/g, '"').split(/\r?\n/).filter((l) => /owner['’]s rule/i.test(l)).map((line) => {
  const quote = line.match(/"(.*)"\s*(?:·|$)/)?.[1], field = (name) => line.match(new RegExp(`${name}\\s+\`?([^\`·]+?)\`?\\s*(?:·|$)`, "i"))?.[1] ?? null;
  return quote && !quote.includes("{{") ? { key: norm(quote), quote, unit: field("counted in"), by: field("checked by") } : null;
}).filter(Boolean);
/** The screens PRODUCT.md says tell the owner what will happen: "- Screen check: <route> · checked by <command>". */
export const productScreens = (md) => [...md.replace(/`/g, "").matchAll(/^\s*-\s*Screen check:\s*(\S+)\s*·\s*checked by\s+(.+?)\s*$/gim)]
  .filter((m) => !m[0].includes("{{")).map((m) => ({ route: m[1], by: m[2] }));
const quotesIn = (md) => new Set([...md.replace(/[“”]/g, '"').matchAll(/"([^"\n]+)"/g)].map((m) => norm(m[1])));
/** The RULE and SCREEN lines a check printed, and any line that starts like one but isn't in the form. */
export function parseLines(out) {
  const rules = [], screens = [], malformed = [];
  for (const line of out.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").split(/\r?\n/).map((l) => l.trim())) {
    const r = /^RULE\b/.test(line) && line.match(RULE_LINE), s = /^SCREEN\b/.test(line) && line.match(SCREEN_LINE);
    if (r) rules.push({ line, quote: r[1], broke: num(r[2]), judged: num(r[3]), of: num(r[4]), unit: r[5] });
    else if (s) screens.push({ line, page: s[1], wrong: num(s[2]), checked: num(s[3]), of: num(s[4]), unit: s[5] });
    else if (/^(?:RULE|SCREEN)\b/.test(line)) malformed.push(line);
  }
  return { rules, screens, malformed };
}

// ---------- running ----------
const git = (args, cwd) => { try { return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 256 * 1024 * 1024 }); } catch { return null; } };
/** A hash of what git sees outside .offthemode/ (the notes change every reply) plus RULES.md and PRODUCT.md, which say
 * what to check. null outside git, where every claim runs the checks. */
function fingerprint(root) {
  const top = git(["rev-parse", "--show-toplevel"], root)?.trim();
  if (!top) return null;
  const paths = ["--", ":/", ":(exclude).offthemode"];
  const status = git(["status", "--porcelain=v1", "-z", "--untracked-files=all", ...paths], root) ?? "";
  const h = createHash("sha256").update(git(["ls-files", "-s", ...paths], root) ?? "").update(status);
  h.update(git(["diff", "--binary", "--no-ext-diff", ...paths], root) ?? "");
  for (const entry of status.split("\0").filter((e) => e.startsWith("?? "))) {
    try { const s = statSync(join(top, entry.slice(3))); h.update(`${entry}:${s.size}:${s.mtimeMs}`); } catch { /* gone since */ }
  }
  for (const f of ["RULES.md", "PRODUCT.md"]) h.update(read(join(root, ".offthemode", f)) ?? "");
  return h.digest("hex");
}

// Each check runs in its own process group, so a dev server or browser it starts goes with it. When this script is
// stopped (Esc, or the hook's timeout), the signal handlers at the bottom end those groups; if killed outright, a watcher.
const win = process.platform === "win32", running = new Set();
const killGroup = (pid, signal = "SIGKILL") => { try { if (win) spawnSync("taskkill", ["/pid", String(pid), "/T", "/F"]); else process.kill(-pid, signal); } catch { /* gone */ } };
const WATCH = "const [h, g] = process.argv.slice(1).map(Number); setInterval(() => { try { process.kill(h, 0); } catch { try { process.kill(-g, 'SIGKILL'); } catch {} process.exit(); } }, 500);";
function run(cmd, cwd, ms) {
  return new Promise((done) => {
    const started = Date.now(), child = spawn(cmd, { cwd, shell: true, detached: !win, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" } });
    const watcher = win || !child.pid ? null : spawn(process.execPath, ["-e", WATCH, String(process.pid), String(child.pid)], { detached: true, stdio: "ignore" });
    if (child.pid) running.add(child.pid), watcher?.unref();
    let out = "", timedOut = false, ended = false;
    const take = (d) => { out += d; if (out.length > 400_000) out = out.slice(-200_000); };
    for (const s of [child.stdout, child.stderr]) s.on("data", take);
    const end = (code) => {
      if (ended) return;
      ended = true, clearTimeout(timer), running.delete(child.pid), watcher?.kill();
      for (const s of [child.stdout, child.stderr]) s.destroy();
      done({ code: timedOut ? null : code, out, timedOut, ms: Date.now() - started });
    };
    const timer = setTimeout(() => { timedOut = true; killGroup(child.pid); }, ms);
    child.on("error", (e) => { out += String(e.message); end(127); });
    child.on("close", (code) => end(code ?? 1));
    child.on("exit", (code) => { killGroup(child.pid, "SIGTERM"); setTimeout(() => end(code ?? 1), 2000).unref(); });
  });
}

/** Runs the checks in order within the budget. With saved results (a light stop), only rule checks run again. */
async function runAll(commands, root, seconds, saved) {
  const deadline = Date.now() + seconds * 1000, results = [];
  for (const c of commands) {
    const left = deadline - Date.now();
    if (saved && c.kind !== "rule") results.push(saved[c.cmd] ? { c, ...saved[c.cmd], reused: true } : { c, skipped: "later" });
    else if (!c.plain || left <= 0) results.push({ c, skipped: c.plain ? "time" : "shape", at: Date.now() });
    else { const r = await run(c.cmd, root, left); results.push({ c, ...r, left, ...parseLines(r.out), at: Date.now() }); }
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
      const low = line.includes('"type":"user"') ? line.toLowerCase() : "", open = probes.filter((p) => low && !found.has(p.k) && low.includes(p.probe));
      let e;
      try { e = open.length && JSON.parse(line); } catch { continue; }
      if (!e || e.type !== "user" || e.isSidechain || e.isMeta || (e.origin?.kind && e.origin.kind !== "human")) continue;
      const c = e.message?.content;
      const text = (typeof c === "string" ? c : Array.isArray(c) ? c.filter((b) => b?.type === "text").map((b) => b.text).join("\n") : "").replace(NOT_SAID, " ");
      const said = text.includes(MARK) ? "" : norm(text);
      for (const p of open) if (said.includes(p.k)) found.add(p.k);
    }
  }
  return found;
}

/** Marks each quote true or false in state.rules; untouched (unknown) when there is no transcript to read. */
async function checkOwnerWords(keys, state, transcript) {
  const fresh = keys.filter((k) => state.rules[k].owner === undefined), open = keys.filter((k) => state.rules[k].owner !== true), dir = dirname(transcript ?? ".");
  if (!transcript || !existsSync(transcript) || !open.length) return;
  const all = fresh.length ? readdirSync(dir).filter((f) => f.endsWith(".jsonl")).map((f) => join(dir, f)).filter((f) => f !== transcript) : [];
  const found = await inOwnerMessages(open, [transcript, ...all]);
  for (const k of open) state.rules[k].owner = found.has(k);
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
  // A note, not an issue: a right fix can lower it too (the code stops moving what it shouldn't).
  if (x.of < s.n) notes.push(`${q} now covers ${fmt(x.of)} ${x.unit}, down from ${fmt(s.n)}.`);
  Object.assign(s, { unit: x.unit, n: x.of, broke: Math.max(s.broke, x.broke) });
  if (s.broke === 0) notes.push(`${q} has never been seen to fail. Trust its rule check once, run on the code from before the change, it finds the breaks you reported, or three you confirm by name.`);
}

function judgeResult(r, ctx) {
  const { c } = r, { issues } = ctx, name = `\`${c.cmd}\``;
  if (r.skipped === "later") return;
  if (r.skipped === "shape") return issues.push(`${name} didn't run: only a plain command, or plain commands joined by &&, runs by itself.`);
  if (r.skipped) return issues.push(`${name} didn't run: the checks used all their time (stop_check_seconds in RULES.md §Budgets).`);
  if (r.timedOut) return issues.push(`${name} didn't finish in ${Math.round(r.left / 1000)} s, so it judged nothing.`);
  if (r.code !== 0) issues.push(`${name} failed (exit ${r.code}).`);
  for (const bad of r.malformed) issues.push(`${name} printed "${bad}", which isn't in the form its line needs.`);
  const pin = ctx.pins.find((p) => p.by === c.cmd);
  if (c.kind === "rule" && !r.rules.length) {
    issues.push(`${name} doesn't say how many of your cases it judged, so nothing shows ${pin ? `"${pin.quote}"` : "your rule"} holds.`);
    if (pin) ctx.printed.add(pin.key); // said here, so not again as "no RULE line"
  }
  if (c.kind === "screen" && !r.screens.length) issues.push(`${name} doesn't say how many rows it checked, so nothing shows the screen is right.`);
  if (r.malformed.length || (c.kind !== "check" && !r.rules.length && !r.screens.length)) ctx.forms = true;
  for (const x of r.rules) judgeRule(x, ctx);
  for (const x of r.screens) {
    const p = `"${x.page}"`;
    ctx.shown.add(x.page);
    if (LAB.test(x.page)) issues.push(`${p} is a lab or gallery page with invented rows, not the screen you use; a screen check runs on the real one.`);
    if (x.wrong > 0) issues.push(`${fmt(x.wrong)} ${x.unit} on ${p} are wrong.`);
    if (x.checked < x.of) issues.push(`${fmt(x.of - x.checked)} of ${fmt(x.of)} ${x.unit} on ${p} weren't checked.`);
  }
}

async function judge(results, product, state, transcript, reached) {
  const today = new Date().toISOString().slice(0, 10);
  const pins = productRules(product);
  const ctx = { issues: [], notes: [], pins, quoted: new Set([...quotesIn(product), ...pins.map((p) => p.key)]), state, today, printed: new Set(), shown: new Set() };
  for (const p of pins) (state.rules[p.key] ??= { quote: p.quote, first: today, unit: p.unit ?? "", n: 0, broke: 0 }).inProduct = true;
  for (const r of results) judgeResult(r, ctx);
  for (const p of pins) if (!ctx.printed.has(p.key)) ctx.issues.push(`No rule check printed a RULE line for your rule "${p.quote}".`);
  for (const s of productScreens(product)) if (!ctx.shown.has(s.route)) ctx.issues.push(`No screen check printed a SCREEN line for ${s.route}, a screen that tells you what will happen.`);
  for (const s of Object.values(state.rules).filter((s) => s.inProduct && !s.gone && !ctx.quoted.has(norm(s.quote)))) {
    ctx.issues.push(`Your rule "${s.quote}" (first seen ${s.first}) is no longer in PRODUCT.md.`);
    s.gone = today;
  }
  const keys = [...new Set([...pins.map((p) => p.key), ...ctx.printed])];
  await checkOwnerWords(keys, state, transcript);
  // An issue once it reaches your AI, then a note: a rule said in another tool, or in a deleted transcript, is never found.
  for (const s of keys.map((k) => state.rules[k]).filter((s) => s.owner === false)) {
    if (s.flagged) ctx.notes.push(`"${s.quote}" isn't in any message you sent: say the rule once in chat to confirm it.`);
    else ctx.issues.push(`"${s.quote}" isn't in any message you sent, so it may not be your words.`);
    if (reached) s.flagged ??= today;
  }
  ctx.ruled = pins.length > 0 || results.some((r) => r.c.kind === "rule");
  return ctx;
}

// ---------- saying it ----------
const tail = (out, lines = 30) => out.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").trimEnd().split(/\r?\n/).slice(-lines).join("\n").slice(-2500);
const cap = (s, n = 9000) => (s.length > n ? `${s.slice(0, n - 30)}\n… (cut to fit)` : s);
const emit = (o) => process.stdout.write(JSON.stringify(o));
const SKIPPED = { later: "not run yet: it runs when your AI says it's done", shape: "didn't run (not one plain command)", time: "didn't run (no time left)" };
function status(r) {
  if (r.skipped || r.timedOut) return SKIPPED[r.skipped] ?? `didn't finish in ${Math.round(r.left / 1000)} s`;
  const s = `${Math.round(r.ms / 1000)} s${r.reused ? `, its run at ${clock(r.at)}` : ""}`;
  return r.code === 0 ? `passed (${s})` : `failed (exit ${r.code}, ${s})`;
}
function report(results, ctx, head) {
  const lines = [...head];
  for (const r of results) {
    lines.push(`- ${r.c.kind === "check" ? "check" : r.c.kind === "rule" ? "rule check" : "screen check"} \`${r.c.cmd}\`: ${status(r)}`);
    for (const x of [...(r.rules ?? []), ...(r.screens ?? [])]) lines.push(`  ${x.line}`);
  }
  if (!results.length) lines.push("- RULES.md §Commands names no check, rule check or screen check.");
  lines.push(...(ctx.issues.length ? ["Not done yet:", ...ctx.issues.map((i) => `- ${i}`)] : [ctx.ruled ? "All passed." : "The checks passed. No rule of yours is checked: PRODUCT.md quotes none."]));
  if (ctx.notes.length) lines.push("Also:", ...ctx.notes.map((n) => `- ${n}`));
  return lines.join("\n");
}
function sendBack(results, ctx, where) {
  const failed = results.filter((r) => r.timedOut || (r.code !== undefined && r.code !== 0));
  return cap([
    `${MARK} (.offthemode/stop-check.mjs) ran the checks RULES.md §Commands names, because the last reply says the work is done. On ${where} they don't show it done:`,
    ...ctx.issues.map((i) => `- ${i}`),
    ...(ctx.forms ? [`Each rule check prints ${RULE_FORM}; each screen check prints ${SCREEN_FORM}.`] : []),
    ...failed.flatMap((r) => [`Last lines of \`${r.c.cmd}\`:`, tail(r.out)]),
    "The owner sees these lines. The work counts as done once these checks pass; until then the reply says plainly what isn't done. Where the owner asked for a stop at this point, the result and the stop are enough. This comes once for these numbers.",
  ].join("\n"));
}

// ---------- the run ----------
function findRoot(start) {
  for (let dir = resolve(start); ; dir = dirname(dir)) if (existsSync(join(dir, ".offthemode", "RULES.md"))) return realpathSync(dir); else if (dirname(dir) === dir) return null;
}
// The project is the one Claude Code was opened in. The AI's own folder counts only when it is a worktree of the same
// repository: in any other project with notes, the owner said yes to none of its commands.
function projectRoot(input) {
  const home = findRoot(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
  const here = input.cwd ? findRoot(input.cwd) : null;
  if (!here || here === home) return { root: home };
  const common = (d) => { const p = d && git(["rev-parse", "--git-common-dir"], d)?.trim(); try { return p ? realpathSync(resolve(d, p)) : null; } catch { return null; } };
  const repo = common(here);
  return repo && repo === common(home) ? { root: here } : { root: home, away: here };
}
const statePath = (root, p = git(["rev-parse", "--git-path", "offthemode-stop.json"], root)?.trim()) =>
  p ? resolve(root, p) : join(tmpdir(), `offthemode-stop-${createHash("sha256").update(root).digest("hex").slice(0, 12)}.json`);
// An empty or cut-short file starts fresh, with a note, instead of stopping every later check.
const told = [];
function loadState(file) {
  try { const s = JSON.parse(read(file) ?? "{}"); if (s?.constructor === Object && (s.rules ?? {}).constructor === Object) return { rules: {}, ...s }; } catch { /* below */ }
  return told.push("Its saved state couldn't be read, so it started fresh."), { rules: {} };
}
// Written whole, then renamed into place, so a stop cut off mid-write or a second session never reads half a file.
const save = (file, state, tmp = `${file}.${process.pid}.tmp`) => { writeFileSync(tmp, JSON.stringify(state)); renameSync(tmp, file); };
/** Remembers each check's last result, which a light stop shows, and after a full run the fingerprint and its time. */
function keep(state, results, commands, fp) {
  const fresh = Object.fromEntries(results.filter((r) => !r.reused && r.skipped !== "later").map((r) => [r.c.cmd,
    { code: r.code, timedOut: r.timedOut, ms: r.ms, left: r.left, skipped: r.skipped, out: tail(r.out ?? ""), rules: r.rules, screens: r.screens, malformed: r.malformed, at: r.at }]));
  state.results = Object.fromEntries(commands.map((c) => [c.cmd, fresh[c.cmd] ?? state.results?.[c.cmd]]).filter(([, v]) => v));
  if (fp !== undefined) Object.assign(state, { fingerprint: fp, fullAt: Date.now() });
}

async function readInput() {
  if (process.argv.includes("--now") || process.stdin.isTTY) return null;
  let text = "";
  process.stdin.setEncoding("utf8").on("data", (d) => { text += d; });
  const got = await new Promise((ok) => { const t = setTimeout(() => ok(false), 3000); process.stdin.on("end", () => { clearTimeout(t); ok(true); }); });
  process.stdin.destroy();
  return got && text.trim() ? JSON.parse(text) : null;
}
const inFlight = (tasks) => (tasks ?? []).some((t) => /subagent|workflow|teammate|cloud/i.test(t?.type ?? "") && !/complete|done|fail|kill|stop|cancel|error/i.test(t?.status ?? ""));
function where(root, sha = git(["rev-parse", "--short", "HEAD"], root)?.trim()) {
  return sha ? `${git(["branch", "--show-current"], root)?.trim() || "a detached HEAD"} at ${sha}${git(["status", "--porcelain"], root)?.trim() ? " with uncommitted changes" : ""}` : root;
}
function nothingNamed(hook, state, file) {
  const say = `${MARK} found nothing to run: RULES.md §Commands names no check, rule check or screen check.`;
  if (!hook) return console.log(say);
  if (!state.toldNothing) { save(file, { ...state, toldNothing: true }); emit({ systemMessage: say }); }
}

async function main() {
  const input = await readInput(), hook = input !== null;
  const reply = hook ? readReply(input.last_assistant_message) : "manual";
  if (hook && (input.agent_id || reply === "none" || inFlight(input.background_tasks))) return;
  const { root, away } = hook ? projectRoot(input) : { root: findRoot(process.cwd()) };
  if (away) return emit({ systemMessage: `${MARK} ran nothing: your AI is working in ${away}, which isn't this project.` });
  if (!root) return hook ? undefined : console.log("No .offthemode/RULES.md here or above it, so there is nothing to check.");
  const rules = read(join(root, ".offthemode", "RULES.md")) ?? "", product = read(join(root, ".offthemode", "PRODUCT.md")) ?? "";
  const file = statePath(root), state = loadState(file), commands = parseCommands(rules);
  if (!commands.length && !productRules(product).length && !productScreens(product).length) return nothingNamed(hook, state, file);
  const fp = fingerprint(root);
  const light = !hook ? "" : reply === "checkpoint" ? "At a stop for your review only the rule checks run; the others show their last run."
    : fp !== null && fp === state.fingerprint ? `No file changed since ${clock(state.fullAt)}, so only the rule checks ran again.` : "";
  const results = await runAll(commands, root, budget(rules), light ? state.results ?? {} : null);
  const ctx = await judge(results, product, state, hook ? input.transcript_path : null, reply !== "checkpoint");
  ctx.notes.push(...told);
  keep(state, results, commands, light ? undefined : fingerprint(root));
  const at = where(root), why = !hook ? "" : reply === "claim" ? ", because your AI said the work is done" : ", because your AI's reply says some work is done";
  const owner = report(results, ctx, [`Off the Mode checked ${at}${why}:`, ...(light ? [light] : [])]);
  if (!hook) return void (save(file, state), console.log(owner), (process.exitCode = ctx.issues.length ? 1 : 0));
  // Sent back once per set of numbers in a session; a clean run forgets it, so a later break goes back again.
  const numbers = createHash("sha256").update(ctx.issues.join("\n")).digest("hex"), session = input.session_id ?? "none";
  const sent = state.sentBack?.constructor === Object ? state.sentBack : {};
  const back = ctx.issues.length > 0 && !input.stop_hook_active && reply === "claim" && sent[session] !== numbers;
  const outcome = !ctx.issues.length ? "" : back ? "Your AI was sent back once to fix this or tell you plainly what isn't done."
    : input.stop_hook_active ? "Your AI was already sent back once this turn, so it stops here."
    : reply === "checkpoint" ? "Your AI stopped for your answer, so it wasn't sent back."
    : "Same result as when your AI was last sent back, so it stops here.";
  if (!ctx.issues.length) delete state.sentBack; else if (back) state.sentBack = { ...Object.fromEntries(Object.entries(sent).slice(-4)), [session]: numbers };
  save(file, state);
  const out = { systemMessage: cap([owner, outcome].filter(Boolean).join("\n")) };
  if (back) out.hookSpecificOutput = { hookEventName: "Stop", additionalContext: sendBack(results, ctx, at) };
  emit(out);
}

// Run as a script, not imported (the tests import it). Compared as real paths: macOS's temp folder is a symlink.
const isMain = () => { try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; } };
if (isMain()) {
  for (const sig of ["SIGTERM", "SIGINT", "SIGHUP"]) process.on(sig, () => { for (const pid of running) killGroup(pid); process.exit(1); });
  main().catch((e) => {
    const say = `${MARK} couldn't run, so nothing was checked: ${e?.message ?? e}`;
    if (process.argv.includes("--now") || process.stdin.isTTY) { console.error(say); process.exitCode = 2; } else emit({ systemMessage: say });
  });
}
