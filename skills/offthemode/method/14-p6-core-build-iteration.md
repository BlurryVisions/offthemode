## P6 · Core Build & Iteration
<!-- origin: yours -->

> **Output:** vertical slices merged dark behind expiring flags, numbered change requests logged in `.offthemode/LOG.md` with commit hashes, screenshot baselines in `.offthemode/baselines/`, evals gating every change to a model-driven core, and refactor checkpoints and drift checks on a cadence.

Most of the hours go here, and so does most of the rot: forty locally reasonable edits that don't add up to anything. P6 keeps every change small, fenced, verified and reversible. Because the core sits behind the P2 contract, you can iterate on it hard without routing, auth or data access moving underneath.

Build vertical slices, not horizontal layers. Layers (all tables, then all endpoints, then all screens) run nothing end to end until the very end. A slice is one user-visible capability cut through every layer, done in one to three sessions. A slice is Heavy-lane work (`/slice`); most other changes are Standard (`/cr`); a copy fix is Trivial and needs neither.

> **Rule:** Every net-new visible action in a slice answers "why can't the system infer this?". Try inferring it, then defaulting it, then disclosing it. Only then does it earn a visible control. That's how an extremely complex product stays simple outside.

> **Pro move:** Flags are debt. Give each one an owner and an expiry in one typed `{{FLAGS_MODULE}}`, with a test that fails once the expiry passes. Mobile needs a remote flag source, because a shipped binary can't be rolled back.

```prompt title="Vertical Slice"
/slice {{SLICE_NAME}} {{FENCE, optional}}. Heavy lane: plan mode; wait for "go".
Resolve these from the docs and show each with its source ("PERSON <- PRODUCT.md L7"): {{?PERSON}}, {{?JOB}} and {{?MOMENT_OF_VALUE}} (PRODUCT.md); {{?PRINCIPLE}} it serves (DESIGN.md or PRODUCT.md); {{?JOURNEY_STEP}} (ROUTES.md); {{?EDGE_CASES}} (the edge seed profile); {{?FLAG_NAME}} (the flags module's naming); {{?FENCE}} if I gave none (the feature folder plus the files your plan names). Ask only about what the docs don't answer.
Restate it in 5 lines: person, job, moment of value, the single primary action, the principle. Then in order, stopping for my review after step 2:
1. Data: migration + seed rows covering empty, max length, unicode, soft-deleted owner and the edge cases.
2. Contract: request/response types and error codes. Show them before implementing.
3. API: boundary validation; the authorization matrix enforced on the server.
4. UI: tokens only (no new colours, sizes, radii, shadows, easings, fonts); one primary action carrying data-primary; the rest progressively disclosed.
5. States: every ROUTES.md state-inventory column, copy per .offthemode/VOICE.md.
6. Tests: failing logic tests first, then one e2e happy path, one abuse path (wrong user, malformed input, replay), and the journey file audit-ux drives.
7. Entry points behind the flag, off in production.
8. Run /ship.
List every new visible action and why it can't be inferred or defaulted. Touch only the fence; stop and explain if you need more.
```

"Make the dashboard feel better and fix the nav" produces a 14-file diff you can neither review nor revert. Models trained to be helpful treat anything unfenced as fair game, so the fence and the must-not-change list give them negative space. One concern per CR, and never visual and logic together, because they verify differently. Write visual CRs in tokens: "make it breathe" becomes "section gap space-8 to space-12, measure 64ch, drop card borders". Always give the WHY.

```prompt title="Change Request"
/cr CR-{{NNN}}: {{ONE_LINE_TITLE}} · type {{visual | logic | copy | perf | refactor}} (exactly one) · Standard lane unless the plan crosses into Heavy
INTENT: {{WHAT_SHOULD_BE_DIFFERENT_FOR_THE_USER}}
WHY: {{USER_PAIN | PRODUCT_PRINCIPLE | METRIC | BUG}}. Use this reason for cases I did not list.
SCOPE FENCE (only files you may edit): {{ALLOWED_FILES_OR_DIRS}}
MUST NOT CHANGE: contracts {{?APIS_TYPES_ROUTES}}; behavior {{FLOWS_THAT_MUST_STAY_IDENTICAL}}; visuals outside {{SURFACE}}; the token set; dependencies; existing tests (never edit a test to make it pass).
ACCEPTANCE: - [ ] {{OBSERVABLE_CRITERION}} - [ ] net visible actions on {{SURFACE}}: {{+0 | justify each}}
VERIFY: {{"test X red before, green after" | "shots at every viewport, light and dark, diffed against .offthemode/baselines/, audit clean" | "p95 of Y inside its budget"}}
PROCESS: restate in 3 lines with the lane and the files; if any is outside the fence, stop. Checkpoint commit "wip: before CR-{{NNN}}", then the smallest change that meets the criteria. Evidence, not claims. Anything noticed outside the fence becomes a proposed follow-up CR. Finish with /ship; the LOG line carries id, summary, files and commit hash.
```

### Iteration loops

**Test-first for logic.** Tests written afterward describe what the agent built, so they pass by construction.

```prompt title="Test-First"
Behavior: {{BEHAVIOR}}. Rules and edge cases: {{RULES}}, including empty, huge, concurrent, offline, unauthorized.
Phase 1, tests only in {{TEST_PATH}}: happy path, every rule, edge case and failure mode. Confirm each fails for the intended reason (an assertion, not an import error). Commit "test: {{BEHAVIOR}} (red)" and stop.
Phase 2, after my go: the minimum implementation to pass. Never edit, skip, weaken or delete a phase-1 test; if one looks wrong, stop and argue. Commit "feat: {{BEHAVIOR}} (green)".
Phase 3: refactor, suite green after every step.
```

