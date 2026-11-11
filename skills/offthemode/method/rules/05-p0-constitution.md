## P0 · Constitution

### Working rules (for a change inside an existing product)
- Hold every change to RULES.md as it stands. Don't rewrite it as a side effect of another task.
- The project's own rule files (AGENTS.md, CLAUDE.md, .cursor/rules and the like) stay where they are and win on project specifics: never move or merge them. A line that contradicts the code, another rule or an Off the Mode standard, or is out of date, is shown with its fix and changed only on the user's yes, recorded in DECISIONS.md. Besides those fixes, the only additions are the one auto-load line and, in Claude Code, the stop check's hook, each on the user's yes.
- Before deciding anything, search DECISIONS.md, so a settled choice is not argued again.
- A correction about what the product does or shows is a point: write it the first time, in the user's words, under the piece's item in CHECKLIST.md, with its check, before any other change (RULES.md §How to work); the save records what the check showed. Where RULES.md has no line starting "- Build from my points", the project was set up before the points: the correction goes in STATE.md §Corrections seen once like any other, until the offthemode command updates the project.
- A correction about how the work is done, given once, goes in STATE.md §Corrections seen once, with the date. Given a second time, propose one line for RULES.md §Project specifics with its reason, and add it on the user's yes.
- Keep STATE.md current without asking: once at the end of any reply that modifies project files, concludes a decision or gives a point its result, after its last edit, follow revisit-state's steps (present tense, no history, never the same line twice) and append any new decision to DECISIONS.md. While an Off the Mode command runs, it touches only what the command names, and STATE.md catches up after it. An agent another session started leaves .offthemode/ alone. The user can also type revisit-state.
- Open the whole guide to set up or redo the rules, wire the auto-load, or prune RULES.md.

These are the guide's working rules, for a change inside an existing product. Open the whole guide, `../05-p0-constitution.md`, when you start this phase or change its structure.
