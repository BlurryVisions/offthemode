## Always-On · Agent Orchestration

> **Output:** one scout's brief that every other agent starts from, word for word; every build run as a relay of pieces cut at finished results, each handing a short note to the next; fresh reviewers at the end; separate sessions for research, building and review; short structured results; scripts for anything that can be measured; a model and effort choice for each task.

The context window is the AI's working memory: everything it has read and said in the current session, read again on every reply. Long sessions pile up stale and contradictory information. A fresh session has none of it, and a fresh session reviewing code has no stake in defending it.

> **Rule:** Don't cap how many agents run. Remove the repetition between them. Every agent starts with a blank memory, so it re-reads what you already know, and you pay for that reading again: thirteen agents, thirteen readings. One scout reads once, and everyone else starts from its brief. Then remove the repetition inside each agent, and inside the main session too: each re-reads everything it holds on every step, so it hands off finished work instead of carrying it.

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
Then say how many agents work side by side and why. One is the default; work side by side only where the parts share no files. Then list the build's pieces, which run one after another: one finished result each (a page, a layer, a job), with the check that ends it; a small build is one piece. Add to the brief, beyond its 40 lines, the guide lines the build needs, so builders don't open the guides again.
End with the reply format every agent uses: done or blocked; files changed; check result; anything the brief got wrong. At most 10 lines.
Every agent that follows starts its prompt with this brief, unchanged.
```

### Hand off, don't carry

An agent works like a session: on every step it re-reads everything it holds, including its own earlier thinking and the code it already wrote. So its cost grows with the square of its length, and a long build pays mostly for carrying finished work. One measured build agent ran 363 steps; its memory grew from 56k to 903k tokens and it re-read 209 million tokens in all. Half of that was its own finished work, a third was files it had printed, and two thirds came from things it took in during its first third of steps. The brief removes the repetition between agents; handing off removes it inside each one. Nothing is capped: effort, thinking, model and exploration stay as they are.

The first version of this rule covered only "a long build", and whether a build was long was decided once, before it started. In the builds that followed, that failed. 11 of the 12 builders that each took one request, with no note, ran past 70 steps, one of them to 236. The relay pieces ran long too: all 5 went past 70 (99 to 153). The three that were measured each spent their first 32 to 50 steps finding their way back in, reading whole files although the note gave line ranges, plus the plan and four guides. In the week after, the main chats took half of all the reading: they built much of the code themselves, never shrank, and more than half of their steps re-read over 300k tokens. Reviews went wrong both ways. A later review by fresh reviewers, each looking for one kind of problem, confirmed 18 defects: 17 were in the 16,900 lines built without fresh reviewers, 1 in the 5,900 built with them. One build's only review was a quick look from the main session, which found nothing; the later review confirmed 9 defects in it. Another change of about 700 lines was reviewed whole eight times.

Not solved yet: asking has not reliably moved the main session (it worked at some natural ends and was ignored at others, even with the first message ready). Until a meter exists, a main session can still carry about half the reading, as it did in the measured week (853M of 1,717M). Whether the steps below keep relay pieces short is also untested. What changed: every builder now ends at a finished result, the brief carries the guides, the check shows only failures, each builder's cost is shown, reviews stay and a second round doesn't redo what the first already reviewed, and the main session is asked to hand off too.

1. **Cut every build at finished results.** The scout returns the build as ordered pieces, each one finished result (a page, a layer, a job) with the check that ends it; a small build is one piece. A builder ends when its piece's check passes, even if the request holds more: the rest goes to a fresh builder with the note, so a request that grows is cut while it is built, not only at the start. Never cut by a step count, and never in the middle of a piece, such as mid-debug. Results too small to be worth a new builder go together in one piece (see the Trap).
2. **One builder per piece, in order, the same way each time.** The pieces run one after another in one copy of the project, with the same model, effort and tools, so the shared start stays cached. Each prompt is the brief word for word, then the last piece's note, then this piece. The brief already holds the guide lines the build needs, which counts as opening those guides.
3. **The note says where to start.** The builder ends with a short note in a fixed shape: the commit; the exact lines the next piece starts from (file, line range and why each matters); the decisions made (the unstated ones too: names, conventions, approaches tried and dropped); dead ends, one line each; known traps, copied from note to note; open issues; and the check with its result. Only the last note goes forward, with the traps it carries; the code and git hold the rest. In the measured relay, line ranges alone didn't stop whole-file reading, so measure what each new builder reads to get going.
4. **The check ends the piece, and shows only failures.** A passing check says so in one line. A failing one shows each failure in full and nothing else, because every line of output is read again on every later step. The builder fixes failures itself while it still holds the context, until the check passes. After repeated failures it ends as blocked, with the failure in its note.
5. **One line of cost after each builder.** The run records each builder's steps and the token count your tool reports. The line stops nothing: it helps cut the next piece (a piece that ran long may have held two results, or spent its start finding its way in) and shows where the reading went.
6. **Fresh reviewers at the end, then only what changed.** A build that touches a contract, a schema, login or more than 3 files ends with reviewers who didn't build it; a quick look from the main session is not a review. A second round starts from the lines changed since the first and the list of findings already fixed or shown wrong, so those don't come back, and it doesn't review the unchanged code again.
7. **The run returns a few lines.** One workflow runs the whole chain and returns at most 10 lines and the path of a file with the details. The main session reads that file narrowly, never whole.
8. **The main session is asked to hand off too.** At each natural end (a build shipped, a phase ended), after saving STATE.md, it suggests a fresh session and gives the exact first message to type. It suggests and never forces: going on is the owner's call. Asking alone has not been enough; a meter that shows the session's size is the part still missing.
9. **Measure each run.** For each agent and the main session: steps, peak memory, total re-read, and what each new builder re-read to get going. For quality: how often a check failed the first time, rework on the previous piece's lines, and the reviewers' findings. Compare with the run before.

> **Trap:** Splitting too fine. Each new builder re-reads the files it needs. Replayed on one measured builder's real steps, handing off more often than about every 45 steps saved little more, and every extra handoff is one more chance to lose a decision. A reviewer per piece roughly doubles the cost; keep the reviewers at the end of the run.

### Patterns

| Pattern | Use when | How |
|---|---|---|
| Research agent | You need conclusions from a lot of reading | An agent or a separate session reads; the main session gets the summary |
| Builder and reviewer | Any change worth checking | A second, fresh AI session asked to review, with no memory of building it |
| Relay builders | Any build | One builder per finished result, in order, each starting from the brief and the last piece's note (Hand off, don't carry) |
| Isolated builders | Samples that must not see each other (the three directions in P3, bake-offs) | One fresh session per sample, each in its own copy of the project |
| Parallel features | Two or three features that share no files | One session each, in separate copies, after shared contracts have landed |
| Batch run | One mechanical change across many files | Your tool's command-line mode in a loop, one file per run, each run logged |
| Fresh start | A build ships, a phase ends, or a session starts to drift | Once STATE.md is saved (it already is after a build ships), open a new session with the first message the old one suggested; it loads RULES.md and STATE.md and carries on |

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
