## P0 · Constitution

> **Output:** `.offthemode/RULES.md` filled in for this project and loaded by your AI tool at the start of every session, with §Safety holding the day-one security rules; `.offthemode/STATE.md` with the first next step written down; and `.offthemode/DECISIONS.md` with an entry for each stack choice.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Hold every change to RULES.md as it stands. Don't rewrite it as a side effect of another task.
- The project's own rule files (AGENTS.md, CLAUDE.md, .cursor/rules and the like) stay where they are and win on project specifics: never move or merge them. A line that contradicts the code, another rule or an Off the Mode standard, or is out of date, is shown with its fix and changed only on the user's go, recorded in DECISIONS.md. Besides those fixes, the one auto-load line is the only addition, also on the user's go.
- Before deciding anything, search DECISIONS.md, so a settled choice is not argued again.
- A correction given once goes in STATE.md §Corrections seen once, with the date. Given a second time, propose one line for RULES.md §Project specifics with its reason, and add it on the user's go.
- Keep STATE.md current without asking: at the end of any reply that changes a project file or concludes a decision, follow revisit-state's steps (present tense, no history, never the same line twice) and append any new decision to DECISIONS.md. While an Off the Mode command runs, it touches only what the command names, and STATE.md catches up after it. The user can also type revisit-state.
- Open the whole guide to set up or redo the rules, wire the auto-load, or prune RULES.md.
<!-- /offthemode:rules -->

The constitution is everything your AI knows before you type a word, so every prompt you send is multiplied by it. In Off the Mode it is three files. RULES.md holds the standards every change is held to. STATE.md says where things stand right now. DECISIONS.md records what was chosen, what was rejected and why.

> **Why:** Standing rules change your AI's behavior once, so you stop re-steering it in every prompt. But text that loads every session competes with the task for attention, and each extra instruction slightly weakens how well the others are followed. Writing rules is a budgeting problem: the most steering for the fewest words.

### What loads when

| File | Loads | Holds |
|---|---|---|
| `RULES.md` | Every session, automatically | The standards, the commands, the map of guides |
| `STATE.md` | Every session, automatically | The present: what works, what is next, what is unverified |
| The matching guide | Before planning or doing that kind of work, once per session: its working rules for a change inside an existing product, the whole guide when a phase starts or its structure changes | The technique for that work; RULES.md §Guides says which guide |
| `PRODUCT.md` | Before any product or experience decision | Vision, core concept, person, job, refusals, feeling |
| `DECISIONS.md` | Searched before anything is decided again | Every choice with its reason |
| `CHECKLIST.md`, `GLOSSARY.md`, and docs such as `DESIGN.md` or `SKELETON.md` | When the work touches them | Fragments, names, deeper detail |

Only the first two load every session. Everything else is named by its path and opened when relevant. Guides come from the get_method tool or the offthemode skill's method/ folder (see Where the guides come from, in How to add it).

> **Rule:** Depth that only one kind of work needs belongs in a guide or a doc, not in RULES.md. A rule about button states costs attention in every database session. RULES.md points to where the depth lives, and the depth loads only when the work needs it.

### What goes in RULES.md

