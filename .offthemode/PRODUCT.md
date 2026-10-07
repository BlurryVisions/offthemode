PRODUCT · Off the Mode · confirmed (new fields marked hypothesis wait for the author) · reviewed 2026-09-30
The vision and the core concept. Read it before any product or UX decision. Every claim carries its evidence: observed, heard, or hypothesis.

## Name
Off the Mode · why it fits: it pulls the AI off "the mode", the most common answer in its training data · checked: live at offthemode.vercel.app and github.com/BlurryVisions/offthemode; no trademark search yet · confirmed

## Thesis
For builders who use AI coding tools and are tired of getting the same average output, Off the Mode is the setup that makes any AI tool plan first, build in the right order and hold an elite bar, unlike prompting from scratch each time, which gets you the statistical average of the internet.

## Core concept
One method (rules, plan, look and feel, backend, navigation, the core in fragments, security, ship) written once as instructions and templates, delivered to any AI tool by a link or a skills download, and kept honest by revisit commands. It lives outside the project; the project gets one `.offthemode/` folder, plus one line the user approves so their tool loads it.

## Person, job, moment
- Person: a builder using Claude, Cursor or another AI coding tool on a new or existing project · evidence heard (the author)
- Jobs: 1. When I start or continue a project with an AI tool, I want it to plan like a top engineer and build in the right order, so I get a standout product instead of generic output · evidence heard
- Found by: web search and AI answers; words: Claude Code, Cursor, AI coding tool, plan first · evidence hypothesis
- Moment of value: within about ten minutes of adding it, a new project has a plan and a checklist; an existing project has a plain summary, where it stands against its core concept, and a checklist with what's done · on a large codebase it takes longer, because setup reads more and may run several agents · evidence observed twice: Supersense (a large existing codebase) 39 active minutes, lasscrobits (a new project) 46, both with real product thinking and agent research; time depends on complexity and pace, so it is noted, not a target (D-016)
- Signature moment: the existing-project health check
- Not for: people who want a code library or a UI kit

## Refusals and tie-breakers
- We will not block or slow a normal coding session, because the checklist is a map, not a gate.
- We will not store or receive anyone's code, because trust is the product.
- We will not lock anyone into one AI tool or one language.
- We will not clutter the project: one .offthemode/ folder, plus one line the user approves so their tool loads it (decided 2026-09-30). A line in the project's own rule files changes only when the user approves a fix for a conflict or an out-of-date fact (D-008).
- We will not set size, speed or accessibility limits on what people build: how minimal or comprehensive a product is stays its builder's call (DECISIONS D-005, D-006).
- Simple wording over complete wording; one source over convenient copies.

## Feeling (only if the product has a UI)
| Word | Reference (product, object, print, film, place) | Take this | Not this |
|---|---|---|---|
| drawn | an architect's drawing set | diazo paper in light, cyanotype in dark, redlines for change | not named yet |
Must never look or feel like: a stock landing page or an untouched component-library look · evidence heard (the author)

## Complexity we absorb
| Hard thing inside | How the user never has to deal with it | Escape hatch for experts |
|---|---|---|
| a 30-guide method | the rules open the right guide's short working rules for each kind of work | the whole guide (get_method with full: true) and /method |
| keeping a plan honest over months | five revisit commands, run when the user asks; revisit-state also runs on its own after work changes files or settles a decision | editing .offthemode/ files by hand |
| reading an existing codebase | setup reads the code before asking anything | answering its questions differently |
Evidence: observed (the built commands and server), hypothesis for how it feels to use

## Experience promises (the time to value lives here and nowhere else)
| Promise | Target |
|---|---|
| Time to the moment of value | about 10 minutes on a small project, longer on a large codebase; one paste or one click, then "set up off the mode" |
| Confirm dialogs allowed | none on the site; commands wait for a go before they write (talk first), except /revisit-state, which saves only STATE.md and DECISIONS.md, when typed or after work changes files or settles a decision (D-020, D-021) |
| Works offline | the skills do; the link needs the internet |

## Success and constraints
- Success looks like: people run it on an existing project and keep it · must never get worse: the server never sees code
- Constraints: one maintainer · free hosting on Vercel · MIT licence
