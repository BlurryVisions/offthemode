## P6 · Core Build & Iteration

> **Output:** vertical slices merged but switched off in production behind expiring flags, each closing a `.offthemode/CHECKLIST.md` item with its evidence; change requests numbered CR-### in branch names and commit messages; screenshot baselines committed with the tests in `tests/baselines/`; evals gating every change to a model-driven core; refactor checkpoints and drift checks on a cadence; `.offthemode/STATE.md` rewritten as each piece of work ends, and decisions appended to `.offthemode/DECISIONS.md`.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- One concern per change, fenced to the files the plan names. If the work needs a file outside the fence, stop and say why.
- Never visual and logic in the same change; they are checked differently.
- A bug fix starts with a failing test that reproduces the bug.
- Never edit a test to make it pass. Tests, snapshots and exemptions change only when the spec changes.
- Two failed attempts at the same fix: climb one rung of the ladder in When it keeps getting it wrong. Never a third try from the same context.
- A change to prompts, model ids, retrieval or the core contract runs the evals.
- Finish with the checks in RULES.md §Commands, and name the CHECKLIST.md item it closes; listrevisit records the mark and the evidence.
- Open the whole guide for a new vertical slice, a refactor checkpoint or a drift check.
<!-- /offthemode:rules -->

Most of the hours go here, and so does most of the rot: forty edits that each make sense alone and add up to nothing. P6 keeps every change small, fenced, verified and reversible. Because the core sits behind the P2 contract, you can iterate on it hard without routing, auth or data access moving underneath.

Build vertical slices, not horizontal layers. Layers (all tables, then all endpoints, then all screens) run nothing end to end until the very end. A slice is one capability the user can see, cut through every layer and done in one to three sessions. It usually closes one item in CHECKLIST.md. Use the Vertical Slice prompt for a new capability and the Change Request prompt for most other changes. A copy fix needs neither.

> **Rule:** Every net-new visible action in a slice answers "why can't the system infer this?". Try inferring it, then defaulting it, then disclosing it. Only then does it earn a visible control. That is how an extremely complex product stays simple outside.

> **Pro move:** A feature flag is a switch that turns a feature on or off without a deploy. Flags are debt. Give each one an owner and an expiry date in one typed flags module, with a test that fails once the expiry passes. Mobile needs a remote flag source, because a shipped app binary can't be rolled back.

```prompt title="Vertical Slice"
Vertical slice: {{SLICE_NAME}} (usually the next open item in .offthemode/CHECKLIST.md). Fence, the only files you may edit: {{FENCE}}. If I left the fence blank, propose one: the feature folder plus the files your plan names.
Plan first. Change nothing until I say go.
Resolve these from the docs and show each with its source ("PERSON <- PRODUCT.md L7"): {{?PERSON}}, {{?JOB}} and {{?MOMENT_OF_VALUE}} (PRODUCT.md); {{?PRINCIPLE}} it serves (DESIGN.md or PRODUCT.md); {{?JOURNEY_STEP}} (ROUTES.md); {{?EDGE_CASES}} (the edge seed profile); {{?FLAG_NAME}} (the flags module's naming). Ask only about what the docs don't answer. Write any doubt as "I think X, because Y" and confirm it before building on it.
Restate the slice in 5 lines: person, job, moment of value, the single primary action, the principle. Then work in this order, stopping for my review after step 2:
1. Data: migration plus seed rows covering empty, max length, unicode, a soft-deleted owner and the edge cases.
2. Contract: request/response types and error codes. Show them before implementing.
3. API: validation at the boundary; the authorization matrix enforced on the server.
4. UI: design tokens only (no new colours, sizes, radii, shadows, easings, fonts); one primary action, marked data-primary so checks can count it; everything else progressively disclosed.
5. States: every column of the ROUTES.md state inventory, copy per .offthemode/VOICE.md.
6. Tests: failing logic tests first, then one end-to-end happy path, one abuse path (wrong user, malformed input, replay), and an end-to-end test of the journey step.
7. Entry points behind the flag, off in production.
8. Verify: every check in RULES.md §Commands passes, the slice actually ran, and you looked at its screens at each of screenshot_sizes (RULES.md §Budgets). Name the CHECKLIST.md item it closes (listrevisit records the mark and the evidence) and tell me what you did.
List every new visible action and why it can't be inferred or defaulted. Touch only the fence; if you need more, stop and explain.
```

