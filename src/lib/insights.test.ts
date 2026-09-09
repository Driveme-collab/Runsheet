import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildInsights } from "./insights.ts";
import type { EmergencyFund, Expense, Trip } from "./types.ts";

const noon = new Date("2026-09-02T12:00:00");
const emptyFund: EmergencyFund = { target: 0, transactions: [] };

function trip(startedAt: string, fare: number): Trip {
  return {
    id: "t",
    startedAt,
    endedAt: null,
    customerId: null,
    pickup: "A",
    dropoff: "B",
    fare,
    tip: 0,
    platform: "cash",
    paymentType: "cash",
    distanceKm: 0,
    durationMin: 60,
    rating: 5,
    appreciation: "",
    notes: "",
    createdAt: startedAt,
  };
}

function expense(date: string, amount: number, category: Expense["category"]): Expense {
  return { id: "e", date, category, amount, note: "", odometerKm: null };
}

describe("insights", () => {
  it("says not enough data when the book is empty", () => {
    const list = buildInsights({
      trips: [],
      incomes: [],
      expenses: [],
      allocations: [],
      fund: emptyFund,
      shifts: [],
      goals: [],
      now: noon,
    });
    assert.equal(list[0]?.tone, "empty");
    assert.match(list[0]?.text ?? "", /Not enough data/);
  });

  it("mentions higher earnings when this week beat last week", () => {
    const trips = [
      trip("2026-09-01T08:00:00", 20000),
      trip("2026-08-25T08:00:00", 5000),
    ];
    const list = buildInsights({
      trips,
      incomes: [],
      expenses: [expense("2026-09-01", 1000, "fuel")],
      allocations: [],
      fund: { target: 500000, transactions: [{ id: "1", date: "2026-09-01", amount: 2000, direction: "in", note: "" }] },
      shifts: [],
      goals: [],
      now: noon,
    });
    assert.ok(list.some((i) => /earned more this week/i.test(i.text) || /increased this week/i.test(i.text)));
  });
});
