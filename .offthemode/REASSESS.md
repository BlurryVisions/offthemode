REASSESS · 2026-10-08 · on course
The core concept is built and proven live: one source feeds the link, the skills, /method and /view byte for byte; the server stores nothing and never receives code; every tool the site names gets every command; both setup doors reach the first win; the view shows only what the notes prove. The gaps are at the edges. Command names below are the ones in use since the renames (D-023).

## Gaps that matter
1. The health check can save "on course" before its own test run: setup asks for the run, the save and the ok in one go (content/commands/offthemode.md:36). Smallest fix: run first, then show the report and save it. Note for /revisit-checklist: setup's real-input run reaches the report before it is saved
2. A second AI tool never gets its load line: /offthemode on a set-up project never checks the current tool's line (content/commands/offthemode.md:15), so a teammate in Codex works without RULES.md and STATE.md. Smallest fix: the status path offers the missing line. Note: /offthemode offers the current tool's auto-load line when it is missing
3. Fixed since by D-022: the automatic /revisit-state read git after every change, and helper agents each rewrote STATE.md over the others
4. /revisit-checklist starts whenever a feature is mentioned (its description), turning "add X" into a checklist detour, and its git window misses commits made earlier the same day (bare date). Smallest fix: run only when asked; `git log --since="<date> 00:00"`. Note: revisit-checklist runs only when asked and sees same-day commits
5. A verified [v] item is never re-checked after its code changes (revisit-checklist step 2 checks only [~] and [x]). Smallest fix: also re-check [v] items step 1 mapped a change to. Note: a verified item whose code changed is re-proven or demoted
6. The one-paste skills install is bash only and fails in Windows PowerShell (components/AddTabs.tsx:28). Smallest fix, with STATE Next 2: label it and add a PowerShell line. Note: F3.6 the skills install works on Windows
7. The site promises "A clear plan, in about ten minutes" (app/page.tsx:110); the one new-project run took 46 minutes. Smallest fix: add PRODUCT.md's caveat. Note: the new-project promise carries PRODUCT.md's caveat
8. "Short working rules for each kind of work" holds for 11 of the 20 guides §Guides routes to; tests, a new feature and mobile open 5 to 17 KB guides. Smallest fix: working rules for always-on-verification-loop, product-first-doctrine and mobile-addendum. Note: those three guides return under 2 KB by default

## Smaller, one line each
- install lines and the site's command table are kept by hand in three places, with no check between them
- /view-project's offline line for the skills has never been run
- /revisit-comments deletes TODOs that name real work
- /revisit-checklist never mentions a saved REASSESS.md
- /revisit-state never proposes PRODUCT.md updates
- automatic saves can't be undone when .offthemode/ is kept out of git
- this repo's AGENTS.md lacks the @, so sessions here never test the real load line
- app/robots.ts cites D-012, superseded by D-014
- the headline reads "averageyours" to AI readers that take the raw text
- three tool tabs are hidden at phone width
- README's first line and the GitHub description lack "Claude Code" and "Cursor"
