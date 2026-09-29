## The Portable Kit
<!-- origin: added -->

The kit is a git repo (`~/agent-kit`) with three folders. `global/` gets symlinked into `~/.claude/` and follows you everywhere. `stacks/` holds one pack per stack, so every executable piece (linting, screenshots, audits, env validation, ban patterns, the framework expert) exists in that stack's idiom; the core templates only name placeholders like `{{LINT_FILE_CMD}}`, `{{SHOTS_CMD}}` and `{{ENV_CHECK_CMD}}`. `project/` gets copied into each new repo and filled in fresh. Every file template in this blueprint lives in exactly one of the three.

### The tree

```text
~/agent-kit/global/                 GLOBAL: symlinked into ~/.claude/, changed only through retros
  CLAUDE.md                         kit-mode switch, lanes, product stance, floor, done, memory (P0)
  voice.md                          voice baseline
  design/TASTE.md USED.md BANS.md RUBRIC.md                your taste, the novelty ledger, the only ban list, the pairwise rubric (P3)
  design/anchors/love/ hate/ rubric/                       taste and rubric anchors; motion as frame strips
  experts/expert-{product,web-platform,backend,mobile}.md  the profile library, plus one expert-<framework>.md per stack
  agents/inventor-critic.md agents/design-critic.md        critics, global only
  commands/{start,interview,cr,slice,prove,critique,subtract,inventor-review,unstick,handoff,ship}.md   the loop, full text, {{?}} placeholders
  commands/{listrevisit,reassess,commentrevisit,glossaryrevisit}.md   on-demand revisits
  commands/{constitution,bootstrap,taste,retro}.md         one-off rituals
  skills/visual-direction/ complexity-audit/ eval-set/     procedures with bundled scripts
  prompts/                          canonical text of every prompt template + CHANGELOG.md

~/agent-kit/stacks/{web-ts,expo,swift,kotlin,flutter}/     STACK PACKS: one per project
  project/.claude/bans.txt          ban ids as patterns in the stack's idiom
  project/scripts/                  shots, audit-computed, audit-ux (web-ts: Playwright; native: simctl, adb, Maestro)
  project/src/env.*                 boot-time env validation
  commands.env                      LINT_FILE_CMD, LINT_FILE_RE, SHOTS_CMD, AUDIT_CMD, ENV_CHECK_CMD for AGENTS.md
  expert-<framework>.md             the framework profile, linked into global/experts/

~/agent-kit/project/                PER-PROJECT: copied, then filled
  AGENTS.md CLAUDE.md                                        constitution + Claude adapter (P0)
  {{UI_DIR}}/AGENTS.md + CLAUDE.md  {{API_DIR}}/AGENTS.md + CLAUDE.md   directory packs
  .claude/settings.json                                      permissions + hooks (P0)
  .claude/hooks/before-done.sh after-edit.sh lint-bans.sh guard-bash.sh cursor-stop.sh
  .cursor/hooks.json                                         the same scripts, wired for Cursor
  .claude/commands/diverge.md                                thin wrappers over project prompts/
  .offthemode/PRODUCT.md SKELETON.md RISKS.md                       P1, P2
  .offthemode/DESIGN.md .offthemode/design/PRINCIPLES.md DIRECTIONS.md refs/ directions/   P3
  .offthemode/ARCHITECTURE.md ROUTES.md COMPLEXITY.md SECURITY.md RUNBOOK.md        P4-P8
  .offthemode/VOICE.md BUDGETS.md TRACKING.md                       Always-On
  .offthemode/CHECKLIST.md                                          the living checklist, kept by /listrevisit
  .offthemode/STATE.md DECISIONS.md LESSONS.md LESSONS.index.md GLOSSARY.md LOG.md  context log
  .offthemode/agents/pins.md .offthemode/agents/expert-{{domain}}.md       pins + project-only domains
  .offthemode/baselines/ e2e/journeys/ evals/ fixtures/
  prompts/diverge.md prompts/CHANGELOG.md                    project-tuned prompts
  src/styles/tokens.css src/styles/motion.ts tokens/tokens.json
  scripts/diverge-diff.sh scripts/kit-lint.sh .env.example lighthouserc.cjs
```

### Bootstrap in 10 minutes

