# Off the Mode

Left alone, every AI coding tool returns the mode of its training data, meaning the most common answer: the most common stack, the most common landing page, the most common happy-path code. Off the Mode pulls your AI off that average. It is a prompt-engineering setup that makes your AI plan first, build in order and hold an elite bar on your project, new or existing: web, mobile, backend or data, a weekend build or a complex product. It works with any AI coding tool, including Claude, Cursor, VS Code, Windsurf and Codex. Add it by pasting https://offthemode.vercel.app/mcp into your tool, or by putting the skills pack in your tool's skills folder.

In your project it adds the `.offthemode/` folder, plus one line you approve so your tool loads it. Setup writes six core files there: PRODUCT.md (what you are building and for whom), RULES.md (the standards every change is held to), CHECKLIST.md (the core, split into fragments), GLOSSARY.md (the product in plain words), STATE.md (where things stand) and DECISIONS.md (what was decided and why). Some guides add an optional document to the same folder when their work needs one; How to add it lists them all. Your AI loads RULES.md and STATE.md at the start of every session, and you keep working free-form. Five commands do the upkeep: `offthemode`, `listrevisit`, `reassess`, `commentrevisit` and `glossaryrevisit`. Every command talks first: it tells you what it found and exactly what it will change, waits for your go, then does it and says what it did.

You do not read this method front to back. Each guide covers one kind of work. RULES.md §Guides maps each kind of work to its guide, and your AI opens the matching guide before it plans or does that work. Each phase guide starts with short working rules: for a change inside an existing product, your AI opens just those; it opens the whole guide when it starts that phase or changes what the phase built. How to add it says where the guides come from. You can read any guide yourself: The Pipeline shows the order, and Product-First Doctrine shows the lens used at every step.

In templates, `{{NAME}}` is something only you can answer, and `{{?NAME}}` is something your AI works out from the code or the docs and shows with its source (`PERSON <- PRODUCT.md, line 7`), so most prompts need one input from you, not ten. `{{NAME | x}}` means x is the recommended default: your AI shows it to you to confirm and never keeps it silently. A list of choices is written with "or", such as `{{web, iOS or Android}}`: pick what applies. Text after a colon is a hint.

## The Pipeline

The method runs in one order: the product lens, rules, plan, look and feel, backend, navigation, the core built in fragments, security, ship. Each phase has its own guide, and each one leaves something behind in `.offthemode/` or in the code.

| Phase | Purpose | Output |
|---|---|---|
| Product-First Doctrine | Person, job and moment of value, decided before any tech, with evidence | Five decisions in PRODUCT.md; the experience promises as script checks |
| P0 · Constitution | Standing rules and memory that make every prompt stronger | RULES.md, STATE.md, DECISIONS.md, loaded by your tool at every session start |
| Expertise Injection | Load the judgment of the people who invented the tools, not a job title | Expert judgment written into RULES.md; reviews by a second, fresh AI session |
| P1 · Vision & Skeleton | A vision precise enough that two AI tools would build the same product | PRODUCT.md, SKELETON.md |
| Living Checklist | The plan as core fragments with provable done-whens: work free-form, revisit the list any time | CHECKLIST.md, `listrevisit` |
| P2 · Core Spike | Optional: prove a fragment marked "Verify: early" before building on it, when it can be proven on its own | A verdict with numbers, the core contract, a feel test with 3 people |
| P3 · Visual Language | A real point of view, not the average's, locked in as code | PRODUCT.md §Feeling, DESIGN.md, design tokens, a specimen page, audits |
| P4 · Backend & Infra | Boring, strong and ready to host from the first commit | Schema, API contract or sync engine, environments; choices in DECISIONS.md |
| P5 · Navigation & Flows | Nouns as navigation, state in the URL, a clickable shell | ROUTES.md, a clickable skeleton, the Five-Person Test |
| Taming Complexity | The system carries the complexity; the person sees it only on request | COMPLEXITY.md, a regular audit |
| P6 · Core Build & Iteration | The core built as small, fenced, verified slices | Slices behind flags, baselines, evals, checklist items closed with evidence |
| P7 · Security Hardening | Audit the controls that were built in from day one | SECURITY.md, red-team findings |
| P8 · Ship & Operate | Hosted is not shipped | Launch checklist, landing page as a live demo, runbook, lessons added to RULES.md |
| Always-On rails | Verification, words, real data, budgets, instrumentation, orchestration, prompts, revisits | Check scripts, evals, VOICE.md, seed data, RULES.md §Budgets, prompt templates, `reassess`, `commentrevisit`, `glossaryrevisit` |

This is not a waterfall. P1 and P2 form one loop. P4 and P5 run in parallel once a mock server exists. P6 loops dozens of times, and P7 only audits controls that RULES.md §Safety, P4 and P6 already built. The Always-On rails run under every phase from the first commit.

The Doctrine and Taming Complexity are lenses, applied at every phase gate: an output that cannot name the person, job and moment it serves is not done. Two gates use real people, because every other judge in the method is a model or you: 3 target people try the feel prototype after P2, and 5 do the core job on the clickable skeleton after P5.

Scale the depth to the project. A weekend build goes lighter at each gate than a product with paying users. On an existing project, start at the phase the work is in, and use the earlier phases as checks on what already exists.

```mermaid
flowchart LR
  D[Product lens] --> R[Rules] --> S[Vision + skeleton] --> L[Checklist of core fragments] --> C[Core spike + feel test, optional] --> V[Visual language] --> B[Backend + infra] --> N[Navigation + five-person test] --> K[Core build] --> H[Security audit] --> O[Ship + operate]
  O -. lessons become new rules .-> R
  subgraph AO [Always-On rails under every phase]
    direction LR
    A1[Verification] --- A2[Words] --- A3[Real data] --- A4[Budgets] --- A5[Instrumentation] --- A6[Orchestration] --- A7[Prompt library] --- A8[Revisits]
  end
```

## Why each part exists

Each part of the method is there because building with AI goes wrong in a specific way without it.

