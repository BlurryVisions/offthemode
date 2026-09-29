## Mobile Addendum
<!-- origin: added -->

Everything above still applies. This is what changes on a phone.

| Phase | What changes |
|---|---|
| Rules | Pick the stack pack (expo, swift, kotlin, flutter): it supplies the one-file linter, screenshot capture, token lint and framework expert. Declare minimum OS and target devices; load `expert-mobile.md` in mobile directory packs |
| Vision | Sessions are short, one-handed and interrupted; the moment of value survives backgrounding and resumes exactly |
| Visuals | The platform owns navigation, gestures, system sheets, text input and haptic meaning, plus chrome materials (iOS 26 Liquid Glass and its large concentric corners, never faked on web; unban `glass` and `radius-8plus` for native chrome only). Brand owns type in content, colour, motion and the signature moment |
| Tokens | Safe areas and cutouts; edge-to-edge (enforced when targeting Android 15); Dynamic Type and font scale; a decision on Material dynamic colour; concentric radii as tokens; haptic tokens beside motion tokens; springs from `motion.ts` |
| Backend | Offline-first: a local DB as the UI's source of truth, a sync engine (P4), an explicit conflict policy; additive-only API plus a minimum-supported-version check |
| Navigation | Universal Links and App Links under `/.well-known/`, deferred deep links through install, Android predictive back registered ahead of time, iOS edge-swipe back never broken |
| Core | The BUDGETS.md frame budget; UI-thread animation (Reanimated, SwiftUI, Compose) with springs inheriting gesture velocity; virtualized lists; image decoding off the main thread |

> **Rule:** In chrome, native feel beats brand. In content, brand wins.

- [ ] Push permission requested in context after value, never at first launch (iOS provisional authorization; Android 13+ `POST_NOTIFICATIONS`); every push deep-links to the exact state it describes, with frequency caps
- [ ] Apple: in-app account deletion, privacy labels plus a privacy manifest, a demo account in review notes, Sign in with Apple (or another privacy-focused option) alongside third-party login, IAP for digital goods, ATT only if you track
- [ ] Google Play: Data safety form, current target API level, prominent disclosure; new personal developer accounts need a closed test with 12+ opted-in testers for 14 continuous days
- [ ] OTA (EAS Update, Shorebird) only for JS/Dart and assets, never a change of primary purpose; anything native needs a store build; pin the OTA runtime to the native build
- [ ] Phased release and staged rollout gated on crash-free sessions; a remote-config kill switch shipped before you need it; store screenshots captured from the real app on the `demo` seed, in moment-of-value order (P8, Landing as Demo)
- [ ] Device matrix: smallest and largest phones; a 2-4 GB Android on the oldest supported OS; largest text, bold text, reduced motion, VoiceOver, TalkBack; RTL and Devanagari locales; offline, flaky 3G, an incoming call, an hour in the background, a permission revoked in Settings; cutouts and a foldable

```prompt title="Mobile Platform Pass"
Review {{SCREEN_OR_FLOW}} as the engineers who designed {{PLATFORM}}'s UI framework would. Load ~/.claude/experts/expert-mobile.md and the framework profile.
1. Conventions: every place we fight the platform (custom back, fake native control, odd gesture, wrong sheet type); fix each unless it is the declared signature moment.
2. Ergonomics: the primary action in the BUDGETS.md thumb zone, targets at the BUDGETS.md platform minimums, usable one-handed.
3. Resilience: kill mid-flow and relaunch, go offline, rotate, largest text size; screenshot each; fix lost state.
4. Performance: profile a scroll through the scale seed on {{LOW_END_DEVICE}}; report dropped frames and main-thread work over the BUDGETS.md frame budget; fix the worst three.
5. Deep links: every screen opens cold from a link with state restored and a synthesized back stack.
Report in the Prove It Works format.
```
