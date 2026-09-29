## P0 · Constitution
<!-- origin: yours -->

> **Output:** `~/.claude/CLAUDE.md` (global, with a kit-mode switch and lanes), `AGENTS.md` + a thin `CLAUDE.md` (project), directory packs, the context log (`.offthemode/STATE.md`, `DECISIONS.md`, `LESSONS.md` + `LESSONS.index.md`, `GLOSSARY.md`, `LOG.md`), `.claude/settings.json` with every hook, and three rituals.

The constitution is everything the agent knows before you type a word, so every prompt you send gets multiplied by it.

> **Why:** Standing rules shift the output distribution once, so you stop re-steering in every prompt. But always-loaded text competes with the task for attention, and each extra instruction slightly weakens adherence to all the others. Writing a constitution is a budgeting problem: the most steering per token.

| Layer | Where | Loads | Belongs there |
|---|---|---|---|
| Global | `~/.claude/CLAUDE.md` (~50 lines) | Every session, every repo | Kit-mode switch, lanes, product stance, engineering floor, done, memory |
| Global design | `~/.claude/design/` (TASTE, BANS, RUBRIC, USED, anchors) | Imported by UI packs only | Your taste and the only ban list |
| Project | `AGENTS.md` (80-120 lines), imported by a thin `CLAUDE.md` | Every session in the repo | Mission, non-negotiables, stack, boundaries, commands, done, docs map |
| Imports | `@.offthemode/X.md` inside AGENTS.md | At launch, with the importing file | Only what every action needs: glossary names, lessons index, security |
| Directory packs | `{{UI_DIR}}/AGENTS.md`, plus a sibling `CLAUDE.md` holding `@AGENTS.md` | When the agent reads files in that subtree | Design system, bans, expert profiles, path-specific lessons |
| Docs | `.offthemode/*.md` by plain path | When opened | Product, skeleton, architecture, routes |
| Skills / subagents | `~/.claude/skills/`, `~/.claude/agents/` | On match / on invocation, own context | Procedures; critics |
| Hooks | `.claude/settings.json`, `.cursor/hooks.json` | On events, no model judgment | Whatever must not depend on the model remembering |

> **Rule:** `@path` means "load now, every time". A plain path means "read when relevant". Imports resolve relative to the importing file, nest up to four hops, and `@~/...` pulls from your home directory (Claude Code asks once per project before loading imports from outside the repo). Imports organize; they don't shrink, because everything imported loads at launch. Most bloated setups `@`-import the whole docs folder and then wonder why rules get ignored. Domain depth goes in directory packs, which load only in their subtree; Claude Code's `.claude/rules/*.md` with `paths:` frontmatter does the same for globs that don't map to one directory.

Current Claude Code reads AGENTS.md by itself only when no CLAUDE.md exists on the path. The kit keeps a CLAUDE.md whose first line imports AGENTS.md, which works in every session and never loads the file twice. Cursor and most other agents read AGENTS.md, including nested ones, natively.

Anything you'd write again in the next repo is GLOBAL. Anything that names a version, a domain term or a folder is PER-PROJECT. Four parts do most of the work and are usually the ones missing: opinions **with reasons** ("no raw hex, because the design system must stay editable in one place" also stops raw spacing), bans **with replacements** (a bare ban leaves the next-most-probable option), an uncertainty policy **split by reversibility**, and a definition of done that includes **seeing the result**.

The global file also has to behave in repos that aren't built on the kit: client work, an OSS pull request, a one-off script. So its first line is a switch, and the ritual scales by lane. Without both, every quick task in a foreign repo stalls on "run Interrogate My Vision first", and backend sessions spend attention on gradient bans.

> **Trap:** The mission and stack come from P1. Draft AGENTS.md in P0 with placeholders and lock it after P1. Never let the agent guess a stack just to fill the template.

