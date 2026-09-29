## P4 · Backend & Infra
<!-- origin: yours -->

> **Output:** a deploy target recorded as a decision; a data architecture chosen by the UX contract (request/response, or a sync engine spiked in P2); schema with invariants and forward-only migrations; a typed contract plus mock server; `.env.example` and a boot-time env check; a parity table; working observability; a failure-mode table with fix-now rows done; `.offthemode/ARCHITECTURE.md`. After this, "hosting it" means pointing DNS.

Keep the infrastructure boring so the product can be the exciting part. Your instinct to make the backend strong early is right. The fix is timing: pick the deploy target in P1-P2 using the spike's numbers, and build against it from the first commit, so local-to-hosted is a config change, not a migration.

> **Why:** Left alone, an agent writes localhost-tutorial code: in-memory sessions, uploads to local disk, `setTimeout` as a job queue, SQLite in dev and Postgres in prod. That's the mode. Once the rules name the target and its physical constraints ("functions die after the response", "no writable disk"), those patterns drop out of what the agent considers.

| | Serverless functions | Edge isolates | Managed containers | VPS |
|---|---|---|---|---|
| Examples | Vercel, Netlify, Lambda | Cloudflare Workers, Deno Deploy | Fly.io, Railway, Render, Cloud Run | Hetzner, DigitalOcean + Kamal or Coolify |
| Cost | ~zero idle, steep at scale | Cheapest per request, tight CPU | Per instance, in steps | Cheapest steady, paid in ops hours |
| Long jobs, sockets | Capped; managed realtime | Offload; platform primitives | Native | Native |
| Sync engine | A hosted sync service only | A hosted sync service only | Self-host the sync server beside Postgres | Self-host, you run it |
| Pick when | Web-first, spiky, tiny team | Latency-critical light reads | Complex product: workers, sockets, sync, mobile | Steady load, cost-sensitive |

> **Rule:** For a complex product with mobile clients, the least-regret default is managed containers, managed Postgres in the same region, a durable job runner, and the marketing site on serverless. Deviate only with a written reason and a "revisit when".

### The UX contract picks the data architecture

Product-first means the UX contract chooses the data layer, not habit. Request/response (tRPC or OpenAPI over Postgres plus a queue) is the right default until the contract asks for instant mutations with undo, offline writes, state that survives reload and no spinners, which is most of the P5 state rules. Then every one of those properties gets hand-built per mutation (cache write, rollback, offline queue, conflict handling), and that's exactly where "complex inside" quietly becomes "buggy outside".

> **Rule:** If the UX contract requires offline writes, multiplayer, or instant mutation on more than half of core-journey actions, spike a sync architecture in P2 before choosing the API style.

| Family | Candidates | Fits |
|---|---|---|
| Sync engine over Postgres | Zero, ElectricSQL, PowerSync | You keep Postgres and SQL; clients query a local, reactive replica |
| Reactive hosted backend | Convex, InstantDB | Small team, realtime by default, and you accept the platform |
| CRDTs for shared documents | Yjs, Automerge | Collaborative text, canvases, anything merged edit by edit |

Compare the winner against request/response on the same core journey: code per optimistic mutation, conflict semantics, the authorization model (sync rules or query permissions versus endpoint checks, and how you test each), the mobile offline story, and lock-in (can your data and queries leave). Record the result as a D-###, and the rest of P4 (contract, authz, parity) applies to whichever you chose.

### Data model, then contract

The schema is P4's first artifact, and its nouns become P5's navigation. Enforce each invariant at the lowest layer that can hold it. Use UUIDv7 or ULID IDs, UTC `timestamptz`, money as integer minor units plus currency, and forward-only migrations (expand, backfill, contract).

> **Why:** Agents write check-then-insert in app code because tutorials do, and under concurrency it races. A unique or `CHECK` constraint can't race. Give the reason ("two requests can both pass the check") and the agent applies it to invariants you never listed.

> **Trap:** Tables generated from UI mocks are screen-shaped and break the moment a second screen needs the same data. Model the domain, then shape view models per screen.

```prompt title="Data Model With Invariants"
Read .offthemode/PRODUCT.md, .offthemode/SKELETON.md, ~/.claude/experts/expert-backend.md. No application code yet. Design the data model for {{?PRODUCT_NAME}} as someone who has operated {{DATABASE}} at maintainer level: reason from the engine's real behavior (constraints, locking, index structures, isolation), not ORM tutorials.
1. Entities named as the user names them (GLOSSARY.md, definitions from SKELETON.md §Domain model): who can see or change each, lifecycle states.
2. Relationships: cardinality and deletion semantics (cascade, restrict, soft-delete, archive), justified.
3. Invariants in plain language, each with WHERE it is enforced (DB constraint preferred, then transaction + lock, then policy code) and why if not the DB.
4. Schema in {{ORM_OR_SQL}}: {{ID_STRATEGY}} IDs, timestamptz UTC, integer money + currency, explicit NOT NULL, an index per query implied by ROUTES.md, a comment per table naming its invariants. If a sync engine was chosen, the sync rules or permissions next to each table.
5. Forward-only migration plan. The five hottest queries, the index serving each, expected rows scanned.
Seed data comes from Build the Seed. List open questions instead of guessing ownership or deletion semantics.
```