0. First project on the kit only: run `/taste` (Taste Extraction) once, so P3 has something of yours to aim at.
1. `git init` (or branch an existing repo), then `cp -R ~/agent-kit/project/. .`, `cp -R ~/agent-kit/stacks/{{STACK}}/project/. .`, and `chmod +x .claude/hooks/*.sh scripts/*.sh`.
2. Put the raw vision (brain dump, voice transcript, links, screenshots) in `.offthemode/raw-vision.md` and the references in `.offthemode/design/refs/`.
3. Start a fresh agent session and run `/bootstrap` (Bootstrap New Project). It prunes by tier, fills only the facts you stated, and wires the tools.
4. Fill the AGENTS.md Commands line from the pack's `commands.env` as soon as the toolchain exists. The Stop hook, `/ship` and every `{{?}}` placeholder depend on it.
5. Smoke-test the wiring: `/clear` should print STATE.md; a trivial edit should trigger the lint hook; `cat .env` should get blocked; a reply starting `DONE:` while a check is red should get pushed back, and a question should not.
6. Install `scripts/kit-lint.sh` as a pre-commit hook, commit `chore: bootstrap agent kit`, then follow STATE.md's Next list: Interrogate My Vision, Generate the Skeleton, Draft the Constitution (lock), Core Spike.

```prompt title="Bootstrap New Project"
Bootstrap {{PROJECT_NAME}} from the agent kit and the {{STACK}} stack pack just copied into this repo. Tier: {{weekend | product | complex}}. Platforms: {{web | iOS | Android}}. Raw vision: @.offthemode/raw-vision.md.
1. List every scaffold file with unfilled {{PLACEHOLDERS}}, grouped as: fill now (only facts I stated in the raw vision, plus the stack pack's commands.env), fill after P1 (mission, stack, remaining commands), delete for this tier (per the kit's scaling table). Show the delete list and wait for my ok.
2. Delete the approved files. Fill what you can now; tag every inference [assumed]. Never invent a stack, a command, a metric or a user.
3. If code exists, detect the toolchain (package manager, framework versions from the lockfile, test and lint scripts) and fill AGENTS.md Commands; otherwise list them under Waiting on me in STATE.md.
4. Write .offthemode/STATE.md: Now = "bootstrapped"; Next = 1. Interrogate My Vision, 2. Generate the Skeleton, 3. Draft the Constitution (lock), 4. Core Spike.
5. Check the wiring: every hook in .claude/settings.json and .cursor/hooks.json points at an executable script; every @ import in CLAUDE.md and AGENTS.md files resolves; each directory pack has its one-line CLAUDE.md; .gitignore covers .env*, shots/, logs/; ~/.claude/design/TASTE.md exists (if not, tell me to run /taste).
6. If I use Cursor: nothing to add for rules, since it reads the nested AGENTS.md files natively; create .cursor/rules/*.mdc only for glob-scoped extras that don't map to a directory.
Report the remaining placeholders by file, then start item 1 of Next.
```

### Tool adapters

The files are the method. Each tool just needs a different way to load them.

| Concern | Claude Code | Cursor | Any AGENTS.md-aware agent |
|---|---|---|---|
| Global taste | `~/.claude/CLAUDE.md` + `~/.claude/design/` | User Rules (the global file) + the same design files by path | The agent's global instructions file, or prepend to AGENTS.md |
| Project rules | `CLAUDE.md` = `@AGENTS.md` + Claude specifics | AGENTS.md, read natively | AGENTS.md, read natively |
| Always-loaded docs | `@` lines inside AGENTS.md, expanded through the import | The same lines, read as file references | Same |
| Domain packs | Nested AGENTS.md + a one-line CLAUDE.md sibling; `.claude/rules/*.md` with `paths:` for globs | Nested AGENTS.md natively; `.mdc` with `globs` only for extras | Nested AGENTS.md (nearest wins) |
| Rituals and prompts | Global commands in `~/.claude/commands/` | @-mention `prompts/<name>.md` | Paste or @-mention `prompts/<name>.md` |
| Critics | Global subagents | A second chat that loads the critic file as its instructions | A second session, or a headless run of the critic prompt |
| Enforcement | Hooks in `.claude/settings.json` | `.cursor/hooks.json` runs the same scripts: it provides `CLAUDE_PROJECT_DIR` as an alias and exit 2 blocks a shell command; `afterFileEdit` can't talk back to the agent, so lint and ban hits arrive through the stop adapter's follow-up | Pre-commit + CI |
| Memory | `.offthemode/` log + SessionStart hook | Same files + the `/start` prompt | Same files + the `/start` prompt |

