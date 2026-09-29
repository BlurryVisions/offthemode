## Living Checklist
<!-- origin: yours -->

> **Output:** `.offthemode/CHECKLIST.md`, created after P1 and kept true by one command, `/listrevisit`.

Your core concept is defined in P1. The checklist breaks it into **fragments**: the separate pieces of the core, finished one after another. Each fragment has a few items, and each item says how you'll know it's done. The file is a map, not a gate. Sessions stay free-form and nothing has to be ticked while you work, because `/listrevisit` catches up afterwards by reading what changed in git.

**One command, checklist only.** `/listrevisit` creates the checklist the first time. After that, run it bare to see where you stand, or with a note (`/listrevisit add CSV export to reports`) to change the list. It edits only .offthemode/CHECKLIST.md, never code or other docs. If a change also affects the vision or the architecture, it names the doc to update and leaves that to you.

| You run | It does |
|---|---|
| `/listrevisit` with no checklist yet | Splits the core concept into fragments, shows you the list, writes the file after your ok |
| `/listrevisit` | Maps commits since the last revisit to items, runs the cheap checks, updates marks with evidence, shows the status |
| `/listrevisit <idea or change>` | Places it in a fragment or a new one, shows what it affects, updates the list after your ok, logs the change |

> **Rule:** An item is marked verified only with evidence the command can cite: a passing test by name, a measured number, a screenshot, a commit. "Built" and "verified" are separate marks, because the gap between them is where agents claim done.

**When a fragment can be verified depends on the product.** Some fragments can be proven on their own, early: a hard interaction, a speed limit, a platform constraint. Many can't. An AI data analyst only proves itself end to end: a real question goes in, correct SQL runs, the right answer comes out, and that needs the whole chain to exist. So each fragment says `Verify: early` or `Verify: on completion`. An on-completion fragment's "done when" is an end-to-end run with real inputs (for a model-driven core, the eval set passing). Neither mode is better; the checklist just records which one each fragment is.

**The elite bar.** Every fragment ends with one item, "quality bars met". The bars cover correctness, speed, experience, code hygiene and safety, and each names the command that measures it. Bars that don't apply get deleted with a reason: a backend-only product drops the UI ones. Numbers live in BUDGETS.md, the single owner of every threshold. `/listrevisit` measures what it can and says plainly what it couldn't, instead of calling it passing.

> **Why:** A vibe session is good at momentum and bad at memory. The checklist is the memory, and `/listrevisit` is the one step that has to be honest, so it runs checks instead of trusting claims.

```file path=".offthemode/CHECKLIST.md"
# Checklist · {{PROJECT_NAME}}
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
- [ ] F1.1 {{capability}} · done when: {{a test by name | a number against BUDGETS.md | a named state you can screenshot | an end-to-end run with real inputs}} · evidence:
- [ ] F1.2 {{capability}} · done when: {{...}} · evidence:
- [ ] F1.Q Quality bars met for F1 · evidence:

## Foundation (keep only what this product needs)
- [ ] B1 Rules and context wired: AGENTS.md, hooks, STATE.md · done when: a fresh session prints STATE.md · evidence:
- [ ] B2 Host-ready: deploy target decided, env checked at boot, forward-only migrations · done when: a preview deploy boots and passes {{?ENV_CHECK_CMD}} · evidence:
- [ ] B3 (UI) Visual language locked: tokens v1 and /specimen · done when: the specimen passes the audit in both themes · evidence:
- [ ] B4 (UI) Every route and state exists · done when: Walk Every Flow reports zero dead ends · evidence:

## Quality bars (each fragment's .Q item checks these; numbers live in .offthemode/BUDGETS.md)
Delete a bar only with a one-line reason. (UI) and (native) bars go when the product has no UI or no native app.
Correctness
- The core journey passes end to end with real inputs · {{?E2E_CMD}}
- Model-driven or data-driven core: the eval set passes and no case regressed · {{?EVAL_CMD}}
- Every failure path returns a clear error and leaves data consistent; retries are safe
Speed
- Response and load times inside BUDGETS.md under realistic data volume · {{?AUDIT_CMD}}
- Every new dependency has a size and a reason in DECISIONS.md · {{?BUNDLE_CMD}}
- (UI) No layout shift on load or when data arrives
- (native) The heaviest interaction holds its frame budget in a profile build · {{?PROFILE_CMD}}
Experience
- (UI) Every screen has empty, loading, error, offline and no-permission states, each with one next action
- (UI) Undo instead of confirm; state survives reload and back; the core job works keyboard-only and touch-only
- Errors, logs and messages say what happened and what to do next (.offthemode/VOICE.md)
Code
- Types, lint and tests green with zero warnings · {{?CHECK_FULL_CMD}}
- No dead code, unused exports or unused dependencies · {{?DEADCODE_CMD}}
- One way to do each thing (data access, state, errors, config); no duplicate helpers
- No commented-out code, no stray debug output, no TODO without an item id from this file
- No file over {{MAX_FILE_LINES}} lines and no function over {{MAX_FN_LINES}} without a reason written beside it
Safety
- Authorization checked on the server for every action; inputs validated at the boundary; no secret in the repo or the bundle (.offthemode/SECURITY.md)

## Changes
- {{DATE}} · created from {{PLAN_SOURCE}}
```

```prompt title="List Revisit"
List revisit on .offthemode/CHECKLIST.md. Input: {{?NOTE: empty for status, or a new feature, idea or change}}. Edit only .offthemode/CHECKLIST.md: never code, never other docs.

If .offthemode/CHECKLIST.md is missing or still the unfilled template, build it:
1. Read the plan: .offthemode/PRODUCT.md, .offthemode/SKELETON.md, .offthemode/ROUTES.md, or the plan file I name.
2. Split the core concept into fragments: the separate pieces of the core a user would notice, usually 3-8. A fragment cuts through every layer it needs; "the API for F2" is not a fragment. For each: what it does for the person, what it depends on, and Verify: early (it can be proven on its own) or on completion (only an end-to-end run proves it).
3. Give each fragment 2-6 items with a provable "done when": a test by name, a number against BUDGETS.md, a named state you can screenshot, or an end-to-end run with real inputs. Reject "works", "clean" and "fast".
4. Keep only the foundation and quality bars this product needs; delete the rest with a one-line reason each. Point every bar at a command from AGENTS.md Commands.
5. Order: dependencies first, then the fragment nearest the moment of value.
Show me the fragments in order, one line each, and wait for my ok. Then write the file, with anything already built marked [x], never [v].

Otherwise:
1. Reconcile: map git log and diff since the header's "Last revisit" to items. Work that matches no item is Untracked.
2. Verify: for every [~] and [x] item, find its evidence and run the cheap checks from AGENTS.md Commands. Promote to [v] only with evidence you can cite; demote a [v] whose evidence broke, and say why. An on-completion fragment stays unverified until its end-to-end check passes.
3. If there is a note: say which fragment it belongs to or that it is new, which job in .offthemode/PRODUCT.md it serves (if none, ask before adding), and what it disturbs (data model, routes, budgets, other fragments, anything already [v]). Show the diff to the list: added, changed, dropped (dropped items stay as [-] with the reason). Wait for my ok, apply it, and log one line per change under ## Changes. If the vision or architecture must change too, name the doc and stop there.
4. Update the header: "Last revisit" and the verified count.
Reply in at most 25 lines: progress per fragment with its Verify mode (F2 ■■■□□ 3/5 · on completion), what moved since last time and why, Untracked work, risks (failing bars, items stuck at [x], blocked fragments), and the next 3 items.
```
