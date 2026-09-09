import { formatHours, formatHoursDecimal, formatKm, formatMoney } from "./money";
import { formatRangeLabel } from "./dates";
import {
  avgRating,
  byExpense,
  byPlatform,
  faresOf,
  kmOf,
  minutesOf,
  spendOf,
  tipsOf,
  type MoneySnapshot,
} from "./finance";
import {
  EXPENSE_LABEL,
  PLATFORM_LABEL,
  type CurrencyCode,
  type Expense,
  type PeriodKey,
  type Settings,
  type Trip,
} from "./types";

export function buildOperatorReport(opts: {
  settings: Settings;
  trips: Trip[];
  expenses: Expense[];
  period: PeriodKey;
}): string {
  const { settings, trips, expenses, period } = opts;
  const currency = settings.currency as CurrencyCode;
  const fares = faresOf(trips);
  const tips = tipsOf(trips);
  const spend = spendOf(expenses);
  const net = fares + tips - spend;
  const rating = avgRating(trips);
  const vehicle = [settings.vehicleMake, settings.vehicleModel, settings.plate]
    .filter(Boolean)
    .join(" · ");
  const lines: string[] = [
    `*Runsheet* — ${formatRangeLabel(period)}`,
    [settings.driverName || "Driver", vehicle].filter(Boolean).join(" · "),
    "",
    `Trips: ${trips.length}`,
    `Hours: ${formatHours(minutesOf(trips))}`,
    `Distance: ${formatKm(kmOf(trips))}`,
    `Rating: ${rating == null ? "—" : rating.toFixed(1)}`,
    "",
    `Gross fares: ${formatMoney(fares, currency)}`,
    `Tips: ${formatMoney(tips, currency)}`,
    `Work expenses: ${formatMoney(spend, currency)}`,
    `*Net work (this copy): ${formatMoney(net, currency)}*`,
  ];

  const platforms = byPlatform(trips);
  if (platforms.length) {
    lines.push("", "By platform:");
    for (const row of platforms) {
      lines.push(
        `• ${PLATFORM_LABEL[row.platform]}  ${formatMoney(row.gross, currency)}  (${row.trips})`,
      );
    }
  }

  const cats = byExpense(expenses);
  if (cats.length) {
    lines.push("", "Expenses:");
    for (const row of cats) {
      lines.push(`• ${EXPENSE_LABEL[row.category]}  ${formatMoney(row.amount, currency)}`);
    }
  }

  lines.push("", "Ready for operator. Personal goals and family figures are not included.");
  return lines.join("\n");
}

export function buildCompleteReport(opts: {
  settings: Settings;
  snap: MoneySnapshot;
  period: PeriodKey;
}): string {
  const { settings, snap, period } = opts;
  const c = settings.currency;
  return [
    `*Runsheet — complete driver report*`,
    formatRangeLabel(period),
    settings.driverName || "Driver",
    "",
    "WORK",
    `Trips: ${snap.trips}`,
    `Hours: ${formatHoursDecimal(snap.hours)}`,
    `Distance: ${formatKm(snap.km)}`,
    `Rating: ${snap.rating == null ? "—" : snap.rating.toFixed(1)}`,
    "",
    "MONEY",
    `Gross income: ${formatMoney(snap.gross, c)}`,
    `Work costs: ${formatMoney(snap.workCosts, c)}`,
    `Net work income: ${formatMoney(snap.netWork, c)}`,
    `Personal commitments: ${formatMoney(snap.provide, c)}`,
    `Savings & goals: ${formatMoney(snap.savings, c)}`,
    `Available: ${formatMoney(snap.available, c)}`,
    `Earnings / hour: ${snap.earningsPerHour == null ? "—" : formatMoney(snap.earningsPerHour, c)}`,
    "",
    "VEHICLE",
    `Vehicle cost: ${formatMoney(snap.vehicleCost, c)}`,
    `Fuel / energy: ${formatMoney(snap.fuelEnergy, c)}`,
    `Maintenance: ${formatMoney(snap.maintenance, c)}`,
    "",
    "Private. This report is for you.",
  ].join("\n");
}

