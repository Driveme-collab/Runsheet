import {
  avgRating,
  emergencyBalance,
  emergencyProgress,
  goalProgress,
  moneySnapshot,
  percentChange,
  recordKeepingDays,
  vehicleCosts,
  workCosts,
} from "./finance";
import type {
  Allocation,
  EmergencyFund,
  Expense,
  Goal,
  Income,
  Shift,
  Trip,
} from "./types";

export type Insight = {
  id: string;
  text: string;
  tone: "up" | "down" | "neutral" | "empty";
};

export function buildInsights(opts: {
  trips: Trip[];
  incomes: Income[];
  expenses: Expense[];
  allocations: Allocation[];
  fund: EmergencyFund;
  shifts: Shift[];
  goals: Goal[];
  savings?: EmergencyFund;
  now?: Date;
}): Insight[] {
  const now = opts.now ?? new Date();
  const hasAnything =
    opts.trips.length + opts.expenses.length + opts.incomes.length + opts.goals.length > 0;
  if (!hasAnything) {
    return [
      {
        id: "empty",
        text: "Not enough data yet. Start recording trips to see your real earnings.",
        tone: "empty",
      },
    ];
  }

  const week = moneySnapshot({ ...opts, period: "week", now });
  const lastWeek = moneySnapshot({ ...opts, period: "week", now: new Date(now.getTime() - 7 * 86400000) });
  const month = moneySnapshot({ ...opts, period: "month", now });
  const lastMonth = moneySnapshot({
    ...opts,
    period: "month",
    now: new Date(now.getFullYear(), now.getMonth() - 1, 15),
  });

  const out: Insight[] = [];

  const earnChange = percentChange(week.gross, lastWeek.gross);
  const costChange = percentChange(week.workCosts, lastWeek.workCosts);
  if (week.gross > 0 || lastWeek.gross > 0) {
    if (earnChange != null && costChange != null && earnChange > 2 && costChange > 2) {
      out.push({
        id: "earn-cost-up",
        text: `Your earnings increased this week, but vehicle and work expenses also increased.`,
        tone: "neutral",
      });
    } else if (earnChange != null && earnChange > 2) {
      out.push({
        id: "earn-up",
        text: `You earned more this week than last week.`,
        tone: "up",
      });
    } else if (earnChange != null && earnChange < -2 && lastWeek.gross > 0) {
      out.push({
        id: "earn-down",
        text: `Earnings are lower this week than last week.`,
        tone: "down",
      });
    }
  }

  if (week.earningsPerHour != null && lastMonth.earningsPerHour != null) {
    const eph = percentChange(week.earningsPerHour, lastMonth.earningsPerHour);
    if (eph != null && eph > 3) {
      out.push({
        id: "eph-up",
        text: `Your average earnings per working hour improved compared with last month.`,
        tone: "up",
      });
    } else if (eph != null && eph < -3) {
      out.push({
        id: "eph-down",
        text: `Average earnings per hour are lower than last month. Check hours and work costs.`,
        tone: "down",
      });
    }
  }

  if (month.workCosts > 0) {
    const monthFuel = month.fuelEnergy;
    const prevFuel = lastMonth.fuelEnergy;
    if (monthFuel / month.workCosts > 0.45) {
      out.push({
        id: "fuel-share",
        text: `Fuel and energy represent a large share of your work costs this month.`,
        tone: "neutral",
      });
    } else if (prevFuel > 0 && monthFuel > prevFuel * 1.15) {
      out.push({
        id: "fuel-up",
        text: `Fuel expenses represent a larger share of your work costs this month.`,
        tone: "down",
      });
    }
  }

  const fundPct = emergencyProgress(opts.fund);
  const balance = emergencyBalance(opts.fund);
  if (opts.fund.target > 0 && balance > 0) {
    if (fundPct >= 100) {
      out.push({
        id: "ef-done",
        text: `You have reached your emergency-fund target. Review the target if life has changed.`,
        tone: "up",
      });
    } else if (month.savings > 0) {
      out.push({
        id: "ef-track",
        text: `You are consistently contributing toward your emergency fund.`,
        tone: "up",
      });
    } else {
      out.push({
        id: "ef-progress",
        text: `Emergency fund is at ${Math.round(fundPct)}% of the target you set.`,
        tone: "neutral",
      });
    }
  }

  if (month.vehicleCost > 0 && lastMonth.vehicleCost > 0) {
    const vc = percentChange(month.vehicleCost, lastMonth.vehicleCost);
    if (vc != null && vc > 8) {
      out.push({
        id: "veh-up",
        text: `Your vehicle maintenance and operating cost increased compared with the previous period.`,
        tone: "down",
      });
    }
  }

  const monthGrossChange = percentChange(month.gross, lastMonth.gross);
  if (monthGrossChange != null && monthGrossChange > 2 && lastMonth.gross > 0) {
    out.push({
      id: "month-earn-up",
      text: `You earned more this month than last month.`,
      tone: "up",
    });
  }

  const rating = avgRating(opts.trips);
  if (rating != null && rating >= 4.6) {
    out.push({
      id: "rating-high",
      text: `Customers are rating the work highly. Keep the same standard.`,
      tone: "up",
    });
  }

  const streak = recordKeepingDays(opts.trips, opts.expenses, opts.incomes, now);
  if (streak >= 7) {
    out.push({
      id: "streak",
      text: `You have recorded work or money for ${streak} days in a row.`,
      tone: "up",
    });
  }

  const activeGoals = opts.goals.filter((g) => g.targetAmount > 0);
  if (activeGoals.length) {
    const avg = activeGoals.reduce((s, g) => s + goalProgress(g), 0) / activeGoals.length;
    if (avg >= 50) {
      out.push({
        id: "goals-mid",
        text: `You are past halfway on your recorded goals, on average.`,
        tone: "up",
      });
    }
  }

  const unique: Insight[] = [];
  const seen = new Set<string>();
  for (const i of out) {
    if (seen.has(i.id)) continue;
    seen.add(i.id);
    unique.push(i);
  }

  if (unique.length === 0) {
    if (week.trips === 0 && month.trips === 0) {
      return [
        {
          id: "no-trips",
          text: "Not enough data yet. Start recording your trips to see your real earnings.",
          tone: "empty",
        },
      ];
    }
    return [
      {
        id: "keep-going",
        text: "Keep recording. Insights appear as soon as there is a previous week or month to compare.",
        tone: "neutral",
      },
    ];
  }

  return unique.slice(0, 4);
}

export function vehicleCostShare(expenses: Expense[]): number | null {
  const work = workCosts(expenses);
  if (work <= 0) return null;
  return (vehicleCosts(expenses) / work) * 100;
}
