---
name: commentrevisit
description: "Clean up code comments so they are true, necessary and useful - remove stale, wrong or noisy ones and add a short why where the code can't explain itself. Use when the user says \"/commentrevisit\" or asks to tidy comments. Changes comments only, never code."
license: MIT
argument-hint: "[a path, or empty for the files changed on this branch]"
---

# Off the Mode · comment revisit

Scope: {{?SCOPE: the path the user names, else the files changed on this branch against the main branch, else the whole repo}}. Change comments only: never code, names, formatting or imports. Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did.

First, scan and propose: per file, how many comments you would remove, add and fix, with two or three examples, plus any bugs the comments reveal. Wait for go before editing.

Remove:
- comments that no longer match the code
- comments that narrate what the next line obviously does
- commented-out code (git remembers it)
- TODO or FIXME with no checklist id; if the work is real, list it for listrevisit instead

Add, only where the code can't explain itself:
- why a workaround exists, and when it can go
- the invariant a block protects
- where a magic number comes from
- why a security-sensitive choice was made

Fix docstrings on public interfaces that describe old behaviour.

Rules: one short line beats a paragraph; never say what well-named code already says; keep each file's existing comment style. If a comment reveals a bug (it says X, the code does Y), don't touch the code: report it.

After the edits, prove it: the diff contains only comment lines, and the check command from `.offthemode/RULES.md` still passes. Report removed, added and fixed counts per file, plus any bugs found.

## Files
- The user's scope, if any, is whatever they typed after the command.
