import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AethelButton, Pill, SectionHeading } from "@/components/aethel-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAethel, type BillItem } from "@/lib/aethel-store";
import { filterBills, getActiveBillTotal } from "@/lib/aethel-utils";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
type BillFilter = "all" | "upcoming" | "paid";

export default function BillsScreen() {
  const colors = useColors();
  const { bills, markBillPaid, addBill } = useAethel();
  const [filter, setFilter] = useState<BillFilter>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-01");
  const filtered = useMemo(() => filterBills(bills, filter), [bills, filter]);
  const total = getActiveBillTotal(bills);
  const saveBill = () => {
    const numericAmount = Number(amount);
    if (!title.trim() || !numericAmount || !dueDate.trim()) return;
    addBill({ title: title.trim(), amount: numericAmount, dueDate: dueDate.trim(), cadence: "Monthly" });
    setTitle(""); setAmount(""); setDueDate("2026-10-01"); setShowAdd(false);
  };
  return <ScreenContainer><View style={styles.page}><View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.warning }]}>PLAN AHEAD</Text><Text style={[styles.title, { color: colors.foreground }]}>Bills</Text></View><Pressable onPress={() => setShowAdd(true)} style={[styles.addButton, { backgroundColor: colors.primary }]}><MaterialIcons name="add" size={22} color="#FFFFFF" /></Pressable></View><View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}><View><Text style={[styles.summaryLabel, { color: colors.muted }]}>ACTIVE COMMITMENTS</Text><Text style={[styles.summaryAmount, { color: colors.foreground }]}>{currency.format(total)}</Text></View><View style={[styles.summaryIcon, { backgroundColor: `${colors.warning}18` }]}><MaterialIcons name="event" size={22} color={colors.warning} /></View></View><SectionHeading title="Your reminders" /><View style={styles.tabs}>{(["all", "upcoming", "paid"] as BillFilter[]).map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.tab, { backgroundColor: filter === item ? colors.foreground : colors.inkSoft }]}><Text style={[styles.tabText, { color: filter === item ? colors.surface : colors.muted }]}>{item === "all" ? "All" : item === "upcoming" ? "Upcoming" : "Paid"}</Text></Pressable>)}</View><FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => <BillCard bill={item} onPaid={() => markBillPaid(item.id)} />} ListEmptyComponent={<View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}><MaterialIcons name="event-available" size={28} color={colors.success} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nothing here</Text><Text style={[styles.emptyBody, { color: colors.muted }]}>A clear list is useful. Add a bill when a commitment needs a reminder.</Text><AethelButton onPress={() => setShowAdd(true)} icon="add">Add a bill</AethelButton></View>} /><AddBillModal visible={showAdd} title={title} amount={amount} dueDate={dueDate} onClose={() => setShowAdd(false)} onTitle={setTitle} onAmount={setAmount} onDueDate={setDueDate} onSave={saveBill} /></View></ScreenContainer>;
}

function BillCard({ bill, onPaid }: { bill: BillItem; onPaid: () => void }) {
  const colors = useColors();
  const tone = bill.status === "overdue" ? colors.error : bill.status === "paid" ? colors.success : colors.warning;
  const label = bill.status === "overdue" ? "Overdue" : bill.status === "paid" ? "Paid" : "Due soon";
  return <View style={[styles.billCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.billTop}><View style={[styles.billIcon, { backgroundColor: `${tone}18` }]}><MaterialIcons name={bill.status === "paid" ? "check" : "receipt-long"} size={20} color={tone} /></View><View style={styles.billTitleWrap}><Text style={[styles.billTitle, { color: colors.foreground }]}>{bill.title}</Text><Text style={[styles.billMeta, { color: colors.muted }]}>{bill.cadence} · due {bill.dueDate}</Text></View><Text style={[styles.billAmount, { color: colors.foreground }]}>{currency.format(bill.amount)}</Text></View><View style={styles.billBottom}><Pill label={label} color={tone} icon={bill.status === "paid" ? "check-circle" : bill.status === "overdue" ? "warning" : "schedule"} />{bill.status !== "paid" && <Pressable onPress={onPaid} style={[styles.paidButton, { borderColor: colors.primary }]}><MaterialIcons name="check" size={16} color={colors.primary} /><Text style={[styles.paidText, { color: colors.primary }]}>Mark paid</Text></Pressable>}</View></View>;
}

function AddBillModal({ visible, title, amount, dueDate, onClose, onTitle, onAmount, onDueDate, onSave }: { visible: boolean; title: string; amount: string; dueDate: string; onClose: () => void; onTitle: (value: string) => void; onAmount: (value: string) => void; onDueDate: (value: string) => void; onSave: () => void }) {
  const colors = useColors();
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.surface }]}><View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>New reminder</Text><Pressable onPress={onClose}><MaterialIcons name="close" size={22} color={colors.muted} /></Pressable></View><TextInput value={title} onChangeText={onTitle} placeholder="What is it?" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} /><TextInput value={amount} onChangeText={onAmount} placeholder="Amount" keyboardType="decimal-pad" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} /><TextInput value={dueDate} onChangeText={onDueDate} placeholder="Due date (YYYY-MM-DD)" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} /><AethelButton onPress={onSave} icon="event">Save reminder</AethelButton></View></View></Modal>;
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 20, paddingTop: 20 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }, eyebrow: { fontSize: 11, letterSpacing: 1.3, fontWeight: "800", marginBottom: 5 }, title: { fontSize: 34, lineHeight: 38, fontWeight: "800", letterSpacing: -1 }, addButton: { width: 45, height: 45, borderRadius: 15, alignItems: "center", justifyContent: "center" }, summary: { borderWidth: 1, borderRadius: 20, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }, summaryLabel: { fontSize: 11, letterSpacing: 1.1, fontWeight: "800", marginBottom: 8 }, summaryAmount: { fontSize: 28, fontWeight: "800", letterSpacing: -0.8 }, summaryIcon: { width: 47, height: 47, borderRadius: 15, alignItems: "center", justifyContent: "center" }, tabs: { flexDirection: "row", padding: 4, borderRadius: 15, marginBottom: 13 }, tab: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 11 }, tabText: { fontSize: 13, fontWeight: "800" }, list: { gap: 11, paddingBottom: 28 }, billCard: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 17 }, billTop: { flexDirection: "row", alignItems: "center" }, billIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, billTitleWrap: { flex: 1, marginLeft: 11 }, billTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 }, billMeta: { fontSize: 13 }, billAmount: { fontSize: 16, fontWeight: "800" }, billBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, paidButton: { minHeight: 36, borderRadius: 11, borderWidth: 1, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 5 }, paidText: { fontSize: 12, fontWeight: "800" }, empty: { borderRadius: 20, borderWidth: 1, alignItems: "center", gap: 10, padding: 25 }, emptyTitle: { fontSize: 18, fontWeight: "800" }, emptyBody: { fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 6 }, modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.42)" }, modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, gap: 13 }, modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, modalTitle: { fontSize: 22, fontWeight: "800" }, input: { minHeight: 48, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, fontSize: 15 },
});
