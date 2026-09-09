import { daysUntil } from "./dates";
import {
  avgRating,
  emergencyProgress,
  goalProgress,
  moneySnapshot,
  recordKeepingDays,
} from "./finance";
import type {
  Allocation,
  DriverDocument,
  EmergencyFund,
  Expense,
  Goal,
  Income,
  MaintenanceRecord,
  Shift,
  Skill,
  Trip,
} from "./types";

export type GrowthDimension = {
  key: string;
  label: string;
  score: number;
  why: string;
};

export type GrowthReport = {
  total: number;
  dimensions: GrowthDimension[];
  improved: string[];
  focus: string[];
};

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function growthReport(opts: {
  trips: Trip[];
  incomes: Income[];
  expenses: Expense[];
  allocations: Allocation[];
  fund: EmergencyFund;
  shifts: Shift[];
  goals: Goal[];
  skills: Skill[];
  documents: DriverDocument[];
  maintenance: MaintenanceRecord[];
  savings?: EmergencyFund;
  now?: Date;
}): GrowthReport {
  const now = opts.now ?? new Date();
  const month = moneySnapshot({ ...opts, period: "month", now });
  const week = moneySnapshot({ ...opts, period: "week", now });

  const savingsRate = month.gross > 0 ? (month.savings / month.gross) * 100 : 0;
  const financeScore = clamp(savingsRate * 4);
  const financeWhy =
    month.gross <= 0
      ? "No income recorded this month yet, so financial discipline cannot be scored from earnings."
      : `You retained ${Math.round(savingsRate)}% of this month’s gross toward savings, goals, or the emergency fund.`;

  const streak = recordKeepingDays(opts.trips, opts.expenses, opts.incomes, now);
  const recordsScore = clamp((streak / 30) * 100);
  const recordsWhy =
    streak === 0
      ? "No records dated today. A day in the book is the start of the score."
      : `Record-keeping streak: ${streak} day${streak === 1 ? "" : "s"}. 30 days would be a full score.`;

  const rating = avgRating(opts.trips);
  const ratedCount = opts.trips.filter((t) => t.rating != null).length;
  const serviceScore =
    rating == null ? 50 : clamp(((rating - 3) / 2) * 100);
  const serviceWhy =
    rating == null
      ? "No customer ratings yet. The score sits in the middle until the first rating is saved."
      : `Average rating ${rating.toFixed(1)} from ${ratedCount} scored trip${ratedCount === 1 ? "" : "s"}.`;

  const expired = opts.documents.filter((d) => {
    const n = daysUntil(d.expiryDate, now);
    return n != null && n < 0;
  }).length;
  const dueSoon = opts.documents.filter((d) => {
    const n = daysUntil(d.expiryDate, now);
    return n != null && n >= 0 && n <= 30;
  }).length;
  const recentMaint = opts.maintenance.filter((m) => {
    const age = (now.getTime() - new Date(`${m.date}T12:00:00`).getTime()) / 86_400_000;
    return age >= 0 && age <= 120;
  }).length;
  let vehicleScore = 55;
  let vehicleWhy = "Add the vehicle’s documents and a service record to raise this score.";
  if (opts.documents.length || opts.maintenance.length) {
    vehicleScore = 70;
    if (recentMaint) vehicleScore += 15;
    if (opts.documents.length >= 3) vehicleScore += 10;
    if (expired) vehicleScore -= expired * 20;
    if (dueSoon) vehicleScore -= dueSoon * 5;
    vehicleScore = clamp(vehicleScore);
    vehicleWhy = expired
      ? `${expired} document${expired === 1 ? " is" : "s are"} past the date you recorded. Renew, then update the date.`
      : recentMaint
        ? "Documents are current and a service is on file in the last 120 days."
        : "Documents are on file. Log the next service to lift vehicle care.";
  }

  const activeGoals = opts.goals.filter((g) => g.targetAmount > 0);
  const goalAvg =
    activeGoals.length === 0
      ? 40
      : activeGoals.reduce((s, g) => s + goalProgress(g), 0) / activeGoals.length;
  const goalScore = clamp(goalAvg);
  const goalWhy =
    activeGoals.length === 0
      ? "No goals yet. Name one family, vehicle, or savings target to start this dimension."
      : `Average progress across ${activeGoals.length} goal${activeGoals.length === 1 ? "" : "s"} is ${Math.round(goalAvg)}%.`;

  const completed = opts.skills.filter((s) => s.status === "completed").length;
  const learning = opts.skills.filter((s) => s.status === "learning").length;
  const skillScore = opts.skills.length
    ? clamp((completed / opts.skills.length) * 100 + (learning / opts.skills.length) * 30)
    : 20;
  const skillWhy = opts.skills.length
    ? `${completed} skill${completed === 1 ? "" : "s"} marked complete, ${learning} in progress.`
    : "Mark a skill as learning or complete in Growth.";

  const daysWithWork = new Set(
    opts.trips
      .filter((t) => {
        const d = new Date(t.startedAt);
        const start = new Date(now);
        start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        start.setHours(0, 0, 0, 0);
        return d >= start;
      })
      .map((t) => t.startedAt.slice(0, 10)),
  ).size;
  const consistencyScore = week.trips === 0 && daysWithWork === 0 ? 35 : clamp((daysWithWork / 6) * 100);
  const consistencyWhy =
    daysWithWork === 0
      ? "No working days recorded this week yet."
      : `${daysWithWork} working day${daysWithWork === 1 ? "" : "s"} recorded this week (a rest day is expected).`;

  const dimensions: GrowthDimension[] = [
    { key: "finance", label: "Financial discipline", score: financeScore, why: financeWhy },
    { key: "records", label: "Record keeping", score: recordsScore, why: recordsWhy },
    { key: "service", label: "Customer service", score: serviceScore, why: serviceWhy },
    { key: "vehicle", label: "Vehicle care", score: vehicleScore, why: vehicleWhy },
    { key: "goals", label: "Goal progress", score: goalScore, why: goalWhy },
    { key: "growth", label: "Professional development", score: skillScore, why: skillWhy },
    { key: "work", label: "Work consistency", score: consistencyScore, why: consistencyWhy },
  ];

  const total = clamp(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const improved = sorted.filter((d) => d.score >= 70).slice(0, 3).map((d) => d.label);
  const focus = [...dimensions].sort((a, b) => a.score - b.score).slice(0, 2).map((d) => d.label);

  return { total, dimensions, improved, focus };
}

export type Milestone = {
  id: string;
  title: string;
  detail: string;
  unlocked: boolean;
};

export function milestones(opts: {
  trips: Trip[];
  expenses: Expense[];
  incomes: Income[];
  goals: Goal[];
  fund: EmergencyFund;
  skills: Skill[];
  maintenance: MaintenanceRecord[];
  now?: Date;
}): Milestone[] {
  const now = opts.now ?? new Date();
  const streak = recordKeepingDays(opts.trips, opts.expenses, opts.incomes, now);
  const saved = opts.goals.reduce((s, g) => s + Math.max(0, g.savedAmount), 0);
  const ef = emergencyProgress(opts.fund);
  const completedSkill = opts.skills.some((s) => s.status === "completed");
  const goalDone = opts.goals.some((g) => g.targetAmount > 0 && g.savedAmount >= g.targetAmount);
  const firstTrip = [...opts.trips].sort((a, b) => a.startedAt.localeCompare(b.startedAt))[0];
  const yearIn =
    firstTrip != null &&
    now.getTime() - new Date(firstTrip.startedAt).getTime() >= 365 * 86_400_000;
  const monthsWithTrips = new Set(opts.trips.map((t) => t.startedAt.slice(0, 7)));
  const maintOk = opts.maintenance.length > 0;

  return [
    {
      id: "trips-100",
      title: "First 100 trips",
      detail: `${opts.trips.length} trips on record.`,
      unlocked: opts.trips.length >= 100,
    },
    {
      id: "month-1",
      title: "First complete month of records",
      detail: monthsWithTrips.size
        ? `${monthsWithTrips.size} month${monthsWithTrips.size === 1 ? "" : "s"} with trips logged.`
        : "Log trips through a calendar month.",
      unlocked: monthsWithTrips.size >= 1 && opts.trips.length >= 8,
    },
    {
      id: "saved-100k",
      title: "First 100,000 set aside",
      detail: "Across goals currently recorded.",
      unlocked: saved >= 100000,
    },
    {
      id: "ef-half",
      title: "Emergency fund halfway",
      detail: ef > 0 ? `${Math.round(ef)}% of the target you set.` : "Set a target and start contributing.",
      unlocked: ef >= 50,
    },
    {
      id: "streak-30",
      title: "30-day record-keeping streak",
      detail: streak ? `${streak} day${streak === 1 ? "" : "s"} so far.` : "Record something today.",
      unlocked: streak >= 30,
    },
    {
      id: "maint",
      title: "Maintenance on the book",
      detail: maintOk ? `${opts.maintenance.length} service record${opts.maintenance.length === 1 ? "" : "s"}.` : "Log oil, tyres, or a repair.",
      unlocked: maintOk,
    },
    {
      id: "skill-1",
      title: "First professional development mark",
      detail: "A skill marked complete.",
      unlocked: completedSkill,
    },
    {
      id: "year-1",
      title: "One-year driving record",
      detail: firstTrip
        ? `First trip on file from ${new Date(firstTrip.startedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}.`
        : "Starts from your first recorded trip.",
      unlocked: yearIn,
    },
    {
      id: "goal-done",
      title: "A major personal goal achieved",
      detail: goalDone ? "At least one goal has reached its target." : "Keep contributing until a goal hits 100%.",
      unlocked: goalDone,
    },
  ];
}
