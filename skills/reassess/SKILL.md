---
name: reassess
description: "Check what has actually been built (the code) against the project's core concept in .offthemode/PRODUCT.md, and report what serves it, what drifted and what is missing. Use when the user says \"/reassess\" or asks whether the project is still on course. Report only; edits nothing."
license: MIT
---

# Off the Mode · reassess

Reassess what has been built against the core concept. Report only: edit nothing, the checklist included.

1. Read the core concept, person, jobs, moment of value, refusals and principles in `.offthemode/PRODUCT.md`. Then read the code itself for what exists: routes and screens, handlers and jobs, the data model, and the core pipeline end to end. Docs are intent; code is fact.
2. For each piece of the core concept: built, partial or missing, citing files. Where the code does something different from the concept, say what it does and what the concept says.
3. Find drift: code that serves no job in PRODUCT.md, complexity the concept doesn't need, anything a refusal forbids, architecture that works against the concept (a flow the concept calls instant that the code makes wait, for example), and core pieces that exist only as stubs, mocks or hardcoded data.
4. If the core can run, push one real input through the whole chain and note where it breaks or degrades.

Reply in at most 30 lines: alignment in one line (on course · drifting · off course) with the reason; then the gaps by severity, each with its evidence (file, function or run), the smallest change that realigns it, and, if it belongs in the checklist, the exact note to pass to listrevisit.
