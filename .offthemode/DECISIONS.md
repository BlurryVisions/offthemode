DECISIONS · append-only, newest at the bottom.

### D-001 · One Next.js app serves the website and the MCP server · 2026-09-29 · decided
Context: the site and the server need one deploy · Decision: Next.js on Vercel, MCP at /mcp through mcp-handler 2
Rejected: a separate server (two deploys to keep in sync); Astro plus a function (no first-class MCP adapter)
Because: one deploy, static pages, one source · Revisit if: the server needs state or auth

### D-002 · skills/ is generated but committed · 2026-09-29 · decided
Context: people take the skills pack straight from GitHub · Decision: build skills/ from content/, commit it, and fail the check if it drifts
Rejected: generating only at build time (nothing to download from GitHub)
Because: GitHub is a delivery channel · Revisit if: a release pipeline takes over

### D-003 · The server is stateless and read-only · 2026-09-29 · decided
Context: trust is the product · Decision: tools only return instructions and templates; no storage, no input logging
Because: PRODUCT.md refusal, "never receive anyone's code" · Revisit if: never without a new refusal review

### D-004 · MIT licence · 2026-09-29 · assumed
Because: anyone should be able to use and adapt it · Revisit if: the author prefers another licence
