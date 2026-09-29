## Product-First Doctrine
<!-- origin: added -->

> **Output:** five written product decisions with evidence, the product rules in `~/.claude/CLAUDE.md` §Product first, the UX contract in `.offthemode/PRODUCT.md` with a script assertion per property, and a mapped moment of value.

This is not a phase. It's the lens applied before the rules are final and again at every gate. Ask for "a project management app" and you get the most common one. Pin the request to one person, one moment and one job, and the recalled answer stops fitting, so the model has to derive a product instead of retrieving one.

| Decision | Reject | Usable |
|---|---|---|
| Person (who, in what situation, with what open) | "Creators", "teams" | "Solo podcast editor, 1am, 3 raw files, 9am deadline" |
| Job (when __, I want __, so I can __) | "Manage content" | "When a raw take lands, I want dead air gone, so I can publish tonight" |
| Moment of value (and time to reach it) | "After onboarding" | "Waveform collapses to the clean cut within 40 s of the drop, no signup" |
| The one thing (10x better than anything else) | Six strengths | One sentence; everything else is parity or absent |
| Refusals (what it won't do, even when asked) | Nothing | "No multitrack mixing. No collaboration in v1." |

Every decision carries its evidence: **observed** (you watched someone do it), **heard** (someone told you), or **assumed**. Each assumed Person, Job or Moment row is copied into RISKS.md, because every downstream template treats PRODUCT.md as fact, and a fictional person makes every later gate pass for the wrong reason.

Each decision also becomes a technical constraint. "40 s, no signup" means anonymous sessions, resumable uploads and streamed results, written into PRODUCT.md §Tech consequences so P4 inherits them. Agents help by adding, and the global rules (P0) push back: no feature without a job, ideas arrive as ranked bets, the design that asks fewer questions wins, and any conflicting PRODUCT.md line gets quoted before acting. That quoting rule turns a vague value into a lookup, which models do reliably.

"Top of the game" UX has to be testable, or the agent can't aim at it. An agent driving a browser can't measure a 100 ms tap (one tool round-trip takes longer than that) and "one-handed" isn't observable, so each property gets a script assertion. The numbers live in `.offthemode/BUDGETS.md` and nowhere else.

| Property | Spec | Verify by |
|---|---|---|
| Speed | Input feedback, LCP, INP and CLS inside BUDGETS.md on a mid-tier phone; no loading indicator before the BUDGETS.md indicator delay | `audit-ux`: Event Timing max duration on the core journey under 4x CPU throttle; Lighthouse CI in the lab (TBT stands in for INP, which only exists in the field); web-vitals RUM after launch |
| Optimistic + undo | Mutations render instantly and roll back inline; confirm only effects that leave the system | e2e: `context.setOffline(true)` mid-action, assert rollback and inline undo; every confirm dialog is listed in PRODUCT.md with its reason |
| Zero dead ends | Every empty, error, offline, 404 and no-permission state has one next action | State-switcher screenshots of every state; Walk Every Flow |
| Keyboard / thumb first | Palette and visible shortcuts on web; the primary action in the BUDGETS.md thumb zone on phones | e2e runs the core job keyboard-only; `audit-ux` asserts exactly one visible `[data-primary]` per surface, its centre inside the thumb zone and its box at least the target size |
| State survives | View state in the URL, drafts autosave, reload and back return to the same place | e2e reloads at every core-flow step and compares URL and visible state |
| Respect attention | No nags, marketing modals or interstitials | e2e fails on any dialog or overlay the test didn't trigger |

```prompt title="Feature Kill List"
Read .offthemode/PRODUCT.md and .offthemode/COMPLEXITY.md. Inventory every user-facing capability in {{SCOPE: codebase | roadmap | spec at PATH}}.
One row each: Capability | Job served (quote PRODUCT.md, or NONE) | Serves the one thing? | Actions it adds to default surfaces | Evidence of use | Verdict.
Verdicts: CORE (produces the moment of value; keep and deepen), PARITY (expected; minimal version, move to L2/L3), DEFER (plausible, no evidence; remove and log under Bets with a kill criterion), KILL (no job, contradicts a Refusal, or duplicates a path). When torn, pick the harsher verdict and say so.
Then: default-surface action count before and after, and a deletion plan (routes, components, flags, columns, tests) ordered so nothing breaks. Delete nothing until I approve.
```

```prompt title="Moment of Value Map"
Map the path from first contact ({{LANDING_PAGE | STORE_INSTALL | SHARED_LINK | INVITE}}) to {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), walking it as {{?PERSON}} on {{?DEVICE}} with {{CONTEXT: one hand, flaky 4G, ninety seconds of patience}}. If the app runs, drive it with the browser or simulator tool and time it with the audit-ux journey; otherwise walk the spec.
Per step: what they see, decide, type, wait for, and what could make them leave. Totals: steps, decisions, inputs, wait, time to first wow against the PRODUCT.md budget.
Redesign to hit the budget, naming the mechanism behind every cut: defer (account after value), infer (locale, currency, intent from entry point or pasted content), default (the 80% option, changeable in context), preload (sample or imported data), parallelize (start work during the previous step).
Output the new path, new totals and each cut's tech consequences; append those to PRODUCT.md §Tech consequences.
```
