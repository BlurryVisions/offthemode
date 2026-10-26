# Off the Mode

Left alone, every AI coding tool builds the average. **Off the Mode** makes Claude, Cursor or any AI coding tool plan first, build in the right order, and hold an elite bar.

It lives outside your project. Your project gets the `.offthemode/` folder, plus one line you approve so your tool loads it.

**Website:** https://offthemode.vercel.app · **The method:** https://offthemode.vercel.app/method

## Add it

Pick your tool on the website: https://offthemode.vercel.app/#add. It has the steps for Claude, Claude Code, Cursor, VS Code, Codex and any other tool that supports MCP. There are two ways in:

- **The link** (the MCP server): add it once, and updates arrive on their own.
- **The skills** (no server): seven folders, the same as [`skills/`](skills/), installed on your machine with one paste in a terminal. Install all seven together; setup hands over to the others.

## Use it

In your project, say **"set up off the mode"** (or `/offthemode`). It works for new projects and ones you've already started.

Then, whenever you want:

| Command | What it does | What it can change |
|---|---|---|
| `/offthemode` | Sets up the project, or tells you where it stands | The `.offthemode/` folder, plus one line you approve so your tool loads it; if you say yes, your usual setup in `~/.offthemode/ME.md` |
| `/revisit-checklist [idea]` | Shows the checklist, or adds a new feature or idea to it | The checklist |
| `/view-project` | Opens your project as a page in your browser | Nothing in your project: one temporary page |
| `/revisit-state` | Saves where things stand, so a fresh session picks up from here; your AI also runs it on its own after changing files | Where things stand, and new decisions |
| `/reassess` | Checks what's built against your core concept | Only its own report, if you say so |
| `/revisit-comments [path]` | Cleans up code comments | Comments only |
| `/revisit-glossary` | Refreshes a plain-words summary anyone can understand | The summary |

Your normal coding sessions stay free. Nothing forces the checklist on you.

See it as a page: /view-project, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).

## What goes into your project

```
.offthemode/
  PRODUCT.md     the vision and the core concept
  RULES.md       the standards every change is held to
  CHECKLIST.md   the core, split into pieces, with what's done
  GLOSSARY.md    a plain summary for people, and the words the code uses
  STATE.md       where things stand right now
  DECISIONS.md   what was decided, and why
```

When a guide calls for another document, it goes in `.offthemode/` too. Outside it, setup adds one line that makes your tool load the rules (in CLAUDE.md, AGENTS.md or your tool's rules file), and only after you approve it. If you say yes, it also keeps your usual setup in `~/.offthemode/ME.md`, in your home folder, outside every project. If a line in your own rule files is out of date or conflicts, it shows you the fix and changes it only after you approve that too.

## Privacy

The server only hands out instructions and templates. It never sees your code: your AI tool does all the reading and writing, on your machine. The only thing the server receives is the short note you type after a command.

## Improve it

Everything comes from one source, [`content/`](content/). Edit there, then run `npm run content` to rebuild the skills, and `npm run check` before committing. After a change to the site's colors, you can run `npm run audit`: it checks the color contrast of both pages, in light and dark, against WCAG AA. It is optional and not part of `npm run check`.

### Test a change on a real ask first

`npm run eval -- <case>` replays real asks through plain Claude Code and through Off the Mode, each in its own copy of the project, twice per side by default. Then it scores and measures both and writes a short `report.md`, most trustworthy first:

1. Scripted scores: the case's own scorer and the project's check. The same code always gets the same number.
2. The owner's hurdles, counted in each side's session file: turns that ended asking the owner, asks to start, commit or push, Off the Mode's internal ids in replies, characters read per turn, and steps the owner must do by hand. The patterns are written out in [`scripts/eval/hurdles.mjs`](scripts/eval/hurdles.mjs).
3. Cost: tokens read, agents, time.
4. Three blind judges who don't know which is which. They are the noisy part: the same diff can score 1 to 3 points apart, so they come last.

Every number is shown per run with its spread. A difference smaller than the spread between one side's own runs is not a result. `--runs N` sets the number of runs (default 2).

- A case is a folder outside this repo, because it holds a real person's words and data: `~/.offthemode/evals/<name>/case.json` (or set `OTM_EVAL_CASES`). It names the project, the commit the ask was made at, the ask, the person's logged replies, and the check. To replay a stretch of real work, `asks` lists several asks in order, each with its own replies; each goes in once the turn before has ended. Every field is listed in [`scripts/eval/case.mjs`](scripts/eval/case.mjs).
- Each copy holds the project as it stood at that commit, as one commit with no history: neither side sees how the real build turned out, and the plain side sees no trace of Off the Mode. A link that leads out of a copy stops the run (a link back into the project itself, like `node_modules/node_modules`, is pointed into the copy). Copies go to `~/work-copies/` (or set `OTM_EVAL_COPIES`), each alone in a folder with a random name. Reports go to `~/offthemode-evals/` (or set `OTM_EVAL_WORK`).
- Each side, and each judge, runs inside a macOS sandbox ([`scripts/eval/sandbox.mjs`](scripts/eval/sandbox.mjs)). It can't read the real project, the cases, the reports, the other copies, Claude Code's records of other sessions, this repo or the desktop app's folder, and that holds for shell commands and everything they start. Before any token is spent, a probe tries `cat`, `git -C`, `find` and `python` on each of those places (all must fail) and on the side's own copy (all must work); the run stops if the sandbox doesn't hold. `npm run test:eval` runs the same probe on a small made-up project. The eval runs on a Mac only for now.
- Try it on the smoke case first: `npm run eval -- --make-smoke`, then `npm run eval -- smoke`. Its two runs per side cost under 1M tokens.
- `--prepare` makes the copies, proves the sandbox and runs the check and the scorer at the start, for free. A real case costs one real build per side per run, 40 to 350 million tokens each, so two runs cost four builds.
- `npm run eval -- --measure <session .jsonl>` shows where any Claude Code session's tokens went, per agent, workflow and turn, and the owner's hurdles per turn.

MIT licence.
