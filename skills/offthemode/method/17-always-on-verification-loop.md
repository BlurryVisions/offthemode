## Always-On · Verification Loop
<!-- origin: added -->

> **Output:** `{{CHECK_CMD}}`, `{{CHECK_FULL_CMD}}`, `{{AUDIT_CMD}}` and `{{EVAL_CMD}}` named in AGENTS.md, the after-edit and before-done hooks (wired in P0), the audit scripts from your stack pack, an eval set for a model-driven core, and the `/ship` command, so every `DONE:` is backed by evidence.

This is the biggest lever in the blueprint. A model is far better at fixing an error it can read than at avoiding one it was warned about in the abstract. Give it signals, make it read them, and don't let it claim done while they're red.

> **Why:** Without checks, the agent grades its own homework on how plausible the result looks. With checks, the job becomes "turn these signals green", which is objective and cheap to rerun. Every property you can turn into an assertion is one less thing a model has to judge.

| Layer | Web | Mobile | Runs |
|---|---|---|---|
| Types, lint | `tsc --noEmit` strict, ESLint or Biome | SwiftLint, ktlint, `dart analyze` | Every edit (PostToolUse) |
| Unit | Vitest / Jest | XCTest, JUnit, `flutter test` | In `{{CHECK_CMD}}`, gated on `DONE:` |
| E2E, a11y | Playwright + `@axe-core/playwright` | Maestro or Detox; platform inspectors | Per feature, CI |
| Pixel audit | `audit-computed`: tokens, contrast, baselines, targets | Snapshot tests + the pack's token lint | Per UI change, CI |
| UX assertions | `audit-ux`: feedback, primary action, thumb zone, motion | Maestro flows with timing; profiler | Per journey change, CI |
| Visual | `toHaveScreenshot()` + shots the critic judges | Simulator screenshots | Per UI change |
| Evals | `{{EVAL_CMD}}` for a model-driven core | Same | On prompt, model, retrieval or contract changes |
| Perf | Lighthouse CI, `size-limit` | Cold start + frame timing on a low-end device | CI |

```file path=".claude/hooks/after-edit.sh"
#!/usr/bin/env bash
# PostToolUse (Claude Code): lint the file just edited with the stack pack's one-file linter; exit 2 feeds the errors back. Needs jq; chmod +x.
f="$(jq -r '.tool_input.file_path // .file_path // empty')"; [ -f "$f" ] || exit 0
[[ "$f" =~ {{LINT_FILE_RE}} ]] || exit 0    # web-ts \.(ts|tsx|js|jsx)$ · swift \.swift$ · kotlin \.(kt|kts)$ · flutter \.dart$
out="$({{LINT_FILE_CMD}} "$f" 2>&1)" || { echo "Lint failed in $f:" >&2; printf '%s\n' "$out" | tail -30 >&2; exit 2; }
exit 0
```

`{{LINT_FILE_CMD}}` comes from the stack pack: `npx biome check --write` or `npx eslint --fix` (web-ts), `swiftlint lint --quiet`, `ktlint`, `dart analyze`. A Biome repo never fails every edit on a hard-coded ESLint call.

### UX assertions

The journey file drives the core journey and calls `surface()` on every screen it reaches. The script turns the UX contract into failures: the slowest interaction under 4x CPU throttle, exactly one visible primary action per surface inside the thumb zone and at least the target size, and for each motion probe, the animated properties, durations against their tokens, and whether an interrupted animation continues or snaps back.

