import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { uid } from "./utils";
import type {
  Allocation,
  CalendarEvent,
  CommunityConversation,
  CommunityMessage,
  Customer,
  CustomerStatus,
  DevelopmentActivity,
  DriverAvailability,
  DriverDocument,
  EmergencyFund,
  Expense,
  Goal,
  GoalContribution,
  HandoffRequest,
  Income,
  MaintenanceRecord,
  MonthlyReview,
  RecordedMilestone,
  Settings,
  Shift,
  Skill,
  StoredInsight,
  Trip,
  WeeklyReview,
} from "./types";
import { DEFAULT_CURRENCY, DEFAULT_PRIORITIES, DEFAULT_REMINDERS, EMPTY_BUDGET } from "./types";
import {
  defaultSkills,
  emptyEmergencyFund,
  emptySettings,
  sampleBundle,
} from "./seed";

export type RunsheetData = {
  customers: Customer[];
  trips: Trip[];
  expenses: Expense[];
  incomes: Income[];
  allocations: Allocation[];
  goals: Goal[];
  contributions: GoalContribution[];
  shifts: Shift[];
  fund: EmergencyFund;
  savings: EmergencyFund;
  maintenance: MaintenanceRecord[];
  documents: DriverDocument[];
  events: CalendarEvent[];
  skills: Skill[];
  activities: DevelopmentActivity[];
  weeklyReviews: WeeklyReview[];
  monthlyReviews: MonthlyReview[];
  milestones: RecordedMilestone[];
  insights: StoredInsight[];
  availability: DriverAvailability[];
  handoffs: HandoffRequest[];
  conversations: CommunityConversation[];
  messages: CommunityMessage[];
  settings: Settings;
};

export type RunsheetState = RunsheetData & {
  hydrated: boolean;
  setHydrated: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addCustomer: (input: Omit<Customer, "id" | "createdAt">) => string;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addTrip: (input: Omit<Trip, "id" | "createdAt">) => string;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addExpense: (input: Omit<Expense, "id">) => string;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (input: Omit<Income, "id">) => string;
  updateIncome: (id: string, patch: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addAllocation: (input: Omit<Allocation, "id">) => string;
  deleteAllocation: (id: string) => void;
  addGoal: (input: Omit<Goal, "id">) => string;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number, note?: string, date?: string) => string | null;
  startShift: () => void;
  endShift: () => void;
  updateShift: (id: string, patch: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  setFundTarget: (target: number) => void;
  addFundTx: (input: Omit<EmergencyFund["transactions"][number], "id">) => string;
  deleteFundTx: (id: string) => void;
  setSavingsTarget: (target: number) => void;
  addSavingsTx: (input: Omit<EmergencyFund["transactions"][number], "id">) => string;
  deleteSavingsTx: (id: string) => void;
  addMaintenance: (input: Omit<MaintenanceRecord, "id">) => string;
  updateMaintenance: (id: string, patch: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (id: string) => void;
  addDocument: (input: Omit<DriverDocument, "id">) => string;
  updateDocument: (id: string, patch: Partial<DriverDocument>) => void;
  deleteDocument: (id: string) => void;
  addEvent: (input: Omit<CalendarEvent, "id">) => string;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  upsertSkill: (skill: Skill) => void;
  addActivity: (input: Omit<DevelopmentActivity, "id">) => string;
  deleteActivity: (id: string) => void;
  saveWeeklyReview: (input: Omit<WeeklyReview, "id" | "createdAt">) => string;
  saveMonthlyReview: (input: Omit<MonthlyReview, "id" | "createdAt">) => string;
  loadSample: () => void;
  startFresh: () => void;
  completeOnboarding: (patch: Partial<Settings>) => void;
};

const sample = sampleBundle();

function emptyData(): RunsheetData {
  return {
    customers: [],
    trips: [],
    expenses: [],
    incomes: [],
    allocations: [],
    goals: [],
    contributions: [],
    shifts: [],
    fund: emptyEmergencyFund(),
    savings: emptyEmergencyFund(),
    maintenance: [],
    documents: [],
    events: [],
    skills: defaultSkills(),
    activities: [],
    weeklyReviews: [],
    monthlyReviews: [],
    milestones: [],
    insights: [],
    availability: [],
    handoffs: [],
    conversations: [],
    messages: [],
    settings: emptySettings(),
  };
}

function asStatus(c: Partial<Customer>): CustomerStatus {
  if (c.status) return c.status;
  return c.regular ? "regular" : "occasional";
}

function inferGoalCategory(title: string): Goal["category"] {
  const t = title.toLowerCase();
  if (/(school|fee|family|home|rent|child)/.test(t)) return "family";
  if (/(tyre|tire|vehicle|car|oil|service)/.test(t)) return "vehicle";
  if (/(emergency|saving|debt|capital)/.test(t)) return "financial";
  if (/(certif|train|career|licence|license)/.test(t)) return "career";
  return "personal";
}

function normalizeSettings(raw: Partial<Settings> | undefined): Settings {
  const base = emptySettings();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    currency: raw.currency ?? DEFAULT_CURRENCY,
    workSources: Array.isArray(raw.workSources) ? raw.workSources : [],
    onboarded: raw.onboarded ?? Boolean(raw.driverName),
    drivingSituation: raw.drivingSituation ?? "own",
    fuelType: raw.fuelType ?? "petrol",
    currentMileage: Number(raw.currentMileage) || 0,
    purchaseValue: raw.purchaseValue ?? null,
    nextLevel: raw.nextLevel ?? null,
    budget: { ...EMPTY_BUDGET, ...(raw.budget ?? {}) },
    priorities: { ...DEFAULT_PRIORITIES, ...(raw.priorities ?? {}) },
    reminders: { ...DEFAULT_REMINDERS, ...(raw.reminders ?? {}) },
  };
}

function normalizeCustomer(c: Partial<Customer> & { id: string; name: string }): Customer {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone ?? "",
    notes: c.notes ?? "",
    regular: Boolean(c.regular),
    status: asStatus(c),
    createdAt: c.createdAt ?? new Date().toISOString(),
  };
}

