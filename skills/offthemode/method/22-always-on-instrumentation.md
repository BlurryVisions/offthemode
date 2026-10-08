## Always-On · Instrumentation

> **Output:** `.offthemode/TRACKING.md` with a north-star event, a typed `track()` wrapper, and events written into the spec before the code.

Product first means PRODUCT.md names a moment of value. If you can't measure people reaching it, you are iterating on vibes. Analytics bolted on later come out with inconsistent names and no link to the questions you actually had. The north star is the one event that means a person got the value the product exists for; every other event explains the path to it.

```file path=".offthemode/TRACKING.md"
TRACKING: {{PRODUCT_NAME}} · north star {{MOMENT_OF_VALUE_EVENT}} (the moment of value in PRODUCT.md) · activation = % of new users reaching it within {{WINDOW}} · time to value = median ms from signup_completed to the north star, target in PRODUCT.md §Experience promises
- Names: object_action, past tense, snake_case (report_exported), objects from GLOSSARY.md. Every event answers a named question; no question, no event.
- No personal data in properties (no email, name, phone, free text). Money, sign-in and entitlement events fire on the server, because ad blockers drop events sent from the browser.
- Non-essential analytics wait for consent where the law requires it; honor Global Privacy Control. Code calls only the typed track() wrapper, never a vendor SDK.

| Event | Fires exactly when | Properties | Question it answers |
|---|---|---|---|
| signup_completed | account row committed | method | Which signup path converts? |
| {{MOMENT_OF_VALUE_EVENT}} | {{EXACT_TRIGGER}} | {{PROPS}} | Do people reach core value, and how fast? |
| {{FLOW}}_abandoned | someone leaves {{FLOW}} after starting it, without finishing | last_step | Where do people give up? |
```

Global Privacy Control is a browser setting that tells every site not to sell or share the person's data.

The wrapper is the same pattern on every stack: one typed map of events to their properties, one function, and the analytics vendor behind one line (in Swift an enum with associated values, in Kotlin a sealed class). Because the map is typed, a misspelled event or a missing property fails the type check instead of quietly splitting your data. The web TypeScript version:

```ts
type Events = {
  signup_completed: { method: "email" | "google" | "apple" };
  first_value_reached: { ms_since_signup: number; surface: string }; // rename to your north star
};
export function track<E extends keyof Events>(event: E, props: Events[E]): void {
  if (!consent.analytics()) return; // your consent check
  sink.capture(event, props);       // the vendor, swappable behind this one line
}
```

```prompt title="Instrument This Feature"
Before writing code for {{FEATURE}}, propose the events that answer {{QUESTIONS}}, one per question worth answering: name (object_action, glossary terms), exact trigger, typed properties, and the question each answers. Reject events that answer no question and properties that could hold personal data.
Show me the list, then add the events to .offthemode/TRACKING.md and the Events type, implement them through track() only, and test that each fires exactly once with the right properties on the happy path.
```

> **Pro move:** Instrument hesitation: abandoned flows, repeated undo, settings opened right after onboarding. Every stall is complexity leaking onto the person, and a candidate for a smart default.
