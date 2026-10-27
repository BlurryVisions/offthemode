// The smoke case: a tiny throwaway project and a two-turn ask, to prove the eval runs end to end for well under
// 1M tokens. It also shows the case format. Its project has Off the Mode set up (so the plain copy must lose it)
// and a later commit holding the owner's real build (so both copies must lose that).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { git } from "./run.mjs";
import { CaseError } from "./case.mjs";

const PROJECT = {
  "package.json": `{ "name": "smoke-app", "private": true, "type": "module", "scripts": { "test": "node --test" } }\n`,
  "text.js": `// Small text helpers for the app's labels.\nexport function title(text) {\n  return text.replace(/\\b\\w/g, (c) => c.toUpperCase());\n}\n`,
  "text.test.js": `import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport { title } from "./text.js";\n\ntest("title capitalises each word", () => assert.equal(title("hello world"), "Hello World"));\n`,
  "CLAUDE.md": `Keep functions small, each with a test.\n\nRead @.offthemode/RULES.md and @.offthemode/STATE.md before any change.\n`,
  ".offthemode/RULES.md": `RULES · smoke-app\n\n## How to work\n- One concern per change; run \`npm test\` before you finish.\n- Read STATE.md when you start and keep its Now line current.\n\n## Commands\ncheck \`npm test\`\n`,
  ".offthemode/STATE.md": `STATE\n\n## Now\nText helpers: title.\n`,
};
const LATER = { "text.js": `${PROJECT["text.js"]}\nexport const shout = (text) => (text ? text.toUpperCase() + "!" : "");\n` };

const CASE_FILES = {
  "ask.md": `Add a shout(text) helper to text.js: it returns the text in capitals with one exclamation mark at the end, so shout("hi") gives "HI!". Add a test.\n`,
  "reply-1.md": `Thanks. shout("") should give an empty string, not "!".\n`,
  "score.mjs": `// The smoke case's own scorer, run in a copy's folder: how many of the owner's examples does shout() get right?
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const { shout } = await import(pathToFileURL(join(process.cwd(), "text.js")).href).catch(() => ({}));
const examples = [["hi", "HI!"], ["Hello there", "HELLO THERE!"], ["", ""]];
const right = typeof shout === "function" ? examples.filter(([input, want]) => shout(input) === want).length : 0;
console.log(\`shout: \${right} of \${examples.length} owner examples right\`);
`,
};

function write(root, files) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
}

export function makeSmoke(casesDir) {
  const dir = join(casesDir, "smoke"), repo = join(dir, "project");
  if (existsSync(dir)) throw new CaseError(`the smoke case is already at ${dir}; delete that folder to make it again`);
  write(repo, PROJECT);
  git(repo, "init", "-q", "-b", "main");
  git(repo, "config", "user.name", "Smoke");
  git(repo, "config", "user.email", "smoke@example.invalid");
  git(repo, "add", "-A");
  git(repo, "commit", "-q", "-m", "Text helpers");
  const start = git(repo, "rev-parse", "HEAD");
  write(repo, LATER);
  git(repo, "commit", "-q", "-am", "shout");
  write(dir, CASE_FILES);
  const c = {
    repo: "project", commit: start, ask: "ask.md", replies: ["reply-1.md"], check: "npm test", score: `node "$EVAL_CASE/score.mjs"`,
    about: "smoke-app is a tiny JavaScript library of text helpers for one developer's app.",
    settings: { ultracode: false }, quietMinutes: 1, stopAt: 0.45,
  };
  writeFileSync(join(dir, "case.json"), JSON.stringify(c, null, 2) + "\n");
  return dir;
}
