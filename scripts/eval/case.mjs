// A case: one real ask from a real project, replayed through plain Claude Code and through Off the Mode.
// Cases live outside this repo because they hold an owner's words and data: a folder with case.json and the files
// it names. Paths in case.json are relative to that folder unless absolute.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, isAbsolute, dirname, basename } from "node:path";
import { homedir } from "node:os";
import { gitOr } from "./run.mjs";

export const CASES = process.env.OTM_EVAL_CASES ?? join(homedir(), ".offthemode", "evals");
export const ARM_NAMES = { plain: "Plain Claude Code", otm: "Off the Mode" };

export class CaseError extends Error {}

// What a case's own commands (install, check, score, plainSetup) get to find their way.
export const caseEnv = (c, copy) => ({ EVAL_CASE: c.dir, EVAL_REPO: c.repo, EVAL_START: c.commit, EVAL_COPY: copy });

// Every field case.json may hold, its kind, and what it means.
const FIELDS = {
  repo: ["string", "the project's git folder"],
  commit: ["string", "the commit the owner's ask was made at; later commits are hidden from both arms"],
  ask: ["string", "file holding the owner's first message, word for word"],
  replies: ["strings", "files holding the owner's logged replies, each sent once, in order, after the first turn"],
  files: ["map", "copy path → source file or folder, put into each copy and kept out of git (fixtures, data)"],
  copy: ["strings", "paths copied from the project's folder as they are, such as node_modules"],
  install: ["string", "command run in each copy after copying, such as npm ci (case commands get EVAL_CASE, EVAL_REPO, EVAL_START, EVAL_COPY)"],
  check: ["string", "the project's check command, run before and after"],
  score: ["string", "the case's own scorer command, run in each copy after its turns and at the start"],
  plainSetup: ["string", "command run in the plain copy after Off the Mode is removed, its changes committed"],
  rules: ["string", "file whose ## sections replace the same sections of RULES.md in the Off the Mode copy"],
  about: ["string", "a few sentences for the judges: what the product is and who uses it"],
  goals: ["string", "for the judges: what the owner needs, in short"],
  arms: ["strings", "which arms to run: plain, otm (default both)"],
  model: ["string", "model for both arms and the judges"],
  settings: ["object", "Claude Code settings for both arms, such as ultracode"],
  mcp: ["string", "the Off the Mode server the otm arm uses (a local one tests a branch)"],
  disallow: ["strings", "tools denied in both arms, besides git push"],
  quietMinutes: ["number", "minutes with no output and no agent file changing that end a turn"],
  stopAt: ["number", "stop an arm once it has read this many million tokens (off when absent)"],
  judge: ["boolean", "run the three blind judges (default true)"],
};

const DEFAULTS = {
  replies: [], files: {}, copy: [], arms: ["plain", "otm"], model: "claude-opus-5-5", settings: { ultracode: true },
  mcp: "https://offthemode.vercel.app/mcp", disallow: [], quietMinutes: 3, judge: true,
};

const SAY = { strings: "a list of text values", map: "an object of text values", object: "an object", array: "a list" };

function kind(value) {
  if (Array.isArray(value)) return value.every((v) => typeof v === "string") ? "strings" : "array";
  if (value && typeof value === "object") return Object.values(value).every((v) => typeof v === "string") ? "map" : "object";
  return typeof value;
}

function parse(raw, file) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new CaseError(`${file}: not a JSON object`);
  for (const [key, value] of Object.entries(raw)) {
    const field = FIELDS[key];
    if (!field) throw new CaseError(`${file}: unknown field "${key}" (known: ${Object.keys(FIELDS).join(", ")})`);
    const want = field[0], got = kind(value);
    const fits = got === want || (want === "object" && got === "map") || (want === "map" && got === "object" && !Object.keys(value).length);
    if (!fits) throw new CaseError(`${file}: "${key}" should be ${SAY[want] ?? `a ${want}`} (${field[1]}), not ${SAY[got] ?? `a ${got}`}`);
  }
  for (const key of ["repo", "commit", "ask", "check"]) {
    if (!raw[key]) throw new CaseError(`${file}: "${key}" is required (${FIELDS[key][1]})`);
  }
  const bad = (raw.arms ?? []).filter((a) => !ARM_NAMES[a]);
  if (bad.length) throw new CaseError(`${file}: unknown arm ${bad.join(", ")} (known: ${Object.keys(ARM_NAMES).join(", ")})`);
  return { ...DEFAULTS, ...raw };
}

function locate(arg) {
  const found = [resolve(arg), join(CASES, arg)].find((p) => existsSync(p));
  if (!found) throw new CaseError(`no case at ${resolve(arg)} or ${join(CASES, arg)}`);
  return statSync(found).isDirectory() ? join(found, "case.json") : found;
}

export function loadCase(arg) {
  const file = locate(arg);
  const dir = dirname(file);
  let raw;
  try { raw = JSON.parse(readFileSync(file, "utf8")); } catch (e) { throw new CaseError(`${file}: ${e.message}`); }
  const c = parse(raw, file);
  const at = (p) => (isAbsolute(p) ? p : join(dir, p));
  const text = (p) => {
    if (!existsSync(at(p))) throw new CaseError(`${file}: no file ${at(p)}`);
    return readFileSync(at(p), "utf8").trim();
  };
  const repo = at(c.repo);
  if (!gitOr(repo, "rev-parse", "--verify", `${c.commit}^{commit}`)) throw new CaseError(`${file}: ${repo} has no commit ${c.commit}`);
  const files = Object.fromEntries(Object.entries(c.files).map(([to, from]) => {
    if (isAbsolute(to) || to.split("/").includes("..")) throw new CaseError(`${file}: files: "${to}" must stay inside the copy`);
    if (!existsSync(at(from))) throw new CaseError(`${file}: files: no ${at(from)}`);
    return [to, at(from)];
  }));
  return {
    ...c, name: basename(dir), dir, repo, files, askText: text(c.ask), replyTexts: c.replies.map(text),
    rulesText: c.rules ? text(c.rules) : null,
  };
}
