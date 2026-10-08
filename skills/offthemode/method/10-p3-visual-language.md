## P3 · Visual Language

> **Output:** `.offthemode/DESIGN.md` (taste, principles, system, bans, rubric), references in `.offthemode/design/`, a locked `src/styles/tokens.css` (plus `tokens/tokens.json` for native apps), a `/specimen` page that renders every state, and four checks in RULES.md §Commands: screenshots, the computed-style audit, `scripts/check-bans.sh` and `scripts/diverge-diff.sh`.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Build with the design tokens and components that already exist. No raw colour, size, spacing or duration values: a value the tokens can't express is a token proposal shown to the user, never an inline number.
- If DESIGN.md exists, follow its principles and bans. If there is none, follow the current styles, and list any value in the touched files that bypasses the tokens.
- One primary action per screen. Every touched screen keeps its empty, loading, error, offline and no-permission states.
- Nothing that could sit on any other product unchanged. If the change drifts toward a stock layout or a component library's default look, stop and say so.
- Look at every touched screen at each of screenshot_sizes (RULES.md §Budgets), light and dark, with the screenshot and audit commands in RULES.md §Commands where they exist.
- Open the whole guide when the product has no tokens yet, to add or change a token, to set a visual direction or a signature moment, or to redesign a whole surface. Offer that as its own step; never start it inside a small change.
<!-- /offthemode:rules -->

On a new product, the tokens are locked and the specimen exists before the first product screen is built; on an existing one, work inside the tokens it has and rework them as a step of their own. Tokens are named values (colour, type, space, radius, motion) that components use instead of raw numbers; the specimen is one page that renders the whole visual language. This is where "complex inside, simple outside" becomes visible: restraint, hierarchy and motion make a dense system read as one calm surface with one obvious next move.

> **Rule:** Prove a direction on the product's hardest real screen (the dense core surface), never on a landing page. A direction that only works on a hero is a poster, not a language.

### Why AI design all looks the same

Ask for "a modern, clean landing page" and you get the mode, the single most likely answer: centered hero, gradient headline, pill badge, logo marquee, three icon cards, bento grid, three pricing tiers, FAQ, all in Inter with `rounded-xl shadow-sm` and `from-blue-500 to-purple-600`. "Modern" and "clean" sat next to millions of those templates, and if `rounded-lg` exists, it is the most probable choice. Three levers move the output. **References** change what the model is conditioned on. **Tokens** shrink the space of outputs: if the radius family is one value and its concentric derivatives, the rounded-xl card cannot happen, and a constraint in code survives when a long conversation gets summarized. **Bans with reasons and replacements** name the exit, and the reason generalizes to cases you never listed.

> **Trap:** "Make it unique." The model has seen "unique" next to its second mode: black background, border beams, gradient text, glass. There is now a third mode, the anti-slop look itself (warm paper, graphite, one signal colour, uppercase mono labels, hairlines instead of cards), because every anti-slop skill pushes AI tools there. Defining yourself against the average only moves you to the next average. The exit that does not converge is your own taste, written down.

### Your taste, written down

A ban says where not to go, never where to go; only taste does that. Before your first product, and every six months after, save about 20 things you love and 20 you can't stand (sites, apps, posters, objects, film frames, type specimens, rooms) in `.offthemode/design/taste/` as `love-*` and `hate-*`, each with one line of why. Motion goes in as a frame strip (animation frames tiled into one image, see The screenshot loop), never a still. Taste Extraction turns them into DESIGN.md §Taste (start DESIGN.md from the template at the end of this guide), which makes "unique" mean "recognisably yours" rather than "unlike the average".

Taste is yours, not the product's, so carry §Taste and the folder to your next project. Its **Already used** table is a novelty ledger: whatever worked last time quietly becomes your personal mode, so each shipped product adds a row, and new directions treat every row as a ban.

```prompt title="Taste Extraction"
.offthemode/design/taste/ holds about 20 things I love (love-*) and 20 I can't stand (hate-*), each with one line of why. Motion items are frame strips with duration and easing notes.
1. For each item: the ONE decision that makes me react, and what it costs. Do not describe the image.
2. My personal principles as falsifiable sentences, each traced to 2+ loves and contradicted by 1+ hate ("type carries hierarchy; colour only ever means state" is a principle; "clean and bold" is not). Keep only the ones my items really support.
3. My recurring moves in type, colour, motion, density and copy.
4. Which traits of my hates the generic AI look shares, and which traits of my loves the anti-slop look shares. Both are modes I can fall into.
5. The tensions between things I love. This is where a product gets its edge: a direction that resolves one of them is already off the mode.
Then interview me with batched, numbered questions on the tensions and on anything I contradicted, each with your read as the recommended answer, in more rounds if needed.
Show me the draft of .offthemode/DESIGN.md §Taste (under 60 lines) and write it once I answer. If an earlier §Taste exists, end with the diff: what I stopped loving, what is new, which principle got sharper.
```

