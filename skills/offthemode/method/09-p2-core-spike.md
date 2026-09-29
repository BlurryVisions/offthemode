## P2 · Core Spike
<!-- origin: moved -->

> **Rule:** Your core concept is defined in P1 and built in P6. P2 is optional and builds none of it. Use it only for a fragment that can be proven on its own (a hard interaction, a speed or platform limit) while the answer could still change the plan. Products whose core only proves itself end to end, like an AI analyst answering real questions, skip P2: those fragments are marked `Verify: on completion` in the Living Checklist and get an end-to-end check once built.

> **Output:** a PASS / FAIL / PASS WITH CONSTRAINTS verdict with measured numbers, the core contract in `.offthemode/SKELETON.md`, a feel prototype tested by 3 target people with the winning waiting strategy written into `.offthemode/DESIGN.md`, an eval set v0 if the core is model-driven, and updated `.offthemode/RISKS.md` and `DECISIONS.md`.

The core is "plug and play" only once the socket's shape is known, and in a complex product the core is exactly where the unknowns live. Can it hit the latency, quality, cost and device limits? Does the moment of value actually feel like a wow? Those are two different questions, so P2 builds two throwaway artifacts, each timeboxed: a **feasibility spike** on the single riskiest core assumption, then a **feel prototype** built on the spike's real numbers. The real core build stays in P6, as you planned.

> **Why:** Spike results feed design as much as engineering. A 6-second generation means the signature moment has to be designed around streaming. Frequent sync conflicts make recovery UX a first-class surface. An expensive core call means queues, caching, and defaults that respect usage. Learning this after visuals are locked means redoing them. Feel is timing, sequencing and feedback, not styling, so it can't be judged on a page that dumps JSON after six seconds, and it doesn't need a brand to be judged.

Rules: one falsifiable hypothesis with numbers ("p95 under 2 s on a mid-tier Android with 10k records"). Timebox by tier: 1-2 hours for a weekend build, half a day to a day for a product, 1-3 days per top risk for a complex one. Work in its own worktree (`git worktree add ../{{PROJECT}}-spike-{{NAME}} -b spike/{{NAME}}`). Make it ugly on purpose but never fake: never mock the hard part. It's never merged, and only the findings survive. If the core has no real unknowns, log "no spike needed: {{reason}}". Two cases always get a spike. If the UX contract trips the sync rule (offline writes, multiplayer, or mostly-instant mutations), spike a sync engine against request/response (P4). If the core is model-driven, the spike seeds `evals/` with 20-30 real inputs and records the pass rate as the quality baseline (Always-On · Verification Loop).

> **Trap:** Agents gold-plate by default. Without a "throwaway" frame and a separate worktree, a spike grows abstractions and a nice UI, burns the timebox, and leaves code you'll be tempted to merge. Say what not to build.

```prompt title="Core Spike"
SPIKE {{RISK_ID}}: {{HYPOTHESIS}}
Context: @.offthemode/SKELETON.md (Core contract, NFRs, Data flow), @.offthemode/RISKS.md, @.offthemode/BUDGETS.md. You are in the worktree for spike/{{NAME}}. This code is throwaway and never merged; optimize for learning speed.
Pass if {{THRESHOLD}} · fail if {{THRESHOLD}} · timebox {{N}} hours (at the limit, stop and report what you know).
Allowed: hardcoded inputs, one plain page, no auth, any library. Forbidden: brand styling, abstractions, touching the main app, mocking or shrinking the hard part.
1. State the smallest experiment that could falsify the hypothesis. Wait for my go.
2. Build and measure with realistic data ({{DATA_SCALE}}) on {{TARGET_DEVICE_OR_ENV}}: p50, p95, throughput for streamed output, error rate, memory, cost per run. Numbers, not impressions.
3. If it fails, try at most 2 alternatives, named before you start.
4. Model-driven core: save 20-30 real inputs with expected properties to evals/ and report the pass rate.
Deliver: verdict; measurement table, method, exact repro; the core contract (inputs, outputs, latency and cost envelope, failure modes, streaming or partial, quality baseline) written into SKELETON.md; design implications; backend and hosting implications; a D-### entry and the updated RISKS.md row. On FAIL: ranked pivots and the PRODUCT.md lines each changes.
```

```prompt title="Feel Prototype"
FEEL PROTOTYPE for {{?MOMENT_OF_VALUE}} (.offthemode/PRODUCT.md), built on the measurements from spike {{SPIKE_ID}}, in the same kind of throwaway worktree.
Greybox: system font, greys, no brand, no tokens. Forbidden: brand styling, and fake speed of any kind. Required: real timings (stream at the measured throughput, delay by the measured p95, fail at the measured error rate); the whole moment-of-value sequence from trigger to result; a rough cut of the signature-moment choreography with plain transforms; and three switchable ways to bridge the wait (?bridge=stream | work | optimistic): stream partial results; show the absorbed work (the inputs visibly becoming the result); an optimistic placeholder that resolves in place.
Deliver: a URL or build I can put in front of 3 people who match {{?PERSON}}; a 5-line session script (what I say, what I must not explain); and a notes table for me to fill: Person | Described what happened in their own words? | Would wait? | Preferred bridge | Words they used for our nouns.
After I paste the notes: the winning bridge as one DESIGN.md constraint line, GLOSSARY edits where their words differ from ours, and any PRODUCT.md or RISKS.md edits.
```

> **Rule:** The feel gate passes when at least 2 of the 3 people describe what happened in their own words and say they'd wait. If it fails, redesign the moment (what streams, what's inferred, what happens first), never the pixels.

```file path=".offthemode/RISKS.md"
RISKS · score = likelihood x impact (1-5 each). Any core risk scoring 12+ gets a spike before P3 starts. Assumed Person, Job or Moment lines from PRODUCT.md land here as ux risks.

| ID | Risk (falsifiable) | Area | L | I | Score | Test or spike | Kill or pivot criterion | Status |
|---|---|---|---|---|---|---|---|---|
| R-01 | {{e.g. canvas cannot render 50k nodes at 60 fps on a mid-tier Android}} | core | 3 | 5 | 15 | spike/render-50k, 4 h | under 30 fps after 2 approaches -> {{FALLBACK}} | open |
| R-{{NN}} | {{RISK}} | {{core / ux / infra / security / cost}} | | | | {{TEST}} | {{CRITERION}} | {{open / spiking / retired / accepted}} |
```
