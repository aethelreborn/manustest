# Aethel

A calm, privacy-first mobile command center for passwords, subscriptions, and focused time.

Aethel combines three everyday tools into one chronological home view:

- **Vault** — protected passwords, cards, and private notes with reveal/copy affordances.
- **Bills** — upcoming, overdue, and paid reminders with local add and mark-paid flows.
- **Focus** — quick-start focus blocks with a live countdown and optional app-blocking permission language.
- **Settings** — biometric, reminder, quiet-hours, encrypted export, and local-data controls.

## Architecture milestone

The app is local-first but now has the production seams for account sync:

- **Auth:** Manus OAuth entry screen, native bearer sessions in `expo-secure-store`, web cookie auth, callback routing, and logout.
- **Encryption:** Argon2id key derivation, AES-256-GCM payload encryption, device key storage, and encrypted AsyncStorage snapshots. The API receives vault ciphertext and IV only.
- **Biometrics:** `expo-local-authentication` gates every vault reveal and copy action on native builds; the web preview uses a safe development fallback.
- **Database:** Drizzle tables for `vault_items` and `billing_items`, plus generated migration `drizzle/0001_overjoyed_network.sql`.
- **API:** Protected tRPC list/create/update/delete procedures with user ownership predicates for vault and billing records.
- **Sync:** Local writes remain available offline and opportunistically sync encrypted vault records and billing records when an authenticated API is available.

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
pnpm build
```

Unit coverage includes bill/focus helpers and crypto round-trips/tamper rejection in `tests/`.

## Before app-store release

The remaining release work is intentionally explicit: connect the production Manus OAuth environment variables, add the onboarding flow for a user-chosen master password and recovery policy, implement encrypted export/re-key/delete confirmation, register push notifications and due-date jobs, and add native iOS/Android focus-blocking entitlements. These are not represented as fake client-side success states.
