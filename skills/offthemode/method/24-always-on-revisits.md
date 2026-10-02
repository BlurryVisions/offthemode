## Always-On · Revisits

> **Output:** four on-demand commands that each touch only what they own: `listrevisit` updates `.offthemode/CHECKLIST.md`, `reassess` writes a report and saves it to `.offthemode/REASSESS.md` only on your go, `commentrevisit` edits code comments only, and `glossaryrevisit` refreshes the plain-words summary at the top of `.offthemode/GLOSSARY.md`.

Off the Mode has five commands. `offthemode` sets up a project or shows its status. The other four are revisits: each has one job and touches only what that job owns, so you can run any of them in the middle of a normal session without it spilling into anything else.

Type them (`/reassess` with the skills, `/mcp__offthemode__reassess` through the link in Claude Code) or just say them: "reassess the project".

> **Rule:** Every command talks first. It explains what it found and exactly what it will change, waits for your go, then does it and tells you what it did. `reassess` changes no code and no other file: its report is the result. It asks for a go before it runs a real input through the core, and before it saves the report.

| Command | Its one job | Touches |
|---|---|---|
| `listrevisit [note]` | Shows the checklist, or places a new feature or idea where it belongs | `.offthemode/CHECKLIST.md` |
| `reassess` | Compares what has actually been built with the core concept | Only its own report, `.offthemode/REASSESS.md`, if you say so |
| `commentrevisit [path]` | Makes code comments true, necessary and useful | Comments only, never code |
| `glossaryrevisit` | Keeps a plain-words summary of the project that anyone can understand | The "In plain words" part of `.offthemode/GLOSSARY.md` |

`listrevisit` is covered in Living Checklist. The other three:

**`reassess` reads the code, not the docs.** Docs describe intentions; the code is what exists. It compares the code with the core concept in PRODUCT.md: what serves it, what drifted from it, what is missing, and what was built that serves no job at all. When the core can run, it proposes one real input and the exact command, using test or seed data so nothing real is sent, charged or changed, and after your go pushes it through the whole chain: the only honest check for a product that proves itself end to end. It edits nothing else, the checklist included. At the end it offers to save the report to `.offthemode/REASSESS.md`, replacing the last one; the first line gives the date and whether the project is on course, drifting or off course. If it finds work to capture, it gives you the exact note to pass to `listrevisit`.

**`commentrevisit` edits comments and nothing else.** It removes comments that lie (the code changed, the comment didn't), comments that narrate what the next line obviously does, commented-out code, and TODOs with no checklist id. It adds a short why where the code can't explain itself: a workaround, an invariant (a condition the code must always keep true), a magic number, a security decision. It proves it touched only comments: the diff (the list of changed lines) holds no code changes, and the checks still pass. When a comment reveals a bug, it reports the bug instead of fixing it.

**`glossaryrevisit` is for people, not AI tools.** The top of `.offthemode/GLOSSARY.md` says what the project is, who it's for, what problem it solves, what works today and what's coming, in words anyone understands. No stack, no jargon, no feature lists: you could read it aloud to a relative or open a pitch with it. "Working today" comes from the code and the checklist, not from the plan, so it stays honest. The Terms list below it is left alone.

**See it as a page.** `listrevisit`, `reassess` and `glossaryrevisit` end with the link to the view, a page that shows the `.offthemode/` folder at a glance: the checklist, the plan, the plain summary, the decisions, where things stand and the last reassess. The page reads the files in your browser and sends nothing anywhere.

See it as a page: https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).

For a tool where the commands aren't set up, these prompts do the same jobs by hand.

```prompt title="Reassess Against the Core Concept"
# Off the Mode · reassess

Reassess what has been built against the core concept. Report only: edit nothing except, on the user's go, `.offthemode/REASSESS.md`, not even the checklist. Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did.

1. Read the core concept, person, jobs, moment of value, refusals, tie-breakers and experience promises in `.offthemode/PRODUCT.md`. Then read the code itself for what exists: routes and screens, handlers and jobs, the data model, and the core pipeline end to end. Docs are intent; code is fact.
2. For each piece of the core concept: built, partial or missing, citing files. Where the code does something different from the concept, say what it does and what the concept says.
3. Find drift: code that serves no job in PRODUCT.md, complexity the concept doesn't need, anything a refusal or tie-breaker rules out, architecture that works against the concept or breaks an experience promise (a flow slower than the time-to-value target, a confirm dialog the promises don't allow, no offline use where it is promised), and core pieces that exist only as stubs, mocks or hardcoded data.
4. If the core can run, propose one real input and the exact command you will run to push it through the whole chain, preferring test or seed data to live data so nothing real is sent, charged or changed. Wait for the user's go, then run it and note where it breaks or degrades.

Reply in at most 30 lines: alignment in one line (on course · drifting · off course) with the reason; then the gaps by severity, each with its evidence (file, function or run), the smallest change that realigns it, and, if it belongs in the checklist, the exact note for the listrevisit command.

Then offer to save the report. On the user's go, write it to `.offthemode/REASSESS.md`, replacing any earlier one: first line `REASSESS · <YYYY-MM-DD> · <on course | drifting | off course>`, then the report as shown.

End with this line: See it as a page: https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).
```

```prompt title="Comment Revisit"
# Off the Mode · comment revisit

Scope: the path the user typed after the command; if none, the files changed on this branch against the main branch; if none, the whole repo. Change comments only: never code, names, formatting or imports. Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did.

First, scan and propose: per file, how many comments you would remove, add and fix, with two or three examples, plus any bugs the comments reveal. Wait for go before editing.

Remove:
- comments that no longer match the code
- comments that narrate what the next line obviously does
- commented-out code (git remembers it)
- TODO or FIXME with no checklist id; if the work is real, name it in your report so the listrevisit command can track it

Add, only where the code can't explain itself:
- why a workaround exists, and when it can go
- the invariant a block protects
- where a magic number comes from
- why a security-sensitive choice was made

Fix docstrings on public interfaces that describe old behaviour.

Rules: one short line beats a paragraph; never say what well-named code already says; keep each file's existing comment style. If a comment reveals a bug (it says X, the code does Y), don't touch the code: report it.

After the edits, prove it: the diff contains only comment lines, and the check command from `.offthemode/RULES.md` still passes. Report removed, added and fixed counts per file, plus any bugs found.
```

```prompt title="Glossary Revisit"
# Off the Mode · glossary revisit

Write or update the "## In plain words" section of `.offthemode/GLOSSARY.md`: a summary of this project for people, not agents. Leave "## Terms" untouched.

Sources: `.offthemode/PRODUCT.md` for the intent; `.offthemode/CHECKLIST.md` and the code for what actually works today. Never describe planned work as working.

Rules:
- Anyone can understand it: a new teammate, an investor, a relative. Short sentences, everyday words.
- No technical words: no stack, framework, database, API, model or architecture names. If a product word is unavoidable, explain it under "Words you'll hear".
- Say what people can do, never how it's built.
- Under 300 words, so it fits on one screen. Count them with a command (such as wc -w) where you can run one, not by eye.

Before showing it, reread every sentence as someone outside tech and rewrite any they would have to ask about. Show the new section and, if one exists, what changed and why (usually "Where we are"). Write it on the user's go.

End with this line: See it as a page: https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).
```