| Part | What goes wrong without it |
|---|---|
| Product-First Doctrine | The person, the job and the moment of value are never written down, so the AI fills them in with the average product. |
| Doubts written as hypotheses | A guess is treated as fact. When it turns out wrong, everything built on top of it has to move. |
| Talk first, then do | The AI changes things you never agreed to, and you only find out when you read the changed files. |
| Always-On · Verification Loop | Nothing checks the work: "done" means the AI stopped typing. |
| Security from day one (RULES.md §Safety, a threat sketch in P1, the P7 audit) | Permissions, tenancy (keeping each customer's data apart) and where personal data lives get decided during backend work anyway. A security phase at the end finds them too late. |
| Living Checklist and P2 · Core Spike | The riskiest piece of the core gets built last, and if it needs a different data shape, everything built before it bends. |
| Taming Complexity | Every feature arrives with a new control until the product is cluttered. |
| Expertise Injection | "Act as a senior engineer" changes the tone, not the decisions. |
| Always-On · Real Data, and Words & Voice | Screens are judged on placeholder text and copy is left to defaults, so everything looks generic. |
| RULES.md, grown from corrections | Corrections are lost between sessions and the same mistakes come back. |
| STATE.md and DECISIONS.md | Every session starts cold: the AI re-reads the code to find where things stand and reopens decisions that were already made. |
| GLOSSARY.md | Nobody outside the build can say what the product does in plain words, and the code, the copy and the chat use three names for one thing. |
| P8 · Ship & Operate, and Instrumentation | Hosted is not shipped: no launch, no monitoring, no loop from real use back to the product. |
| Always-On · Agent Orchestration | One AI in one session does everything, including reviewing its own work. |
| Evidence in PRODUCT.md, and the Five-Person Test | Every judge is a model or the builder; nobody checks that real people reach the moment of value. |
| P3 · Visual Language (PRODUCT.md §Feeling, DESIGN.md) | "Unique" is defined against the average instead of toward a real point of view, so it drifts into the next trend. |

## The Laws

The laws below sit under every guide and template in this method. Each one states why it works, because a rule with a reason carries over to cases it never named (law 3). The Prompt Craft Toolkit and Anti-patterns guides only add what this table does not already cover.

| # | Law | Why it works | Do | Prevents | Where it shows up |
|---|---|---|---|---|---|
| 1 | Context beats cleverness | The model works only from its context window (the text it can see right now); a missing fact becomes a guess, and guesses come from the average | "Read .offthemode/PRODUCT.md and src/auth/. Onboarding for the solo podcast editor; first result inside the time to value in PRODUCT.md §Experience promises; reuse the existing session model." | Persona prompts that change tone, not facts | RULES.md and STATE.md load at every session start; name the files a task touches |
| 2 | The mode is the default | For an underspecified request, the model's best guess is the most typical answer | "No hero. The first screen is the product on sample data. One display face. Colour strategy per DESIGN.md." | Hero, three cards, Inter, gradient | Constraint Stack; PRODUCT.md §Refusals |
| 3 | Reasons generalize, bare rules don't | A reason carries the principle to cases you didn't name | "Don't derive state in effects: it adds a render with stale values and a second source of truth." | Rules obeyed to the letter, missed in spirit | Every line in RULES.md carries its reason |
| 4 | Show, don't adjective | "Modern, clean, premium" sat next to millions of templates, so they decode to those templates | "Headline --text-display, body --text-base, two weights; motion --dur-quick with --ease-out, transform and opacity only; take refs/04.png's whitespace, not its colours." | Adjective soup | Anchor to References; design tokens (named values for type, colour, spacing and motion) |
| 5 | Talk first, plan before code | Once code exists, the model reads it as evidence and defends it | "Tell me what you found and exactly what you will change. No code until I say go." For a large change: "Two architectures with tradeoffs, no code." | Sunk-cost patching; changes you never agreed to | Every Off the Mode command talks first and waits for your go |
| 6 | Verification is the prompt | An AI can only fix what it can observe | "Screenshot / at phone, tablet and wide widths, before and after. Done means the checks pass and it actually ran." | "Should work" | RULES.md §Done means verified; Prove It Works |
| 7 | One concern per turn, fenced | With several goals the easiest one wins; anything not fenced off reads as fair game | "Only the refresh race in src/auth/refresh.ts. If the fix needs other files, stop and say why." | 14-file changes you can neither review nor revert | Change Request |
| 8 | Context is a budget, and it rots | Dead attempts left in the history get repeated; when a tool shortens a long session on its own, it decides what is forgotten | "Rewrite STATE.md, then start a fresh session." For wide reading, one scout reads once and writes a short brief that every other agent shares word for word. | The marathon session | STATE.md, rewritten when a piece of work ends |
| 9 | Diverge, then converge, never in one step | One request samples the mode; a model grading its own options picks its favourite | Options forced apart on axes you assign, built in separate sessions, compared by a second, fresh AI session with no memory of building them; you choose | Three fonts on one idea | Three Divergent Directions |
| 10 | Every repeated correction becomes a standing rule | A correction in chat dies with the session | The second time you correct the same thing, add a line to RULES.md with its reason; if it can be measured, add a script check too | Re-prompting the same fix | RULES.md |
| 11 | Never build on an assumption | Every unstated decision gets a silent default, and silent defaults are the mode | Batched, numbered questions with suggested defaults before any plan. Whatever stays open is written "I think X, because Y" and confirmed in the code, the docs or by asking before anything rests on it | Plans built on guesses | Interview Me First; hypotheses in PRODUCT.md |
| 12 | Product before technology | Without a person, job and moment, the model optimizes for completeness; with them it can rank, hide and infer | "90% keep the defaults. One control (quiet hours on/off), infer the schedule, everything else behind one disclosure." | Feature piles | RULES.md §Product first; Feature Kill List |

> **Why:** Laws 1, 8 and 10 are the same fact seen three ways. The model remembers nothing between sessions, so anything worth keeping has to live in a file it reads: PRODUCT.md for what the product is, RULES.md for how to work, STATE.md for where things stand.

> **Pro move:** If your tool has a plan mode (Claude Code and Cursor do), use it for law 5. If your tool can shorten a long session with a focus, do that only in the middle of a task and name what to keep; between tasks, a fresh session that loads STATE.md is cleaner.

## Product-First Doctrine

> **Output:** five product decisions with their evidence in `.offthemode/PRODUCT.md`, the product rules in RULES.md §Product first, the experience promises in PRODUCT.md with a script check for each, hypotheses copied into `.offthemode/RISKS.md`, and a mapped path to the moment of value.

This is not a phase. It is the lens applied before the rules are final and again at every gate. Ask for "a project management app" and you get the most common one. Pin the request to one person, one moment and one job, and the remembered answer stops fitting, so the model has to work out a product instead of retrieving one.

### The five decisions

| Decision | Reject | Usable |
|---|---|---|
| Person (who, in what situation, with what open) | "Creators", "teams" | "Solo podcast editor, 1am, 3 raw files, 9am deadline" |
| Job (when __, I want __, so I can __) | "Manage content" | "When a raw take lands, I want dead air gone, so I can publish tonight" |
| Moment of value (and the time to reach it) | "After onboarding" | "Waveform collapses to the clean cut within 40 s of the drop, no signup" |
| The one thing (PRODUCT.md §Core concept: what it does 10x better than anything else) | Six strengths | One sentence; everything else is parity or absent |
| Refusals (what it won't do, even when asked) | Nothing | "No multitrack mixing. No collaboration in v1." |

Every decision carries its evidence: **observed** (you watched someone do it), **heard** (someone told you), or **hypothesis** (a guess, written down so it can be checked). Write a hypothesis as "I think X, because Y", then confirm it in the code, the docs or by asking a real person. Copy each hypothesis in the Person, Job or Moment rows into RISKS.md. Every later guide treats PRODUCT.md as fact, so a made-up person makes every later gate pass for the wrong reason.

> **Rule:** Nothing is built on a hypothesis until it is confirmed.

### Each decision is also a technical constraint

"40 s, no signup" means anonymous sessions, resumable uploads and streamed results. Write each consequence into DECISIONS.md with the PRODUCT.md line it comes from, so backend work (P4) inherits it instead of rediscovering it.

AI tools help by adding. RULES.md §Product first pushes back: no feature without a job, new ideas arrive as ranked bets, the design that asks the person fewer questions wins, and any PRODUCT.md line that conflicts with a request gets quoted before your AI acts.

> **Why:** The quoting rule turns a vague value into a lookup. Models look things up reliably; they apply vague values unreliably.

### Make the experience testable

"Top of the game" UX has to be testable, or your AI cannot aim at it. An AI driving a browser cannot measure a 100 ms tap, because one tool round-trip takes longer than that, and "one-handed" is not something it can observe. So each property gets a script check: code that measures it and passes or fails. PRODUCT.md §Experience promises says what each promise is, and holds the time to the moment of value. Any speed, interaction or accessibility number the product chooses to hold is a key in RULES.md §Budgets: Off the Mode sets none for you, and Accessibility & Performance Budgets lists common keys to copy. Each number lives in one place only, so it changes in one place. Where a row below names a key the product doesn't hold, that part of the check is skipped.

The checks below use two project scripts your AI writes. `audit-ux` drives the core journey in a real browser and measures it. The e2e (end-to-end) tests act like a person using the whole app.

| Property | Spec | Verify by |
|---|---|---|
| Speed | Input feedback, LCP, INP and CLS inside RULES.md §Budgets on a mid-tier phone; no loading indicator before the indicator delay in §Budgets | `audit-ux`: Event Timing max duration on the core journey under 4x CPU throttle; Lighthouse CI in the lab (TBT stands in for INP, which only exists in the field); web-vitals RUM after launch |
| Optimistic + undo | Changes show instantly and roll back inline if they fail; confirm only actions whose effects leave the system | e2e: `context.setOffline(true)` mid-action, assert rollback and inline undo; every confirm dialog is listed in PRODUCT.md with its reason |
| Zero dead ends | Every empty, error, offline, 404 and no-permission state has one next action | Screenshots of every state through a state switcher; Walk Every Flow |
| Keyboard / thumb first | Command palette and visible shortcuts on web; the primary action inside the thumb zone from §Budgets on phones | e2e runs the core job keyboard-only; `audit-ux` asserts exactly one visible `[data-primary]` per surface, its centre inside the thumb zone and its box at least the target size |
| State survives | View state in the URL, drafts autosave, reload and back return to the same place | e2e reloads at every core-flow step and compares URL and visible state |
| Respect attention | No nags, marketing modals or interstitials | e2e fails on any dialog or overlay the test didn't open |

The web measures, in plain words: LCP (Largest Contentful Paint) is when the main content appears; INP (Interaction to Next Paint) is how fast the page responds to a tap or key; CLS (Cumulative Layout Shift) is how much the layout jumps; TBT (Total Blocking Time) is how long the page is too busy to respond during a lab test; RUM (real-user monitoring) measures real visitors after launch.

> **Trap:** A promise with no check is a wish. If a property cannot be measured by a script, rewrite it until it can, or cut it.

### Prompts

```prompt title="Feature Kill List"
Read .offthemode/PRODUCT.md, and .offthemode/COMPLEXITY.md if it exists. Inventory every user-facing capability in {{SCOPE: codebase, roadmap or spec at PATH}}.
One row each: Capability | Job served (quote PRODUCT.md, or NONE) | Serves the one thing? | Actions it adds to default surfaces | Evidence of use | Verdict.
Verdicts: CORE (produces the moment of value; keep and deepen), PARITY (expected; minimal version, moved to a secondary layer), DEFER (plausible, no evidence; remove it and log it in .offthemode/DECISIONS.md as a bet with a kill criterion), KILL (no job, contradicts a Refusal, or duplicates a path). When torn, pick the harsher verdict and say so.
Then: the default-surface action count before and after, and a deletion plan (routes, components, flags, columns, tests) ordered so nothing breaks. Show me the plan and change nothing until I say go.
```

```prompt title="Moment of Value Map"
Map the path from first contact ({{ENTRY: landing page, store install, shared link or invite}}) to {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), walking it as {{?PERSON}} on {{?DEVICE}} with {{CONTEXT: one hand, flaky 4G, ninety seconds of patience}}. If the app runs, drive it with your browser or simulator tool and time it with the project's audit-ux journey if there is one; otherwise walk the spec.
Per step: what they see, decide, type, wait for, and what could make them leave. Totals: steps, decisions, inputs, wait, and time to first wow against the time to value in PRODUCT.md §Experience promises.
Redesign to hit the budget, naming the mechanism behind every cut: defer (account after value), infer (locale, currency, intent from the entry point or pasted content), default (the 80% option, changeable in context), preload (sample or imported data), parallelize (start work during the previous step).
Show the new path, the new totals and each cut's technical consequences. After my go, append each consequence to .offthemode/DECISIONS.md with the PRODUCT.md line it serves.
```

## P0 · Constitution

> **Output:** `.offthemode/RULES.md` filled in for this project and loaded by your AI tool at the start of every session, with §Safety holding the day-one security rules; `.offthemode/STATE.md` with the first next step written down; and `.offthemode/DECISIONS.md` with an entry for each stack choice.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Hold every change to RULES.md as it stands. Don't rewrite it as a side effect of another task.
- The project's own rule files (AGENTS.md, CLAUDE.md, .cursor/rules and the like) stay where they are and win on project specifics: never move or merge them. A line that contradicts the code, another rule or an Off the Mode standard, or is out of date, is shown with its fix and changed only on the user's go, recorded in DECISIONS.md. Besides those fixes, the one auto-load line is the only addition, also on the user's go.
- Before deciding anything, search DECISIONS.md, so a settled choice is not argued again.
- A correction given once goes in STATE.md §Corrections seen once, with the date. Given a second time, propose one line for RULES.md §Project specifics with its reason, and add it on the user's go.
- When a piece of work ends, rewrite STATE.md (present tense, no history) and append any decision to DECISIONS.md.
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

When a piece of work ends, paste this so the next session starts where this one stopped.

```prompt title="Session End Handoff"
End the session, in this order:
1. Rewrite .offthemode/STATE.md from scratch: present tense, no history, under 40 lines. A fresh session with no chat context must be able to start item 1 of Next, so name the files, the commands and the done-check.
2. Append a DECISIONS.md entry for every decision made this session. There should be no silent ones; if you find one, list it as a hypothesis for me to confirm.
3. Sort every correction I gave. First time: add it to the corrections-seen-once list in STATE.md. Second time: propose one line for RULES.md §Project specifics, imperative and specific, with its reason. A matter of taste: propose a line for .offthemode/DESIGN.md or PRODUCT.md §Feeling. A flaw in a prompt I pasted: propose the fixed prompt. A rule broken again although it is already in RULES.md: propose a check (a lint rule, a test or a script in §Commands).
4. List everything claimed but not verified as unverified in STATE.md. The next session trusts this file.
5. Propose edits for any RULES.md line that proved wrong, stale or in conflict with another.
6. Run {{?CHECK_CMD}}. If the project uses git, propose a commit "{{type}}: {{summary}}" with the D- ids in the body.
Do steps 1, 2 and 4 now. Reply with a five-line summary, then the proposals from steps 3, 5 and 6. Apply them only after I say go.
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

## Expertise Injection

> **Output:** optional expert profiles in `.offthemode/experts/` (for example `.offthemode/experts/web-platform.md`), one line per profile in RULES.md §Guides saying which work loads it, and the Inventor-Level Review: a fresh second AI session briefed as the harshest expert, whose findings are fixed or rebutted with evidence.

Ask an AI for "a senior developer" and you get the median senior developer. A grander persona line (the one-sentence role at the top of a prompt, such as "you created JavaScript") mostly changes the tone. The model already has the knowledge. What it lacks is a sense of which knowledge should win when two good ideas conflict. You get inventor-level output by loading the inventor's judgment: what they value, what they refuse, and where they look things up.

| Lever | Effect | Apply it |
|---|---|---|
| Persona line ("you created JS") | Weak: tone, not tradeoffs | One line at most |
| Ranked values, opinions, refusals | Strong: constraints on every decision | An expert profile in `.offthemode/experts/`, named in RULES.md §Guides |
| Primary sources | Strong: the authority replaces the tutorial average | The spec section and the installed package's source, listed in the profile; "cite file:line, not memory" |
| Refusals first | Strong: failure modes enter context as things to avoid | "What an expert would refuse to ship here, and the amateur mistakes; avoid every one" |
| Adversarial second context | Strong: a reviewer with no stake | A fresh AI session briefed as the harshest expert, with no memory of building it |
| First-principles derivation | Medium-strong: stops tutorial copying | "Derive from constraints (what must be true, minimal state, where truth lives), then name a pattern" |

### Expert profiles

A profile is a short page of judgment for one hard domain. It lives in `.offthemode/experts/`, one file per domain, and it is optional: write one when a domain is hard enough that the average answer would hurt the product. Each profile gets one line in RULES.md §Guides that names the work that loads it, so your AI opens it before planning or doing that work, the same way it opens a guide. For example: `Any user-facing change: .offthemode/experts/product.md` and `Web UI, CSS, routing, client state: .offthemode/experts/web-platform.md and .offthemode/experts/react.md`.

> **Rule:** Split universal from framework. `web-platform.md` holds what is true of the web; a framework profile holds what is true of React, SwiftUI or Compose. Version pins and local exceptions go in the profile's header line, with the reason. Write `product.md` first, because its refusals are what enforce "simple outside".

```file path=".offthemode/experts/{{domain}}.md"
**Expert: {{DOMAIN}}** · Load when {{FILE_PATTERNS_OR_TASK_TYPES}} · Scope {{COVERS}}, not {{EXCLUDES}} · Pins {{TECH@VERSION}} · Local exceptions {{EXCEPTION, because REASON}}
Work with the judgment of the people who designed {{CORE_TECH}}: why each feature exists, which tradeoffs they chose, what they consider misuse. This outranks generic "best practices" and your habits.
**Values (ranked; earlier wins):** 1. {{VALUE}}, because {{REASON_FROM_HOW_THE_TECH_WORKS}}
**Opinions (deviate only with a written reason):** Do {{X}}, because {{Y}}, instead of {{COMMON_ALTERNATIVE}}.
**Refuse to ship (stop and flag):** {{PATTERN}}: {{WHY_IT_FAILS}}. Instead: {{REPLACEMENT}}.
**Amateur tells:** {{WHAT_GIVES_AWAY_TUTORIAL_KNOWLEDGE}}
**Primary sources (read before guessing; cite section or file:line):** {{SPEC_OR_RFC}}; {{INSTALLED_PACKAGE_SOURCE_PATH}}
**Tie-breakers:** {{WHEN_VALUES_CONFLICT}}; reversible over clever; platform over library.
**Review questions:** {{QUESTION_A_CORE_MAINTAINER_WOULD_ASK}}
```

The profiles below are starting points. Copy the ones that fit your project into `.offthemode/experts/`, then edit them to match your stack and product. The framework profile is an outline: fill it with Forge Expert Profile, never from memory.

```file path=".offthemode/experts/product.md"
**Expert: product and interaction.** Load for every user-facing change.
**Values (ranked):** 1. Time to the moment of value beats feature count; every step before it is a tax. 2. Inference over configuration; a setting is a decision the team failed to make. 3. Complexity is conserved (Tesler's law); the system carries it unless the user asks.
**Opinions:** one primary action per surface, rare actions behind one disclosure or the command palette; undo over confirm (confirm only effects that leave the system); first run is the real job on seeded or imported data, never a tour; nouns stable, each verb identical on every noun; account after value, payment after habit, permission at the moment of need. Model-driven features: stream partial output; show what the system inferred and let the user correct it in place; never give a guess the same visual weight as a fact; quality is gated by evals, not by demos.
**Refuse to ship:** a second primary action; a setting the system could infer; an empty state with no next step; a confirm where undo would do; a feature with no job in PRODUCT.md; a tooltip tour; a dead end on any error, offline or no-permission state; an action reachable only by hover.
**Amateur tells:** "Dashboard" as a destination; a settings page that grows per feature; "Are you sure?".
**Primary sources:** .offthemode/PRODUCT.md, .offthemode/COMPLEXITY.md; Nielsen Norman Group's 10 usability heuristics; Apple HIG; Material Design 3.
```

```file path=".offthemode/experts/web-platform.md"
**Expert: the web platform.** Load for UI, CSS, routing and client state on the web, beside the framework profile.
**Values (ranked):** 1. Platform first: HTML, then CSS, then JS; every layer you skip is behavior you now own. 2. One source of truth; derive, don't sync; the URL is state. 3. Perceived performance is UX: zero layout shift, no blocking spinners, input feedback inside RULES.md §Budgets.
**Opinions:** intrinsic layout (grid minmax/auto-fit, clamp() type), breakpoints only where content breaks; container queries for components (in every evergreen browser; add a fallback only if your support matrix is older); @layer reset, tokens, components, utilities; logical properties; <dialog>, popover, <details> and native validation before any component kit; View Transitions and scroll-driven animation as progressive enhancement (feature-detect `document.startViewTransition` and use @supports; without them the UI still works, just without the morph); motion on transform and opacity with prefers-reduced-motion honored; colocate state, lift on the second consumer; Intl before any formatting library. Check support against Baseline, not memory.
**Refuse to ship:** clickable divs; removed focus rings; media without dimensions; z-index outside the scale; animating width, height, top or left; state duplicated between the URL and a store.
**Amateur tells:** reflexive memoization; a global store for form state; aria-label instead of real labels.
**Primary sources:** WHATWG HTML; CSSWG drafts; MDN; WAI-ARIA APG; web.dev Baseline and Core Web Vitals.
```

```file path=".offthemode/experts/{{framework}}.md"
**Expert: {{FRAMEWORK}}.** Load beside web-platform.md (web) or mobile.md (native) for code under {{FRAMEWORK_FILE_PATTERNS}}. Generate it with Forge Expert Profile; never write it from memory.
**Values (ranked):** 1. {{e.g. React: render is a pure function of props and state; anything else is an effect that needs a reason}}
**Refuse to ship:** {{e.g. React: effects that set derived state (react.dev, "You Might Not Need an Effect"). SwiftUI: state owned by a view that doesn't render it. Compose: unstable lambdas recomposing a hot list}}
**Amateur tells:** {{FRAMEWORK_SPECIFIC_TELLS}}
**Primary sources:** {{the framework's own docs, RFCs and changelog; the installed source}}
```

```file path=".offthemode/experts/backend.md"
**Expert: backend and distributed systems.** Load for API, data model, jobs, infra.
**Values (ranked):** 1. Correct under failure beats fast on the happy path; every call can time out, retry and duplicate. 2. The data model is the product; constraints live in the database, not only app code. 3. Boring technology until a measurement says otherwise.
**Opinions:** Postgres by default; a table plus cron before a queue, a queue before a new service; every mutation idempotent, meaning safe to run twice (key, or natural key + upsert); events leave through a transactional outbox (written to a table in the same transaction as the change, then sent by a worker), never dual writes (saving and sending as two separate steps, where one can fail alone); timeouts on every call, retries with backoff and jitter inside a budget; expand/contract migrations; money in integer minor units; UTC; errors as RFC 9457 problem details; one request ID through every log line; when the UX contract demands instant, offline or multiplayer, evaluate a sync engine before hand-building optimistic caches.
**Refuse to ship:** unbounded queries; N+1 queries in a hot path (one query per row of a list instead of one for the whole list); retries on non-idempotent operations; secrets in code or logs; catch-log-continue; authorization only in the UI.
**Amateur tells:** microservices before team boundaries exist; an unreviewed ORM-generated schema; "indexes later".
**Primary sources:** PostgreSQL docs; RFC 9110; RFC 9457; Kleppmann, Designing Data-Intensive Applications; Google SRE book.
```

```file path=".offthemode/experts/mobile.md"
**Expert: mobile (iOS, Android, cross-platform).** Load for screens, gestures, offline, native modules.
**Values (ranked):** 1. The core loop works offline and never blocks on the network. 2. Frame rate is a requirement; nothing runs on the UI thread that can run elsewhere. 3. The OS is the host: system navigation, gestures and type scaling are muscle memory; break convention only for the signature moment.
**Opinions:** optimistic UI over a local store with background sync and conflict rules decided up front; every screen deep-linkable, state restored after process death; primary action within thumb reach, targets at the HIG and Material minimums, safe areas and keyboard respected; test at the largest font scale and with reduced motion; haptics only where they carry meaning; cross-platform animations on the UI thread (native driver or worklets).
**Refuse to ship:** web feel (hover affordances, tiny targets); a custom back that breaks the system gesture; full-screen spinners in the core loop; permission prompts at first launch.
**Primary sources:** Apple Human Interface Guidelines; Material Design 3; Android "Guide to app architecture"; Swift API Design Guidelines; the framework profile.
```

For a domain with no starting profile (your core engine, a framework, a hard library), have your AI forge one from primary sources.

```prompt title="Forge Expert Profile"
Build an expert profile for {{DOMAIN}} ({{CORE_TECH}}, used in {{STACK}} for {{PRODUCT_TYPE}}). Target: the judgment of the people who designed and maintain {{CORE_TECH}}, as expressed in their specs, design docs, RFCs, changelogs and source; not tutorial consensus.
1. Primary sources: cite only ones you are certain exist, mark others [VERIFY]; read local sources first ({{LOCAL_PATHS}}).
2. Values, ranked, each with the reason that follows from how the technology works.
3. Opinions as "do X, because Y, instead of Z". Keep one only if it is certain to apply to this stack, is not what a typical senior developer does anyway, and is costly to get wrong. Mark those a typical senior developer would push back on, with the argument; a profile with none has not left the average.
4. Refuse-to-ship patterns the core team would reject in review, each with its replacement, kept by the same test.
5. Amateur tells, tie-breakers, review questions.
Every line must be checkable against code. Ban "clean code" and "best practices". At most 120 lines. Use the header line of the other profiles in .offthemode/experts/, with pins and local exceptions for {{?STACK_VERSIONS: from the package manifest or lockfile}}.
Show me the profile, the path .offthemode/experts/{{domain}}.md, and the one line you would add to RULES.md §Guides saying which work loads it. End with the 3 opinions you are least sure of. Write the files only after I say go.
```

### The inventor critic

The critic is a second, fresh AI session asked to review, with no memory of building it. A fresh session never sees the builder's rationalizations, the reasons that made each shortcut feel fine at the time, and a deep review in its own session does not flood the context of the session doing the building. Brief it as the harshest credible expert in the domain, and it reviews only: it never edits.

Run it on every plan for a large or risky change, and on any set of changes that touches a contract, a schema, auth or more than 3 files, before calling the work done. Project specifics reach it through the files it reads, so the brief below stays the same in every project.

```prompt title="Inventor Critic"
You are the harshest credible reviewer in this change's domain: someone who helped design the core technology and has seen every misuse of it. You did not write this code and have no stake in it. Find what is wrong; do not approve. Review only; never edit.
Read first: .offthemode/RULES.md; the expert profiles RULES.md §Guides names for the touched work; .offthemode/PRODUCT.md, and .offthemode/COMPLEXITY.md and .offthemode/SECURITY.md if they exist; then the plan or the changes: {{PLAN_FILE | git diff main...HEAD}}.
Method:
1. Restate in 3 lines what the change is for and for whom. If you can't, that is finding #1.
2. Before reading closely, derive the minimal correct solution from the constraints (at most 10 lines of pseudocode). Any state, code or dependency beyond it needs a written justification, or it is a finding.
3. Check every refuse-to-ship item in the loaded profiles.
4. Failure paths: slow network, double submit, stale cache, empty and huge data, concurrent edits, offline, reduced motion, screen reader, unauthorized caller.
5. Security: authorization on every data access, no client-side secrets, no personal data in logs or events. Product: one primary action per surface; no complexity pushed onto the user that a default or inference would absorb.
6. Tests: do they assert behavior or mirror the implementation? Any weakened assertion, or snapshot updated without a spec change?
Run the full check from RULES.md §Commands and include the last lines of its output.
Output: Verdict SHIP / FIX / RETHINK with one line why. Table: severity (blocker | major | minor) | file:line | what an expert sees | fix; max 12 rows, blockers first, no style nits unless they hide a bug. Then one thing done well, so it survives the refactor.
```

Take the critic's table back to the session that built the change.

```prompt title="Inventor-Level Review"
An independent review of {{PLAN_FILE | git diff BASE...HEAD}} returned this table:
{{CRITIC_TABLE}}
For each finding, propose a resolution: fix it, or rebut it in one line with evidence (file:line, a test, a measurement). Show the table with a resolution column and wait for my go before changing anything. Then make the fixes, run the checks in RULES.md §Commands, and show the table again with what you did.
```

If your tool supports subagents (Claude Code does), you can save the Inventor Critic brief as one, with read-only tools, so it runs in its own context from inside your session. The brief stays the same; only where it runs changes.

> **Pro move:** One profile per hard domain (rendering, sync, data model, native platform, the core engine), not one generic "senior dev". Run the critic on plans before any code exists, when mistakes are cheapest. On sensitive paths, run it twice, in two different models or tools, and compare the two tables: findings both raise are almost always real.

## P1 · Vision & Skeleton

> **Output:** `.offthemode/PRODUCT.md` filled from its template (product first, with evidence on every claim), `.offthemode/SKELETON.md` when the project is big enough to need one, the riskiest hypotheses written into `.offthemode/RISKS.md`, and a vision that passes the predict-my-call test.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Every new feature traces to a job in PRODUCT.md. If it serves none, ask why before planning it.
- If the request conflicts with a PRODUCT.md line (a refusal, a tie-breaker, the moment of value), quote the line before acting.
- Name new things in the words the users use, and propose the GLOSSARY.md §Terms entry.
- If the change adds an entity, a surface, a data flow or a trust boundary and SKELETON.md exists, show the SKELETON.md edit in the plan and make it in the same change, on the user's go.
- A guess about the person, the job or the moment is written as a hypothesis and confirmed before anything rests on it.
- Open the whole guide to write or rework the vision, PRODUCT.md or SKELETON.md, to name the product, or when a feature changes the person, the job or the moment of value.
<!-- /offthemode:rules -->

Your AI cannot build the picture in your head. It can only build what the text makes unambiguous. P1 turns that picture into documents precise enough that two different AI sessions would build the same product from them. Adjectives such as "clean", "modern" or "powerful" point the AI straight at the mode, the most common version of everything, so the documents use references with extraction notes ("take the type scale, not the color"), numbers and anti-goals instead. Two parts carry the most weight: the **moment of value**, which comes with a time budget and an action budget, and **complexity absorption**, which is where "extremely complex" and "minimalist" stop fighting.

### PRODUCT.md

Setup (the offthemode command) creates PRODUCT.md from its template, which you can also get from get_template or the skill's templates/ folder. The template holds the vision, core concept, person, job, moment of value, refusals, feeling and experience promises. P1 is how you fill it so it holds up. Where the template has no place for a part below, add it as its own section.

- **Vision.** One sentence: "For [person] who [struggle], [product] is the [frame] that [the one thing], unlike [status quo], which [why it fails them]." It forces a person, a struggle and a rival into one line.
- **Person.** A specific person in a specific situation, with what they already have open. Their skill (novice, practitioner or expert) sets the default density. Name the tools and workarounds they use today.
- **Jobs.** Ranked, each as "When [situation], I want to [motivation], so I can [outcome]." Keep a job only if a real person has it and it changes what gets built or cut.
- **Moment of value.** What they see or feel, within how long of first opening the product, after at most how many steps and decisions. Say whether an account is required before it, and if so, why.
- **Signature moment.** The one interaction people would screen-record. It gets outsized polish.
- **Not for.** Who you deliberately disappoint, and why.
- **Refusals and tie-breakers.** "We will not X, because Y." Then the tie-breakers for when good ideas conflict, such as speed over completeness, inference over configuration.
- **Feeling.** A table: adjective, reference (a product, object, print, film or place), take this, not this. Then the negative references: what it must never look or feel like. An adjective alone gets you the average; a reference with an extraction note gets you a decision.
- **Complexity absorption.** A table: the hard thing inside, how the user never sees it (a default, an inference, a disclosure or undo), and the expert escape hatch. For example: sync conflicts, auto-merge with a visible history and never a dialog, a history panel.
- **Tech consequences.** Each promise turned into what it forces in the build. "40 s from drop, no signup" means anonymous sessions, resumable uploads and streamed results.
- **Experience promises.** The numbers the experience is held to: the time to the moment of value (the only place this number lives); the confirm dialogs allowed, each with its reason; offline behavior (read-only, queued writes, or none, and why); how many core-journey actions update instantly, before the server answers (N of M); whether there is multiplayer or shared live state. Any speed or accessibility number the product holds is a key in RULES.md §Budgets, not here.
- **Metrics, bets and constraints.** Activation, defined; time to value, measured against its target in §Experience promises; a retention signal; a guardrail that must never get worse. Each bet names its job, expected effect, complexity cost and "kill if". Constraints: deadline, budget and hosting, team, data and compliance. Open questions, each with what it blocks.

Tag every Person, Job and Moment line with its evidence: observed, heard or hypothesis. A hypothesis is written "I think X, because Y", and it also becomes a RISKS.md row until it is confirmed in the code, the docs or by asking. Nothing gets built on it before then.

Keep the whole file under 150 lines, with the north star at the top. Repeat the north star in one or two lines in RULES.md §This project, because RULES.md is what your AI loads at the start of every session.

> **Rule:** If the experience promises include offline writes, multiplayer, or instant updates on more than half of the core-journey actions, spike a sync architecture in P2 before choosing the API style in P4. A spike is a small, throwaway build that answers one risky question before real code depends on it.

### SKELETON.md

Write a skeleton when the project is big enough to have a structure worth drawing: several screens or routes, stored data, more than one kind of user, or outside services. A small tool with one screen and no stored data can skip it; PRODUCT.md and CHECKLIST.md carry it.

The skeleton is artifacts, not prose. A prose spec lets the AI pattern-match to "an app like this", while tables, diagrams and invariants (rules that are always true) force specific decisions. Diagrams are written in Mermaid, a text format that GitHub and most editors render. Tagging each capability Core, Supporting or Generic tells the AI where to invent and where to use the boring, proven option, so novelty goes into the product instead of the sign-in screen.

> **Pro move:** Derive surfaces from the domain model and the journeys, never from "what apps have". The statistical-average app has Dashboard, Settings, Profile and Notifications. Your product might be one canvas and a command bar.

```file path=".offthemode/SKELETON.md"
SKELETON: {{PROJECT_NAME}} · tag every item [decided], [hypothesis] or [open]; nothing is built on a [hypothesis] or [open] item until it is confirmed

### Domain model
~~~mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : "owns"
  ENTITY_B }o--|| ENTITY_C : "references"
~~~
Definitions (the invariant that makes each term in GLOSSARY.md that thing): {{TERM}}: {{DEFINITION}}
Invariants (always true): {{e.g. a Space always has exactly one owner}}
Lifecycles: {{ENTITY}}: {{draft -> active -> archived}}; who triggers each transition.

### Capability map
| Capability | Core / Supporting / Generic | Build / library / service | Why |
|---|---|---|---|
Creativity budget goes to Core only.

### Surfaces and journeys
| Surface | Route or screen | Primary action | Journey step it serves |
|---|---|---|---|
{{JOURNEY}}: {{step}} -> {{step}} -> **moment of value** -> {{step}} · actions {{N}} · target {{T}}. States per surface live in ROUTES.md.

### Data flow
| Data | Origin | Source of truth | Cache | Offline behavior | Sensitivity |
|---|---|---|---|---|---|

### System context
~~~mermaid
flowchart LR
  user(["{{PERSON}}"]) --> client["{{CLIENT}}"]
  client -->|HTTPS| api["{{API_OR_SYNC}}"]
  subgraph server["Trust boundary: server"]
    api --> core[["{{CORE_ENGINE}}"]]
    api --> db[("{{DATABASE}}")]
    api --> jobs["{{JOBS}}"]
  end
  core --> ext["{{EXTERNAL_SERVICE}}"]
~~~

### Stack and non-functional requirements
Per layer: choice + version + why + rejected + path from local to {{TARGET_HOSTING}}, each recorded as a D-### entry in DECISIONS.md.
Speed and accessibility: any keys this product holds in RULES.md §Budgets (change them there, not here) · offline {{none, read-only or full sync}} · scale at 12 months {{users, rows, requests per second}} · languages {{locales, right-to-left}}

### Threat sketch (five minutes, now, not at the end)
Assets {{}} · actors {{anon, user, admin, other tenant, compromised client}} · authentication {{}} · authorization model {{}} · personal data fields {{}} · secrets live in {{}}
| Abuse case | Impact | Day-one mitigation |
|---|---|---|
| {{user reads another tenant's records by changing an id}} | {{}} | {{row-level authorization in the data layer}} |

### Core contract (written by P2)
Inputs {{}} · outputs {{}} · latency and cost envelope {{}} · failure modes {{}} · streaming or partial {{}} · quality baseline (eval pass rate) {{}}

### Riskiest hypotheses -> .offthemode/RISKS.md
- {{R-##}}: {{hypothesis}}
```

### Naming the product

The name is the first part of the product people meet, and the part they repeat. Left alone, an AI names things by joining the category to a buzzword ("DataSense AI", "TaskFlow"): it describes a feature, sounds like a hundred others, and is usually taken. A strong name is short, easy to say and to spell after hearing it once, distinctive in its category, and evokes the feeling or the job rather than naming the feature. It also has to be ownable: the domain, the handles you need, the app stores, the package registry if you publish one, and no live trademark in your field.

Go wide, then narrow:
1. Generate across styles, so the options don't all sound alike: real words that evoke the feeling, metaphors from the product's world, invented words, compounds, words borrowed from another language, and a plain descriptive name as a baseline.
2. Cut with the criteria above, then say each survivor aloud in a sentence ("I'll send it on X") and check how it reads in the languages you serve.
3. Check availability live (domains, handles, stores, trademark databases), never from memory. A name you can't own is a hypothesis, not a name.
4. You choose. The name, why it fits and the checks go in PRODUCT.md §Name, and nothing public is built on it until it is confirmed.

Feature and screen names follow the same rule, in the words your users already use, and live in GLOSSARY.md §Terms.

```prompt title="Name the Product"
Help me name {{?PRODUCT: from the thesis and core concept in PRODUCT.md}}. Talk first; don't write any file until I choose.
1. Read PRODUCT.md (person, job, moment of value, feeling, refusals) and say in two lines what the name has to carry.
2. Generate at least 30 candidates across six styles: evocative real words, metaphors from the product's world, invented words, compounds, borrowed words, and plain descriptive as a baseline. Avoid category-plus-buzzword compounds and the endings everyone uses (-ly, -ify, -hub, AI).
3. Shortlist every candidate that passes all of these: short, easy to say and spell after hearing it once, distinctive in its category, evoking the feeling or the job rather than the feature, and working in {{LANGUAGES}}. For each, one line on why it survived and one risk.
4. Check the shortlist live with web search: .com and {{OTHER_DOMAINS}}, handles on {{PLATFORMS}}, the app stores, {{PACKAGE_REGISTRY | skip}}, and a trademark search in {{COUNTRIES}}. Mark each check found, taken or unclear, with its source. Never report availability from memory.
5. Recommend 3, each with the sentence test ("I'll send it on X"). I choose; then write PRODUCT.md §Name with the name, why it fits and the checks, on my go.
```

### Making the vision sound

1. Dump the raw vision. Messy is fine.
2. Run Interrogate My Vision, answer its rounds, then edit the PRODUCT.md draft by hand until every line says what you mean.
3. Run the **predict-my-call test**. Open a fresh AI session, give it nothing but PRODUCT.md, and ask it three things you never discussed: "What happens at first launch with no data?", "Is there a settings page?", "What does an error look like?". If it answers the way you would, the vision transfers. If it doesn't, the gap is in the document, so fix the document. The test proves the document carries your intent, not that the Person exists; the evidence tags and the one-day tests in RISKS.md cover that.
4. If the project needs a skeleton, run Generate the Skeleton. Then run Pre-Mortem. The top risks feed the spikes in P2.

> **Why:** Teach-back exposes misreadings while they cost one message instead of one week. Rival framings break anchoring: the model's first interpretation sticks unless it has to compare it against alternatives. The fresh-session test is the only honest check of the document, because the session you talked in knows things the document doesn't.

```prompt title="Interrogate My Vision"
You are my product partner and the most demanding product lead this idea will face: you have shipped category-defining products and killed far more features than you built. Find out whether I know what I am building. No code, no files yet.
Raw vision: {{RAW_VISION: brain dump, transcript, links, screenshots}} · References and what to take from each: {{REFERENCES}} · Platforms {{web, iOS, Android, backend or data}} · Size {{weekend tool, product or complex system}}
What exists already: {{?WHAT_EXISTS: read from the code, the README and .offthemode/; "nothing" for a new project}}

Round 1, in order:
1. Teach-back: the product in at most 120 words, in your words: person, job, moment of value, feeling, signature moment.
2. The average version: 5 bullets on what a generic AI build of this would look like. Every later choice must differ from it on purpose.
3. Ambiguities: every place two competent builders would build different things from my words, ranked by blast radius.
4. Framings: 2-3 alternative theses (different person, core object or moment of value), with what each gains and loses. Do not pick one; the choice is mine.
5. Complexity: the hard things inside, and how the system absorbs each so the user never sees it.
6. The strongest case that this should not exist, or should be a feature of something else.
7. Evidence: for person, job and moment, what I have observed, what I have heard, and what is still a hypothesis to confirm.

Then interview me with batched, numbered questions, each with your recommended answer, in as many rounds as it takes. Each round attacks the weakest of person, job, moment, the one thing, refusals; say which. Reject vague answers ("users", "easy", "powerful", "all-in-one", "seamless") and re-ask sharper. Never suggest features; if I do, ask which job it serves and what it displaces. Stop when you can state the product in one sentence and predict what I would cut.
Finally show me a draft of .offthemode/PRODUCT.md that follows its template (get_template or the skill's templates/ folder), with an evidence tag on every Person, Job and Moment line. Write each unconfirmed item as a hypothesis, "I think X, because Y"; unsettled items go to open questions, never invented. End with the 3 hypotheses most likely to be wrong and the cheapest one-day test for each, each written as a RISKS.md row. Write the files only after I say go.
```

```prompt title="Predict My Call"
Read only .offthemode/PRODUCT.md. Do not read the code or any other file. Answer as the product's owner would, in at most 5 lines each, and say which line of PRODUCT.md each answer rests on:
1. What does first launch look like with no data?
2. Is there a settings page? What is in it?
3. What does an error look like?
{{EXTRA_QUESTIONS_YOU_NEVER_DISCUSSED}}
Where PRODUCT.md does not settle the answer, say so instead of guessing.
```

```prompt title="Generate the Skeleton"
Read .offthemode/PRODUCT.md and .offthemode/GLOSSARY.md, and for an existing project the code. Draft .offthemode/SKELETON.md following the SKELETON.md template in the Vision and Skeleton guide exactly. Show it to me first; write it only after I say go.
- Artifacts, not prose: tables, Mermaid, invariants. Every term in GLOSSARY.md gets its definition and invariant in §Domain model.
- Existing project: describe what the code does today, tag an item [decided] only where the code confirms it, and list every place the code and PRODUCT.md disagree.
- Derive surfaces from the domain model and journeys; cut any surface no journey step requires, or justify it. One primary action each.
- Tag capabilities Core, Supporting or Generic; spend creativity only on Core.
- Stack per layer: choice + version + why + rejected; it must meet RULES.md §Budgets and the PRODUCT.md experience promises and reach {{TARGET_HOSTING}} cleanly; draft each as a D-### entry for DECISIONS.md. If the experience promises trip the sync rule, mark the data layer [open] pending a P2 sync spike.
- Threat sketch: assets, actors, trust boundaries, and every abuse case that could really happen to this product, worst first, each with its day-one mitigation.
- Tag every item [decided], [hypothesis] or [open]. End with the riskiest hypotheses, weighted toward the core and worst first, as RISKS.md rows with proposed spikes.
- Flag anything in PRODUCT.md this skeleton cannot satisfy instead of quietly bending it.
```

```prompt title="Pre-Mortem"
It is {{N}} months after launch and {{PROJECT_NAME}} has failed. Read .offthemode/PRODUCT.md and .offthemode/SKELETON.md.
Write every distinct cause you can make concrete, each as a short story, covering product (nobody reached the moment of value, or the Person was imagined), experience (complexity leaked, or it looked like everything else), core feasibility (quality, latency, cost), architecture (local-to-hosted, scale, data model, sync), security and abuse, cost and operations, and my own process.
Per cause: early warning signal, likelihood 1-5, impact 1-5, the cheapest test now, what changes in PRODUCT or SKELETON if it is real. A risk that applies to every startup is not allowed.
Show the RISKS.md rows you would add, mark the ones needing a P2 spike, and list proposed PRODUCT and SKELETON edits. Change nothing until I say go; then write the RISKS.md rows and leave the PRODUCT and SKELETON edits for me to accept one by one.
```

## Living Checklist

> **Output:** `.offthemode/CHECKLIST.md`: the core concept split into fragments, each item with a provable done-when, kept true by one command, `listrevisit`.

Your core concept lives in PRODUCT.md §Core concept, written during P1. The checklist breaks it into **fragments**: the separate pieces of the core, finished one after another. Each fragment has a few items, and each item says how you will know it is done. The file is a map, not a gate: fragments are listed in build order (what others depend on first, then the one nearest the moment of value), and you can still work on anything in any order. Sessions stay free-form and nothing has to be ticked while you work, because `listrevisit` catches up afterwards by reading what changed in git.

**One command, checklist only.** `listrevisit` builds the checklist the first time, when the file is missing or still the blank template. After that, run it on its own to see where you stand, or with a note (`listrevisit add CSV export to reports`) to change the list. Type `/listrevisit` with the skills pack, `/mcp__offthemode__listrevisit` through the link in Claude Code, or just say "list revisit". It edits only .offthemode/CHECKLIST.md, never code or other docs. If a change also affects the vision or the architecture, it names the doc to update and leaves that to you.

**It talks first.** Every run starts with a report: what it found and exactly what it would change in the file. Nothing is written until you say go. Then it applies the change and tells you what it did.

| You run | It reports | After your go |
|---|---|---|
| `listrevisit` with no checklist yet | The core concept split into fragments, in build order, one line each | Writes the file; anything already built is marked `[x]`, never `[v]` |
| `listrevisit` | Commits since the last revisit mapped to items, the results of the cheap checks, each mark it would move with its evidence, and work that matches no item | Updates the marks, the header and the verified count |
| `listrevisit <idea or change>` | The fragment it belongs in (or a new one), the job in PRODUCT.md it serves, what it disturbs, and the exact diff to the list | Applies the diff and logs one line per change |

> **Rule:** An item is marked verified only with evidence the command can cite: a passing test by name, a measured number, a screenshot, a commit. "Built" and "verified" are separate marks, because the gap between them is where AI tools claim done.

**When a fragment can be verified depends on the product.** Some fragments can be proven on their own, early: a hard interaction, a speed limit, a platform constraint. Many can't. An AI data analyst only proves itself end to end: a real question goes in, correct SQL runs, the right answer comes out, and that needs the whole chain to exist. So each fragment says `Verify: early` or `Verify: on completion`. An on-completion fragment's done-when is an end-to-end run with real inputs (for a model-driven core, the eval set passing). Neither mode is better; the checklist just records which one each fragment is.

**The elite bar.** Every fragment ends with one item, "quality bars met". The bars cover correctness, speed, experience, code and safety, and each names the command in RULES.md §Commands that measures it. Bars that don't apply get deleted with a reason: a backend-only product drops the UI ones. A number a bar checks is a key in RULES.md §Budgets, never written into the bar, so a threshold changes in one place; a bar whose key the product doesn't hold checks nothing numeric. `listrevisit` measures what it can and says plainly what it couldn't measure, instead of calling it passing.

> **Why:** A free-form session is good at momentum and bad at memory. The checklist is the memory, and `listrevisit` is the one step that has to be honest, so it runs checks instead of trusting claims.

The file starts from the CHECKLIST.md template (from get_template or the skill's templates/ folder). It has these parts:

| Part | What it holds |
|---|---|
| Header | The date of the last revisit and the verified count, for example "Verified 7/19" |
| Marks | `[ ]` todo · `[~]` in progress · `[x]` built, not proven · `[v]` verified, evidence cited · `[-]` dropped, reason kept |
| Vision | Thesis, moment of value and core concept, read from PRODUCT.md and never edited here |
| Fragments | F1, F2 and on: what each one does for the person, what it depends on, its Verify mode, its items (each with a provable done-when and the guide that applies), and a closing quality item (F1.Q) |
| Foundation | Only what this product needs, each item placed by its phase: rules and memory in place first; host-ready (deploy target chosen, config checked at startup, forward-only migrations), and for a product with a UI the visual language locked and every screen and state existing, before the fragments that depend on them; the security audit and the launch checklist before launch |
| Quality bars | The elite bar that every .Q item checks |
| Changes | One dated line per change to the list |

A fragment in a filled checklist reads like this:

```text
F2 · Ask in plain words, get the right number · depends on: F1 · Verify: on completion
For the person: ask a question about their own sales data and get the answer, with the query behind it
- [v] F2.1 Question becomes SQL · done when: evals/sql passes 27 of 30, no case regressed · evidence: eval run 2026-09-12, commit 4f2a9c1
- [x] F2.2 Answer shown with its query · done when: state "answer-with-sql" screenshotted at phone and wide widths · evidence:
- [ ] F2.Q Quality bars met for F2 · evidence:
```

The bars themselves live in one place, the Quality bars part of the CHECKLIST.md template (from get_template or the skill's templates/ folder), so there is one copy to change. Trim them to what the product needs: "(UI)" bars go when there is no interface, "(native)" bars when there is no native app, each with a one-line reason.

The command runs the steps below. In a tool without the skills pack or the link, paste this prompt instead.

<!-- offthemode:command listrevisit -->

## P2 · Core Spike

> **Rule:** The core concept is written in P1 and built in P6. P2 is optional and builds none of it. Use it only for a fragment that can be proven on its own (a hard interaction, a speed or platform limit), while the answer could still change the plan. Products whose core only proves itself end to end, like an AI analyst answering real questions, skip P2: those fragments are marked `Verify: on completion` in the Living Checklist and get an end-to-end check once built.

> **Output:** a PASS, FAIL or PASS WITH CONSTRAINTS verdict with measured numbers; the core contract in `.offthemode/SKELETON.md`; a feel prototype tried by 3 target people, with the winning way to bridge the wait written into `.offthemode/DESIGN.md`; an eval set v0 in `evals/` if the core is model-driven; updated `.offthemode/RISKS.md` and `.offthemode/DECISIONS.md`.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- If the change rests on an unknown that could sink it (a speed, quality, cost or platform limit), write it as a hypothesis with the number that would prove it wrong, and offer a spike before building on it.
- A spike lives on its own branch, never touches the main app and is never merged; only its findings survive, in DECISIONS.md and RISKS.md.
- A change to a model-driven core's prompts, model, retrieval or contract runs the eval set, and a regression blocks it.
- Open the whole guide when a core risk in RISKS.md scores 12 or more, when the experience promises trip the sync rule, or when a model-driven core has no eval set yet.
<!-- /offthemode:rules -->

A core can only be plugged in once you know the shape of the socket, and in a complex product the core is exactly where the unknowns live. Two questions matter. Can it hit the latency, quality, cost and device limits? Does the moment of value actually feel like a wow? They need different evidence, so P2 builds two throwaway pieces, each timeboxed: a **feasibility spike** on the single riskiest core hypothesis, then a **feel prototype** built on the spike's real numbers. The real core build stays in P6.

> **Why:** Spike results feed design as much as engineering. A 6-second generation means the signature moment has to be designed around streaming. Frequent sync conflicts make recovery a first-class screen. An expensive core call means queues, caching, and defaults that respect usage. Learning this after the visuals are locked means redoing them. Feel is timing, sequencing and feedback, not styling, so it can't be judged on a page that dumps raw data after six seconds, and it doesn't need a brand to be judged.

The spike rules:

- **One falsifiable hypothesis, with numbers.** Falsifiable means a measurement can prove it wrong: "p95 under 2 s on a mid-tier Android with 10k records". (p95 is the time that 95% of runs beat; p50 is the typical run.)
- **A timebox sized to the project.** 1-2 hours for a weekend build, half a day to a day for a product, 1-3 days per top risk for a complex one.
- **Kept apart.** Work on its own branch (`spike/{{NAME}}`), away from the main app. It is never merged, and only the findings survive.
- **Ugly on purpose, never fake.** Never mock the hard part.
- **A skip is a decision too.** If the core has no real unknowns, write "no spike needed: {{reason}}" in DECISIONS.md.

Two cases always get a spike. If the experience promises in PRODUCT.md need offline writes, multiplayer, or changes that mostly feel instant (the sync rule in P4), spike a sync engine against plain request and response. If the core is model-driven, the spike seeds `evals/` with 20-30 real inputs and records the pass rate as the quality baseline (Always-On · Verification Loop).

> **Trap:** AI tools gold-plate by default. Without a "throwaway" frame and a separate branch, a spike grows abstractions and a nice UI, burns the timebox, and leaves code you'll be tempted to merge. Say what not to build.

> **Pro move:** If you use git worktrees, a second folder keeps the spike physically apart from your main checkout, so your AI can't edit the real app by accident: `git worktree add ../{{PROJECT}}-spike-{{NAME}} -b spike/{{NAME}}`.

```prompt title="Core Spike"
SPIKE {{RISK_ID}}: {{HYPOTHESIS}}
Read .offthemode/SKELETON.md (Core contract, NFRs, Data flow), .offthemode/RISKS.md and RULES.md §Budgets. You are on the throwaway branch spike/{{NAME}}. This code is never merged; optimize for learning speed.
Pass if {{THRESHOLD}} · fail if {{THRESHOLD}} · timebox {{N}} hours (at the limit, stop and report what you know).
Allowed: hardcoded inputs, one plain page, no auth, any library. Forbidden: brand styling, abstractions, touching the main app, mocking or shrinking the hard part.
1. State the smallest experiment that could falsify the hypothesis. Wait for my go.
2. Build and measure with realistic data ({{DATA_SCALE}}) on {{TARGET_DEVICE_OR_ENV}}: p50, p95, throughput for streamed output, error rate, memory, cost per run. Numbers, not impressions.
3. If it fails, try the alternatives most likely to pass, named before you start and inside the timebox.
4. Model-driven core: save 20-30 real inputs with expected properties to evals/ and report the pass rate.
Deliver: the verdict; a measurement table, the method and an exact repro; the core contract (inputs, outputs, latency and cost envelope, failure modes, streaming or partial results, quality baseline) written into SKELETON.md; design implications; backend and hosting implications; a DECISIONS.md entry and the updated RISKS.md row. On FAIL: ranked pivots and the PRODUCT.md lines each one changes.
```

The feel prototype is a greybox: system font, greys, no brand. What it must get right is time. It runs at the speed the spike measured, so the people trying it feel the real wait.

```prompt title="Feel Prototype"
FEEL PROTOTYPE for {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), built on the measurements from spike {{SPIKE_ID}}, on its own throwaway branch. First show me the plan (the branch, the sequence and the three bridges) and wait for my go.
Greybox: system font, greys, no brand, no design tokens. Forbidden: brand styling, and fake speed of any kind. Required: real timings (stream at the measured throughput, delay by the measured p95, fail at the measured error rate); the whole moment-of-value sequence from trigger to result; a rough cut of the signature-moment choreography with plain transforms; and three switchable ways to bridge the wait (?bridge=stream | work | optimistic): stream partial results; show the absorbed work (the inputs visibly becoming the result); an optimistic placeholder that resolves in place.
Deliver: a URL or build I can put in front of 3 people who match {{?PERSON}}; a 5-line session script (what I say, what I must not explain); and a notes table for me to fill: Person | Described what happened in their own words? | Would wait? | Preferred bridge | Words they used for our nouns.
After I paste the notes: the winning bridge as one DESIGN.md constraint line, GLOSSARY.md edits where their words differ from ours, and any PRODUCT.md or RISKS.md edits. Show them to me before writing.
```

> **Rule:** The feel gate passes when at least 2 of the 3 people describe what happened in their own words and say they'd wait. If it fails, redesign the moment (what streams, what's inferred, what happens first), never the pixels.

RISKS.md is the running list of what could sink the product, scored so the worst gets tested first.

```file path=".offthemode/RISKS.md"
RISKS · score = likelihood x impact (1-5 each). Any core risk scoring 12 or more gets a spike before P3 starts, or, if it can only be proven end to end, a written end-to-end check in its fragment's done-when (Verify: on completion). Hypothesis Person, Job or Moment lines from PRODUCT.md land here as ux risks until they are confirmed.

| ID | Risk (falsifiable) | Area | L | I | Score | Test or spike | Kill or pivot criterion | Status |
|---|---|---|---|---|---|---|---|---|
| R-01 | {{e.g. canvas cannot render 50k nodes at 60 fps on a mid-tier Android}} | core | 3 | 5 | 15 | spike/render-50k, 4 h | under 30 fps after 2 approaches -> {{FALLBACK}} | open |
| R-{{NN}} | {{RISK}} | {{core / ux / infra / security / cost}} | | | | {{TEST}} | {{CRITERION}} | {{open / spiking / retired / accepted}} |
```

## P3 · Visual Language

> **Output:** `.offthemode/DESIGN.md` (taste, principles, system, bans, rubric), references in `.offthemode/design/`, a locked `src/styles/tokens.css` (plus `tokens/tokens.json` for native apps), a `/specimen` page that renders every state, and four checks in RULES.md §Commands: screenshots, the computed-style audit, `scripts/check-bans.sh` and `scripts/diverge-diff.sh`.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Build with the design tokens and components that already exist. No raw colour, size, spacing or duration values: a value the tokens can't express is a token proposal shown to the user, never an inline number.
- If DESIGN.md exists, follow its principles and bans. If there is none, follow the current styles, and list any value in the touched files that bypasses the tokens.
- One primary action per screen. Every touched screen keeps its empty, loading, error, offline and no-permission states.
- Nothing that could sit on any other product unchanged. If the change drifts toward a stock layout or a component library's default look, stop and say so.
- Look at every touched screen at each of screenshot_sizes (RULES.md §Budgets), light and dark, with the screenshot and audit commands in RULES.md §Commands where they exist.
- Open the whole guide when the product has no tokens yet, to add or change a token, to set a visual direction or a signature moment, or to redesign a whole surface. Offer that as its own step; never start it inside a small change.
<!-- /offthemode:rules -->

On a new product, the tokens are locked and the specimen exists before the first product screen is built; on an existing one, work inside the tokens it has and rework them as a step of their own. Tokens are named values (colour, type, space, radius, motion) that components use instead of raw numbers; the specimen is one page that renders the whole visual language. This is where "complex inside, simple outside" becomes visible: restraint, hierarchy and motion make a dense system read as one calm surface with one obvious next move.

> **Rule:** Prove a direction on the product's hardest real screen (the dense core surface), never on a landing page. A direction that only works on a hero is a poster, not a language.

### Why AI design all looks the same

Ask for "a modern, clean landing page" and you get the mode, the single most likely answer: centered hero, gradient headline, pill badge, logo marquee, three icon cards, bento grid, three pricing tiers, FAQ, all in Inter with `rounded-xl shadow-sm` and `from-blue-500 to-purple-600`. "Modern" and "clean" sat next to millions of those templates, and if `rounded-lg` exists, it is the most probable choice. Three levers move the output. **References** change what the model is conditioned on. **Tokens** shrink the space of outputs: if the radius family is one value and its concentric derivatives, the rounded-xl card cannot happen, and a constraint in code survives when a long conversation gets summarized. **Bans with reasons and replacements** name the exit, and the reason generalizes to cases you never listed.

> **Trap:** "Make it unique." The model has seen "unique" next to its second mode: black background, border beams, gradient text, glass. There is now a third mode, the anti-slop look itself (warm paper, graphite, one signal colour, uppercase mono labels, hairlines instead of cards), because every anti-slop skill pushes AI tools there. Defining yourself against the average only moves you to the next average. The exit that does not converge is your own taste, written down.

### Your taste, written down

A ban says where not to go, never where to go; only taste does that. Before your first product, and every six months after, save about 20 things you love and 20 you can't stand (sites, apps, posters, objects, film frames, type specimens, rooms) in `.offthemode/design/taste/` as `love-*` and `hate-*`, each with one line of why. Motion goes in as a frame strip (animation frames tiled into one image, see The screenshot loop), never a still. Taste Extraction turns them into DESIGN.md §Taste (start DESIGN.md from the template at the end of this guide), which makes "unique" mean "recognisably yours" rather than "unlike the average".

Taste is yours, not the product's, so carry §Taste and the folder to your next project. Its **Already used** table is a novelty ledger: whatever worked last time quietly becomes your personal mode, so each shipped product adds a row, and new directions treat every row as a ban.

```prompt title="Taste Extraction"
.offthemode/design/taste/ holds about 20 things I love (love-*) and 20 I can't stand (hate-*), each with one line of why. Motion items are frame strips with duration and easing notes.
1. For each item: the ONE decision that makes me react, and what it costs. Do not describe the image.
2. My personal principles as falsifiable sentences, each traced to 2+ loves and contradicted by 1+ hate ("type carries hierarchy; colour only ever means state" is a principle; "clean and bold" is not). Keep only the ones my items really support.
3. My recurring moves in type, colour, motion, density and copy.
4. Which traits of my hates the generic AI look shares, and which traits of my loves the anti-slop look shares. Both are modes I can fall into.
5. The tensions between things I love. This is where a product gets its edge: a direction that resolves one of them is already off the mode.
Then interview me with batched, numbered questions on the tensions and on anything I contradicted, each with your read as the recommended answer, in more rounds if needed.
Show me the draft of .offthemode/DESIGN.md §Taste (under 60 lines) and write it after my go. If an earlier §Taste exists, end with the diff: what I stopped loving, what is new, which principle got sharper.
```

### Where references come from

Save references as images in `.offthemode/design/refs/` with a one-line note each; a URL fetch returns HTML, not feel. Motion references are frame strips with measured duration, easing and overshoot. Your AI learns **how** to build from craft teachers and **what** it looks like from you, mostly through sources outside software. These lists are dated 2026-09; review them with DESIGN.md §Saturated at the start of each product.

| Craft: how to build it, never the look | Take |
|---|---|
| Rauno Freiberg, Emil Kowalski (animations.dev), Paco Coursey, Jakub Krehel | Details that survive extreme input; when not to animate |
| Benji Taylor (benji.org/family-values) | Components that morph instead of navigating |
| Bartosz Ciechanowski, Maxime Heckel | Complex systems made legible by direct manipulation; shaders at source level |
| Jhey Tompkins, Cyd Stumpel, Matt Perry (motion.dev), Josh W. Comeau | Scroll-driven and view transitions in production; springs, `linear()` easing |
| basement.studio, darkroom.engineering, Lusion, 14islands | Scroll feel and transition pacing |
| Base UI, React Aria, Radix; cmdk, Sonner, Vaul, NumberFlow, Paper Shaders | Unstyled behaviour, always restyled. shadcn/ui wraps cmdk, Sonner and Vaul, so their default look is the average toast |
| Mobbin, Refero, 60fps.design | Platform conventions, flows and mobile motion timing |

| Taste: what it looks like | Take |
|---|---|
| Your `.offthemode/design/taste/` folder and your own Are.na channels | The only source that is recognisably you |
| Letterform Archive; Standards Manual reissues | Systems in print: grids, signage, identity manuals |
| Art of the Title | Pacing, reveals, type in motion |
| Foundry specimens: Future Fonts, Velvetyne, Collletttivo, UNCUT.wtf, Departure Mono; Dinamo, Grilli Type, Klim, OH no Type Co | Faces nobody else has yet, and how a type designer stages a face |
| Museum and exhibition identities; hardware manuals and instrument panels; record sleeves | Constraint-driven layout, labelling, one bold move per object |
| Godly, Siteinspire, Minimal Gallery, Hoverstat.es, Cosmos | The fringe of the web; check every trait against §Saturated first |
| Fonts In Use | Evidence of how saturated a face is |

Saturated traits live in DESIGN.md §Saturated and need a written product reason in DECISIONS.md. Anti-slop skills are a floor, not a ceiling: when everyone installs the same one, its escape routes become the next average.

```prompt title="Saturation Check"
For each trait in .offthemode/design/directions/*.md and .offthemode/DESIGN.md (faces, colour strategy, grid model, surface treatment, motion signature, layout device), estimate how saturated it is. Search if you can (Fonts In Use, Framer and Webflow template marketplaces, recent design-award galleries, all from the last 12 months); otherwise say you are estimating. Roughly 20+ hits, or a match in DESIGN.md §Saturated, means mainstream: keep it only with a written product reason, or replace it with a move derived from a §Taste tension.
Output: Trait | Evidence | Verdict (keep with reason | replace) | Replacement.
Change nothing. After my go, log each kept trait's reason in .offthemode/DECISIONS.md and apply the replacements.
```

### Three directions, built apart

1. Build a moodboard of 30-60 references, at least half from outside software.
2. Run Extract Principles. It reads §Taste, so the principles are yours before they are this product's.
3. **You** give each of three directions an external anchor from the moodboard and one forbidden trait, before anything is generated.
4. Set up the screenshot scripts (The screenshot loop), then build each direction in its own fresh AI session that cannot see the others. Each touches only its own direction file and `/lab/a`, `/lab/b` or `/lab/c` routes, so the three combine without conflicts.
5. Check divergence after the fact: `scripts/diverge-diff.sh` flags any pair sharing more than half its knob values (the handful of token values, such as hues, type ratio and radius, that every other token derives from), and a fresh critic session judges from screenshots only.
6. In a separate critic session, ask for one base and at most two grafts (single ideas taken from the other directions into the base). You choose. Averaging all three brings the mode back.
7. Run Saturation Check, lock tokens v1 and build the specimen. After that, every screen is assembly, not invention.

With git, give each direction its own branch and merge the three into a `lab` branch. If your tool can run isolated helpers in their own checkout (Claude Code subagents with a worktree can), they handle step 4 for you.

> **Why:** One session that builds A, B and C in sequence conditions B on A and C on both, and picks its own axes, so you get the mode three times in three fonts. Separate sessions and axes you assigned make the samples independent. A checker that did not author them is what makes "they differ" true.

```prompt title="Extract Principles From References"
Act as a design director with a type designer's eye. .offthemode/design/refs/ holds {{N}} reference images (motion references as frame strips), each with a note. Product: {{?PRODUCT_ONE_LINER}}. Person: {{?PERSON}}. Moment of value: {{?MOMENT_OF_VALUE}} (all from .offthemode/PRODUCT.md). Taste: .offthemode/DESIGN.md §Taste.
Do not describe the images. Per reference: the ONE decision that makes it work, what it costs, and why it works perceptually.
Then synthesize the principles for this product, keeping only those the references really support and the product's job needs. Each is a falsifiable sentence, not an adjective; traced to references by filename and to a §Taste principle or tension; expressed in type, colour, layout, motion and copy; paired with its failure mode (how an AI would misapply it into cliche).
Also list: shared traits that are only current fashion or appear in §Saturated (dropped); 3 tensions between references to resolve; what NONE of the references do that this product's job demands. Never copy a layout, logo or signature element.
Show me the result, then write it to .offthemode/DESIGN.md §Principles after my go.
```

```prompt title="Three Divergent Directions"
Direction {{A, B or C}} of three for {{?PRODUCT_NAME}}. This is a fresh session. The other directions exist elsewhere; do not look for them.
Anchor, assigned by me: {{REF_FILE in .offthemode/design/refs/}}; take {{WHAT_TO_TAKE}}. Forbidden trait: {{TRAIT}}.
Read .offthemode/DESIGN.md §Taste, §Principles, §Bans and §Saturated. The §Already used table is a ban list: share at most one attribute (column) with any row.
First reply with a two-word name, a one-sentence thesis naming the metaphor, the density and the colour strategy, and the knob values you plan. Build after my go.
Deliver: src/styles/directions/{{a, b or c}}.css using the tokens.css variable names; /lab/{{a, b or c}}/core ({{?HARDEST_SCREEN}} on edge-case data: long names, empty, max rows, error) and /lab/{{a, b or c}}/entry ({{?SECOND_SCREEN}}); a working signature moment; light and dark.
Constraints: no HARD ban and no DEFAULT-OFF ban; one primary action per surface; real copy in the product's voice; no new dependency without a reason. Touch only the direction file and /lab/{{a, b or c}}.
Finish: run {{?SHOTS_CMD}} on both routes and write .offthemode/design/directions/{{a, b or c}}.md: thesis, bet, weakest point, the §Taste tension it resolves. Do not compare yourself to anything and do not recommend.
```

```file path="scripts/diverge-diff.sh"
#!/usr/bin/env bash
# Flags direction pairs that share more than half of their knob values. Usage: scripts/diverge-diff.sh src/styles/directions/*.css
knobs() { grep -oE -- '--[a-z0-9-]+: *[^;]+' "$1" | sed 's/: */=/' | sort -u; }
fail=0
for a in "$@"; do for b in "$@"; do
  [[ "$a" < "$b" ]] || continue
  shared=$(comm -12 <(knobs "$a") <(knobs "$b") | wc -l | tr -d ' '); total=$(knobs "$a" | wc -l | tr -d ' ')
  if [ $((shared * 2)) -gt "$total" ]; then echo "$a ~ $b: $shared of $total knob values identical; redo one"; fail=1; fi
done; done
exit $fail
```

The critic is a fresh AI session with no memory of building the screens; it judges screenshots, not code. Run it twice, in two fresh sessions with the order of screens and anchors swapped, and count a tie wherever they disagree, because models lean toward whichever image came first. If your tool supports subagents with a fixed tool list (Claude Code does), a read-only critic makes "never edit files" a wall instead of a request.

```prompt title="Design Critic"
You are the critic, not the author. You owe these screens nothing; catch what a picky design director and a ruthless product lead would. Judge pixels, not intent: do not read the implementation first, and never edit files.
Screens: {{ROUTES or "the three lab directions"}}, as screenshots in shots/; open every image. Read .offthemode/DESIGN.md (§Taste, §Principles, §Rubric, §Already used), .offthemode/PRODUCT.md and the anchors in .offthemode/design/rubric/.
Judge pairwise, never absolutely: per screen and criterion, "better than anchor N? screen / anchor / tie", naming the deciding region ("lab-b-core-390-light.png, top right: three accent roles compete"). Compare with the 2-anchor on every criterion and the 3-anchor on Distinctiveness and Signature moment. Judge only in the order given.
The audit owns pixel facts (off-token values, contrast, baselines, target sizes); do not re-argue them. You own hierarchy, distinctiveness, restraint and feel. Always check icon alignment to cap height, heading widows, dark-mode clipping, focus ring visibility, more than one accent role per viewport, and anything deletable without loss.
Then: the logo-swap test (the product this could be mistaken for, any §Already used row it resembles, or "none"); the 3 changes that would flip the most losses; the best idea worth grafting elsewhere. For directions, also judge divergence from the screenshots alone, recommend one base plus at most 2 grafts, and flag conflicts; never average them.
Every finding: file, region ("top fifth, left column"), the problem in measurable terms, the fix as a token, property or element change. Never say "looks great"; report wins, losses and ties.
```

### Tokens are the contract

Tokens are the one design artifact your AI cannot misread. `tokens.css` owns every motion, type and space value, so prompts and docs say `--dur-quick`, never a number. Colour is OKLCH, a colour model where equal lightness steps look equal (HSL's do not), and states derive with relative colour syntax instead of new hex values. Set about ten knobs and the rest derives; the comments give ranges, not a look. Springs (motion driven by stiffness and damping instead of a fixed duration, so it can be interrupted and keeps its speed) are `linear()` curves here, with JavaScript and native twins in `motion.ts`. Harmonizer (OKLCH plus APCA, a newer contrast measure) and oklch.com help with palettes, Utopia with fluid type.

The dark block appears twice on purpose. The media query serves the system setting for real users; the attribute serves the in-app toggle and every screenshot run. With only the attribute, a browser emulating dark mode renders the light theme, and every "checked in both themes" claim checks a theme that was never drawn.

```file path="src/styles/tokens.css"
/* {{PRODUCT_NAME}} visual contract v{{VERSION}}. Components consume these names only; this file owns every motion, type and space value.
   Multi-platform: generate this file from tokens/tokens.json (DTCG). Knob comments give ranges, not a look. */
:root {
  /* knobs */
  --hue-neutral: {{NEUTRAL_HUE}};       /* 0-360 */
  --chroma-neutral: {{NEUTRAL_CHROMA}}; /* 0 achromatic, ~0.01 faint tint, 0.03+ clearly coloured surfaces */
  --hue-accent: {{ACCENT_HUE}};         /* 0-360 */
  --chroma-accent: {{ACCENT_CHROMA}};   /* ~0.08 muted to ~0.22 vivid in sRGB; P3 override below */
  --l-accent: {{ACCENT_L}};             /* <= 0.58 with a light --on-accent; above ~0.62, --on-accent must be dark ink */
  --type-ratio: {{TYPE_RATIO}};         /* ~1.125 to ~1.333; smaller is denser */
  --density: {{DENSITY}};               /* ~0.875 to ~1.125 */
  --radius-base: {{RADIUS_BASE}};       /* any value, one family; nested radii are concentric (inner = outer - padding), defined as tokens below */

  /* type: one surface uses at most 4 steps of this scale */
  --font-display: {{FONT_DISPLAY}};
  --font-text: {{FONT_TEXT}}, system-ui, sans-serif;
  --font-mono: {{FONT_MONO}}, ui-monospace, monospace;
  --text-xs: calc(1rem / pow(var(--type-ratio), 2));
  --text-sm: calc(1rem / var(--type-ratio));
  --text-base: 1rem;
  --text-lg: calc(1rem * var(--type-ratio));
  --text-xl: calc(1rem * pow(var(--type-ratio), 2));
  --text-2xl: calc(1rem * pow(var(--type-ratio), 3));
  --text-display: {{DISPLAY_CLAMP}};    /* its jump from base is a DESIGN.md decision */
  --leading-tight: 1.05; --leading-body: 1.5;
  --tracking-display: -0.02em; --tracking-label: {{TRACKING_LABEL}}; --measure: 66ch;

  /* space: 4px grid x density */
  --u: calc(0.25rem * var(--density));
  --space-1: var(--u); --space-2: calc(var(--u) * 2); --space-3: calc(var(--u) * 3);
  --space-4: calc(var(--u) * 4); --space-6: calc(var(--u) * 6); --space-8: calc(var(--u) * 8);
  --space-12: calc(var(--u) * 12); --space-16: calc(var(--u) * 16); --space-24: calc(var(--u) * 24);

  /* colour, light */
  --bg:        oklch(0.985 var(--chroma-neutral) var(--hue-neutral));
  --surface-1: oklch(0.962 var(--chroma-neutral) var(--hue-neutral));
  --surface-2: oklch(0.935 var(--chroma-neutral) var(--hue-neutral));
  --line:      oklch(0.885 var(--chroma-neutral) var(--hue-neutral));
  --ink-3:     oklch(0.52 var(--chroma-neutral) var(--hue-neutral)); /* meta text: clears 4.5:1 on bg and both surfaces */
  --ink-2:     oklch(0.40 var(--chroma-neutral) var(--hue-neutral));
  --ink-1:     oklch(0.20 var(--chroma-neutral) var(--hue-neutral));
  --accent:       oklch(var(--l-accent) var(--chroma-accent) var(--hue-accent));
  --accent-press: oklch(from var(--accent) calc(l - 0.06) c h);
  --accent-wash:  oklch(from var(--accent) 0.95 calc(c * 0.25) h);
  --on-accent: {{ON_ACCENT}};           /* light text when --l-accent <= 0.58, dark ink above ~0.62 */
  --ok: oklch(0.5 0.13 150); --warn: oklch(0.52 0.14 70); --danger: oklch(0.52 0.19 27); /* usable as text and as fills under light text */

  /* data: categorical hues rotate from the accent at equal chroma; lightness alternates two bands so neighbours separate under colour-blind simulation */
  --data-l1: 0.55; --data-l2: 0.65; --data-c: 0.13;
  --data-1: oklch(var(--data-l1) var(--data-c) var(--hue-accent));
  --data-2: oklch(var(--data-l2) var(--data-c) calc(var(--hue-accent) + 60));
  --data-3: oklch(var(--data-l1) var(--data-c) calc(var(--hue-accent) + 120));
  --data-4: oklch(var(--data-l2) var(--data-c) calc(var(--hue-accent) + 180));
  --data-5: oklch(var(--data-l1) var(--data-c) calc(var(--hue-accent) + 240));
  --data-6: oklch(var(--data-l2) var(--data-c) calc(var(--hue-accent) + 300));
  --data-seq-lo: oklch(from var(--accent) 0.93 calc(c * 0.3) h); --data-seq-hi: var(--accent);
  --data-div-neg: oklch(var(--data-l1) var(--data-c) calc(var(--hue-accent) + 180)); --data-div-mid: var(--surface-2); --data-div-pos: var(--accent);

  /* shape and depth: lines and tonal steps first; shadows only for overlays */
  --radius-1: var(--radius-base); --radius-2: calc(var(--radius-base) * 2); --radius-full: 999px;
  --radius-inner-2: max(0px, calc(var(--radius-2) - var(--space-2)));  /* a radius-2 container with space-2 padding */
  --hairline: 1px solid var(--line);
  --shadow-overlay: 0 16px 40px -12px oklch(0.2 0.02 var(--hue-neutral) / 0.22);

  /* motion: UI transitions stay at or under --dur-slow; springs are judged by their settle time (-dur); --spring-soft is the signature moment's only.
     Springs as linear() (stiffness/damping 400/28 and 220/18); JS twins in motion.ts */
  --dur-instant: 90ms; --dur-quick: 160ms; --dur-base: 240ms; --dur-slow: 420ms;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --spring-snappy: linear(0, 0.124, 0.371, 0.62, 0.815, 0.943, 1.013, 1.042, 1.045, 1.037, 1.025, 1.014, 1.006, 1.001, 0.999, 0.998, 1);
  --spring-snappy-dur: 460ms;
  --spring-soft: linear(0, 0.145, 0.435, 0.719, 0.926, 1.043, 1.088, 1.086, 1.063, 1.036, 1.014, 1, 0.993, 0.992, 0.993, 0.996, 1);
  --spring-soft-dur: 660ms;
  --shift-1: 4px; --shift-2: 12px; --press-scale: 0.97; --stagger: 30ms;

  /* grid */
  --cols: 12; --gutter: var(--space-6); --margin: clamp(var(--space-4), 5vw, var(--space-24));
  --rail: {{RAIL_WIDTH}};             /* optional label column; 0 disables */
  --content-max: {{CONTENT_MAX}};
  --touch-min: {{TOUCH_MIN | 44px, or delete this line}};   /* web touch target, only if this product holds one; the audits check it while this line exists */
}

/* dark: surfaces rise by lightness, not shadow. Two identical copies: the media query serves the OS setting, the attribute serves the toggle and screenshot runs. Edit both. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: oklch(0.165 var(--chroma-neutral) var(--hue-neutral));
    --surface-1: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
    --surface-2: oklch(0.24 var(--chroma-neutral) var(--hue-neutral));
    --line: oklch(0.3 var(--chroma-neutral) var(--hue-neutral));
    --ink-3: oklch(0.66 var(--chroma-neutral) var(--hue-neutral));
    --ink-2: oklch(0.8 var(--chroma-neutral) var(--hue-neutral));
    --ink-1: oklch(0.95 var(--chroma-neutral) var(--hue-neutral));
    --accent: oklch(calc(var(--l-accent) + 0.06) calc(var(--chroma-accent) * 0.85) var(--hue-accent));
    --on-accent: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
    --accent-wash: oklch(from var(--accent) 0.28 calc(c * 0.35) h);
    --ok: oklch(0.72 0.13 150); --warn: oklch(0.8 0.14 75); --danger: oklch(0.7 0.17 27);
    --data-l1: 0.72; --data-l2: 0.82; --data-seq-lo: oklch(from var(--accent) 0.3 calc(c * 0.3) h);
  }
}
:root[data-theme="dark"] {
  --bg: oklch(0.165 var(--chroma-neutral) var(--hue-neutral));
  --surface-1: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
  --surface-2: oklch(0.24 var(--chroma-neutral) var(--hue-neutral));
  --line: oklch(0.3 var(--chroma-neutral) var(--hue-neutral));
  --ink-3: oklch(0.66 var(--chroma-neutral) var(--hue-neutral));
  --ink-2: oklch(0.8 var(--chroma-neutral) var(--hue-neutral));
  --ink-1: oklch(0.95 var(--chroma-neutral) var(--hue-neutral));
  --accent: oklch(calc(var(--l-accent) + 0.06) calc(var(--chroma-accent) * 0.85) var(--hue-accent));
  --on-accent: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
  --accent-wash: oklch(from var(--accent) 0.28 calc(c * 0.35) h);
  --ok: oklch(0.72 0.13 150); --warn: oklch(0.8 0.14 75); --danger: oklch(0.7 0.17 27);
  --data-l1: 0.72; --data-l2: 0.82; --data-seq-lo: oklch(from var(--accent) 0.3 calc(c * 0.3) h);
}

@media (color-gamut: p3) { :root { --chroma-accent: {{ACCENT_CHROMA_P3}}; } }

@media (prefers-reduced-motion: reduce) {  /* replace movement, keep feedback */
  :root { --shift-1: 0px; --shift-2: 0px; --press-scale: 1;
          --spring-snappy: var(--ease-out); --spring-soft: var(--ease-out); --stagger: 0ms; }
}
```

```file path="src/styles/motion.ts"
// The same springs for Motion (web) and Reanimated (React Native); dampingRatio for SwiftUI and Compose.
export const spring = {
  snappy: { stiffness: 400, damping: 28, mass: 1, dampingRatio: 0.7 },  // presses, toggles, sheets
  settle: { stiffness: 500, damping: 40, mass: 1, dampingRatio: 0.89 }, // layout shifts, no overshoot
  soft:   { stiffness: 220, damping: 18, mass: 1, dampingRatio: 0.61 }, // signature moment only
} as const;
```

> **Pro move:** Shipping on web and native? Keep the canonical tokens in `tokens/tokens.json` in the W3C DTCG format (the Design Tokens Community Group standard, stable since 2025.10), and generate CSS, Swift, Compose and React Native themes with Style Dictionary, so iOS cannot drift from web.

Three filled-in directions, as illustration only. **Never reuse them.** AI tools copy worked examples far more reliably than they apply principles, so one example becomes your house style. They are deliberately incompatible, and DESIGN.md §Already used starts with all three, so they are banned from day one.

| Illustration | Thesis | Knobs | Faces | Surfaces | Signature |
|---|---|---|---|---|---|
| Soft Machine | A consumer tool that feels like a toy you trust | neutral 20 / 0.03, accent 350 / 0.2, radius 14px concentric, ratio 1.25, density 1.125 | Fraunces (soft axis up) / Atkinson Hyperlegible Next, no mono | Tonal colour fields per object type; hue encodes the object | The new object inflates out of the button that made it |
| Bench Instrument | A dense bench tool for someone who reads numbers all day | neutral 250 / 0.006, dark-first, accent 85 / 0.16, radius 0, ratio 1.2, density 0.875 | Berkeley Mono for data and UI / IBM Plex Sans Condensed for prose | Ruled table grid, no fills; values change in place | A readout that ticks digit by digit |
| Contact Sheet | An archive where the photographs are the colour | neutral chroma 0 on purpose, no accent (photography carries hue), radius 0, ratio 1.333, density 1.125 | Newsreader at display optical size / Hanken Grotesk | Full-bleed imagery, wide margins | The tapped thumbnail becomes the full-bleed hero |

```prompt title="Build the Specimen Page"
tokens.css is locked at v1. Build /specimen, one page rendering the whole visual language:
1. Type: every scale step with its token, size, leading and tracking; a paragraph at measure; tabular vs proportional numerals; mono.
2. Colour: every token as a swatch with its oklch value, its WCAG contrast ratio against bg, surface-1 and surface-2, and APCA Lc as a second opinion, light and dark side by side. If .offthemode/RULES.md §Budgets holds contrast keys, every ink/surface and on-accent/accent pair meets contrast_text (contrast_large at WCAG large sizes), and {{?AUDIT_CMD}} fails the run when one doesn't.
3. Space, radii (with their concentric inner values), lines and elevation as rulers. Motion: every duration x easing and spring as a replayable demo beside its reduced-motion variant.
4. Components in ALL states (default, hover, focus-visible, pressed, disabled, loading, error, empty): buttons (primary, secondary, quiet), input, select, checkbox, switch, tabs, menu, dialog, sheet, toast, tooltip, table row, list item, skeleton, empty state.
5. Data: a line, bar, area and table on large realistic data with the --data-* tokens and the highlight rule, direct labels, and designed empty, partial and loading chart states; shoot it with the colour-blind passes too.
6. A real {{?HARDEST_SCREEN}} fragment built only from the parts above, and the signature moment on its own.
Behaviour from {{PRIMITIVES_LIB}}; styling is ours. Zero raw colour, size or duration values in component files (1px hairlines excepted). Theme and reduced-motion toggles at the top.
Before building, list any component or state the tokens cannot express yet, as token proposals, and wait for my go. When it is built, run the Screenshot Critique Loop on /specimen.
```

### The craft layers

- **Type leads.** Once decoration is gone, type is most of what is left, so choose it before colour: one text face that disappears, one display voice with an opinion, a mono only if the data needs one. Display gets optical tightening (negative tracking, 1.0-1.1 leading). One label treatment (case, tracking, scale step) everywhere. `text-wrap: balance` on headings, `tabular-nums` wherever numbers change. Hierarchy comes from size, weight and space; colour is the last lever.
- **Colour.** The strategy is a DESIGN.md decision: one scarce accent, a colour-led palette where hue encodes object type, or photography as the colour. Every hue maps to a principle; if removing a colour loses no meaning, it was decoration. Neutrals are tinted or deliberately achromatic, never framework grays. One accent role per viewport outside the signature moment. Dark mode is designed: surfaces rise in lightness, the accent drops about 15% chroma, and text on the accent is checked again.
- **Layout.** Choose a grid model and make it visible: editorial columns, a label rail, a canvas, a feed, a table. Use density contrast (tight groups, generous separations) instead of uniform medium spacing, which is the template tell. A card is for an object that behaves like one (draggable, stackable, dismissible); everywhere else, alignment and tonal steps carry the grouping.
- **Motion.** It answers where something came from, where it went, or what caused it; otherwise cut it. User-driven motion uses springs, system motion uses duration tokens, and nothing eases in on a response. The more often something happens, the less it animates. View Transitions (the browser's built-in animation between two states) morph a list into its detail and scroll-driven animation adds depth, both feature-detected so the UI works without them. Animate only transform, opacity and clip-path.
- **Texture and haptics, once each.** One surface, one technique, with a principle behind it. Shaders pause offscreen and ship a static fallback. On mobile, haptics are the press state, mapped to meaningful events like selection, success and snap, never to raw taps.
- **Data.** The hardest real screen is often a chart or a dense table, and that is where the chart library's default palette leaks in. The `--data-*` tokens and DESIGN.md §Data give charts a grammar: hues rotated from the accent, one sequential and one diverging ramp, the asked-about series in accent and the rest in `--ink-3`, direct labels over legends.

**The signature moment.** Exactly one, at the moment of value, and the only place allowed past the motion ceiling with `--spring-soft`, sound, a haptic ramp or texture. Test it: can you describe it in one sentence, and would a user show it to someone? Patterns that work: the result assembles from its inputs in well under a second, showing the absorbed complexity, then gets out of the way; hold-to-commit with a haptic ramp; the tapped object becomes the next screen; an empty state that previews the product filled with the user's own data. Two signature moments equal zero. Its timing comes from the P2 feel test, not from taste alone. Copy counts as visual too; its rules live in Always-On · Words & Voice.

### The screenshot loop

An AI writing CSS is guessing at pixels, and its confidence reflects how plausible the code looks, not how it renders. Give it eyes, and split the judging. A **deterministic audit** (a script that gives the same answer every run) owns the pixel facts a model cannot read from a screenshot: 1-3 px baseline drift, off-token values leaking in from library CSS or inline styles, undersized targets, contrast, accent share. The **critic** judges only what needs judgment: hierarchy, distinctiveness, feel. Your AI can explore with a browser tool (Playwright MCP, Chrome DevTools MCP); evidence comes from scripts. On native, capture with `xcrun simctl io booted screenshot`, `adb exec-out screencap -p` or Maestro. The app sets a `data-ready` attribute once data and fonts have settled, because waiting for "network idle" never finishes in apps with live connections (SSE, WebSockets, polling).

```prompt title="Screenshot and Audit Scripts"
Write two scripts in this project's stack (Playwright for web; simulator or emulator tools for native) and add both to .offthemode/RULES.md §Commands. Show me the plan first; write them after my go.
shots ROUTES: per route, at each size in screenshot_sizes (RULES.md §Budgets), a full-page shot in light and in dark at 2x density, touch emulated under 768 px. Force the theme two ways, the system colour scheme plus data-theme on the root element set before page scripts run, so the dark shot really is dark. Wait for [data-ready] and document.fonts.ready, never network idle; disable animations. Save shots/ROUTE-WIDTH-THEME.png, and add shots/ to .gitignore: shots are rebuilt on every run, and the ones worth keeping go to tests/baselines/. With VISION=deuteranopia,protanopia, add light shots through Chrome's Emulation.setEmulatedVisionDeficiency. Exit 1 if a light and dark pair is byte-identical: the theme is not switching.
audit ROUTES: same sizes and themes. Collect every custom property declared on :root (media queries included) and resolve each through a hidden probe element for color, padding, font-size, font-family, transition-duration and box-shadow; those computed values are the only allowed ones. On every visible element outside [data-audit-skip], check text colour, size and face, background, padding, gaps, corner radius, shadow and transition duration against that set, ignoring 0, none, auto and transparent. Also flag, when RULES.md §Budgets holds those keys, text contrast against the nearest opaque background below contrast_text (contrast_large from large_text_px, or large_bold_text_px when bold); and always flag interactive elements under --touch-min when the tokens define it, and same-size sibling baselines in a row that differ by 1-3 px. Report the share of the first viewport filled with --accent. Print up to 40 findings per route, size and theme (element, property, value). Exit 1 on any finding.
```

Stills show neither easing nor interruption, and a model cannot watch a video file. So the `audit-ux` script (Always-On · Verification Loop) asserts the motion facts: which properties animate, durations against their tokens, and whether a re-triggered animation continues from where it is. Feel gets a frame strip the model can read, and the final call stays yours.

```bash
# Record with Playwright (newContext({ recordVideo: { dir: "shots/video" } }); the clip is written when the context closes),
# then tile 30 fps frames into one image: 12 x 3 = 36 frames, 1.2 s of motion.
ffmpeg -y -i shots/video/{{CLIP}}.webm -vf "fps=30,scale=360:-1,tile=12x3" -frames:v 1 shots/{{NAME}}-strip.png
```

```prompt title="Screenshot Critique Loop"
Loop on {{ROUTE}}, one round at a time:
1. Run {{?SHOTS_CMD}} {{ROUTE}} and {{?AUDIT_CMD}} {{ROUTE}}. Fix every audit finding first: those are facts (off-token values, contrast, baseline drift, undersized targets), not taste.
2. Get a Design Critic review of the new shots from a session that did not build them, twice with the order swapped. If you cannot start one, stop and ask me to run it and paste the findings back.
3. Fix the critic's findings, highest impact first, with tokens and component styles only.
4. Re-shoot, re-audit and diff: improved, regressed.
Before round 1, show me the audit findings, what you plan to fix and roughly what a round costs; after my go, run the rounds without asking again. Stop when the audit is clean and the .offthemode/DESIGN.md §Rubric ship bar is met, or when a round flips no loss (more rounds would go in circles). Then list what remains for my taste call. Never say it "looks great"; report wins, losses and ties.
```

Vague feedback gets ignored or overcorrected; pixel-level feedback gets fixed. "Too cluttered" becomes "7 equal-weight toolbar buttons: keep Run as primary, move 5 to overflow, delete Refresh (auto-refresh exists)". "Looks generic" becomes "the 3-card row is the tell: make it one sequence where each item shows the real output it describes".

```prompt title="De-Genericize Pass"
Audit {{SCOPE}} for statistical-average UI; every hit is a bug.
1. Patterns: run scripts/check-bans.sh, then look for what a pattern cannot catch: every HARD ban in .offthemode/DESIGN.md §Bans, every DEFAULT-OFF ban not listed in §Unbans, and every §Saturated trait. Give file:line, then keep (citing the unban or DECISIONS.md entry that allows it) or replace. Replacements come from DESIGN.md §Principles and §Taste, never from another cliche.
2. Copy: rewrite every sentence a competitor could publish unchanged, using a noun, number or verb from {{?PRODUCT_NAME}}'s domain.
3. Values: run {{?AUDIT_CMD}}; framework defaults and raw values become tokens. Icons that repeat their label: deleted.
4. Delete test: remove each element in turn; if nothing is lost, it stays deleted.
5. The signature moment exists and is the only loud thing.
Report the findings and the planned changes first, and change nothing until I say go. Then make them and give a change summary with before and after screenshots.
```

### Enforce the bans

A ban you only ask for gets forgotten; a ban a script checks does not, so `scripts/check-bans.sh` searches the source for each pattern. HARD ids always apply. A DEFAULT-OFF id is skipped once DESIGN.md §Unbans lists it, so a rounded consumer app is not marked down for being right. Ids with no pattern, such as emoji icons, are left to the critic. The patterns fit CSS and Tailwind; native projects ban in their own idiom, such as `\.cornerRadius\(` and `Color\(red:` for SwiftUI, or `RoundedCornerShape\(` and `Color\(0x` for Compose. If your tool supports hooks (Claude Code does), you can run it after every edit, so hits show up while the code is being written.

```file path="scripts/check-bans.sh"
#!/usr/bin/env bash
# Greps source for banned patterns. HARD ids always apply; OFF ids apply unless .offthemode/DESIGN.md "### Unbans" lists them.
# Ids and reasons live in DESIGN.md §Bans; ids with no pattern are left to the critic. Usage: scripts/check-bans.sh [paths] (default: src). Exit 1 on any hit.
paths=("$@"); [ ${#paths[@]} -eq 0 ] && paths=(src)
unbans="$(sed -n '/^### Unbans/,/^### /p' .offthemode/DESIGN.md 2>/dev/null | grep -oE '^- [a-z0-9-]+' | cut -c3-)"
fail=0
while read -r id tier re; do
  [ -z "$re" ] && continue
  [ "$tier" = OFF ] && printf '%s\n' "$unbans" | grep -qx -- "$id" && continue
  hits="$(grep -rnE --exclude='*tokens*' --exclude='*.md' --exclude-dir=fixtures -- "$re" "${paths[@]}")" || continue
  printf '[%s, %s]\n%s\n' "$id" "$tier" "$hits"; fail=1
done <<'BANS'
fake-data         HARD  Lorem|lorem ipsum|John Doe|Jane Doe|Acme
hype-copy         HARD  Welcome to|Unlock|Seamless|Supercharge|Elevate|Empower|Effortless
gradient-text     HARD  bg-clip-text|background-clip: *text
off-token         HARD  #[0-9a-fA-F]{3,8}([^0-9A-Za-z_-]|$)|-\[[0-9.]+(px|rem|ms)\]
layout-anim       HARD  transition-\[?(width|height|top|left)|transition: *(width|height|top|left)
emoji-icon        HARD
radius-8plus      OFF   rounded-(lg|xl|2xl|3xl)
container-shadow  OFF   shadow-(md|lg|xl|2xl)
blue-purple       OFF   -(blue|indigo|purple|violet)-[0-9]
glass             OFF   backdrop-blur|backdrop-filter
default-face      OFF   [^A-Za-z](Inter|Geist|Roboto)[^A-Za-z]
gray-default      OFF   -(zinc|slate|gray)-[0-9]
BANS
[ "$fail" = 0 ] && echo "No ban hits."
exit $fail
```

### The design document

DESIGN.md holds everything visual that is not code. Its feel words come from PRODUCT.md §Feeling. Point RULES.md §Look and feel at it so every UI change reads it first, and change tokens only through a proposal recorded in its changelog.

```file path=".offthemode/DESIGN.md"
DESIGN: {{PRODUCT_NAME}} · v{{VERSION}} · locked {{DATE}} · read before any UI work · under 200 lines
Frame (from PRODUCT.md): {{?PERSON}} · job {{?JOB}} · moment of value {{?MOMENT_OF_VALUE}} · complexity we absorb {{?ABSORBED_COMPLEXITY}}
Thesis: {{ONE_SENTENCE_THESIS}} · feels like {{?FEELING_WORDS from PRODUCT.md §Feeling}} · never like {{N1}}, {{N2}}, {{N3}} · §Taste tension it resolves: {{TENSION}}

### Taste (the builder's; travels to the next product; refresh every six months with Taste Extraction)
Principles (falsifiable; each traced to 2+ loves and contradicted by 1+ hate):
1. {{PRINCIPLE}} · loves {{love-03, love-11}} · hates {{hate-07}}
Recurring moves: type {{}} · colour {{}} · motion {{}} · density {{}} · copy {{}}
What the hates share with the generic AI look: {{TRAITS}}
What the loves share with the anti-slop look (use knowingly): {{TRAITS}}
Tensions (where the edge comes from):
1. {{Love A (love-02) and love B (love-09); a product that holds both looks like ...}}
Never: {{}}

#### Already used (a ban list: a new direction shares at most one column with any row. Starts with the three illustrations from the visual-language guide; add a row when a product ships)
| Product | Display / text faces | Neutral hue, chroma | Accent hue, strategy | Grid model | Surface treatment | Signature pattern |
|---|---|---|---|---|---|---|
| {{PRODUCT}} | {{}} | {{}} | {{}} | {{}} | {{}} | {{}} |

### Principles (this product; falsifiable; only what the references support; from Extract Principles)
1. {{PRINCIPLE}} · refs {{FILES}} · from §Taste {{PRINCIPLE_OR_TENSION}} · fails when {{FAILURE_MODE}}
Dropped as fashion: {{}} · Tensions to resolve: {{}} · What no reference does that the job demands: {{}}

### System
- Tokens: src/styles/tokens.css (web), tokens/tokens.json (all platforms). No raw colour, size or duration in components; a new value is a token proposal, never an inline value.
- Type: display {{FONT_DISPLAY}} for {{DISPLAY_USES}}; text {{FONT_TEXT}}; mono {{FONT_MONO | none}} for {{MONO_USES}}; label treatment {{CASE_TRACKING_STEP}}. Hierarchy: size, weight, space, then colour.
- Colour: strategy {{scarce accent, colour-led, photographic or OTHER}}; neutrals {{tinted to hue N, or achromatic because WHY}}; accent roles {{ROLES}}; one accent role per viewport outside the signature moment.
- Layout: grid model {{GRID_MODEL}}; the primary action sits at {{PRIMARY_ACTION_POSITION}} and carries data-primary; disclosure rules {{DISCLOSURE_RULES}}.
- Motion: {{MOTION_PERSONALITY}}; interactive = springs, system = duration tokens; actions done more than {{N}} times per session get no animation.
- Waiting (from the P2 feel test): {{stream, show the work or optimistic}} for {{OPERATIONS}}.
- Signature moment: {{SIGNATURE_MOMENT}} · trigger {{TRIGGER}} · budget {{PERF_BUDGET}} · fallback {{FALLBACK}}
- Platform: web {{WEB_NOTES}} · iOS {{IOS_NOTES}} · Android {{ANDROID_NOTES}}. In system chrome, native feel beats brand; in content, brand wins.

### Data (charts, tables, timelines)
- Categorical --data-1..6 in order; sequential --data-seq-lo to --data-seq-hi via color-mix in oklch; diverging --data-div-neg, -mid, -pos. Never the chart library's palette.
- The series the user is asking about in --accent; every other series in --ink-3.
- Direct labels over legends; tabular mono on axes; hairlines at major ticks only; no 3D, gradients or drop shadows.
- Designed empty, partial and loading states for every chart.

### Bans
Apply each reason to cases the list does not name. HARD: zero information in any product; never unbanned. DEFAULT-OFF: banned until §Unbans lists the id, the principle it serves and where it applies. Patterns for the ids live in scripts/check-bans.sh.

#### HARD
| id | Banned | Why | Instead |
|---|---|---|---|
| fake-data | Lorem ipsum, John Doe, Acme, $1,234.56 | Fake data makes real design look fake | Fixtures rich in edge cases |
| hype-copy | "Welcome to", "Unlock", "Seamless", "Supercharge", "Elevate", "Empower", "Effortless", "Revolutionize", "Leverage", "Powered by AI" | Zero-information copy | The outcome in the user's nouns; verb + object |
| dead-copy | "Get started" as the only call to action, "Oops!", "Something went wrong", "Click here", "Are you sure?", "Submit" | Says nothing about the result | A button that predicts its result; an error with a next step |
| emoji-icon | Emoji as icons; icons that repeat their label | Instantly reads as vibe-coded | Text labels; custom glyphs where scanning needs them |
| kit-default | Untouched component-library defaults | Reads as unset | Restyled to tokens |
| gradient-text | Decorative gradient text | Decoration carrying no information | Solid ink |
| template-page | Centered hero + 3 feature cards + pricing + FAQ; pill badge above the headline; logo marquee | The statistical-average page | The product doing its job on real data |
| off-token | Raw colour, size or duration values outside tokens | The system stops being editable in one place | A token, or a token proposal |
| layout-anim | Animating width, height, top or left; ease-in on responses | Jank and lag | transform, opacity, clip-path; springs or --ease-out |
| second-signature | A second signature moment | Dilutes the first | Quiet everywhere else |

#### DEFAULT-OFF
| id | Off by default | Why | Typical reason to unban |
|---|---|---|---|
| radius-8plus | Radius of 8 or more (web px) | The default card look | A soft, rounded product; concentric native chrome |
| container-shadow | Shadows on non-overlay containers | Cards covering for a missing grid | A physical metaphor (stacks, drag and drop) |
| multi-accent | More than one accent role per viewport | Competes with the primary action | Colour-led product where hue encodes object type |
| blue-purple | Blue-to-purple hues and gradients | The AI-default palette | A brand that genuinely owns it |
| glass | Glass, glow, blur, border beams, aurora, dot grids | The "unique" mode | Native chrome (iOS Liquid Glass), never faked on web |
| illustration | Illustration and decorative imagery | Filler | A product whose voice is drawn, drawn for it |
| default-face | Inter, Geist, Roboto, system UI or a saturated template face as display | Default voices | A dense tool where the text face is the brand |
| gray-default | Untinted framework grays (zinc, slate, gray) | Reads as unset | A deliberately achromatic direction |
| long-motion | UI transitions longer than --dur-slow (springs judged by settle time; the signature moment is exempt) | Feels slow on repeat | Rare, ceremonial transitions |
| uniform-space | Uniform medium spacing everywhere | No rhythm | Dense data tables |

#### Project bans
| id | Banned | Why | Instead |
|---|---|---|---|

### Unbans (DEFAULT-OFF ids this product turns on)
- {{id}}: serves principle {{N}}; applies to {{WHERE}}

### Saturated · reviewed {{DATE}} (allowed only with a product reason in DECISIONS.md; review at the start of each product)
| Trait | Where it came from |
|---|---|
| Bento grids; glass and web imitations of Liquid Glass; gradient blobs, mesh, aurora | 2022-25 SaaS templates |
| Linear-clone dark mode with a purple glow; border beams, spotlight cards, shimmer buttons | Effects libraries |
| A serif-italic word dropped into a sans headline | 2024-25 landing pages |
| Warm paper with one signal colour; uppercase mono labels in a rail; hairlines instead of cards; dithering and halftone as texture | The anti-slop look that anti-slop skills push every AI toward |
| Satoshi, General Sans, Clash Display, Cabinet Grotesk, PP Neue Montreal as display | Template marketplaces |
| cmdk, Sonner and Vaul at their default styling | shadcn/ui wraps them, so the default is the average |

### Rubric (judged pairwise by a fresh critic session, never scored absolutely)
Anchors: .offthemode/design/rubric/CRITERION-1.png, -2 and -3; until you have them, hate images stand in for the 1-anchor and love images for the 3-anchor. Each judgement runs twice with the order swapped; runs that disagree are a tie.
Ship bar: beats the 2-anchor on every criterion, and the 3-anchor on 2 (Distinctiveness) and 8 (Signature moment). Pixel facts belong to the audit script, not to this rubric. Add rows from 11 for criteria specific to this product's surfaces.
| # | Criterion | A 1-anchor shows | A 3-anchor shows |
|---|---|---|---|
| 1 | Hierarchy (blur test) | Equal weight everywhere | Blurred, still one focal point and a clear reading order |
| 2 | Distinctiveness | Could be any product; matches a logo-swap candidate or an §Already used row | Recognisably the builder's per §Taste, even from a cropped thumbnail |
| 3 | Typography | Default sizes; grey does the hierarchy | Scale jumps, optical tracking per size, balanced headings, tabular figures |
| 4 | Colour intent | Hues with no reason, framework greys, decorative gradients | Every hue maps to a principle; nothing is a default; dark mode designed |
| 5 | Layout and rhythm | Centered stack, uniform gaps | A visible grid model, density contrast |
| 6 | Restraint (delete test) | Removable elements, 2+ primary actions | Nothing removable; complexity behind defaults and disclosure |
| 7 | Motion | Decorative, uninterruptible, ignores reduced motion | Causal, springs where interactive, frequency-aware |
| 8 | Signature moment | None, or several competing | One, at the moment of value, memorable, within budget |
| 9 | Copy | Template phrases, lorem, "Get started" | Domain nouns, numbers, useful empty and error states |
| 10 | State completeness | Happy path only | Every state, long strings, both themes, both platforms |

### Changelog
{{DATE}} v1 locked. Every token change records the reason, the screens affected and a rubric re-run.
```

### Done when

- [ ] DESIGN.md §Taste exists, from Taste Extraction or carried over from your last product, and is less than six months old
- [ ] 30+ references, half from outside software, motion references as frame strips
- [ ] Falsifiable principles in DESIGN.md §Principles, each traced to references and to §Taste
- [ ] Three directions from anchors you assigned, each built in its own fresh session; divergence checked by `diverge-diff.sh` and a fresh critic
- [ ] One base plus at most two grafts, each with a reason in DECISIONS.md; Saturation Check run
- [ ] Tokens v1 locked (plus DTCG JSON for native); `/specimen` covers every state, both themes, data and reduced motion, and meets the §Rubric ship bar
- [ ] Audit clean, contrast included; `check-bans.sh` clean; signature moment profiled on a mid-tier phone
- [ ] The screenshot, audit and ban commands are in RULES.md §Commands, and RULES.md §Look and feel points to DESIGN.md

## P4 · Backend & Infra

> **Output:** a deploy target recorded in `.offthemode/DECISIONS.md`; a data architecture chosen by the UX contract (request/response, or a sync engine spiked in P2); a schema with its invariants and forward-only migrations; a typed contract plus a mock server; `.env.example` and a boot-time env check; a parity table; working observability; a failure-mode table with its fix-now rows done; `.offthemode/ARCHITECTURE.md`. After this, hosting the product means pointing DNS at it.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Read ARCHITECTURE.md first if it exists, and update it in the same change when the structure moves.
- Schema changes go through a new, forward-only migration. Never edit one that has already run.
- Enforce each invariant (a rule the data must always obey) at the lowest layer that can hold it: a database constraint before app code.
- Validate input at every boundary (HTTP, webhooks, queue messages, env, vendor responses), then trust the types. Errors use the project's error catalog.
- A mutation that charges, sends or calls a vendor must be safe to retry, with an idempotency key (one id per request, so a repeat is done only once).
- Contract changes are additive only, unless the user approves a versioning plan.
- A new dependency, service or environment variable gets a DECISIONS.md entry and an updated env check, on the user's go.
- Open the whole guide to choose hosting or the data architecture, to add an entity or a service, or to change the API style.
<!-- /offthemode:rules -->

Keep the infrastructure boring so the product can be the exciting part. A strong backend early is the right call. What matters is timing: pick the deploy target in P1 or P2, using the numbers from the core spike, and build against it from the first commit. Then moving from local to hosted is a config change, not a migration.

> **Why:** Left alone, an AI writes localhost-tutorial code: sessions in memory, uploads to local disk, `setTimeout` as a job queue, SQLite in dev and Postgres in prod. That is the mode, the most common answer rather than the right one. Once RULES.md §This project names the target and its physical limits ("functions die after the response", "no writable disk"), those patterns drop out of what your AI considers. RULES.md loads at the start of every session, so the limits hold every time.

| | Serverless functions | Edge isolates | Managed containers | VPS |
|---|---|---|---|---|
| Examples | Vercel, Netlify, Lambda | Cloudflare Workers, Deno Deploy | Fly.io, Railway, Render, Cloud Run | Hetzner, DigitalOcean + Kamal or Coolify |
| Cost | About zero when idle, steep at scale | Cheapest per request, tight CPU | Per instance, in steps | Cheapest for steady load, paid in ops hours |
| Long jobs, sockets | Capped; use managed realtime | Offload; use platform primitives | Native | Native |
| Sync engine | A hosted sync service only | A hosted sync service only | Self-host the sync server beside Postgres | Self-host; you run it |
| Pick when | Web-first, spiky traffic, tiny team | Latency-critical light reads | Complex product: workers, sockets, sync, mobile | Steady load, cost-sensitive |

> **Rule:** For a complex product with mobile clients, the least-regret default is managed containers, managed Postgres in the same region, a durable job runner, and the marketing site on serverless. Deviate only with a written reason and a "revisit when" condition, both in DECISIONS.md.

### The UX contract picks the data architecture

Product first means the UX contract chooses the data layer, not habit. Request/response (tRPC or OpenAPI over Postgres, plus a queue) is the right default until the contract asks for instant changes with undo, offline writes, state that survives a reload and no spinners. Most of the P5 state rules ask for exactly that. With request/response, each of those properties is hand-built for every mutation (any action that changes data): a cache write, a rollback, an offline queue, conflict handling. That is where "complex inside" quietly turns into "buggy outside".

A sync engine solves this differently. It keeps a live local copy of the data on each client and syncs it with the server in the background, so reads and writes feel instant and work offline.

> **Rule:** If the UX contract needs offline writes, multiplayer, or instant mutations on more than half of the core-journey actions, spike a sync architecture in P2 before choosing the API style.

| Family | Candidates | Fits |
|---|---|---|
| Sync engine over Postgres | Zero, ElectricSQL, PowerSync | You keep Postgres and SQL; clients query a local, reactive copy |
| Reactive hosted backend | Convex, InstantDB | Small team, realtime by default, and you accept the platform |
| CRDTs for shared documents | Yjs, Automerge | Collaborative text, canvases, anything merged edit by edit; a CRDT is a data type that merges edits from many people without conflicts |

Compare the winner against request/response on the same core journey:

- Code per optimistic mutation (an update shown before the server confirms it)
- Conflict rules: what happens when two people change the same thing
- The authorization model: sync rules or query permissions versus endpoint checks, and how you test each
- The mobile offline story
- Lock-in: can your data and queries leave

Record the result as a numbered decision (D-###) in `.offthemode/DECISIONS.md`. The rest of P4 (contract, authorization, parity) applies to whichever one wins.

### Data model, then contract

The schema comes first in P4, and its nouns become P5's navigation. An invariant is a rule the data must always obey, such as "one active subscription per account". Enforce each one at the lowest layer that can hold it. Use UUIDv7 or ULID IDs (unique and sortable by time), UTC `timestamptz`, money as integer minor units (cents) plus a currency, and forward-only migrations: expand, backfill, contract. Never edit a migration that has already run; write a new one.

> **Why:** AIs write check-then-insert in app code because tutorials do, and under concurrency it races: two requests can both pass the check. A unique or `CHECK` constraint can't race. Give that reason and your AI applies it to invariants you never listed.

> **Trap:** Tables generated from UI mocks are screen-shaped and break the moment a second screen needs the same data. Model the domain, then shape view models per screen.

```prompt title="Data Model With Invariants"
Read .offthemode/PRODUCT.md, .offthemode/SKELETON.md, .offthemode/GLOSSARY.md and .offthemode/ROUTES.md. No application code yet: show me the design and wait for my go.
Design the data model for {{?PRODUCT_NAME}} as someone who has run {{DATABASE}} at maintainer level. Reason from the engine's real behavior (constraints, locking, index structures, isolation), not ORM tutorials.
1. Entities named as the user names them (the Terms in GLOSSARY.md, definitions from SKELETON.md §Domain model): who can see or change each, and its lifecycle states.
2. Relationships: cardinality and deletion semantics (cascade, restrict, soft-delete, archive), each justified.
3. Invariants in plain language, each with WHERE it is enforced (a DB constraint first, then a transaction with a lock, then policy code) and why, if not in the DB.
4. Schema in {{ORM_OR_SQL}}: {{ID_STRATEGY}} IDs, timestamptz in UTC, integer money plus currency, explicit NOT NULL, an index for each query implied by ROUTES.md, a comment on each table naming its invariants. If a sync engine was chosen, put the sync rules or permissions next to each table.
5. A forward-only migration plan. The five hottest queries, the index serving each, and the expected rows scanned.
Seed data comes from the Build the Seed prompt. List open questions instead of guessing ownership or deletion semantics. Write any doubt as "I think X, because Y" and confirm it before building on it.
```

| Contract style | Best when | Trap |
|---|---|---|
| OpenAPI (generated) | Native mobile, public API | Hand-edited specs drift; generate one side from the other |
| tRPC | TypeScript monorepo, web + React Native | Old mobile builds break on renamed procedures |
| GraphQL | Many screens composing overlapping data | N+1 queries (one query per item instead of one for the list), per-field authorization, hard caching |
| Server actions | Web-only mutations | Still public endpoints; authorize each one |
| Sync engine / reactive backend | Offline, multiplayer, mostly-instant mutations | Authorization moves into sync rules or queries; test them like endpoints |

Use one schema library for types, validation and forms (Zod, Valibot or ArkType on TypeScript; Codable, kotlinx.serialization or freezed on native). Parse at every boundary: HTTP, webhooks, queue messages, env, vendor responses.

Errors go out as RFC 9457 problem+json (a standard JSON error shape) with a stable `code` from a catalog. The UI maps each code to copy, and those become P5's error states.

Any mutation that charges, sends or calls a vendor takes an `Idempotency-Key`: a unique key generated once per user intent, so a retry or a double tap can't charge twice. The server stores the key, a hash of the request and the response, and replays the stored response on a duplicate.

Paginate with cursors. Old mobile builds stay live for months, so contract changes are additive only, with a minimum-version check.

> **Pro move:** Generate a mock server from the contract on day one. P5's clickable skeleton builds against it while P4 implements the handlers, so the two phases run in parallel.

```prompt title="Contract-First API"
From {{SCHEMA_PATH}} and .offthemode/ROUTES.md, define the API contract before any handler exists. Style {{CONTRACT_STYLE}}; clients {{CLIENTS}}.
Per operation: authentication; the authorization rule (matrix in .offthemode/SECURITY.md); input and output schemas in {{SCHEMA_LIB}}; catalog error codes (problem+json, never ad-hoc strings); idempotency (natural, or Idempotency-Key with storage and replay); cursor pagination and filter/sort params matching the URL state in ROUTES.md; rate-limit bucket; cache semantics; compatibility (additive only, or a versioning plan).
Show me the contract and wait for my go. Then generate a typed client and a mock server the frontend can use now, and write contract tests (malformed -> 400 problem, no auth -> 401, wrong actor -> 403, success -> the documented shape). Flag screens that need more than one round-trip and propose screen-shaped endpoints. Responses are view models, never raw rows.
```

### The backbone

| Concern | Default | Non-negotiable |
|---|---|---|
| Jobs | Anything slow or touching a vendor: Inngest, Trigger.dev, Temporal, pg-boss, Graphile Worker or BullMQ | Safe to run twice, backoff with jitter (retries spaced out, with a random offset so they don't all land at once), a dead-letter queue (where jobs that keep failing are parked for a person to look at), visible queue depth |
| Caching | CDN caching for public reads; an app cache only after measuring | A named invalidation trigger for each cached value |
| Files | S3-compatible storage, presigned direct uploads | Bytes never pass through your API; type and size checked on the server |
| Realtime | Only if the moment of value needs it: SSE (server-sent events) for push, WebSockets for two-way, a sync engine when the contract says so | Reconnect with resume; visible connection state |
| Auth | Web: httpOnly Secure SameSite cookies. Mobile: a short-lived access token plus a rotating refresh token in Keychain/Keystore | No tokens in localStorage or URLs |
| Authorization | One `can(actor, action, resource)` module plus Postgres row-level security, where the database itself returns only the rows the caller may see (or the sync engine's rules) | Never inferred from hidden buttons |
| Rate limits | Per user and per IP at the edge; strict on auth, search and expensive routes | 429 with `Retry-After` |

Row-level security (RLS) means Postgres itself checks, row by row, whether the current user may read or write. It backs up the `can()` module when app code slips.

### Parity, hosting, observability

Environments differ in config values, never in code paths. In practice:

- [ ] Compose or a devcontainer that mirrors prod's major versions
- [ ] Secrets in a manager (1Password CLI, Doppler, Infisical, or the platform's store), with secret scanning (gitleaks) in the pre-commit hook and in CI
- [ ] A preview database per pull request (Neon and Supabase both branch databases)
- [ ] Infrastructure as code (Terraform/OpenTofu, Pulumi, SST) for whatever the platform config doesn't cover
- [ ] Structured JSON logs with `requestId`, `traceId`, route and `durationMs`, and never personal data
- [ ] OpenTelemetry over OTLP for traces and metrics
- [ ] Health split into `/healthz` (the process is alive) and `/readyz` (it can serve traffic), with uptime checks and a synthetic core-journey run (a script that walks the core journey on a schedule) pointed at them
- [ ] Budget alerts on every provider
- [ ] Point-in-time recovery (PITR) with restore drills on a schedule

Until you've restored a backup, you don't know it works.

```file path=".env.example"
APP_ENV=local                     # local | preview | production. Copy to .env.local; keep in sync with the env check
APP_URL=http://localhost:3000
DATABASE_URL=postgres://app:app@localhost:5432/{{PROJECT_SLUG}}_dev
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000 # local emulator; unset in prod
S3_BUCKET={{PROJECT_SLUG}}-local
AUTH_SECRET=                      # openssl rand -base64 32
LOG_LEVEL=debug
OTEL_EXPORTER_OTLP_ENDPOINT=
{{PUBLIC_PREFIX}}API_URL=http://localhost:3000/api   # client-exposed: NEXT_PUBLIC_ / VITE_ / EXPO_PUBLIC_
```

Every entrypoint validates the environment at boot and fails with key names, never values. The rule works in any stack. Here is a TypeScript version with Zod 4; your AI writes the same check for your stack and lists its command in RULES.md §Commands.

```file path="src/env.ts"
// Imported first by every entrypoint (server, worker, scripts). Zod 4.
import { z } from "zod";

const Env = z.object({
  APP_ENV: z.enum(["local", "preview", "production"]),
  APP_URL: z.url(),
  DATABASE_URL: z.string().startsWith("postgres"),
  REDIS_URL: z.string().startsWith("redis"),
  S3_ENDPOINT: z.url().optional(),
  S3_BUCKET: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  throw new Error(`Invalid environment, check: ${keys}`); // keys only, never values
}
export const env = parsed.data;
```

```prompt title="Prod-Parity Setup"
Goal: moving {{?PRODUCT_NAME}} from local to {{?DEPLOY_TARGET}} is a non-event; environments differ in config values only. Show me the plan and wait for my go before changing anything.
1. A one-command local stack ({{COMPOSE_OR_DEVCONTAINER}}) with prod's major versions of {{DATABASE}}, {{QUEUE_OR_CACHE}}, the sync server if any, and S3-compatible storage. No SQLite for dev, no in-memory stand-ins for anything durable in prod.
2. Boot-time env validation ({{?ENV_CHECK_CMD}}) that fails with key names only; server and client vars split by the framework prefix; .env.example kept in sync; secrets from {{SECRETS_MANAGER}}; secret scanning in pre-commit and CI.
3. CI: typecheck, lint, unit and contract tests, migrations on an empty DB, seed; block the merge on failure. Migrations run as a release step before new code serves traffic.
4. A preview environment per pull request with its own seeded database; infrastructure as code ({{IAC_TOOL}}) for anything outside the platform config.
5. A parity table in .offthemode/ARCHITECTURE.md (local vs preview vs prod, per dependency). Every difference is a future bug; shrink it. Put the start, test, migrate and logs commands in .offthemode/RULES.md §Commands.
Never provision paid resources without asking.
```

```prompt title="Hosting Decision"
Choose hosting for {{?PRODUCT_NAME}} from workload facts, not popularity. Every input is a named, editable number; mark each result as estimate or measured.
Facts: clients {{CLIENTS}}; users at launch / at 12 months {{N_LAUNCH}} / {{N_12MO}}; peak RPS = DAU x sessions x requests per core journey (ROUTES.md) x peak ratio; longest job {{LONGEST_JOB}}; realtime or sync {{REALTIME_OR_SYNC}}; regions {{REGIONS}}; budget {{BUDGET}}; ops appetite {{OPS_APPETITE}}; core envelope from P2 {{?CORE_CONTRACT}}.
1. Score serverless, edge, managed containers and VPS on: monthly cost at launch, 10x and 100x (egress, storage, seats, per-call APIs {{PAID_APIS}}); cold starts on the core journey; long-running work; WebSockets and sync servers; compute-to-DB latency; lock-in; ops burden.
2. What breaks first at 10x (connections, a lock, a sequential scan, a vendor rate limit); DB size at 12 months; cost per active user and per core action.
Output: the matrix with numbers; one recommendation with its strongest reason and a "revisit when"; the escape hatch (jobs behind an interface, storage behind the S3 API) that keeps a future move under a week. Show me all of it and wait for my go; then record it as a D-### entry in .offthemode/DECISIONS.md and summarize it in .offthemode/ARCHITECTURE.md.
```

> **Pro move:** Logs give your AI context at runtime too. Give it one command that tails structured logs and recent errors, list it in RULES.md §Commands, and add a line to RULES.md: read runtime evidence before theorizing about a bug. An AI that can observe stops guessing.

```prompt title="Failure-Mode Review"
Review {{SCOPE}} as the engineer on call at 3am. For every dependency and core-journey step in .offthemode/ROUTES.md: what happens when it is slow (its slowest 1 in 100 calls, p99, ten times slower), down, returns garbage, or succeeds twice? What does the user see (no matching state in the ROUTES.md state inventory is a finding)? Which invariant is at risk? How do we find out ("a user tells us" is a finding)? How do we recover, with the exact command?
Also cover: a deploy mid-request, a migration failing halfway, 1M queued jobs, secret rotation, DB connections exhausted, duplicate or out-of-order webhooks, clock skew, a sync client offline for a week, one user hammering the most expensive endpoint.
Output: Failure | Blast radius | User sees | Detection | Recovery | Fix now / accept / later. Show me the table and wait for my go, then implement the fix-now rows, smallest first.
```

```file path=".offthemode/ARCHITECTURE.md"
ARCHITECTURE: {{PRODUCT_NAME}} · read before any backend, data or infra change; update it in the same commit. Decisions live in DECISIONS.md.

### Deploy target and data architecture
Compute {{PROVIDER_AND_MODEL}} in {{REGION}}; database {{DB_PROVIDER}}, same region {{YES_NO_WHY}}; data architecture {{REQUEST_RESPONSE_OR_SYNC_ENGINE}} (D-{{NNN}}); revisit when {{CONDITION}}.
Code runs there unchanged: no local disk writes, no in-process timers for work that must survive, no memory shared across requests. Schema changes only through new migrations; never edit an applied one. A new dependency or service updates the parity table and DECISIONS.md in the same change.
~~~mermaid
flowchart LR
  client[Web / Mobile] --> api[API or sync] --> db[(Database)]
  api --> q[[Queue]] --> worker[Worker]
  api --> store[(Object storage)]
~~~

### Invariants
| Invariant | Enforced by | Test |
|---|---|---|

### Contract, auth, limits
Style {{STYLE}} at {{PATH}} · error catalog {{PATH}} · Idempotency-Key on {{OPERATIONS}} · additive only, min app version {{VERSION}} · authn {{METHOD}} · authz {{POLICY_PATH}} · RLS or sync rules {{WHERE}} · rate buckets {{BUCKETS}}

### Parity
| Dependency | Local | Preview | Production | Difference |
|---|---|---|---|---|

### Observability, recovery, capacity
Errors {{TOOL}} · OTLP to {{BACKEND}} · /healthz, /readyz · uptime {{TOOL}} · budget alerts {{THRESHOLDS}} · logs `{{LOGS_CMD}}` · PITR {{WINDOW}} · RPO {{RPO}} (most data we can lose) / RTO {{RTO}} (longest time to recover) · last restore drill {{DATE}} ({{DURATION}}) · capacity and cost: {{FROM_HOSTING_DECISION}}
```

## P5 · Navigation & Flows

> **Output:** `.offthemode/ROUTES.md` (route map, URL state, journeys, filled state inventory, palette commands), journeys as state machines, a dev-only state switcher, tested deep links, a clickable skeleton that passes Walk Every Flow with zero blockers, and a passed Five-Person Test.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Any view a person would refresh, bookmark or share keeps its state in the URL. Back and reload return to the same place.
- A new or changed screen covers every state in the ROUTES.md state inventory (first-run, empty, loading, partial, error, offline, no permission), each with one next action.
- Every tap gets visible feedback, inside feedback_ms when RULES.md §Budgets holds it.
- Update ROUTES.md in the same change as the route.
- Open the whole guide to add a primary destination, change how the product's places connect (the information architecture), or add a core journey.
<!-- /offthemode:rules -->

Get the whole product working as a shell before the core does anything. In a complex product, this is where internal complexity either gets absorbed or leaks onto the person. Navigate by nouns, put every state in the URL, model journeys as state machines, and walk the whole product as a clickable shell before any core logic exists, built against the mock server from P4.

> **Trap:** The default IA (information architecture: the destinations and how they connect) is the SaaS average: a sidebar with Dashboard, Analytics, Projects, Settings. "Dashboard" is a smell, because it names the fact that nobody decided what goes there. Every primary destination should be a noun your person would say out loud.

Rank the entities by how often your person touches each one times its value, and promote to primary destinations only the ones at the top that the person reaches for in most sessions. Everything else is reached through a parent, search or the command palette. Verbs are actions on objects, never menu items.

If a person would refresh, bookmark or share a view, it lives in the URL: filters, sort, tabs, selection, route-backed modals. Opening an object pushes a history entry, and changing a filter replaces the current one. Back closes a modal before it leaves the page. Scroll gets restored, and focus moves to the main heading.

Every tap gets visible feedback, inside feedback_ms when RULES.md §Budgets holds it. Prefetch on intent (hover, focus, touch-start), seed detail views from the cached list item, and move fetches into route loaders so requests can't waterfall (wait on each other one after another).

```prompt title="IA From Domain Model"
Derive the IA of {{?PRODUCT_NAME}} from its domain, not a generic app layout. Inputs: {{SCHEMA_PATH}}, .offthemode/PRODUCT.md, .offthemode/GLOSSARY.md.
1. Object map: the objects the user thinks in, with content, metadata, verbs and nested objects; drop implementation-only objects.
2. Rank by frequency x value for {{?PERSON}}; at most {{MAX_PRIMARY_NAV}} become primary. Justify cuts and say where cut objects are reached.
3. Routes: collection + detail per object; per multi-field verb choose inline edit, sheet or route; stateful modals get a URL.
4. URL state per route with types and defaults; history rule (push / replace / none) per interaction.
5. Palette commands and shortcuts. Mobile: which destinations become tabs (3-5), the stack under each, a deep link per route.
Show me the object map and the ranking first and wait for my go. Then write .offthemode/ROUTES.md. Flag anywhere the IA forces the user to understand system complexity.
```

```file path=".offthemode/ROUTES.md"
ROUTES: {{PRODUCT_NAME}} · source of truth for navigation; a route change updates this file in the same commit.

### Route map
| Route | Purpose | Access | URL state (param: type = default) | History | Deep link | Back target |
|---|---|---|---|---|---|---|
| / | {{MOMENT_OF_VALUE}} surface | user | none | - | {{SCHEME}}:// | - |
| /{{object}}s | Collection (tab 1) | user | q: string; sort: recent or name = recent; cursor | replace | https://{{DOMAIN}}/{{object}}s | / |
| /{{object}}s/:id | Detail | member | tab: overview or activity = overview | push | https://{{DOMAIN}}/{{object}}s/:id | /{{object}}s |
| /{{object}}s/:id/edit | Route-backed sheet | editor | none | push; back closes | same as web | /{{object}}s/:id |

### Core journeys
J1 {{JOURNEY}}: first run to {{MOMENT_OF_VALUE}} in {{N}} interactions, inside the time to value in PRODUCT.md §Experience promises. Driven by e2e/journeys/j1.{{ext}}.
~~~mermaid
stateDiagram-v2
  [*] --> {{STATE_A}}
~~~

### State inventory
| Screen | First-run | Empty | Loading | Partial | Ideal | Error | Offline | Permission-denied |
|---|---|---|---|---|---|---|---|---|
| /{{object}}s | {{SEES + ACTION + COMPONENT, or MISSING}} | | | | | | | |

### Command palette
| Command | Kind (nav, verb, recent) | Shortcut | Scope |
|---|---|---|---|
```

Model each core journey (first run to value, the core loop, anything touching money) as a state machine: a fixed set of states, the events that move between them, and guards (the conditions a move needs). Use a state-machine library, or a reducer over a discriminated union (a type whose variants each carry a status tag), so impossible states can't exist.

```ts
type Upload =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "ready"; assetId: string }
  | { status: "failed"; code: ErrorCode; retryable: boolean };

function view(s: Upload) {
  switch (s.status) {
    // ...one case per status
    default: { const _exhaustive: never = s; return _exhaustive; }
  }
}
```

> **Why:** AI tools build the happy path, because that's what nearly every training example shows. A state union plus an exhaustive switch (a sealed class and `when` in Kotlin, an enum and `switch` in Swift) turns a forgotten state into a compile error, which is enforcement your AI can't talk its way around. "Handle errors" in prose never gives you that.

| State | Show | One primary action | Never |
|---|---|---|---|
| First-run | The single next step to value, prefilled from anything inferable | Take it | A feature tour |
| Empty | What lives here, plus a template or sample | Create or import | Illustration with no action |
| Loading | Geometry-matched skeleton after the indicator delay in RULES.md §Budgets; refetch keeps content | Keep working | Full-page spinner, blanking |
| Optimistic | The result now, rollback on failure | Undo | Optimistic payments, sends, deletes |
| Partial / Error | What loaded, plus inline retry; errors in user terms, input kept | Retry or fix | Whole-page error, lost input |
| Offline | Cached reads, queued writes with a visible count | Continue | Silent failure |
| Permission-denied | Who can grant access | Request access | "Something went wrong" |

> **Pro move:** A dev-only state switcher (`?__state=empty` or a dev toolbar) forces any screen into any state, so reviews, AI screenshots and the flow walk cover every state without staging real failures.

```prompt title="State Inventory Audit"
Audit every screen in .offthemode/ROUTES.md for missing states; a happy path alone is not a finished screen. Fill the state inventory (first-run, empty, loading, partial, ideal, error, offline, permission-denied, plus stale or over-limit where relevant): what the user sees, the one primary action, the implementing component or MISSING. Apply the state rules table; errors map from the error catalog's codes, with input preserved.
Report the missing-cell count per screen and the order you would fix them in, highest-traffic screens first. Wait for my go. Then add the dev-only state switcher, implement the missing states, and report missing-cell counts before and after.
```

On mobile, tabs hold 3-5 peer nouns, each with its own stack, and tapping the active tab again returns to the top of its stack. A cold deep link builds its back stack: open `/projects/12/tasks/9` from a notification, press back, and you land on the project, not outside the app. Spend the signature transition on exactly one move, into your key object, and cross-fade under reduced motion.

**Milestone: the clickable skeleton.** Before any core logic, every route renders at its real URL with the real shell, layout and seed data. The core then plugs into a proven shell, and IA mistakes get caught at about 5% of what they cost once the core is built. It's also the cheapest moment to put the product in front of strangers.

```prompt title="Walk Every Flow"
Walk {{?APP_URL}} with {{BROWSER_TOOL}} as a first-time user and as a power user. Collect evidence; fix nothing yet. Per route in .offthemode/ROUTES.md:
1. Open cold by URL (and by deep link on mobile): renders, correct title, focus on the main heading.
2. Click every link and primary action; record dead ends (404s, no-op buttons, placeholder links, screens with no way forward or back).
3. Back after each navigation restores place, scroll and URL state; route-backed modals close instead of leaving.
4. Change every filter, tab and sort, reload, and open the URL in a fresh context: the view must reproduce.
5. Run the core journeys keyboard-only and touch-only, at each of {{?SCREENSHOT_SIZES: screenshot_sizes in RULES.md §Budgets}}, throttled and offline. Timing comes from {{?AUDIT_CMD}} (the audit-ux journey), not from watching: one tool round-trip is slower than the feedback budget.
6. Force every state via the switcher; screenshot each.
Report Route | Check | Expected | Actual | Screenshot | Severity (blocker, friction, polish). End with the three changes that remove the most friction on the path to {{?MOMENT_OF_VALUE}}. Wait for my go.
```

```prompt title="Five-Person Test"
Write a test script for journey {{JOURNEY_ID | J1}} in .offthemode/ROUTES.md, to run on the clickable skeleton with 5 people who are neither me nor on the team.
1. Screener: who counts as {{?PERSON}} (situation, tools used today, how often they do the job), and who is out.
2. One scenario in their words, with none of our UI terms or GLOSSARY nouns, and 3 tasks, the first ending at {{?MOMENT_OF_VALUE}}.
3. What I measure: time to the moment of value, first-click correctness per task, pauses of three seconds or more (where, and what they said), and the words they use for our nouns. They think aloud; I never help beyond "what would you do?".
After I paste the notes, output: Task | Success | Time | Pause points | Their word vs the GLOSSARY term. Then the 3 changes that remove the most hesitation, each tried first as a subtraction, default or inference before any new UI, plus GLOSSARY and copy edits wherever their words differ from ours. Wait for my go before changing anything.
```

> **Rule:** The gate passes when at least 4 of 5 reach the moment of value unaided, inside the time to value in PRODUCT.md §Experience promises. Below that, make the three changes and test five new people, never the same five. Then update the evidence in PRODUCT.md: Person, Job and Moment are now observed, not hypotheses, and their rows in RISKS.md can be retired.

## Taming Complexity

> **Output:** `.offthemode/COMPLEXITY.md` (budget, verbs, disclosure map, settings ledger, audit log), a power layer for experts, and a regular cycle of audit, subtract and re-audit, run by a second, fresh AI session.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- A new capability starts where the system does it for the person (inferred, defaulted, automated) if it can, and otherwise behind the palette, a shortcut or an advanced panel. It reaches the default screen only on evidence.
- Every net-new visible control says why the system can't infer or default it.
- One primary action per surface. Hover may reveal a shortcut, never the only way to an action.
- If COMPLEXITY.md exists, keep the touched surface inside its budget.
- Open the whole guide when a surface feels crowded, when it goes over its budget, or for the regular audit.
<!-- /offthemode:rules -->

Complexity is conserved. Tesler's law says every product has some complexity that cannot be removed, only moved. What can't be removed gets carried by the system or by the person. A complex product has a lot of it, so the job is deciding who carries it: the system first, and the person only when they ask.

| Layer | What lives here | Example |
|---|---|---|
| L0 System | Inference, defaults, automation, recovery | Detect timezone and currency; infer column types on import; auto-name from content; retry syncs silently |
| L1 Default surface | The 20% of capability behind 80% of sessions, one primary action | The canvas and one "Generate" |
| L2 On intent | Depth revealed by selection, focus, expansion, long-press, repeat visits | Selecting a clip reveals trim and fade in place |
| L3 Power | Everything else, fully capable, never in the way | Palette, shortcuts, advanced panel, bulk ops, API |

> **Rule:** A new capability starts in L0 if the system can do it for the person, and in L3 otherwise. It moves toward L1 only on evidence (usage data, a Five-Person Test result, or a PRODUCT.md job that fails without it). AI tools add one button to the main screen per feature, so this has to be written down.

- **One primary action per surface** (screen, sheet, modal, panel, popover), marked `data-primary` so a script can count it. Blur test: in a heavily blurred render you can still tell what to do. In Chrome, the DevTools Protocol call `Emulation.setEmulatedVisionDeficiency` with `blurredVision` makes one.
- **A countable budget.** Score = distinct actions x1 + decisions before value x2 + mandatory inputs x3 + competing emphasis x2 + nav destinations x1, measured on the L1 state (nothing selected, no menu open). Count actions, not elements: controls group by role plus accessible name, a repeated control in a list, grid or table counts once, and content links whose name is the object's title count once as "open item". Otherwise a collection with 30 row links blows the budget on the most normal screen in the product, and your AI learns to make rows non-clickable to pass.
- **Never the only gate.** AI tools optimize the number they're given. Pair the score with the blur test and, once you have it, the Five-Person Test's first-click result.
- **Hover is a shortcut, never a door.** Hover may only reveal actions that are also reachable by selection, context menu or long-press, and the palette. Hover doesn't exist on touch and fails keyboard and screen-reader discovery. After every Subtraction Pass, re-run the core job keyboard-only and touch-only.
- **Defaults over settings.** Can it be inferred? Is there a default right for 80%? Can it be changed in context? Only if all three fail does it become a setting, logged in the settings ledger.
- **Nouns and verbs.** 5-7 core nouns in v1, and every verb behaves identically on every noun (gesture, shortcut, menu position), so learning one object teaches all of them.
- **Teach by doing.** First run is the real job on seeded data and ends at the moment of value. Empty states say what goes here, give one action that fills it, and offer an optional sample.
- **Dense but calm.** Clutter is density without hierarchy. At most four steps of the type scale per surface, two weights, grouping by spacing and alignment, never cards inside cards. Status escalates ambient, then inline, then toast, then blocking, with blocking reserved for data loss or safety.

```ts
// Playwright, L1 state: count distinct ACTIONS, not elements.
const actions = await page.evaluate(() => {
  const q = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=switch], [role=menuitem]';
  const keys = new Set<string>();
  for (const el of document.querySelectorAll<HTMLElement>(q)) {
    if (!el.checkVisibility()) continue;
    const role = el.getAttribute("role") ?? el.tagName.toLowerCase();
    const name = (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().toLowerCase();
    const inRepeat = el.closest("li, tr, [role=row], [role=listitem], [role=option], [role=gridcell]");
    keys.add(inRepeat && role === "a" ? "open-item" : `${role}:${name}`); // repeated names collapse; row links count once
  }
  return keys.size;
});
```

Minimal = subtraction + one bold choice. Subtraction alone lands on the most common answer: white page, grey text, rounded cards. The bold choice makes the product distinct, and subtraction makes the bold choice visible.

| Stunning comes from | Never from |
|---|---|
| One distinctive display face, extreme scale contrast | Gradients as filler |
| Motion that explains state: objects travel from where they were to where they go | Glass, glow and blur everywhere |
| One tactile material used consistently | Feature-card stacks, bento by default |
| A colour strategy with a reason: one scarce accent, colour-led, or photographic | Hues nobody chose |
| One signature moment with outsized care | Decoration no principle asked for: default illustrations, "New" pills, confetti on routine actions |

> **Why:** Run audits in a second, fresh AI session with no memory of building the screen, never in the session that built it. A fresh context that sees only the rendered screen, the budget and PRODUCT.md is more honest than an author with its own reasoning in context. Audit every new screen, before every user-facing merge, and weekly during P6, where clutter builds up one reasonable addition at a time.

```file path=".offthemode/COMPLEXITY.md"
COMPLEXITY: {{PRODUCT_NAME}} · read before adding any UI; budgets are limits, not suggestions.

### Budget
Score = distinct actions x1 + required decisions x2 + mandatory inputs x3 + competing emphasis x2 + visible nav destinations x1, on the L1 state. Actions group by role + accessible name; repeated items in a list count once; row links whose name is the object's title count once.
| Surface | Web | Mobile | Primary actions |
|---|---|---|---|
| Default screen | {{15}} | {{10}} | 1 |
| Detail / editor | {{20}} | {{14}} | 1 |
| Modal / sheet | {{8}} | {{6}} | 1 |
| Onboarding step | {{5}} | {{4}} | 1 |
Over budget is a bug; exceptions go in the Audit log with a reason and an expiry. The score never gates alone: pair it with the blur test and first-click results.

### Verbs (nouns from GLOSSARY.md)
| Verb | Web | Mobile | Shortcut | Applies to |
|---|---|---|---|---|
| {{delete}} | {{menu item + undo toast}} | {{swipe + undo}} | {{Backspace}} | {{all nouns}} |

### Disclosure map
| Screen | L0 inferred / automated | L1 visible | L2 trigger -> reveals (never hover alone) | L3 palette / shortcut |
|---|---|---|---|---|

### Settings ledger
| Setting | Why not inferred | Why not defaulted | Changed in context where |
|---|---|---|---|

### Audit log
| Date | Surface | Score before -> after | Cuts | Exceptions (reason, expiry) |
|---|---|---|---|---|
```

Paste the audit into a new session, not the one that built the screens.

```prompt title="Complexity Audit"
You are reviewing screens you did not build and have no memory of building. Audit rendered screens, not code; read .offthemode/PRODUCT.md and .offthemode/COMPLEXITY.md first. Screens {{ROUTES | "the core flow"}} at each of {{?SCREENSHOT_SIZES: screenshot_sizes in RULES.md §Budgets}}, each in empty, loading, error and populated states (via the state switcher), measured on the L1 state.
Per surface: (1) count, do not estimate: distinct actions (the counting rule in COMPLEXITY.md), required decisions, mandatory inputs, competing emphasis, nav destinations; show the score against budget; (2) blur test on a blurredVision render: what stands out? If it is not the primary action, or two things compete, name them; (3) elements that belong in another layer (L0/L2/L3); (4) dead ends, confirms that should be undo, settings that should be defaults, hover-only actions, decoration carrying no information.
Output one table, worst overage first: surface, score/budget, top 3 offenders with evidence. Fix nothing and recommend no moves; the Subtraction Pass chooses them. Then wait for my go before appending the scores to the Audit log in COMPLEXITY.md.
```

```prompt title="Subtraction Pass"
Bring {{SURFACE}} within budget, using the latest Complexity Audit. Every job in .offthemode/PRODUCT.md must stay completable in the same number of steps or fewer. Apply in order; stop once within budget:
1. Delete elements with no job, duplicate paths, labels restating the obvious, decoration.
2. Infer (L0): remove the control, do the work automatically, show the result with a one-step override.
3. Default: the 80% option, changeable in context.
4. Disclose (L2) on selection, focus, expansion or long-press; name the trigger. Hover never as the only path.
5. Relocate (L3) to palette, shortcut or advanced panel, still findable by search.
6. Merge controls never used independently.
Exactly one primary action survives; nothing moves to L2/L3 without a findable trigger; the signature moment is untouched; no new UI may solve a subtraction. Show element -> fate -> mechanism and wait for my go. Then implement, re-render, re-score, and re-run the core job keyboard-only and touch-only.
```

Before a screen exists, fill its Disclosure map row. Assign each capability to exactly one layer, give every L2 item its intent signal and every L3 item its palette name and shortcut, and list anything that won't fit the L1 limit as a product question to decide, not a layout problem to solve.

```prompt title="Power-User Layer"
Build the power layer for {{?PRODUCT_NAME}} without touching default surfaces. Read the verbs table and the L3 column in .offthemode/COMPLEXITY.md.
1. Command palette (Cmd/Ctrl+K on web, a search sheet on mobile): every verb x noun, plus jump-to-any-object; fuzzy match, recents first, shortcut beside each command, acts on the selection, runs inline.
2. Shortcuts: single keys for the verbs people use most, outside text fields, modifiers otherwise, a "?" overlay; no conflicts with OS, browser or assistive-tech bindings.
3. Bulk ops: shift-click ranges, Cmd/Ctrl-click, select all in view; one undo reverts the batch.
4. After a user repeats a slow path {{3}} times, show its shortcut once, inline and dismissible.
Zero additions to L1 beyond a palette hint; every command reachable without a keyboard. Show me the command list and the shortcut map first and wait for my go. When it is built, test the core job keyboard-only and report the time against the mouse path.
```

## P6 · Core Build & Iteration

> **Output:** vertical slices merged but switched off in production behind expiring flags, each closing a `.offthemode/CHECKLIST.md` item with its evidence; change requests numbered CR-### in branch names and commit messages; screenshot baselines committed with the tests in `tests/baselines/`; evals gating every change to a model-driven core; refactor checkpoints and drift checks on a cadence; `.offthemode/STATE.md` rewritten as each piece of work ends, and decisions appended to `.offthemode/DECISIONS.md`.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- One concern per change, fenced to the files the plan names. If the work needs a file outside the fence, stop and say why.
- Never visual and logic in the same change; they are checked differently.
- A bug fix starts with a failing test that reproduces the bug.
- Never edit a test to make it pass. Tests, snapshots and exemptions change only when the spec changes.
- Two failed attempts at the same fix: climb one rung of the ladder in When it keeps getting it wrong. Never a third try from the same context.
- A change to prompts, model ids, retrieval or the core contract runs the evals.
- Finish with the checks in RULES.md §Commands, and name the CHECKLIST.md item it closes; listrevisit records the mark and the evidence.
- Open the whole guide for a new vertical slice, a refactor checkpoint or a drift check.
<!-- /offthemode:rules -->

Most of the hours go here, and so does most of the rot: forty edits that each make sense alone and add up to nothing. P6 keeps every change small, fenced, verified and reversible. Because the core sits behind the P2 contract, you can iterate on it hard without routing, auth or data access moving underneath.

Build vertical slices, not horizontal layers. Layers (all tables, then all endpoints, then all screens) run nothing end to end until the very end. A slice is one capability the user can see, cut through every layer and done in one to three sessions. It usually closes one item in CHECKLIST.md. Use the Vertical Slice prompt for a new capability and the Change Request prompt for most other changes. A copy fix needs neither.

> **Rule:** Every net-new visible action in a slice answers "why can't the system infer this?". Try inferring it, then defaulting it, then disclosing it. Only then does it earn a visible control. That is how an extremely complex product stays simple outside.

> **Pro move:** A feature flag is a switch that turns a feature on or off without a deploy. Flags are debt. Give each one an owner and an expiry date in one typed flags module, with a test that fails once the expiry passes. Mobile needs a remote flag source, because a shipped app binary can't be rolled back.

```prompt title="Vertical Slice"
Vertical slice: {{SLICE_NAME}} (usually the next open item in .offthemode/CHECKLIST.md). Fence, the only files you may edit: {{FENCE}}. If I left the fence blank, propose one: the feature folder plus the files your plan names.
Plan first. Change nothing until I say go.
Resolve these from the docs and show each with its source ("PERSON <- PRODUCT.md L7"): {{?PERSON}}, {{?JOB}} and {{?MOMENT_OF_VALUE}} (PRODUCT.md); {{?PRINCIPLE}} it serves (DESIGN.md or PRODUCT.md); {{?JOURNEY_STEP}} (ROUTES.md); {{?EDGE_CASES}} (the edge seed profile); {{?FLAG_NAME}} (the flags module's naming). Ask only about what the docs don't answer. Write any doubt as "I think X, because Y" and confirm it before building on it.
Restate the slice in 5 lines: person, job, moment of value, the single primary action, the principle. Then work in this order, stopping for my review after step 2:
1. Data: migration plus seed rows covering empty, max length, unicode, a soft-deleted owner and the edge cases.
2. Contract: request/response types and error codes. Show them before implementing.
3. API: validation at the boundary; the authorization matrix enforced on the server.
4. UI: design tokens only (no new colours, sizes, radii, shadows, easings, fonts); one primary action, marked data-primary so checks can count it; everything else progressively disclosed.
5. States: every column of the ROUTES.md state inventory, copy per .offthemode/VOICE.md.
6. Tests: failing logic tests first, then one end-to-end happy path, one abuse path (wrong user, malformed input, replay), and an end-to-end test of the journey step.
7. Entry points behind the flag, off in production.
8. Verify: every check in RULES.md §Commands passes, the slice actually ran, and you looked at its screens at each of screenshot_sizes (RULES.md §Budgets). Name the CHECKLIST.md item it closes (listrevisit records the mark and the evidence) and tell me what you did.
List every new visible action and why it can't be inferred or defaulted. Touch only the fence; if you need more, stop and explain.
```

A change request (CR) is one small, fenced change with its reason attached. "Make the dashboard feel better and fix the nav" produces a 14-file diff you can neither review nor revert. Models trained to be helpful treat anything unfenced as fair game, so the fence and the must-not-change list give them negative space: the areas they must leave alone. One concern per CR, and never visual and logic together, because they verify differently. Write visual CRs in tokens: "make it breathe" becomes "section gap space-8 to space-12, measure 64ch, drop card borders". Always give the why; your AI applies it to cases you did not list.

```prompt title="Change Request"
CR-{{NNN}}: {{ONE_LINE_TITLE}}. Type: {{CR_TYPE}} (exactly one of visual, logic, copy, perf, refactor).
INTENT: {{WHAT_SHOULD_BE_DIFFERENT_FOR_THE_USER}}
WHY: {{REASON}} (a user pain, a product principle, a metric or a bug). Use this reason for cases I did not list.
SCOPE FENCE (the only files you may edit): {{ALLOWED_FILES_OR_DIRS}}
MUST NOT CHANGE: contracts {{?APIS_TYPES_ROUTES}}; behavior {{FLOWS_THAT_MUST_STAY_IDENTICAL}}; visuals outside {{SURFACE}}; the token set; dependencies; existing tests (never edit a test to make it pass).
ACCEPTANCE:
- [ ] {{OBSERVABLE_CRITERION}}
- [ ] Net visible actions on {{SURFACE}}: +0, or a reason for each one added
VERIFY: {{VERIFY_METHOD}}, for example "test X red before, green after", "screenshots at each of screenshot_sizes (RULES.md §Budgets), light and dark, diffed against tests/baselines/, {{?AUDIT_CMD}} clean", or "p95 of Y (the time 95 of 100 runs beat) inside its RULES.md §Budgets limit".
PROCESS: restate the change in 3 lines with the files you will touch; if any is outside the fence, stop. Wait for my go. Make a checkpoint commit "wip: before CR-{{NNN}}", then the smallest change that meets the criteria. Evidence, not claims. Anything you notice outside the fence becomes a proposed follow-up CR. Finish by running the checks in RULES.md §Commands, commit with "CR-{{NNN}}" in the message, and report the id, a one-line summary, the files and the commit hash. Append any decision to .offthemode/DECISIONS.md; if this ends a piece of work, rewrite .offthemode/STATE.md.
```

### Iteration loops

**Test-first for logic.** Tests written after the code describe what your AI built, so they pass by construction.

```prompt title="Test-First"
Behavior: {{BEHAVIOR}}. Rules and edge cases: {{RULES}}, including empty, huge, concurrent, offline, unauthorized.
Phase 1, tests only. First list the tests you will write in {{TEST_PATH}}, one line each (the happy path, every rule, edge case and failure mode), and wait for my go. Then write them, confirm each fails for the intended reason (an assertion, not an import error), commit "test: {{BEHAVIOR}} (red)" and stop.
Phase 2, after my go: the minimum implementation to pass. Never edit, skip, weaken or delete a phase-1 test; if one looks wrong, stop and argue. Commit "feat: {{BEHAVIOR}} (green)".
Phase 3: refactor, with the suite green after every step.
```

> **Pro move:** Make the tests read-only for your AI during phase 2. If your tool can block edits to chosen paths (Claude Code can, with a deny rule in its permission settings), block the test folder for phase 2 and lift it after. A prompt is a request; a permission is a wall.

**Screenshot-first for UI.** Capture before and after with one screenshot command, listed in RULES.md §Commands (web: a small Playwright script; iOS: `xcrun simctl io booted screenshot`; Android: `adb exec-out screencap -p`). Shoot at each of screenshot_sizes (RULES.md §Budgets), and run the UI audit. Then ask a second, fresh AI session, with no memory of building it, to judge the shots. Fix the losses it names and judge again; stop when a round flips no loss, and make the taste call yourself. Self-critique converges fast and then oscillates, trading one flaw for another. Commit baselines of the signature moment and the three most-used screens to `tests/baselines/`, and diff every visual CR against them. That catches a "just the button" edit that also moves the hero.

**Evals for a model-driven core.** An eval is a fixed set of real inputs with a scored expected result. A prompt, model or retrieval change can make outputs worse while every type, unit, end-to-end and visual check stays green. Any CR touching prompts, model ids, retrieval or the core contract runs the eval command in RULES.md §Commands, and a regression blocks the change (see Always-On · Verification Loop). Without evals, "iterate hard on the core" means iterating on vibes.

**Rot control.** Inside files a CR already touches, your AI may fix one small smell, in its own commit. Everything else becomes a follow-up CR. Refactor checkpoints are triggered by events, not the calendar: every 5 CRs, a file past max_file_lines in RULES.md §Budgets, the same fix in three places, or a slice at twice its estimate.

```prompt title="Refactor Checkpoint"
Refactor checkpoint after {{LAST_CR_ID}}; behavior must not change. Survey {{SCOPE}} and rank issues by future cost: duplicated logic, oversized files, imports crossing the boundaries in RULES.md §Code or .offthemode/ARCHITECTURE.md, dead exports, two patterns for one job, expired flags. Propose the refactors whose payoff beats their risk now, each with payoff, risk and files, and stop for my go.
One commit per approved refactor, the full suite after each, revert on red. No new dependencies, contract changes or visual changes; tests/baselines/ must still match and evals must not regress. Then update .offthemode/ARCHITECTURE.md if the structure moved, append decisions to DECISIONS.md, and rewrite STATE.md.
```

**Git is the undo button.** Your tool's undo tracks file edits, not what shell commands did to your database or dependencies. So: a checkpoint commit before every editing run, a branch per CR, and a main branch that is always green.

> **Pro move:** When a change has real alternatives, run up to three attempts side by side. A git worktree is a second working folder on the same repo, on its own branch; give each one its own port, database and env file. Give each attempt a different constraint (A led by typography, B by motion, C by removing something). The same prompt three times gives you three samples of one mode.

```bash
git worktree add ../myapp-a -b exp/cr-012-a   # repeat for -b and -c
git diff --stat main...exp/cr-012-a
git worktree remove ../myapp-b && git branch -D exp/cr-012-b
```

### When it keeps getting it wrong

> **Rule:** Two strikes, then climb one rung. Never allow a third attempt at the same fix from the same context.

| Rung | Move | Why it works |
|---|---|---|
| 1 | Paste the exact error, log, test output or screenshot | "Still broken" carries no information |
| 2 | Run the Hypotheses Before Fixes prompt | Breaks the patch-on-patch spiral |
| 3 | A minimal repro (the smallest code that shows the bug) in a test, outside the app | Removes confounders; a small context sharpens attention |
| 4 | Rewrite STATE.md naming the dead end, then start a fresh session from it | Failed attempts left in context pull the next try toward them |
| 5 | Docs for the installed version, a working example, the library source | Stubborn bugs are often version drift |
| 6 | Ask for 3 structurally different approaches before any code | The bug may be in the approach, not the line |
| 7 | Parallel attempts on separate branches, more reasoning effort, or the strongest model | Samples genuinely different solutions |
| 8 | Write the 20-line kernel yourself, or change the requirement | Some things are cheaper to solve than to specify |

```prompt title="Hypotheses Before Fixes"
Stop fixing. List 3 distinct hypotheses for {{BUG}}, each with evidence for and against and one cheap experiment (a log line, a test, a curl) that would falsify it. Run the experiments, which change no code beyond a temporary log line, and report the results with the fix you propose. Wait for my go, then fix only the confirmed cause and add a regression test.
```

**Drift.** Thirty sensible CRs later, you have a second accent colour, four button styles and a settings page nobody designed. As a long session's context gets compacted (summarized to fit), early anchors lose weight. Three habits hold the line: every session starts from RULES.md and STATE.md, every CR names the principle it serves, and a drift check runs every 5 CRs and before each release. Intentional drift gets written into PRODUCT.md or DESIGN.md with a DECISIONS.md entry. Undocumented drift is a bug.

```prompt title="Drift Check"
Drift check after {{LAST_CR_ID}}. Read-only: change nothing. Read .offthemode/PRODUCT.md and .offthemode/DESIGN.md in full; screenshot {{KEY_SURFACES}} at each of screenshot_sizes (RULES.md §Budgets), light and dark; read the code behind each. Leave DECISIONS.md and STATE.md until the end, so you judge what is there, not what was intended.
1. Product: controls that serve no principle, surfaces over budget or with 2 or more primary actions, complexity pushed onto users that the system could infer.
2. Visual: the De-Genericize checks and {{?AUDIT_CMD}} (report, don't fix); duplicate components; drift toward anything DESIGN.md bans or names as overused.
3. Signature moment: intact, fast, still the one loud thing, compared against tests/baselines/.
4. Architecture: the architecture you infer from the code, in 10 lines; where it disagrees with the boundaries in RULES.md §Code and .offthemode/ARCHITECTURE.md; whether {{CORE_MODULE}} still iterates without touching routing, auth or data access; code that looks copied from a tutorial.
Give evidence per deviation (file:line or screenshot), marked ACCIDENTAL (propose a fix CR) or POSSIBLY INTENTIONAL (propose a doc update and a DECISIONS.md entry). End with the three highest-leverage fixes and wait for my go.
```

## P7 · Security Hardening

> **Output:** `.offthemode/SECURITY.md` (pointed to from RULES.md §Safety), an authorization matrix with generated tests, row-level security or sync rules, a short list of commands your AI never runs, and the findings of Red-Team Audit, Dependency Provenance Check and Secrets Sweep, all before real users, money or data arrive.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Authorization is checked on the server (or in the sync rules) for every action: deny by default, at the object level. Hiding a button is not security.
- Validate every input at the boundary and reject unknown fields. Parameterized queries only; never build SQL, shell commands, paths or URLs from user input.
- No secret in code, logs, bundles, fixtures or commits. If you see one, stop and say so.
- Ask before adding, removing or upgrading a dependency, and check its exact name in the official docs and the registry first.
- Follow .offthemode/SECURITY.md if it exists. If it doesn't and this is the first work on login, permissions, input, uploads, secrets, payments or AI features, offer to write it (below) before the change.
- Open the whole guide to write SECURITY.md, to add a trust boundary, and for the audit before launch.
<!-- /offthemode:rules -->

Security at the end is the most expensive place to do it. Adding authorization to 40 endpoints after the fact means touching all 40. A key leaked in commit 12 lives in git history forever. And an AI with no rules will put the service key in the client, because the tutorial it is copying did. So security runs through every phase, and P7 is the attack on your own work.

| Where | Security work |
|---|---|
| P0 | RULES.md §Safety: authorization checked on the server for every action; no secret in the repo, the client bundle or the logs |
| P1 | Threat sketch; draft authorization matrix |
| The first work on login, permissions, input, uploads, secrets, payments or AI features (RULES.md §Guides opens this guide) | SECURITY.md written, with the never-run command list, and pointed to from RULES.md §Safety; your tool's permissions set |
| P4 | Secrets manager, `can()` plus row-level security (or sync rules), rate limits, backups |
| P6, every fragment | Matrix row plus deny tests, input validation at the boundary, one abuse-path test |
| P7 | Red-team, dependency provenance, secrets sweep, restore drill, mobile and LLM passes |

### Where SECURITY.md lives and how it loads

SECURITY.md sits in `.offthemode/` next to the six core files. Your AI writes it from the template below the first time work touches login, permissions, user input, uploads, secrets, payments or AI features, and shows it to you with the one line it adds to RULES.md §Safety; both are written on your go. RULES.md loads at the start of every session, so that one line is enough to make the security rules reach every session that needs them:

```text
Before any work on auth, data access, input handling, secrets, dependencies or {{SENSITIVE_PATHS}}, read .offthemode/SECURITY.md and follow it.
```

```file path=".offthemode/SECURITY.md"
SECURITY RULES: {{?PROJECT_NAME}}
These override convenience. If one blocks you, stop and say so. Never work around it.

1. Authorization is server-side (or in the sync rules), deny by default, object-level, per the matrix in {{?POLICY_MODULE}}. Client checks are UX only.
2. Schema-validate every input at the boundary. Reject unknown fields. Parameterized queries only. Never build SQL, shell commands, paths or URLs from user input.
3. Secrets never appear in code, logs, bundles, binaries, fixtures, prompts or commits. Refer to env var names. If you see a secret, stop and tell me.
4. You have no production access and must not seek it. Never read real .env files, ~/.ssh, ~/.aws or credential stores.
5. Ask before adding, removing or upgrading any dependency. Verify the exact name in the official docs and the registry first.
6. Errors fail closed and leak no internals. Log only through {{?LOGGER_MODULE}} and its field allowlist: never tokens, passwords, payment data or raw request bodies.
7. Fetch user-supplied URLs only through {{?SAFE_FETCH_MODULE}}. LLM output is untrusted input. LLM tools run with the calling user's permissions.
8. Sensitive paths {{SENSITIVE_PATHS}}: stop, summarize the security impact, wait for my review.
9. Never run these; describe what you need and ask me to run it: recursive deletes of /, ~ or $HOME; force pushes; git reset --hard to a remote; any --no-verify; drop or truncate of a table, database or schema; terraform apply or destroy; piping curl or wget into a shell; printing .env files; anything touching production URLs, keys, secrets or tokens.

Stack
- Session: {{?AUTH_PROVIDER}}, cookie HttpOnly, Secure, SameSite=Lax, __Host- prefix, rotated on login
- CSP via {{?HEADERS_MODULE}}; CORS allowlist {{ALLOWED_ORIGINS}}
- Rate limits: {{?RATE_LIMIT_MODULE}}
- Row-level security or sync rules on: {{?TABLES}}
- Uploads: {{UPLOAD_POLICY}}
- Mobile token storage: {{?SECURE_STORAGE_LIB}}

Every fragment
- [ ] Matrix row plus deny tests for the wrong role and the wrong owner
- [ ] Inputs validated, errors fail closed, one abuse-path test
- [ ] No new secrets, dependencies or sensitive-path edits without my sign-off

Threat model: {{THREAT_MODEL_LINK}}. Update it whenever a trust boundary is added.
```

### Threat model the skeleton

A threat model is a short list of who would attack the product, where, and how you will stop them. Do it at the end of P1, for any product that will hold real people's data, money or content. STRIDE is the checklist it uses: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.

```prompt title="Threat Model the Skeleton"
As a security architect, threat-model {{?PRODUCT_NAME}} from .offthemode/SKELETON.md and .offthemode/PRODUCT.md. Platforms {{web, iOS or Android}}; sensitive data {{PII, payments, health, minors or UGC}}.
1. Data flow as a mermaid diagram with every trust boundary (client to API or client to sync, API to DB, third parties, webhooks, storage, admin, jobs, LLM calls).
2. STRIDE per boundary, plausible threats only, worst first: threat, boundary, STRIDE letter, likelihood, impact, mitigation, the test that proves it, the phase that builds it.
3. The assets an attacker wants most and the cheapest path to each.
4. Decisions that are expensive to change later (tenant model, auth provider, ID format, where authorization lives), with a recommendation now.
Propose SECURITY.md changes as a diff and wait for my go before writing them.
```

### Access control: the matrix first

Broken access control is A01 in the OWASP Top 10:2025 (which replaced the 2021 list), and it now includes SSRF (server-side request forgery: tricking your server into fetching a URL for the attacker). Type checks and happy-path tests never catch it, so write the matrix before the endpoints. Deny by default, and check at the object level ("can this user edit project 8f3a", not "can members edit projects"). IDs in URLs are attacker input, and hiding things in the client is UX, not security. With a sync engine, the same matrix drives its sync rules, and the generated tests run against the rules.

| Resource | Action | {{ROLE_ANON}} | {{ROLE_MEMBER}} | {{ROLE_ADMIN}} | {{ROLE_OWNER}} | Condition |
|---|---|---|---|---|---|---|
| {{RESOURCE}} | read | no | own | org | all | Admin also sees soft-deleted |
| {{RESOURCE}} | update | no | own | org | all | Locked after {{LOCK_STATE}} |
| billing | manage | no | no | no | yes | Re-auth within 10 min |

Row-level security (RLS) makes the database itself refuse rows from another tenant, so a missed check in the API still cannot leak them. In Postgres:

```sql
alter table {{TABLE}} enable row level security;
alter table {{TABLE}} force row level security;
create policy {{TABLE}}_tenant on {{TABLE}}
  using (org_id = current_setting('app.org_id')::uuid)
  with check (org_id = current_setting('app.org_id')::uuid);
-- the API runs `set local app.org_id = ...` inside each request's transaction
```

> **Pro move:** Make the matrix a typed object in `{{?POLICY_MODULE}}`, and have it drive both the policy function and a generated test suite that tries every role x resource x action. Docs and enforcement cannot drift, because they are one object.

### The hardening checklist

- [ ] Inputs schema-validated, unknown fields rejected; parameterized queries; no SQL, shell or path built from strings; every raw-HTML sink sanitized; `javascript:` URLs rejected
- [ ] Errors fail closed with no stack traces, SQL or foreign IDs (A10:2025); CSRF blocked with SameSite plus a token or an Origin check; GET never changes data; CORS allowlist, never `*` with credentials
- [ ] Session cookie `HttpOnly; Secure; SameSite=Lax` with the `__Host-` prefix, rotated on login and privilege change; a nonce-based CSP (Content Security Policy that only runs scripts carrying a per-request random value) run as `Report-Only` for a week first
- [ ] Rate limits per IP and per account on login, signup, OTP, reset, invites, search, exports, sends and paid APIs, with a progressive delay rather than a lockout attackers can trigger on purpose
- [ ] Uploads: size cap, magic-byte check (the file's real type, not its extension), images re-encoded, random keys, private buckets, short-lived presigned URLs, a separate serving domain
- [ ] SSRF: one fetch function for user URLs that allowlists schemes, resolves DNS, blocks private, loopback, link-local and metadata (169.254.169.254) ranges, and re-checks every redirect
- [ ] Logs use a field allowlist; auth failures alert; backups encrypted, copied outside the primary account, and actually restored once

```http
Content-Security-Policy: default-src 'self'; script-src 'nonce-{{NONCE}}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Dependencies and slopsquatting

Supply chain failures are A03:2025, and AI coding adds a new way in. Models invent plausible package names, attackers register those names with malware inside, and an AI that installs one runs the install script on your machine. This is slopsquatting. Commit the lockfile, install exactly from it in CI (`npm ci`, `pnpm install --frozen-lockfile`, or your stack's equivalent), turn install scripts off by default, and vet every new dependency.

```prompt title="Dependency Provenance Check"
Verify before installing: {{PACKAGE_LIST}}, or every dependency added since {{GIT_REF}} (diff the manifest and the lockfile). Query the registry directly ({{npm view <pkg>, PyPI JSON API, pub.dev, Maven Central or Swift Package Index}}). Per package:
1. Does the exact name match the library's official install docs (link)? Flag typos, hyphen and underscore swaps, wrong scopes, "-js" or "-official" suffixes.
2. First-publish and latest-release dates (flag under 90 days or a recent maintainer change); downloads and dependents against expected popularity; a repo link that resolves and matches.
3. Install scripts and what they run; new transitive dependencies, size, advisories.
4. Could the platform or an existing dependency do this in under 50 lines?
Verdict per package: INSTALL, INSTALL PINNED or REJECT, with a reason. Install nothing until I approve.
```

### Mobile and LLM features

- [ ] Tokens in Keychain or Keystore through {{?SECURE_STORAGE_LIB}}, never AsyncStorage, SharedPreferences or UserDefaults. The app bundle is public, so ship only keys restricted by bundle ID
- [ ] Verified Universal Links and App Links instead of custom URL schemes; link parameters are untrusted; OAuth in a system browser session with PKCE, never an embedded webview; pin certificates only with a backup pin and a kill switch; audit against OWASP MASVS
- [ ] LLM features (OWASP Top 10 for LLM Applications): any text the model reads can carry instructions, and the system prompt is not a boundary. The model acts with the calling user's permissions, and send, pay, delete and share need confirmation outside the model
- [ ] Model output is untrusted: render it as text or sanitized markdown, never auto-load URLs built from it (they can carry data out), never pass it to eval, SQL, a shell or a path. Retrieval obeys the matrix. Per-user token budgets and a kill switch per feature; injection cases live in the eval set

### Your AI's own access

Treat your AI like a fast, confident junior developer with full access to your laptop. Keep production credentials off the dev machine (deploy keys live in CI only), require your review on {{SENSITIVE_PATHS}}, and set your tool's permissions to allow the routine, ask for the risky, and deny the catastrophic. Rule 9 in SECURITY.md is the deny list in plain words, so it works in any tool.

A fresh AI session reviewing each branch's diff for security, with no memory of building it, is the floor. Red-Team Audit is the ceiling.

> **Pro move:** If your tool supports hooks or command allow and deny lists (Claude Code, Cursor and others do), you can enforce rule 9 automatically before every shell command. Match production secret names with word boundaries and an underscore (`prod_..._key`, `production_..._token`), or the check blocks harmless commands like `grep -rn productKey` or `echo $PRODUCT_URL`. Claude Code also has a built-in `/security-review` for the per-branch floor.

> **Trap:** Deny lists and command checks are guardrails, not a sandbox. They catch accidents, and a creative command can route around a pattern. Isolation catches the rest: no production credentials on the machine, and a container for untrusted work.

### The P7 audit

Run these three before launch, each in a fresh session. Each reports first and changes nothing until you say go.

```prompt title="Red-Team Audit"
You are an attacker, not a reviewer. Goal: {{GOAL: read another tenant's data, gain admin, use paid features free, run code on the server, or bill us for your LLM usage}} in {{?PRODUCT_NAME}}, starting from a normal {{ROLE_MEMBER}} account with insider read access to {{SCOPE}}. Test only against {{LOCAL_URL}}; never send a request to any other host.
Per area, report what you tried, the evidence (file:line, or request and response), and whether it worked:
- A01 access control: IDOR (changing an ID to reach someone else's object) on every ID-taking route, mass assignment of role or owner, privilege escalation, untested matrix rows or sync rules, SSRF. A02 misconfiguration: headers, CSP, CORS, debug modes, verbose errors, public buckets.
- A03 supply chain: unpinned, abandoned or suspicious packages, install scripts. A04 crypto: plaintext secrets, weak hashing, non-expiring tokens.
- A05 injection: SQL, NoSQL, command, template, XSS (stored, reflected, DOM), rendered user markdown. A06 insecure design: negative quantities, races on redeem or transfer, replayed webhooks, skipped flow steps.
- A07 authentication: brute force, reset-token reuse, session fixation, logout that does not invalidate, missing OAuth state or PKCE. A08 integrity: unsigned webhooks, client-trusted prices or flags, unsafe deserialization.
- A09 logging: would we notice this attack; do secrets or PII reach logs? A10: what fails open on timeouts, nulls or vendor outages?
- Mobile if present (MASVS storage, network, deep links, bundle secrets); LLM if present (direct and indirect injection, tool over-permission, output rendering, unbounded consumption).
Output findings by severity with exploit steps, impact, fix and a regression test, then the three fixes that remove the most risk per hour. Fix nothing yet.
```

```prompt title="Secrets Sweep"
Sweep for secrets. Report only, and never print a full value (first 4 characters and the location).
1. Working tree (tracked and untracked, skipping dependency and build folders) for keys, tokens, private keys, connection strings, JWTs, webhook secrets and high-entropy strings; use {{SECRET_SCANNER}} if installed.
2. Full git history on every branch: a secret that was later deleted has still leaked.
3. Outputs of {{?WEB_BUILD_CMD}} and {{?MOBILE_BUILD_CMD}} (from RULES.md §Commands): bundles and binaries; every variable exposed through {{?PUBLIC_ENV_PREFIX}}, with the reason.
4. .env.example has dummy values only; .gitignore covers env files, keystores, provisioning profiles and service-account JSON; fixtures, snapshots, sample logs and CI output are clean.
Per hit: location, type, whether it looks live (judge by format and context; never call the service), fix. Anything live: rotate, then remove, then purge history. Rotation is the fix; deletion alone is not.
```

> **Rule:** Record each accepted finding and its fix in DECISIONS.md, keep its regression test in the suite, and add a line to SECURITY.md if the same mistake could happen again.

## P8 · Ship & Operate

> **Output:** a passed launch checklist, first-contact surfaces built as demos, `.offthemode/RUNBOOK.md` (rollback, flag kill, secret rotation, restore), three paging alerts, a weekly signal review, and a project retro that updates RULES.md and DECISIONS.md.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Every release can be rolled back, and a risky feature ships behind a flag that can switch it off without a deploy.
- Migrations add the new shape, move to it, then remove the old one, so a rollback never needs a down-migration.
- Follow RUNBOOK.md if it exists, and update it in the same change when a step in it changes.
- A first-contact page (landing, store listing, link preview) is held to the same RULES.md §Look and feel and §Budgets as product screens.
- Open the whole guide before a first launch, to set up monitoring and alerts, or for the project retro.
<!-- /offthemode:rules -->

Hosting happened in P4. Shipping means strangers can find the product, trust it and use it legally, and you learn it is broken before they tell you.

### First contact

The landing page is where the most common AI output (a hero plus three cards) is strongest, and an extremely complex product is the hardest thing to explain in one screen. Do not describe the product; run it. The page is a guided run of the moment of value on the demo seed, held to the same bar as product screens: RULES.md §Look and feel, §Budgets, and a review by a second, fresh AI session. The store listing and link previews follow the same rule, because for many people they are the first screen.

```prompt title="Landing as Demo"
Build the first-contact page for {{?PRODUCT_NAME}} as a guided run of {{?MOMENT_OF_VALUE}} on the demo seed.
Structure: a one-sentence thesis in {{?PERSON}}'s own nouns (.offthemode/PRODUCT.md, .offthemode/GLOSSARY.md); the product doing the job (interactive, or recorded from the real app, never a mock or an illustration of UI); one proof (a number, a customer, or something the product made); one action.
Rules: every section is either an interaction or a real output; no section describes a feature it does not show; no pricing grid or FAQ unless a PRODUCT.md job needs one on this page; the same RULES.md §Look and feel and §Budgets numbers, the same audits and the same fresh-session review as product screens.
Also: store screenshots captured from the real app on the demo seed, in moment-of-value order; per-route Open Graph images generated from the design tokens and real data.
Before building, list the sections and what each one shows, and wait for my go.
```

### The launch checklist

- [ ] Per-route title and meta in the product's voice (never "Home | X"); canonical URLs, `robots.txt`, a `sitemap.xml` generated from .offthemode/ROUTES.md, `noindex` on previews; Open Graph images generated per page from tokens, because the link preview is often the first impression
- [ ] Privacy policy generated from what your tracking plan and the schema actually collect, then reviewed by a lawyer (this is not legal advice); terms; working account deletion and export; consent only for non-essential trackers, with reject as prominent as accept and Global Privacy Control honored; GDPR and CCPA/CPRA where your users are
- [ ] India's DPDP Act 2023 if you serve Indian users. The Rules were notified in November 2025, with most obligations applying from May 2027: a per-purpose plain-language notice, affirmative consent, withdrawal as easy as giving it, a grievance contact, breach notification, verifiable parental consent for under-18s, and erasure once the purpose is served
- [ ] SPF, DKIM and DMARC for transactional email; designed 404, 500, offline and maintenance states; a status page hosted apart from the app
- [ ] CI runs the full check command from RULES.md §Commands, the audits and the evals, with a preview deploy per pull request; trunk-based development with feature flags behind one wrapper (OpenFeature is the vendor-neutral standard); staged rollout (internal, {{STAGE_1_PCT}}%, 25%, 100%) with automatic rollback on error spikes or a falling north-star metric; expand-and-contract migrations (add the new shape, move to it, then remove the old), so a rollback never needs a down-migration
- [ ] Errors reported with source maps or dSYMs, tagged by release; synthetic checks (scripted visits every few minutes) on sign-in and the moment of value; real-user monitoring against RULES.md §Budgets (INP, Interaction to Next Paint, only exists in the field); only three pages (site down, error spike, north star near zero), with everything else in a daily digest, because when one person is on call, alert fatigue does more damage than incidents

```prompt title="Release Readiness"
Audit {{?PRODUCT_NAME}} against the P8 launch checklist: each item PASS with evidence (file, URL, screenshot), FAIL with the fix, or N/A with the reason. Then operability: can I roll back in under 5 minutes, disable {{CORE_FEATURE}} by flag, rotate every secret, and restore yesterday's backup? Name the three scenarios most likely to page me in week one and the alert that catches each.
Report first. After my go, write .offthemode/RUNBOOK.md with the exact steps for rollback, flag kill, secret rotation and restore.
```

### After launch

Once a week, look at where people stall before the moment of value, and treat each stall as complexity leaking onto the user.

```prompt title="Weekly Signal Review"
Inputs: {{METRICS_EXPORT}} (aggregated funnel, activation, time to value, retention), the top 10 errors, the eval pass-rate trend if the core is model-driven, {{FEEDBACK_EXPORT}} (PII removed).
1. Where do users stall before {{?MOMENT_OF_VALUE_EVENT}}? Quantify each drop.
2. Per stall: the complexity leaking onto the user, and the default, inference or removal that would absorb it.
3. Three hypotheses ranked by activation impact, each with the smallest experiment, its flag and the deciding metric.
Suggest adding UI only if removing something cannot solve it.
```

### The project retro

A retro turns what the project taught into standing rules, so the same mistake is not made twice. Everything it changes stays in this project's `.offthemode/` folder: repeated corrections become new lines in RULES.md, and what was learned is recorded in DECISIONS.md.

```prompt title="Project Retro"
Project retro for {{?PRODUCT_NAME}}. Read .offthemode/DECISIONS.md, STATE.md, CHECKLIST.md, RULES.md and PRODUCT.md, any extra documents in .offthemode/ (DESIGN.md, VOICE.md and others), the git history, and the prompts we reused. Propose each change as a diff I approve one by one:
1. Add: corrections I had to make more than once, as exact new lines in the right RULES.md section, each with its why.
2. Delete: RULES.md lines that never applied, were wrong, or conflict with another line.
3. Upgrade: reused prompts that failed, as revised text, each tied to the failure it would have prevented.
4. Extract: work done 3 or more times by hand that should become a script (listed in RULES.md §Commands) or a saved prompt.
5. Taste: from the best and worst screens, what to keep and what to avoid, as lines for PRODUCT.md §Feeling and .offthemode/DESIGN.md; flag any pattern we used that has since become common in templates.
6. Estimates: planned against actual per phase, and the root cause of the biggest miss, as a DECISIONS.md entry.
7. One product lesson per phase that the vision questions should cover next time, and whether my approvals at the checkpoints changed a decision, as a DECISIONS.md entry.
Change nothing until I approve each diff. When done, rewrite STATE.md to say where things stand.
```

> **Pro move:** Starting a new project? After setup, copy the RULES.md lines from this retro that are true of every project you build (not just this one) into the new project's RULES.md. The standards travel with you, and each project still holds its own complete set.

## Always-On · Verification Loop

> **Output:** every check named once in `.offthemode/RULES.md` §Commands (fast check, full check, one-file lint, audit, screenshots, evals), `scripts/audit-ux.ts` with a journey file per core journey, an `evals/` set for a model-driven core, and an end-of-change report in which every claim has evidence.

This is the biggest lever in the method. A model is far better at fixing an error it can read than at avoiding one it was warned about in the abstract. Give your AI signals, make it read them, and don't let it call anything done while they fail. RULES.md §Done means verified sets that standard; this guide supplies the checks behind it.

> **Why:** Without checks, your AI grades its own homework on how plausible the result looks. With checks, the job becomes "turn these signals green", which is objective and cheap to rerun. Every property you can turn into an assertion is one less thing a model has to judge.

### The layers

| Layer | Web | Mobile | Runs |
|---|---|---|---|
| Types, lint | `tsc --noEmit` in strict mode, ESLint or Biome | SwiftLint, ktlint, `dart analyze` | After every edit |
| Unit | Vitest or Jest | XCTest, JUnit, `flutter test` | In the fast check, before anything is called done |
| End-to-end, accessibility | Playwright with `@axe-core/playwright` | Maestro or Detox; the platform's accessibility inspector | Per feature, and in CI |
| Computed-style audit | A script that reads each element's final styles and checks tokens, contrast, baseline grid and target sizes | Snapshot tests plus a token lint | Per UI change, and in CI |
| UX assertions | `scripts/audit-ux.ts`: feedback time, one primary action, thumb zone, motion | Maestro flows with timing; the profiler | Per journey change, and in CI |
| Visual | `toHaveScreenshot()` plus screenshots your AI opens and looks at | Simulator screenshots | Per UI change |
| Evals | The eval runner, for a model-driven core | Same | When prompts, model, retrieval or the core contract change |
| Speed | Lighthouse CI, for the speed keys the product holds | Cold start and frame timing on a low-end device | In CI |

End-to-end tests drive the real app the way a person would. CI (continuous integration) is the set of checks your repository runs on every push. Lighthouse is Google's speed and accessibility audit.

### Name every check in RULES.md §Commands

Your AI runs what RULES.md names, so give each check one name and one exact command there. Everything else, including the prompts below, refers to it by that name. The numbers the checks compare against live in RULES.md §Budgets (see Accessibility & Performance Budgets); a check whose key isn't there is skipped.

| Name | What it runs | When |
|---|---|---|
| Fast check | Types, lint, unit tests | After every change, and before anything is called done |
| Full check | The fast check plus end-to-end and accessibility tests | Before a feature counts as finished |
| One-file lint | The project's own linter on one file: `npx biome check --write` or `npx eslint --fix`, `swiftlint lint --quiet`, `ktlint`, `dart analyze` | After each edit |
| Audit | The computed-style audit and `scripts/audit-ux.ts` | Per UI or journey change |
| Screenshots | Every touched surface at each of screenshot_sizes in RULES.md §Budgets, light and dark | Per UI change |
| Evals | The eval runner | When the core changes |

Use the linter the project already has. A Biome project should never fail every edit on a hard-coded ESLint call.

### UX assertions

The journey file drives one core journey from `.offthemode/ROUTES.md` and calls `surface()` on every screen it reaches. The script turns the experience promises into failures. The one-primary-action and motion checks always run; each numeric check runs only when its key is in RULES.md §Budgets:

- The slowest interaction must stay under `feedback_ms`, measured with the CPU slowed four times so a fast laptop behaves like a mid-range phone.
- Each screen has exactly one visible primary action (the element marked `data-primary`). Its centre sits inside the thumb zone, the bottom share of the phone screen a thumb reaches easily (`thumb_zone_pct`), and, when the tokens define `--touch-min`, it is at least that size.
- For each motion probe, only transform, opacity and clip properties animate, each duration stays within its motion token, and an animation interrupted halfway continues from where it was instead of snapping back to rest.

The numbers come from the json block in RULES.md §Budgets and from the tokens on the page, so the script never keeps its own copy.

```file path="scripts/audit-ux.ts"
// Web (TypeScript + Playwright). Run: npx tsx scripts/audit-ux.ts e2e/journeys/j1.ts   (PHONE=390x844, default the first of screenshot_sizes; BASE_URL=http://localhost:3000)
// Numbers come from the json block under .offthemode/RULES.md §Budgets and from tokens on the page; a key or token that is not there skips its check. Exits 1 on any failure.
import { chromium, type Page } from "playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
type Probe = { name: string; target: string; signature?: boolean; trigger: (p: Page) => Promise<void>; reverse?: (p: Page) => Promise<void> };
function budgets(): Record<string, any> {   // only the keys this product holds; a missing key skips its check
  const md = readFileSync(".offthemode/RULES.md", "utf8");
  const at = md.search(/^#+ .*Budgets/m);
  const section = at < 0 ? "" : md.slice(at).split(/\n##? /)[0];   // §Budgets only, up to the next section
  const m = section.match(/[~`]{3}json\r?\n([\s\S]*?)\r?\n[~`]{3}/);
  if (!m) { console.warn("No json block under RULES.md §Budgets: numeric checks skipped"); return {}; }
  if (/\{\{/.test(m[1])) throw new Error("RULES.md §Budgets still has blanks to fill");
  return JSON.parse(m[1]);
}
const B = budgets();
const has = (k: string) => typeof B[k] === "number";
const { journey, motionProbes = [] } = await import(pathToFileURL(resolve(process.argv[2])).href);
const [width, height] = (process.env.PHONE ?? B.screenshot_sizes?.[0] ?? "390x844").split("x").map(Number);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, baseURL: process.env.BASE_URL ?? "http://localhost:3000" });
await ctx.addInitScript(() => {
  (window as any).__ev = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) (window as any).__ev.push(e.duration); })
    .observe({ type: "event", durationThreshold: 16, buffered: true } as PerformanceObserverInit);
});
const page = await ctx.newPage();
await (await ctx.newCDPSession(page)).send("Emulation.setCPUThrottlingRate", { rate: 4 });
const fails: string[] = []; let worst = 0;
async function surface(label: string) {   // call on every surface, and before any full-page navigation
  const s = await page.evaluate(() => {
    const ev: number[] = (window as any).__ev ?? []; (window as any).__ev = [];
    const p = [...document.querySelectorAll<HTMLElement>("[data-primary]")].filter((e) => e.checkVisibility());
    const r = p[0]?.getBoundingClientRect();
    const touch = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--touch-min")) || 0;
    return { ev, n: p.length, exempt: p[0]?.dataset.primary === "exempt", cy: r ? r.top + r.height / 2 : 0, min: r ? Math.min(r.width, r.height) : 0, vh: innerHeight, touch };
  });
  worst = Math.max(worst, ...s.ev);
  if (s.n !== 1) fails.push(`${label}: ${s.n} visible [data-primary], expected 1`);
  else if (!s.exempt && has("thumb_zone_pct") && s.cy < s.vh * (1 - B.thumb_zone_pct / 100)) fails.push(`${label}: primary action outside the thumb zone`);
  else if (s.touch && s.min < s.touch) fails.push(`${label}: primary action smaller than --touch-min`);
}
await journey(page, surface);
if (has("feedback_ms") && worst > B.feedback_ms) fails.push(`slowest interaction took ${worst} ms under 4x CPU throttle`);
const OK = ["transform", "opacity", "clip-path", "clipPath", "translate", "scale", "rotate"];
for (const m of motionProbes as Probe[]) {
  const at = () => page.locator(m.target).evaluate((e) => getComputedStyle(e).transform);
  const rest = await at();
  await m.trigger(page);
  const anims = await page.evaluate((sig) => {
    const root = getComputedStyle(document.documentElement);
    const cap = Math.max(...(sig ? ["--spring-soft-dur"] : ["--dur-slow", "--spring-snappy-dur"]).map((t) => parseFloat(root.getPropertyValue(t))));
    return document.getAnimations().map((a) => {
      const props = a instanceof CSSTransition ? [a.transitionProperty] : (a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)).filter((k) => !["offset", "computedOffset", "easing", "composite"].includes(k));
      return { props: [...new Set(props)], dur: Number(a.effect?.getComputedTiming().duration) || 0, cap };
    });
  }, !!m.signature);
  for (const a of anims) {
    const bad = a.props.filter((p) => !OK.includes(p));
    if (bad.length) fails.push(`${m.name}: animates ${bad.join(", ")}`);
    if (a.dur > a.cap) fails.push(`${m.name}: ${a.dur} ms is longer than its motion token allows`);
  }
  const mid = await at();
  await (m.reverse ?? m.trigger)(page);   // interrupt mid-flight
  const next = await page.locator(m.target).evaluate((e) => new Promise<string>((r) => requestAnimationFrame(() => r(getComputedStyle(e).transform))));
  if (mid !== rest && next === rest) fails.push(`${m.name}: snaps back to rest instead of continuing from where it was`);
}
await browser.close();
fails.forEach((f) => console.error(f));
process.exit(fails.length ? 1 : 0);
```

One journey file serves both the end-to-end suite and the audit, so the journey is written once.

```file path="e2e/journeys/j1.ts"
// Journey J1 from .offthemode/ROUTES.md, shared by the end-to-end suite and scripts/audit-ux.ts
import type { Page } from "playwright";
export async function journey(page: Page, surface: (label: string) => Promise<void>) {
  await page.goto("/"); await page.locator("[data-ready]").first().waitFor(); await surface("first-run");
  await page.getByRole("button", { name: "{{PRIMARY_VERB_OBJECT}}" }).tap(); await surface("{{STEP_2}}");
}
export const motionProbes = [
  { name: "sheet", target: "[data-sheet]", trigger: (p: Page) => p.getByRole("button", { name: "{{OPENS_SHEET}}" }).tap(),
    reverse: (p: Page) => p.getByRole("button", { name: "{{CLOSES_SHEET}}" }).tap() },
];
```

### Evals for a model-driven core

A model-driven core is one whose main work is done by an AI model call, such as summarising, extracting or answering. A change to a prompt, the model or retrieval can make the moment of value worse while types, unit, end-to-end and visual checks all stay green. So this kind of core gets its own check, called evals.

- `evals/cases/` holds 30 to 100 real inputs. Start with the inputs from the spike that first proved the core works, plus the demo and edge seeds (see Real Data). Later, add production samples people agreed to share, with personal information removed.
- Each case checks properties, not exact strings: every cited source exists in the input, the output does not follow instructions hidden in retrieved text, it matches the output schema, and it refuses when it should.
- Graders run cheapest first. Deterministic checks come first (schema, regex, set membership, numeric tolerance), then an LLM judge, which is a second model grading against a written rubric. Before you trust the judge, grade 20 cases yourself and compare. If it agrees with you on fewer than about 16 of 20, fix the rubric, not the threshold.
- The eval runner runs in CI whenever prompts, model ids, retrieval settings or the core contract change. No merge if the pass rate drops by more than `eval_drop_points` in RULES.md §Budgets, or if p95 latency (the time 95 of 100 runs beat) or cost per run leaves the envelope recorded in `.offthemode/SKELETON.md` §Core contract.

```file path="evals/cases/{{case-id}}.json"
{
  "id": "{{case-id}}",
  "input": {{INPUT_JSON}},
  "must": ["{{PROPERTY, e.g. every cited source id exists in the input}}"],
  "must_not": ["{{PROPERTY, e.g. follows instructions embedded in retrieved text}}"],
  "graders": ["schema", "{{deterministic-check-id}}", "judge:{{rubric-id}}"],
  "source": "{{spike, seed:edge, or production-sample (consented, personal data removed)}}"
}
```

```prompt title="Build the Eval Set"
Build evals/ for {{?CORE_MODULE}} (.offthemode/SKELETON.md §Core contract). Start from the spike inputs and the demo and edge seeds. Aim for {{N | 50}} cases covering the typical input, the hardest real input, empty and huge inputs, adversarial inputs (injection in retrieved text, instructions hidden in user content), and every failure mode in the contract.
Per case: the input, the properties the output must and must not have, and the graders (deterministic first; an LLM judge only for what can't be checked mechanically, with its rubric written out).
First show me the case list and the graders, and wait for my go.
Then build the runner, reporting pass rate, failures per grader, p95 latency and cost per run; pick 20 cases for me to grade by hand and report the judge's agreement with my grades; add a CI trigger on changes to prompts, model ids, retrieval settings and the core contract. Add the eval command to .offthemode/RULES.md §Commands and the allowed drop to §Budgets, run it once, and record the baseline in SKELETON.md §Core contract.
```

### Finish every change the same way

Verification you have to remember is verification that gets skipped by week two. End every piece of work with the same prompt, and add a fresh review when the change calls for one.

```prompt title="Prove It Works"
Before you tell me this is done, prove it.
1. Run the fast check from .offthemode/RULES.md §Commands and paste the last 20 lines. If anything fails, fix it and rerun.
2. Run the audit and the screenshots on every surface you touched, at each of screenshot_sizes in RULES.md §Budgets, light and dark (or on the simulator). Open each screenshot and look at it.
3. Critique the screenshots against .offthemode/DESIGN.md: grid, type scale, spacing tokens, exactly one primary action, anything that reads as a default template. Fix, then shoot again.
4. Exercise the unhappy paths: empty, loading, error, offline, 10x content, the largest text size.
5. If prompts, model ids, retrieval settings or the core contract changed, run the evals. A drop past the gate in RULES.md §Budgets blocks.
6. Rewrite .offthemode/STATE.md and append any decision you made to .offthemode/DECISIONS.md.
7. Report: verified (with the evidence), unverified (and why), skipped. Name any CHECKLIST.md item this finishes, with its evidence.
Never write "should work". Write "verified by X" or "unverified".
```

#### A fresh review for risky changes

When the change touches the interface, a contract, a schema, sign-in, payments or more than three files, ask a second, fresh AI session to review it, one with no memory of building it. The session that built the change has already convinced itself it works; a fresh one only sees what is there.

```prompt title="Fresh-Session Change Review"
You are reviewing a change you did not write. Read .offthemode/PRODUCT.md, RULES.md and DESIGN.md, then the diff against {{BASE_REF | main}}.
- Screens: compare each new screenshot with the one from before the change, as a pair, and say which is better and why. Then judge the same pairs again with the order swapped. Count only verdicts that agree both ways.
- Contracts, schemas, sign-in, payments or wide changes: list what breaks, what was assumed without proof, and what a person could do that the code does not expect. Point to the file and line.
Report findings only, most serious first. Change nothing.
```

Models tend to favour whichever option they see first, so judging both orders cancels that bias. Bring the findings back to the building session: fix each one or rebut it with evidence. For screens, fix the losses the review names and review again; stop when a round flips no loss, then list what remains for your own taste call.

> **Pro move:** If your tool supports hooks or saved commands (Claude Code does), you can run the one-file lint automatically after every edit, run the fast check before your AI stops, and save Prove It Works as a command. This is optional; pasted, the prompts do the same job.

> **Trap:** Your AI may "fix" failing tests by weakening assertions or updating snapshots, and "fix" a failing audit by marking the element exempt. Tests, snapshots and exemptions change only when the spec changes. Each change goes into DECISIONS.md with its reason, and you review every one yourself.

## Always-On · Words & Voice

> **Output:** `.offthemode/VOICE.md`, one string catalog in the code, and a Copy Pass on every surface before it is called done.

Words are the cheapest way to look non-generic, and the place where AI output slides toward the average hardest, because the web is full of identical software copy. A list of banned words only pushes the model away from bad copy. VOICE.md also says what your voice is, with examples, and that pulls it somewhere. Its character comes from PRODUCT.md §Feeling, so the words and the look say the same thing.

Naming is product design too, which is why GLOSSARY.md is shared by the code, the interface copy and the analytics. A string catalog is one file (or one per language) that holds every user-facing string by id, so all copy can be reviewed and translated in one place.

```file path=".offthemode/VOICE.md"
VOICE: {{PRODUCT_NAME}} · character from .offthemode/PRODUCT.md §Feeling · terms from .offthemode/GLOSSARY.md
Character: {{ADJ_1}}, not {{FAILURE_1}}. {{ADJ_2}}, not {{FAILURE_2}}. {{ADJ_3}}, not {{FAILURE_3}}. (e.g. "precise, not clinical. warm, not cute. confident, not loud.") Reads like: {{REFERENCE_VOICE}}
Mechanics: sentence case; second person; "we" only when the company acts; interface copy at a grade 6 to 8 reading level; numbers, dates, currency and plurals through Intl or the platform's formatter; numbers beat adjectives; no exclamation marks; every string in {{STRINGS_PATH}}.
Banned: hype copy ({{HYPE_WORDS, e.g. seamless, effortless, unlock, supercharge, revolutionary}}), dead copy ({{DEAD_COPY, e.g. Welcome to, Get started, Click here, Oops, Something went wrong}}), plus {{PRODUCT_SPECIFIC_WORDS}}.

### Patterns
- Headlines name the outcome in the user's nouns: "Every invoice reconciled by 9am", not "Streamline your finances".
- Buttons are verb + object and predict the result: "Export 3 clips". Destructive confirms name the consequence: "Delete 12 files" / "Keep files".
- Errors: what happened, why if known, what to do next. Never blame, never clear what the person typed.
- Empty states: what this space holds and why it matters, plus one action.
- Loading: nothing for the first moment, then a line saying exactly what is happening ("Rendering 4 pages"); indicator_delay_ms and progress_copy_ms in RULES.md §Budgets set the timing when the product holds them.
```

A grade 6 to 8 reading level means text an 11 to 14 year old reads without effort; it is about speed of reading, not about talking down. Intl is the built-in formatter in JavaScript that writes numbers, dates, currency and plurals correctly for each locale; every platform has an equivalent. Using it means "1 file" and "2 files" are never glued together by hand.

```prompt title="Copy Pass"
Copy pass on {{SURFACE_OR_PATH}}. Edit only user-facing strings and the string catalog. Read .offthemode/VOICE.md (with its banned words) and .offthemode/GLOSSARY.md first.
1. Table every string: current | problem (banned word, vague verb, wrong term, too long, blames the user, a sentence a competitor could publish unchanged) | rewrite.
2. Every button predicts its result, every error has a next step, every empty state offers one action.
3. Cut 30% of the words without losing meaning. Flag concepts that have no glossary term and propose one; where notes from watching real people use the product record their own words, prefer those.
Show me the table and wait for my go. Then apply it and run the fast check from .offthemode/RULES.md §Commands.
```

## Always-On · Real Data

> **Output:** a content model, a deterministic seed with `demo`, `edge` and `scale` profiles writing to `fixtures/`, and a dev-only states gallery.

AI tools design for the happy path of their own placeholder content. Layout bugs, performance cliffs and awkward empty states only show up with realistic amounts of data and hostile edge cases, and you can't judge "stunning" on a screen full of `John Doe`.

Three terms. A content model lists each kind of record, its fields, how long each field usually runs and how often it is empty. A deterministic seed is a script that fills the app with fake but realistic data, the same data on every run, because its random generator starts from a fixed number; that is what makes screenshots comparable over time. A states gallery is a page that exists only in development and shows each main component in every state side by side.

```prompt title="Build the Seed"
Read {{CONTENT_MODEL_PATH}}. If it is missing, draft it first (entities, fields, min/typical/max length, optionality, cardinality, realistic distributions for {{MARKET}}). Show me the content model and the seed plan (profiles, files, the states route) and wait for my go.
Then build a deterministic seed (fixed random seed) at {{SEED_PATH}} with @faker-js/faker or the stack's equivalent, writing to fixtures/. Profiles by environment variable:
- demo: the product in month six with real users in {{MARKET}}; curated and believable; used for design reviews, the landing page demo and store screenshots.
- edge: every case in the torture set pasted below at least once, every lifecycle state, archived records.
- scale: {{SCALE_N | 10000}} rows of the heaviest entity, plus one power user at 100x the usual volume.
Add a dev-only states gallery at {{STATES_ROUTE}} that renders each primary component in every state (empty, one, many, overflow, loading, error, offline, permission denied), light and dark. Screenshot it and list what breaks.
```

Paste the torture set below the prompt so the `edge` profile covers all of it.

- [ ] Empty and exactly one (plurals through `Intl.PluralRules`, never by joining strings); 10k rows; a 500-option picker; a 5,000-character paste; an 80-character word with no break points; one-character names and people with a single name
- [ ] Devanagari (it needs a taller line box), Arabic and Hebrew right to left (CSS logical properties such as `margin-inline-start`, mirrored icons), Chinese, Japanese and Korean line wrapping, mixed direction in one line; emoji built from joined sequences (families, flags, skin tones) cut with `Intl.Segmenter` so they are never split in half
- [ ] 0, negative and huge numbers; Indian grouping (1,00,000) next to Western grouping (100,000); daylight-saving boundaries; a locale that differs from the time zone; missing, 1px-tall, 8000px-tall and broken media; `<script>` in names, zalgo text (letters stacked with combining marks), whitespace-only input, pasted rich text

> **Rule:** A screen isn't designed until its screenshots have been reviewed on both the `demo` and `edge` profiles.

## Always-On · Accessibility & Performance Budgets

> **Output:** the speed, interaction and accessibility numbers this product chooses to hold, as keys in `.offthemode/RULES.md` §Budgets, and `lighthouserc.cjs` and the audit scripts, which check the keys that are there and skip the rest.

Accessibility and speed are craft signals that separate an obsessed-over product from a template. "Make it fast" produces nothing; a number inside a failing check gets optimized. Off the Mode sets none of these numbers for you: which ones the product holds, and how minimal or rich it is, is your call. This guide lists the common keys with reference values. Copy a key into RULES.md §Budgets only when the product should hold it, and confirm its value first. From then on its check fails the build when the number is missed, and nothing fails over a number you didn't add.

In the EU, the European Accessibility Act has applied since 28 June 2025 to many consumer services, such as online shops, banking, e-books and transport ticketing; for those, accessibility is a legal duty.

### One owner per number

Every number has exactly one owner:

- Speed, interaction and accessibility, when the product holds them: RULES.md §Budgets.
- File and function size limits (max_file_lines, max_fn_lines) and the screenshot sizes (screenshot_sizes): RULES.md §Budgets.
- Motion, type and space: the design tokens file (`tokens.css` or your platform's equivalent).
- Time to value: PRODUCT.md §Experience promises.

Everything else refers to a number by its name, such as `max_file_lines` or `--dur-quick`. When one constraint carries two numbers in two files, your AI picks between them at random, and a reviewer flags the project's own tokens as wrong. A short script in the fast check catches strays in the spec documents.

```file path="scripts/check-numbers.sh"
#!/usr/bin/env bash
# Part of the fast check. Fails when a spec document holds a raw ms, s or px value instead of naming its owner.
re='(^|[^0-9.a-zA-Z_-])([2-9]|[1-9][0-9]+)(\.[0-9]+)? ?(ms|px|s)([^a-zA-Z]|$)'
if grep -snE "$re" .offthemode/{DESIGN,VOICE,ROUTES,SKELETON,COMPLEXITY}.md; then
  echo "Raw values above: refer to them by name (a token such as --dur-quick, or a key in RULES.md §Budgets)." >&2
  exit 1
fi
```

The same thinking applies to what your AI reads. RULES.md and STATE.md load at the start of every session, so every line in them is paid for in every session. Keep them short and move detail into the guides and the extra documents.

### The numbers

The RULES.md template ships one json block in §Budgets with three keys: max_file_lines, max_fn_lines and screenshot_sizes. Add a key from the table below to the same block only when the product should hold it. The value beside each key is a common reference point, never a default your AI keeps without asking you. The scripts read that block, so no script and no guide keeps its own copy, and each check runs only for the keys that are there. A model-driven core also adds `eval_drop_points`, the most the eval pass rate may fall before a merge is blocked (see Verification Loop).

| Budget | Keys and reference values | Measured on | Checked by |
|---|---|---|---|
| Core Web Vitals, p75 | lcp_ms 2500, inp_ms 200, cls 0.1; in the lab, tbt_ms 200 stands in for INP | A mid-tier Android phone over 4G | Lighthouse CI (lab) and web-vitals real-user monitoring (field, the only place INP exists) |
| Lighthouse scores | lighthouse_performance 0.9, lighthouse_accessibility 0.95 (category scores, 0 to 1) | The pages listed in `lighthouserc.cjs` | Lighthouse CI |
| Input feedback | feedback_ms 100 | The core journey with the CPU slowed 4x | `scripts/audit-ux.ts` (Event Timing) |
| Loading indicator | indicator_delay_ms 300 (nothing shows before it); progress_copy_ms 1000 (specific copy after it) | Every async state | States gallery and review |
| Frame time | frame_ms_60hz 16.7, frame_ms_120hz 8.3 | Scrolling the scale seed on the low-end device you test on | Profiler |
| Cold start (mobile) | cold_start_ms, until the app responds. There is no common value: measure the app, then set it | The same low-end device | Release checklist |
| Contrast (WCAG 2.2 AA) | contrast_text 4.5; contrast_large 3 from large_text_px 24, or large_bold_text_px 18.66 when bold; contrast_ui 3 for controls and icons | Both themes | Computed-style audit and the states gallery |
| Targets | target_ios_pt 44, target_android_dp 48; on the web, touch size is `--touch-min` in the tokens file; dense pointer-only interfaces never go below target_pointer_min_px 24 | Every interactive element | Computed-style audit, `scripts/audit-ux.ts` |
| Thumb zone | thumb_zone_pct 40: the primary action's centre sits in this bottom share of the phone screen | Every phone surface | `scripts/audit-ux.ts` |
| Keyboard, screen reader | No number: every action reachable, focus visible, every control named with its role and state | Core journeys | End-to-end tests plus a manual VoiceOver or TalkBack pass |
| Scaling, motion | No number: 200% zoom and the largest Dynamic Type still work; a reduced-motion version of every animation | States gallery | Review and `scripts/audit-ux.ts` |

What the web numbers mean: LCP (Largest Contentful Paint) is when the main content appears. INP (Interaction to Next Paint) is how quickly the page responds to a tap or key. CLS (Cumulative Layout Shift) is how much the layout jumps while loading. TBT (Total Blocking Time) is how long the main thread is too busy to respond, the lab's stand-in for INP. p75 means 75 of every 100 real visits must meet the number. WCAG 2.2 AA is the accessibility standard most laws and platforms point to.

```file path="lighthouserc.cjs"
// Run: npx lhci autorun --config=./lighthouserc.cjs · numbers come from .offthemode/RULES.md §Budgets, never typed here; a key that isn't there asserts nothing
const fs = require("node:fs");
function budgets() {
  const md = fs.readFileSync(".offthemode/RULES.md", "utf8");
  const at = md.search(/^#+ .*Budgets/m);
  const section = at < 0 ? "" : md.slice(at).split(/\n##? /)[0];   // §Budgets only, up to the next section
  const m = section.match(/[~`]{3}json\r?\n([\s\S]*?)\r?\n[~`]{3}/);
  if (!m) { console.warn("No json block under RULES.md §Budgets: nothing asserted"); return {}; }
  if (/\{\{/.test(m[1])) throw new Error("RULES.md §Budgets still has blanks to fill");
  return JSON.parse(m[1]);
}
const b = budgets();
const has = (k) => typeof b[k] === "number";
const max = (audit, k) => (has(k) ? { [audit]: ["error", { maxNumericValue: b[k] }] } : {});
const min = (category, k) => (has(k) ? { [`categories:${category}`]: ["error", { minScore: b[k] }] } : {});
module.exports = {
  ci: {
    collect: { url: ["{{URL_HOME}}", "{{URL_CORE_SURFACE}}"], numberOfRuns: 3 },
    assert: {
      assertions: {
        ...min("performance", "lighthouse_performance"),
        ...min("accessibility", "lighthouse_accessibility"),
        ...max("largest-contentful-paint", "lcp_ms"),
        ...max("cumulative-layout-shift", "cls"),
        ...max("total-blocking-time", "tbt_ms"),
      },
    },
  },
};
```

> **Trap:** A clean automated accessibility run doesn't make a product accessible, because automated tools catch only a minority of real issues. Once per release, do one keyboard-only pass and one screen-reader pass through the moment-of-value flow. Your AI writes the script; you run it.

## Always-On · Instrumentation

> **Output:** `.offthemode/TRACKING.md` with a north-star event, a typed `track()` wrapper, and events written into the spec before the code.

Product first means PRODUCT.md names a moment of value. If you can't measure people reaching it, you are iterating on vibes. Analytics bolted on later come out with inconsistent names and no link to the questions you actually had. The north star is the one event that means a person got the value the product exists for; every other event explains the path to it.

```file path=".offthemode/TRACKING.md"
TRACKING: {{PRODUCT_NAME}} · north star {{MOMENT_OF_VALUE_EVENT}} (the moment of value in PRODUCT.md) · activation = % of new users reaching it within {{WINDOW}} · time to value = median ms from signup_completed to the north star, target in PRODUCT.md §Experience promises
- Names: object_action, past tense, snake_case (report_exported), objects from GLOSSARY.md. Every event answers a named question; no question, no event.
- No personal data in properties (no email, name, phone, free text). Money, sign-in and entitlement events fire on the server, because ad blockers drop events sent from the browser.
- Non-essential analytics wait for consent where the law requires it; honor Global Privacy Control. Code calls only the typed track() wrapper, never a vendor SDK.

| Event | Fires exactly when | Properties | Question it answers |
|---|---|---|---|
| signup_completed | account row committed | method | Which signup path converts? |
| {{MOMENT_OF_VALUE_EVENT}} | {{EXACT_TRIGGER}} | {{PROPS}} | Do people reach core value, and how fast? |
| {{FLOW}}_abandoned | someone leaves {{FLOW}} after starting it, without finishing | last_step | Where do people give up? |
```

Global Privacy Control is a browser setting that tells every site not to sell or share the person's data.

The wrapper is the same pattern on every stack: one typed map of events to their properties, one function, and the analytics vendor behind one line (in Swift an enum with associated values, in Kotlin a sealed class). Because the map is typed, a misspelled event or a missing property fails the type check instead of quietly splitting your data. The web TypeScript version:

```ts
type Events = {
  signup_completed: { method: "email" | "google" | "apple" };
  first_value_reached: { ms_since_signup: number; surface: string }; // rename to your north star
};
export function track<E extends keyof Events>(event: E, props: Events[E]): void {
  if (!consent.analytics()) return; // your consent check
  sink.capture(event, props);       // the vendor, swappable behind this one line
}
```

```prompt title="Instrument This Feature"
Before writing code for {{FEATURE}}, propose the events that answer {{QUESTIONS}}, one per question worth answering: name (object_action, glossary terms), exact trigger, typed properties, and the question each answers. Reject events that answer no question and properties that could hold personal data.
Show me the list and wait for my go. Then add the events to .offthemode/TRACKING.md and the Events type, implement them through track() only, and test that each fires exactly once with the right properties on the happy path.
```

> **Pro move:** Instrument hesitation: abandoned flows, repeated undo, settings opened right after onboarding. Every stall is complexity leaking onto the person, and a candidate for a smart default.

## Always-On · Agent Orchestration

> **Output:** one scout's brief that every other agent starts from, word for word; separate sessions for research, building and review; short structured results; scripts for anything that can be measured; a model and effort choice for each task.

The context window is the AI's working memory: everything it has read and said in the current session, read again on every reply. Long sessions pile up stale and contradictory information. A fresh session has none of it, and a fresh session reviewing code has no stake in defending it.

> **Rule:** Don't cap how many agents run. Remove the repetition between them. Every agent starts with a blank memory, so it re-reads what you already know, and you pay for that reading again: thirteen agents, thirteen readings. One scout reads once, and everyone else starts from its brief.

### Many agents, one reading

1. **One scout reads first.** It finds the files the task really touches and what they depend on (not the whole repo), writes a short brief, and decides how many agents the work needs. A four-file job rarely needs more than one.
2. **Every agent's prompt starts with that brief, word for word.** Most providers keep a prompt cache: they store the start of a recent prompt and charge a fraction of the normal input price to read it again, as little as a tenth with some. The cache matches only an exact copy, so one changed word near the top means paying in full.
3. **Start one agent first, the rest once it has begun.** Requests that start at the same moment all miss the cache, because it is written only once the first request is being processed.
4. **Agents return short structured results.** Output is never cached and costs the most per word, so each agent replies in a fixed, short shape.
5. **Scripts do anything measurable.** Counts, contrast, sizes, broken links, test runs: a script is exact, fast and free to rerun. A model reading and judging is none of those.
6. **Big searches go to an agent.** Raw search results left in the main session are read again on every later reply. An agent that searches and returns a summary costs less.

```prompt title="Scout the Task"
Scout {{TASK}} before anyone builds it. Change nothing.
Read only what the task touches: the files it changes, what they import, what imports them, the tests that cover them, and the matching lines in .offthemode/RULES.md and .offthemode/CHECKLIST.md. Not the whole repo.
Write a brief of at most 40 lines:
- the goal in one sentence
- each file, with one line on its role
- the contracts that must not break (types, API shapes, design tokens)
- the checks that prove it works: {{?CHECK_CMD}}
- open questions, written as hypotheses ("I think X, because Y")
Then say how many agents this needs and why. One is the default; split only where the parts share no files.
End with the reply format every agent uses: done or blocked; files changed; check result; anything the brief got wrong. At most 10 lines.
Every agent that follows starts its prompt with this brief, unchanged.
```

### Patterns

| Pattern | Use when | How |
|---|---|---|
| Research agent | You need conclusions from a lot of reading | An agent or a separate session reads; the main session gets the summary |
| Builder and reviewer | Any change worth checking | A second, fresh AI session asked to review, with no memory of building it |
| Isolated builders | Samples that must not see each other (the three directions in P3, bake-offs) | One fresh session per sample, each in its own copy of the project |
| Parallel features | Two or three features that share no files | One session each, in separate copies, after shared contracts have landed |
| Batch run | One mechanical change across many files | Your tool's command-line mode in a loop, one file per run, each run logged |
| Fresh start | A phase ends, or a session starts to drift | Have STATE.md and DECISIONS.md brought up to date, then open a new session; it loads RULES.md and STATE.md and carries on |

Summarizing a long conversation in place (many tools call this compacting) is for the middle of a task. At a phase boundary, a fresh session with an up-to-date STATE.md is cleaner.

> **Pro move:** If you use git, `git worktree add ../{{APP}}-{{BRANCH}} -b {{BRANCH}}` makes a second folder of the same repo on its own branch, so two sessions never edit the same files. Some tools (Claude Code does) can give an agent its own worktree automatically.

### Batch runs

A batch run is the AI working from the command line, with no chat window: it takes a prompt, does the job, and exits. In Claude Code that is `claude -p`; in Codex, `codex exec`.

Talk first still holds, for the batch as a whole. Have your AI describe the change, list the files and show one sample result. Say go, then start the loop. Each run is told it belongs to an approved batch, so it doesn't stall waiting for a go nobody will type, and it leaves `.offthemode/` alone: many runs rewriting STATE.md would overwrite each other. Update STATE.md once, at the end.

```bash
for f in $(git ls-files '{{FILES_GLOB}}'); do   # each run prints one line, so the loop's output is the log
  {{AI_CLI}} "Part of an approved batch: don't wait for a go, don't edit .offthemode/. Apply .offthemode/prompts/copy-pass.md to $f. Edit strings only. Reply in one line: file, changed or unchanged, what changed."
done
{{CHECK_CMD}}   # the check command from RULES.md §Commands, once, after the batch
```

`{{AI_CLI}}` is your tool's command-line call, `{{FILES_GLOB}}` the files to sweep, and the prompt file is any saved prompt (see Prompt Library).

> **Pro move:** If your tool can limit what a command-line run may do (Claude Code's `--allowedTools` can), allow only reading, editing and the check command.

### Model and effort per task

Vision questions, architecture, the data model, the threat model and nasty debugging get the strongest model and the highest reasoning effort your tool offers, with a plan before any code. Building from a settled plan gets the default model. Mechanical sweeps get the fastest one, as a batch run. Review always runs in a different session from the build.

> **Trap:** Parallel agents editing the same files means merge hell. Split work by ownership, and land shared contracts (types, API schema, design tokens) on the main branch before fanning out.

## Always-On · Prompt Library

> **Output:** the prompts that work for this project, saved as plain files in `.offthemode/prompts/`, each with a version line and a short changelog.

Prompts that worked are assets. Retyped from memory, they lose their refinements, and without versions you can't tell which edit helped. A prompt you type twice gets saved.

Save one prompt per file, as `.offthemode/prompts/<name>.md`, in plain Markdown. Any AI tool can read the same file (most let you pull a file into a prompt with `@path`). Commit the folder with the project, so every session and every teammate uses the same text. Good candidates: the templates in these guides you reach for often, tuned to your project, and prompts you wrote yourself that worked.

### Placeholders keep prompts short

`{{NAME}}` is an input only you can give, each time: the feature, the surface, the path. `{{?NAME}}` is a fact your AI works out from the code or the docs and shows with its source, for example "check command: `npm test` (RULES.md §Commands)". `{{NAME | x}}` offers x as the recommended default, which your AI shows you to confirm and never keeps silently.

Write every project fact as `{{?NAME}}`. Then you type only what really changes, and the prompt keeps working as the project changes. The Off the Mode commands work the same way: they know nothing about your project until they read `.offthemode/`.

### Versions tell you which edit helped

Each file starts with a version line: the number, the date and why it changed. A changelog at the bottom keeps every earlier reason in one line each. When a prompt gets worse, the changelog tells you which edit to undo.

```file path=".offthemode/prompts/diverge.md"
version 4 · changed {{DATE}} · why: v3 still let the generator recommend its own favourite
3 directions for {{SURFACE}} that disagree on {{AXIS: metaphor, density, motion or navigation}}, one per reference I assign ({{REF_A}}, {{REF_B}}, {{REF_C}}). Each: name, 3-line thesis, signature moment, what it gives up, main risk. If two could merge, replace one. No code. Do not recommend; a fresh session compares them and I choose.
Changelog: v4 references assigned by me, no recommendation (a generator grading its own options picks its favourite). v3 "if two could merge, replace one". v2 "what it gives up" (v1 had no tradeoffs, so choosing was arbitrary).
```

> **Pro move:** If your tool has saved commands or skills, point them at the file instead of copying the text, so it lives in one place. In Claude Code, a command file `.claude/commands/diverge.md` holding the line `@.offthemode/prompts/diverge.md` and then `Inputs: $ARGUMENTS` makes `/diverge` run the saved prompt with whatever you type after it. A skill can also carry scripts, and loads by itself when a task matches its description.

> **Rule:** Every change to a saved prompt, and every new line in RULES.md, carries its reason. Lines without reasons pile up into contradictions, and the model tries to satisfy all of them at once. When you correct the same thing twice, it becomes one line in RULES.md with its why, not a reminder you keep retyping.

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

<!-- offthemode:command reassess -->

<!-- offthemode:command commentrevisit -->

<!-- offthemode:command glossaryrevisit -->

## Mobile Addendum

Every phase of the method still applies on mobile. This guide covers what changes on a phone. Add a line to RULES.md §Guides that maps mobile work to it, so your AI opens it before planning any screen, flow or release.

| Phase | What changes |
|---|---|
| Rules | RULES.md §This project declares the minimum OS versions and target devices. §Commands lists the mobile commands: a single-file lint, a type check, screenshot capture from the simulator or emulator, and a token lint (a script that fails on hard-coded colors, sizes and durations) |
| Vision | Sessions are short, one-handed and interrupted; the moment of value survives backgrounding and resumes exactly where it was |
| Visuals | The platform owns navigation, gestures, system sheets, text input and what each haptic means, plus chrome materials (iOS 26 Liquid Glass and its large concentric corners, never faked on web; if DESIGN.md avoids glass effects or large radii, allow them for native chrome only). The brand owns type in content, color, motion and the signature moment |
| Tokens | Safe areas and cutouts; edge-to-edge (enforced when targeting Android 15); Dynamic Type and font scale; a decision on Material dynamic color; concentric radii as tokens; haptic tokens beside motion tokens; springs from the motion tokens file (for example `motion.ts`) |
| Backend | Offline-first: a local database as the UI's source of truth, a sync engine (P4), an explicit conflict policy; an additive-only API plus a minimum-supported-version check, because old app versions stay installed for months |
| Navigation | Universal Links and App Links under `/.well-known/`, deferred deep links that survive the install, Android predictive back registered ahead of time, iOS edge-swipe back never broken |
| Core | The frame budget from RULES.md §Budgets; animation on the UI thread (Reanimated, SwiftUI, Compose) with springs that inherit the gesture's velocity; virtualized lists; image decoding off the main thread |

> **Rule:** In chrome, native feel beats brand. In content, brand wins.

- [ ] Push permission requested in context after value, never at first launch (iOS provisional authorization; Android 13+ `POST_NOTIFICATIONS`); every push deep-links to the exact state it describes, with frequency caps
- [ ] Apple: in-app account deletion, privacy labels plus a privacy manifest, a demo account in the review notes, Sign in with Apple (or another privacy-focused option) alongside third-party login, in-app purchase for digital goods, App Tracking Transparency only if you track
- [ ] Google Play: Data safety form, current target API level, prominent disclosure; new personal developer accounts need a closed test with 12 or more opted-in testers for 14 continuous days
- [ ] Over-the-air updates (EAS Update, Shorebird) only for JS or Dart code and assets, never a change of the app's primary purpose; anything native needs a store build; pin the update runtime to the native build
- [ ] Phased release and staged rollout gated on crash-free sessions; a remote-config kill switch shipped before you need it; store screenshots captured from the real app on the demo seed, in moment-of-value order (P8, Landing as Demo)
- [ ] Device matrix: smallest and largest phones; a 2 to 4 GB Android on the oldest supported OS; largest text, bold text, reduced motion, VoiceOver, TalkBack; RTL and Devanagari locales; offline, flaky 3G, an incoming call, an hour in the background, a permission revoked in Settings; cutouts and a foldable

```prompt title="Mobile Platform Pass"
Open the Mobile Addendum guide first. Then review {{SCREEN_OR_FLOW}} as the engineers who designed {{PLATFORM}}'s UI framework would.
1. Conventions: every place we fight the platform (custom back, fake native control, odd gesture, wrong sheet type). Propose a fix for each unless it is the signature moment declared in PRODUCT.md.
2. Ergonomics: the primary action in the thumb zone and targets at the platform minimums, both from RULES.md §Budgets; usable one-handed.
3. Resilience: kill mid-flow and relaunch, go offline, rotate, largest text size; screenshot each; list any lost state.
4. Performance: profile a scroll through the scale seed on {{LOW_END_DEVICE}}; report dropped frames and main-thread work over the RULES.md §Budgets frame budget; name the worst three.
5. Deep links: every screen opens cold from a link with its state restored and a sensible back stack built behind it.
Report each finding with evidence (screenshot, profiler trace or file:line) and the fix you propose, then wait for my go. After fixing, re-run the affected checks on a simulator or device and show the before and after.
```

## Prompt Craft Toolkit

The Laws state the principles. These are the moves that put them to work, each with the mechanism that makes it effective and a template. Templates not shown in this guide live in the guide for that kind of work. Save any you use twice in `.offthemode/prompts/` (see Prompt Library).

| Move | Mechanism | Template |
|---|---|---|
| Interview first | The model asks about what it would otherwise guess, most important question first | Interview Me First |
| Hypotheses first | Makes hidden guesses visible, so they are confirmed before anything is built on them | Confirm Before Building |
| Constraint stacking | Independent constraints overlap only in a small, unusual region | Constraint Stack |
| Reference anchoring | One reference carries thousands of constraints; saying what to take and what to ignore stops surface copying | Anchor to References |
| Ban with replacement | A bare ban primes the banned thing; an alternative gives the model somewhere to go | Ban With Replacement |
| Rubric first | Written first, it shapes what gets made; written after, it only justifies it | Rubric First |
| Subtraction | Models are trained to be complete; explicit deletion reverses that | Subtraction Pass |
| Checkpoints | Errors compound; a checkable exit at each step catches drift early | Checkpoint Plan |
| Tests as spec | A failing test is a target the AI can work toward on its own | Test-First |
| Few-shot from your code | The model copies the structure it sees, so show it yours | Match the Exemplar |
| Structured sections | Tags separate instructions from material; material first, the ask last | Sectioned Brief |
| Escalation ladder | Being stuck is a problem of context, scope or signal, rarely of intelligence | Hypotheses Before Fixes (P6 · Core Build & Iteration) |

```prompt title="Interview Me First"
Before any plan or code, interview me about {{FEATURE}}. Batched, numbered questions, ordered by how much the answer changes architecture or UX, each with your recommended answer and what breaks if it is wrong; more rounds if needed. Ask only what would change the plan, and stop when no remaining question would. Then show me the answers as D-### entries for .offthemode/DECISIONS.md, and add them on my go.
```

```prompt title="Confirm Before Building"
Before changing anything, list what you believe about {{TASK}}: data shapes, current behavior, user expectations, environment. Mark each VERIFIED (file:line) or HYPOTHESIS, written as "I think X, because Y". Confirm every hypothesis before building on it: check the code or docs, and ask me about the rest. Show me the list and your plan, and wait for my go. Build only on what is verified.
```

```prompt title="Constraint Stack"
Design {{SURFACE}} satisfying all of these:
- Layout: {{e.g. asymmetric grid, content starts at column 3, nothing centered}}
- Type: {{DISPLAY_FACE}} for one headline only; {{TEXT_FACE}}; {{MONO}} for data; at most {{N}} steps of the --text-* scale
- Colour: per the colour strategy in .offthemode/DESIGN.md; one accent role, on the primary action
- Motion: one signature transition ({{DESCRIBE}}); everything else --dur-quick or shorter, opacity and transform only
- Copy: verbs, at most 8 words per heading, no greetings, no exclamation marks
```

```prompt title="Anchor to References"
For this one change only. References: {{REF_1: a screenshot path}} (take: type scale, density; ignore: colour), {{REF_2: a motion reference, with its notes}} (take: the settle, not the overshoot), @{{src/best/Component.tsx}} (take: state and prop patterns). For each, state in one line the principle you extract and the line in .offthemode/PRODUCT.md §Feeling or .offthemode/DESIGN.md it serves. Apply principles, not pixels.
```

```prompt title="Ban With Replacement"
A pattern keeps coming back that .offthemode/DESIGN.md doesn't name yet: {{PATTERN}}. For this task, replace it, don't just avoid it:
- Instead of {{PATTERN}}: {{REPLACEMENT}}, because {{REASON}}.
- Instead of "Get started": the verb of the job, "{{VERB}} your first {{OBJECT}}".
If I confirm it applies beyond this task, propose one line for .offthemode/DESIGN.md (the pattern, why, what to use instead) and, if a text search can find it, the pattern a check script should flag.
```

```prompt title="Rubric First"
Before designing {{SURFACE}} ({{onboarding, chart, editor, landing or OTHER}}), write the criteria that decide quality for this kind of surface, each certain to matter here and not already covered by DESIGN.md §Rubric, and show them to me. For each: what weak (1) and strong (3) look like, and which reference shows each. Include: the primary action is obvious at a glance; nothing that doesn't serve the job; the signature moment, if it lives here; {{?PERF_BUDGET}}. Wait for my go, then add them to .offthemode/DESIGN.md and build to them.
```

```prompt title="Checkpoint Plan"
Break {{FEATURE}} into checkpoints of at most {{SIZE}}, each ending in a state that runs and can be checked (a test, a screenshot, a request): goal, files, exit check, decisions you need from me. Show me the plan and wait for my go. Then do checkpoint 1 only, run its exit check, update .offthemode/STATE.md with where things stand, and stop.
```

```prompt title="Match the Exemplar"
Exemplars: @{{src/features/best/}} and @{{src/api/best-endpoint.ts}}. Build {{NEW_THING}} matching their structure, naming, error handling and test style. First list the 5 conventions you extracted. Where the exemplars disagree, ask.
```

```prompt title="Sectioned Brief"
<context>{{what exists; @files}}</context>
<goal>{{one sentence: the user-visible outcome}}</goal>
<constraints>{{ranked; the first wins conflicts}}</constraints>
<non_goals>{{explicitly out of scope}}</non_goals>
<done_when>{{verifiable checks}}</done_when>
<ask>Plan only. Reference sections by tag name.</ask>
```

## Anti-patterns

Some classics are simply a law broken, and The Laws cover them: adjective soup, accepting the first visual, feature-first prompting, the marathon session and re-prompting the same fix. These are the rest, including the ones a setup like this can invite.

| Anti-pattern | What happens | Fix |
|---|---|---|
| Building on a guess | The AI fills a gap with the likeliest answer, and everything after inherits it | Write the doubt as a hypothesis ("I think X, because Y") and confirm it in the code, the docs or by asking before building on it |
| Mega-prompt, no priorities | The easy requirements win and the hard one silently drops | Rank constraints ("first wins"), write non-goals, move standing requirements into RULES.md |
| "Best practices" | That phrase is the mode, the most common answer, by definition | Ask "what would the {{CORE_TECH}} maintainers do here, and what would they refuse?", and open the matching guide |
| "Make it better" | With no target, the model does something visible, usually more | Name the axis and the evidence: "the primary action loses to the sidebar; make it win without adding elements" |
| Letting the AI pick the stack | Its default is whatever dominated its training data, and that brings the default look with it | Derive the stack from the product's constraints and record it as a D-### entry in DECISIONS.md |
| Pasting code instead of pointing at files | Pasted code goes stale and loses its callers | Point at paths (most tools accept `@path`); paste only what the AI can't reach |
| Arguing with a derailed session | Each correction adds more of the wrong path | Rewind to before it went wrong if your tool can; otherwise have STATE.md brought up to date and start a fresh session |
| The bloated rules file | 800 lines compete for attention on every turn | Keep RULES.md readable in a minute; depth lives in the guides, opened only for the work that needs them |
| Not reading diffs | Drive-by renames and loosened types pass the checks | Read `git diff --stat` first, then every hunk; one commit per checkpoint |
| Tests that agree with the code | Written afterward, they encode the bugs | Test-First, and the tests stay fixed while the code is written |
| Minimalism by amputation | Experts can't do the job, so complexity comes back as workarounds | Move a removed control to a deeper layer instead of deleting it (Taming Complexity); the core job still completes keyboard-only and touch-only |
| Full ceremony on a one-line change | Ceremony gets abandoned within weeks, and then nothing is enforced | Scale the talk to the change: a one-line fix gets one line on what will change, then the check that proves it; a full plan is for work that touches data, contracts or many files. For a change inside what exists, open a guide's working rules, not the whole guide |
| Taste by negation | Bans alone converge on the next mode | Write what you want, not only what you ban: PRODUCT.md §Feeling and `.offthemode/DESIGN.md`, drawn from work you love |
| Self-graded divergence | One author, one context, one favourite | References you assign, each direction built in its own fresh session, and a reviewer session that built none of them |
| Absolute scores from a same-family judge | A model grading output from its own family is lenient, noisy and drifting, so the loop oscillates | Compare in pairs against references, swap the order, call it a tie when the two orders disagree; take measurable facts (contrast, sizes, spacing) from a script |
| The same example in every project | Worked examples quietly become your house style | Treat the examples in these guides as illustrations, never defaults; note in `.offthemode/DESIGN.md` what this project must not borrow from your last one |

## How to add it

Off the Mode comes from one public repo, https://github.com/BlurryVisions/offthemode, in three forms: this website, a hosted MCP server, and a skills pack. MCP (Model Context Protocol) is the standard way AI tools connect to outside tools. Paste one link into your AI tool and it gets the five commands, the guides and the file templates. Or install the skills pack, and the same commands, guides and templates live as files on your machine, with no server.

This guide is the one source for the install steps; the website and the README follow it.

### Add it to your AI tool

The link is https://offthemode.vercel.app/mcp. Pick the way that matches your tool.

#### Claude desktop app or claude.ai

1. Open Settings, then Connectors.
2. Choose Add custom connector and name it Off the Mode.
3. Paste `https://offthemode.vercel.app/mcp` and add it.

On Team and Enterprise plans only admins can add connectors, so ask yours to add it for the organization.

Then say "set up off the mode" in a Claude session that can open your project folder, because setup reads the project and writes its files there. In a chat without your files, it drafts each file in the chat for you to save. For a codebase, Claude Code is the better fit (the next section).

#### Claude Code

The easiest way is the skills. This one line, pasted into a terminal, installs all five for every project:

```bash
curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ~/.claude/skills
```

The skills are files on your machine, so they work in auto mode, Claude Code's default, with no extra step. The commands are then `/offthemode`, `/listrevisit`, `/reassess`, `/commentrevisit` and `/glossaryrevisit`.

Or use the link. Run this once; `--scope user` makes it available in every project on your machine:

```bash
claude mcp add --transport http --scope user offthemode https://offthemode.vercel.app/mcp
```

In auto mode, the safety check blocks tools from a server you just added until you allow them. Type `/permissions` and add the allow rule `mcp__offthemode`, or switch the session to Manual mode once and approve the tool when it asks. Run `claude mcp list` to check that `offthemode` shows as connected. The commands appear as `/mcp__offthemode__offthemode`, `/mcp__offthemode__listrevisit` and so on.

#### Cursor and VS Code

Use the one-click buttons for Cursor and VS Code on https://offthemode.vercel.app. Your editor opens with the server filled in; approve it when asked.

To add it by hand in Cursor, put this in `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` for every project:

```json
{ "mcpServers": { "offthemode": { "url": "https://offthemode.vercel.app/mcp" } } }
```

In VS Code (GitHub Copilot's chat), put this in `.vscode/mcp.json` in the project. Using the Claude Code extension inside VS Code? Follow the Claude Code steps instead.

```json
{ "servers": { "offthemode": { "type": "http", "url": "https://offthemode.vercel.app/mcp" } } }
```

#### Codex

Run this once, then restart Codex:

```bash
codex mcp add offthemode --url https://offthemode.vercel.app/mcp
```

Or add the server to `~/.codex/config.toml` by hand:

```toml
[mcp_servers.offthemode]
url = "https://offthemode.vercel.app/mcp"
```

#### Any other MCP tool

Windsurf, Zed, Cline and other tools that speak MCP over HTTP: add a remote server (often labelled HTTP or streamable HTTP) named `offthemode`, with the link as its URL.

#### Skills pack

The skills are the same commands, guides and templates as plain files, so nothing is fetched while you work. All five belong together: setup follows the listrevisit and reassess instructions, and the guides live in the offthemode skill. Put the folders where your tool loads skills:

| Tool | For one project | For every project |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex, Gemini CLI, Cursor, VS Code | `.agents/skills/` | `~/.agents/skills/` |

For Claude Code, the one line above installs them. For the other tools, use this line. It makes the folder first, because unzip creates only the last folder of the path:

```bash
mkdir -p ~/.agents/skills && curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ~/.agents/skills
```

You can also download the zip from the website, or copy the folders from `skills/` in the repo. The Claude app (desktop or claude.ai) takes one skill per upload, which is the only reason each skill also has its own zip on the website: upload all five.

| | The link (MCP) | The skills |
|---|---|---|
| Setup | Paste one link | One line in a terminal, or put the folders in place |
| Guides and templates | From the `get_method` and `get_template` tools | From the offthemode skill's `method/` folder and each skill's `templates/` folder |
| Updates | Arrive as they are published | Install again |
| Command names in Claude Code | `/mcp__offthemode__<command>` | `/<command>` |

Either way, you can type a command or just say it: "set up off the mode", "reassess the project".

### Where the guides come from

Each guide has one name, the one RULES.md §Guides uses, such as `p3-visual-language`.

- **Through the link:** your AI calls the `get_method` tool with the guide's name. For a phase guide it returns the working rules and a pointer to the rest; adding `full: true` returns the whole guide. Guides with no working rules always come back whole.
- **With the skills:** the guides are files in the offthemode skill's `method/` folder, inside the skills folder above (for example `~/.claude/skills/offthemode/method/` or `~/.agents/skills/offthemode/method/`). `method/INDEX.md` lists them; `method/10-p3-visual-language.md` is a whole guide, and `method/rules/10-p3-visual-language.md` its working rules.

For work inside an existing product, the working rules are enough. The whole guide is for starting that phase or changing its structure.

### Set up a project

Open the project in your AI tool and say "set up off the mode". Setup talks first: it looks at the folder, tells you which door it is taking and why, lists exactly what it will create, and waits for your go.

- **New project** (an empty folder, or just an idea). It asks about the product before anything else: what it is, who it's for, the job they need done, the moment they first get value, what it refuses to be, how it should feel. From your answers it writes the files.
- **Existing project.** It reads the code first: the stack, the commands, the screens and flows that exist. It drafts PRODUCT.md from what the code shows, writes each guess as a hypothesis ("I think the main user is X, because Y") and confirms it with you. RULES.md gets your real stack and commands, and CHECKLIST.md sets what exists against what the core concept needs.

Setup changes no code. It writes the `.offthemode/` folder, plus one line you approve so your tool loads it. The project's own rule files stay where they are: setup adds that one line, and changes another line only when you approve the fix, for a conflict or an out-of-date fact. The folder starts with six core files:

| File | What it holds |
|---|---|
| PRODUCT.md | Vision, core concept, person, job, moment of value, refusals, feeling, experience promises |
| RULES.md | The standards every change is held to, the map from each kind of work to its guide, budgets and the project's commands |
| CHECKLIST.md | The core concept split into fragments, each marked to verify early or on completion; each item has a done-when, a guide and its evidence |
| GLOSSARY.md | A plain-words summary for people, then the Terms the code and copy use |
| STATE.md | Where things stand now, rewritten when a piece of work ends |
| DECISIONS.md | Every decision, appended, never rewritten |

#### Optional files

A guide adds one of these to `.offthemode/` only when its work needs it, on your go. Setup creates none of them, and a small project may never need any. Each one's shape is defined in its guide, most as a file block to copy.

| File or folder | Guide | Written when |
|---|---|---|
| `SKELETON.md` | P1 · Vision & Skeleton | The project has several screens or routes, stored data, more than one kind of user, or outside services |
| `RISKS.md` | P1 · Vision & Skeleton, P2 · Core Spike | A person, job or moment is still a hypothesis, or the pre-mortem finds a risk worth testing |
| `experts/` | Expertise Injection | A domain is hard enough that the average answer would hurt the product |
| `DESIGN.md`, `design/` | P3 · Visual Language | The product has a UI; `design/` holds your taste, references, directions and rubric anchors |
| `ARCHITECTURE.md` | P4 · Backend & Infra | The product has a backend, stored data or hosting to describe |
| `ROUTES.md` | P5 · Navigation & Flows | The product has routes or screens |
| `COMPLEXITY.md` | Taming Complexity | Surfaces start to grow |
| `SECURITY.md` | P7 · Security Hardening | The first work on login, permissions, input, uploads, secrets, payments or AI features |
| `RUNBOOK.md` | P8 · Ship & Operate | Before launch: rollback, flag kill, secret rotation, restore |
| `VOICE.md` | Always-On · Words & Voice | The product has words people read |
| `TRACKING.md` | Always-On · Instrumentation | The product gets analytics events |
| `prompts/` | Always-On · Prompt Library | A prompt gets typed a second time |
| `REASSESS.md` | Always-On · Revisits | You say yes when `reassess` offers to save its report; the next save replaces it |

Code a guide calls for, such as design tokens, scripts and tests, is ordinary project code: it lives where code belongs and is written on your go. Screenshots go to `shots/`, which stays out of git.

Say "set up off the mode" again on a project that is already set up and you get its status: where things stand, and what's next on the checklist.

To read the folder without opening each file, use the view: setup, `listrevisit`, `reassess` and `glossaryrevisit` end with its link. It shows the checklist, the plan, the plain summary, the decisions, where things stand and the last reassess on one page, read in your browser.

See it as a page: https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).

> **Pro move:** Commit `.offthemode/` with your code. Every teammate and every AI session, in any tool, then works from the same product, rules and state.

> **Pro move:** A small project still gets all six core files, just short. Twenty lines of PRODUCT.md is enough for a weekend build. Scaling down means shorter files, not skipped thinking.

### Make the rules load every session

Your AI reads `.offthemode/RULES.md` and `.offthemode/STATE.md` at the start of every session. Setup wires this into the file your tool already loads on its own (for example CLAUDE.md in Claude Code, AGENTS.md in Codex, a project rule in Cursor; P0 · Constitution lists the file for each tool) and shows you the exact line before adding it. Through the link, the MCP server also repeats it as a standing instruction.

Check it: open a fresh session and ask "where do things stand?". The answer should come from STATE.md without you pointing at it. If it doesn't, add the prompt below to your tool's auto-load file, or paste it at the start of a session.

```prompt title="Load the Rules"
Before any work in this project, read .offthemode/RULES.md and .offthemode/STATE.md, and hold every change to RULES.md. Before planning or doing a kind of work, open the guide RULES.md §Guides maps it to, once per session: its working rules for a change inside what exists, the whole guide when you start that phase or change its structure.
```

> **Rule:** One `.offthemode/` folder serves every tool. Switch tools, or use two at once, and both read the same files. Never keep a separate copy per tool.

### Remove it

1. Remove the auto-load line setup added to your tool's instructions file.
2. Remove the connection: in Claude, Settings, then Connectors; in Claude Code, `claude mcp remove --scope user offthemode`; in Codex, the `[mcp_servers.offthemode]` block in `~/.codex/config.toml`; in Cursor, VS Code and other tools, their MCP settings; for the skills, delete the five folders.
3. Delete `.offthemode/`, or keep it. It is plain Markdown about your product, and it stays useful without any tool.

Code that was written along the way, such as tokens, scripts and tests, is ordinary project code. Keep it or remove it as you would any other.

## The daily loop

Normal sessions stay free-form. You say what you want in plain words; the files in `.offthemode/` keep the standard and the memory, so you don't have to.

### A normal session

1. **Open a session.** Your AI loads `.offthemode/RULES.md` and `.offthemode/STATE.md`, so it knows the standards and where things stand. If its first answer doesn't know, see How to add it.
2. **Say what you want.** One concern at a time: a feature, a fix, a screen.
3. **It opens the guide.** RULES.md §Guides maps each kind of work to a guide; your AI opens the matching one before planning, once per session. For a change inside what exists, the guide's working rules are enough.
4. **It talks first.** It says what it understood, what it will change and what it isn't sure of, as hypotheses ("I think X, because Y"), and confirms each one before building on it. A small fix (a typo, a one-line change) gets one line and goes ahead; anything bigger waits for your go, with a real plan when it touches data, contracts or many files.
5. **It builds in build order.** CHECKLIST.md lists the fragments in the order they depend on each other, core first, and your AI follows that order, held to RULES.md. You can still ask for anything at any time; listrevisit catches up.
6. **It verifies before it says done.** The checks pass, the thing actually ran, and screens were looked at on phone, tablet and wide widths.
7. **It records the work.** STATE.md is rewritten with where things stand, decisions go to DECISIONS.md, your AI names the checklist item the work closes (listrevisit records the mark and the evidence), and a correction you had to make twice becomes a proposed line in RULES.md §Project specifics, added on your go.
8. **Review in a fresh session** when the change matters: a second AI session asked to review, with no memory of building it.

> **Why:** A fresh session with an up-to-date STATE.md picks up where the last one stopped, with none of the stale context. So end a session when a piece of work ends, not when the window runs out.

### When to run each command

Every command talks first: it explains what it found and exactly what it will change, waits for your go, then does it and says what it did.

| Command | Run it |
|---|---|
| `offthemode` | Once per project, to set it up; later, any time you want the status |
| `listrevisit` | To see what's next, or when a new feature or idea comes up, so it lands in the right place on the checklist |
| `reassess` | After every few pieces of work, before a milestone, or whenever the product feels like it is drifting from the core concept |
| `commentrevisit` | Before a merge, or when comments feel stale |
| `glossaryrevisit` | After a milestone, or before you show the project to someone |

Some guides add their own rhythm on top: a Refactor Checkpoint during the core build, a Complexity Audit weekly while surfaces grow, the Five-Person Test whenever the core journey changes shape, and a Weekly Signal Review after launch.
