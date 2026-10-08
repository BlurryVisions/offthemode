---
name: revisit-checklist
title: Revisit Checklist
description: Show, build or update the checklist in .offthemode/CHECKLIST.md. Use when the user says /revisit-checklist, asks where the project stands, or adds a feature or idea. Edits only the checklist.
argument: note
argument_hint: empty for status, or a new feature, idea or change
templates: CHECKLIST.md
---
# Off the Mode · revisit checklist

Input: the user's note, whatever they typed after the command. Empty means show the status; otherwise it is a new feature, idea or change. Edit only `.offthemode/CHECKLIST.md`: never code, never other files. Running the command is the request, so never ask whether to start: explain what you found, ask only what the user alone can settle, do the rest in that reply and say what you did.

## If the checklist is missing or still the unfilled template, build it
1. Read the plan: `.offthemode/PRODUCT.md`, or the plan file the user names, and, if you were given a report from the reassess command, every note in it (each becomes an item).
2. Split the core concept into fragments: the separate pieces of the core a user would notice. A fragment cuts through every layer it needs; "the API for F2" is not a fragment. For each: what it does for the person, what it depends on, and Verify: early (it can be proven on its own) or on completion (only an end-to-end run proves it).
3. Give each fragment the items it needs to count as done, and no filler, each with a provable "done when": a test by name, a number against a key in RULES.md §Budgets, a named state you can screenshot, or an end-to-end run with real inputs. Reject "works", "clean" and "fast". Tag each item with the guide from RULES.md §Guides that applies, so whoever builds it opens the right one.
4. Keep only the foundation items and quality bars this product needs; delete the rest with a one-line reason each. Point every bar at a command from RULES.md §Commands.
5. Order: dependencies first (a fragment may depend on a Foundation item, B#, and Foundation items go in the order of their phase), then the fragment nearest the moment of value.
Show the user the fragments in order, one line each, and write the file in that reply, with anything already built marked [x], never [v], and under ## Changes, what it was created from (for the reassess command's report, its one-line summary).

## Otherwise
1. Reconcile: map the git log and diff since the header's "Last revisit" to items. Work that matches no item, and any TODO in the code without a checklist id, is Untracked.
2. Verify: for every [~] and [x] item, find its evidence and run the cheap checks from RULES.md §Commands. Propose promoting to [v] only with evidence you can cite, and demoting a [v] whose evidence broke, with the reason. An on-completion fragment stays unverified until its end-to-end check passes.
3. If there is a note: say which fragment it belongs to or that it's new, which job in PRODUCT.md it serves (if none, ask in the report), and what it disturbs (data model, screens, budgets, other fragments, anything already [v]). Draft the change to the list: added, changed, dropped (dropped items stay as [-] with the reason). If the vision or architecture must change too, name the file and stop there.
4. Show one report: the status, the mark changes you would record and the note's change to the list. Apply all of it in that reply: the marks, the list changes with one line each under ## Changes, and the header ("Last revisit" and the verified count).

Reply in at most 25 lines: progress per fragment with its Verify mode (F2 ■■■□□ 3/5 · on completion), what moved since last time and why, untracked work, risks (failing bars, items stuck at [x], blocked fragments), and the next 3 items.

End with this line: See it as a page: /view-project, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).
