---
name: offthemode
title: Set up Off the Mode
description: Set up Off the Mode in the current project, new or existing, or show its status if it is already set up. Use when the user says "set up off the mode", "/offthemode", or wants their project planned, organised and held to an elite bar.
templates: PRODUCT.md, RULES.md, GLOSSARY.md, STATE.md, DECISIONS.md, CHECKLIST.md
---
# Off the Mode · set up

Off the Mode makes you plan first, build in order and hold an elite bar. It keeps this project's plan and memory in the `.offthemode/` folder, plus one line the user approves so their tool loads it. Setup never installs packages or changes application code.

Talk first, then do: explain what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did. Never build on an assumption: write anything unclear as a hypothesis ("I think X, because Y") and confirm it first.

Template placeholders: `{{NAME}}` only the user can answer; `{{?NAME}}` you work out from the code or docs, saying where from; `{{NAME | x}}` x is the recommended default, shown to the user to confirm, never kept silently.

If `.offthemode/` exists, don't start over: summarise STATE.md and CHECKLIST.md in a few lines, name each of the six files that is missing or unfilled and each `## ` section of the current template a filled file lacks, and offer to add them on the user's go.

If you can't read or write the project's files (a plain chat), say so, and show each file's full text for the user to save in `.offthemode/`. For an existing project, first ask them to paste the README and key files, or to open the project in a coding tool.

## Pick the door
- **New project:** no application code yet (only config, a README, or nothing).
- **Existing project:** there is application code.
Say which door you picked and why, in one line.

## Questions (both doors)
Ask only what the code and docs can't answer: batched, numbered, each with your recommended answer, more rounds if needed. Cover every field the templates leave to the user: person and jobs, moment of value, core concept, the name and its checks (naming: the p1-vision-skeleton guide), who it's not for, refusals and tie-breakers, feeling and references (UI only), complexity we absorb, experience promises, success and guardrail, constraints (platforms, stack, deadline, budget, team, data), the file and function size limits (the template defaults, to confirm), and what's next. Suggest no speed, weight or accessibility numbers for RULES.md §Budgets; add one only if the user asks for it.

## New project
1. Interview the user about the vision (see Questions).
2. Show the one-go message, with the PRODUCT.md draft following the template and RULES.md with what you know (its commands wait for the toolchain).
3. On go, create the files, then build the checklist with the listrevisit command's steps.

## Existing project
1. Read the code before asking anything: the README, dependency files, entry points, routes or screens, the data model, the core flow, tests, config, and any existing rule files (AGENTS.md, CLAUDE.md, .cursor/rules, other rule folders).
2. Tell the user in plain words what you understand: what the product is, who it's for, the core concept as the code shows it, what works and what looks unfinished. Ask the Questions in the same message.
3. Show the one-go message, with the PRODUCT.md draft as the product is meant to be, with evidence, and RULES.md with the commands you found.
4. On go, create the files. Run the reassess command's steps, then the listrevisit command's steps to build the checklist from PRODUCT.md plus every note in the report. Show the report and the fragments together, asking for the real-input run and the fragments' ok in one message. Record the report's summary under the checklist's ## Changes.

## The one go (both doors)
In one message, show: the PRODUCT.md draft; RULES.md Project specifics; the files you will create in `.offthemode/`, one line each; the exact auto-load line and its file; and whether `.offthemode/` goes in git (recommended, so the team shares it). Wait for one go, then do all of it.

## Writing RULES.md
Draft Project specifics from what is knowable now: the stack's known traps (check each against the docs or source of the versions actually used, never memory), data rules the domain implies (money in whole cents, every query scoped to the account), security boundaries and, in an existing project, what the code relies on. Keep a line only if it is certain to apply, not something an AI does anyway, and costly if missed, since every line is read in every session; each says what to do and why.

The project's existing rule files are its refined knowledge: never move, merge or rewrite them; the only addition is the auto-load line, on the user's go. List them in RULES.md §This project as still in force; they win on project specifics, so write Project specifics only for what they don't cover. If one contradicts an Off the Mode standard, show both, ask which wins and record it in DECISIONS.md.

## Auto-load
Add to existing content, never replace it. Claude Code: in CLAUDE.md, as plain text, `Read @.offthemode/RULES.md and @.offthemode/STATE.md before any change.` Cursor: that line in `.cursor/rules/offthemode.mdc` with `alwaysApply: true`. Tools that read AGENTS.md, or have their own always-on file (VS Code: `.github/copilot-instructions.md`): that line there.

## Last step (both doors)
Once the checklist exists, write GLOSSARY.md "In plain words" by the glossaryrevisit command's rules (the setup go covers it). End with what you created and the next 3 steps, then two lines: sessions stay free-form, with RULES.md and STATE.md loaded and each kind of work opening its guide; the listrevisit, reassess, commentrevisit and glossaryrevisit commands run whenever they want a check.
