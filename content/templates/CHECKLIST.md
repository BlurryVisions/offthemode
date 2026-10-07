# Checklist · {{?PROJECT_NAME}}
Last revisit: {{?DATE}} · Verified {{?V}}/{{?TOTAL}}

A map, not a gate. Fragments are listed in build order and Foundation items are placed by phase: keep to that order when you can. When you work in another order, /revisit-checklist catches up and updates this file.
Marks: [ ] todo · [~] in progress · [x] built, not proven · [v] verified, evidence cited · [-] dropped, reason kept
Verify: early = can be proven on its own · on completion = only an end-to-end run proves it

## Vision (owned by .offthemode/PRODUCT.md; do not edit here)
- Thesis: {{?THESIS}}
- Moment of value: {{?MOMENT_OF_VALUE}}
- Core concept: {{?CORE_CONCEPT}}

## Fragments

### F1 · {{?FRAGMENT_NAME}} · depends on: {{?none, or the F# and B# ids it needs}} · Verify: {{?early or on completion}}
For the person: {{?what they can now do, in their words}}
- [ ] F1.1 {{?capability}} · done when: {{?a test by name, a number against a key in RULES.md §Budgets, a named state you can screenshot, or an end-to-end run with real inputs}} · guide: {{?the RULES.md §Guides entry that applies, or none}} · evidence:
- [ ] F1.2 {{?capability}} · done when: {{?...}} · guide: {{?...}} · evidence:
- [ ] F1.Q Quality bars met for F1 · evidence:

## Foundation (keep only what this product needs; each goes in its phase: B1 first, B2 to B4 before the fragments that depend on them, B5 and B6 before launch)
- [ ] B1 Rules and memory in place: .offthemode/RULES.md and STATE.md filled · done when: a fresh session can say what the project is and what's next · guide: p0-constitution · evidence:
- [ ] B2 Ready to host: deploy target decided, config checked at startup, forward-only migrations · done when: a preview deploy starts and serves the core journey · guide: p4-backend-infra · evidence:
- [ ] B3 (UI) Visual language locked: design tokens and a page showing every component state · done when: that page passes the audit in light and dark · guide: p3-visual-language · evidence:
- [ ] B4 (UI) Every screen and state exists · done when: every flow can be walked with no dead ends · guide: p5-navigation-flows · evidence:
- [ ] B5 Security audit before launch: the P7 audit run on the finished core, each accepted finding fixed with a regression test · done when: the audit reports no open high-severity finding · guide: p7-security-hardening · evidence:
- [ ] B6 Launch: the P8 launch checklist passed and the runbook written · done when: every launch checklist item is a pass with evidence, or not needed with its reason · guide: p8-ship-operate · evidence:

## Quality bars (each fragment's .Q item checks these; numbers are keys in RULES.md §Budgets, commands in RULES.md §Commands)
Delete a bar only with a one-line reason. (UI), (server) and (native) bars go when the product has no UI, no server or no native app.
Correctness
- The core journey passes end to end with real inputs · end-to-end command
- Model-driven or data-driven core: the eval set passes and no case regressed · evals command
- Every failure path returns a clear error and leaves data consistent; retries are safe
Speed
- Response and load times inside any speed keys in RULES.md §Budgets, with realistic data volume · audit command
- Every new dependency has a reason in DECISIONS.md
- (UI) No layout shift on load or when data arrives
- (UI) Every section checked at each of screenshot_sizes: grids fill their rows, nothing orphaned, clipped or overflowing
- (native) The heaviest interaction stays smooth in a profile build
Experience
- (UI) Every screen has empty, loading, error, offline and no-permission states, each with one next action
- (UI) Undo instead of confirm; state survives reload and back; the core job works by keyboard only and by touch only
- Errors, logs and messages say what happened and what to do next
Code
- Types, lint and tests green with zero warnings · full check command
- No dead code, unused exports or unused dependencies · dead code command
- One way to do each thing; no duplicate helpers
- No commented-out code, no stray debug output, no TODO without an item id from this file
- No file over max_file_lines and no function over max_fn_lines without a reason written beside it
Safety
- (server) Authorization checked on the server for every action
- Input validated at every boundary; no secret in the repo, the bundle or the logs

## Changes
- {{?DATE}} · created from {{?PLAN_SOURCE}}
