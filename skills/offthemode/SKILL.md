---
name: offthemode
description: "Set up Off the Mode in a new or existing project, or show its status. Use when the user says \"set up off the mode\" or /offthemode, or wants the project planned and held to an elite bar."
license: MIT
---

# Off the Mode · set up

Off the Mode makes you plan first, build in order and hold an elite bar. It keeps the plan and memory in `.offthemode/`, plus one approved line so the user's tool loads it. Setup never installs packages or changes application code.

Talk first, then do: say what you found and exactly what you will create or change, wait for the user's go, then do it and say what you did. Never build on an assumption: write anything unclear as a hypothesis ("I think X, because Y") and confirm it first.

Placeholders: `{{NAME}}` only the user can answer; `{{?NAME}}` you work out from the code or docs, saying where from; `{{NAME | x}}` x is your recommended default, for the user to confirm, never kept silently.

If the project's `.offthemode/` exists (not the home folder's, which holds only ME.md), don't start over: summarise STATE.md and CHECKLIST.md briefly. Name each of the six files that is missing or still unfilled, and for each filled file, every section or line the current template has that it lacks. Offer to add them on the user's go, and to change any old command name in the project's notes to its new one (listrevisit to revisit-checklist, listview to view-project, commentrevisit to revisit-comments, glossaryrevisit to revisit-glossary), except in DECISIONS.md and the checklist's evidence and ## Changes, which record what happened. For a missing §Shipping, fill it as the Questions say, and offer to save it to `~/.offthemode/ME.md` as the one go does.

If you can't read or write the files (a plain chat), say so and show each file's full text for the user to save in `.offthemode/`; for an existing project, first ask them to paste the README and key files, or open the project in a coding tool. If you can't read `~/.offthemode/ME.md` (a plain chat, a tool limited to the project, a refused permission), say so and ask the shipping questions; if you can't write it, show its text for the user to save there.

## Pick the door
**New project** if there's no application code yet (only config, a README, or nothing), else **existing project**. Say which and why, in one line.

## Questions (both doors)
Use everything the user has already said, and never ask it again. Ask only what the code and docs can't answer: batched, numbered, each with your recommended answer, more rounds if needed. Cover every field the templates leave to the user: person and jobs, how people find it, if they should (search, AI answers, an app store), moment of value, core concept, the name and its checks (guide: p1-vision-skeleton), who it's not for, refusals and tie-breakers, feeling and references (UI only), complexity we absorb, experience promises, success and guardrail, how it ships, in the first round (where the code lives, the branch that goes live, the host, the name commits use: fill these from git, the host's config and `~/.offthemode/ME.md`, and ask only what is still missing), constraints (platforms, stack, deadline, budget, team, data), file and function size limits (template defaults, to confirm), and what's next. Suggest no speed, weight or accessibility budgets unless the user asks for one. For any reference the user gives, say what you'd take, check its claims at the official source, and go further.

For shipping, use ME.md's hosting and release line only for the project's platform (a web line never fills an iPhone app). For Commits as, ME.md wins over git's global name and email. Where sources disagree rather than miss (a branch named master where ME.md says main), show both in the one go with your recommendation.

## New project
1. Ask the Questions about the vision.
2. Show the one-go message: the PRODUCT.md draft by the template, and RULES.md with what you know (its commands wait for the toolchain).
3. On go, create the files, then build the checklist with revisit-checklist's steps.

## Existing project
1. Read the code before asking anything: the README, dependency files, entry points, routes or screens, the data model, the core flow, tests, config and existing rule files (AGENTS.md, CLAUDE.md, .cursor/rules, others).
2. Tell the user in plain words what you understand: what the product is, who it's for, the core concept as the code shows it, what works and what looks unfinished. Ask the Questions in that message.
3. Show the one-go message: the PRODUCT.md draft as the product is meant to be, with evidence, and RULES.md with the commands you found.
4. On go, create the files. Run the reassess steps, then revisit-checklist's to build the checklist from PRODUCT.md and every note in the report. Show the report and the fragments in one message, and ask in it for three things: the go for reassess's real-input run, whether to save its report to `.offthemode/REASSESS.md`, and the ok on the fragments. Record the report's summary under the checklist's ## Changes.

## The one go (both doors)
In one message, show: the PRODUCT.md draft; RULES.md Project specifics and Shipping, each Shipping value with its source (git, the host's config, ME.md or the user's answer); the files you will create in `.offthemode/`, one line each; the exact auto-load line and its file; any rule-file fixes; if this repo's git name or email differs from Commits as, the offer to set them for this repo only (`git config` without `--global`); if the branch differs from the usual one and has no commits yet, the offer to rename it; if `~/.offthemode/ME.md` lacks or differs on a line its template has (code host and account, commit name, this platform's hosting and release), whether to save those lines there as the user's usual, adding or updating only them and keeping the rest (never this project's repo address, never a password, token or key); and whether `.offthemode/` goes in git (recommended, so the team shares it). Wait for one go, then do all of it.

## Writing RULES.md
Draft Project specifics from what is known now: the stack's known traps (checked against the docs or source of the versions in use, never memory), data rules the domain implies (money in whole cents, every query scoped to the account), security boundaries and, in an existing project, what the code relies on. Keep a line only if it is certain to apply, not something an AI does anyway, and costly if missed (every line is read every session); each says what to do and why.

Existing rule files are the project's refined knowledge and win on project specifics: never move or merge them; list them in RULES.md §This project as in force, and write Project specifics only for what they miss. If a line in them is out of date, or contradicts the code, another rule or an Off the Mode standard, show it with its file and line and the fix in the one go. Change it only on that go, and record the change in DECISIONS.md.

## Auto-load
Add to existing content, never replace it. Claude Code: in CLAUDE.md, as plain text, `Read @.offthemode/RULES.md and @.offthemode/STATE.md before any change.` Cursor: that line in `.cursor/rules/offthemode.mdc` with `alwaysApply: true`. Gemini CLI: that line in `GEMINI.md`. Tools that read AGENTS.md or their own always-on file (VS Code: `.github/copilot-instructions.md`): that line there.

## Last step (both doors)
Once the checklist exists, write GLOSSARY.md "In plain words" by revisit-glossary's rules (the setup go covers it). End with what you created, the next 3 steps and three lines: sessions stay free-form, with RULES.md and STATE.md loaded and each kind of work opening its guide, and revisit-state saves where things stand before a fresh session; revisit-checklist, reassess, revisit-comments and revisit-glossary run whenever they want a check; See it as a page: /view-project, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).

## Files
- Templates are in `templates/` next to this file: `templates/PRODUCT.md`, `templates/RULES.md`, `templates/GLOSSARY.md`, `templates/STATE.md`, `templates/DECISIONS.md`, `templates/CHECKLIST.md`, `templates/ME.md`. Open one only when you are about to write that file or compare a filled file with it.
- The guides are in `method/`, one file per guide; `method/INDEX.md` lists them. For a change inside an existing product, open the guide's working rules in `method/rules/`. Open the whole guide in `method/` when you start that phase or change its structure. A guide with no file in `method/rules/` always comes whole.
- The other commands named here are sibling skills in the same skills folder: reassess is `../reassess/SKILL.md`, revisit-checklist is `../revisit-checklist/SKILL.md`, revisit-comments is `../revisit-comments/SKILL.md`, revisit-glossary is `../revisit-glossary/SKILL.md`, revisit-state is `../revisit-state/SKILL.md`, view-project is `../view-project/SKILL.md`.
- Install all 7 Off the Mode skills together; they read each other's files.
