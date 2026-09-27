import { describe, expect, it } from "vitest";

import { decryptPayload, deriveVaultKey, encryptPayloadWithNonce } from "../lib/aethel-crypto-core";

describe("Aethel crypto boundary", () => {
  it("derives an Argon2id key and round-trips an AES-GCM payload", () => {
    const key = deriveVaultKey("correct horse battery staple", new Uint8Array(16).fill(7));
    const envelope = encryptPayloadWithNonce({ username: "user@example.com", secret: "sensitive-value" }, key, new Uint8Array(12).fill(9));
    expect(envelope.encryptedPayload).not.toContain("sensitive-value");
    expect(decryptPayload(envelope.encryptedPayload, envelope.iv, key)).toEqual({ username: "user@example.com", secret: "sensitive-value" });
  });

  it("rejects tampered ciphertext with the GCM authentication tag", () => {
    const key = deriveVaultKey("correct horse battery staple", new Uint8Array(16).fill(3));
    const envelope = encryptPayloadWithNonce({ secret: "keep-private" }, key, new Uint8Array(12).fill(4));
    const tampered = `${envelope.encryptedPayload.slice(0, -2)}AA`;
    expect(() => decryptPayload(tampered, envelope.iv, key)).toThrow();
  });
});
