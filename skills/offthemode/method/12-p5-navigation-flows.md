## P5 · Navigation & Flows

> **Output:** `.offthemode/ROUTES.md` (route map, URL state, journeys, filled state inventory, palette commands), journeys as state machines, a dev-only state switcher, tested deep links, a clickable skeleton that passes Walk Every Flow with zero blockers, and a passed Five-Person Test.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Any view a person would refresh, bookmark or share keeps its state in the URL. Back and reload return to the same place.
- A new or changed screen covers every state in the ROUTES.md state inventory (first-run, empty, loading, partial, error, offline, no permission), each with one next action.
- Every tap gets visible feedback, inside feedback_ms when RULES.md §Budgets holds it.
- Update ROUTES.md in the same change as the route, including whether it should be found; a route meant to be found keeps one canonical URL and its place in the sitemap (Always-On · Being Found).
- Open the whole guide to add a primary destination, change how the product's places connect (the information architecture), or add a core journey.
<!-- /offthemode:rules -->

Get the whole product working as a shell before the core does anything. In a complex product, this is where internal complexity either gets absorbed or leaks onto the person. Navigate by nouns, put every state in the URL, model journeys as state machines, and walk the whole product as a clickable shell before any core logic exists, built against the mock server from P4.

> **Trap:** The default IA (information architecture: the destinations and how they connect) is the SaaS average: a sidebar with Dashboard, Analytics, Projects, Settings. "Dashboard" is a smell, because it names the fact that nobody decided what goes there. Every primary destination should be a noun your person would say out loud.

Rank the entities by how often your person touches each one times its value, and promote to primary destinations only the ones at the top that the person reaches for in most sessions. Everything else is reached through a parent, search or the command palette. Verbs are actions on objects, never menu items.

If a person would refresh, bookmark or share a view, it lives in the URL: filters, sort, tabs, selection, route-backed modals. Opening an object pushes a history entry, and changing a filter replaces the current one. Back closes a modal before it leaves the page. Scroll gets restored, and focus moves to the main heading.

ROUTES.md also says whether each route should be found: yes, noindex (public but kept out of search) or login. A route meant to be found has one canonical URL, a place in the sitemap the build generates from ROUTES.md, a link from at least one other page in words that say what is there, and a real 404 when what it names doesn't exist. When it moves, one permanent redirect goes straight to the new address. Always-On · Being Found has the detail.

Every tap gets visible feedback, inside feedback_ms when RULES.md §Budgets holds it. Prefetch on intent (hover, focus, touch-start), seed detail views from the cached list item, and move fetches into route loaders so requests can't waterfall (wait on each other one after another).

```prompt title="IA From Domain Model"
Derive the IA of {{?PRODUCT_NAME}} from its domain, not a generic app layout. Inputs: {{SCHEMA_PATH}}, .offthemode/PRODUCT.md, .offthemode/GLOSSARY.md.
1. Object map: the objects the user thinks in, with content, metadata, verbs and nested objects; drop implementation-only objects.
2. Rank by frequency x value for {{?PERSON}}; at most {{MAX_PRIMARY_NAV}} become primary. Justify cuts and say where cut objects are reached.
3. Routes: collection + detail per object; per multi-field verb choose inline edit, sheet or route; stateful modals get a URL.
4. URL state per route with types and defaults; history rule (push / replace / none) per interaction.
5. Palette commands and shortcuts. Mobile: which destinations become tabs (3-5), the stack under each, a deep link per route.
Show me the object map and the ranking first, then write .offthemode/ROUTES.md. Flag anywhere the IA forces the user to understand system complexity.
```

```file path=".offthemode/ROUTES.md"
ROUTES: {{PRODUCT_NAME}} · source of truth for navigation; a route change updates this file in the same commit.

### Route map
| Route | Purpose | Access | Found | URL state (param: type = default) | History | Deep link | Back target |
|---|---|---|---|---|---|---|---|
| / | {{MOMENT_OF_VALUE}} surface | user | {{yes, noindex or login}} | none | - | {{SCHEME}}:// | - |
| /{{object}}s | Collection (tab 1) | user | login | q: string; sort: recent or name = recent; cursor | replace | https://{{DOMAIN}}/{{object}}s | / |
| /{{object}}s/:id | Detail | member | login | tab: overview or activity = overview | push | https://{{DOMAIN}}/{{object}}s/:id | /{{object}}s |
| /{{object}}s/:id/edit | Route-backed sheet | editor | login | none | push; back closes | same as web | /{{object}}s/:id |

Found: yes (meant to be found; the sitemap is generated from these rows), noindex (public, kept out of search) or login (private).

### Core journeys
J1 {{JOURNEY}}: first run to {{MOMENT_OF_VALUE}} in {{N}} interactions, inside the time to value in PRODUCT.md §Experience promises. Driven by e2e/journeys/j1.{{ext}}.
~~~mermaid
stateDiagram-v2
  [*] --> {{STATE_A}}
~~~

### State inventory
| Screen | First-run | Empty | Loading | Partial | Ideal | Error | Offline | Permission-denied |
|---|---|---|---|---|---|---|---|---|
| /{{object}}s | {{SEES + ACTION + COMPONENT, or MISSING}} | | | | | | | |

### Command palette
| Command | Kind (nav, verb, recent) | Shortcut | Scope |
|---|---|---|---|
```

