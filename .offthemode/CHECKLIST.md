# Checklist · Off the Mode
Last revisit: 2026-10-07 · Verified 35/63

A map, not a gate. Build in any order; /listrevisit reconciles and updates this file.
Marks: [ ] todo · [~] in progress · [x] built, not proven · [v] verified, evidence cited · [-] dropped, reason kept
Verify: early = can be proven on its own · on completion = only an end-to-end run proves it

## Vision (owned by .offthemode/PRODUCT.md; do not edit here)
- Thesis: for builders tired of average AI output, the setup that makes any AI tool plan first, build in the right order and hold an elite bar
- Moment of value: about 10 minutes after adding it on a small project (longer on a large codebase), a new project has a plan and a checklist; an existing project has a plain summary, where it stands against its core concept, and a checklist with what's done
- Core concept: one method written once as instructions and templates, delivered to any AI tool by a link or a skills download, kept honest by revisit commands; the project gets one .offthemode/ folder

## Fragments

### F1 · One source, built into every delivery · depends on: none · Verify: early
For the person: whichever way they add it, they get the same, current method.
- [v] F1.1 content/ builds skills/, the server's content, /method and the zips · done when: `npm run check` prints "skills/ in sync" · guide: none · evidence: `npm run check` prints 'skills/ in sync' (2026-09-30, after commit 1939a47)
- [v] F1.2 RULES.md §Guides cites only real guides · done when: `npm run check` fails on a made-up guide name · guide: always-on-verification-loop · evidence: `npm run check` fails with 'cites "not-a-real-guide", which is not a method sheet' (negative test on a scratch copy, 2026-09-30)
- [v] F1.3 the method's copies of the revisit commands are generated from content/commands, not kept by hand · done when: `npm run check` fails if BLUEPRINT.md holds a hand-written copy of a command · guide: always-on-verification-loop · evidence: `npm run check` fails with 'a hand-written copy of a command' on a prompt block titled List Revisit (negative test on a scratch copy, 2026-09-30)
- [x] F1.4 the server's instructions and the install steps each have one source · done when: a grep finds the standing rule only in content/ and generated files, and the site, README and method list the same tools · guide: none · evidence: server instructions in content/server/instructions.md; site, README (links to the site) and the method's How to add it list the same tools
- [v] F1.5 committed skills/ can't drift from content/ · done when: `node scripts/build-content.mjs --check --committed` fails on uncommitted changes in skills/, and CI runs it on every push · guide: always-on-verification-loop · evidence: GitHub Actions run 36673805189 on commit 1939a47: npm run content, --check --committed and tsc green (2026-09-30); --committed failed while skills/ was uncommitted (the fix-up agent's run) and passed after the commit
- [ ] F1.Q Quality bars met for F1 · evidence:

### F2 · The link: the MCP server hands out commands, templates and guides · depends on: F1 · Verify: early
For the person: one pasted link and their tool has every command, and it never sees their code.
- [v] F2.1 6 command tools, 6 prompts, get_template, get_method and resources answer · done when: `npm run test:mcp` passes against the live URL · guide: p4-backend-infra · evidence: MCP_URL=https://offthemode.vercel.app/mcp npm run test:mcp after the 2026-10-02 deploy of 305ee2a: tools/list shows the 6 command tools plus get_template and get_method, prompts/list the 6 prompts, all passed
- [v] F2.2 the server stores and logs nothing it is sent · done when: app/mcp/route.ts and lib/content.ts contain no storage or logging of arguments · guide: p7-security-hardening · evidence: grep of app/mcp/route.ts and lib/content.ts finds no console, file writes, fetch, kv, redis or verboseLogs (2026-09-30)
- [v] F2.3 the server's instructions apply only to projects with a .offthemode/ folder · done when: every step in the instructions text is conditioned on the folder · guide: p4-backend-infra · evidence: `npm run test:mcp` · 'instructions: conditioned on .offthemode/, point to §Guides' (local, 2026-09-30)
- [v] F2.4 no idle subscription streams on a stateless server · done when: a live subscriptions/listen call is refused at once · guide: p4-backend-infra · evidence: `npm run test:mcp` · 'subscriptions/listen 2026-07-28 · refused in 7 ms' (local, 2026-09-30)
- [v] F2.5 a typed note survives the trip · done when: `/mcp__offthemode__listrevisit add CSV export` gives the agent the whole note, or the command text tells it to use the user's own words when the note looks cut off · guide: none · evidence: `npm run test:mcp` · 'listrevisit · says what to do with a cut-off note; no raw placeholder' (local, 2026-09-30)
- [v] F2.6 the MCP test covers both protocol versions in use · done when: `npm run test:mcp` initializes with 2024-11-05 and 2025-06-18 · guide: always-on-verification-loop · evidence: `npm run test:mcp` · initialize 2024-11-05 ok, initialize 2025-06-18 ok (local, 2026-09-30)
- [ ] F2.Q Quality bars met for F2 · evidence:

