import {
  dateOnlyInPeriod,
  dateOnlyInPreviousPeriod,
  hoursBetween,
  inPeriod,
  inPreviousPeriod,
  localKey,
  periodInterval,
} from "./dates";
import type {
  Allocation,
  AllocationPriorities,
  EmergencyFund,
  Expense,
  ExpenseCategory,
  Goal,
  Income,
  MoneyBudget,
  MoneyLane,
  PeriodKey,
  Shift,
  Trip,
} from "./types";
import { EXPENSE_LANE, VEHICLE_COST_CATEGORIES } from "./types";

export function safeAmount(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return v;
}

export function tripsIn(trips: Trip[], period: PeriodKey, now = new Date()): Trip[] {
  return trips.filter((t) => inPeriod(t.startedAt, period, now));
}

export function tripsInPrevious(trips: Trip[], period: PeriodKey, now = new Date()): Trip[] {
  return trips.filter((t) => inPreviousPeriod(t.startedAt, period, now));
}

export function expensesIn(expenses: Expense[], period: PeriodKey, now = new Date()): Expense[] {
  return expenses.filter((e) => dateOnlyInPeriod(e.date, period, now));
}

export function expensesInPrevious(
  expenses: Expense[],
  period: PeriodKey,
  now = new Date(),
): Expense[] {
  return expenses.filter((e) => dateOnlyInPreviousPeriod(e.date, period, now));
}

export function incomesIn(incomes: Income[], period: PeriodKey, now = new Date()): Income[] {
  return incomes.filter((i) => dateOnlyInPeriod(i.date, period, now));
}

export function allocationsIn(
  allocations: Allocation[],
  period: PeriodKey,
  now = new Date(),
): Allocation[] {
  return allocations.filter((a) => dateOnlyInPeriod(a.date, period, now));
}

export function shiftsIn(shifts: Shift[], period: PeriodKey, now = new Date()): Shift[] {
  return shifts.filter((s) => inPeriod(s.startedAt, period, now));
}

export function faresOf(trips: Trip[]): number {
  return trips.reduce((sum, t) => sum + safeAmount(t.fare), 0);
}

export function tipsOf(trips: Trip[]): number {
  return trips.reduce((sum, t) => sum + safeAmount(t.tip), 0);
}

export function tripGrossOf(trips: Trip[]): number {
  return faresOf(trips) + tipsOf(trips);
}

export function otherIncomeOf(incomes: Income[]): number {
  return incomes.reduce((sum, i) => sum + safeAmount(i.amount), 0);
}

/** Gross income = trip fares + tips + other recorded driver income. Not profit. */
export function grossIncome(trips: Trip[], incomes: Income[]): number {
  return tripGrossOf(trips) + otherIncomeOf(incomes);
}

export function laneOf(expense: Expense): MoneyLane {
  return EXPENSE_LANE[expense.category] ?? "operate";
}

export function spendOf(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + safeAmount(e.amount), 0);
}

export function spendByLane(expenses: Expense[], lane: MoneyLane): number {
  return spendOf(expenses.filter((e) => laneOf(e) === lane));
}

/** Work costs = operate-lane expenses required to generate the income. */
export function workCosts(expenses: Expense[]): number {
  return spendByLane(expenses, "operate");
}

export function personalCommitments(expenses: Expense[]): number {
  return spendByLane(expenses, "provide");
}

export function discretionarySpend(expenses: Expense[]): number {
  return spendByLane(expenses, "enjoy");
}

/** Net work income = gross income − work-related expenses. */
export function netWorkIncome(trips: Trip[], incomes: Income[], expenses: Expense[]): number {
  return grossIncome(trips, incomes) - workCosts(expenses);
}

export function allocatedOf(
  allocations: Allocation[],
  purpose?: Allocation["purpose"],
): number {
  return allocations
    .filter((a) => (purpose ? a.purpose === purpose : true))
    .reduce((sum, a) => sum + safeAmount(a.amount), 0);
}