function normalizeTrip(t: Partial<Trip> & { id: string; startedAt: string }): Trip {
  const platform = t.platform ?? "cash";
  return {
    id: t.id,
    startedAt: t.startedAt,
    endedAt: t.endedAt ?? null,
    customerId: t.customerId ?? null,
    pickup: t.pickup ?? "",
    dropoff: t.dropoff ?? "",
    fare: Number(t.fare) || 0,
    tip: Number(t.tip) || 0,
    platform,
    paymentType: t.paymentType ?? (platform === "cash" ? "cash" : "platform"),
    distanceKm: Number(t.distanceKm) || 0,
    durationMin: Number(t.durationMin) || 0,
    rating: t.rating ?? null,
    appreciation: t.appreciation ?? "",
    notes: t.notes ?? "",
    createdAt: t.createdAt ?? t.startedAt,
  };
}

function normalizeGoal(g: Partial<Goal> & { id: string; title: string }): Goal {
  return {
    id: g.id,
    title: g.title,
    category: g.category ?? inferGoalCategory(g.title),
    targetAmount: Number(g.targetAmount) || 0,
    savedAmount: Number(g.savedAmount) || 0,
    deadline: g.deadline ?? "",
    note: g.note ?? "",
  };
}

function normalizeSavings(s: Partial<RunsheetData>): EmergencyFund {
  const existing = s.savings;
  if (existing && Array.isArray(existing.transactions) && existing.transactions.length > 0) {
    return existing;
  }
  const fromAlloc = (s.allocations ?? [])
    .filter((a) => a.purpose === "savings")
    .map((a) => ({
      id: `mig_${a.id}`,
      date: a.date,
      amount: a.amount,
      direction: "in" as const,
      note: a.note || "From a savings allocation",
    }));
  return {
    target: existing?.target ?? 0,
    transactions: fromAlloc,
  };
}