```file path=".cursor/hooks.json"
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [{ "command": ".claude/hooks/guard-bash.sh" }],
    "afterFileEdit": [{ "command": ".claude/hooks/after-edit.sh" }],
    "stop": [{ "command": ".claude/hooks/cursor-stop.sh", "timeout": 300 }]
  }
}
```

```file path=".claude/hooks/cursor-stop.sh"
#!/usr/bin/env bash
# Cursor stop adapter. Cursor's stop payload carries no final message, so this nudges instead of gating:
# once per loop, if code changed and checks or bans fail, it sends the failures back as a follow-up message. Needs jq; chmod +x.
input="$(cat)"
[ "$(printf '%s' "$input" | jq -r '.status // ""')" = completed ] || exit 0
[ "$(printf '%s' "$input" | jq -r '.loop_count // 0')" -lt 1 ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
changed="$( { git diff --name-only HEAD; git ls-files --others --exclude-standard; } 2>/dev/null | grep -v '^.offthemode/' )"
[ -z "$changed" ] && exit 0
msg=""
out="$({{CHECK_CMD}} 2>&1)" || msg="Checks fail: $(printf '%s' "$out" | tail -20)"
for f in $changed; do
  b="$(printf '{"file_path":"%s"}' "$PWD/$f" | .claude/hooks/lint-bans.sh 2>&1 >/dev/null)" && continue
  msg="$msg"$'\n'"$b"
done
[ -z "$msg" ] && exit 0
jq -n --arg m "Before reporting DONE: fix these.$msg" '{followup_message: $m}'
```

> **Rule:** Never fork the content per tool, and never fork the global layer per project. There is one AGENTS.md, one .offthemode/ tree, one prompts/ folder and one set of critics, and each adapter is a pointer. When a tool can't enforce something, that check moves to pre-commit and CI, where it applies to every agent and every human.

### Scale it down, scale it up

| Part | Weekend build | Product | Extremely complex product |
|---|---|---|---|
| P0 | Global file + 30-line AGENTS.md, STATE.md, Stop hook | Full scaffold | + a directory pack per bounded context, an expert profile per hard domain |
| Product + P1 | PRODUCT.md lite (~20 lines, evidence tags included); SKELETON: domain, surfaces, stack | Full, alignment loop | + `.offthemode/skeleton/*.md` per context, Pre-Mortem per capability, Threat Model the Skeleton |
| P2 | 1-2 h, or "no spike needed" logged; feel check on yourself | Spike + feel prototype with 3 people | 1-3 days per top risk, parallel spike worktrees, sync spike, eval set v0 |
| P3 | Constraint Stack + the tokens knobs, one direction checked against USED.md | Three isolated directions, specimen, pairwise rubric, audits, ban lint | + DTCG tokens generating every platform's theme, baselines, chart grammar |
| P4-P5 | Managed backend, route map only | Full ARCHITECTURE + ROUTES + state inventory, Five-Person Test | + sync decision, Failure-Mode Review, capacity math, RLS on every table, synthesized deep-link stacks |
| Taming | One primary action per surface | Budgets + Complexity Audit | + disclosure map per screen, Power-User Layer, weekly audits |
| P6 | `/cr` + `/ship` | Slices, flags, CR log, baselines | + Drift Check and Refactor Checkpoint every 5 CRs, bake-offs, eval gate |
| P7 | SECURITY.md, `/security-review`, Secrets Sweep | + Provenance, Red-Team before launch | + generated matrix tests, mobile and LLM passes, second-model review on sensitive paths |
| P8 + Always-On | Launch checklist, verification hooks, BANS lint | All seven rails, Landing as Demo, runbook, alerts | + staged rollouts, headless batches, Weekly Signal Review |

Scaling down means deleting files, not skipping thinking. A weekend build still writes the five product decisions, just in twenty lines, and still runs in lanes.
