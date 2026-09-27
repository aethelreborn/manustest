import AsyncStorage from "@react-native-async-storage/async-storage";

const CONSENT_KEY = "aethel-consent-v1";
const BIOMETRIC_KEY = "aethel-biometric-enabled-v1";

export type ConsentState = { acceptedAt: string; termsVersion: string; privacyVersion: string };

export async function getConsent(): Promise<ConsentState | null> {
  const raw = await AsyncStorage.getItem(CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export async function saveConsent(): Promise<void> {
  await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify({ acceptedAt: new Date().toISOString(), termsVersion: "2026-09-27", privacyVersion: "2026-09-27" } satisfies ConsentState));
}

export async function getBiometricEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(BIOMETRIC_KEY)) === "true";
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(BIOMETRIC_KEY, String(enabled));
}

export const onboardingStorageKeys = { CONSENT_KEY, BIOMETRIC_KEY } as const;
