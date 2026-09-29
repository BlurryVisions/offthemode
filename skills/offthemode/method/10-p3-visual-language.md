## P3 · Visual Language
<!-- origin: yours -->

> **Output:** `~/.claude/design/TASTE.md` and `USED.md` (global, maintained across projects), `.offthemode/DESIGN.md`, `.offthemode/design/` (refs, PRINCIPLES, DIRECTIONS), locked `src/styles/tokens.css` (+ `tokens/tokens.json` for native), a `/specimen` page rendering every state, the ban-lint hook, the shots and audit scripts from your stack pack, and the global `design-critic` subagent.

No product screen gets built before the tokens are locked and the specimen exists. This is where "complex inside, simple outside" becomes visible: restraint, hierarchy and motion make a dense system read as one calm surface with one obvious next move.

> **Rule:** Prove a direction on the product's hardest real screen (the dense core surface), never on a landing page. A direction that only works on a hero is a poster, not a language.

Ask for "a modern, clean landing page" and you get the argmax: centered hero, gradient headline, pill badge, logo marquee, three icon cards, bento, three pricing tiers, FAQ, all in Inter with `rounded-xl shadow-sm` and `from-blue-500 to-purple-600`. "Modern, clean, sleek" are the words that sat next to millions of those templates, and if `rounded-lg` exists, it's the most probable token. Three levers move the output. **References** shift the conditioning. **Tokens** shrink the output space: if the radius family is one value and its concentric derivatives, the rounded-xl card can't happen, and a constraint that lives in code survives compaction. **Bans with reasons and replacements** name the exit, and the reason generalizes to cases you never listed.

> **Trap:** "Make it unique." The model has seen "unique" next to its second mode: black background, border beams, gradient text, glass. And by 2026 there's a third mode, the anti-slop look itself (warm paper, graphite, one signal colour, uppercase mono labels, hairlines instead of cards), because every anti-slop skill and thread pushes agents there. Defining yourself against the average only moves you to the next average. The exit that doesn't converge is your own taste, written down once.

### Your taste, captured once

The GLOBAL layer is supposed to carry what *you* love, and bans can't do that: a ban says where not to go, never where to go. So before your first project on the kit, and every six months after, run Taste Extraction on 20 things you love and 20 you can't stand. The output, `~/.claude/design/TASTE.md`, is what makes "unique" mean "recognisably mine" rather than "unlike the average". Extract Principles, Three Divergent Directions and design-critic all load it.

The second global file is a novelty ledger. The kit gets copied into every repo, so whatever worked last time becomes your personal mode, and project 3 quietly looks like project 1. `USED.md` records each shipped project's faces, hues, grid, surfaces and signature pattern, and the directions prompt treats it as a ban list.

```prompt title="Taste Extraction"
One-time global ritual; rerun every six months. ~/.claude/design/anchors/love/ and anchors/hate/ each hold about 20 things (sites, apps, posters, objects, film frames, type specimens, rooms), each with one line of why. Motion anchors are frame strips with measured duration and easing notes, never stills.
1. For each anchor: the ONE decision that makes me react, and what it costs. Do not describe the image.
2. Eight personal principles as falsifiable sentences, each traced to 2+ loves and contradicted by 1+ hate ("type carries hierarchy; colour only ever means state" is a principle; "clean and bold" is not).
3. My recurring moves in type, colour, motion, density and copy.
4. Which traits of my hates the generic AI look shares, and which traits of my loves the 2026 anti-slop look shares. Both are modes I can fall into.
5. Five tensions between things I love. This is where my products get their edge: a direction that resolves one of them is already off the mode.
Then interview me in rounds of at most 5 numbered questions on the tensions and on anything I contradicted, each with your read as the default. Write ~/.claude/design/TASTE.md from its template, under 60 lines. If a previous version exists, end with the diff: what I stopped loving, what is new, which principle got sharper.
```

```file path="~/.claude/design/TASTE.md"
TASTE · {{YOUR_NAME}} · v{{N}} · {{DATE}} · under 60 lines · regenerate every six months with Taste Extraction and keep the diff

### Principles (falsifiable; each traced to 2+ loves and contradicted by 1+ hate)
1. {{PRINCIPLE}} · loves {{L03, L11}} · hates {{H07}}

### Recurring moves
Type {{}} · Colour {{}} · Motion {{}} · Density {{}} · Copy {{}}

### What my hates share with the generic AI look
- {{TRAIT}}

### What my loves share with the 2026 anti-slop look (use knowingly)
- {{TRAIT}}

### Tensions (where my products get their edge)
1. {{I love A (L02) and B (L09); a product that holds both looks like ...}}

### Never, for me
- {{}}
```

```file path="~/.claude/design/USED.md"
USED · one row per shipped project; Project Retro appends. Three Divergent Directions reads this as a ban list: no direction may share more than one attribute (column) with any row. Pre-seeded with the blueprint's illustrations, so they are banned from day one.

| Project | Date | Display / text faces | Neutral hue, chroma | Accent hue, strategy | Grid model | Surface treatment | Signature pattern |
|---|---|---|---|---|---|---|---|
| (illustration) Soft Machine | - | Fraunces / Atkinson Hyperlegible Next | 20, 0.03 | 350, colour-led | object tiles | tonal colour fields | object inflates out of its button |
| (illustration) Bench Instrument | - | Berkeley Mono / IBM Plex Sans Condensed | 250, 0.006 | 85, single signal | dense ruled table | rules only, no fills | readout ticks digit by digit |
| (illustration) Contact Sheet | - | Newsreader / Hanken Grotesk | none, 0 | none, photography | editorial columns | full-bleed imagery | thumbnail becomes the hero |
| (retired draft) Signal Room | - | serif display / grotesk / pixel mono | 75, 0.008 | 35 vermilion, scarce | label rail + columns | warm paper, hairlines | key number settles on a spring |
| {{PROJECT}} | {{DATE}} | {{}} | {{}} | {{}} | {{}} | {{}} | {{}} |
```

### Taste sourcing, dated 2026-09

Re-review these tables and BANS.md §Saturated in every Project Retro; anything that shows up in a template marketplace moves to Saturated. Save references as images in `.offthemode/design/refs/` with a one-line note each, and motion references as frame strips with measured duration, easing and overshoot (a still of an animation loses the only thing you were referencing). A bare URL fetch returns HTML, not feel. Keep the two jobs apart: the agent learns **how** to build from craft teachers and **what** it looks like from you, mostly by way of sources outside software.

| Craft: how to build it, never the look | Take |
|---|---|
| Rauno Freiberg, Emil Kowalski (animations.dev), Paco Coursey, Jakub Krehel | Details that survive extreme input; when not to animate |
| Benji Taylor (benji.org/family-values) | Components that morph instead of navigating |
| Bartosz Ciechanowski, Maxime Heckel | Complex systems made legible by direct manipulation; shaders at source level |
| Jhey Tompkins, Cyd Stumpel, Matt Perry (motion.dev), Josh W. Comeau | Scroll-driven and view transitions in production; springs, `linear()` easing |
| basement.studio, darkroom.engineering, Lusion, 14islands | Scroll feel and transition pacing |
| Base UI, React Aria, Radix; cmdk, Sonner, Vaul, NumberFlow, Paper Shaders | Unstyled behaviour, always restyled. shadcn/ui wraps cmdk, Sonner and Vaul, so their default look is the average toast |
| Mobbin, Refero, 60fps.design | Platform conventions, flows and mobile motion timing |

