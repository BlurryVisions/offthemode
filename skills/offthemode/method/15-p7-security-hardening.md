## P7 · Security Hardening

> **Output:** `.offthemode/SECURITY.md` (pointed to from RULES.md §Safety), an authorization matrix with generated tests, row-level security or sync rules, a short list of commands your AI never runs, and the findings of Red-Team Audit, Dependency Provenance Check and Secrets Sweep, all before real users, money or data arrive.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Authorization is checked on the server (or in the sync rules) for every action: deny by default, at the object level. Hiding a button is not security.
- Validate every input at the boundary and reject unknown fields. Parameterized queries only; never build SQL, shell commands, paths or URLs from user input.
- No secret in code, logs, bundles, fixtures or commits. If you see one, stop and say so.
- Ask before adding, removing or upgrading a dependency, and check its exact name in the official docs and the registry first.
- Follow .offthemode/SECURITY.md if it exists. If it doesn't and this is the first work on login, permissions, input, uploads, secrets, payments or AI features, offer to write it (below) before the change.
- Open the whole guide to write SECURITY.md, to add a trust boundary, and for the audit before launch.
<!-- /offthemode:rules -->

Security at the end is the most expensive place to do it. Adding authorization to 40 endpoints after the fact means touching all 40. A key leaked in commit 12 lives in git history forever. And an AI with no rules will put the service key in the client, because the tutorial it is copying did. So security runs through every phase, and P7 is the attack on your own work.

| Where | Security work |
|---|---|
| P0 | RULES.md §Safety: authorization checked on the server for every action; no secret in the repo, the client bundle or the logs |
| P1 | Threat sketch; draft authorization matrix |
| The first work on login, permissions, input, uploads, secrets, payments or AI features (RULES.md §Guides opens this guide) | SECURITY.md written, with the never-run command list, and pointed to from RULES.md §Safety; your tool's permissions set |
| P4 | Secrets manager, `can()` plus row-level security (or sync rules), rate limits, backups |
| P6, every fragment | Matrix row plus deny tests, input validation at the boundary, one abuse-path test |
| P7 | Red-team, dependency provenance, secrets sweep, restore drill, mobile and LLM passes |

### Where SECURITY.md lives and how it loads

SECURITY.md sits in `.offthemode/` next to the six core files. Your AI writes it from the template below the first time work touches login, permissions, user input, uploads, secrets, payments or AI features, and shows it to you with the one line it adds to RULES.md §Safety; both are written on your go. RULES.md loads at the start of every session, so that one line is enough to make the security rules reach every session that needs them:

```text
Before any work on auth, data access, input handling, secrets, dependencies or {{SENSITIVE_PATHS}}, read .offthemode/SECURITY.md and follow it.
```

