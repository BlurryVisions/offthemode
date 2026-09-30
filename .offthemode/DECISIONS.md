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

### D-004 · MIT licence · 2026-09-29 · decided (confirmed by the author 2026-09-30)
Because: anyone should be able to use and adapt it · Revisit if: a contributor or a user needs a different licence

### D-005 · No size limits · 2026-09-30 · decided
Context: the reassess found the home page over this repo's "under 100 KB of script" line, and the RULES template carries a script-weight budget for every project · Decision: Off the Mode sets no size limits, for its own site or for the products built with it; how minimal or comprehensive a product is stays its builder's choice
Rejected: a fixed default number; measuring the stack and proposing a limit
Because: the author wants state-of-the-art results without imposed limits · Revisit if: a builder asks for a size budget, which they can still add to their own RULES.md

### D-006 · Speed, contrast and touch-size numbers are not standing rules · 2026-09-30 · decided
Context: the RULES template's floor held load-time, tap-feedback, contrast and touch-target numbers for every project · Decision: the floor holds none; RULES.md §Budgets keeps only code-size and screenshot keys, and a builder adds a speed or accessibility key only when their product should hold one; the guides keep the common values as reference
Rejected: keeping them as floor rules for every UI project
Because: the author judged them small worries that reassess and review surface when they matter · Revisit if: a product falls under a legal accessibility duty (for example the EU's European Accessibility Act for online shops, banking, e-books or ticketing)

### D-007 · marked renders /method at build time · 2026-09-30 · decided
Context: /method loaded marked from a CDN in the browser, so it showed no text without JavaScript and ran a third-party script (CHECKLIST F7.5) · Decision: scripts/render-method.mjs renders BLUEPRINT.md with marked, a devDependency (MIT, no dependencies of its own), when the content builds; the page ships plain HTML and loads no outside script
Rejected: keeping the CDN script (no text without JavaScript, another host on every visit); our own Markdown parser (tables, nested lists and fences are far more than 50 lines to get right)
Because: the page reads without JavaScript and trusts no other host, and it is the library the page already used, so the output stays the same · Revisit if: marked's output changes in a way the page can't absorb; removing it means writing a renderer for the method's Markdown
