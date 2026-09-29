# Off the Mode

Left alone, every coding agent returns the mode of its training data: the most common stack, the most common landing page, the most common happy-path code. This blueprint is a portable system for pulling agents off the mode, and toward something recognisably yours, on every project you build: web or mobile, weekend build or extremely complex product. A GLOBAL layer (your taste, rules, expert profiles, critics, commands) follows you to every repo. A PER-PROJECT scaffold gets filled in fresh in ten minutes. The blueprint keeps your order, fixes the places where it leaks, and applies one product-first lens throughout: complex inside, simple outside.

Read it in three layers, like a product. **L1, daily:** The Pipeline, The One-Page Loop (fifteen commands) and Bootstrap in 10 minutes inside The Portable Kit. **L2, per phase:** open a phase section only while you're in that phase. **L3, once:** the file and prompt templates, which you copy into the kit and then run as commands. Two conventions run through every template. `{{NAME}}` is something you supply. `{{?NAME}}` is something the agent resolves from the docs and shows with its source (`PERSON <- PRODUCT.md L7`), so most prompts need one argument, not ten. And every task runs in a lane (Trivial, Standard, Heavy), so a copy tweak never pays for the ritual a schema change needs.

## The Pipeline
<!-- origin: added -->

| Phase | Origin | Purpose | Output |
|---|---|---|---|
| Product-First Doctrine | added | Person, job and moment of value, decided before any tech, with evidence | Five decisions; the UX contract as assertions |
| P0 · Constitution | yours | Standing rules and memory that multiply every prompt | Global + project rules, lanes, context log, hooks |
| Expertise Injection | yours | "The guy who made JS": load judgment, not a job title | Expert library, `inventor-critic` |
| P1 · Vision & Skeleton | yours | A vision precise enough that two agents build the same product | `PRODUCT.md`, `SKELETON.md` |
| Living Checklist | yours | Your plan as core fragments with provable done-whens: vibe freely, revisit the list any time | `CHECKLIST.md`, `/listrevisit` |
| P2 · Core Spike | moved | Optional: prove a fragment early only when it can be proven on its own | Verdict with numbers, core contract, feel test with 3 people |
| P3 · Visual Language | yours | Your taste, not the average's, locked as code | `TASTE.md` (once), `DESIGN.md`, tokens, `/specimen`, audits |
| P4 · Backend & Infra | yours | Boring, strong, host-ready from commit one | `ARCHITECTURE.md`, schema, contract or sync engine, env |
| P5 · Navigation & Flows | yours | Nouns as navigation, state in the URL, clickable shell | `ROUTES.md`, clickable skeleton, Five-Person Test |
| Taming Complexity | added | The system carries complexity; the user only on request | `COMPLEXITY.md`, audit ritual |
| P6 · Core Build & Iteration | yours | The core as small, fenced, verified slices | Flagged slices, CR log, baselines, evals |
| P7 · Security Hardening | moved | Audit controls built in since day one | `SECURITY.md`, red-team findings |
| P8 · Ship & Operate | added | Hosted is not shipped | Launch checklist, landing as demo, runbook, retro |
| Always-On (8 rails) | added | Verification, words, data, budgets, instrumentation, orchestration, prompts, revisits | Hooks, audits, evals, `VOICE.md`, seeds, `BUDGETS.md`, commands, `/reassess`, `/commentrevisit`, `/glossaryrevisit` |

This is not a waterfall. P1 and P2 form one loop. P4 and P5 run in parallel once the mock server exists. P6 loops dozens of times, and P7 only audits controls that P0, P4 and P6 already built. The Always-On rails run under every phase from the first commit. The Doctrine and Taming Complexity are lenses applied at every phase gate: an output that can't name the person, job and moment it serves isn't done. Two gates use real people, because every other judge in the system is a model or you: 3 target people try the feel prototype after P2, and 5 do the core job on the clickable skeleton after P5. The tier sets how deep you go (The Portable Kit, scaling).

## Where Your Approach Leaks
<!-- origin: added -->

The intent of your order is right: rules first, vision before code, function before polish. It leaks in twelve places. Each fix keeps your phases.

1. **Product is implicit.** Person, job and moment of value are never written down, so the agent fills them with the average product. **Fix:** Product-First Doctrine, written into `.offthemode/PRODUCT.md`.
2. **Nothing checks the work.** "Done" means the agent stopped typing. **Fix:** Always-On · Verification Loop: audits that assert, hooks that gate a `DONE:` claim, `/ship`.
3. **Security is scheduled as a phase but lives in the schema.** Tenancy, authz and where PII lives get decided in backend work either way. **Fix:** invariants in the rules on day one, a threat sketch in P1, and P7 as an audit.
4. **A risky fragment gets built last.** Defining the core concept first, in planning, is right. But the core is built last, so if one fragment needs realtime, a sync engine or a different data shape, everything built before it bends. **Fix:** the Living Checklist splits the core into fragments and marks each one as provable early or only on completion. P2 proves the early ones before the plan depends on them; the rest get an end-to-end check when they are complete. "Plug and play" is only true once the socket is known.
5. **Complexity has no owner.** Every feature arrives with a control. **Fix:** Taming Complexity, where clutter is a counted score that fails like a test.
6. **The "made JS" persona is placebo.** It changes tone, not tradeoffs. **Fix:** Expertise Injection: values, refusals, sources, an adversarial critic.
7. **The content layer is missing.** Visuals judged on lorem ipsum, copy left to defaults. **Fix:** Always-On · Real Data and Words & Voice, before visuals lock.
8. **Corrections evaporate.** **Fix:** the LESSONS promotion ladder (P0) and retros that upgrade the global layer.
9. **Hosted is not shipped.** No launch, no monitoring, no loop from usage back to product. **Fix:** Always-On · Instrumentation and P8.
10. **One agent in one context does everything, including reviewing itself.** **Fix:** Always-On · Agent Orchestration.
11. **Every judge is a model or you.** The predict-my-call test proves a model can predict you; critics score screenshots. Nothing checks that the Person exists or that a stranger reaches the moment of value unaided. **Fix:** an Evidence column in PRODUCT.md and two human gates (P2 feel test, P5 Five-Person Test).
12. **"Unique" is defined against the average, not toward you.** Bans without a positive signature converge on the next mode, and in 2026 that mode is the anti-slop look itself. **Fix:** `TASTE.md` built from your own loves and hates, plus a `USED.md` ledger so project 3 can't look like project 1 (P3).

```mermaid
flowchart LR
  D[Product lens] --> R[Rules] --> S[Vision + skeleton] --> C[Core spike + feel test] --> V[Visuals from TASTE.md] --> B[Backend + infra] --> N[Navigation + five-person test] --> K[Core build] --> H[Security audit] --> O[Ship + operate]
  O -. retro upgrades the global layer .-> R
  subgraph AO [Always-On rails under every phase]
    direction LR
    A1[Verification] --- A2[Words] --- A3[Real data] --- A4[Budgets] --- A5[Instrumentation] --- A6[Orchestration] --- A7[Prompt library]
  end
```

## The Laws
<!-- origin: added -->

Twelve GLOBAL laws. Every template applies at least one, and the Toolkit and Anti-patterns sections only add what this table doesn't already cover.

| # | Law | Mechanism | Do | Prevents | Template |
|---|---|---|---|---|---|
| 1 | Context beats cleverness | The model conditions only on its window; a missing fact becomes a guess, and guesses come from the average | "@.offthemode/PRODUCT.md @src/auth/. Onboarding for {{PERSON}}; first result inside PRODUCT.md's time-to-value budget; reuse the session model" | Persona prompts that change tone, not facts | Session Start (`/start`) |
| 2 | The mode is the default | For an underspecified request, the most typical answer is the correct one | "No hero. First viewport is the product on sample data. One display face. Colour strategy per DESIGN.md." | Hero, three cards, Inter, gradient | Constraint Stack |
| 3 | Reasons generalize, bare rules don't | A reason carries the principle to cases you didn't name | "Don't derive state in effects: it adds a render with stale values and a second source of truth." | Rules obeyed to the letter, missed in spirit | Every AGENTS.md standard |
| 4 | Show, don't adjective | "Modern, clean, premium" sat next to millions of templates, so they decode to them | "Headline --text-display, body --text-base, two weights; motion --dur-quick with --ease-out, transform and opacity only; take refs/04.png's whitespace, not its colours" | Adjective soup | Anchor to References |
| 5 | Plan before code | Once code exists, the model reads it as evidence and defends it | Heavy lane: plan mode, two architectures with tradeoffs, no code | Sunk-cost patching | `/slice` |
| 6 | Verification is the prompt | An agent can only fix what it can observe | "Screenshot / at {{?VIEWPORTS}} before and after; done = audits clean, typecheck and e2e green" | "Should work" | Prove It Works (`/prove`, `/ship`) |
| 7 | One concern per turn, fenced | With several goals the easiest wins; anything unfenced reads as fair game | "Only the refresh race in src/auth/refresh.ts. If the fix needs other files, stop and say why." | 14-file diffs you can neither review nor revert | Change Request (`/cr`) |
| 8 | Context is a budget, and it rots | Dead attempts left in history get repeated; auto-compaction decides what's forgotten | `/handoff`, `/clear`, `/start`; `/compact <focus>` only mid-task | The marathon session | Session End Handoff |
| 9 | Diverge, then converge, never in one step | One request samples the mode; a generator grading its own options picks its favourite | Options forced apart on axes you assign, built in separate contexts, compared by a critic; you choose | Three fonts on one idea | Three Divergent Directions |
| 10 | Every repeated correction becomes a standing rule | A correction in chat dies with the session | Second strike: LESSONS entry, then an AGENTS.md rule, then a check | Re-prompting the same fix | Session End Handoff, step 3 |
| 11 | Make the agent interview you | Every unstated decision gets a silent default, and silent defaults are the mode | Batched, numbered questions with defaults before any plan | Plans built on guesses | Interview Me First (`/interview`) |
| 12 | Product before technology | Without a person, job and moment, the model optimizes for completeness; with them it can rank, hide and infer | "90% keep the defaults. One control (quiet hours on/off), infer the schedule, everything else behind one disclosure." | Feature piles | Feature Kill List |

## Product-First Doctrine
<!-- origin: added -->

> **Output:** five written product decisions with evidence, the product rules in `~/.claude/CLAUDE.md` §Product first, the UX contract in `.offthemode/PRODUCT.md` with a script assertion per property, and a mapped moment of value.

This is not a phase. It's the lens applied before the rules are final and again at every gate. Ask for "a project management app" and you get the most common one. Pin the request to one person, one moment and one job, and the recalled answer stops fitting, so the model has to derive a product instead of retrieving one.

