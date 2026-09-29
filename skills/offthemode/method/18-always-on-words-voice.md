## Always-On · Words & Voice
<!-- origin: added -->

> **Output:** `.offthemode/VOICE.md` (baseline in `~/.claude/voice.md`), one string catalog, and Copy Pass on every surface before it locks.

Words are the cheapest way to look non-generic, and the place where agents regress to the average hardest, because the web is saturated with identical SaaS copy. The banned words live in BANS.md with the visual bans (one list, one lint); VOICE.md holds what your voice *is*, with examples, which is what pulls the model somewhere instead of just away. Naming is product design too, which is why GLOSSARY.md is shared by code, UI and analytics.

```file path=".offthemode/VOICE.md"
VOICE: {{PRODUCT_NAME}} · baseline ~/.claude/voice.md · terms from .offthemode/GLOSSARY.md · banned words: ~/.claude/design/BANS.md (hype-copy, dead-copy) plus {{PRODUCT_SPECIFIC_WORDS}}
Character: {{ADJ_1}}, not {{FAILURE_1}}. {{ADJ_2}}, not {{FAILURE_2}}. {{ADJ_3}}, not {{FAILURE_3}}. (e.g. "precise, not clinical. warm, not cute. confident, not loud.") Reads like: {{REFERENCE_VOICE}}
Mechanics: sentence case; second person; "we" only when the company acts; grade 6-8 in UI; numbers, dates, currency and plurals via Intl; numbers beat adjectives; no exclamation marks; every string in {{STRINGS_PATH}}.

### Patterns
- Headlines name the outcome in the user's nouns: "Every invoice reconciled by 9am", not "Streamline your finances".
- Buttons are verb + object predicting the result: "Export 3 clips". Destructive confirms name the consequence: "Delete 12 files" / "Keep files".
- Errors: what happened, why if known, what to do next; never blame, never clear input.
- Empty states: what this space holds and why it matters, plus one action. Loading: silent before the BUDGETS.md indicator delay, specific ("Rendering 4 pages") after the progress-copy threshold.
```

```prompt title="Copy Pass"
Copy pass on {{SURFACE_OR_PATH}}; edit only user-facing strings and the catalog. Read .offthemode/VOICE.md, GLOSSARY.md and the copy ids in ~/.claude/design/BANS.md first.
1. Table every string: current | problem (banned word, vague verb, wrong term, too long, blames the user, a sentence a competitor could publish unchanged) | rewrite.
2. Every button predicts its result, every error has a next step, every empty state offers one action.
3. Cut 30% of the words without losing meaning. Flag concepts without a glossary term and propose one; where Five-Person Test notes show users' own words, prefer those.
Apply, then run {{?CHECK_CMD}}.
```
