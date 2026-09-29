## Always-On · Agent Orchestration
<!-- origin: added -->

> **Output:** separate contexts for research, building and review; worktrees for parallel and isolated work; headless batches for mechanical sweeps; a model and effort choice per task.

> **Rule:** Every agent starts with a blank memory, so it re-reads what you already know, and you pay for that reading again: thirteen agents, thirteen readings. Don't cap the agents; remove the repetition. One scout assesses the task first: it finds the files the task really touches and what they depend on (not the whole repo), writes a short brief, and decides how many agents the work needs, because a four-file job rarely needs more than one. Every agent's prompt starts with that brief byte for byte, so it is read from the prompt cache (about 0.05 to 0.1 times the input price) instead of paid in full. Launch one agent first and the rest once it is running, because parallel requests that start together all miss the cache. Agents return short structured results, since output is never cached and costs the most. Scripts do anything measurable. And a search whose raw results would otherwise sit in the main session, re-read on every later reply, is cheaper in an agent that returns a summary.

The context window is working memory. Long sessions pile up stale and contradictory information, and a fresh context reviewing code has no stake in defending it.

| Pattern | Use when | How |
|---|---|---|
| Research subagent | Conclusions from lots of reading | The subagent reads; main context gets the summary |
| Builder / reviewer | Every diff `/ship` routes to a critic | `inventor-critic`, `design-critic` in their own contexts |
| Isolated builder | Samples that must not see each other (P3 directions, bake-offs) | A subagent with `isolation: worktree` in its frontmatter, or a fresh session per worktree |
| Parallel worktrees | 2-3 independent features | `git worktree add ../{{APP}}-{{BRANCH}} -b {{BRANCH}}`, one session each |
| Headless batch | One mechanical change across N files | `KIT_BATCH=1 claude -p` in a loop, logged |
| Phase reset | A phase boundary or a drifting session | `/handoff`, `/clear`; `/compact <focus>` only mid-task |

Headless runs set `KIT_BATCH=1`. The Stop hook then steps aside, and the global rules skip the start and end ritual, the go-gate and STATE.md writes. Otherwise N runs each rerun the full check, rewrite STATE.md over each other, and stall waiting for a "go" nobody will type.

```bash
for f in $(git ls-files '{{ROUTES_GLOB}}'); do
  KIT_BATCH=1 claude -p "Run the Copy Pass in prompts/copy-pass.md on $f. Only edit strings." \
    --allowedTools "Read,Edit,Bash({{CHECK_CMD}})" --output-format json \
    > "logs/batch/copy-$(echo "$f" | tr '/' '_').json"
done
{{CHECK_CMD}}   # once, after the batch
```

Vision interrogation, architecture, data model, threat model and nasty debugging get the strongest model, plan mode and the highest reasoning effort your tool offers. Building from a settled plan gets the default model. Mechanical sweeps get the fastest one, run headless. Review always runs in a different context from the build.

> **Trap:** Parallel agents editing the same files means merge hell. Split work by ownership, and land shared contracts (types, API schema, tokens) on main before fanning out.
