STATE · updated 2026-10-08 · under 40 lines · present tense, kept current as the work happens, saved in full by /revisit-state

## Now
Live at https://offthemode.vercel.app (MCP at /mcp, method at /method, the view at /view), repo public at https://github.com/BlurryVisions/offthemode; a push to main deploys (RULES.md §Shipping). Seven commands, the newest /revisit-state (D-020, D-021): the AI runs it on its own after a reply that changes a file or settles a decision, the user can type it, and it never writes the same thing twice. 31 guides, including Always-On · Being Found. Setup asks how a project ships in its first round and keeps the user's usual in ~/.offthemode/ME.md on their go (D-017). The view marks a changed item with a red up arrow. The site follows its own Being Found guide: robots.txt (training crawlers blocked, D-014), sitemap, share image, and Google Search Console verified by the author on 2026-10-07. Built here, not yet committed or deployed: the renames (D-023: /revisit-checklist, /view-project, /revisit-comments, /revisit-glossary) and the once-per-reply automatic save that skips git and says so in one line (D-022); the live site still has the old names. The reassess of 2026-10-08 is saved in REASSESS.md: on course, 8 gaps that matter, not yet on the checklist. Checklist 34/64 verified (F2.1 waits for the live test after the deploy). Last commit 53533ed.

## Next (item 1 is where the next session starts; agreed with the author 2026-10-07, in this order)
1. Prove /revisit-state in a real session (F6.7): done when one typed run changes only STATE.md and DECISIONS.md (git status), a second run right after changes nothing, a reply that changes several files ends with one unasked run, no git call and one line saying STATE.md was updated, and a helper agent changes no .offthemode/ file
2. Updating cleanly: the skills install clears the old Off the Mode folders first (now also the old-named skill folders the renames leave behind) (0126e4c renumbered guides, and unzip -o leaves the old copies); /offthemode on a set-up project also offers template lines whose wording changed, not only missing ones
3. Update notice, no new command: a project remembers which Off the Mode version set it up; the AI says when Off the Mode is newer (the link: at session start; the skills: when a command runs, by reading the site's version date)
4. /revisit-checklist ends with one reminder line when the plain summary is older than a newly finished item (D-018); then refresh this repo's summary, last revisited 2026-09-30
5. A scripted dry run, kept as npm run eval (CHECKLIST F6.6): a chat with no file access (F5.2) and a product with no web UI (F5.6)
6. Make setup's messages plain enough that nobody has to ask what they mean (F5.8, from the lasscrobits run)
7. Generate the method's "Load the Rules" prompt from content/server/instructions.md (F1.4): done when a grep finds one wording of the standing rule

## In flight
- D-022 and D-023: built, npm run check, build, test:mcp, test:view and test:view-project pass locally, reviewed and fixed; not committed (.claude/launch.json, a local preview config, stays out of git)

## Unverified
- the view in Safari and Firefox, a real folder dialog, drag and drop, and Chrome's real "Reopen" prompt (F8.1, F8.8)
- reassess saving REASSESS.md in a real run (F8.4)
- setup's no-file-access and no-UI paths, and the shipping step after its fixes (F5.2, F5.6, F5.9): only a dry run proves them
- /revisit-state in a real session, typed, twice in a row, and on its own (F6.7)
- a project set up before 2026-10-08 working with the new names, through the link's mapping and /offthemode's offer
- the link's reworded command header (lib/content.ts: "requested by the user or by the project's RULES.md", "acting only on their go, as the text below says") in Claude Code auto mode without the allow rule: one tool call
- claude.ai accepting each per-skill zip (F3.5): skipped while the author's claude.ai is an org account

## Waiting on me · known broken · do not touch
- The author: submit sitemap.xml in Search Console if not done yet; optional Bing import. Run /offthemode once in lasscrobits, Supersense and mlix so they pick up the Shipping section (and, where missing, "Found by" and the suggestions rule); it now also offers to change old command names; best after Next 2.
- The offthemode command is at 8293 of the MCP test's 9000-character guard (D-023): raise the guard (D-015) rather than cut a rule when it next grows.
- next dev writes a Next.js block into AGENTS.md: commit it when it appears (the author said ok, 2026-10-07).
- In Claude Code auto mode, the MCP tools need the allow rule mcp__offthemode; the skills need none.
- The code calls a guide Sheet (lib/content.ts); people read "guide". Rename when that code is next touched (GLOSSARY.md §Terms).

## Corrections seen once (date · what)
- 2026-09-30 · explain what a technical rule is for, in everyday words, before asking for a decision on it
- 2026-10-07 · say exactly which steps finished and which didn't after an interruption; never "done" while a step is pending
- 2026-10-07 · one explanation that never contradicts itself, with a concrete example, not two framings of the same thing
- 2026-10-07 · finish what was agreed before raising anything new; a new idea goes to the end of Next, not into the current work
