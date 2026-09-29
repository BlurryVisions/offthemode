---
name: listrevisit
description: "View or update the project checklist in .offthemode/CHECKLIST.md, or build it after planning. Use when the user says \"/listrevisit\", asks where the project stands, or wants to add a new feature or idea to the plan. Edits only the checklist, never code."
license: MIT
argument-hint: "[empty for status, or a new feature, idea or change]"
---

# Off the Mode · list revisit

Input: {{?NOTE: empty for status, or a new feature, idea or change}}. Edit only `.offthemode/CHECKLIST.md`: never code, never other files.

## If the checklist is missing or still the unfilled template, build it
1. Read the plan: `.offthemode/PRODUCT.md`, or the plan file the user names.
2. Split the core concept into fragments: the separate pieces of the core a user would notice, usually 3 to 8. A fragment cuts through every layer it needs; "the API for F2" is not a fragment. For each: what it does for the person, what it depends on, and Verify: early (it can be proven on its own) or on completion (only an end-to-end run proves it).
3. Give each fragment 2 to 6 items with a provable "done when": a test by name, a number against RULES.md §Budgets, a named state you can screenshot, or an end-to-end run with real inputs. Reject "works", "clean" and "fast".
4. Keep only the foundation items and quality bars this product needs; delete the rest with a one-line reason each. Point every bar at a command from RULES.md §Commands.
5. Order: dependencies first, then the fragment nearest the moment of value.
Show the user the fragments in order, one line each, and wait for their ok. Then write the file, with anything already built marked [x], never [v].

## Otherwise
1. Reconcile: map the git log and diff since the header's "Last revisit" to items. Work that matches no item is Untracked.
2. Verify: for every [~] and [x] item, find its evidence and run the cheap checks from RULES.md §Commands. Promote to [v] only with evidence you can cite; demote a [v] whose evidence broke, and say why. An on-completion fragment stays unverified until its end-to-end check passes.
3. If there is a note: say which fragment it belongs to or that it's new, which job in PRODUCT.md it serves (if none, ask before adding), and what it disturbs (data model, screens, budgets, other fragments, anything already [v]). Show the change to the list: added, changed, dropped (dropped items stay as [-] with the reason). Wait for their ok, apply it, and add one line per change under ## Changes. If the vision or architecture must change too, name the file and stop there.
4. Update the header: "Last revisit" and the verified count.

Reply in at most 25 lines: progress per fragment with its Verify mode (F2 ■■■□□ 3/5 · on completion), what moved since last time and why, untracked work, risks (failing bars, items stuck at [x], blocked fragments), and the next 3 items.

## Files
- The user's note, if any, is whatever they typed after the command.
- Templates are in `templates/` next to this file: `templates/CHECKLIST.md`.