| Taste: what it looks like | Take |
|---|---|
| Your `anchors/love/` and your own Are.na channels | The only source that is recognisably you |
| Letterform Archive; Standards Manual reissues | Systems in print: grids, signage, identity manuals |
| Art of the Title | Pacing, reveals, type in motion |
| Foundry specimens: Future Fonts, Velvetyne, Collletttivo, UNCUT.wtf, Departure Mono; Dinamo, Grilli Type, Klim, OH no Type Co | Faces nobody else has yet, and how a type designer stages a face |
| Museum and exhibition identities; hardware manuals and instrument panels; record sleeves | Constraint-driven layout, labelling, one bold move per object |
| Godly, Siteinspire, Minimal Gallery, Hoverstat.es, Cosmos | The fringe of the web; check every trait against BANS.md §Saturated first |
| Fonts In Use | Saturation evidence for faces |

What's already saturated lives in one place, `BANS.md` §Saturated (The files, below): bento, glass, the purple-glow dark mode, the serif-italic headline word, the template display faces, and now the anti-slop look itself. A saturated trait needs a written product reason in DECISIONS.md. Anthropic's `frontend-design` skill is a floor, not a ceiling: when everyone installs the same anti-slop skill, its escape routes become the next average, which is why TASTE.md and USED.md sit on top of it.

```prompt title="Saturation Check"
For each trait in .offthemode/design/directions/*.md and .offthemode/DESIGN.md (faces, colour strategy, grid model, surface treatment, motion signature, layout device), estimate how saturated it is. Search if you can (Fonts In Use, Framer and Webflow template marketplaces, recent design-award galleries, all from the last 12 months); otherwise say you are estimating. Roughly 20+ hits, or a match in ~/.claude/design/BANS.md §Saturated, means mainstream: keep it only with a written product reason as a D-### entry, or replace it with a move derived from a TASTE.md tension.
Output: Trait | Evidence | Verdict (keep with reason | replace) | Replacement.
```

**Process.** (1) Build a moodboard of 30-60 references, at least half from outside software. (2) Run Extract Principles, which reads TASTE.md, so the principles are yours before they're this product's. (3) *You* assign each of three directions an external anchor from the moodboard and one forbidden trait, before anything is generated. (4) Build each direction in its own worktree and a fresh session that can't see the others (in Claude Code, a builder subagent with `isolation: worktree` does both), then merge the three `dir/*` branches into a `lab` branch; they touch disjoint paths, so they merge cleanly. (5) Check divergence after the fact: `scripts/diverge-diff.sh` flags any pair sharing more than half its knob values, and design-critic judges from screenshots only. (6) design-critic recommends a base and at most two grafts in a separate call; you choose, because averaging all three gets you the mode back. (7) Run Saturation Check, lock tokens v1, build the specimen. After that, every screen is assembly, not invention.

> **Why:** A single session that builds A, B and C in sequence conditions B on A and C on both, and picks its own axes, so you get the mode three times in three fonts. Separate contexts and axes you assigned are what make the samples independent; a checker that didn't author them is what makes "they differ" true.

```prompt title="Extract Principles From References"
Act as a design director with a type designer's eye. .offthemode/design/refs/ holds {{N}} reference images (motion refs as frame strips) with notes. Product: {{?PRODUCT_ONE_LINER}}. Person: {{?PERSON}}. Moment of value: {{?MOMENT_OF_VALUE}}. My taste: ~/.claude/design/TASTE.md.
Do not describe the images. Per reference: the ONE decision that makes it work, what it costs, why it works perceptually.
Then synthesize 6-8 PRINCIPLES for this product. Each is a falsifiable sentence, not an adjective; traced to refs by filename and to a TASTE.md principle or tension; expressed in type, colour, layout, motion and copy; paired with its failure mode (how an agent would misapply it into cliche).
Also list: shared traits that are only current fashion or appear in ~/.claude/design/BANS.md §Saturated (dropped); 3 tensions between refs to resolve; what NONE of the refs do that this product's job demands. Never copy a layout, logo or signature element. Write .offthemode/design/PRINCIPLES.md.
```

```prompt title="Three Divergent Directions"
Direction {{A | B | C}} of three for {{?PRODUCT_NAME}}. You are in worktree dir/{{a | b | c}}, in a fresh session. The other directions exist elsewhere; do not look for them.
Anchor, assigned by me: {{REF_FILE in .offthemode/design/refs/}}; take {{WHAT_TO_TAKE}}. Forbidden trait: {{TRAIT}}.
Read ~/.claude/design/TASTE.md, .offthemode/design/PRINCIPLES.md, ~/.claude/design/BANS.md and ~/.claude/design/USED.md. USED.md is a ban list: share at most one attribute with any row.
Deliver: a two-word name and a one-sentence thesis naming the metaphor, the density and the colour strategy; src/styles/directions/{{a | b | c}}.css using the tokens.css variable names; /lab/{{a | b | c}}/core ({{?HARDEST_SCREEN}} on the edge seed: long names, empty, max rows, error) and /lab/{{a | b | c}}/entry ({{?SECOND_SCREEN}}); a working signature moment; light and dark.
Constraints: no HARD ban and no DEFAULT-OFF ban; one primary action per surface; real copy in the product's voice; no new dependency without a reason. Touch only the direction file and /lab/{{a | b | c}}.
Finish: run {{?SHOTS_CMD}} on both routes and write .offthemode/design/directions/{{a | b | c}}.md: thesis, bet, weakest point, the TASTE.md tension it resolves. Do not compare yourself to anything and do not recommend.
```

```file path="scripts/diverge-diff.sh"
#!/usr/bin/env bash
# Flags direction pairs that share more than half of their knob values. Usage: scripts/diverge-diff.sh src/styles/directions/*.css
knobs() { grep -oE -- '--[a-z0-9-]+: *[^;]+' "$1" | sed 's/: */=/' | sort -u; }
fail=0
for a in "$@"; do for b in "$@"; do
  [[ "$a" < "$b" ]] || continue
  shared=$(comm -12 <(knobs "$a") <(knobs "$b") | wc -l); total=$(knobs "$a" | wc -l)
  if [ $((shared * 2)) -gt "$total" ]; then echo "$a ~ $b: $shared of $total knob values identical; redo one"; fail=1; fi
done; done
exit $fail
```

```prompt title="Design Critique Against Rubric"
Run as design-critic on {{ROUTES or "the three lab directions"}}. Inputs: the screenshots in shots/, ~/.claude/design/RUBRIC.md and its anchors, ~/.claude/design/TASTE.md and USED.md, .offthemode/design/PRINCIPLES.md.
Judge pairwise, never absolutely. Per screen and criterion: "is the screen better than anchor N on this criterion? screen / anchor / tie", naming the region that decides it ("lab-b-core-390-light.png, top right: three accent roles compete"). Compare against the 2-anchor on every criterion, and against the 3-anchor on Distinctiveness and Signature moment. You are run twice with the order swapped; judge only the order you were given.
Then: the logo-swap test (the product this could be mistaken for, any USED.md row it resembles, or "none"); the 3 changes that would flip the most losses, as token, property or element changes; the best idea worth grafting elsewhere.
Comparing directions: also judge divergence from the screenshots alone, then recommend one base plus at most 2 grafts and flag conflicts. You built none of them; never average them.
```

