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
Before any plan or code, interview me about {{FEATURE}}. Batched, numbered questions, ordered by how much the answer changes architecture or UX, each with your recommended answer and what breaks if it is wrong; more rounds if needed. Ask only what would change the plan, and stop when no remaining question would. Then add the answers as D-### entries to .offthemode/DECISIONS.md and show me what you added.
```

```prompt title="Confirm Before Building"
Before changing anything, list what you believe about {{TASK}}: data shapes, current behavior, user expectations, environment. Mark each VERIFIED (file:line) or HYPOTHESIS, written as "I think X, because Y". Confirm every hypothesis before building on it: check the code or docs, and ask me about the rest. Show me the list and your plan, then start on what no open question changes. Build only on what is verified.
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
Before designing {{SURFACE}} ({{onboarding, chart, editor, landing or OTHER}}), write the criteria that decide quality for this kind of surface, each certain to matter here and not already covered by DESIGN.md §Rubric, and show them to me. For each: what weak (1) and strong (3) look like, and which reference shows each. Include: the primary action is obvious at a glance; nothing that doesn't serve the job; the signature moment, if it lives here; {{?PERF_BUDGET}}. Then add them to .offthemode/DESIGN.md and build to them.
```

```prompt title="Checkpoint Plan"
Break {{FEATURE}} into checkpoints of at most {{SIZE}}, each ending in a state that runs and can be checked (a test, a screenshot, a request): goal, files, exit check, decisions you need from me. Show me the plan with your pick for each decision. Then do checkpoint 1 only (once I answer, if one of those decisions changes it), run its exit check, update .offthemode/STATE.md with where things stand, and stop.
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
