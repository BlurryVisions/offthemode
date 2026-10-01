## How to add it

Off the Mode comes from one public repo, https://github.com/BlurryVisions/offthemode, in three forms: this website, a hosted MCP server, and a skills pack. MCP (Model Context Protocol) is the standard way AI tools connect to outside tools. Paste one link into your AI tool and it gets the five commands, the guides and the file templates. Or install the skills pack, and the same commands, guides and templates live as files on your machine, with no server.

This guide is the one source for the install steps; the website and the README follow it.

### Add it to your AI tool

The link is https://offthemode.vercel.app/mcp. Pick the way that matches your tool.

#### Claude desktop app or claude.ai

1. Open Settings, then Connectors.
2. Choose Add custom connector and name it Off the Mode.
3. Paste `https://offthemode.vercel.app/mcp` and add it.

On Team and Enterprise plans only admins can add connectors, so ask yours to add it for the organization.

Then say "set up off the mode" in a Claude session that can open your project folder, because setup reads the project and writes its files there. In a chat without your files, it drafts each file in the chat for you to save. For a codebase, Claude Code is the better fit (the next section).

#### Claude Code

The easiest way is the skills. This one line, pasted into a terminal, installs all five for every project:

```bash
curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ~/.claude/skills
```

The skills are files on your machine, so they work in auto mode, Claude Code's default, with no extra step. The commands are then `/offthemode`, `/listrevisit`, `/reassess`, `/commentrevisit` and `/glossaryrevisit`.

Or use the link. Run this once; `--scope user` makes it available in every project on your machine:

```bash
claude mcp add --transport http --scope user offthemode https://offthemode.vercel.app/mcp
```

In auto mode, the safety check blocks tools from a server you just added until you allow them. Type `/permissions` and add the allow rule `mcp__offthemode`, or switch the session to Manual mode once and approve the tool when it asks. Run `claude mcp list` to check that `offthemode` shows as connected. The commands appear as `/mcp__offthemode__offthemode`, `/mcp__offthemode__listrevisit` and so on.

#### Cursor and VS Code

Use the one-click buttons for Cursor and VS Code on https://offthemode.vercel.app. Your editor opens with the server filled in; approve it when asked.

To add it by hand in Cursor, put this in `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` for every project:

```json
{ "mcpServers": { "offthemode": { "url": "https://offthemode.vercel.app/mcp" } } }
```