### F3 · The skills: offline, complete, installable in every named tool · depends on: F1 · Verify: early
For the person: no server; the folders alone run every step.
- [v] F3.1 the all-skills zip matches skills/ · done when: an unzip of public/skills/offthemode-skills.zip diffs clean against skills/ · guide: none · evidence: the live all-skills zip unzips with a clean diff -rq against skills/ (2026-09-30)
- [v] F3.2 every mention of another command or guide says where to find it · done when: a grep of skills/*/SKILL.md finds no command or guide reference without a path · guide: always-on-words-voice · evidence: skills say 'the X command' and each Files section names ../X/SKILL.md and ../offthemode/method/ (grep of skills/*/SKILL.md, 2026-09-30)
- [v] F3.3 frontmatter uses only keys the skills spec allows · done when: `npm run check` rejects a key outside the allowlist · guide: always-on-verification-loop · evidence: `npm run check` fails with 'unknown frontmatter key' on a made-up key; no argument-hint left in skills/ (2026-09-30)
- [v] F3.4 install paths for every tool the site names · done when: the site and skills/README give .agents/skills for Codex, Gemini CLI, Cursor and VS Code, and .claude/skills for Claude Code · guide: always-on-words-voice · evidence: C6 paths on the site (AddTabs.tsx) and in skills/README.md; README points to the site (grep, 2026-09-30)
- [x] F3.5 each per-skill zip uploads to claude.ai · done when: a real upload of listrevisit.zip is accepted · guide: none · evidence: all five skills pass Anthropic's skill-creator validator, descriptions 185 to 196 characters (claude.ai allows 200), skill folder at the zip root (2026-09-30); a real upload is skipped for now: the author's claude.ai is an org account
- [ ] F3.Q Quality bars met for F3 · evidence:

### F4 · The guides: the right one opens, and a small change stays small · depends on: F1 · Verify: early
For the person: their AI works to the method for each kind of work without turning a small change into a whole phase.
- [v] F4.1 30 guides served by get_method and the skill's method/ folder · done when: `npm run check` reports 30 sheets · guide: none · evidence: `npm run check`: 30 sheets, 10 with working rules (2026-09-30)
- [v] F4.2 each phase guide opens with short working rules for changes inside an existing product · done when: a 3-line UI change reads under 5 KB of guide text · guide: always-on-agent-orchestration · evidence: get_method p3-visual-language returns the working rules, 1.3 KB, with the way to the whole 50.6 KB guide (`npm run test:mcp`, 2026-09-30)
- [v] F4.3 §Guides routes to expertise-injection and p0-constitution · done when: `npm run check` lists both as cited · guide: none · evidence: `npm run check`: expertise-injection and p0-constitution are not in the not-cited list (2026-09-30)
- [v] F4.4 every number has one owner: time to value in PRODUCT.md, budgets in one json block in RULES.md §Budgets · done when: the method's own budget parser reads the block from the RULES template · guide: always-on-accessibility-performance-budgets · evidence: the method's budget reader (BLUEPRINT audit script) parses this repo's RULES.md block and stops on the raw template's blanks (2026-09-30)
- [v] F4.5 security from day one is set up by setup, or the method stops promising it · done when: the P7 phase table, P0 output and RULES template §Safety say the same thing · guide: p7-security-hardening · evidence: P7 phase table (BLUEPRINT:28), P0's Safety row (:204), P7 working rules (:1907) and the RULES template §Safety all say: day-one rules in §Safety, SECURITY.md written at the first security work and pointed to from §Safety (2026-09-30)
- [x] F4.6 a guide for being found: search, AI answers, app stores, or not at all · done when: RULES.md §Guides routes to always-on-being-found, npm run check passes, and every fact in the guide has an official source or is written as a hypothesis · guide: always-on-being-found · evidence: guide written from 143 facts read on official pages (2026-10-06); a fresh reviewer checked its claims against them and 14 issues were fixed; npm run check passes
- [v] F4.7 references and suggestions are taken to heart, never as a script · done when: the rule is in the RULES template's §How to work, setup's Questions and the method · guide: none · evidence: grep finds it in content/templates/RULES.md, content/commands/offthemode.md and BLUEPRINT.md (Product-First Doctrine, P3 references), 2026-10-07
- [ ] F4.Q Quality bars met for F4 · evidence:

