ME · your usual setup · lives at ~/.offthemode/ME.md on this computer, outside every project · never a password, token or key
Off the Mode's setup reads this file in each new project and shows these as defaults to confirm, instead of asking again. It is written only from your answers, and you can edit it any time. Off the Mode never sends it anywhere; your AI tool reads it like any file you open with it.

## Shipping
- Code host and account: {{?CODE_HOST_ACCOUNT: for example GitHub as your handle}}
- Commit name and email: {{?COMMIT_IDENTITY: for example a handle and the host's no-reply email, so your real name and email stay out of public history}}
- Hosting and how a release goes live, one line per platform you ship (web, iOS, Android, a package); setup uses only the line for the project's platform:
  - {{?PLATFORM: web, iOS, Android or a package}}: {{?HOSTING: for example Vercel and your team's name, or none}} · {{?RELEASE_PATH: for example a push to main deploys on its own}}