```prompt title="Build the Specimen Page"
tokens.css is locked at v1. Build /specimen, one page rendering the whole language:
1. Type: every scale step with token, size, leading, tracking; a paragraph at measure; tabular vs proportional numerals; mono.
2. Colour: every token as a swatch with its oklch value, its WCAG contrast ratio against bg, surface-1 and surface-2, and APCA Lc as a second opinion, light and dark side by side. Every ink/surface and on-accent/accent pair must meet the BUDGETS.md text ratio (large-text ratio at WCAG large sizes); {{?AUDIT_CMD}} fails the run when one doesn't.
3. Space, radii (with their concentric inner values), lines, elevation as rulers. Motion: every duration x easing and spring as a replayable demo beside its reduced-motion variant.
4. Components in ALL states (default, hover, focus-visible, pressed, disabled, loading, error, empty): buttons (primary, secondary, quiet), input, select, checkbox, switch, tabs, menu, dialog, sheet, toast, tooltip, table row, list item, skeleton, empty state.
5. Data: a line, bar, area and table on the scale seed with the --data-* tokens and the highlight rule, direct labels, and designed empty, partial and loading chart states; the shots run adds a deuteranopia and a protanopia pass via Emulation.setEmulatedVisionDeficiency.
6. A real {{?HARDEST_SCREEN}} fragment built only from the parts above, and the signature moment in isolation.
Behaviour from {{PRIMITIVES_LIB}}; styling is ours. Zero raw colour, size or duration values in component files (1px hairlines excepted). Theme and reduced-motion toggles at the top. Then run the Screenshot Critique Loop on /specimen.
```

### Tokens are the contract

Tokens are the one design artifact the agent can't misread, and `tokens.css` is the single owner of every motion, type and space value: prompts and docs refer to `--dur-quick`, never to a number. Build colour in OKLCH: equal lightness steps look equal (HSL doesn't give you that), and states come from relative colour syntax instead of new hex values. The template is parametric. Set about ten knobs and everything else derives. Its comments name ranges, not a look; the look is DESIGN.md's call. Harmonizer (OKLCH plus APCA) and oklch.com help with palettes, and Utopia with fluid type.

The dark block appears twice on purpose. The media query serves the OS setting for real users; the attribute serves the in-app toggle and every screenshot run. With only the attribute, a browser emulating dark mode renders the light theme, and every "checked in both themes" claim checks a theme that was never drawn.