> **Pro move:** Lock the tests during phase 2 with a temporary `Edit({{TEST_PATH}}/**)` deny in `.claude/settings.local.json`. A prompt is a request; a permission is a wall.

**Screenshot-first for UI.** Capture before and after with the stack pack's `{{SHOTS_CMD}}` (web: `scripts/shots.ts`; iOS: `xcrun simctl io booted screenshot`; Android: `adb exec-out screencap -p`), run the audit, let design-critic judge for at most three rounds, then make the taste call yourself. Self-critique converges fast and then oscillates, trading one flaw for another. Commit baselines of the signature moment and the three most-used screens to `.offthemode/baselines/` and diff every visual CR against them, which catches "just the button" edits that also move the hero.

**Evals for a model-driven core.** A prompt, model or retrieval change can make outputs worse while every type, unit, e2e and visual check stays green. Any CR touching prompts, model ids, retrieval or the core contract runs `{{EVAL_CMD}}`, and `/ship` blocks on a regression (Always-On · Verification Loop). Otherwise "iterate heavily on the core" means iterating on vibes.

**Rot control.** Inside files a CR already touches, the agent may fix one small smell, in its own commit. Everything else becomes a follow-up CR. Refactor checkpoints are triggered by events: every 5 CRs, a file over {{MAX_FILE_LINES}} lines, the same fix in three places, or a slice at twice its estimate.

```prompt title="Refactor Checkpoint"
Refactor checkpoint after {{LAST_CR_ID}}; behavior must not change. Survey {{SCOPE}} and rank issues by future cost: duplicated logic, oversized files, imports crossing AGENTS.md boundaries, dead exports, two patterns for one job, expired flags. Propose at most {{N}} refactors with payoff, risk and files; stop for approval. One commit per approved refactor, full suite after each, revert on red. No new dependencies, contract or visual changes; .offthemode/baselines/ must still match and evals must not regress. Update ARCHITECTURE.md and LOG.md.
```

**Git is the undo button.** Tool-level undo tracks file edits, not what shell commands did to your database or dependencies. So: a checkpoint commit before every editing run, a branch per CR, a green main, and a worktree per divergent experiment, each with its own port, database and env file. Give each worktree a different constraint (A led by typography, B by motion, C by removing something). The same prompt three times gives you three samples of one mode.

```bash
git worktree add ../{{PROJECT}}-a -b exp/cr-{{NNN}}-a   # repeat for -b, -c
git diff --stat main...exp/cr-{{NNN}}-a
git worktree remove ../{{PROJECT}}-b && git branch -D exp/cr-{{NNN}}-b
```

### When it keeps getting it wrong

> **Rule:** Two strikes, then climb one rung. Never allow a third attempt at the same fix from the same context.

| Rung | Move | Why it works |
|---|---|---|
| 1 | Paste the exact error, log, test output or screenshot | "Still broken" carries no information |
| 2 | Hypotheses Before Fixes (`/unstick`) | Breaks the patch-on-patch spiral |
| 3 | Minimal repro in a test, outside the app | Removes confounders; a small context sharpens attention |
| 4 | Handoff naming the dead end, then `/clear` (or rewind with double-Esc) | Failed attempts in context pull the next try toward them |
| 5 | Docs for the installed version, a working example, the library source | Stubborn bugs are often version drift |
| 6 | Plan mode: 3 structurally different approaches | The bug may be in the approach, not the line |
| 7 | Worktree bake-off, higher reasoning effort, or the strongest model | Samples genuinely different solutions |
| 8 | Write the 20-line kernel yourself, or change the requirement | Some things are cheaper to solve than to specify |

```prompt title="Hypotheses Before Fixes"
Stop fixing. List 3 distinct hypotheses for {{BUG}}, each with evidence for and against and one cheap experiment (log line, test, curl) that would falsify it. Run them, report results, fix only the confirmed cause, add a regression test.
```

**Drift.** Thirty locally reasonable CRs later, you have a second accent role, four button styles and a settings page nobody designed. As context gets compacted, early anchors lose weight. The SessionStart hook re-injects the PRODUCT.md north star, every CR names the principle it serves, and a drift check runs every 5 CRs and before each release. Intentional drift gets written into the docs. Undocumented drift is a bug.

```prompt title="Drift Check"
Drift check after {{LAST_CR_ID}}, read-only. Read .offthemode/PRODUCT.md and DESIGN.md in full; screenshot {{KEY_SURFACES}} at {{?VIEWPORTS}}, light and dark; read the code behind each, but not .offthemode/LOG.md until the end (judge what is there, not what was intended).
1. Product: controls serving no principle, surfaces over budget or with 2+ primary actions, complexity pushed onto users that the system could infer.
2. Visual: the De-Genericize checks and {{?AUDIT_CMD}} (report, don't fix); duplicate components; drift toward a USED.md row or a Saturated trait.
3. Signature moment: intact, fast, still the one loud thing, compared against .offthemode/baselines/.
4. Architecture: the architecture you infer from the code in 10 lines, where it disagrees with AGENTS.md boundaries, whether {{CORE_MODULE}} still iterates without touching routing, auth or data access, and code that looks copied from a tutorial.
Evidence per deviation (file:line or screenshot), marked ACCIDENTAL (propose a fix CR) or POSSIBLY INTENTIONAL (propose a doc update + DECISIONS entry). End with the three highest-leverage fixes.
```
