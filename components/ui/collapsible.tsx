import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PropsWithChildren, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

export function Collapsible({ title, children }: PropsWithChildren<{ title: string }>) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  return <View style={styles.wrapper}><Pressable onPress={() => setOpen((value) => !value)} style={styles.header}><Text style={[styles.title, { color: colors.foreground }]}>{title}</Text><MaterialIcons name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={21} color={colors.muted} /></Pressable>{open && <View style={styles.body}>{children}</View>}</View>;
}
const styles = StyleSheet.create({ wrapper: { gap: 8 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, title: { fontSize: 15, fontWeight: "700" }, body: { paddingTop: 4 } });