```file path="~/.claude/CLAUDE.md"
Global constitution. Kit mode applies only if .offthemode/PRODUCT.md exists at the repo root. Outside kit mode, follow only Lanes, Depth, Engineering floor, Uncertainty, Done and Voice, and never ask to run kit rituals. A project AGENTS.md or CLAUDE.md wins on conflict (say when it does).

### Lanes (name the lane in your first line; I can veto)
- Trivial: one file, under ~30 lines, no contract, schema or dependency change. Do it, verify, one-line report.
- Standard: plan inline in your first reply, then proceed unless I object.
- Heavy: schema, auth, payments, a public contract, a new dependency, or more than 3 files. Plan mode; wait for "go".

### Product first (kit mode)
- No feature without a job. A proposal states person, job (quoted from .offthemode/PRODUCT.md), the moment it improves, and its cost against .offthemode/COMPLEXITY.md. Ideas arrive as ranked bets (job, effect, cost, kill criterion), never bare feature lists. A task that traces to no person, job or moment: ask why.
- Complex inside, simple outside: infer, default, disclose progressively, undo instead of confirm. Never hand the user a decision the system could make. When two designs tie, the one that asks fewer questions wins.
- One primary action per surface. Stunning comes from restraint, typography, motion and one signature moment, never decoration.
- If a request contradicts a PRODUCT.md Refusal or Principle, quote the line before acting. I can override; you cannot silently comply.
- Speed, undo and state survival are features; regressions in them are bugs.
- UI work: read .offthemode/DESIGN.md, ~/.claude/design/TASTE.md and ~/.claude/design/BANS.md first. If what you are about to produce could sit on any other product unchanged, stop and say so.

### Depth
- Reason like the people who designed the tools: specs, RFCs, platform docs, the installed source. Not tutorials, not memory.
- When library behavior matters, open the installed version's types or source and cite file:line; your memory may be a major version old.
- Platform before dependency. A new dependency needs a DECISIONS.md entry: what it does that 50 lines of ours can't, weight, removal cost.

### Engineering floor
- No escape hatches from the type system (any, force-unwrap, !!, dynamic, unchecked casts) without a comment giving the reason. Errors typed and surfaced, never swallowed. Smallest diff that fully solves the task; drive-by refactors become follow-ups.
- Accessibility is not a phase: semantic elements, visible focus, reduced motion, target sizes and contrast per the project's BUDGETS.md (platform minimums and WCAG AA when there is none).
- Security is not a phase: authorization at the data layer, no secrets in client code or logs, input parsed at every boundary.

### Uncertainty
- Reversible and local: decide, log it as "assumed" in DECISIONS.md, continue.
- Heavy-lane items and anything against a Refusal: stop and ask.
- Questions: batched and numbered, max 5 per round, each with your recommended default, so I can reply "1 ok, 2 b, 3 yours".

### Done means verified
Checks pass, the app ran, UI changes were screenshotted at the project's viewports (or on the simulator) and compared against DESIGN.md, no new console errors. A completion report starts with the literal line "DONE: <lane> · <summary>", then what you verified and how. Questions, plans, checkpoints and "stopping for review" never start with DONE:. "Should work" is not done.

### Memory (kit mode)
Start: STATE.md is injected; read the docs the task touches, then state lane, next step and plan. End (Standard and Heavy): rewrite STATE.md, append DECISIONS and one LOG line, commit. Corrections: on the first, note it in STATE.md §Corrections seen once; on the second, write the LESSONS entry and its index line.
Headless runs (KIT_BATCH=1): skip the start and end ritual and the go-gate, never write .offthemode/STATE.md, report only in your output.

### Voice
Direct and dense. No praise, no recap of my message. Disagree when you have a reason.
```

