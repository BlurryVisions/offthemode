UPDATES · lines the templates replaced, newest first · /offthemode reads this to update a project set up earlier; it is never copied into a project

A project's line that still reads as a Was (its words, with that project's values filled in) gets the line named after it, from the current template, filled for that project. A line that matches neither is the owner's own wording: it stays, and the update names it in one line.

## 2026-11-11 · the owner's points are held and checked; agents only where they pay (D-040)
- RULES.md §How to work · Was: "- Never build on an assumption: write a doubt as "I think X, because Y", then settle it in the code or docs, or put it in the round." · Now: the line starting "- Build from my points"
- RULES.md §How to work · Was: "- Read STATE.md when you start, and keep it current without asking: ... follow revisit-state's steps (STATE.md's now, next, in flight, unverified and corrections I gave for the first time; new decisions in DECISIONS.md), ..." · Now: the line starting "- Read STATE.md when you start, and keep it current without asking: once at the end", which names the piece's points first
- RULES.md §How to work · Was: "- Sessions stay free. Never force the checklist; /revisit-checklist catches up afterwards." · Now: the line starting "- Sessions stay free:"
- RULES.md §Efficiency · Was: the four lines starting "- Scout first:", "- Many agents, one reading:", "- Hand off, don't carry:" and "- Review fresh, then only what changed:" · Now: the three lines starting "- Split work only where it pays", "- Every agent's brief" and "- Give each agent the model", in their place
- RULES.md §Done means verified · Was: "Checks pass, the thing actually ran, and UI changes were looked at on screen in the real app, ... "Should work" is not done: say what you verified and how." · Now: the paragraph starting "Say done by the points"
- CHECKLIST.md · Was: no line starting "Points:" in the header · Now: the line starting "Points:", after the one starting "Marks:"; the items stay as they are

## 2026-10-29 · the owner's rules get rule checks, screens are checked on real data (D-031)
- RULES.md §Done means verified · Was: "Checks pass, the thing actually ran, and UI changes were looked at on screen. "Should work" is not done: say what you verified and how." · Now: the paragraph starting "Say done by the points"

## 2026-10-21 · every build hands off, review fresh, the main session is asked to hand off (D-029)
- RULES.md §Efficiency · Was: "- Hand off, don't carry: an agent re-reads everything it holds on every step, so its cost grows with the square of its length. A long build runs as pieces of a few commits, in order: each builder starts from the brief and the last piece's short note (commit, files with line ranges, decisions, dead ends, open issues, check result) and ends when its check passes. Effort and thinking stay as they are." · Now: the three lines starting "- Split work only where it pays", "- Every agent's brief" and "- Give each agent the model" (2026-11-11)
- RULES.md §Efficiency · Was: "- Keep sessions short: when a piece of work ends, suggest /revisit-state and a fresh session. A long session re-reads its whole history on every reply." · Now: the line starting "- Keep sessions short"
- RULES.md §Guides · Was: "## Guides (open the matching one before the work; once per session is enough)" · Now: the heading starting "## Guides"
- RULES.md §Efficiency · Was: "- Big runs (several agents, or hours): one I asked for gets its rough cost in the read-back and starts; one I didn't, run lean and offer it with its cost. Token cost is not a one-way door." · Now: the line starting "- Big runs"

## 2026-10-11 · hand off, don't carry (D-028)
- RULES.md §Efficiency · Was: "- Read narrow: search first, then open only the lines you need. Never read generated files, lockfiles or build output; tail logs instead of reading them whole." · Now: the line starting "- Read narrow"

## 2026-10-08 · ask to decide, never to start (D-025)
- RULES.md §This project · Was: "They win over this file on project specifics." or "...; a line in them changes only on my go, recorded in DECISIONS.md." · Now: the line ending "changes only on my yes, recorded in DECISIONS.md."
- RULES.md §Shipping · Was: "- Never push, deploy or publish without my go: what goes live is mine to decide." · Now: the two lines starting "- Reaches:" and "- When live breaks"; Reaches comes from the user's answer, and until then counts as other people
- RULES.md §How to work · Was: "- Talk first, then do. For anything beyond a small fix (a typo, a one-line change), restate the task and your plan in a few lines and wait for my go. Say what you changed when you're done." · Now: the two lines starting "- Ask to decide, never to start" and "- One-way doors are mine"
- RULES.md §How to work · Was: "- Never build on an assumption. When something is unclear (what I want, how something should behave, what the code does), write it as a hypothesis, "I think X, because Y", so it is clear, then confirm it before building on it: ..." · Now: the line starting "- Build from my points"
- RULES.md §Efficiency · Was: "- For big runs, say roughly what they will cost and wait for my go." or "- For big runs, say roughly what they will cost before starting, then go." · Now: the line starting "- Big runs"
- ME.md · Was: "It is written only on your go," · Now: "It is written only from your answers,"

## 2026-10-08 · the automatic save runs once per reply (D-022)
- RULES.md §How to work · Was: "- Read STATE.md when you start, and keep it current without asking: at the end of any reply that changes a project file or concludes a decision, ..." · Now: the line starting "- Read STATE.md when you start, and keep it current without asking: once at the end"

## 2026-10-07 · STATE.md is kept current as the work happens (D-020, D-021)
- RULES.md §How to work · Was: "- Read STATE.md when you start. When a real piece of work ends, rewrite STATE.md (now, next, in flight...), ... and add any decision to DECISIONS.md." · Now: the line starting "- Read STATE.md when you start, and keep it current without asking"
- RULES.md §Efficiency · Was: "- Keep sessions short: when a piece of work ends, update STATE.md and start fresh." · Now: the line starting "- Keep sessions short"
- STATE.md first line · Was: "... · under 40 lines · rewritten, not appended, whenever a real piece of work ends" · Now: the template's first line, with this project's date