function migratePersisted(raw: unknown, version: number): RunsheetData {
  const s = (raw ?? {}) as Partial<RunsheetData> & { settings?: Partial<Settings> };
  const settings = normalizeSettings(s.settings);
  if (version < 2 && settings.sampleData) {
    return sampleBundle();
  }
  const data: RunsheetData = {
    customers: (s.customers ?? []).map((c) => normalizeCustomer(c)),
    trips: (s.trips ?? []).map((t) => normalizeTrip(t)),
    expenses: s.expenses ?? [],
    incomes: s.incomes ?? [],
    allocations: s.allocations ?? [],
    goals: (s.goals ?? []).map((g) => normalizeGoal(g)),
    contributions: s.contributions ?? [],
    shifts: (s.shifts ?? []).map((sh) => ({ ...sh, notes: sh.notes ?? "" })),
    fund: s.fund ?? emptyEmergencyFund(),
    savings: normalizeSavings(s),
    maintenance: s.maintenance ?? [],
    documents: s.documents ?? [],
    events: s.events ?? [],
    skills: s.skills && s.skills.length ? s.skills : defaultSkills(),
    activities: s.activities ?? [],
    weeklyReviews: s.weeklyReviews ?? [],
    monthlyReviews: s.monthlyReviews ?? [],
    milestones: s.milestones ?? [],
    insights: s.insights ?? [],
    availability: s.availability ?? [],
    handoffs: s.handoffs ?? [],
    conversations: s.conversations ?? [],
    messages: s.messages ?? [],
    settings:
      version < 2 && settings.currency === "ZAR" && settings.sampleData === false
        ? { ...settings, currency: settings.city.toLowerCase().includes("cape") ? settings.currency : settings.currency }
        : settings,
  };
  return data;
}

