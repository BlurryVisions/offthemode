---
name: offthemode
title: Set up Off the Mode
description: Set up Off the Mode in a new or existing project, or show its status. Use when the user says "set up off the mode" or /offthemode, or wants the project planned and held to an elite bar.
templates: PRODUCT.md, RULES.md, GLOSSARY.md, STATE.md, DECISIONS.md, CHECKLIST.md, ME.md, UPDATES.md
---
# Off the Mode · set up

Off the Mode makes you plan first, build in order and hold an elite bar. It keeps the plan and memory in `.offthemode/`, plus one approved line so the user's tool loads it. Setup never installs packages or changes application code.

Running the command is the request, so never ask whether to start. Say what you found and exactly what you will create or change, and ask only what the code and docs can't answer: the user's answers are the consent, so in the reply that gets them, read back in up to three lines, do all of it and say what you did. Never build on an assumption: write anything unclear as "I think X, because Y" and settle it first.

Placeholders: `{{NAME}}` only the user can answer; `{{?NAME}}` you work out from the code or docs, saying where from; `{{NAME | x}}` x is your recommended default, for the user to confirm, never kept silently.

If the project's `.offthemode/` exists (not the home folder's, which holds only ME.md), don't start over: summarise STATE.md and CHECKLIST.md briefly. Name each of the six files that is missing or still unfilled, and for each filled file, every section or line the current template has that it lacks, and every line it still has in a wording `UPDATES.md` lists as replaced. Add them, and replace those as UPDATES.md says, in the reply that gets the user's answers, and change any old command name in the project's notes to its new one (listrevisit to revisit-checklist, listview to view-project, commentrevisit to revisit-comments, glossaryrevisit to revisit-glossary), except in DECISIONS.md and the checklist's evidence and ## Changes, which record what happened. For a missing §Shipping, fill it as the Questions say, and offer to save it to `~/.offthemode/ME.md` as the setup message does. For a §Shipping without Reaches, ask whether anyone besides the user uses or depends on the project (until answered, treat it as other people), and quote each line in the project's own rule files or `.claude/settings.json` that waits for a go or asks before every push, with its fix.

If you can't read or write the files (a plain chat), say so and show each file's full text for the user to save in `.offthemode/`; for an existing project, first ask them to paste the README and key files, or open the project in a coding tool. If you can't read `~/.offthemode/ME.md` (a plain chat, a tool limited to the project, a refused permission), say so and ask the shipping questions; if you can't write it, show its text for the user to save there.

## Pick the door
**New project** if there's no application code yet (only config, a README, or nothing), else **existing project**. Say which and why, in one line.

## Questions (both doors)
Use everything the user has already said, and never ask it again. Ask only what the code and docs can't answer: batched, numbered, each with why and your recommended answer, more rounds only if an answer raises a new question. Cover every field the templates leave to the user: person and jobs, how people find it, if they should (search, AI answers, an app store), moment of value, core concept, the name and its checks (guide: p1-vision-skeleton), who it's not for, refusals and tie-breakers, feeling and references (UI only), complexity we absorb, experience promises, success and guardrail, how it ships, in the first round (where the code lives, the branch that goes live, the host, the name commits use, whether anyone besides the user uses or depends on it yet: fill these from git, the host's config and `~/.offthemode/ME.md`, and ask only what is still missing), constraints (platforms, stack, deadline, budget, team, data), file and function size limits (template defaults, to confirm), and what's next. Suggest no speed, weight or accessibility budgets unless the user asks for one. For any reference the user gives, say what you'd take, check its claims at the official source, and go further.

For shipping, use ME.md's hosting and release line only for the project's platform (a web line never fills an iPhone app). For Commits as, ME.md wins over git's global name and email. Where sources disagree rather than miss (a branch named master where ME.md says main), show both in the setup message with your recommendation.

## New project
1. Ask the Questions about the vision.
2. Show the setup message: the PRODUCT.md draft by the template, and RULES.md with what you know (its commands wait for the toolchain).
3. On the answers, create the files, then build the checklist with revisit-checklist's steps.

## Existing project
1. Read the code before asking anything: the README, dependency files, entry points, routes or screens, the data model, the core flow, tests, config and existing rule files (AGENTS.md, CLAUDE.md, .cursor/rules, others).
2. Tell the user in plain words what you understand: what the product is, who it's for, the core concept as the code shows it, what works and what looks unfinished. Ask the Questions in that message.
3. Show the setup message: the PRODUCT.md draft as the product is meant to be, with evidence, and RULES.md with the commands you found.
4. On the answers, create the files. Run the reassess steps, then revisit-checklist's to build the checklist from PRODUCT.md and every note in the report. Show the report and the fragments in one message, with the report saved and the checklist written as those steps say; if reassess's real-input test would touch live data or other people, ask that in the same message (a one-way door). Record the report's summary under the checklist's ## Changes.

## The setup message (both doors)
In one message, show: the PRODUCT.md draft; RULES.md Project specifics and Shipping, each Shipping value with its source (git, the host's config, ME.md or the user's answer); the files you will create in `.offthemode/`, one line each; the exact auto-load line and its file; any rule-file fixes; if this repo's git name or email differs from Commits as, the offer to set them for this repo only (`git config` without `--global`); if the branch differs from the usual one and has no commits yet, the offer to rename it; if `~/.offthemode/ME.md` lacks or differs on a line its template has (code host and account, commit name, this platform's hosting and release), whether to save those lines there as the user's usual, adding or updating only them and keeping the rest (never this project's repo address, never a password, token or key); and whether `.offthemode/` goes in git (recommended, so the team shares it). The answers are the consent: read back in up to three lines and do all of it in that reply. Never write a permission or allow rule yourself.

## Writing RULES.md
Draft Project specifics from what is known now: the stack's known traps (checked against the docs or source of the versions in use, never memory), data rules the domain implies (money in whole cents, every query scoped to the account), security boundaries and, in an existing project, what the code relies on. Keep a line only if it is certain to apply, not something an AI does anyway, and costly if missed (every line is read every session); each says what to do and why.

Existing rule files are the project's refined knowledge and win on project specifics: never move or merge them; list them in RULES.md §This project as in force, and write Project specifics only for what they miss. If a line in them is out of date, or contradicts the code, another rule or an Off the Mode standard, show it with its file and line and the fix in the setup message. Change it only on the user's yes, and record the change in DECISIONS.md.

## Auto-load
Add to existing content, never replace it. Claude Code: in CLAUDE.md, as plain text, `Read @.offthemode/RULES.md and @.offthemode/STATE.md before any change.` Cursor: that line in `.cursor/rules/offthemode.mdc` with `alwaysApply: true`. Gemini CLI: that line in `GEMINI.md`. Tools that read AGENTS.md or their own always-on file (VS Code: `.github/copilot-instructions.md`): that line there.

## Last step (both doors)
Once the checklist exists, write GLOSSARY.md "In plain words" by revisit-glossary's rules (the setup answers cover it). End with what you created, the next 3 steps and three lines: sessions stay free-form, with RULES.md and STATE.md loaded and each kind of work opening its guide, and revisit-state saves where things stand before a fresh session; revisit-checklist, reassess, revisit-comments and revisit-glossary run whenever they want a check; See it as a page: /view-project, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).
