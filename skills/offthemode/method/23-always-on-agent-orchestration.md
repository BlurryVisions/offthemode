## Always-On · Agent Orchestration

> **Output:** one scout's brief that every other agent starts from, word for word; long builds run as a relay of pieces, each handing a short note to the next; separate sessions for research, building and review; short structured results; scripts for anything that can be measured; a model and effort choice for each task.

The context window is the AI's working memory: everything it has read and said in the current session, read again on every reply. Long sessions pile up stale and contradictory information. A fresh session has none of it, and a fresh session reviewing code has no stake in defending it.

> **Rule:** Don't cap how many agents run. Remove the repetition between them. Every agent starts with a blank memory, so it re-reads what you already know, and you pay for that reading again: thirteen agents, thirteen readings. One scout reads once, and everyone else starts from its brief. Then remove the repetition inside each agent: it re-reads everything it holds on every step, so it hands off finished work instead of carrying it.

### Many agents, one reading

1. **One scout reads first.** It finds the files the task really touches and what they depend on (not the whole repo), writes a short brief, and decides how many agents the work needs. A four-file job rarely needs more than one.
2. **Every agent's prompt starts with that brief, word for word.** Most providers keep a prompt cache: they store the start of a recent prompt and charge a fraction of the normal input price to read it again, as little as a tenth with some. The cache matches only an exact copy, so one changed word near the top means paying in full.
3. **Start one agent first, the rest once it has begun.** Requests that start at the same moment all miss the cache, because it is written only once the first request is being processed.
4. **Agents return short structured results.** Output is never cached and costs the most per word, so each agent replies in a fixed, short shape.
5. **Scripts do anything measurable.** Counts, contrast, sizes, broken links, test runs: a script is exact, fast and free to rerun. A model reading and judging is none of those.
6. **Big searches go to an agent.** Raw search results left in the main session are read again on every later reply. An agent that searches and returns a summary costs less.

```prompt title="Scout the Task"
Scout {{TASK}} before anyone builds it. Change nothing.
Read only what the task touches: the files it changes, what they import, what imports them, the tests that cover them, and the matching lines in .offthemode/RULES.md and .offthemode/CHECKLIST.md. Not the whole repo.
Write a brief of at most 40 lines:
- the goal in one sentence
- each file, with one line on its role
- the contracts that must not break (types, API shapes, design tokens)
- the checks that prove it works: {{?CHECK_CMD}}
- open questions, written as hypotheses ("I think X, because Y")
Then say how many agents this needs and why. One is the default; split only where the parts share no files. For a build longer than about 70 steps, list its pieces in order: a few commits each, with the check that ends each.
End with the reply format every agent uses: done or blocked; files changed; check result; anything the brief got wrong. At most 10 lines.
Every agent that follows starts its prompt with this brief, unchanged.
```

### Hand off, don't carry

An agent works like a session: on every step it re-reads everything it holds, including its own earlier thinking and the code it already wrote. So its cost grows with the square of its length, and a long build pays mostly for carrying finished work. One measured build agent ran 363 steps; its memory grew from 56k to 903k tokens and it re-read 209 million tokens in all. Half of that was its own finished work, a third was files it had printed, and two thirds came from things it took in during its first third of steps. The brief removes the repetition between agents; handing off removes it inside each one. Nothing is capped: effort, thinking, model and exploration stay as they are.

