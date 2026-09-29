## P7 · Security Hardening
<!-- origin: moved -->

> **Output:** `.offthemode/SECURITY.md` (imported every session through AGENTS.md), an authorization matrix with generated tests, RLS or sync rules, the bash guard hook, and the findings of Red-Team Audit, Dependency Provenance Check and Secrets Sweep, all before real users, money or data arrive.

Security at the end is the most expensive place to do it. Retrofitting authz across 40 endpoints means touching all 40. A key leaked in commit 12 lives in git history forever. And an agent with no rules will put the service key in the client, because the tutorial it's pattern-matching did. So security runs through every phase, and P7 is the adversarial audit.

| Where | Security work |
|---|---|
| P0 | SECURITY.md imported; permissions; bash guard |
| P1 | Threat sketch; draft authorization matrix |
| P4 | Secrets manager, `can()` + RLS (or sync rules), rate limits, backups |
| P6, every slice | Matrix row + deny tests, boundary validation, an abuse-path test |
| P7 | Red-team, provenance, secrets sweep, restore drill, mobile and LLM passes |

```prompt title="Threat Model the Skeleton"
Run at the end of P1 (product and complex tiers). As a security architect, threat-model {{?PRODUCT_NAME}} from .offthemode/SKELETON.md and PRODUCT.md. Platforms {{web | iOS | Android}}; sensitive data {{PII | payments | health | minors | UGC}}.
1. Data flow in mermaid with every trust boundary (client-API or client-sync, API-DB, third parties, webhooks, storage, admin, jobs, LLM calls).
2. STRIDE per boundary, plausible threats only. Top {{N}}: threat, boundary, letter, likelihood, impact, mitigation, the test that proves it, the phase that builds it.
3. The assets an attacker wants most and the cheapest path to each.
4. Decisions expensive to change later (tenant model, auth provider, ID format, where authz lives), with a recommendation now.
Propose SECURITY.md changes as a diff.
```

Broken access control is A01 in the OWASP Top 10:2025 (which replaced the 2021 list), and it now folds in SSRF. Type checks and happy-path tests never catch it, so write the matrix before the endpoints. Deny by default, and check at the object level ("can this user edit project 8f3a", not "can members edit projects"). IDs in URLs are attacker input, and hiding things in the client is UX, not security. With a sync engine, the same matrix drives its sync rules, and the generated tests run against the rules.

| Resource | Action | {{ROLE_ANON}} | {{ROLE_MEMBER}} | {{ROLE_ADMIN}} | {{ROLE_OWNER}} | Condition |
|---|---|---|---|---|---|---|
| {{RESOURCE}} | read | no | own | org | all | Admin also sees soft-deleted |
| {{RESOURCE}} | update | no | own | org | all | Locked after {{LOCK_STATE}} |
| billing | manage | no | no | no | yes | Re-auth within 10 min |

```sql
alter table {{TABLE}} enable row level security;
alter table {{TABLE}} force row level security;
create policy {{TABLE}}_tenant on {{TABLE}}
  using (org_id = current_setting('app.org_id')::uuid)
  with check (org_id = current_setting('app.org_id')::uuid);
-- the API runs `set local app.org_id = ...` inside each request's transaction
```

> **Pro move:** Make the matrix a typed object in `{{POLICY_MODULE}}`, and have it drive both the policy function and a generated test suite that tries every role x resource x action. Docs and enforcement can't drift, because they're one object.

- [ ] Inputs schema-validated, unknown fields rejected; parameterized queries; no SQL, shell or path from strings; every raw-HTML sink sanitized; `javascript:` URLs rejected
- [ ] Errors fail closed with no stacks, SQL or foreign IDs (A10:2025); CSRF via SameSite plus a token or Origin check; GET never mutates; CORS allowlist, never `*` with credentials
- [ ] Session cookie `HttpOnly; Secure; SameSite=Lax` with the `__Host-` prefix, rotated on login and privilege change; nonce CSP run as `Report-Only` for a week first
- [ ] Rate limits per IP and account on login, signup, OTP, reset, invites, search, exports, sends and paid APIs, with progressive delay rather than a lockout attackers can trigger
- [ ] Uploads: size cap, magic-byte check, images re-encoded, random keys, private buckets, short-lived presigned URLs, separate serving domain
- [ ] SSRF: one fetch function for user URLs that allowlists schemes, resolves DNS, blocks private, loopback, link-local and metadata (169.254.169.254) ranges, and re-checks every redirect
- [ ] Logs use a field allowlist; auth failures alert; backups encrypted, copied outside the primary account, and actually restored once

