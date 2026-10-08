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

### D-012 · AI crawlers: search and training allowed · 2026-10-07 · superseded by D-014
Context: the Being Found guide says the AI-crawler choice is written here before robots.txt carries it; the site had no robots.txt, so every crawler could already read every page, and the new app/robots.ts keeps that · Decision (proposed): robots.txt lets every crawler read every page: search engines, the AI search crawlers that quote pages in answers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) and the crawlers that collect text to train AI models (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot); it names the sitemap
Rejected: nothing yet; the other option is the guide's example, found and quoted but not used for training, with one Disallow group per training crawler
Because: I think the author wants the free, MIT-licensed method to reach as many builders and AI tools as it can, because it exists to spread; a hypothesis until the author says go · Revisit if: the author chooses to keep the site out of training

### D-013 · Being found is a thread through the method, and suggestions are not scripts · 2026-10-07 · decided
Context: the author found SEO missing and shared a reel's checklist; they also asked that any reference be taken to heart but improved, not followed blindly · Decision: a new guide, Always-On · Being Found (search, AI answers, app stores, or not at all), with pointers from the plan, backend, navigation, words, mobile and launch guides, built only on facts from official sources; the reel's items are judged keep, change or drop with their source; and a standing rule in every project: take references and suggestions to heart, check their claims, and say how to go further before building
Rejected: pasting the reel's checklist as a launch-day audit (rendering, URLs and words are decided long before launch)
Because: the author's go on 2026-10-06 · Revisit if: Google or the AI companies change what they publish

### D-014 · AI crawlers: found and quoted, not used for training · 2026-10-07 · decided
Context: D-012 proposed letting every crawler read the site; the author chose to block training · Decision: robots.txt allows every crawler by default, so search engines and the AI search bots (OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot) read everything, and gives each training token its own Disallow group: GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot
Rejected: allowing training (D-012); blocking crawlers no company documents a training token for (only what official pages confirm)
Because: the author's go on 2026-10-07 · Cost: Google-Extended also controls grounding in the Gemini app, so Gemini may stop citing the site; Google Search and its AI Overviews are unaffected · Revisit if: the author wants Gemini to cite the site, or a company adds a new training crawler

### D-015 · The command size guard rises to 8000 characters; quality wins · 2026-10-07 · decided
Context: the setup command sat at 5999 of the MCP test's 6000-character guard, and squeezing had cut a rule's meaning (a rule-file fix "only on the user's go") and left lines hard to read · Decision: the guard is 8000 characters; rules are written in full, clear words first, and the guard is raised with a reason rather than a rule squeezed until it loses meaning
Rejected: keeping 6000 and splitting setup into more files now (more reads for the same words)
Because: the author: increase the limit if it compromises quality · Revisit if: a command passes about 7000 characters, then move rarely needed detail into the guide it points to

### D-016 · Setup time is noted, not a pass/fail item · 2026-10-07 · decided
Context: two real setups took 39 and 46 active minutes against "about 10", both with real product thinking and agent research · Decision: time and reply counts are not checklist targets; F5.7 is dropped as a gate and times are noted when they happen; F5.5 becomes a quality check (setup never asks what the user already said or what the code shows)
Rejected: a 3-reply cap and a 10-minute gate (count caps, and they punish projects that need real thinking)
Because: the author: time depends on the project's complexity, the user's pace and the agents' research · Revisit if: a small, simple project still takes long

### D-017 · Shipping is asked once at setup, then kept as the user's usual · 2026-10-07 · decided
Context: how a project goes live (code host, live branch, hosting, commit name) lived only in the AI's memory on one Mac, so a new project, another tool or another person had nothing · Decision: every project's RULES.md gets a Shipping section, filled at setup from git and the host's config and asked in the first round only where missing; on the user's go, the answers are kept in ~/.offthemode/ME.md, one file in the home folder outside every project, so later projects show them as defaults to confirm; it never holds a password, token or key; Off the Mode never sends it anywhere, and the user's AI tool reads it like any file it opens
Rejected: relying on an AI tool's own memory (one tool, one machine, not visible); a global CLAUDE.md (Claude Code only)
Because: the author: "that step should happen while setting up Off the Mode, during the first question session; once the user confirms, the memory can take over" · Revisit if: a tool can't read files outside the project, then it simply asks again

