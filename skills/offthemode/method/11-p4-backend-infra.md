## P4 · Backend & Infra

> **Output:** a deploy target recorded in `.offthemode/DECISIONS.md`; a data architecture chosen by the UX contract (request/response, or a sync engine spiked in P2); a schema with its invariants and forward-only migrations; a typed contract plus a mock server; `.env.example` and a boot-time env check; a parity table; working observability; a failure-mode table with its fix-now rows done; `.offthemode/ARCHITECTURE.md`. After this, hosting the product means pointing DNS at it.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Read ARCHITECTURE.md first if it exists, and update it in the same change when the structure moves.
- Schema changes go through a new, forward-only migration. Never edit one that has already run.
- Enforce each invariant (a rule the data must always obey) at the lowest layer that can hold it: a database constraint before app code.
- Validate input at every boundary (HTTP, webhooks, queue messages, env, vendor responses), then trust the types. Errors use the project's error catalog.
- A mutation that charges, sends or calls a vendor must be safe to retry, with an idempotency key (one id per request, so a repeat is done only once).
- Contract changes are additive only, unless the user approves a versioning plan.
- A new dependency, service or environment variable gets a DECISIONS.md entry and an updated env check, on the user's go.
- Open the whole guide to choose hosting or the data architecture, to add an entity or a service, or to change the API style.
<!-- /offthemode:rules -->

Keep the infrastructure boring so the product can be the exciting part. A strong backend early is the right call. What matters is timing: pick the deploy target in P1 or P2, using the numbers from the core spike, and build against it from the first commit. Then moving from local to hosted is a config change, not a migration.

> **Why:** Left alone, an AI writes localhost-tutorial code: sessions in memory, uploads to local disk, `setTimeout` as a job queue, SQLite in dev and Postgres in prod. That is the mode, the most common answer rather than the right one. Once RULES.md §This project names the target and its physical limits ("functions die after the response", "no writable disk"), those patterns drop out of what your AI considers. RULES.md loads at the start of every session, so the limits hold every time.

| | Serverless functions | Edge isolates | Managed containers | VPS |
|---|---|---|---|---|
| Examples | Vercel, Netlify, Lambda | Cloudflare Workers, Deno Deploy | Fly.io, Railway, Render, Cloud Run | Hetzner, DigitalOcean + Kamal or Coolify |
| Cost | About zero when idle, steep at scale | Cheapest per request, tight CPU | Per instance, in steps | Cheapest for steady load, paid in ops hours |
| Long jobs, sockets | Capped; use managed realtime | Offload; use platform primitives | Native | Native |
| Sync engine | A hosted sync service only | A hosted sync service only | Self-host the sync server beside Postgres | Self-host; you run it |
| Pick when | Web-first, spiky traffic, tiny team | Latency-critical light reads | Complex product: workers, sockets, sync, mobile | Steady load, cost-sensitive |

> **Rule:** For a complex product with mobile clients, the least-regret default is managed containers, managed Postgres in the same region, a durable job runner, and the marketing site on serverless. Deviate only with a written reason and a "revisit when" condition, both in DECISIONS.md.

### The UX contract picks the data architecture

Product first means the UX contract chooses the data layer, not habit. Request/response (tRPC or OpenAPI over Postgres, plus a queue) is the right default until the contract asks for instant changes with undo, offline writes, state that survives a reload and no spinners. Most of the P5 state rules ask for exactly that. With request/response, each of those properties is hand-built for every mutation (any action that changes data): a cache write, a rollback, an offline queue, conflict handling. That is where "complex inside" quietly turns into "buggy outside".

A sync engine solves this differently. It keeps a live local copy of the data on each client and syncs it with the server in the background, so reads and writes feel instant and work offline.

> **Rule:** If the UX contract needs offline writes, multiplayer, or instant mutations on more than half of the core-journey actions, spike a sync architecture in P2 before choosing the API style.

| Family | Candidates | Fits |
|---|---|---|
| Sync engine over Postgres | Zero, ElectricSQL, PowerSync | You keep Postgres and SQL; clients query a local, reactive copy |
| Reactive hosted backend | Convex, InstantDB | Small team, realtime by default, and you accept the platform |
| CRDTs for shared documents | Yjs, Automerge | Collaborative text, canvases, anything merged edit by edit; a CRDT is a data type that merges edits from many people without conflicts |

Compare the winner against request/response on the same core journey:

- Code per optimistic mutation (an update shown before the server confirms it)
- Conflict rules: what happens when two people change the same thing
- The authorization model: sync rules or query permissions versus endpoint checks, and how you test each
- The mobile offline story
- Lock-in: can your data and queries leave

