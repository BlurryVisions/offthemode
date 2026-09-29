---
name: offthemode
title: Set up Off the Mode
description: Set up Off the Mode in the current project, new or existing, or show its status if it is already set up. Use when the user says "set up off the mode", "/offthemode", or wants their project planned, organised and held to an elite bar.
templates: PRODUCT.md, RULES.md, GLOSSARY.md, STATE.md, DECISIONS.md, CHECKLIST.md
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
1. Read the code before asking anything: the README, dependency files, entry points, routes or screens, the data model, the core flow, tests, config, and any existing agent rules (AGENTS.md, CLAUDE.md, .cursor/rules, other rule folders). Leave existing rules untouched until the user decides how they fit with RULES.md (Writing RULES.md, below).
2. Tell the user, in plain words, what you understand: what the product is, who it's for, the core concept as the code shows it, what works, and what looks unfinished. Ask at most 5 questions, only where the code can't tell you (intent, audience, what's next).
3. Once they confirm, list the files you will create in `.offthemode/` (PRODUCT.md as the product is meant to be, with evidence; GLOSSARY.md; RULES.md with the commands you found; STATE.md; DECISIONS.md), one line each, and create them on their go.
4. Follow the reassess instructions to report how the code compares with the core concept, then the listrevisit instructions to build the checklist, with what's already built marked [x].

## Writing RULES.md (both doors)
Draft its Project specifics from what is already knowable, and show them for confirmation: the chosen stack's known traps (check each against the docs or source of the versions actually used, never from memory), data rules that follow from the domain (for example money in whole cents, every query scoped to the account), security boundaries, and, in an existing project, what the code already relies on. Keep a line only if it is certain to apply, not something an AI does anyway, and costly if missed; each says what to do and why. About 10 lines: every line is read in every session.

If the project already has rules: sort them for the user in two groups: general rules Off the Mode already covers (working style, comments, secrets, commits), and project specifics only this codebase could teach (a framework quirk, a data rule, a required check). Then offer two options and wait for their choice. Recommended: one rulebook, where the project specifics move into RULES.md §Project specifics, decisions such as a known deviation go into DECISIONS.md, the general duplicates are dropped, and the old files are retired once the user agrees (keep them only if another tool, such as Cursor, still reads them). The alternative: keep the existing files as they are, and RULES.md points to them and says which wins where they overlap. Record the choice in DECISIONS.md.

## Both doors, last step
- Make RULES.md and STATE.md load in every session. Ask first, then use the tool's own auto-load, adding to existing content, never replacing it: Claude Code, `@.offthemode/RULES.md` and `@.offthemode/STATE.md` on their own lines in CLAUDE.md; Cursor, `.cursor/rules/offthemode.mdc` with `alwaysApply: true` saying to read both files before any change; tools that read AGENTS.md, one line there saying the same. Say which file you changed.
- Ask whether `.offthemode/` should be committed (recommended, so the whole team shares it) or kept out of git.
- End with what you created and the next 3 steps.

Never during setup: install packages or change application code. Outside `.offthemode/`, change only what the user approved (the auto-load line, rule files they chose to retire).

## After setup
Tell the user in two lines: sessions stay free-form, with RULES.md and STATE.md loaded and the matching guide opened for each kind of work; and listrevisit, reassess, commentrevisit and glossaryrevisit are there whenever they want a check.
