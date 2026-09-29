## Taming Complexity
<!-- origin: added -->

> **Output:** `.offthemode/COMPLEXITY.md` (budgets, verbs, disclosure map, settings ledger, audit log), a power layer for experts, and the audit-subtract-re-audit ritual run by design-critic.

Complexity is conserved (Tesler's law). What can't be removed gets carried by the system or by the user. Your products are complex by nature, so the job is deciding who carries it: the system first, and the user only when they ask.

| Layer | What lives here | Example |
|---|---|---|
| L0 System | Inference, defaults, automation, recovery | Detect timezone and currency; infer column types on import; auto-name from content; retry syncs silently |
| L1 Default surface | The 20% of capability behind 80% of sessions, one primary action | The canvas and one "Generate" |
| L2 On intent | Depth revealed by selection, focus, expansion, long-press, repeat visits | Selecting a clip reveals trim and fade in place |
| L3 Power | Everything else, fully capable, never in the way | Palette, shortcuts, advanced panel, bulk ops, API |

> **Rule:** A new capability starts in L0 if the system can do it for the user, and in L3 otherwise. It moves toward L1 only on evidence (usage data, a Five-Person Test result, or a PRODUCT.md job that fails without it). Agents add one button to the main screen per feature, so this has to be written down.

- **One primary action per surface** (screen, sheet, modal, panel, popover), marked `data-primary` so a script can count it. Blur test: in a heavily blurred render (CDP `Emulation.setEmulatedVisionDeficiency` with `blurredVision`) you can still tell what to do.
- **A countable budget.** Score = distinct actions x1 + decisions before value x2 + mandatory inputs x3 + competing emphasis x2 + nav destinations x1, measured on the L1 state (nothing selected, no menu open). Count actions, not elements: controls group by role plus accessible name, a repeated control in a list, grid or table counts once, and content links whose name is the object's title count once as "open item". Otherwise a collection with 30 row links blows the budget on the most normal screen in the product, and the agent learns to make rows non-clickable to pass.
- **Never the only gate.** Agents optimize the number they're given. Pair the score with the blur test and, once you have it, the Five-Person Test's first-click result.
- **Hover is a shortcut, never a door.** Hover may only reveal actions that are also reachable by selection, context menu or long-press, and the palette. Hover doesn't exist on touch and fails keyboard and screen-reader discovery. After every Subtraction Pass, re-run the core job keyboard-only and touch-only.
- **Defaults over settings.** Can it be inferred? Is there a default right for 80%? Can it be changed in context? Only if all three fail does it become a setting, logged in the ledger.
- **Nouns and verbs.** 5-7 core nouns in v1, and every verb behaves identically on every noun (gesture, shortcut, menu position), so learning one object teaches all of them.
- **Teach by doing.** First run is the real job on seeded data and ends at the moment of value. Empty states say what goes here, give one action that fills it, and offer an optional sample.
- **Dense but calm.** Clutter is density without hierarchy. At most four steps of the type scale per surface, two weights, grouping by spacing and alignment, never cards inside cards. Status escalates ambient, then inline, then toast, then blocking, with blocking reserved for data loss or safety.

```ts
// Playwright, L1 state: count distinct ACTIONS, not elements.
const actions = await page.evaluate(() => {
  const q = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=switch], [role=menuitem]';
  const keys = new Set<string>();
  for (const el of document.querySelectorAll<HTMLElement>(q)) {
    if (!el.checkVisibility()) continue;
    const role = el.getAttribute("role") ?? el.tagName.toLowerCase();
    const name = (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().toLowerCase();
    const inRepeat = el.closest("li, tr, [role=row], [role=listitem], [role=option], [role=gridcell]");
    keys.add(inRepeat && role === "a" ? "open-item" : `${role}:${name}`); // repeated names collapse; row links count once
  }
  return keys.size;
});
```

Minimal = subtraction + one bold choice. Subtraction alone lands on the most common answer: white page, gray text, rounded cards. The bold choice makes it yours, and subtraction makes the bold choice visible.

| Stunning comes from | Never from |
|---|---|
| One distinctive display face, extreme scale contrast | Gradients as filler |
| Motion that explains state: objects travel from where they were to where they go | Glass, glow and blur everywhere |
| One tactile material used consistently | Feature-card stacks, bento by default |
| A colour strategy with a reason: one scarce accent, colour-led, or photographic | Hues nobody chose |
| One signature moment with outsized care | Decoration no principle asked for: default illustrations, "New" pills, confetti on routine actions |

> **Why:** Run audits through design-critic, never the builder. A fresh context that sees only the rendered screen, the budget and PRODUCT.md is more honest than an author with its own reasoning in context. Audit every new screen, before every user-facing merge, and weekly during P6, where clutter accretes one reasonable addition at a time.

```file path=".offthemode/COMPLEXITY.md"
COMPLEXITY: {{PRODUCT_NAME}} · read before adding any UI; budgets are limits, not suggestions.

### Budget
Score = distinct actions x1 + required decisions x2 + mandatory inputs x3 + competing emphasis x2 + visible nav destinations x1, on the L1 state. Actions group by role + accessible name; repeated items in a list count once; row links whose name is the object's title count once.
| Surface | Web | Mobile | Primary actions |
|---|---|---|---|
| Default screen | {{15}} | {{10}} | 1 |
| Detail / editor | {{20}} | {{14}} | 1 |
| Modal / sheet | {{8}} | {{6}} | 1 |
| Onboarding step | {{5}} | {{4}} | 1 |
Over budget is a bug; exceptions go in the Audit log with a reason and an expiry. The score never gates alone: pair it with the blur test and first-click results.

### Verbs (nouns from GLOSSARY.md)
| Verb | Web | Mobile | Shortcut | Applies to |
|---|---|---|---|---|
| {{delete}} | {{menu item + undo toast}} | {{swipe + undo}} | {{Backspace}} | {{all nouns}} |

### Disclosure map
| Screen | L0 inferred / automated | L1 visible | L2 trigger -> reveals (never hover alone) | L3 palette / shortcut |
|---|---|---|---|---|

### Settings ledger
| Setting | Why not inferred | Why not defaulted | Changed in context where |
|---|---|---|---|

### Audit log
| Date | Surface | Score before -> after | Cuts | Exceptions (reason, expiry) |
|---|---|---|---|---|
```

```prompt title="Complexity Audit"
Run as design-critic. Audit rendered screens, not code; read .offthemode/PRODUCT.md and .offthemode/COMPLEXITY.md first. Screens {{ROUTES | "the core flow"}} at each of {{?VIEWPORTS}}, each in empty, loading, error and populated states (via the state switcher), measured on the L1 state.
Per surface: (1) count, do not estimate: distinct actions (the counting rule in COMPLEXITY.md), required decisions, mandatory inputs, competing emphasis, nav destinations; show the score against budget; (2) blur test on a blurredVision render: what stands out? If it is not the primary action, or two things compete, name them; (3) elements that belong in another layer (L0/L2/L3); (4) dead ends, confirms that should be undo, settings that should be defaults, hover-only actions, decoration carrying no information.
Output one table, worst overage first: surface, score/budget, top 3 offenders with evidence. Fix nothing and recommend no moves; the Subtraction Pass chooses them. Append scores to the Audit log.
```

```prompt title="Subtraction Pass"
Bring {{SURFACE}} within budget from the latest Complexity Audit. Every job in .offthemode/PRODUCT.md must stay completable in the same number of steps or fewer. Apply in order; stop once within budget:
1. Delete elements with no job, duplicate paths, labels restating the obvious, decoration.
2. Infer (L0): remove the control, do the work automatically, show the result with a one-step override.
3. Default: the 80% option, changeable in context.
4. Disclose (L2) on selection, focus, expansion or long-press; name the trigger. Hover never as the only path.
5. Relocate (L3) to palette, shortcut or advanced panel, still findable by search.
6. Merge controls never used independently.
Exactly one primary action survives; nothing moves to L2/L3 without a findable trigger; the signature moment is untouched; no new UI may solve a subtraction. Show element -> fate -> mechanism, then implement, re-render, re-score, and re-run the core job keyboard-only and touch-only.
```

Before a screen exists, fill its Disclosure map row first. Assign each capability to exactly one layer, give every L2 item its intent signal and every L3 item its palette name and shortcut, and list anything that won't fit the L1 limit as a product question for you, not a layout problem.

```prompt title="Power-User Layer"
Build the power layer for {{?PRODUCT_NAME}} without touching default surfaces. Read the verbs table and L3 column in .offthemode/COMPLEXITY.md.
1. Command palette (Cmd/Ctrl+K on web, a search sheet on mobile): every verb x noun, plus jump-to-any-object; fuzzy match, recents first, shortcut beside each command, acts on the selection, runs inline.
2. Shortcuts: single keys for the top 5-10 verbs outside text fields, modifiers otherwise, a "?" overlay; no conflicts with OS, browser or assistive-tech bindings.
3. Bulk ops: shift-click ranges, Cmd/Ctrl-click, select all in view; one undo reverts the batch.
4. After a user repeats a slow path {{3}} times, show its shortcut once, inline and dismissible.
Zero additions to L1 beyond a palette hint; every command reachable without a keyboard. Test the core job keyboard-only and report time against the mouse path.
```
