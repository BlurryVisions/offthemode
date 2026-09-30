## P3 · Visual Language

### Working rules (for a change inside an existing product)
- Build with the design tokens and components that already exist. No raw colour, size, spacing or duration values: a value the tokens can't express is a token proposal shown to the user, never an inline number.
- If DESIGN.md exists, follow its principles and bans. If there is none, follow the current styles, and list any value in the touched files that bypasses the tokens.
- One primary action per screen. Every touched screen keeps its empty, loading, error, offline and no-permission states.
- Nothing that could sit on any other product unchanged. If the change drifts toward a stock layout or a component library's default look, stop and say so.
- Look at every touched screen at each of screenshot_sizes (RULES.md §Budgets), light and dark, with the screenshot and audit commands in RULES.md §Commands where they exist.
- Open the whole guide when the product has no tokens yet, to add or change a token, to set a visual direction or a signature moment, or to redesign a whole surface. Offer that as its own step; never start it inside a small change.

These are the guide's working rules, for a change inside an existing product. Open the whole guide, `../10-p3-visual-language.md`, when you start this phase or change its structure.
