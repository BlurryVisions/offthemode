## Living Checklist

> **Output:** `.offthemode/CHECKLIST.md`: the core concept split into fragments, each item with a provable done-when, kept true by one command, `listrevisit`.

Your core concept lives in PRODUCT.md §Core concept, written during P1. The checklist breaks it into **fragments**: the separate pieces of the core, finished one after another. Each fragment has a few items, and each item says how you will know it is done. The file is a map, not a gate. Sessions stay free-form and nothing has to be ticked while you work, because `listrevisit` catches up afterwards by reading what changed in git.

**One command, checklist only.** `listrevisit` builds the checklist the first time, when the file is missing or still the blank template. After that, run it on its own to see where you stand, or with a note (`listrevisit add CSV export to reports`) to change the list. Type `/listrevisit` with the skills pack, `/mcp__offthemode__listrevisit` through the link in Claude Code, or just say "list revisit". It edits only .offthemode/CHECKLIST.md, never code or other docs. If a change also affects the vision or the architecture, it names the doc to update and leaves that to you.

**It talks first.** Every run starts with a report: what it found and exactly what it would change in the file. Nothing is written until you say go. Then it applies the change and tells you what it did.

| You run | It reports | After your go |
|---|---|---|
| `listrevisit` with no checklist yet | The core concept split into fragments, in build order, one line each | Writes the file; anything already built is marked `[x]`, never `[v]` |
| `listrevisit` | Commits since the last revisit mapped to items, the results of the cheap checks, each mark it would move with its evidence, and work that matches no item | Updates the marks, the header and the verified count |
| `listrevisit <idea or change>` | The fragment it belongs in (or a new one), the job in PRODUCT.md it serves, what it disturbs, and the exact diff to the list | Applies the diff and logs one line per change |

> **Rule:** An item is marked verified only with evidence the command can cite: a passing test by name, a measured number, a screenshot, a commit. "Built" and "verified" are separate marks, because the gap between them is where AI tools claim done.

**When a fragment can be verified depends on the product.** Some fragments can be proven on their own, early: a hard interaction, a speed limit, a platform constraint. Many can't. An AI data analyst only proves itself end to end: a real question goes in, correct SQL runs, the right answer comes out, and that needs the whole chain to exist. So each fragment says `Verify: early` or `Verify: on completion`. An on-completion fragment's done-when is an end-to-end run with real inputs (for a model-driven core, the eval set passing). Neither mode is better; the checklist just records which one each fragment is.

**The elite bar.** Every fragment ends with one item, "quality bars met". The bars cover correctness, speed, experience, code and safety, and each names the command in RULES.md §Commands that measures it. Bars that don't apply get deleted with a reason: a backend-only product drops the UI ones. The numbers live in RULES.md §Budgets and nowhere else, so a threshold changes in one place. `listrevisit` measures what it can and says plainly what it couldn't measure, instead of calling it passing.

> **Why:** A free-form session is good at momentum and bad at memory. The checklist is the memory, and `listrevisit` is the one step that has to be honest, so it runs checks instead of trusting claims.