export function emergencyBalance(fund: EmergencyFund): number {
  return fund.transactions.reduce((sum, t) => {
    const amt = safeAmount(t.amount);
    return t.direction === "out" ? sum - amt : sum + amt;
  }, 0);
}

export function emergencyProgress(fund: EmergencyFund): number {
  const target = safeAmount(fund.target);
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, (emergencyBalance(fund) / target) * 100));
}

export function emergencyContributed(
  fund: EmergencyFund,
  period: PeriodKey,
  now = new Date(),
): number {
  return fund.transactions
    .filter((t) => t.direction === "in" && dateOnlyInPeriod(t.date, period, now))
    .reduce((sum, t) => sum + safeAmount(t.amount), 0);
}

export function savingsContributed(
  savings: EmergencyFund,
  period: PeriodKey,
  now = new Date(),
): number {
  return emergencyContributed(savings, period, now);
}

/**
 * Money kept for the future in this period: goal allocations, emergency
 * contributions, and savings-pot deposits. Savings allocations are posted to
 * the savings pot, so they are not counted a second time.
 */
export function builtThisPeriod(
  allocations: Allocation[],
  fund: EmergencyFund,
  savings: EmergencyFund,
  period: PeriodKey,
  now = new Date(),
): number {
  const a = allocationsIn(allocations, period, now);
  return (
    allocatedOf(a, "goals") +
    emergencyContributed(fund, period, now) +
    savingsContributed(savings, period, now)
  );
}

export function goalProgress(goal: Goal): number {
  const target = safeAmount(goal.targetAmount);
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, (safeAmount(goal.savedAmount) / target) * 100));
}

export function savingsBuilt(
  allocations: Allocation[],
  fund: EmergencyFund,
  period: PeriodKey,
  now = new Date(),
  savings: EmergencyFund = { target: 0, transactions: [] },
): number {
  return builtThisPeriod(allocations, fund, savings, period, now);
}

/**
 * Remaining after recorded work costs, personal commitments, discretionary
 * spend, and savings/goal/emergency allocations. Can be negative.
 */
export function availableMoney(
  trips: Trip[],
  incomes: Income[],
  expenses: Expense[],
  allocations: Allocation[],
  fund: EmergencyFund,
  period: PeriodKey,
  now = new Date(),
  savings: EmergencyFund = { target: 0, transactions: [] },
): number {
  const t = tripsIn(trips, period, now);
  const i = incomesIn(incomes, period, now);
  const e = expensesIn(expenses, period, now);
  const a = allocationsIn(allocations, period, now);
  const net = netWorkIncome(t, i, e);
  const provide = personalCommitments(e);
  const enjoy = discretionarySpend(e);
  const built = builtThisPeriod(allocations, fund, savings, period, now);
  const otherPurpose =
    allocatedOf(a, "family") + allocatedOf(a, "personal") + allocatedOf(a, "work");
  return net - provide - enjoy - built - otherPurpose;
}

export function kmOf(trips: Trip[]): number {
  return trips.reduce((sum, t) => sum + safeAmount(t.distanceKm), 0);
}

export function minutesOf(trips: Trip[]): number {
  return trips.reduce((sum, t) => sum + safeAmount(t.durationMin), 0);
}

export function shiftHours(shifts: Shift[], now = new Date()): number {
  return shifts.reduce((sum, s) => sum + hoursBetween(s.startedAt, s.endedAt, now), 0);
}

/** Prefer recorded shift time; fall back to trip duration when no shifts exist. */
export function workingHours(
  shifts: Shift[],
  trips: Trip[],
  period: PeriodKey,
  now = new Date(),
): number {
  const s = shiftsIn(shifts, period, now);
  const fromShifts = shiftHours(s, now);
  if (fromShifts > 0) return fromShifts;
  return minutesOf(tripsIn(trips, period, now)) / 60;
}