```file path="AGENTS.md"
{{PROJECT_NAME}}: {{THESIS_ONE_SENTENCE}}
Tier {{weekend | product | complex}} · Platforms {{web | iOS | Android}} · Stack pack {{web-ts | expo | swift | kotlin | flutter}} · Phase: see .offthemode/STATE.md
Read before the first edit of every session: @.offthemode/GLOSSARY.md @.offthemode/LESSONS.index.md @.offthemode/SECURITY.md (Claude Code imports these; other agents open them.)

### Mission
Build {{PRODUCT}} for {{PERSON}} so they can {{JOB}}. Moment of value: {{MOMENT_OF_VALUE}}, within the PRODUCT.md time and action budget. Every change makes that moment faster, clearer or more reliable; if it does none of these, question it first.

### Non-negotiables
1. {{NON_NEGOTIABLE}} (e.g. the core loop works offline and syncs later)
2. {{NON_NEGOTIABLE}} (e.g. first useful result inside the BUDGETS.md cold-start budget on a mid-tier phone)
3. One primary action per surface; every surface inside its .offthemode/COMPLEXITY.md budget.
4. Authorization enforced at the data layer, never only in the UI. No secret in the repo, bundle or logs.

### Stack (pinned; changing it needs a DECISIONS.md entry)
| Layer | Choice | Version | Why |
|---|---|---|---|
| Client | {{FRAMEWORK}} | {{VER}} | {{WHY}} |
| Styling | {{STYLING}} | {{VER}} | tokens in src/styles/tokens.css |
| Server + data | {{SERVER}} + {{DB}} via {{DATA_LAYER_OR_SYNC_ENGINE}} | {{VER}} | {{WHY}} |
| Auth | {{AUTH}} | {{VER}} | {{WHY}} |
| Runtime | local {{LOCAL}} -> hosted {{HOST}} | | same config shape in both |
Check the installed version's types before using any API from these.

### Architecture boundaries
~~~text
{{SOURCE_TREE, e.g.
apps/web, apps/mobile   surfaces only
packages/ui             tokens + primitives
packages/features/*     one folder per capability
packages/domain         entities and invariants, no I/O
packages/infra          db, queue, storage, external APIs
packages/core           the core engine, behind a contract}}
~~~
- Dependencies point inward: surfaces -> features -> domain; infra implements interfaces the domain defines.
- All I/O goes through infra adapters, so local -> hosted is configuration, not code.
- The core is reached only through {{CORE_INTERFACE}} (.offthemode/SKELETON.md §Core contract), so it iterates without touching routing, auth or data access.

### Code standards (each with its reason)
- Discriminated unions, not boolean flags: impossible states become unrepresentable.
- Parse external input at the boundary with {{SCHEMA_LIB}}, then trust types: one place validates.
- Colocate by feature: one task = one folder in context. Names from .offthemode/GLOSSARY.md: one term per concept keeps code, copy and prompts aligned.
- Visual values only from tokens: the design system stays editable in one place.

### Banned -> instead
| Banned | Instead | Why |
|---|---|---|
| casts to silence the compiler | fix the type | casts hide real bugs |
| catch, log, continue | typed error result, or rethrow with context | silent corruption |
| fetching inside view components | feature loaders over infra | one place for cache, retry, errors |
| string literals for routes, events, keys | typed constants | safe refactors |
| {{STACK_SPECIFIC_BAN}} | {{REPLACEMENT}} | {{REASON}} |

### Commands
Fast check `{{CHECK_CMD}}` (types, lint, unit) · full `{{CHECK_FULL_CMD}}` · lint one file `{{LINT_FILE_CMD}}` · dev `{{DEV_CMD}}` at {{APP_URL}} · screenshots `{{SHOTS_CMD}}` · audits `{{AUDIT_CMD}}` · evals `{{EVAL_CMD}}` · env check `{{ENV_CHECK_CMD}}` · end-to-end `{{E2E_CMD}}` · dead code `{{DEADCODE_CMD}}` · bundle size `{{BUNDLE_CMD}}` · profile build `{{PROFILE_CMD}}` · logs `{{LOGS_CMD}}` · viewports {{VIEWPORTS}} (e.g. 390x844, 1440x900)

### Lanes
Trivial, Standard (`/cr`) and Heavy (`/slice`) as defined in the global rules. Heavy here also covers: {{PROJECT_HEAVY_PATHS}}.

### Definition of done
- [ ] `{{CHECK_CMD}}` green; new logic tested; every bug fix starts with a failing regression test
- [ ] App run; UI changes screenshotted at every viewport above, light and dark; `{{AUDIT_CMD}}` clean; checked against .offthemode/DESIGN.md
- [ ] Every state handled on every surface touched (.offthemode/ROUTES.md §State inventory); no new console errors
- [ ] Standard and Heavy: STATE, DECISIONS, LOG updated; one logical commit on `{{feat|fix|chore}}/{{slug}}`. Never commit .env*, force-push main, or skip hooks
- [ ] The report's first line is "DONE: <lane> · <summary>"

### Working method
- If my request conflicts with this file or PRODUCT.md, say so first. Search DECISIONS.md before re-deciding anything.
- Parallel sessions: one worktree, port, database and task each.

### Docs map (open when relevant; do not preload)
.offthemode/PRODUCT.md (before any UX decision) · SKELETON · COMPLEXITY · DESIGN + design/ · ARCHITECTURE · ROUTES · SECURITY · RISKS · VOICE · BUDGETS · TRACKING · agents/pins.md · LESSONS.md (full entries)
```

