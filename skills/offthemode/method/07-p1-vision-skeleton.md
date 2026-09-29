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