Start from the RULES.md template (from get_template or the skill's templates/ folder). It arrives with its sections and sound defaults. The offthemode command fills in the parts that belong to your project. This guide explains what makes each part work.

| Section | What makes it good | Example line |
|---|---|---|
| This project | One line on what it is and for whom; platforms; the stack pinned with versions, each with its reason in DECISIONS.md; the project's own rule files, listed as still in force | "Other rule files that stay in force: AGENTS.md." |
| Project specifics | Rules only this project needs: the stack's known traps, data rules, security boundaries, the boundaries between parts. Kept apart from the Off the Mode standards and never repeating the project's own rule files. A line stays only if it is certain to apply, is not something an AI does anyway, and is costly if missed | "The core loop works offline and syncs later, because the person edits on the train." |
| Shipping | How the project goes live: where the code lives, the branch that goes live, the host, whether a push deploys, the deploy command, the name commits use. Setup fills it from git and the host's config, asks only what is missing, and offers to keep your answers as your usual in `~/.offthemode/ME.md` (outside every project, never a password, token or key) so the next project only asks you to confirm | "Never push, deploy or publish without my go" |
| How to work | How doubt is handled, when to wait for your go, how questions are asked | "Anything beyond a small fix: show the plan and wait for my go." |
| Guides | Each kind of work this project will see, mapped to the guide to open first | "Any screen or visual change: open the Visual Language guide." |
| Product first | How every proposal ties back to the person and job in PRODUCT.md | "If a request contradicts a PRODUCT.md refusal, quote the line before acting." |
| Depth | Where facts come from: specs, platform docs, the installed source, not tutorials or memory | "Before using a library API, open the installed version's types and cite file:line." |
| Code | Standards with reasons, and bans paired with what to do instead | "Parse external input at the boundary, then trust the types: one place validates." |
| Look and feel | Pointers to PRODUCT.md §Feeling and DESIGN.md, and the test for generic output | "If what you are about to make could sit on any other product unchanged, stop and say so." |
| Safety | What must never happen, whatever the task: the day-one security rules, and a pointer to SECURITY.md once it is written (see P7 · Security Hardening) | "Authorization is checked on the server for every action, never only in the UI." |
| Efficiency | Scripts over eyeballing, shared briefs, short results | "Anything measurable is measured by a script, not judged by eye." |
| Budgets | The numbers, in one json block the check scripts read. The template ships the file and function size limits and the screenshot sizes; a speed, contrast or touch-size key is added only when this product should hold one (Accessibility & Performance Budgets lists common keys) | `"max_file_lines": 400` |
| Commands | The exact commands, ready to copy | "Fast check: `pnpm check` (types, lint, unit tests)." |
| Done means verified | What must be true before anything is called done | "UI changes are looked at on phone, tablet and wide widths, light and dark." |

> **Trap:** On a new project the stack comes out of the vision and skeleton work (P1). Leave the stack fields as open hypotheses until then, and never let your AI guess a stack just to fill the template. On an existing project, your AI reads the stack, commands and conventions from the code and shows where each one came from.

#### Four parts that do most of the work

These are also the parts most often missing.

1. **Opinions with reasons.** "No raw hex colors, because the design system must stay editable in one place" also stops raw spacing values, because your AI can apply the reason to cases the rule never named. A rule without a reason is followed only where it literally applies.
2. **Bans paired with what to do instead.** A bare ban leaves your AI with the next most likely option, which is often the same mistake in a new form. Write the replacement next to the ban.
3. **A doubt policy that never builds on a guess, and one rule for when to wait.** Your AI writes every doubt as a hypothesis ("I think X, because Y") and confirms it in the code, the docs or by asking before anything rests on it, however small or reversible the choice. When to wait is one rule: a small fix (a typo, a one-line change) gets one line on what will change and goes ahead; anything bigger is shown as a plan and waits for your go. A go covers what the plan showed. If the work turns out to need more, and always before a schema, auth, payment, public-contract or dependency change the plan didn't show, it stops and asks again. Questions arrive batched and numbered, each with a recommended answer, so you can reply "1 ok, 2 b, 3 yours"; more rounds follow if needed.
4. **A definition of done that includes seeing the result.** Checks pass, the thing actually ran, screens were looked at on phone, tablet and wide widths, and there are no new console errors. "Should work" is not done.

#### Code standards, each with its reason

Lines like these belong in §Code. Adapt them to your stack.

- Discriminated unions instead of boolean flags (a discriminated union is a type where each state is its own named shape): impossible states cannot be written down.
- Parse external input at the boundary with one schema library, then trust the types: one place validates.
- Group files by feature: one task means one folder in context.
- Names come from GLOSSARY.md, one term per concept: code, copy and prompts stay aligned.
- Visual values come only from design tokens (named values for color, spacing and type): the design system stays editable in one place.
- No escape hatches from the type system (any, force-unwrap, !!, unchecked casts) without a comment giving the reason: each one hides a bug the compiler would have caught.
- The smallest change that fully solves the task. Drive-by refactors become follow-ups: small changes are easy to review and easy to undo.
- Every bug fix starts with a failing regression test (a test that reproduces the bug, then passes once it is fixed): the bug cannot quietly return.

> **Why:** The glossary line matters more than it looks. When "space", "workspace" and "project" all float around for one concept, your AI builds three models, three routes and three sets of copy.

| Banned | Instead | Why |
|---|---|---|
| Casts to silence the compiler | Fix the type | Casts hide real bugs |
| Catch, log, continue | A typed error result, or rethrow with context | Silent corruption |
| Fetching data inside view components | Feature loaders over the data layer | One place for caching, retries and errors |
| String literals for routes, events and keys | Typed constants | Safe renames |
| A new dependency for what the platform already does | The platform API, or 50 lines of your own | Weight and removal cost; a dependency that is truly needed gets a DECISIONS.md entry |

Add the common traps of your own stack the same way, each with its replacement and its reason.

#### Short enough to read every session

- Keep it to a few screens. About 150 lines is a good ceiling. Past that, the rules start to lose to the task.
- Every line passes one test: would your AI do the wrong thing without it? If not, delete it.
- Emphasis (capitals, "IMPORTANT") on three rules at most. If everything is loud, nothing is.
- Do not copy what lives elsewhere. Point to PRODUCT.md for the job, DESIGN.md for the look, DECISIONS.md for the why.

### Load it every session

Setup (the offthemode command) wires RULES.md and STATE.md into your tool's auto-load, the files it reads into every session on its own, so both are in context before your first message. It adds one line, and only that: it shows you the exact line first and adds it after you say go. To check the wiring, or to do it by hand:

| Tool | Where | What to add |
|---|---|---|
| Claude Code | `CLAUDE.md` at the project root | One line: `Read @.offthemode/RULES.md and @.offthemode/STATE.md before any change.` |
| Cursor | `.cursor/rules/offthemode.mdc` | A rule with `alwaysApply: true` holding the same line (below) |
| Codex, and any tool that reads `AGENTS.md` | `AGENTS.md` at the project root | The same line |
| Gemini CLI | `GEMINI.md` at the project root | The same line |
| Tools with their own always-on instructions file | That file (in VS Code, `.github/copilot-instructions.md`) | The same line |

If the file already exists, the line goes at the top and everything else stays as it is. For Cursor, the settings block between the `---` lines at the top of the file (its frontmatter) is what makes the rule apply to every session.

```file path=".cursor/rules/offthemode.mdc"
---
description: Off the Mode standing rules and current state
alwaysApply: true
---
Read @.offthemode/RULES.md and @.offthemode/STATE.md before any change.
```

> **Rule:** In Claude Code, an `@path` in CLAUDE.md is an import: the file loads at launch, every session. A path without the @ is read only when relevant. Imports organize, they do not shrink, because everything imported loads. Import RULES.md and STATE.md and nothing else. The most common cause of ignored rules is a CLAUDE.md that @-imports the whole docs folder.

When you connect through the MCP link, the server also repeats the instruction to load both files as a standing instruction, so the habit holds even before the auto-load is wired. If your tool has no auto-load at all, paste the Session Start prompt below at the top of each session.

### Memory across sessions

Your AI has no memory between sessions, so the project is its memory. Chat history is not storage. Start a fresh session between unrelated tasks (/clear in Claude Code), and let the files carry what matters.

- STATE.md is rewritten, not added to: at the end of any reply that changes a file or settles a decision, your AI runs `revisit-state` by itself (after any other command has finished), and you can type it whenever you want, for example before a fresh session. Each thing has one line, so running it again never adds anything twice. The next session needs the present, not a diary.
- DECISIONS.md is appended to, never rewritten. It is the record of why, so no later session argues a settled choice again or quietly reverses it.

#### A STATE.md that works

The STATE.md template (from get_template or the skill's templates/ folder) sets the sections. What makes it work:

- Under 40 lines, present tense, no history.
- A fresh session with no chat context can start the first next step from this file alone, so it names the files, the commands and the done-check.
- Work that was claimed but not verified is listed as unverified. The next session trusts this file, so it must not flatter.
- It says what is waiting on you, what is known broken and what must not be touched, each with the reason.
- A short list at the bottom holds corrections seen once, each with a date. That list is how a repeated correction gets caught (see below).

#### A DECISIONS.md entry that works

Entries are numbered D-001, D-002 and so on, newest at the bottom. A superseded entry stays, marked "superseded by D-###".

| Field | What goes in |
|---|---|
| Title, date, status | Status is decided, hypothesis to confirm (nothing built on it yet), or superseded by D-### |
| Context | What forced a decision |
| Decision | What the project does |
| Rejected | Each alternative, with why not |
| Because | The reason, tied to PRODUCT.md, a budget or a spike result (a spike is a small throwaway build that tests one risky idea) |
| Revisit if | The condition that would reopen it |

Every stack choice gets an entry with its rejected alternatives. So does every new dependency: what it does that 50 lines of your own cannot, its weight, and the cost of removing it later.

> **Pro move:** "Rejected" is the most valuable line. Without it, a later session proposes the option you already ruled out, and you pay for the same argument twice. RULES.md §How to work should tell your AI to search DECISIONS.md before deciding anything again.

### Prompts

The offthemode command drafts these files for you. Use this prompt to redo the rules on a project that already has them, or to draft them in a tool without the method connected.

```prompt title="Draft the Rules"
Set up the standing rules for {{PROJECT_NAME}}: .offthemode/RULES.md, .offthemode/STATE.md and .offthemode/DECISIONS.md. Start from the templates (get_template, or the skill's templates/ folder), and read .offthemode/PRODUCT.md if it exists.
First read the project and fill in what you can: {{?STACK}}, {{?COMMANDS}}, {{?CONVENTIONS}}. Show each thing you found with the file it came from.
Then interview me with batched, numbered questions, each with your recommended answer and a one-line reason, in more rounds if needed. Ask only what the project can't tell you. Cover, in order: what it is and the moment of value; non-negotiables; platforms, stack and versions; the boundaries between parts and where the core sits; any area where a change always needs its own go, even inside an approved plan; the traps of this stack, each with its replacement; the file and function size limits and the screenshot sizes (the template's defaults, for me to confirm); the exact check, lint-one-file, dev, screenshot, audit and end-to-end commands. Suggest no speed, contrast or touch-size numbers; add one to §Budgets only if I ask. Stop an area when you could predict my answer to a new question in it.
Then draft:
- RULES.md: every section of the template filled for this project, every standard with its reason, every ban with what to do instead, §Guides mapped to the kinds of work this project will see. §This project lists the project's own rule files (AGENTS.md, CLAUDE.md, .cursor/rules and the like) as still in force; they are never moved or merged; a line in them that is out of date or conflicts with the code, another rule or an Off the Mode standard is shown with its fix and changed only on my go, recorded in DECISIONS.md. Besides those fixes, the auto-load line is the only addition. §Project specifics holds only what those files don't already cover, and a line stays only if it is certain to apply, is not something an AI does anyway, and is costly if missed. Delete any line you would follow correctly without being told. About 150 lines at most.
- STATE.md: the present, and item 1 of Next with its done-check.
- DECISIONS.md: one entry per stack choice, with rejected alternatives and why not.
- The auto-load line for {{TOOL}}, so RULES.md and STATE.md load every session: the only addition outside .offthemode/.
Tag anything I did not confirm [hypothesis], and confirm it with me before relying on it. Show me each file and exactly what you will create or change. Write nothing until I say go, then tell me what you wrote.
```

Normal sessions stay free-form: you just describe the work. When you want a crisp start, for example after a break or on a hard task, paste this.

```prompt title="Session Start"
New session. .offthemode/RULES.md and .offthemode/STATE.md should be in your context; if not, read them now. Task: {{TASK, or "item 1 of Next in STATE.md"}}.
Reply with:
1. Where things stand, in two sentences, in your own words.
2. The step you will do now and its done-check.
3. The plan in at most 7 bullets: the files you will touch, the guide you will open (RULES.md §Guides; its working rules are enough for a change inside what exists), and the DECISIONS.md entries and RULES.md lines that constrain it.
4. How you will verify: the commands, and the screens at phone, tablet and wide widths.
5. Your hypotheses ("I think X, because Y") and numbered questions, each with your recommended answer, or "no questions".
Then follow RULES.md §How to work: a small fix (a typo, a one-line change) goes ahead after one line saying what will change; anything else waits for my "go". Nothing is built on a hypothesis until it is confirmed.
```

Your AI runs `revisit-state` by itself after a reply that changes files or settles a decision; run it yourself before you start a fresh session to be sure. It saves where things stand, so the next session starts where this one stopped. In a tool where the commands aren't set up, paste it:

```prompt title="Revisit State"
# Off the Mode · revisit state

Save where things stand, so the next session can start from here with no chat history. Run it when the user types it or asks for it, and on your own at the end of any reply that changed a project file or concluded a decision. It writes only `.offthemode/STATE.md` and `.offthemode/DECISIONS.md`, and, where the project uses git, git keeps their earlier versions, so it saves without asking, with no plan to approve first. While another Off the Mode command is running, wait until it has finished.

If no `.offthemode/` folder holding RULES.md is found here or in a folder above: when the user asked, say the project isn't set up yet and offer the offthemode command, which sets it up; run on its own, do nothing and say nothing.

Sources: this session so far, the files as they are now, and, if the project uses git, what changed since STATE.md was last saved: `git status`, and `git log --since="<the date on STATE.md's first line> 00:00"` (a bare date counts from the current time of day and misses that day's earlier commits). Files and git are fact; the chat says what was meant and decided.

Never write the same thing twice, so it can run as often as it needs to. STATE.md is updated in place, never added to: each fact, step, item and correction has one line, so update the line that already says it, even in other words, instead of adding another. Search DECISIONS.md before adding to it. Run twice in a row, it changes nothing the second time.

1. Update `.offthemode/STATE.md` in place, keeping its sections and, word for word, every line that is still true: present tense, no history, under 40 lines, the first line dated today. A fresh session with no chat must be able to start item 1 of Next from this file alone, so name the files, the commands and the done-check. List everything claimed but not proven as unverified, because the next session trusts this file.
2. Append a `.offthemode/DECISIONS.md` entry, in the file's own format, for each decision from these sources that DECISIONS.md doesn't hold yet, even in other words, with the user's own words as the reason where there are some. A decision that changes an earlier entry gets a new entry naming the one it changes; the earlier entry's text stays as it is, and when the new entry replaces it whole, its status becomes "superseded by D-###", as the file's header says. A choice that isn't clearly settled, including one the code shows but the chat never named, stays out: write it as a question under STATE.md's Waiting on me, and ask it in the reply.
3. Add each correction the user gave for the first time to STATE.md's Corrections seen once, dated, unless it is already there. A correction the user gave again after it was already on that list has now been given twice: propose where it goes, as From correction to rule in the p0-constitution guide sorts it (a line for RULES.md §Project specifics with its reason; taste, a line for PRODUCT.md §Feeling or `.offthemode/DESIGN.md`; a pasted prompt that misled, its fixed version; a written rule broken again, a check in RULES.md §Commands), and keep it on the list, marked proposed, until that line is added. Propose a fix for any RULES.md line that proved wrong or out of date. Nothing in this step is applied without the user's go; list each proposal still waiting under STATE.md's Waiting on me, so a fresh session still has it.

When the user asked for it, reply in at most 8 lines: what changed in STATE.md, item 1 of Next first; the decisions added, by id; anything waiting for the user's go. When it ran on its own, add nothing to the reply unless this run added a question or proposal to Waiting on me; then ask only what it added. If STATE.md and DECISIONS.md already hold everything the steps above would write, change nothing, not even the date, and when asked, say STATE.md was already up to date.
```

### From correction to rule

A correction you give once is a moment. A correction you give twice is a missing rule.

- **First time:** it goes in STATE.md's corrections-seen-once list, with the date.
- **Second time:** it becomes one line in RULES.md §Project specifics, imperative and specific, with its reason, added on your go. For example: "Before using a date API, open the installed version's types. Because: an API removed in the current major version cost three rounds to compile."
- **Checkable:** once a machine can check the rule (with a lint rule, which is an automatic code check, a test or a script), add the check to §Commands and delete the prose line. The check is now the rule, and a check does not forget.

| The correction was about | It goes in |
|---|---|
| How code is written or work is done here | RULES.md §Project specifics |
| Taste: the look, the tone, the feel | PRODUCT.md §Feeling or .offthemode/DESIGN.md |
| A choice between options | DECISIONS.md |
| A prompt that led your AI wrong | The prompt itself, fixed |
| A rule already written and broken again | A check in §Commands |

> **Why:** A rule is a request; a check is an exit code (the pass or fail signal a script returns). Prose rules compete for attention. Checks do not.

> **Pro move:** If your tool supports hooks (scripts it runs on events such as after each edit; Claude Code and Cursor do), you can run the fast check after every edit and hold back a claim of done while checks fail. Gate only an explicit claim of done, never every turn, or the gate overrides your own checkpoints such as "stop after step 2 for my review". Everything in this method works without hooks; they only make the checks automatic.

### Prune the rules

Rules rot silently. A rule about a library you already removed still takes attention, and it can pull your AI back toward the old pattern. Prune whenever a checklist fragment is completed, and whenever a rule gets in the way.

- [ ] Every line passes "would the AI do the wrong thing without this?"
- [ ] Every rule has a reason, every ban a replacement, and no two rules conflict
- [ ] Rules now enforced by a check are gone from the prose
- [ ] No line points to a file, library, command or folder that no longer exists
- [ ] Emphasis on three rules at most
- [ ] RULES.md and STATE.md together still fit the budget; `wc -l .offthemode/RULES.md .offthemode/STATE.md` measures it

Run the review in a second, fresh AI session, asked to review with no memory of writing the rules. Whoever wrote a rule is the worst judge of whether it is still needed.

```prompt title="Prune the Rules"
You are reviewing .offthemode/RULES.md with fresh eyes; you did not write it. Read it, then check it against the project as it is now: the code, .offthemode/STATE.md, .offthemode/DECISIONS.md and the commands in RULES.md §Commands.
Report, as a numbered list, each line that: conflicts with another line; names a file, library, command or folder that no longer exists; has no reason; bans something without saying what to do instead; is already enforced by a check; or would be followed correctly without being written. For each one, say keep, cut, merge or rewrite, and give the exact new text.
Also report the combined line count of RULES.md and STATE.md, and which three rules, if any, deserve emphasis.
Change nothing. I will say which edits to apply.
```

> **Trap:** The fix for an ignored rule is rarely a louder rule. Look first for a rule that conflicts with it, a missing reason, or a file grown too long to hold attention.
