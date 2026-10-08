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
List the sections and what each one shows first, then build it.
```

### The launch checklist

- [ ] Being found: the Being Found Audit (Always-On · Being Found) passes, with proof for every page and store listing PRODUCT.md says should be found and for every one that should stay out, previews and staging included
- [ ] Privacy policy generated from what your tracking plan and the schema actually collect, then reviewed by a lawyer (this is not legal advice); terms; working account deletion and export; consent only for non-essential trackers, with reject as prominent as accept and Global Privacy Control honored; GDPR and CCPA/CPRA where your users are
- [ ] India's DPDP Act 2023 if you serve Indian users. The Rules were notified in November 2025, with most obligations applying from May 2027: a per-purpose plain-language notice, affirmative consent, withdrawal as easy as giving it, a grievance contact, breach notification, verifiable parental consent for under-18s, and erasure once the purpose is served
- [ ] SPF, DKIM and DMARC for transactional email; designed 404, 500, offline and maintenance states; a status page hosted apart from the app
- [ ] CI runs the full check command from RULES.md §Commands, the audits and the evals, with a preview deploy per pull request; trunk-based development with feature flags behind one wrapper (OpenFeature is the vendor-neutral standard); staged rollout (internal, {{STAGE_1_PCT}}%, 25%, 100%) with automatic rollback on error spikes or a falling north-star metric; expand-and-contract migrations (add the new shape, move to it, then remove the old), so a rollback never needs a down-migration
- [ ] Errors reported with source maps or dSYMs, tagged by release; synthetic checks (scripted visits every few minutes) on sign-in and the moment of value; real-user monitoring against RULES.md §Budgets (INP, Interaction to Next Paint, only exists in the field); only three pages (site down, error spike, north star near zero), with everything else in a daily digest, because when one person is on call, alert fatigue does more damage than incidents

```prompt title="Release Readiness"
Audit {{?PRODUCT_NAME}} against the P8 launch checklist: each item PASS with evidence (file, URL, screenshot), FAIL with the fix, or N/A with the reason. Then operability: can I roll back in under 5 minutes, disable {{CORE_FEATURE}} by flag, rotate every secret, and restore yesterday's backup? Name the three scenarios most likely to page me in week one and the alert that catches each.
Report first, then write .offthemode/RUNBOOK.md with the exact steps for rollback, flag kill, secret rotation and restore.
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
7. One product lesson per phase that the vision questions should cover next time, and whether my answers in the rounds changed a decision, as a DECISIONS.md entry.
Change nothing until I approve each diff. When done, save where things stand with revisit-state's steps.
```

> **Pro move:** Starting a new project? After setup, copy the RULES.md lines from this retro that are true of every project you build (not just this one) into the new project's RULES.md. The standards travel with you, and each project still holds its own complete set.