```file path="src/styles/tokens.css"
/* {{PRODUCT_NAME}} visual contract v{{VERSION}}. Components consume these names only; this file owns every motion, type and space value.
   Multi-platform: generate this file from tokens/tokens.json (DTCG). Knob comments give ranges, not a look. */
:root {
  /* knobs */
  --hue-neutral: {{NEUTRAL_HUE}};       /* 0-360 */
  --chroma-neutral: {{NEUTRAL_CHROMA}}; /* 0 achromatic, ~0.01 faint tint, 0.03+ clearly coloured surfaces */
  --hue-accent: {{ACCENT_HUE}};         /* 0-360 */
  --chroma-accent: {{ACCENT_CHROMA}};   /* ~0.08 muted to ~0.22 vivid in sRGB; P3 override below */
  --l-accent: {{ACCENT_L}};             /* <= 0.58 with a light --on-accent; above ~0.62, --on-accent must be dark ink */
  --type-ratio: {{TYPE_RATIO}};         /* ~1.125 to ~1.333; smaller is denser */
  --density: {{DENSITY}};               /* ~0.875 to ~1.125 */
  --radius-base: {{RADIUS_BASE}};       /* any value, one family; nested radii are concentric (inner = outer - padding), defined as tokens below */

  /* type: one surface uses at most 4 steps of this scale */
  --font-display: {{FONT_DISPLAY}};
  --font-text: {{FONT_TEXT}}, system-ui, sans-serif;
  --font-mono: {{FONT_MONO}}, ui-monospace, monospace;
  --text-xs: calc(1rem / pow(var(--type-ratio), 2));
  --text-sm: calc(1rem / var(--type-ratio));
  --text-base: 1rem;
  --text-lg: calc(1rem * var(--type-ratio));
  --text-xl: calc(1rem * pow(var(--type-ratio), 2));
  --text-2xl: calc(1rem * pow(var(--type-ratio), 3));
  --text-display: {{DISPLAY_CLAMP}};    /* its jump from base is a DESIGN.md decision */
  --leading-tight: 1.05; --leading-body: 1.5;
  --tracking-display: -0.02em; --tracking-label: {{TRACKING_LABEL}}; --measure: 66ch;

  /* space: 4px grid x density */
  --u: calc(0.25rem * var(--density));
  --space-1: var(--u); --space-2: calc(var(--u) * 2); --space-3: calc(var(--u) * 3);
  --space-4: calc(var(--u) * 4); --space-6: calc(var(--u) * 6); --space-8: calc(var(--u) * 8);
  --space-12: calc(var(--u) * 12); --space-16: calc(var(--u) * 16); --space-24: calc(var(--u) * 24);

  /* colour, light */
  --bg:        oklch(0.985 var(--chroma-neutral) var(--hue-neutral));
  --surface-1: oklch(0.962 var(--chroma-neutral) var(--hue-neutral));
  --surface-2: oklch(0.935 var(--chroma-neutral) var(--hue-neutral));
  --line:      oklch(0.885 var(--chroma-neutral) var(--hue-neutral));
  --ink-3:     oklch(0.52 var(--chroma-neutral) var(--hue-neutral)); /* meta text: clears 4.5:1 on bg and both surfaces */
  --ink-2:     oklch(0.40 var(--chroma-neutral) var(--hue-neutral));
  --ink-1:     oklch(0.20 var(--chroma-neutral) var(--hue-neutral));
  --accent:       oklch(var(--l-accent) var(--chroma-accent) var(--hue-accent));
  --accent-press: oklch(from var(--accent) calc(l - 0.06) c h);
  --accent-wash:  oklch(from var(--accent) 0.95 calc(c * 0.25) h);
  --on-accent: {{ON_ACCENT}};           /* light text when --l-accent <= 0.58, dark ink above ~0.62 */
  --ok: oklch(0.5 0.13 150); --warn: oklch(0.52 0.14 70); --danger: oklch(0.52 0.19 27); /* usable as text and as fills under light text */

  /* data: categorical hues rotate from the accent at equal chroma; lightness alternates two bands so neighbours separate under colour-blind simulation */
  --data-l1: 0.55; --data-l2: 0.65; --data-c: 0.13;
  --data-1: oklch(var(--data-l1) var(--data-c) var(--hue-accent));
  --data-2: oklch(var(--data-l2) var(--data-c) calc(var(--hue-accent) + 60));
  --data-3: oklch(var(--data-l1) var(--data-c) calc(var(--hue-accent) + 120));
  --data-4: oklch(var(--data-l2) var(--data-c) calc(var(--hue-accent) + 180));
  --data-5: oklch(var(--data-l1) var(--data-c) calc(var(--hue-accent) + 240));
  --data-6: oklch(var(--data-l2) var(--data-c) calc(var(--hue-accent) + 300));
  --data-seq-lo: oklch(from var(--accent) 0.93 calc(c * 0.3) h); --data-seq-hi: var(--accent);
  --data-div-neg: oklch(var(--data-l1) var(--data-c) calc(var(--hue-accent) + 180)); --data-div-mid: var(--surface-2); --data-div-pos: var(--accent);

  /* shape and depth: lines and tonal steps first; shadows only for overlays */
  --radius-1: var(--radius-base); --radius-2: calc(var(--radius-base) * 2); --radius-full: 999px;
  --radius-inner-2: max(0px, calc(var(--radius-2) - var(--space-2)));  /* a radius-2 container with space-2 padding */
  --hairline: 1px solid var(--line);
  --shadow-overlay: 0 16px 40px -12px oklch(0.2 0.02 var(--hue-neutral) / 0.22);

  /* motion: UI transitions stay at or under --dur-slow; springs are judged by their settle time (-dur); --spring-soft is the signature moment's only.
     Springs as linear() (stiffness/damping 400/28 and 220/18); JS twins in motion.ts */
  --dur-instant: 90ms; --dur-quick: 160ms; --dur-base: 240ms; --dur-slow: 420ms;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --spring-snappy: linear(0, 0.124, 0.371, 0.62, 0.815, 0.943, 1.013, 1.042, 1.045, 1.037, 1.025, 1.014, 1.006, 1.001, 0.999, 0.998, 1);
  --spring-snappy-dur: 460ms;
  --spring-soft: linear(0, 0.145, 0.435, 0.719, 0.926, 1.043, 1.088, 1.086, 1.063, 1.036, 1.014, 1, 0.993, 0.992, 0.993, 0.996, 1);
  --spring-soft-dur: 660ms;
  --shift-1: 4px; --shift-2: 12px; --press-scale: 0.97; --stagger: 30ms;

  /* grid */
  --cols: 12; --gutter: var(--space-6); --margin: clamp(var(--space-4), 5vw, var(--space-24));
  --rail: {{RAIL_WIDTH}};             /* optional label column; 0 disables */
  --content-max: {{CONTENT_MAX}};
  --touch-min: 44px;                  /* web touch target; owned here, BUDGETS.md points at it */
}

/* dark: surfaces rise by lightness, not shadow. Two identical copies: the media query serves the OS setting, the attribute serves the toggle and screenshot runs. Edit both. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: oklch(0.165 var(--chroma-neutral) var(--hue-neutral));
    --surface-1: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
    --surface-2: oklch(0.24 var(--chroma-neutral) var(--hue-neutral));
    --line: oklch(0.3 var(--chroma-neutral) var(--hue-neutral));
    --ink-3: oklch(0.66 var(--chroma-neutral) var(--hue-neutral));
    --ink-2: oklch(0.8 var(--chroma-neutral) var(--hue-neutral));
    --ink-1: oklch(0.95 var(--chroma-neutral) var(--hue-neutral));
    --accent: oklch(calc(var(--l-accent) + 0.06) calc(var(--chroma-accent) * 0.85) var(--hue-accent));
    --on-accent: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
    --accent-wash: oklch(from var(--accent) 0.28 calc(c * 0.35) h);
    --ok: oklch(0.72 0.13 150); --warn: oklch(0.8 0.14 75); --danger: oklch(0.7 0.17 27);
    --data-l1: 0.72; --data-l2: 0.82; --data-seq-lo: oklch(from var(--accent) 0.3 calc(c * 0.3) h);
  }
}
:root[data-theme="dark"] {
  --bg: oklch(0.165 var(--chroma-neutral) var(--hue-neutral));
  --surface-1: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
  --surface-2: oklch(0.24 var(--chroma-neutral) var(--hue-neutral));
  --line: oklch(0.3 var(--chroma-neutral) var(--hue-neutral));
  --ink-3: oklch(0.66 var(--chroma-neutral) var(--hue-neutral));
  --ink-2: oklch(0.8 var(--chroma-neutral) var(--hue-neutral));
  --ink-1: oklch(0.95 var(--chroma-neutral) var(--hue-neutral));
  --accent: oklch(calc(var(--l-accent) + 0.06) calc(var(--chroma-accent) * 0.85) var(--hue-accent));
  --on-accent: oklch(0.2 var(--chroma-neutral) var(--hue-neutral));
  --accent-wash: oklch(from var(--accent) 0.28 calc(c * 0.35) h);
  --ok: oklch(0.72 0.13 150); --warn: oklch(0.8 0.14 75); --danger: oklch(0.7 0.17 27);
  --data-l1: 0.72; --data-l2: 0.82; --data-seq-lo: oklch(from var(--accent) 0.3 calc(c * 0.3) h);
}

@media (color-gamut: p3) { :root { --chroma-accent: {{ACCENT_CHROMA_P3}}; } }

@media (prefers-reduced-motion: reduce) {  /* replace movement, keep feedback */
  :root { --shift-1: 0px; --shift-2: 0px; --press-scale: 1;
          --spring-snappy: var(--ease-out); --spring-soft: var(--ease-out); --stagger: 0ms; }
}
```

Three filled-in directions, as illustration only. **Never reuse them**: agents copy worked examples far more reliably than they apply principles, so a single example becomes your house style. They're deliberately incompatible, and all three are pre-seeded in USED.md, so the novelty ledger bans them from day one.

| Illustration | Thesis | Knobs | Faces | Surfaces | Signature |
|---|---|---|---|---|---|
| Soft Machine | A consumer tool that feels like a toy you trust | neutral 20 / 0.03, accent 350 / 0.2, radius 14px concentric, ratio 1.25, density 1.125 | Fraunces (soft axis up) / Atkinson Hyperlegible Next, no mono | Tonal colour fields per object type; hue encodes the object | The new object inflates out of the button that made it |
| Bench Instrument | A dense bench tool for someone who reads numbers all day | neutral 250 / 0.006, dark-first, accent 85 / 0.16, radius 0, ratio 1.2, density 0.875 | Berkeley Mono for data and UI / IBM Plex Sans Condensed for prose | Ruled table grid, no fills; values change in place | A readout that ticks digit by digit |
| Contact Sheet | An archive where the photographs are the colour | neutral chroma 0 on purpose, no accent (photography carries hue), radius 0, ratio 1.333, density 1.125 | Newsreader at display optical size / Hanken Grotesk | Full-bleed imagery, wide margins | The tapped thumbnail becomes the full-bleed hero |

```ts
// src/styles/motion.ts: the same springs for Motion (web) and Reanimated (RN); dampingRatio for SwiftUI / Compose.
export const spring = {
  snappy: { stiffness: 400, damping: 28, mass: 1, dampingRatio: 0.7 },  // presses, toggles, sheets
  settle: { stiffness: 500, damping: 40, mass: 1, dampingRatio: 0.89 }, // layout shifts, no overshoot
  soft:   { stiffness: 220, damping: 18, mass: 1, dampingRatio: 0.61 }, // signature moment only
} as const;
```

