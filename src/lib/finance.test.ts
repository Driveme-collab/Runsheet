import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  availableMoney,
  avgRating,
  budgetVsActual,
  builtThisPeriod,
  costPerKm,
  earningsPerHour,
  emergencyBalance,
  emergencyProgress,
  goalProgress,
  grossIncome,
  intendedBuildShare,
  moneySnapshot,
  monthsOfCover,
  netWorkIncome,
  percentChange,
  recordKeepingDays,
  safeAmount,
  shiftWindowStats,
  vehicleCosts,
  workCosts,
  workingHours,
} from "./finance.ts";
import type {
  Allocation,
  EmergencyFund,
  Expense,
  Goal,
  Income,
  Shift,
  Trip,
} from "./types.ts";

const noon = new Date("2026-09-02T12:00:00");

function trip(partial: Partial<Trip> & { startedAt: string; fare: number }): Trip {
  return {
    id: partial.id ?? "t",
    startedAt: partial.startedAt,
    endedAt: partial.endedAt ?? null,
    customerId: partial.customerId ?? null,
    pickup: "A",
    dropoff: "B",
    fare: partial.fare,
    tip: partial.tip ?? 0,
    platform: partial.platform ?? "cash",
    paymentType: partial.paymentType ?? "cash",
    distanceKm: partial.distanceKm ?? 0,
    durationMin: partial.durationMin ?? 0,
    rating: partial.rating ?? null,
    appreciation: partial.appreciation ?? "",
    notes: "",
    createdAt: partial.startedAt,
  };
}

function expense(partial: Partial<Expense> & { date: string; amount: number; category: Expense["category"] }): Expense {
  return {
    id: partial.id ?? "e",
    date: partial.date,
    category: partial.category,
    amount: partial.amount,
    note: "",
    odometerKm: null,
  };
}

function income(partial: Partial<Income> & { date: string; amount: number }): Income {
  return {
    id: partial.id ?? "i",
    date: partial.date,
    amount: partial.amount,
    source: partial.source ?? "private",
    note: "",
  };
}

const emptyFund: EmergencyFund = { target: 0, transactions: [] };

describe("safeAmount", () => {
  it("treats negative, NaN and non-numeric as 0", () => {
    assert.equal(safeAmount(-12), 0);
    assert.equal(safeAmount(Number.NaN), 0);
    assert.equal(safeAmount("nope"), 0);
    assert.equal(safeAmount(40), 40);
  });
});

describe("gross and net income", () => {
  it("sums fares, tips and other income", () => {
    const trips = [
      trip({ startedAt: "2026-09-02T08:00:00", fare: 4000, tip: 500 }),
      trip({ startedAt: "2026-09-02T10:00:00", fare: 15000, tip: 0 }),
    ];
    const incomes = [income({ date: "2026-09-02", amount: 10000 })];
    assert.equal(grossIncome(trips, incomes), 29500);
  });

  it("subtracts only operate-lane expenses from gross", () => {
    const trips = [trip({ startedAt: "2026-09-02T08:00:00", fare: 20000 })];
    const expenses = [
      expense({ date: "2026-09-02", amount: 5000, category: "fuel" }),
      expense({ date: "2026-09-02", amount: 8000, category: "rent" }),
      expense({ date: "2026-09-02", amount: 2000, category: "personal" }),
    ];
    assert.equal(workCosts(expenses), 5000);
    assert.equal(netWorkIncome(trips, [], expenses), 15000);
  });

  it("handles no trips and no expenses", () => {
    assert.equal(grossIncome([], []), 0);
    assert.equal(workCosts([]), 0);
    assert.equal(netWorkIncome([], [], []), 0);
  });
});

describe("earnings per hour", () => {
  it("returns null when hours are zero", () => {
    assert.equal(earningsPerHour(10000, 0), null);
  });

  it("divides net by recorded hours", () => {
    assert.equal(earningsPerHour(15000, 5), 3000);
  });

  it("falls back to trip duration when no shifts exist", () => {
    const trips = [
      trip({ startedAt: "2026-09-02T08:00:00", fare: 6000, durationMin: 60 }),
      trip({ startedAt: "2026-09-02T10:00:00", fare: 6000, durationMin: 60 }),
    ];
    assert.equal(workingHours([], trips, "today", noon), 2);
  });
});

