## The daily loop

Normal sessions stay free-form. You say what you want in plain words; the files in `.offthemode/` keep the standard and the memory, so you don't have to.

### A normal session

1. **Open a session.** Your AI loads `.offthemode/RULES.md` and `.offthemode/STATE.md`, so it knows the standards and where things stand. If its first answer doesn't know, see How to add it.
2. **Say what you want.** One concern at a time: a feature, a fix, a screen.
3. **It opens the guide.** RULES.md §Guides maps each kind of work to a guide; your AI opens the matching one before planning, once per session. For a change inside what exists, the guide's working rules are enough.
4. **It talks first.** It says what it understood, what it will change and what it isn't sure of, as hypotheses ("I think X, because Y"), and confirms each one before building on it. A small fix (a typo, a one-line change) gets one line and goes ahead; anything bigger waits for your go, with a real plan when it touches data, contracts or many files.
5. **It builds in build order.** CHECKLIST.md lists the fragments in the order they depend on each other, core first, and your AI follows that order, held to RULES.md. You can still ask for anything at any time; revisit-checklist catches up.
6. **It verifies before it says done.** The checks pass, the thing actually ran, and screens were looked at on phone, tablet and wide widths.
7. **It records the work.** STATE.md is updated with where things stand, decisions go to DECISIONS.md, your AI names the checklist item the work closes (revisit-checklist records the mark and the evidence), and a correction you had to make twice becomes a proposed line in RULES.md §Project specifics, added on your go.
8. **Review in a fresh session** when the change matters: a second AI session asked to review, with no memory of building it.

> **Why:** A fresh session with an up-to-date STATE.md picks up where the last one stopped, with none of the stale context. So when a piece of work ends, run `revisit-state` and start a fresh session, rather than waiting for the window to run out.

### When to run each command

Every command except `view-project` and `revisit-state` talks first: it explains what it found and exactly what it will change, waits for your go, then does it and says what it did. `view-project` writes nothing in the project, so it opens its page at once, and `revisit-state` only saves where things stand, so it saves at once.

| Command | Run it |
|---|---|
| `offthemode` | Once per project, to set it up; later, any time you want the status |
| `revisit-checklist` | To see what's next, or when a new feature or idea comes up, so it lands in the right place on the checklist |
| `view-project` | Whenever you want the whole project at a glance, as a page in your browser |
| `revisit-state` | Your AI runs it by itself after work changes files or settles a decision; type it before you start a fresh session, or whenever you want where things stand saved for sure |
| `reassess` | After every few pieces of work, before a milestone, or whenever the product feels like it is drifting from the core concept |
| `revisit-comments` | Before a merge, or when comments feel stale |
| `revisit-glossary` | After a milestone, or before you show the project to someone |

Some guides add their own rhythm on top: a Refactor Checkpoint during the core build, a Complexity Audit weekly while surfaces grow, the Five-Person Test whenever the core journey changes shape, and a Weekly Signal Review after launch.