> **Pro move:** Shipping on web and native? Keep the canonical tokens in `tokens/tokens.json` in the W3C DTCG format (stable since 2025.10), and generate CSS, Swift, Compose and React Native themes with Style Dictionary, so iOS can't drift from web.

### The craft layers

- **Type leads.** Once decoration is gone, type is most of what's left, so choose it before colour. One text face that disappears, one display voice with an opinion, a mono only if the data needs one. Display gets optical tightening (negative tracking, 1.0-1.1 leading). Pick one label treatment (case, tracking, scale step) and use it everywhere. Use `text-wrap: balance` on headings and `tabular-nums` wherever numbers change. Hierarchy comes from size, weight and space, with colour as the last lever.
- **Colour.** The strategy is a DESIGN.md decision: one scarce accent, a colour-led palette where hue encodes object type, or photography as the colour. Whatever it is, every hue maps to a principle; if removing a colour loses no meaning, it was decoration. Neutrals are tinted or deliberately achromatic, never framework grays. One accent *role* per viewport outside the signature moment, so the primary action and a live state share a hue only if DESIGN.md says they're the same role. Dark mode is designed: surfaces rise in lightness, the accent drops ~15% chroma, and text on the accent is re-checked.
- **Layout.** Choose a grid model and make it visible: editorial columns, a label rail, a canvas, a feed, a table. Use density contrast (tight groups, generous separations) instead of uniform medium spacing, which is the template tell. A card is for an object that behaves like one (draggable, stackable, dismissible); everywhere else, alignment and tonal steps carry the grouping.
- **Motion.** It answers where something came from, where it went, or what caused it. Otherwise cut it. User-driven motion uses springs (they interrupt and keep velocity), system motion uses duration tokens, and nothing eases in on a response. The more often something happens, the less it animates. View Transitions morph list into detail and scroll-driven animation adds depth, both as progressive enhancement (feature-detect, and the UI still works without them). Animate only transform, opacity and clip-path.
- **Texture and haptics, once each.** One surface, one technique, with a principle behind it. Shaders pause offscreen and ship a static fallback. On mobile, haptics are the press state, mapped to semantic events like selection, success and snap, never to raw taps.
- **Data.** In complex products the hardest real screen is often a chart or a dense table, and that's where the chart library's default palette leaks in. The `--data-*` tokens and DESIGN.md §Data give charts a grammar: categorical hues rotated from the accent, one sequential and one diverging ramp, the series the user asked about in accent and everything else in `--ink-3`, direct labels over legends.

**The signature moment.** Exactly one, at the moment of value, and the only place allowed past the motion ceiling with `--spring-soft`, sound, a haptic ramp or texture. Test it: can you describe it in one sentence, and would a user show it to someone? Patterns that work: the result assembles from its inputs for well under a second, showing the absorbed complexity, then gets out of the way; hold-to-commit with a haptic ramp; the tapped object becomes the next screen; an empty state previewing the product filled with the user's own data. Two signature moments equal zero. Its timing comes from the P2 feel test, not from taste alone. Copy counts as visual too, and its rules live in Always-On · Words & Voice.

### The screenshot loop

An agent writing CSS is guessing at pixels, and its confidence reflects how plausible the tokens are, not how they render. Give it eyes, and split the judging. A **deterministic audit** owns the pixel facts an LLM can't resolve from a screenshot: 1-3 px baseline drift, off-token values leaking in from library CSS, inline styles or arbitrary utility classes, undersized targets, contrast, accent share. The **LLM critic** judges only what needs judgment: hierarchy, distinctiveness, feel. Use a browser MCP (Playwright MCP, Chrome DevTools MCP) for exploration, and these scripts for evidence. Both come from your stack pack; the web-ts versions are below, and native packs capture with `xcrun simctl io booted screenshot`, `adb exec-out screencap -p` or Maestro.

The app sets a `data-ready` attribute once data and fonts have settled (dev builds at least). Waiting on network idle never resolves on apps with SSE, WebSockets or polling, which P4 recommends, so every shot would hit the timeout instead.

```file path="scripts/shots.ts"
// stack pack web-ts · Run: npx tsx scripts/shots.ts /specimen /lab/b/core   (VIEWPORTS=390x844,1440x900 from AGENTS.md)
// Light and dark per viewport, forced through data-theme so the dark PNG really is dark. Exits 1 if a pair comes out identical.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const vps = (process.env.VIEWPORTS ?? "390x844,1440x900").split(",").map((s) => s.split("x").map(Number));
const browser = await chromium.launch();
let failed = false;
for (const r of process.argv.slice(2)) for (const [width, height] of vps) {
  const files: string[] = [];
  for (const scheme of ["light", "dark"] as const) {
    const touch = width < 768;
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: scheme, isMobile: touch, hasTouch: touch });
    await ctx.addInitScript((s) => { const set = () => document.documentElement?.setAttribute("data-theme", s); set(); document.addEventListener("DOMContentLoaded", set); }, scheme);
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: "load" });
    await page.locator("[data-ready]").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const path = `shots/${r.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "root"}-${width}-${scheme}.png`;
    await page.screenshot({ path, fullPage: true, animations: "disabled" });
    files.push(path);
    await ctx.close();
  }
  if (readFileSync(files[0]).equals(readFileSync(files[1]))) { console.error(`${r} at ${width}: light and dark are identical, so the theme is not switching`); failed = true; }
}
await browser.close();
process.exit(failed ? 1 : 0);
```

