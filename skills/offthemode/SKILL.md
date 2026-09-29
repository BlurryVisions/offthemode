---
name: offthemode
description: "Set up Off the Mode in the current project, new or existing, or show its status if it is already set up. Use when the user says \"set up off the mode\", \"/offthemode\", or wants their project planned, organised and held to an elite bar."
license: MIT
---

# Off the Mode · set up

Off the Mode makes you plan first, build in order and hold an elite bar. It keeps this project's plan and memory in one folder, `.offthemode/`, and changes nothing else in the repo unless the user says yes.

Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did. Never build on an assumption: write anything unclear as a hypothesis ("I think X, because Y") and confirm it first.

Placeholders in the templates: `{{NAME}}` is something only the user can tell you; `{{?NAME}}` is something you work out from the code or the docs, showing where it came from.

If `.offthemode/` already exists, do not set up again. Summarise `.offthemode/STATE.md` and `.offthemode/CHECKLIST.md` in a few lines and suggest the next step.

## Pick the door
- **New project:** no application code yet (only config, a README, or nothing).
- **Existing project:** there is application code.
Say which door you picked and why, in one line.

## New project
1. Interview the user about the vision, in rounds of at most 5 numbered questions, each with your recommended default: who it's for, the one job it does, the moment of value, the core concept, what it must never become, references for the look and feel (only if it has a UI), and constraints (platforms, stack preferences, deadline).
2. Draft PRODUCT.md in the chat, not in a file yet, following the template. Write every guess as a hypothesis.
3. Once they confirm or correct it, list the files you will create (PRODUCT.md, GLOSSARY.md, RULES.md with what you know and commands left for when the toolchain exists, STATE.md, DECISIONS.md), one line each, and create them in `.offthemode/` on their go.
4. Build the checklist by following the listrevisit instructions (the checklist doesn't exist yet, so listrevisit builds it).

## Existing project
1. Read the code before asking anything: the README, dependency files, entry points, routes or screens, the data model, the core flow, tests, config, and any existing agent rules (AGENTS.md, CLAUDE.md, .cursor/rules, other rule folders). Existing rules stay where they are: list them in RULES.md, never overwrite or move them. Sort them for the user in two groups: general rules Off the Mode already covers (working style, comments, secrets, commits), and project specifics only this codebase could teach (a framework quirk, a data rule, a required check). Then offer two options and wait for their choice. Recommended: one rulebook, where the project specifics move into RULES.md §Project specifics, decisions such as a known deviation go into DECISIONS.md, the general duplicates are dropped, and the old files are retired once the user agrees (keep them only if another tool, such as Cursor, still reads them). The alternative: keep the existing files as they are, and RULES.md points to them and says which wins where they overlap. Record the choice in DECISIONS.md.
2. Tell the user, in plain words, what you understand: what the product is, who it's for, the core concept as the code shows it, what works, and what looks unfinished. Ask at most 5 questions, only where the code can't tell you (intent, audience, what's next).
3. Once they confirm, list the files you will create in `.offthemode/` (PRODUCT.md as the product is meant to be, with evidence; GLOSSARY.md; RULES.md with the commands you found; STATE.md; DECISIONS.md), one line each, and create them on their go.
4. Follow the reassess instructions to report how the code compares with the core concept, then the listrevisit instructions to build the checklist, with what's already built marked [x].

## Both doors, last step
- Make the rules load in every session, not only when a command runs. Explain this in one line and ask before editing, then use the tool's own auto-load:
  - Claude Code: add `@.offthemode/RULES.md` and `@.offthemode/STATE.md` on their own lines in CLAUDE.md (these imports load at the start of every session).
  - Cursor: create `.cursor/rules/offthemode.mdc` with `alwaysApply: true` telling the agent to read those two files before any change.
  - Tools that read AGENTS.md: add "This project uses Off the Mode: read .offthemode/RULES.md and .offthemode/STATE.md before any change." to AGENTS.md.
  Keep any existing content; add, never replace. Say which file you changed.
- Ask whether `.offthemode/` should be committed (recommended, so the whole team shares it) or kept out of git.
- End with what you created and the next 3 steps.

Never during setup: install packages, change application code, or create files outside `.offthemode/`.

## How Off the Mode works, for the rest of the project
Work in this order, letting phases overlap: rules, then the plan (vision and core concept), then the look and feel if there is a UI, then backend and hosting, then navigation and flows, then the core built fragment by fragment, then security, then shipping. Sessions stay free-form: the user codes as usual, RULES.md holds the standards, and the revisit commands keep things honest when asked:
- listrevisit: view or update the checklist
- reassess: check what's built against the core concept
- commentrevisit: clean up code comments
- glossaryrevisit: refresh the plain-words summary
The full method, sheet by sheet, is in the Off the Mode method (get_method on the server, or `method/` next to this skill).

## Files
- Templates are in `templates/` next to this file: `templates/PRODUCT.md`, `templates/RULES.md`, `templates/GLOSSARY.md`, `templates/STATE.md`, `templates/DECISIONS.md`, `templates/CHECKLIST.md`. Open one only when you are about to write that file.
- The full method is in `method/`, one file per sheet; start with `method/INDEX.md` and open only the sheet for the phase you are in.
