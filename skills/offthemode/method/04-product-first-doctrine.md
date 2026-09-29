## Product-First Doctrine

> **Output:** five product decisions with their evidence in `.offthemode/PRODUCT.md`, the product rules in RULES.md §Product first, the experience promises in PRODUCT.md with a script check for each, hypotheses copied into `.offthemode/RISKS.md`, and a mapped path to the moment of value.

This is not a phase. It is the lens applied before the rules are final and again at every gate. Ask for "a project management app" and you get the most common one. Pin the request to one person, one moment and one job, and the remembered answer stops fitting, so the model has to work out a product instead of retrieving one.

### The five decisions

| Decision | Reject | Usable |
|---|---|---|
| Person (who, in what situation, with what open) | "Creators", "teams" | "Solo podcast editor, 1am, 3 raw files, 9am deadline" |
| Job (when __, I want __, so I can __) | "Manage content" | "When a raw take lands, I want dead air gone, so I can publish tonight" |
| Moment of value (and the time to reach it) | "After onboarding" | "Waveform collapses to the clean cut within 40 s of the drop, no signup" |
| The one thing (PRODUCT.md §Core concept: what it does 10x better than anything else) | Six strengths | One sentence; everything else is parity or absent |
| Refusals (what it won't do, even when asked) | Nothing | "No multitrack mixing. No collaboration in v1." |

Every decision carries its evidence: **observed** (you watched someone do it), **heard** (someone told you), or **hypothesis** (a guess, written down so it can be checked). Write a hypothesis as "I think X, because Y", then confirm it in the code, the docs or by asking a real person. Copy each hypothesis in the Person, Job or Moment rows into RISKS.md. Every later guide treats PRODUCT.md as fact, so a made-up person makes every later gate pass for the wrong reason.

> **Rule:** Nothing is built on a hypothesis until it is confirmed.

### Each decision is also a technical constraint

"40 s, no signup" means anonymous sessions, resumable uploads and streamed results. Write each consequence into DECISIONS.md with the PRODUCT.md line it comes from, so backend work (P4) inherits it instead of rediscovering it.

AI tools help by adding. RULES.md §Product first pushes back: no feature without a job, new ideas arrive as ranked bets, the design that asks the person fewer questions wins, and any PRODUCT.md line that conflicts with a request gets quoted before your AI acts.

> **Why:** The quoting rule turns a vague value into a lookup. Models look things up reliably; they apply vague values unreliably.

### Make the experience testable

"Top of the game" UX has to be testable, or your AI cannot aim at it. An AI driving a browser cannot measure a 100 ms tap, because one tool round-trip takes longer than that, and "one-handed" is not something it can observe. So each property gets a script check: code that measures it and passes or fails. PRODUCT.md §Experience promises says what each promise is. RULES.md §Budgets holds every number the checks enforce, including the time to the moment of value, and nowhere else, so a number changes in one place.

The checks below use two project scripts your AI writes. `audit-ux` drives the core journey in a real browser and measures it. The e2e (end-to-end) tests act like a person using the whole app.

| Property | Spec | Verify by |
|---|---|---|
| Speed | Input feedback, LCP, INP and CLS inside RULES.md §Budgets on a mid-tier phone; no loading indicator before the indicator delay in §Budgets | `audit-ux`: Event Timing max duration on the core journey under 4x CPU throttle; Lighthouse CI in the lab (TBT stands in for INP, which only exists in the field); web-vitals RUM after launch |
| Optimistic + undo | Changes show instantly and roll back inline if they fail; confirm only actions whose effects leave the system | e2e: `context.setOffline(true)` mid-action, assert rollback and inline undo; every confirm dialog is listed in PRODUCT.md with its reason |
| Zero dead ends | Every empty, error, offline, 404 and no-permission state has one next action | Screenshots of every state through a state switcher; Walk Every Flow |
| Keyboard / thumb first | Command palette and visible shortcuts on web; the primary action inside the thumb zone from §Budgets on phones | e2e runs the core job keyboard-only; `audit-ux` asserts exactly one visible `[data-primary]` per surface, its centre inside the thumb zone and its box at least the target size |
| State survives | View state in the URL, drafts autosave, reload and back return to the same place | e2e reloads at every core-flow step and compares URL and visible state |
| Respect attention | No nags, marketing modals or interstitials | e2e fails on any dialog or overlay the test didn't open |

The web measures, in plain words: LCP (Largest Contentful Paint) is when the main content appears; INP (Interaction to Next Paint) is how fast the page responds to a tap or key; CLS (Cumulative Layout Shift) is how much the layout jumps; TBT (Total Blocking Time) is how long the page is too busy to respond during a lab test; RUM (real-user monitoring) measures real visitors after launch.

> **Trap:** A promise with no check is a wish. If a property cannot be measured by a script, rewrite it until it can, or cut it.

### Prompts

```prompt title="Feature Kill List"
Read .offthemode/PRODUCT.md, and .offthemode/COMPLEXITY.md if it exists. Inventory every user-facing capability in {{SCOPE: codebase | roadmap | spec at PATH}}.
One row each: Capability | Job served (quote PRODUCT.md, or NONE) | Serves the one thing? | Actions it adds to default surfaces | Evidence of use | Verdict.
Verdicts: CORE (produces the moment of value; keep and deepen), PARITY (expected; minimal version, moved to a secondary layer), DEFER (plausible, no evidence; remove it and log it in .offthemode/DECISIONS.md as a bet with a kill criterion), KILL (no job, contradicts a Refusal, or duplicates a path). When torn, pick the harsher verdict and say so.
Then: the default-surface action count before and after, and a deletion plan (routes, components, flags, columns, tests) ordered so nothing breaks. Show me the plan and change nothing until I say go.
```

```prompt title="Moment of Value Map"
Map the path from first contact ({{ENTRY: landing page | store install | shared link | invite}}) to {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), walking it as {{?PERSON}} on {{?DEVICE}} with {{CONTEXT: one hand, flaky 4G, ninety seconds of patience}}. If the app runs, drive it with your browser or simulator tool and time it with the project's audit-ux journey if there is one; otherwise walk the spec.
Per step: what they see, decide, type, wait for, and what could make them leave. Totals: steps, decisions, inputs, wait, and time to first wow against the time-to-value in RULES.md §Budgets.
Redesign to hit the budget, naming the mechanism behind every cut: defer (account after value), infer (locale, currency, intent from the entry point or pasted content), default (the 80% option, changeable in context), preload (sample or imported data), parallelize (start work during the previous step).
Show the new path, the new totals and each cut's technical consequences. After my go, append each consequence to .offthemode/DECISIONS.md with the PRODUCT.md line it serves.
```