```file path="scripts/audit-computed.ts"
// stack pack web-ts · Run: npx tsx scripts/audit-computed.ts /specimen /lab/b/core
// The deterministic pixel gate: every computed value on visible elements resolves to a token, text meets BUDGETS.md contrast,
// targets meet --touch-min, sibling baselines align. Mark third-party embeds data-audit-skip. Exit 1 on any finding.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const B = JSON.parse(readFileSync(".offthemode/BUDGETS.md", "utf8").match(/~~~json\n([\s\S]*?)\n~~~/)![1]);
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const vps = (process.env.VIEWPORTS ?? "390x844,1440x900").split(",").map((s) => s.split("x").map(Number));
const browser = await chromium.launch();
let findings = 0;
for (const route of process.argv.slice(2)) for (const [width, height] of vps) for (const theme of ["light", "dark"] as const) {
  const page = await browser.newPage({ viewport: { width, height }, colorScheme: theme });
  await page.addInitScript((t) => { const set = () => document.documentElement?.setAttribute("data-theme", t); set(); document.addEventListener("DOMContentLoaded", set); }, theme);
  await page.goto(BASE + route, { waitUntil: "load" });
  await page.locator("[data-ready]").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const { out, accentShare } = await page.evaluate((b) => {
    const names = new Set<string>();
    const walk = (rules: CSSRuleList) => { for (const r of rules) {
      if (r instanceof CSSStyleRule && r.selectorText.includes(":root")) for (const p of r.style) if (p.startsWith("--")) names.add(p);
      if ("cssRules" in r) walk((r as CSSGroupingRule).cssRules);
    } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch { /* cross-origin sheet */ } }
    const probe = document.body.appendChild(document.createElement("div"));
    const tokens = (prop: string) => { const ok = new Set<string>(); for (const n of names) { probe.style.setProperty(prop, `var(${n})`); ok.add(getComputedStyle(probe).getPropertyValue(prop)); } probe.style.removeProperty(prop); return ok; };
    const color = tokens("color"), len = tokens("padding-left"), size = tokens("font-size"), face = tokens("font-family"), dur = tokens("transition-duration"), shadow = tokens("box-shadow");
    probe.style.color = "var(--accent)"; const accent = getComputedStyle(probe).color; probe.remove();
    const cx = new OffscreenCanvas(1, 1).getContext("2d")!;
    const lum = (c: string) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const [r, g, bl] = [...cx.getImageData(0, 0, 1, 1).data].slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * bl; };
    const bgOf = (e: Element | null): string => { for (; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c !== "rgba(0, 0, 0, 0)") return c; } return "white"; };
    const NEUTRAL = new Set(["", "0px", "0s", "none", "normal", "auto", "rgba(0, 0, 0, 0)"]);
    const touchMin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--touch-min")) || 0;
    const id = (e: Element) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.classList[0] ? "." + e.classList[0] : "");
    const out: string[] = []; let accentArea = 0;
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      if (!el.checkVisibility() || el.closest("[data-audit-skip]")) continue;
      const cs = getComputedStyle(el), box = el.getBoundingClientRect();
      const check = (prop: string, ok: Set<string>) => { for (const v of prop === "transition-duration" ? cs.getPropertyValue(prop).split(", ") : [cs.getPropertyValue(prop)]) if (!NEUTRAL.has(v) && !ok.has(v)) out.push(`${id(el)} ${prop}: ${v}`); };
      if ([...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim())) {
        check("color", color); check("font-size", size); check("font-family", face);
        const [hi, lo] = [lum(cs.color), lum(bgOf(el))].sort((x, y) => y - x), ratio = (hi + 0.05) / (lo + 0.05);
        const large = parseFloat(cs.fontSize) >= b.large_text_px || (parseFloat(cs.fontSize) >= b.large_bold_text_px && Number(cs.fontWeight) >= 700);
        if (ratio < (large ? b.contrast_large : b.contrast_text)) out.push(`${id(el)} contrast ${ratio.toFixed(2)}:1`);
      }
      check("background-color", color); check("box-shadow", shadow); check("transition-duration", dur);
      for (const p of ["padding-top", "padding-right", "padding-bottom", "padding-left", "row-gap", "column-gap", "border-top-left-radius"]) check(p, len);
      if (el.matches("a[href], button, input, select, textarea, [role=button], [role=tab], [role=switch]") && Math.min(box.width, box.height) < touchMin) out.push(`${id(el)} target ${Math.round(box.width)}x${Math.round(box.height)} under --touch-min`);
      if (cs.backgroundColor === accent) accentArea += Math.max(0, Math.min(box.right, innerWidth) - Math.max(box.left, 0)) * Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0));
      if (/flex|grid/.test(cs.display) && !cs.flexDirection.startsWith("column")) {
        const lines = [...el.children].map((c) => { const t = [...c.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim()); if (!t) return null; const rg = document.createRange(); rg.selectNodeContents(t); const r = rg.getClientRects()[0]; return r ? { y: r.bottom, fs: getComputedStyle(c).fontSize } : null; }).filter((x): x is { y: number; fs: string } => !!x);
        for (const l of lines.slice(1)) { const d = Math.abs(l.y - lines[0].y); if (l.fs === lines[0].fs && d >= 1 && d <= 3) out.push(`${id(el)} sibling baselines ${d.toFixed(1)}px apart`); }
      }
    }
    return { out, accentShare: accentArea / (innerWidth * innerHeight) };
  }, B);
  console.log(`${route} ${width} ${theme}: ${out.length} findings; accent fills ${(accentShare * 100).toFixed(1)}% of the first viewport`);
  out.slice(0, 40).forEach((l) => console.log("  " + l));
  findings += out.length;
  await page.close();
}
await browser.close();
process.exit(findings ? 1 : 0);
```

For motion, stills show neither easing nor interruptibility, and a model can't watch a video file. So the `audit-ux` script (Always-On · Verification Loop) asserts motion facts: animated properties, durations against their tokens, and whether a re-triggered animation continues from where it is. Feel gets a frame strip, one image the model can read, and the final call stays yours.

```bash
# Record with Playwright (newContext({ recordVideo: { dir: "shots/video" } }); the clip is written when the context closes),
# then tile 30 fps frames into one image: 12 x 3 = 36 frames, 1.2 s of motion.
ffmpeg -y -i shots/video/{{CLIP}}.webm -vf "fps=30,scale=360:-1,tile=12x3" -frames:v 1 shots/{{NAME}}-strip.png
```

```prompt title="Screenshot Critique Loop"
Loop on {{ROUTE}}, max {{MAX_ROUNDS}} rounds (default 3):
1. Run {{?SHOTS_CMD}} {{ROUTE}} and {{?AUDIT_CMD}} {{ROUTE}}. Fix every audit finding first: those are facts (off-token values, contrast, baseline drift, undersized targets), not taste.
2. Have design-critic judge the new shots pairwise against the rubric anchors, twice with the order swapped, and list pixel-level issues: file, region ("top fifth, left column"), the problem in measurable terms, the fix as a token or property. It always checks icon alignment to cap height, heading widows, dark-mode clipping, focus ring visibility, more than one accent role per viewport, and anything deletable without loss.
3. Fix the top 5 by impact, with tokens and component styles only.
4. Re-shoot, re-audit and diff: improved, regressed.
Stop when the audit is clean and the RUBRIC.md ship bar is met, or rounds run out; then list what remains for my taste call. Never say it "looks great"; report wins, losses and ties.
```

Vague feedback gets ignored or overcorrected. Pixel-level feedback gets fixed. "Too cluttered" becomes "7 equal-weight toolbar buttons: keep Run as primary, move 5 to overflow, delete Refresh (auto-refresh exists)". "Looks generic" becomes "the 3-card row is the tell: make it one sequence where each item shows the real output it describes".

```prompt title="De-Genericize Pass"
Audit {{SCOPE}} for statistical-average UI; every hit is a bug.
1. Patterns: every HARD id in ~/.claude/design/BANS.md, every DEFAULT-OFF id not listed in .offthemode/DESIGN.md §Unbans, and every trait in its §Saturated list. file:line, then keep (with the unban or D-### that allows it) or replace. Replacements come from .offthemode/design/PRINCIPLES.md and TASTE.md, never from another cliche.
2. Copy: rewrite every sentence a competitor could publish unchanged, using a noun, number or verb from {{?PRODUCT_NAME}}'s domain.
3. Values: run {{?AUDIT_CMD}}; framework defaults and raw values become tokens. Icons that repeat their label: deleted.
4. Delete test: remove each element in turn; if nothing is lost, it stays deleted.
5. The signature moment exists and is the only loud thing.
Output a change summary with before and after screenshots.
```

### The files

