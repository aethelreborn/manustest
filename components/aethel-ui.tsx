import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, type PressableProps, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return <View style={styles.brandRow}><View style={[styles.brandIcon, { backgroundColor: colors.primary }]}><MaterialIcons name="key" size={compact ? 14 : 17} color="#FFFFFF" /></View>{!compact && <Text style={[styles.brandWord, { color: colors.foreground }]}>Aethel</Text>}</View>;
}
export function SectionHeading({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.headingRow}><View>{eyebrow && <Text style={[styles.eyebrow, { color: colors.muted }]}>{eyebrow.toUpperCase()}</Text>}<Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text></View>{action && onAction && <Pressable onPress={onAction} hitSlop={10}><Text style={[styles.actionText, { color: colors.primary }]}>{action}</Text></Pressable>}</View>;
}
export function Pill({ label, color, icon }: { label: string; color: string; icon?: React.ComponentProps<typeof MaterialIcons>["name"] }) {
  return <View style={[styles.pill, { backgroundColor: `${color}18` }]}>{icon && <MaterialIcons name={icon} size={13} color={color} />}<Text style={[styles.pillText, { color }]}>{label}</Text></View>;
}
export function AethelButton({ children, variant = "primary", onPress, icon, ...props }: Omit<PressableProps, "style"> & { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; icon?: React.ComponentProps<typeof MaterialIcons>["name"] }) {
  const colors = useColors();
  const backgroundColor = variant === "primary" ? colors.primary : variant === "secondary" ? colors.inkSoft : "transparent";
  const foreground = variant === "primary" ? "#FFFFFF" : colors.foreground;
  return <Pressable {...props} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor, borderColor: colors.border }, variant === "ghost" && styles.ghostButton, pressed && styles.pressed]}>{icon && <MaterialIcons name={icon} size={18} color={foreground} />}<Text style={[styles.buttonText, { color: foreground }]}>{children}</Text></Pressable>;
}
export const sharedStyles = StyleSheet.create({ page: { paddingHorizontal: 20, paddingBottom: 32 }, card: { borderRadius: 22, padding: 18, borderWidth: 1 }, subtleCard: { borderRadius: 18, padding: 16, borderWidth: 1 }, mutedText: { fontSize: 15, lineHeight: 21 } });
const styles = StyleSheet.create({ brandRow: { flexDirection: "row", alignItems: "center", gap: 9 }, brandIcon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" }, brandWord: { fontSize: 17, fontWeight: "800", letterSpacing: -0.3 }, headingRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4, marginBottom: 5 }, sectionTitle: { fontSize: 22, lineHeight: 27, fontWeight: "800", letterSpacing: -0.6 }, actionText: { fontSize: 14, fontWeight: "700", marginBottom: 3 }, pill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 99 }, pillText: { fontSize: 12, fontWeight: "800" }, button: { minHeight: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, ghostButton: { borderWidth: 0 }, buttonText: { fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] } });