| Decision | Reject | Usable |
|---|---|---|
| Person (who, in what situation, with what open) | "Creators", "teams" | "Solo podcast editor, 1am, 3 raw files, 9am deadline" |
| Job (when __, I want __, so I can __) | "Manage content" | "When a raw take lands, I want dead air gone, so I can publish tonight" |
| Moment of value (and time to reach it) | "After onboarding" | "Waveform collapses to the clean cut within 40 s of the drop, no signup" |
| The one thing (10x better than anything else) | Six strengths | One sentence; everything else is parity or absent |
| Refusals (what it won't do, even when asked) | Nothing | "No multitrack mixing. No collaboration in v1." |

Every decision carries its evidence: **observed** (you watched someone do it), **heard** (someone told you), or **assumed**. Each assumed Person, Job or Moment row is copied into RISKS.md, because every downstream template treats PRODUCT.md as fact, and a fictional person makes every later gate pass for the wrong reason.

Each decision also becomes a technical constraint. "40 s, no signup" means anonymous sessions, resumable uploads and streamed results, written into PRODUCT.md §Tech consequences so P4 inherits them. Agents help by adding, and the global rules (P0) push back: no feature without a job, ideas arrive as ranked bets, the design that asks fewer questions wins, and any conflicting PRODUCT.md line gets quoted before acting. That quoting rule turns a vague value into a lookup, which models do reliably.

"Top of the game" UX has to be testable, or the agent can't aim at it. An agent driving a browser can't measure a 100 ms tap (one tool round-trip takes longer than that) and "one-handed" isn't observable, so each property gets a script assertion. The numbers live in `.offthemode/BUDGETS.md` and nowhere else.

| Property | Spec | Verify by |
|---|---|---|
| Speed | Input feedback, LCP, INP and CLS inside BUDGETS.md on a mid-tier phone; no loading indicator before the BUDGETS.md indicator delay | `audit-ux`: Event Timing max duration on the core journey under 4x CPU throttle; Lighthouse CI in the lab (TBT stands in for INP, which only exists in the field); web-vitals RUM after launch |
| Optimistic + undo | Mutations render instantly and roll back inline; confirm only effects that leave the system | e2e: `context.setOffline(true)` mid-action, assert rollback and inline undo; every confirm dialog is listed in PRODUCT.md with its reason |
| Zero dead ends | Every empty, error, offline, 404 and no-permission state has one next action | State-switcher screenshots of every state; Walk Every Flow |
| Keyboard / thumb first | Palette and visible shortcuts on web; the primary action in the BUDGETS.md thumb zone on phones | e2e runs the core job keyboard-only; `audit-ux` asserts exactly one visible `[data-primary]` per surface, its centre inside the thumb zone and its box at least the target size |
| State survives | View state in the URL, drafts autosave, reload and back return to the same place | e2e reloads at every core-flow step and compares URL and visible state |
| Respect attention | No nags, marketing modals or interstitials | e2e fails on any dialog or overlay the test didn't trigger |

```prompt title="Feature Kill List"
Read .offthemode/PRODUCT.md and .offthemode/COMPLEXITY.md. Inventory every user-facing capability in {{SCOPE: codebase | roadmap | spec at PATH}}.
One row each: Capability | Job served (quote PRODUCT.md, or NONE) | Serves the one thing? | Actions it adds to default surfaces | Evidence of use | Verdict.
Verdicts: CORE (produces the moment of value; keep and deepen), PARITY (expected; minimal version, move to L2/L3), DEFER (plausible, no evidence; remove and log under Bets with a kill criterion), KILL (no job, contradicts a Refusal, or duplicates a path). When torn, pick the harsher verdict and say so.
Then: default-surface action count before and after, and a deletion plan (routes, components, flags, columns, tests) ordered so nothing breaks. Delete nothing until I approve.
```

```prompt title="Moment of Value Map"
Map the path from first contact ({{LANDING_PAGE | STORE_INSTALL | SHARED_LINK | INVITE}}) to {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), walking it as {{?PERSON}} on {{?DEVICE}} with {{CONTEXT: one hand, flaky 4G, ninety seconds of patience}}. If the app runs, drive it with the browser or simulator tool and time it with the audit-ux journey; otherwise walk the spec.
Per step: what they see, decide, type, wait for, and what could make them leave. Totals: steps, decisions, inputs, wait, time to first wow against the PRODUCT.md budget.
Redesign to hit the budget, naming the mechanism behind every cut: defer (account after value), infer (locale, currency, intent from entry point or pasted content), default (the 80% option, changeable in context), preload (sample or imported data), parallelize (start work during the previous step).
Output the new path, new totals and each cut's tech consequences; append those to PRODUCT.md §Tech consequences.
```

## P0 · Constitution
<!-- origin: yours -->

> **Output:** `~/.claude/CLAUDE.md` (global, with a kit-mode switch and lanes), `AGENTS.md` + a thin `CLAUDE.md` (project), directory packs, the context log (`.offthemode/STATE.md`, `DECISIONS.md`, `LESSONS.md` + `LESSONS.index.md`, `GLOSSARY.md`, `LOG.md`), `.claude/settings.json` with every hook, and three rituals.

The constitution is everything the agent knows before you type a word, so every prompt you send gets multiplied by it.

> **Why:** Standing rules shift the output distribution once, so you stop re-steering in every prompt. But always-loaded text competes with the task for attention, and each extra instruction slightly weakens adherence to all the others. Writing a constitution is a budgeting problem: the most steering per token.

| Layer | Where | Loads | Belongs there |
|---|---|---|---|
| Global | `~/.claude/CLAUDE.md` (~50 lines) | Every session, every repo | Kit-mode switch, lanes, product stance, engineering floor, done, memory |
| Global design | `~/.claude/design/` (TASTE, BANS, RUBRIC, USED, anchors) | Imported by UI packs only | Your taste and the only ban list |
| Project | `AGENTS.md` (80-120 lines), imported by a thin `CLAUDE.md` | Every session in the repo | Mission, non-negotiables, stack, boundaries, commands, done, docs map |
| Imports | `@.offthemode/X.md` inside AGENTS.md | At launch, with the importing file | Only what every action needs: glossary names, lessons index, security |
| Directory packs | `{{UI_DIR}}/AGENTS.md`, plus a sibling `CLAUDE.md` holding `@AGENTS.md` | When the agent reads files in that subtree | Design system, bans, expert profiles, path-specific lessons |
| Docs | `.offthemode/*.md` by plain path | When opened | Product, skeleton, architecture, routes |
| Skills / subagents | `~/.claude/skills/`, `~/.claude/agents/` | On match / on invocation, own context | Procedures; critics |
| Hooks | `.claude/settings.json`, `.cursor/hooks.json` | On events, no model judgment | Whatever must not depend on the model remembering |

> **Rule:** `@path` means "load now, every time". A plain path means "read when relevant". Imports resolve relative to the importing file, nest up to four hops, and `@~/...` pulls from your home directory (Claude Code asks once per project before loading imports from outside the repo). Imports organize; they don't shrink, because everything imported loads at launch. Most bloated setups `@`-import the whole docs folder and then wonder why rules get ignored. Domain depth goes in directory packs, which load only in their subtree; Claude Code's `.claude/rules/*.md` with `paths:` frontmatter does the same for globs that don't map to one directory.

Current Claude Code reads AGENTS.md by itself only when no CLAUDE.md exists on the path. The kit keeps a CLAUDE.md whose first line imports AGENTS.md, which works in every session and never loads the file twice. Cursor and most other agents read AGENTS.md, including nested ones, natively.

Anything you'd write again in the next repo is GLOBAL. Anything that names a version, a domain term or a folder is PER-PROJECT. Four parts do most of the work and are usually the ones missing: opinions **with reasons** ("no raw hex, because the design system must stay editable in one place" also stops raw spacing), bans **with replacements** (a bare ban leaves the next-most-probable option), an uncertainty policy **split by reversibility**, and a definition of done that includes **seeing the result**.

The global file also has to behave in repos that aren't built on the kit: client work, an OSS pull request, a one-off script. So its first line is a switch, and the ritual scales by lane. Without both, every quick task in a foreign repo stalls on "run Interrogate My Vision first", and backend sessions spend attention on gradient bans.

> **Trap:** The mission and stack come from P1. Draft AGENTS.md in P0 with placeholders and lock it after P1. Never let the agent guess a stack just to fill the template.

```file path="~/.claude/CLAUDE.md"
Global constitution. Kit mode applies only if .offthemode/PRODUCT.md exists at the repo root. Outside kit mode, follow only Lanes, Depth, Engineering floor, Uncertainty, Done and Voice, and never ask to run kit rituals. A project AGENTS.md or CLAUDE.md wins on conflict (say when it does).

### Lanes (name the lane in your first line; I can veto)
- Trivial: one file, under ~30 lines, no contract, schema or dependency change. Do it, verify, one-line report.
- Standard: plan inline in your first reply, then proceed unless I object.
- Heavy: schema, auth, payments, a public contract, a new dependency, or more than 3 files. Plan mode; wait for "go".

### Product first (kit mode)
- No feature without a job. A proposal states person, job (quoted from .offthemode/PRODUCT.md), the moment it improves, and its cost against .offthemode/COMPLEXITY.md. Ideas arrive as ranked bets (job, effect, cost, kill criterion), never bare feature lists. A task that traces to no person, job or moment: ask why.
- Complex inside, simple outside: infer, default, disclose progressively, undo instead of confirm. Never hand the user a decision the system could make. When two designs tie, the one that asks fewer questions wins.
- One primary action per surface. Stunning comes from restraint, typography, motion and one signature moment, never decoration.
- If a request contradicts a PRODUCT.md Refusal or Principle, quote the line before acting. I can override; you cannot silently comply.
- Speed, undo and state survival are features; regressions in them are bugs.
- UI work: read .offthemode/DESIGN.md, ~/.claude/design/TASTE.md and ~/.claude/design/BANS.md first. If what you are about to produce could sit on any other product unchanged, stop and say so.

### Depth
- Reason like the people who designed the tools: specs, RFCs, platform docs, the installed source. Not tutorials, not memory.
- When library behavior matters, open the installed version's types or source and cite file:line; your memory may be a major version old.
- Platform before dependency. A new dependency needs a DECISIONS.md entry: what it does that 50 lines of ours can't, weight, removal cost.

### Engineering floor
- No escape hatches from the type system (any, force-unwrap, !!, dynamic, unchecked casts) without a comment giving the reason. Errors typed and surfaced, never swallowed. Smallest diff that fully solves the task; drive-by refactors become follow-ups.
- Accessibility is not a phase: semantic elements, visible focus, reduced motion, target sizes and contrast per the project's BUDGETS.md (platform minimums and WCAG AA when there is none).
- Security is not a phase: authorization at the data layer, no secrets in client code or logs, input parsed at every boundary.

### Uncertainty
- Reversible and local: decide, log it as "assumed" in DECISIONS.md, continue.
- Heavy-lane items and anything against a Refusal: stop and ask.
- Questions: batched and numbered, max 5 per round, each with your recommended default, so I can reply "1 ok, 2 b, 3 yours".

### Done means verified
Checks pass, the app ran, UI changes were screenshotted at the project's viewports (or on the simulator) and compared against DESIGN.md, no new console errors. A completion report starts with the literal line "DONE: <lane> · <summary>", then what you verified and how. Questions, plans, checkpoints and "stopping for review" never start with DONE:. "Should work" is not done.

### Memory (kit mode)
Start: STATE.md is injected; read the docs the task touches, then state lane, next step and plan. End (Standard and Heavy): rewrite STATE.md, append DECISIONS and one LOG line, commit. Corrections: on the first, note it in STATE.md §Corrections seen once; on the second, write the LESSONS entry and its index line.
Headless runs (KIT_BATCH=1): skip the start and end ritual and the go-gate, never write .offthemode/STATE.md, report only in your output.

### Voice
Direct and dense. No praise, no recap of my message. Disagree when you have a reason.
```

```file path="AGENTS.md"
{{PROJECT_NAME}}: {{THESIS_ONE_SENTENCE}}
Tier {{weekend | product | complex}} · Platforms {{web | iOS | Android}} · Stack pack {{web-ts | expo | swift | kotlin | flutter}} · Phase: see .offthemode/STATE.md
Read before the first edit of every session: @.offthemode/GLOSSARY.md @.offthemode/LESSONS.index.md @.offthemode/SECURITY.md (Claude Code imports these; other agents open them.)

### Mission
Build {{PRODUCT}} for {{PERSON}} so they can {{JOB}}. Moment of value: {{MOMENT_OF_VALUE}}, within the PRODUCT.md time and action budget. Every change makes that moment faster, clearer or more reliable; if it does none of these, question it first.

### Non-negotiables
1. {{NON_NEGOTIABLE}} (e.g. the core loop works offline and syncs later)
2. {{NON_NEGOTIABLE}} (e.g. first useful result inside the BUDGETS.md cold-start budget on a mid-tier phone)
3. One primary action per surface; every surface inside its .offthemode/COMPLEXITY.md budget.
4. Authorization enforced at the data layer, never only in the UI. No secret in the repo, bundle or logs.

### Stack (pinned; changing it needs a DECISIONS.md entry)
| Layer | Choice | Version | Why |
|---|---|---|---|
| Client | {{FRAMEWORK}} | {{VER}} | {{WHY}} |
| Styling | {{STYLING}} | {{VER}} | tokens in src/styles/tokens.css |
| Server + data | {{SERVER}} + {{DB}} via {{DATA_LAYER_OR_SYNC_ENGINE}} | {{VER}} | {{WHY}} |
| Auth | {{AUTH}} | {{VER}} | {{WHY}} |
| Runtime | local {{LOCAL}} -> hosted {{HOST}} | | same config shape in both |
Check the installed version's types before using any API from these.

### Architecture boundaries
~~~text
{{SOURCE_TREE, e.g.
apps/web, apps/mobile   surfaces only
packages/ui             tokens + primitives
packages/features/*     one folder per capability
packages/domain         entities and invariants, no I/O
packages/infra          db, queue, storage, external APIs
packages/core           the core engine, behind a contract}}
~~~
- Dependencies point inward: surfaces -> features -> domain; infra implements interfaces the domain defines.
- All I/O goes through infra adapters, so local -> hosted is configuration, not code.
- The core is reached only through {{CORE_INTERFACE}} (.offthemode/SKELETON.md §Core contract), so it iterates without touching routing, auth or data access.

### Code standards (each with its reason)
- Discriminated unions, not boolean flags: impossible states become unrepresentable.
- Parse external input at the boundary with {{SCHEMA_LIB}}, then trust types: one place validates.
- Colocate by feature: one task = one folder in context. Names from .offthemode/GLOSSARY.md: one term per concept keeps code, copy and prompts aligned.
- Visual values only from tokens: the design system stays editable in one place.

### Banned -> instead
| Banned | Instead | Why |
|---|---|---|
| casts to silence the compiler | fix the type | casts hide real bugs |
| catch, log, continue | typed error result, or rethrow with context | silent corruption |
| fetching inside view components | feature loaders over infra | one place for cache, retry, errors |
| string literals for routes, events, keys | typed constants | safe refactors |
| {{STACK_SPECIFIC_BAN}} | {{REPLACEMENT}} | {{REASON}} |

### Commands
Fast check `{{CHECK_CMD}}` (types, lint, unit) · full `{{CHECK_FULL_CMD}}` · lint one file `{{LINT_FILE_CMD}}` · dev `{{DEV_CMD}}` at {{APP_URL}} · screenshots `{{SHOTS_CMD}}` · audits `{{AUDIT_CMD}}` · evals `{{EVAL_CMD}}` · env check `{{ENV_CHECK_CMD}}` · end-to-end `{{E2E_CMD}}` · dead code `{{DEADCODE_CMD}}` · bundle size `{{BUNDLE_CMD}}` · profile build `{{PROFILE_CMD}}` · logs `{{LOGS_CMD}}` · viewports {{VIEWPORTS}} (e.g. 390x844, 1440x900)

### Lanes
Trivial, Standard (`/cr`) and Heavy (`/slice`) as defined in the global rules. Heavy here also covers: {{PROJECT_HEAVY_PATHS}}.

### Definition of done
- [ ] `{{CHECK_CMD}}` green; new logic tested; every bug fix starts with a failing regression test
- [ ] App run; UI changes screenshotted at every viewport above, light and dark; `{{AUDIT_CMD}}` clean; checked against .offthemode/DESIGN.md
- [ ] Every state handled on every surface touched (.offthemode/ROUTES.md §State inventory); no new console errors
- [ ] Standard and Heavy: STATE, DECISIONS, LOG updated; one logical commit on `{{feat|fix|chore}}/{{slug}}`. Never commit .env*, force-push main, or skip hooks
- [ ] The report's first line is "DONE: <lane> · <summary>"

### Working method
- If my request conflicts with this file or PRODUCT.md, say so first. Search DECISIONS.md before re-deciding anything.
- Parallel sessions: one worktree, port, database and task each.

### Docs map (open when relevant; do not preload)
.offthemode/PRODUCT.md (before any UX decision) · SKELETON · COMPLEXITY · DESIGN + design/ · ARCHITECTURE · ROUTES · SECURITY · RISKS · VOICE · BUDGETS · TRACKING · agents/pins.md · LESSONS.md (full entries)
```

```file path="CLAUDE.md"
@AGENTS.md

Claude Code specifics
- A SessionStart hook injects .offthemode/STATE.md, lines 1-30 of .offthemode/PRODUCT.md and the tail of .offthemode/LOG.md, and re-injects them after /compact.
- Hooks lint every edit, run the ban lint, guard shell commands, and on a DONE: report block while checks fail or STATE.md is stale. Fix the cause; never work around a hook.
- Never review your own work: inventor-critic reviews plans and diffs; design-critic judges rendered UI. Both are global subagents.
```

```file path="{{UI_DIR}}/AGENTS.md"
UI pack. Loads when you work under this directory: natively in Cursor and other AGENTS.md-aware agents, and in Claude Code through the sibling CLAUDE.md.
Read first: @{{PATH_TO_ROOT}}/docs/DESIGN.md @~/.claude/design/TASTE.md @~/.claude/design/BANS.md @~/.claude/experts/expert-web-platform.md @~/.claude/experts/expert-{{FRAMEWORK}}.md @{{PATH_TO_ROOT}}/docs/agents/pins.md
- Before a visual change run {{SHOTS_CMD}}; after it, run it again plus {{AUDIT_CMD}}, and have design-critic judge the pair.
- Hover may only reveal actions that are also reachable by selection, context menu or long-press, and the palette.
- Lessons that apply only here: {{L-ID}}: {{ONE_LINE_IMPERATIVE}}
```

```file path="{{UI_DIR}}/CLAUDE.md"
@AGENTS.md
```

The backend twin, `{{API_DIR}}/AGENTS.md`, imports `expert-backend.md` and `.offthemode/ARCHITECTURE.md` the same way, with the same one-line sibling CLAUDE.md. Because the canonical pack is a nested AGENTS.md, Cursor and other agents read the same file; `.cursor/rules/*.mdc` is only for glob-scoped extras that don't map to a directory. A team repo that can't rely on everyone's `~/.claude/` vendors the global files with a sync script and never edits the copies.

### The context log

The agent has no memory between sessions, so the repo is its memory. STATE is rewritten, not appended, because the next session needs the present, not a diary. The glossary matters more than it looks. When "space", "workspace" and "project" all float around, the agent builds three models, three routes and inconsistent copy. Only the short files are imported. Full lesson entries and term definitions are read on demand, because LESSONS grows exactly where adherence degrades.

| File | Job | Write pattern |
|---|---|---|
| `.offthemode/STATE.md` | Where we are, what's next: the handoff | Rewritten at every Standard or Heavy session end |
| `.offthemode/DECISIONS.md` | Chosen, rejected, why | Append-only, D-### |
| `.offthemode/LESSONS.md` + `LESSONS.index.md` | Agent mistakes turned into rules; the index (one line each) is what loads | Appended on the second strike, then promoted or pruned |
| `.offthemode/GLOSSARY.md` | A plain summary anyone can read, then one word per concept in code, UI, analytics, prompts (definitions live in SKELETON.md §Domain model) | Summary by `/glossaryrevisit`; terms edited when language changes |
| `.offthemode/LOG.md` | One line per CR or session: date · id · summary · commit | Append-only; tail injected at start |

```file path=".offthemode/STATE.md"
STATE · updated {{YYYY-MM-DD}} · branch {{BRANCH}} · phase {{P#}} · session {{N}} · under 40 lines, rewritten every Standard or Heavy session end

### Now
{{Two to four sentences of present truth: what works end to end, what is half-built, what is broken.}}

### Next (item 1 is where the next session starts)
1. {{STEP}} ({{lane}}): done when {{CHECK}}

### In flight
- {{AREA_OR_FILE}}: {{what changed, what is left}}

### Waiting on me / Known broken or unverified / Do not touch
- {{ITEM}}: {{why, how to reproduce, or reason}}

### Corrections seen once (a second strike becomes a LESSONS entry)
- {{CORRECTION}} · {{DATE}}
```

```file path=".offthemode/DECISIONS.md"
DECISIONS · append-only, newest at the bottom; superseded entries stay, marked.

### D-{{NNN}} · {{Title}} · {{YYYY-MM-DD}} · {{decided | assumed | superseded by D-###}}
Context: {{what forced a decision}} · Decision: {{what we do}}
Rejected: {{OPTION_A}} ({{why not}}); {{OPTION_B}} ({{why not}})
Because: {{the reason, tied to PRODUCT.md, an NFR or a spike result}} · Revisit if: {{condition}}
```

```file path=".offthemode/GLOSSARY.md"
GLOSSARY · imported every session. Two parts: a plain summary for people (/glossaryrevisit owns it; under 300 words) and the term list for code and copy (under ~40 rows; each term's definition and invariant live in .offthemode/SKELETON.md §Domain model).

## In plain words
Last revisited: {{DATE}}. For anyone: a new teammate, an investor, your family. No technical words.
- What it is: {{two or three sentences a twelve-year-old could follow}}
- Who it's for: {{the person, in everyday terms, and the moment they reach for it}}
- The problem: {{what is hard, slow or annoying for them today, in their words}}
- What it does: {{three to five short lines, each saying what the person can do, never how it's built}}
- Where we are: working today, {{what a person can actually do now}}; coming next, {{the next thing they'll be able to do}}
- What we're trying to achieve: {{the change in someone's work or life if this succeeds}}
- Words you'll hear: {{product word}}: {{what it means, in a short phrase}}

## Terms
| Term | Never call it | In code | In UI |
|---|---|---|---|
| {{TERM}} | {{SYNONYMS_TO_AVOID}} | `{{TypeName}}` | {{user-facing word}} |
```

```file path=".offthemode/LESSONS.index.md"
LESSONS INDEX · imported every session: one line per lesson (id · imperative · where it applies). Full entries in .offthemode/LESSONS.md, read on demand. A lesson that applies to one directory moves into that directory's AGENTS.md instead.
L-001 · Open the installed package's types before using a {{FRAMEWORK}} API · {{GLOB}}
```

```file path=".offthemode/LESSONS.md"
LESSONS · rules born from real mistakes, written on the second strike: imperative, specific, with reason and check. Broad and stable -> promote to AGENTS.md. Checkable -> make it a lint rule, test or hook, then delete it here and from the index. Under ~40 entries.

### L-001 · Verify APIs against the installed version · {{YYYY-MM-DD}}
Rule: Before using a {{FRAMEWORK}} API, open its type definitions in the installed package.
Because: Used an API removed in the current major; took three rounds to compile.
Check: typecheck; grep for {{REMOVED_API}}.
```

### Enforce it with hooks

A rule is a request; a hook is an exit code. One settings file wires every hook in this blueprint. **SessionStart** prints the handoff and the north star, and its output becomes context; its matcher includes `compact`, so it re-injects right after a lossy summary. **PreToolUse** guards shell commands (P7). **PostToolUse** lints each edited file and runs the ban lint (Always-On · Verification Loop, P3); the edit has already happened, so exit code 2 there shows stderr to the agent as work to do rather than blocking. **Stop** gates a completion claim. Current Claude Code has some thirty hook events (the hooks reference lists them); the kit uses these four, plus `InstructionsLoaded` when you need to log which instruction files actually loaded. The deny rules cover real env files and leave `.env.example` readable.

Stop fires at the end of every turn, not only when the agent thinks it's done. A hook that blocks whenever the tree is dirty would override every human checkpoint in the kit: "stop for my review after step 2" becomes a forced step 3, and "schema: stop and ask" becomes the agent deciding the schema because typecheck went red mid-change. So `before-done.sh` gates only a reply whose first line is `DONE:`. Questions, plans and checkpoints pass straight through, and headless batches (`KIT_BATCH=1`) skip it entirely.

```file path=".claude/settings.json"
{
  "permissions": {
    "allow": ["Bash({{TEST_CMD}} *)", "Bash({{LINT_CMD}} *)", "Bash(git status)", "Bash(git diff *)", "Bash(git add *)", "Bash(git commit *)"],
    "ask": ["Bash(npm install *)", "Bash(pnpm add *)", "Bash(pip install *)", "Bash(git push *)", "Bash(curl *)", "Edit({{MIGRATIONS_DIR}}/**)"],
    "deny": ["Read(./.env)", "Read(./.env.local)", "Read(./.env.production)", "Read(./secrets/**)", "Read(~/.ssh/**)", "Read(~/.aws/**)"]
  },
  "hooks": {
    "SessionStart": [{ "matcher": "startup|resume|clear|compact", "hooks": [{ "type": "command",
      "command": "cd \"$CLAUDE_PROJECT_DIR\" && cat .offthemode/STATE.md 2>/dev/null; head -n 30 .offthemode/PRODUCT.md 2>/dev/null; tail -n 15 .offthemode/LOG.md 2>/dev/null; true" }] }],
    "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/guard-bash.sh" }] }],
    "PostToolUse": [{ "matcher": "Edit|Write", "hooks": [
      { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/after-edit.sh" },
      { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/lint-bans.sh" } ] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/before-done.sh", "timeout": 300 }] }]
  }
}
```

```file path=".claude/hooks/before-done.sh"
#!/usr/bin/env bash
# Stop hook. Gates only an explicit completion claim: a reply whose first line starts with "DONE:".
# Blocks while the fast check fails, or (Standard, Heavy) while code changed but .offthemode/STATE.md did not.
# Exit 2 sends stderr back to the agent. A clean tree passes: pre-commit already ran the same check. Needs jq; chmod +x.
input="$(cat)"
[ -n "$KIT_BATCH" ] && exit 0                                    # headless batches: CI and the batch log verify instead
[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
last="$(printf '%s' "$input" | jq -r '.last_assistant_message // empty')"
if [ -z "$last" ]; then                                          # older versions: read the transcript
  tp="$(printf '%s' "$input" | jq -r '.transcript_path // empty')"
  last="$(jq -rs '[.[] | select(.type == "assistant") | .message.content[]? | select(.type == "text") | .text] | last // ""' "$tp" 2>/dev/null)"
fi
first="$(printf '%s' "$last" | awk 'NF { sub(/^[[:space:]]+/, ""); print; exit }')"
case "$first" in DONE:*) ;; *) exit 0 ;; esac                   # questions, plans and checkpoints pass through
cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -z "$(git status --porcelain -- . ':!docs' ':!.claude' 2>/dev/null | head -n1)" ] && exit 0
if ! out="$({{CHECK_CMD}} 2>&1)"; then
  printf 'You reported DONE: but checks fail. Fix, then report again:\n%s\n' "$(printf '%s' "$out" | tail -40)" >&2
  exit 2
fi
case "$first" in "DONE: trivial"*|"DONE: Trivial"*) exit 0 ;; esac
if [ -z "$(git status --porcelain -- .offthemode/STATE.md 2>/dev/null)" ]; then
  echo "You reported DONE: but .offthemode/STATE.md is unchanged. Update Now/Next/In flight; append DECISIONS and one LOG line if anything is new." >&2
  exit 2
fi
exit 0
```

> **Pro move:** The same four scripts run in Cursor from `.cursor/hooks.json` (The Portable Kit, Tool adapters), and every other agent gets them as pre-commit and CI steps, so the rituals below are the only manual fallback. They ship as global commands in `~/.claude/commands/` (`/start`, `/handoff`, `/constitution` and the rest of the loop). Run `/clear` between unrelated tasks, because chat history is not storage.

```prompt title="Draft the Constitution"
Set up the constitution for {{PROJECT_NAME}}: the standing rules every future session in this repo follows. My global rules are already loaded; do not repeat them.
Inputs: {{@.offthemode/PRODUCT.md and @.offthemode/SKELETON.md if they exist, otherwise RAW_NOTES}}
Interview me first, in rounds of at most 5 numbered questions, each with your recommended answer and a one-line reason. Cover in order: mission and moment of value; non-negotiables; platforms, stack pack and versions; boundaries and where the core engine sits; stack-specific bans; the exact check, lint-one-file, dev, screenshot, audit, eval, env and log commands, and the viewports; project-specific Heavy-lane paths. Stop when you could predict my answer to a new question in each area.
Then write: AGENTS.md from the template (80-120 lines; every standard with its reason, every ban with its replacement; delete any line that could appear in any repo); CLAUDE.md; one directory AGENTS.md plus a one-line CLAUDE.md per domain pack; GLOSSARY.md seeded with 10-20 domain terms (names only; definitions into SKELETON.md §Domain model); STATE.md; DECISIONS.md with a D-### per stack choice including rejected alternatives; empty LESSONS.md, LESSONS.index.md and LOG.md; settings.json and hooks with placeholders filled.
Tag anything I did not confirm [assumed]. Show every file before committing.
```

```prompt title="Session Start"
New session. .offthemode/STATE.md is in your context; if not, read it. Task: {{TASK, or "item 1 of Next in STATE.md"}}.
Reply with: (1) the lane, and where we are in two sentences, in your own words; (2) the step you will do now and its done-check; (3) the plan in at most 7 bullets, the files you will touch, and the DECISIONS or LESSONS entries that constrain it (read full LESSONS entries only for index lines that match); (4) how you will verify: commands, audits, screenshots, devices; (5) batched questions with defaults, or "no questions".
Trivial or Standard: proceed unless I object. Heavy: wait for "go".
```

```prompt title="Session End Handoff"
End the session, in this order:
1. Rewrite .offthemode/STATE.md from scratch: present tense, no history. A fresh agent with zero chat context must be able to start item 1 of Next, so name files, commands, the lane and the done-check.
2. Append a DECISIONS.md entry for every decision made this session, including silent ones (mark those "assumed").
3. Classify every correction I made. First time: add it to STATE.md §Corrections seen once. Second time: write the LESSONS entry and its index line (or put it in the matching directory AGENTS.md if it only applies there). Personal taste or a universal standard: propose an exact ~/.claude/ line with its reason. Prompt defect: propose a diff to prompts/. A lesson violated again: propose a lint rule, test or hook.
4. List everything claimed but not verified under Known broken / unverified. The next session trusts this file.
5. Propose (do not apply) edits for any AGENTS.md rule that proved wrong, stale or conflicting.
6. Append one LOG.md line, run {{?CHECK_CMD}}, commit "{{type}}: {{summary}}" with D- and L- ids in the body.
Reply with a five-line summary and the proposed rule and prompt edits.
```

### Rules are a living system

Promote on the **second strike**: the first correction is noted in STATE.md, the second becomes a LESSONS entry. Then climb the **ladder**: LESSONS, then an AGENTS.md rule once it's broad and stable, then a deterministic check. Once the check exists, delete the prose, because the check is now the rule. When the same lesson shows up in two projects, it moves to `~/.claude/`. That's how the global layer comes to encode your taste. Prune at every milestone; in Claude Code, `/doctor prompt-audit` reads every instruction file and reports contradictions and references to files that no longer exist, and `scripts/kit-lint.sh` (Always-On · Accessibility & Performance Budgets) fails the commit when always-loaded context grows past its budget.
- [ ] Every line passes "would the agent do the wrong thing without this?"
- [ ] Every rule has a reason, every ban a replacement, no two conflict; rules now enforced by checks are gone from prose
- [ ] Emphasis (caps, "IMPORTANT") on three rules at most. If everything is loud, nothing is

> **Trap:** Rules rot silently. A rule about a library you already removed still takes attention and can pull the agent back toward the old pattern.

## Expertise Injection
<!-- origin: yours -->

> **Output:** the expert library in `~/.claude/experts/`, per-project `.offthemode/agents/pins.md` and profiles for project-only domains, the global `inventor-critic` subagent, the Inventor-Level Review ritual.

Your instinct is right: "senior developer" output is the median senior developer. A grander persona line is mostly placebo, though. The model already has the knowledge. What it lacks is a sense of which knowledge should win. You get inventor-level output by loading the inventor's judgment, not their job title.

| Lever | Effect | Apply it |
|---|---|---|
| Persona line ("you created JS") | Weak: tone, not tradeoffs | One line at most |
| Ranked values, opinions, refusals | Strong: constraints on every decision | Expert profile, loaded by a directory pack |
| Primary sources | Strong: the authority replaces the tutorial average | Spec sections in `.offthemode/refs/`, the installed package's source, "cite file:line, not memory" |
| Refusals first | Strong: failure modes enter context as things to avoid | "8 things an expert would refuse to ship here, 5 amateur mistakes; avoid all 13" |
| Adversarial second context | Strong: a reviewer with no stake | `inventor-critic` |
| First-principles derivation | Medium-strong: stops tutorial copying | "Derive from constraints (what must be true, minimal state, where truth lives), then name a pattern" |

> **Rule:** Profiles are GLOBAL judgment in `~/.claude/experts/`, imported by directory packs. The project never copies a profile; `.offthemode/agents/pins.md` adds only version pins and local exceptions, and a domain that exists in one project only (its core engine, say) gets its own `.offthemode/agents/expert-{{domain}}.md`. Split universal from framework: `expert-web-platform` holds what's true of the web, `expert-{{FRAMEWORK}}` what's true of React, SwiftUI or Compose. Write `expert-product.md` first, because its refusals are what enforce "simple outside".

```file path=".offthemode/agents/expert-{{domain}}.md"
**Expert: {{DOMAIN}}** · Load when {{GLOBS_OR_TASK_TYPES}} · Scope {{COVERS}}, not {{EXCLUDES}} · Pins {{TECH@VERSION}}
Work with the judgment of the people who designed {{CORE_TECH}}: why each feature exists, which tradeoffs they chose, what they consider misuse. This outranks generic "best practices" and your habits.
**Values (ranked; earlier wins):** 1. {{VALUE}}, because {{REASON_FROM_HOW_THE_TECH_WORKS}}
**Opinions (deviate only with a written reason):** Do {{X}}, because {{Y}}, instead of {{COMMON_ALTERNATIVE}}.
**Refuse to ship (stop and flag):** {{PATTERN}}: {{WHY_IT_FAILS}}. Instead: {{REPLACEMENT}}.
**Amateur tells:** {{WHAT_GIVES_AWAY_TUTORIAL_KNOWLEDGE}}
**Primary sources (read before guessing; cite section or file:line):** {{SPEC_OR_RFC}}; {{INSTALLED_PACKAGE_SOURCE_PATH}}
**Tie-breakers:** {{WHEN_VALUES_CONFLICT}}; reversible over clever; platform over library.
**Review questions:** {{QUESTION_A_CORE_MAINTAINER_WOULD_ASK}}
```

```file path=".offthemode/agents/pins.md"
PINS · per-project additions to the global expert profiles in ~/.claude/experts/. Never copy a profile here; improve the global one through a retro.

| Profile | Pin (tech@version) | Local exception, and why |
|---|---|---|
| expert-web-platform | {{FRAMEWORK}}@{{VER}} | {{e.g. no View Transitions: the embedding host strips them}} |
```

```file path="~/.claude/experts/expert-product.md"
**Expert: product and interaction.** Load for every user-facing change.
**Values (ranked):** 1. Time to the moment of value beats feature count; every step before it is a tax. 2. Inference over configuration; a setting is a decision the team failed to make. 3. Complexity is conserved (Tesler's law); the system carries it unless the user asks.
**Opinions:** one primary action per surface, rare actions behind one disclosure or the palette; undo over confirm (confirm only effects that leave the system); first run is the real job on seeded or imported data, never a tour; nouns stable, each verb identical on every noun; account after value, payment after habit, permission at the moment of need. Model-driven features: stream partial output; show what the system inferred and let the user correct it in place; never give a guess the same visual weight as a fact; quality is gated by evals, not by demos.
**Refuse to ship:** a second primary action; a setting the system could infer; an empty state with no next step; a confirm where undo would do; a feature with no job in PRODUCT.md; a tooltip tour; a dead end on any error, offline or no-permission state; an action reachable only by hover.
**Amateur tells:** "Dashboard" as a destination; a settings page that grows per feature; "Are you sure?".
**Primary sources:** .offthemode/PRODUCT.md, .offthemode/COMPLEXITY.md; Nielsen Norman Group's 10 usability heuristics; Apple HIG; Material Design 3.
```

```file path="~/.claude/experts/expert-web-platform.md"
**Expert: the web platform.** Load for UI, CSS, routing and client state on the web, beside the framework profile.
**Values (ranked):** 1. Platform first: HTML, then CSS, then JS; every layer you skip is behavior you now own. 2. One source of truth; derive, don't sync; the URL is state. 3. Perceived performance is UX: zero layout shift, no blocking spinners, input feedback inside BUDGETS.md.
**Opinions:** intrinsic layout (grid minmax/auto-fit, clamp() type), breakpoints only where content breaks; container queries for components (in every evergreen browser; add a fallback only if your support matrix is older); @layer reset, tokens, components, utilities; logical properties; <dialog>, popover, <details> and native validation before any component kit; View Transitions and scroll-driven animation as progressive enhancement (feature-detect `document.startViewTransition` and use @supports; without them the UI still works, just without the morph); motion on transform and opacity with prefers-reduced-motion honored; colocate state, lift on the second consumer; Intl before any formatting library. Check support against Baseline, not memory.
**Refuse to ship:** clickable divs; removed focus rings; media without dimensions; z-index outside the scale; animating width, height, top or left; state duplicated between the URL and a store.
**Amateur tells:** reflexive memoization; a global store for form state; aria-label instead of real labels.
**Primary sources:** WHATWG HTML; CSSWG drafts; MDN; WAI-ARIA APG; web.dev Baseline and Core Web Vitals.
```

```file path="~/.claude/experts/expert-{{FRAMEWORK}}.md"
**Expert: {{FRAMEWORK}}.** Load beside expert-web-platform (web) or expert-mobile (native) for code under {{FRAMEWORK_GLOBS}}. Generate it with Forge Expert Profile; never write it from memory.
**Values (ranked):** 1. {{e.g. React: render is a pure function of props and state; anything else is an effect that needs a reason}}
**Refuse to ship:** {{e.g. React: effects that set derived state (react.dev, "You Might Not Need an Effect"). SwiftUI: state owned by a view that doesn't render it. Compose: unstable lambdas recomposing a hot list}}
**Amateur tells:** {{FRAMEWORK_SPECIFIC_TELLS}}
**Primary sources:** {{the framework's own docs, RFCs and changelog; the installed source}}
```

```file path="~/.claude/experts/expert-backend.md"
**Expert: backend and distributed systems.** Load for API, data model, jobs, infra.
**Values (ranked):** 1. Correct under failure beats fast on the happy path; every call can time out, retry and duplicate. 2. The data model is the product; constraints live in the database, not only app code. 3. Boring technology until a measurement says otherwise.
**Opinions:** Postgres by default; a table plus cron before a queue, a queue before a new service; every mutation idempotent (key, or natural key + upsert); events leave through a transactional outbox, never dual writes; timeouts on every call, retries with backoff and jitter inside a budget; expand/contract migrations; money in integer minor units; UTC; errors as RFC 9457 problem details; one request ID through every log line; when the UX contract demands instant, offline or multiplayer, evaluate a sync engine before hand-building optimistic caches.
**Refuse to ship:** unbounded queries; N+1 in a hot path; retries on non-idempotent operations; secrets in code or logs; catch-log-continue; authorization only in the UI.
**Amateur tells:** microservices before team boundaries exist; an unreviewed ORM-generated schema; "indexes later".
**Primary sources:** PostgreSQL docs; RFC 9110; RFC 9457; Kleppmann, Designing Data-Intensive Applications; Google SRE book.
```

```file path="~/.claude/experts/expert-mobile.md"
**Expert: mobile (iOS, Android, cross-platform).** Load for screens, gestures, offline, native modules.
**Values (ranked):** 1. The core loop works offline and never blocks on the network. 2. Frame rate is a requirement; nothing runs on the UI thread that can run elsewhere. 3. The OS is the host: system navigation, gestures and type scaling are muscle memory; break convention only for the signature moment.
**Opinions:** optimistic UI over a local store with background sync and conflict rules decided up front; every screen deep-linkable, state restored after process death; primary action within thumb reach, targets at the HIG and Material minimums, safe areas and keyboard respected; test at the largest font scale and with reduced motion; haptics only where they carry meaning; cross-platform animations on the UI thread (native driver or worklets).
**Refuse to ship:** web feel (hover affordances, tiny targets); a custom back that breaks the system gesture; full-screen spinners in the core loop; permission prompts at first launch.
**Primary sources:** Apple Human Interface Guidelines; Material Design 3; Android "Guide to app architecture"; Swift API Design Guidelines; the framework profile.
```

```prompt title="Forge Expert Profile"
Build an expert profile for {{DOMAIN}} ({{CORE_TECH}}, used in {{STACK}} for {{PRODUCT_TYPE}}). Target: the judgment of the people who designed and maintain {{CORE_TECH}}, as expressed in their specs, design docs, RFCs, changelogs and source; not tutorial consensus.
1. Primary sources: cite only ones you are certain exist, mark others [VERIFY]; read local sources first ({{LOCAL_PATHS}}).
2. Values, ranked, each with the reason that follows from how the technology works.
3. 8-12 opinions as "do X, because Y, instead of Z"; at least 3 a typical senior developer would push back on, with the argument.
4. 5-8 refuse-to-ship patterns the core team would reject in review, each with its replacement.
5. Amateur tells, tie-breakers, review questions.
Every line must be checkable against code. Ban "clean code" and "best practices". At most 120 lines. Global domain: write ~/.claude/experts/expert-{{domain}}.md. Project-only domain: .offthemode/agents/expert-{{domain}}.md. End with the 3 opinions you are least sure of.
```

The critic runs as a subagent: its own context, so a deep review doesn't flood your session, and it never sees the builder's rationalizations. It lives only in `~/.claude/agents/`. A per-project copy is a fork that no retro ever updates; project specifics reach the critic through the docs it already reads.

```file path="~/.claude/agents/inventor-critic.md"
---
name: inventor-critic
description: Adversarial reviewer with creator-level judgment. Use proactively on every Heavy-lane plan, and on diffs that touch a contract, schema, auth or more than 3 files, before reporting done. Reviews only; never edits.
tools: Read, Grep, Glob, Bash
---
You are the harshest credible reviewer in this change's domain: someone who helped design the core technology and has seen every misuse of it. You did not write this code and have no stake in it. Find what is wrong; do not approve.
Read first: the expert profiles imported by the AGENTS.md of each touched directory, plus .offthemode/agents/pins.md; the root AGENTS.md; .offthemode/PRODUCT.md, COMPLEXITY.md, SECURITY.md; then the plan or diff (default: git diff main...HEAD).
Method:
1. Restate in 3 lines what the change is for and for whom. If you can't, that is finding #1.
2. Before reading closely, derive the minimal correct solution from the constraints (at most 10 lines of pseudocode). Any state, code or dependency beyond it needs a written justification, or it is a finding.
3. Check every refuse-to-ship item in the loaded profiles.
4. Failure paths: slow network, double submit, stale cache, empty and huge data, concurrent edits, offline, reduced motion, screen reader, unauthorized caller.
5. Security: authz on every data access, no client-side secrets, no PII in logs or events. Product: one primary action per surface; no complexity pushed onto the user that a default or inference would absorb.
6. Tests: do they assert behavior or mirror the implementation? Any weakened assertion, or snapshot updated without a spec change?
Run the full check from AGENTS.md Commands and include the tail.
Output: Verdict SHIP / FIX / RETHINK with one line why. Table: severity (blocker | major | minor) | file:line | what an expert sees | fix; max 12 rows, blockers first, no style nits unless they hide a bug. Then one thing done well, so it survives the refactor.
```

```prompt title="Inventor-Level Review"
Don't review your own work. Run the inventor-critic subagent on {{git diff BASE...HEAD | PLAN_FILE}}. For each finding: fix it, or rebut it in one line with evidence (file:line, a test, a measurement). Show the finding table with a resolution column. On sensitive paths, also run the same review headless on a different model ({{OTHER_MODEL_OR_AGENT_CLI}}) and diff the two tables; findings both raise are almost always real.
```

> **Pro move:** One profile per hard domain (rendering, sync, data model, native platform, the core engine), not one generic "senior dev". Run the critic on plans before any code exists, when mistakes are cheapest.

## P1 · Vision & Skeleton
<!-- origin: yours -->

> **Output:** `.offthemode/PRODUCT.md` (the vision, product-first, with evidence), `.offthemode/SKELETON.md` (what exists and how it connects), seeded `.offthemode/RISKS.md`, and a vision that passes the predict-my-call test.

An agent can't build your vision. It can only build what the text makes unambiguous. P1 turns the picture in your head into two documents precise enough that two different agents would build the same product from them. Adjectives are compressed pointers to the mode, so the documents use references with extraction notes ("take the type scale, not the color"), numbers and anti-goals instead. Two lines carry the most weight. The **moment of value** comes with a time budget and an action budget. **Complexity absorption** is where "extremely complex" and "minimalist" stop fighting. The first 30 lines of PRODUCT.md get injected into every session, so the north star lives there.

```file path=".offthemode/PRODUCT.md"
PRODUCT: {{PRODUCT_NAME}} · {{draft | locked}} · tier {{weekend | product | complex}} · {{web | iOS | Android}} · reviewed {{DATE}}
Lines 1-30 are injected every session: keep the north star here. Whole file under 150 lines. Evidence per claim: observed | heard | assumed; every assumed Person, Job or Moment line is also a RISKS.md row.

### Thesis
For {{PERSON}} who {{STRUGGLE}}, {{PRODUCT_NAME}} is the {{FRAME}} that {{THE_ONE_THING}}, unlike {{STATUS_QUO}}, which {{WHY_IT_FAILS_THEM}}.

### Person, job, moment
- Person: {{a specific person in a specific situation, with what they already have open}} · evidence {{observed | heard | assumed}}. Skill {{novice | practitioner | expert}} (sets default density). Uses today: {{TOOLS_AND_WORKAROUNDS}}.
- Jobs (max 3, ranked): 1. When {{SITUATION}}, I want to {{MOTIVATION}}, so I can {{OUTCOME}} · evidence {{}}.
- Moment of value: {{what they see or feel}}, within {{TIME}} of first open, at most {{N}} steps and {{N}} decisions before it; account required: {{no | yes, because}} · evidence {{}}.
- Signature moment (outsized polish): {{the one interaction people would screen-record}}.
- Not for: {{who we deliberately disappoint, and why}}.

### Refusals and tie-breakers
- We will not {{REFUSAL}}, because {{REASON}}.
- {{speed}} over {{completeness}}; {{inference}} over {{configuration}}.

### Feeling
| Adjective | Reference (product, object, print, film, place) | Take this | Not this |
|---|---|---|---|
| {{ADJ}} | {{REF}} | {{e.g. type scale, density}} | {{e.g. its palette}} |
Must never look or feel like: {{NEGATIVE_REFERENCES}}

### Complexity absorption
| Hard thing inside | How the user never sees it (default / inference / disclosure / undo) | Expert escape hatch |
|---|---|---|
| {{e.g. sync conflicts}} | {{auto-merge + visible history, never a dialog}} | {{history panel}} |

### Tech consequences
- {{e.g. "40 s from drop, no signup" -> anonymous sessions, resumable uploads, streamed results}}

### UX contract (performance and accessibility numbers live in BUDGETS.md)
| Property | Budget | Status |
|---|---|---|
| Time to first wow | {{}} | |
| Allowed confirm dialogs | {{LIST, each with its reason}} | |
| Offline | {{read-only | queued writes | none, because}} | |
| Instant (optimistic) mutations on core-journey actions | {{N of M}} | |
| Multiplayer / shared live state | {{yes | no}} | |
If offline writes, multiplayer, or instant mutation on more than half of core-journey actions: spike a sync architecture in P2 before choosing the API style (P4).

### Metrics, bets, constraints
Activation = {{DEFINITION}} · time to value < {{N}} · {{RETENTION_SIGNAL}} · guardrail {{what must never get worse}}
| Bet | Job | Expected effect | Complexity cost | Kill if |
|---|---|---|---|---|
Deadline {{}} · budget and infra {{}} · team {{}} · data and compliance {{}}
Open questions: {{QUESTION}} (blocks {{WHAT}})
```

The skeleton is artifacts, not prose. A prose spec lets the agent pattern-match to "an app like this", while tables, diagrams and invariants force specific decisions. Tagging each capability Core, Supporting or Generic tells the agent where to invent and where to use the boring, proven option, so novelty goes into the product instead of the auth screen.

> **Pro move:** Derive surfaces from the domain model and the journeys, never from "what apps have". The statistical-average app has Dashboard, Settings, Profile and Notifications. Yours might be one canvas and a command bar.

```file path=".offthemode/SKELETON.md"
SKELETON: {{PROJECT_NAME}} · tag every item [decided], [assumed] or [open]

### Domain model
~~~mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : "owns"
  ENTITY_B }o--|| ENTITY_C : "references"
~~~
Definitions (the invariant that makes each GLOSSARY term that thing): {{TERM}}: {{DEFINITION}}
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

### Stack and NFRs
Per layer: choice + version + why + rejected + path from local to {{TARGET_HOSTING}}, each a D-### in DECISIONS.md, pinned in AGENTS.md.
Performance and accessibility: BUDGETS.md (change the budget there, not here) · offline {{none | read-only | full sync}} · scale at 12 months {{users, rows, RPS}} · i18n {{locales, RTL}}

### Threat sketch (five minutes, now, not at the end)
Assets {{}} · actors {{anon, user, admin, other tenant, compromised client}} · authN {{}} · authZ model {{}} · PII fields {{}} · secrets live in {{}}
| Abuse case | Impact | Day-one mitigation |
|---|---|---|
| {{user reads another tenant's records by changing an id}} | {{}} | {{row-level authz in the data layer}} |

### Core contract (written by P2)
Inputs {{}} · outputs {{}} · latency and cost envelope {{}} · failure modes {{}} · streaming or partial {{}} · quality baseline (eval pass rate) {{}}

### Riskiest assumptions -> .offthemode/RISKS.md
- {{R-##}}: {{assumption}}
```

**Becoming sound.** (1) Dump the raw vision, messy is fine. (2) Run Interrogate My Vision, answer its rounds, then edit the PRODUCT.md draft by hand, because the document is yours. (3) Run the **predict-my-call test**: give a fresh session nothing but PRODUCT.md and ask it three things you never discussed ("first launch with no data?", "is there a settings page?", "what does an error look like?"). If it answers the way you would, the vision transfers; if it doesn't, the gap is in the document. The test proves the document carries *your* intent, not that the Person exists: that's what the Evidence column and the two human gates are for. (4) Run Generate the Skeleton, then Pre-Mortem, and the top risks feed P2.

> **Why:** Teach-back exposes misreadings while they cost one message instead of one week. Rival framings break anchoring: the model's first interpretation sticks unless it has to compare it against alternatives. The fresh-session test is the only honest check of the document, because the session you talked in knows things the document doesn't.

```prompt title="Interrogate My Vision"
You are my product partner and the most demanding product lead this idea will face: you have shipped category-defining products and killed far more features than you built. Find out whether I know what I am building. No code, no files yet.
Raw vision: {{RAW_VISION: brain dump, transcript, links, screenshots}} · References and what to take from each: {{REFERENCES}} · Platforms {{web | iOS | Android}} · Tier {{weekend | product | complex}}

Round 1, in order:
1. Teach-back: the product in at most 120 words, in your words: person, job, moment of value, feeling, signature moment.
2. The average version: 5 bullets on what a generic AI build of this would look like. Every later choice must differ from it on purpose.
3. Ambiguities: every place two competent builders would build different things from my words, ranked by blast radius.
4. Framings: 2-3 alternative theses (different person, core object or moment of value), with what each gains and loses. Do not pick one; the choice is mine.
5. Complexity: the hard things inside, and how the system absorbs each so the user never sees it.
6. The strongest case that this should not exist, or should be a feature of something else.
7. Evidence: for person, job and moment, what I have observed, what I have heard, and what I am assuming.

Then interview me in rounds of at most 5 numbered questions, each with your recommended answer. Each round attacks the weakest of person, job, moment, the one thing, refusals; say which. Reject vague answers ("users", "easy", "powerful", "all-in-one", "seamless") and re-ask sharper. Never suggest features; if I do, ask which job it serves and what it displaces. Stop when you can state the product in one sentence and predict what I would cut.
Finally draft .offthemode/PRODUCT.md from its template with an evidence tag on every Person, Job and Moment line. Tag anything unconfirmed [assumed]; unsettled items go to open questions, never invented. End with the 3 assumptions most likely to be wrong and the cheapest one-day test for each, each written as a RISKS.md row.
```

```prompt title="Generate the Skeleton"
Read @.offthemode/PRODUCT.md and @.offthemode/GLOSSARY.md. Produce .offthemode/SKELETON.md following the template exactly; present it in plan mode and write it only after I approve.
- Artifacts, not prose: tables, mermaid, invariants. Every GLOSSARY term gets its definition and invariant in §Domain model.
- Derive surfaces from the domain model and journeys; cut any surface no journey step requires, or justify it. One primary action each.
- Tag capabilities Core, Supporting or Generic; spend creativity only on Core.
- Stack per layer: choice + version + why + rejected; must meet BUDGETS.md and the PRODUCT.md UX contract and reach {{TARGET_HOSTING}} cleanly; draft each as a D-### entry. If the UX contract trips the sync rule, mark the data layer [open] pending a P2 sync spike.
- Threat sketch: assets, actors, trust boundaries, top 5 abuse cases with day-one mitigations.
- Tag every item [decided], [assumed] or [open]. End with the 3-5 riskiest assumptions, weighted toward the core, as RISKS.md rows with proposed spikes.
- Flag anything in PRODUCT.md this skeleton cannot satisfy instead of quietly bending it.
```

```prompt title="Pre-Mortem"
It is {{N}} months after launch and {{PROJECT_NAME}} has failed. Read @.offthemode/PRODUCT.md and @.offthemode/SKELETON.md.
Write 6-10 distinct causes as short, concrete stories, covering product (nobody reached the moment of value, or the Person was imagined), experience (complexity leaked, or it looked like everything else), core feasibility (quality, latency, cost), architecture (local-to-hosted, scale, data model, sync), security and abuse, cost and operations, and my own process.
Per cause: early warning signal, likelihood 1-5, impact 1-5, the cheapest test now, what changes in PRODUCT or SKELETON if it is real. A risk that applies to every startup is not allowed.
Update .offthemode/RISKS.md, mark the ones needing a P2 spike, and list proposed PRODUCT and SKELETON edits without applying them.
```

## Living Checklist
<!-- origin: yours -->

> **Output:** `.offthemode/CHECKLIST.md`, created after P1 and kept true by one command, `/listrevisit`.

Your core concept is defined in P1. The checklist breaks it into **fragments**: the separate pieces of the core, finished one after another. Each fragment has a few items, and each item says how you'll know it's done. The file is a map, not a gate. Sessions stay free-form and nothing has to be ticked while you work, because `/listrevisit` catches up afterwards by reading what changed in git.

**One command, checklist only.** `/listrevisit` creates the checklist the first time. After that, run it bare to see where you stand, or with a note (`/listrevisit add CSV export to reports`) to change the list. It edits only .offthemode/CHECKLIST.md, never code or other docs. If a change also affects the vision or the architecture, it names the doc to update and leaves that to you.

| You run | It does |
|---|---|
| `/listrevisit` with no checklist yet | Splits the core concept into fragments, shows you the list, writes the file after your ok |
| `/listrevisit` | Maps commits since the last revisit to items, runs the cheap checks, updates marks with evidence, shows the status |
| `/listrevisit <idea or change>` | Places it in a fragment or a new one, shows what it affects, updates the list after your ok, logs the change |

> **Rule:** An item is marked verified only with evidence the command can cite: a passing test by name, a measured number, a screenshot, a commit. "Built" and "verified" are separate marks, because the gap between them is where agents claim done.

**When a fragment can be verified depends on the product.** Some fragments can be proven on their own, early: a hard interaction, a speed limit, a platform constraint. Many can't. An AI data analyst only proves itself end to end: a real question goes in, correct SQL runs, the right answer comes out, and that needs the whole chain to exist. So each fragment says `Verify: early` or `Verify: on completion`. An on-completion fragment's "done when" is an end-to-end run with real inputs (for a model-driven core, the eval set passing). Neither mode is better; the checklist just records which one each fragment is.

**The elite bar.** Every fragment ends with one item, "quality bars met". The bars cover correctness, speed, experience, code hygiene and safety, and each names the command that measures it. Bars that don't apply get deleted with a reason: a backend-only product drops the UI ones. Numbers live in BUDGETS.md, the single owner of every threshold. `/listrevisit` measures what it can and says plainly what it couldn't, instead of calling it passing.

> **Why:** A vibe session is good at momentum and bad at memory. The checklist is the memory, and `/listrevisit` is the one step that has to be honest, so it runs checks instead of trusting claims.

```file path=".offthemode/CHECKLIST.md"
# Checklist · {{PROJECT_NAME}}
Last revisit: {{DATE}} · Verified {{V}}/{{TOTAL}}

A map, not a gate. Build in any order; /listrevisit reconciles and updates this file.
Marks: [ ] todo · [~] in progress · [x] built, not proven · [v] verified, evidence cited · [-] dropped, reason kept
Verify: early = can be proven on its own · on completion = only an end-to-end run proves it

## Vision (owned by .offthemode/PRODUCT.md; do not edit here)
- Thesis: {{?THESIS}}
- Moment of value: {{?MOMENT_OF_VALUE}}
- Core concept: {{?CORE_CONCEPT}}

## Fragments

### F1 · {{FRAGMENT_NAME}} · depends on: {{none | F#}} · Verify: {{early | on completion}}
For the person: {{what they can now do, in their words}}
- [ ] F1.1 {{capability}} · done when: {{a test by name | a number against BUDGETS.md | a named state you can screenshot | an end-to-end run with real inputs}} · evidence:
- [ ] F1.2 {{capability}} · done when: {{...}} · evidence:
- [ ] F1.Q Quality bars met for F1 · evidence:

## Foundation (keep only what this product needs)
- [ ] B1 Rules and context wired: AGENTS.md, hooks, STATE.md · done when: a fresh session prints STATE.md · evidence:
- [ ] B2 Host-ready: deploy target decided, env checked at boot, forward-only migrations · done when: a preview deploy boots and passes {{?ENV_CHECK_CMD}} · evidence:
- [ ] B3 (UI) Visual language locked: tokens v1 and /specimen · done when: the specimen passes the audit in both themes · evidence:
- [ ] B4 (UI) Every route and state exists · done when: Walk Every Flow reports zero dead ends · evidence:

## Quality bars (each fragment's .Q item checks these; numbers live in .offthemode/BUDGETS.md)
Delete a bar only with a one-line reason. (UI) and (native) bars go when the product has no UI or no native app.
Correctness
- The core journey passes end to end with real inputs · {{?E2E_CMD}}
- Model-driven or data-driven core: the eval set passes and no case regressed · {{?EVAL_CMD}}
- Every failure path returns a clear error and leaves data consistent; retries are safe
Speed
- Response and load times inside BUDGETS.md under realistic data volume · {{?AUDIT_CMD}}
- Every new dependency has a size and a reason in DECISIONS.md · {{?BUNDLE_CMD}}
- (UI) No layout shift on load or when data arrives
- (native) The heaviest interaction holds its frame budget in a profile build · {{?PROFILE_CMD}}
Experience
- (UI) Every screen has empty, loading, error, offline and no-permission states, each with one next action
- (UI) Undo instead of confirm; state survives reload and back; the core job works keyboard-only and touch-only
- Errors, logs and messages say what happened and what to do next (.offthemode/VOICE.md)
Code
- Types, lint and tests green with zero warnings · {{?CHECK_FULL_CMD}}
- No dead code, unused exports or unused dependencies · {{?DEADCODE_CMD}}
- One way to do each thing (data access, state, errors, config); no duplicate helpers
- No commented-out code, no stray debug output, no TODO without an item id from this file
- No file over {{MAX_FILE_LINES}} lines and no function over {{MAX_FN_LINES}} without a reason written beside it
Safety
- Authorization checked on the server for every action; inputs validated at the boundary; no secret in the repo or the bundle (.offthemode/SECURITY.md)

## Changes
- {{DATE}} · created from {{PLAN_SOURCE}}
```

```prompt title="List Revisit"
List revisit on .offthemode/CHECKLIST.md. Input: {{?NOTE: empty for status, or a new feature, idea or change}}. Edit only .offthemode/CHECKLIST.md: never code, never other docs.

If .offthemode/CHECKLIST.md is missing or still the unfilled template, build it:
1. Read the plan: .offthemode/PRODUCT.md, .offthemode/SKELETON.md, .offthemode/ROUTES.md, or the plan file I name.
2. Split the core concept into fragments: the separate pieces of the core a user would notice, usually 3-8. A fragment cuts through every layer it needs; "the API for F2" is not a fragment. For each: what it does for the person, what it depends on, and Verify: early (it can be proven on its own) or on completion (only an end-to-end run proves it).
3. Give each fragment 2-6 items with a provable "done when": a test by name, a number against BUDGETS.md, a named state you can screenshot, or an end-to-end run with real inputs. Reject "works", "clean" and "fast".
4. Keep only the foundation and quality bars this product needs; delete the rest with a one-line reason each. Point every bar at a command from AGENTS.md Commands.
5. Order: dependencies first, then the fragment nearest the moment of value.
Show me the fragments in order, one line each, and wait for my ok. Then write the file, with anything already built marked [x], never [v].

Otherwise:
1. Reconcile: map git log and diff since the header's "Last revisit" to items. Work that matches no item is Untracked.
2. Verify: for every [~] and [x] item, find its evidence and run the cheap checks from AGENTS.md Commands. Promote to [v] only with evidence you can cite; demote a [v] whose evidence broke, and say why. An on-completion fragment stays unverified until its end-to-end check passes.
3. If there is a note: say which fragment it belongs to or that it is new, which job in .offthemode/PRODUCT.md it serves (if none, ask before adding), and what it disturbs (data model, routes, budgets, other fragments, anything already [v]). Show the diff to the list: added, changed, dropped (dropped items stay as [-] with the reason). Wait for my ok, apply it, and log one line per change under ## Changes. If the vision or architecture must change too, name the doc and stop there.
4. Update the header: "Last revisit" and the verified count.
Reply in at most 25 lines: progress per fragment with its Verify mode (F2 ■■■□□ 3/5 · on completion), what moved since last time and why, Untracked work, risks (failing bars, items stuck at [x], blocked fragments), and the next 3 items.
```

## P2 · Core Spike
<!-- origin: moved -->

> **Rule:** Your core concept is defined in P1 and built in P6. P2 is optional and builds none of it. Use it only for a fragment that can be proven on its own (a hard interaction, a speed or platform limit) while the answer could still change the plan. Products whose core only proves itself end to end, like an AI analyst answering real questions, skip P2: those fragments are marked `Verify: on completion` in the Living Checklist and get an end-to-end check once built.

> **Output:** a PASS / FAIL / PASS WITH CONSTRAINTS verdict with measured numbers, the core contract in `.offthemode/SKELETON.md`, a feel prototype tested by 3 target people with the winning waiting strategy written into `.offthemode/DESIGN.md`, an eval set v0 if the core is model-driven, and updated `.offthemode/RISKS.md` and `DECISIONS.md`.

The core is "plug and play" only once the socket's shape is known, and in a complex product the core is exactly where the unknowns live. Can it hit the latency, quality, cost and device limits? Does the moment of value actually feel like a wow? Those are two different questions, so P2 builds two throwaway artifacts, each timeboxed: a **feasibility spike** on the single riskiest core assumption, then a **feel prototype** built on the spike's real numbers. The real core build stays in P6, as you planned.

> **Why:** Spike results feed design as much as engineering. A 6-second generation means the signature moment has to be designed around streaming. Frequent sync conflicts make recovery UX a first-class surface. An expensive core call means queues, caching, and defaults that respect usage. Learning this after visuals are locked means redoing them. Feel is timing, sequencing and feedback, not styling, so it can't be judged on a page that dumps JSON after six seconds, and it doesn't need a brand to be judged.

Rules: one falsifiable hypothesis with numbers ("p95 under 2 s on a mid-tier Android with 10k records"). Timebox by tier: 1-2 hours for a weekend build, half a day to a day for a product, 1-3 days per top risk for a complex one. Work in its own worktree (`git worktree add ../{{PROJECT}}-spike-{{NAME}} -b spike/{{NAME}}`). Make it ugly on purpose but never fake: never mock the hard part. It's never merged, and only the findings survive. If the core has no real unknowns, log "no spike needed: {{reason}}". Two cases always get a spike. If the UX contract trips the sync rule (offline writes, multiplayer, or mostly-instant mutations), spike a sync engine against request/response (P4). If the core is model-driven, the spike seeds `evals/` with 20-30 real inputs and records the pass rate as the quality baseline (Always-On · Verification Loop).

> **Trap:** Agents gold-plate by default. Without a "throwaway" frame and a separate worktree, a spike grows abstractions and a nice UI, burns the timebox, and leaves code you'll be tempted to merge. Say what not to build.

```prompt title="Core Spike"
SPIKE {{RISK_ID}}: {{HYPOTHESIS}}
Context: @.offthemode/SKELETON.md (Core contract, NFRs, Data flow), @.offthemode/RISKS.md, @.offthemode/BUDGETS.md. You are in the worktree for spike/{{NAME}}. This code is throwaway and never merged; optimize for learning speed.
Pass if {{THRESHOLD}} · fail if {{THRESHOLD}} · timebox {{N}} hours (at the limit, stop and report what you know).
Allowed: hardcoded inputs, one plain page, no auth, any library. Forbidden: brand styling, abstractions, touching the main app, mocking or shrinking the hard part.
1. State the smallest experiment that could falsify the hypothesis. Wait for my go.
2. Build and measure with realistic data ({{DATA_SCALE}}) on {{TARGET_DEVICE_OR_ENV}}: p50, p95, throughput for streamed output, error rate, memory, cost per run. Numbers, not impressions.
3. If it fails, try at most 2 alternatives, named before you start.
4. Model-driven core: save 20-30 real inputs with expected properties to evals/ and report the pass rate.
Deliver: verdict; measurement table, method, exact repro; the core contract (inputs, outputs, latency and cost envelope, failure modes, streaming or partial, quality baseline) written into SKELETON.md; design implications; backend and hosting implications; a D-### entry and the updated RISKS.md row. On FAIL: ranked pivots and the PRODUCT.md lines each changes.
```

```prompt title="Feel Prototype"
FEEL PROTOTYPE for {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), built on the measurements from spike {{SPIKE_ID}}, in the same kind of throwaway worktree.
Greybox: system font, greys, no brand, no tokens. Forbidden: brand styling, and fake speed of any kind. Required: real timings (stream at the measured throughput, delay by the measured p95, fail at the measured error rate); the whole moment-of-value sequence from trigger to result; a rough cut of the signature-moment choreography with plain transforms; and three switchable ways to bridge the wait (?bridge=stream | work | optimistic): stream partial results; show the absorbed work (the inputs visibly becoming the result); an optimistic placeholder that resolves in place.
Deliver: a URL or build I can put in front of 3 people who match {{?PERSON}}; a 5-line session script (what I say, what I must not explain); and a notes table for me to fill: Person | Described what happened in their own words? | Would wait? | Preferred bridge | Words they used for our nouns.
After I paste the notes: the winning bridge as one DESIGN.md constraint line, GLOSSARY edits where their words differ from ours, and any PRODUCT.md or RISKS.md edits.
```

> **Rule:** The feel gate passes when at least 2 of the 3 people describe what happened in their own words and say they'd wait. If it fails, redesign the moment (what streams, what's inferred, what happens first), never the pixels.

