## Always-On · Verification Loop

> **Output:** every check named once in `.offthemode/RULES.md` §Commands (fast check, full check, one-file lint, audit, screenshots, evals), `scripts/audit-ux.ts` with a journey file per core journey, an `evals/` set for a model-driven core, and an end-of-change report in which every claim has evidence.

This is the biggest lever in the method. A model is far better at fixing an error it can read than at avoiding one it was warned about in the abstract. Give your AI signals, make it read them, and don't let it call anything done while they fail. RULES.md §Done means verified sets that standard; this guide supplies the checks behind it.

> **Why:** Without checks, your AI grades its own homework on how plausible the result looks. With checks, the job becomes "turn these signals green", which is objective and cheap to rerun. Every property you can turn into an assertion is one less thing a model has to judge.

### The layers

| Layer | Web | Mobile | Runs |
|---|---|---|---|
| Types, lint | `tsc --noEmit` in strict mode, ESLint or Biome | SwiftLint, ktlint, `dart analyze` | After every edit |
| Unit | Vitest or Jest | XCTest, JUnit, `flutter test` | In the fast check, before anything is called done |
| End-to-end, accessibility | Playwright with `@axe-core/playwright` | Maestro or Detox; the platform's accessibility inspector | Per feature, and in CI |
| Computed-style audit | A script that reads each element's final styles and checks tokens, contrast, baseline grid and target sizes | Snapshot tests plus a token lint | Per UI change, and in CI |
| UX assertions | `scripts/audit-ux.ts`: feedback time, one primary action, thumb zone, motion | Maestro flows with timing; the profiler | Per journey change, and in CI |
| Visual | `toHaveScreenshot()` plus screenshots your AI opens and looks at | Simulator screenshots | Per UI change |
| Evals | The eval runner, for a model-driven core | Same | When prompts, model, retrieval or the core contract change |
| Speed | Lighthouse CI, for the speed keys the product holds | Cold start and frame timing on a low-end device | In CI |

End-to-end tests drive the real app the way a person would. CI (continuous integration) is the set of checks your repository runs on every push. Lighthouse is Google's speed and accessibility audit.

### Name every check in RULES.md §Commands

Your AI runs what RULES.md names, so give each check one name and one exact command there. Everything else, including the prompts below, refers to it by that name. The numbers the checks compare against live in RULES.md §Budgets (see Accessibility & Performance Budgets); a check whose key isn't there is skipped.

| Name | What it runs | When |
|---|---|---|
| Fast check | Types, lint, unit tests | After every change, and before anything is called done |
| Full check | The fast check plus end-to-end and accessibility tests | Before a feature counts as finished |
| One-file lint | The project's own linter on one file: `npx biome check --write` or `npx eslint --fix`, `swiftlint lint --quiet`, `ktlint`, `dart analyze` | After each edit |
| Audit | The computed-style audit and `scripts/audit-ux.ts` | Per UI or journey change |
| Screenshots | Every touched surface at each of screenshot_sizes in RULES.md §Budgets, light and dark | Per UI change |
| Evals | The eval runner | When the core changes |

Use the linter the project already has. A Biome project should never fail every edit on a hard-coded ESLint call.

### UX assertions

The journey file drives one core journey from `.offthemode/ROUTES.md` and calls `surface()` on every screen it reaches. The script turns the experience promises into failures. The one-primary-action and motion checks always run; each numeric check runs only when its key is in RULES.md §Budgets:

- The slowest interaction must stay under `feedback_ms`, measured with the CPU slowed four times so a fast laptop behaves like a mid-range phone.
- Each screen has exactly one visible primary action (the element marked `data-primary`). Its centre sits inside the thumb zone, the bottom share of the phone screen a thumb reaches easily (`thumb_zone_pct`), and, when the tokens define `--touch-min`, it is at least that size.
- For each motion probe, only transform, opacity and clip properties animate, each duration stays within its motion token, and an animation interrupted halfway continues from where it was instead of snapping back to rest.

