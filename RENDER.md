# Render backend

The API is ready to deploy as a Render Web Service using `render.yaml`.

## Deploy

1. Create a Render Web Service from this repository.
2. Render will use `pnpm install --frozen-lockfile && pnpm build` and `pnpm start`.
3. Set `DATABASE_URL` in Render secrets. `FIREBASE_PROJECT_ID` defaults to the Aethel project and is declared in `render.yaml`.
4. Render health checks use `GET /health` and the API is available under `/api/trpc`.
5. Set `EXPO_PUBLIC_API_BASE_URL` in the Expo build environment to the deployed Render URL before producing a release build.

The mobile app remains usable offline when the API URL is not configured, but Google account sync requires the Render URL and Firebase server credentials.
