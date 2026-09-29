## Always-On · Prompt Library

> **Output:** the prompts that work for this project, saved as plain files in `.offthemode/prompts/`, each with a version line and a short changelog.

Prompts that worked are assets. Retyped from memory, they lose their refinements, and without versions you can't tell which edit helped. A prompt you type twice gets saved.

Save one prompt per file, as `.offthemode/prompts/<name>.md`, in plain Markdown. Any AI tool can read the same file (most let you pull a file into a prompt with `@path`). Commit the folder with the project, so every session and every teammate uses the same text. Good candidates: the templates in these guides you reach for often, tuned to your project, and prompts you wrote yourself that worked.

### Placeholders keep prompts short

`{{NAME}}` is an input you give each time: the feature, the surface, the path. `{{?NAME}}` is a fact your AI works out from the project and shows with its source, for example "check command: `npm test` (RULES.md §Commands)".

Write every project fact as `{{?NAME}}`. Then you type only what really changes, and the prompt keeps working as the project changes. The Off the Mode commands work the same way: they know nothing about your project until they read `.offthemode/`.

### Versions tell you which edit helped

Each file starts with a version line: the number, the date and why it changed. A changelog at the bottom keeps every earlier reason in one line each. When a prompt gets worse, the changelog tells you which edit to undo.

```file path=".offthemode/prompts/diverge.md"
version 4 · changed {{DATE}} · why: v3 still let the generator recommend its own favourite
3 directions for {{SURFACE}} that disagree on {{AXIS: metaphor | density | motion | navigation}}, one per reference I assign ({{REF_A}}, {{REF_B}}, {{REF_C}}). Each: name, 3-line thesis, signature moment, what it gives up, main risk. If two could merge, replace one. No code. Do not recommend; a fresh session compares them and I choose.
Changelog: v4 references assigned by me, no recommendation (a generator grading its own options picks its favourite). v3 "if two could merge, replace one". v2 "what it gives up" (v1 had no tradeoffs, so choosing was arbitrary).
```

> **Pro move:** If your tool has saved commands or skills, point them at the file instead of copying the text, so it lives in one place. In Claude Code, a command file `.claude/commands/diverge.md` holding the line `@.offthemode/prompts/diverge.md` and then `Inputs: $ARGUMENTS` makes `/diverge` run the saved prompt with whatever you type after it. A skill can also carry scripts, and loads by itself when a task matches its description.

> **Rule:** Every change to a saved prompt, and every new line in RULES.md, carries its reason. Lines without reasons pile up into contradictions, and the model tries to satisfy all of them at once. When you correct the same thing twice, it becomes one line in RULES.md with its why, not a reminder you keep retyping.
