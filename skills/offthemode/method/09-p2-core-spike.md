## P2 · Core Spike

> **Rule:** The core concept is written in P1 and built in P6. P2 is optional and builds none of it. Use it only for a fragment that can be proven on its own (a hard interaction, a speed or platform limit), while the answer could still change the plan. Products whose core only proves itself end to end, like an AI analyst answering real questions, skip P2: those fragments are marked `Verify: on completion` in the Living Checklist and get an end-to-end check once built.

> **Output:** a PASS, FAIL or PASS WITH CONSTRAINTS verdict with measured numbers; the core contract in `.offthemode/SKELETON.md`; a feel prototype tried by 3 target people, with the winning way to bridge the wait written into `.offthemode/DESIGN.md`; an eval set v0 in `evals/` if the core is model-driven; updated `.offthemode/RISKS.md` and `.offthemode/DECISIONS.md`.

A core can only be plugged in once you know the shape of the socket, and in a complex product the core is exactly where the unknowns live. Two questions matter. Can it hit the latency, quality, cost and device limits? Does the moment of value actually feel like a wow? They need different evidence, so P2 builds two throwaway pieces, each timeboxed: a **feasibility spike** on the single riskiest core hypothesis, then a **feel prototype** built on the spike's real numbers. The real core build stays in P6.

> **Why:** Spike results feed design as much as engineering. A 6-second generation means the signature moment has to be designed around streaming. Frequent sync conflicts make recovery a first-class screen. An expensive core call means queues, caching, and defaults that respect usage. Learning this after the visuals are locked means redoing them. Feel is timing, sequencing and feedback, not styling, so it can't be judged on a page that dumps raw data after six seconds, and it doesn't need a brand to be judged.

The spike rules:

- **One falsifiable hypothesis, with numbers.** Falsifiable means a measurement can prove it wrong: "p95 under 2 s on a mid-tier Android with 10k records". (p95 is the time that 95% of runs beat; p50 is the typical run.)
- **A timebox sized to the project.** 1-2 hours for a weekend build, half a day to a day for a product, 1-3 days per top risk for a complex one.
- **Kept apart.** Work on its own branch (`spike/{{NAME}}`), away from the main app. It is never merged, and only the findings survive.
- **Ugly on purpose, never fake.** Never mock the hard part.
- **A skip is a decision too.** If the core has no real unknowns, write "no spike needed: {{reason}}" in DECISIONS.md.

Two cases always get a spike. If the experience promises in PRODUCT.md need offline writes, multiplayer, or changes that mostly feel instant (the sync rule in P4), spike a sync engine against plain request and response. If the core is model-driven, the spike seeds `evals/` with 20-30 real inputs and records the pass rate as the quality baseline (Always-On · Verification Loop).

> **Trap:** AI tools gold-plate by default. Without a "throwaway" frame and a separate branch, a spike grows abstractions and a nice UI, burns the timebox, and leaves code you'll be tempted to merge. Say what not to build.

> **Pro move:** If you use git worktrees, a second folder keeps the spike physically apart from your main checkout, so your AI can't edit the real app by accident: `git worktree add ../{{PROJECT}}-spike-{{NAME}} -b spike/{{NAME}}`.

```prompt title="Core Spike"
SPIKE {{RISK_ID}}: {{HYPOTHESIS}}
Read .offthemode/SKELETON.md (Core contract, NFRs, Data flow), .offthemode/RISKS.md and RULES.md §Budgets. You are on the throwaway branch spike/{{NAME}}. This code is never merged; optimize for learning speed.
Pass if {{THRESHOLD}} · fail if {{THRESHOLD}} · timebox {{N}} hours (at the limit, stop and report what you know).
Allowed: hardcoded inputs, one plain page, no auth, any library. Forbidden: brand styling, abstractions, touching the main app, mocking or shrinking the hard part.
1. State the smallest experiment that could falsify the hypothesis. Wait for my go.
2. Build and measure with realistic data ({{DATA_SCALE}}) on {{TARGET_DEVICE_OR_ENV}}: p50, p95, throughput for streamed output, error rate, memory, cost per run. Numbers, not impressions.
3. If it fails, try at most 2 alternatives, named before you start.
4. Model-driven core: save 20-30 real inputs with expected properties to evals/ and report the pass rate.
Deliver: the verdict; a measurement table, the method and an exact repro; the core contract (inputs, outputs, latency and cost envelope, failure modes, streaming or partial results, quality baseline) written into SKELETON.md; design implications; backend and hosting implications; a DECISIONS.md entry and the updated RISKS.md row. On FAIL: ranked pivots and the PRODUCT.md lines each one changes.
```

The feel prototype is a greybox: system font, greys, no brand. What it must get right is time. It runs at the speed the spike measured, so the people trying it feel the real wait.

```prompt title="Feel Prototype"
FEEL PROTOTYPE for {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), built on the measurements from spike {{SPIKE_ID}}, on its own throwaway branch.
Greybox: system font, greys, no brand, no design tokens. Forbidden: brand styling, and fake speed of any kind. Required: real timings (stream at the measured throughput, delay by the measured p95, fail at the measured error rate); the whole moment-of-value sequence from trigger to result; a rough cut of the signature-moment choreography with plain transforms; and three switchable ways to bridge the wait (?bridge=stream | work | optimistic): stream partial results; show the absorbed work (the inputs visibly becoming the result); an optimistic placeholder that resolves in place.
Deliver: a URL or build I can put in front of 3 people who match {{?PERSON}}; a 5-line session script (what I say, what I must not explain); and a notes table for me to fill: Person | Described what happened in their own words? | Would wait? | Preferred bridge | Words they used for our nouns.
After I paste the notes: the winning bridge as one DESIGN.md constraint line, GLOSSARY.md edits where their words differ from ours, and any PRODUCT.md or RISKS.md edits. Show them to me before writing.
```

> **Rule:** The feel gate passes when at least 2 of the 3 people describe what happened in their own words and say they'd wait. If it fails, redesign the moment (what streams, what's inferred, what happens first), never the pixels.

RISKS.md is the running list of what could sink the product, scored so the worst gets tested first.

```file path=".offthemode/RISKS.md"
RISKS · score = likelihood x impact (1-5 each). Any core risk scoring 12+ gets a spike before P3 starts. Hypothesis Person, Job or Moment lines from PRODUCT.md land here as ux risks until they are confirmed.

| ID | Risk (falsifiable) | Area | L | I | Score | Test or spike | Kill or pivot criterion | Status |
|---|---|---|---|---|---|---|---|---|
| R-01 | {{e.g. canvas cannot render 50k nodes at 60 fps on a mid-tier Android}} | core | 3 | 5 | 15 | spike/render-50k, 4 h | under 30 fps after 2 approaches -> {{FALLBACK}} | open |
| R-{{NN}} | {{RISK}} | {{core / ux / infra / security / cost}} | | | | {{TEST}} | {{CRITERION}} | {{open / spiking / retired / accepted}} |
```