```file path=".offthemode/SECURITY.md"
SECURITY RULES: {{?PROJECT_NAME}}
These override convenience. If one blocks you, stop and say so. Never work around it.

1. Authorization is server-side (or in the sync rules), deny by default, object-level, per the matrix in {{?POLICY_MODULE}}. Client checks are UX only.
2. Schema-validate every input at the boundary. Reject unknown fields. Parameterized queries only. Never build SQL, shell commands, paths or URLs from user input.
3. Secrets never appear in code, logs, bundles, binaries, fixtures, prompts or commits. Refer to env var names. If you see a secret, stop and tell me.
4. You have no production access and must not seek it. Never read real .env files, ~/.ssh, ~/.aws or credential stores.
5. Ask before adding, removing or upgrading any dependency. Verify the exact name in the official docs and the registry first.
6. Errors fail closed and leak no internals. Log only through {{?LOGGER_MODULE}} and its field allowlist: never tokens, passwords, payment data or raw request bodies.
7. Fetch user-supplied URLs only through {{?SAFE_FETCH_MODULE}}. LLM output is untrusted input. LLM tools run with the calling user's permissions.
8. Sensitive paths {{SENSITIVE_PATHS}}: stop, summarize the security impact, wait for my review.
9. Never run these; describe what you need and ask me to run it: recursive deletes of /, ~ or $HOME; force pushes; git reset --hard to a remote; any --no-verify; drop or truncate of a table, database or schema; terraform apply or destroy; piping curl or wget into a shell; printing .env files; anything touching production URLs, keys, secrets or tokens.

Stack
- Session: {{?AUTH_PROVIDER}}, cookie HttpOnly, Secure, SameSite=Lax, __Host- prefix, rotated on login
- CSP via {{?HEADERS_MODULE}}; CORS allowlist {{ALLOWED_ORIGINS}}
- Rate limits: {{?RATE_LIMIT_MODULE}}
- Row-level security or sync rules on: {{?TABLES}}
- Uploads: {{UPLOAD_POLICY}}
- Mobile token storage: {{?SECURE_STORAGE_LIB}}

Every fragment
- [ ] Matrix row plus deny tests for the wrong role and the wrong owner
- [ ] Inputs validated, errors fail closed, one abuse-path test
- [ ] No new secrets, dependencies or sensitive-path edits without my sign-off

Threat model: {{THREAT_MODEL_LINK}}. Update it whenever a trust boundary is added.
```

### Threat model the skeleton

A threat model is a short list of who would attack the product, where, and how you will stop them. Do it at the end of P1, for any product that will hold real people's data, money or content. STRIDE is the checklist it uses: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.

```prompt title="Threat Model the Skeleton"
As a security architect, threat-model {{?PRODUCT_NAME}} from .offthemode/SKELETON.md and .offthemode/PRODUCT.md. Platforms {{web, iOS or Android}}; sensitive data {{PII, payments, health, minors or UGC}}.
1. Data flow as a mermaid diagram with every trust boundary (client to API or client to sync, API to DB, third parties, webhooks, storage, admin, jobs, LLM calls).
2. STRIDE per boundary, plausible threats only, worst first: threat, boundary, STRIDE letter, likelihood, impact, mitigation, the test that proves it, the phase that builds it.
3. The assets an attacker wants most and the cheapest path to each.
4. Decisions that are expensive to change later (tenant model, auth provider, ID format, where authorization lives), with a recommendation now.
Propose SECURITY.md changes as a diff and wait for my go before writing them.
```

### Access control: the matrix first

Broken access control is A01 in the OWASP Top 10:2025 (which replaced the 2021 list), and it now includes SSRF (server-side request forgery: tricking your server into fetching a URL for the attacker). Type checks and happy-path tests never catch it, so write the matrix before the endpoints. Deny by default, and check at the object level ("can this user edit project 8f3a", not "can members edit projects"). IDs in URLs are attacker input, and hiding things in the client is UX, not security. With a sync engine, the same matrix drives its sync rules, and the generated tests run against the rules.

| Resource | Action | {{ROLE_ANON}} | {{ROLE_MEMBER}} | {{ROLE_ADMIN}} | {{ROLE_OWNER}} | Condition |
|---|---|---|---|---|---|---|
| {{RESOURCE}} | read | no | own | org | all | Admin also sees soft-deleted |
| {{RESOURCE}} | update | no | own | org | all | Locked after {{LOCK_STATE}} |
| billing | manage | no | no | no | yes | Re-auth within 10 min |

Row-level security (RLS) makes the database itself refuse rows from another tenant, so a missed check in the API still cannot leak them. In Postgres:

```sql
alter table {{TABLE}} enable row level security;
alter table {{TABLE}} force row level security;
create policy {{TABLE}}_tenant on {{TABLE}}
  using (org_id = current_setting('app.org_id')::uuid)
  with check (org_id = current_setting('app.org_id')::uuid);
-- the API runs `set local app.org_id = ...` inside each request's transaction
```

> **Pro move:** Make the matrix a typed object in `{{?POLICY_MODULE}}`, and have it drive both the policy function and a generated test suite that tries every role x resource x action. Docs and enforcement cannot drift, because they are one object.