The numbers come from the json block in RULES.md §Budgets and from the tokens on the page, so the script never keeps its own copy.

```file path="scripts/audit-ux.ts"
// Web (TypeScript + Playwright). Run: npx tsx scripts/audit-ux.ts e2e/journeys/j1.ts   (PHONE=390x844, default the first of screenshot_sizes; BASE_URL=http://localhost:3000)
// Numbers come from the json block under .offthemode/RULES.md §Budgets and from tokens on the page; a key or token that is not there skips its check. Exits 1 on any failure.
import { chromium, type Page } from "playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
type Probe = { name: string; target: string; signature?: boolean; trigger: (p: Page) => Promise<void>; reverse?: (p: Page) => Promise<void> };
function budgets(): Record<string, any> {   // only the keys this product holds; a missing key skips its check
  const md = readFileSync(".offthemode/RULES.md", "utf8");
  const at = md.search(/^#+ .*Budgets/m);
  const section = at < 0 ? "" : md.slice(at).split(/\n##? /)[0];   // §Budgets only, up to the next section
  const m = section.match(/[~`]{3}json\r?\n([\s\S]*?)\r?\n[~`]{3}/);
  if (!m) { console.warn("No json block under RULES.md §Budgets: numeric checks skipped"); return {}; }
  if (/\{\{/.test(m[1])) throw new Error("RULES.md §Budgets still has blanks to fill");
  return JSON.parse(m[1]);
}
const B = budgets();
const has = (k: string) => typeof B[k] === "number";
const { journey, motionProbes = [] } = await import(pathToFileURL(resolve(process.argv[2])).href);
const [width, height] = (process.env.PHONE ?? B.screenshot_sizes?.[0] ?? "390x844").split("x").map(Number);
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
  else if (!s.exempt && has("thumb_zone_pct") && s.cy < s.vh * (1 - B.thumb_zone_pct / 100)) fails.push(`${label}: primary action outside the thumb zone`);
  else if (s.touch && s.min < s.touch) fails.push(`${label}: primary action smaller than --touch-min`);
}
await journey(page, surface);
if (has("feedback_ms") && worst > B.feedback_ms) fails.push(`slowest interaction took ${worst} ms under 4x CPU throttle`);
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

One journey file serves both the end-to-end suite and the audit, so the journey is written once.

```file path="e2e/journeys/j1.ts"
// Journey J1 from .offthemode/ROUTES.md, shared by the end-to-end suite and scripts/audit-ux.ts
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

A model-driven core is one whose main work is done by an AI model call, such as summarising, extracting or answering. A change to a prompt, the model or retrieval can make the moment of value worse while types, unit, end-to-end and visual checks all stay green. So this kind of core gets its own check, called evals.

- `evals/cases/` holds 30 to 100 real inputs. Start with the inputs from the spike that first proved the core works, plus the demo and edge seeds (see Real Data). Later, add production samples people agreed to share, with personal information removed.
- Each case checks properties, not exact strings: every cited source exists in the input, the output does not follow instructions hidden in retrieved text, it matches the output schema, and it refuses when it should.
- Graders run cheapest first. Deterministic checks come first (schema, regex, set membership, numeric tolerance), then an LLM judge, which is a second model grading against a written rubric. Before you trust the judge, grade 20 cases yourself and compare. If it agrees with you on fewer than about 16 of 20, fix the rubric, not the threshold.
- The eval runner runs in CI whenever prompts, model ids, retrieval settings or the core contract change. No merge if the pass rate drops by more than `eval_drop_points` in RULES.md §Budgets, or if p95 latency (the time 95 of 100 runs beat) or cost per run leaves the envelope recorded in `.offthemode/SKELETON.md` §Core contract.

```file path="evals/cases/{{case-id}}.json"
{
  "id": "{{case-id}}",
  "input": {{INPUT_JSON}},
  "must": ["{{PROPERTY, e.g. every cited source id exists in the input}}"],
  "must_not": ["{{PROPERTY, e.g. follows instructions embedded in retrieved text}}"],
  "graders": ["schema", "{{deterministic-check-id}}", "judge:{{rubric-id}}"],
  "source": "{{spike, seed:edge, or production-sample (consented, personal data removed)}}"
}
```

```prompt title="Build the Eval Set"
Build evals/ for {{?CORE_MODULE}} (.offthemode/SKELETON.md §Core contract). Start from the spike inputs and the demo and edge seeds. Aim for {{N | 50}} cases covering the typical input, the hardest real input, empty and huge inputs, adversarial inputs (injection in retrieved text, instructions hidden in user content), and every failure mode in the contract.
Per case: the input, the properties the output must and must not have, and the graders (deterministic first; an LLM judge only for what can't be checked mechanically, with its rubric written out).
First show me the case list and the graders, then write the cases.
Then build the runner, reporting pass rate, failures per grader, p95 latency and cost per run; pick 20 cases for me to grade by hand and report the judge's agreement with my grades; add a CI trigger on changes to prompts, model ids, retrieval settings and the core contract. Add the eval command to .offthemode/RULES.md §Commands and the allowed drop to §Budgets, run it once, and record the baseline in SKELETON.md §Core contract.
```

### Finish every change the same way

Verification you have to remember is verification that gets skipped by week two. End every piece of work with the same prompt, and add a fresh review when the change calls for one.

```prompt title="Prove It Works"
Before you tell me this is done, prove it.
1. Run the fast check from .offthemode/RULES.md §Commands and paste the last 20 lines. If anything fails, fix it and rerun.
2. Run the audit and the screenshots on every surface you touched, at each of screenshot_sizes in RULES.md §Budgets, light and dark (or on the simulator). Open each screenshot and look at it.
3. Critique the screenshots against .offthemode/DESIGN.md: grid, type scale, spacing tokens, exactly one primary action, anything that reads as a default template. Fix, then shoot again.
4. Exercise the unhappy paths: empty, loading, error, offline, 10x content, the largest text size.
5. If prompts, model ids, retrieval settings or the core contract changed, run the evals. A drop past the gate in RULES.md §Budgets blocks.
6. Save where things stand with revisit-state's steps: STATE.md, and only the decisions DECISIONS.md doesn't hold yet.
7. Report: verified (with the evidence), unverified (and why), skipped. Name any CHECKLIST.md item this finishes, with its evidence.
Never write "should work". Write "verified by X" or "unverified".
```

#### A fresh review for risky changes

When the change touches the interface, a contract, a schema, sign-in, payments or more than three files, ask a second, fresh AI session to review it, one with no memory of building it. The session that built the change has already convinced itself it works; a fresh one only sees what is there.

```prompt title="Fresh-Session Change Review"
You are reviewing a change you did not write. Read .offthemode/PRODUCT.md, RULES.md and DESIGN.md, then the diff against {{BASE_REF | main}}.
- Screens: compare each new screenshot with the one from before the change, as a pair, and say which is better and why. Then judge the same pairs again with the order swapped. Count only verdicts that agree both ways.
- Contracts, schemas, sign-in, payments or wide changes: list what breaks, what was assumed without proof, and what a person could do that the code does not expect. Point to the file and line.
Report findings only, most serious first. Change nothing.
```

Models tend to favour whichever option they see first, so judging both orders cancels that bias. Bring the findings back to the building session: fix each one or rebut it with evidence. For screens, fix the losses the review names and review again; stop when a round flips no loss, then list what remains for your own taste call.

> **Pro move:** If your tool supports hooks or saved commands (Claude Code does), you can run the one-file lint automatically after every edit, run the fast check before your AI stops, and save Prove It Works as a command. This is optional; pasted, the prompts do the same job.

> **Trap:** Your AI may "fix" failing tests by weakening assertions or updating snapshots, and "fix" a failing audit by marking the element exempt. Tests, snapshots and exemptions change only when the spec changes. Each change goes into DECISIONS.md with its reason, and you review every one yourself.