```http
Content-Security-Policy: default-src 'self'; script-src 'nonce-{{NONCE}}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Slopsquatting.** Supply chain failures are A03:2025, and agents add a new vector. Models hallucinate plausible package names, attackers register those names with malware inside, and an agent that installs one runs the install script on your machine. Commit the lockfile, install exactly from it in CI (`npm ci`, `pnpm install --frozen-lockfile`, or your stack's equivalent), turn install scripts off by default, and vet every new dependency.

```prompt title="Dependency Provenance Check"
Verify before installing: {{PACKAGE_LIST}}, or every dependency added since {{GIT_REF}} (diff manifest and lockfile). Query the registry directly ({{npm view <pkg> | PyPI JSON API | pub.dev | Maven Central | Swift Package Index}}). Per package:
1. Does the exact name match the library's official install docs (link)? Flag typos, hyphen/underscore swaps, wrong scopes, "-js" or "-official" suffixes.
2. First-publish and latest-release dates (flag under 90 days or a recent maintainer change); downloads and dependents versus expected popularity; a repo link that resolves and matches.
3. Install scripts and what they run; new transitive dependencies, size, advisories.
4. Could the platform or an existing dependency do this in under 50 lines?
Verdict: INSTALL, INSTALL PINNED or REJECT, with a reason. Install nothing until I approve.
```

**Mobile and LLM.**
- [ ] Tokens in Keychain / Keystore via {{SECURE_STORAGE_LIB}}, never AsyncStorage, SharedPreferences or UserDefaults. The bundle is public, so ship only keys restricted by bundle ID
- [ ] Verified Universal Links / App Links instead of custom schemes; link params untrusted; OAuth in a system browser session with PKCE, never an embedded webview; pin certificates only with a backup pin and a kill switch; audit against OWASP MASVS
- [ ] LLM features (OWASP Top 10 for LLM Applications): any text the model reads can carry instructions, and the system prompt is not a boundary. The model acts with the calling user's permissions, and send, pay, delete and share need confirmation outside the model
- [ ] Model output is untrusted: render it as text or sanitized markdown, never auto-load URLs built from it (an exfiltration channel), never pass it to eval, SQL, a shell or a path. Retrieval obeys the matrix. Per-user token budgets and a kill switch per feature; injection cases live in the eval set

**Agent safety.** Treat the agent like a fast, confident junior with root on your laptop. No production credentials on the dev machine (deploy keys live in CI only), human review on {{SENSITIVE_PATHS}}, and allow the routine, ask for the risky, deny the catastrophic (P0 settings). `/security-review` on every branch is the floor, and Red-Team Audit is the ceiling.

The guard reads the command from Claude Code's payload or Cursor's, and exit code 2 blocks in both. The production-secret pattern needs word boundaries and an underscore, or it blocks harmless commands like `grep -rn productKey` or `echo $PRODUCT_URL`.

```file path=".claude/hooks/guard-bash.sh"
#!/usr/bin/env bash
# PreToolUse (Claude Code) / beforeShellExecution (Cursor) guard. Exit 2 blocks the command and shows stderr. Needs jq; chmod +x.
cmd="$(jq -r '.tool_input.command // .command // ""')"
patterns=(
  'rm -rf (/|~|\$HOME)'
  'git push .*(--force|-f)( |$)'
  'git reset --hard origin'
  '--no-verify'
  '(drop|truncate) (table|database|schema)'
  'terraform (apply|destroy)'
  '(curl|wget) [^|]*\| *(ba|z)?sh'
  '(cat|head|tail|less) [^|]*\.env($|[^.]|\.local|\.prod)'
  '(^|[^a-z0-9_])(prod|production)_[a-z0-9]*_?(url|key|secret|token)([^a-z0-9_]|$)'
)
# add project-specific patterns above, e.g. {{EXTRA_BLOCKED_PATTERN}}
for p in "${patterns[@]}"; do
  if printf '%s' "$cmd" | grep -Eiq -- "$p"; then
    echo "Blocked by guard-bash.sh ($p). Explain why it is needed and ask the human to run it." >&2
    exit 2
  fi
