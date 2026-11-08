// Off the Mode · the stop check. Setup copies it to .offthemode/stop-check.mjs and replaces it whole on update.
// When your AI says the work is done, it runs the checks .offthemode/RULES.md §Commands names (check, rule checks,
// screen checks), shows you what they found, and sends the AI back once when they don't show the work done. At a stop
// for your review, or when no file changed since the last full run (Off the Mode's records, such as STATE.md, and files
// git ignores don't count), only the rule checks rerun, and a check whose command calls git, but only when anything git
// sees has changed, records too; the others show their last run. A reply that claims nothing runs nothing. The checks
// run as if you typed them in a terminal (on Windows, cmd.exe, not Git Bash), outside Claude Code's sandbox. This script
// makes no network call (a check it runs may), and writes only its own state file (inside .git/; in the temp folder
// outside git, or where .git/ can't be written); git's own filters, such as Git LFS's, may keep a copy of a changed file
// inside .git/, as they do on git add. A filter that drops part of a file as git stores it, such as nbstripout's for
// notebook outputs, hides a change to that part.
// Run it yourself, or from any AI tool: node .offthemode/stop-check.mjs --now (exit 1 when the checks don't show it done)
// Claude Code runs it at each stop once .claude/settings.local.json holds this block, added only on the owner's yes:
// SETTINGS {"hooks":{"Stop":[{"hooks":[{"type":"command","command":"node","args":["${CLAUDE_PROJECT_DIR}/.offthemode/stop-check.mjs"],"timeout":900,"statusMessage":"Off the Mode is checking the work"}]}]}}
import { readFileSync, writeFileSync, renameSync, rmSync, existsSync, statSync, lstatSync, readlinkSync, readdirSync, realpathSync, accessSync, constants, createReadStream } from "node:fs";
import { join, dirname, resolve, relative, isAbsolute } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

// The checks' time in seconds, under the hook's 900, so a hung check is reported, never dropped in silence.
// RULES.md §Budgets can set it with the key stop_check_seconds, up to MOST: at the hook's timeout Claude Code cancels
// the hook and drops what it found.
const SECONDS = 480;
const MOST = 840;
const KINDS = { check: "check", "rule check": "rule", "rule checks": "rule", "screen check": "screen", "screen checks": "screen" };
// Only plain commands run by themselves: words joined by &&, nothing a shell would expand (cmd.exe expands %NAME%),
// redirect or chain. Never a push, delete or deploy: at any word, since env, cmd /c or npx runs the word after it; in
// any letter case, since macOS and Windows find Git as git; with a path, .exe, -cli or @version; or with options before
// its command, as git and npm take them.
const PLAIN = /^[\w@+=:,./-]+(?: +[\w@+=:,./-]+)*$/;
const NEVER = /^(?:\S*[\\/])?(?:(?:rm|rmdir|rd|del|erase|remove-item|rimraf|sudo|curl|wget|ssh|scp|vercel|netlify|ntl)(?:-cli)?(?:@\S*)?(?:\.exe|\.cmd)?(?: |$)|git(?:\.exe)? (?:-\S+ (?:[^-\s]\S* )?)*?(?:push|pull|fetch|clone|reset|clean|checkout|switch|restore|commit|merge|rebase|stash|rm|mv|tag|branch)\b|(?:npm|pnpm|yarn|bun)(?:\.cmd|\.exe)? (?:-\S+ (?:[^-\s]\S* )?)*?(?:publish|unpublish|deprecate)(?: |$))/i;
const denied = (part, words = part.split(/ +/)) => words.some((_, i) => NEVER.test(words.slice(i).join(" ")));
const N = String.raw`(\d[\d,]*)`;
const RULE_LINE = new RegExp(String.raw`^RULE\s+"(.*)"\s*:\s*broke\s+${N}\s*[·|]\s*judged\s+${N}\s+of\s+${N}\s+(\S.*?)\s*$`);
const SCREEN_LINE = new RegExp(String.raw`^SCREEN\s+"(.*)"\s*:\s*wrong\s+${N}\s*[·|]\s*checked\s+${N}\s+of\s+${N}\s+(\S.*?)\s*$`);
const RULE_FORM = `RULE "<your words>": broke B · judged J of N <what it counts>`;
const SCREEN_FORM = `SCREEN "<route>": wrong W · checked C of R rows`;
// A page made to show states with invented rows, not the screen the owner uses.
const LAB = /(?:^|\/)(?:labs?|gallery|states|specimens?|storybook|playground)(?:\/|$)/i;
// Run again at a stop with no file changed: a rule check, and a check whose command calls git, whose answer a commit
// changes (it runs again once anything git sees has changed).
const always = (c) => c.kind === "rule" || /(?:^|&&)\s*git\s/.test(c.cmd);
// Off the Mode's records, which its commands write at a reply's end and no check reads: a change to them isn't one.
const RECORDS = ["STATE", "DECISIONS", "CHECKLIST", "REASSESS"];
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
// The time, with the day when it isn't today.
const clock = (t, d = new Date(t)) => (!t ? "an earlier stop" : d.toTimeString().slice(0, 5) + (d.toDateString() === new Date().toDateString() ? "" : ` on ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`));
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
  cmds.filter((cmd) => cmd && !/^none$|^not set|\{\{/i.test(cmd)).map((cmd) => ({ kind: KINDS[label], cmd, plain: cmd.split("&&").every((p) => PLAIN.test(p.trim()) && !denied(p.trim())) })));
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
// With no optional locks, so asking git what changed never rewrites its index; with pathspec magic on, whatever the
// environment says; in English. strict (the repository's top): null when git couldn't open a folder or file, which git
// status says only on stderr, unless it is a folder you can't enter either, so no check of yours sees into it.
const shut = (top, line, d = /^warning: could not open directory '(.*)': Permission denied$/.exec(line)?.[1]) => { if (d) try { accessSync(join(top, d), constants.X_OK); } catch { return true; } return false; };
const git = (args, cwd, { input, strict } = {}) => {
  const r = spawnSync("git", args, { cwd, input, encoding: "utf8", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0", GIT_LITERAL_PATHSPECS: "0", LC_ALL: "C" }, stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"], maxBuffer: 256 * 1024 * 1024 });
  return r.status === 0 && !(strict && r.stderr.split("\n").some((l) => /could not open|Permission denied/.test(l) && !/^warning: unable to access/.test(l) && !shut(strict, l))) ? r.stdout : null;
};
// A real path spelled as on disk; where Node can't (on musl libc, as in Alpine, without /proc), as given.
const real = (p) => { try { return realpathSync.native(p); } catch { return realpathSync(p); } };
/** A hash of what the project's files hold: each path's mode and id as git add would store them, line-ending filters
 * and all, never git's bookkeeping, so a commit after --now changes nothing. Off the Mode's records (they change every
 * reply) and files git ignores don't count; RULES.md and PRODUCT.md, which say what to check, always do. A repository
 * inside this one counts the same way, by its files, so a commit there changes nothing either. null outside git, or
 * when it can't be sure (git fails or can't open a folder you can enter; a file it can't read, a pipe, a name with a
 * line break or in bytes that aren't UTF-8; a link out of the repository; more than 5,000 files or 128 MB to read), and
 * then every claim runs the checks. outer: the top repository's folder. */
