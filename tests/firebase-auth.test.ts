import { describe, expect, it } from "vitest";

describe("Firebase authentication configuration", () => {
  it("uses the Aethel Firebase project by default", async () => {
    const { firebaseConfig } = await import("../constants/firebase");
    expect(firebaseConfig.projectId).toBe("aethelreborn-de93f");
    expect(firebaseConfig.authDomain).toBe("aethelreborn-de93f.firebaseapp.com");
  });

  it("has a valid Google OAuth Web client ID for native sign-in", async () => {
    const { firebaseGoogleWebClientId } = await import("../constants/firebase");
    expect(firebaseGoogleWebClientId).toMatch(/^\d+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/);
  });

  it("does not accept an empty server project id", async () => {
    const { firebaseServerProjectId } = await import("../constants/firebase");
    expect(firebaseServerProjectId.length).toBeGreaterThan(0);
  });

  it("maps Firebase UIDs to stable SQL ownership keys", async () => {
    const { firebaseUserOpenId } = await import("../server/_core/context");
    expect(firebaseUserOpenId("google-uid-123")).toBe("firebase:google-uid-123");
  });
});
