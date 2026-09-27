import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type VaultKind = "password" | "card" | "note";
export type VaultItem = {
  id: string;
  title: string;
  kind: VaultKind;
  username?: string;
  secret?: string;
  note?: string;
};

export type BillStatus = "upcoming" | "overdue" | "paid";
export type BillItem = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  cadence: "Monthly" | "Yearly" | "One-time";
  status: BillStatus;
};

type FocusState = { active: boolean; label: string; remainingSeconds: number };
type PersistedState = { vault: VaultItem[]; bills: BillItem[]; focus: FocusState };
type AethelContextValue = PersistedState & {
  hydrated: boolean;
  addVaultItem: (item: Omit<VaultItem, "id">) => void;
  removeVaultItem: (id: string) => void;
  addBill: (item: Omit<BillItem, "id" | "status">) => void;
  markBillPaid: (id: string) => void;
  startFocus: (minutes: number, label?: string) => void;
  tickFocus: () => void;
  endFocus: () => void;
};

const STORAGE_KEY = "aethel.local.v1";
const starterVault: VaultItem[] = [
  { id: "v-1", title: "Notion", kind: "password", username: "hello@aethel.app", secret: "aurora-lantern-72" },
  { id: "v-2", title: "Travel card", kind: "card", username: "•••• 4082", secret: "4082" },
  { id: "v-3", title: "Home Wi-Fi", kind: "note", note: "Network details are protected on this device.", secret: "aethel-home-5g" },
];
const starterBills: BillItem[] = [
  { id: "b-1", title: "Notion Plus", amount: 800, dueDate: "2026-09-29", cadence: "Monthly", status: "upcoming" },
  { id: "b-2", title: "Electricity", amount: 1240, dueDate: "2026-09-25", cadence: "Monthly", status: "overdue" },
  { id: "b-3", title: "Cloud storage", amount: 1200, dueDate: "2026-10-05", cadence: "Yearly", status: "upcoming" },
];
const initialFocus: FocusState = { active: false, label: "Deep work", remainingSeconds: 25 * 60 };

const AethelContext = createContext<AethelContextValue | null>(null);

export function AethelProvider({ children }: { children: React.ReactNode }) {
  const [vault, setVault] = useState<VaultItem[]>(starterVault);
  const [bills, setBills] = useState<BillItem[]>(starterBills);
  const [focus, setFocus] = useState<FocusState>(initialFocus);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw) as PersistedState;
          setVault(saved.vault ?? starterVault);
          setBills(saved.bills ?? starterBills);
          setFocus(saved.focus ?? initialFocus);
        }
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { vault, bills, focus };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [bills, focus, hydrated, vault]);

  const addVaultItem = useCallback((item: Omit<VaultItem, "id">) => {
    setVault((current) => [{ ...item, id: `v-${Date.now()}` }, ...current]);
  }, []);
  const removeVaultItem = useCallback((id: string) => setVault((current) => current.filter((item) => item.id !== id)), []);
  const addBill = useCallback((item: Omit<BillItem, "id" | "status">) => {
    setBills((current) => [{ ...item, id: `b-${Date.now()}`, status: "upcoming" }, ...current]);
  }, []);
  const markBillPaid = useCallback((id: string) => {
    setBills((current) => current.map((bill) => (bill.id === id ? { ...bill, status: "paid" } : bill)));
  }, []);
  const startFocus = useCallback((minutes: number, label = "Deep work") => {
    setFocus({ active: true, label, remainingSeconds: minutes * 60 });
  }, []);
  const tickFocus = useCallback(() => {
    setFocus((current) => {
      if (!current.active || current.remainingSeconds <= 1) return { ...current, active: false, remainingSeconds: 0 };
      return { ...current, remainingSeconds: current.remainingSeconds - 1 };
    });
  }, []);
  const endFocus = useCallback(() => setFocus((current) => ({ ...current, active: false })), []);

  const value = useMemo(() => ({ hydrated, vault, bills, focus, addVaultItem, removeVaultItem, addBill, markBillPaid, startFocus, tickFocus, endFocus }), [addBill, addVaultItem, bills, endFocus, focus, hydrated, markBillPaid, removeVaultItem, startFocus, tickFocus, vault]);
  return <AethelContext.Provider value={value}>{children}</AethelContext.Provider>;
}

export function useAethel() {
  const context = useContext(AethelContext);
  if (!context) throw new Error("useAethel must be used inside AethelProvider");
  return context;
}
