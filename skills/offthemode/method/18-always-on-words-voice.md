## Always-On · Words & Voice

> **Output:** `.offthemode/VOICE.md`, one string catalog in the code, and a Copy Pass on every surface before it is called done.

Words are the cheapest way to look non-generic, and the place where AI output slides toward the average hardest, because the web is full of identical software copy. A list of banned words only pushes the model away from bad copy. VOICE.md also says what your voice is, with examples, and that pulls it somewhere. Its character comes from PRODUCT.md §Feeling, so the words and the look say the same thing.

Naming is product design too, which is why GLOSSARY.md is shared by the code, the interface copy and the analytics. A string catalog is one file (or one per language) that holds every user-facing string by id, so all copy can be reviewed and translated in one place.

```file path=".offthemode/VOICE.md"
VOICE: {{PRODUCT_NAME}} · character from .offthemode/PRODUCT.md §Feeling · terms from .offthemode/GLOSSARY.md
Character: {{ADJ_1}}, not {{FAILURE_1}}. {{ADJ_2}}, not {{FAILURE_2}}. {{ADJ_3}}, not {{FAILURE_3}}. (e.g. "precise, not clinical. warm, not cute. confident, not loud.") Reads like: {{REFERENCE_VOICE}}
Mechanics: sentence case; second person; "we" only when the company acts; interface copy at a grade 6 to 8 reading level; numbers, dates, currency and plurals through Intl or the platform's formatter; numbers beat adjectives; no exclamation marks; every string in {{STRINGS_PATH}}.
Banned: hype copy ({{HYPE_WORDS, e.g. seamless, effortless, unlock, supercharge, revolutionary}}), dead copy ({{DEAD_COPY, e.g. Welcome to, Get started, Click here, Oops, Something went wrong}}), plus {{PRODUCT_SPECIFIC_WORDS}}.

### Patterns
- Headlines name the outcome in the user's nouns: "Every invoice reconciled by 9am", not "Streamline your finances".
- Buttons are verb + object and predict the result: "Export 3 clips". Destructive confirms name the consequence: "Delete 12 files" / "Keep files".
- Errors: what happened, why if known, what to do next. Never blame, never clear what the person typed.
- Empty states: what this space holds and why it matters, plus one action.
- Loading: nothing before indicator_delay_ms (RULES.md §Budgets); after progress_copy_ms, say exactly what is happening ("Rendering 4 pages").
```

A grade 6 to 8 reading level means text an 11 to 14 year old reads without effort; it is about speed of reading, not about talking down. Intl is the built-in formatter in JavaScript that writes numbers, dates, currency and plurals correctly for each locale; every platform has an equivalent. Using it means "1 file" and "2 files" are never glued together by hand.

```prompt title="Copy Pass"
Copy pass on {{SURFACE_OR_PATH}}. Edit only user-facing strings and the string catalog. Read .offthemode/VOICE.md (with its banned words) and .offthemode/GLOSSARY.md first.
1. Table every string: current | problem (banned word, vague verb, wrong term, too long, blames the user, a sentence a competitor could publish unchanged) | rewrite.
2. Every button predicts its result, every error has a next step, every empty state offers one action.
3. Cut 30% of the words without losing meaning. Flag concepts that have no glossary term and propose one; where notes from watching real people use the product record their own words, prefer those.
Show me the table and wait for my go. Then apply it and run the fast check from .offthemode/RULES.md §Commands.
```
