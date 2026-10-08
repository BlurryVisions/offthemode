## P4 · Backend & Infra

### Working rules (for a change inside an existing product)
- Read ARCHITECTURE.md first if it exists, and update it in the same change when the structure moves.
- Schema changes go through a new, forward-only migration. Never edit one that has already run.
- Enforce each invariant (a rule the data must always obey) at the lowest layer that can hold it: a database constraint before app code.
- Validate input at every boundary (HTTP, webhooks, queue messages, env, vendor responses), then trust the types. Errors use the project's error catalog.
- A mutation that charges, sends or calls a vendor must be safe to retry, with an idempotency key (one id per request, so a repeat is done only once).
- Contract changes are additive only, unless the user approves a versioning plan.
- A new dependency, service or environment variable gets a DECISIONS.md entry and an updated env check; a new dependency, or a service that costs money or receives the product's data, is asked in the round.
- A page meant to be found (PRODUCT.md, Found by) stays rendered on the server or prebuilt, and robots.txt changes only with its DECISIONS.md entry (Always-On · Being Found).
- Open the whole guide to choose hosting or the data architecture, to add an entity or a service, or to change the API style.

These are the guide's working rules, for a change inside an existing product. Open the whole guide, `../11-p4-backend-infra.md`, when you start this phase or change its structure.