export const useRunsheet = create<RunsheetState>()(
  persist(
    (set, get) => ({
      ...sample,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      addCustomer: (input) => {
        const id = uid("c");
        const customer: Customer = {
          ...input,
          id,
          status: input.status ?? (input.regular ? "regular" : "occasional"),
          createdAt: new Date().toISOString(),
        };
        set({ customers: [customer, ...get().customers] });
        return id;
      },
      updateCustomer: (id, patch) =>
        set({
          customers: get().customers.map((c) => {
            if (c.id !== id) return c;
            const next = { ...c, ...patch };
            if (patch.regular != null && patch.status == null) {
              next.status = patch.regular ? "regular" : "occasional";
            }
            if (patch.status === "regular") next.regular = true;
            if (patch.status === "inactive" || patch.status === "occasional") next.regular = false;
            if (patch.status === "vip") next.regular = true;
            return next;
          }),
        }),
      deleteCustomer: (id) =>
        set({
          customers: get().customers.filter((c) => c.id !== id),
          trips: get().trips.map((t) => (t.customerId === id ? { ...t, customerId: null } : t)),
        }),
      addTrip: (input) => {
        const id = uid("t");
        const trip: Trip = { ...input, id, createdAt: new Date().toISOString() };
        set({ trips: [trip, ...get().trips] });
        return id;
      },
      updateTrip: (id, patch) =>
        set({
          trips: get().trips.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }),
      deleteTrip: (id) => set({ trips: get().trips.filter((t) => t.id !== id) }),
      addExpense: (input) => {
        const id = uid("e");
        set({ expenses: [{ ...input, id }, ...get().expenses] });
        return id;
      },
      updateExpense: (id, patch) =>
        set({
          expenses: get().expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),
      deleteExpense: (id) => set({ expenses: get().expenses.filter((e) => e.id !== id) }),
      addIncome: (input) => {
        const id = uid("i");
        set({ incomes: [{ ...input, id }, ...get().incomes] });
        return id;
      },
      updateIncome: (id, patch) =>
        set({
          incomes: get().incomes.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        }),
      deleteIncome: (id) => set({ incomes: get().incomes.filter((i) => i.id !== id) }),
      addAllocation: (input) => {
        const id = uid("a");
        const allocation: Allocation = { ...input, id };
        set({ allocations: [allocation, ...get().allocations] });
        if (input.purpose === "goals" && input.goalId && input.amount > 0) {
          const goal = get().goals.find((g) => g.id === input.goalId);
          if (goal) {
            const cid = uid("gc");
            set({
              contributions: [
                {
                  id: cid,
                  goalId: input.goalId,
                  date: input.date,
                  amount: input.amount,
                  note: input.note,
                },
                ...get().contributions,
              ],
              goals: get().goals.map((g) =>
                g.id === input.goalId ? { ...g, savedAmount: g.savedAmount + input.amount } : g,
              ),
            });
          }
        }
        if (input.purpose === "savings" && input.amount > 0) {
          get().addSavingsTx({
            date: input.date,
            amount: input.amount,
            direction: "in",
            note: input.note,
          });
        }
        return id;
      },
      deleteAllocation: (id) =>
        set({ allocations: get().allocations.filter((a) => a.id !== id) }),
      addGoal: (input) => {
        const id = uid("g");
        set({ goals: [{ ...input, id }, ...get().goals] });
        return id;
      },
      updateGoal: (id, patch) =>
        set({
          goals: get().goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        }),
      deleteGoal: (id) =>
        set({
          goals: get().goals.filter((g) => g.id !== id),
          contributions: get().contributions.filter((c) => c.goalId !== id),
          allocations: get().allocations.map((a) =>
            a.goalId === id ? { ...a, goalId: null } : a,
          ),
        }),
      contributeToGoal: (goalId, amount, note = "", date) => {
        const goal = get().goals.find((g) => g.id === goalId);
        if (!goal || !Number.isFinite(amount) || amount <= 0) return null;
        const id = uid("gc");
        const contribution: GoalContribution = {
          id,
          goalId,
          date: date ?? new Date().toISOString().slice(0, 10),
          amount,
          note,
        };
        set({
          contributions: [contribution, ...get().contributions],
          goals: get().goals.map((g) =>
            g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g,
          ),
        });
        return id;
      },
      startShift: () => {
        const open = get().shifts.find((s) => !s.endedAt);
        if (open) return;
        set({
          shifts: [
            { id: uid("s"), startedAt: new Date().toISOString(), endedAt: null, notes: "" },
            ...get().shifts,
          ],
        });
      },
      endShift: () =>
        set({
          shifts: get().shifts.map((s) =>
            s.endedAt ? s : { ...s, endedAt: new Date().toISOString() },
          ),
        }),
      updateShift: (id, patch) =>
        set({
          shifts: get().shifts.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }),
      deleteShift: (id) => set({ shifts: get().shifts.filter((s) => s.id !== id) }),
      setFundTarget: (target) => set({ fund: { ...get().fund, target: Math.max(0, target) } }),
      addFundTx: (input) => {
        const id = uid("f");
        set({
          fund: {
            ...get().fund,
            transactions: [{ ...input, id }, ...get().fund.transactions],
          },
        });
        return id;
      },
      deleteFundTx: (id) =>
        set({
          fund: {
            ...get().fund,
            transactions: get().fund.transactions.filter((t) => t.id !== id),
          },
        }),
      setSavingsTarget: (target) =>
        set({ savings: { ...get().savings, target: Math.max(0, target) } }),
      addSavingsTx: (input) => {
        const id = uid("sv");
        set({
          savings: {
            ...get().savings,
            transactions: [{ ...input, id }, ...get().savings.transactions],
          },
        });
        return id;
      },
      deleteSavingsTx: (id) =>
        set({
          savings: {
            ...get().savings,
            transactions: get().savings.transactions.filter((t) => t.id !== id),
          },
        }),
      addMaintenance: (input) => {
        const id = uid("m");
        set({ maintenance: [{ ...input, id }, ...get().maintenance] });
        if (input.cost > 0) {
          get().addExpense({
            date: input.date,
            category: input.kind === "tyres" ? "tyres" : "maintenance",
            amount: input.cost,
            note: input.description || `Maintenance — ${input.kind}`,
            odometerKm: input.mileage,
          });
        }
        if (input.mileage != null) {
          get().updateSettings({ currentMileage: Math.max(get().settings.currentMileage, input.mileage) });
        }
        return id;
      },
      updateMaintenance: (id, patch) =>
        set({
          maintenance: get().maintenance.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        }),
      deleteMaintenance: (id) =>
        set({ maintenance: get().maintenance.filter((m) => m.id !== id) }),
      addDocument: (input) => {
        const id = uid("d");
        set({ documents: [{ ...input, id }, ...get().documents] });
        return id;
      },
      updateDocument: (id, patch) =>
        set({
          documents: get().documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        }),
      deleteDocument: (id) => set({ documents: get().documents.filter((d) => d.id !== id) }),
      addEvent: (input) => {
        const id = uid("ev");
        set({ events: [{ ...input, id }, ...get().events] });
        return id;
      },
      updateEvent: (id, patch) =>
        set({
          events: get().events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),
      deleteEvent: (id) => set({ events: get().events.filter((e) => e.id !== id) }),
      upsertSkill: (skill) =>
        set({
          skills: get().skills.some((s) => s.id === skill.id)
            ? get().skills.map((s) => (s.id === skill.id ? skill : s))
            : [skill, ...get().skills],
        }),
      addActivity: (input) => {
        const id = uid("act");
        set({ activities: [{ ...input, id }, ...get().activities] });
        return id;
      },
      deleteActivity: (id) =>
        set({ activities: get().activities.filter((a) => a.id !== id) }),
      saveWeeklyReview: (input) => {
        const existing = get().weeklyReviews.find((r) => r.weekStart === input.weekStart);
        if (existing) {
          set({
            weeklyReviews: get().weeklyReviews.map((r) =>
              r.id === existing.id ? { ...r, ...input } : r,
            ),
          });
          return existing.id;
        }
        const id = uid("wr");
        set({
          weeklyReviews: [
            { ...input, id, createdAt: new Date().toISOString() },
            ...get().weeklyReviews,
          ],
        });
        return id;
      },
      saveMonthlyReview: (input) => {
        const existing = get().monthlyReviews.find((r) => r.monthKey === input.monthKey);
        if (existing) {
          set({
            monthlyReviews: get().monthlyReviews.map((r) =>
              r.id === existing.id ? { ...r, ...input } : r,
            ),
          });
          return existing.id;
        }
        const id = uid("mr");
        set({
          monthlyReviews: [
            { ...input, id, createdAt: new Date().toISOString() },
            ...get().monthlyReviews,
          ],
        });
        return id;
      },
      loadSample: () => set({ ...sampleBundle() }),
      startFresh: () => set({ ...emptyData() }),
      completeOnboarding: (patch) =>
        set({
          settings: {
            ...get().settings,
            ...patch,
            onboarded: true,
            sampleData: false,
          },
        }),
    }),
    {
      name: "runsheet.v1",
      version: 4,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      migrate: (persisted, version) => migratePersisted(persisted, version),
      partialize: (state) => ({
        customers: state.customers,
        trips: state.trips,
        expenses: state.expenses,
        incomes: state.incomes,
        allocations: state.allocations,
        goals: state.goals,
        contributions: state.contributions,
        shifts: state.shifts,
        fund: state.fund,
        savings: state.savings,
        maintenance: state.maintenance,
        documents: state.documents,
        events: state.events,
        skills: state.skills,
        activities: state.activities,
        weeklyReviews: state.weeklyReviews,
        monthlyReviews: state.monthlyReviews,
        milestones: state.milestones,
        insights: state.insights,
        availability: state.availability,
        handoffs: state.handoffs,
        conversations: state.conversations,
        messages: state.messages,
        settings: state.settings,
      }),
    },
  ),
);
