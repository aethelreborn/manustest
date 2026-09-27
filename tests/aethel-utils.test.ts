import { describe, expect, it } from "vitest";

import { filterBills, formatFocusTime, getActiveBillTotal } from "../lib/aethel-utils";
import type { BillItem } from "../lib/aethel-store";

const bills: BillItem[] = [
  { id: "1", title: "One", amount: 500, dueDate: "2026-09-28", cadence: "Monthly", status: "upcoming" },
  { id: "2", title: "Two", amount: 800, dueDate: "2026-09-29", cadence: "Monthly", status: "paid" },
  { id: "3", title: "Three", amount: 300, dueDate: "2026-09-30", cadence: "Yearly", status: "overdue" },
];

describe("Aethel local business logic", () => {
  it("totals active commitments without counting paid bills", () => { expect(getActiveBillTotal(bills)).toBe(800); });
  it("filters bills by the selected timeline tab", () => { expect(filterBills(bills, "upcoming")).toHaveLength(1); expect(filterBills(bills, "paid")[0].title).toBe("Two"); expect(filterBills(bills, "all")).toHaveLength(3); });
  it("formats focus time safely, including zero and negative input", () => { expect(formatFocusTime(25 * 60)).toBe("25:00"); expect(formatFocusTime(9)).toBe("00:09"); expect(formatFocusTime(-1)).toBe("00:00"); });
});