The file starts from the CHECKLIST.md template (from get_template or the skill's templates/ folder). It has these parts:

| Part | What it holds |
|---|---|
| Header | The date of the last revisit and the verified count, for example "Verified 7/19" |
| Marks | `[ ]` todo · `[~]` in progress · `[x]` built, not proven · `[v]` verified, evidence cited · `[-]` dropped, reason kept |
| Vision | Thesis, moment of value and core concept, read from PRODUCT.md and never edited here |
| Fragments | F1, F2 and on: what each one does for the person, what it depends on, its Verify mode, 2-6 items, and a closing quality item (F1.Q) |
| Foundation | Only what this product needs: rules and state load at every session start; the app is host-ready (deploy target chosen, environment checked at boot, forward-only migrations); for a product with a UI, the visual language is locked and every route and state exists |
| Quality bars | The elite bar that every .Q item checks |
| Changes | One dated line per change to the list |

A fragment in a filled checklist reads like this:

```text
F2 · Ask in plain words, get the right number · depends on: F1 · Verify: on completion
For the person: ask a question about their own sales data and get the answer, with the query behind it
- [v] F2.1 Question becomes SQL · done when: evals/sql passes 27 of 30, no case regressed · evidence: eval run 2026-09-12, commit 4f2a9c1
- [x] F2.2 Answer shown with its query · done when: state "answer-with-sql" screenshotted at phone and wide widths · evidence:
- [ ] F2.Q Quality bars met for F2 · evidence:
```

The quality bars, trimmed to what the product needs. "(UI)" bars go when there is no interface, "(native)" bars when there is no native app.

| Area | The bar |
|---|---|
| Correctness | The core journey passes end to end with real inputs. A model-driven or data-driven core passes its eval set with no case regressed. Every failure path returns a clear error, leaves data consistent and is safe to retry |
| Speed | Response and load times inside RULES.md §Budgets at realistic data volume. Every new dependency has a size and a reason in DECISIONS.md. (UI) No layout shift on load or when data arrives. (native) The heaviest interaction holds its frame budget in a profile build |
| Experience | (UI) Every screen has empty, loading, error, offline and no-permission states, each with one next action. (UI) Undo instead of confirm; state survives reload and back; the core job works keyboard-only and touch-only. Errors, logs and messages say what happened and what to do next (.offthemode/VOICE.md) |
| Code | Types, lint and tests green with zero warnings. No dead code, unused exports or unused dependencies. One way to do each thing (data access, state, errors, config), no duplicate helpers. No commented-out code, no stray debug output, no TODO without an item id from the checklist. No file or function over the size limits in RULES.md without a reason written beside it |
| Safety | Authorization checked on the server for every action; inputs validated at the boundary; no secret in the repo or the bundle (.offthemode/SECURITY.md) |

The command runs the steps below. In a tool without the skills pack or the link, paste this prompt instead.

```prompt title="List Revisit"
List revisit on .offthemode/CHECKLIST.md. Input: {{?NOTE: empty for status, or a new feature, idea or change}}. Edit only .offthemode/CHECKLIST.md: never code, never other docs. Talk first: report what you found and the exact change to the file, wait for my go, then apply it and say what you changed.

If .offthemode/CHECKLIST.md is missing or still the blank template, build it:
1. Read the plan: .offthemode/PRODUCT.md, plus .offthemode/SKELETON.md and .offthemode/ROUTES.md if they exist, or the plan file I name.
2. Split the core concept into fragments: the separate pieces of the core a user would notice, usually 3-8. A fragment cuts through every layer it needs; "the API for F2" is not a fragment. For each: what it does for the person, what it depends on, and Verify: early (it can be proven on its own) or on completion (only an end-to-end run proves it).
3. Give each fragment 2-6 items with a provable "done when": a test by name, a number against RULES.md §Budgets, a named state you can screenshot, or an end-to-end run with real inputs. Reject "works", "clean" and "fast".
4. Keep only the foundation items and quality bars this product needs; delete the rest with a one-line reason each. Point every bar at a command in RULES.md §Commands.
5. Order: dependencies first, then the fragment nearest the moment of value.
Show me the fragments in order, one line each, and wait for my go. Then write the file, with anything already built marked [x], never [v].

Otherwise:
1. Reconcile: map git log and diff since the header's "Last revisit" to items. Work that matches no item is Untracked.
2. Verify: for every [~] and [x] item, find its evidence and run the cheap checks from RULES.md §Commands. Propose [v] only with evidence you can cite; propose demoting a [v] whose evidence broke, and say why. An on-completion fragment stays unverified until its end-to-end check passes.
3. If there is a note: say which fragment it belongs to or that it is new, which job in .offthemode/PRODUCT.md it serves (if none, ask before adding), and what it disturbs (data model, routes, budgets, other fragments, anything already [v]). Show the diff to the list: added, changed, dropped (dropped items stay as [-] with the reason). If the vision or architecture must change too, name the doc and stop there.
Report in at most 25 lines: progress per fragment with its Verify mode (F2 ■■■□□ 3/5 · on completion), what would move since last time and why, Untracked work, risks (failing bars, items stuck at [x], blocked fragments), the proposed diff, and the next 3 items. Then wait for my go.
After my go: apply the marks and the diff, log one line per list change under ## Changes, update the header ("Last revisit" and the verified count), and say what you changed.
```