describe("goals and emergency fund", () => {
  it("computes goal progress and clamps", () => {
    const goal: Goal = {
      id: "g",
      title: "School",
      category: "family",
      targetAmount: 100000,
      savedAmount: 40000,
      deadline: "",
      note: "",
    };
    assert.equal(goalProgress(goal), 40);
    assert.equal(goalProgress({ ...goal, targetAmount: 0 }), 0);
    assert.equal(goalProgress({ ...goal, savedAmount: 150000 }), 100);
  });

  it("nets contributions and withdrawals", () => {
    const fund: EmergencyFund = {
      target: 500000,
      transactions: [
        { id: "1", date: "2026-08-01", amount: 200000, direction: "in", note: "" },
        { id: "2", date: "2026-08-20", amount: 50000, direction: "out", note: "" },
        { id: "3", date: "2026-09-01", amount: 135000, direction: "in", note: "" },
      ],
    };
    assert.equal(emergencyBalance(fund), 285000);
    assert.equal(Math.round(emergencyProgress(fund)), 57);
  });
});

describe("vehicle costs", () => {
  it("includes vehicle operating categories and excludes data/family", () => {
    const expenses = [
      expense({ date: "2026-09-02", amount: 8000, category: "fuel" }),
      expense({ date: "2026-09-02", amount: 3000, category: "data" }),
      expense({ date: "2026-09-02", amount: 4000, category: "tyres" }),
      expense({ date: "2026-09-02", amount: 12000, category: "food" }),
    ];
    assert.equal(vehicleCosts(expenses), 12000);
  });
});

describe("weekly and monthly totals", () => {
  it("scopes snapshots to the requested period", () => {
    const trips = [
      trip({ startedAt: "2026-09-02T08:00:00", fare: 5000 }),
      trip({ startedAt: "2026-08-10T08:00:00", fare: 90000 }),
    ];
    const snap = moneySnapshot({
      trips,
      incomes: [],
      expenses: [expense({ date: "2026-09-02", amount: 1000, category: "fuel" })],
      allocations: [],
      fund: emptyFund,
      shifts: [],
      period: "today",
      now: noon,
    });
    assert.equal(snap.gross, 5000);
    assert.equal(snap.workCosts, 1000);
    assert.equal(snap.netWork, 4000);
    assert.equal(snap.trips, 1);
  });

  it("compares percent change across months", () => {
    assert.equal(percentChange(108, 100), 8);
    assert.equal(percentChange(0, 0), 0);
    assert.equal(percentChange(10, 0), null);
  });
});

describe("available money and allocations", () => {
  it("subtracts provide, enjoy, purpose allocations and savings-pot deposits from net work income", () => {
    const trips = [trip({ startedAt: "2026-09-02T08:00:00", fare: 40000 })];
    const expenses = [
      expense({ date: "2026-09-02", amount: 5000, category: "fuel" }),
      expense({ date: "2026-09-02", amount: 8000, category: "food" }),
    ];
    const allocations: Allocation[] = [
      { id: "a", date: "2026-09-02", amount: 7000, purpose: "savings", goalId: null, note: "" },
    ];
    const savings: EmergencyFund = {
      target: 100000,
      transactions: [{ id: "s", date: "2026-09-02", amount: 7000, direction: "in", note: "" }],
    };
    const available = availableMoney(trips, [], expenses, allocations, emptyFund, "today", noon, savings);
    assert.equal(available, 20000);
  });
});