```file path="CLAUDE.md"
@AGENTS.md

Claude Code specifics
- A SessionStart hook injects .offthemode/STATE.md, lines 1-30 of .offthemode/PRODUCT.md and the tail of .offthemode/LOG.md, and re-injects them after /compact.
- Hooks lint every edit, run the ban lint, guard shell commands, and on a DONE: report block while checks fail or STATE.md is stale. Fix the cause; never work around a hook.
- Never review your own work: inventor-critic reviews plans and diffs; design-critic judges rendered UI. Both are global subagents.
```

```file path="{{UI_DIR}}/AGENTS.md"
UI pack. Loads when you work under this directory: natively in Cursor and other AGENTS.md-aware agents, and in Claude Code through the sibling CLAUDE.md.
Read first: @{{PATH_TO_ROOT}}/docs/DESIGN.md @~/.claude/design/TASTE.md @~/.claude/design/BANS.md @~/.claude/experts/expert-web-platform.md @~/.claude/experts/expert-{{FRAMEWORK}}.md @{{PATH_TO_ROOT}}/docs/agents/pins.md
- Before a visual change run {{SHOTS_CMD}}; after it, run it again plus {{AUDIT_CMD}}, and have design-critic judge the pair.
- Hover may only reveal actions that are also reachable by selection, context menu or long-press, and the palette.
- Lessons that apply only here: {{L-ID}}: {{ONE_LINE_IMPERATIVE}}
```

```file path="{{UI_DIR}}/CLAUDE.md"
@AGENTS.md
```

The backend twin, `{{API_DIR}}/AGENTS.md`, imports `expert-backend.md` and `.offthemode/ARCHITECTURE.md` the same way, with the same one-line sibling CLAUDE.md. Because the canonical pack is a nested AGENTS.md, Cursor and other agents read the same file; `.cursor/rules/*.mdc` is only for glob-scoped extras that don't map to a directory. A team repo that can't rely on everyone's `~/.claude/` vendors the global files with a sync script and never edits the copies.

### The context log

The agent has no memory between sessions, so the repo is its memory. STATE is rewritten, not appended, because the next session needs the present, not a diary. The glossary matters more than it looks. When "space", "workspace" and "project" all float around, the agent builds three models, three routes and inconsistent copy. Only the short files are imported. Full lesson entries and term definitions are read on demand, because LESSONS grows exactly where adherence degrades.

| File | Job | Write pattern |
|---|---|---|
| `.offthemode/STATE.md` | Where we are, what's next: the handoff | Rewritten at every Standard or Heavy session end |
| `.offthemode/DECISIONS.md` | Chosen, rejected, why | Append-only, D-### |
| `.offthemode/LESSONS.md` + `LESSONS.index.md` | Agent mistakes turned into rules; the index (one line each) is what loads | Appended on the second strike, then promoted or pruned |
| `.offthemode/GLOSSARY.md` | A plain summary anyone can read, then one word per concept in code, UI, analytics, prompts (definitions live in SKELETON.md §Domain model) | Summary by `/glossaryrevisit`; terms edited when language changes |
| `.offthemode/LOG.md` | One line per CR or session: date · id · summary · commit | Append-only; tail injected at start |