### D-018 · Comments and the plain summary stay two commands · 2026-10-07 · decided
Context: the author proposed one command, "comment-gloss": comments updated first, then both feeding the glossary · Decision: /commentrevisit and /glossaryrevisit stay separate; the plain summary is tied to the checklist instead, since finished items are what make it stale (STATE.md Next 5)
Rejected: one merged command (nothing comments produce feeds the plain summary, which bans technical words; comments go stale when code changes, the summary when features finish; a merge breaks "Comments only" and its proof that the diff holds only comment lines)
Because: the author agreed after a review from three angles (the user, the product rules, the timing) · Revisit if: one job ever needs comment edits and the summary in the same go

### D-019 · Command names a person can read · 2026-10-07 · decided, not built
Context: run-together names such as listrevisit read as one blob; the author proposed revisit-list, view-list, revisit-comment and revisit-glossary · Decision: /listrevisit becomes /revisit-checklist, /listview becomes /view-project, /commentrevisit becomes /revisit-comments, /glossaryrevisit becomes /revisit-glossary; /reassess and /offthemode keep their names; one starting word groups the revisit family
Rejected: revisit-list ("list" is vague; every file and page says checklist); view-list (the page shows the whole project, not only the checklist)
Because: the author: "your renames are better" · Cost: the old names sit in every project already set up and in every skills install, so the clean reinstall and reworded-line update (STATE.md Next 2) land first · Revisit if: a supported AI tool rejects a hyphen in a command name

### D-020 · STATE.md is kept current as the work happens, and /revisit-state saves it at once · 2026-10-07 · decided
Context: "when a real piece of work ends" never came in a conversation that kept going, so STATE.md fell behind; the author wants it current, like a memory · Decision: the AI updates STATE.md in any reply that changes a project file or settles a decision; a seventh command, /revisit-state, saves it in full when the user types it, with any new decisions in DECISIONS.md; like /listview (D-011), it acts at once with no plan to approve, because it writes only those two files and git keeps their earlier versions; it replaces the method's Session End Handoff prompt, without that prompt's check run and commit proposal
Rejected: a Claude Code hook that sends the AI back when files changed and STATE.md didn't (one tool only, and hard to explain); a catch-up from git at every session start (the author: not needed)
Because: the author: "this is why, a command is best" · Revisit if: STATE.md still falls behind with the command in use

### D-021 · /revisit-state also runs on its own, and never writes the same thing twice · 2026-10-07 · decided
Context: D-020 made /revisit-state run only when the user types it, beside a separate rule for keeping STATE.md current · Decision: the AI runs /revisit-state's steps by itself at the end of any reply that changes a project file or concludes a decision (after any other Off the Mode command has finished), and the user can still type it; one line per thing in STATE.md, DECISIONS.md searched before each entry, and a second run in a row changes nothing; run on its own, it adds nothing to the reply unless something waits for the user's go; changes D-020's "when the user types it"
Rejected: two ways to update STATE.md (an ad-hoc edit and the command), which could write the same thing twice
Because: the author: "it's okay if it auto runs sometimes, like whenever files update or a decision is made through conclusion, but we can have a solution for state to not have duplicates" · Revisit if: the automatic runs slow sessions down or STATE.md still gets duplicates

### D-022 · The automatic /revisit-state runs once per reply, skips git, and says so · 2026-10-08 · decided
Context: D-021 ran it at the end of every reply that changed a file, read git each time and stayed silent; the reassess found the git cost, and that every helper agent a session starts would rewrite STATE.md over the others · Decision: run on its own, it runs once at the end of a reply that modified project files or concluded a decision, after the last edit however many files changed; it works from what the reply changed and skips git (git is for a typed run); it ends the reply with one line, "STATE.md updated: <what changed>"; an agent another session started leaves .offthemode/ alone and the session that started it saves; changes D-021's "adds nothing to the reply"
Rejected: a run after each file edit (many runs while files keep changing); a silent run (the author wants to see it happened)
Because: the author: "when it's done modifying many files at once and you complete your reply, maybe we then do it, and a text follows up that state updated" · Revisit if: the one line becomes noise

