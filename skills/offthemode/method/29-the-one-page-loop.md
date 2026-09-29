## The One-Page Loop
<!-- origin: added -->

Every session, on every project, runs the same six beats, and the lane decides how much of each you pay for. **Trivial** (one file, a few lines, no contract): do it, `/prove`, one-line report. **Standard** (`/cr`): plan inline, proceed unless you object, `/ship`. **Heavy** (`/slice`: schema, auth, payments, a public contract, a new dependency, more than 3 files): plan mode, wait for "go", `/ship`. The agent names the lane in its first line; you veto.

1. **Start.** `/clear` or a fresh session; the hook injects STATE, the PRODUCT north star and the LOG tail. Run `/start`, read the lane and the restated plan, and correct it or let it run (Heavy waits for "go").
2. **Change.** One concern. A new capability is `/slice`; anything else is `/cr`. If the feature still has open decisions, `/interview` first.
3. **Build.** The agent makes a checkpoint commit and works inside the fence; hooks lint every edit, flag bans, and block risky shell commands. Checkpoints and questions never start with `DONE:`, so the Stop hook leaves them alone.
4. **Verify.** `/ship`: prove, then design-critic when the diff touches UI, inventor-critic when it touches a contract, schema, auth or more than 3 files, evals when the core changed. A new or grown surface also gets `/subtract`. After two failed fixes, `/unstick` and climb the ladder.
5. **Log.** `/ship` writes the LOG line and, for Standard and Heavy, updates STATE; decisions become D-### entries; a correction seen twice becomes a LESSONS entry.
6. **Handoff.** `/handoff`, commit, `/clear`.

| Command | Wraps | Use it |
|---|---|---|
| `/start` | Session Start | Every session |
| `/interview` | Interview Me First | Before any feature that still has open decisions |
| `/cr` | Change Request | Standard lane: one concern |
| `/slice` | Vertical Slice | Heavy lane: a new user-visible capability |
| `/prove` | Prove It Works | Trivial lane; first step inside `/ship` |
| `/critique` | Screenshot Critique Loop | UI changes; runs inside `/ship` for UI diffs |
| `/subtract` | Subtraction Pass | Every new or grown surface |
| `/inventor-review` | Inventor-Level Review | Heavy plans; runs inside `/ship` when due (named to avoid Claude Code's built-in `/review`) |
| `/unstick` | Hypotheses Before Fixes | The second time a fix fails |
| `/handoff` | Session End Handoff | Every Standard or Heavy session end |
| `/ship` | prove, critique, review, evals, LOG, `DONE:` | Before any completion report |
| `/listrevisit [note]` | List Revisit | View the checklist, or update it with a new feature or idea; creates it the first time |
| `/reassess` | Reassess Against the Core Concept | Whenever you want to know if what's built still serves the core concept |
| `/commentrevisit [path]` | Comment Revisit | Before a merge, or when comments feel stale |
| `/glossaryrevisit` | Glossary Revisit | Before presenting the project, or after a milestone |

Cadence on top of the loop: `/reassess` and **Refactor Checkpoint** every 5 CRs; **Complexity Audit** weekly during P6; **Five-Person Test** whenever the core journey changes shape; **Weekly Signal Review** after launch; **Project Retro** at the end of every project, so the global layer, your taste and the novelty ledger compound; **Taste Extraction** every six months.
