import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function ThemeLab() {
  const colors = useColors();
  return <ScreenContainer><ScrollView contentContainerStyle={styles.page}><Text style={[styles.title, { color: colors.foreground }]}>Aethel theme</Text><Text style={[styles.body, { color: colors.muted }]}>A quiet palette for private, everyday work.</Text><View style={styles.swatches}>{["primary", "success", "warning", "error", "info"].map((token) => <View key={token} style={styles.swatch}><View style={[styles.color, { backgroundColor: colors[token as keyof typeof colors] as string }]} /><Text style={[styles.label, { color: colors.foreground }]}>{token}</Text></View>)}</View></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ page: { padding: 24, gap: 10 }, title: { fontSize: 28, fontWeight: "800" }, body: { fontSize: 15 }, swatches: { gap: 12, marginTop: 20 }, swatch: { flexDirection: "row", alignItems: "center", gap: 10 }, color: { width: 36, height: 36, borderRadius: 12 }, label: { fontSize: 15, fontWeight: "700" } });
