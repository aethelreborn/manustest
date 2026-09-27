import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BrandMark, Pill, SectionHeading, sharedStyles } from "@/components/aethel-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAethel } from "@/lib/aethel-store";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { bills, vault, focus } = useAethel();
  const upcoming = bills.filter((bill) => bill.status !== "paid");
  const dueSoon = upcoming.reduce((total, bill) => total + bill.amount, 0);
  const timeline = useMemo(() => [...bills].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3), [bills]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={[sharedStyles.page, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandMark />
          <Pressable onPress={() => router.push("/settings")} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityLabel="Open settings">
            <MaterialIcons name="tune" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.greeting}>
          <Text style={[styles.kicker, { color: colors.primary }]}>SUNDAY, SEPTEMBER 27</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>A quieter day{`\n`}starts here.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Your essentials, kept close and in context.</Text>
        </View>

        <View style={styles.metrics}>
          <Metric value={`${upcoming.length}`} label="active reminders" color={colors.primary} />
          <Metric value={currency.format(dueSoon)} label="to plan this week" color={colors.warning} />
          <Metric value={focus.active ? "On" : "Off"} label="focus mode" color={focus.active ? colors.success : colors.info} />
        </View>

        <View style={[styles.focusCard, { backgroundColor: colors.primary }]}>
          <View style={styles.focusCopy}>
            <Pill label={focus.active ? "SESSION ACTIVE" : "FOCUS READY"} color="#D7F0EC" icon="timer" />
            <Text style={styles.focusTitle}>{focus.active ? focus.label : "Protect your attention"}</Text>
            <Text style={styles.focusBody}>{focus.active ? "Your session is running. Keep the next thing small." : "Start a focused block when you want fewer switches."}</Text>
          </View>
          <Pressable onPress={() => router.push("/focus")} style={styles.focusAction}>
            <MaterialIcons name={focus.active ? "open-in-new" : "play-arrow"} size={21} color={colors.primary} />
          </Pressable>
        </View>

        <SectionHeading eyebrow="Your day" title="Timeline" action="See all" onAction={() => router.push("/bills")} />
        <View style={[styles.timelineCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {timeline.map((bill, index) => (
            <TimelineRow key={bill.id} title={bill.title} date={bill.dueDate} amount={bill.amount} status={bill.status} isLast={index === timeline.length - 1} />
          ))}
          {timeline.length === 0 && <Text style={[styles.emptyText, { color: colors.muted }]}>Your timeline is clear. Add a bill when something needs your attention.</Text>}
        </View>

        <SectionHeading eyebrow="Quick access" title="Keep close" />
        <View style={styles.quickGrid}>
          <QuickCard icon="lock" label="Vault" detail={`${vault.length} protected items`} onPress={() => router.push("/vault")} />
          <QuickCard icon="receipt-long" label="Bills" detail={`${upcoming.length} reminders`} onPress={() => router.push("/bills")} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: string }) {
  const colors = useColors();
  return <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.metricValue, { color }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.muted }]}>{label}</Text></View>;
}

function TimelineRow({ title, date, amount, status, isLast }: { title: string; date: string; amount: number; status: string; isLast: boolean }) {
  const colors = useColors();
  const tone = status === "overdue" ? colors.error : status === "paid" ? colors.success : colors.warning;
  const label = status === "overdue" ? "Overdue" : status === "paid" ? "Resolved" : "Due soon";
  return <View style={styles.timelineRow}>
    <View style={styles.timelineRail}><View style={[styles.timelineDot, { backgroundColor: tone }]} />{!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}</View>
    <View style={styles.timelineContent}><View style={styles.timelineTop}><Text style={[styles.timelineTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.timelineAmount, { color: colors.foreground }]}>{currency.format(amount)}</Text></View><View style={styles.timelineBottom}><Text style={[styles.timelineDate, { color: colors.muted }]}>{date}</Text><Pill label={label} color={tone} /></View></View>
  </View>;
}

function QuickCard({ icon, label, detail, onPress }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; label: string; detail: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.75 }]}><View style={[styles.quickIcon, { backgroundColor: colors.inkSoft }]}><MaterialIcons name={icon} size={20} color={colors.primary} /></View><Text style={[styles.quickLabel, { color: colors.foreground }]}>{label}</Text><Text style={[styles.quickDetail, { color: colors.muted }]}>{detail}</Text></Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 20, gap: 25 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  greeting: { gap: 7 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  title: { fontSize: 34, lineHeight: 37, fontWeight: "800", letterSpacing: -1.2 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  metrics: { flexDirection: "row", gap: 9 },
  metric: { flex: 1, minHeight: 83, padding: 13, borderRadius: 16, borderWidth: 1, justifyContent: "space-between" },
  metricValue: { fontSize: 21, fontWeight: "800", letterSpacing: -0.5 },
  metricLabel: { fontSize: 12, lineHeight: 15, fontWeight: "600" },
  focusCard: { minHeight: 156, borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  focusCopy: { flex: 1, gap: 9 },
  focusTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
  focusBody: { color: "#D7F0EC", fontSize: 14, lineHeight: 20, maxWidth: 245 },
  focusAction: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  timelineCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  timelineRow: { flexDirection: "row", minHeight: 76 },
  timelineRail: { width: 19, alignItems: "center" },
  timelineDot: { width: 9, height: 9, borderRadius: 9, marginTop: 6 },
  timelineLine: { flex: 1, width: 1, marginVertical: 5 },
  timelineContent: { flex: 1, paddingLeft: 10, gap: 9 },
  timelineTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  timelineTitle: { fontSize: 15, fontWeight: "800", flex: 1 },
  timelineAmount: { fontSize: 14, fontWeight: "800" },
  timelineBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  timelineDate: { fontSize: 13 },
  emptyText: { fontSize: 15, lineHeight: 21, paddingVertical: 8 },
  quickGrid: { flexDirection: "row", gap: 10 },
  quickCard: { flex: 1, borderRadius: 19, borderWidth: 1, padding: 15, gap: 8 },
  quickIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 16, fontWeight: "800" },
  quickDetail: { fontSize: 13, lineHeight: 18 },
});
