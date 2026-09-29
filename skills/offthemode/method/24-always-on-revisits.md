## Always-On · Revisits
<!-- origin: yours -->

> **Output:** three on-demand commands: `/reassess` (a report), `/commentrevisit` (comment-only edits) and `/glossaryrevisit` (the plain-words summary at the top of `.offthemode/GLOSSARY.md`).

Each revisit has one job and touches only what that job owns, so you can run any of them in the middle of a normal session without it spilling into anything else.

| Command | Its one job | Touches |
|---|---|---|
| `/reassess` | Checks what has actually been built against the core concept | Nothing: it reports |
| `/commentrevisit [path]` | Makes code comments true, necessary and useful | Comments only, never code |
| `/glossaryrevisit` | Keeps a plain-language summary of the project anyone can understand | The `## In plain words` part of `.offthemode/GLOSSARY.md` |

**`/reassess` reads the code, not the docs.** Docs describe intentions; the code is what exists. It compares the code with the core concept in PRODUCT.md: what serves it, what drifted from it, what is missing, and what was built that serves no job at all. When the core can run, it pushes one real input through the whole chain, which is the only honest check for products that prove themselves end to end. It never edits anything, the checklist included; if it finds work to capture, it tells you what to pass to `/listrevisit`.

**`/commentrevisit` edits comments and nothing else.** It removes comments that lie (the code changed, the comment didn't), comments that narrate what the next line obviously does, commented-out code, and TODOs with no checklist id. It adds a short why where the code can't explain itself: a workaround, an invariant, a magic number, a security decision. It proves it touched only comments by checking that the diff has no code changes and the checks still pass. When a comment reveals a bug, it reports the bug instead of fixing it.

**`/glossaryrevisit` is for people, not agents.** The top of `.offthemode/GLOSSARY.md` says what this is, who it's for, what problem it solves, what works today and what's coming, in words anyone understands. No stack, no jargon, no feature lists: you could read it aloud to a relative or open a pitch with it. "Working today" comes from the code and the checklist, not from the plan, so it stays honest. The term list below it stays as P0 defines it.

```prompt title="Reassess Against the Core Concept"
Reassess what has been built against the core concept. Report only: edit nothing, .offthemode/CHECKLIST.md included.
1. Read the core concept, person, jobs, moment of value, refusals and principles in .offthemode/PRODUCT.md. Then read the code itself for what exists: routes and screens, handlers and jobs, the data model, and the core pipeline end to end. Docs are intent; code is fact.
2. For each piece of the core concept: built, partial or missing, citing files. Where the code does something different from the concept, say what it does and what the concept says.
3. Find drift: code that serves no job in PRODUCT.md, complexity the concept doesn't need, anything a Refusal forbids, architecture that works against the concept (a flow the concept calls instant that the code makes wait, for example), and core pieces that exist only as stubs, mocks or hardcoded data.
4. If the core can run, push one real input through the whole chain and note where it breaks or degrades.
Reply in at most 30 lines: alignment in one line (on course | drifting | off course) with the reason; then the gaps by severity, each with its evidence (file, function or run), the smallest change that realigns it, and, if it belongs in the checklist, the exact note to pass to /listrevisit.
```

```prompt title="Comment Revisit"
Comment revisit on {{?SCOPE: the path I name, else the files changed on this branch against the main branch, else the whole repo}}. Change comments only: never code, names, formatting or imports.
Remove:
- comments that no longer match the code
- comments that narrate what the next line obviously does
- commented-out code (git remembers it)
- TODO or FIXME with no checklist id; if the work is real, list it for /listrevisit instead
Add, only where the code can't explain itself:
- why a workaround exists, and when it can go
- the invariant a block protects
- where a magic number comes from
- why a security-sensitive choice was made
Fix docstrings on public interfaces that describe old behaviour.
Rules: one short line beats a paragraph; never say what well-named code already says; keep each file's existing comment style. If a comment reveals a bug (it says X, the code does Y), don't touch the code: report it.
Prove it: the diff contains only comment lines, and {{?CHECK_CMD}} still passes. Report removed, added and fixed counts per file, plus any bugs found.
```

```prompt title="Glossary Revisit"
Glossary revisit: write or update the "## In plain words" section of .offthemode/GLOSSARY.md, a summary of this project for people, not agents. Leave "## Terms" untouched.
Sources: .offthemode/PRODUCT.md for the intent; .offthemode/CHECKLIST.md and the code for what actually works today. Never describe planned work as working.
Rules:
- Anyone can understand it: a new teammate, an investor, a relative. Short sentences, everyday words.
- No technical words: no stack, framework, database, API, model or architecture names. If a product word is unavoidable, explain it under "Words you'll hear".
- Say what people can do, never how it's built.
- Under 300 words, so it fits on one screen.
Before writing, reread every sentence as someone outside tech and rewrite any they would have to ask about. If the section exists, show me what changed and why (usually "Where we are"), then write it.
```
