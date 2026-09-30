## Living Checklist

> **Output:** `.offthemode/CHECKLIST.md`: the core concept split into fragments, each item with a provable done-when, kept true by one command, `listrevisit`.

Your core concept lives in PRODUCT.md §Core concept, written during P1. The checklist breaks it into **fragments**: the separate pieces of the core, finished one after another. Each fragment has a few items, and each item says how you will know it is done. The file is a map, not a gate: fragments are listed in build order (what others depend on first, then the one nearest the moment of value), and you can still work on anything in any order. Sessions stay free-form and nothing has to be ticked while you work, because `listrevisit` catches up afterwards by reading what changed in git.

**One command, checklist only.** `listrevisit` builds the checklist the first time, when the file is missing or still the blank template. After that, run it on its own to see where you stand, or with a note (`listrevisit add CSV export to reports`) to change the list. Type `/listrevisit` with the skills pack, `/mcp__offthemode__listrevisit` through the link in Claude Code, or just say "list revisit". It edits only .offthemode/CHECKLIST.md, never code or other docs. If a change also affects the vision or the architecture, it names the doc to update and leaves that to you.

**It talks first.** Every run starts with a report: what it found and exactly what it would change in the file. Nothing is written until you say go. Then it applies the change and tells you what it did.

| You run | It reports | After your go |
|---|---|---|
| `listrevisit` with no checklist yet | The core concept split into fragments, in build order, one line each | Writes the file; anything already built is marked `[x]`, never `[v]` |
| `listrevisit` | Commits since the last revisit mapped to items, the results of the cheap checks, each mark it would move with its evidence, and work that matches no item | Updates the marks, the header and the verified count |
| `listrevisit <idea or change>` | The fragment it belongs in (or a new one), the job in PRODUCT.md it serves, what it disturbs, and the exact diff to the list | Applies the diff and logs one line per change |

> **Rule:** An item is marked verified only with evidence the command can cite: a passing test by name, a measured number, a screenshot, a commit. "Built" and "verified" are separate marks, because the gap between them is where AI tools claim done.

**When a fragment can be verified depends on the product.** Some fragments can be proven on their own, early: a hard interaction, a speed limit, a platform constraint. Many can't. An AI data analyst only proves itself end to end: a real question goes in, correct SQL runs, the right answer comes out, and that needs the whole chain to exist. So each fragment says `Verify: early` or `Verify: on completion`. An on-completion fragment's done-when is an end-to-end run with real inputs (for a model-driven core, the eval set passing). Neither mode is better; the checklist just records which one each fragment is.

**The elite bar.** Every fragment ends with one item, "quality bars met". The bars cover correctness, speed, experience, code and safety, and each names the command in RULES.md §Commands that measures it. Bars that don't apply get deleted with a reason: a backend-only product drops the UI ones. A number a bar checks is a key in RULES.md §Budgets, never written into the bar, so a threshold changes in one place; a bar whose key the product doesn't hold checks nothing numeric. `listrevisit` measures what it can and says plainly what it couldn't measure, instead of calling it passing.

> **Why:** A free-form session is good at momentum and bad at memory. The checklist is the memory, and `listrevisit` is the one step that has to be honest, so it runs checks instead of trusting claims.

The file starts from the CHECKLIST.md template (from get_template or the skill's templates/ folder). It has these parts:

| Part | What it holds |
|---|---|
| Header | The date of the last revisit and the verified count, for example "Verified 7/19" |
| Marks | `[ ]` todo · `[~]` in progress · `[x]` built, not proven · `[v]` verified, evidence cited · `[-]` dropped, reason kept |
| Vision | Thesis, moment of value and core concept, read from PRODUCT.md and never edited here |
| Fragments | F1, F2 and on: what each one does for the person, what it depends on, its Verify mode, its items (each with a provable done-when and the guide that applies), and a closing quality item (F1.Q) |
| Foundation | Only what this product needs, each item placed by its phase: rules and memory in place first; host-ready (deploy target chosen, config checked at startup, forward-only migrations), and for a product with a UI the visual language locked and every screen and state existing, before the fragments that depend on them; the security audit and the launch checklist before launch |
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

The bars themselves live in one place, the Quality bars part of the CHECKLIST.md template (from get_template or the skill's templates/ folder), so there is one copy to change. Trim them to what the product needs: "(UI)" bars go when there is no interface, "(native)" bars when there is no native app, each with a one-line reason.

The command runs the steps below. In a tool without the skills pack or the link, paste this prompt instead.

```prompt title="List Revisit"
# Off the Mode · list revisit

Input: the user's note, whatever they typed after the command. Empty means show the status; otherwise it is a new feature, idea or change. Edit only `.offthemode/CHECKLIST.md`: never code, never other files. Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did.

## If the checklist is missing or still the unfilled template, build it
1. Read the plan: `.offthemode/PRODUCT.md`, or the plan file the user names, and, if you were given a report from the reassess command, every note in it (each becomes an item).
2. Split the core concept into fragments: the separate pieces of the core a user would notice. A fragment cuts through every layer it needs; "the API for F2" is not a fragment. For each: what it does for the person, what it depends on, and Verify: early (it can be proven on its own) or on completion (only an end-to-end run proves it).
3. Give each fragment the items it needs to count as done, and no filler, each with a provable "done when": a test by name, a number against a key in RULES.md §Budgets, a named state you can screenshot, or an end-to-end run with real inputs. Reject "works", "clean" and "fast". Tag each item with the guide from RULES.md §Guides that applies, so whoever builds it opens the right one.
4. Keep only the foundation items and quality bars this product needs; delete the rest with a one-line reason each. Point every bar at a command from RULES.md §Commands.
5. Order: dependencies first (a fragment may depend on a Foundation item, B#, and Foundation items go in the order of their phase), then the fragment nearest the moment of value.
Show the user the fragments in order, one line each, and wait for their ok. Then write the file, with anything already built marked [x], never [v], and under ## Changes, what it was created from (for the reassess command's report, its one-line summary).

## Otherwise
1. Reconcile: map the git log and diff since the header's "Last revisit" to items. Work that matches no item, and any TODO in the code without a checklist id, is Untracked.
2. Verify: for every [~] and [x] item, find its evidence and run the cheap checks from RULES.md §Commands. Propose promoting to [v] only with evidence you can cite, and demoting a [v] whose evidence broke, with the reason. An on-completion fragment stays unverified until its end-to-end check passes.
3. If there is a note: say which fragment it belongs to or that it's new, which job in PRODUCT.md it serves (if none, ask in the report), and what it disturbs (data model, screens, budgets, other fragments, anything already [v]). Draft the change to the list: added, changed, dropped (dropped items stay as [-] with the reason). If the vision or architecture must change too, name the file and stop there.
4. Show one report: the status, the mark changes you would record and the note's change to the list. Wait for one go, then apply all of it: the marks, the list changes with one line each under ## Changes, and the header ("Last revisit" and the verified count).

Reply in at most 25 lines: progress per fragment with its Verify mode (F2 ■■■□□ 3/5 · on completion), what moved since last time and why, untracked work, risks (failing bars, items stuck at [x], blocked fragments), and the next 3 items.
```
