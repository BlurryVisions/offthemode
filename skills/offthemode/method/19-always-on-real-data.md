## Always-On · Real Data

> **Output:** a content model, a deterministic seed with `demo`, `edge` and `scale` profiles writing to `fixtures/`, and a dev-only states gallery.

AI tools design for the happy path of their own placeholder content. Layout bugs, performance cliffs and awkward empty states only show up with realistic amounts of data and hostile edge cases, and you can't judge "stunning" on a screen full of `John Doe`.

Three terms. A content model lists each kind of record, its fields, how long each field usually runs and how often it is empty. A deterministic seed is a script that fills the app with fake but realistic data, the same data on every run, because its random generator starts from a fixed number; that is what makes screenshots comparable over time. A states gallery is a page that exists only in development and shows each main component in every state side by side.

```prompt title="Build the Seed"
Read {{CONTENT_MODEL_PATH}}. If it is missing, draft it first (entities, fields, min/typical/max length, optionality, cardinality, realistic distributions for {{MARKET}}). Show me the content model and the seed plan (profiles, files, the states route).
Then build a deterministic seed (fixed random seed) at {{SEED_PATH}} with @faker-js/faker or the stack's equivalent, writing to fixtures/. Profiles by environment variable:
- demo: the product in month six with real users in {{MARKET}}; curated and believable; used for design reviews, the landing page demo and store screenshots.
- edge: every case in the torture set pasted below at least once, every lifecycle state, archived records.
- scale: {{SCALE_N | 10000}} rows of the heaviest entity, plus one power user at 100x the usual volume.
Add a dev-only states gallery at {{STATES_ROUTE}} that renders each primary component in every state (empty, one, many, overflow, loading, error, offline, permission denied), light and dark. Screenshot it and list what breaks.
```

Paste the torture set below the prompt so the `edge` profile covers all of it.

- [ ] Empty and exactly one (plurals through `Intl.PluralRules`, never by joining strings); 10k rows; a 500-option picker; a 5,000-character paste; an 80-character word with no break points; one-character names and people with a single name
- [ ] Devanagari (it needs a taller line box), Arabic and Hebrew right to left (CSS logical properties such as `margin-inline-start`, mirrored icons), Chinese, Japanese and Korean line wrapping, mixed direction in one line; emoji built from joined sequences (families, flags, skin tones) cut with `Intl.Segmenter` so they are never split in half
- [ ] 0, negative and huge numbers; Indian grouping (1,00,000) next to Western grouping (100,000); daylight-saving boundaries; a locale that differs from the time zone; missing, 1px-tall, 8000px-tall and broken media; `<script>` in names, zalgo text (letters stacked with combining marks), whitespace-only input, pasted rich text

> **Rule:** A screen isn't designed until its screenshots have been reviewed on both the `demo` and `edge` profiles.