```file path="~/.claude/design/RUBRIC.md"
RUBRIC · global · judged pairwise by design-critic, never scored absolutely: "is the screen better than anchor N on this criterion? screen / anchor / tie". Anchors: ~/.claude/design/anchors/rubric/<criterion>-{1,2,3}.png (until you have them: hate anchors stand in for 1s, love anchors for 3s). Each judgement runs twice with the order swapped; runs that disagree are a tie.
Ship bar: beats the 2-anchor on every criterion, and the 3-anchor on 2 (Distinctiveness) and 8 (Signature moment). Pixel facts belong to the audit script, not to this rubric. Project additions: .offthemode/DESIGN.md §Rubric additions.

| # | Criterion | A 1-anchor shows | A 3-anchor shows |
|---|---|---|---|
| 1 | Hierarchy (blur test) | Equal weight everywhere | Blurred, still one focal point and a clear reading order |
| 2 | Distinctiveness | Could be any product; matches a logo-swap candidate or a USED.md row | Recognisably mine per TASTE.md, even from a cropped thumbnail |
| 3 | Typography | Default sizes; grey does the hierarchy | Scale jumps, optical tracking per size, balanced headings, tabular figures |
| 4 | Colour intent | Hues with no reason, framework greys, decorative gradients | Every hue maps to a DESIGN.md principle; nothing is a default; dark mode designed |
| 5 | Layout and rhythm | Centered stack, uniform gaps | A visible grid model, density contrast |
| 6 | Restraint (delete test) | Removable elements, 2+ primary actions | Nothing removable; complexity behind defaults and disclosure |
| 7 | Motion | Decorative, uninterruptible, ignores reduced motion | Causal, springs where interactive, frequency-aware |
| 8 | Signature moment | None, or several competing | One, at the moment of value, memorable, within budget |
| 9 | Copy | Template phrases, lorem, "Get started" | Domain nouns, numbers, useful empty and error states |
| 10 | State completeness | Happy path only | Every state, long strings, both themes, both platforms |
```

```file path=".offthemode/DESIGN.md"
DESIGN: {{PRODUCT_NAME}} · v{{VERSION}} · locked {{DATE}} · read before any UI work · under 150 lines
Frame: {{PERSON}} · job {{JOB}} · moment of value {{MOMENT_OF_VALUE}} · complexity we absorb {{ABSORBED_COMPLEXITY}}
Thesis: {{ONE_SENTENCE_THESIS}} · feels like {{W1}}, {{W2}}, {{W3}} · never like {{N1}}, {{N2}}, {{N3}} · TASTE.md tension it resolves: {{TENSION}}

### Principles (falsifiable, max 8, from .offthemode/design/PRINCIPLES.md)
1. {{PRINCIPLE}}

### System
- Tokens: src/styles/tokens.css (web), tokens/tokens.json (all platforms). No raw colour, size or duration in components; a new value is a token proposal, never an inline value.
- Type: display {{FONT_DISPLAY}} for {{DISPLAY_USES}}; text {{FONT_TEXT}}; mono {{FONT_MONO | none}} for {{MONO_USES}}; label treatment {{CASE_TRACKING_STEP}}. Hierarchy: size, weight, space, then colour.
- Colour: strategy {{scarce accent | colour-led | photographic | OTHER}}; neutrals {{tinted to hue N | achromatic, because}}; accent roles {{ROLES}}; one accent role per viewport outside the signature moment.
- Layout: grid model {{GRID_MODEL}}; the primary action sits at {{PRIMARY_ACTION_POSITION}} and carries data-primary; disclosure rules {{DISCLOSURE_RULES}}.
- Motion: {{MOTION_PERSONALITY}}; interactive = springs, system = duration tokens; actions done more than {{N}} times per session get no animation.
- Waiting (from the P2 feel test): {{stream | show the work | optimistic}} for {{OPERATIONS}}.
- Signature moment: {{SIGNATURE_MOMENT}} · trigger {{TRIGGER}} · budget {{PERF_BUDGET}} · fallback {{FALLBACK}}
- Platform: web {{WEB_NOTES}} · iOS {{IOS_NOTES}} · Android {{ANDROID_NOTES}}. In chrome native feel beats brand; in content brand wins.

### Data (charts, tables, timelines)
- Categorical --data-1..6 in order; sequential --data-seq-lo to --data-seq-hi via color-mix in oklch; diverging --data-div-neg, -mid, -pos. Never the chart library's palette.
- The series the user is asking about in --accent; every other series in --ink-3.
- Direct labels over legends; tabular mono on axes; hairlines at major ticks only; no 3D, gradients or drop shadows.
- Designed empty, partial and loading states for every chart.

### Unbans (DEFAULT-OFF ids from ~/.claude/design/BANS.md that this product turns on)
- {{id}}: serves principle {{N}}; applies to {{WHERE}}

### Project bans (on top of BANS.md; add the pattern to .claude/bans.txt)
| id | Banned | Why | Instead |
|---|---|---|---|

### Rubric additions (surface-specific criteria from Rubric First)
| # | Criterion | A 1-anchor shows | A 3-anchor shows |
|---|---|---|---|

### Changelog
{{DATE}} v1 locked. Every token change records reason, screens affected, rubric re-run.
```

```file path="~/.claude/design/BANS.md"
BANS · global, and the only ban list: every other file points here. Apply each reason to cases the list does not name.
HARD: zero information in any product; never unbanned. DEFAULT-OFF: banned until .offthemode/DESIGN.md §Unbans lists the id, the principle it serves and where it applies. SATURATED: allowed only with a written product reason. Lint patterns live in each stack pack's bans.txt under the same ids.

### HARD
| id | Banned | Why | Instead |
|---|---|---|---|
| fake-data | Lorem ipsum, John Doe, Acme, $1,234.56 | Fake data makes real design look fake | Edge-case-rich fixtures |
| hype-copy | "Welcome to", "Unlock", "Seamless", "Supercharge", "Elevate", "Empower", "Effortless", "Revolutionize", "Leverage", "Powered by AI" | Zero-information copy | The outcome in the user's nouns; verb + object |
| dead-copy | "Get started" as the only CTA, "Oops!", "Something went wrong", "Click here", "Are you sure?", "Submit" | Says nothing about the result | A button that predicts its result; an error with a next step |
| emoji-icon | Emoji as icons; icons that repeat their label | Instantly vibe-coded | Text labels; custom glyphs where scanning needs them |
| kit-default | Untouched component-library defaults | Reads as unset | Restyled to tokens |
| gradient-text | Decorative gradient text | Decoration carrying no information | Solid ink |
| template-page | Centered hero + 3 feature cards + pricing + FAQ; pill badge above the headline; logo marquee | The statistical-average page | Landing as Demo: the product doing its job on real data |
| off-token | Raw colour, size or duration values outside tokens | The system stops being editable in one place | A token, or a token proposal |
| layout-anim | Animating width, height, top or left; ease-in on responses | Jank and lag | transform, opacity, clip-path; springs or --ease-out |
| second-signature | A second signature moment | Dilutes the first | Quiet everywhere else |

### DEFAULT-OFF
| id | Off by default | Why | Typical reason to unban |
|---|---|---|---|
| radius-8plus | Radius of 8 or more (web px) | The default card look | A soft, rounded product; concentric native chrome |
| container-shadow | Shadows on non-overlay containers | Cards covering for a missing grid | A physical metaphor (stacks, drag and drop) |
| multi-accent | More than one accent role per viewport | Competes with the primary action | Colour-led product where hue encodes object type |
| blue-purple | Blue-to-purple hues and gradients | The AI-default palette | A brand that genuinely owns it |
| glass | Glass, glow, blur, border beams, aurora, dot grids | The "unique" mode | Native chrome (iOS Liquid Glass), never faked on web |
| illustration | Illustration and decorative imagery | Filler | A product whose voice is drawn, drawn for it |
| default-face | Inter, Geist, Roboto, system UI or a saturated template face as display | Default voices | A dense tool where the text face is the brand |
| gray-default | Untinted framework grays (zinc, slate, gray) | Reads as unset | A deliberately achromatic direction |
| long-motion | UI transitions longer than --dur-slow; springs are judged by settle time; the signature moment is exempt | Feels slow on repeat | Rare, ceremonial transitions |
| uniform-space | Uniform medium spacing everywhere | No rhythm | Dense data tables |

### SATURATED · reviewed {{DATE}} (allowed only with a D-### product reason; every Project Retro re-dates this list)
| Trait | Where it came from |
|---|---|
| Bento grids; glass and web imitations of Liquid Glass; gradient blobs, mesh, aurora | 2022-25 SaaS templates |
| Linear-clone dark mode with a purple glow; border beams, spotlight cards, shimmer buttons | Effects libraries |
| A serif-italic word dropped into a sans headline | 2024-25 landing pages |
| Warm paper with one signal colour; uppercase mono labels in a rail; hairlines instead of cards; dithering and halftone as texture | The 2026 anti-slop mode that anti-slop skills push every agent toward |
| Satoshi, General Sans, Clash Display, Cabinet Grotesk, PP Neue Montreal as display | Template marketplaces |
| cmdk, Sonner and Vaul at their default styling | shadcn/ui wraps them, so the default is the average |
```

