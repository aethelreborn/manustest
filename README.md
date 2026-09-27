# Aethel

A calm, privacy-first mobile command center for passwords, subscriptions, and focused time.

Aethel combines three everyday tools into one chronological home view:

- **Vault** — protected passwords, cards, and private notes with reveal/copy affordances.
- **Bills** — upcoming, overdue, and paid reminders with local add and mark-paid flows.
- **Focus** — quick-start focus blocks with a live countdown and optional app-blocking permission language.
- **Settings** — biometric, reminder, quiet-hours, encrypted export, and local-data controls.

## Product direction

The app follows the Aethel design system: calm authority, muted teal, clear urgency colors, comfortable 15sp+ text, and first-class light/dark palette tokens. Starter content is stored locally so the preview immediately communicates the product; all user changes persist with AsyncStorage.

## Run locally

```bash
pnpm install
pnpm dev
```

The Expo preview runs in a browser for fast review and can also be opened in Expo Go using the generated QR flow.

## Validate

```bash
pnpm check
pnpm lint
pnpm test -- --run
```

Unit coverage lives in `tests/aethel-utils.test.ts` and covers active bill totals, bill filters, and safe focus-time formatting.

## Notes

This repository contains the mobile product surface and local-first state layer. Production-grade zero-knowledge encryption, biometric prompts, native app blocking entitlements, and remote sync should be connected behind the existing affordances before shipping to app stores.