### F5 · Setup: both doors reach the first win · depends on: F2, F3, F4 · Verify: on completion
For the person: soon after adding it (about ten minutes on a small project), they have a plan, or a health check, and a checklist.
- [x] F5.1 the setup command covers both doors, talk first · done when: skills/offthemode/SKILL.md has a New and an Existing section, each with a go before writing · guide: p1-vision-skeleton · evidence: content/commands/offthemode.md
- [x] F5.2 a path for tools that can't open the project · done when: a claude.ai chat run yields the PRODUCT.md and CHECKLIST.md text to save · guide: p1-vision-skeleton · evidence: setup has a no-file-access path; needs a claude.ai run
- [v] F5.3 no placeholder left that nobody asked about · done when: grep "{{" on a dry run's .offthemode/ lists only blanks the user chose to leave · guide: none · evidence: Supersense trial (end to end, 2026-10-01): grep of its .offthemode/ finds no blank left; the one hit was the RULES template's own header text, reworded since; again in the lasscrobits new-project run (2026-10-06): no blank left, every template section present
- [x] F5.4 the status path flags files that are filled but out of date · done when: on this repo's pre-update RULES.md, status names the missing sections · guide: none · evidence: the status branch compares each file's ## headings with the template; needs a run
- [x] F5.5 setup never asks what the user already said or what the code shows · done when: a setup run's questions hold none that the user's earlier messages or the project's files already answer · guide: p1-vision-skeleton · evidence: setup says "Use everything the user has already said, and never ask it again" (live since 5fc4f82, 2026-10-07); not yet checked against a run. Replaced the old 'at most 3 user turns' target (D-016)
- [x] F5.6 the rules fit products without a web UI · done when: a dry run on a CLI keeps no UI or server line it can't meet · guide: none · evidence: (UI), (web), (native), (server) tags with delete-when-absent in RULES; needs a CLI dry run
- [-] F5.7 timed with real people · dropped 2026-10-07 as a pass/fail item (D-016): time depends on the project's complexity, the user's pace and the agents' research; times are noted when they happen (Supersense 39 active minutes, lasscrobits 46, both with real product thinking), and the author may time a quick small-project run later for reference
- [ ] F5.8 setup talks in plain words · done when: in a real setup run, the user never has to ask what a message means, and a fresh reader finds no unexplained term in setup's messages · guide: always-on-words-voice · evidence: not met in the lasscrobits run (2026-10-06): the user had to ask what "switching chat" meant, said "not clear… in simple words" and "didn't get the phone dashboard homescreen alert", and asked where the view was
- [x] F5.9 shipping is asked once, then remembered · done when: in a new project with ~/.offthemode/ME.md present, setup fills RULES.md §Shipping from it and asks no shipping question that ME.md, git or the host's config already answers; without it, setup asks once in the first round and offers to save the answers there · guide: p8-ship-operate · evidence: a dry run in an empty new project (2026-10-07) read ~/.offthemode/ME.md and filled the code host and commit name from it, took the repo from git, and asked only the iOS hosting question that neither answers; its 10 findings and a review's 7 were fixed (ME wins over git's global identity, per-platform hosting, sources shown in the one go, branch disagreements, the home folder's .offthemode/ never counts as a project); not yet rerun after the fixes
- [ ] F5.Q Quality bars met for F5 · evidence:

