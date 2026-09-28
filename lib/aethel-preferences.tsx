import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "aethel.preferences.v2";
const CONSENT_VERSION = "2026-09-28";

type Preferences = {
  consentVersion: string | null;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  quietHoursEnabled: boolean;
};

type PreferencesContextValue = Preferences & {
  hydrated: boolean;
  hasAcceptedConsent: boolean;
  biometricAvailable: boolean | null;
  acceptConsent: (enableBiometric: boolean) => Promise<{ enabled: boolean; message?: string }>;
  setBiometricEnabled: (enabled: boolean) => Promise<{ enabled: boolean; message?: string }>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setQuietHoursEnabled: (enabled: boolean) => Promise<void>;
  clearPreferences: () => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const initialPreferences: Preferences = { consentVersion: null, biometricEnabled: false, notificationsEnabled: true, quietHoursEnabled: false };

async function readPreferences(): Promise<Preferences> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return initialPreferences;
  try {
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      consentVersion: typeof parsed.consentVersion === "string" ? parsed.consentVersion : null,
      biometricEnabled: parsed.biometricEnabled === true,
      notificationsEnabled: parsed.notificationsEnabled !== false,
      quietHoursEnabled: parsed.quietHoursEnabled === true,
    };
  } catch {
    return initialPreferences;
  }
}

async function writePreferences(value: Preferences) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

async function checkBiometricAvailability() {
  if (Platform.OS === "web") return false;
  const [hardware, enrolled] = await Promise.all([LocalAuthentication.hasHardwareAsync(), LocalAuthentication.isEnrolledAsync()]);
  return hardware && enrolled;
}

export function AethelPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [hydrated, setHydrated] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([readPreferences(), checkBiometricAvailability()]).then(([stored, available]) => {
      if (!active) return;
      setPreferences(stored);
      setBiometricAvailable(available);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  const setBiometricEnabled = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const available = await checkBiometricAvailability();
      setBiometricAvailable(available);
      if (!available) return { enabled: false, message: "Set up Face ID or fingerprint in your device settings first." };
      const confirmation = await LocalAuthentication.authenticateAsync({ promptMessage: "Confirm biometric unlock for Aethel", biometricsSecurityLevel: "strong", disableDeviceFallback: false });
      if (!confirmation.success) return { enabled: false, message: "Biometric unlock was not enabled because the confirmation was cancelled." };
    }
    const next = { ...preferences, biometricEnabled: enabled };
    setPreferences(next);
    await writePreferences(next);
    return { enabled };
  }, [preferences]);

  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    const next = { ...preferences, notificationsEnabled: enabled };
    setPreferences(next);
    await writePreferences(next);
  }, [preferences]);

  const setQuietHoursEnabled = useCallback(async (enabled: boolean) => {
    const next = { ...preferences, quietHoursEnabled: enabled };
    setPreferences(next);
    await writePreferences(next);
  }, [preferences]);

  const acceptConsent = useCallback(async (enableBiometric: boolean) => {
    const biometric = enableBiometric ? await setBiometricEnabled(true) : { enabled: false };
    if (enableBiometric && !biometric.enabled) return biometric;
    const next = { ...preferences, consentVersion: CONSENT_VERSION, biometricEnabled: biometric.enabled };
    setPreferences(next);
    await writePreferences(next);
    return biometric;
  }, [preferences, setBiometricEnabled]);

  const clearPreferences = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setPreferences(initialPreferences);
  }, []);

  const value = useMemo(() => ({ ...preferences, hydrated, biometricAvailable, hasAcceptedConsent: preferences.consentVersion === CONSENT_VERSION, acceptConsent, setBiometricEnabled, setNotificationsEnabled, setQuietHoursEnabled, clearPreferences }), [acceptConsent, biometricAvailable, clearPreferences, hydrated, preferences, setBiometricEnabled, setNotificationsEnabled, setQuietHoursEnabled]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function useAethelPreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("useAethelPreferences must be used inside AethelPreferencesProvider");
  return context;
}

export { CONSENT_VERSION };
