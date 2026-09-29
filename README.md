# Off the Mode

Left alone, every AI coding tool builds the average. **Off the Mode** makes Claude, Cursor or any AI coding tool plan first, build in the right order, and hold an elite bar.

It lives outside your project. Your project only gets one folder: `.offthemode/`.

**Website:** https://offthemode.vercel.app · **The method:** https://offthemode.vercel.app/method

## Add it (pick one)

**1. The link** (any tool that supports MCP)

```
https://offthemode.vercel.app/mcp
```

- **Claude** (desktop or claude.ai): Settings → Connectors → Add custom connector → paste the link.
- **Claude Code:** the skills (below) are the easiest route. For the link, run `claude mcp add --transport http --scope user offthemode https://offthemode.vercel.app/mcp`, then allow its tools: auto mode (the default) blocks a newly added server until you add the allow rule `mcp__offthemode` in `/permissions`.
- **Cursor, VS Code:** one-click buttons on the website.

**2. The skills** (no server)

Copy the folders in [`skills/`](skills/) into your tool's skills folder. In Claude Code: `.claude/skills/` in a project, or `~/.claude/skills/` for every project. Or download them all from the website.

## Use it

In your project, say **"set up off the mode"** (or `/offthemode`). It works for new projects and ones you've already started.

Then, whenever you want:

| Command | What it does | What it can change |
|---|---|---|
| `/offthemode` | Sets up the project, or tells you where it stands | Only `.offthemode/` |
| `/listrevisit [idea]` | Shows the checklist, or adds a new feature or idea to it | The checklist |
| `/reassess` | Checks what's built against your core concept | Nothing: it reports |
| `/commentrevisit [path]` | Cleans up code comments | Comments only |
| `/glossaryrevisit` | Refreshes a plain-words summary anyone can understand | The summary |

Your normal coding sessions stay free. Nothing forces the checklist on you.

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

## Privacy

The server only hands out instructions and templates. It never sees your code: your AI tool does all the reading and writing, on your machine. The only thing the server receives is the short note you type after a command.

## Improve it

Everything comes from one source, [`content/`](content/). Edit there, then run `npm run content` to rebuild the skills, and `npm run check` before committing.

MIT licence.
