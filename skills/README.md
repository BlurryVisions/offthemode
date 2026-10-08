# Off the Mode · skills

Generated from `content/` by `scripts/build-content.mjs`. Edit `content/`, never these files.

The 7 folders belong together: `offthemode` sets up a project and runs the others, the revisits read the guides and templates inside `offthemode/`, and `view-project/` holds the view page. Put all of them in your tool's skills folder:

- Claude Code: `.claude/skills/` in a project, or `~/.claude/skills/` for every project.
- Codex, Gemini CLI, Cursor and VS Code: `.agents/skills/` in a project, or `~/.agents/skills/` for every project.

One paste installs them for every project, and replaces any earlier Off the Mode skills, old names included, so no outdated copy stays behind. Claude Code:

```sh
curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && (mkdir -p ~/.claude/skills && cd ~/.claude/skills && rm -rf offthemode reassess revisit-checklist revisit-comments revisit-glossary revisit-state view-project listrevisit listview commentrevisit glossaryrevisit && unzip -oq /tmp/offthemode-skills.zip -x README.md)
```

Codex, Gemini CLI, Cursor and VS Code:

```sh
curl -fsSL https://offthemode.vercel.app/skills/offthemode-skills.zip -o /tmp/offthemode-skills.zip && (mkdir -p ~/.agents/skills && cd ~/.agents/skills && rm -rf offthemode reassess revisit-checklist revisit-comments revisit-glossary revisit-state view-project listrevisit listview commentrevisit glossaryrevisit && unzip -oq /tmp/offthemode-skills.zip -x README.md)
```

- `offthemode` · Set up Off the Mode
- `reassess` · Reassess Against the Core Concept
- `revisit-checklist` · Revisit Checklist
- `revisit-comments` · Revisit Comments
- `revisit-glossary` · Revisit Glossary
- `revisit-state` · Revisit State
- `view-project` · View Project

The site also offers one zip per skill, only because claude.ai takes one skill per upload. Upload all of them.

More: https://github.com/BlurryVisions/offthemode
