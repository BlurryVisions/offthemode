# Off the Mode · this repo

This repo is Off the Mode itself: a prompt-engineering setup delivered three ways from one source.
It uses Off the Mode on itself: read .offthemode/RULES.md and .offthemode/STATE.md before working.

- `content/` is the only source. Commands in content/commands, project templates in content/templates, the method in content/method/BLUEPRINT.md.
- `skills/` is generated from content/ and committed, because people take it straight from GitHub. Never edit it by hand: run `npm run content`.
- `app/` is the website (Next.js on Vercel); `app/mcp/route.ts` is the hosted MCP server, stateless and read-only.
- Before committing: `npm run check` (content valid, skills/ in sync, types clean). After a change to the server: `npm run build && npm start`, then `npm run test:mcp`.
