# Aethel

A calm, privacy-first mobile command center for passwords, subscriptions, and focused time.

Aethel combines three everyday tools into one chronological home view:

- **Vault** — protected passwords, cards, and private notes with reveal/copy affordances.
- **Bills** — upcoming, overdue, and paid reminders with local add and mark-paid flows.
- **Focus** — quick-start focus blocks with a live countdown and optional app-blocking permission language.
- **Settings** — biometric, reminder, quiet-hours, encrypted export, and local-data controls.

## Architecture milestone

The app is local-first with Firebase Google Auth and SQL-backed sync:

- **Auth:** Firebase Authentication with Google provider, Firebase AuthSession on native, Firebase popup auth on web, Firebase ID tokens in bearer headers, and secure Firebase session persistence.
- **SQL identity mapping:** the server verifies Firebase ID tokens with Google public keys, maps `firebase:<uid>` to the existing SQL `users` table, and uses that SQL user id for ownership checks.
- **Encryption:** Argon2id key derivation, AES-256-GCM payload encryption, device key storage, and encrypted AsyncStorage snapshots. The API receives vault ciphertext and IV only.
- **Biometrics:** `expo-local-authentication` gates every vault reveal and copy action on native builds; the web preview uses a safe development fallback.
- **Database:** Drizzle tables for `vault_items` and `billing_items`, plus generated migration `drizzle/0001_overjoyed_network.sql`.
- **API:** Protected tRPC list/create/update/delete procedures with user ownership predicates for vault and billing records.
- **Sync:** Local writes remain available offline and opportunistically sync encrypted vault records and billing records when Firebase Auth is active.

Firebase project: `aethelreborn-de93f`.

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

Unit coverage includes bill/focus helpers, crypto round-trips/tamper rejection, Firebase project configuration, and native Google client ID validation.

## Before app-store release

The remaining release work is intentionally explicit: add the onboarding flow for a user-chosen master password and recovery policy, implement encrypted export/re-key/delete confirmation, register push notifications and due-date jobs, add native iOS/Android focus-blocking entitlements, and configure the Firebase Android/iOS OAuth client IDs for store builds. These are not represented as fake client-side success states.