### F6 · The health check and revisits keep it honest · depends on: F5 · Verify: on completion
For the person: whenever they ask, they learn where they stand, without being slowed down.
- [x] F6.1 listrevisit, reassess, commentrevisit and glossaryrevisit exist in both routes · done when: test:mcp lists them and skills/ has each folder · guide: none · evidence: scripts/test-mcp.mjs; skills/
- [x] F6.2 reassess reads the refusals, tie-breakers and experience promises that PRODUCT.md actually has · done when: every section reassess names exists in the PRODUCT template · guide: none · evidence: on-completion fragment: stays unverified until its end-to-end run (F6.4, F6.6); reassess.md reads 'refusals, tie-breakers and experience promises', both in the PRODUCT template
- [x] F6.3 reassess asks before it runs a real input · done when: reassess.md step 4 proposes the input and waits for a go · guide: none · evidence: on-completion fragment: stays unverified until its end-to-end run; content/commands/reassess.md:13 proposes the input and waits for a go
- [v] F6.4 reassess notes reach the checklist in the setup chain · done when: in a dry run, every "note for listrevisit" from reassess appears as an item · guide: none · evidence: Supersense trial (end to end, 2026-10-01): the reassess summary is under ## Changes and its drift points became items (sql_guard, alerts, connections)
- [x] F6.5 listrevisit asks for a go once · done when: a status run with a note has one wait, not two · guide: none · evidence: listrevisit shows one report and waits for one go; needs a run
- [ ] F6.6 an eval of the instructions themselves · done when: `npm run eval` runs a scripted dry run of both doors, with 0 unfilled placeholders and the turns counted · guide: always-on-verification-loop · evidence:
- [ ] F6.Q Quality bars met for F6 · evidence:

### F7 · The website: pick your tool, add it in one step · depends on: F2, F3 · Verify: early
For the person: they pick their tool and are done in one step, on any device.
- [v] F7.1 six tool tabs, each with a copy value or a one-click button · done when: a screenshot of each tab shows the live link or zip · guide: p3-visual-language · evidence: on the live site all 7 tabs show the live link, a one-click link or a zip (browser check, 2026-09-30)
- [v] F7.2 one paste to add it in Claude Code · done when: one copyable line installs the skills, with no allow rule needed · guide: p5-navigation-flows · evidence: the Claude Code line installed all five skills, rules files included, into a test home (2026-09-30)
- [v] F7.3 every claim on the page is true · done when: the folder promise reads "the .offthemode/ folder, plus one line you approve", and the Claude tab says what setup needs · guide: always-on-words-voice · evidence: looked at on screen 2026-09-30: 'plus one line you approve' on the page, the Claude tab says setup needs a session that can open the project folder
- [-] F7.4 WCAG 2.2 AA contrast in both themes · dropped 2026-09-30: speed, contrast and touch-size numbers are not standing rules (D-006); the contrast fixes already made stay
- [v] F7.5 /method readable without JavaScript and with no third-party script · done when: curl of /method shows sheet text and no cdnjs reference · guide: always-on-accessibility-performance-budgets · evidence: curl of local /method shows sheet text with scripts stripped, 0 cdnjs references (2026-09-30)
- [v] F7.6 the closed index drawer is out of the tab order · done when: at 375 px, Tab from the top reaches the content without landing off-screen · guide: always-on-accessibility-performance-budgets · evidence: live /method at 375 px: links in the closed index are visibility hidden and refuse focus; the same link in the page strip takes focus on-screen (browser check, 2026-09-30)
- [-] F7.7 the home page's script weight within a budget · dropped 2026-09-30: Off the Mode sets no size limits; how minimal or comprehensive a product is stays its builder's call (DECISIONS D-005)
- [v] F7.8 the site follows its own being-found guide · done when: the live robots.txt and sitemap.xml return 200 with the production address, the home page carries its title, description, canonical, share image and WebSite structured data · guide: always-on-being-found · evidence: live after commits 0126e4c and 06f8be2 (2026-10-07): robots.txt and sitemap.xml return 200 with https://offthemode.vercel.app addresses, robots.txt blocks the five training crawlers (D-014); /, /method and /view carry canonical and og:image; the share image serves; WebSite JSON-LD on /. Search Console left out by the author's choice: they don't want to own the vercel.app address yet
- [ ] F7.Q Quality bars met for F7 · evidence:

