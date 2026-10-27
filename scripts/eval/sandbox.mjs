// Every claude the eval starts (each arm, each judge) runs inside a macOS sandbox that can't read the places that
// would tell it the answer: the real project, the cases, the records, every other copy, and the session records of
// other Claude Code sessions. It can't connect to a Unix socket in those places either, so it can't ask a process
// outside the sandbox (another Claude Code session) to read for it. Its own copy, its scratch folder, its own
// session folder and the rest of the machine (tools, caches, the network) stay open, the same for both arms. The
// owner's files every session reads (Off the Mode's ~/.offthemode/ME.md, Claude Code's ~/.claude/CLAUDE.md) stay
// readable but can't be written: an arm's save once wrote the owner's real ME.md, which every later arm then read.
// No folder above a closed place may be renamed (mv ~/.claude ~/.c2 would move every place under it out from under
// its rule) or cloned whole (clonefile(2) on a folder copies the closed places inside it to a path no rule covers;
// cp -c and ditto --clone go file by file and are refused anyway), and an arm can signal only processes in its own sandbox: an arm freeing a port must not stop the
// Off the Mode server another arm is using, or the other arm's app.
//
// Why sandbox-exec around the whole claude process, and not Claude Code's own sandbox (checked on 2.1.280 and its
// docs, code.claude.com/docs/en/sandboxing): Claude Code's sandbox (sandbox.filesystem.denyRead) wraps shell
// commands only. Read, Grep and the other file tools follow permission rules instead, hooks and local MCP servers run
// with full access, Claude can retry a command outside it (dangerouslyDisableSandbox) unless strict mode is on, and
// it sends the network through a proxy that would change what the arms can do. sandbox-exec applies one Seatbelt
// profile (the engine Claude Code's own sandbox uses on macOS) to the claude process; macOS hands it on to every
// process it starts (shells, git, python, agents' tools, hooks) and none of them can lift it. Tested on macOS 26.6:
// cat, git -C, find, python open, symlinks, hard links, file clones, ../ paths, other letter case and osascript's
// do shell script are all refused. One cost: a sandbox can't start inside another, so Claude Code's own sandbox is
// turned off in the arms (see armSettings in eval.mjs).
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, mkdirSync, readdirSync, realpathSync, rmSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { homedir } from "node:os";

export const SANDBOX_EXEC = "/usr/bin/sandbox-exec";
export const canSandbox = () => process.platform === "darwin" && existsSync(SANDBOX_EXEC);

export const within = (a, b) => a === b || a.startsWith(b + "/");

// The path as the sandbox sees it: links resolved (/tmp is /private/tmp), letter case as on disk. A path that doesn't
// exist yet keeps its missing part after its nearest existing folder is resolved.
export function realish(path) {
  let p = resolve(path);
  const rest = [];
  while (!existsSync(p) && dirname(p) !== p) { rest.unshift(basename(p)); p = dirname(p); }
  return join(realpathSync.native(p), ...rest);
}

// Claude Code names a session's folder after the folder it starts in.
export const sessionFolderName = (path) => path.replace(/[^a-zA-Z0-9]/g, "-");