| Contract style | Best when | Trap |
|---|---|---|
| OpenAPI (generated) | Native mobile, public API | Hand-edited specs drift; generate one side from the other |
| tRPC | TS monorepo, web + React Native | Old mobile builds break on renamed procedures |
| GraphQL | Many screens composing overlapping data | N+1, per-field authz, hard caching |
| Server actions | Web-only mutations | Still public endpoints; authorize each |
| Sync engine / reactive backend | Offline, multiplayer, mostly-instant mutations | Authorization moves into sync rules or queries; test them like endpoints |

Use one schema library for types, validation and forms (Zod, Valibot or ArkType on TS; Codable, kotlinx.serialization or freezed natively), and parse at every boundary: HTTP, webhooks, queue messages, env, vendor responses. Errors go out as RFC 9457 problem+json with a stable `code` from a catalog, and the UI maps codes to copy, which become P5's error states. Any mutation that charges, sends or calls a vendor takes an `Idempotency-Key`, generated once per user intent. The server stores key, request hash and response, and replays on duplicates. Paginate with cursors. Old mobile builds stay live for months, so contract changes are additive only, with a minimum-version check.

> **Pro move:** Generate a mock server from the contract on day one. P5's clickable skeleton builds against it while P4 implements handlers, so the two phases run in parallel.

```prompt title="Contract-First API"
From {{SCHEMA_PATH}} and .offthemode/ROUTES.md, define the API contract before any handler exists. Style {{CONTRACT_STYLE}}; clients {{CLIENTS}}.
Per operation: authentication; authorization rule (matrix in .offthemode/SECURITY.md); input/output schemas in {{SCHEMA_LIB}}; catalog error codes (problem+json, never ad-hoc strings); idempotency (natural, or Idempotency-Key with storage and replay); cursor pagination and filter/sort params matching ROUTES.md URL state; rate-limit bucket; cache semantics; compatibility (additive only, or a versioning plan).
Then generate a typed client and a mock server the frontend can use now; write contract tests (malformed -> 400 problem, no auth -> 401, wrong actor -> 403, success -> documented shape); flag screens needing more than one round-trip and propose screen-shaped endpoints. Responses are view models, never raw rows.
```

### The backbone

