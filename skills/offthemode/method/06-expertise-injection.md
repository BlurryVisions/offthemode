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
Show me the profile, the path .offthemode/experts/{{domain}}.md, and the one line you would add to RULES.md §Guides saying which work loads it. End with the 3 opinions you are least sure of. Write the profile in the same reply; add the RULES.md line on my yes.
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
For each finding, propose a resolution: fix it, or rebut it in one line with evidence (file:line, a test, a measurement). Show the table with a resolution column, then make the fixes in the same reply, run the checks in RULES.md §Commands, and show the table again with what you did.
```

If your tool supports subagents (Claude Code does), you can save the Inventor Critic brief as one, with read-only tools, so it runs in its own context from inside your session. The brief stays the same; only where it runs changes.

> **Pro move:** One profile per hard domain (rendering, sync, data model, native platform, the core engine), not one generic "senior dev". Run the critic on plans before any code exists, when mistakes are cheapest. On sensitive paths, run it twice, in two different models or tools, and compare the two tables: findings both raise are almost always real.