In VS Code (GitHub Copilot's chat), put this in `.vscode/mcp.json` in the project. Using the Claude Code extension inside VS Code? Follow the Claude Code steps instead.

```json
{ "servers": { "offthemode": { "type": "http", "url": "https://offthemode.vercel.app/mcp" } } }
```

#### Codex

Run this once, then restart Codex:

```bash
codex mcp add offthemode --url https://offthemode.vercel.app/mcp
```

Or add the server to `~/.codex/config.toml` by hand:

```toml
[mcp_servers.offthemode]
url = "https://offthemode.vercel.app/mcp"
```

#### Any other MCP tool

Windsurf, Zed, Cline and other tools that speak MCP over HTTP: add a remote server (often labelled HTTP or streamable HTTP) named `offthemode`, with the link as its URL.

#### Skills pack

The skills are the same commands, guides and templates as plain files, so nothing is fetched while you work. All five belong together: setup follows the listrevisit and reassess instructions, and the guides live in the offthemode skill. Put the folders where your tool loads skills:

| Tool | For one project | For every project |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex, Gemini CLI, Cursor, VS Code | `.agents/skills/` | `~/.agents/skills/` |

For Claude Code, the one line above installs them. For the other tools, use this line. It makes the folder first, because unzip creates only the last folder of the path:

```bash
mkdir -p ~/.agents/skills && curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ~/.agents/skills
```

You can also download the zip from the website, or copy the folders from `skills/` in the repo. The Claude app (desktop or claude.ai) takes one skill per upload, which is the only reason each skill also has its own zip on the website: upload all five.

| | The link (MCP) | The skills |
|---|---|---|
| Setup | Paste one link | One line in a terminal, or put the folders in place |
| Guides and templates | From the `get_method` and `get_template` tools | From the offthemode skill's `method/` folder and each skill's `templates/` folder |
| Updates | Arrive as they are published | Install again |
| Command names in Claude Code | `/mcp__offthemode__<command>` | `/<command>` |

Either way, you can type a command or just say it: "set up off the mode", "reassess the project".

### Where the guides come from

Each guide has one name, the one RULES.md §Guides uses, such as `p3-visual-language`.

- **Through the link:** your AI calls the `get_method` tool with the guide's name. For a phase guide it returns the working rules and a pointer to the rest; adding `full: true` returns the whole guide. Guides with no working rules always come back whole.
- **With the skills:** the guides are files in the offthemode skill's `method/` folder, inside the skills folder above (for example `~/.claude/skills/offthemode/method/` or `~/.agents/skills/offthemode/method/`). `method/INDEX.md` lists them; `method/10-p3-visual-language.md` is a whole guide, and `method/rules/10-p3-visual-language.md` its working rules.

For work inside an existing product, the working rules are enough. The whole guide is for starting that phase or changing its structure.

### Set up a project

Open the project in your AI tool and say "set up off the mode". Setup talks first: it looks at the folder, tells you which door it is taking and why, lists exactly what it will create, and waits for your go.

- **New project** (an empty folder, or just an idea). It asks about the product before anything else: what it is, who it's for, the job they need done, the moment they first get value, what it refuses to be, how it should feel. From your answers it writes the files.
- **Existing project.** It reads the code first: the stack, the commands, the screens and flows that exist. It drafts PRODUCT.md from what the code shows, writes each guess as a hypothesis ("I think the main user is X, because Y") and confirms it with you. RULES.md gets your real stack and commands, and CHECKLIST.md sets what exists against what the core concept needs.

Setup changes no code. It writes the `.offthemode/` folder, plus one line you approve so your tool loads it. The project's own rule files stay where they are: setup adds that one line, and changes another line only when you approve the fix, for a conflict or an out-of-date fact. The folder starts with six core files:

| File | What it holds |
|---|---|
| PRODUCT.md | Vision, core concept, person, job, moment of value, refusals, feeling, experience promises |
| RULES.md | The standards every change is held to, the map from each kind of work to its guide, budgets and the project's commands |
| CHECKLIST.md | The core concept split into fragments, each marked to verify early or on completion; each item has a done-when, a guide and its evidence |
| GLOSSARY.md | A plain-words summary for people, then the Terms the code and copy use |
| STATE.md | Where things stand now, rewritten when a piece of work ends |
| DECISIONS.md | Every decision, appended, never rewritten |

#### Optional files

A guide adds one of these to `.offthemode/` only when its work needs it, on your go. Setup creates none of them, and a small project may never need any. Each one's shape is defined in its guide, most as a file block to copy.

| File or folder | Guide | Written when |
|---|---|---|
| `SKELETON.md` | P1 · Vision & Skeleton | The project has several screens or routes, stored data, more than one kind of user, or outside services |
| `RISKS.md` | P1 · Vision & Skeleton, P2 · Core Spike | A person, job or moment is still a hypothesis, or the pre-mortem finds a risk worth testing |
| `experts/` | Expertise Injection | A domain is hard enough that the average answer would hurt the product |
| `DESIGN.md`, `design/` | P3 · Visual Language | The product has a UI; `design/` holds your taste, references, directions and rubric anchors |
| `ARCHITECTURE.md` | P4 · Backend & Infra | The product has a backend, stored data or hosting to describe |
| `ROUTES.md` | P5 · Navigation & Flows | The product has routes or screens |
| `COMPLEXITY.md` | Taming Complexity | Surfaces start to grow |
| `SECURITY.md` | P7 · Security Hardening | The first work on login, permissions, input, uploads, secrets, payments or AI features |
| `RUNBOOK.md` | P8 · Ship & Operate | Before launch: rollback, flag kill, secret rotation, restore |
| `VOICE.md` | Always-On · Words & Voice | The product has words people read |
| `TRACKING.md` | Always-On · Instrumentation | The product gets analytics events |
| `prompts/` | Always-On · Prompt Library | A prompt gets typed a second time |

Code a guide calls for, such as design tokens, scripts and tests, is ordinary project code: it lives where code belongs and is written on your go. Screenshots go to `shots/`, which stays out of git.

Say "set up off the mode" again on a project that is already set up and you get its status: where things stand, and what's next on the checklist.

> **Pro move:** Commit `.offthemode/` with your code. Every teammate and every AI session, in any tool, then works from the same product, rules and state.

> **Pro move:** A small project still gets all six core files, just short. Twenty lines of PRODUCT.md is enough for a weekend build. Scaling down means shorter files, not skipped thinking.

### Make the rules load every session

Your AI reads `.offthemode/RULES.md` and `.offthemode/STATE.md` at the start of every session. Setup wires this into the file your tool already loads on its own (for example CLAUDE.md in Claude Code, AGENTS.md in Codex, a project rule in Cursor; P0 · Constitution lists the file for each tool) and shows you the exact line before adding it. Through the link, the MCP server also repeats it as a standing instruction.

Check it: open a fresh session and ask "where do things stand?". The answer should come from STATE.md without you pointing at it. If it doesn't, add the prompt below to your tool's auto-load file, or paste it at the start of a session.

```prompt title="Load the Rules"
Before any work in this project, read .offthemode/RULES.md and .offthemode/STATE.md, and hold every change to RULES.md. Before planning or doing a kind of work, open the guide RULES.md §Guides maps it to, once per session: its working rules for a change inside what exists, the whole guide when you start that phase or change its structure.
```

> **Rule:** One `.offthemode/` folder serves every tool. Switch tools, or use two at once, and both read the same files. Never keep a separate copy per tool.

### Remove it

1. Remove the auto-load line setup added to your tool's instructions file.
2. Remove the connection: in Claude, Settings, then Connectors; in Claude Code, `claude mcp remove --scope user offthemode`; in Codex, the `[mcp_servers.offthemode]` block in `~/.codex/config.toml`; in Cursor, VS Code and other tools, their MCP settings; for the skills, delete the five folders.
3. Delete `.offthemode/`, or keep it. It is plain Markdown about your product, and it stays useful without any tool.

Code that was written along the way, such as tokens, scripts and tests, is ordinary project code. Keep it or remove it as you would any other.