### Where references come from

Save references as images in `.offthemode/design/refs/` with a one-line note each; a URL fetch returns HTML, not feel. Motion references are frame strips with measured duration, easing and overshoot. Your AI learns **how** to build from craft teachers and **what** it looks like from you, mostly through sources outside software. These lists are dated 2026-09; review them with DESIGN.md §Saturated at the start of each product.

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
| Your `.offthemode/design/taste/` folder and your own Are.na channels | The only source that is recognisably you |
| Letterform Archive; Standards Manual reissues | Systems in print: grids, signage, identity manuals |
| Art of the Title | Pacing, reveals, type in motion |
| Foundry specimens: Future Fonts, Velvetyne, Collletttivo, UNCUT.wtf, Departure Mono; Dinamo, Grilli Type, Klim, OH no Type Co | Faces nobody else has yet, and how a type designer stages a face |
| Museum and exhibition identities; hardware manuals and instrument panels; record sleeves | Constraint-driven layout, labelling, one bold move per object |
| Godly, Siteinspire, Minimal Gallery, Hoverstat.es, Cosmos | The fringe of the web; check every trait against §Saturated first |
| Fonts In Use | Evidence of how saturated a face is |

Saturated traits live in DESIGN.md §Saturated and need a written product reason in DECISIONS.md. Anti-slop skills are a floor, not a ceiling: when everyone installs the same one, its escape routes become the next average.

> **Rule:** A reference is taken to heart, never as a script. Name what makes it work and take that, as the extraction note does ("take the type scale, not the colour"), then go further: a better version, a fresh idea or an extension. A reference copied whole makes you one more copy of it. The same holds for every suggestion (Product-First Doctrine).

```prompt title="Saturation Check"
For each trait in .offthemode/design/directions/*.md and .offthemode/DESIGN.md (faces, colour strategy, grid model, surface treatment, motion signature, layout device), estimate how saturated it is. Search if you can (Fonts In Use, Framer and Webflow template marketplaces, recent design-award galleries, all from the last 12 months); otherwise say you are estimating. Roughly 20+ hits, or a match in DESIGN.md §Saturated, means mainstream: keep it only with a written product reason, or replace it with a move derived from a §Taste tension.
Output: Trait | Evidence | Verdict (keep with reason | replace) | Replacement.
Change nothing until I answer. Then log each kept trait's reason in .offthemode/DECISIONS.md and apply the replacements.
```

### Three directions, built apart

1. Build a moodboard of 30-60 references, at least half from outside software.
2. Run Extract Principles. It reads §Taste, so the principles are yours before they are this product's.
3. **You** give each of three directions an external anchor from the moodboard and one forbidden trait, before anything is generated.
4. Set up the screenshot scripts (The screenshot loop), then build each direction in its own fresh AI session that cannot see the others. Each touches only its own direction file and `/lab/a`, `/lab/b` or `/lab/c` routes, so the three combine without conflicts.
5. Check divergence after the fact: `scripts/diverge-diff.sh` flags any pair sharing more than half its knob values (the handful of token values, such as hues, type ratio and radius, that every other token derives from), and a fresh critic session judges from screenshots only.
6. In a separate critic session, ask for one base and at most two grafts (single ideas taken from the other directions into the base). You choose. Averaging all three brings the mode back.
7. Run Saturation Check, lock tokens v1 and build the specimen. After that, every screen is assembly, not invention.

With git, give each direction its own branch and merge the three into a `lab` branch. If your tool can run isolated helpers in their own checkout (Claude Code subagents with a worktree can), they handle step 4 for you.

> **Why:** One session that builds A, B and C in sequence conditions B on A and C on both, and picks its own axes, so you get the mode three times in three fonts. Separate sessions and axes you assigned make the samples independent. A checker that did not author them is what makes "they differ" true.

```prompt title="Extract Principles From References"
Act as a design director with a type designer's eye. .offthemode/design/refs/ holds {{N}} reference images (motion references as frame strips), each with a note. Product: {{?PRODUCT_ONE_LINER}}. Person: {{?PERSON}}. Moment of value: {{?MOMENT_OF_VALUE}} (all from .offthemode/PRODUCT.md). Taste: .offthemode/DESIGN.md §Taste.
Do not describe the images. Per reference: the ONE decision that makes it work, what it costs, and why it works perceptually.
Then synthesize the principles for this product, keeping only those the references really support and the product's job needs. Each is a falsifiable sentence, not an adjective; traced to references by filename and to a §Taste principle or tension; expressed in type, colour, layout, motion and copy; paired with its failure mode (how an AI would misapply it into cliche).
Also list: shared traits that are only current fashion or appear in §Saturated (dropped); 3 tensions between references to resolve; what NONE of the references do that this product's job demands. Never copy a layout, logo or signature element.
Show me the result, with your pick for each tension, and write it to .offthemode/DESIGN.md §Principles once I answer.
```

