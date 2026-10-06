RULES · Off the Mode · read before working. The standards every change is held to, filled in from the Off the Mode template (content/templates/RULES.md) on 2026-09-30; the rest is the Off the Mode floor.

## This project
- What it is: a prompt-engineering setup that makes any AI coding tool plan first, build in the right order and hold an elite bar, delivered as a website, a hosted MCP server and a skills pack (the full vision is in .offthemode/PRODUCT.md)
- Stack: Next.js 16 on Vercel, TypeScript, mcp-handler 2 with the MCP SDK v2, zod 4, marked at build time · Platforms: web
- The project's own rule files, still in force and never moved: AGENTS.md (CLAUDE.md imports it). They win over this file on project specifics; a line in them changes only on my go, recorded in DECISIONS.md.

## Project specifics
Rules only this project needs, each saying what to do and why, kept apart from the Off the Mode standards below and never repeating the project's own rule files. Written at setup from the plan (the stack's known traps, data rules, security boundaries), and added to when a correction has to be given twice. Keep a line only if it is certain to apply, not something an AI does anyway, and costly if missed.
- content/ is the only source. Never hand-edit skills/, lib/content.generated.json or public/ (method/, skills/), because `npm run content` overwrites them and the check fails on drift. Commit content/ and skills/ together, because CI runs `node scripts/build-content.mjs --check --committed`.
- The MCP server stays stateless and read-only: it stores nothing and logs no input, because trust is the product (DECISIONS D-003).
- Every word a user reads is plain: short sentences, no jargon, because the builders who read it are not all engineers.
- The website and /method share one visual language, the drawing set: diazo paper in light, cyanotype in dark, redlines for change.
- Every control is reachable by keyboard, and a closed panel stays out of the tab order.
- Each command's rendered text stays under the MCP test's 6000-character guard (offthemode is at 5999), so a status check stays cheap: tighten wording before adding it.

## How to work
- Talk first, then do. For anything beyond a small fix (a typo, a one-line change), restate the task and your plan in a few lines and wait for my go. Say what you changed when you're done.
- One concern per change. The smallest diff that fully solves it; drive-by refactors become follow-ups.
- Never build on an assumption. When something is unclear (what I want, how something should behave, what the code does), write it as a hypothesis, "I think X, because Y", so it is clear, then confirm it before building on it: check it in the code or docs, or ask me. Questions come batched and numbered, most important first, each with your recommended answer, in more rounds if needed, until nothing left would change the plan.
- Take my references and suggestions to heart, never as a script. Keep what makes them work, check their claims against official sources, and before building, say where they could go further: a better version, a fresh idea or an extension.
- Read STATE.md when you start. When a real piece of work ends, rewrite STATE.md (now, next, in flight, unverified), add a correction I gave for the first time to its Corrections seen once, and add any decision to DECISIONS.md. A correction given twice becomes a proposed line in Project specifics.
- Sessions stay free. Never force the checklist; /listrevisit catches up afterwards.

## Guides (open the matching one before the work; once per session is enough)
Off the Mode has a guide for each kind of work. Before you plan or do work of that kind, open its guide now, in this reply, not as a later step, and follow it. For a change inside an existing product, open the guide's working rules: the get_method tool with the name below, or the file ending in that name in the offthemode skill's method/rules/ folder. Open the whole guide when you start that phase or change its structure: get_method with full: true, or the file in method/. A guide with no working rules (no file in method/rules/) always comes whole. Skip this for a one-line fix.
| Before you... | Open |
|---|---|
| shape the product or plan a new feature | product-first-doctrine, p1-vision-skeleton |
| plan or review a large or risky change | expertise-injection |
| name the product, a feature or a screen | p1-vision-skeleton, always-on-words-voice |
| prove something risky before building on it | p2-core-spike |
| design or change a screen, component, style or motion | p3-visual-language |
| simplify a dense or complex screen | taming-complexity |
| change the data model, an API, background jobs, config or hosting | p4-backend-infra |
| add or change routes, navigation, flows or screen states | p5-navigation-flows |
| build or rework a core fragment | p6-core-build-iteration |
| touch login, permissions, user input, uploads, secrets, payments or AI features | p7-security-hardening |
| launch, release or set up monitoring | p8-ship-operate |
| make a page people should find, a public launch, or a store listing | always-on-being-found |
| change RULES.md, or end a piece of work | p0-constitution |
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
- If a request contradicts a refusal or tie-breaker in PRODUCT.md, quote the line before acting.

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

## Look and feel (UI)
- Nothing that could sit on any other product unchanged. If a screen looks like the average (a stock landing layout, an untouched component-library look, blue-purple gradients, emoji as icons, a font chosen because it is the default), stop and say so.
- Stunning comes from restraint: typography, spacing, motion and one signature moment. Never from decoration.
- One primary action per screen. (Both pages are static with no data, so there are no empty, loading or error states to design.)
- Visual values come from one set of design tokens, never hard-coded.
- Layout is checked section by section at each of screenshot_sizes in §Budgets, not just the first screen. Grids use a column count their items fill (8 items: 4+4 or 2x4, never 7+1); nothing sits alone in a row, nothing is clipped.

## Safety
- No secret in the repo, the client bundle or the logs.

## Efficiency (spend tokens on results, not on repetition)
- No caps: use whatever the job needs. The aim is that nothing gets paid for twice.
- Measure with scripts, not by reading: tests, layout checks and link checks run as commands, and you read their short output, never the raw data.
- Read narrow: search first, then open only the lines you need. Never read generated files, lockfiles or build output; tail logs instead of reading them whole.
- Scout first: one agent assesses the task, finds the files it actually touches (and what those depend on, not the whole repo), writes a short brief, and decides how many agents the job needs. A small job stays with one.
- Many agents, one reading: every agent starts with the scout's brief word for word (the shared start is read from cache at a fraction of the price) and its own task after it. Start one first and the rest once it is running, so they read the cache instead of all writing it. Agents return short, structured results.
- Keep sessions short: when a piece of work ends, update STATE.md and start fresh. A long session re-reads its whole history on every reply.
- Open a method sheet or template only when you need it.
- For big runs, say roughly what they will cost and wait for my go.

## Budgets (numbers the product is held to; time to value is in PRODUCT.md §Experience promises)
Scripts read the json below, and every other file names a key (such as max_file_lines), never its number. Off the Mode sets no speed, weight or accessibility numbers: add a key only when this product should hold one, for example load time or contrast (the always-on-accessibility-performance-budgets guide lists common keys and values). screenshot_sizes is (UI).
```json
{
  "max_file_lines": 400, "max_fn_lines": 60,
  "screenshot_sizes": ["390x844", "820x1180", "1440x900"]
}
```

## Commands (fill once the toolchain exists; the revisit commands run these)
check `npm run check` · full check `npm run check && npm run build` · run `npm run dev` · end-to-end `npm run test:mcp` (with the site running: `npm run build && npm start`; add `MCP_URL=https://offthemode.vercel.app/mcp` for the live site) · evals none yet (CHECKLIST F6.6) · dead code none · audit `npm run audit` (contrast, optional)

## Done means verified
Checks pass, the thing actually ran (the site started and the MCP test passed), and UI changes were looked at on screen in light and dark. "Should work" is not done: say what you verified and how.
