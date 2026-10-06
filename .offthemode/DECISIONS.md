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

### D-008 · Setup may fix lines in a project's own rule files, on the user's go · 2026-10-01 · decided
Context: in the Supersense trial, setup found rule lines that conflicted with each other or with the code, and the author approved fixing them · Decision: existing rule files still stay where they are, win on project specifics and are never moved or merged; a line that is out of date or conflicts with the code, another rule or an Off the Mode standard is shown with its fix, changed only on the user's go, and recorded in the project's DECISIONS.md
Rejected: never editing them at all (it left known-wrong rules in force)
Because: the author approved exactly these fixes in the trial · Revisit if: a user reports a rule changed without their go

### D-009 · The time promise depends on project size; setup is not limited to one session · 2026-10-01 · decided
Context: the Supersense trial took 39 active minutes and 6 multi-agent runs, against a promise of about 10 minutes · Decision: the promise is about 10 minutes on a small project and longer on a large codebase; setup may use as many agents as the job needs
Rejected: forcing setup into one session to protect the 10 minutes
Because: the author wants it to deliver, not to be fast at the cost of depth · Revisit if: small projects also miss the 10 minutes

### D-010 · The view, and reassess may save its report · 2026-10-02 · decided
Context: the author wanted a page instead of chat-only views of the checklist, the plan and the last health check · Decision: offthemode.vercel.app/view reads a project's .offthemode/ folder in the browser and draws it as one drawing sheet (direction A, Stamped Sheet, plus direction C's revisited stamp); nothing is uploaded, and the page's own Content-Security-Policy (connect-src 'none') makes that a browser rule; reassess may save its report to .offthemode/REASSESS.md, on the user's go, so the view can show the verdict
Rejected: directions B (Service Map) and C (Ruled Off) as the base, judged by two screenshot-only critics and the author; embedding Off the Mode's own notes as an example (the repo may go private)
Because: "where you really stand" is the first win, and a page shows it far better than chat text · Revisit if: a browser blocks reading a folder, or a user wants the view without opening files each time

### D-011 · /listview runs as soon as the user types it · 2026-10-02 · decided
Context: the author found picking the .offthemode folder on every visit to the view outdated (D-010's revisit); a website can't read local files by itself, but the user's AI tool can · Decision: a sixth command, /listview, joins the project's .offthemode/*.md notes with the view page into one temporary file and opens it in the browser; it runs when the user types it, with no plan to approve first, the one exception to "talk first", because it writes nothing in the project; in Chrome, the view also remembers the folder last picked, in that browser only
Rejected: waiting for a go first, as the other commands do (an extra step for a command that changes nothing in the project); picking the folder on every visit as the only way in
Because: one step from the command to the page, with nothing uploaded and nothing written in the project · Revisit if: /listview ever needs to write in the project, or browsers stop opening a local page

### D-012 · AI crawlers: search and training allowed · 2026-10-07 · proposed, waiting for the author's go
Context: the Being Found guide says the AI-crawler choice is written here before robots.txt carries it; the site had no robots.txt, so every crawler could already read every page, and the new app/robots.ts keeps that · Decision (proposed): robots.txt lets every crawler read every page: search engines, the AI search crawlers that quote pages in answers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) and the crawlers that collect text to train AI models (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot); it names the sitemap
Rejected: nothing yet; the other option is the guide's example, found and quoted but not used for training, with one Disallow group per training crawler
Because: I think the author wants the free, MIT-licensed method to reach as many builders and AI tools as it can, because it exists to spread; a hypothesis until the author says go · Revisit if: the author chooses to keep the site out of training

### D-013 · Being found is a thread through the method, and suggestions are not scripts · 2026-10-07 · decided
Context: the author found SEO missing and shared a reel's checklist; they also asked that any reference be taken to heart but improved, not followed blindly · Decision: a new guide, Always-On · Being Found (search, AI answers, app stores, or not at all), with pointers from the plan, backend, navigation, words, mobile and launch guides, built only on facts from official sources; the reel's items are judged keep, change or drop with their source; and a standing rule in every project: take references and suggestions to heart, check their claims, and say how to go further before building
Rejected: pasting the reel's checklist as a launch-day audit (rendering, URLs and words are decided long before launch)
Because: the author's go on 2026-10-06 · Revisit if: Google or the AI companies change what they publish
