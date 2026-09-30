## P7 · Security Hardening

### Working rules (for a change inside an existing product)
- Authorization is checked on the server (or in the sync rules) for every action: deny by default, at the object level. Hiding a button is not security.
- Validate every input at the boundary and reject unknown fields. Parameterized queries only; never build SQL, shell commands, paths or URLs from user input.
- No secret in code, logs, bundles, fixtures or commits. If you see one, stop and say so.
- Ask before adding, removing or upgrading a dependency, and check its exact name in the official docs and the registry first.
- Follow .offthemode/SECURITY.md if it exists. If it doesn't and this is the first work on login, permissions, input, uploads, secrets, payments or AI features, offer to write it (below) before the change.
- Open the whole guide to write SECURITY.md, to add a trust boundary, and for the audit before launch.

These are the guide's working rules, for a change inside an existing product. Open the whole guide, `../15-p7-security-hardening.md`, when you start this phase or change its structure.
