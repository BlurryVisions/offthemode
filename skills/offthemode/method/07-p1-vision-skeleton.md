## P1 · Vision & Skeleton

> **Output:** `.offthemode/PRODUCT.md` filled from its template (product first, with evidence on every claim), `.offthemode/SKELETON.md` when the project is big enough to need one, the riskiest hypotheses written into `.offthemode/RISKS.md`, and a vision that passes the predict-my-call test.

Your AI cannot build the picture in your head. It can only build what the text makes unambiguous. P1 turns that picture into documents precise enough that two different AI sessions would build the same product from them. Adjectives such as "clean", "modern" or "powerful" point the AI straight at the mode, the most common version of everything, so the documents use references with extraction notes ("take the type scale, not the color"), numbers and anti-goals instead. Two parts carry the most weight: the **moment of value**, which comes with a time budget and an action budget, and **complexity absorption**, which is where "extremely complex" and "minimalist" stop fighting.

### PRODUCT.md

Setup (the offthemode command) creates PRODUCT.md from its template, which you can also get from get_template or the skill's templates/ folder. The template holds the vision, core concept, person, job, moment of value, refusals, feeling and experience promises. P1 is how you fill it so it holds up. Where the template has no place for a part below, add it as its own section.

- **Vision.** One sentence: "For [person] who [struggle], [product] is the [frame] that [the one thing], unlike [status quo], which [why it fails them]." It forces a person, a struggle and a rival into one line.
- **Person.** A specific person in a specific situation, with what they already have open. Their skill (novice, practitioner or expert) sets the default density. Name the tools and workarounds they use today.
- **Jobs.** At most 3, ranked, each as "When [situation], I want to [motivation], so I can [outcome]."
- **Moment of value.** What they see or feel, within how long of first opening the product, after at most how many steps and decisions. Say whether an account is required before it, and if so, why.
- **Signature moment.** The one interaction people would screen-record. It gets outsized polish.
- **Not for.** Who you deliberately disappoint, and why.
- **Refusals and tie-breakers.** "We will not X, because Y." Then the tie-breakers for when good ideas conflict, such as speed over completeness, inference over configuration.
- **Feeling.** A table: adjective, reference (a product, object, print, film or place), take this, not this. Then the negative references: what it must never look or feel like. An adjective alone gets you the average; a reference with an extraction note gets you a decision.
- **Complexity absorption.** A table: the hard thing inside, how the user never sees it (a default, an inference, a disclosure or undo), and the expert escape hatch. For example: sync conflicts, auto-merge with a visible history and never a dialog, a history panel.
- **Tech consequences.** Each promise turned into what it forces in the build. "40 s from drop, no signup" means anonymous sessions, resumable uploads and streamed results.
- **Experience promises.** The numbers the experience is held to: time to first wow; the confirm dialogs allowed, each with its reason; offline behavior (read-only, queued writes, or none, and why); how many core-journey actions update instantly, before the server answers (N of M); whether there is multiplayer or shared live state. Performance and accessibility numbers live in RULES.md §Budgets, not here.
- **Metrics, bets and constraints.** Activation, defined; time to value under a number; a retention signal; a guardrail that must never get worse. Each bet names its job, expected effect, complexity cost and "kill if". Constraints: deadline, budget and hosting, team, data and compliance. Open questions, each with what it blocks.

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
Performance and accessibility: RULES.md §Budgets (change the budget there, not here) · offline {{none | read-only | full sync}} · scale at 12 months {{users, rows, requests per second}} · languages {{locales, right-to-left}}

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
3. Shortlist the strongest 8: short, easy to say and spell after hearing it once, distinctive in its category, evoking the feeling or the job rather than the feature, and working in {{LANGUAGES}}. For each, one line on why it survived and one risk.
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
Raw vision: {{RAW_VISION: brain dump, transcript, links, screenshots}} · References and what to take from each: {{REFERENCES}} · Platforms {{web | iOS | Android | backend | data}} · Size {{weekend tool | product | complex system}}
What exists already: {{?WHAT_EXISTS: read from the code, the README and .offthemode/; "nothing" for a new project}}

Round 1, in order:
1. Teach-back: the product in at most 120 words, in your words: person, job, moment of value, feeling, signature moment.
2. The average version: 5 bullets on what a generic AI build of this would look like. Every later choice must differ from it on purpose.
3. Ambiguities: every place two competent builders would build different things from my words, ranked by blast radius.
4. Framings: 2-3 alternative theses (different person, core object or moment of value), with what each gains and loses. Do not pick one; the choice is mine.
5. Complexity: the hard things inside, and how the system absorbs each so the user never sees it.
6. The strongest case that this should not exist, or should be a feature of something else.
7. Evidence: for person, job and moment, what I have observed, what I have heard, and what is still a hypothesis to confirm.

Then interview me in rounds of at most 5 numbered questions, each with your recommended answer. Each round attacks the weakest of person, job, moment, the one thing, refusals; say which. Reject vague answers ("users", "easy", "powerful", "all-in-one", "seamless") and re-ask sharper. Never suggest features; if I do, ask which job it serves and what it displaces. Stop when you can state the product in one sentence and predict what I would cut.
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
- Threat sketch: assets, actors, trust boundaries, top 5 abuse cases with day-one mitigations.
- Tag every item [decided], [hypothesis] or [open]. End with the 3-5 riskiest hypotheses, weighted toward the core, as RISKS.md rows with proposed spikes.
- Flag anything in PRODUCT.md this skeleton cannot satisfy instead of quietly bending it.
```

```prompt title="Pre-Mortem"
It is {{N}} months after launch and {{PROJECT_NAME}} has failed. Read .offthemode/PRODUCT.md and .offthemode/SKELETON.md.
Write 6-10 distinct causes as short, concrete stories, covering product (nobody reached the moment of value, or the Person was imagined), experience (complexity leaked, or it looked like everything else), core feasibility (quality, latency, cost), architecture (local-to-hosted, scale, data model, sync), security and abuse, cost and operations, and my own process.
Per cause: early warning signal, likelihood 1-5, impact 1-5, the cheapest test now, what changes in PRODUCT or SKELETON if it is real. A risk that applies to every startup is not allowed.
Show the RISKS.md rows you would add, mark the ones needing a P2 spike, and list proposed PRODUCT and SKELETON edits. Change nothing until I say go; then write the RISKS.md rows and leave the PRODUCT and SKELETON edits for me to accept one by one.
```
