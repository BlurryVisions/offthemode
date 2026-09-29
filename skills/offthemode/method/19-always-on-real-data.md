## Always-On · Real Data
<!-- origin: added -->

> **Output:** a content model, a deterministic seed with `demo`, `edge` and `scale` profiles in `fixtures/`, and a dev-only states gallery.

Agents design for the happy path of their own placeholder content. Layout bugs, performance cliffs and awkward empty states only show up with realistic distributions and hostile edge cases, and you can't judge "stunning" on a screen full of `John Doe`.

```prompt title="Build the Seed"
Read {{CONTENT_MODEL_PATH}} (create it if missing: entities, fields, min/typical/max length, optionality, cardinality, realistic distributions for {{MARKET}}). Build a deterministic seed (fixed random seed) at {{SEED_PATH}} with @faker-js/faker or the stack's equivalent, writing to fixtures/. Profiles by env var:
- demo: the product in month six with real users in {{MARKET}}; curated and believable; used for design reviews, the landing demo and store screenshots.
- edge: every torture-set case at least once, every lifecycle state, archived records.
- scale: {{SCALE_N}} (default 10000) rows of the heaviest entity plus one power user at 100x volume.
Add a dev-only states gallery at {{STATES_ROUTE}} rendering each primary component in every state (empty, one, many, overflow, loading, error, offline, permission denied), light and dark. Screenshot it and list what breaks.
```

- [ ] Torture set: empty and exactly one (`Intl.PluralRules`, never concatenation); 10k rows; a 500-option picker; a 5,000-character paste; an 80-character unbroken word; one-character names and mononyms
- [ ] Devanagari (taller line box), Arabic/Hebrew RTL (logical properties, mirrored icons), CJK wrapping, mixed direction; emoji ZWJ sequences truncated with `Intl.Segmenter`
- [ ] 0, negative and huge numbers; Indian (1,00,000) vs Western grouping; DST boundaries; a locale that differs from the time zone; missing, 1px-tall, 8000px and broken media; `<script>` in names, zalgo, whitespace-only, pasted rich text

> **Rule:** A screen isn't designed until its screenshots have been reviewed on both the `demo` and `edge` profiles.