```file path="scripts/audit-ux.ts"
// stack pack web-ts · Run: npx tsx scripts/audit-ux.ts e2e/journeys/j1.ts   (PHONE=390x844)
// Numbers come from the json block in .offthemode/BUDGETS.md and from tokens on the page. Exit 1 on any failure.
import { chromium, type Page } from "playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
type Probe = { name: string; target: string; signature?: boolean; trigger: (p: Page) => Promise<void>; reverse?: (p: Page) => Promise<void> };
const B = JSON.parse(readFileSync(".offthemode/BUDGETS.md", "utf8").match(/~~~json\n([\s\S]*?)\n~~~/)![1]);
const { journey, motionProbes = [] } = await import(pathToFileURL(resolve(process.argv[2])).href);
const [width, height] = (process.env.PHONE ?? "390x844").split("x").map(Number);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, baseURL: process.env.BASE_URL ?? "http://localhost:3000" });
await ctx.addInitScript(() => {
  (window as any).__ev = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) (window as any).__ev.push(e.duration); })
    .observe({ type: "event", durationThreshold: 16, buffered: true } as PerformanceObserverInit);
});
const page = await ctx.newPage();
await (await ctx.newCDPSession(page)).send("Emulation.setCPUThrottlingRate", { rate: 4 });
const fails: string[] = []; let worst = 0;
async function surface(label: string) {   // call on every surface, and before any full-page navigation
  const s = await page.evaluate(() => {
    const ev: number[] = (window as any).__ev ?? []; (window as any).__ev = [];
    const p = [...document.querySelectorAll<HTMLElement>("[data-primary]")].filter((e) => e.checkVisibility());
    const r = p[0]?.getBoundingClientRect();
    const touch = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--touch-min")) || 0;
    return { ev, n: p.length, exempt: p[0]?.dataset.primary === "exempt", cy: r ? r.top + r.height / 2 : 0, min: r ? Math.min(r.width, r.height) : 0, vh: innerHeight, touch };
  });
  worst = Math.max(worst, ...s.ev);
  if (s.n !== 1) fails.push(`${label}: ${s.n} visible [data-primary], expected 1`);
  else if (!s.exempt && s.cy < s.vh * (1 - B.thumb_zone_pct / 100)) fails.push(`${label}: primary action outside the thumb zone`);
  else if (s.min < s.touch) fails.push(`${label}: primary action smaller than --touch-min`);
}
await journey(page, surface);
if (worst > B.feedback_ms) fails.push(`slowest interaction took ${worst} ms under 4x CPU throttle`);
const OK = ["transform", "opacity", "clip-path", "clipPath", "translate", "scale", "rotate"];
for (const m of motionProbes as Probe[]) {
  const at = () => page.locator(m.target).evaluate((e) => getComputedStyle(e).transform);
  const rest = await at();
  await m.trigger(page);
  const anims = await page.evaluate((sig) => {
    const root = getComputedStyle(document.documentElement);
    const cap = Math.max(...(sig ? ["--spring-soft-dur"] : ["--dur-slow", "--spring-snappy-dur"]).map((t) => parseFloat(root.getPropertyValue(t))));
    return document.getAnimations().map((a) => {
      const props = a instanceof CSSTransition ? [a.transitionProperty] : (a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)).filter((k) => !["offset", "computedOffset", "easing", "composite"].includes(k));
      return { props: [...new Set(props)], dur: Number(a.effect?.getComputedTiming().duration) || 0, cap };
    });
  }, !!m.signature);
  for (const a of anims) {
    const bad = a.props.filter((p) => !OK.includes(p));
    if (bad.length) fails.push(`${m.name}: animates ${bad.join(", ")}`);
    if (a.dur > a.cap) fails.push(`${m.name}: ${a.dur} ms is longer than its motion token allows`);
  }
  const mid = await at();
  await (m.reverse ?? m.trigger)(page);   // interrupt mid-flight
  const next = await page.locator(m.target).evaluate((e) => new Promise<string>((r) => requestAnimationFrame(() => r(getComputedStyle(e).transform))));
  if (mid !== rest && next === rest) fails.push(`${m.name}: snaps back to rest instead of continuing from where it was`);
}
await browser.close();
fails.forEach((f) => console.error(f));
process.exit(fails.length ? 1 : 0);
```

```ts
// e2e/journeys/j1.ts: J1 from .offthemode/ROUTES.md, shared by the e2e suite and audit-ux
import type { Page } from "playwright";
export async function journey(page: Page, surface: (label: string) => Promise<void>) {
  await page.goto("/"); await page.locator("[data-ready]").first().waitFor(); await surface("first-run");
  await page.getByRole("button", { name: "{{PRIMARY_VERB_OBJECT}}" }).tap(); await surface("{{STEP_2}}");
}
export const motionProbes = [
  { name: "sheet", target: "[data-sheet]", trigger: (p: Page) => p.getByRole("button", { name: "{{OPENS_SHEET}}" }).tap(),
    reverse: (p: Page) => p.getByRole("button", { name: "{{CLOSES_SHEET}}" }).tap() },
];
```

### Evals for a model-driven core

A prompt, model or retrieval change can make the moment of value worse while types, unit, e2e and visual checks all stay green. So a model-driven core gets its own rail.