```prompt title="Three Divergent Directions"
Direction {{A, B or C}} of three for {{?PRODUCT_NAME}}. This is a fresh session. The other directions exist elsewhere; do not look for them.
Anchor, assigned by me: {{REF_FILE in .offthemode/design/refs/}}; take {{WHAT_TO_TAKE}}. Forbidden trait: {{TRAIT}}.
Read .offthemode/DESIGN.md §Taste, §Principles, §Bans and §Saturated. The §Already used table is a ban list: share at most one attribute (column) with any row.
Start your reply with a two-word name, a one-sentence thesis naming the metaphor, the density and the colour strategy, and the knob values you plan, then build it.
Deliver: src/styles/directions/{{a, b or c}}.css using the tokens.css variable names; /lab/{{a, b or c}}/core ({{?HARDEST_SCREEN}} on edge-case data: long names, empty, max rows, error) and /lab/{{a, b or c}}/entry ({{?SECOND_SCREEN}}); a working signature moment; light and dark.
Constraints: no HARD ban and no DEFAULT-OFF ban; one primary action per surface; real copy in the product's voice; no new dependency without a reason. Touch only the direction file and /lab/{{a, b or c}}.
Finish: run {{?SHOTS_CMD}} on both routes and write .offthemode/design/directions/{{a, b or c}}.md: thesis, bet, weakest point, the §Taste tension it resolves. Do not compare yourself to anything and do not recommend.
```

```file path="scripts/diverge-diff.sh"
#!/usr/bin/env bash
# Flags direction pairs that share more than half of their knob values. Usage: scripts/diverge-diff.sh src/styles/directions/*.css
knobs() { grep -oE -- '--[a-z0-9-]+: *[^;]+' "$1" | sed 's/: */=/' | sort -u; }
fail=0
for a in "$@"; do for b in "$@"; do
  [[ "$a" < "$b" ]] || continue
  shared=$(comm -12 <(knobs "$a") <(knobs "$b") | wc -l | tr -d ' '); total=$(knobs "$a" | wc -l | tr -d ' ')
  if [ $((shared * 2)) -gt "$total" ]; then echo "$a ~ $b: $shared of $total knob values identical; redo one"; fail=1; fi
done; done
exit $fail
```

The critic is a fresh AI session with no memory of building the screens; it judges screenshots, not code. Run it twice, in two fresh sessions with the order of screens and anchors swapped, and count a tie wherever they disagree, because models lean toward whichever image came first. If your tool supports subagents with a fixed tool list (Claude Code does), a read-only critic makes "never edit files" a wall instead of a request.

```prompt title="Design Critic"
You are the critic, not the author. You owe these screens nothing; catch what a picky design director and a ruthless product lead would. Judge pixels, not intent: do not read the implementation first, and never edit files.
Screens: {{ROUTES or "the three lab directions"}}, as screenshots in shots/; open every image. Read .offthemode/DESIGN.md (§Taste, §Principles, §Rubric, §Already used), .offthemode/PRODUCT.md and the anchors in .offthemode/design/rubric/.
Judge pairwise, never absolutely: per screen and criterion, "better than anchor N? screen / anchor / tie", naming the deciding region ("lab-b-core-390-light.png, top right: three accent roles compete"). Compare with the 2-anchor on every criterion and the 3-anchor on Distinctiveness and Signature moment. Judge only in the order given.
The audit owns pixel facts (off-token values, contrast, baselines, target sizes); do not re-argue them. You own hierarchy, distinctiveness, restraint and feel. Always check icon alignment to cap height, heading widows, dark-mode clipping, focus ring visibility, more than one accent role per viewport, and anything deletable without loss.
Then: the logo-swap test (the product this could be mistaken for, any §Already used row it resembles, or "none"); the 3 changes that would flip the most losses; the best idea worth grafting elsewhere. For directions, also judge divergence from the screenshots alone, recommend one base plus at most 2 grafts, and flag conflicts; never average them.
Every finding: file, region ("top fifth, left column"), the problem in measurable terms, the fix as a token, property or element change. Never say "looks great"; report wins, losses and ties.
```

### Tokens are the contract