| Concern | Default | Non-negotiable |
|---|---|---|
| Jobs | Anything slow or touching a vendor: Inngest, Trigger.dev, Temporal, pg-boss, Graphile Worker or BullMQ | Safe to run twice, backoff with jitter, dead-letter, visible depth |
| Caching | CDN caching for public reads; app cache only after measuring | A named invalidation trigger per cached value |
| Files | S3-compatible storage, presigned direct uploads | Bytes never pass through your API; type and size checked server-side |
| Realtime | Only if the moment of value needs it: SSE for push, WebSockets for bidirectional, a sync engine when the contract says so | Reconnect with resume; visible connection state |
| Auth | Web: httpOnly Secure SameSite cookies. Mobile: short access token + rotating refresh in Keychain/Keystore | No tokens in localStorage or URLs |
| Authorization | One `can(actor, action, resource)` module + Postgres RLS (or the sync engine's rules) | Never inferred from hidden buttons |
| Rate limits | Per user and IP at the edge; strict on auth, search, expensive routes | 429 with `Retry-After` |

### Parity, hosting, observability

Environments differ in config values, never code paths. That means Compose or a devcontainer mirroring prod's major versions, secrets in a manager (1Password CLI, Doppler, Infisical, or the platform store) with gitleaks in pre-commit and CI, per-PR preview databases (Neon and Supabase both branch), and IaC (Terraform/OpenTofu, Pulumi, SST) for whatever the platform config doesn't cover. Logs are structured JSON with `requestId`, `traceId`, route and `durationMs`, and never PII. Instrument with OpenTelemetry over OTLP. Split health into `/healthz` and `/readyz`, and point uptime checks and a synthetic core-journey run at them. Add budget alerts per provider, and run point-in-time recovery restore drills on a schedule: until you've restored a backup, you don't know it works.

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

The rule is stack-agnostic: every entrypoint validates the environment at boot and fails with key names, never values. `{{ENV_CHECK_CMD}}` names your stack pack's version; this is the web-ts one.

```file path="src/env.ts"
// stack pack web-ts · imported first by every entrypoint (server, worker, scripts). Zod 4.
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
Goal: moving {{?PRODUCT_NAME}} from local to {{?DEPLOY_TARGET}} is a non-event; environments differ in config values only. Plan before diff.
1. One-command local stack ({{COMPOSE_OR_DEVCONTAINER}}) with prod's major versions of {{DATABASE}}, {{QUEUE_OR_CACHE}}, the sync server if any, and S3-compatible storage. No SQLite-for-dev, no in-memory stand-ins for anything durable in prod.
2. Boot-time env validation ({{?ENV_CHECK_CMD}}), failing with key names only; server and client vars split by framework prefix; .env.example in sync; secrets from {{SECRETS_MANAGER}}; secret scanning in pre-commit and CI.
3. CI: typecheck, lint, unit + contract tests, migrations on an empty DB, seed; block merge on failure. Migrations run as a release step before new code serves traffic.
4. Per-PR preview environment with an isolated seeded database; IaC ({{IAC_TOOL}}) for anything outside the platform config.
5. Parity table in .offthemode/ARCHITECTURE.md (local vs preview vs prod per dependency). Every difference is a future bug; shrink it.
Never provision paid resources without asking.
```

```prompt title="Hosting Decision"
Choose hosting for {{?PRODUCT_NAME}} from workload facts, not popularity. Every input is a named, editable number; mark results estimate or measured.
Facts: clients {{CLIENTS}}; users at launch / 12 months {{N_LAUNCH}} / {{N_12MO}}; peak RPS = DAU x sessions x requests per core journey (ROUTES.md) x peak ratio; longest job {{LONGEST_JOB}}; realtime or sync {{REALTIME_OR_SYNC}}; regions {{REGIONS}}; budget {{BUDGET}}; ops appetite {{OPS_APPETITE}}; core envelope from P2 {{?CORE_CONTRACT}}.
1. Score serverless, edge, managed containers and VPS on monthly cost at launch, 10x, 100x (egress, storage, seats, per-call APIs {{PAID_APIS}}); cold starts on the core journey; long-running work; WebSockets and sync servers; compute-to-DB latency; lock-in; ops burden.
2. What breaks first at 10x (connections, a lock, a seq scan, a vendor rate limit); DB size at 12 months; cost per active user and per core action.
Output: the matrix with numbers; one recommendation with its strongest reason and a "revisit when"; the escape hatch (jobs behind an interface, storage behind the S3 API) that keeps a future move under a week. Record a D-### and summarize in .offthemode/ARCHITECTURE.md.
```

> **Pro move:** Your "logging for context" habit applies at runtime too. Give the agent `{{LOGS_CMD}}`, which tails structured logs and recent errors, and a standing rule to read runtime evidence before theorizing about a bug. Agents that can observe stop guessing.

```prompt title="Failure-Mode Review"
Review {{SCOPE}} as the engineer on call at 3am. For every dependency and core-journey step in .offthemode/ROUTES.md: what happens when it is slow (p99 x10), down, returns garbage, or succeeds twice? What does the user see (no matching state in the inventory is a finding)? Which invariant is at risk? How do we know ("a user tells us" is a finding)? How do we recover, with the exact command?
Also: deploy mid-request, migration failing halfway, 1M queued jobs, secret rotation, DB connections exhausted, duplicate or out-of-order webhooks, clock skew, a sync client offline for a week, one user hammering the most expensive endpoint.
Output: Failure | Blast radius | User sees | Detection | Recovery | Fix now / accept / later. Then implement fix-now rows, smallest first.
```

```file path=".offthemode/ARCHITECTURE.md"
ARCHITECTURE: {{PRODUCT_NAME}} · read before any backend, data or infra change; update in the same commit. Decisions live in DECISIONS.md.

### Deploy target and data architecture
Compute {{PROVIDER_AND_MODEL}} in {{REGION}}; database {{DB_PROVIDER}}, same region {{YES_NO_WHY}}; data architecture {{request/response | SYNC_ENGINE}} (D-{{NNN}}); revisit when {{CONDITION}}.
Code runs there unchanged: no local disk writes, no in-process timers for work that must survive, no request-shared memory. Schema changes only via new migrations; never edit an applied one. A new dependency or service updates the parity table and DECISIONS.md in the same change.
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
Style {{STYLE}} at {{PATH}} · error catalog {{PATH}} · Idempotency-Key on {{OPERATIONS}} · additive-only, min app version {{VERSION}} · authn {{METHOD}} · authz {{POLICY_PATH}} · RLS or sync rules {{WHERE}} · rate buckets {{BUCKETS}}

### Parity
| Dependency | Local | Preview | Production | Difference |
|---|---|---|---|---|

### Observability, recovery, capacity
Errors {{TOOL}} · OTLP to {{BACKEND}} · /healthz, /readyz · uptime {{TOOL}} · budget alerts {{THRESHOLDS}} · logs `{{LOGS_CMD}}` · PITR {{WINDOW}} · RPO {{RPO}} / RTO {{RTO}} · last restore drill {{DATE}} ({{DURATION}}) · capacity and cost: {{FROM_HOSTING_DECISION}}
```