// What the last fingerprint of the project read: each path's id, git's index, each repository inside's folder and index.
let lastIds, lastListed, insides;
function fingerprint(root, outer) {
  if (!outer) insides = [];
  const [top, pre, cdup] = git(["rev-parse", "--show-toplevel", "--show-prefix", "--show-cdup"], root)?.split(/\r?\n/) ?? [];
  const paths = ["--", ":/", ...(outer ? [] : RECORDS.map((n) => `:(top,exclude,glob)**/.offthemode/${n}.md`))], ids = new Map(), look = new Set(), files = [];
  // A repository inside is read from its own top only, which git names however the folder is spelled (NFD, letter case).
  const listed = top && (!outer || cdup === "") && git(["ls-files", "-s", "-v", "-z", "--full-name", ...paths], root)?.split("\0");
  // With the owner's settings, so ignore lines match as their git matches them. Submodules are left out: each one is
  // read below, the same way as this repository. Where git ignores letter case, a rename that changes only a letter's
  // case shows nowhere: git asked with case on lists the new name, new or ignored.
  const status = listed && git(["status", "--porcelain=v1", "-z", "--untracked-files=all", "--ignore-submodules=all", ...paths], root, { strict: top })?.split("\0");
  // The last value wins, as in git: the repository's own over the owner's global one. Git for Windows ignores case.
  const config = status && Object.fromEntries((win ? "core.ignorecase true" : git(["config", "--bool", "--get-regexp", "^core\\.(filemode|ignorecase)$"], root) ?? "").split("\n").map((l) => l.split(" ")));
  const cased = status && (config["core.ignorecase"] !== "true" ? [] : git(["-c", "core.ignoreCase=false", "status", "--porcelain=v1", "-z", "--untracked-files=all", "--ignored=matching", "--ignore-submodules=all", ...paths], root, { strict: top })?.split("\0"));
  if (!cased) return null;
  // Read from disk: each path git was told not to look at (assume-unchanged, a lowercase tag; skip-worktree, S), each
  // repository inside this one (git status asks it with its own settings), and each path git status names that the
  // index holds or that is new. A path gone from the index (a rename's old name, with or without rename detection)
  // isn't, since a disk that ignores case finds the new name under it.
  for (const e of listed) {
    const m = e.match(/^(\S) (\d+) (\w+) \d\t([\s\S]+)$/);
    if (m && (ids.set(m[4], `${m[2]} ${m[3]}`), /[a-zS]/.test(m[1]) || m[2] === "160000")) look.add(m[4]);
  }
  for (let i = 0; i < status.length; i++) {
    const xy = status[i].slice(0, 2), p = status[i].slice(3);
    if (p && (ids.has(p) || xy === "??")) look.add(p);
    if (/[RC]/.test(xy) && ids.has(status[++i])) look.add(status[i]);
  }
  // A name only letter case tells from a tracked file or folder is that one renamed where the disk finds both names as
  // one: it counts by name, unread, since what it holds is read under the tracked name. A disk that tells case apart
  // (core.ignorecase copied with the repository from a Mac's or Windows' disk) holds two, and a new one is read.
  const lower = new Map(cased.length ? [...ids.keys()].flatMap((p) => p.split("/").map((_, i, a) => a.slice(0, i + 1).join("/"))).map((k) => [k.toLowerCase(), k]) : []);
  const one = (a, b) => { try { const [x, y] = [a, b].map((p) => lstatSync(join(top, p), { bigint: true })); return x.ino === y.ino && x.dev === y.dev; } catch { return false; } };
  for (const e of cased) { const n = e.slice(3).replace(/\/$/, ""), t = lower.get(n.toLowerCase()); if (/^(?:\?\?|!!) /.test(e) && !ids.has(n) && t) one(n, t) ? ids.set(n, "case") : e[0] === "?" && look.add(n); }
  // A name in bytes that aren't UTF-8 (on Linux) reads back changed, so the file can't be found by it.
  if ([...look].some((p) => p.includes("\uFFFD"))) return null;
  // A project in a repository above it that neither tracks nor shows any of its files is outside git.
  if (pre && ![...ids.keys(), ...look].some((p) => p.startsWith(pre))) return null;
  // With core.fileMode off, git status hides a mode change, which a check that runs the file still sees.
  const modeOff = !win && config["core.filemode"] === "false";
  // null when it's gone, or a folder in its path is now a file; any other error leaves it unsure.
  const stat = (f) => { try { return lstatSync(f); } catch (e) { if (/^(ENOENT|ENOTDIR)$/.test(e?.code)) return null; throw e; } };
  let linkHash, bytes = 0;
  try {
    for (const p of look) {
      const f = join(top, p), s = stat(f);
      if (!s) ids.delete(p);
      else if (s.isDirectory()) {
        // A submodule, or a repository inside this one. A folder that took a file's place isn't one: its files are listed
        // on their own. An empty submodule folder holds nothing; one holding files git doesn't see leaves it unsure.
        if (!existsSync(join(f, ".git"))) { if (/^160000 /.test(ids.get(p)) && readdirSync(f).length) return null; ids.delete(p); continue; }
        const inner = fingerprint(f, outer ?? top);
        if (!inner) return null;
        ids.set(p.replace(/\/$/, ""), `160000 ${inner}`);
      } else if (s.isSymbolicLink()) {
        linkHash ??= git(["rev-parse", "--show-object-format"], root)?.trim() === "sha256" ? "sha256" : "sha1";
        const t = readlinkSync(f, "buffer");
        ids.set(p, `120000 ${createHash(linkHash).update(`blob ${t.length}\0`).update(t).digest("hex")}`);
      } else if (!s.isFile() || /^"|[\r\n]/.test(p)) return null;
      else files.push([p, win ? ids.get(p)?.split(" ")[0] ?? "100644" : s.mode & 0o100 ? "100755" : "100644"]), (bytes += s.size);
    }
    if (modeOff) for (const [p, id] of ids) if (!look.has(p) && /^100/.test(id)) { const s = stat(join(top, p)); if (s?.isFile()) ids.set(p, `${s.mode & 0o100 ? "100755" : "100644"}${id.slice(6)}`); }
    // What a link points to out of the repository can change with no file here changing. Both real paths are spelled as
    // on disk (native), whatever spelling the link was made with.
    const home = real(outer ?? top), out = (t, r = relative(home, t)) => isAbsolute(r) || /^\.\.(?:[\\/]|$)/.test(r);
    for (const [p, id] of ids) if (/^120000 /.test(id)) { const f = join(top, p); let t; try { t = real(f); } catch { t = resolve(dirname(f), readlinkSync(f, "utf8")); } if (out(t)) return null; }
  } catch { return null; }
  if (files.length > 5000 || bytes > 128 * 2 ** 20) return null; // reading more would slow every stop
  // No -w, so it stores nothing; with the path's filters (line endings), so the id matches the index once committed.
  const hashed = files.length ? git(["hash-object", "--stdin-paths"], top, { input: files.map(([p]) => p).join("\n") })?.trim().split("\n") : [];
  if (hashed?.length !== files.length) return null;
  files.forEach(([p, mode], i) => ids.set(p, `${mode} ${hashed[i]}`));
  const h = createHash("sha256").update([...ids].sort(([a], [b]) => (a < b ? -1 : 1)).map(([p, id]) => `${p}\0${id}\n`).join(""));
  if (!outer) h.update(JSON.stringify(["RULES.md", "PRODUCT.md"].map((f) => read(join(root, ".offthemode", f))))), (lastIds = ids), (lastListed = listed);
  else insides.push([root, listed]);
  return h.digest("hex");
}

// Each check runs in its own process group (on Windows, under its own shell), so a dev server or browser it starts goes
// with it. A check is stopped with SIGTERM, so it can close what it opened (Playwright closes its browser and removes
// its temp profile), then SIGKILL to what is left 2 s later; at its time, with each group a process under it made, as
// a tool may start a browser in a group of its own. A watcher, this script run once per stop with --watch, is told each
// check as it runs, and at its time the groups found under it: if this script is stopped or killed (Esc, the hook's
// timeout), the watcher's input ends and it stops them. Windows has no SIGTERM: taskkill ends the tree outright; when this
// script is killed, Windows ends the check's shell with it, and the watcher ends what the shell started in the check's
// time, found by the parent each process names. When a check ends, what it left running in its group is stopped too,
// except on Windows; what it started in a group of its own, such as a daemon a tool keeps between runs, is left running.
const win = process.platform === "win32", GRACE = 2000;
const rows = (cmd, args) => (spawnSync(cmd, args, { encoding: "utf8", windowsHide: true }).stdout ?? "").trim().split(/\r?\n/).map((l) => l.trim().split(/\s+/).map(Number));
// Every process as [pid, ppid, pgid]: from /proc on Linux, as ps reads them there (a slim image, such as Debian's, has
// no ps); elsewhere from /bin/ps, which macOS always has, whatever PATH holds.
const procs = () => { try { return readdirSync("/proc").filter((d) => /^\d+$/.test(d)).map((d) => { const s = read(`/proc/${d}/stat`) ?? ""; return [Number(d), ...s.slice(s.lastIndexOf(")") + 2).split(" ").slice(1, 3).map(Number)]; }); } catch { return rows("/bin/ps", ["-A", "-o", "pid=,ppid=,pgid="]); } };
// Never group 0 or 1, which a misread row could give: they mean this script's own group, and every process.
const signal = (g, sig) => { try { return g > 1 && process.kill(-g, sig); } catch { return false; } };
const taskkill = (p) => spawnSync("taskkill", ["/pid", String(p), "/T", "/F"], { windowsHide: true });
/** Stops the check whose shell is pid, and what it started; tree: also the groups made under it, told (tell) before they
 * are asked to stop, and the groups already known. Resolves once they are gone. */
async function stop(pid, tree = true, tell, known = []) {
  if (win) return void (tree && taskkill(pid));
  const groups = new Set([pid, ...known]), under = new Set([pid]), all = tree ? procs() : [];
  for (let more = true; more; ) { more = false; for (const [p, pp, g] of all) if (under.has(pp) && !under.has(p)) under.add(p), groups.add(g), (more = true); }
  tell?.(groups);
  if (![...groups].filter((g) => signal(g, "SIGTERM")).length) return;
  for (const end = Date.now() + GRACE; [...groups].some((g) => signal(g, 0)) && Date.now() < end; ) await new Promise((ok) => setTimeout(ok, 100));
  for (const g of groups) signal(g, "SIGKILL");
}
// On Windows, once the shell has ended: what it started in the check's time (from, to), never the shell's own pid, which
// Windows may already have given another process.
const orphans = (pid, from, to) => rows("powershell", ["-NoProfile", "-Command", `$f = [DateTimeOffset]::FromUnixTimeMilliseconds(${from}).LocalDateTime; $t = [DateTimeOffset]::FromUnixTimeMilliseconds(${to}).LocalDateTime; (Get-CimInstance Win32_Process -Filter 'ParentProcessId=${pid}' | ? { $_.CreationDate -ge $f -and $_.CreationDate -le $t }).ProcessId`]).forEach(([p]) => p && taskkill(p));
let watcher;
// Tells the watcher the check running now ("pid start"), or none (0). One that can't start (at the process limit) costs
// only the cleanup after a kill, and it never keeps this script running.
const watch = (line) => {
  try {
    if (!watcher) (watcher = spawn(process.execPath, [fileURLToPath(import.meta.url), "--watch"], { detached: true, stdio: ["pipe", "ignore", "ignore"], windowsHide: true }).on("error", () => {})).unref(), watcher.stdin.on("error", () => {});
    watcher.stdin.write(`${line}\n`);
  } catch { /* no watcher */ }
};
function run(cmd, cwd, ms) {
  return new Promise((done) => {
    const started = Date.now(), child = spawn(cmd, { cwd, shell: true, detached: !win, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" } });
    if (child.pid) watch(`${child.pid} ${started}`);
    let out = "", timedOut = false, ended = false, stopping;
    const take = (d) => { out += d; if (out.length > 400_000) out = out.slice(-200_000); };
    for (const s of [child.stdout, child.stderr]) s.on("data", take);
    // The watcher is told no check runs only once what this one left is gone, so a kill in between still ends it.
    const end = (code) => {
      if (ended) return;
      ended = true, clearTimeout(timer);
      for (const s of [child.stdout, child.stderr]) s.destroy();
      const r = { code: timedOut ? null : code, out, timedOut, ms: Date.now() - started };
      Promise.resolve(stopping).then(() => { watch(0); done(r); });
    };
    const timer = setTimeout(() => { timedOut = true; stopping = stop(child.pid, true, (g) => watch(`${child.pid} ${started} ${[...g].join(" ")}`)); }, ms);
    child.on("error", (e) => { out += String(e.message); end(127); });
    child.on("close", (code) => end(code ?? 1));
    // What it left running in its group is stopped, asked once: at its time it already was. A process in another group
    // may hold its output open, so it ends regardless.
    child.on("exit", (code) => { clearTimeout(timer); if (!timedOut) stopping = stop(child.pid, false); setTimeout(() => end(code ?? 1), GRACE + 500).unref(); });
  });
}

/** Runs the checks in order within the budget. With saved results (a light stop), only the checks again() picks run
 * again; a run kept as unsure is perhaps from before the latest changes while the files are as it left them. */
async function runAll(commands, root, seconds, saved, fp, again) {
  const deadline = Date.now() + seconds * 1000, results = [];
  for (const c of commands) {
    const left = deadline - Date.now(), old = saved?.[c.cmd];
    if (saved && !again(c)) results.push(old ? { c, ...old, reused: true, before: fp === null || (old.fp === null && old.after === fp) ? "perhaps before" : old.fp !== fp ? "before" : "" } : { c, skipped: "later" });
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
  if (s.broke === 0) notes.push(`${q} has never been seen to fail. Before you trust its rule check, run it on the code from before the change. It must find the breaks you reported, or three breaks you confirm by name.`);
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

async function judge(results, product, state, transcript, branch = "") {
  const today = new Date().toISOString().slice(0, 10);
  const pins = productRules(product), known = new Set(Object.keys(state.rules));
  const ctx = { issues: [], notes: [], once: [], pins, quoted: new Set([...quotesIn(product), ...pins.map((p) => p.key)]), state, today, printed: new Set(), shown: new Set() };
  for (const p of pins) (state.rules[p.key] ??= { quote: p.quote, first: today, unit: p.unit ?? "", n: 0, broke: 0 }).inProduct = true;
  for (const r of results) judgeResult(r, ctx);
  for (const p of pins) if (!ctx.printed.has(p.key)) ctx.issues.push(`No rule check printed a RULE line for your rule "${p.quote}".`);
  const unrun = results.some((r) => r.c.kind === "screen" && r.skipped === "later");
  for (const s of productScreens(product)) if (!ctx.shown.has(s.route) && !unrun) ctx.issues.push(`No screen check printed a SCREEN line for ${s.route}, a screen that tells you what will happen.`);
  // Words leaving PRODUCT.md are told once (gone, once that reached your AI), and again only on a branch whose last stop
  // since had them (met): a branch first seen is taken as made from the last stop's, so one made after the removal, a
  // rename or a detached HEAD removes nothing. back: words out at the last stop are in again. Words new at a stop where
  // other words leave are a reword of those.
  const all = Object.entries(state.rules), here = (s) => ctx.quoted.has(norm(s.quote));
  const back = all.some(([, s]) => s.out && here(s)), leaving = all.some(([, s]) => s.inProduct && !s.out && !here(s));
  for (const [k, s] of all) {
    const had = s.met?.[branch] ?? !s.out;
    if (leaving && !known.has(k)) s.reword = 1;
    if (here(s)) delete s.out; else if (s.inProduct) s.out = 1;
    if (s.met) s.met[branch] = here(s);
    if (here(s) || !s.inProduct || (s.gone && !had)) continue;
    delete s.gone, (s.met = { [branch]: false });
    // Words found in no message of the owner's that leave as other words come back, or that came in as a reword (an AI's
    // reword undone), are a note: the AI isn't sent to put them back. Any other removal is an issue: a rule said in
    // another tool, or in a deleted transcript, is never found.
    if (s.owner === false && (back || s.reword)) { ctx.notes.push(`"${s.quote}", which isn't in any message you sent, is no longer in PRODUCT.md.`); s.gone = ctx.today; continue; }
    ctx.issues.push(`Your rule "${s.quote}" (first seen ${s.first}) is no longer in PRODUCT.md.`);
    ctx.once.push([s, "gone", ctx.issues.at(-1)]);
  }
  const keys = [...new Set([...pins.map((p) => p.key), ...ctx.printed])];
  await checkOwnerWords(keys, state, transcript);
  // An issue until it reaches your AI, then a note: a rule said in another tool, or in a deleted transcript, is never found.
  for (const s of keys.map((k) => state.rules[k]).filter((s) => s.owner === false)) {
    if (s.flagged) ctx.notes.push(`"${s.quote}" isn't in any message you sent: say the rule once in chat to confirm it.`);
    else ctx.issues.push(`"${s.quote}" isn't in any message you sent, so it may not be your words.`), ctx.once.push([s, "flagged", ctx.issues.at(-1)]);
  }
  ctx.ruled = pins.length > 0 || results.some((r) => r.c.kind === "rule");
  // Lines said only once go first, so a list cut to fit doesn't push one off, and the same failure isn't sent back for it.
  const once = new Set(ctx.once.map(([, , l]) => l));
  ctx.issues.sort((x, y) => once.has(y) - once.has(x));
  return ctx;
}

// ---------- saying it ----------
const tail = (out, lines = 30) => out.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").trimEnd().split(/\r?\n/).slice(-lines).join("\n").slice(-2500);
const cap = (s, n = 9000) => (s.length > n ? `${s.slice(0, n - 30)}\n… (cut to fit)` : s);
const emit = (o) => process.stdout.write(JSON.stringify(o));
const SKIPPED = { later: "not run yet: it runs when your AI says it's done", shape: "didn't run (not one plain command)", time: "didn't run (no time left)" };
function status(r) {
  const when = r.reused && r.skipped !== "shape" ? `${clock(r.at)}${r.before ? `, ${r.before} the latest changes` : ""}` : "";
  if (r.skipped || r.timedOut) return `${SKIPPED[r.skipped] ?? `didn't finish in ${Math.round(r.left / 1000)} s`}${when ? `, at ${when}` : ""}`;
  const s = `${Math.round(r.ms / 1000)} s${when ? `, its run at ${when}` : ""}`;
  return r.code === 0 ? `passed (${s})` : `failed (exit ${r.code}, ${s})`;
}
function report(results, ctx, head) {
  const lines = [...head];
  for (const r of results) {
    lines.push(`- ${r.c.kind === "check" ? "check" : r.c.kind === "rule" ? "rule check" : "screen check"} \`${r.c.cmd}\`: ${status(r)}`);
    for (const x of [...(r.rules ?? []), ...(r.screens ?? [])]) lines.push(`  ${x.line}`);
  }
  if (!results.length) lines.push("- RULES.md §Commands names no check, rule check or screen check.");
  // Never "passed" for a check that didn't run on these changes.
  const old = results.filter((r) => r.before || r.skipped === "later").map((r) => `\`${r.c.cmd}\` ${r.before ? `last ran at ${clock(r.at)}, ${r.before} the latest changes` : "hasn't run yet"}`);
  const passed = old.length ? `${ctx.ruled ? "The rule checks passed" : "No check failed"}, but ${old.join("; ")}.` : ctx.ruled ? "All passed." : "The checks passed.";
  lines.push(...(ctx.issues.length ? ["Not done yet:", ...ctx.issues.map((i) => `- ${i}`)] : [ctx.ruled ? passed : `${passed} No rule of yours is checked: PRODUCT.md quotes none.`]));
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
  // native: the spelling on disk, as git prints it, whatever spelling the path came in.
  const common = (d) => { const p = d && git(["rev-parse", "--git-common-dir"], d)?.trim(); try { return p ? real(resolve(d, p)) : null; } catch { return null; } };
  const repo = common(here);
  return repo && repo === common(home) ? { root: here } : { root: home, away: here };
}
const short = (s) => createHash("sha256").update(s).digest("hex").slice(0, 12);
const mtime = (f) => statSync(f, { throwIfNoEntry: false })?.mtimeMs ?? 0;
// Where the state goes, first choice first: one file per project, so a second project in the same repository keeps its
// own, in .git/; in the temp folder outside git, where .git/ can't be written (an AI tool's sandbox), or where a save to
// .git/ failed though it looked writable (on Windows, access() doesn't read ACLs). The newer of the two is read. The
// temp file is named for the repository too, by when its git folder was made, so a project made or moved to the same
// path never reads another's.
function statePath(root) {
  const [pre, p] = git(["rev-parse", "--show-prefix", "--git-path", "offthemode-stop.json"], root)?.split(/\r?\n/) ?? [];
  const f = p && resolve(root, pre ? p.replace(/\.json$/, `-${short(pre)}.json`) : p), g = f && statSync(dirname(f), { throwIfNoEntry: false });
  const spare = join(tmpdir(), `offthemode-stop-${short(g ? `${root}\n${g.birthtimeMs}` : root)}.json`);
  try { accessSync(dirname(f), constants.W_OK); return [f, spare]; } catch { return f ? [spare, f] : [spare]; }
}
// An empty or cut-short file starts fresh, with a note, instead of stopping every later check; so does one another
// user left under its name in a temp folder all users share (Linux's /tmp), which this script never trusts.
const told = [];
function loadState(file) {
  try {
    if (process.getuid && (statSync(file, { throwIfNoEntry: false })?.uid ?? process.getuid()) !== process.getuid()) throw 0;
    const s = JSON.parse(read(file) ?? "{}");
    if (s?.constructor === Object && (s.rules ?? {}).constructor === Object) return { rules: {}, ...s };
  } catch { /* below */ }
  return told.push("Its saved state couldn't be read, so it started fresh."), { rules: {} };
}
// Written whole under a name no one can guess, readable by its owner alone, then renamed into place, so a stop cut off
// mid-write or a second session never reads half a file. Where it can't be written, the result is still shown.
const save = (files, state) => files.some((f) => {
  const tmp = `${f}.${randomUUID()}.tmp`;
  try { writeFileSync(tmp, JSON.stringify(state), { mode: 0o600, flag: "wx" }); renameSync(tmp, f); return true; } catch { try { rmSync(tmp, { force: true }); } catch { /* none */ } return false; }
});
/** Remembers each check's last result, which a light stop shows, with the files (a run at a light stop: as they were
 * then; a run kept as unsure: as it left them) and what git saw; after a full run, the fingerprint and its time. */
function keep(state, results, commands, fp, gitNow, now, after) {
  const fresh = Object.fromEntries(results.filter((r) => !r.reused && r.skipped !== "later").map((r) => [r.c.cmd,
    { code: r.code, timedOut: r.timedOut, ms: r.ms, left: r.left, skipped: r.skipped, out: tail(r.out ?? ""), rules: r.rules, screens: r.screens, malformed: r.malformed, at: r.at, fp: fp === undefined ? now : fp, git: gitNow, after: fp === null ? after : undefined }]));
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
function where(root, branch, sha = git(["rev-parse", "--short", "HEAD"], root)?.trim()) {
  return sha ? `${branch || "a detached HEAD"} at ${sha}${git(["status", "--porcelain"], root)?.trim() ? " with uncommitted changes" : ""}` : root;
}
function nothingNamed(hook, state, files) {
  const say = `${MARK} found nothing to run: RULES.md §Commands names no check, rule check or screen check.`;
  if (!hook) return console.log(say);
  if (!state.toldNothing) { save(files, { ...state, toldNothing: true }); emit({ systemMessage: say }); }
}

async function main() {
  const input = await readInput(), hook = input !== null;
  const reply = hook ? readReply(input.last_assistant_message) : "manual";
  if (hook && (input.agent_id || reply === "none" || inFlight(input.background_tasks))) return;
  const { root, away } = hook ? projectRoot(input) : { root: findRoot(process.cwd()) };
  if (away) return emit({ systemMessage: `${MARK} ran nothing: your AI is working in ${away}, which isn't this project.` });
  if (!root) return hook ? undefined : console.log("No .offthemode/RULES.md here or above it, so there is nothing to check.");
  const rules = read(join(root, ".offthemode", "RULES.md")) ?? "", product = read(join(root, ".offthemode", "PRODUCT.md")) ?? "";
  const files = statePath(root), state = loadState(files.reduce((a, b) => (mtime(b) > mtime(a) ? b : a))), commands = parseCommands(rules);
  if (!commands.length && !productRules(product).length && !productScreens(product).length) return nothingNamed(hook, state, files);
  const fp = fingerprint(root), seen = lastIds;
  // What a check whose command calls git sees besides the files: HEAD, every ref, git's index, each repository inside's
  // HEAD and index, and Off the Mode's records, staged and on disk, which the fingerprint leaves out.
  const records = () => (git(["ls-files", "-s", "-z", "--", ...RECORDS.map((n) => `:(top,glob)**/.offthemode/${n}.md`)], root) ?? "").split("\0").filter(Boolean).map((e) => [e, read(join(root, e.split("\t").pop()))]);
  const sees = () => [git(["rev-parse", "HEAD", "--all"], root), git(["symbolic-ref", "-q", "HEAD"], root), lastListed, insides.map(([d, l]) => [git(["rev-parse", "HEAD"], d), l]), records()];
  const gitNow = fp && commands.some((c) => c.kind !== "rule" && always(c)) ? short(JSON.stringify([fp, ...sees()])) : undefined;
  // What a light stop runs again: the rule checks, and a check that calls git once anything it sees has changed.
  const again = (c) => c.kind === "rule" || (always(c) && (gitNow === undefined || state.results?.[c.cmd]?.git !== gitNow));
  const rerun = commands.filter((c) => c.plain && again(c));
  const named = [rerun.some((c) => c.kind === "rule") && "the rule checks", rerun.some((c) => c.kind !== "rule") && "the checks that call git"].filter(Boolean).join(" and ");
  const what = (verb) => (!named ? "the checks show their last run" : rerun.length < commands.length ? `only ${named} ${verb}; the others show their last run` : `${named} ${verb}`);
  const light = !hook ? "" : reply === "checkpoint" ? `At a stop for your review ${what("run again")}.`
    : fp !== null && fp === state.fingerprint ? `No file changed since ${clock(state.fullAt)} (${RECORDS.map((n) => `${n}.md`).join(", ")} and files git ignores don't count), so ${what("ran again")}.` : "";
  const results = await runAll(commands, root, budget(rules), light ? state.results ?? {} : null, fp, again);
  const branch = git(["branch", "--show-current"], root)?.trim(), ctx = await judge(results, product, state, hook ? input.transcript_path : null, branch);
  ctx.notes.push(...told);
  // Kept only if no file changed while the checks ran: a check may have read a file before it changed, and a file a check
  // writes, such as a report stamped with the time, can't be told from one someone else changed meanwhile.
  const after = light ? undefined : fingerprint(root);
  const changed = fp && after && after !== fp ? [...new Set([...seen.keys(), ...lastIds.keys()])].filter((p) => seen.get(p) !== lastIds.get(p)).sort() : [];
  const kept = light ? undefined : after === fp ? after : null, tracked = new Set(changed.length ? lastListed.map((e) => e.slice(e.indexOf("\t") + 1)) : []);
  // .gitignore only for files git doesn't track, never a repository inside, that the run made or the last run changed
  // too (a report): not a source file a check rewrote once, as a formatter does.
  const output = changed.every((p) => /^1[02]/.test(lastIds.get(p)) && !tracked.has(p) && (!seen.has(p) || [state.changed].flat().includes(p)));
  if (kept === null && changed.length) ctx.notes.push(`${changed.slice(0, 3).map((p) => `\`${p}\``).join(", ")}${changed.length > 3 ? ` and ${fmt(changed.length - 3)} more` : ""} changed while the checks ran, so the next claim runs them again.${output ? ` If a check writes ${changed.length > 1 ? "them, they" : "it, it"} can go in .gitignore.` : ""}`);
  keep(state, results, commands, kept, gitNow, fp, after);
  if (!light) state.changed = changed.slice(0, 50);
  const at = where(root, branch), why = !hook ? "" : reply === "claim" ? ", because your AI said the work is done" : ", because your AI's reply says some work is done";
  const owner = report(results, ctx, [`Off the Mode checked ${at}${why}:`, ...(light ? [light] : [])]);
  // A line said only once is marked as said once your AI could read it: in --now's output (yours too, when you run it:
  // an AI tool that runs --now in a terminal looks like you, and must not see the line forever), or in a send-back as
  // sent. A stop shown only to you marks nothing.
  const reached = (said) => { for (const [s, k, line] of ctx.once) if (said.includes(line)) s[k] ??= ctx.today; };
  if (!hook) return void (reached(owner), save(files, state), console.log(owner), (process.exitCode = ctx.issues.length ? 1 : 0));
  // Sent back once per set of numbers in a session; a clean run forgets it, so a later break goes back again.
  const numbers = (issues) => createHash("sha256").update(issues.join("\n")).digest("hex"), session = input.session_id ?? "none";
  const sent = state.sentBack?.constructor === Object ? state.sentBack : {};
  const back = ctx.issues.length > 0 && !input.stop_hook_active && reply === "claim" && sent[session] !== numbers(ctx.issues), said = back ? sendBack(results, ctx, at) : "";
  const outcome = !ctx.issues.length ? "" : back ? "Your AI was sent back once to fix this or tell you plainly what isn't done."
    : input.stop_hook_active ? "Your AI was already sent back once this turn, so it stops here."
    : reply === "checkpoint" ? "Your AI stopped for your answer, so it wasn't sent back."
    : "Same result as when your AI was last sent back, so it stops here.";
  // Kept without the lines said once, which the next stop no longer has, so the same failure isn't sent back twice.
  if (!ctx.issues.length) delete state.sentBack;
  else if (back) reached(said), (state.sentBack = { ...Object.fromEntries(Object.entries(sent).slice(-4)), [session]: numbers(ctx.issues.filter((i) => !ctx.once.some(([s, k, l]) => l === i && s[k]))) });
  save(files, state);
  const out = { systemMessage: cap([owner, outcome].filter(Boolean).join("\n")) };
  if (back) out.hookSpecificOutput = { hookEventName: "Stop", additionalContext: said };
  emit(out);
}

// Run as a script, not imported (the tests import it). Compared as real paths: macOS's temp folder is a symlink.
const isMain = () => { try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; } };
if (isMain() && process.argv[2] === "--watch") {
  // A stop's watcher: told each check as it runs; once this script is gone (stopped, or killed outright), its input ends,
  // even before the script is reaped, and it stops the check that was running.
  let now = [0];
  createInterface({ input: process.stdin }).on("line", (l) => (now = l.split(" ").map(Number))).on("close", async () => {
    const [pid, from, ...known] = now;
    if (pid) await (win ? orphans(pid, from - 2000, Date.now()) : stop(pid, true, undefined, known));
    process.exit();
  });
} else if (isMain()) {
  main().catch((e) => {
    const say = `${MARK} couldn't run, so nothing was checked: ${e?.message ?? e}`;
    if (process.argv.includes("--now") || process.stdin.isTTY) { console.error(say); process.exitCode = 2; } else emit({ systemMessage: say });
  });
}
