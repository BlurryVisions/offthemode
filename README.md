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
| `/listrevisit [idea]` | Shows the checklist, or adds a new feature or idea to it | The checklist |
| `/listview` | Opens your project as a page in your browser | Nothing in your project: one temporary page |
| `/revisit-state` | Saves where things stand, so a fresh session picks up from here; your AI also runs it on its own after changing files | Where things stand, and new decisions |
| `/reassess` | Checks what's built against your core concept | Only its own report, if you say so |
| `/commentrevisit [path]` | Cleans up code comments | Comments only |
| `/glossaryrevisit` | Refreshes a plain-words summary anyone can understand | The summary |

Your normal coding sessions stay free. Nothing forces the checklist on you.

See it as a page: /listview, or https://offthemode.vercel.app/view (open the .offthemode folder; nothing is uploaded).

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

MIT licence.
