## P0 · Constitution

> **Output:** `.offthemode/RULES.md` filled in for this project and loaded by your AI tool at the start of every session, `.offthemode/STATE.md` with the first next step written down, and `.offthemode/DECISIONS.md` with an entry for each stack choice.

The constitution is everything your AI knows before you type a word, so every prompt you send is multiplied by it. In Off the Mode it is three files. RULES.md holds the standards every change is held to. STATE.md says where things stand right now. DECISIONS.md records what was chosen, what was rejected and why.

> **Why:** Standing rules change your AI's behavior once, so you stop re-steering it in every prompt. But text that loads every session competes with the task for attention, and each extra instruction slightly weakens how well the others are followed. Writing rules is a budgeting problem: the most steering for the fewest words.

### What loads when

| File | Loads | Holds |
|---|---|---|
| `RULES.md` | Every session, automatically | The standards, the commands, the map of guides |
| `STATE.md` | Every session, automatically | The present: what works, what is next, what is unverified |
| The matching guide | Before planning or doing that kind of work, once per session | The technique for that work; RULES.md §Guides says which guide |
| `PRODUCT.md` | Before any product or experience decision | Vision, core concept, person, job, refusals, feeling |
| `DECISIONS.md` | Searched before anything is decided again | Every choice with its reason |
| `CHECKLIST.md`, `GLOSSARY.md`, and docs such as `DESIGN.md` or `SKELETON.md` | When the work touches them | Fragments, names, deeper detail |

Only the first two load every session. Everything else is named by its path and opened when relevant. Guides come from the get_method tool or the skill's method/ folder.

> **Rule:** Depth that only one kind of work needs belongs in a guide or a doc, not in RULES.md. A rule about button states costs attention in every database session. RULES.md points to where the depth lives, and the depth loads only when the work needs it.

### What goes in RULES.md

