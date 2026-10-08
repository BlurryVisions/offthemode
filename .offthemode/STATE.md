STATE · updated 2026-10-08 · under 40 lines · present tense, kept current as the work happens, saved in full by /revisit-state

## Now
Live at https://offthemode.vercel.app (MCP at /mcp, method at /method, the view at /view), repo public at https://github.com/BlurryVisions/offthemode; a push to main deploys (RULES.md §Shipping). Seven commands, the newest /revisit-state (D-020, D-021): the AI runs it on its own after a reply that changes a file or settles a decision, the user can type it, and it never writes the same thing twice. 31 guides, including Always-On · Being Found. Setup asks how a project ships in its first round and keeps the user's usual in ~/.offthemode/ME.md on their go (D-017). The view marks a changed item with a red up arrow. The site follows its own Being Found guide: robots.txt (training crawlers blocked, D-014), sitemap, share image, and Google Search Console verified by the author on 2026-10-07. The four commands are renamed (D-023: /revisit-checklist, /view-project, /revisit-comments, /revisit-glossary), and the automatic save runs once per reply, skips git and ends with "STATE.md updated" when it changed something (D-022, D-024). The reassess of 2026-10-08 is saved in REASSESS.md: on course, 8 gaps that matter, not yet on the checklist. Ask to decide, never to start (D-025, from the 2026-10-08 review of 24 hours of sessions in the other projects): the AI asks only what the owner alone can settle and the one-way doors, in one numbered round with why and its pick; the answers are the consent; a read-back of up to three lines ends "Any doubt, say it; I'm starting." and the work starts in that reply; nothing finished waits. §Shipping's Reaches picks the push: only me, straight to the live branch; other people (this repo), one branch per request, merged into main when done. "Go" is gone from every command, guide and page. Checklist 35/64 verified.

## Next (item 1 is where the next session starts; 1-7 agreed with the author 2026-10-07, in this order; 8-9 added 2026-10-08)
1. Prove /revisit-state in a real session (F6.7): done when one typed run changes only STATE.md and DECISIONS.md (git status), a second run right after changes nothing, a reply that changes several files ends with one unasked run, no git call and one line saying STATE.md was updated, and a helper agent changes no .offthemode/ file
2. Updating cleanly: the skills install clears the old Off the Mode folders first (now also the old-named skill folders the renames leave behind) (0126e4c renumbered guides, and unzip -o leaves the old copies); /offthemode on a set-up project also offers template lines whose wording changed, not only missing ones (now D-025's lines, so projects set up earlier stop asking for a go)
3. Update notice, no new command: a project remembers which Off the Mode version set it up; the AI says when Off the Mode is newer (the link: at session start; the skills: when a command runs, by reading the site's version date)
4. /revisit-checklist ends with one reminder line when the plain summary is older than a newly finished item (D-018); then refresh this repo's summary, last revisited 2026-09-30
5. A scripted dry run, kept as npm run eval (CHECKLIST F6.6): a chat with no file access (F5.2) and a product with no web UI (F5.6)
6. Make setup's messages plain enough that nobody has to ask what they mean (F5.8, from the lasscrobits run)
7. Generate the method's "Load the Rules" prompt from content/server/instructions.md (F1.4): done when a grep finds one wording of the standing rule
8. Prove D-025 in a real session, best with item 1 in lasscrobits: done when answers start the work with a read-back, no reply asks to start, commit or push, finished work goes live in the same reply, and Claude Code's auto mode lets the push through
9. The rest of the 2026-10-08 log review: suggest a fresh chat at each natural end with the exact first message to type; size the security and infrastructure guides to who the product reaches (a one-person tool gets a short SECURITY.md); STATE.md carries unpushed work, a go not yet used and real dates, never "tomorrow"; a suggestion is made once, then parked in Waiting on me; "it can't work" needs the same proof as "done"

## In flight
- nothing pending in git; .claude/launch.json, a local preview config, stays out of git

## Unverified
- the view in Safari and Firefox, a real folder dialog, drag and drop, and Chrome's real "Reopen" prompt (F8.1, F8.8)
- reassess saving REASSESS.md in a real run (F8.4)
- setup's no-file-access and no-UI paths, and the shipping step after its fixes (F5.2, F5.6, F5.9): only a dry run proves them
- a project set up before 2026-10-08 working with the new names, through the link's mapping and /offthemode's offer
- the link's command header (lib/content.ts: "requested by the user or by the project's RULES.md", "as the text below says") in Claude Code auto mode without the allow rule: one tool call
- /revisit-state in a real session, typed, twice in a row, and on its own (F6.7); D-025 in a real session (Next 8); the live MCP test after D-025's merge into main
- claude.ai accepting each per-skill zip (F3.5): skipped while the author's claude.ai is an org account

## Waiting on me · known broken · do not touch
- The author: submit sitemap.xml in Search Console if not done yet; optional Bing import. Run /offthemode once in lasscrobits, Supersense and mlix so they pick up the Shipping section (and, where missing, "Found by" and the suggestions rule); their old command names were already changed (2026-10-08, not committed there); until then they still ask for a go; best after Next 2.
- Proposed line for RULES.md §Project specifics, from a correction given twice (2026-09-30, 2026-10-08 "did not understand both the questions at all"): "Every question to me says in everyday words what it decides, with one concrete example, because I answer only what I understand."
- next dev writes a Next.js block into AGENTS.md: commit it when it appears (the author said ok, 2026-10-07).
- In Claude Code auto mode, the MCP tools need the allow rule mcp__offthemode; the skills need none.
- The code calls a guide Sheet (lib/content.ts); people read "guide". Rename it as its own change, keeping get_method's public "sheet" argument working (GLOSSARY.md §Terms).

## Corrections seen once (date · what)
- 2026-10-07 · say exactly which steps finished and which didn't after an interruption; never "done" while a step is pending
- 2026-10-07 · one explanation that never contradicts itself, with a concrete example, not two framings of the same thing
- 2026-10-07 · finish what was agreed before raising anything new; a new idea goes to the end of Next, not into the current work
- 2026-10-08 · a fix that only rewords the problem is no fix: find the mechanism behind it and think it through before proposing