export function earningsPerHour(
  net: number,
  hours: number,
): number | null {
  if (!Number.isFinite(net) || !Number.isFinite(hours) || hours <= 0) return null;
  return net / hours;
}

export function vehicleCosts(expenses: Expense[]): number {
  return expenses
    .filter((e) => VEHICLE_COST_CATEGORIES.includes(e.category))
    .reduce((sum, e) => sum + safeAmount(e.amount), 0);
}

export function costsByCategories(expenses: Expense[], categories: ExpenseCategory[]): number {
  return expenses
    .filter((e) => categories.includes(e.category))
    .reduce((sum, e) => sum + safeAmount(e.amount), 0);
}

export function fuelEnergyCost(expenses: Expense[]): number {
  return costsByCategories(expenses, ["fuel", "charging"]);
}

export function maintenanceCost(expenses: Expense[]): number {
  return costsByCategories(expenses, ["maintenance", "tyres"]);
}

export function vehicleNetContribution(trips: Trip[], incomes: Income[], expenses: Expense[]): number {
  return grossIncome(trips, incomes) - vehicleCosts(expenses);
}

export function ratedTrips(trips: Trip[]): Trip[] {
  return trips.filter((t) => t.rating != null);
}

export function avgRating(trips: Trip[]): number | null {
  const rated = ratedTrips(trips);
  if (rated.length === 0) return null;
  return rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length;
}

export function byPlatform(
  trips: Trip[],
): { platform: Trip["platform"]; trips: number; gross: number }[] {
  const map = new Map<Trip["platform"], { trips: number; gross: number }>();
  for (const t of trips) {
    const cur = map.get(t.platform) ?? { trips: 0, gross: 0 };
    cur.trips += 1;
    cur.gross += safeAmount(t.fare) + safeAmount(t.tip);
    map.set(t.platform, cur);
  }
  return [...map.entries()]
    .map(([platform, v]) => ({ platform, ...v }))
    .sort((a, b) => b.gross - a.gross);
}

export function byExpense(
  expenses: Expense[],
): { category: ExpenseCategory; amount: number }[] {
  const map = new Map<ExpenseCategory, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + safeAmount(e.amount));
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function byLane(
  expenses: Expense[],
): { lane: MoneyLane; amount: number }[] {
  const map: Record<MoneyLane, number> = { operate: 0, provide: 0, enjoy: 0 };
  for (const e of expenses) map[laneOf(e)] += safeAmount(e.amount);
  return (Object.keys(map) as MoneyLane[])
    .map((lane) => ({ lane, amount: map[lane] }))
    .filter((r) => r.amount > 0);
}

export type CustomerStats = {
  customerId: string;
  trips: number;
  gross: number;
  tips: number;
  avgRating: number | null;
  lastTripAt: string | null;
  lastAppreciation: string;
};