A change request (CR) is one small, fenced change with its reason attached. "Make the dashboard feel better and fix the nav" produces a 14-file diff you can neither review nor revert. Models trained to be helpful treat anything unfenced as fair game, so the fence and the must-not-change list give them negative space: the areas they must leave alone. One concern per CR, and never visual and logic together, because they verify differently. Write visual CRs in tokens: "make it breathe" becomes "section gap space-8 to space-12, measure 64ch, drop card borders". Always give the why; your AI applies it to cases you did not list.

```prompt title="Change Request"
CR-{{NNN}}: {{ONE_LINE_TITLE}}. Type: {{CR_TYPE}} (exactly one of visual, logic, copy, perf, refactor).
INTENT: {{WHAT_SHOULD_BE_DIFFERENT_FOR_THE_USER}}
WHY: {{REASON}} (a user pain, a product principle, a metric or a bug). Use this reason for cases I did not list.
SCOPE FENCE (the only files you may edit): {{ALLOWED_FILES_OR_DIRS}}
MUST NOT CHANGE: contracts {{?APIS_TYPES_ROUTES}}; behavior {{FLOWS_THAT_MUST_STAY_IDENTICAL}}; visuals outside {{SURFACE}}; the token set; dependencies; existing tests (never edit a test to make it pass).
ACCEPTANCE:
- [ ] {{OBSERVABLE_CRITERION}}
- [ ] Net visible actions on {{SURFACE}}: +0, or a reason for each one added
VERIFY: {{VERIFY_METHOD}}, for example "test X red before, green after", "screenshots at each of screenshot_sizes (RULES.md §Budgets), light and dark, diffed against tests/baselines/, {{?AUDIT_CMD}} clean", or "p95 of Y (the time 95 of 100 runs beat) inside its RULES.md §Budgets limit".
PROCESS: restate the change in 3 lines with the files you will touch; if any is outside the fence, stop. Wait for my go. Make a checkpoint commit "wip: before CR-{{NNN}}", then the smallest change that meets the criteria. Evidence, not claims. Anything you notice outside the fence becomes a proposed follow-up CR. Finish by running the checks in RULES.md §Commands, commit with "CR-{{NNN}}" in the message, and report the id, a one-line summary, the files and the commit hash. Append any decision to .offthemode/DECISIONS.md; if this ends a piece of work, rewrite .offthemode/STATE.md.
```

### Iteration loops

**Test-first for logic.** Tests written after the code describe what your AI built, so they pass by construction.

```prompt title="Test-First"
Behavior: {{BEHAVIOR}}. Rules and edge cases: {{RULES}}, including empty, huge, concurrent, offline, unauthorized.
Phase 1, tests only. First list the tests you will write in {{TEST_PATH}}, one line each (the happy path, every rule, edge case and failure mode), and wait for my go. Then write them, confirm each fails for the intended reason (an assertion, not an import error), commit "test: {{BEHAVIOR}} (red)" and stop.
Phase 2, after my go: the minimum implementation to pass. Never edit, skip, weaken or delete a phase-1 test; if one looks wrong, stop and argue. Commit "feat: {{BEHAVIOR}} (green)".
Phase 3: refactor, with the suite green after every step.
```

> **Pro move:** Make the tests read-only for your AI during phase 2. If your tool can block edits to chosen paths (Claude Code can, with a deny rule in its permission settings), block the test folder for phase 2 and lift it after. A prompt is a request; a permission is a wall.

**Screenshot-first for UI.** Capture before and after with one screenshot command, listed in RULES.md §Commands (web: a small Playwright script; iOS: `xcrun simctl io booted screenshot`; Android: `adb exec-out screencap -p`). Shoot at each of screenshot_sizes (RULES.md §Budgets), and run the UI audit. Then ask a second, fresh AI session, with no memory of building it, to judge the shots. Fix the losses it names and judge again; stop when a round flips no loss, and make the taste call yourself. Self-critique converges fast and then oscillates, trading one flaw for another. Commit baselines of the signature moment and the three most-used screens to `tests/baselines/`, and diff every visual CR against them. That catches a "just the button" edit that also moves the hero.

**Evals for a model-driven core.** An eval is a fixed set of real inputs with a scored expected result. A prompt, model or retrieval change can make outputs worse while every type, unit, end-to-end and visual check stays green. Any CR touching prompts, model ids, retrieval or the core contract runs the eval command in RULES.md §Commands, and a regression blocks the change (see Always-On · Verification Loop). Without evals, "iterate hard on the core" means iterating on vibes.

**Rot control.** Inside files a CR already touches, your AI may fix one small smell, in its own commit. Everything else becomes a follow-up CR. Refactor checkpoints are triggered by events, not the calendar: every 5 CRs, a file past max_file_lines in RULES.md §Budgets, the same fix in three places, or a slice at twice its estimate.