Model each core journey (first run to value, the core loop, anything touching money) as a state machine: a fixed set of states, the events that move between them, and guards (the conditions a move needs). Use a state-machine library, or a reducer over a discriminated union (a type whose variants each carry a status tag), so impossible states can't exist.

```ts
type Upload =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "ready"; assetId: string }
  | { status: "failed"; code: ErrorCode; retryable: boolean };

function view(s: Upload) {
  switch (s.status) {
    // ...one case per status
    default: { const _exhaustive: never = s; return _exhaustive; }
  }
}
```

> **Why:** AI tools build the happy path, because that's what nearly every training example shows. A state union plus an exhaustive switch (a sealed class and `when` in Kotlin, an enum and `switch` in Swift) turns a forgotten state into a compile error, which is enforcement your AI can't talk its way around. "Handle errors" in prose never gives you that.

| State | Show | One primary action | Never |
|---|---|---|---|
| First-run | The single next step to value, prefilled from anything inferable | Take it | A feature tour |
| Empty | What lives here, plus a template or sample | Create or import | Illustration with no action |
| Loading | Geometry-matched skeleton after the indicator delay in RULES.md §Budgets; refetch keeps content | Keep working | Full-page spinner, blanking |
| Optimistic | The result now, rollback on failure | Undo | Optimistic payments, sends, deletes |
| Partial / Error | What loaded, plus inline retry; errors in user terms, input kept | Retry or fix | Whole-page error, lost input |
| Offline | Cached reads, queued writes with a visible count | Continue | Silent failure |
| Permission-denied | Who can grant access | Request access | "Something went wrong" |

> **Pro move:** A dev-only state switcher (`?__state=empty` or a dev toolbar) forces any screen into any state, so reviews, AI screenshots and the flow walk cover every state without staging real failures.

```prompt title="State Inventory Audit"
Audit every screen in .offthemode/ROUTES.md for missing states; a happy path alone is not a finished screen. Fill the state inventory (first-run, empty, loading, partial, ideal, error, offline, permission-denied, plus stale or over-limit where relevant): what the user sees, the one primary action, the implementing component or MISSING. Apply the state rules table; errors map from the error catalog's codes, with input preserved.
Report the missing-cell count per screen and the order you would fix them in, highest-traffic screens first. Then add the dev-only state switcher, implement the missing states, and report missing-cell counts before and after.
```

On mobile, tabs hold 3-5 peer nouns, each with its own stack, and tapping the active tab again returns to the top of its stack. A cold deep link builds its back stack: open `/projects/12/tasks/9` from a notification, press back, and you land on the project, not outside the app. Spend the signature transition on exactly one move, into your key object, and cross-fade under reduced motion.

**Milestone: the clickable skeleton.** Before any core logic, every route renders at its real URL with the real shell, layout and seed data. The core then plugs into a proven shell, and IA mistakes get caught at about 5% of what they cost once the core is built. It's also the cheapest moment to put the product in front of strangers.

```prompt title="Walk Every Flow"
Walk {{?APP_URL}} with {{BROWSER_TOOL}} as a first-time user and as a power user. Collect evidence; fix nothing yet. Per route in .offthemode/ROUTES.md:
1. Open cold by URL (and by deep link on mobile): renders, correct title, focus on the main heading.
2. Click every link and primary action; record dead ends (404s, no-op buttons, placeholder links, screens with no way forward or back).
3. Back after each navigation restores place, scroll and URL state; route-backed modals close instead of leaving.
4. Change every filter, tab and sort, reload, and open the URL in a fresh context: the view must reproduce.
5. Run the core journeys keyboard-only and touch-only, at each of {{?SCREENSHOT_SIZES: screenshot_sizes in RULES.md §Budgets}}, throttled and offline. Timing comes from {{?AUDIT_CMD}} (the audit-ux journey), not from watching: one tool round-trip is slower than the feedback budget.
6. Force every state via the switcher; screenshot each.
Report Route | Check | Expected | Actual | Screenshot | Severity (blocker, friction, polish). End with the three changes that remove the most friction on the path to {{?MOMENT_OF_VALUE}}, then make them.
```

```prompt title="Five-Person Test"
Write a test script for journey {{JOURNEY_ID | J1}} in .offthemode/ROUTES.md, to run on the clickable skeleton with 5 people who are neither me nor on the team.
1. Screener: who counts as {{?PERSON}} (situation, tools used today, how often they do the job), and who is out.
2. One scenario in their words, with none of our UI terms or GLOSSARY nouns, and 3 tasks, the first ending at {{?MOMENT_OF_VALUE}}.
3. What I measure: time to the moment of value, first-click correctness per task, pauses of three seconds or more (where, and what they said), and the words they use for our nouns. They think aloud; I never help beyond "what would you do?".
After I paste the notes, output: Task | Success | Time | Pause points | Their word vs the GLOSSARY term. Then the 3 changes that remove the most hesitation, each tried first as a subtraction, default or inference before any new UI, plus GLOSSARY and copy edits wherever their words differ from ours. Build the 3 changes in that reply; make the GLOSSARY and copy edits once I answer, because names are mine to choose.
```

> **Rule:** The gate passes when at least 4 of 5 reach the moment of value unaided, inside the time to value in PRODUCT.md §Experience promises. Below that, make the three changes and test five new people, never the same five. Then update the evidence in PRODUCT.md: Person, Job and Moment are now observed, not hypotheses, and their rows in RISKS.md can be retired.
