STATE · updated 2026-09-30 · under 40 lines · rewritten, not appended, whenever a real piece of work ends

## Now
Live at https://offthemode.vercel.app (MCP at /mcp, method at /method), repo public at https://github.com/BlurryVisions/offthemode. The fixes from the 2026-09-29 self-reassess are live and on GitHub (commit 1939a47, deployed 2026-09-30; CI green): guides open as short working rules unless the whole guide is asked for, the server's instructions apply only to projects with .offthemode/, /method renders at build time, and setup, reassess and listrevisit hand over to each other. The live MCP test passes (both protocol versions); npm run check, npm run build and npm run audit pass; both pages were looked at in light and dark.

## Next (item 1 is where the next session starts)
1. One scripted dry run of both doors (CHECKLIST F6.6): done when it proves F5.2 to F5.6 and F6.4 with cited evidence
2. Generate the method's "Load the Rules" prompt (BLUEPRINT.md, How to add it) from content/server/instructions.md (F1.4): done when a grep finds one wording of the standing rule
3. Finish the Supersense trial: done when setup completes there with the new one-go flow

## In flight
- nothing: the checklist (27 of 50 verified), GLOSSARY.md and the CI move to v7 are committed with this update

## Unverified
- setup's new paths (no file access, outdated-file check, one go before writing): only an agent dry run proves them (CHECKLIST F5.2 to F5.6)
- claude.ai accepts each per-skill zip now that argument-hint is gone and every description is 200 characters or less: a real upload (F3.5)
- the 10-minute first win: timed runs with real builders (F5.7)

## Waiting on me · known broken · do not touch
- Pushing to main deploys to production on its own (Vercel is linked to GitHub): push only what should go live.
- In Claude Code auto mode, the MCP tools need the allow rule mcp__offthemode; the skills need none.
- The offthemode command is at 5987 of the MCP test's 6000-character guard: tighten before adding to it.
- The code calls a guide Sheet (lib/content.ts); people read "guide". Rename when that code is next touched (GLOSSARY.md §Terms).

## Corrections seen once (date · what)
- 2026-09-30 · explain what a technical rule is for, in everyday words, before asking for a decision on it
