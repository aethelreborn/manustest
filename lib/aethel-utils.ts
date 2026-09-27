import type { BillItem } from "@/lib/aethel-store";

export function getActiveBillTotal(bills: BillItem[]) {
  return bills.filter((bill) => bill.status !== "paid").reduce((total, bill) => total + bill.amount, 0);
}

export function filterBills(bills: BillItem[], filter: "all" | "upcoming" | "paid") {
  return filter === "all" ? bills : bills.filter((bill) => bill.status === filter);
}

export function formatFocusTime(totalSeconds: number) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
