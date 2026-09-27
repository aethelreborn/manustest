import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";
import { base64ToBytes, decryptPayload, deriveVaultKey, encryptPayloadWithNonce, KEY_BYTES } from "@/lib/aethel-crypto-core";

const KEY_NAME = "aethel_aes_key";
const SALT_NAME = "aethel_salt";
const NONCE_BYTES = 12;

function bytesToBase64(bytes: Uint8Array) { if (typeof btoa === "function") { let binary = ""; const chunkSize = 0x8000; for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize)); return btoa(binary); } return Buffer.from(bytes).toString("base64"); }
async function readSecret(name: string) { if (Platform.OS === "web") return window.localStorage.getItem(name); return SecureStore.getItemAsync(name); }
async function writeSecret(name: string, value: string) { if (Platform.OS === "web") { window.localStorage.setItem(name, value); return; } await SecureStore.setItemAsync(name, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }); }

export { decryptPayload, deriveVaultKey, encryptPayloadWithNonce };
export async function getOrCreateVaultKey(masterPassword?: string) { const existing = await readSecret(KEY_NAME); if (existing) return base64ToBytes(existing); let salt = await readSecret(SALT_NAME); if (!salt) { salt = bytesToBase64(await Crypto.getRandomBytesAsync(16)); await writeSecret(SALT_NAME, salt); } const key = masterPassword ? deriveVaultKey(masterPassword, base64ToBytes(salt)) : await Crypto.getRandomBytesAsync(KEY_BYTES); await writeSecret(KEY_NAME, bytesToBase64(key)); return key; }
export async function encryptPayload(payload: unknown, key: Uint8Array) { return encryptPayloadWithNonce(payload, key, await Crypto.getRandomBytesAsync(NONCE_BYTES)); }
export async function authenticateBiometric(promptMessage = "Reveal protected Aethel data") { if (Platform.OS === "web") return true; const hardware = await LocalAuthentication.hasHardwareAsync(); const enrolled = await LocalAuthentication.isEnrolledAsync(); if (!hardware || !enrolled) return false; const result = await LocalAuthentication.authenticateAsync({ promptMessage, biometricsSecurityLevel: "strong", disableDeviceFallback: false }); return result.success; }
export const cryptoStorageKeys = { KEY_NAME, SALT_NAME } as const;
