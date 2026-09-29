## The Laws
<!-- origin: added -->

Twelve GLOBAL laws. Every template applies at least one, and the Toolkit and Anti-patterns sections only add what this table doesn't already cover.

| # | Law | Mechanism | Do | Prevents | Template |
|---|---|---|---|---|---|
| 1 | Context beats cleverness | The model conditions only on its window; a missing fact becomes a guess, and guesses come from the average | "@.offthemode/PRODUCT.md @src/auth/. Onboarding for {{PERSON}}; first result inside PRODUCT.md's time-to-value budget; reuse the session model" | Persona prompts that change tone, not facts | Session Start (`/start`) |
| 2 | The mode is the default | For an underspecified request, the most typical answer is the correct one | "No hero. First viewport is the product on sample data. One display face. Colour strategy per DESIGN.md." | Hero, three cards, Inter, gradient | Constraint Stack |
| 3 | Reasons generalize, bare rules don't | A reason carries the principle to cases you didn't name | "Don't derive state in effects: it adds a render with stale values and a second source of truth." | Rules obeyed to the letter, missed in spirit | Every AGENTS.md standard |
| 4 | Show, don't adjective | "Modern, clean, premium" sat next to millions of templates, so they decode to them | "Headline --text-display, body --text-base, two weights; motion --dur-quick with --ease-out, transform and opacity only; take refs/04.png's whitespace, not its colours" | Adjective soup | Anchor to References |
| 5 | Plan before code | Once code exists, the model reads it as evidence and defends it | Heavy lane: plan mode, two architectures with tradeoffs, no code | Sunk-cost patching | `/slice` |
| 6 | Verification is the prompt | An agent can only fix what it can observe | "Screenshot / at {{?VIEWPORTS}} before and after; done = audits clean, typecheck and e2e green" | "Should work" | Prove It Works (`/prove`, `/ship`) |
| 7 | One concern per turn, fenced | With several goals the easiest wins; anything unfenced reads as fair game | "Only the refresh race in src/auth/refresh.ts. If the fix needs other files, stop and say why." | 14-file diffs you can neither review nor revert | Change Request (`/cr`) |
| 8 | Context is a budget, and it rots | Dead attempts left in history get repeated; auto-compaction decides what's forgotten | `/handoff`, `/clear`, `/start`; `/compact <focus>` only mid-task | The marathon session | Session End Handoff |
| 9 | Diverge, then converge, never in one step | One request samples the mode; a generator grading its own options picks its favourite | Options forced apart on axes you assign, built in separate contexts, compared by a critic; you choose | Three fonts on one idea | Three Divergent Directions |
| 10 | Every repeated correction becomes a standing rule | A correction in chat dies with the session | Second strike: LESSONS entry, then an AGENTS.md rule, then a check | Re-prompting the same fix | Session End Handoff, step 3 |
| 11 | Make the agent interview you | Every unstated decision gets a silent default, and silent defaults are the mode | Batched, numbered questions with defaults before any plan | Plans built on guesses | Interview Me First (`/interview`) |
| 12 | Product before technology | Without a person, job and moment, the model optimizes for completeness; with them it can rank, hide and infer | "90% keep the defaults. One control (quiet hours on/off), infer the schedule, everything else behind one disclosure." | Feature piles | Feature Kill List |
