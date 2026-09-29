## How to add it

Off the Mode comes from one public repo, https://github.com/BlurryVisions/offthemode, in three forms: this website, a hosted MCP server, and a skills pack. MCP (Model Context Protocol) is the standard way AI tools connect to outside tools. Paste one link into your AI tool and it gets the five commands, the guides and the file templates.

### Add it to your AI tool

The link is https://offthemode.vercel.app/mcp. Pick the way that matches your tool.

#### Claude desktop app or claude.ai

1. Open Settings, then Connectors.
2. Choose Add custom connector.
3. Paste `https://offthemode.vercel.app/mcp` and add it.

On Team and Enterprise plans only admins can add connectors, so ask yours to add it for the organization.

#### Claude Code

```bash
claude mcp add --transport http --scope user offthemode https://offthemode.vercel.app/mcp
```

In auto mode, Claude Code's default, the safety check blocks tools from a server you just added until you allow them. Type `/permissions` and add the allow rule `mcp__offthemode`, or switch the session to Manual mode once and approve the tool when it asks. The skills avoid this step: they are files on your machine, so they work in auto mode as they are.

`--scope user` makes it available in every project on your machine. Run `claude mcp list` to check that `offthemode` shows as connected. The commands appear as `/mcp__offthemode__offthemode`, `/mcp__offthemode__listrevisit` and so on.

#### Cursor and VS Code

Use the one-click buttons for Cursor and VS Code on https://offthemode.vercel.app. Your editor opens with the server filled in; approve it when asked.

#### Any other MCP tool

Windsurf, Codex and other tools that speak MCP: add a remote server (often labelled HTTP or streamable HTTP) named `offthemode`, with the link as its URL.

#### Skills pack

Download the skills from the website or the GitHub repo, and put the folders in your tool's skills folder. In Claude Code that is `.claude/skills/` inside a project (that project only) or `~/.claude/skills/` (every project). The skills carry the guides in `method/` and the file templates in `templates/`, so nothing is fetched while you work. The commands are then `/offthemode`, `/listrevisit`, `/reassess`, `/commentrevisit` and `/glossaryrevisit`.

| | The link (MCP) | The skills |
|---|---|---|
| Setup | Paste one link | Download folders, put them in place |
| Guides and templates | From the `get_method` and `get_template` tools | From the skill's `method/` and `templates/` folders |
| Updates | Arrive as they are published | Download again |
| Command names in Claude Code | `/mcp__offthemode__<command>` | `/<command>` |

Either way, you can type a command or just say it: "set up off the mode", "reassess the project".

### Set up a project

Open the project in your AI tool and say "set up off the mode". Setup talks first: it looks at the folder, tells you which door it is taking and why, lists exactly what it will create, and waits for your go.

- **New project** (an empty folder, or just an idea). It asks about the product before anything else: what it is, who it's for, the job they need done, the moment they first get value, what it refuses to be, how it should feel. From your answers it writes the files.
- **Existing project.** It reads the code first: the stack, the commands, the screens and flows that exist. It drafts PRODUCT.md from what the code shows, writes each guess as a hypothesis ("I think the main user is X, because Y") and confirms it with you. RULES.md gets your real stack and commands, and CHECKLIST.md sets what exists against what the core concept needs.

Setup changes no code. Apart from the line that makes the rules load every session, it writes only inside one folder, `.offthemode/`:

| File | What it holds |
|---|---|
| PRODUCT.md | Vision, core concept, person, job, moment of value, refusals, feeling, experience promises |
| RULES.md | The standards every change is held to, the map from each kind of work to its guide, budgets and the project's commands |
| CHECKLIST.md | The core concept split into fragments, each marked to verify early or on completion; each item has a done-when, a guide and its evidence |
| GLOSSARY.md | A plain-words summary for people, then the Terms the code and copy use |
| STATE.md | Where things stand now, rewritten when a piece of work ends |
| DECISIONS.md | Every decision, appended, never rewritten |

When a guide calls for an extra document (SKELETON.md, DESIGN.md, ROUTES.md, SECURITY.md and others), it goes in `.offthemode/` too. Code files, such as design tokens, scripts and tests, live in the project where code belongs.

Say "set up off the mode" again on a project that is already set up and you get its status: where things stand, and what's next on the checklist.

> **Pro move:** Commit `.offthemode/` with your code. Every teammate and every AI session, in any tool, then works from the same product, rules and state.

> **Pro move:** A small project still gets all six files, just short. Twenty lines of PRODUCT.md is enough for a weekend build. Scaling down means shorter files, not skipped thinking.

### Make the rules load every session

Your AI reads `.offthemode/RULES.md` and `.offthemode/STATE.md` at the start of every session. Setup wires this into the file your tool already loads on its own (for example CLAUDE.md in Claude Code, AGENTS.md in Codex, a project rule in Cursor) and shows you the exact lines before adding them. Through the link, the MCP server also repeats it as a standing instruction.

Check it: open a fresh session and ask "where do things stand?". The answer should come from STATE.md without you pointing at it. If it doesn't, add the prompt below to your tool's auto-load file, or paste it at the start of a session.

```prompt title="Load the Rules"
Before any work in this project, read .offthemode/RULES.md and .offthemode/STATE.md, and hold every change to RULES.md. Before planning or doing a kind of work, open the guide RULES.md §Guides maps it to, once per session.
```

> **Rule:** One `.offthemode/` folder serves every tool. Switch tools, or use two at once, and both read the same files. Never keep a separate copy per tool.

### Remove it

1. Remove the auto-load line setup added to your tool's instructions file.
2. Remove the connection: in Claude, Settings, then Connectors; in Claude Code, `claude mcp remove --scope user offthemode`; in Cursor, VS Code and other tools, their MCP settings; for the skills, delete the folders.
3. Delete `.offthemode/`, or keep it. It is plain Markdown about your product, and it stays useful without any tool.

Code that was written along the way, such as tokens, scripts and tests, is ordinary project code. Keep it or remove it as you would any other.
