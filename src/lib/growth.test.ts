import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { growthReport, milestones } from "./growth.ts";
import type { EmergencyFund, Goal, Trip } from "./types.ts";

const noon = new Date("2026-09-02T12:00:00");
const emptyFund: EmergencyFund = { target: 500000, transactions: [] };

function trip(startedAt: string, fare: number, rating: number | null = 5): Trip {
  return {
    id: startedAt,
    startedAt,
    endedAt: null,
    customerId: null,
    pickup: "A",
    dropoff: "B",
    fare,
    tip: 0,
    platform: "yego",
    paymentType: "momo",
    distanceKm: 4,
    durationMin: 20,
    rating,
    appreciation: "",
    notes: "",
    createdAt: startedAt,
  };
}

describe("growth score", () => {
  it("returns seven transparent dimensions between 0 and 100", () => {
    const report = growthReport({
      trips: [trip("2026-09-02T08:00:00", 8000)],
      incomes: [],
      expenses: [],
      allocations: [],
      fund: emptyFund,
      shifts: [],
      goals: [],
      skills: [],
      documents: [],
      maintenance: [],
      now: noon,
    });
    assert.equal(report.dimensions.length, 7);
    assert.ok(report.total >= 0 && report.total <= 100);
    for (const d of report.dimensions) {
      assert.ok(d.why.length > 8);
      assert.ok(d.score >= 0 && d.score <= 100);
    }
  });
});

describe("milestones", () => {
  it("unlocks 100k saved and a complete goal", () => {
    const goals: Goal[] = [
      {
        id: "g",
        title: "School",
        category: "family",
        targetAmount: 100000,
        savedAmount: 100000,
        deadline: "",
        note: "",
      },
    ];
    const list = milestones({
      trips: Array.from({ length: 12 }, (_, i) => trip(`2026-09-01T0${i % 9}:00:00`, 1000)),
      expenses: [],
      incomes: [],
      goals,
      fund: { target: 200000, transactions: [{ id: "1", date: "2026-08-01", amount: 120000, direction: "in", note: "" }] },
      skills: [
        {
          id: "s",
          area: "customer_service",
          status: "completed",
          notes: "",
          updatedAt: "2026-09-01T00:00:00.000Z",
        },
      ],
      maintenance: [],
      now: noon,
    });
    assert.ok(list.find((m) => m.id === "saved-100k")?.unlocked);
    assert.ok(list.find((m) => m.id === "goal-done")?.unlocked);
    assert.ok(list.find((m) => m.id === "skill-1")?.unlocked);
    assert.ok(list.find((m) => m.id === "ef-half")?.unlocked);
    assert.equal(list.find((m) => m.id === "trips-100")?.unlocked, false);
  });
});
