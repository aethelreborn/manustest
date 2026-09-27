import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { AethelButton, BrandMark, SectionHeading } from "@/components/aethel-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsScreen() {
  const colors = useColors();
  const { user, isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const showInfo = (title: string, message: string) => Alert.alert(title, message);
  return <ScreenContainer><View style={styles.page}><View style={styles.header}><BrandMark /><Text style={[styles.headerLabel, { color: colors.muted }]}>{isAuthenticated ? user?.email ?? "SYNCED ACCOUNT" : "LOCAL FIRST"}</Text></View><Text style={[styles.title, { color: colors.foreground }]}>Settings</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Aethel keeps the important parts quiet, clear, and in your control.</Text><SectionHeading eyebrow="Protection" title="Your guardrails" /><View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><SettingToggle icon="fingerprint" title="Biometric unlock" detail="Ask before each protected reveal" value={biometrics} onValueChange={setBiometrics} /><Divider /><SettingToggle icon="notifications-none" title="Bill reminders" detail="Receive a quiet nudge before due dates" value={notifications} onValueChange={setNotifications} /><Divider /><SettingToggle icon="nights-stay" title="Quiet hours" detail="Pause non-urgent reminders after 10 pm" value={quietHours} onValueChange={setQuietHours} /></View><SectionHeading eyebrow="Your data" title="Stay in control" /><View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><SettingLink icon="ios-share" title="Export encrypted data" detail="Create a portable local backup" onPress={() => showInfo("Encrypted export", "A production build will create an encrypted archive without exposing your secrets.")} /><Divider /><SettingLink icon="key" title="Change master password" detail="Re-key your protected items on-device" onPress={() => showInfo("Master password", "Your vault key is derived locally. No master password is sent to a server.")} /><Divider /><SettingLink icon="delete-outline" title="Delete local data" detail="Remove the Aethel vault from this device" danger onPress={() => showInfo("Delete local data", "This demo keeps deletion behind an explicit confirmation in the native build.")} /></View>{isAuthenticated ? <AethelButton variant="secondary" onPress={() => void logout()} icon="logout">Sign out</AethelButton> : <Text style={[styles.offlineState, { color: colors.muted }]}>Offline mode · sign in from the welcome screen to sync.</Text>}<Text style={[styles.footer, { color: colors.muted }]}>Aethel v1.0 · Your data. Your keys. Your privacy.</Text></View></ScreenContainer>;
}

function SettingToggle({ icon, title, detail, value, onValueChange }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; title: string; detail: string; value: boolean; onValueChange: (value: boolean) => void }) {
  const colors = useColors();
  return <View style={styles.settingRow}><View style={[styles.settingIcon, { backgroundColor: colors.inkSoft }]}><MaterialIcons name={icon} size={20} color={colors.primary} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.settingDetail, { color: colors.muted }]}>{detail}</Text></View><Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: `${colors.primary}88` }} thumbColor={value ? colors.primary : colors.muted} /></View>;
}
function SettingLink({ icon, title, detail, onPress, danger = false }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; title: string; detail: string; onPress: () => void; danger?: boolean }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.65 }]}><View style={[styles.settingIcon, { backgroundColor: danger ? `${colors.error}14` : colors.inkSoft }]}><MaterialIcons name={icon} size={20} color={danger ? colors.error : colors.primary} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: danger ? colors.error : colors.foreground }]}>{title}</Text><Text style={[styles.settingDetail, { color: colors.muted }]}>{detail}</Text></View><MaterialIcons name="chevron-right" size={20} color={colors.muted} /></Pressable>;
}
function Divider() { const colors = useColors(); return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 52 }} />; }

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 35 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  headerLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { fontSize: 34, lineHeight: 38, fontWeight: "800", letterSpacing: -1 },
  subtitle: { fontSize: 15, lineHeight: 21, marginTop: 7, marginBottom: 29 },
  card: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginBottom: 26 },
  settingRow: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 11 },
  settingIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  settingCopy: { flex: 1, gap: 4 },
  settingTitle: { fontSize: 15, fontWeight: "800" },
  settingDetail: { fontSize: 12, lineHeight: 17 },
  offlineState: { textAlign: "center", fontSize: 12, lineHeight: 18, marginBottom: 6 },
  footer: { textAlign: "center", fontSize: 12, marginTop: 3 },
});