done
exit 0
```

> **Trap:** Deny rules and regex hooks are guardrails, not a sandbox. They catch accidents, and a creative command can route around a pattern. Isolation catches the rest: no prod credentials on the machine, and a container for untrusted work.

```file path=".offthemode/SECURITY.md"
SECURITY RULES: {{PROJECT_NAME}} · imported every session. These override convenience; if one blocks you, stop and say so, never work around it.
1. Authorization is server-side (or in the sync rules), deny-by-default, object-level, per the matrix in {{POLICY_MODULE}}. Client checks are UX only.
2. Schema-validate every input at the boundary; reject unknown fields; parameterized queries only; never build SQL, shell, paths or URLs from user input.
3. Secrets never appear in code, logs, bundles, binaries, fixtures, prompts or commits; refer to env var names. If you see a secret, stop and tell me.
4. You have no production access and must not seek it. Never read real .env files, ~/.ssh, ~/.aws or credential stores.
5. Ask before adding, removing or upgrading any dependency; verify the exact name in official docs and the registry first.
6. Errors fail closed and leak no internals. Log only via {{LOGGER_MODULE}} and its field allowlist: never tokens, passwords, payment data or raw bodies.
7. Fetch user-supplied URLs only through {{SAFE_FETCH_MODULE}}. LLM output is untrusted input; LLM tools run with the calling user's permissions.
8. Sensitive paths {{SENSITIVE_PATHS}}: stop, summarize the security impact, wait for human review.
Stack: session {{AUTH_PROVIDER}} (HttpOnly, Secure, SameSite=Lax, __Host-, rotated on login) · CSP via {{HEADERS_MODULE}} · CORS {{ALLOWED_ORIGINS}} · rate limits {{RATE_LIMIT_MODULE}} · RLS or sync rules on {{TABLES}} · uploads {{UPLOAD_POLICY}} · mobile storage {{SECURE_STORAGE_LIB}}
Every slice: - [ ] matrix row + deny tests for wrong role and wrong owner - [ ] inputs validated, errors fail closed, one abuse-path test - [ ] no new secrets, dependencies or sensitive-path edits without sign-off
Threat model: {{THREAT_MODEL_LINK}}; update it when a trust boundary is added.
```

```prompt title="Red-Team Audit"
You are an attacker, not a reviewer. Goal: {{GOAL: read another tenant's data | gain admin | use paid features free | run code on the server | bill us for your LLM usage}} in {{?PRODUCT_NAME}}, starting from a normal {{ROLE_MEMBER}} account with insider read access to {{SCOPE}}. Test only against {{LOCAL_URL}}; never send a request to any other host.
Per area, report what you tried, the evidence (file:line, or request and response), and whether it worked:
- A01 access control: IDOR on every ID-taking route, mass assignment of role or owner, privilege escalation, untested matrix rows or sync rules, SSRF. A02 misconfiguration: headers, CSP, CORS, debug modes, verbose errors, public buckets.
- A03 supply chain: unpinned, abandoned or suspicious packages, install scripts. A04 crypto: plaintext secrets, weak hashing, non-expiring tokens.
- A05 injection: SQL, NoSQL, command, template, XSS (stored, reflected, DOM), rendered user markdown. A06 insecure design: negative quantities, races on redeem or transfer, replayed webhooks, skipped flow steps.
- A07 authentication: brute force, reset-token reuse, session fixation, logout that doesn't invalidate, missing OAuth state or PKCE. A08 integrity: unsigned webhooks, client-trusted prices or flags, unsafe deserialization.
- A09 logging: would we notice this attack; do secrets or PII reach logs? A10: what fails open on timeouts, nulls or vendor outages?
- Mobile if present (MASVS storage, network, deep links, bundle secrets); LLM if present (direct and indirect injection, tool over-permission, output rendering, unbounded consumption).
Output findings by severity with exploit steps, impact, fix and a regression test, then the three fixes that remove the most risk per hour. Fix nothing yet.
```

```prompt title="Secrets Sweep"
Sweep for secrets; report only, never print a full value (first 4 characters and location).
1. Working tree (tracked and untracked, skipping dependency and build folders) for keys, tokens, private keys, connection strings, JWTs, webhook secrets, high-entropy strings; use {{SECRET_SCANNER}} if installed.
2. Full git history on every branch: a secret later deleted has still leaked.
3. Outputs of {{WEB_BUILD_CMD}} and {{MOBILE_BUILD_CMD}}: bundles and binaries; every var exposed via {{PUBLIC_ENV_PREFIX}}, with the reason.
4. .env.example has dummy values only; .gitignore covers env files, keystores, provisioning profiles, service-account JSON; fixtures, snapshots, sample logs and CI output are clean.
Per hit: location, type, whether it looks live (judge by format and context; never call the service), fix. Anything live: rotate, then remove, then purge history. Rotation is the fix; deletion alone is not.
```
