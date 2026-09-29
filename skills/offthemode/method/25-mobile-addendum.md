## Mobile Addendum

Every phase of the method still applies on mobile. This sheet covers what changes on a phone. Add a line to RULES.md §Guides that maps mobile work to it, so your AI opens it before planning any screen, flow or release.

| Phase | What changes |
|---|---|
| Rules | RULES.md §This project declares the minimum OS versions and target devices. §Commands lists the mobile commands: a single-file lint, a type check, screenshot capture from the simulator or emulator, and a token lint (a script that fails on hard-coded colors, sizes and durations) |
| Vision | Sessions are short, one-handed and interrupted; the moment of value survives backgrounding and resumes exactly where it was |
| Visuals | The platform owns navigation, gestures, system sheets, text input and what each haptic means, plus chrome materials (iOS 26 Liquid Glass and its large concentric corners, never faked on web; if DESIGN.md avoids glass effects or large radii, allow them for native chrome only). The brand owns type in content, color, motion and the signature moment |
| Tokens | Safe areas and cutouts; edge-to-edge (enforced when targeting Android 15); Dynamic Type and font scale; a decision on Material dynamic color; concentric radii as tokens; haptic tokens beside motion tokens; springs from the motion tokens file (for example `motion.ts`) |
| Backend | Offline-first: a local database as the UI's source of truth, a sync engine (P4), an explicit conflict policy; an additive-only API plus a minimum-supported-version check, because old app versions stay installed for months |
| Navigation | Universal Links and App Links under `/.well-known/`, deferred deep links that survive the install, Android predictive back registered ahead of time, iOS edge-swipe back never broken |
| Core | The frame budget from RULES.md §Budgets; animation on the UI thread (Reanimated, SwiftUI, Compose) with springs that inherit the gesture's velocity; virtualized lists; image decoding off the main thread |

> **Rule:** In chrome, native feel beats brand. In content, brand wins.

- [ ] Push permission requested in context after value, never at first launch (iOS provisional authorization; Android 13+ `POST_NOTIFICATIONS`); every push deep-links to the exact state it describes, with frequency caps
- [ ] Apple: in-app account deletion, privacy labels plus a privacy manifest, a demo account in the review notes, Sign in with Apple (or another privacy-focused option) alongside third-party login, in-app purchase for digital goods, App Tracking Transparency only if you track
- [ ] Google Play: Data safety form, current target API level, prominent disclosure; new personal developer accounts need a closed test with 12 or more opted-in testers for 14 continuous days
- [ ] Over-the-air updates (EAS Update, Shorebird) only for JS or Dart code and assets, never a change of the app's primary purpose; anything native needs a store build; pin the update runtime to the native build
- [ ] Phased release and staged rollout gated on crash-free sessions; a remote-config kill switch shipped before you need it; store screenshots captured from the real app on the demo seed, in moment-of-value order (P8, Landing as Demo)
- [ ] Device matrix: smallest and largest phones; a 2 to 4 GB Android on the oldest supported OS; largest text, bold text, reduced motion, VoiceOver, TalkBack; RTL and Devanagari locales; offline, flaky 3G, an incoming call, an hour in the background, a permission revoked in Settings; cutouts and a foldable

```prompt title="Mobile Platform Pass"
Open the Mobile Addendum guide first. Then review {{SCREEN_OR_FLOW}} as the engineers who designed {{PLATFORM}}'s UI framework would.
1. Conventions: every place we fight the platform (custom back, fake native control, odd gesture, wrong sheet type). Propose a fix for each unless it is the signature moment declared in PRODUCT.md.
2. Ergonomics: the primary action in the thumb zone and targets at the platform minimums, both from RULES.md §Budgets; usable one-handed.
3. Resilience: kill mid-flow and relaunch, go offline, rotate, largest text size; screenshot each; list any lost state.
4. Performance: profile a scroll through the scale seed on {{LOW_END_DEVICE}}; report dropped frames and main-thread work over the RULES.md §Budgets frame budget; name the worst three.
5. Deep links: every screen opens cold from a link with its state restored and a sensible back stack built behind it.
Report each finding with evidence (screenshot, profiler trace or file:line) and the fix you propose, then wait for my go. After fixing, re-run the affected checks on a simulator or device and show the before and after.
```
