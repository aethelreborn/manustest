import { gcm } from "@noble/ciphers/aes.js";
import { argon2id } from "@noble/hashes/argon2.js";

export const KEY_BYTES = 32;

function bytesToBase64(bytes: Uint8Array) { if (typeof btoa === "function") { let binary = ""; const chunkSize = 0x8000; for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize)); return btoa(binary); } return Buffer.from(bytes).toString("base64"); }
export function base64ToBytes(value: string) { if (typeof atob === "function") { const binary = atob(value); return Uint8Array.from(binary, (character) => character.charCodeAt(0)); } return new Uint8Array(Buffer.from(value, "base64")); }
export function deriveVaultKey(masterPassword: string, salt: Uint8Array) { if (masterPassword.trim().length < 8) throw new Error("Master password must be at least 8 characters"); return argon2id(new TextEncoder().encode(masterPassword), salt, { t: 3, m: 65536, p: 1, dkLen: KEY_BYTES }); }
export function encryptPayloadWithNonce(payload: unknown, key: Uint8Array, nonce: Uint8Array) { const plaintext = new TextEncoder().encode(JSON.stringify(payload)); const ciphertext = gcm(key, nonce).encrypt(plaintext); return { encryptedPayload: bytesToBase64(ciphertext), iv: bytesToBase64(nonce) }; }
export function decryptPayload<T>(encryptedPayload: string, iv: string, key: Uint8Array) { const plaintext = gcm(key, base64ToBytes(iv)).decrypt(base64ToBytes(encryptedPayload)); return JSON.parse(new TextDecoder().decode(plaintext)) as T; }
