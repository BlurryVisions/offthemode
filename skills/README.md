# Off the Mode · skills

Generated from `content/` by `scripts/build-content.mjs`. Edit `content/`, never these files.

The 5 folders belong together: `offthemode` sets up a project and runs the others, and the others read the guides and templates inside `offthemode/`. Put all of them in your tool's skills folder:

- Claude Code: `.claude/skills/` in a project, or `~/.claude/skills/` for every project.
- Codex, Gemini CLI, Cursor and VS Code: `.agents/skills/` in a project, or `~/.agents/skills/` for every project.

One paste installs them for every project. Claude Code:

```sh
curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ~/.claude/skills
```

Codex, Gemini CLI, Cursor and VS Code (unzip makes only the last folder, so `mkdir -p` makes `~/.agents` first):

```sh
mkdir -p ~/.agents/skills && curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && unzip -o /tmp/offthemode-skills.zip -x README.md -d ~/.agents/skills
```

- `commentrevisit` · Comment Revisit
- `glossaryrevisit` · Glossary Revisit
- `listrevisit` · List Revisit
- `offthemode` · Set up Off the Mode
- `reassess` · Reassess Against the Core Concept

The site also offers one zip per skill, only because claude.ai takes one skill per upload. Upload all of them.

More: https://github.com/BlurryVisions/offthemode