Tokens are the one design artifact your AI cannot misread. `tokens.css` owns every motion, type and space value, so prompts and docs say `--dur-quick`, never a number. Colour is OKLCH, a colour model where equal lightness steps look equal (HSL's do not), and states derive with relative colour syntax instead of new hex values. Set about ten knobs and the rest derives; the comments give ranges, not a look. Springs (motion driven by stiffness and damping instead of a fixed duration, so it can be interrupted and keeps its speed) are `linear()` curves here, with JavaScript and native twins in `motion.ts`. Harmonizer (OKLCH plus APCA, a newer contrast measure) and oklch.com help with palettes, Utopia with fluid type.

The dark block appears twice on purpose. The media query serves the system setting for real users; the attribute serves the in-app toggle and every screenshot run. With only the attribute, a browser emulating dark mode renders the light theme, and every "checked in both themes" claim checks a theme that was never drawn.

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
  --touch-min: {{TOUCH_MIN | 44px, or delete this line}};   /* web touch target, only if this product holds one; the audits check it while this line exists */
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

```file path="src/styles/motion.ts"
// The same springs for Motion (web) and Reanimated (React Native); dampingRatio for SwiftUI and Compose.
export const spring = {
  snappy: { stiffness: 400, damping: 28, mass: 1, dampingRatio: 0.7 },  // presses, toggles, sheets
  settle: { stiffness: 500, damping: 40, mass: 1, dampingRatio: 0.89 }, // layout shifts, no overshoot
  soft:   { stiffness: 220, damping: 18, mass: 1, dampingRatio: 0.61 }, // signature moment only
} as const;
```

> **Pro move:** Shipping on web and native? Keep the canonical tokens in `tokens/tokens.json` in the W3C DTCG format (the Design Tokens Community Group standard, stable since 2025.10), and generate CSS, Swift, Compose and React Native themes with Style Dictionary, so iOS cannot drift from web.

Three filled-in directions, as illustration only. **Never reuse them.** AI tools copy worked examples far more reliably than they apply principles, so one example becomes your house style. They are deliberately incompatible, and DESIGN.md §Already used starts with all three, so they are banned from day one.

| Illustration | Thesis | Knobs | Faces | Surfaces | Signature |
|---|---|---|---|---|---|
| Soft Machine | A consumer tool that feels like a toy you trust | neutral 20 / 0.03, accent 350 / 0.2, radius 14px concentric, ratio 1.25, density 1.125 | Fraunces (soft axis up) / Atkinson Hyperlegible Next, no mono | Tonal colour fields per object type; hue encodes the object | The new object inflates out of the button that made it |
| Bench Instrument | A dense bench tool for someone who reads numbers all day | neutral 250 / 0.006, dark-first, accent 85 / 0.16, radius 0, ratio 1.2, density 0.875 | Berkeley Mono for data and UI / IBM Plex Sans Condensed for prose | Ruled table grid, no fills; values change in place | A readout that ticks digit by digit |
| Contact Sheet | An archive where the photographs are the colour | neutral chroma 0 on purpose, no accent (photography carries hue), radius 0, ratio 1.333, density 1.125 | Newsreader at display optical size / Hanken Grotesk | Full-bleed imagery, wide margins | The tapped thumbnail becomes the full-bleed hero |

```prompt title="Build the Specimen Page"
tokens.css is locked at v1. Build /specimen, one page rendering the whole visual language:
1. Type: every scale step with its token, size, leading and tracking; a paragraph at measure; tabular vs proportional numerals; mono.
2. Colour: every token as a swatch with its oklch value, its WCAG contrast ratio against bg, surface-1 and surface-2, and APCA Lc as a second opinion, light and dark side by side. If .offthemode/RULES.md §Budgets holds contrast keys, every ink/surface and on-accent/accent pair meets contrast_text (contrast_large at WCAG large sizes), and {{?AUDIT_CMD}} fails the run when one doesn't.
3. Space, radii (with their concentric inner values), lines and elevation as rulers. Motion: every duration x easing and spring as a replayable demo beside its reduced-motion variant.
4. Components in ALL states (default, hover, focus-visible, pressed, disabled, loading, error, empty): buttons (primary, secondary, quiet), input, select, checkbox, switch, tabs, menu, dialog, sheet, toast, tooltip, table row, list item, skeleton, empty state.
5. Data: a line, bar, area and table on large realistic data with the --data-* tokens and the highlight rule, direct labels, and designed empty, partial and loading chart states; shoot it with the colour-blind passes too.
6. A real {{?HARDEST_SCREEN}} fragment built only from the parts above, and the signature moment on its own.
Behaviour from {{PRIMITIVES_LIB}}; styling is ours. Zero raw colour, size or duration values in component files (1px hairlines excepted). Theme and reduced-motion toggles at the top.
Before building, list any component or state the tokens cannot express yet, as token proposals, each with your pick; build what they don't touch, and the rest once I answer. When it is built, run the Screenshot Critique Loop on /specimen.
```

### The craft layers

- **Type leads.** Once decoration is gone, type is most of what is left, so choose it before colour: one text face that disappears, one display voice with an opinion, a mono only if the data needs one. Display gets optical tightening (negative tracking, 1.0-1.1 leading). One label treatment (case, tracking, scale step) everywhere. `text-wrap: balance` on headings, `tabular-nums` wherever numbers change. Hierarchy comes from size, weight and space; colour is the last lever.
- **Colour.** The strategy is a DESIGN.md decision: one scarce accent, a colour-led palette where hue encodes object type, or photography as the colour. Every hue maps to a principle; if removing a colour loses no meaning, it was decoration. Neutrals are tinted or deliberately achromatic, never framework grays. One accent role per viewport outside the signature moment. Dark mode is designed: surfaces rise in lightness, the accent drops about 15% chroma, and text on the accent is checked again.
- **Layout.** Choose a grid model and make it visible: editorial columns, a label rail, a canvas, a feed, a table. Use density contrast (tight groups, generous separations) instead of uniform medium spacing, which is the template tell. A card is for an object that behaves like one (draggable, stackable, dismissible); everywhere else, alignment and tonal steps carry the grouping.
- **Motion.** It answers where something came from, where it went, or what caused it; otherwise cut it. User-driven motion uses springs, system motion uses duration tokens, and nothing eases in on a response. The more often something happens, the less it animates. View Transitions (the browser's built-in animation between two states) morph a list into its detail and scroll-driven animation adds depth, both feature-detected so the UI works without them. Animate only transform, opacity and clip-path.
- **Texture and haptics, once each.** One surface, one technique, with a principle behind it. Shaders pause offscreen and ship a static fallback. On mobile, haptics are the press state, mapped to meaningful events like selection, success and snap, never to raw taps.
- **Data.** The hardest real screen is often a chart or a dense table, and that is where the chart library's default palette leaks in. The `--data-*` tokens and DESIGN.md §Data give charts a grammar: hues rotated from the accent, one sequential and one diverging ramp, the asked-about series in accent and the rest in `--ink-3`, direct labels over legends.

**The signature moment.** Exactly one, at the moment of value, and the only place allowed past the motion ceiling with `--spring-soft`, sound, a haptic ramp or texture. Test it: can you describe it in one sentence, and would a user show it to someone? Patterns that work: the result assembles from its inputs in well under a second, showing the absorbed complexity, then gets out of the way; hold-to-commit with a haptic ramp; the tapped object becomes the next screen; an empty state that previews the product filled with the user's own data. Two signature moments equal zero. Its timing comes from the P2 feel test, not from taste alone. Copy counts as visual too; its rules live in Always-On · Words & Voice.

### The screenshot loop

An AI writing CSS is guessing at pixels, and its confidence reflects how plausible the code looks, not how it renders. Give it eyes, and split the judging. A **deterministic audit** (a script that gives the same answer every run) owns the pixel facts a model cannot read from a screenshot: 1-3 px baseline drift, off-token values leaking in from library CSS or inline styles, undersized targets, contrast, accent share. The **critic** judges only what needs judgment: hierarchy, distinctiveness, feel. Your AI can explore with a browser tool (Playwright MCP, Chrome DevTools MCP); evidence comes from scripts. On native, capture with `xcrun simctl io booted screenshot`, `adb exec-out screencap -p` or Maestro. The app sets a `data-ready` attribute once data and fonts have settled, because waiting for "network idle" never finishes in apps with live connections (SSE, WebSockets, polling).

```prompt title="Screenshot and Audit Scripts"
Write two scripts in this project's stack (Playwright for web; simulator or emulator tools for native) and add both to .offthemode/RULES.md §Commands. Show me the plan, then write them in the same reply.
shots ROUTES: per route, at each size in screenshot_sizes (RULES.md §Budgets), a full-page shot in light and in dark at 2x density, touch emulated under 768 px. Force the theme two ways, the system colour scheme plus data-theme on the root element set before page scripts run, so the dark shot really is dark. Wait for [data-ready] and document.fonts.ready, never network idle; disable animations. Save shots/ROUTE-WIDTH-THEME.png, and add shots/ to .gitignore: shots are rebuilt on every run, and the ones worth keeping go to tests/baselines/. With VISION=deuteranopia,protanopia, add light shots through Chrome's Emulation.setEmulatedVisionDeficiency. Exit 1 if a light and dark pair is byte-identical: the theme is not switching.
audit ROUTES: same sizes and themes. Collect every custom property declared on :root (media queries included) and resolve each through a hidden probe element for color, padding, font-size, font-family, transition-duration and box-shadow; those computed values are the only allowed ones. On every visible element outside [data-audit-skip], check text colour, size and face, background, padding, gaps, corner radius, shadow and transition duration against that set, ignoring 0, none, auto and transparent. Also flag, when RULES.md §Budgets holds those keys, text contrast against the nearest opaque background below contrast_text (contrast_large from large_text_px, or large_bold_text_px when bold); and always flag interactive elements under --touch-min when the tokens define it, and same-size sibling baselines in a row that differ by 1-3 px. Report the share of the first viewport filled with --accent. Print up to 40 findings per route, size and theme (element, property, value). Exit 1 on any finding.
```

Stills show neither easing nor interruption, and a model cannot watch a video file. So the `audit-ux` script (Always-On · Verification Loop) asserts the motion facts: which properties animate, durations against their tokens, and whether a re-triggered animation continues from where it is. Feel gets a frame strip the model can read, and the final call stays yours.

```bash
# Record with Playwright (newContext({ recordVideo: { dir: "shots/video" } }); the clip is written when the context closes),
# then tile 30 fps frames into one image: 12 x 3 = 36 frames, 1.2 s of motion.
ffmpeg -y -i shots/video/{{CLIP}}.webm -vf "fps=30,scale=360:-1,tile=12x3" -frames:v 1 shots/{{NAME}}-strip.png
```

```prompt title="Screenshot Critique Loop"
Loop on {{ROUTE}}, one round at a time:
1. Run {{?SHOTS_CMD}} {{ROUTE}} and {{?AUDIT_CMD}} {{ROUTE}}. Fix every audit finding first: those are facts (off-token values, contrast, baseline drift, undersized targets), not taste.
2. Get a Design Critic review of the new shots from a session that did not build them, twice with the order swapped. If you cannot start one, stop and ask me to run it and paste the findings back.
3. Fix the critic's findings, highest impact first, with tokens and component styles only.
4. Re-shoot, re-audit and diff: improved, regressed.
Before round 1, show me the audit findings, what you plan to fix and roughly what a round costs, then run the rounds without asking. Stop when the audit is clean and the .offthemode/DESIGN.md §Rubric ship bar is met, or when a round flips no loss (more rounds would go in circles). Then list what remains for my taste call. Never say it "looks great"; report wins, losses and ties.
```

Vague feedback gets ignored or overcorrected; pixel-level feedback gets fixed. "Too cluttered" becomes "7 equal-weight toolbar buttons: keep Run as primary, move 5 to overflow, delete Refresh (auto-refresh exists)". "Looks generic" becomes "the 3-card row is the tell: make it one sequence where each item shows the real output it describes".

```prompt title="De-Genericize Pass"
Audit {{SCOPE}} for statistical-average UI; every hit is a bug.
1. Patterns: run scripts/check-bans.sh, then look for what a pattern cannot catch: every HARD ban in .offthemode/DESIGN.md §Bans, every DEFAULT-OFF ban not listed in §Unbans, and every §Saturated trait. Give file:line, then keep (citing the unban or DECISIONS.md entry that allows it) or replace. Replacements come from DESIGN.md §Principles and §Taste, never from another cliche.
2. Copy: rewrite every sentence a competitor could publish unchanged, using a noun, number or verb from {{?PRODUCT_NAME}}'s domain.
3. Values: run {{?AUDIT_CMD}}; framework defaults and raw values become tokens. Icons that repeat their label: deleted.
4. Delete test: remove each element in turn; if nothing is lost, it stays deleted.
5. The signature moment exists and is the only loud thing.
Report the findings and the planned changes, then make them and give a change summary with before and after screenshots.
```

### Enforce the bans

A ban you only ask for gets forgotten; a ban a script checks does not, so `scripts/check-bans.sh` searches the source for each pattern. HARD ids always apply. A DEFAULT-OFF id is skipped once DESIGN.md §Unbans lists it, so a rounded consumer app is not marked down for being right. Ids with no pattern, such as emoji icons, are left to the critic. The patterns fit CSS and Tailwind; native projects ban in their own idiom, such as `\.cornerRadius\(` and `Color\(red:` for SwiftUI, or `RoundedCornerShape\(` and `Color\(0x` for Compose. If your tool supports hooks (Claude Code does), you can run it after every edit, so hits show up while the code is being written.

```file path="scripts/check-bans.sh"
#!/usr/bin/env bash
# Greps source for banned patterns. HARD ids always apply; OFF ids apply unless .offthemode/DESIGN.md "### Unbans" lists them.
# Ids and reasons live in DESIGN.md §Bans; ids with no pattern are left to the critic. Usage: scripts/check-bans.sh [paths] (default: src). Exit 1 on any hit.
paths=("$@"); [ ${#paths[@]} -eq 0 ] && paths=(src)
unbans="$(sed -n '/^### Unbans/,/^### /p' .offthemode/DESIGN.md 2>/dev/null | grep -oE '^- [a-z0-9-]+' | cut -c3-)"
fail=0
while read -r id tier re; do
  [ -z "$re" ] && continue
  [ "$tier" = OFF ] && printf '%s\n' "$unbans" | grep -qx -- "$id" && continue
  hits="$(grep -rnE --exclude='*tokens*' --exclude='*.md' --exclude-dir=fixtures -- "$re" "${paths[@]}")" || continue
  printf '[%s, %s]\n%s\n' "$id" "$tier" "$hits"; fail=1
done <<'BANS'
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
BANS
[ "$fail" = 0 ] && echo "No ban hits."
exit $fail
```

### The design document

DESIGN.md holds everything visual that is not code. Its feel words come from PRODUCT.md §Feeling. Point RULES.md §Look and feel at it so every UI change reads it first, and change tokens only through a proposal recorded in its changelog.

```file path=".offthemode/DESIGN.md"
DESIGN: {{PRODUCT_NAME}} · v{{VERSION}} · locked {{DATE}} · read before any UI work · under 200 lines
Frame (from PRODUCT.md): {{?PERSON}} · job {{?JOB}} · moment of value {{?MOMENT_OF_VALUE}} · complexity we absorb {{?ABSORBED_COMPLEXITY}}
Thesis: {{ONE_SENTENCE_THESIS}} · feels like {{?FEELING_WORDS from PRODUCT.md §Feeling}} · never like {{N1}}, {{N2}}, {{N3}} · §Taste tension it resolves: {{TENSION}}

### Taste (the builder's; travels to the next product; refresh every six months with Taste Extraction)
Principles (falsifiable; each traced to 2+ loves and contradicted by 1+ hate):
1. {{PRINCIPLE}} · loves {{love-03, love-11}} · hates {{hate-07}}
Recurring moves: type {{}} · colour {{}} · motion {{}} · density {{}} · copy {{}}
What the hates share with the generic AI look: {{TRAITS}}
What the loves share with the anti-slop look (use knowingly): {{TRAITS}}
Tensions (where the edge comes from):
1. {{Love A (love-02) and love B (love-09); a product that holds both looks like ...}}
Never: {{}}

#### Already used (a ban list: a new direction shares at most one column with any row. Starts with the three illustrations from the visual-language guide; add a row when a product ships)
| Product | Display / text faces | Neutral hue, chroma | Accent hue, strategy | Grid model | Surface treatment | Signature pattern |
|---|---|---|---|---|---|---|
| {{PRODUCT}} | {{}} | {{}} | {{}} | {{}} | {{}} | {{}} |

### Principles (this product; falsifiable; only what the references support; from Extract Principles)
1. {{PRINCIPLE}} · refs {{FILES}} · from §Taste {{PRINCIPLE_OR_TENSION}} · fails when {{FAILURE_MODE}}
Dropped as fashion: {{}} · Tensions to resolve: {{}} · What no reference does that the job demands: {{}}

### System
- Tokens: src/styles/tokens.css (web), tokens/tokens.json (all platforms). No raw colour, size or duration in components; a new value is a token proposal, never an inline value.
- Type: display {{FONT_DISPLAY}} for {{DISPLAY_USES}}; text {{FONT_TEXT}}; mono {{FONT_MONO | none}} for {{MONO_USES}}; label treatment {{CASE_TRACKING_STEP}}. Hierarchy: size, weight, space, then colour.
- Colour: strategy {{scarce accent, colour-led, photographic or OTHER}}; neutrals {{tinted to hue N, or achromatic because WHY}}; accent roles {{ROLES}}; one accent role per viewport outside the signature moment.
- Layout: grid model {{GRID_MODEL}}; the primary action sits at {{PRIMARY_ACTION_POSITION}} and carries data-primary; disclosure rules {{DISCLOSURE_RULES}}.
- Motion: {{MOTION_PERSONALITY}}; interactive = springs, system = duration tokens; actions done more than {{N}} times per session get no animation.
- Waiting (from the P2 feel test): {{stream, show the work or optimistic}} for {{OPERATIONS}}.
- Signature moment: {{SIGNATURE_MOMENT}} · trigger {{TRIGGER}} · budget {{PERF_BUDGET}} · fallback {{FALLBACK}}
- Platform: web {{WEB_NOTES}} · iOS {{IOS_NOTES}} · Android {{ANDROID_NOTES}}. In system chrome, native feel beats brand; in content, brand wins.

### Data (charts, tables, timelines)
- Categorical --data-1..6 in order; sequential --data-seq-lo to --data-seq-hi via color-mix in oklch; diverging --data-div-neg, -mid, -pos. Never the chart library's palette.
- The series the user is asking about in --accent; every other series in --ink-3.
- Direct labels over legends; tabular mono on axes; hairlines at major ticks only; no 3D, gradients or drop shadows.
- Designed empty, partial and loading states for every chart.

### Bans
Apply each reason to cases the list does not name. HARD: zero information in any product; never unbanned. DEFAULT-OFF: banned until §Unbans lists the id, the principle it serves and where it applies. Patterns for the ids live in scripts/check-bans.sh.

#### HARD
| id | Banned | Why | Instead |
|---|---|---|---|
| fake-data | Lorem ipsum, John Doe, Acme, $1,234.56 | Fake data makes real design look fake | Fixtures rich in edge cases |
| hype-copy | "Welcome to", "Unlock", "Seamless", "Supercharge", "Elevate", "Empower", "Effortless", "Revolutionize", "Leverage", "Powered by AI" | Zero-information copy | The outcome in the user's nouns; verb + object |
| dead-copy | "Get started" as the only call to action, "Oops!", "Something went wrong", "Click here", "Are you sure?", "Submit" | Says nothing about the result | A button that predicts its result; an error with a next step |
| emoji-icon | Emoji as icons; icons that repeat their label | Instantly reads as vibe-coded | Text labels; custom glyphs where scanning needs them |
| kit-default | Untouched component-library defaults | Reads as unset | Restyled to tokens |
| gradient-text | Decorative gradient text | Decoration carrying no information | Solid ink |
| template-page | Centered hero + 3 feature cards + pricing + FAQ; pill badge above the headline; logo marquee | The statistical-average page | The product doing its job on real data |
| off-token | Raw colour, size or duration values outside tokens | The system stops being editable in one place | A token, or a token proposal |
| layout-anim | Animating width, height, top or left; ease-in on responses | Jank and lag | transform, opacity, clip-path; springs or --ease-out |
| second-signature | A second signature moment | Dilutes the first | Quiet everywhere else |

#### DEFAULT-OFF
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
| long-motion | UI transitions longer than --dur-slow (springs judged by settle time; the signature moment is exempt) | Feels slow on repeat | Rare, ceremonial transitions |
| uniform-space | Uniform medium spacing everywhere | No rhythm | Dense data tables |

#### Project bans
| id | Banned | Why | Instead |
|---|---|---|---|

### Unbans (DEFAULT-OFF ids this product turns on)
- {{id}}: serves principle {{N}}; applies to {{WHERE}}

### Saturated · reviewed {{DATE}} (allowed only with a product reason in DECISIONS.md; review at the start of each product)
| Trait | Where it came from |
|---|---|
| Bento grids; glass and web imitations of Liquid Glass; gradient blobs, mesh, aurora | 2022-25 SaaS templates |
| Linear-clone dark mode with a purple glow; border beams, spotlight cards, shimmer buttons | Effects libraries |
| A serif-italic word dropped into a sans headline | 2024-25 landing pages |
| Warm paper with one signal colour; uppercase mono labels in a rail; hairlines instead of cards; dithering and halftone as texture | The anti-slop look that anti-slop skills push every AI toward |
| Satoshi, General Sans, Clash Display, Cabinet Grotesk, PP Neue Montreal as display | Template marketplaces |
| cmdk, Sonner and Vaul at their default styling | shadcn/ui wraps them, so the default is the average |

### Rubric (judged pairwise by a fresh critic session, never scored absolutely)
Anchors: .offthemode/design/rubric/CRITERION-1.png, -2 and -3; until you have them, hate images stand in for the 1-anchor and love images for the 3-anchor. Each judgement runs twice with the order swapped; runs that disagree are a tie.
Ship bar: beats the 2-anchor on every criterion, and the 3-anchor on 2 (Distinctiveness) and 8 (Signature moment). Pixel facts belong to the audit script, not to this rubric. Add rows from 11 for criteria specific to this product's surfaces.
| # | Criterion | A 1-anchor shows | A 3-anchor shows |
|---|---|---|---|
| 1 | Hierarchy (blur test) | Equal weight everywhere | Blurred, still one focal point and a clear reading order |
| 2 | Distinctiveness | Could be any product; matches a logo-swap candidate or an §Already used row | Recognisably the builder's per §Taste, even from a cropped thumbnail |
| 3 | Typography | Default sizes; grey does the hierarchy | Scale jumps, optical tracking per size, balanced headings, tabular figures |
| 4 | Colour intent | Hues with no reason, framework greys, decorative gradients | Every hue maps to a principle; nothing is a default; dark mode designed |
| 5 | Layout and rhythm | Centered stack, uniform gaps | A visible grid model, density contrast |
| 6 | Restraint (delete test) | Removable elements, 2+ primary actions | Nothing removable; complexity behind defaults and disclosure |
| 7 | Motion | Decorative, uninterruptible, ignores reduced motion | Causal, springs where interactive, frequency-aware |
| 8 | Signature moment | None, or several competing | One, at the moment of value, memorable, within budget |
| 9 | Copy | Template phrases, lorem, "Get started" | Domain nouns, numbers, useful empty and error states |
| 10 | State completeness | Happy path only | Every state, long strings, both themes, both platforms |

### Changelog
{{DATE}} v1 locked. Every token change records the reason, the screens affected and a rubric re-run.
```

### Done when

- [ ] DESIGN.md §Taste exists, from Taste Extraction or carried over from your last product, and is less than six months old
- [ ] 30+ references, half from outside software, motion references as frame strips
- [ ] Falsifiable principles in DESIGN.md §Principles, each traced to references and to §Taste
- [ ] Three directions from anchors you assigned, each built in its own fresh session; divergence checked by `diverge-diff.sh` and a fresh critic
- [ ] One base plus at most two grafts, each with a reason in DECISIONS.md; Saturation Check run
- [ ] Tokens v1 locked (plus DTCG JSON for native); `/specimen` covers every state, both themes, data and reduced motion, and meets the §Rubric ship bar
- [ ] Audit clean, contrast included; `check-bans.sh` clean; signature moment profiled on a mid-tier phone
- [ ] The screenshot, audit and ban commands are in RULES.md §Commands, and RULES.md §Look and feel points to DESIGN.md