Enforce the bans instead of just requesting them. This hook runs after every edit (wired in P0) and reads the stack pack's pattern map. HARD ids always apply; a DEFAULT-OFF id is skipped once DESIGN.md unbans it, so a rounded consumer app or an iOS 26 app with concentric corners isn't marked down for being right. Native packs ban in their own idiom: `\.cornerRadius\(` and `Color\(red:` for SwiftUI, `RoundedCornerShape\(` and `Color\(0x` for Compose.

```file path=".claude/bans.txt"
# stack pack web-ts · format: id tier ERE · ids and reasons in ~/.claude/design/BANS.md · ids without a pattern are critic-only
fake-data         HARD  Lorem|lorem ipsum|John Doe|Jane Doe|Acme
hype-copy         HARD  Welcome to|Unlock|Seamless|Supercharge|Elevate|Empower|Effortless
gradient-text     HARD  bg-clip-text|background-clip: *text
off-token         HARD  #[0-9a-fA-F]{3,8}([^0-9A-Za-z_-]|$)|-\[[0-9.]+(px|rem|ms)\]
layout-anim       HARD  transition-\[?(width|height|top|left)|transition: *(width|height|top|left)
emoji-icon        HARD
radius-8plus      OFF   rounded-(lg|xl|2xl|3xl)
container-shadow  OFF   shadow-(md|lg|xl|2xl)
blue-purple       OFF   -(blue|indigo|purple|violet)-[0-9]
glass             OFF   backdrop-blur|backdrop-filter
default-face      OFF   [^A-Za-z](Inter|Geist|Roboto)[^A-Za-z]
gray-default      OFF   -(zinc|slate|gray)-[0-9]
```

```file path=".claude/hooks/lint-bans.sh"
#!/usr/bin/env bash
# PostToolUse (Claude Code): ban hits in the file just edited, from .claude/bans.txt. HARD ids always apply;
# OFF ids apply unless .offthemode/DESIGN.md "### Unbans" lists them. Exit 2 shows the hits to the agent. Needs jq; chmod +x.
f="$(jq -r '.tool_input.file_path // .file_path // empty')"; [ -f "$f" ] || exit 0
case "$f" in *tokens*|*/fixtures/*|*.md|*/bans.txt) exit 0 ;; esac
root="${CLAUDE_PROJECT_DIR:-.}"; map="$root/.claude/bans.txt"; [ -f "$map" ] || exit 0
unbans="$(sed -n '/^### Unbans/,/^### /p' "$root/docs/DESIGN.md" 2>/dev/null | grep -oE '^- [a-z0-9-]+' | cut -c3-)"
hits=""
while read -r id tier re; do
  case "$id" in ''|\#*) continue ;; esac
  [ -z "$re" ] && continue
  [ "$tier" = OFF ] && printf '%s\n' "$unbans" | grep -qx -- "$id" && continue
  h="$(grep -nE -- "$re" "$f")" && hits="$hits[$id] $h"$'\n'
done < "$map"
[ -z "$hits" ] && exit 0
printf 'Ban hits in %s:\n%s\nFix per ~/.claude/design/BANS.md, or unban an OFF id in .offthemode/DESIGN.md "### Unbans" with the principle it serves.\n' "$f" "$hits" >&2
exit 2
```

The critic lists its tools explicitly. Without a `tools` line a subagent inherits every tool, including Edit and Write, and "never edits files" becomes a request instead of a wall. The server-level `mcp__<server>` form grants that browser server's tools and nothing else.

```file path="~/.claude/agents/design-critic.md"
---
name: design-critic
description: Judges rendered UI from screenshots, pairwise against the rubric anchors, TASTE.md and the complexity budgets. Use after any visual change and before any user-facing merge. Never edits files.
tools: Read, Glob, Grep, Bash, mcp__{{BROWSER_MCP_SERVER}}
---
You are the critic, not the author. You owe these screens nothing and are paid to catch what a picky design director and a ruthless product lead would catch. Judge pixels, not intent: do not read the implementation before judging.
Load ~/.claude/design/TASTE.md, RUBRIC.md, BANS.md and USED.md; .offthemode/PRODUCT.md, DESIGN.md, COMPLEXITY.md; .offthemode/design/PRINCIPLES.md and refs/. Get evidence with the screenshot and audit commands in AGENTS.md Commands, or by driving the browser or simulator tools; open every image.
The audit owns pixel facts (off-token values, contrast, baselines, target sizes); do not re-litigate them. You own hierarchy, distinctiveness, restraint and feel.
Run the pass you were asked for: Design Critique Against Rubric (pairwise; you may be run twice with the order swapped) or Complexity Audit (counted, against budget). Every finding names file, region, the measurable problem and the fix as a token, property or element change. Never say "looks great"; report wins, losses and ties.
```

- [ ] Exit: TASTE.md exists (global, once); 30+ refs, half from outside software, motion refs as strips; 6-8 falsifiable principles traced to TASTE.md; three directions from anchors you assigned, built in isolation, divergence checked by `diverge-diff.sh` and design-critic; one base + at most two grafts, each with a reason; Saturation Check run
- [ ] Exit: tokens v1 locked (+ DTCG for native); `/specimen` covers every state, both themes, data and reduced motion, and meets the ship bar; the audit is clean, contrast included; signature moment profiled on a mid-tier phone; ban lint, shots and audits running
