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