Start from the RULES.md template (from get_template or the skill's templates/ folder). It arrives with twelve sections and sound defaults. The offthemode command fills in the parts that belong to your project. This sheet explains what makes each part work.

| Section | What makes it good | Example line |
|---|---|---|
| This project | One line on what it is and for whom; platforms; the stack pinned with versions and a reason for each; the boundaries between parts; two to four non-negotiables | "The core loop works offline and syncs later." |
| How to work | How doubt is handled, which changes stop for your go, how questions are asked | "Schema, auth, payments, a public contract or a new dependency: stop and ask." |
| Guides | Each kind of work this project will see, mapped to the guide to open first | "Any screen or visual change: open the Visual Language guide." |
| Product first | How every proposal ties back to the person and job in PRODUCT.md | "If a request contradicts a PRODUCT.md refusal, quote the line before acting." |
| Depth | Where facts come from: specs, platform docs, the installed source, not tutorials or memory | "Before using a library API, open the installed version's types and cite file:line." |
| Code | Standards with reasons, and bans paired with what to do instead | "Parse external input at the boundary, then trust the types: one place validates." |
| Look and feel | Pointers to PRODUCT.md §Feeling and DESIGN.md, and the test for generic output | "If what you are about to make could sit on any other product unchanged, stop and say so." |
| Safety | What must never happen, whatever the task | "Authorization is enforced at the data layer, never only in the UI." |
| Efficiency | Scripts over eyeballing, shared briefs, short results | "Anything measurable is measured by a script, not judged by eye." |
| Budgets | The numbers: speed, size, contrast, touch target sizes | "First useful result within 2 s of a cold start on a mid-range phone." |
| Commands | The exact commands, ready to copy, and the viewports to check | "Fast check: `pnpm check` (types, lint, unit tests)." |
| Done means verified | What must be true before anything is called done | "UI changes are looked at on phone, tablet and wide widths, light and dark." |

> **Trap:** On a new project the stack comes out of the vision and skeleton work (P1). Leave the stack fields as open hypotheses until then, and never let your AI guess a stack just to fill the template. On an existing project, your AI reads the stack, commands and conventions from the code and shows where each one came from.

#### Four parts that do most of the work

These are also the parts most often missing.

1. **Opinions with reasons.** "No raw hex colors, because the design system must stay editable in one place" also stops raw spacing values, because your AI can apply the reason to cases the rule never named. A rule without a reason is followed only where it literally applies.
2. **Bans paired with what to do instead.** A bare ban leaves your AI with the next most likely option, which is often the same mistake in a new form. Write the replacement next to the ban.
3. **A doubt policy split by how reversible the change is.** Never build on an assumption: your AI writes the doubt as a hypothesis ("I think X, because Y") and confirms it in the code, the docs or by asking. Small, reversible choices it makes with a stated default and tells you about. Hard-to-reverse ones (schema, auth, payments, a public contract, a new dependency, and any paths you list for this project) stop for your go. Questions arrive batched and numbered, at most five per round, each with a recommended default, so you can reply "1 ok, 2 b, 3 yours".
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

Setup (the offthemode command) wires RULES.md and STATE.md into your tool's auto-load, the files it reads into every session on its own, so both are in context before your first message. It shows you the exact lines first and adds them after you say go. To check the wiring, or to do it by hand:

| Tool | Where | What to add |
|---|---|---|
| Claude Code | `CLAUDE.md` at the project root | Two lines: `@.offthemode/RULES.md` and `@.offthemode/STATE.md` |
| Cursor | `.cursor/rules/offthemode.mdc` | A rule with `alwaysApply: true` (below) |
| Codex, and any tool that reads `AGENTS.md` | `AGENTS.md` at the project root | One line: "At the start of every session, read .offthemode/RULES.md and .offthemode/STATE.md and follow them." |
| Tools with their own always-on instructions file | That file (in VS Code, `.github/copilot-instructions.md`) | The same one line |

If the file already exists, the lines go at the top and everything else stays. For Cursor, the settings block between the `---` lines at the top of the file (its frontmatter) is what makes the rule apply to every session.

```file path=".cursor/rules/offthemode.mdc"
---
description: Off the Mode standing rules and current state
alwaysApply: true
---
At the start of every session, read .offthemode/RULES.md and .offthemode/STATE.md and follow them.
@.offthemode/RULES.md
@.offthemode/STATE.md
```

> **Rule:** In Claude Code, a line in CLAUDE.md that starts with @ is an import: the file loads at launch, every session. A plain path is read only when relevant. Imports organize, they do not shrink, because everything imported loads. Import RULES.md and STATE.md and nothing else. The most common cause of ignored rules is a CLAUDE.md that @-imports the whole docs folder.

When you connect through the MCP link, the server also repeats the instruction to load both files as a standing instruction, so the habit holds even before the auto-load is wired. If your tool has no auto-load at all, paste the Session Start prompt below at the top of each session.

### Memory across sessions

Your AI has no memory between sessions, so the project is its memory. Chat history is not storage. Start a fresh session between unrelated tasks (/clear in Claude Code), and let the files carry what matters.

- STATE.md is rewritten, not added to, when a piece of work ends. The next session needs the present, not a diary.
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
Then interview me, in rounds of at most 5 numbered questions, each with your recommended answer and a one-line reason. Cover, in order: what it is and the moment of value; non-negotiables; platforms, stack and versions; the boundaries between parts and where the core sits; which changes must stop for my go; the traps of this stack, each with its replacement; the budgets; the exact check, lint-one-file, dev, screenshot, audit and end-to-end commands, and the viewports. Stop an area when you could predict my answer to a new question in it.
Then draft:
- RULES.md: every section filled for this project, every standard with its reason, every ban with what to do instead, §Guides mapped to the kinds of work this project will see. Delete any line you would follow correctly without being told. About 150 lines at most.
- STATE.md: the present, and item 1 of Next with its done-check.
- DECISIONS.md: one entry per stack choice, with rejected alternatives and why not.
- The auto-load wiring for {{TOOL}}, so RULES.md and STATE.md load every session.
Tag anything I did not confirm [hypothesis], and confirm it with me before relying on it. Show me each file and exactly what you will create or change. Write nothing until I say go, then tell me what you wrote.
```

Normal sessions stay free-form: you just describe the work. When you want a crisp start, for example after a break or on a hard task, paste this.

```prompt title="Session Start"
New session. .offthemode/RULES.md and .offthemode/STATE.md should be in your context; if not, read them now. Task: {{TASK, or "item 1 of Next in STATE.md"}}.
Reply with:
1. Where things stand, in two sentences, in your own words.
2. The step you will do now and its done-check.
3. The plan in at most 7 bullets: the files you will touch, the guide you will open (RULES.md §Guides), and the DECISIONS.md entries and RULES.md lines that constrain it.
4. How you will verify: the commands, and the screens at phone, tablet and wide widths.
5. Numbered questions with your recommended defaults, or "no questions".
Small, reversible steps: proceed unless I object. Anything RULES.md §How to work says needs my go: wait for "go".
```

When a piece of work ends, paste this so the next session starts where this one stopped.

```prompt title="Session End Handoff"
End the session, in this order:
1. Rewrite .offthemode/STATE.md from scratch: present tense, no history, under 40 lines. A fresh session with no chat context must be able to start item 1 of Next, so name the files, the commands and the done-check.
2. Append a DECISIONS.md entry for every decision made this session. There should be no silent ones; if you find one, list it as a hypothesis for me to confirm.
3. Sort every correction I gave. First time: add it to the corrections-seen-once list in STATE.md. Second time: propose one RULES.md line, imperative and specific, with its reason. A matter of taste: propose a line for .offthemode/DESIGN.md or PRODUCT.md §Feeling. A flaw in a prompt I pasted: propose the fixed prompt. A rule broken again although it is already in RULES.md: propose a check (a lint rule, a test or a script in §Commands).
4. List everything claimed but not verified as unverified in STATE.md. The next session trusts this file.
5. Propose edits for any RULES.md line that proved wrong, stale or in conflict with another.
6. Run {{?CHECK_CMD}}. If the project uses git, propose a commit "{{type}}: {{summary}}" with the D- ids in the body.
Do steps 1, 2 and 4 now. Reply with a five-line summary, then the proposals from steps 3, 5 and 6. Apply them only after I say go.
```

### From correction to rule

A correction you give once is a moment. A correction you give twice is a missing rule.

- **First time:** it goes in STATE.md's corrections-seen-once list, with the date.
- **Second time:** it becomes one line in RULES.md, imperative and specific, with its reason. For example: "Before using a date API, open the installed version's types. Because: an API removed in the current major version cost three rounds to compile."
- **Checkable:** once a machine can check the rule (with a lint rule, which is an automatic code check, a test or a script), add the check to §Commands and delete the prose line. The check is now the rule, and a check does not forget.

| The correction was about | It goes in |
|---|---|
| How code is written or work is done here | RULES.md, in the matching section |
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
