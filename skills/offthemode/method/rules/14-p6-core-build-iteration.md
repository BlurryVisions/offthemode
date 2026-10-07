## P6 · Core Build & Iteration

### Working rules (for a change inside an existing product)
- One concern per change, fenced to the files the plan names. If the work needs a file outside the fence, stop and say why.
- Never visual and logic in the same change; they are checked differently.
- A bug fix starts with a failing test that reproduces the bug.
- Never edit a test to make it pass. Tests, snapshots and exemptions change only when the spec changes.
- Two failed attempts at the same fix: climb one rung of the ladder in When it keeps getting it wrong. Never a third try from the same context.
- A change to prompts, model ids, retrieval or the core contract runs the evals.
- Finish with the checks in RULES.md §Commands, and name the CHECKLIST.md item it closes; revisit-checklist records the mark and the evidence.
- Open the whole guide for a new vertical slice, a refactor checkpoint or a drift check.

These are the guide's working rules, for a change inside an existing product. Open the whole guide, `../14-p6-core-build-iteration.md`, when you start this phase or change its structure.