### F8 · The view: your project at a glance · depends on: F7 · Verify: early
For the person: they open one page and see where their project stands: the checklist, the plan, the decisions and the last reassess, without reading markdown.
- [x] F8.1 open a project's .offthemode/ folder at offthemode.vercel.app/view · done when: the folder opens in Chrome, Safari and Firefox and this repo's own .offthemode/ renders with no error · guide: p5-navigation-flows · evidence: Chrome: both this repo's and Supersense's folders loaded into /view through the file input (CDP DOM.setFileInputFiles, 2026-10-02); Safari, Firefox, the folder dialog and drag and drop not tried yet
- [v] F8.2 the checklist as a progress board · done when: every fragment, mark and the verified count match a script's parse of the same CHECKLIST.md · guide: p3-visual-language · evidence: page = parser = CHECKLIST.md header: stamp 29/57 and legend 29 · 10 · 3 · 15 · 3 dropped for this repo, 0/61 for Supersense (shoot.mjs measures, 2026-10-02); npm run test:view compares parser and header
- [x] F8.3 plan, plain summary, decisions and where things stand, each on its own panel · done when: each panel shows its file's sections for this repo and for Supersense · guide: p3-visual-language · evidence: the page agent's run drew every panel for both folders (2026-10-02); not looked at panel by panel by a second reader
- [x] F8.4 the latest reassess result · done when: reassess saves its report to .offthemode/REASSESS.md on the user's go, and the view shows its alignment and gaps · guide: none · evidence: reassess offers the save to .offthemode/REASSESS.md on a go; the view ticked 'on course' from a test REASSESS.md (2026-10-02); no real reassess run has saved one yet
- [v] F8.5 nothing leaves the computer · done when: the page's Content-Security-Policy has connect-src 'none' and the network panel shows no request carrying file content · guide: p7-security-hardening · evidence: public/view/index.html carries a CSP meta with connect-src 'none' and hashed scripts (npm run test:view); the network log shows only page and font loads, none after a folder is opened, and a test fetch() was blocked (2026-10-02)
- [v] F8.6 the commands point to the view · done when: listrevisit, reassess and glossaryrevisit end with the view link, and setup's last step names it · guide: always-on-words-voice · evidence: listrevisit, reassess and glossaryrevisit end with the view line, and setup's last step names it (grep of content/commands, 2026-10-02)
- [v] F8.7 /listview opens the project as a page in one step · done when: run on this repo and on Supersense, its own command line writes one temporary page that shows the same counts as CHECKLIST.md's header, opens it, and leaves every file in the project unchanged (git status clean) · guide: none · evidence: the command's own line against the live site (curl from https://offthemode.vercel.app/view, 2026-10-02): a 155 KB temporary page drew 31/59, equal to the header, with the snapshot line; git status unchanged; also npm run test:listview on this repo and Supersense
- [x] F8.8 Chrome remembers the folder · done when: after a reload, one click on "Reopen <project>" draws the project again in Chrome, and Safari and Firefox show the normal open button · guide: p5-navigation-flows · evidence: headless Chrome with a stubbed folder: the pick is stored, 'Reopen Off the Mode' leads after a reload, one click draws 32/59; refused and moved-folder notices work; without showDirectoryPicker only the normal button shows (2026-10-02); the real Chrome prompt is not tried yet
- [ ] F8.Q Quality bars met for F8 · evidence:

## Foundation (keep only what this product needs)
- [v] B1 Rules and memory in place: .offthemode/RULES.md and STATE.md filled · done when: a fresh session can say what the project is and what's next, and RULES.md has every section of the current template · evidence: a fresh agent reading only RULES.md and STATE.md named the project, the next step and what is waiting (2026-09-30)
- [v] B2 Ready to host: deployed on Vercel; no database, so no migrations · done when: a preview deploy starts and serves the core journey · evidence: production deploy of commit 1939a47 is Ready and serves / , /method and /mcp; the live MCP test passes (2026-09-30)
- [~] B3 (UI) Visual language locked: the drawing-set tokens in app/globals.css, shared with /method · done when: a page showing every component state passes the audit in light and dark · evidence: tokens exist; no states page yet
- [-] B4 (UI) Every screen and state exists · dropped: two static pages, no flows and no data states
- [v] B5 Security before launch: response headers set, no third-party script without integrity · done when: curl -I on / and /method shows the headers from the p7 guide · guide: p7-security-hardening · evidence: curl -I shows nosniff, Referrer-Policy, Permissions-Policy and CSP frame-ancestors 'none'; /method loads no third-party script (2026-09-30)

## Quality bars (each fragment's .Q item checks these; numbers live in RULES.md §Budgets, commands in RULES.md §Commands)
Delete a bar only with a one-line reason. (UI) and (native) bars go when the product has no UI or no native app.
Correctness
- The core journey passes end to end with real inputs · `npm run test:mcp` (end-to-end for agents: F6.6)
- Model-driven core: the eval set passes and no case regressed · evals command (none yet: F6.6)
- Every failure path returns a clear error; retries are safe · `npm run test:mcp`
Speed
- Every new dependency has a reason in DECISIONS.md
- (UI) No layout shift on load
- (UI) Every section looked at on phone, tablet and wide screens: grids fill their rows, nothing orphaned, clipped or overflowing
Experience
- (UI) The core job works by keyboard only and by touch only
- Errors, logs and messages say what happened and what to do next
Code
- Types clean with zero warnings · `npm run check`
- No dead code, unused exports or unused dependencies · dead code command (none yet)
- One way to do each thing; no duplicate helpers
- No commented-out code, no stray debug output, no TODO without an item id from this file
- No file over 400 lines and no function over 60 lines without a reason written beside it
Safety
- Input validated at every boundary; no secret in the repo or the bundle
Dropped: (native) frame budget, because there is no native app · (UI) empty, loading, error, offline and no-permission states, because both pages are static with no data · undo instead of confirm and state surviving reload, because nothing on the site can be changed or lost · authorization on the server, because there is no account or write action

## Changes
- 2026-09-30 · created from .offthemode/PRODUCT.md and the 2026-09-29 reassess (95 findings survived review)
- 2026-09-30 · F7.7 dropped and the dependency bar no longer asks for a size: no size limits (D-005)
- 2026-09-30 · F7.4 dropped and the load-time bar removed: no standing speed, contrast or touch-size rules (D-006)
- 2026-09-30 · after the fix run: 15 items verified with the evidence cited, 14 built but not proven; F3.4's done-when no longer asks README for paths, since README points to the site (one source)
- 2026-09-30 · F1.5 verified by the first CI run on GitHub
- 2026-09-30 · revisit: 13 items verified with the checks cited; F6.2 and F6.3 back to [x], since an on-completion fragment stays unverified until its end-to-end run; untracked: CI actions moved from v4 to v7
- 2026-09-30 · F3.5 to [x]: descriptions cut to claude.ai's 200-character limit and a build check added; the real upload waits for a personal account
- 2026-10-01 · Supersense trial recorded: F5.3 and F6.4 verified end to end; F5.5 measured at 5 replies (not met); F5.7 1 of 3; the time promise now depends on project size (D-009)
- 2026-10-02 · added F8, the view: the author asked for a page instead of chat-only views; reassess may save its report to .offthemode/REASSESS.md on the user's go
- 2026-10-02 · F8 built: F8.2, F8.5 and F8.6 verified; F8.1, F8.3 and F8.4 built, not proven (Safari, Firefox and a real reassess save still to try)
- 2026-10-02 · added F8.7 (/listview, a sixth command) and F8.8 (Chrome remembers the folder): the author found picking the folder every time outdated
- 2026-10-02 · F2.1 now counts six commands (listview), so it is back to [x] until the live MCP test passes after the deploy
- 2026-10-02 · F8.7 and F8.8 built (/listview and Chrome's remembered folder); F2.1 back to [x] until the live MCP test sees the sixth command
- 2026-10-02 · after the deploy: F2.1 and F8.7 verified by the live MCP test and a live /listview run
- 2026-10-07 · added F4.6 (the being-found guide), F4.7 (suggestions, not scripts) and F7.8 (the site follows the guide): from the author's SEO reel, checked against official sources and extended
- 2026-10-07 · F7.8 verified live; its Search Console step dropped by the author's choice (no ownership of the vercel.app address yet)
- 2026-10-07 · lasscrobits recorded (the first new-project run); F5.7 dropped and F5.5 rewritten as a quality check, not a count (D-016); F5.8 added: setup talks in plain words
- 2026-10-07 · the view: a changed item now gets a red up arrow after its sentence (tooltip and legend say "changed in the latest checklist update") instead of the red scallop cloud, which read as a warning (the author, on the lasscrobits board)
- 2026-10-07 · added F5.9: setup asks how a project ships once, in its first round, and keeps the answers as the user's usual in ~/.offthemode/ME.md on their go (D-017)
