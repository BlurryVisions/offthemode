STATE · updated 2026-09-30 · under 40 lines · rewritten, not appended, whenever a real piece of work ends

## Now
Live at https://offthemode.vercel.app (MCP at /mcp, method at /method), repo public at https://github.com/BlurryVisions/offthemode. The live site still runs the 2026-09-29 build. Locally, the fixes from the 2026-09-29 self-reassess are built and checked but not committed: guides open as short working rules unless the whole guide is asked for, the server's instructions apply only to projects with .offthemode/, /method renders at build time, and setup, reassess and listrevisit hand over to each other. npm run check, npm run build, the local MCP test (both protocol versions) and npm run audit pass; both pages were looked at in light and dark.

## Next (item 1 is where the next session starts)
1. Commit content/ and skills/ together, push, deploy: done when MCP_URL=https://offthemode.vercel.app/mcp npm run test:mcp passes live and CI's check runs green on GitHub
2. Write GLOSSARY.md with the glossaryrevisit command: done when "In plain words" is under 300 words and names no technology
3. Finish the Supersense trial: done when setup completes there with the new one-go flow

## In flight
- nothing: every change is on disk and checked

## Unverified
- setup's new paths (no file access, outdated-file check, one go before writing): only an agent dry run proves them (CHECKLIST F5.2 to F5.6)
- claude.ai accepts each per-skill zip now that argument-hint is gone: a real upload (F3.5)
- the 10-minute first win: timed runs with real builders (F5.7)

## Waiting on me · known broken · do not touch
- Vercel is not linked to GitHub, so deploys are manual: npx vercel deploy --prod. Link it in the Vercel dashboard.
- In Claude Code auto mode, the MCP tools need the allow rule mcp__offthemode; the skills need none.
- The offthemode command is at 5987 of the MCP test's 6000-character guard: tighten before adding to it.

## Corrections seen once (date · what)
- 2026-09-30 · explain what a technical rule is for, in everyday words, before asking for a decision on it
