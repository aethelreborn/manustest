import { describe, expect, it } from "vitest";
import { buildGoogleAuthUrl, readGoogleIdToken } from "../lib/google-auth-url";

describe("Google browser auth contract", () => {
  it("builds an explicit Aethel callback URL", () => {
    const url = buildGoogleAuthUrl("client.apps.googleusercontent.com", "aethel://oauth/callback", "nonce-123");
    expect(url).toContain("response_type=id_token");
    expect(url).toContain("redirect_uri=aethel%3A%2F%2Foauth%2Fcallback");
    expect(url).toContain("nonce=nonce-123");
  });

  it("reads an ID token from a browser callback fragment", () => {
    expect(readGoogleIdToken("aethel://oauth/callback#id_token=abc123&state=done")).toBe("abc123");
    expect(readGoogleIdToken("aethel://oauth/callback?error=access_denied")).toBeNull();
  });
});
