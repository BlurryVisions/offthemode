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
