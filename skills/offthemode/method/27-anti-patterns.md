## Anti-patterns
<!-- origin: added -->

Five classics are just laws broken and live in The Laws table: adjective soup (Law 4), accepting the first visual (Law 9), feature-first prompting (Law 12), the marathon session (Law 8) and re-prompting the same fix (Law 10). These are the rest, including the ones a kit like this invites.

| Anti-pattern | What happens | Fix |
|---|---|---|
| Mega-prompt, no priorities | The easy requirements win and the hard one silently drops | Rank constraints ("first wins"), write non-goals, move standing requirements into the rules |
| "Best practices" | That phrase is the mode by definition | "What would the {{CORE_TECH}} maintainers do here, and refuse?", or load the profile |
| "Make it better" | With no target, the model does something visible, usually more | Name the axis and the evidence: "the primary action loses to the sidebar; make it win without adding elements" |
| Letting the agent pick the stack | Its default dominated its training data, and brings the default look with it | Derive the stack from product constraints in a D-### entry |
| Pasting code instead of pointing at files | Pasted code goes stale and loses its callers | @-mention paths; paste only what the agent can't reach |
| Arguing with a derailed session | Each correction adds more of the wrong path | Rewind (double-Esc), or `/handoff` and `/clear` |
| The bloated rules file | 800 lines compete on every turn | A root file readable in a minute, depth in directory packs and skills, the kit-lint context budget |
| Not reading diffs | Drive-by renames and loosened types pass the checks | `git diff --stat` first, then every hunk; one commit per checkpoint |
| Tests that agree with the code | Written afterward, they encode the bugs | Test-First, with test paths locked during implementation |
| Minimalism by amputation | Experts can't do the job, so complexity returns as workarounds | Every removed control lands in L0 or L3; the core job still completes keyboard-only and touch-only |
| The full ritual on a one-line change | Ceremony gets abandoned by week two, and then nothing is enforced | Lanes: Trivial skips the ritual; `/ship` is the only thing to remember |
| Taste by negation | Bans alone converge on the next mode | TASTE.md, extracted from what you love |
| Self-graded divergence | One author, one context, one favourite | Anchors you assign, separate worktrees, a critic that built none of them |
| Absolute scores from a same-family judge | Lenient, noisy, drifting; the loop oscillates | Pairwise against anchors, order swapped, ties on disagreement; pixel facts from the audit script |
| The same example in every repo | Worked examples become your house style | USED.md as a ban list; illustrations never reused |
