import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { AethelButton, BrandMark } from "@/components/aethel-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { startOAuthLogin } from "@/constants/oauth";

export default function EntryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  useEffect(() => { if (isAuthenticated) router.replace("/(tabs)"); }, [isAuthenticated, router]);
  if (loading) return <ScreenContainer edges={["top", "bottom", "left", "right"]}><View style={styles.loading}><View style={[styles.logo, { backgroundColor: colors.primary }]}><MaterialIcons name="key" size={30} color="#FFFFFF" /></View><ActivityIndicator color={colors.primary} /></View></ScreenContainer>;
  return <ScreenContainer edges={["top", "bottom", "left", "right"]}><View style={styles.page}><BrandMark /><View style={styles.hero}><View style={[styles.logo, { backgroundColor: colors.primary }]}><MaterialIcons name="lock" size={30} color="#FFFFFF" /></View><Text style={[styles.title, { color: colors.foreground }]}>Your data.{`\n`}Your keys.</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Aethel keeps passwords, bills, and focus time in one calm, private place.</Text></View><View style={styles.bottom}><View style={styles.promise}><Promise icon="lock" text="Secrets encrypted on your device" /><Promise icon="fingerprint" text="Biometric protection when it matters" /><Promise icon="cloud-off" text="Works offline, syncs when you choose" /></View><AethelButton onPress={async () => { try { await startOAuthLogin(); } catch { Alert.alert("Sign-in unavailable", "Set up the Manus OAuth environment to enable account sync."); } }} icon="login">Sign in with Manus</AethelButton><Pressable onPress={() => router.replace("/(tabs)")} style={({ pressed }) => [styles.offlineButton, pressed && { opacity: 0.6 }]}><Text style={[styles.offlineText, { color: colors.primary }]}>Continue offline</Text></Pressable><Text style={[styles.legal, { color: colors.muted }]}>You can start locally and connect an account later.</Text></View></View></ScreenContainer>;
}

function Promise({ icon, text }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; text: string }) { const colors = useColors(); return <View style={styles.promiseRow}><MaterialIcons name={icon} size={17} color={colors.primary} /><Text style={[styles.promiseText, { color: colors.muted }]}>{text}</Text></View>; }

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }, page: { flex: 1, padding: 24, justifyContent: "space-between" }, logo: { width: 62, height: 62, borderRadius: 21, alignItems: "center", justifyContent: "center" }, hero: { gap: 16, marginTop: -40 }, title: { fontSize: 42, lineHeight: 43, fontWeight: "800", letterSpacing: -1.6 }, subtitle: { maxWidth: 330, fontSize: 16, lineHeight: 23 }, bottom: { gap: 16 }, promise: { gap: 11, marginBottom: 5 }, promiseRow: { flexDirection: "row", alignItems: "center", gap: 9 }, promiseText: { fontSize: 14 }, offlineButton: { alignItems: "center", minHeight: 40, justifyContent: "center" }, offlineText: { fontSize: 15, fontWeight: "800" }, legal: { fontSize: 11, textAlign: "center" }, });