```file path=".offthemode/RISKS.md"
RISKS · score = likelihood x impact (1-5 each). Any core risk scoring 12+ gets a spike before P3 starts. Assumed Person, Job or Moment lines from PRODUCT.md land here as ux risks.

| ID | Risk (falsifiable) | Area | L | I | Score | Test or spike | Kill or pivot criterion | Status |
|---|---|---|---|---|---|---|---|---|
| R-01 | {{e.g. canvas cannot render 50k nodes at 60 fps on a mid-tier Android}} | core | 3 | 5 | 15 | spike/render-50k, 4 h | under 30 fps after 2 approaches -> {{FALLBACK}} | open |
| R-{{NN}} | {{RISK}} | {{core / ux / infra / security / cost}} | | | | {{TEST}} | {{CRITERION}} | {{open / spiking / retired / accepted}} |
```

## P3 · Visual Language
<!-- origin: yours -->

> **Output:** `~/.claude/design/TASTE.md` and `USED.md` (global, maintained across projects), `.offthemode/DESIGN.md`, `.offthemode/design/` (refs, PRINCIPLES, DIRECTIONS), locked `src/styles/tokens.css` (+ `tokens/tokens.json` for native), a `/specimen` page rendering every state, the ban-lint hook, the shots and audit scripts from your stack pack, and the global `design-critic` subagent.

No product screen gets built before the tokens are locked and the specimen exists. This is where "complex inside, simple outside" becomes visible: restraint, hierarchy and motion make a dense system read as one calm surface with one obvious next move.

> **Rule:** Prove a direction on the product's hardest real screen (the dense core surface), never on a landing page. A direction that only works on a hero is a poster, not a language.

Ask for "a modern, clean landing page" and you get the argmax: centered hero, gradient headline, pill badge, logo marquee, three icon cards, bento, three pricing tiers, FAQ, all in Inter with `rounded-xl shadow-sm` and `from-blue-500 to-purple-600`. "Modern, clean, sleek" are the words that sat next to millions of those templates, and if `rounded-lg` exists, it's the most probable token. Three levers move the output. **References** shift the conditioning. **Tokens** shrink the output space: if the radius family is one value and its concentric derivatives, the rounded-xl card can't happen, and a constraint that lives in code survives compaction. **Bans with reasons and replacements** name the exit, and the reason generalizes to cases you never listed.

> **Trap:** "Make it unique." The model has seen "unique" next to its second mode: black background, border beams, gradient text, glass. And by 2026 there's a third mode, the anti-slop look itself (warm paper, graphite, one signal colour, uppercase mono labels, hairlines instead of cards), because every anti-slop skill and thread pushes agents there. Defining yourself against the average only moves you to the next average. The exit that doesn't converge is your own taste, written down once.

### Your taste, captured once

The GLOBAL layer is supposed to carry what *you* love, and bans can't do that: a ban says where not to go, never where to go. So before your first project on the kit, and every six months after, run Taste Extraction on 20 things you love and 20 you can't stand. The output, `~/.claude/design/TASTE.md`, is what makes "unique" mean "recognisably mine" rather than "unlike the average". Extract Principles, Three Divergent Directions and design-critic all load it.

The second global file is a novelty ledger. The kit gets copied into every repo, so whatever worked last time becomes your personal mode, and project 3 quietly looks like project 1. `USED.md` records each shipped project's faces, hues, grid, surfaces and signature pattern, and the directions prompt treats it as a ban list.

```prompt title="Taste Extraction"
One-time global ritual; rerun every six months. ~/.claude/design/anchors/love/ and anchors/hate/ each hold about 20 things (sites, apps, posters, objects, film frames, type specimens, rooms), each with one line of why. Motion anchors are frame strips with measured duration and easing notes, never stills.
1. For each anchor: the ONE decision that makes me react, and what it costs. Do not describe the image.
2. Eight personal principles as falsifiable sentences, each traced to 2+ loves and contradicted by 1+ hate ("type carries hierarchy; colour only ever means state" is a principle; "clean and bold" is not).
3. My recurring moves in type, colour, motion, density and copy.
4. Which traits of my hates the generic AI look shares, and which traits of my loves the 2026 anti-slop look shares. Both are modes I can fall into.
5. Five tensions between things I love. This is where my products get their edge: a direction that resolves one of them is already off the mode.
Then interview me in rounds of at most 5 numbered questions on the tensions and on anything I contradicted, each with your read as the default. Write ~/.claude/design/TASTE.md from its template, under 60 lines. If a previous version exists, end with the diff: what I stopped loving, what is new, which principle got sharper.
```

```file path="~/.claude/design/TASTE.md"
TASTE · {{YOUR_NAME}} · v{{N}} · {{DATE}} · under 60 lines · regenerate every six months with Taste Extraction and keep the diff

### Principles (falsifiable; each traced to 2+ loves and contradicted by 1+ hate)
1. {{PRINCIPLE}} · loves {{L03, L11}} · hates {{H07}}

### Recurring moves
Type {{}} · Colour {{}} · Motion {{}} · Density {{}} · Copy {{}}

### What my hates share with the generic AI look
- {{TRAIT}}

### What my loves share with the 2026 anti-slop look (use knowingly)
- {{TRAIT}}

### Tensions (where my products get their edge)
1. {{I love A (L02) and B (L09); a product that holds both looks like ...}}

### Never, for me
- {{}}
```

```file path="~/.claude/design/USED.md"
USED · one row per shipped project; Project Retro appends. Three Divergent Directions reads this as a ban list: no direction may share more than one attribute (column) with any row. Pre-seeded with the blueprint's illustrations, so they are banned from day one.

| Project | Date | Display / text faces | Neutral hue, chroma | Accent hue, strategy | Grid model | Surface treatment | Signature pattern |
|---|---|---|---|---|---|---|---|
| (illustration) Soft Machine | - | Fraunces / Atkinson Hyperlegible Next | 20, 0.03 | 350, colour-led | object tiles | tonal colour fields | object inflates out of its button |
| (illustration) Bench Instrument | - | Berkeley Mono / IBM Plex Sans Condensed | 250, 0.006 | 85, single signal | dense ruled table | rules only, no fills | readout ticks digit by digit |
| (illustration) Contact Sheet | - | Newsreader / Hanken Grotesk | none, 0 | none, photography | editorial columns | full-bleed imagery | thumbnail becomes the hero |
| (retired draft) Signal Room | - | serif display / grotesk / pixel mono | 75, 0.008 | 35 vermilion, scarce | label rail + columns | warm paper, hairlines | key number settles on a spring |
| {{PROJECT}} | {{DATE}} | {{}} | {{}} | {{}} | {{}} | {{}} | {{}} |
```

### Taste sourcing, dated 2026-09

Re-review these tables and BANS.md §Saturated in every Project Retro; anything that shows up in a template marketplace moves to Saturated. Save references as images in `.offthemode/design/refs/` with a one-line note each, and motion references as frame strips with measured duration, easing and overshoot (a still of an animation loses the only thing you were referencing). A bare URL fetch returns HTML, not feel. Keep the two jobs apart: the agent learns **how** to build from craft teachers and **what** it looks like from you, mostly by way of sources outside software.

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
| Your `anchors/love/` and your own Are.na channels | The only source that is recognisably you |
| Letterform Archive; Standards Manual reissues | Systems in print: grids, signage, identity manuals |
| Art of the Title | Pacing, reveals, type in motion |
| Foundry specimens: Future Fonts, Velvetyne, Collletttivo, UNCUT.wtf, Departure Mono; Dinamo, Grilli Type, Klim, OH no Type Co | Faces nobody else has yet, and how a type designer stages a face |
| Museum and exhibition identities; hardware manuals and instrument panels; record sleeves | Constraint-driven layout, labelling, one bold move per object |
| Godly, Siteinspire, Minimal Gallery, Hoverstat.es, Cosmos | The fringe of the web; check every trait against BANS.md §Saturated first |
| Fonts In Use | Saturation evidence for faces |

What's already saturated lives in one place, `BANS.md` §Saturated (The files, below): bento, glass, the purple-glow dark mode, the serif-italic headline word, the template display faces, and now the anti-slop look itself. A saturated trait needs a written product reason in DECISIONS.md. Anthropic's `frontend-design` skill is a floor, not a ceiling: when everyone installs the same anti-slop skill, its escape routes become the next average, which is why TASTE.md and USED.md sit on top of it.

```prompt title="Saturation Check"
For each trait in .offthemode/design/directions/*.md and .offthemode/DESIGN.md (faces, colour strategy, grid model, surface treatment, motion signature, layout device), estimate how saturated it is. Search if you can (Fonts In Use, Framer and Webflow template marketplaces, recent design-award galleries, all from the last 12 months); otherwise say you are estimating. Roughly 20+ hits, or a match in ~/.claude/design/BANS.md §Saturated, means mainstream: keep it only with a written product reason as a D-### entry, or replace it with a move derived from a TASTE.md tension.
Output: Trait | Evidence | Verdict (keep with reason | replace) | Replacement.
```

**Process.** (1) Build a moodboard of 30-60 references, at least half from outside software. (2) Run Extract Principles, which reads TASTE.md, so the principles are yours before they're this product's. (3) *You* assign each of three directions an external anchor from the moodboard and one forbidden trait, before anything is generated. (4) Build each direction in its own worktree and a fresh session that can't see the others (in Claude Code, a builder subagent with `isolation: worktree` does both), then merge the three `dir/*` branches into a `lab` branch; they touch disjoint paths, so they merge cleanly. (5) Check divergence after the fact: `scripts/diverge-diff.sh` flags any pair sharing more than half its knob values, and design-critic judges from screenshots only. (6) design-critic recommends a base and at most two grafts in a separate call; you choose, because averaging all three gets you the mode back. (7) Run Saturation Check, lock tokens v1, build the specimen. After that, every screen is assembly, not invention.

> **Why:** A single session that builds A, B and C in sequence conditions B on A and C on both, and picks its own axes, so you get the mode three times in three fonts. Separate contexts and axes you assigned are what make the samples independent; a checker that didn't author them is what makes "they differ" true.