1. **Cut the build at finished work.** The scout returns the build as ordered pieces: a few commits each, about 50 to 70 steps, each with the check that ends it. Small commits share a piece. Never cut in the middle of a piece, such as mid-debug, while its context is still in use.
2. **One builder per piece, in order, the same way each time.** The pieces run one after another in one copy of the project, with the same model, effort and tools, so the shared start stays cached. Each prompt is the brief word for word, then the last piece's note, then this piece.
3. **The note points; it doesn't retell.** The builder ends with a short note in a fixed shape: the commit, the files with line ranges, the decisions made (the unstated ones too: names, conventions, approaches tried and dropped), dead ends in one line each, open issues, and the check with its result. Only the last note goes forward; the code and git hold the rest.
4. **The check ends the piece.** The builder fixes failures itself while it still holds the context, until the check passes. After repeated failures it ends as blocked, with the failure in its note.
5. **The run returns a few lines.** One workflow runs the whole chain and returns at most 10 lines and the path of a file with the details. The main session reads that file narrowly, never whole, and after the run saves STATE.md and suggests a fresh session.
6. **Measure the first run.** Per agent: steps, peak memory, total re-read, and what each new builder re-read to get going. For quality: how often a check failed the first time, rework on the previous piece's lines, and the reviewers' findings. Compare with a run from before the change.

> **Trap:** Splitting too fine. Each new builder re-reads the files it needs, so below about 45 steps the saving flattens while the risk of a lost decision grows. A reviewer per piece roughly doubles the cost; keep the reviewers at the end of the run.

### Patterns

| Pattern | Use when | How |
|---|---|---|
| Research agent | You need conclusions from a lot of reading | An agent or a separate session reads; the main session gets the summary |
| Builder and reviewer | Any change worth checking | A second, fresh AI session asked to review, with no memory of building it |
| Relay builders | A build longer than one piece | One builder per piece, in order, each starting from the brief and the last piece's note (Hand off, don't carry) |
| Isolated builders | Samples that must not see each other (the three directions in P3, bake-offs) | One fresh session per sample, each in its own copy of the project |
| Parallel features | Two or three features that share no files | One session each, in separate copies, after shared contracts have landed |
| Batch run | One mechanical change across many files | Your tool's command-line mode in a loop, one file per run, each run logged |
| Fresh start | A phase ends, or a session starts to drift | Run revisit-state, then open a new session; it loads RULES.md and STATE.md and carries on |

Summarizing a long conversation in place (many tools call this compacting) is for the middle of a task. At a phase boundary, a fresh session with an up-to-date STATE.md is cleaner.

> **Pro move:** If you use git, `git worktree add ../{{APP}}-{{BRANCH}} -b {{BRANCH}}` makes a second folder of the same repo on its own branch, so two sessions never edit the same files. Some tools (Claude Code does) can give an agent its own worktree automatically.

### Batch runs

A batch run is the AI working from the command line, with no chat window: it takes a prompt, does the job, and exits. In Claude Code that is `claude -p`; in Codex, `codex exec`.

For the batch as a whole, have your AI describe the change, list the files, show one sample result and say roughly what the batch costs, then start the loop. Each run is told it belongs to an approved batch, so it never stops to ask a question nobody is there to answer, and it leaves `.offthemode/` alone: many runs rewriting STATE.md would overwrite each other. Update STATE.md once, at the end.

```bash
for f in $(git ls-files '{{FILES_GLOB}}'); do   # each run prints one line, so the loop's output is the log
  {{AI_CLI}} "Part of an approved batch: never stop to ask, don't edit .offthemode/. Apply .offthemode/prompts/copy-pass.md to $f. Edit strings only. Reply in one line: file, changed or unchanged, what changed."
done
{{CHECK_CMD}}   # the check command from RULES.md §Commands, once, after the batch
```

`{{AI_CLI}}` is your tool's command-line call, `{{FILES_GLOB}}` the files to sweep, and the prompt file is any saved prompt (see Prompt Library).

> **Pro move:** If your tool can limit what a command-line run may do (Claude Code's `--allowedTools` can), allow only reading, editing and the check command.

### Model and effort per task

Vision questions, architecture, the data model, the threat model and nasty debugging get the strongest model and the highest reasoning effort your tool offers, with a plan before any code. Building from a settled plan gets the default model. Mechanical sweeps get the fastest one, as a batch run. Review always runs in a different session from the build.

> **Trap:** Parallel agents editing the same files means merge hell. Split work by ownership, and land shared contracts (types, API schema, design tokens) on the main branch before fanning out.
