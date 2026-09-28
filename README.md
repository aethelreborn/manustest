# Aethel

Aethel is a consent-first, privacy-focused mobile command center for passwords, bills, and focused time.

## Product flows

- **Welcome and consent** — first launch explains the product, requires separate Terms and Privacy acknowledgement, and offers biometric unlock as an explicit opt-in.
- **Vault** — protected passwords, cards, and private notes with biometric-gated reveal and copy actions. No demo records are seeded.
- **Bills** — user-created upcoming, overdue, and paid reminders with local add and mark-paid flows.
- **Focus** — quick-start focus blocks with a live countdown and a clear end-session action.
- **Settings** — persistent biometric, reminder, quiet-hours, consent-review, and local-data deletion controls.
- **Legal and help** — in-app Terms of Service, Privacy Policy, and product/security documentation.

## Architecture

Aethel is local-first with optional Firebase Google Auth and SQL-backed sync:

- **Auth:** Firebase Authentication with Google. Web uses Firebase popup auth; native uses an explicit in-app browser session and the `aethel://oauth/callback` deep link. Firebase ID tokens are sent as bearer headers.
- **SQL identity mapping:** the server verifies Firebase ID tokens with Google public keys, maps `firebase:<uid>` to the SQL `users` table, and applies ownership checks to vault and billing queries.
- **Encryption:** Argon2id key derivation, AES-256-GCM payload encryption, device key storage, and encrypted AsyncStorage snapshots. The API receives vault ciphertext and IV only.
- **Biometrics:** `expo-local-authentication` is never enabled silently. The user must opt in during onboarding or Settings and confirm a real device biometric prompt before vault reveal/copy is allowed.
- **Database:** Drizzle tables for `vault_items` and `billing_items`, plus the generated migration in `drizzle/0001_overjoyed_network.sql`.
- **API:** protected tRPC list/create/update/delete procedures with user ownership predicates for vault and billing records.
- **Render:** `render.yaml` deploys the Node API with exact `PORT` binding. `GET /health` is the Render health check; `GET /api/health` remains available for diagnostics.

## Google browser auth setup

The native browser flow returns to:

```text
aethel://oauth/callback
```

Add that URI to the Google OAuth client used by the app. If Google rejects the callback, Aethel shows the exact redirect URI that must be added. Set `EXPO_PUBLIC_API_BASE_URL` to the deployed Render URL for authenticated SQL sync; offline mode remains available without it.

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

Coverage includes crypto round-trips/tamper rejection, account-isolated storage keys, Firebase configuration, Google browser callback parsing, and release credential checks.

## Companion website

The public product site, documentation, privacy policy, and terms pages live in [`website/`](./website). Run it with:

```bash
cd website && python3 -m http.server 4173
```

## Render deployment

See [`RENDER.md`](./RENDER.md) and [`render.yaml`](./render.yaml). Render needs `DATABASE_URL`; Firebase token verification uses the public Firebase project ID and Google public keys.
