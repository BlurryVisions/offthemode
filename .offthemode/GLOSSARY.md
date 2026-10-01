GLOSSARY · two parts: a plain summary of the project for people (kept by /glossaryrevisit, under 300 words), then the term list the code and copy use (a term earns a row only if it could be named two ways and the mix-up would cost something).

## In plain words
Last revisited: 2026-09-30. For anyone: a new teammate, an investor, your family. No technical words.
- What it is: Off the Mode is a set of instructions for the AI helpers people use to build software. Left alone, those helpers build whatever is most common. Off the Mode makes them plan first, build in a sensible order and hold a high bar.
- Who it's for: people building apps and websites with an AI helper, when they start a project or pick one up again.
- The problem: the AI's work looks like everyone else's, and it skips the planning, so projects drift from what their maker wanted.
- What it does:
  - turns your idea into a clear plan
  - splits the heart of the idea into pieces to build one by one, kept as a checklist
  - for a project already under way, says in plain words what it thinks the project is and where it stands
  - checks the work again whenever you ask
- Where we are: working today, you add it to your AI helper with one link or one download and use its five commands; the website is live. Coming next: timing setup with more builders, and an automatic test of the instructions.
- What we're trying to achieve: work built with AI that stands out instead of looking average.
- Words you'll hear: the link: a web address your AI helper fetches the instructions from · the skills: the same instructions as files on your computer · command: something you say to it, like "set up off the mode" · core concept: the one idea everything else serves · guide: the advice for one kind of work, such as design

## Terms
One word per concept, used the same way in code, UI and copy.
| Term | Never call it | In code | In UI |
|---|---|---|---|
| guide | sheet (in anything people read), doc, chapter | `Sheet`, `sheets` in lib/content.ts (a follow-up renames them to guide) | guide |
| working rules | summary, short version | `rules` on a sheet; `<!-- offthemode:rules -->` in content/method/BLUEPRINT.md | working rules |
| command | prompt, tool (for the idea itself) | `Command`, content/commands/*.md | /offthemode, /listrevisit and the rest |
| the link | the API, the endpoint | `MCP_URL`, app/mcp/route.ts | the link |
| the skills | skills pack, plugin | skills/, public/skills/*.zip | the skills |
| fragment | feature, module, epic | F1 to F7 in .offthemode/CHECKLIST.md | piece |
| door | mode, path, flow | "Pick the door" in content/commands/offthemode.md | new project, existing project |
| core concept | core idea, main feature | PRODUCT.md §Core concept | core concept |
