import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { createTRPCClient } from "@/lib/trpc";
import { decryptPayload, encryptPayload, getOrCreateVaultKey } from "@/lib/aethel-crypto";
import { loadEncryptedState, saveEncryptedState } from "@/lib/aethel-storage";

export type VaultKind = "password" | "card" | "note";
export type VaultItem = { id: string; title: string; kind: VaultKind; username?: string; secret?: string; note?: string };
export type BillStatus = "upcoming" | "overdue" | "paid";
export type BillItem = { id: string; title: string; amount: number; dueDate: string; cadence: "Monthly" | "Yearly" | "One-time"; status: BillStatus };
type FocusState = { active: boolean; label: string; remainingSeconds: number };
type PersistedState = { vault: VaultItem[]; bills: BillItem[]; focus: FocusState };
type AethelContextValue = PersistedState & { hydrated: boolean; addVaultItem: (item: Omit<VaultItem, "id">) => void; removeVaultItem: (id: string) => void; addBill: (item: Omit<BillItem, "id" | "status">) => void; markBillPaid: (id: string) => void; startFocus: (minutes: number, label?: string) => void; tickFocus: () => void; endFocus: () => void };

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

async function remoteClient() {
  try { return createTRPCClient(); } catch { return null; }
}

async function loadRemoteItems() {
  const client = await remoteClient();
  if (!client) return null;
  try {
    const [remoteVault, remoteBills] = await Promise.all([client.vault.list.query(), client.billing.list.query()]);
    const key = await getOrCreateVaultKey();
    const vault = remoteVault.map((item) => {
      const payload = decryptPayload<{ username?: string; secret?: string; note?: string }>(item.encryptedPayload, item.iv, key);
      return { id: `server:${item.id}`, title: item.title, kind: item.itemType, ...payload } satisfies VaultItem;
    });
    const bills = remoteBills.map((item) => ({ id: `server:${item.id}`, title: item.title, amount: item.amount, dueDate: item.dueDate, cadence: item.cadence, status: item.status } satisfies BillItem));
    return { vault, bills };
  } catch { return null; }
}

export function AethelProvider({ children }: { children: React.ReactNode }) {
  const [vault, setVault] = useState<VaultItem[]>(starterVault);
  const [bills, setBills] = useState<BillItem[]>(starterBills);
  const [focus, setFocus] = useState<FocusState>(initialFocus);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await loadEncryptedState<PersistedState>();
        if (active && saved) { setVault(saved.vault ?? starterVault); setBills(saved.bills ?? starterBills); setFocus(saved.focus ?? initialFocus); }
        const remote = await loadRemoteItems();
        if (active && remote && (remote.vault.length > 0 || remote.bills.length > 0)) { if (remote.vault.length > 0) setVault(remote.vault); if (remote.bills.length > 0) setBills(remote.bills); }
      } catch { /* encrypted local state remains fail-closed; starter state is used */ }
      finally { if (active) setHydrated(true); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => { if (hydrated) void saveEncryptedState({ vault, bills, focus }); }, [bills, focus.active, hydrated, vault]);

  const addVaultItem = useCallback((item: Omit<VaultItem, "id">) => {
    const localItem = { ...item, id: `v-${Date.now()}` };
    setVault((current) => [localItem, ...current]);
    void (async () => { try { const key = await getOrCreateVaultKey(); const encrypted = await encryptPayload({ username: localItem.username, secret: localItem.secret, note: localItem.note }, key); const client = await remoteClient(); if (client) await client.vault.create.mutate({ title: localItem.title, itemType: localItem.kind, ...encrypted }); } catch { /* local-first: retain the item when sync is unavailable */ } })();
  }, []);
  const removeVaultItem = useCallback((id: string) => { setVault((current) => current.filter((item) => item.id !== id)); if (id.startsWith("server:")) void remoteClient().then((client) => client?.vault.remove.mutate({ id: Number(id.replace("server:", "")) })).catch(() => undefined); }, []);
  const addBill = useCallback((item: Omit<BillItem, "id" | "status">) => { const localItem = { ...item, id: `b-${Date.now()}`, status: "upcoming" as const }; setBills((current) => [localItem, ...current]); void remoteClient().then((client) => client?.billing.create.mutate(localItemToRemoteBill(localItem))).catch(() => undefined); }, []);
  const markBillPaid = useCallback((id: string) => { setBills((current) => current.map((bill) => (bill.id === id ? { ...bill, status: "paid" } : bill))); if (id.startsWith("server:")) void remoteClient().then((client) => client?.billing.update.mutate({ id: Number(id.replace("server:", "")), status: "paid" })).catch(() => undefined); }, []);
  const startFocus = useCallback((minutes: number, label = "Deep work") => setFocus({ active: true, label, remainingSeconds: minutes * 60 }), []);
  const tickFocus = useCallback(() => setFocus((current) => current.remainingSeconds <= 1 ? { ...current, active: false, remainingSeconds: 0 } : current.active ? { ...current, remainingSeconds: current.remainingSeconds - 1 } : current), []);
  const endFocus = useCallback(() => setFocus((current) => ({ ...current, active: false })), []);
  const value = useMemo(() => ({ hydrated, vault, bills, focus, addVaultItem, removeVaultItem, addBill, markBillPaid, startFocus, tickFocus, endFocus }), [addBill, addVaultItem, bills, endFocus, focus, hydrated, markBillPaid, removeVaultItem, startFocus, tickFocus, vault]);
  return <AethelContext.Provider value={value}>{children}</AethelContext.Provider>;
}

function localItemToRemoteBill(item: BillItem) { return { title: item.title, amount: item.amount, currency: "INR", dueDate: item.dueDate, cadence: item.cadence, status: item.status }; }
export function useAethel() { const context = useContext(AethelContext); if (!context) throw new Error("useAethel must be used inside AethelProvider"); return context; }
