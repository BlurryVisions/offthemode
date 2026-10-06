---
name: offthemode
description: "Set up Off the Mode in a new or existing project, or show its status. Use when the user says \"set up off the mode\" or /offthemode, or wants the project planned and held to an elite bar."
license: MIT
---

# Off the Mode · set up

Off the Mode makes you plan first, build in order and hold an elite bar. It keeps the plan and memory in `.offthemode/`, plus one approved line so the user's tool loads it. Setup never installs packages or changes application code.

Talk first, then do: say what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did. Never build on an assumption: write anything unclear as a hypothesis ("I think X, because Y") and confirm it first.

Placeholders: `{{NAME}}` only the user can answer; `{{?NAME}}` you work out from the code or docs, saying where from; `{{NAME | x}}` x is your recommended default, for the user to confirm, never kept silently.

If `.offthemode/` exists, don't start over: summarise STATE.md and CHECKLIST.md briefly, name each of the six files missing or unfilled and each section or line of the current template a filled file lacks, and offer to add them on the user's go.

If you can't read or write the files (a plain chat), say so and show each file's full text for the user to save in `.offthemode/`; for an existing project, first ask them to paste the README and key files, or open the project in a coding tool.

## Pick the door
**New project** if there's no application code yet (only config, a README, or nothing), else **existing project**. Say which and why, in one line.

## Questions (both doors)
Ask only what the code and docs can't answer: batched, numbered, each with your recommended answer, more rounds if needed. Cover every field the templates leave to the user: person and jobs, how people find it, if they should (search, AI answers, an app store), moment of value, core concept, the name and its checks (guide: p1-vision-skeleton), who it's not for, refusals and tie-breakers, feeling and references (UI only), complexity we absorb, experience promises, success and guardrail, constraints (platforms, stack, deadline, budget, team, data), file and function size limits (template defaults, to confirm), and what's next. Suggest no speed, weight or accessibility budgets unless the user asks for one. For any reference the user gives, say what you'd take, check its claims at the official source, and go further.

## New project
1. Ask the Questions about the vision.
2. Show the one-go message: the PRODUCT.md draft by the template, and RULES.md with what you know (its commands wait for the toolchain).
3. On go, create the files, then build the checklist with listrevisit's steps.

## Existing project
1. Read the code before asking anything: the README, dependency files, entry points, routes or screens, the data model, the core flow, tests, config and existing rule files (AGENTS.md, CLAUDE.md, .cursor/rules, others).
2. Tell the user in plain words what you understand: what the product is, who it's for, the core concept as the code shows it, what works and what looks unfinished. Ask the Questions in that message.
3. Show the one-go message: the PRODUCT.md draft as the product is meant to be, with evidence, and RULES.md with the commands you found.
4. On go, create the files. Run the reassess steps, then listrevisit's to build the checklist from PRODUCT.md and every note in the report. Show the report and the fragments in one message, asking for the real-input run, the report's save and the fragments' ok. Record the report's summary under the checklist's ## Changes.

## The one go (both doors)
In one message, show: the PRODUCT.md draft; RULES.md Project specifics; the files you will create in `.offthemode/`, one line each; the exact auto-load line and its file; any rule-file fixes; and whether `.offthemode/` goes in git (recommended, so the team shares it). Wait for one go, then do all of it.

## Writing RULES.md
Draft Project specifics from what is known now: the stack's known traps (checked against the docs or source of the versions in use, never memory), data rules the domain implies (money in whole cents, every query scoped to the account), security boundaries and, in an existing project, what the code relies on. Keep a line only if it is certain to apply, not something an AI does anyway, and costly if missed (every line is read every session); each says what to do and why.

Existing rule files are the project's refined knowledge and win on project specifics: never move or merge them; list them in RULES.md §This project as in force, and write Project specifics only for what they miss. A line that is out of date or contradicts the code, another rule or an Off the Mode standard: show it (file:line) with the fix in the one go; record it in DECISIONS.md.

## Auto-load
Add to existing content, never replace it. Claude Code: in CLAUDE.md, as plain text, `Read @.offthemode/RULES.md and @.offthemode/STATE.md before any change.` Cursor: that line in `.cursor/rules/offthemode.mdc` with `alwaysApply: true`. Tools that read AGENTS.md or their own always-on file (VS Code: `.github/copilot-instructions.md`): that line there.

## Last step (both doors)
Once the checklist exists, write GLOSSARY.md "In plain words" by glossaryrevisit's rules (the setup go covers it). End with what you created, the next 3 steps and three lines: sessions stay free-form, with RULES.md and STATE.md loaded and each kind of work opening its guide; listrevisit, reassess, commentrevisit and glossaryrevisit run whenever they want a check; See it as a page: /listview, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).

## Files
- Templates are in `templates/` next to this file: `templates/PRODUCT.md`, `templates/RULES.md`, `templates/GLOSSARY.md`, `templates/STATE.md`, `templates/DECISIONS.md`, `templates/CHECKLIST.md`. Open one only when you are about to write that file or compare a filled file with it.
- The guides are in `method/`, one file per guide; `method/INDEX.md` lists them. For a change inside an existing product, open the guide's working rules in `method/rules/`. Open the whole guide in `method/` when you start that phase or change its structure. A guide with no file in `method/rules/` always comes whole.
- The other commands named here are sibling skills in the same skills folder: commentrevisit is `../commentrevisit/SKILL.md`, glossaryrevisit is `../glossaryrevisit/SKILL.md`, listrevisit is `../listrevisit/SKILL.md`, reassess is `../reassess/SKILL.md`.
- Install all 6 Off the Mode skills together; they read each other's files.
