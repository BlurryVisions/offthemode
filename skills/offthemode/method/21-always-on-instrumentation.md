## Always-On · Instrumentation
<!-- origin: added -->

> **Output:** `.offthemode/TRACKING.md` with a north-star event, a typed `track()` wrapper, and events defined in the spec before the code.

Product-first means you named a moment of value. If you can't measure users reaching it, you're iterating on vibes. Analytics bolted on later come out with inconsistent names and no link to the questions you actually had.

```file path=".offthemode/TRACKING.md"
TRACKING: {{PRODUCT_NAME}} · north star {{MOMENT_OF_VALUE_EVENT}} · activation = % of new users reaching it within {{WINDOW}} · time to value = median ms from signup_completed to the north star
- object_action, past tense, snake_case (report_exported), objects from GLOSSARY.md. Every event answers a named question; no question, no event.
- No PII in properties (no email, name, phone, free text). Money, auth and entitlement events fire server-side, since ad blockers eat client events.
- Non-essential analytics wait for consent where the law requires; honor Global Privacy Control. Code calls only the typed track() wrapper, never a vendor SDK.
- Hesitation events: abandoned flows, repeated undo, settings opened right after onboarding.

| Event | Fires exactly when | Properties | Question it answers |
|---|---|---|---|
| signup_completed | account row committed | method | Which signup path converts? |
| {{MOMENT_OF_VALUE_EVENT}} | {{EXACT_TRIGGER}} | {{PROPS}} | Do users reach core value, and how fast? |
```

The wrapper is the same pattern on every stack: one typed map of events to properties, one function, the vendor behind one line (a Swift enum with associated values, a Kotlin sealed class). The web-ts version:

```ts
type Events = {
  signup_completed: { method: "email" | "google" | "apple" };
  first_value_reached: { ms_since_signup: number; surface: string }; // rename to your north star
};
export function track<E extends keyof Events>(event: E, props: Events[E]): void {
  if (!consent.analytics()) return;
  sink.capture(event, props); // the vendor is swappable behind this line
}
```

```prompt title="Instrument This Feature"
Before writing code for {{FEATURE}}, propose 3-7 events answering {{QUESTIONS}}: name (object_action, glossary terms), exact trigger, typed properties, the question each answers. Reject events answering no question and properties that could hold PII. Add them to .offthemode/TRACKING.md and the Events type, implement through track() only, and test that each fires once with correct props on the happy path.
```

> **Pro move:** Instrument hesitation: abandoned flows, repeated undo, settings opened right after onboarding. Every stall is complexity leaking onto the user, and a candidate for a smart default.