```prompt title="Extract Principles From References"
Act as a design director with a type designer's eye. .offthemode/design/refs/ holds {{N}} reference images (motion refs as frame strips) with notes. Product: {{?PRODUCT_ONE_LINER}}. Person: {{?PERSON}}. Moment of value: {{?MOMENT_OF_VALUE}}. My taste: ~/.claude/design/TASTE.md.
Do not describe the images. Per reference: the ONE decision that makes it work, what it costs, why it works perceptually.
Then synthesize 6-8 PRINCIPLES for this product. Each is a falsifiable sentence, not an adjective; traced to refs by filename and to a TASTE.md principle or tension; expressed in type, colour, layout, motion and copy; paired with its failure mode (how an agent would misapply it into cliche).
Also list: shared traits that are only current fashion or appear in ~/.claude/design/BANS.md §Saturated (dropped); 3 tensions between refs to resolve; what NONE of the refs do that this product's job demands. Never copy a layout, logo or signature element. Write .offthemode/design/PRINCIPLES.md.
```

```prompt title="Three Divergent Directions"
Direction {{A | B | C}} of three for {{?PRODUCT_NAME}}. You are in worktree dir/{{a | b | c}}, in a fresh session. The other directions exist elsewhere; do not look for them.
Anchor, assigned by me: {{REF_FILE in .offthemode/design/refs/}}; take {{WHAT_TO_TAKE}}. Forbidden trait: {{TRAIT}}.
Read ~/.claude/design/TASTE.md, .offthemode/design/PRINCIPLES.md, ~/.claude/design/BANS.md and ~/.claude/design/USED.md. USED.md is a ban list: share at most one attribute with any row.
Deliver: a two-word name and a one-sentence thesis naming the metaphor, the density and the colour strategy; src/styles/directions/{{a | b | c}}.css using the tokens.css variable names; /lab/{{a | b | c}}/core ({{?HARDEST_SCREEN}} on the edge seed: long names, empty, max rows, error) and /lab/{{a | b | c}}/entry ({{?SECOND_SCREEN}}); a working signature moment; light and dark.
Constraints: no HARD ban and no DEFAULT-OFF ban; one primary action per surface; real copy in the product's voice; no new dependency without a reason. Touch only the direction file and /lab/{{a | b | c}}.
Finish: run {{?SHOTS_CMD}} on both routes and write .offthemode/design/directions/{{a | b | c}}.md: thesis, bet, weakest point, the TASTE.md tension it resolves. Do not compare yourself to anything and do not recommend.
```

```file path="scripts/diverge-diff.sh"
#!/usr/bin/env bash
# Flags direction pairs that share more than half of their knob values. Usage: scripts/diverge-diff.sh src/styles/directions/*.css
knobs() { grep -oE -- '--[a-z0-9-]+: *[^;]+' "$1" | sed 's/: */=/' | sort -u; }
fail=0
for a in "$@"; do for b in "$@"; do
  [[ "$a" < "$b" ]] || continue
  shared=$(comm -12 <(knobs "$a") <(knobs "$b") | wc -l); total=$(knobs "$a" | wc -l)
  if [ $((shared * 2)) -gt "$total" ]; then echo "$a ~ $b: $shared of $total knob values identical; redo one"; fail=1; fi
done; done
exit $fail
```

```prompt title="Design Critique Against Rubric"
Run as design-critic on {{ROUTES or "the three lab directions"}}. Inputs: the screenshots in shots/, ~/.claude/design/RUBRIC.md and its anchors, ~/.claude/design/TASTE.md and USED.md, .offthemode/design/PRINCIPLES.md.
Judge pairwise, never absolutely. Per screen and criterion: "is the screen better than anchor N on this criterion? screen / anchor / tie", naming the region that decides it ("lab-b-core-390-light.png, top right: three accent roles compete"). Compare against the 2-anchor on every criterion, and against the 3-anchor on Distinctiveness and Signature moment. You are run twice with the order swapped; judge only the order you were given.
Then: the logo-swap test (the product this could be mistaken for, any USED.md row it resembles, or "none"); the 3 changes that would flip the most losses, as token, property or element changes; the best idea worth grafting elsewhere.
Comparing directions: also judge divergence from the screenshots alone, then recommend one base plus at most 2 grafts and flag conflicts. You built none of them; never average them.
```

```prompt title="Build the Specimen Page"
tokens.css is locked at v1. Build /specimen, one page rendering the whole language:
1. Type: every scale step with token, size, leading, tracking; a paragraph at measure; tabular vs proportional numerals; mono.
2. Colour: every token as a swatch with its oklch value, its WCAG contrast ratio against bg, surface-1 and surface-2, and APCA Lc as a second opinion, light and dark side by side. Every ink/surface and on-accent/accent pair must meet the BUDGETS.md text ratio (large-text ratio at WCAG large sizes); {{?AUDIT_CMD}} fails the run when one doesn't.
3. Space, radii (with their concentric inner values), lines, elevation as rulers. Motion: every duration x easing and spring as a replayable demo beside its reduced-motion variant.
4. Components in ALL states (default, hover, focus-visible, pressed, disabled, loading, error, empty): buttons (primary, secondary, quiet), input, select, checkbox, switch, tabs, menu, dialog, sheet, toast, tooltip, table row, list item, skeleton, empty state.
5. Data: a line, bar, area and table on the scale seed with the --data-* tokens and the highlight rule, direct labels, and designed empty, partial and loading chart states; the shots run adds a deuteranopia and a protanopia pass via Emulation.setEmulatedVisionDeficiency.
6. A real {{?HARDEST_SCREEN}} fragment built only from the parts above, and the signature moment in isolation.
Behaviour from {{PRIMITIVES_LIB}}; styling is ours. Zero raw colour, size or duration values in component files (1px hairlines excepted). Theme and reduced-motion toggles at the top. Then run the Screenshot Critique Loop on /specimen.
```

### Tokens are the contract

Tokens are the one design artifact the agent can't misread, and `tokens.css` is the single owner of every motion, type and space value: prompts and docs refer to `--dur-quick`, never to a number. Build colour in OKLCH: equal lightness steps look equal (HSL doesn't give you that), and states come from relative colour syntax instead of new hex values. The template is parametric. Set about ten knobs and everything else derives. Its comments name ranges, not a look; the look is DESIGN.md's call. Harmonizer (OKLCH plus APCA) and oklch.com help with palettes, and Utopia with fluid type.

The dark block appears twice on purpose. The media query serves the OS setting for real users; the attribute serves the in-app toggle and every screenshot run. With only the attribute, a browser emulating dark mode renders the light theme, and every "checked in both themes" claim checks a theme that was never drawn.

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
  --touch-min: 44px;                  /* web touch target; owned here, BUDGETS.md points at it */
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

Three filled-in directions, as illustration only. **Never reuse them**: agents copy worked examples far more reliably than they apply principles, so a single example becomes your house style. They're deliberately incompatible, and all three are pre-seeded in USED.md, so the novelty ledger bans them from day one.

| Illustration | Thesis | Knobs | Faces | Surfaces | Signature |
|---|---|---|---|---|---|
| Soft Machine | A consumer tool that feels like a toy you trust | neutral 20 / 0.03, accent 350 / 0.2, radius 14px concentric, ratio 1.25, density 1.125 | Fraunces (soft axis up) / Atkinson Hyperlegible Next, no mono | Tonal colour fields per object type; hue encodes the object | The new object inflates out of the button that made it |
| Bench Instrument | A dense bench tool for someone who reads numbers all day | neutral 250 / 0.006, dark-first, accent 85 / 0.16, radius 0, ratio 1.2, density 0.875 | Berkeley Mono for data and UI / IBM Plex Sans Condensed for prose | Ruled table grid, no fills; values change in place | A readout that ticks digit by digit |
| Contact Sheet | An archive where the photographs are the colour | neutral chroma 0 on purpose, no accent (photography carries hue), radius 0, ratio 1.333, density 1.125 | Newsreader at display optical size / Hanken Grotesk | Full-bleed imagery, wide margins | The tapped thumbnail becomes the full-bleed hero |

```ts
// src/styles/motion.ts: the same springs for Motion (web) and Reanimated (RN); dampingRatio for SwiftUI / Compose.
export const spring = {
  snappy: { stiffness: 400, damping: 28, mass: 1, dampingRatio: 0.7 },  // presses, toggles, sheets
  settle: { stiffness: 500, damping: 40, mass: 1, dampingRatio: 0.89 }, // layout shifts, no overshoot
  soft:   { stiffness: 220, damping: 18, mass: 1, dampingRatio: 0.61 }, // signature moment only
} as const;
```

> **Pro move:** Shipping on web and native? Keep the canonical tokens in `tokens/tokens.json` in the W3C DTCG format (stable since 2025.10), and generate CSS, Swift, Compose and React Native themes with Style Dictionary, so iOS can't drift from web.

### The craft layers

- **Type leads.** Once decoration is gone, type is most of what's left, so choose it before colour. One text face that disappears, one display voice with an opinion, a mono only if the data needs one. Display gets optical tightening (negative tracking, 1.0-1.1 leading). Pick one label treatment (case, tracking, scale step) and use it everywhere. Use `text-wrap: balance` on headings and `tabular-nums` wherever numbers change. Hierarchy comes from size, weight and space, with colour as the last lever.
- **Colour.** The strategy is a DESIGN.md decision: one scarce accent, a colour-led palette where hue encodes object type, or photography as the colour. Whatever it is, every hue maps to a principle; if removing a colour loses no meaning, it was decoration. Neutrals are tinted or deliberately achromatic, never framework grays. One accent *role* per viewport outside the signature moment, so the primary action and a live state share a hue only if DESIGN.md says they're the same role. Dark mode is designed: surfaces rise in lightness, the accent drops ~15% chroma, and text on the accent is re-checked.
- **Layout.** Choose a grid model and make it visible: editorial columns, a label rail, a canvas, a feed, a table. Use density contrast (tight groups, generous separations) instead of uniform medium spacing, which is the template tell. A card is for an object that behaves like one (draggable, stackable, dismissible); everywhere else, alignment and tonal steps carry the grouping.
- **Motion.** It answers where something came from, where it went, or what caused it. Otherwise cut it. User-driven motion uses springs (they interrupt and keep velocity), system motion uses duration tokens, and nothing eases in on a response. The more often something happens, the less it animates. View Transitions morph list into detail and scroll-driven animation adds depth, both as progressive enhancement (feature-detect, and the UI still works without them). Animate only transform, opacity and clip-path.
- **Texture and haptics, once each.** One surface, one technique, with a principle behind it. Shaders pause offscreen and ship a static fallback. On mobile, haptics are the press state, mapped to semantic events like selection, success and snap, never to raw taps.
- **Data.** In complex products the hardest real screen is often a chart or a dense table, and that's where the chart library's default palette leaks in. The `--data-*` tokens and DESIGN.md §Data give charts a grammar: categorical hues rotated from the accent, one sequential and one diverging ramp, the series the user asked about in accent and everything else in `--ink-3`, direct labels over legends.

**The signature moment.** Exactly one, at the moment of value, and the only place allowed past the motion ceiling with `--spring-soft`, sound, a haptic ramp or texture. Test it: can you describe it in one sentence, and would a user show it to someone? Patterns that work: the result assembles from its inputs for well under a second, showing the absorbed complexity, then gets out of the way; hold-to-commit with a haptic ramp; the tapped object becomes the next screen; an empty state previewing the product filled with the user's own data. Two signature moments equal zero. Its timing comes from the P2 feel test, not from taste alone. Copy counts as visual too, and its rules live in Always-On · Words & Voice.

### The screenshot loop

An agent writing CSS is guessing at pixels, and its confidence reflects how plausible the tokens are, not how they render. Give it eyes, and split the judging. A **deterministic audit** owns the pixel facts an LLM can't resolve from a screenshot: 1-3 px baseline drift, off-token values leaking in from library CSS, inline styles or arbitrary utility classes, undersized targets, contrast, accent share. The **LLM critic** judges only what needs judgment: hierarchy, distinctiveness, feel. Use a browser MCP (Playwright MCP, Chrome DevTools MCP) for exploration, and these scripts for evidence. Both come from your stack pack; the web-ts versions are below, and native packs capture with `xcrun simctl io booted screenshot`, `adb exec-out screencap -p` or Maestro.

The app sets a `data-ready` attribute once data and fonts have settled (dev builds at least). Waiting on network idle never resolves on apps with SSE, WebSockets or polling, which P4 recommends, so every shot would hit the timeout instead.

```file path="scripts/shots.ts"
// stack pack web-ts · Run: npx tsx scripts/shots.ts /specimen /lab/b/core   (VIEWPORTS=390x844,1440x900 from AGENTS.md)
// Light and dark per viewport, forced through data-theme so the dark PNG really is dark. Exits 1 if a pair comes out identical.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const vps = (process.env.VIEWPORTS ?? "390x844,1440x900").split(",").map((s) => s.split("x").map(Number));
const browser = await chromium.launch();
let failed = false;
for (const r of process.argv.slice(2)) for (const [width, height] of vps) {
  const files: string[] = [];
  for (const scheme of ["light", "dark"] as const) {
    const touch = width < 768;
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: scheme, isMobile: touch, hasTouch: touch });
    await ctx.addInitScript((s) => { const set = () => document.documentElement?.setAttribute("data-theme", s); set(); document.addEventListener("DOMContentLoaded", set); }, scheme);
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: "load" });
    await page.locator("[data-ready]").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const path = `shots/${r.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "root"}-${width}-${scheme}.png`;
    await page.screenshot({ path, fullPage: true, animations: "disabled" });
    files.push(path);
    await ctx.close();
  }
  if (readFileSync(files[0]).equals(readFileSync(files[1]))) { console.error(`${r} at ${width}: light and dark are identical, so the theme is not switching`); failed = true; }
}
await browser.close();
process.exit(failed ? 1 : 0);
```

```file path="scripts/audit-computed.ts"
// stack pack web-ts · Run: npx tsx scripts/audit-computed.ts /specimen /lab/b/core
// The deterministic pixel gate: every computed value on visible elements resolves to a token, text meets BUDGETS.md contrast,
// targets meet --touch-min, sibling baselines align. Mark third-party embeds data-audit-skip. Exit 1 on any finding.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const B = JSON.parse(readFileSync(".offthemode/BUDGETS.md", "utf8").match(/~~~json\n([\s\S]*?)\n~~~/)![1]);
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const vps = (process.env.VIEWPORTS ?? "390x844,1440x900").split(",").map((s) => s.split("x").map(Number));
const browser = await chromium.launch();
let findings = 0;
for (const route of process.argv.slice(2)) for (const [width, height] of vps) for (const theme of ["light", "dark"] as const) {
  const page = await browser.newPage({ viewport: { width, height }, colorScheme: theme });
  await page.addInitScript((t) => { const set = () => document.documentElement?.setAttribute("data-theme", t); set(); document.addEventListener("DOMContentLoaded", set); }, theme);
  await page.goto(BASE + route, { waitUntil: "load" });
  await page.locator("[data-ready]").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const { out, accentShare } = await page.evaluate((b) => {
    const names = new Set<string>();
    const walk = (rules: CSSRuleList) => { for (const r of rules) {
      if (r instanceof CSSStyleRule && r.selectorText.includes(":root")) for (const p of r.style) if (p.startsWith("--")) names.add(p);
      if ("cssRules" in r) walk((r as CSSGroupingRule).cssRules);
    } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch { /* cross-origin sheet */ } }
    const probe = document.body.appendChild(document.createElement("div"));
    const tokens = (prop: string) => { const ok = new Set<string>(); for (const n of names) { probe.style.setProperty(prop, `var(${n})`); ok.add(getComputedStyle(probe).getPropertyValue(prop)); } probe.style.removeProperty(prop); return ok; };
    const color = tokens("color"), len = tokens("padding-left"), size = tokens("font-size"), face = tokens("font-family"), dur = tokens("transition-duration"), shadow = tokens("box-shadow");
    probe.style.color = "var(--accent)"; const accent = getComputedStyle(probe).color; probe.remove();
    const cx = new OffscreenCanvas(1, 1).getContext("2d")!;
    const lum = (c: string) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const [r, g, bl] = [...cx.getImageData(0, 0, 1, 1).data].slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * bl; };
    const bgOf = (e: Element | null): string => { for (; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c !== "rgba(0, 0, 0, 0)") return c; } return "white"; };
    const NEUTRAL = new Set(["", "0px", "0s", "none", "normal", "auto", "rgba(0, 0, 0, 0)"]);
    const touchMin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--touch-min")) || 0;
    const id = (e: Element) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.classList[0] ? "." + e.classList[0] : "");
    const out: string[] = []; let accentArea = 0;
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      if (!el.checkVisibility() || el.closest("[data-audit-skip]")) continue;
      const cs = getComputedStyle(el), box = el.getBoundingClientRect();
      const check = (prop: string, ok: Set<string>) => { for (const v of prop === "transition-duration" ? cs.getPropertyValue(prop).split(", ") : [cs.getPropertyValue(prop)]) if (!NEUTRAL.has(v) && !ok.has(v)) out.push(`${id(el)} ${prop}: ${v}`); };
      if ([...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim())) {
        check("color", color); check("font-size", size); check("font-family", face);
        const [hi, lo] = [lum(cs.color), lum(bgOf(el))].sort((x, y) => y - x), ratio = (hi + 0.05) / (lo + 0.05);
        const large = parseFloat(cs.fontSize) >= b.large_text_px || (parseFloat(cs.fontSize) >= b.large_bold_text_px && Number(cs.fontWeight) >= 700);
        if (ratio < (large ? b.contrast_large : b.contrast_text)) out.push(`${id(el)} contrast ${ratio.toFixed(2)}:1`);
      }
      check("background-color", color); check("box-shadow", shadow); check("transition-duration", dur);
      for (const p of ["padding-top", "padding-right", "padding-bottom", "padding-left", "row-gap", "column-gap", "border-top-left-radius"]) check(p, len);
      if (el.matches("a[href], button, input, select, textarea, [role=button], [role=tab], [role=switch]") && Math.min(box.width, box.height) < touchMin) out.push(`${id(el)} target ${Math.round(box.width)}x${Math.round(box.height)} under --touch-min`);
      if (cs.backgroundColor === accent) accentArea += Math.max(0, Math.min(box.right, innerWidth) - Math.max(box.left, 0)) * Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0));
      if (/flex|grid/.test(cs.display) && !cs.flexDirection.startsWith("column")) {
        const lines = [...el.children].map((c) => { const t = [...c.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim()); if (!t) return null; const rg = document.createRange(); rg.selectNodeContents(t); const r = rg.getClientRects()[0]; return r ? { y: r.bottom, fs: getComputedStyle(c).fontSize } : null; }).filter((x): x is { y: number; fs: string } => !!x);
        for (const l of lines.slice(1)) { const d = Math.abs(l.y - lines[0].y); if (l.fs === lines[0].fs && d >= 1 && d <= 3) out.push(`${id(el)} sibling baselines ${d.toFixed(1)}px apart`); }
      }
    }
    return { out, accentShare: accentArea / (innerWidth * innerHeight) };
  }, B);
  console.log(`${route} ${width} ${theme}: ${out.length} findings; accent fills ${(accentShare * 100).toFixed(1)}% of the first viewport`);
  out.slice(0, 40).forEach((l) => console.log("  " + l));
  findings += out.length;
  await page.close();
}
await browser.close();
process.exit(findings ? 1 : 0);
```

For motion, stills show neither easing nor interruptibility, and a model can't watch a video file. So the `audit-ux` script (Always-On · Verification Loop) asserts motion facts: animated properties, durations against their tokens, and whether a re-triggered animation continues from where it is. Feel gets a frame strip, one image the model can read, and the final call stays yours.

```bash
# Record with Playwright (newContext({ recordVideo: { dir: "shots/video" } }); the clip is written when the context closes),
# then tile 30 fps frames into one image: 12 x 3 = 36 frames, 1.2 s of motion.
ffmpeg -y -i shots/video/{{CLIP}}.webm -vf "fps=30,scale=360:-1,tile=12x3" -frames:v 1 shots/{{NAME}}-strip.png
```

```prompt title="Screenshot Critique Loop"
Loop on {{ROUTE}}, max {{MAX_ROUNDS}} rounds (default 3):
1. Run {{?SHOTS_CMD}} {{ROUTE}} and {{?AUDIT_CMD}} {{ROUTE}}. Fix every audit finding first: those are facts (off-token values, contrast, baseline drift, undersized targets), not taste.
2. Have design-critic judge the new shots pairwise against the rubric anchors, twice with the order swapped, and list pixel-level issues: file, region ("top fifth, left column"), the problem in measurable terms, the fix as a token or property. It always checks icon alignment to cap height, heading widows, dark-mode clipping, focus ring visibility, more than one accent role per viewport, and anything deletable without loss.
3. Fix the top 5 by impact, with tokens and component styles only.
4. Re-shoot, re-audit and diff: improved, regressed.
Stop when the audit is clean and the RUBRIC.md ship bar is met, or rounds run out; then list what remains for my taste call. Never say it "looks great"; report wins, losses and ties.
```

Vague feedback gets ignored or overcorrected. Pixel-level feedback gets fixed. "Too cluttered" becomes "7 equal-weight toolbar buttons: keep Run as primary, move 5 to overflow, delete Refresh (auto-refresh exists)". "Looks generic" becomes "the 3-card row is the tell: make it one sequence where each item shows the real output it describes".

```prompt title="De-Genericize Pass"
Audit {{SCOPE}} for statistical-average UI; every hit is a bug.
1. Patterns: every HARD id in ~/.claude/design/BANS.md, every DEFAULT-OFF id not listed in .offthemode/DESIGN.md §Unbans, and every trait in its §Saturated list. file:line, then keep (with the unban or D-### that allows it) or replace. Replacements come from .offthemode/design/PRINCIPLES.md and TASTE.md, never from another cliche.
2. Copy: rewrite every sentence a competitor could publish unchanged, using a noun, number or verb from {{?PRODUCT_NAME}}'s domain.
3. Values: run {{?AUDIT_CMD}}; framework defaults and raw values become tokens. Icons that repeat their label: deleted.
4. Delete test: remove each element in turn; if nothing is lost, it stays deleted.
5. The signature moment exists and is the only loud thing.
Output a change summary with before and after screenshots.
```

### The files

```file path="~/.claude/design/RUBRIC.md"
RUBRIC · global · judged pairwise by design-critic, never scored absolutely: "is the screen better than anchor N on this criterion? screen / anchor / tie". Anchors: ~/.claude/design/anchors/rubric/<criterion>-{1,2,3}.png (until you have them: hate anchors stand in for 1s, love anchors for 3s). Each judgement runs twice with the order swapped; runs that disagree are a tie.
Ship bar: beats the 2-anchor on every criterion, and the 3-anchor on 2 (Distinctiveness) and 8 (Signature moment). Pixel facts belong to the audit script, not to this rubric. Project additions: .offthemode/DESIGN.md §Rubric additions.

| # | Criterion | A 1-anchor shows | A 3-anchor shows |
|---|---|---|---|
| 1 | Hierarchy (blur test) | Equal weight everywhere | Blurred, still one focal point and a clear reading order |
| 2 | Distinctiveness | Could be any product; matches a logo-swap candidate or a USED.md row | Recognisably mine per TASTE.md, even from a cropped thumbnail |
| 3 | Typography | Default sizes; grey does the hierarchy | Scale jumps, optical tracking per size, balanced headings, tabular figures |
| 4 | Colour intent | Hues with no reason, framework greys, decorative gradients | Every hue maps to a DESIGN.md principle; nothing is a default; dark mode designed |
| 5 | Layout and rhythm | Centered stack, uniform gaps | A visible grid model, density contrast |
| 6 | Restraint (delete test) | Removable elements, 2+ primary actions | Nothing removable; complexity behind defaults and disclosure |
| 7 | Motion | Decorative, uninterruptible, ignores reduced motion | Causal, springs where interactive, frequency-aware |
| 8 | Signature moment | None, or several competing | One, at the moment of value, memorable, within budget |
| 9 | Copy | Template phrases, lorem, "Get started" | Domain nouns, numbers, useful empty and error states |
| 10 | State completeness | Happy path only | Every state, long strings, both themes, both platforms |
```

```file path=".offthemode/DESIGN.md"
DESIGN: {{PRODUCT_NAME}} · v{{VERSION}} · locked {{DATE}} · read before any UI work · under 150 lines
Frame: {{PERSON}} · job {{JOB}} · moment of value {{MOMENT_OF_VALUE}} · complexity we absorb {{ABSORBED_COMPLEXITY}}
Thesis: {{ONE_SENTENCE_THESIS}} · feels like {{W1}}, {{W2}}, {{W3}} · never like {{N1}}, {{N2}}, {{N3}} · TASTE.md tension it resolves: {{TENSION}}

### Principles (falsifiable, max 8, from .offthemode/design/PRINCIPLES.md)
1. {{PRINCIPLE}}

### System
- Tokens: src/styles/tokens.css (web), tokens/tokens.json (all platforms). No raw colour, size or duration in components; a new value is a token proposal, never an inline value.
- Type: display {{FONT_DISPLAY}} for {{DISPLAY_USES}}; text {{FONT_TEXT}}; mono {{FONT_MONO | none}} for {{MONO_USES}}; label treatment {{CASE_TRACKING_STEP}}. Hierarchy: size, weight, space, then colour.
- Colour: strategy {{scarce accent | colour-led | photographic | OTHER}}; neutrals {{tinted to hue N | achromatic, because}}; accent roles {{ROLES}}; one accent role per viewport outside the signature moment.
- Layout: grid model {{GRID_MODEL}}; the primary action sits at {{PRIMARY_ACTION_POSITION}} and carries data-primary; disclosure rules {{DISCLOSURE_RULES}}.
- Motion: {{MOTION_PERSONALITY}}; interactive = springs, system = duration tokens; actions done more than {{N}} times per session get no animation.
- Waiting (from the P2 feel test): {{stream | show the work | optimistic}} for {{OPERATIONS}}.
- Signature moment: {{SIGNATURE_MOMENT}} · trigger {{TRIGGER}} · budget {{PERF_BUDGET}} · fallback {{FALLBACK}}
- Platform: web {{WEB_NOTES}} · iOS {{IOS_NOTES}} · Android {{ANDROID_NOTES}}. In chrome native feel beats brand; in content brand wins.

### Data (charts, tables, timelines)
- Categorical --data-1..6 in order; sequential --data-seq-lo to --data-seq-hi via color-mix in oklch; diverging --data-div-neg, -mid, -pos. Never the chart library's palette.
- The series the user is asking about in --accent; every other series in --ink-3.
- Direct labels over legends; tabular mono on axes; hairlines at major ticks only; no 3D, gradients or drop shadows.
- Designed empty, partial and loading states for every chart.

### Unbans (DEFAULT-OFF ids from ~/.claude/design/BANS.md that this product turns on)
- {{id}}: serves principle {{N}}; applies to {{WHERE}}

### Project bans (on top of BANS.md; add the pattern to .claude/bans.txt)
| id | Banned | Why | Instead |
|---|---|---|---|

### Rubric additions (surface-specific criteria from Rubric First)
| # | Criterion | A 1-anchor shows | A 3-anchor shows |
|---|---|---|---|

### Changelog
{{DATE}} v1 locked. Every token change records reason, screens affected, rubric re-run.
```

```file path="~/.claude/design/BANS.md"
BANS · global, and the only ban list: every other file points here. Apply each reason to cases the list does not name.
HARD: zero information in any product; never unbanned. DEFAULT-OFF: banned until .offthemode/DESIGN.md §Unbans lists the id, the principle it serves and where it applies. SATURATED: allowed only with a written product reason. Lint patterns live in each stack pack's bans.txt under the same ids.

### HARD
| id | Banned | Why | Instead |
|---|---|---|---|
| fake-data | Lorem ipsum, John Doe, Acme, $1,234.56 | Fake data makes real design look fake | Edge-case-rich fixtures |
| hype-copy | "Welcome to", "Unlock", "Seamless", "Supercharge", "Elevate", "Empower", "Effortless", "Revolutionize", "Leverage", "Powered by AI" | Zero-information copy | The outcome in the user's nouns; verb + object |
| dead-copy | "Get started" as the only CTA, "Oops!", "Something went wrong", "Click here", "Are you sure?", "Submit" | Says nothing about the result | A button that predicts its result; an error with a next step |
| emoji-icon | Emoji as icons; icons that repeat their label | Instantly vibe-coded | Text labels; custom glyphs where scanning needs them |
| kit-default | Untouched component-library defaults | Reads as unset | Restyled to tokens |
| gradient-text | Decorative gradient text | Decoration carrying no information | Solid ink |
| template-page | Centered hero + 3 feature cards + pricing + FAQ; pill badge above the headline; logo marquee | The statistical-average page | Landing as Demo: the product doing its job on real data |
| off-token | Raw colour, size or duration values outside tokens | The system stops being editable in one place | A token, or a token proposal |
| layout-anim | Animating width, height, top or left; ease-in on responses | Jank and lag | transform, opacity, clip-path; springs or --ease-out |
| second-signature | A second signature moment | Dilutes the first | Quiet everywhere else |

### DEFAULT-OFF
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
| long-motion | UI transitions longer than --dur-slow; springs are judged by settle time; the signature moment is exempt | Feels slow on repeat | Rare, ceremonial transitions |
| uniform-space | Uniform medium spacing everywhere | No rhythm | Dense data tables |

### SATURATED · reviewed {{DATE}} (allowed only with a D-### product reason; every Project Retro re-dates this list)
| Trait | Where it came from |
|---|---|
| Bento grids; glass and web imitations of Liquid Glass; gradient blobs, mesh, aurora | 2022-25 SaaS templates |
| Linear-clone dark mode with a purple glow; border beams, spotlight cards, shimmer buttons | Effects libraries |
| A serif-italic word dropped into a sans headline | 2024-25 landing pages |
| Warm paper with one signal colour; uppercase mono labels in a rail; hairlines instead of cards; dithering and halftone as texture | The 2026 anti-slop mode that anti-slop skills push every agent toward |
| Satoshi, General Sans, Clash Display, Cabinet Grotesk, PP Neue Montreal as display | Template marketplaces |
| cmdk, Sonner and Vaul at their default styling | shadcn/ui wraps them, so the default is the average |
```

