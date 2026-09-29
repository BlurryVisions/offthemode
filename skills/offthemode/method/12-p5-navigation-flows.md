## P5 · Navigation & Flows
<!-- origin: yours -->

> **Output:** `.offthemode/ROUTES.md` (route map, URL state, journeys, filled state inventory, palette commands), journeys as state machines, a dev-only state switcher, tested deep links, a clickable skeleton that passes Walk Every Flow with zero blockers, and a passed Five-Person Test.

"Site functioning first" is the right instinct, and in a complex product this is where internal complexity either gets absorbed or leaks onto the user. Navigate by nouns, put every state in the URL, model journeys as state machines, and walk the whole product as a clickable shell before any core logic exists, built against P4's mock server.

> **Trap:** The default IA is the SaaS average: a sidebar with Dashboard, Analytics, Projects, Settings. "Dashboard" is a smell, because it names the fact that you didn't know what goes there. Every primary destination should be a noun your user would say out loud.

Rank the entities by how often your person touches each one times its value, and promote 3-5 to primary destinations. Everything else is reached through a parent, search or the palette. Verbs are actions on objects, never menu items. If a user would refresh, bookmark or share a view, it lives in the URL: filters, sort, tabs, selection, route-backed modals. Opening an object pushes history, and changing a filter replaces it. Back closes a modal before it leaves the page. Scroll gets restored, and focus moves to the main heading. Every tap gets feedback inside the BUDGETS.md feedback budget. Prefetch on intent (hover, focus, touch-start), seed detail views from the cached list item, and hoist fetches into route loaders so they can't waterfall.

```prompt title="IA From Domain Model"
Derive the IA of {{?PRODUCT_NAME}} from its domain, not a generic app layout. Inputs: {{SCHEMA_PATH}}, .offthemode/PRODUCT.md, .offthemode/GLOSSARY.md.
1. Object map: objects the user thinks in, with content, metadata, verbs, nested objects; drop implementation-only objects.
2. Rank by frequency x value for {{?PERSON}}; at most {{MAX_PRIMARY_NAV}} become primary. Justify cuts and say where cut objects are reached.
3. Routes: collection + detail per object; per multi-field verb choose inline edit, sheet or route; stateful modals get a URL.
4. URL state per route with types and defaults; history rule (push / replace / none) per interaction.
5. Palette commands and shortcuts. Mobile: which destinations become tabs (3-5), the stack under each, a deep link per route.
Write .offthemode/ROUTES.md. Flag anywhere the IA forces the user to understand system complexity.
```