const quote = (p) => {
  if (/["\\\0-\x1f]/.test(p)) throw new Error(`the sandbox can't name the path ${JSON.stringify(p)}`);
  return `"${p}"`;
};

// The fence for one claude process. where: the eval's places (real paths are taken here): repo (the real project),
// cases, records, copies (the folder holding every copy), projects (Claude Code's session folders), fileHistory
// (its copies of files other sessions edited), alsoDeny ([name, path] pairs), shared ([name, path] pairs read but
// never written). own: the folder holding its copy and
// scratch folder. sid: its session id, so it keeps its own file history. bin: the claude it runs.
export function fenceFor(where, { own, sid, bin }) {
  const projects = realish(where.projects), history = realish(where.fileHistory);
  const deny = [where.repo, where.cases, where.records, where.copies, projects, history, ...where.alsoDeny.map(([, p]) => p)].map(realish);
  const ownPlace = realish(own), sessions = join(projects, sessionFolderName(ownPlace));
  const allow = [ownPlace, ...(sid ? [join(history, sid)] : [])];
  // The claude binary may sit in a denied folder (the desktop app keeps one in its support folder): only its own
  // install folder opens, read-only.
  const binDir = bin && dirname(realish(bin));
  const readOnly = binDir && deny.some((d) => within(binDir, d)) ? [binDir] : [];
  const shared = (where.shared ?? []).map(([, p]) => realish(p));
  const home = realish(where.home ?? homedir()), above = new Set(), clonable = new Set();
  for (const p of [...deny, ...shared]) {
    for (let d = dirname(p); within(d, home) && d !== home; d = dirname(d)) above.add(d);
    for (let d = dirname(p); ; d = dirname(d)) { clonable.add(d); if (d === dirname(d)) break; }
  }
  return { deny: [...new Set(deny)], allow, sessions, readOnly, shared, above: [...above], aboveClone: [...clonable] };
}

// The Seatbelt profile for a fence. In a profile the last rule that matches wins, so the openings come after the
// denials. Folders between a denied place and an opening inside it may be looked at (stat), never listed: without
// that, a shell can't even cd into its own copy.
export function profile({ deny, allow, sessions, readOnly = [], shared = [], above = [], aboveClone = [] }) {
  const opened = [...allow, sessions, ...readOnly];
  const between = new Set();
  for (const a of opened) for (const d of deny.filter((x) => within(a, x) && a !== x)) {
    for (let p = dirname(a); within(p, d); p = dirname(p)) between.add(p);
  }
  // A denied place inside an opening stays denied.
  const inner = deny.filter((d) => opened.some((a) => within(d, a) && d !== a));
  const sub = (ps) => ps.map((p) => `(subpath ${quote(p)})`).join(" ");
  const sockets = (ps) => ps.map((p) => `(remote unix-socket (subpath ${quote(p)}))`).join(" ");
  return [
    "(version 1)",
    "(allow default)",
    // file-clone is its own operation, not part of file-write*: each rule names it so a clone follows the same lines.
    `(deny file-read* file-write* file-clone ${sub(deny)})`,
    ...(between.size ? [`(allow file-read-metadata ${[...between].map((p) => `(literal ${quote(p)})`).join(" ")})`] : []),
    `(allow file-read* file-write* file-clone ${sub(allow)})`,
    // Its own session folder and the ones its agents' worktrees get (the same name with more after a dash).
    `(allow file-read* file-write* file-clone (literal ${quote(sessions)}) (prefix ${quote(sessions + "-")}))`,
    ...(readOnly.length ? [`(allow file-read* ${sub(readOnly)})`] : []),
    ...(inner.length ? [`(deny file-read* file-write* file-clone ${sub(inner)})`] : []),
    // Last, so no opening above can lift them.
    ...(shared.length ? [`(deny file-write* ${sub(shared)})`] : []),
    ...(above.length ? [`(deny file-write-unlink ${above.map((p) => `(literal ${quote(p)})`).join(" ")})`] : []),
    // Cloning a shared place or a folder above any closed place, up to / (a clone of the home folder holds them all).
    `(deny file-clone ${sub(shared)}${aboveClone.map((p) => ` (literal ${quote(p)})`).join("")})`,
    // Signals reach only its own processes; another sandbox, even with the same rules, is out of reach (tested).
    "(deny signal)",
    "(allow signal (target same-sandbox))",
    // Connecting to a Unix socket is not a file read: a process outside the sandbox listening in a denied place
    // (another Claude Code session's messaging socket, a server another session left running) would still answer,
    // and could read for the arm. So the denied places are closed to connections too. macOS matches the socket's
    // real path, so a link to it or a /tmp spelling is refused as well (tested). Its own place stays open: its own
    // messaging socket sits in its scratch folder (CLAUDE_CODE_TMPDIR).
    `(deny network-outbound ${sockets(deny)})`,
    `(allow network-outbound ${sockets(allow)})`,
    ...(inner.length ? [`(deny network-outbound ${sockets(inner)})`] : []),
    // Asking another app to run something (osascript telling Terminal to do a script) would run it outside the
    // sandbox. Claude Code's own sandbox refuses this too unless allowAppleEvents is set.
    "(deny appleevent-send)",
  ].join("\n") + "\n";
}

// The command and arguments that run cmd inside the profile.
export const sandboxed = (prof, cmd, args) => [SANDBOX_EXEC, ["-p", prof, cmd, ...args]];

// The proof, for no tokens: the same wrapper runs a shell that tries to read each place with cat, git -C (the
// folder's history, and a grep through its files), find and python, and to write where the session must write.
// Each probe counts as a read only when it got content: cat and python read a file (or python lists the folder),
// git prints the latest commit or finds a line, find lists an entry (find given a link it can't follow lists
// nothing and still exits 0; a folder between a denied place and an opening can be entered, but not listed).
// A socket place is tried by connecting to a Unix socket the probe serves from outside the sandbox.
// Each probe runs once outside the sandbox first: only probes that work there count, so a place that is denied must
// fail every one of them inside, and an open one must pass every one. Write probes (open places only) leave nothing.
// A shared place (read, never written) gets the write probe too, which must fail while every read passes.
// A process place is tried with kill -0: on a process started outside (dir is its pid), and on one the probe starts.
// A rename place (dir is a folder above a closed place) is tried by renaming it and back, a clone place by cloning
// it whole into the probe's scratch folder, inside the sandbox only. Either would move or copy a real folder if its
// rule failed, so only test:eval tries them, on a made-up home (where.home); the rules name the owner's folders the
// same way.
// mode: r (read), w (read and write), s (connect to the socket at dir), k (signal the process dir, or its own when
// dir is "own"), m (rename dir, inside only), c (clone dir whole into $TMPDIR, inside only).
const PROBES = `
while [ $# -gt 0 ]; do
  id=$1 dir=$2 file=$3 mode=$4; shift 4
  if [ "$mode" = s ]; then python3 -I -c 'import socket,sys; socket.socket(socket.AF_UNIX).connect(sys.argv[1])' "$dir" >/dev/null 2>&1; echo "$id connect $?"; continue; fi
  if [ "$mode" = k ]; then if [ "$dir" = own ]; then sleep 30 & k=$!; else k=$dir; fi; kill -0 "$k" 2>/dev/null; echo "$id signal $?"; [ "$dir" = own ] && kill "$k" 2>/dev/null; continue; fi
  if [ "$mode" = c ]; then if [ -n "$EVAL_PROBE_INSIDE" ]; then t="$TMPDIR/.eval-clone-$$"; python3 -I -c 'import ctypes,sys; sys.exit(ctypes.CDLL(None).clonefile(sys.argv[1].encode(), sys.argv[2].encode(), 0) != 0)' "$dir" "$t" 2>/dev/null; c=$?; rm -rf "$t"; echo "$id clone $c"; else [ -d "$dir" ]; echo "$id clone $?"; fi; continue; fi
  if [ "$mode" = m ]; then if [ -n "$EVAL_PROBE_INSIDE" ]; then mv "$dir" "$dir.eval-probe" 2>/dev/null && { mv "$dir.eval-probe" "$dir"; echo "$id rename 0"; } || echo "$id rename 1"; else [ -d "$dir" ] && [ -w "$(dirname "$dir")" ]; echo "$id rename $?"; fi; continue; fi
  if [ "$mode" = w ]; then mkdir -p "$dir" && f="$dir/.eval-probe-$$" && echo x > "$f" && rm -f "$f"; echo "$id write $?"; fi
  if [ -n "$file" ]; then cat -- "$file" >/dev/null 2>&1; echo "$id cat $?"; fi
  git -C "$dir" log -1 --format=%H >/dev/null 2>&1; echo "$id git-log $?"
  git -C "$dir" grep --no-index --max-depth 1 -q -e '' -- . >/dev/null 2>&1; echo "$id git-grep $?"
  [ "$(find -H "$dir" -mindepth 1 -maxdepth 1 2>/dev/null | head -1)" ]; echo "$id find $?"
  python3 -I -c 'import os,sys; p=sys.argv[1]; open(p,"rb").read() if os.path.isfile(p) else os.listdir(p)' "\${file:-$dir}" >/dev/null 2>&1; echo "$id python $?"
done
`;

function runShell(cmd, args, { cwd, env }) {
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (d) => (out += d));
    child.on("error", (e) => done({ out, error: String(e) }));
    child.on("close", (code) => done({ out, code }));
  });
}