export function statsForCustomerId(customerId: string, trips: Trip[]): CustomerStats {
  const theirs = trips
    .filter((t) => t.customerId === customerId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const rated = ratedTrips(theirs);
  const lastWithWords = theirs.find((t) => t.appreciation.trim().length > 0);
  return {
    customerId,
    trips: theirs.length,
    gross: tripGrossOf(theirs),
    tips: tipsOf(theirs),
    avgRating:
      rated.length === 0
        ? null
        : rated.reduce((s, t) => s + (t.rating ?? 0), 0) / rated.length,
    lastTripAt: theirs[0]?.startedAt ?? null,
    lastAppreciation: lastWithWords?.appreciation ?? "",
  };
}

export function percentChange(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export type MoneySnapshot = {
  trips: number;
  hours: number;
  km: number;
  fares: number;
  tips: number;
  otherIncome: number;
  gross: number;
  workCosts: number;
  netWork: number;
  provide: number;
  enjoy: number;
  savings: number;
  familyAllocated: number;
  available: number;
  earningsPerHour: number | null;
  vehicleCost: number;
  fuelEnergy: number;
  maintenance: number;
  rating: number | null;
};

export function moneySnapshot(opts: {
  trips: Trip[];
  incomes: Income[];
  expenses: Expense[];
  allocations: Allocation[];
  fund: EmergencyFund;
  shifts: Shift[];
  period: PeriodKey;
  now?: Date;
  savings?: EmergencyFund;
}): MoneySnapshot {
  const now = opts.now ?? new Date();
  const trips = tripsIn(opts.trips, opts.period, now);
  const incomes = incomesIn(opts.incomes, opts.period, now);
  const expenses = expensesIn(opts.expenses, opts.period, now);
  const allocations = allocationsIn(opts.allocations, opts.period, now);
  const savingsPot = opts.savings ?? { target: 0, transactions: [] };
  const hours = workingHours(opts.shifts, opts.trips, opts.period, now);
  const gross = grossIncome(trips, incomes);
  const work = workCosts(expenses);
  const net = gross - work;
  const provide = personalCommitments(expenses);
  const enjoy = discretionarySpend(expenses);
  const savings = builtThisPeriod(opts.allocations, opts.fund, savingsPot, opts.period, now);
  const familyAllocated = allocatedOf(allocations, "family");
  const available =
    net -
    provide -
    enjoy -
    savings -
    familyAllocated -
    allocatedOf(allocations, "personal") -
    allocatedOf(allocations, "work");
  return {
    trips: trips.length,
    hours,
    km: kmOf(trips),
    fares: faresOf(trips),
    tips: tipsOf(trips),
    otherIncome: otherIncomeOf(incomes),
    gross,
    workCosts: work,
    netWork: net,
    provide,
    enjoy,
    savings,
    familyAllocated,
    available,
    earningsPerHour: earningsPerHour(net, hours),
    vehicleCost: vehicleCosts(expenses),
    fuelEnergy: fuelEnergyCost(expenses),
    maintenance: maintenanceCost(expenses),
    rating: avgRating(trips),
  };
}

/** Estimate how many months the reserve could cover average provide-lane spend. */
export function monthsOfCover(
  balance: number,
  provideExpenses: Expense[],
  now = new Date(),
): number | null {
  if (balance <= 0) return 0;
  const monthSpend = personalCommitments(expensesIn(provideExpenses, "month", now));
  if (monthSpend > 0) return balance / monthSpend;
  const allProvide = personalCommitments(provideExpenses);
  if (allProvide <= 0) return null;
  const dates = provideExpenses
    .filter((e) => EXPENSE_LANE[e.category] === "provide")
    .map((e) => e.date)
    .sort();
  if (dates.length < 2) return null;
  const first = new Date(`${dates[0]}T12:00:00`).getTime();
  const last = new Date(`${dates[dates.length - 1]}T12:00:00`).getTime();
  const months = Math.max(1, (last - first) / (30 * 86_400_000));
  const avg = allProvide / months;
  if (avg <= 0) return null;
  return balance / avg;
}

export function weekSeries(
  trips: Trip[],
  expenses: Expense[],
  incomes: Income[] = [],
  now = new Date(),
): { day: string; income: number; spend: number }[] {
  const interval = periodInterval("week", now);
  if (!interval) return [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => {
    const d = new Date(interval.start);
    d.setDate(interval.start.getDate() + i);
    const key = localKey(d);
    const income =
      trips
        .filter((t) => localKey(new Date(t.startedAt)) === key)
        .reduce((s, t) => s + safeAmount(t.fare) + safeAmount(t.tip), 0) +
      incomes.filter((n) => n.date === key).reduce((s, n) => s + safeAmount(n.amount), 0);
    const spend = expenses.filter((e) => e.date === key).reduce((s, e) => s + safeAmount(e.amount), 0);
    return { day, income, spend };
  });
}

export function recordKeepingDays(
  trips: Trip[],
  expenses: Expense[],
  incomes: Income[],
  now = new Date(),
): number {
  const keys = new Set<string>();
  for (const t of trips) keys.add(localKey(new Date(t.startedAt)));
  for (const e of expenses) keys.add(e.date);
  for (const i of incomes) keys.add(i.date);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (keys.has(localKey(d))) streak += 1;
    else break;
  }
  return streak;
}

export function shiftWindowStats(
  shift: Shift,
  trips: Trip[],
  expenses: Expense[],
  incomes: Income[],
  now = new Date(),
) {
  const start = new Date(shift.startedAt).getTime();
  const end = new Date(shift.endedAt ?? now).getTime();
  const inShift = trips.filter((t) => {
    const ts = new Date(t.startedAt).getTime();
    return ts >= start && ts <= end;
  });
  const day = localKey(new Date(shift.startedAt));
  const dayExpenses = expenses.filter((e) => e.date === day && laneOf(e) === "operate");
  const dayIncome = incomes.filter((i) => i.date === day);
  const hours = hoursBetween(shift.startedAt, shift.endedAt, now);
  const gross = grossIncome(inShift, dayIncome);
  const costs = workCosts(dayExpenses);
  const net = gross - costs;
  return {
    hours,
    trips: inShift.length,
    gross,
    expenses: costs,
    net,
    earningsPerHour: earningsPerHour(net, hours),
  };
}

export function costPerKm(cost: number, km: number): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(km) || km <= 0) return null;
  return cost / km;
}

