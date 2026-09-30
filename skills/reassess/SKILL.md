---
name: reassess
description: "Check what has actually been built (the code) against the project's core concept in .offthemode/PRODUCT.md, and report what serves it, what drifted and what is missing. Use when the user says \"/reassess\" or asks whether the project is still on course. Report only; edits nothing."
license: MIT
---

# Off the Mode · reassess

Reassess what has been built against the core concept. Report only: edit nothing, the checklist included. Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did.

1. Read the core concept, person, jobs, moment of value, refusals, tie-breakers and experience promises in `.offthemode/PRODUCT.md`. Then read the code itself for what exists: routes and screens, handlers and jobs, the data model, and the core pipeline end to end. Docs are intent; code is fact.
2. For each piece of the core concept: built, partial or missing, citing files. Where the code does something different from the concept, say what it does and what the concept says.
3. Find drift: code that serves no job in PRODUCT.md, complexity the concept doesn't need, anything a refusal or tie-breaker rules out, architecture that works against the concept or breaks an experience promise (a flow slower than the time-to-value target, a confirm dialog the promises don't allow, no offline use where it is promised), and core pieces that exist only as stubs, mocks or hardcoded data.
4. If the core can run, propose one real input and the exact command you will run to push it through the whole chain, preferring test or seed data to live data so nothing real is sent, charged or changed. Wait for the user's go, then run it and note where it breaks or degrades.

Reply in at most 30 lines: alignment in one line (on course · drifting · off course) with the reason; then the gaps by severity, each with its evidence (file, function or run), the smallest change that realigns it, and, if it belongs in the checklist, the exact note for the listrevisit command.

## Files
- The guides and all the templates are in the offthemode skill, next to this one: `../offthemode/method/` (`INDEX.md` lists the guides; their working rules are in `../offthemode/method/rules/`) and `../offthemode/templates/`.
- The other commands named here are sibling skills in the same skills folder: listrevisit is `../listrevisit/SKILL.md`.
- Install all 5 Off the Mode skills together; they read each other's files.
