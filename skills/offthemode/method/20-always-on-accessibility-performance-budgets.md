## Always-On · Accessibility & Performance Budgets

> **Output:** the numbers in `.offthemode/RULES.md` §Budgets (the only owner of performance, interaction and accessibility numbers), `lighthouserc.cjs` and the audit scripts reading them, and a failing budget that fails the build.

Accessibility and performance are the craft signals that separate an obsessed-over product from a template, and they are the numeric form of "minimalist". "Make it fast" produces nothing. A number inside a failing check gets optimized. Restraint is also a performance strategy: one subset variable font per voice, no decorative JavaScript, fewer elements, motion on transform and opacity. Your aesthetic and your budget point the same way.

### One owner per number

Every number has exactly one owner:

- Performance, interaction and accessibility: RULES.md §Budgets.
- Motion, type and space: the design tokens file (`tokens.css` or your platform's equivalent).
- Time to value: PRODUCT.md.
- Screenshot widths: RULES.md §Commands.

Everything else refers to a number by its name, such as `feedback_ms` or `--dur-quick`. When one constraint carries two numbers in two files, your AI picks between them at random, and a reviewer flags the project's own tokens as wrong. A short script in the fast check catches strays in the spec documents.

```file path="scripts/check-numbers.sh"
#!/usr/bin/env bash
# Part of the fast check. Fails when a spec document holds a raw ms, s or px value instead of naming its owner.
re='(^|[^0-9.a-zA-Z_-])([2-9]|[1-9][0-9]+)(\.[0-9]+)? ?(ms|px|s)([^a-zA-Z]|$)'
if grep -snE "$re" .offthemode/{DESIGN,VOICE,ROUTES,SKELETON,COMPLEXITY}.md; then
  echo "Raw values above: refer to them by name (--dur-quick, feedback_ms in RULES.md §Budgets)." >&2
  exit 1
fi
```

The same thinking applies to what your AI reads. RULES.md and STATE.md load at the start of every session, so every line in them is paid for in every session. Keep them short and move detail into the guides and the extra documents.

### The numbers

Keep the numbers in one json block inside RULES.md §Budgets, so scripts read them instead of keeping their own copies. Fill the two blanks before the first run. A model-driven core also adds `eval_drop_points`, the most the eval pass rate may fall before a merge is blocked (see Verification Loop).

```json
{
  "lcp_ms": 2500, "inp_ms": 200, "cls": 0.1, "tbt_ms": 200,
  "feedback_ms": 100, "indicator_delay_ms": 300, "progress_copy_ms": 1000,
  "js_route_kb": {{JS_KB}}, "cold_start_ms": {{COLD_START_MS}},
  "frame_ms_60hz": 16.7, "frame_ms_120hz": 8.3,
  "contrast_text": 4.5, "contrast_large": 3, "contrast_ui": 3, "large_text_px": 24, "large_bold_text_px": 18.66,
  "target_ios_pt": 44, "target_android_dp": 48, "target_pointer_min_px": 24,
  "thumb_zone_pct": 40
}
```

| Budget | Keys | Measured on | Checked by |
|---|---|---|---|
| Core Web Vitals, p75 | lcp_ms, inp_ms, cls; tbt_ms stands in for INP in the lab | A mid-tier Android phone over 4G | Lighthouse CI (lab) and web-vitals real-user monitoring (field, the only place INP exists) |
| Input feedback | feedback_ms | The core journey with the CPU slowed 4x | `scripts/audit-ux.ts` (Event Timing) |
| Loading indicator | indicator_delay_ms (nothing shows before it); progress_copy_ms (specific copy after it) | Every async state | States gallery and review |
| JavaScript per route (gzip) | js_route_kb | Every route | `size-limit` |
| Frame time | frame_ms_60hz, frame_ms_120hz | Scrolling the scale seed on the low-end device named in §Budgets | Profiler |
| Cold start (mobile) | cold_start_ms, until the app responds | The same low-end device | Release checklist |
| Contrast (WCAG 2.2 AA) | contrast_text; contrast_large from large_text_px, or large_bold_text_px when bold; contrast_ui for controls and icons | Both themes | Computed-style audit and the states gallery |
| Targets | target_ios_pt, target_android_dp; on the web, touch size is `--touch-min` in the tokens file; dense pointer-only interfaces never go below target_pointer_min_px | Every interactive element | Computed-style audit, `scripts/audit-ux.ts` |
| Thumb zone | thumb_zone_pct: the primary action's centre sits in this bottom share of the phone screen | Every phone surface | `scripts/audit-ux.ts` |
| Keyboard, screen reader | Every action reachable, focus visible, every control named with its role and state | Core journeys | End-to-end tests plus a manual VoiceOver or TalkBack pass |
| Scaling, motion | 200% zoom and the largest Dynamic Type still work; a reduced-motion version of every animation | States gallery | Review and `scripts/audit-ux.ts` |

What the web numbers mean: LCP (Largest Contentful Paint) is when the main content appears. INP (Interaction to Next Paint) is how quickly the page responds to a tap or key. CLS (Cumulative Layout Shift) is how much the layout jumps while loading. TBT (Total Blocking Time) is how long the main thread is too busy to respond, the lab's stand-in for INP. p75 means 75 of every 100 real visits must meet the number. WCAG 2.2 AA is the accessibility standard most laws and platforms point to.

```file path="lighthouserc.cjs"
// Run: npx lhci autorun --config=./lighthouserc.cjs · numbers come from .offthemode/RULES.md §Budgets, never typed here
const fs = require("node:fs");
function budgets() {
  const md = fs.readFileSync(".offthemode/RULES.md", "utf8");
  const at = md.search(/^#+ .*Budgets/m);
  const m = at < 0 ? null : md.slice(at).match(/[~`]{3}json\n([\s\S]*?)\n[~`]{3}/);
  if (!m) throw new Error("No json block under RULES.md §Budgets");
  return JSON.parse(m[1]);
}
const b = budgets();
module.exports = {
  ci: {
    collect: { url: ["{{URL_HOME}}", "{{URL_CORE_SURFACE}}"], numberOfRuns: 3 },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: b.lcp_ms }],
        "cumulative-layout-shift": ["error", { maxNumericValue: b.cls }],
        "total-blocking-time": ["error", { maxNumericValue: b.tbt_ms }],
      },
    },
  },
};
```

> **Trap:** A clean automated accessibility run doesn't make a product accessible, because automated tools catch only a minority of real issues. Once per release, do one keyboard-only pass and one screen-reader pass through the moment-of-value flow. Your AI writes the script; you run it.
