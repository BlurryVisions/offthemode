RULES · {{?PROJECT_NAME}} · read before working. The standards every change is held to. Lines with {{placeholders}} are filled at setup; the rest is the Off the Mode floor.

## This project
- What it is: {{?THESIS}} (the full vision is in .offthemode/PRODUCT.md)
- Stack: {{?STACK}} · Platforms: {{?PLATFORMS}}
- Other rule files still in force: {{?EXISTING_RULE_FILES | none, their lessons are in §Project specifics}}

## Project specifics
Facts and lessons that only this codebase could teach: a framework quirk that broke something, a data rule, a required check, a boundary that must hold. Each line says what to do and why. A correction you had to give twice becomes a line here.
- {{?PROJECT_RULE: what to do, because why}}

## How to work
- Talk first, then do. For anything beyond a small fix (a typo, a one-line change), restate the task and your plan in a few lines and wait for my go. Say what you changed when you're done.
- One concern per change. The smallest diff that fully solves it; drive-by refactors become follow-ups.
- Never build on an assumption. When something is unclear (what I want, how something should behave, what the code does), write it as a hypothesis, "I think X, because Y", so it is clear, then confirm it before building on it: check it in the code or docs, or ask me. Questions come batched and numbered, at most 5, each with your recommended answer.
- Read STATE.md when you start. When a real piece of work ends, rewrite STATE.md (now, next, in flight) and add any decision to DECISIONS.md.
- Sessions stay free. Never force the checklist; /listrevisit catches up afterwards.

## Guides (open the matching one before the work; once per session is enough)
Off the Mode has a guide for each kind of work. Before you plan or do work of that kind, open its guide now, in this reply, not as a later step (the get_method tool with the name below, or the file ending in that name in the offthemode skill's method/ folder) and follow it. Skip this for a one-line fix.
| Before you... | Open |
|---|---|
| shape the product or plan a new feature | product-first-doctrine, p1-vision-skeleton |
| prove something risky before building on it | p2-core-spike |
| design or change a screen, component, style or motion | p3-visual-language |
| simplify a dense or complex screen | taming-complexity |
| change the data model, an API, background jobs, config or hosting | p4-backend-infra |
| add or change routes, navigation, flows or screen states | p5-navigation-flows |
| build or rework a core fragment | p6-core-build-iteration |
| touch login, permissions, user input, uploads, secrets, payments or AI features | p7-security-hardening |
| launch, release or set up monitoring | p8-ship-operate |
| write words people will read | always-on-words-voice |
| write or change tests and checks | always-on-verification-loop |
| create seed or demo data | always-on-real-data |
| work on accessibility or speed | always-on-accessibility-performance-budgets |
| add analytics events | always-on-instrumentation |
| work on a mobile app | mobile-addendum |
| split work across several agents | always-on-agent-orchestration |

## Product first
- No feature without a job from PRODUCT.md. A task that traces to no person, job or moment of value: ask why before building it.
- Complex inside, simple outside: infer, default, reveal depth on demand, undo instead of confirm. Never hand the user a decision the system could make.
- If a request contradicts a refusal or principle in PRODUCT.md, quote the line before acting.

## Depth
- Work like the people who designed the tools: specs, official docs, and the installed version's source and types. Not tutorials, not memory. Cite file:line when library behaviour matters.
- Platform before dependency. A new dependency needs a DECISIONS.md entry: what it does that 50 lines of ours can't, its weight, and the cost of removing it. Check that the package exists and is the real one before installing it.

## Code
- No escape hatches from the type system (any, force-unwrap, unchecked casts) unless a comment says why.
- Parse input at every boundary, then trust the types inside.
- Errors are typed and surfaced, never swallowed.
- One way to do each thing (data access, state, errors, config). No duplicate helpers.
- Names come from GLOSSARY.md §Terms: one word per concept across code, UI and copy.
- Comments say why, never what. No commented-out code, no stray debug output, no TODO without a checklist id.

## Look and feel (only if the product has a UI)
- Nothing that could sit on any other product unchanged. If a screen looks like the average (a stock landing layout, an untouched component-library look, blue-purple gradients, emoji as icons, a font chosen because it is the default), stop and say so.
- Stunning comes from restraint: typography, spacing, motion and one signature moment. Never from decoration.
- One primary action per screen. Every screen has empty, loading, error, offline and no-permission states.
- Visual values come from one set of design tokens, never hard-coded.
- Layout is checked section by section at phone, tablet and wide widths, not just the first screen. Grids use a column count their items fill (8 items: 4+4 or 2x4, never 7+1); nothing sits alone in a row, nothing is clipped.

## Safety
- Authorization is checked on the server for every action, never only in the UI.
- No secret in the repo, the client bundle or the logs.

## Efficiency (spend tokens on results, not on repetition)
- No caps: use whatever the job needs. The aim is that nothing gets paid for twice.
- Measure with scripts, not by reading: tests, layout checks and link checks run as commands, and you read their short output, never the raw data.
- Read narrow: search first, then open only the lines you need. Never read generated files, lockfiles or build output; tail logs instead of reading them whole.
- Scout first: one agent assesses the task, finds the files it actually touches (and what those depend on, not the whole repo), writes a short brief, and decides how many agents the job needs. A small job stays with one.
- Many agents, one reading: every agent starts with the scout's brief word for word (the shared start is read from cache at a fraction of the price) and its own task after it. Start one first and the rest once it is running, so they read the cache instead of all writing it. Agents return short, structured results.
- Keep sessions short: when a piece of work ends, update STATE.md and start fresh. A long session re-reads its whole history on every reply.
- Open a method sheet or template only when you need it.
- For big runs, say roughly what they will cost before starting, then go.

## Budgets (the only place these numbers live)
- Load: main content visible within {{LCP_MS | 2500}} ms on a mid-tier phone; feedback to any tap or click within {{FEEDBACK_MS | 100}} ms.
- Weight: at most {{JS_KB_PER_PAGE}} KB of script per page, gzipped.
- Accessibility: WCAG 2.2 AA contrast; touch targets at least 44 pt on iOS, 48 dp on Android, 24 px for pointer-only UI.
- {{PROJECT_SPECIFIC_BUDGET | delete this line}}

## Commands (fill once the toolchain exists; the revisit commands run these)
check `{{?CHECK_CMD}}` · full check `{{?CHECK_FULL_CMD}}` · run `{{?DEV_CMD}}` · end-to-end `{{?E2E_CMD}}` · evals `{{?EVAL_CMD | none}}` · dead code `{{?DEADCODE_CMD}}` · bundle size `{{?BUNDLE_CMD | none}}` · audit `{{?AUDIT_CMD | none}}`

## Done means verified
Checks pass, the thing actually ran, and UI changes were looked at on screen. "Should work" is not done: say what you verified and how.