// What the probe tries for one fence: a real example of each kind of denied place (a folder that doesn't exist
// isn't tried), and the places the session must keep: its copy, its scratch folder and its session folder (the
// last two written to). others: other copies to try, this run's first. socket: a path in a denied place where the
// probe serves a Unix socket; connecting to it must fail, and connecting to one in its scratch folder must work.
export function probePlaces(where, fence, { copy, tmp, others = [], caseDir, records, repoSessions, socket }) {
  const denied = [
    ["the real project", where.repo], ["the case", caseDir ?? where.cases], ["the run's records", records ?? where.records],
    ...others.map((o) => ["another copy", o]), ["Claude Code's session folders (listing)", where.projects],
    ...(repoSessions ? [["the real project's sessions", repoSessions]] : []),
    ["other sessions' file history", where.fileHistory], ...where.alsoDeny,
  ].filter(([, p]) => p && existsSync(p))
    .map(([name, dir]) => ({ name: `${name} ${dir}`, dir, ...(statSync(dir).isFile() ? { file: dir } : {}), expect: "denied" }));
  const open = [
    { name: `its own copy ${copy}`, dir: copy, expect: "open" },
    { name: `its scratch folder ${tmp}`, dir: tmp, expect: "open", write: true },
    { name: "its own session folder", dir: join(dirname(fence.sessions), sessionFolderName(realish(copy))), expect: "open", write: true },
    { name: "a socket in its scratch folder", dir: join(tmp, "probe.sock"), expect: "open", socket: true },
  ];
  const sockets = socket ? [{ name: `a socket served from outside, in a denied place ${socket}`, dir: socket, expect: "denied", socket: true }] : [];
  const shared = (where.shared ?? []).filter(([, p]) => existsSync(p) && statSync(p).isDirectory())
    .map(([name, dir]) => ({ name: `${name} ${dir}`, dir, expect: "read-only", write: true }));
  const renames = (where.home ? fence.above ?? [] : []).filter((p) => existsSync(p)).map((dir) => ({ name: `renaming a folder above a closed place ${dir}`, dir, expect: "denied", rename: true }));
  const clones = (where.home ? [...(fence.aboveClone ?? []).filter((p) => within(p, realish(where.home))), ...fence.deny] : [])
    .filter((p) => existsSync(p) && statSync(p).isDirectory()).map((dir) => ({ name: `cloning a closed place or a folder above one ${dir}`, dir, expect: "denied", clone: true }));
  const signals = [{ name: "a process started outside the sandbox", dir: "", expect: "denied", signal: true },
    { name: "a process it starts itself", dir: "own", expect: "open", signal: true }];
  return [...denied, ...sockets, ...shared, ...renames, ...clones, ...signals, ...open];
}

