## Always-On · Prompt Library
<!-- origin: added -->

> **Output:** canonical prompts in `~/.claude/prompts/` (global) and `prompts/` (project-tuned) with version headers and a CHANGELOG, the loop as global commands in `~/.claude/commands/`, and globals that change only through a retro.

Prompts that worked are assets. Retyped from memory, they lose their refinements, and without versions you can't tell which edit helped. A prompt typed twice becomes a **command** (invoked explicitly). It becomes a **skill** when it needs bundled scripts, or when the agent should load it by itself because a task matches the skill's description. The canonical text lives in plain Markdown, so Cursor or any other agent can @-mention the same file.

The placeholder convention is what makes global commands possible. A global command can't know your project, so every project fact in it is a `{{?NAME}}` the agent resolves from the docs and shows with its source. Only genuine inputs stay `{{NAME}}`, which is why `/slice checkout` works with one argument.

| | Command (`.claude/commands/<name>.md`) | Skill (`.claude/skills/<name>/SKILL.md`) |
|---|---|---|
| Runs when | You type `/<name>` | You type it, or the agent matches its `description` |
| Carries | One prompt | A prompt plus scripts and reference files |
| Useful frontmatter | `description`, `argument-hint`, `allowed-tools` | Those, plus `disable-model-invocation: true` (only you can trigger it), `context: fork` (run in its own subagent context), `paths` (activate only for matching files) |

Current Claude Code treats both as the same `/name`; the difference is packaging. Arguments arrive as `$ARGUMENTS`.

```file path="prompts/diverge.md"
version 4 · changed {{DATE}} · why: v3 still let the generator recommend its own favourite
3 directions for {{SURFACE}} that disagree on {{AXIS: metaphor | density | motion | navigation}}, one per anchor I assign ({{REF_A}}, {{REF_B}}, {{REF_C}}). Each: name, 3-line thesis, signature moment, what it gives up, main risk. If two could merge, replace one. No code. Do not recommend; a critic compares them in a separate call and I choose.
Changelog: v4 anchors assigned by me, no recommendation (a generator grading its own options picks its favourite). v3 "if two could merge, replace one". v2 "what it gives up" (v1 had no tradeoffs, so choosing was arbitrary).
```

```file path=".claude/commands/diverge.md"
---
description: Three divergent directions for a surface (wraps prompts/diverge.md)
argument-hint: <surface> <axis> <ref-a> <ref-b> <ref-c>
---
@prompts/diverge.md

Surface, axis and anchors: $ARGUMENTS
```

> **Rule:** Global files change only through a retro (Session End Handoff step 3, Project Retro), with every line carrying its reason. Otherwise they rot into contradictions, and the model tries to satisfy all of them at once.
