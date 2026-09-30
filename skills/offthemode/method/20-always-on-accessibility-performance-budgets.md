## Always-On · Accessibility & Performance Budgets

> **Output:** the speed, interaction and accessibility numbers this product chooses to hold, as keys in `.offthemode/RULES.md` §Budgets, and `lighthouserc.cjs` and the audit scripts, which check the keys that are there and skip the rest.

Accessibility and speed are craft signals that separate an obsessed-over product from a template. "Make it fast" produces nothing; a number inside a failing check gets optimized. Off the Mode sets none of these numbers for you: which ones the product holds, and how minimal or rich it is, is your call. This guide lists the common keys with reference values. Copy a key into RULES.md §Budgets only when the product should hold it, and confirm its value first. From then on its check fails the build when the number is missed, and nothing fails over a number you didn't add.

In the EU, the European Accessibility Act has applied since 28 June 2025 to many consumer services, such as online shops, banking, e-books and transport ticketing; for those, accessibility is a legal duty.

### One owner per number

Every number has exactly one owner:

- Speed, interaction and accessibility, when the product holds them: RULES.md §Budgets.
- File and function size limits (max_file_lines, max_fn_lines) and the screenshot sizes (screenshot_sizes): RULES.md §Budgets.
- Motion, type and space: the design tokens file (`tokens.css` or your platform's equivalent).
- Time to value: PRODUCT.md §Experience promises.

Everything else refers to a number by its name, such as `max_file_lines` or `--dur-quick`. When one constraint carries two numbers in two files, your AI picks between them at random, and a reviewer flags the project's own tokens as wrong. A short script in the fast check catches strays in the spec documents.

```file path="scripts/check-numbers.sh"
#!/usr/bin/env bash
# Part of the fast check. Fails when a spec document holds a raw ms, s or px value instead of naming its owner.
re='(^|[^0-9.a-zA-Z_-])([2-9]|[1-9][0-9]+)(\.[0-9]+)? ?(ms|px|s)([^a-zA-Z]|$)'
if grep -snE "$re" .offthemode/{DESIGN,VOICE,ROUTES,SKELETON,COMPLEXITY}.md; then
  echo "Raw values above: refer to them by name (a token such as --dur-quick, or a key in RULES.md §Budgets)." >&2
  exit 1
fi
```

The same thinking applies to what your AI reads. RULES.md and STATE.md load at the start of every session, so every line in them is paid for in every session. Keep them short and move detail into the guides and the extra documents.

### The numbers

The RULES.md template ships one json block in §Budgets with three keys: max_file_lines, max_fn_lines and screenshot_sizes. Add a key from the table below to the same block only when the product should hold it. The value beside each key is a common reference point, never a default your AI keeps without asking you. The scripts read that block, so no script and no guide keeps its own copy, and each check runs only for the keys that are there. A model-driven core also adds `eval_drop_points`, the most the eval pass rate may fall before a merge is blocked (see Verification Loop).

| Budget | Keys and reference values | Measured on | Checked by |
|---|---|---|---|
| Core Web Vitals, p75 | lcp_ms 2500, inp_ms 200, cls 0.1; in the lab, tbt_ms 200 stands in for INP | A mid-tier Android phone over 4G | Lighthouse CI (lab) and web-vitals real-user monitoring (field, the only place INP exists) |
| Lighthouse scores | lighthouse_performance 0.9, lighthouse_accessibility 0.95 (category scores, 0 to 1) | The pages listed in `lighthouserc.cjs` | Lighthouse CI |
| Input feedback | feedback_ms 100 | The core journey with the CPU slowed 4x | `scripts/audit-ux.ts` (Event Timing) |
| Loading indicator | indicator_delay_ms 300 (nothing shows before it); progress_copy_ms 1000 (specific copy after it) | Every async state | States gallery and review |
| Frame time | frame_ms_60hz 16.7, frame_ms_120hz 8.3 | Scrolling the scale seed on the low-end device you test on | Profiler |
| Cold start (mobile) | cold_start_ms, until the app responds. There is no common value: measure the app, then set it | The same low-end device | Release checklist |
| Contrast (WCAG 2.2 AA) | contrast_text 4.5; contrast_large 3 from large_text_px 24, or large_bold_text_px 18.66 when bold; contrast_ui 3 for controls and icons | Both themes | Computed-style audit and the states gallery |
| Targets | target_ios_pt 44, target_android_dp 48; on the web, touch size is `--touch-min` in the tokens file; dense pointer-only interfaces never go below target_pointer_min_px 24 | Every interactive element | Computed-style audit, `scripts/audit-ux.ts` |
| Thumb zone | thumb_zone_pct 40: the primary action's centre sits in this bottom share of the phone screen | Every phone surface | `scripts/audit-ux.ts` |
| Keyboard, screen reader | No number: every action reachable, focus visible, every control named with its role and state | Core journeys | End-to-end tests plus a manual VoiceOver or TalkBack pass |
| Scaling, motion | No number: 200% zoom and the largest Dynamic Type still work; a reduced-motion version of every animation | States gallery | Review and `scripts/audit-ux.ts` |

What the web numbers mean: LCP (Largest Contentful Paint) is when the main content appears. INP (Interaction to Next Paint) is how quickly the page responds to a tap or key. CLS (Cumulative Layout Shift) is how much the layout jumps while loading. TBT (Total Blocking Time) is how long the main thread is too busy to respond, the lab's stand-in for INP. p75 means 75 of every 100 real visits must meet the number. WCAG 2.2 AA is the accessibility standard most laws and platforms point to.

```file path="lighthouserc.cjs"
// Run: npx lhci autorun --config=./lighthouserc.cjs · numbers come from .offthemode/RULES.md §Budgets, never typed here; a key that isn't there asserts nothing
const fs = require("node:fs");
function budgets() {
  const md = fs.readFileSync(".offthemode/RULES.md", "utf8");
  const at = md.search(/^#+ .*Budgets/m);
  const section = at < 0 ? "" : md.slice(at).split(/\n##? /)[0];   // §Budgets only, up to the next section
  const m = section.match(/[~`]{3}json\r?\n([\s\S]*?)\r?\n[~`]{3}/);
  if (!m) { console.warn("No json block under RULES.md §Budgets: nothing asserted"); return {}; }
  if (/\{\{/.test(m[1])) throw new Error("RULES.md §Budgets still has blanks to fill");
  return JSON.parse(m[1]);
}
const b = budgets();
const has = (k) => typeof b[k] === "number";
const max = (audit, k) => (has(k) ? { [audit]: ["error", { maxNumericValue: b[k] }] } : {});
const min = (category, k) => (has(k) ? { [`categories:${category}`]: ["error", { minScore: b[k] }] } : {});
module.exports = {
  ci: {
    collect: { url: ["{{URL_HOME}}", "{{URL_CORE_SURFACE}}"], numberOfRuns: 3 },
    assert: {
      assertions: {
        ...min("performance", "lighthouse_performance"),
        ...min("accessibility", "lighthouse_accessibility"),
        ...max("largest-contentful-paint", "lcp_ms"),
        ...max("cumulative-layout-shift", "cls"),
        ...max("total-blocking-time", "tbt_ms"),
      },
    },
  },
};
```

> **Trap:** A clean automated accessibility run doesn't make a product accessible, because automated tools catch only a minority of real issues. Once per release, do one keyboard-only pass and one screen-reader pass through the moment-of-value flow. Your AI writes the script; you run it.