// A small file inside a folder, for cat and python to open (searched outside the sandbox, two levels deep).
export function sampleFile(dir, depth = 2) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return ""; }
  const files = entries.filter((e) => e.isFile() && !e.name.startsWith(".DS_Store")).map((e) => join(dir, e.name));
  if (files.length) return files.sort()[0];
  for (const e of entries.filter((x) => x.isDirectory() && depth > 1)) {
    const f = sampleFile(join(dir, e.name), depth - 1);
    if (f) return f;
  }
  return "";
}

// A Unix socket served from outside the sandbox while the probe runs: it takes a connection and closes it. null
// when it can't be served (a path over the 104-byte limit, say): its probe then counts as not checked.
function serve(path) {
  return new Promise((done) => {
    try { mkdirSync(dirname(path), { recursive: true }); rmSync(path, { force: true }); } catch { return done(null); }
    const server = createServer((c) => c.destroy());
    server.on("error", () => done(null));
    server.listen(path, () => done(server));
  });
}

// places: [{ name, dir, file?, expect: "denied" | "open" | "read-only", write?, socket?, signal?, rename?, clone? }]. Returns each place with its probes'
// results (outside → inside exit codes) and whether it held; ok is true when every place held and each had a probe
// that counted.
export async function probe(prof, places, { cwd, env }) {
  // A process for the outside-signal probe, stopped afterwards.
  const target = places.some((p) => p.signal && p.dir !== "own") ? spawn("/bin/sleep", ["600"], { stdio: "ignore" }) : null;
  places = places.map((p) => (p.signal && p.dir !== "own" ? { ...p, dir: String(target.pid) } : p));
  const mode = (p) => (p.socket ? "s" : p.signal ? "k" : p.rename ? "m" : p.clone ? "c" : p.write ? "w" : "r");
  const args = places.flatMap((p, i) => [`p${i}`, p.dir, p.socket || p.signal || p.rename || p.clone ? "" : p.file ?? sampleFile(p.dir), mode(p)]);
  const served = await Promise.all(places.filter((p) => p.socket).map(async (p) => [p.dir, await serve(p.dir)]));
  let outside, inside;
  try {
    outside = await runShell("/bin/sh", ["-c", PROBES, "probe", ...args], { cwd, env });
    const [cmd, wrapped] = sandboxed(prof, "/bin/sh", ["-c", PROBES, "probe", ...args]);
    inside = await runShell(cmd, wrapped, { cwd, env: { ...env, EVAL_PROBE_INSIDE: "1" } });
  } finally {
    for (const [path, server] of served) { server?.close(); rmSync(path, { force: true }); }
    target?.kill();
  }
  const codes = (r) => new Map(r.out.split("\n").filter(Boolean).map((l) => l.split(" ")).map(([id, what, code]) => [`${id} ${what}`, Number(code)]));
  const [out, ins] = [codes(outside), codes(inside)];
  const results = places.map((p, i) => {
    const tried = [...out.keys()].filter((k) => k.startsWith(`p${i} `)).map((k) => ({ probe: k.split(" ")[1], outside: out.get(k), inside: ins.get(k) }));
    const counted = tried.filter((t) => t.outside === 0);
    const refused = (t) => (p.expect === "denied" || (p.expect === "read-only" && t.probe === "write"));
    const held = counted.length > 0 && counted.every((t) => (refused(t) ? t.inside !== 0 : t.inside === 0))
      && (p.expect !== "read-only" || counted.some((t) => t.probe === "write"));
    return { ...p, tried, counted: counted.length, held };
  });
  return { ok: !inside.error && results.every((r) => r.held), error: inside.error ?? null, results };
}

// One line per place: what was tried, and what happened inside the sandbox.
export function probeLines(r) {
  const lines = r.results.map((p) => {
    const shown = p.tried.map((t) => `${t.probe} ${t.outside !== 0 ? "n/a" : t.inside === 0 ? "read" : "refused"}`.replace(/^(write|connect|signal|rename|clone) read$/, "$1 ok")).join(", ");
    const wrote = p.tried.some((t) => t.probe === "write" && t.outside === 0 && t.inside === 0);
    const verdict = !p.counted ? "NOT CHECKED (no probe works even outside)" : p.held ? (p.expect === "open" ? "open" : p.expect)
      : p.expect === "denied" ? "LEAK" : p.expect === "read-only" && wrote ? "WRITABLE" : "BLOCKED";
    return `${verdict.padEnd(7)} ${p.name}: ${shown}`;
  });
  return r.error ? [`the sandbox could not start: ${r.error}`, ...lines] : lines;
}
