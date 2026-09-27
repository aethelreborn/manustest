import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptPayload, encryptPayload, getOrCreateVaultKey } from "@/lib/aethel-crypto";

const STATE_KEY = "aethel.encrypted-state.v1";

export async function loadEncryptedState<T>() {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  if (!raw) return null;
  const envelope = JSON.parse(raw) as { encryptedPayload: string; iv: string };
  const key = await getOrCreateVaultKey();
  return decryptPayload<T>(envelope.encryptedPayload, envelope.iv, key);
}

export async function saveEncryptedState<T>(state: T) {
  const key = await getOrCreateVaultKey();
  const envelope = await encryptPayload(state, key);
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(envelope));
}

export const encryptedStateStorageKey = STATE_KEY;
