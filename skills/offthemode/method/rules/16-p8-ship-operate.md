## P8 · Ship & Operate

### Working rules (for a change inside an existing product)
- Every release can be rolled back, and a risky feature ships behind a flag that can switch it off without a deploy.
- Migrations add the new shape, move to it, then remove the old one, so a rollback never needs a down-migration.
- Follow RUNBOOK.md if it exists, and update it in the same change when a step in it changes.
- A first-contact page (landing, store listing, link preview) is held to the same RULES.md §Look and feel and §Budgets as product screens.
- Open the whole guide before a first launch, to set up monitoring and alerts, or for the project retro.

These are the guide's working rules, for a change inside an existing product. Open the whole guide, `../16-p8-ship-operate.md`, when you start this phase or change its structure.