```file path=".offthemode/ROUTES.md"
ROUTES: {{PRODUCT_NAME}} · source of truth for navigation; a route change updates this file in the same commit.

### Route map
| Route | Purpose | Access | URL state (param: type = default) | History | Deep link | Back target |
|---|---|---|---|---|---|---|
| / | {{MOMENT_OF_VALUE}} surface | user | none | - | {{SCHEME}}:// | - |
| /{{object}}s | Collection (tab 1) | user | q: string; sort: recent or name = recent; cursor | replace | https://{{DOMAIN}}/{{object}}s | / |
| /{{object}}s/:id | Detail | member | tab: overview or activity = overview | push | https://{{DOMAIN}}/{{object}}s/:id | /{{object}}s |
| /{{object}}s/:id/edit | Route-backed sheet | editor | none | push; back closes | same as web | /{{object}}s/:id |

### Core journeys
J1 {{JOURNEY}}: first run to {{MOMENT_OF_VALUE}} in {{N}} interactions, inside the PRODUCT.md time-to-value budget. Driven by e2e/journeys/j1.{{ext}}.
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

Model each core journey (first run to value, the core loop, anything touching money) as states, events and guards, using a state-machine library or a reducer over a discriminated union, so impossible states can't exist.

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

> **Why:** Agents build the happy path because that's what nearly every training example shows. A state union plus an exhaustive switch (a sealed class and `when` in Kotlin, an enum and `switch` in Swift) turns a forgotten state into a compile error, which is enforcement the agent can't talk its way around. "Handle errors" in prose never gives you that.

| State | Show | One primary action | Never |
|---|---|---|---|
| First-run | The single next step to value, prefilled from anything inferable | Take it | A feature tour |
| Empty | What lives here, plus a template or sample | Create or import | Illustration with no action |
| Loading | Geometry-matched skeleton after the BUDGETS.md indicator delay; refetch keeps content | Keep working | Full-page spinner, blanking |
| Optimistic | The result now, rollback on failure | Undo | Optimistic payments, sends, deletes |
| Partial / Error | What loaded, plus inline retry; errors in user terms, input kept | Retry or fix | Whole-page error, lost input |
| Offline | Cached reads, queued writes with a visible count | Continue | Silent failure |
| Permission-denied | Who can grant access | Request access | "Something went wrong" |

> **Pro move:** A dev-only state switcher (`?__state=empty` or a dev toolbar) forces any screen into any state, so reviews, agent screenshots and the flow walk cover every state without staging real failures.

```prompt title="State Inventory Audit"
Audit every screen in .offthemode/ROUTES.md for missing states; a happy path alone is not a finished screen. Fill the state inventory (first-run, empty, loading, partial, ideal, error, offline, permission-denied, plus stale or over-limit where relevant): what the user sees, the one primary action, the implementing component or MISSING. Apply the state rules table; errors map from catalog codes with input preserved. Then add the dev-only state switcher and implement missing states, highest-traffic screens first. Report missing-cell counts before and after.
```

On mobile, tabs hold 3-5 peer nouns, each with its own stack, and re-tapping the active tab pops to root. A cold deep link synthesizes its back stack: open `/projects/12/tasks/9` from a notification, press back, and you land on the project, not outside the app. Spend the signature transition on exactly one move, into your key object, and cross-fade under reduced motion.

**Milestone: the clickable skeleton.** Before any core logic, every route renders at its real URL with the real shell, layout and seed data. The core then plugs into a proven shell. That's your "plug and play", with IA mistakes caught at 5% of the cost. It's also the cheapest moment to put the product in front of strangers.

```prompt title="Walk Every Flow"
Walk {{?APP_URL}} with {{BROWSER_TOOL}} as a first-time user and as a power user. Collect evidence; fix nothing yet. Per route in .offthemode/ROUTES.md:
1. Open cold by URL (and by deep link on mobile): renders, correct title, focus on the main heading.
2. Click every link and primary action; record dead ends (404s, no-op buttons, placeholder links, screens with no way forward or back).
3. Back after each navigation restores place, scroll and URL state; route-backed modals close instead of leaving.
4. Change every filter, tab and sort, reload, and open the URL in a fresh context: the view must reproduce.
5. Run the core journeys keyboard-only and touch-only, at each of {{?VIEWPORTS}}, throttled and offline. Timing comes from {{?AUDIT_CMD}} (the audit-ux journey), not from watching: one tool round-trip is slower than the feedback budget.
6. Force every state via the switcher; screenshot each.
Report Route | Check | Expected | Actual | Screenshot | Severity (blocker, friction, polish). End with the three changes that remove the most friction on the path to {{?MOMENT_OF_VALUE}}. Wait for my go.
```

```prompt title="Five-Person Test"
Write a test script for journey {{JOURNEY_ID, default J1}} in .offthemode/ROUTES.md, to run on the clickable skeleton with 5 people who are neither me nor on the team.
1. Screener: who counts as {{?PERSON}} (situation, tools used today, how often they do the job), and who is out.
2. One scenario in their words, with none of our UI terms or GLOSSARY nouns, and 3 tasks, the first ending at {{?MOMENT_OF_VALUE}}.
3. What I measure: time to the moment of value, first-click correctness per task, pauses of three seconds or more (where, and what they said), and the words they use for our nouns. They think aloud; I never help beyond "what would you do?".
After I paste the notes, output: Task | Success | Time | Pause points | Their word vs the GLOSSARY term. Then the 3 changes that remove the most hesitation, each tried first as a subtraction, default or inference before any new UI, plus GLOSSARY and copy edits wherever their words differ from ours.
```

> **Rule:** The gate passes when at least 4 of 5 reach the moment of value unaided, inside the PRODUCT.md budget. Below that, make the three changes and test five new people, never the same five. Update the Evidence column: after this, Person, Job and Moment are observed, not assumed.