```file path=".offthemode/STATE.md"
STATE · updated {{YYYY-MM-DD}} · branch {{BRANCH}} · phase {{P#}} · session {{N}} · under 40 lines, rewritten every Standard or Heavy session end

### Now
{{Two to four sentences of present truth: what works end to end, what is half-built, what is broken.}}

### Next (item 1 is where the next session starts)
1. {{STEP}} ({{lane}}): done when {{CHECK}}

### In flight
- {{AREA_OR_FILE}}: {{what changed, what is left}}

### Waiting on me / Known broken or unverified / Do not touch
- {{ITEM}}: {{why, how to reproduce, or reason}}

### Corrections seen once (a second strike becomes a LESSONS entry)
- {{CORRECTION}} · {{DATE}}
```

```file path=".offthemode/DECISIONS.md"
DECISIONS · append-only, newest at the bottom; superseded entries stay, marked.

### D-{{NNN}} · {{Title}} · {{YYYY-MM-DD}} · {{decided | assumed | superseded by D-###}}
Context: {{what forced a decision}} · Decision: {{what we do}}
Rejected: {{OPTION_A}} ({{why not}}); {{OPTION_B}} ({{why not}})
Because: {{the reason, tied to PRODUCT.md, an NFR or a spike result}} · Revisit if: {{condition}}
```

```file path=".offthemode/GLOSSARY.md"
GLOSSARY · imported every session. Two parts: a plain summary for people (/glossaryrevisit owns it; under 300 words) and the term list for code and copy (under ~40 rows; each term's definition and invariant live in .offthemode/SKELETON.md §Domain model).

## In plain words
Last revisited: {{DATE}}. For anyone: a new teammate, an investor, your family. No technical words.
- What it is: {{two or three sentences a twelve-year-old could follow}}
- Who it's for: {{the person, in everyday terms, and the moment they reach for it}}
- The problem: {{what is hard, slow or annoying for them today, in their words}}
- What it does: {{three to five short lines, each saying what the person can do, never how it's built}}
- Where we are: working today, {{what a person can actually do now}}; coming next, {{the next thing they'll be able to do}}
- What we're trying to achieve: {{the change in someone's work or life if this succeeds}}
- Words you'll hear: {{product word}}: {{what it means, in a short phrase}}

## Terms
| Term | Never call it | In code | In UI |
|---|---|---|---|
| {{TERM}} | {{SYNONYMS_TO_AVOID}} | `{{TypeName}}` | {{user-facing word}} |
```

```file path=".offthemode/LESSONS.index.md"
LESSONS INDEX · imported every session: one line per lesson (id · imperative · where it applies). Full entries in .offthemode/LESSONS.md, read on demand. A lesson that applies to one directory moves into that directory's AGENTS.md instead.
L-001 · Open the installed package's types before using a {{FRAMEWORK}} API · {{GLOB}}
```

```file path=".offthemode/LESSONS.md"
LESSONS · rules born from real mistakes, written on the second strike: imperative, specific, with reason and check. Broad and stable -> promote to AGENTS.md. Checkable -> make it a lint rule, test or hook, then delete it here and from the index. Under ~40 entries.

### L-001 · Verify APIs against the installed version · {{YYYY-MM-DD}}
Rule: Before using a {{FRAMEWORK}} API, open its type definitions in the installed package.
Because: Used an API removed in the current major; took three rounds to compile.
Check: typecheck; grep for {{REMOVED_API}}.
```

### Enforce it with hooks

A rule is a request; a hook is an exit code. One settings file wires every hook in this blueprint. **SessionStart** prints the handoff and the north star, and its output becomes context; its matcher includes `compact`, so it re-injects right after a lossy summary. **PreToolUse** guards shell commands (P7). **PostToolUse** lints each edited file and runs the ban lint (Always-On · Verification Loop, P3); the edit has already happened, so exit code 2 there shows stderr to the agent as work to do rather than blocking. **Stop** gates a completion claim. Current Claude Code has some thirty hook events (the hooks reference lists them); the kit uses these four, plus `InstructionsLoaded` when you need to log which instruction files actually loaded. The deny rules cover real env files and leave `.env.example` readable.