describe("edge cases", () => {
  it("ignores missing optional fields on trips", () => {
    const trips = [trip({ startedAt: "2026-09-02T08:00:00", fare: 1000 })];
    assert.equal(avgRating(trips), null);
    assert.equal(grossIncome(trips, []), 1000);
  });

  it("handles multiple platforms in one period", () => {
    const trips = [
      trip({ startedAt: "2026-09-02T08:00:00", fare: 3000, platform: "bolt" }),
      trip({ startedAt: "2026-09-02T09:00:00", fare: 4000, platform: "yego" }),
      trip({ startedAt: "2026-09-02T10:00:00", fare: 5000, platform: "cash" }),
    ];
    assert.equal(grossIncome(trips, []), 12000);
  });

  it("returns 0 cover when the fund is empty, null without essential spend", () => {
    assert.equal(monthsOfCover(0, [], noon), 0);
    assert.equal(
      monthsOfCover(100000, [expense({ date: "2026-09-02", amount: 5000, category: "fuel" })], noon),
      null,
    );
    assert.equal(
      monthsOfCover(100000, [expense({ date: "2026-09-02", amount: 50000, category: "rent" })], noon),
      2,
    );
  });

  it("computes a shift window including an open shift", () => {
    const shift: Shift = {
      id: "s",
      startedAt: "2026-09-02T06:00:00",
      endedAt: "2026-09-02T12:00:00",
      notes: "",
    };
    const trips = [
      trip({ startedAt: "2026-09-02T07:00:00", fare: 6000 }),
      trip({ startedAt: "2026-09-01T07:00:00", fare: 9000 }),
    ];
    const stats = shiftWindowStats(shift, trips, [], [], noon);
    assert.equal(stats.trips, 1);
    assert.equal(stats.hours, 6);
    assert.equal(stats.gross, 6000);
    assert.equal(stats.earningsPerHour, 1000);
  });

  it("counts a record-keeping streak from today backwards", () => {
    const trips = [
      trip({ startedAt: "2026-09-02T08:00:00", fare: 1 }),
      trip({ startedAt: "2026-09-01T08:00:00", fare: 1 }),
    ];
    assert.equal(recordKeepingDays(trips, [], [], noon), 2);
  });
});

describe("budget, savings pot and vehicle unit cost", () => {
  it("compares monthly budget to actual operate / provide / enjoy / build", () => {
    const expenses = [
      expense({ date: "2026-09-02", amount: 8000, category: "fuel" }),
      expense({ date: "2026-09-02", amount: 4000, category: "food" }),
      expense({ date: "2026-09-02", amount: 1000, category: "personal" }),
    ];
    const rows = budgetVsActual(
      { operate: 10000, provide: 5000, enjoy: 2000, build: 6000 },
      expenses,
      3000,
    );
    assert.equal(rows.find((r) => r.lane === "operate")?.actual, 8000);
    assert.equal(rows.find((r) => r.lane === "provide")?.actual, 4000);
    assert.equal(rows.find((r) => r.lane === "enjoy")?.actual, 1000);
    assert.equal(rows.find((r) => r.lane === "build")?.actual, 3000);
  });

  it("does not double-count a savings allocation once it is in the savings pot", () => {
    const allocations: Allocation[] = [
      { id: "a", date: "2026-09-02", amount: 7000, purpose: "savings", goalId: null, note: "" },
      { id: "b", date: "2026-09-02", amount: 3000, purpose: "goals", goalId: "g", note: "" },
    ];
    const savings: EmergencyFund = {
      target: 0,
      transactions: [{ id: "s", date: "2026-09-02", amount: 7000, direction: "in", note: "" }],
    };
    assert.equal(builtThisPeriod(allocations, emptyFund, savings, "today", noon), 10000);
  });

  it("returns null cost per km when distance is zero", () => {
    assert.equal(costPerKm(12000, 0), null);
    assert.equal(costPerKm(12000, 100), 120);
  });

  it("reads intended future share from the driver's own priorities, not a forced split", () => {
    assert.equal(
      intendedBuildShare({ work: 10, family: 30, savings: 20, goals: 20, personal: 20 }),
      40,
    );
    assert.equal(intendedBuildShare({ work: 0, family: 0, savings: 0, goals: 0, personal: 0 }), 0);
  });
});