export type BudgetActualRow = {
  lane: "operate" | "provide" | "enjoy" | "build";
  budget: number;
  actual: number;
};

export function budgetVsActual(
  budget: MoneyBudget,
  expenses: Expense[],
  buildAmount: number,
): BudgetActualRow[] {
  return [
    { lane: "operate", budget: safeAmount(budget.operate), actual: workCosts(expenses) },
    { lane: "provide", budget: safeAmount(budget.provide), actual: personalCommitments(expenses) },
    { lane: "enjoy", budget: safeAmount(budget.enjoy), actual: discretionarySpend(expenses) },
    { lane: "build", budget: safeAmount(budget.build), actual: safeAmount(buildAmount) },
  ];
}

export function intendedBuildShare(priorities: AllocationPriorities): number {
  const total = (Object.values(priorities) as number[]).reduce((s, n) => s + safeAmount(n), 0);
  if (total <= 0) return 0;
  return ((safeAmount(priorities.savings) + safeAmount(priorities.goals)) / total) * 100;
}

export function actualBuildShare(gross: number, built: number): number | null {
  if (!Number.isFinite(gross) || gross <= 0) return null;
  return (safeAmount(built) / gross) * 100;
}

export type MoneyPillars = {
  earn: number;
  operate: number;
  provide: number;
  build: number;
  enjoy: number;
};

export function moneyPillars(snap: MoneySnapshot): MoneyPillars {
  return {
    earn: snap.gross,
    operate: snap.workCosts,
    provide: snap.provide + snap.familyAllocated,
    build: snap.savings,
    enjoy: snap.enjoy,
  };
}

export function monthTrend(
  opts: {
    trips: Trip[];
    incomes: Income[];
    expenses: Expense[];
    allocations: Allocation[];
    fund: EmergencyFund;
    shifts: Shift[];
    savings?: EmergencyFund;
  },
  months = 6,
  now = new Date(),
): { key: string; label: string; income: number; workCosts: number; vehicle: number; net: number }[] {
  const rows = [];
  for (let i = months - 1; i >= 0; i--) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const snap = moneySnapshot({ ...opts, period: "month", now: cursor });
    rows.push({
      key: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
      label: cursor.toLocaleString("en-GB", { month: "short" }),
      income: snap.gross,
      workCosts: snap.workCosts,
      vehicle: snap.vehicleCost,
      net: snap.netWork,
    });
  }
  return rows;
}

export function avgFare(trips: Trip[]): number | null {
  if (trips.length === 0) return null;
  return tripGrossOf(trips) / trips.length;
}