### D-023 · The renames are built; old names are translated, not kept · 2026-10-08 · decided
Context: D-019's names (revisit-checklist, view-project, revisit-comments, revisit-glossary) were agreed but not built; projects set up earlier still name the old commands in their notes · Decision: the four commands, their files, skill folders, zips, tests and every page use the new names; the link's standing note says which old name became which new one, and /offthemode on a set-up project offers to change old names in the project's notes on the user's go; the MCP test's size guard rises from 8000 to 9000 for that offer (D-015: raise the guard rather than cut a rule); DECISIONS.md and the checklist's evidence and Changes keep the old names, because they record what happened
Rejected: keeping the old names as extra commands (fourteen names for seven jobs)
Because: the author: "also where are the renames?" · Revisit if: a tool still calls an old name after its project's notes were updated

### D-024 · The automatic save's line is just "STATE.md updated" · 2026-10-08 · decided
Context: D-022 ended an automatic /revisit-state with "STATE.md updated: <what changed>" · Decision: the line is only "STATE.md updated", shown when the run changed STATE.md or DECISIONS.md; a typed run still replies with what changed
Because: the author: "not need for what changed, just the updated hint enough" · Revisit if: the author wants to see what changed without opening STATE.md

### D-025 · Ask to decide, never to start: the answers are the consent, and nothing finished waits · 2026-10-08 · decided
Context: 24 hours of sessions in lasscrobits, Supersense and mlix (2026-10-07) held 58 stops for approval: 18 asks for "go" in one project, finished commits unpushed for hours, a /offthemode update that never landed because its one go was never typed, and mlix with no commit since setup; a first fix that only listed what counts as a go was called "super naive" · Decision: RULES.md's "Talk first ... wait for my go" and "Never push, deploy or publish without my go" are replaced. The AI asks only what the owner alone can settle or do, plus the one-way doors (lost data, money, messages to others, writes to the owner's accounts, their data or secrets going somewhere new, a first public URL, breaking what other people use, a terms grey area, dropping a PRODUCT.md promise), in one numbered round with why and its pick, and builds what no answer changes meanwhile; the owner's reply in any words is the consent; a read-back of up to three lines ends "Any doubt, say it; I'm starting." and the work starts in that reply; it never asks whether to start, commit or push. §Shipping gains Reaches: a project only its owner uses pushes finished work to the live branch every reply; one with other people gets one branch per request (pull first, reuse one still open), pushed every reply and merged when the request is done and checked, then back to the live branch and pull. A big run asked for shows its cost in the read-back; one not asked for runs lean and is offered. "Go" leaves every command and guide; the MCP command header drops "acting only on their go"; the MCP test's size guard rises from 9000 to 10000 for setup's reach question and old-go-line check (D-015: raise the guard rather than cut a rule)
Rejected: listing the phrases that count as a go (still a gate); a yes before every push (Claude Code users approve 93% of prompts, so routine asks stop protecting anything); an allow rule written at setup (Claude Code ignores a project's autoMode settings and blocks permissions an AI writes for itself)
Because: the author: "if i have received a response to a question, that itself is a go", "what ever is build and committed is immediately pushed. so nothing stays in backlog", and for projects with users, one branch per request merged when done, "no multi branch fuck ups" · Revisit if: a one-way door ships without the owner's answer, or Claude Code's auto mode blocks a push the owner's answer named

### D-026 · Updating cleanly: the install replaces Off the Mode's folders, and UPDATES.md lists replaced template lines · 2026-10-08 · decided
Context: unzip -o adds and overwrites but never deletes, so the renames (D-023) and the renumbered guides (0126e4c) left stale copies beside the new ones; /offthemode on a set-up project offered only missing template lines, so projects set up earlier kept "wait for my go" after D-025 · Decision: one install line in lib/install.mjs serves the site, the skills README and the method (the build fails if the method's copy drifts or a command is missing from its folder list); it downloads first, then removes Off the Mode's own skill folders, old names included, and unzips, inside a subshell so the terminal stays where it was. A new template file, UPDATES.md, never copied into a project, lists each replaced line by date with the line that replaces it; /offthemode replaces a project's line that still reads as a Was and leaves wording the owner wrote, naming it in one line
Rejected: letting the AI judge by meaning alone which lines changed (it would rewrite the owner's own wording); keeping retired lines inside RULES.md (read every session)
Because: STATE.md Next 2, agreed 2026-10-07; the author: "start Next 2" · Revisit if: an owner's own line gets replaced, or a template line changes without an UPDATES.md entry