### The hardening checklist

- [ ] Inputs schema-validated, unknown fields rejected; parameterized queries; no SQL, shell or path built from strings; every raw-HTML sink sanitized; `javascript:` URLs rejected
- [ ] Errors fail closed with no stack traces, SQL or foreign IDs (A10:2025); CSRF blocked with SameSite plus a token or an Origin check; GET never changes data; CORS allowlist, never `*` with credentials
- [ ] Session cookie `HttpOnly; Secure; SameSite=Lax` with the `__Host-` prefix, rotated on login and privilege change; a nonce-based CSP (Content Security Policy that only runs scripts carrying a per-request random value) run as `Report-Only` for a week first
- [ ] Rate limits per IP and per account on login, signup, OTP, reset, invites, search, exports, sends and paid APIs, with a progressive delay rather than a lockout attackers can trigger on purpose
- [ ] Uploads: size cap, magic-byte check (the file's real type, not its extension), images re-encoded, random keys, private buckets, short-lived presigned URLs, a separate serving domain
- [ ] SSRF: one fetch function for user URLs that allowlists schemes, resolves DNS, blocks private, loopback, link-local and metadata (169.254.169.254) ranges, and re-checks every redirect
- [ ] Logs use a field allowlist; auth failures alert; backups encrypted, copied outside the primary account, and actually restored once

```http
Content-Security-Policy: default-src 'self'; script-src 'nonce-{{NONCE}}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Dependencies and slopsquatting

Supply chain failures are A03:2025, and AI coding adds a new way in. Models invent plausible package names, attackers register those names with malware inside, and an AI that installs one runs the install script on your machine. This is slopsquatting. Commit the lockfile, install exactly from it in CI (`npm ci`, `pnpm install --frozen-lockfile`, or your stack's equivalent), turn install scripts off by default, and vet every new dependency.

```prompt title="Dependency Provenance Check"
Verify before installing: {{PACKAGE_LIST}}, or every dependency added since {{GIT_REF}} (diff the manifest and the lockfile). Query the registry directly ({{npm view <pkg>, PyPI JSON API, pub.dev, Maven Central or Swift Package Index}}). Per package:
1. Does the exact name match the library's official install docs (link)? Flag typos, hyphen and underscore swaps, wrong scopes, "-js" or "-official" suffixes.
2. First-publish and latest-release dates (flag under 90 days or a recent maintainer change); downloads and dependents against expected popularity; a repo link that resolves and matches.
3. Install scripts and what they run; new transitive dependencies, size, advisories.
4. Could the platform or an existing dependency do this in under 50 lines?
Verdict per package: INSTALL, INSTALL PINNED or REJECT, with a reason. Install nothing until I approve.
```

### Mobile and LLM features

- [ ] Tokens in Keychain or Keystore through {{?SECURE_STORAGE_LIB}}, never AsyncStorage, SharedPreferences or UserDefaults. The app bundle is public, so ship only keys restricted by bundle ID
- [ ] Verified Universal Links and App Links instead of custom URL schemes; link parameters are untrusted; OAuth in a system browser session with PKCE, never an embedded webview; pin certificates only with a backup pin and a kill switch; audit against OWASP MASVS
- [ ] LLM features (OWASP Top 10 for LLM Applications): any text the model reads can carry instructions, and the system prompt is not a boundary. The model acts with the calling user's permissions, and send, pay, delete and share need confirmation outside the model
- [ ] Model output is untrusted: render it as text or sanitized markdown, never auto-load URLs built from it (they can carry data out), never pass it to eval, SQL, a shell or a path. Retrieval obeys the matrix. Per-user token budgets and a kill switch per feature; injection cases live in the eval set

### Your AI's own access

Treat your AI like a fast, confident junior developer with full access to your laptop. Keep production credentials off the dev machine (deploy keys live in CI only), require your review on {{SENSITIVE_PATHS}}, and set your tool's permissions to allow the routine, ask for the risky, and deny the catastrophic. Rule 9 in SECURITY.md is the deny list in plain words, so it works in any tool.

A fresh AI session reviewing each branch's diff for security, with no memory of building it, is the floor. Red-Team Audit is the ceiling.

> **Pro move:** If your tool supports hooks or command allow and deny lists (Claude Code, Cursor and others do), you can enforce rule 9 automatically before every shell command. Match production secret names with word boundaries and an underscore (`prod_..._key`, `production_..._token`), or the check blocks harmless commands like `grep -rn productKey` or `echo $PRODUCT_URL`. Claude Code also has a built-in `/security-review` for the per-branch floor.

> **Trap:** Deny lists and command checks are guardrails, not a sandbox. They catch accidents, and a creative command can route around a pattern. Isolation catches the rest: no production credentials on the machine, and a container for untrusted work.

### The P7 audit

Run these three before launch, each in a fresh session. Each reports first and changes nothing until you say go.

```prompt title="Red-Team Audit"
You are an attacker, not a reviewer. Goal: {{GOAL: read another tenant's data, gain admin, use paid features free, run code on the server, or bill us for your LLM usage}} in {{?PRODUCT_NAME}}, starting from a normal {{ROLE_MEMBER}} account with insider read access to {{SCOPE}}. Test only against {{LOCAL_URL}}; never send a request to any other host.
Per area, report what you tried, the evidence (file:line, or request and response), and whether it worked:
- A01 access control: IDOR (changing an ID to reach someone else's object) on every ID-taking route, mass assignment of role or owner, privilege escalation, untested matrix rows or sync rules, SSRF. A02 misconfiguration: headers, CSP, CORS, debug modes, verbose errors, public buckets.
- A03 supply chain: unpinned, abandoned or suspicious packages, install scripts. A04 crypto: plaintext secrets, weak hashing, non-expiring tokens.
- A05 injection: SQL, NoSQL, command, template, XSS (stored, reflected, DOM), rendered user markdown. A06 insecure design: negative quantities, races on redeem or transfer, replayed webhooks, skipped flow steps.
- A07 authentication: brute force, reset-token reuse, session fixation, logout that does not invalidate, missing OAuth state or PKCE. A08 integrity: unsigned webhooks, client-trusted prices or flags, unsafe deserialization.
- A09 logging: would we notice this attack; do secrets or PII reach logs? A10: what fails open on timeouts, nulls or vendor outages?
- Mobile if present (MASVS storage, network, deep links, bundle secrets); LLM if present (direct and indirect injection, tool over-permission, output rendering, unbounded consumption).
Output findings by severity with exploit steps, impact, fix and a regression test, then the three fixes that remove the most risk per hour. Fix nothing yet.
```

```prompt title="Secrets Sweep"
Sweep for secrets. Report only, and never print a full value (first 4 characters and the location).
1. Working tree (tracked and untracked, skipping dependency and build folders) for keys, tokens, private keys, connection strings, JWTs, webhook secrets and high-entropy strings; use {{SECRET_SCANNER}} if installed.
2. Full git history on every branch: a secret that was later deleted has still leaked.
3. Outputs of {{?WEB_BUILD_CMD}} and {{?MOBILE_BUILD_CMD}} (from RULES.md §Commands): bundles and binaries; every variable exposed through {{?PUBLIC_ENV_PREFIX}}, with the reason.
4. .env.example has dummy values only; .gitignore covers env files, keystores, provisioning profiles and service-account JSON; fixtures, snapshots, sample logs and CI output are clean.
Per hit: location, type, whether it looks live (judge by format and context; never call the service), fix. Anything live: rotate, then remove, then purge history. Rotation is the fix; deletion alone is not.
```

> **Rule:** Record each accepted finding and its fix in DECISIONS.md, keep its regression test in the suite, and add a line to SECURITY.md if the same mistake could happen again.