Stop fires at the end of every turn, not only when the agent thinks it's done. A hook that blocks whenever the tree is dirty would override every human checkpoint in the kit: "stop for my review after step 2" becomes a forced step 3, and "schema: stop and ask" becomes the agent deciding the schema because typecheck went red mid-change. So `before-done.sh` gates only a reply whose first line is `DONE:`. Questions, plans and checkpoints pass straight through, and headless batches (`KIT_BATCH=1`) skip it entirely.

```file path=".claude/settings.json"
{
  "permissions": {
    "allow": ["Bash({{TEST_CMD}} *)", "Bash({{LINT_CMD}} *)", "Bash(git status)", "Bash(git diff *)", "Bash(git add *)", "Bash(git commit *)"],
    "ask": ["Bash(npm install *)", "Bash(pnpm add *)", "Bash(pip install *)", "Bash(git push *)", "Bash(curl *)", "Edit({{MIGRATIONS_DIR}}/**)"],
    "deny": ["Read(./.env)", "Read(./.env.local)", "Read(./.env.production)", "Read(./secrets/**)", "Read(~/.ssh/**)", "Read(~/.aws/**)"]
  },
  "hooks": {
    "SessionStart": [{ "matcher": "startup|resume|clear|compact", "hooks": [{ "type": "command",
      "command": "cd \"$CLAUDE_PROJECT_DIR\" && cat .offthemode/STATE.md 2>/dev/null; head -n 30 .offthemode/PRODUCT.md 2>/dev/null; tail -n 15 .offthemode/LOG.md 2>/dev/null; true" }] }],
    "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/guard-bash.sh" }] }],
    "PostToolUse": [{ "matcher": "Edit|Write", "hooks": [
      { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/after-edit.sh" },
      { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/lint-bans.sh" } ] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/before-done.sh", "timeout": 300 }] }]
  }
}
```

```file path=".claude/hooks/before-done.sh"
#!/usr/bin/env bash
# Stop hook. Gates only an explicit completion claim: a reply whose first line starts with "DONE:".
# Blocks while the fast check fails, or (Standard, Heavy) while code changed but .offthemode/STATE.md did not.
# Exit 2 sends stderr back to the agent. A clean tree passes: pre-commit already ran the same check. Needs jq; chmod +x.
input="$(cat)"
[ -n "$KIT_BATCH" ] && exit 0                                    # headless batches: CI and the batch log verify instead
[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
last="$(printf '%s' "$input" | jq -r '.last_assistant_message // empty')"
if [ -z "$last" ]; then                                          # older versions: read the transcript
  tp="$(printf '%s' "$input" | jq -r '.transcript_path // empty')"
  last="$(jq -rs '[.[] | select(.type == "assistant") | .message.content[]? | select(.type == "text") | .text] | last // ""' "$tp" 2>/dev/null)"
fi
first="$(printf '%s' "$last" | awk 'NF { sub(/^[[:space:]]+/, ""); print; exit }')"
case "$first" in DONE:*) ;; *) exit 0 ;; esac                   # questions, plans and checkpoints pass through
cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -z "$(git status --porcelain -- . ':!docs' ':!.claude' 2>/dev/null | head -n1)" ] && exit 0
if ! out="$({{CHECK_CMD}} 2>&1)"; then
  printf 'You reported DONE: but checks fail. Fix, then report again:\n%s\n' "$(printf '%s' "$out" | tail -40)" >&2
  exit 2
fi
case "$first" in "DONE: trivial"*|"DONE: Trivial"*) exit 0 ;; esac
if [ -z "$(git status --porcelain -- .offthemode/STATE.md 2>/dev/null)" ]; then
  echo "You reported DONE: but .offthemode/STATE.md is unchanged. Update Now/Next/In flight; append DECISIONS and one LOG line if anything is new." >&2
  exit 2
fi
exit 0
```

> **Pro move:** The same four scripts run in Cursor from `.cursor/hooks.json` (The Portable Kit, Tool adapters), and every other agent gets them as pre-commit and CI steps, so the rituals below are the only manual fallback. They ship as global commands in `~/.claude/commands/` (`/start`, `/handoff`, `/constitution` and the rest of the loop). Run `/clear` between unrelated tasks, because chat history is not storage.