- `evals/cases/` holds 30-100 real inputs: seeded from the P2 spike and the demo and edge seeds, later from consented production samples with PII removed.
- Each case asserts **properties, not strings**: must cite a source that exists in the input, must not follow instructions embedded in retrieved text, validates against the output schema, refuses when it should.
- Graders run cheapest first: deterministic checks (schema, regex, set membership, numeric tolerance), then an LLM judge with a written rubric, calibrated against 20 cases you labelled by hand before you trust it. If it agrees with you on fewer than about 16 of 20, fix the rubric, not the threshold.
- `{{EVAL_CMD}}` runs in CI whenever prompts, model ids, retrieval config or the core contract change. No merge if the pass rate drops by more than {{EVAL_DROP_POINTS}} points, or p95 latency or cost per run leaves the P2 envelope.

```file path="evals/cases/{{case-id}}.json"
{
  "id": "{{case-id}}",
  "input": {{INPUT_JSON}},
  "must": ["{{PROPERTY, e.g. every cited source id exists in the input}}"],
  "must_not": ["{{PROPERTY, e.g. follows instructions embedded in retrieved text}}"],
  "graders": ["schema", "{{deterministic-check-id}}", "judge:{{rubric-id}}"],
  "source": "{{spike | seed:edge | production-sample, consented, PII removed}}"
}
```

```prompt title="Build the Eval Set"
Build evals/ for {{?CORE_MODULE}} (.offthemode/SKELETON.md §Core contract). Start from the P2 spike inputs and the demo and edge seeds; target {{N, default 50}} cases covering the typical input, the hardest real input, empty and huge inputs, adversarial inputs (injection in retrieved text, instructions hidden in user content), and every failure mode in the contract.
Per case: input, the properties the output must and must not have, and the graders (deterministic first; an LLM judge only for what can't be checked mechanically, with its rubric written out).
Then: the runner behind {{?EVAL_CMD}}, reporting pass rate, per-grader failures, p95 latency and cost per run; 20 cases for me to label by hand, and the judge's agreement with my labels; a CI trigger on changes to prompts, model ids, retrieval config and the core contract. Report the baseline and record it in SKELETON.md §Core contract.
```

```prompt title="Prove It Works"
Before you tell me this is done, prove it.
1. Run {{?CHECK_CMD}} and paste the last 20 lines. If anything fails, fix and rerun without asking me.
2. Run {{?AUDIT_CMD}} and {{?SHOTS_CMD}} on every surface you touched, at every one of {{?VIEWPORTS}}, light and dark (or on the simulator); open each screenshot.
3. Critique against .offthemode/DESIGN.md: grid, type scale, spacing tokens, exactly one primary action, anything that reads as a default template. Fix, re-shoot.
4. Exercise unhappy paths: empty, loading, error, offline, 10x content, largest text size.
5. Report with the first line "DONE: <lane> · <summary>", then verified (with evidence), unverified (and why), skipped.
Never write "should work". Write "verified by X" or "unverified".
```

### One command instead of five

Verification you have to remember to paste is verification that gets skipped by week two. `/ship` chains it: prove, then the critics only when the diff calls for them, then evals only when the core changed, then the log line and the `DONE:` report the Stop hook checks.

```file path="~/.claude/commands/ship.md"
---
description: Verify, critique and log the current change, then report DONE (prove, design-critic on UI diffs, inventor-critic when due, evals when due, LOG)
argument-hint: [base ref, default main]
---
Ship the current change. Base ref: $ARGUMENTS (main if empty). Use the lane you named at the start of this task.
1. Prove it: run the fast check from AGENTS.md Commands and paste the tail; run the audits and screenshots on every touched surface at every viewport, light and dark; exercise empty, loading, error, offline, 10x content and the largest text size. Fix and rerun without asking. Trivial lane: skip to step 6.
2. If the diff against the base touches a UI directory (one with a UI pack AGENTS.md): run design-critic pairwise on the new shots, twice with the order swapped. Fix the losses it names, at most 3 rounds, then list what remains for my taste call.
3. If the diff touches a contract, schema, auth, payments or more than 3 files: run inventor-critic on it. Fix each finding or rebut it with evidence.
4. If prompts, model ids, retrieval config or the core contract changed: run the eval command; a regression past the gate blocks.
5. Append one LOG.md line (date · id · summary · commit). Standard and Heavy: update STATE.md.
6. Report. First line: "DONE: <lane> · <summary>". Then verified (with evidence), unverified (and why), skipped. Never "should work".
```

> **Trap:** Agents "fix" failing tests by weakening assertions or updating snapshots, and "fix" failing audits by adding `data-audit-skip`. Tests, snapshots and skips change only when the spec changes, each change gets logged with its reason, and you review every one yourself.
