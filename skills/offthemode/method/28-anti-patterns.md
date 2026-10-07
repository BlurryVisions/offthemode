## Anti-patterns

Some classics are simply a law broken, and The Laws cover them: adjective soup, accepting the first visual, feature-first prompting, the marathon session and re-prompting the same fix. These are the rest, including the ones a setup like this can invite.

| Anti-pattern | What happens | Fix |
|---|---|---|
| Building on a guess | The AI fills a gap with the likeliest answer, and everything after inherits it | Write the doubt as a hypothesis ("I think X, because Y") and confirm it in the code, the docs or by asking before building on it |
| Mega-prompt, no priorities | The easy requirements win and the hard one silently drops | Rank constraints ("first wins"), write non-goals, move standing requirements into RULES.md |
| "Best practices" | That phrase is the mode, the most common answer, by definition | Ask "what would the {{CORE_TECH}} maintainers do here, and what would they refuse?", and open the matching guide |
| "Make it better" | With no target, the model does something visible, usually more | Name the axis and the evidence: "the primary action loses to the sidebar; make it win without adding elements" |
| Letting the AI pick the stack | Its default is whatever dominated its training data, and that brings the default look with it | Derive the stack from the product's constraints and record it as a D-### entry in DECISIONS.md |
| Pasting code instead of pointing at files | Pasted code goes stale and loses its callers | Point at paths (most tools accept `@path`); paste only what the AI can't reach |
| Arguing with a derailed session | Each correction adds more of the wrong path | Rewind to before it went wrong if your tool can; otherwise run revisit-state and start a fresh session |
| The bloated rules file | 800 lines compete for attention on every turn | Keep RULES.md readable in a minute; depth lives in the guides, opened only for the work that needs them |
| Not reading diffs | Drive-by renames and loosened types pass the checks | Read `git diff --stat` first, then every hunk; one commit per checkpoint |
| Tests that agree with the code | Written afterward, they encode the bugs | Test-First, and the tests stay fixed while the code is written |
| Minimalism by amputation | Experts can't do the job, so complexity comes back as workarounds | Move a removed control to a deeper layer instead of deleting it (Taming Complexity); the core job still completes keyboard-only and touch-only |
| Full ceremony on a one-line change | Ceremony gets abandoned within weeks, and then nothing is enforced | Scale the talk to the change: a one-line fix gets one line on what will change, then the check that proves it; a full plan is for work that touches data, contracts or many files. For a change inside what exists, open a guide's working rules, not the whole guide |
| Taste by negation | Bans alone converge on the next mode | Write what you want, not only what you ban: PRODUCT.md §Feeling and `.offthemode/DESIGN.md`, drawn from work you love |
| Self-graded divergence | One author, one context, one favourite | References you assign, each direction built in its own fresh session, and a reviewer session that built none of them |
| Absolute scores from a same-family judge | A model grading output from its own family is lenient, noisy and drifting, so the loop oscillates | Compare in pairs against references, swap the order, call it a tie when the two orders disagree; take measurable facts (contrast, sizes, spacing) from a script |
| The same example in every project | Worked examples quietly become your house style | Treat the examples in these guides as illustrations, never defaults; note in `.offthemode/DESIGN.md` what this project must not borrow from your last one |