export function buildMoneyReport(opts: { settings: Settings; snap: MoneySnapshot; period: PeriodKey }): string {
  const { settings, snap, period } = opts;
  const c = settings.currency;
  return [
    `*Runsheet — money report*`,
    formatRangeLabel(period),
    settings.driverName || "Driver",
    "",
    `Gross income: ${formatMoney(snap.gross, c)}`,
    `Work costs (operate): ${formatMoney(snap.workCosts, c)}`,
    `Net work income: ${formatMoney(snap.netWork, c)}`,
    `Personal commitments (provide): ${formatMoney(snap.provide + snap.familyAllocated, c)}`,
    `Discretionary (enjoy): ${formatMoney(snap.enjoy, c)}`,
    `Built for later: ${formatMoney(snap.savings, c)}`,
    `Available: ${formatMoney(snap.available, c)}`,
    `Earnings / hour: ${snap.earningsPerHour == null ? "—" : formatMoney(snap.earningsPerHour, c)}`,
    "",
    "Gross is not profit. Family figures in this copy are yours alone.",
  ].join("\n");
}

export function buildVehicleReport(opts: { settings: Settings; snap: MoneySnapshot; period: PeriodKey }): string {
  const { settings, snap, period } = opts;
  const c = settings.currency;
  const vehicle = [settings.vehicleMake, settings.vehicleModel, settings.plate].filter(Boolean).join(" · ");
  return [
    `*Runsheet — vehicle report*`,
    formatRangeLabel(period),
    vehicle || "Vehicle",
    "",
    `Revenue generated: ${formatMoney(snap.fares + snap.tips, c)}`,
    `Vehicle operating cost: ${formatMoney(snap.vehicleCost, c)}`,
    `Fuel / energy: ${formatMoney(snap.fuelEnergy, c)}`,
    `Maintenance: ${formatMoney(snap.maintenance, c)}`,
    `Distance: ${formatKm(snap.km)}`,
    "",
    "The vehicle is an income-producing asset. These figures are operating cost, not depreciation.",
  ].join("\n");
}

export function buildGoalsReport(opts: {
  settings: Settings;
  goals: { title: string; savedAmount: number; targetAmount: number }[];
  period: PeriodKey;
}): string {
  const { settings, goals, period } = opts;
  const c = settings.currency;
  const lines = [
    `*Runsheet — goals report*`,
    formatRangeLabel(period),
    settings.driverName || "Driver",
    "",
  ];
  if (!goals.length) {
    lines.push("No goals yet. Add one to begin building your future.");
  } else {
    for (const g of goals) {
      const pct = g.targetAmount > 0 ? Math.round((g.savedAmount / g.targetAmount) * 100) : 0;
      lines.push(`• ${g.title}  ${formatMoney(g.savedAmount, c)} / ${formatMoney(g.targetAmount, c)}  (${pct}%)`);
    }
  }
  lines.push("", "Private. Not shared with any employer.");
  return lines.join("\n");
}

export function buildGrowthReportText(opts: {
  settings: Settings;
  total: number;
  dimensions: { label: string; score: number; why: string }[];
}): string {
  const lines = [
    `*Runsheet — growth report*`,
    settings.driverName || "Driver",
    `Score: ${opts.total}`,
    "",
  ];
  for (const d of opts.dimensions) {
    lines.push(`• ${d.label}: ${d.score}`);
    lines.push(`  ${d.why}`);
  }
  lines.push("", "A personal score. Not an employer rating.");
  return lines.join("\n");
}

export function snapshotLines(
  settings: Settings,
  trips: Trip[],
  expenses: Expense[],
  incomes: Income[],
  allocations: Allocation[],
  fund: EmergencyFund,
  shifts: Shift[],
  period: PeriodKey,
): MoneySnapshot {
  return moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, period });
}
