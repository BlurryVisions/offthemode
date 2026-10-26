// What each arm changed, as diffs a judge can read without knowing who built which, and the three blind judges.
import { execFileSync, spawn } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { git } from "./run.mjs";

// Everything that differs from the start, committed or not, new files included, through a scratch index so the
// copy's own index stays as the arm left it. .gitignore and .git/info/exclude keep fixtures and installs out.
function withScratchIndex(dir, fn) {
  const env = { ...process.env, GIT_INDEX_FILE: join(dir, ".git", "eval-index") };
  const run = (...args) => execFileSync("git", args, { cwd: dir, env, encoding: "utf8", maxBuffer: 1 << 30 });
  try {
    run("read-tree", "HEAD");
    run("add", "-A");
    return fn(run);
  } finally {
    rmSync(env.GIT_INDEX_FILE, { force: true });
  }
}

// Claude Code keeps an agent's own worktree inside the project; work left there never reached the copy itself.
const WORKTREES = ":(exclude).claude/worktrees";

export function changedFiles(dir, base) {
  return withScratchIndex(dir, (run) => run("diff", "--cached", "--name-only", base, "--", ".", WORKTREES).split("\n").filter(Boolean).length);
}

// Off the Mode's own notes would give the arm away: .offthemode/ stays out, and its ids and name are masked.
// What a judge could still use to guess is counted, and the report shows it.
const NOTES = ":(exclude).offthemode";
const MASKS = [
  [/\bD-\d{2,}\b/g, "(decision)"], [/\bR-\d{2,}\b/g, "(risk)"], [/\bF\d+\.\d+\b/g, "(item)"],
  [/\.offthemode\b\/?[\w./-]*/g, "(notes)"], [/\b(CHECKLIST|STATE|DECISIONS|PRODUCT|GLOSSARY|RULES|REASSESS)\.md\b|\bCHECKLIST\b/g, "(notes)"],
  [/off[\s_-]*the[\s_-]*mode/gi, "(method)"],
];
function mask(diff) {
  let marks = 0;
  const text = MASKS.reduce((d, [re, to]) => d.replace(re, () => { marks++; return to; }), diff);
  return { text, marks };
}

export function writeDiffs(arm, changesDir) {
  const { dir, base, letter, logDir } = arm;
  return withScratchIndex(dir, (run) => {
    const diff = (...paths) => run("diff", "--cached", "--no-color", "--no-ext-diff", base, "--", ".", WORKTREES, ...paths);
    writeFileSync(join(logDir, "full.diff"), diff());
    const blind = mask(diff(NOTES));
    writeFileSync(join(changesDir, `${letter}.diff`), blind.text);
    const stat = run("diff", "--cached", "--numstat", base, "--", ".", WORKTREES, NOTES).split("\n").filter(Boolean).map((l) => l.split("\t"));
    return {
      files: stat.length,
      added: stat.reduce((s, [a]) => s + (Number(a) || 0), 0),
      removed: stat.reduce((s, [, r]) => s + (Number(r) || 0), 0),
      commits: Number(git(dir, "rev-list", "--count", `${base}..HEAD`)),
      uncommitted: git(dir, "status", "--porcelain").split("\n").filter(Boolean).length,
      marks: blind.marks,
      unmerged: git(dir, "branch", "--no-merged", "HEAD", "--format=%(refname:short)").split("\n").filter(Boolean),
    };
  });
}

// Random letters in random order, so neither arm always reads first or under the earlier letter.
const LETTERS = "FGHJKLMNPQRSTVWXZ";
export function pickLetters(n) {
  return [...LETTERS].map((l) => [Math.random(), l]).sort((a, b) => a[0] - b[0]).slice(0, n).map(([, l]) => l);
}

const LENSES = [
  { key: "owner", name: "the owner's experience", text: `Your lens: the owner's experience. Does each version solve what the owner asked for, in their own words above? Would the owner, who may not be an engineer, find the result clear and simple? Read the words people see and any screen changes closely; count the new things on screen.` },
  { key: "correctness", name: "correctness", text: `Your lens: correctness. Find real bugs and regressions each version introduces: broken flows, wrong or stale data, races, edge cases (empty input, reload, large data), accessibility regressions. Verify a suspected bug against the starting code before listing it. Rank by severity.` },
  { key: "fit", name: "engineering fit", text: `Your lens: engineering fit for this project. Is each change the right size for its value? Too much code, needless machinery, hard to maintain, or too little (missing tests for the logic it adds)? Judge the clarity of the code and its tests.` },
];