Enforce the bans instead of just requesting them. This hook runs after every edit (wired in P0) and reads the stack pack's pattern map. HARD ids always apply; a DEFAULT-OFF id is skipped once DESIGN.md unbans it, so a rounded consumer app or an iOS 26 app with concentric corners isn't marked down for being right. Native packs ban in their own idiom: `\.cornerRadius\(` and `Color\(red:` for SwiftUI, `RoundedCornerShape\(` and `Color\(0x` for Compose.

```file path=".claude/bans.txt"
# stack pack web-ts · format: id tier ERE · ids and reasons in ~/.claude/design/BANS.md · ids without a pattern are critic-only
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
```

```file path=".claude/hooks/lint-bans.sh"
#!/usr/bin/env bash
# PostToolUse (Claude Code): ban hits in the file just edited, from .claude/bans.txt. HARD ids always apply;
# OFF ids apply unless .offthemode/DESIGN.md "### Unbans" lists them. Exit 2 shows the hits to the agent. Needs jq; chmod +x.
f="$(jq -r '.tool_input.file_path // .file_path // empty')"; [ -f "$f" ] || exit 0
case "$f" in *tokens*|*/fixtures/*|*.md|*/bans.txt) exit 0 ;; esac
root="${CLAUDE_PROJECT_DIR:-.}"; map="$root/.claude/bans.txt"; [ -f "$map" ] || exit 0
unbans="$(sed -n '/^### Unbans/,/^### /p' "$root/docs/DESIGN.md" 2>/dev/null | grep -oE '^- [a-z0-9-]+' | cut -c3-)"
hits=""
while read -r id tier re; do
  case "$id" in ''|\#*) continue ;; esac
  [ -z "$re" ] && continue
  [ "$tier" = OFF ] && printf '%s\n' "$unbans" | grep -qx -- "$id" && continue
  h="$(grep -nE -- "$re" "$f")" && hits="$hits[$id] $h"$'\n'
done < "$map"
[ -z "$hits" ] && exit 0
printf 'Ban hits in %s:\n%s\nFix per ~/.claude/design/BANS.md, or unban an OFF id in .offthemode/DESIGN.md "### Unbans" with the principle it serves.\n' "$f" "$hits" >&2
exit 2
```

The critic lists its tools explicitly. Without a `tools` line a subagent inherits every tool, including Edit and Write, and "never edits files" becomes a request instead of a wall. The server-level `mcp__<server>` form grants that browser server's tools and nothing else.

```file path="~/.claude/agents/design-critic.md"
---
name: design-critic
description: Judges rendered UI from screenshots, pairwise against the rubric anchors, TASTE.md and the complexity budgets. Use after any visual change and before any user-facing merge. Never edits files.
tools: Read, Glob, Grep, Bash, mcp__{{BROWSER_MCP_SERVER}}
---
You are the critic, not the author. You owe these screens nothing and are paid to catch what a picky design director and a ruthless product lead would catch. Judge pixels, not intent: do not read the implementation before judging.
Load ~/.claude/design/TASTE.md, RUBRIC.md, BANS.md and USED.md; .offthemode/PRODUCT.md, DESIGN.md, COMPLEXITY.md; .offthemode/design/PRINCIPLES.md and refs/. Get evidence with the screenshot and audit commands in AGENTS.md Commands, or by driving the browser or simulator tools; open every image.
The audit owns pixel facts (off-token values, contrast, baselines, target sizes); do not re-litigate them. You own hierarchy, distinctiveness, restraint and feel.
Run the pass you were asked for: Design Critique Against Rubric (pairwise; you may be run twice with the order swapped) or Complexity Audit (counted, against budget). Every finding names file, region, the measurable problem and the fix as a token, property or element change. Never say "looks great"; report wins, losses and ties.
```

- [ ] Exit: TASTE.md exists (global, once); 30+ refs, half from outside software, motion refs as strips; 6-8 falsifiable principles traced to TASTE.md; three directions from anchors you assigned, built in isolation, divergence checked by `diverge-diff.sh` and design-critic; one base + at most two grafts, each with a reason; Saturation Check run
- [ ] Exit: tokens v1 locked (+ DTCG for native); `/specimen` covers every state, both themes, data and reduced motion, and meets the ship bar; the audit is clean, contrast included; signature moment profiled on a mid-tier phone; ban lint, shots and audits running

## P4 · Backend & Infra
<!-- origin: yours -->

> **Output:** a deploy target recorded as a decision; a data architecture chosen by the UX contract (request/response, or a sync engine spiked in P2); schema with invariants and forward-only migrations; a typed contract plus mock server; `.env.example` and a boot-time env check; a parity table; working observability; a failure-mode table with fix-now rows done; `.offthemode/ARCHITECTURE.md`. After this, "hosting it" means pointing DNS.

Keep the infrastructure boring so the product can be the exciting part. Your instinct to make the backend strong early is right. The fix is timing: pick the deploy target in P1-P2 using the spike's numbers, and build against it from the first commit, so local-to-hosted is a config change, not a migration.

> **Why:** Left alone, an agent writes localhost-tutorial code: in-memory sessions, uploads to local disk, `setTimeout` as a job queue, SQLite in dev and Postgres in prod. That's the mode. Once the rules name the target and its physical constraints ("functions die after the response", "no writable disk"), those patterns drop out of what the agent considers.

| | Serverless functions | Edge isolates | Managed containers | VPS |
|---|---|---|---|---|
| Examples | Vercel, Netlify, Lambda | Cloudflare Workers, Deno Deploy | Fly.io, Railway, Render, Cloud Run | Hetzner, DigitalOcean + Kamal or Coolify |
| Cost | ~zero idle, steep at scale | Cheapest per request, tight CPU | Per instance, in steps | Cheapest steady, paid in ops hours |
| Long jobs, sockets | Capped; managed realtime | Offload; platform primitives | Native | Native |
| Sync engine | A hosted sync service only | A hosted sync service only | Self-host the sync server beside Postgres | Self-host, you run it |
| Pick when | Web-first, spiky, tiny team | Latency-critical light reads | Complex product: workers, sockets, sync, mobile | Steady load, cost-sensitive |

> **Rule:** For a complex product with mobile clients, the least-regret default is managed containers, managed Postgres in the same region, a durable job runner, and the marketing site on serverless. Deviate only with a written reason and a "revisit when".

### The UX contract picks the data architecture

Product-first means the UX contract chooses the data layer, not habit. Request/response (tRPC or OpenAPI over Postgres plus a queue) is the right default until the contract asks for instant mutations with undo, offline writes, state that survives reload and no spinners, which is most of the P5 state rules. Then every one of those properties gets hand-built per mutation (cache write, rollback, offline queue, conflict handling), and that's exactly where "complex inside" quietly becomes "buggy outside".

> **Rule:** If the UX contract requires offline writes, multiplayer, or instant mutation on more than half of core-journey actions, spike a sync architecture in P2 before choosing the API style.

| Family | Candidates | Fits |
|---|---|---|
| Sync engine over Postgres | Zero, ElectricSQL, PowerSync | You keep Postgres and SQL; clients query a local, reactive replica |
| Reactive hosted backend | Convex, InstantDB | Small team, realtime by default, and you accept the platform |
| CRDTs for shared documents | Yjs, Automerge | Collaborative text, canvases, anything merged edit by edit |

Compare the winner against request/response on the same core journey: code per optimistic mutation, conflict semantics, the authorization model (sync rules or query permissions versus endpoint checks, and how you test each), the mobile offline story, and lock-in (can your data and queries leave). Record the result as a D-###, and the rest of P4 (contract, authz, parity) applies to whichever you chose.

### Data model, then contract

The schema is P4's first artifact, and its nouns become P5's navigation. Enforce each invariant at the lowest layer that can hold it. Use UUIDv7 or ULID IDs, UTC `timestamptz`, money as integer minor units plus currency, and forward-only migrations (expand, backfill, contract).

> **Why:** Agents write check-then-insert in app code because tutorials do, and under concurrency it races. A unique or `CHECK` constraint can't race. Give the reason ("two requests can both pass the check") and the agent applies it to invariants you never listed.

> **Trap:** Tables generated from UI mocks are screen-shaped and break the moment a second screen needs the same data. Model the domain, then shape view models per screen.

```prompt title="Data Model With Invariants"
Read .offthemode/PRODUCT.md, .offthemode/SKELETON.md, ~/.claude/experts/expert-backend.md. No application code yet. Design the data model for {{?PRODUCT_NAME}} as someone who has operated {{DATABASE}} at maintainer level: reason from the engine's real behavior (constraints, locking, index structures, isolation), not ORM tutorials.
1. Entities named as the user names them (GLOSSARY.md, definitions from SKELETON.md §Domain model): who can see or change each, lifecycle states.
2. Relationships: cardinality and deletion semantics (cascade, restrict, soft-delete, archive), justified.
3. Invariants in plain language, each with WHERE it is enforced (DB constraint preferred, then transaction + lock, then policy code) and why if not the DB.
4. Schema in {{ORM_OR_SQL}}: {{ID_STRATEGY}} IDs, timestamptz UTC, integer money + currency, explicit NOT NULL, an index per query implied by ROUTES.md, a comment per table naming its invariants. If a sync engine was chosen, the sync rules or permissions next to each table.
5. Forward-only migration plan. The five hottest queries, the index serving each, expected rows scanned.
Seed data comes from Build the Seed. List open questions instead of guessing ownership or deletion semantics.
```

| Contract style | Best when | Trap |
|---|---|---|
| OpenAPI (generated) | Native mobile, public API | Hand-edited specs drift; generate one side from the other |
| tRPC | TS monorepo, web + React Native | Old mobile builds break on renamed procedures |
| GraphQL | Many screens composing overlapping data | N+1, per-field authz, hard caching |
| Server actions | Web-only mutations | Still public endpoints; authorize each |
| Sync engine / reactive backend | Offline, multiplayer, mostly-instant mutations | Authorization moves into sync rules or queries; test them like endpoints |

Use one schema library for types, validation and forms (Zod, Valibot or ArkType on TS; Codable, kotlinx.serialization or freezed natively), and parse at every boundary: HTTP, webhooks, queue messages, env, vendor responses. Errors go out as RFC 9457 problem+json with a stable `code` from a catalog, and the UI maps codes to copy, which become P5's error states. Any mutation that charges, sends or calls a vendor takes an `Idempotency-Key`, generated once per user intent. The server stores key, request hash and response, and replays on duplicates. Paginate with cursors. Old mobile builds stay live for months, so contract changes are additive only, with a minimum-version check.

> **Pro move:** Generate a mock server from the contract on day one. P5's clickable skeleton builds against it while P4 implements handlers, so the two phases run in parallel.

```prompt title="Contract-First API"
From {{SCHEMA_PATH}} and .offthemode/ROUTES.md, define the API contract before any handler exists. Style {{CONTRACT_STYLE}}; clients {{CLIENTS}}.
Per operation: authentication; authorization rule (matrix in .offthemode/SECURITY.md); input/output schemas in {{SCHEMA_LIB}}; catalog error codes (problem+json, never ad-hoc strings); idempotency (natural, or Idempotency-Key with storage and replay); cursor pagination and filter/sort params matching ROUTES.md URL state; rate-limit bucket; cache semantics; compatibility (additive only, or a versioning plan).
Then generate a typed client and a mock server the frontend can use now; write contract tests (malformed -> 400 problem, no auth -> 401, wrong actor -> 403, success -> documented shape); flag screens needing more than one round-trip and propose screen-shaped endpoints. Responses are view models, never raw rows.
```

### The backbone

