RULES · Off the Mode · read before working. The Off the Mode floor (content/templates/RULES.md) applies; these lines are specific to this repo.

## This project
- What it is: a prompt-engineering setup, delivered as a website, a hosted MCP server and a skills pack (full vision: .offthemode/PRODUCT.md)
- Stack: Next.js 16 on Vercel, TypeScript, mcp-handler 2 with the MCP SDK v2, zod 4 · Platforms: web
- Other rule files that stay in force: AGENTS.md

## Rules for this repo
- content/ is the single source. Every delivery is generated from it; never hand-edit skills/, lib/content.generated.json or public/method/.
- The MCP server stays stateless and read-only, stores nothing and logs no inputs.
- Every word a user reads is plain: short sentences, no jargon.
- The website and the method page share one visual language (the drawing set: diazo paper in light, cyanotype in dark, redlines for change).

## Budgets
- Home page: main content visible within 1500 ms on a mid-tier phone; under 100 KB of script.
- Accessibility: WCAG 2.2 AA contrast in both themes; every control reachable by keyboard.

## Commands
check `npm run check` · run `npm run dev` · build `npm run build` · MCP test `npm run test:mcp` (with the site running)

## Done means verified
Checks pass, the site ran, the MCP test passed, and pages were looked at in light and dark.
