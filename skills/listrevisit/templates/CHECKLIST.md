# Checklist · {{?PROJECT_NAME}}
Last revisit: {{DATE}} · Verified {{V}}/{{TOTAL}}

A map, not a gate. Build in any order; /listrevisit reconciles and updates this file.
Marks: [ ] todo · [~] in progress · [x] built, not proven · [v] verified, evidence cited · [-] dropped, reason kept
Verify: early = can be proven on its own · on completion = only an end-to-end run proves it

## Vision (owned by .offthemode/PRODUCT.md; do not edit here)
- Thesis: {{?THESIS}}
- Moment of value: {{?MOMENT_OF_VALUE}}
- Core concept: {{?CORE_CONCEPT}}

## Fragments

### F1 · {{FRAGMENT_NAME}} · depends on: {{none | F#}} · Verify: {{early | on completion}}
For the person: {{what they can now do, in their words}}
- [ ] F1.1 {{capability}} · done when: {{a test by name | a number against RULES.md §Budgets | a named state you can screenshot | an end-to-end run with real inputs}} · guide: {{the RULES.md §Guides entry that applies | none}} · evidence:
- [ ] F1.2 {{capability}} · done when: {{...}} · evidence:
- [ ] F1.Q Quality bars met for F1 · evidence:

## Foundation (keep only what this product needs)
- [ ] B1 Rules and memory in place: .offthemode/RULES.md and STATE.md filled · done when: a fresh session can say what the project is and what's next · evidence:
- [ ] B2 Ready to host: deploy target decided, config checked at startup, forward-only migrations · done when: a preview deploy starts and serves the core journey · evidence:
- [ ] B3 (UI) Visual language locked: design tokens and a page showing every component state · done when: that page passes the audit in light and dark · evidence:
- [ ] B4 (UI) Every screen and state exists · done when: every flow can be walked with no dead ends · evidence:

## Quality bars (each fragment's .Q item checks these; numbers live in RULES.md §Budgets, commands in RULES.md §Commands)
Delete a bar only with a one-line reason. (UI) and (native) bars go when the product has no UI or no native app.
Correctness
- The core journey passes end to end with real inputs · end-to-end command
- Model-driven or data-driven core: the eval set passes and no case regressed · evals command
- Every failure path returns a clear error and leaves data consistent; retries are safe
Speed
- Response and load times inside the budgets, with realistic data volume · audit command
- Every new dependency has a size and a reason in DECISIONS.md · bundle size command
- (UI) No layout shift on load or when data arrives
- (UI) Every section looked at on phone, tablet and wide screens: grids fill their rows, nothing orphaned, clipped or overflowing
- (native) The heaviest interaction holds its frame budget in a profile build
Experience
- (UI) Every screen has empty, loading, error, offline and no-permission states, each with one next action
- (UI) Undo instead of confirm; state survives reload and back; the core job works by keyboard only and by touch only
- Errors, logs and messages say what happened and what to do next
Code
- Types, lint and tests green with zero warnings · full check command
- No dead code, unused exports or unused dependencies · dead code command
- One way to do each thing; no duplicate helpers
- No commented-out code, no stray debug output, no TODO without an item id from this file
- No file over {{MAX_FILE_LINES | 400}} lines and no function over {{MAX_FN_LINES | 60}} lines without a reason written beside it
Safety
- Authorization checked on the server for every action; input validated at every boundary; no secret in the repo or the bundle

## Changes
- {{DATE}} · created from {{PLAN_SOURCE}}