const schema = (letters) => ({
  type: "object", required: ["versions", "ranking", "verdict"],
  properties: {
    versions: { type: "object", required: letters, properties: Object.fromEntries(letters.map((l) => [l, {
      type: "object", required: ["score", "good", "problems"],
      properties: { score: { type: "number", description: "1-10 on your lens" }, good: { type: "array", items: { type: "string" } },
        problems: { type: "array", items: { type: "string" }, description: "each with file:line in the diff or code, most serious first" } },
    }])) },
    ranking: { type: "array", items: { type: "string" }, description: "best first" },
    verdict: { type: "string", description: "three sentences at most" },
  },
});

function brief(c, arms, changesDir, lens) {
  const letters = arms.map((a) => a.letter);
  const replies = c.replyTexts.length
    ? `\nAfter the first answer, the owner replied (each reply sent once, in order, whatever the builder had said):\n${c.replyTexts.map((r) => `"""\n${r}\n"""`).join("\n")}\n` : "";
  return `${c.about ?? ""}

The owner asked for this, in their own words:
"""
${c.askText}
"""
${replies}${c.goals ? `\nWhat the owner needs, in short: ${c.goals}\n` : ""}
${letters.length} builders answered this from the same starting code, each in its own copy. Their changes are diffs: ${letters.map((l) => join(changesDir, `${l}.diff`)).join(", ")}. The project's own check after each: ${arms.map((a) => `${a.letter} ${a.check?.code === 0 ? "passed" : "failed"}`).join(", ")}. Your working folder is the starting code before any change: read files there for context (search first, open only what you need). Some builders may have stopped to ask the owner; judge each on what it delivered. Ignore placeholders like (decision), (risk), (item), (notes) or (method) in the diffs. Do not try to find out who built which, and don't edit anything.

${lens.text}

Score ${letters.join(", ")} 1-10 on your lens, list what each does well and its problems, rank them, and give a verdict of at most three sentences.`;
}

function judgeOnce(c, arms, { changesDir, baseDir, settings, env }, lens) {
  const args = ["-p", brief(c, arms, changesDir, lens), "--output-format", "json", "--json-schema", JSON.stringify(schema(arms.map((a) => a.letter))),
    "--model", c.model, "--tools", "Read,Grep,Glob", "--add-dir", changesDir, "--settings", JSON.stringify(settings), "--permission-mode", "default",
    "--permission-prompts", "none", "--strict-mcp-config"];
  return new Promise((resolve) => {
    const child = spawn("claude", args, { cwd: baseDir, env, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.on("error", (e) => resolve({ lens: lens.key, name: lens.name, error: `the judge could not start: ${e.message}` }));
    let out = "", err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", (code) => {
      try {
        const r = JSON.parse(out);
        const verdict = r.structured_output ?? JSON.parse(r.result);
        resolve({ lens: lens.key, name: lens.name, sid: r.session_id, ...verdict });
      } catch {
        resolve({ lens: lens.key, name: lens.name, error: `judge exited ${code}: ${(err || out).slice(-400)}` });
      }
    });
  });
}

const mean = (xs) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

function combine(lens, runs, arms) {
  const good = runs.filter((r) => !r.error), sids = runs.map((r) => r.sid).filter(Boolean);
  if (!good.length) return { lens: lens.key, name: lens.name, error: runs[0]?.error, sids };
  const scores = Object.fromEntries(arms.map((a) => [a.letter, mean(good.map((r) => r.versions?.[a.letter]?.score).filter(Number.isFinite))]));
  const ranking = Object.keys(scores).sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const tie = ranking.length > 1 && scores[ranking[0]] === scores[ranking[1]];
  const agree = !tie && good.length === runs.length && new Set(good.map((r) => r.ranking?.[0])).size === 1;
  return { lens: lens.key, name: lens.name, scores, ranking, tie, agree, verdict: good[0].verdict, sids };
}

// Models favour whichever version they read first, so each lens judges twice, once in each order (the Verification
// Loop guide); a lens's score is the mean of both, and the report says when the two orders pick different winners.
// The judges' full findings go to the run's records, never next to the diffs, where a later judge could read them.
export async function judge(c, arms, where) {
  const orders = [arms, [...arms].reverse()];
  const runs = await Promise.all(LENSES.flatMap((lens) => orders.map((order) => judgeOnce(c, order, where, lens))));
  writeFileSync(join(where.recordDir, "judges.json"), JSON.stringify(runs, null, 2));
  return LENSES.map((lens) => combine(lens, runs.filter((r) => r.lens === lens.key), arms));
}
