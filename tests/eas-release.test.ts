import { describe, expect, it } from "vitest";

describe("EAS release credentials", () => {
  it("authenticates the configured Expo token", async () => {
    const token = process.env.EXPO_TOKEN;
    expect(token, "EXPO_TOKEN must be provided for release validation").toBeTruthy();
    const response = await fetch("https://api.expo.dev/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: "query CurrentUser { meActor { __typename id } }" }),
    });
    const body = (await response.json()) as { data?: { meActor?: { id?: string } }; errors?: unknown[] };
    expect(response.ok, `Expo GraphQL endpoint returned ${response.status}`).toBe(true);
    expect(body.errors, "Expo GraphQL rejected the token").toBeUndefined();
    expect(body.data?.meActor?.id).toBeTruthy();
  }, 30_000);
});