```prompt title="Draft the Constitution"
Set up the constitution for {{PROJECT_NAME}}: the standing rules every future session in this repo follows. My global rules are already loaded; do not repeat them.
Inputs: {{@.offthemode/PRODUCT.md and @.offthemode/SKELETON.md if they exist, otherwise RAW_NOTES}}
Interview me first, in rounds of at most 5 numbered questions, each with your recommended answer and a one-line reason. Cover in order: mission and moment of value; non-negotiables; platforms, stack pack and versions; boundaries and where the core engine sits; stack-specific bans; the exact check, lint-one-file, dev, screenshot, audit, eval, env and log commands, and the viewports; project-specific Heavy-lane paths. Stop when you could predict my answer to a new question in each area.
Then write: AGENTS.md from the template (80-120 lines; every standard with its reason, every ban with its replacement; delete any line that could appear in any repo); CLAUDE.md; one directory AGENTS.md plus a one-line CLAUDE.md per domain pack; GLOSSARY.md seeded with 10-20 domain terms (names only; definitions into SKELETON.md §Domain model); STATE.md; DECISIONS.md with a D-### per stack choice including rejected alternatives; empty LESSONS.md, LESSONS.index.md and LOG.md; settings.json and hooks with placeholders filled.
Tag anything I did not confirm [assumed]. Show every file before committing.
```

```prompt title="Session Start"
New session. .offthemode/STATE.md is in your context; if not, read it. Task: {{TASK, or "item 1 of Next in STATE.md"}}.
Reply with: (1) the lane, and where we are in two sentences, in your own words; (2) the step you will do now and its done-check; (3) the plan in at most 7 bullets, the files you will touch, and the DECISIONS or LESSONS entries that constrain it (read full LESSONS entries only for index lines that match); (4) how you will verify: commands, audits, screenshots, devices; (5) batched questions with defaults, or "no questions".
Trivial or Standard: proceed unless I object. Heavy: wait for "go".
```

```prompt title="Session End Handoff"
End the session, in this order:
1. Rewrite .offthemode/STATE.md from scratch: present tense, no history. A fresh agent with zero chat context must be able to start item 1 of Next, so name files, commands, the lane and the done-check.
2. Append a DECISIONS.md entry for every decision made this session, including silent ones (mark those "assumed").
3. Classify every correction I made. First time: add it to STATE.md §Corrections seen once. Second time: write the LESSONS entry and its index line (or put it in the matching directory AGENTS.md if it only applies there). Personal taste or a universal standard: propose an exact ~/.claude/ line with its reason. Prompt defect: propose a diff to prompts/. A lesson violated again: propose a lint rule, test or hook.
4. List everything claimed but not verified under Known broken / unverified. The next session trusts this file.
5. Propose (do not apply) edits for any AGENTS.md rule that proved wrong, stale or conflicting.
6. Append one LOG.md line, run {{?CHECK_CMD}}, commit "{{type}}: {{summary}}" with D- and L- ids in the body.
Reply with a five-line summary and the proposed rule and prompt edits.
```

### Rules are a living system

Promote on the **second strike**: the first correction is noted in STATE.md, the second becomes a LESSONS entry. Then climb the **ladder**: LESSONS, then an AGENTS.md rule once it's broad and stable, then a deterministic check. Once the check exists, delete the prose, because the check is now the rule. When the same lesson shows up in two projects, it moves to `~/.claude/`. That's how the global layer comes to encode your taste. Prune at every milestone; in Claude Code, `/doctor prompt-audit` reads every instruction file and reports contradictions and references to files that no longer exist, and `scripts/kit-lint.sh` (Always-On · Accessibility & Performance Budgets) fails the commit when always-loaded context grows past its budget.
- [ ] Every line passes "would the agent do the wrong thing without this?"
- [ ] Every rule has a reason, every ban a replacement, no two conflict; rules now enforced by checks are gone from prose
- [ ] Emphasis (caps, "IMPORTANT") on three rules at most. If everything is loud, nothing is

> **Trap:** Rules rot silently. A rule about a library you already removed still takes attention and can pull the agent back toward the old pattern.