Record the result as a numbered decision (D-###) in `.offthemode/DECISIONS.md`. The rest of P4 (contract, authorization, parity) applies to whichever one wins.

### Data model, then contract

The schema comes first in P4, and its nouns become P5's navigation. An invariant is a rule the data must always obey, such as "one active subscription per account". Enforce each one at the lowest layer that can hold it. Use UUIDv7 or ULID IDs (unique and sortable by time), UTC `timestamptz`, money as integer minor units (cents) plus a currency, and forward-only migrations: expand, backfill, contract. Never edit a migration that has already run; write a new one.

> **Why:** AIs write check-then-insert in app code because tutorials do, and under concurrency it races: two requests can both pass the check. A unique or `CHECK` constraint can't race. Give that reason and your AI applies it to invariants you never listed.

> **Trap:** Tables generated from UI mocks are screen-shaped and break the moment a second screen needs the same data. Model the domain, then shape view models per screen.

```prompt title="Data Model With Invariants"
Read .offthemode/PRODUCT.md, .offthemode/SKELETON.md, .offthemode/GLOSSARY.md and .offthemode/ROUTES.md. No application code yet: show me the design and wait for my go.
Design the data model for {{?PRODUCT_NAME}} as someone who has run {{DATABASE}} at maintainer level. Reason from the engine's real behavior (constraints, locking, index structures, isolation), not ORM tutorials.
1. Entities named as the user names them (the Terms in GLOSSARY.md, definitions from SKELETON.md §Domain model): who can see or change each, and its lifecycle states.
2. Relationships: cardinality and deletion semantics (cascade, restrict, soft-delete, archive), each justified.
3. Invariants in plain language, each with WHERE it is enforced (a DB constraint first, then a transaction with a lock, then policy code) and why, if not in the DB.
4. Schema in {{ORM_OR_SQL}}: {{ID_STRATEGY}} IDs, timestamptz in UTC, integer money plus currency, explicit NOT NULL, an index for each query implied by ROUTES.md, a comment on each table naming its invariants. If a sync engine was chosen, put the sync rules or permissions next to each table.
5. A forward-only migration plan. The five hottest queries, the index serving each, and the expected rows scanned.
Seed data comes from the Build the Seed prompt. List open questions instead of guessing ownership or deletion semantics. Write any doubt as "I think X, because Y" and confirm it before building on it.
```

| Contract style | Best when | Trap |
|---|---|---|
| OpenAPI (generated) | Native mobile, public API | Hand-edited specs drift; generate one side from the other |
| tRPC | TypeScript monorepo, web + React Native | Old mobile builds break on renamed procedures |
| GraphQL | Many screens composing overlapping data | N+1 queries (one query per item instead of one for the list), per-field authorization, hard caching |
| Server actions | Web-only mutations | Still public endpoints; authorize each one |
| Sync engine / reactive backend | Offline, multiplayer, mostly-instant mutations | Authorization moves into sync rules or queries; test them like endpoints |

Use one schema library for types, validation and forms (Zod, Valibot or ArkType on TypeScript; Codable, kotlinx.serialization or freezed on native). Parse at every boundary: HTTP, webhooks, queue messages, env, vendor responses.

Errors go out as RFC 9457 problem+json (a standard JSON error shape) with a stable `code` from a catalog. The UI maps each code to copy, and those become P5's error states.

Any mutation that charges, sends or calls a vendor takes an `Idempotency-Key`: a unique key generated once per user intent, so a retry or a double tap can't charge twice. The server stores the key, a hash of the request and the response, and replays the stored response on a duplicate.

Paginate with cursors. Old mobile builds stay live for months, so contract changes are additive only, with a minimum-version check.

> **Pro move:** Generate a mock server from the contract on day one. P5's clickable skeleton builds against it while P4 implements the handlers, so the two phases run in parallel.

```prompt title="Contract-First API"
From {{SCHEMA_PATH}} and .offthemode/ROUTES.md, define the API contract before any handler exists. Style {{CONTRACT_STYLE}}; clients {{CLIENTS}}.
Per operation: authentication; the authorization rule (matrix in .offthemode/SECURITY.md); input and output schemas in {{SCHEMA_LIB}}; catalog error codes (problem+json, never ad-hoc strings); idempotency (natural, or Idempotency-Key with storage and replay); cursor pagination and filter/sort params matching the URL state in ROUTES.md; rate-limit bucket; cache semantics; compatibility (additive only, or a versioning plan).
Show me the contract and wait for my go. Then generate a typed client and a mock server the frontend can use now, and write contract tests (malformed -> 400 problem, no auth -> 401, wrong actor -> 403, success -> the documented shape). Flag screens that need more than one round-trip and propose screen-shaped endpoints. Responses are view models, never raw rows.
```

### The backbone

| Concern | Default | Non-negotiable |
|---|---|---|
| Jobs | Anything slow or touching a vendor: Inngest, Trigger.dev, Temporal, pg-boss, Graphile Worker or BullMQ | Safe to run twice, backoff with jitter (retries spaced out, with a random offset so they don't all land at once), a dead-letter queue (where jobs that keep failing are parked for a person to look at), visible queue depth |
| Caching | CDN caching for public reads; an app cache only after measuring | A named invalidation trigger for each cached value |
| Files | S3-compatible storage, presigned direct uploads | Bytes never pass through your API; type and size checked on the server |
| Realtime | Only if the moment of value needs it: SSE (server-sent events) for push, WebSockets for two-way, a sync engine when the contract says so | Reconnect with resume; visible connection state |
| Auth | Web: httpOnly Secure SameSite cookies. Mobile: a short-lived access token plus a rotating refresh token in Keychain/Keystore | No tokens in localStorage or URLs |
| Authorization | One `can(actor, action, resource)` module plus Postgres row-level security, where the database itself returns only the rows the caller may see (or the sync engine's rules) | Never inferred from hidden buttons |
| Rate limits | Per user and per IP at the edge; strict on auth, search and expensive routes | 429 with `Retry-After` |

Row-level security (RLS) means Postgres itself checks, row by row, whether the current user may read or write. It backs up the `can()` module when app code slips.

### Parity, hosting, observability

Environments differ in config values, never in code paths. In practice:

- [ ] Compose or a devcontainer that mirrors prod's major versions
- [ ] Secrets in a manager (1Password CLI, Doppler, Infisical, or the platform's store), with secret scanning (gitleaks) in the pre-commit hook and in CI
- [ ] A preview database per pull request (Neon and Supabase both branch databases)
- [ ] Infrastructure as code (Terraform/OpenTofu, Pulumi, SST) for whatever the platform config doesn't cover
- [ ] Structured JSON logs with `requestId`, `traceId`, route and `durationMs`, and never personal data
- [ ] OpenTelemetry over OTLP for traces and metrics
- [ ] Health split into `/healthz` (the process is alive) and `/readyz` (it can serve traffic), with uptime checks and a synthetic core-journey run (a script that walks the core journey on a schedule) pointed at them
- [ ] Budget alerts on every provider
- [ ] Point-in-time recovery (PITR) with restore drills on a schedule

Until you've restored a backup, you don't know it works.

```file path=".env.example"
APP_ENV=local                     # local | preview | production. Copy to .env.local; keep in sync with the env check
APP_URL=http://localhost:3000
DATABASE_URL=postgres://app:app@localhost:5432/{{PROJECT_SLUG}}_dev
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000 # local emulator; unset in prod
S3_BUCKET={{PROJECT_SLUG}}-local
AUTH_SECRET=                      # openssl rand -base64 32
LOG_LEVEL=debug
OTEL_EXPORTER_OTLP_ENDPOINT=
{{PUBLIC_PREFIX}}API_URL=http://localhost:3000/api   # client-exposed: NEXT_PUBLIC_ / VITE_ / EXPO_PUBLIC_
```

Every entrypoint validates the environment at boot and fails with key names, never values. The rule works in any stack. Here is a TypeScript version with Zod 4; your AI writes the same check for your stack and lists its command in RULES.md §Commands.

```file path="src/env.ts"
// Imported first by every entrypoint (server, worker, scripts). Zod 4.
import { z } from "zod";

const Env = z.object({
  APP_ENV: z.enum(["local", "preview", "production"]),
  APP_URL: z.url(),
  DATABASE_URL: z.string().startsWith("postgres"),
  REDIS_URL: z.string().startsWith("redis"),
  S3_ENDPOINT: z.url().optional(),
  S3_BUCKET: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  throw new Error(`Invalid environment, check: ${keys}`); // keys only, never values
}
export const env = parsed.data;
```

```prompt title="Prod-Parity Setup"
Goal: moving {{?PRODUCT_NAME}} from local to {{?DEPLOY_TARGET}} is a non-event; environments differ in config values only. Show me the plan and wait for my go before changing anything.
1. A one-command local stack ({{COMPOSE_OR_DEVCONTAINER}}) with prod's major versions of {{DATABASE}}, {{QUEUE_OR_CACHE}}, the sync server if any, and S3-compatible storage. No SQLite for dev, no in-memory stand-ins for anything durable in prod.
2. Boot-time env validation ({{?ENV_CHECK_CMD}}) that fails with key names only; server and client vars split by the framework prefix; .env.example kept in sync; secrets from {{SECRETS_MANAGER}}; secret scanning in pre-commit and CI.
3. CI: typecheck, lint, unit and contract tests, migrations on an empty DB, seed; block the merge on failure. Migrations run as a release step before new code serves traffic.
4. A preview environment per pull request with its own seeded database; infrastructure as code ({{IAC_TOOL}}) for anything outside the platform config.
5. A parity table in .offthemode/ARCHITECTURE.md (local vs preview vs prod, per dependency). Every difference is a future bug; shrink it. Put the start, test, migrate and logs commands in .offthemode/RULES.md §Commands.
Never provision paid resources without asking.
```

```prompt title="Hosting Decision"
Choose hosting for {{?PRODUCT_NAME}} from workload facts, not popularity. Every input is a named, editable number; mark each result as estimate or measured.
Facts: clients {{CLIENTS}}; users at launch / at 12 months {{N_LAUNCH}} / {{N_12MO}}; peak RPS = DAU x sessions x requests per core journey (ROUTES.md) x peak ratio; longest job {{LONGEST_JOB}}; realtime or sync {{REALTIME_OR_SYNC}}; regions {{REGIONS}}; budget {{BUDGET}}; ops appetite {{OPS_APPETITE}}; core envelope from P2 {{?CORE_CONTRACT}}.
1. Score serverless, edge, managed containers and VPS on: monthly cost at launch, 10x and 100x (egress, storage, seats, per-call APIs {{PAID_APIS}}); cold starts on the core journey; long-running work; WebSockets and sync servers; compute-to-DB latency; lock-in; ops burden.
2. What breaks first at 10x (connections, a lock, a sequential scan, a vendor rate limit); DB size at 12 months; cost per active user and per core action.
Output: the matrix with numbers; one recommendation with its strongest reason and a "revisit when"; the escape hatch (jobs behind an interface, storage behind the S3 API) that keeps a future move under a week. Show me all of it and wait for my go; then record it as a D-### entry in .offthemode/DECISIONS.md and summarize it in .offthemode/ARCHITECTURE.md.
```

> **Pro move:** Logs give your AI context at runtime too. Give it one command that tails structured logs and recent errors, list it in RULES.md §Commands, and add a line to RULES.md: read runtime evidence before theorizing about a bug. An AI that can observe stops guessing.

```prompt title="Failure-Mode Review"
Review {{SCOPE}} as the engineer on call at 3am. For every dependency and core-journey step in .offthemode/ROUTES.md: what happens when it is slow (its slowest 1 in 100 calls, p99, ten times slower), down, returns garbage, or succeeds twice? What does the user see (no matching state in the ROUTES.md state inventory is a finding)? Which invariant is at risk? How do we find out ("a user tells us" is a finding)? How do we recover, with the exact command?
Also cover: a deploy mid-request, a migration failing halfway, 1M queued jobs, secret rotation, DB connections exhausted, duplicate or out-of-order webhooks, clock skew, a sync client offline for a week, one user hammering the most expensive endpoint.
Output: Failure | Blast radius | User sees | Detection | Recovery | Fix now / accept / later. Show me the table and wait for my go, then implement the fix-now rows, smallest first.
```

```file path=".offthemode/ARCHITECTURE.md"
ARCHITECTURE: {{PRODUCT_NAME}} · read before any backend, data or infra change; update it in the same commit. Decisions live in DECISIONS.md.

### Deploy target and data architecture
Compute {{PROVIDER_AND_MODEL}} in {{REGION}}; database {{DB_PROVIDER}}, same region {{YES_NO_WHY}}; data architecture {{REQUEST_RESPONSE_OR_SYNC_ENGINE}} (D-{{NNN}}); revisit when {{CONDITION}}.
Code runs there unchanged: no local disk writes, no in-process timers for work that must survive, no memory shared across requests. Schema changes only through new migrations; never edit an applied one. A new dependency or service updates the parity table and DECISIONS.md in the same change.
~~~mermaid
flowchart LR
  client[Web / Mobile] --> api[API or sync] --> db[(Database)]
  api --> q[[Queue]] --> worker[Worker]
  api --> store[(Object storage)]
~~~

### Invariants
| Invariant | Enforced by | Test |
|---|---|---|

### Contract, auth, limits
Style {{STYLE}} at {{PATH}} · error catalog {{PATH}} · Idempotency-Key on {{OPERATIONS}} · additive only, min app version {{VERSION}} · authn {{METHOD}} · authz {{POLICY_PATH}} · RLS or sync rules {{WHERE}} · rate buckets {{BUCKETS}}

### Parity
| Dependency | Local | Preview | Production | Difference |
|---|---|---|---|---|

### Observability, recovery, capacity
Errors {{TOOL}} · OTLP to {{BACKEND}} · /healthz, /readyz · uptime {{TOOL}} · budget alerts {{THRESHOLDS}} · logs `{{LOGS_CMD}}` · PITR {{WINDOW}} · RPO {{RPO}} (most data we can lose) / RTO {{RTO}} (longest time to recover) · last restore drill {{DATE}} ({{DURATION}}) · capacity and cost: {{FROM_HOSTING_DECISION}}
```