| Concern | Default | Non-negotiable |
|---|---|---|
| Jobs | Anything slow or touching a vendor: Inngest, Trigger.dev, Temporal, pg-boss, Graphile Worker or BullMQ | Safe to run twice, backoff with jitter, dead-letter, visible depth |
| Caching | CDN caching for public reads; app cache only after measuring | A named invalidation trigger per cached value |
| Files | S3-compatible storage, presigned direct uploads | Bytes never pass through your API; type and size checked server-side |
| Realtime | Only if the moment of value needs it: SSE for push, WebSockets for bidirectional, a sync engine when the contract says so | Reconnect with resume; visible connection state |
| Auth | Web: httpOnly Secure SameSite cookies. Mobile: short access token + rotating refresh in Keychain/Keystore | No tokens in localStorage or URLs |
| Authorization | One `can(actor, action, resource)` module + Postgres RLS (or the sync engine's rules) | Never inferred from hidden buttons |
| Rate limits | Per user and IP at the edge; strict on auth, search, expensive routes | 429 with `Retry-After` |

### Parity, hosting, observability

Environments differ in config values, never code paths. That means Compose or a devcontainer mirroring prod's major versions, secrets in a manager (1Password CLI, Doppler, Infisical, or the platform store) with gitleaks in pre-commit and CI, per-PR preview databases (Neon and Supabase both branch), and IaC (Terraform/OpenTofu, Pulumi, SST) for whatever the platform config doesn't cover. Logs are structured JSON with `requestId`, `traceId`, route and `durationMs`, and never PII. Instrument with OpenTelemetry over OTLP. Split health into `/healthz` and `/readyz`, and point uptime checks and a synthetic core-journey run at them. Add budget alerts per provider, and run point-in-time recovery restore drills on a schedule: until you've restored a backup, you don't know it works.

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

The rule is stack-agnostic: every entrypoint validates the environment at boot and fails with key names, never values. `{{ENV_CHECK_CMD}}` names your stack pack's version; this is the web-ts one.

```file path="src/env.ts"
// stack pack web-ts · imported first by every entrypoint (server, worker, scripts). Zod 4.
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
Goal: moving {{?PRODUCT_NAME}} from local to {{?DEPLOY_TARGET}} is a non-event; environments differ in config values only. Plan before diff.
1. One-command local stack ({{COMPOSE_OR_DEVCONTAINER}}) with prod's major versions of {{DATABASE}}, {{QUEUE_OR_CACHE}}, the sync server if any, and S3-compatible storage. No SQLite-for-dev, no in-memory stand-ins for anything durable in prod.
2. Boot-time env validation ({{?ENV_CHECK_CMD}}), failing with key names only; server and client vars split by framework prefix; .env.example in sync; secrets from {{SECRETS_MANAGER}}; secret scanning in pre-commit and CI.
3. CI: typecheck, lint, unit + contract tests, migrations on an empty DB, seed; block merge on failure. Migrations run as a release step before new code serves traffic.
4. Per-PR preview environment with an isolated seeded database; IaC ({{IAC_TOOL}}) for anything outside the platform config.
5. Parity table in .offthemode/ARCHITECTURE.md (local vs preview vs prod per dependency). Every difference is a future bug; shrink it.
Never provision paid resources without asking.
```

```prompt title="Hosting Decision"
Choose hosting for {{?PRODUCT_NAME}} from workload facts, not popularity. Every assumption is a named, editable number; mark results estimate or measured.
Facts: clients {{CLIENTS}}; users at launch / 12 months {{N_LAUNCH}} / {{N_12MO}}; peak RPS = DAU x sessions x requests per core journey (ROUTES.md) x peak ratio; longest job {{LONGEST_JOB}}; realtime or sync {{REALTIME_OR_SYNC}}; regions {{REGIONS}}; budget {{BUDGET}}; ops appetite {{OPS_APPETITE}}; core envelope from P2 {{?CORE_CONTRACT}}.
1. Score serverless, edge, managed containers and VPS on monthly cost at launch, 10x, 100x (egress, storage, seats, per-call APIs {{PAID_APIS}}); cold starts on the core journey; long-running work; WebSockets and sync servers; compute-to-DB latency; lock-in; ops burden.
2. What breaks first at 10x (connections, a lock, a seq scan, a vendor rate limit); DB size at 12 months; cost per active user and per core action.
Output: the matrix with numbers; one recommendation with its strongest reason and a "revisit when"; the escape hatch (jobs behind an interface, storage behind the S3 API) that keeps a future move under a week. Record a D-### and summarize in .offthemode/ARCHITECTURE.md.
```

> **Pro move:** Your "logging for context" habit applies at runtime too. Give the agent `{{LOGS_CMD}}`, which tails structured logs and recent errors, and a standing rule to read runtime evidence before theorizing about a bug. Agents that can observe stop guessing.

```prompt title="Failure-Mode Review"
Review {{SCOPE}} as the engineer on call at 3am. For every dependency and core-journey step in .offthemode/ROUTES.md: what happens when it is slow (p99 x10), down, returns garbage, or succeeds twice? What does the user see (no matching state in the inventory is a finding)? Which invariant is at risk? How do we know ("a user tells us" is a finding)? How do we recover, with the exact command?
Also: deploy mid-request, migration failing halfway, 1M queued jobs, secret rotation, DB connections exhausted, duplicate or out-of-order webhooks, clock skew, a sync client offline for a week, one user hammering the most expensive endpoint.
Output: Failure | Blast radius | User sees | Detection | Recovery | Fix now / accept / later. Then implement fix-now rows, smallest first.
```

```file path=".offthemode/ARCHITECTURE.md"
ARCHITECTURE: {{PRODUCT_NAME}} · read before any backend, data or infra change; update in the same commit. Decisions live in DECISIONS.md.

### Deploy target and data architecture
Compute {{PROVIDER_AND_MODEL}} in {{REGION}}; database {{DB_PROVIDER}}, same region {{YES_NO_WHY}}; data architecture {{request/response | SYNC_ENGINE}} (D-{{NNN}}); revisit when {{CONDITION}}.
Code runs there unchanged: no local disk writes, no in-process timers for work that must survive, no request-shared memory. Schema changes only via new migrations; never edit an applied one. A new dependency or service updates the parity table and DECISIONS.md in the same change.
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
Style {{STYLE}} at {{PATH}} · error catalog {{PATH}} · Idempotency-Key on {{OPERATIONS}} · additive-only, min app version {{VERSION}} · authn {{METHOD}} · authz {{POLICY_PATH}} · RLS or sync rules {{WHERE}} · rate buckets {{BUCKETS}}

### Parity
| Dependency | Local | Preview | Production | Difference |
|---|---|---|---|---|

### Observability, recovery, capacity
Errors {{TOOL}} · OTLP to {{BACKEND}} · /healthz, /readyz · uptime {{TOOL}} · budget alerts {{THRESHOLDS}} · logs `{{LOGS_CMD}}` · PITR {{WINDOW}} · RPO {{RPO}} / RTO {{RTO}} · last restore drill {{DATE}} ({{DURATION}}) · capacity and cost: {{FROM_HOSTING_DECISION}}
```

## P5 · Navigation & Flows
<!-- origin: yours -->

> **Output:** `.offthemode/ROUTES.md` (route map, URL state, journeys, filled state inventory, palette commands), journeys as state machines, a dev-only state switcher, tested deep links, a clickable skeleton that passes Walk Every Flow with zero blockers, and a passed Five-Person Test.

"Site functioning first" is the right instinct, and in a complex product this is where internal complexity either gets absorbed or leaks onto the user. Navigate by nouns, put every state in the URL, model journeys as state machines, and walk the whole product as a clickable shell before any core logic exists, built against P4's mock server.

> **Trap:** The default IA is the SaaS average: a sidebar with Dashboard, Analytics, Projects, Settings. "Dashboard" is a smell, because it names the fact that you didn't know what goes there. Every primary destination should be a noun your user would say out loud.

Rank the entities by how often your person touches each one times its value, and promote 3-5 to primary destinations. Everything else is reached through a parent, search or the palette. Verbs are actions on objects, never menu items. If a user would refresh, bookmark or share a view, it lives in the URL: filters, sort, tabs, selection, route-backed modals. Opening an object pushes history, and changing a filter replaces it. Back closes a modal before it leaves the page. Scroll gets restored, and focus moves to the main heading. Every tap gets feedback inside the BUDGETS.md feedback budget. Prefetch on intent (hover, focus, touch-start), seed detail views from the cached list item, and hoist fetches into route loaders so they can't waterfall.

```prompt title="IA From Domain Model"
Derive the IA of {{?PRODUCT_NAME}} from its domain, not a generic app layout. Inputs: {{SCHEMA_PATH}}, .offthemode/PRODUCT.md, .offthemode/GLOSSARY.md.
1. Object map: objects the user thinks in, with content, metadata, verbs, nested objects; drop implementation-only objects.
2. Rank by frequency x value for {{?PERSON}}; at most {{MAX_PRIMARY_NAV}} become primary. Justify cuts and say where cut objects are reached.
3. Routes: collection + detail per object; per multi-field verb choose inline edit, sheet or route; stateful modals get a URL.
4. URL state per route with types and defaults; history rule (push / replace / none) per interaction.
5. Palette commands and shortcuts. Mobile: which destinations become tabs (3-5), the stack under each, a deep link per route.
Write .offthemode/ROUTES.md. Flag anywhere the IA forces the user to understand system complexity.
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
J1 {{JOURNEY}}: first run to {{MOMENT_OF_VALUE}} in {{N}} interactions, inside the PRODUCT.md time-to-value budget. Driven by e2e/journeys/j1.{{ext}}.
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

Model each core journey (first run to value, the core loop, anything touching money) as states, events and guards, using a state-machine library or a reducer over a discriminated union, so impossible states can't exist.

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

> **Why:** Agents build the happy path because that's what nearly every training example shows. A state union plus an exhaustive switch (a sealed class and `when` in Kotlin, an enum and `switch` in Swift) turns a forgotten state into a compile error, which is enforcement the agent can't talk its way around. "Handle errors" in prose never gives you that.

| State | Show | One primary action | Never |
|---|---|---|---|
| First-run | The single next step to value, prefilled from anything inferable | Take it | A feature tour |
| Empty | What lives here, plus a template or sample | Create or import | Illustration with no action |
| Loading | Geometry-matched skeleton after the BUDGETS.md indicator delay; refetch keeps content | Keep working | Full-page spinner, blanking |
| Optimistic | The result now, rollback on failure | Undo | Optimistic payments, sends, deletes |
| Partial / Error | What loaded, plus inline retry; errors in user terms, input kept | Retry or fix | Whole-page error, lost input |
| Offline | Cached reads, queued writes with a visible count | Continue | Silent failure |
| Permission-denied | Who can grant access | Request access | "Something went wrong" |

> **Pro move:** A dev-only state switcher (`?__state=empty` or a dev toolbar) forces any screen into any state, so reviews, agent screenshots and the flow walk cover every state without staging real failures.

```prompt title="State Inventory Audit"
Audit every screen in .offthemode/ROUTES.md for missing states; a happy path alone is not a finished screen. Fill the state inventory (first-run, empty, loading, partial, ideal, error, offline, permission-denied, plus stale or over-limit where relevant): what the user sees, the one primary action, the implementing component or MISSING. Apply the state rules table; errors map from catalog codes with input preserved. Then add the dev-only state switcher and implement missing states, highest-traffic screens first. Report missing-cell counts before and after.
```

On mobile, tabs hold 3-5 peer nouns, each with its own stack, and re-tapping the active tab pops to root. A cold deep link synthesizes its back stack: open `/projects/12/tasks/9` from a notification, press back, and you land on the project, not outside the app. Spend the signature transition on exactly one move, into your key object, and cross-fade under reduced motion.

**Milestone: the clickable skeleton.** Before any core logic, every route renders at its real URL with the real shell, layout and seed data. The core then plugs into a proven shell. That's your "plug and play", with IA mistakes caught at 5% of the cost. It's also the cheapest moment to put the product in front of strangers.

```prompt title="Walk Every Flow"
Walk {{?APP_URL}} with {{BROWSER_TOOL}} as a first-time user and as a power user. Collect evidence; fix nothing yet. Per route in .offthemode/ROUTES.md:
1. Open cold by URL (and by deep link on mobile): renders, correct title, focus on the main heading.
2. Click every link and primary action; record dead ends (404s, no-op buttons, placeholder links, screens with no way forward or back).
3. Back after each navigation restores place, scroll and URL state; route-backed modals close instead of leaving.
4. Change every filter, tab and sort, reload, and open the URL in a fresh context: the view must reproduce.
5. Run the core journeys keyboard-only and touch-only, at each of {{?VIEWPORTS}}, throttled and offline. Timing comes from {{?AUDIT_CMD}} (the audit-ux journey), not from watching: one tool round-trip is slower than the feedback budget.
6. Force every state via the switcher; screenshot each.
Report Route | Check | Expected | Actual | Screenshot | Severity (blocker, friction, polish). End with the three changes that remove the most friction on the path to {{?MOMENT_OF_VALUE}}. Wait for my go.
```

```prompt title="Five-Person Test"
Write a test script for journey {{JOURNEY_ID, default J1}} in .offthemode/ROUTES.md, to run on the clickable skeleton with 5 people who are neither me nor on the team.
1. Screener: who counts as {{?PERSON}} (situation, tools used today, how often they do the job), and who is out.
2. One scenario in their words, with none of our UI terms or GLOSSARY nouns, and 3 tasks, the first ending at {{?MOMENT_OF_VALUE}}.
3. What I measure: time to the moment of value, first-click correctness per task, pauses of three seconds or more (where, and what they said), and the words they use for our nouns. They think aloud; I never help beyond "what would you do?".
After I paste the notes, output: Task | Success | Time | Pause points | Their word vs the GLOSSARY term. Then the 3 changes that remove the most hesitation, each tried first as a subtraction, default or inference before any new UI, plus GLOSSARY and copy edits wherever their words differ from ours.
```

> **Rule:** The gate passes when at least 4 of 5 reach the moment of value unaided, inside the PRODUCT.md budget. Below that, make the three changes and test five new people, never the same five. Update the Evidence column: after this, Person, Job and Moment are observed, not assumed.

## Taming Complexity
<!-- origin: added -->

> **Output:** `.offthemode/COMPLEXITY.md` (budgets, verbs, disclosure map, settings ledger, audit log), a power layer for experts, and the audit-subtract-re-audit ritual run by design-critic.

Complexity is conserved (Tesler's law). What can't be removed gets carried by the system or by the user. Your products are complex by nature, so the job is deciding who carries it: the system first, and the user only when they ask.

| Layer | What lives here | Example |
|---|---|---|
| L0 System | Inference, defaults, automation, recovery | Detect timezone and currency; infer column types on import; auto-name from content; retry syncs silently |
| L1 Default surface | The 20% of capability behind 80% of sessions, one primary action | The canvas and one "Generate" |
| L2 On intent | Depth revealed by selection, focus, expansion, long-press, repeat visits | Selecting a clip reveals trim and fade in place |
| L3 Power | Everything else, fully capable, never in the way | Palette, shortcuts, advanced panel, bulk ops, API |

> **Rule:** A new capability starts in L0 if the system can do it for the user, and in L3 otherwise. It moves toward L1 only on evidence (usage data, a Five-Person Test result, or a PRODUCT.md job that fails without it). Agents add one button to the main screen per feature, so this has to be written down.

- **One primary action per surface** (screen, sheet, modal, panel, popover), marked `data-primary` so a script can count it. Blur test: in a heavily blurred render (CDP `Emulation.setEmulatedVisionDeficiency` with `blurredVision`) you can still tell what to do.
- **A countable budget.** Score = distinct actions x1 + decisions before value x2 + mandatory inputs x3 + competing emphasis x2 + nav destinations x1, measured on the L1 state (nothing selected, no menu open). Count actions, not elements: controls group by role plus accessible name, a repeated control in a list, grid or table counts once, and content links whose name is the object's title count once as "open item". Otherwise a collection with 30 row links blows the budget on the most normal screen in the product, and the agent learns to make rows non-clickable to pass.
- **Never the only gate.** Agents optimize the number they're given. Pair the score with the blur test and, once you have it, the Five-Person Test's first-click result.
- **Hover is a shortcut, never a door.** Hover may only reveal actions that are also reachable by selection, context menu or long-press, and the palette. Hover doesn't exist on touch and fails keyboard and screen-reader discovery. After every Subtraction Pass, re-run the core job keyboard-only and touch-only.
- **Defaults over settings.** Can it be inferred? Is there a default right for 80%? Can it be changed in context? Only if all three fail does it become a setting, logged in the ledger.
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

Minimal = subtraction + one bold choice. Subtraction alone lands on the most common answer: white page, gray text, rounded cards. The bold choice makes it yours, and subtraction makes the bold choice visible.

| Stunning comes from | Never from |
|---|---|
| One distinctive display face, extreme scale contrast | Gradients as filler |
| Motion that explains state: objects travel from where they were to where they go | Glass, glow and blur everywhere |
| One tactile material used consistently | Feature-card stacks, bento by default |
| A colour strategy with a reason: one scarce accent, colour-led, or photographic | Hues nobody chose |
| One signature moment with outsized care | Decoration no principle asked for: default illustrations, "New" pills, confetti on routine actions |

> **Why:** Run audits through design-critic, never the builder. A fresh context that sees only the rendered screen, the budget and PRODUCT.md is more honest than an author with its own reasoning in context. Audit every new screen, before every user-facing merge, and weekly during P6, where clutter accretes one reasonable addition at a time.

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

```prompt title="Complexity Audit"
Run as design-critic. Audit rendered screens, not code; read .offthemode/PRODUCT.md and .offthemode/COMPLEXITY.md first. Screens {{ROUTES | "the core flow"}} at each of {{?VIEWPORTS}}, each in empty, loading, error and populated states (via the state switcher), measured on the L1 state.
Per surface: (1) count, do not estimate: distinct actions (the counting rule in COMPLEXITY.md), required decisions, mandatory inputs, competing emphasis, nav destinations; show the score against budget; (2) blur test on a blurredVision render: what stands out? If it is not the primary action, or two things compete, name them; (3) elements that belong in another layer (L0/L2/L3); (4) dead ends, confirms that should be undo, settings that should be defaults, hover-only actions, decoration carrying no information.
Output one table, worst overage first: surface, score/budget, top 3 offenders with evidence. Fix nothing and recommend no moves; the Subtraction Pass chooses them. Append scores to the Audit log.
```

```prompt title="Subtraction Pass"
Bring {{SURFACE}} within budget from the latest Complexity Audit. Every job in .offthemode/PRODUCT.md must stay completable in the same number of steps or fewer. Apply in order; stop once within budget:
1. Delete elements with no job, duplicate paths, labels restating the obvious, decoration.
2. Infer (L0): remove the control, do the work automatically, show the result with a one-step override.
3. Default: the 80% option, changeable in context.
4. Disclose (L2) on selection, focus, expansion or long-press; name the trigger. Hover never as the only path.
5. Relocate (L3) to palette, shortcut or advanced panel, still findable by search.
6. Merge controls never used independently.
Exactly one primary action survives; nothing moves to L2/L3 without a findable trigger; the signature moment is untouched; no new UI may solve a subtraction. Show element -> fate -> mechanism, then implement, re-render, re-score, and re-run the core job keyboard-only and touch-only.
```

Before a screen exists, fill its Disclosure map row first. Assign each capability to exactly one layer, give every L2 item its intent signal and every L3 item its palette name and shortcut, and list anything that won't fit the L1 limit as a product question for you, not a layout problem.

```prompt title="Power-User Layer"
Build the power layer for {{?PRODUCT_NAME}} without touching default surfaces. Read the verbs table and L3 column in .offthemode/COMPLEXITY.md.
1. Command palette (Cmd/Ctrl+K on web, a search sheet on mobile): every verb x noun, plus jump-to-any-object; fuzzy match, recents first, shortcut beside each command, acts on the selection, runs inline.
2. Shortcuts: single keys for the top 5-10 verbs outside text fields, modifiers otherwise, a "?" overlay; no conflicts with OS, browser or assistive-tech bindings.
3. Bulk ops: shift-click ranges, Cmd/Ctrl-click, select all in view; one undo reverts the batch.
4. After a user repeats a slow path {{3}} times, show its shortcut once, inline and dismissible.
Zero additions to L1 beyond a palette hint; every command reachable without a keyboard. Test the core job keyboard-only and report time against the mouse path.
```

## P6 · Core Build & Iteration
<!-- origin: yours -->

> **Output:** vertical slices merged dark behind expiring flags, numbered change requests logged in `.offthemode/LOG.md` with commit hashes, screenshot baselines in `.offthemode/baselines/`, evals gating every change to a model-driven core, and refactor checkpoints and drift checks on a cadence.

Most of the hours go here, and so does most of the rot: forty locally reasonable edits that don't add up to anything. P6 keeps every change small, fenced, verified and reversible. Because the core sits behind the P2 contract, you can iterate on it hard without routing, auth or data access moving underneath.

Build vertical slices, not horizontal layers. Layers (all tables, then all endpoints, then all screens) run nothing end to end until the very end. A slice is one user-visible capability cut through every layer, done in one to three sessions. A slice is Heavy-lane work (`/slice`); most other changes are Standard (`/cr`); a copy fix is Trivial and needs neither.

> **Rule:** Every net-new visible action in a slice answers "why can't the system infer this?". Try inferring it, then defaulting it, then disclosing it. Only then does it earn a visible control. That's how an extremely complex product stays simple outside.

> **Pro move:** Flags are debt. Give each one an owner and an expiry in one typed `{{FLAGS_MODULE}}`, with a test that fails once the expiry passes. Mobile needs a remote flag source, because a shipped binary can't be rolled back.

```prompt title="Vertical Slice"
/slice {{SLICE_NAME}} {{FENCE, optional}}. Heavy lane: plan mode; wait for "go".
Resolve these from the docs and show each with its source ("PERSON <- PRODUCT.md L7"): {{?PERSON}}, {{?JOB}} and {{?MOMENT_OF_VALUE}} (PRODUCT.md); {{?PRINCIPLE}} it serves (DESIGN.md or PRODUCT.md); {{?JOURNEY_STEP}} (ROUTES.md); {{?EDGE_CASES}} (the edge seed profile); {{?FLAG_NAME}} (the flags module's naming); {{?FENCE}} if I gave none (the feature folder plus the files your plan names). Ask only about what the docs don't answer.
Restate it in 5 lines: person, job, moment of value, the single primary action, the principle. Then in order, stopping for my review after step 2:
1. Data: migration + seed rows covering empty, max length, unicode, soft-deleted owner and the edge cases.
2. Contract: request/response types and error codes. Show them before implementing.
3. API: boundary validation; the authorization matrix enforced on the server.
4. UI: tokens only (no new colours, sizes, radii, shadows, easings, fonts); one primary action carrying data-primary; the rest progressively disclosed.
5. States: every ROUTES.md state-inventory column, copy per .offthemode/VOICE.md.
6. Tests: failing logic tests first, then one e2e happy path, one abuse path (wrong user, malformed input, replay), and the journey file audit-ux drives.
7. Entry points behind the flag, off in production.
8. Run /ship.
List every new visible action and why it can't be inferred or defaulted. Touch only the fence; stop and explain if you need more.
```

"Make the dashboard feel better and fix the nav" produces a 14-file diff you can neither review nor revert. Models trained to be helpful treat anything unfenced as fair game, so the fence and the must-not-change list give them negative space. One concern per CR, and never visual and logic together, because they verify differently. Write visual CRs in tokens: "make it breathe" becomes "section gap space-8 to space-12, measure 64ch, drop card borders". Always give the WHY.

```prompt title="Change Request"
/cr CR-{{NNN}}: {{ONE_LINE_TITLE}} · type {{visual | logic | copy | perf | refactor}} (exactly one) · Standard lane unless the plan crosses into Heavy
INTENT: {{WHAT_SHOULD_BE_DIFFERENT_FOR_THE_USER}}
WHY: {{USER_PAIN | PRODUCT_PRINCIPLE | METRIC | BUG}}. Use this reason for cases I did not list.
SCOPE FENCE (only files you may edit): {{ALLOWED_FILES_OR_DIRS}}
MUST NOT CHANGE: contracts {{?APIS_TYPES_ROUTES}}; behavior {{FLOWS_THAT_MUST_STAY_IDENTICAL}}; visuals outside {{SURFACE}}; the token set; dependencies; existing tests (never edit a test to make it pass).
ACCEPTANCE: - [ ] {{OBSERVABLE_CRITERION}} - [ ] net visible actions on {{SURFACE}}: {{+0 | justify each}}
VERIFY: {{"test X red before, green after" | "shots at every viewport, light and dark, diffed against .offthemode/baselines/, audit clean" | "p95 of Y inside its budget"}}
PROCESS: restate in 3 lines with the lane and the files; if any is outside the fence, stop. Checkpoint commit "wip: before CR-{{NNN}}", then the smallest change that meets the criteria. Evidence, not claims. Anything noticed outside the fence becomes a proposed follow-up CR. Finish with /ship; the LOG line carries id, summary, files and commit hash.
```

### Iteration loops

**Test-first for logic.** Tests written afterward describe what the agent built, so they pass by construction.

```prompt title="Test-First"
Behavior: {{BEHAVIOR}}. Rules and edge cases: {{RULES}}, including empty, huge, concurrent, offline, unauthorized.
Phase 1, tests only in {{TEST_PATH}}: happy path, every rule, edge case and failure mode. Confirm each fails for the intended reason (an assertion, not an import error). Commit "test: {{BEHAVIOR}} (red)" and stop.
Phase 2, after my go: the minimum implementation to pass. Never edit, skip, weaken or delete a phase-1 test; if one looks wrong, stop and argue. Commit "feat: {{BEHAVIOR}} (green)".
Phase 3: refactor, suite green after every step.
```

> **Pro move:** Lock the tests during phase 2 with a temporary `Edit({{TEST_PATH}}/**)` deny in `.claude/settings.local.json`. A prompt is a request; a permission is a wall.

**Screenshot-first for UI.** Capture before and after with the stack pack's `{{SHOTS_CMD}}` (web: `scripts/shots.ts`; iOS: `xcrun simctl io booted screenshot`; Android: `adb exec-out screencap -p`), run the audit, let design-critic judge for at most three rounds, then make the taste call yourself. Self-critique converges fast and then oscillates, trading one flaw for another. Commit baselines of the signature moment and the three most-used screens to `.offthemode/baselines/` and diff every visual CR against them, which catches "just the button" edits that also move the hero.

**Evals for a model-driven core.** A prompt, model or retrieval change can make outputs worse while every type, unit, e2e and visual check stays green. Any CR touching prompts, model ids, retrieval or the core contract runs `{{EVAL_CMD}}`, and `/ship` blocks on a regression (Always-On · Verification Loop). Otherwise "iterate heavily on the core" means iterating on vibes.

**Rot control.** Inside files a CR already touches, the agent may fix one small smell, in its own commit. Everything else becomes a follow-up CR. Refactor checkpoints are triggered by events: every 5 CRs, a file over {{MAX_FILE_LINES}} lines, the same fix in three places, or a slice at twice its estimate.

```prompt title="Refactor Checkpoint"
Refactor checkpoint after {{LAST_CR_ID}}; behavior must not change. Survey {{SCOPE}} and rank issues by future cost: duplicated logic, oversized files, imports crossing AGENTS.md boundaries, dead exports, two patterns for one job, expired flags. Propose at most {{N}} refactors with payoff, risk and files; stop for approval. One commit per approved refactor, full suite after each, revert on red. No new dependencies, contract or visual changes; .offthemode/baselines/ must still match and evals must not regress. Update ARCHITECTURE.md and LOG.md.
```

**Git is the undo button.** Tool-level undo tracks file edits, not what shell commands did to your database or dependencies. So: a checkpoint commit before every editing run, a branch per CR, a green main, and a worktree per divergent experiment, each with its own port, database and env file. Give each worktree a different constraint (A led by typography, B by motion, C by removing something). The same prompt three times gives you three samples of one mode.

```bash
git worktree add ../{{PROJECT}}-a -b exp/cr-{{NNN}}-a   # repeat for -b, -c
git diff --stat main...exp/cr-{{NNN}}-a
git worktree remove ../{{PROJECT}}-b && git branch -D exp/cr-{{NNN}}-b
```

### When it keeps getting it wrong

> **Rule:** Two strikes, then climb one rung. Never allow a third attempt at the same fix from the same context.

| Rung | Move | Why it works |
|---|---|---|
| 1 | Paste the exact error, log, test output or screenshot | "Still broken" carries no information |
| 2 | Hypotheses Before Fixes (`/unstick`) | Breaks the patch-on-patch spiral |
| 3 | Minimal repro in a test, outside the app | Removes confounders; a small context sharpens attention |
| 4 | Handoff naming the dead end, then `/clear` (or rewind with double-Esc) | Failed attempts in context pull the next try toward them |
| 5 | Docs for the installed version, a working example, the library source | Stubborn bugs are often version drift |
| 6 | Plan mode: 3 structurally different approaches | The bug may be in the approach, not the line |
| 7 | Worktree bake-off, higher reasoning effort, or the strongest model | Samples genuinely different solutions |
| 8 | Write the 20-line kernel yourself, or change the requirement | Some things are cheaper to solve than to specify |

```prompt title="Hypotheses Before Fixes"
Stop fixing. List 3 distinct hypotheses for {{BUG}}, each with evidence for and against and one cheap experiment (log line, test, curl) that would falsify it. Run them, report results, fix only the confirmed cause, add a regression test.
```

**Drift.** Thirty locally reasonable CRs later, you have a second accent role, four button styles and a settings page nobody designed. As context gets compacted, early anchors lose weight. The SessionStart hook re-injects the PRODUCT.md north star, every CR names the principle it serves, and a drift check runs every 5 CRs and before each release. Intentional drift gets written into the docs. Undocumented drift is a bug.

```prompt title="Drift Check"
Drift check after {{LAST_CR_ID}}, read-only. Read .offthemode/PRODUCT.md and DESIGN.md in full; screenshot {{KEY_SURFACES}} at {{?VIEWPORTS}}, light and dark; read the code behind each, but not .offthemode/LOG.md until the end (judge what is there, not what was intended).
1. Product: controls serving no principle, surfaces over budget or with 2+ primary actions, complexity pushed onto users that the system could infer.
2. Visual: the De-Genericize checks and {{?AUDIT_CMD}} (report, don't fix); duplicate components; drift toward a USED.md row or a Saturated trait.
3. Signature moment: intact, fast, still the one loud thing, compared against .offthemode/baselines/.
4. Architecture: the architecture you infer from the code in 10 lines, where it disagrees with AGENTS.md boundaries, whether {{CORE_MODULE}} still iterates without touching routing, auth or data access, and code that looks copied from a tutorial.
Evidence per deviation (file:line or screenshot), marked ACCIDENTAL (propose a fix CR) or POSSIBLY INTENTIONAL (propose a doc update + DECISIONS entry). End with the three highest-leverage fixes.
```

## P7 · Security Hardening
<!-- origin: moved -->

> **Output:** `.offthemode/SECURITY.md` (imported every session through AGENTS.md), an authorization matrix with generated tests, RLS or sync rules, the bash guard hook, and the findings of Red-Team Audit, Dependency Provenance Check and Secrets Sweep, all before real users, money or data arrive.

Security at the end is the most expensive place to do it. Retrofitting authz across 40 endpoints means touching all 40. A key leaked in commit 12 lives in git history forever. And an agent with no rules will put the service key in the client, because the tutorial it's pattern-matching did. So security runs through every phase, and P7 is the adversarial audit.

| Where | Security work |
|---|---|
| P0 | SECURITY.md imported; permissions; bash guard |
| P1 | Threat sketch; draft authorization matrix |
| P4 | Secrets manager, `can()` + RLS (or sync rules), rate limits, backups |
| P6, every slice | Matrix row + deny tests, boundary validation, an abuse-path test |
| P7 | Red-team, provenance, secrets sweep, restore drill, mobile and LLM passes |

```prompt title="Threat Model the Skeleton"
Run at the end of P1 (product and complex tiers). As a security architect, threat-model {{?PRODUCT_NAME}} from .offthemode/SKELETON.md and PRODUCT.md. Platforms {{web | iOS | Android}}; sensitive data {{PII | payments | health | minors | UGC}}.
1. Data flow in mermaid with every trust boundary (client-API or client-sync, API-DB, third parties, webhooks, storage, admin, jobs, LLM calls).
2. STRIDE per boundary, plausible threats only. Top {{N}}: threat, boundary, letter, likelihood, impact, mitigation, the test that proves it, the phase that builds it.
3. The assets an attacker wants most and the cheapest path to each.
4. Decisions expensive to change later (tenant model, auth provider, ID format, where authz lives), with a recommendation now.
Propose SECURITY.md changes as a diff.
```

Broken access control is A01 in the OWASP Top 10:2025 (which replaced the 2021 list), and it now folds in SSRF. Type checks and happy-path tests never catch it, so write the matrix before the endpoints. Deny by default, and check at the object level ("can this user edit project 8f3a", not "can members edit projects"). IDs in URLs are attacker input, and hiding things in the client is UX, not security. With a sync engine, the same matrix drives its sync rules, and the generated tests run against the rules.

| Resource | Action | {{ROLE_ANON}} | {{ROLE_MEMBER}} | {{ROLE_ADMIN}} | {{ROLE_OWNER}} | Condition |
|---|---|---|---|---|---|---|
| {{RESOURCE}} | read | no | own | org | all | Admin also sees soft-deleted |
| {{RESOURCE}} | update | no | own | org | all | Locked after {{LOCK_STATE}} |
| billing | manage | no | no | no | yes | Re-auth within 10 min |

```sql
alter table {{TABLE}} enable row level security;
alter table {{TABLE}} force row level security;
create policy {{TABLE}}_tenant on {{TABLE}}
  using (org_id = current_setting('app.org_id')::uuid)
  with check (org_id = current_setting('app.org_id')::uuid);
-- the API runs `set local app.org_id = ...` inside each request's transaction
```

> **Pro move:** Make the matrix a typed object in `{{POLICY_MODULE}}`, and have it drive both the policy function and a generated test suite that tries every role x resource x action. Docs and enforcement can't drift, because they're one object.

- [ ] Inputs schema-validated, unknown fields rejected; parameterized queries; no SQL, shell or path from strings; every raw-HTML sink sanitized; `javascript:` URLs rejected
- [ ] Errors fail closed with no stacks, SQL or foreign IDs (A10:2025); CSRF via SameSite plus a token or Origin check; GET never mutates; CORS allowlist, never `*` with credentials
- [ ] Session cookie `HttpOnly; Secure; SameSite=Lax` with the `__Host-` prefix, rotated on login and privilege change; nonce CSP run as `Report-Only` for a week first
- [ ] Rate limits per IP and account on login, signup, OTP, reset, invites, search, exports, sends and paid APIs, with progressive delay rather than a lockout attackers can trigger
- [ ] Uploads: size cap, magic-byte check, images re-encoded, random keys, private buckets, short-lived presigned URLs, separate serving domain
- [ ] SSRF: one fetch function for user URLs that allowlists schemes, resolves DNS, blocks private, loopback, link-local and metadata (169.254.169.254) ranges, and re-checks every redirect
- [ ] Logs use a field allowlist; auth failures alert; backups encrypted, copied outside the primary account, and actually restored once

```http
Content-Security-Policy: default-src 'self'; script-src 'nonce-{{NONCE}}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Slopsquatting.** Supply chain failures are A03:2025, and agents add a new vector. Models hallucinate plausible package names, attackers register those names with malware inside, and an agent that installs one runs the install script on your machine. Commit the lockfile, install exactly from it in CI (`npm ci`, `pnpm install --frozen-lockfile`, or your stack's equivalent), turn install scripts off by default, and vet every new dependency.

```prompt title="Dependency Provenance Check"
Verify before installing: {{PACKAGE_LIST}}, or every dependency added since {{GIT_REF}} (diff manifest and lockfile). Query the registry directly ({{npm view <pkg> | PyPI JSON API | pub.dev | Maven Central | Swift Package Index}}). Per package:
1. Does the exact name match the library's official install docs (link)? Flag typos, hyphen/underscore swaps, wrong scopes, "-js" or "-official" suffixes.
2. First-publish and latest-release dates (flag under 90 days or a recent maintainer change); downloads and dependents versus expected popularity; a repo link that resolves and matches.
3. Install scripts and what they run; new transitive dependencies, size, advisories.
4. Could the platform or an existing dependency do this in under 50 lines?
Verdict: INSTALL, INSTALL PINNED or REJECT, with a reason. Install nothing until I approve.
```

**Mobile and LLM.**
- [ ] Tokens in Keychain / Keystore via {{SECURE_STORAGE_LIB}}, never AsyncStorage, SharedPreferences or UserDefaults. The bundle is public, so ship only keys restricted by bundle ID
- [ ] Verified Universal Links / App Links instead of custom schemes; link params untrusted; OAuth in a system browser session with PKCE, never an embedded webview; pin certificates only with a backup pin and a kill switch; audit against OWASP MASVS
- [ ] LLM features (OWASP Top 10 for LLM Applications): any text the model reads can carry instructions, and the system prompt is not a boundary. The model acts with the calling user's permissions, and send, pay, delete and share need confirmation outside the model
- [ ] Model output is untrusted: render it as text or sanitized markdown, never auto-load URLs built from it (an exfiltration channel), never pass it to eval, SQL, a shell or a path. Retrieval obeys the matrix. Per-user token budgets and a kill switch per feature; injection cases live in the eval set

**Agent safety.** Treat the agent like a fast, confident junior with root on your laptop. No production credentials on the dev machine (deploy keys live in CI only), human review on {{SENSITIVE_PATHS}}, and allow the routine, ask for the risky, deny the catastrophic (P0 settings). `/security-review` on every branch is the floor, and Red-Team Audit is the ceiling.

The guard reads the command from Claude Code's payload or Cursor's, and exit code 2 blocks in both. The production-secret pattern needs word boundaries and an underscore, or it blocks harmless commands like `grep -rn productKey` or `echo $PRODUCT_URL`.

```file path=".claude/hooks/guard-bash.sh"
#!/usr/bin/env bash
# PreToolUse (Claude Code) / beforeShellExecution (Cursor) guard. Exit 2 blocks the command and shows stderr. Needs jq; chmod +x.
cmd="$(jq -r '.tool_input.command // .command // ""')"
patterns=(
  'rm -rf (/|~|\$HOME)'
  'git push .*(--force|-f)( |$)'
  'git reset --hard origin'
  '--no-verify'
  '(drop|truncate) (table|database|schema)'
  'terraform (apply|destroy)'
  '(curl|wget) [^|]*\| *(ba|z)?sh'
  '(cat|head|tail|less) [^|]*\.env($|[^.]|\.local|\.prod)'
  '(^|[^a-z0-9_])(prod|production)_[a-z0-9]*_?(url|key|secret|token)([^a-z0-9_]|$)'
)
# add project-specific patterns above, e.g. {{EXTRA_BLOCKED_PATTERN}}
for p in "${patterns[@]}"; do
  if printf '%s' "$cmd" | grep -Eiq -- "$p"; then
    echo "Blocked by guard-bash.sh ($p). Explain why it is needed and ask the human to run it." >&2
    exit 2
  fi
done
exit 0
```

> **Trap:** Deny rules and regex hooks are guardrails, not a sandbox. They catch accidents, and a creative command can route around a pattern. Isolation catches the rest: no prod credentials on the machine, and a container for untrusted work.

```file path=".offthemode/SECURITY.md"
SECURITY RULES: {{PROJECT_NAME}} · imported every session. These override convenience; if one blocks you, stop and say so, never work around it.
1. Authorization is server-side (or in the sync rules), deny-by-default, object-level, per the matrix in {{POLICY_MODULE}}. Client checks are UX only.
2. Schema-validate every input at the boundary; reject unknown fields; parameterized queries only; never build SQL, shell, paths or URLs from user input.
3. Secrets never appear in code, logs, bundles, binaries, fixtures, prompts or commits; refer to env var names. If you see a secret, stop and tell me.
4. You have no production access and must not seek it. Never read real .env files, ~/.ssh, ~/.aws or credential stores.
5. Ask before adding, removing or upgrading any dependency; verify the exact name in official docs and the registry first.
6. Errors fail closed and leak no internals. Log only via {{LOGGER_MODULE}} and its field allowlist: never tokens, passwords, payment data or raw bodies.
7. Fetch user-supplied URLs only through {{SAFE_FETCH_MODULE}}. LLM output is untrusted input; LLM tools run with the calling user's permissions.
8. Sensitive paths {{SENSITIVE_PATHS}}: stop, summarize the security impact, wait for human review.
Stack: session {{AUTH_PROVIDER}} (HttpOnly, Secure, SameSite=Lax, __Host-, rotated on login) · CSP via {{HEADERS_MODULE}} · CORS {{ALLOWED_ORIGINS}} · rate limits {{RATE_LIMIT_MODULE}} · RLS or sync rules on {{TABLES}} · uploads {{UPLOAD_POLICY}} · mobile storage {{SECURE_STORAGE_LIB}}
Every slice: - [ ] matrix row + deny tests for wrong role and wrong owner - [ ] inputs validated, errors fail closed, one abuse-path test - [ ] no new secrets, dependencies or sensitive-path edits without sign-off
Threat model: {{THREAT_MODEL_LINK}}; update it when a trust boundary is added.
```

```prompt title="Red-Team Audit"
You are an attacker, not a reviewer. Goal: {{GOAL: read another tenant's data | gain admin | use paid features free | run code on the server | bill us for your LLM usage}} in {{?PRODUCT_NAME}}, starting from a normal {{ROLE_MEMBER}} account with insider read access to {{SCOPE}}. Test only against {{LOCAL_URL}}; never send a request to any other host.
Per area, report what you tried, the evidence (file:line, or request and response), and whether it worked:
- A01 access control: IDOR on every ID-taking route, mass assignment of role or owner, privilege escalation, untested matrix rows or sync rules, SSRF. A02 misconfiguration: headers, CSP, CORS, debug modes, verbose errors, public buckets.
- A03 supply chain: unpinned, abandoned or suspicious packages, install scripts. A04 crypto: plaintext secrets, weak hashing, non-expiring tokens.
- A05 injection: SQL, NoSQL, command, template, XSS (stored, reflected, DOM), rendered user markdown. A06 insecure design: negative quantities, races on redeem or transfer, replayed webhooks, skipped flow steps.
- A07 authentication: brute force, reset-token reuse, session fixation, logout that doesn't invalidate, missing OAuth state or PKCE. A08 integrity: unsigned webhooks, client-trusted prices or flags, unsafe deserialization.
- A09 logging: would we notice this attack; do secrets or PII reach logs? A10: what fails open on timeouts, nulls or vendor outages?
- Mobile if present (MASVS storage, network, deep links, bundle secrets); LLM if present (direct and indirect injection, tool over-permission, output rendering, unbounded consumption).
Output findings by severity with exploit steps, impact, fix and a regression test, then the three fixes that remove the most risk per hour. Fix nothing yet.
```

```prompt title="Secrets Sweep"
Sweep for secrets; report only, never print a full value (first 4 characters and location).
1. Working tree (tracked and untracked, skipping dependency and build folders) for keys, tokens, private keys, connection strings, JWTs, webhook secrets, high-entropy strings; use {{SECRET_SCANNER}} if installed.
2. Full git history on every branch: a secret later deleted has still leaked.
3. Outputs of {{WEB_BUILD_CMD}} and {{MOBILE_BUILD_CMD}}: bundles and binaries; every var exposed via {{PUBLIC_ENV_PREFIX}}, with the reason.
4. .env.example has dummy values only; .gitignore covers env files, keystores, provisioning profiles, service-account JSON; fixtures, snapshots, sample logs and CI output are clean.
Per hit: location, type, whether it looks live (judge by format and context; never call the service), fix. Anything live: rotate, then remove, then purge history. Rotation is the fix; deletion alone is not.
```

## P8 · Ship & Operate
<!-- origin: added -->

> **Output:** a passed launch checklist, first-contact surfaces built as demos, `.offthemode/RUNBOOK.md` (rollback, flag kill, secret rotation, restore), three paging alerts, a weekly signal review, and a retro that upgrades your global layer.

Hosting happened in P4. Shipping means strangers can find the product, trust it and use it legally, and you learn it's broken before they tell you.

### First contact

The landing page is where the hero-plus-three-cards mode is strongest, and an extremely complex product is the hardest thing to explain in one screen. Don't describe the product; run it. The page is a guided run of the moment of value on the demo seed, held to the same rubric, critic and budgets as product screens. The store listing and link previews follow the same rule, because for many people they're the first screen.

```prompt title="Landing as Demo"
Build the first-contact page for {{?PRODUCT_NAME}} as a guided run of {{?MOMENT_OF_VALUE}} on the demo seed.
Structure: a one-sentence thesis in {{?PERSON}}'s nouns (PRODUCT.md, GLOSSARY.md); the product doing the job (interactive, or recorded from the real app, never a mock or an illustration of UI); one proof (a number, a customer, or an artifact the product made); one action.
Rules: every section is either an interaction or a real output; no section describes a feature it doesn't show; no pricing grid or FAQ unless a PRODUCT.md job needs one on this page; same rubric, same design-critic pass, same audits and BUDGETS.md numbers as product screens.
Also: store screenshots captured from the real app on the demo seed, in moment-of-value order; per-route Open Graph images generated from tokens and real data.
```

- [ ] Per-route title and meta in voice (never "Home | X"); canonical URLs, `robots.txt`, a `sitemap.xml` generated from ROUTES.md, `noindex` on previews; Open Graph images generated per page from tokens, because the link preview is often the first impression
- [ ] Privacy policy generated from what TRACKING.md and the schema actually collect, then reviewed by a lawyer (not legal advice); terms; working account deletion and export; consent only for non-essential trackers, with reject as prominent as accept and Global Privacy Control honored; GDPR and CCPA/CPRA where your users are
- [ ] India's DPDP Act 2023 if you serve Indian users. The Rules were notified in November 2025, with most obligations applying from May 2027: per-purpose plain-language notice, affirmative consent, withdrawal as easy as giving it, a grievance contact, breach notification, verifiable parental consent for under-18s, erasure once the purpose is served
- [ ] SPF, DKIM and DMARC for transactional email; designed 404, 500, offline and maintenance states; a status page hosted apart from the app
- [ ] CI runs `{{CHECK_FULL_CMD}}`, the audits and the evals, with a preview per PR; trunk-based with flags behind one wrapper (OpenFeature is the vendor-neutral standard); staged rollout (internal, {{STAGE_1_PCT}}%, 25%, 100%) with automatic rollback on error spikes or a falling north star; expand/contract migrations, so rollback never needs a down-migration
- [ ] Errors with source maps or dSYMs tagged by release; synthetic checks on sign-in and the moment of value; field RUM against BUDGETS.md (INP only exists here); only three pages (down, error spike, north star near zero), with everything else in a daily digest, because for a solo on-call alert fatigue does more damage than incidents

```prompt title="Release Readiness"
Audit {{?PRODUCT_NAME}} against the P8 checklist: each item PASS with evidence (file, URL, screenshot), FAIL with the fix, or N/A with the reason. Then operability: can I roll back in under 5 minutes, disable {{CORE_FEATURE}} by flag, rotate every secret, restore yesterday's backup? Write .offthemode/RUNBOOK.md with exact steps. Name the three scenarios most likely to page me in week one and the alert that catches each.
```

```prompt title="Weekly Signal Review"
Inputs: {{METRICS_EXPORT}} (aggregated funnel, activation, time to value, retention), top 10 errors, eval pass-rate trend if the core is model-driven, {{FEEDBACK_EXPORT}} (PII removed).
1. Where do users stall before {{?MOMENT_OF_VALUE_EVENT}}? Quantify each drop.
2. Per stall: the complexity leaking onto the user and the default, inference or removal that would absorb it.
3. Three hypotheses ranked by activation impact, each with the smallest experiment, its flag and the deciding metric.
Suggest adding UI only if removing something cannot solve it.
```

```prompt title="Project Retro"
Project retro for {{?PRODUCT_NAME}}. Read DECISIONS.md, LESSONS.md, LOG.md, git history and the diffs to AGENTS.md, VOICE.md and prompts/. Produce diffs I approve one by one:
1. Promote: project rules that proved to be personal taste or universal standards, as exact lines for ~/.claude/ files (CLAUDE.md, TASTE.md, BANS.md, an expert profile, a stack pack) with their WHY.
2. Delete: rules that never fired, were wrong, or conflict.
3. Upgrade: prompt and command diffs with version bumps, each tied to the failure it would have prevented.
4. Extract: workflows done 3+ times that should become global commands, skills or subagents.
5. Taste: append this project's row to ~/.claude/design/USED.md; propose rubric anchors from this project's best and worst screens; re-date BANS.md §Saturated and the sourcing tables, moving anything that reached template marketplaces; flag TASTE.md for re-extraction if it is older than six months.
6. Estimates: planned vs actual per phase, and the root cause of the biggest miss.
7. One product lesson per phase that the next Interrogate My Vision should ask about, and whether the human gates changed a decision.
```

## Always-On · Verification Loop
<!-- origin: added -->

> **Output:** `{{CHECK_CMD}}`, `{{CHECK_FULL_CMD}}`, `{{AUDIT_CMD}}` and `{{EVAL_CMD}}` named in AGENTS.md, the after-edit and before-done hooks (wired in P0), the audit scripts from your stack pack, an eval set for a model-driven core, and the `/ship` command, so every `DONE:` is backed by evidence.

This is the biggest lever in the blueprint. A model is far better at fixing an error it can read than at avoiding one it was warned about in the abstract. Give it signals, make it read them, and don't let it claim done while they're red.

> **Why:** Without checks, the agent grades its own homework on how plausible the result looks. With checks, the job becomes "turn these signals green", which is objective and cheap to rerun. Every property you can turn into an assertion is one less thing a model has to judge.

| Layer | Web | Mobile | Runs |
|---|---|---|---|
| Types, lint | `tsc --noEmit` strict, ESLint or Biome | SwiftLint, ktlint, `dart analyze` | Every edit (PostToolUse) |
| Unit | Vitest / Jest | XCTest, JUnit, `flutter test` | In `{{CHECK_CMD}}`, gated on `DONE:` |
| E2E, a11y | Playwright + `@axe-core/playwright` | Maestro or Detox; platform inspectors | Per feature, CI |
| Pixel audit | `audit-computed`: tokens, contrast, baselines, targets | Snapshot tests + the pack's token lint | Per UI change, CI |
| UX assertions | `audit-ux`: feedback, primary action, thumb zone, motion | Maestro flows with timing; profiler | Per journey change, CI |
| Visual | `toHaveScreenshot()` + shots the critic judges | Simulator screenshots | Per UI change |
| Evals | `{{EVAL_CMD}}` for a model-driven core | Same | On prompt, model, retrieval or contract changes |
| Perf | Lighthouse CI, `size-limit` | Cold start + frame timing on a low-end device | CI |

```file path=".claude/hooks/after-edit.sh"
#!/usr/bin/env bash
# PostToolUse (Claude Code): lint the file just edited with the stack pack's one-file linter; exit 2 feeds the errors back. Needs jq; chmod +x.
f="$(jq -r '.tool_input.file_path // .file_path // empty')"; [ -f "$f" ] || exit 0
[[ "$f" =~ {{LINT_FILE_RE}} ]] || exit 0    # web-ts \.(ts|tsx|js|jsx)$ · swift \.swift$ · kotlin \.(kt|kts)$ · flutter \.dart$
out="$({{LINT_FILE_CMD}} "$f" 2>&1)" || { echo "Lint failed in $f:" >&2; printf '%s\n' "$out" | tail -30 >&2; exit 2; }
exit 0
```

`{{LINT_FILE_CMD}}` comes from the stack pack: `npx biome check --write` or `npx eslint --fix` (web-ts), `swiftlint lint --quiet`, `ktlint`, `dart analyze`. A Biome repo never fails every edit on a hard-coded ESLint call.

### UX assertions

The journey file drives the core journey and calls `surface()` on every screen it reaches. The script turns the UX contract into failures: the slowest interaction under 4x CPU throttle, exactly one visible primary action per surface inside the thumb zone and at least the target size, and for each motion probe, the animated properties, durations against their tokens, and whether an interrupted animation continues or snaps back.

```file path="scripts/audit-ux.ts"
// stack pack web-ts · Run: npx tsx scripts/audit-ux.ts e2e/journeys/j1.ts   (PHONE=390x844)
// Numbers come from the json block in .offthemode/BUDGETS.md and from tokens on the page. Exit 1 on any failure.
import { chromium, type Page } from "playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
type Probe = { name: string; target: string; signature?: boolean; trigger: (p: Page) => Promise<void>; reverse?: (p: Page) => Promise<void> };
const B = JSON.parse(readFileSync(".offthemode/BUDGETS.md", "utf8").match(/~~~json\n([\s\S]*?)\n~~~/)![1]);
const { journey, motionProbes = [] } = await import(pathToFileURL(resolve(process.argv[2])).href);
const [width, height] = (process.env.PHONE ?? "390x844").split("x").map(Number);
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
  else if (!s.exempt && s.cy < s.vh * (1 - B.thumb_zone_pct / 100)) fails.push(`${label}: primary action outside the thumb zone`);
  else if (s.min < s.touch) fails.push(`${label}: primary action smaller than --touch-min`);
}
await journey(page, surface);
if (worst > B.feedback_ms) fails.push(`slowest interaction took ${worst} ms under 4x CPU throttle`);
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

```ts
// e2e/journeys/j1.ts: J1 from .offthemode/ROUTES.md, shared by the e2e suite and audit-ux
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

A prompt, model or retrieval change can make the moment of value worse while types, unit, e2e and visual checks all stay green. So a model-driven core gets its own rail.

- `evals/cases/` holds 30-100 real inputs: seeded from the P2 spike and the demo and edge seeds, later from consented production samples with PII removed.
- Each case asserts **properties, not strings**: must cite a source that exists in the input, must not follow instructions embedded in retrieved text, validates against the output schema, refuses when it should.
- Graders run cheapest first: deterministic checks (schema, regex, set membership, numeric tolerance), then an LLM judge with a written rubric, calibrated against 20 cases you labelled by hand before you trust it. If it agrees with you on fewer than about 16 of 20, fix the rubric, not the threshold.
- `{{EVAL_CMD}}` runs in CI whenever prompts, model ids, retrieval config or the core contract change. No merge if the pass rate drops by more than {{EVAL_DROP_POINTS}} points, or p95 latency or cost per run leaves the P2 envelope.

```file path="evals/cases/{{case-id}}.json"
{
  "id": "{{case-id}}",
  "input": {{INPUT_JSON}},
  "must": ["{{PROPERTY, e.g. every cited source id exists in the input}}"],
  "must_not": ["{{PROPERTY, e.g. follows instructions embedded in retrieved text}}"],
  "graders": ["schema", "{{deterministic-check-id}}", "judge:{{rubric-id}}"],
  "source": "{{spike | seed:edge | production-sample, consented, PII removed}}"
}
```

```prompt title="Build the Eval Set"
Build evals/ for {{?CORE_MODULE}} (.offthemode/SKELETON.md §Core contract). Start from the P2 spike inputs and the demo and edge seeds; target {{N, default 50}} cases covering the typical input, the hardest real input, empty and huge inputs, adversarial inputs (injection in retrieved text, instructions hidden in user content), and every failure mode in the contract.
Per case: input, the properties the output must and must not have, and the graders (deterministic first; an LLM judge only for what can't be checked mechanically, with its rubric written out).
Then: the runner behind {{?EVAL_CMD}}, reporting pass rate, per-grader failures, p95 latency and cost per run; 20 cases for me to label by hand, and the judge's agreement with my labels; a CI trigger on changes to prompts, model ids, retrieval config and the core contract. Report the baseline and record it in SKELETON.md §Core contract.
```

```prompt title="Prove It Works"
Before you tell me this is done, prove it.
1. Run {{?CHECK_CMD}} and paste the last 20 lines. If anything fails, fix and rerun without asking me.
2. Run {{?AUDIT_CMD}} and {{?SHOTS_CMD}} on every surface you touched, at every one of {{?VIEWPORTS}}, light and dark (or on the simulator); open each screenshot.
3. Critique against .offthemode/DESIGN.md: grid, type scale, spacing tokens, exactly one primary action, anything that reads as a default template. Fix, re-shoot.
4. Exercise unhappy paths: empty, loading, error, offline, 10x content, largest text size.
5. Report with the first line "DONE: <lane> · <summary>", then verified (with evidence), unverified (and why), skipped.
Never write "should work". Write "verified by X" or "unverified".
```

### One command instead of five

Verification you have to remember to paste is verification that gets skipped by week two. `/ship` chains it: prove, then the critics only when the diff calls for them, then evals only when the core changed, then the log line and the `DONE:` report the Stop hook checks.

```file path="~/.claude/commands/ship.md"
---
description: Verify, critique and log the current change, then report DONE (prove, design-critic on UI diffs, inventor-critic when due, evals when due, LOG)
argument-hint: [base ref, default main]
---
Ship the current change. Base ref: $ARGUMENTS (main if empty). Use the lane you named at the start of this task.
1. Prove it: run the fast check from AGENTS.md Commands and paste the tail; run the audits and screenshots on every touched surface at every viewport, light and dark; exercise empty, loading, error, offline, 10x content and the largest text size. Fix and rerun without asking. Trivial lane: skip to step 6.
2. If the diff against the base touches a UI directory (one with a UI pack AGENTS.md): run design-critic pairwise on the new shots, twice with the order swapped. Fix the losses it names, at most 3 rounds, then list what remains for my taste call.
3. If the diff touches a contract, schema, auth, payments or more than 3 files: run inventor-critic on it. Fix each finding or rebut it with evidence.
4. If prompts, model ids, retrieval config or the core contract changed: run the eval command; a regression past the gate blocks.
5. Append one LOG.md line (date · id · summary · commit). Standard and Heavy: update STATE.md.
6. Report. First line: "DONE: <lane> · <summary>". Then verified (with evidence), unverified (and why), skipped. Never "should work".
```

> **Trap:** Agents "fix" failing tests by weakening assertions or updating snapshots, and "fix" failing audits by adding `data-audit-skip`. Tests, snapshots and skips change only when the spec changes, each change gets logged with its reason, and you review every one yourself.

## Always-On · Words & Voice
<!-- origin: added -->

> **Output:** `.offthemode/VOICE.md` (baseline in `~/.claude/voice.md`), one string catalog, and Copy Pass on every surface before it locks.

Words are the cheapest way to look non-generic, and the place where agents regress to the average hardest, because the web is saturated with identical SaaS copy. The banned words live in BANS.md with the visual bans (one list, one lint); VOICE.md holds what your voice *is*, with examples, which is what pulls the model somewhere instead of just away. Naming is product design too, which is why GLOSSARY.md is shared by code, UI and analytics.

```file path=".offthemode/VOICE.md"
VOICE: {{PRODUCT_NAME}} · baseline ~/.claude/voice.md · terms from .offthemode/GLOSSARY.md · banned words: ~/.claude/design/BANS.md (hype-copy, dead-copy) plus {{PRODUCT_SPECIFIC_WORDS}}
Character: {{ADJ_1}}, not {{FAILURE_1}}. {{ADJ_2}}, not {{FAILURE_2}}. {{ADJ_3}}, not {{FAILURE_3}}. (e.g. "precise, not clinical. warm, not cute. confident, not loud.") Reads like: {{REFERENCE_VOICE}}
Mechanics: sentence case; second person; "we" only when the company acts; grade 6-8 in UI; numbers, dates, currency and plurals via Intl; numbers beat adjectives; no exclamation marks; every string in {{STRINGS_PATH}}.

### Patterns
- Headlines name the outcome in the user's nouns: "Every invoice reconciled by 9am", not "Streamline your finances".
- Buttons are verb + object predicting the result: "Export 3 clips". Destructive confirms name the consequence: "Delete 12 files" / "Keep files".
- Errors: what happened, why if known, what to do next; never blame, never clear input.
- Empty states: what this space holds and why it matters, plus one action. Loading: silent before the BUDGETS.md indicator delay, specific ("Rendering 4 pages") after the progress-copy threshold.
```

```prompt title="Copy Pass"
Copy pass on {{SURFACE_OR_PATH}}; edit only user-facing strings and the catalog. Read .offthemode/VOICE.md, GLOSSARY.md and the copy ids in ~/.claude/design/BANS.md first.
1. Table every string: current | problem (banned word, vague verb, wrong term, too long, blames the user, a sentence a competitor could publish unchanged) | rewrite.
2. Every button predicts its result, every error has a next step, every empty state offers one action.
3. Cut 30% of the words without losing meaning. Flag concepts without a glossary term and propose one; where Five-Person Test notes show users' own words, prefer those.
Apply, then run {{?CHECK_CMD}}.
```

## Always-On · Real Data
<!-- origin: added -->

> **Output:** a content model, a deterministic seed with `demo`, `edge` and `scale` profiles in `fixtures/`, and a dev-only states gallery.

Agents design for the happy path of their own placeholder content. Layout bugs, performance cliffs and awkward empty states only show up with realistic distributions and hostile edge cases, and you can't judge "stunning" on a screen full of `John Doe`.

```prompt title="Build the Seed"
Read {{CONTENT_MODEL_PATH}} (create it if missing: entities, fields, min/typical/max length, optionality, cardinality, realistic distributions for {{MARKET}}). Build a deterministic seed (fixed random seed) at {{SEED_PATH}} with @faker-js/faker or the stack's equivalent, writing to fixtures/. Profiles by env var:
- demo: the product in month six with real users in {{MARKET}}; curated and believable; used for design reviews, the landing demo and store screenshots.
- edge: every torture-set case at least once, every lifecycle state, archived records.
- scale: {{SCALE_N}} (default 10000) rows of the heaviest entity plus one power user at 100x volume.
Add a dev-only states gallery at {{STATES_ROUTE}} rendering each primary component in every state (empty, one, many, overflow, loading, error, offline, permission denied), light and dark. Screenshot it and list what breaks.
```

- [ ] Torture set: empty and exactly one (`Intl.PluralRules`, never concatenation); 10k rows; a 500-option picker; a 5,000-character paste; an 80-character unbroken word; one-character names and mononyms
- [ ] Devanagari (taller line box), Arabic/Hebrew RTL (logical properties, mirrored icons), CJK wrapping, mixed direction; emoji ZWJ sequences truncated with `Intl.Segmenter`
- [ ] 0, negative and huge numbers; Indian (1,00,000) vs Western grouping; DST boundaries; a locale that differs from the time zone; missing, 1px-tall, 8000px and broken media; `<script>` in names, zalgo, whitespace-only, pasted rich text

> **Rule:** A screen isn't designed until its screenshots have been reviewed on both the `demo` and `edge` profiles.

## Always-On · Accessibility & Performance Budgets
<!-- origin: added -->

> **Output:** `.offthemode/BUDGETS.md` (the only owner of performance, interaction and accessibility numbers), `lighthouserc.cjs` reading it, `scripts/kit-lint.sh` in pre-commit, and a failing budget that fails the build.

Accessibility and performance are the craft signals that separate an obsessed-over product from a template, and they're the numeric form of "minimalist". "Make it fast" produces nothing. A number inside a failing check gets optimized. Restraint is also a performance strategy: one subset variable font per voice, no decorative JS, fewer elements, motion on transform and opacity. Your aesthetic and your budget point the same way.

Every number has exactly one owner. Performance, interaction and accessibility live in BUDGETS.md; motion, type and space in tokens.css; time to value in PRODUCT.md; viewports in AGENTS.md Commands. Everything else refers to them by name. When the same constraint carries two numbers in two files, the agent resolves the conflict arbitrarily, and a critic flags the kit's own tokens. `kit-lint.sh` fails the commit when a raw value appears anywhere else.

```file path=".offthemode/BUDGETS.md"
BUDGETS: {{PRODUCT_NAME}} · the only owner of performance, interaction and accessibility numbers; everything else refers to them by name. A failing budget is a failing build. Scripts read the json block; fill it before the first run.

~~~json
{
  "lcp_ms": 2500, "inp_ms": 200, "cls": 0.1, "tbt_ms": 200,
  "feedback_ms": 100, "indicator_delay_ms": 300, "progress_copy_ms": 1000,
  "js_route_kb": {{JS_KB}}, "cold_start_ms": {{COLD_START_MS}},
  "frame_ms_60hz": 16.7, "frame_ms_120hz": 8.3,
  "contrast_text": 4.5, "contrast_large": 3, "contrast_ui": 3, "large_text_px": 24, "large_bold_text_px": 18.66,
  "target_ios_pt": 44, "target_android_dp": 48, "target_pointer_min_px": 24,
  "thumb_zone_pct": 40
}
~~~

| Budget | Keys | Measured on | Enforced by |
|---|---|---|---|
| Core Web Vitals, p75 | lcp_ms, inp_ms, cls; tbt_ms is the lab stand-in for INP | Mid-tier Android over 4G | Lighthouse CI (lab) + web-vitals RUM (field, the only place INP exists) |
| Input feedback | feedback_ms | Core journey under 4x CPU throttle | audit-ux (Event Timing) |
| Loading indicator | indicator_delay_ms (nothing before it); progress_copy_ms (specific copy after it) | Every async state | States gallery + review |
| JS per route (gzip) | js_route_kb | Every route | size-limit |
| Frame time | frame_ms_60hz, frame_ms_120hz | Scroll through the scale seed on {{LOW_END_DEVICE}} | Profiler |
| Cold start (mobile) | cold_start_ms, to interactive | {{LOW_END_DEVICE}} | Release checklist |
| Contrast (WCAG 2.2 AA) | contrast_text; contrast_large at large_text_px, or large_bold_text_px when bold; contrast_ui for UI parts | Both themes | audit-computed + /specimen |
| Targets | target_ios_pt, target_android_dp; web touch = --touch-min in tokens.css; pointer-only dense UI never below target_pointer_min_px | Every interactive element | audit-computed, audit-ux |
| Thumb zone | thumb_zone_pct: the primary action's centre sits in this bottom share of the phone viewport | Every phone surface | audit-ux |
| Keyboard, screen reader | Every action reachable, focus visible, every control named with role and state | Core journeys | e2e + manual VoiceOver / TalkBack |
| Scaling, motion | 200% zoom and the largest Dynamic Type survive; a reduced-motion variant for every animation | States gallery | Review + audit-ux |
```

```file path="lighthouserc.cjs"
// Run: npx lhci autorun --config=./lighthouserc.cjs · numbers come from .offthemode/BUDGETS.md, never typed here
const fs = require("node:fs");
const b = JSON.parse(fs.readFileSync(".offthemode/BUDGETS.md", "utf8").match(/~~~json\n([\s\S]*?)\n~~~/)[1]);
module.exports = {
  ci: {
    collect: { url: ["{{URL_HOME}}", "{{URL_CORE_SURFACE}}"], numberOfRuns: 3 },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: b.lcp_ms }],
        "cumulative-layout-shift": ["error", { maxNumericValue: b.cls }],
        "total-blocking-time": ["error", { maxNumericValue: b.tbt_ms }],
      },
    },
  },
};
```

```file path="scripts/kit-lint.sh"
#!/usr/bin/env bash
# Pre-commit. (1) Raw ms / s / px values outside their owner files. (2) Always-loaded context over budget.
# Owners: tokens.css (motion, type, space) · .offthemode/BUDGETS.md (performance, interaction, accessibility) · .offthemode/PRODUCT.md (time to value) · AGENTS.md Commands (viewports).
cd "$(git rev-parse --show-toplevel)" || exit 1
fail=0
re='(^|[^0-9.a-zA-Z_-])([2-9]|[1-9][0-9]+)(\.[0-9]+)? ?(ms|px|s)([^a-zA-Z]|$)'
files="$(ls CLAUDE.md .offthemode/DESIGN.md .offthemode/VOICE.md .offthemode/ROUTES.md .offthemode/COMPLEXITY.md prompts/*.md .claude/commands/*.md {{UI_DIR}}/AGENTS.md {{API_DIR}}/AGENTS.md 2>/dev/null)"
hits="$( { [ -n "$files" ] && grep -nE "$re" $files /dev/null; grep -nE "$re" AGENTS.md /dev/null | grep -v 'viewports'; } 2>/dev/null )"
if [ -n "$hits" ]; then printf 'Raw values outside their owner files; refer by name ("--dur-quick", "feedback_ms in BUDGETS.md"):\n%s\n' "$hits" >&2; fail=1; fi
budget_kb={{CONTEXT_BUDGET_KB}}   # always loaded: global + project rules, imports, and the SessionStart injection
set -- "$HOME/.claude/CLAUDE.md" CLAUDE.md AGENTS.md .offthemode/GLOSSARY.md .offthemode/LESSONS.index.md .offthemode/SECURITY.md .offthemode/STATE.md
total=$(( $(cat "$@" 2>/dev/null | wc -c) + $(head -n 30 .offthemode/PRODUCT.md 2>/dev/null | wc -c) + $(tail -n 15 .offthemode/LOG.md 2>/dev/null | wc -c) ))
if [ $((total / 1024)) -gt "$budget_kb" ]; then
  echo "Always-loaded context is $((total / 1024)) KB against a ${budget_kb} KB budget. Biggest:" >&2
  wc -c "$@" 2>/dev/null | sort -rn | sed -n '2,5p' >&2; fail=1
fi
exit $fail
```

> **Trap:** A clean axe run doesn't make a product accessible, because automated tools catch only a minority of real issues. Once per release, do one keyboard-only pass and one screen-reader pass through the moment-of-value flow. The agent writes the script, and you run it.

## Always-On · Instrumentation
<!-- origin: added -->

> **Output:** `.offthemode/TRACKING.md` with a north-star event, a typed `track()` wrapper, and events defined in the spec before the code.

Product-first means you named a moment of value. If you can't measure users reaching it, you're iterating on vibes. Analytics bolted on later come out with inconsistent names and no link to the questions you actually had.

```file path=".offthemode/TRACKING.md"
TRACKING: {{PRODUCT_NAME}} · north star {{MOMENT_OF_VALUE_EVENT}} · activation = % of new users reaching it within {{WINDOW}} · time to value = median ms from signup_completed to the north star
- object_action, past tense, snake_case (report_exported), objects from GLOSSARY.md. Every event answers a named question; no question, no event.
- No PII in properties (no email, name, phone, free text). Money, auth and entitlement events fire server-side, since ad blockers eat client events.
- Non-essential analytics wait for consent where the law requires; honor Global Privacy Control. Code calls only the typed track() wrapper, never a vendor SDK.
- Hesitation events: abandoned flows, repeated undo, settings opened right after onboarding.

| Event | Fires exactly when | Properties | Question it answers |
|---|---|---|---|
| signup_completed | account row committed | method | Which signup path converts? |
| {{MOMENT_OF_VALUE_EVENT}} | {{EXACT_TRIGGER}} | {{PROPS}} | Do users reach core value, and how fast? |
```

The wrapper is the same pattern on every stack: one typed map of events to properties, one function, the vendor behind one line (a Swift enum with associated values, a Kotlin sealed class). The web-ts version:

```ts
type Events = {
  signup_completed: { method: "email" | "google" | "apple" };
  first_value_reached: { ms_since_signup: number; surface: string }; // rename to your north star
};
export function track<E extends keyof Events>(event: E, props: Events[E]): void {
  if (!consent.analytics()) return;
  sink.capture(event, props); // the vendor is swappable behind this line
}
```

```prompt title="Instrument This Feature"
Before writing code for {{FEATURE}}, propose 3-7 events answering {{QUESTIONS}}: name (object_action, glossary terms), exact trigger, typed properties, the question each answers. Reject events answering no question and properties that could hold PII. Add them to .offthemode/TRACKING.md and the Events type, implement through track() only, and test that each fires once with correct props on the happy path.
```

> **Pro move:** Instrument hesitation: abandoned flows, repeated undo, settings opened right after onboarding. Every stall is complexity leaking onto the user, and a candidate for a smart default.

## Always-On · Agent Orchestration
<!-- origin: added -->

> **Output:** separate contexts for research, building and review; worktrees for parallel and isolated work; headless batches for mechanical sweeps; a model and effort choice per task.

> **Rule:** Every agent starts with a blank memory, so it re-reads what you already know, and you pay for that reading again. Thirteen agents means thirteen readings; a checker agent redoes the work it checks. So: scripts for anything measurable, one agent by default, a second only for an independent review or for a large search whose raw results would otherwise sit in the main session (where every later reply re-reads them). Many agents only when the user asks, with the cost said up front.

The context window is working memory. Long sessions pile up stale and contradictory information, and a fresh context reviewing code has no stake in defending it.

| Pattern | Use when | How |
|---|---|---|
| Research subagent | Conclusions from lots of reading | The subagent reads; main context gets the summary |
| Builder / reviewer | Every diff `/ship` routes to a critic | `inventor-critic`, `design-critic` in their own contexts |
| Isolated builder | Samples that must not see each other (P3 directions, bake-offs) | A subagent with `isolation: worktree` in its frontmatter, or a fresh session per worktree |
| Parallel worktrees | 2-3 independent features | `git worktree add ../{{APP}}-{{BRANCH}} -b {{BRANCH}}`, one session each |
| Headless batch | One mechanical change across N files | `KIT_BATCH=1 claude -p` in a loop, logged |
| Phase reset | A phase boundary or a drifting session | `/handoff`, `/clear`; `/compact <focus>` only mid-task |

Headless runs set `KIT_BATCH=1`. The Stop hook then steps aside, and the global rules skip the start and end ritual, the go-gate and STATE.md writes. Otherwise N runs each rerun the full check, rewrite STATE.md over each other, and stall waiting for a "go" nobody will type.

```bash
for f in $(git ls-files '{{ROUTES_GLOB}}'); do
  KIT_BATCH=1 claude -p "Run the Copy Pass in prompts/copy-pass.md on $f. Only edit strings." \
    --allowedTools "Read,Edit,Bash({{CHECK_CMD}})" --output-format json \
    > "logs/batch/copy-$(echo "$f" | tr '/' '_').json"
done
{{CHECK_CMD}}   # once, after the batch
```

Vision interrogation, architecture, data model, threat model and nasty debugging get the strongest model, plan mode and the highest reasoning effort your tool offers. Building from a settled plan gets the default model. Mechanical sweeps get the fastest one, run headless. Review always runs in a different context from the build.

> **Trap:** Parallel agents editing the same files means merge hell. Split work by ownership, and land shared contracts (types, API schema, tokens) on main before fanning out.

## Always-On · Prompt Library
<!-- origin: added -->

> **Output:** canonical prompts in `~/.claude/prompts/` (global) and `prompts/` (project-tuned) with version headers and a CHANGELOG, the loop as global commands in `~/.claude/commands/`, and globals that change only through a retro.

Prompts that worked are assets. Retyped from memory, they lose their refinements, and without versions you can't tell which edit helped. A prompt typed twice becomes a **command** (invoked explicitly). It becomes a **skill** when it needs bundled scripts, or when the agent should load it by itself because a task matches the skill's description. The canonical text lives in plain Markdown, so Cursor or any other agent can @-mention the same file.

The placeholder convention is what makes global commands possible. A global command can't know your project, so every project fact in it is a `{{?NAME}}` the agent resolves from the docs and shows with its source. Only genuine inputs stay `{{NAME}}`, which is why `/slice checkout` works with one argument.

| | Command (`.claude/commands/<name>.md`) | Skill (`.claude/skills/<name>/SKILL.md`) |
|---|---|---|
| Runs when | You type `/<name>` | You type it, or the agent matches its `description` |
| Carries | One prompt | A prompt plus scripts and reference files |
| Useful frontmatter | `description`, `argument-hint`, `allowed-tools` | Those, plus `disable-model-invocation: true` (only you can trigger it), `context: fork` (run in its own subagent context), `paths` (activate only for matching files) |

Current Claude Code treats both as the same `/name`; the difference is packaging. Arguments arrive as `$ARGUMENTS`.

```file path="prompts/diverge.md"
version 4 · changed {{DATE}} · why: v3 still let the generator recommend its own favourite
3 directions for {{SURFACE}} that disagree on {{AXIS: metaphor | density | motion | navigation}}, one per anchor I assign ({{REF_A}}, {{REF_B}}, {{REF_C}}). Each: name, 3-line thesis, signature moment, what it gives up, main risk. If two could merge, replace one. No code. Do not recommend; a critic compares them in a separate call and I choose.
Changelog: v4 anchors assigned by me, no recommendation (a generator grading its own options picks its favourite). v3 "if two could merge, replace one". v2 "what it gives up" (v1 had no tradeoffs, so choosing was arbitrary).
```

```file path=".claude/commands/diverge.md"
---
description: Three divergent directions for a surface (wraps prompts/diverge.md)
argument-hint: <surface> <axis> <ref-a> <ref-b> <ref-c>
---
@prompts/diverge.md

Surface, axis and anchors: $ARGUMENTS
```

> **Rule:** Global files change only through a retro (Session End Handoff step 3, Project Retro), with every line carrying its reason. Otherwise they rot into contradictions, and the model tries to satisfy all of them at once.

## Always-On · Revisits
<!-- origin: yours -->

> **Output:** three on-demand commands: `/reassess` (a report), `/commentrevisit` (comment-only edits) and `/glossaryrevisit` (the plain-words summary at the top of `.offthemode/GLOSSARY.md`).

Each revisit has one job and touches only what that job owns, so you can run any of them in the middle of a normal session without it spilling into anything else.

| Command | Its one job | Touches |
|---|---|---|
| `/reassess` | Checks what has actually been built against the core concept | Nothing: it reports |
| `/commentrevisit [path]` | Makes code comments true, necessary and useful | Comments only, never code |
| `/glossaryrevisit` | Keeps a plain-language summary of the project anyone can understand | The `## In plain words` part of `.offthemode/GLOSSARY.md` |

**`/reassess` reads the code, not the docs.** Docs describe intentions; the code is what exists. It compares the code with the core concept in PRODUCT.md: what serves it, what drifted from it, what is missing, and what was built that serves no job at all. When the core can run, it pushes one real input through the whole chain, which is the only honest check for products that prove themselves end to end. It never edits anything, the checklist included; if it finds work to capture, it tells you what to pass to `/listrevisit`.

**`/commentrevisit` edits comments and nothing else.** It removes comments that lie (the code changed, the comment didn't), comments that narrate what the next line obviously does, commented-out code, and TODOs with no checklist id. It adds a short why where the code can't explain itself: a workaround, an invariant, a magic number, a security decision. It proves it touched only comments by checking that the diff has no code changes and the checks still pass. When a comment reveals a bug, it reports the bug instead of fixing it.

**`/glossaryrevisit` is for people, not agents.** The top of `.offthemode/GLOSSARY.md` says what this is, who it's for, what problem it solves, what works today and what's coming, in words anyone understands. No stack, no jargon, no feature lists: you could read it aloud to a relative or open a pitch with it. "Working today" comes from the code and the checklist, not from the plan, so it stays honest. The term list below it stays as P0 defines it.

```prompt title="Reassess Against the Core Concept"
Reassess what has been built against the core concept. Report only: edit nothing, .offthemode/CHECKLIST.md included.
1. Read the core concept, person, jobs, moment of value, refusals and principles in .offthemode/PRODUCT.md. Then read the code itself for what exists: routes and screens, handlers and jobs, the data model, and the core pipeline end to end. Docs are intent; code is fact.
2. For each piece of the core concept: built, partial or missing, citing files. Where the code does something different from the concept, say what it does and what the concept says.
3. Find drift: code that serves no job in PRODUCT.md, complexity the concept doesn't need, anything a Refusal forbids, architecture that works against the concept (a flow the concept calls instant that the code makes wait, for example), and core pieces that exist only as stubs, mocks or hardcoded data.
4. If the core can run, push one real input through the whole chain and note where it breaks or degrades.
Reply in at most 30 lines: alignment in one line (on course | drifting | off course) with the reason; then the gaps by severity, each with its evidence (file, function or run), the smallest change that realigns it, and, if it belongs in the checklist, the exact note to pass to /listrevisit.
```

```prompt title="Comment Revisit"
Comment revisit on {{?SCOPE: the path I name, else the files changed on this branch against the main branch, else the whole repo}}. Change comments only: never code, names, formatting or imports.
Remove:
- comments that no longer match the code
- comments that narrate what the next line obviously does
- commented-out code (git remembers it)
- TODO or FIXME with no checklist id; if the work is real, list it for /listrevisit instead
Add, only where the code can't explain itself:
- why a workaround exists, and when it can go
- the invariant a block protects
- where a magic number comes from
- why a security-sensitive choice was made
Fix docstrings on public interfaces that describe old behaviour.
Rules: one short line beats a paragraph; never say what well-named code already says; keep each file's existing comment style. If a comment reveals a bug (it says X, the code does Y), don't touch the code: report it.
Prove it: the diff contains only comment lines, and {{?CHECK_CMD}} still passes. Report removed, added and fixed counts per file, plus any bugs found.
```

```prompt title="Glossary Revisit"
Glossary revisit: write or update the "## In plain words" section of .offthemode/GLOSSARY.md, a summary of this project for people, not agents. Leave "## Terms" untouched.
Sources: .offthemode/PRODUCT.md for the intent; .offthemode/CHECKLIST.md and the code for what actually works today. Never describe planned work as working.
Rules:
- Anyone can understand it: a new teammate, an investor, a relative. Short sentences, everyday words.
- No technical words: no stack, framework, database, API, model or architecture names. If a product word is unavoidable, explain it under "Words you'll hear".
- Say what people can do, never how it's built.
- Under 300 words, so it fits on one screen.
Before writing, reread every sentence as someone outside tech and rewrite any they would have to ask about. If the section exists, show me what changed and why (usually "Where we are"), then write it.
```

## Mobile Addendum
<!-- origin: added -->

Everything above still applies. This is what changes on a phone.

| Phase | What changes |
|---|---|
| Rules | Pick the stack pack (expo, swift, kotlin, flutter): it supplies the one-file linter, screenshot capture, token lint and framework expert. Declare minimum OS and target devices; load `expert-mobile.md` in mobile directory packs |
| Vision | Sessions are short, one-handed and interrupted; the moment of value survives backgrounding and resumes exactly |
| Visuals | The platform owns navigation, gestures, system sheets, text input and haptic meaning, plus chrome materials (iOS 26 Liquid Glass and its large concentric corners, never faked on web; unban `glass` and `radius-8plus` for native chrome only). Brand owns type in content, colour, motion and the signature moment |
| Tokens | Safe areas and cutouts; edge-to-edge (enforced when targeting Android 15); Dynamic Type and font scale; a decision on Material dynamic colour; concentric radii as tokens; haptic tokens beside motion tokens; springs from `motion.ts` |
| Backend | Offline-first: a local DB as the UI's source of truth, a sync engine (P4), an explicit conflict policy; additive-only API plus a minimum-supported-version check |
| Navigation | Universal Links and App Links under `/.well-known/`, deferred deep links through install, Android predictive back registered ahead of time, iOS edge-swipe back never broken |
| Core | The BUDGETS.md frame budget; UI-thread animation (Reanimated, SwiftUI, Compose) with springs inheriting gesture velocity; virtualized lists; image decoding off the main thread |

> **Rule:** In chrome, native feel beats brand. In content, brand wins.

- [ ] Push permission requested in context after value, never at first launch (iOS provisional authorization; Android 13+ `POST_NOTIFICATIONS`); every push deep-links to the exact state it describes, with frequency caps
- [ ] Apple: in-app account deletion, privacy labels plus a privacy manifest, a demo account in review notes, Sign in with Apple (or another privacy-focused option) alongside third-party login, IAP for digital goods, ATT only if you track
- [ ] Google Play: Data safety form, current target API level, prominent disclosure; new personal developer accounts need a closed test with 12+ opted-in testers for 14 continuous days
- [ ] OTA (EAS Update, Shorebird) only for JS/Dart and assets, never a change of primary purpose; anything native needs a store build; pin the OTA runtime to the native build
- [ ] Phased release and staged rollout gated on crash-free sessions; a remote-config kill switch shipped before you need it; store screenshots captured from the real app on the `demo` seed, in moment-of-value order (P8, Landing as Demo)
- [ ] Device matrix: smallest and largest phones; a 2-4 GB Android on the oldest supported OS; largest text, bold text, reduced motion, VoiceOver, TalkBack; RTL and Devanagari locales; offline, flaky 3G, an incoming call, an hour in the background, a permission revoked in Settings; cutouts and a foldable

```prompt title="Mobile Platform Pass"
Review {{SCREEN_OR_FLOW}} as the engineers who designed {{PLATFORM}}'s UI framework would. Load ~/.claude/experts/expert-mobile.md and the framework profile.
1. Conventions: every place we fight the platform (custom back, fake native control, odd gesture, wrong sheet type); fix each unless it is the declared signature moment.
2. Ergonomics: the primary action in the BUDGETS.md thumb zone, targets at the BUDGETS.md platform minimums, usable one-handed.
3. Resilience: kill mid-flow and relaunch, go offline, rotate, largest text size; screenshot each; fix lost state.
4. Performance: profile a scroll through the scale seed on {{LOW_END_DEVICE}}; report dropped frames and main-thread work over the BUDGETS.md frame budget; fix the worst three.
5. Deep links: every screen opens cold from a link with state restored and a synthesized back stack.
Report in the Prove It Works format.
```

## Prompt Craft Toolkit
<!-- origin: added -->

The Laws table already covers reverse prompting, diverge-then-converge, handoffs, builder versus reviewer and versioning. These are the remaining moves. Save any you use twice as a command, and keep the canonical text in `prompts/`.

| Move | Mechanism | Template |
|---|---|---|
| Assumptions first | Surfaces hidden guesses while they're cheap to veto | Assumptions Before Action |
| Constraint stacking | Independent constraints overlap only in a small, unusual region | Constraint Stack |
| Reference anchoring | One reference carries thousands of constraints; take/ignore stops surface copying | Anchor to References |
| Ban with replacement | A bare ban primes the banned thing; an alternative gives the model somewhere to go | Ban With Replacement |
| Rubric first | Written first, it shapes generation; written after, it justifies it | Rubric First |
| Subtraction | Models are trained to be complete; explicit deletion reverses that | Subtraction Pass |
| Checkpoints | Errors compound; a verifiable exit catches drift early | Checkpoint Plan |
| Tests as spec | A failing test is a target the agent iterates on alone | Test-First |
| Few-shot from your code | The model copies the structure it sees, so show it yours | Match the Exemplar |
| Structured sections | Tags separate instructions from data; material first, ask last | Sectioned Brief |
| Escalation ladder | Being stuck is context, scope or signal, rarely intelligence | Hypotheses Before Fixes, P6 ladder |

```prompt title="Interview Me First"
Before any plan or code, interview me about {{FEATURE}}. Rounds of at most 5 numbered questions, max 3 rounds, ordered by how much the answer changes architecture or UX, each with your default and what breaks if it is wrong. Stop when no remaining question would change the plan. Record the answers as D-### entries in .offthemode/DECISIONS.md.
```

```prompt title="Assumptions Before Action"
Before changing anything, list your assumptions about {{TASK}}: data shapes, current behavior, user expectations, environment. Mark each VERIFIED (file:line) or GUESS. Resolve every GUESS you can by reading code; ask me about the rest. Then proceed.
```

```prompt title="Constraint Stack"
Design {{SURFACE}} satisfying all of these:
- Layout: {{e.g. asymmetric grid, content starts at column 3, nothing centered}}
- Type: {{DISPLAY_FACE}} for one headline only; {{TEXT_FACE}}; {{MONO}} for data; at most {{N}} steps of the --text-* scale
- Colour: per the DESIGN.md strategy; one accent role, on the primary action
- Motion: one signature transition ({{DESCRIBE}}); everything else --dur-quick or shorter, opacity and transform only
- Copy: verbs, at most 8 words per heading, no greetings, no exclamation marks
```

```prompt title="Anchor to References"
For this one change only. References: {{.offthemode/design/refs/01.png}} (take: type scale, density; ignore: colour), {{.offthemode/design/refs/motion/03-strip.png with its notes}} (take: the settle, not the overshoot), @{{src/best/Component.tsx}} (take: state and prop patterns). For each, state in one line the principle you extract and the PRINCIPLES.md or TASTE.md line it serves. Apply principles, not pixels.
```

```prompt title="Ban With Replacement"
A pattern keeps coming back that ~/.claude/design/BANS.md doesn't name yet: {{PATTERN}}. For this task, replace, don't just avoid:
- Instead of {{PATTERN}}: {{REPLACEMENT}}, because {{REASON}}.
- Instead of "Get started": the verb of the job, "{{VERB}} your first {{OBJECT}}".
If I confirm it generalizes, propose the BANS.md row (id, tier, why, instead) and the bans.txt pattern for the current stack pack.
```

```prompt title="Rubric First"
Before designing {{SURFACE}}, a surface type RUBRIC.md doesn't cover well ({{onboarding | chart | editor | landing | OTHER}}), write 3-5 surface-specific criteria for DESIGN.md §Rubric additions. For each: what a 1-anchor and a 3-anchor look like, and which files in .offthemode/design/refs/ or ~/.claude/design/anchors/ serve as those anchors. Include: primary action obvious at a glance; nothing that doesn't serve the job; the signature moment if it lives here; the {{?PERF_BUDGET}}. I approve it, then you build to it.
```

```prompt title="Checkpoint Plan"
Break {{FEATURE}} into checkpoints of at most {{SIZE}}, each ending in a runnable, verifiable state (test, screenshot, curl): goal, files, exit check, decisions I owe you. Execute checkpoint 1 only, run its exit check, append a line to .offthemode/LOG.md, stop.
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
<!-- origin: added -->

Five classics are just laws broken and live in The Laws table: adjective soup (Law 4), accepting the first visual (Law 9), feature-first prompting (Law 12), the marathon session (Law 8) and re-prompting the same fix (Law 10). These are the rest, including the ones a kit like this invites.

| Anti-pattern | What happens | Fix |
|---|---|---|
| Mega-prompt, no priorities | The easy requirements win and the hard one silently drops | Rank constraints ("first wins"), write non-goals, move standing requirements into the rules |
| "Best practices" | That phrase is the mode by definition | "What would the {{CORE_TECH}} maintainers do here, and refuse?", or load the profile |
| "Make it better" | With no target, the model does something visible, usually more | Name the axis and the evidence: "the primary action loses to the sidebar; make it win without adding elements" |
| Letting the agent pick the stack | Its default dominated its training data, and brings the default look with it | Derive the stack from product constraints in a D-### entry |
| Pasting code instead of pointing at files | Pasted code goes stale and loses its callers | @-mention paths; paste only what the agent can't reach |
| Arguing with a derailed session | Each correction adds more of the wrong path | Rewind (double-Esc), or `/handoff` and `/clear` |
| The bloated rules file | 800 lines compete on every turn | A root file readable in a minute, depth in directory packs and skills, the kit-lint context budget |
| Not reading diffs | Drive-by renames and loosened types pass the checks | `git diff --stat` first, then every hunk; one commit per checkpoint |
| Tests that agree with the code | Written afterward, they encode the bugs | Test-First, with test paths locked during implementation |
| Minimalism by amputation | Experts can't do the job, so complexity returns as workarounds | Every removed control lands in L0 or L3; the core job still completes keyboard-only and touch-only |
| The full ritual on a one-line change | Ceremony gets abandoned by week two, and then nothing is enforced | Lanes: Trivial skips the ritual; `/ship` is the only thing to remember |
| Taste by negation | Bans alone converge on the next mode | TASTE.md, extracted from what you love |
| Self-graded divergence | One author, one context, one favourite | Anchors you assign, separate worktrees, a critic that built none of them |
| Absolute scores from a same-family judge | Lenient, noisy, drifting; the loop oscillates | Pairwise against anchors, order swapped, ties on disagreement; pixel facts from the audit script |
| The same example in every repo | Worked examples become your house style | USED.md as a ban list; illustrations never reused |

## The Portable Kit
<!-- origin: added -->

The kit is a git repo (`~/agent-kit`) with three folders. `global/` gets symlinked into `~/.claude/` and follows you everywhere. `stacks/` holds one pack per stack, so every executable piece (linting, screenshots, audits, env validation, ban patterns, the framework expert) exists in that stack's idiom; the core templates only name placeholders like `{{LINT_FILE_CMD}}`, `{{SHOTS_CMD}}` and `{{ENV_CHECK_CMD}}`. `project/` gets copied into each new repo and filled in fresh. Every file template in this blueprint lives in exactly one of the three.

### The tree

```text
~/agent-kit/global/                 GLOBAL: symlinked into ~/.claude/, changed only through retros
  CLAUDE.md                         kit-mode switch, lanes, product stance, floor, done, memory (P0)
  voice.md                          voice baseline
  design/TASTE.md USED.md BANS.md RUBRIC.md                your taste, the novelty ledger, the only ban list, the pairwise rubric (P3)
  design/anchors/love/ hate/ rubric/                       taste and rubric anchors; motion as frame strips
  experts/expert-{product,web-platform,backend,mobile}.md  the profile library, plus one expert-<framework>.md per stack
  agents/inventor-critic.md agents/design-critic.md        critics, global only
  commands/{start,interview,cr,slice,prove,critique,subtract,inventor-review,unstick,handoff,ship}.md   the loop, full text, {{?}} placeholders
  commands/{listrevisit,reassess,commentrevisit,glossaryrevisit}.md   on-demand revisits
  commands/{constitution,bootstrap,taste,retro}.md         one-off rituals
  skills/visual-direction/ complexity-audit/ eval-set/     procedures with bundled scripts
  prompts/                          canonical text of every prompt template + CHANGELOG.md

~/agent-kit/stacks/{web-ts,expo,swift,kotlin,flutter}/     STACK PACKS: one per project
  project/.claude/bans.txt          ban ids as patterns in the stack's idiom
  project/scripts/                  shots, audit-computed, audit-ux (web-ts: Playwright; native: simctl, adb, Maestro)
  project/src/env.*                 boot-time env validation
  commands.env                      LINT_FILE_CMD, LINT_FILE_RE, SHOTS_CMD, AUDIT_CMD, ENV_CHECK_CMD for AGENTS.md
  expert-<framework>.md             the framework profile, linked into global/experts/

~/agent-kit/project/                PER-PROJECT: copied, then filled
  AGENTS.md CLAUDE.md                                        constitution + Claude adapter (P0)
  {{UI_DIR}}/AGENTS.md + CLAUDE.md  {{API_DIR}}/AGENTS.md + CLAUDE.md   directory packs
  .claude/settings.json                                      permissions + hooks (P0)
  .claude/hooks/before-done.sh after-edit.sh lint-bans.sh guard-bash.sh cursor-stop.sh
  .cursor/hooks.json                                         the same scripts, wired for Cursor
  .claude/commands/diverge.md                                thin wrappers over project prompts/
  .offthemode/PRODUCT.md SKELETON.md RISKS.md                       P1, P2
  .offthemode/DESIGN.md .offthemode/design/PRINCIPLES.md DIRECTIONS.md refs/ directions/   P3
  .offthemode/ARCHITECTURE.md ROUTES.md COMPLEXITY.md SECURITY.md RUNBOOK.md        P4-P8
  .offthemode/VOICE.md BUDGETS.md TRACKING.md                       Always-On
  .offthemode/CHECKLIST.md                                          the living checklist, kept by /listrevisit
  .offthemode/STATE.md DECISIONS.md LESSONS.md LESSONS.index.md GLOSSARY.md LOG.md  context log
  .offthemode/agents/pins.md .offthemode/agents/expert-{{domain}}.md       pins + project-only domains
  .offthemode/baselines/ e2e/journeys/ evals/ fixtures/
  prompts/diverge.md prompts/CHANGELOG.md                    project-tuned prompts
  src/styles/tokens.css src/styles/motion.ts tokens/tokens.json
  scripts/diverge-diff.sh scripts/kit-lint.sh .env.example lighthouserc.cjs
```

### Bootstrap in 10 minutes

0. First project on the kit only: run `/taste` (Taste Extraction) once, so P3 has something of yours to aim at.
1. `git init` (or branch an existing repo), then `cp -R ~/agent-kit/project/. .`, `cp -R ~/agent-kit/stacks/{{STACK}}/project/. .`, and `chmod +x .claude/hooks/*.sh scripts/*.sh`.
2. Put the raw vision (brain dump, voice transcript, links, screenshots) in `.offthemode/raw-vision.md` and the references in `.offthemode/design/refs/`.
3. Start a fresh agent session and run `/bootstrap` (Bootstrap New Project). It prunes by tier, fills only the facts you stated, and wires the tools.
4. Fill the AGENTS.md Commands line from the pack's `commands.env` as soon as the toolchain exists. The Stop hook, `/ship` and every `{{?}}` placeholder depend on it.
5. Smoke-test the wiring: `/clear` should print STATE.md; a trivial edit should trigger the lint hook; `cat .env` should get blocked; a reply starting `DONE:` while a check is red should get pushed back, and a question should not.
6. Install `scripts/kit-lint.sh` as a pre-commit hook, commit `chore: bootstrap agent kit`, then follow STATE.md's Next list: Interrogate My Vision, Generate the Skeleton, Draft the Constitution (lock), Core Spike.

```prompt title="Bootstrap New Project"
Bootstrap {{PROJECT_NAME}} from the agent kit and the {{STACK}} stack pack just copied into this repo. Tier: {{weekend | product | complex}}. Platforms: {{web | iOS | Android}}. Raw vision: @.offthemode/raw-vision.md.
1. List every scaffold file with unfilled {{PLACEHOLDERS}}, grouped as: fill now (only facts I stated in the raw vision, plus the stack pack's commands.env), fill after P1 (mission, stack, remaining commands), delete for this tier (per the kit's scaling table). Show the delete list and wait for my ok.
2. Delete the approved files. Fill what you can now; tag every inference [assumed]. Never invent a stack, a command, a metric or a user.
3. If code exists, detect the toolchain (package manager, framework versions from the lockfile, test and lint scripts) and fill AGENTS.md Commands; otherwise list them under Waiting on me in STATE.md.
4. Write .offthemode/STATE.md: Now = "bootstrapped"; Next = 1. Interrogate My Vision, 2. Generate the Skeleton, 3. Draft the Constitution (lock), 4. Core Spike.
5. Check the wiring: every hook in .claude/settings.json and .cursor/hooks.json points at an executable script; every @ import in CLAUDE.md and AGENTS.md files resolves; each directory pack has its one-line CLAUDE.md; .gitignore covers .env*, shots/, logs/; ~/.claude/design/TASTE.md exists (if not, tell me to run /taste).
6. If I use Cursor: nothing to add for rules, since it reads the nested AGENTS.md files natively; create .cursor/rules/*.mdc only for glob-scoped extras that don't map to a directory.
Report the remaining placeholders by file, then start item 1 of Next.
```

### Tool adapters

The files are the method. Each tool just needs a different way to load them.

| Concern | Claude Code | Cursor | Any AGENTS.md-aware agent |
|---|---|---|---|
| Global taste | `~/.claude/CLAUDE.md` + `~/.claude/design/` | User Rules (the global file) + the same design files by path | The agent's global instructions file, or prepend to AGENTS.md |
| Project rules | `CLAUDE.md` = `@AGENTS.md` + Claude specifics | AGENTS.md, read natively | AGENTS.md, read natively |
| Always-loaded docs | `@` lines inside AGENTS.md, expanded through the import | The same lines, read as file references | Same |
| Domain packs | Nested AGENTS.md + a one-line CLAUDE.md sibling; `.claude/rules/*.md` with `paths:` for globs | Nested AGENTS.md natively; `.mdc` with `globs` only for extras | Nested AGENTS.md (nearest wins) |
| Rituals and prompts | Global commands in `~/.claude/commands/` | @-mention `prompts/<name>.md` | Paste or @-mention `prompts/<name>.md` |
| Critics | Global subagents | A second chat that loads the critic file as its instructions | A second session, or a headless run of the critic prompt |
| Enforcement | Hooks in `.claude/settings.json` | `.cursor/hooks.json` runs the same scripts: it provides `CLAUDE_PROJECT_DIR` as an alias and exit 2 blocks a shell command; `afterFileEdit` can't talk back to the agent, so lint and ban hits arrive through the stop adapter's follow-up | Pre-commit + CI |
| Memory | `.offthemode/` log + SessionStart hook | Same files + the `/start` prompt | Same files + the `/start` prompt |

```file path=".cursor/hooks.json"
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [{ "command": ".claude/hooks/guard-bash.sh" }],
    "afterFileEdit": [{ "command": ".claude/hooks/after-edit.sh" }],
    "stop": [{ "command": ".claude/hooks/cursor-stop.sh", "timeout": 300 }]
  }
}
```

```file path=".claude/hooks/cursor-stop.sh"
#!/usr/bin/env bash
# Cursor stop adapter. Cursor's stop payload carries no final message, so this nudges instead of gating:
# once per loop, if code changed and checks or bans fail, it sends the failures back as a follow-up message. Needs jq; chmod +x.
input="$(cat)"
[ "$(printf '%s' "$input" | jq -r '.status // ""')" = completed ] || exit 0
[ "$(printf '%s' "$input" | jq -r '.loop_count // 0')" -lt 1 ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
changed="$( { git diff --name-only HEAD; git ls-files --others --exclude-standard; } 2>/dev/null | grep -v '^.offthemode/' )"
[ -z "$changed" ] && exit 0
msg=""
out="$({{CHECK_CMD}} 2>&1)" || msg="Checks fail: $(printf '%s' "$out" | tail -20)"
for f in $changed; do
  b="$(printf '{"file_path":"%s"}' "$PWD/$f" | .claude/hooks/lint-bans.sh 2>&1 >/dev/null)" && continue
  msg="$msg"$'\n'"$b"
done
[ -z "$msg" ] && exit 0
jq -n --arg m "Before reporting DONE: fix these.$msg" '{followup_message: $m}'
```

> **Rule:** Never fork the content per tool, and never fork the global layer per project. There is one AGENTS.md, one .offthemode/ tree, one prompts/ folder and one set of critics, and each adapter is a pointer. When a tool can't enforce something, that check moves to pre-commit and CI, where it applies to every agent and every human.

### Scale it down, scale it up

| Part | Weekend build | Product | Extremely complex product |
|---|---|---|---|
| P0 | Global file + 30-line AGENTS.md, STATE.md, Stop hook | Full scaffold | + a directory pack per bounded context, an expert profile per hard domain |
| Product + P1 | PRODUCT.md lite (~20 lines, evidence tags included); SKELETON: domain, surfaces, stack | Full, alignment loop | + `.offthemode/skeleton/*.md` per context, Pre-Mortem per capability, Threat Model the Skeleton |
| P2 | 1-2 h, or "no spike needed" logged; feel check on yourself | Spike + feel prototype with 3 people | 1-3 days per top risk, parallel spike worktrees, sync spike, eval set v0 |
| P3 | Constraint Stack + the tokens knobs, one direction checked against USED.md | Three isolated directions, specimen, pairwise rubric, audits, ban lint | + DTCG tokens generating every platform's theme, baselines, chart grammar |
| P4-P5 | Managed backend, route map only | Full ARCHITECTURE + ROUTES + state inventory, Five-Person Test | + sync decision, Failure-Mode Review, capacity math, RLS on every table, synthesized deep-link stacks |
| Taming | One primary action per surface | Budgets + Complexity Audit | + disclosure map per screen, Power-User Layer, weekly audits |
| P6 | `/cr` + `/ship` | Slices, flags, CR log, baselines | + Drift Check and Refactor Checkpoint every 5 CRs, bake-offs, eval gate |
| P7 | SECURITY.md, `/security-review`, Secrets Sweep | + Provenance, Red-Team before launch | + generated matrix tests, mobile and LLM passes, second-model review on sensitive paths |
| P8 + Always-On | Launch checklist, verification hooks, BANS lint | All seven rails, Landing as Demo, runbook, alerts | + staged rollouts, headless batches, Weekly Signal Review |

Scaling down means deleting files, not skipping thinking. A weekend build still writes the five product decisions, just in twenty lines, and still runs in lanes.

## The One-Page Loop
<!-- origin: added -->

Every session, on every project, runs the same six beats, and the lane decides how much of each you pay for. **Trivial** (one file, a few lines, no contract): do it, `/prove`, one-line report. **Standard** (`/cr`): plan inline, proceed unless you object, `/ship`. **Heavy** (`/slice`: schema, auth, payments, a public contract, a new dependency, more than 3 files): plan mode, wait for "go", `/ship`. The agent names the lane in its first line; you veto.

1. **Start.** `/clear` or a fresh session; the hook injects STATE, the PRODUCT north star and the LOG tail. Run `/start`, read the lane and the restated plan, and correct it or let it run (Heavy waits for "go").
2. **Change.** One concern. A new capability is `/slice`; anything else is `/cr`. If the feature still has open decisions, `/interview` first.
3. **Build.** The agent makes a checkpoint commit and works inside the fence; hooks lint every edit, flag bans, and block risky shell commands. Checkpoints and questions never start with `DONE:`, so the Stop hook leaves them alone.
4. **Verify.** `/ship`: prove, then design-critic when the diff touches UI, inventor-critic when it touches a contract, schema, auth or more than 3 files, evals when the core changed. A new or grown surface also gets `/subtract`. After two failed fixes, `/unstick` and climb the ladder.
5. **Log.** `/ship` writes the LOG line and, for Standard and Heavy, updates STATE; decisions become D-### entries; a correction seen twice becomes a LESSONS entry.
6. **Handoff.** `/handoff`, commit, `/clear`.

| Command | Wraps | Use it |
|---|---|---|
| `/start` | Session Start | Every session |
| `/interview` | Interview Me First | Before any feature that still has open decisions |
| `/cr` | Change Request | Standard lane: one concern |
| `/slice` | Vertical Slice | Heavy lane: a new user-visible capability |
| `/prove` | Prove It Works | Trivial lane; first step inside `/ship` |
| `/critique` | Screenshot Critique Loop | UI changes; runs inside `/ship` for UI diffs |
| `/subtract` | Subtraction Pass | Every new or grown surface |
| `/inventor-review` | Inventor-Level Review | Heavy plans; runs inside `/ship` when due (named to avoid Claude Code's built-in `/review`) |
| `/unstick` | Hypotheses Before Fixes | The second time a fix fails |
| `/handoff` | Session End Handoff | Every Standard or Heavy session end |
| `/ship` | prove, critique, review, evals, LOG, `DONE:` | Before any completion report |
| `/listrevisit [note]` | List Revisit | View the checklist, or update it with a new feature or idea; creates it the first time |
| `/reassess` | Reassess Against the Core Concept | Whenever you want to know if what's built still serves the core concept |
| `/commentrevisit [path]` | Comment Revisit | Before a merge, or when comments feel stale |
| `/glossaryrevisit` | Glossary Revisit | Before presenting the project, or after a milestone |

Cadence on top of the loop: `/reassess` and **Refactor Checkpoint** every 5 CRs; **Complexity Audit** weekly during P6; **Five-Person Test** whenever the core journey changes shape; **Weekly Signal Review** after launch; **Project Retro** at the end of every project, so the global layer, your taste and the novelty ledger compound; **Taste Extraction** every six months.