```prompt title="Refactor Checkpoint"
Refactor checkpoint after {{LAST_CR_ID}}; behavior must not change. Survey {{SCOPE}} and rank issues by future cost: duplicated logic, oversized files, imports crossing the boundaries in RULES.md §Code or .offthemode/ARCHITECTURE.md, dead exports, two patterns for one job, expired flags. Propose the refactors whose payoff beats their risk now, each with payoff, risk and files, and stop for my go.
One commit per approved refactor, the full suite after each, revert on red. No new dependencies, contract changes or visual changes; tests/baselines/ must still match and evals must not regress. Then update .offthemode/ARCHITECTURE.md if the structure moved, append decisions to DECISIONS.md, and rewrite STATE.md.
```

**Git is the undo button.** Your tool's undo tracks file edits, not what shell commands did to your database or dependencies. So: a checkpoint commit before every editing run, a branch per CR, and a main branch that is always green.

> **Pro move:** When a change has real alternatives, run up to three attempts side by side. A git worktree is a second working folder on the same repo, on its own branch; give each one its own port, database and env file. Give each attempt a different constraint (A led by typography, B by motion, C by removing something). The same prompt three times gives you three samples of one mode.

```bash
git worktree add ../myapp-a -b exp/cr-012-a   # repeat for -b and -c
git diff --stat main...exp/cr-012-a
git worktree remove ../myapp-b && git branch -D exp/cr-012-b
```

### When it keeps getting it wrong

> **Rule:** Two strikes, then climb one rung. Never allow a third attempt at the same fix from the same context.

| Rung | Move | Why it works |
|---|---|---|
| 1 | Paste the exact error, log, test output or screenshot | "Still broken" carries no information |
| 2 | Run the Hypotheses Before Fixes prompt | Breaks the patch-on-patch spiral |
| 3 | A minimal repro (the smallest code that shows the bug) in a test, outside the app | Removes confounders; a small context sharpens attention |
| 4 | Rewrite STATE.md naming the dead end, then start a fresh session from it | Failed attempts left in context pull the next try toward them |
| 5 | Docs for the installed version, a working example, the library source | Stubborn bugs are often version drift |
| 6 | Ask for 3 structurally different approaches before any code | The bug may be in the approach, not the line |
| 7 | Parallel attempts on separate branches, more reasoning effort, or the strongest model | Samples genuinely different solutions |
| 8 | Write the 20-line kernel yourself, or change the requirement | Some things are cheaper to solve than to specify |

```prompt title="Hypotheses Before Fixes"
Stop fixing. List 3 distinct hypotheses for {{BUG}}, each with evidence for and against and one cheap experiment (a log line, a test, a curl) that would falsify it. Run the experiments, which change no code beyond a temporary log line, and report the results with the fix you propose. Wait for my go, then fix only the confirmed cause and add a regression test.
```

**Drift.** Thirty sensible CRs later, you have a second accent colour, four button styles and a settings page nobody designed. As a long session's context gets compacted (summarized to fit), early anchors lose weight. Three habits hold the line: every session starts from RULES.md and STATE.md, every CR names the principle it serves, and a drift check runs every 5 CRs and before each release. Intentional drift gets written into PRODUCT.md or DESIGN.md with a DECISIONS.md entry. Undocumented drift is a bug.

```prompt title="Drift Check"
Drift check after {{LAST_CR_ID}}. Read-only: change nothing. Read .offthemode/PRODUCT.md and .offthemode/DESIGN.md in full; screenshot {{KEY_SURFACES}} at each of screenshot_sizes (RULES.md §Budgets), light and dark; read the code behind each. Leave DECISIONS.md and STATE.md until the end, so you judge what is there, not what was intended.
1. Product: controls that serve no principle, surfaces over budget or with 2 or more primary actions, complexity pushed onto users that the system could infer.
2. Visual: the De-Genericize checks and {{?AUDIT_CMD}} (report, don't fix); duplicate components; drift toward anything DESIGN.md bans or names as overused.
3. Signature moment: intact, fast, still the one loud thing, compared against tests/baselines/.
4. Architecture: the architecture you infer from the code, in 10 lines; where it disagrees with the boundaries in RULES.md §Code and .offthemode/ARCHITECTURE.md; whether {{CORE_MODULE}} still iterates without touching routing, auth or data access; code that looks copied from a tutorial.
Give evidence per deviation (file:line or screenshot), marked ACCIDENTAL (propose a fix CR) or POSSIBLY INTENTIONAL (propose a doc update and a DECISIONS.md entry). End with the three highest-leverage fixes and wait for my go.
```
