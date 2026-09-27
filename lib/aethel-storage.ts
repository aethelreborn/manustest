import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptPayload, encryptPayload, getOrCreateVaultKey } from "@/lib/aethel-crypto";
import { encryptedStateKey } from "@/lib/aethel-state-key";

export async function loadEncryptedState<T>(scope = "offline") {
  const raw = await AsyncStorage.getItem(encryptedStateKey(scope));
  if (!raw) return null;
  const envelope = JSON.parse(raw) as { encryptedPayload: string; iv: string };
  const key = await getOrCreateVaultKey();
  return decryptPayload<T>(envelope.encryptedPayload, envelope.iv, key);
}

export async function saveEncryptedState<T>(state: T, scope = "offline") {
  const key = await getOrCreateVaultKey();
  const envelope = await encryptPayload(state, key);
  await AsyncStorage.setItem(encryptedStateKey(scope), JSON.stringify(envelope));
}

export const encryptedStateStorageKey = encryptedStateKey;
