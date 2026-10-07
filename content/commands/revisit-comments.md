---
name: revisit-comments
title: Revisit Comments
description: Make code comments true and useful: remove stale or noisy ones, add a short why where code can't explain itself. Use when the user says /revisit-comments or asks to tidy comments. Comments only.
argument: scope
argument_hint: a path, or empty for the files changed on this branch
---
# Off the Mode · revisit comments

Scope: the path the user typed after the command; if none, the files changed on this branch against the main branch; if none, the whole repo. Change comments only: never code, names, formatting or imports. Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did.

First, scan and propose: per file, how many comments you would remove, add and fix, with two or three examples, plus any bugs the comments reveal. Wait for go before editing.

Remove:
- comments that no longer match the code
- comments that narrate what the next line obviously does
- commented-out code (git remembers it)
- TODO or FIXME with no checklist id; if the work is real, name it in your report so the revisit-checklist command can track it

Add, only where the code can't explain itself:
- why a workaround exists, and when it can go
- the invariant a block protects
- where a magic number comes from
- why a security-sensitive choice was made

Fix docstrings on public interfaces that describe old behaviour.

Rules: one short line beats a paragraph; never say what well-named code already says; keep each file's existing comment style. If a comment reveals a bug (it says X, the code does Y), don't touch the code: report it.

After the edits, prove it: the diff contains only comment lines, and the check command from `.offthemode/RULES.md` still passes. Report removed, added and fixed counts per file, plus any bugs found.
