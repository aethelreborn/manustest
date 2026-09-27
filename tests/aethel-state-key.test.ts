import { describe, expect, it } from "vitest";
import { encryptedStateKey } from "../lib/aethel-state-key";

describe("Aethel local state isolation", () => {
  it("uses distinct keys for distinct Firebase accounts", () => {
    expect(encryptedStateKey("firebase:user-a")).not.toBe(encryptedStateKey("firebase:user-b"));
  });
  it("does not reuse the legacy unscoped key", () => {
    expect(encryptedStateKey("firebase:user-a")).not.toBe("aethel.encrypted-state.v1");
  });
});
