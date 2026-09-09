import { percentChange, type MoneySnapshot } from "./finance";
import { formatHoursDecimal, formatMoney } from "./money";
import type { CurrencyCode, Goal } from "./types";

export function weekHighlights(
  current: MoneySnapshot,
  previous: MoneySnapshot,
  goals: Goal[],
  currency: CurrencyCode,
): { well: string[]; attention: string[] } {
  const well: string[] = [];
  const attention: string[] = [];

  if (current.trips === 0 && current.gross === 0) {
    return {
      well: [],
      attention: ["Not enough data yet. Complete a week of records, then return for a review."],
    };
  }

  if (current.trips > 0) {
    well.push(
      `${current.trips} trip${current.trips === 1 ? "" : "s"} · ${formatMoney(current.gross, currency)} gross · ${formatHoursDecimal(current.hours)} worked.`,
    );
  }
  if (current.earningsPerHour != null) {
    well.push(`Net work income about ${formatMoney(current.earningsPerHour, currency)} per hour.`);
  }
  if (current.savings > 0) {
    well.push(`${formatMoney(current.savings, currency)} went toward savings, goals, or the emergency fund.`);
  }
  if (current.rating != null && current.rating >= 4.5) {
    well.push(`Customer rating averaged ${current.rating.toFixed(1)}.`);
  }
  const moved = goals.filter((g) => g.savedAmount > 0);
  if (moved.length) {
    well.push(`${moved.length} goal${moved.length === 1 ? "" : "s"} currently have money set aside.`);
  }

  const earn = percentChange(current.gross, previous.gross);
  if (earn != null && earn < -8 && previous.gross > 0) {
    attention.push(`Gross income is ${Math.abs(Math.round(earn))}% lower than last week.`);
  }
  const costs = percentChange(current.workCosts, previous.workCosts);
  if (costs != null && costs > 10 && previous.workCosts > 0) {
    attention.push(`Work expenses rose ${Math.round(costs)}% compared with last week.`);
  }
  if (current.workCosts > 0 && current.gross > 0 && current.workCosts / current.gross > 0.45) {
    attention.push("Work costs took a large share of gross income this week.");
  }
  if (current.rating != null && current.rating < 4) {
    attention.push(`Average rating was ${current.rating.toFixed(1)}. Read the trip notes.`);
  }
  if (current.savings === 0 && current.gross > 0) {
    attention.push("No savings or goal contribution was recorded this week.");
  }

  return { well, attention };
}

export function monthHighlights(
  current: MoneySnapshot,
  previous: MoneySnapshot,
  currency: CurrencyCode,
): { well: string[]; attention: string[]; deltas: { label: string; pct: number | null }[] } {
  const well: string[] = [];
  const attention: string[] = [];
  const deltas = [
    { label: "Income", pct: percentChange(current.gross, previous.gross) },
    { label: "Work expenses", pct: percentChange(current.workCosts, previous.workCosts) },
    { label: "Savings", pct: percentChange(current.savings, previous.savings) },
  ];

  if (current.trips === 0 && current.gross === 0) {
    return {
      well: [],
      attention: ["Not enough data yet for a monthly review."],
      deltas,
    };
  }

  well.push(
    `${formatMoney(current.gross, currency)} gross · ${formatMoney(current.workCosts, currency)} work costs · ${formatMoney(current.netWork, currency)} net work income.`,
  );
  if (current.provide > 0) {
    well.push(`${formatMoney(current.provide, currency)} went to family and personal commitments.`);
  }
  if (current.savings > 0) {
    well.push(`${formatMoney(current.savings, currency)} built toward the future.`);
  }

  for (const d of deltas) {
    if (d.pct == null || previous.gross + previous.workCosts + previous.savings === 0) continue;
    if (d.label === "Income" && d.pct < -5) attention.push(`Income is down ${Math.abs(Math.round(d.pct))}% against last month.`);
    if (d.label === "Work expenses" && d.pct > 8) attention.push(`Work expenses are up ${Math.round(d.pct)}% against last month.`);
    if (d.label === "Savings" && d.pct < -5 && previous.savings > 0) {
      attention.push(`Savings contributions are down ${Math.abs(Math.round(d.pct))}% against last month.`);
    }
  }

  return { well, attention, deltas };
}

export function formatDelta(pct: number | null): string {
  if (pct == null) return "—";
  const n = Math.round(pct);
  if (n > 0) return `↑ ${n}%`;
  if (n < 0) return `↓ ${Math.abs(n)}%`;
  return "0%";
}
