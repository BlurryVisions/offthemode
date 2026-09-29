## The daily loop

Normal sessions stay free-form. You say what you want in plain words; the files in `.offthemode/` keep the standard and the memory, so you don't have to.

### A normal session

1. **Open a session.** Your AI loads `.offthemode/RULES.md` and `.offthemode/STATE.md`, so it knows the standards and where things stand. If its first answer doesn't know, see How to add it.
2. **Say what you want.** One concern at a time: a feature, a fix, a screen.
3. **It opens the guide.** RULES.md §Guides maps each kind of work to a guide; your AI opens the matching one before planning, once per session.
4. **It talks first.** It says what it understood, what it will change and what it isn't sure of, as hypotheses ("I think X, because Y"). Correct it, or say go. A one-line fix gets one line; work that touches data, contracts or many files gets a real plan.
5. **It builds, in order.** The core concept comes first, following CHECKLIST.md, held to RULES.md.
6. **It verifies before it says done.** The checks pass, the thing actually ran, and screens were looked at on phone, tablet and wide widths.
7. **It records the work.** STATE.md is rewritten with where things stand, decisions go to DECISIONS.md, a finished checklist item gets its evidence, and a correction you had to make twice becomes a new line in RULES.md.
8. **Review in a fresh session** when the change matters: a second AI session asked to review, with no memory of building it.

> **Why:** A fresh session with an up-to-date STATE.md picks up where the last one stopped, with none of the stale context. So end a session when a piece of work ends, not when the window runs out.

### When to run each command

Every command talks first: it explains what it found and exactly what it will change, waits for your go, then does it and says what it did.

| Command | Run it |
|---|---|
| `offthemode` | Once per project, to set it up; later, any time you want the status |
| `listrevisit` | To see what's next, or when a new feature or idea comes up, so it lands in the right place on the checklist |
| `reassess` | After every few pieces of work, before a milestone, or whenever the product feels like it is drifting from the core concept |
| `commentrevisit` | Before a merge, or when comments feel stale |
| `glossaryrevisit` | After a milestone, or before you show the project to someone |

Some guides add their own rhythm on top: a Refactor Checkpoint during the core build, a Complexity Audit weekly while surfaces grow, the Five-Person Test whenever the core journey changes shape, and a Weekly Signal Review after launch.
