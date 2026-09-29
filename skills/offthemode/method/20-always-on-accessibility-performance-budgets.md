## Always-On · Accessibility & Performance Budgets
<!-- origin: added -->

> **Output:** `.offthemode/BUDGETS.md` (the only owner of performance, interaction and accessibility numbers), `lighthouserc.cjs` reading it, `scripts/kit-lint.sh` in pre-commit, and a failing budget that fails the build.

Accessibility and performance are the craft signals that separate an obsessed-over product from a template, and they're the numeric form of "minimalist". "Make it fast" produces nothing. A number inside a failing check gets optimized. Restraint is also a performance strategy: one subset variable font per voice, no decorative JS, fewer elements, motion on transform and opacity. Your aesthetic and your budget point the same way.

Every number has exactly one owner. Performance, interaction and accessibility live in BUDGETS.md; motion, type and space in tokens.css; time to value in PRODUCT.md; viewports in AGENTS.md Commands. Everything else refers to them by name. When the same constraint carries two numbers in two files, the agent resolves the conflict arbitrarily, and a critic flags the kit's own tokens. `kit-lint.sh` fails the commit when a raw value appears anywhere else.

```file path=".offthemode/BUDGETS.md"
BUDGETS: {{PRODUCT_NAME}} · the only owner of performance, interaction and accessibility numbers; everything else refers to them by name. A failing budget is a failing build. Scripts read the json block; fill it before the first run.

~~~json
{
  "lcp_ms": 2500, "inp_ms": 200, "cls": 0.1, "tbt_ms": 200,
  "feedback_ms": 100, "indicator_delay_ms": 300, "progress_copy_ms": 1000,
  "js_route_kb": {{JS_KB}}, "cold_start_ms": {{COLD_START_MS}},
  "frame_ms_60hz": 16.7, "frame_ms_120hz": 8.3,
  "contrast_text": 4.5, "contrast_large": 3, "contrast_ui": 3, "large_text_px": 24, "large_bold_text_px": 18.66,
  "target_ios_pt": 44, "target_android_dp": 48, "target_pointer_min_px": 24,
  "thumb_zone_pct": 40
}
~~~

| Budget | Keys | Measured on | Enforced by |
|---|---|---|---|
| Core Web Vitals, p75 | lcp_ms, inp_ms, cls; tbt_ms is the lab stand-in for INP | Mid-tier Android over 4G | Lighthouse CI (lab) + web-vitals RUM (field, the only place INP exists) |
| Input feedback | feedback_ms | Core journey under 4x CPU throttle | audit-ux (Event Timing) |
| Loading indicator | indicator_delay_ms (nothing before it); progress_copy_ms (specific copy after it) | Every async state | States gallery + review |
| JS per route (gzip) | js_route_kb | Every route | size-limit |
| Frame time | frame_ms_60hz, frame_ms_120hz | Scroll through the scale seed on {{LOW_END_DEVICE}} | Profiler |
| Cold start (mobile) | cold_start_ms, to interactive | {{LOW_END_DEVICE}} | Release checklist |
| Contrast (WCAG 2.2 AA) | contrast_text; contrast_large at large_text_px, or large_bold_text_px when bold; contrast_ui for UI parts | Both themes | audit-computed + /specimen |
| Targets | target_ios_pt, target_android_dp; web touch = --touch-min in tokens.css; pointer-only dense UI never below target_pointer_min_px | Every interactive element | audit-computed, audit-ux |
| Thumb zone | thumb_zone_pct: the primary action's centre sits in this bottom share of the phone viewport | Every phone surface | audit-ux |
| Keyboard, screen reader | Every action reachable, focus visible, every control named with role and state | Core journeys | e2e + manual VoiceOver / TalkBack |
| Scaling, motion | 200% zoom and the largest Dynamic Type survive; a reduced-motion variant for every animation | States gallery | Review + audit-ux |
```

```file path="lighthouserc.cjs"
// Run: npx lhci autorun --config=./lighthouserc.cjs · numbers come from .offthemode/BUDGETS.md, never typed here
const fs = require("node:fs");
const b = JSON.parse(fs.readFileSync(".offthemode/BUDGETS.md", "utf8").match(/~~~json\n([\s\S]*?)\n~~~/)[1]);
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

```file path="scripts/kit-lint.sh"
#!/usr/bin/env bash
# Pre-commit. (1) Raw ms / s / px values outside their owner files. (2) Always-loaded context over budget.
# Owners: tokens.css (motion, type, space) · .offthemode/BUDGETS.md (performance, interaction, accessibility) · .offthemode/PRODUCT.md (time to value) · AGENTS.md Commands (viewports).
cd "$(git rev-parse --show-toplevel)" || exit 1
fail=0
re='(^|[^0-9.a-zA-Z_-])([2-9]|[1-9][0-9]+)(\.[0-9]+)? ?(ms|px|s)([^a-zA-Z]|$)'
files="$(ls CLAUDE.md .offthemode/DESIGN.md .offthemode/VOICE.md .offthemode/ROUTES.md .offthemode/COMPLEXITY.md prompts/*.md .claude/commands/*.md {{UI_DIR}}/AGENTS.md {{API_DIR}}/AGENTS.md 2>/dev/null)"
hits="$( { [ -n "$files" ] && grep -nE "$re" $files /dev/null; grep -nE "$re" AGENTS.md /dev/null | grep -v 'viewports'; } 2>/dev/null )"
if [ -n "$hits" ]; then printf 'Raw values outside their owner files; refer by name ("--dur-quick", "feedback_ms in BUDGETS.md"):\n%s\n' "$hits" >&2; fail=1; fi
budget_kb={{CONTEXT_BUDGET_KB}}   # always loaded: global + project rules, imports, and the SessionStart injection
set -- "$HOME/.claude/CLAUDE.md" CLAUDE.md AGENTS.md .offthemode/GLOSSARY.md .offthemode/LESSONS.index.md .offthemode/SECURITY.md .offthemode/STATE.md
total=$(( $(cat "$@" 2>/dev/null | wc -c) + $(head -n 30 .offthemode/PRODUCT.md 2>/dev/null | wc -c) + $(tail -n 15 .offthemode/LOG.md 2>/dev/null | wc -c) ))
if [ $((total / 1024)) -gt "$budget_kb" ]; then
  echo "Always-loaded context is $((total / 1024)) KB against a ${budget_kb} KB budget. Biggest:" >&2
  wc -c "$@" 2>/dev/null | sort -rn | sed -n '2,5p' >&2; fail=1
fi
exit $fail
```

> **Trap:** A clean axe run doesn't make a product accessible, because automated tools catch only a minority of real issues. Once per release, do one keyboard-only pass and one screen-reader pass through the moment-of-value flow. The agent writes the script, and you run it.
