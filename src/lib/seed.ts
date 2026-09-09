import type {
  Allocation,
  CalendarEvent,
  Customer,
  DevelopmentActivity,
  DriverDocument,
  EmergencyFund,
  Expense,
  Goal,
  GoalContribution,
  Income,
  MaintenanceRecord,
  Settings,
  Shift,
  Skill,
  Trip,
  WeeklyReview,
} from "./types";
import { DEFAULT_PRIORITIES, DEFAULT_REMINDERS, EMPTY_BUDGET, SKILL_AREAS } from "./types";

function at(daysAgo: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function dateOnly(daysAgo: number): string {
  return at(daysAgo, 9, 0).slice(0, 10);
}

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

function ended(startIso: string, minutes: number): string {
  return new Date(new Date(startIso).getTime() + minutes * 60_000).toISOString();
}

export function emptySettings(): Settings {
  return {
    driverName: "",
    vehicleMake: "",
    vehicleModel: "",
    plate: "",
    year: "",
    currency: "RWF",
    weeklyTarget: 0,
    city: "",
    sampleData: false,
    onboarded: false,
    drivingSituation: "own",
    workSources: [],
    fuelType: "petrol",
    currentMileage: 0,
    purchaseValue: null,
    nextLevel: null,
    budget: { ...EMPTY_BUDGET },
    priorities: { ...DEFAULT_PRIORITIES },
    reminders: { ...DEFAULT_REMINDERS },
  };
}

export function emptyEmergencyFund(): EmergencyFund {
  return { target: 0, transactions: [] };
}

export function defaultSkills(now = new Date()): Skill[] {
  const updatedAt = now.toISOString();
  return SKILL_AREAS.map((area) => ({
    id: `sk_${area}`,
    area,
    status: "improve" as const,
    notes: "",
    updatedAt,
  }));
}

export const seedSettings: Settings = {
  driverName: "Jean-Bosco Habimana",
  vehicleMake: "Toyota",
  vehicleModel: "Succeed",
  plate: "RAD 452 B",
  year: "2016",
  currency: "RWF",
  weeklyTarget: 180000,
  city: "Kigali",
  sampleData: true,
  onboarded: true,
  drivingSituation: "own",
  workSources: ["cash", "yego", "bolt", "uber"],
  fuelType: "petrol",
  currentMileage: 186420,
  purchaseValue: 6500000,
  nextLevel: {
    target: "Own a newer vehicle and work as an independent operator",
    why: "A reliable car means fewer repair days, better ratings, and more of the fare staying with me and my family.",
    moneyRequired: 4500000,
    skillsNeeded: "Vehicle knowledge, financial literacy, business skills",
    actions: "Record every fare. Put Friday cash toward the vehicle goal. Complete oil service on time. Learn basic bookkeeping.",
    deadline: futureDate(240),
    progressPct: 28,
  },
  budget: {
    operate: 200000,
    provide: 150000,
    enjoy: 20000,
    build: 80000,
  },
  priorities: { ...DEFAULT_PRIORITIES },
  reminders: { ...DEFAULT_REMINDERS },
};

export const seedCustomers: Customer[] = [
  {
    id: "c_aline",
    name: "Aline Uwase",
    phone: "078 441 2290",
    notes: "School run, Remera to Kimironko. Prefers a quiet car. Settles cash on Fridays.",
    regular: true,
    status: "regular",
    createdAt: at(40, 8),
  },
  {
    id: "c_eric",
    name: "Eric Mugisha",
    phone: "072 555 0188",
    notes: "Corporate airport runs from Nyarutarama. Invoices via operator at month-end.",
    regular: true,
    status: "vip",
    createdAt: at(60, 9),
  },
  {
    id: "c_diane",
    name: "Diane Ingabire",
    phone: "073 220 8841",
    notes: "Lives in Kacyiru. Often books late evening after shifts at King Faisal Hospital.",
    regular: true,
    status: "regular",
    createdAt: at(25, 18),
  },
  {
    id: "c_patrick",
    name: "Patrick Nkurunziza",
    phone: "078 119 3302",
    notes: "Weekend Nyabugogo market run with parcels.",
    regular: false,
    status: "occasional",
    createdAt: at(12, 10),
  },
  {
    id: "c_claire",
    name: "Claire Mukamana",
    phone: "078 990 1144",
    notes: "Weekly grocery run, Nyamirambo. Tips in cash, never on the app.",
    regular: true,
    status: "regular",
    createdAt: at(30, 11),
  },
  {
    id: "c_hotel",
    name: "Kigali Heights desk",
    phone: "078 663 2209",
    notes: "Hotel transfers — Kigali Convention Centre and airport.",
    regular: true,
    status: "vip",
    createdAt: at(50, 7),
  },
  {
    id: "c_samuel",
    name: "Samuel Iradukunda",
    phone: "078 441 0091",
    notes: "Student. Kicukiro to campus. Always on time himself.",
    regular: false,
    status: "occasional",
    createdAt: at(6, 7),
  },
  {
    id: "c_grace",
    name: "Grace Nyirahabimana",
    phone: "072 447 1022",
    notes: "",
    regular: false,
    status: "occasional",
    createdAt: at(8, 14),
  },
];

function trip(partial: {
  id: string;
  daysAgo: number;
  hour: number;
  minute?: number;
  customerId: string | null;
  pickup: string;
  dropoff: string;
  fare: number;
  tip?: number;
  platform: Trip["platform"];
  paymentType?: Trip["paymentType"];
  distanceKm: number;
  durationMin: number;
  rating?: number | null;
  appreciation?: string;
  notes?: string;
}): Trip {
  const startedAt = at(partial.daysAgo, partial.hour, partial.minute ?? 0);
  const paymentType =
    partial.paymentType ??
    (partial.platform === "cash" ? "cash" : partial.platform === "operator" ? "momo" : "platform");
  return {
    id: partial.id,
    startedAt,
    endedAt: ended(startedAt, partial.durationMin),
    customerId: partial.customerId,
    pickup: partial.pickup,
    dropoff: partial.dropoff,
    fare: partial.fare,
    tip: partial.tip ?? 0,
    platform: partial.platform,
    paymentType,
    distanceKm: partial.distanceKm,
    durationMin: partial.durationMin,
    rating: partial.rating ?? null,
    appreciation: partial.appreciation ?? "",
    notes: partial.notes ?? "",
    createdAt: startedAt,
  };
}

export const seedTrips: Trip[] = [
  trip({
    id: "t01",
    daysAgo: 0,
    hour: 6,
    minute: 20,
    customerId: "c_aline",
    pickup: "Remera",
    dropoff: "Kimironko",
    fare: 3500,
    tip: 500,
    platform: "cash",
    distanceKm: 4.2,
    durationMin: 14,
    rating: 5,
    appreciation: "Jean-Bosco is never late. The children feel safe with him.",
    notes: "Morning school run",
  }),
  trip({
    id: "t02",
    daysAgo: 0,
    hour: 7,
    minute: 10,
    customerId: "c_eric",
    pickup: "Nyarutarama",
    dropoff: "Kanombe Airport",
    fare: 18000,
    tip: 2000,
    platform: "operator",
    paymentType: "momo",
    distanceKm: 18.4,
    durationMin: 32,
    rating: 5,
    appreciation: "Quiet, professional, bags handled without asking.",
    notes: "Flight 08:40 — left 90 min early as requested",
  }),
  trip({
    id: "t03",
    daysAgo: 0,
    hour: 9,
    minute: 40,
    customerId: null,
    pickup: "Airport arrivals",
    dropoff: "Gisozi",
    fare: 16000,
    platform: "bolt",
    distanceKm: 16.1,
    durationMin: 35,
    rating: 4,
  }),
  trip({
    id: "t04",
    daysAgo: 0,
    hour: 12,
    minute: 5,
    customerId: "c_claire",
    pickup: "Nyamirambo",
    dropoff: "Kigali Heights",
    fare: 6000,
    tip: 1000,
    platform: "cash",
    distanceKm: 8.6,
    durationMin: 22,
    rating: 5,
    appreciation: "Waited while I packed the boot. True gentleman.",
  }),
  trip({
    id: "t05",
    daysAgo: 0,
    hour: 15,
    minute: 30,
    customerId: "c_samuel",
    pickup: "Kicukiro",
    dropoff: "University of Rwanda",
    fare: 4000,
    platform: "uber",
    distanceKm: 6.8,
    durationMin: 16,
    rating: 5,
    appreciation: "Music volume just right. Will request again.",
  }),
  trip({
    id: "t06",
    daysAgo: 1,
    hour: 5,
    minute: 50,
    customerId: "c_diane",
    pickup: "Kacyiru",
    dropoff: "King Faisal Hospital",
    fare: 3500,
    tip: 500,
    platform: "yego",
    distanceKm: 4.4,
    durationMin: 12,
    rating: 5,
    appreciation: "I start at 06:00. He is always downstairs at 05:50.",
    notes: "Night-to-morning handover shift",
  }),
  trip({
    id: "t07",
    daysAgo: 1,
    hour: 8,
    minute: 15,
    customerId: "c_hotel",
    pickup: "Kigali Convention Centre",
    dropoff: "Muhanga",
    fare: 28000,
    tip: 3000,
    platform: "operator",
    paymentType: "momo",
    distanceKm: 48,
    durationMin: 55,
    rating: 5,
    appreciation: "Hotel guests asked for his number. Gold standard.",
    notes: "Two couples, luggage for a weekend stay",
  }),
  trip({
    id: "t08",
    daysAgo: 1,
    hour: 14,
    minute: 40,
    customerId: null,
    pickup: "Muhanga",
    dropoff: "Nyabugogo",
    fare: 22000,
    platform: "indrive",
    distanceKm: 46,
    durationMin: 58,
    rating: 4,
    appreciation: "Fair price, no talking. Perfect.",
    notes: "Empty return, accepted inDrive to cover fuel",
  }),
  trip({
    id: "t09",
    daysAgo: 1,
    hour: 18,
    minute: 10,
    customerId: "c_grace",
    pickup: "Gikondo",
    dropoff: "Kimihurura",
    fare: 5000,
    platform: "uber",
    distanceKm: 7.2,
    durationMin: 18,
    rating: 3,
    appreciation: "Car was fine. Took a long way.",
    notes: "Traffic on KN3 — next time use KN5 earlier",
  }),
  trip({
    id: "t10",
    daysAgo: 2,
    hour: 6,
    minute: 20,
    customerId: "c_aline",
    pickup: "Remera",
    dropoff: "Kimironko",
    fare: 3500,
    platform: "cash",
    distanceKm: 4.2,
    durationMin: 13,
    rating: 5,
    notes: "School run",
  }),
  trip({
    id: "t11",
    daysAgo: 2,
    hour: 10,
    customerId: "c_patrick",
    pickup: "Nyabugogo",
    dropoff: "Kimisagara market",
    fare: 4500,
    tip: 500,
    platform: "cash",
    distanceKm: 5.5,
    durationMin: 18,
    rating: 5,
    appreciation: "Helped with the crates. My usual driver was away.",
    notes: "Parcels in the boot — keep a tarp",
  }),
  trip({
    id: "t12",
    daysAgo: 2,
    hour: 13,
    minute: 25,
    customerId: null,
    pickup: "Kigali Heights",
    dropoff: "Nyanza",
    fare: 7000,
    platform: "bolt",
    distanceKm: 11.8,
    durationMin: 28,
    rating: 4,
  }),
  trip({
    id: "t13",
    daysAgo: 2,
    hour: 19,
    minute: 45,
    customerId: "c_diane",
    pickup: "King Faisal Hospital",
    dropoff: "Kacyiru",
    fare: 3500,
    tip: 1000,
    platform: "yego",
    distanceKm: 4.6,
    durationMin: 14,
    rating: 5,
    appreciation: "Long day. He didn't fill the silence. Thank you.",
    notes: "Evening hospital pickup",
  }),
  trip({
    id: "t14",
    daysAgo: 3,
    hour: 7,
    minute: 5,
    customerId: "c_eric",
    pickup: "Kanombe Airport",
    dropoff: "Nyarutarama",
    fare: 17000,
    tip: 2000,
    platform: "operator",
    paymentType: "momo",
    distanceKm: 17.9,
    durationMin: 30,
    rating: 5,
    appreciation: "On the board before the bags. That's why we book him.",
    notes: "Arrival from Nairobi",
  }),
  trip({
    id: "t15",
    daysAgo: 3,
    hour: 11,
    minute: 30,
    customerId: null,
    pickup: "Kimihurura",
    dropoff: "Kanombe",
    fare: 8000,
    platform: "uber",
    distanceKm: 12.4,
    durationMin: 26,
    rating: 5,
    appreciation: "Safe driver. Dropped at the gate, not the corner.",
  }),
  trip({
    id: "t16",
    daysAgo: 3,
    hour: 16,
    minute: 50,
    customerId: "c_claire",
    pickup: "Nyamirambo",
    dropoff: "Nyabugogo",
    fare: 4000,
    tip: 500,
    platform: "cash",
    distanceKm: 5.1,
    durationMin: 16,
    rating: 5,
    appreciation: "Always checks I got inside before he leaves.",
  }),
  trip({
    id: "t17",
    daysAgo: 4,
    hour: 6,
    minute: 20,
    customerId: "c_aline",
    pickup: "Remera",
    dropoff: "Kimironko",
    fare: 3500,
    platform: "cash",
    distanceKm: 4.2,
    durationMin: 15,
    rating: 5,
    notes: "School run — rain, left 5 min early",
  }),
  trip({
    id: "t18",
    daysAgo: 4,
    hour: 9,
    minute: 15,
    customerId: "c_hotel",
    pickup: "Marriott Kigali",
    dropoff: "Musanze",
    fare: 45000,
    tip: 5000,
    platform: "operator",
    paymentType: "momo",
    distanceKm: 88,
    durationMin: 110,
    rating: 5,
    appreciation: "Guests said the drive was the highlight. Request Jean-Bosco next visit.",
    notes: "Return empty — did not take a cheap inDrive back",
  }),
  trip({
    id: "t19",
    daysAgo: 5,
    hour: 8,
    customerId: "c_samuel",
    pickup: "Kicukiro",
    dropoff: "Nyabugogo",
    fare: 5500,
    platform: "uber",
    distanceKm: 9.2,
    durationMin: 24,
    rating: 4,
    notes: "Bus connection",
  }),
  trip({
    id: "t20",
    daysAgo: 5,
    hour: 12,
    minute: 40,
    customerId: null,
    pickup: "Remera",
    dropoff: "Kigali Heights",
    fare: 4500,
    platform: "bolt",
    distanceKm: 6.4,
    durationMin: 18,
    rating: 5,
    appreciation: "Clean car. Smells like citrus, not chemicals.",
  }),
  trip({
    id: "t21",
    daysAgo: 5,
    hour: 20,
    minute: 15,
    customerId: "c_diane",
    pickup: "Kacyiru",
    dropoff: "King Faisal Hospital",
    fare: 3500,
    tip: 500,
    platform: "yego",
    distanceKm: 4.5,
    durationMin: 13,
    rating: 5,
    appreciation: "Night shift again. Same calm driver.",
  }),
  trip({
    id: "t22",
    daysAgo: 6,
    hour: 7,
    minute: 30,
    customerId: "c_eric",
    pickup: "Nyarutarama",
    dropoff: "Kigali Convention Centre",
    fare: 6000,
    tip: 1000,
    platform: "operator",
    paymentType: "momo",
    distanceKm: 7.2,
    durationMin: 16,
    rating: 5,
    notes: "Breakfast meeting",
  }),
  trip({
    id: "t23",
    daysAgo: 6,
    hour: 11,
    minute: 10,
    customerId: null,
    pickup: "Kimironko",
    dropoff: "Gisozi",
    fare: 4000,
    platform: "bolt",
    distanceKm: 5.7,
    durationMin: 15,
    rating: 4,
  }),
  trip({
    id: "t24",
    daysAgo: 8,
    hour: 6,
    minute: 20,
    customerId: "c_aline",
    pickup: "Remera",
    dropoff: "Kimironko",
    fare: 3500,
    tip: 500,
    platform: "cash",
    distanceKm: 4.2,
    durationMin: 14,
    rating: 5,
    appreciation: "Paid the week. See you Monday.",
    notes: "Friday cash settlement for the week",
  }),
  trip({
    id: "t25",
    daysAgo: 8,
    hour: 15,
    customerId: "c_patrick",
    pickup: "Nyabugogo",
    dropoff: "Kanombe",
    fare: 8000,
    platform: "cash",
    distanceKm: 14.2,
    durationMin: 28,
    rating: 5,
  }),
  trip({
    id: "t26",
    daysAgo: 9,
    hour: 9,
    minute: 45,
    customerId: "c_hotel",
    pickup: "Kigali Heights",
    dropoff: "Kanombe Airport",
    fare: 14000,
    tip: 2000,
    platform: "operator",
    paymentType: "momo",
    distanceKm: 14.5,
    durationMin: 28,
    rating: 5,
    appreciation: "Flight made with 40 minutes to spare.",
  }),
  trip({
    id: "t27",
    daysAgo: 10,
    hour: 18,
    minute: 20,
    customerId: null,
    pickup: "Remera",
    dropoff: "Nyanza",
    fare: 7500,
    platform: "uber",
    distanceKm: 12.1,
    durationMin: 26,
    rating: 4,
    notes: "Dinner booking",
  }),
];

export const seedExpenses: Expense[] = [
  { id: "e01", date: dateOnly(0), category: "fuel", amount: 72000, note: "Kobil Remera — tank to full", odometerKm: 186420 },
  { id: "e02", date: dateOnly(0), category: "food", amount: 4500, note: "Lunch near Nyabugogo", odometerKm: null },
  { id: "e03", date: dateOnly(1), category: "parking", amount: 2000, note: "Airport short stay while waiting", odometerKm: null },
  { id: "e04", date: dateOnly(2), category: "data", amount: 5000, note: "MTN 8GB — Yego / Bolt / Uber week", odometerKm: null },
  { id: "e05", date: dateOnly(3), category: "wash", amount: 3000, note: "Hand wash + interior wipe, Remera", odometerKm: 185910 },
  { id: "e06", date: dateOnly(4), category: "food", amount: 6000, note: "Family market run contribution", odometerKm: null },
  { id: "e07", date: dateOnly(5), category: "fuel", amount: 58000, note: "SP Kimironko", odometerKm: 185640 },
  { id: "e08", date: dateOnly(8), category: "maintenance", amount: 28000, note: "Oil + filter, Gikondo garage", odometerKm: 185200 },
  { id: "e09", date: dateOnly(9), category: "tyres", amount: 8000, note: "Puncture repair, rear left", odometerKm: 185040 },
  { id: "e10", date: dateOnly(12), category: "fuel", amount: 70000, note: "Full tank after Musanze job", odometerKm: 184800 },
  { id: "e11", date: dateOnly(14), category: "license", amount: 5000, note: "Permit photocopy + stamp", odometerKm: null },
  { id: "e12", date: dateOnly(6), category: "rent", amount: 80000, note: "Room contribution this month", odometerKm: null },
  { id: "e13", date: dateOnly(6), category: "school", amount: 25000, note: "Part payment — first term", odometerKm: null },
  { id: "e14", date: dateOnly(7), category: "personal", amount: 4000, note: "Airtime for family calls", odometerKm: null },
];

export const seedIncomes: Income[] = [
  { id: "i01", date: dateOnly(4), amount: 15000, source: "private", note: "Wedding transfer, extra cash job" },
  { id: "i02", date: dateOnly(11), amount: 8000, source: "bonus", note: "Hotel desk extra for waiting time" },
];

export const seedGoals: Goal[] = [
  {
    id: "g01",
    title: "Emergency fund",
    category: "financial",
    targetAmount: 500000,
    savedAmount: 285000,
    deadline: "",
    note: "Three months of fuel, data, and rent if the car sits. This is a buffer, not a guarantee.",
  },
  {
    id: "g02",
    title: "School support",
    category: "family",
    targetAmount: 300000,
    savedAmount: 180000,
    deadline: futureDate(70),
    note: "First-term fees. Friday cash tips go here first.",
  },
  {
    id: "g03",
    title: "Home improvement",
    category: "family",
    targetAmount: 1000000,
    savedAmount: 420000,
    deadline: futureDate(200),
    note: "Roof sheets and a proper door. Slow is still progress.",
  },
  {
    id: "g04",
    title: "Tyre set",
    category: "vehicle",
    targetAmount: 280000,
    savedAmount: 90000,
    deadline: futureDate(40),
    note: "Front pair is on the wear bars. Do not wait for a blowout.",
  },
  {
    id: "g05",
    title: "Professional driving certificate",
    category: "career",
    targetAmount: 120000,
    savedAmount: 45000,
    deadline: futureDate(120),
    note: "Training fees. Skills live in Growth — this is the money side.",
  },
];

export const seedContributions: GoalContribution[] = [
  { id: "gc01", goalId: "g01", date: dateOnly(1), amount: 15000, note: "After the Musanze job" },
  { id: "gc02", goalId: "g02", date: dateOnly(2), amount: 10000, note: "Friday cash" },
  { id: "gc03", goalId: "g04", date: dateOnly(5), amount: 8000, note: "Set aside from tips" },
];

export const seedAllocations: Allocation[] = [
  { id: "a02", date: dateOnly(2), amount: 10000, purpose: "family", goalId: "g02", note: "School support" },
  { id: "a03", date: dateOnly(5), amount: 8000, purpose: "goals", goalId: "g04", note: "Tyres" },
  { id: "a04", date: dateOnly(0), amount: 5000, purpose: "personal", goalId: null, note: "Small personal float" },
];

export const seedFund: EmergencyFund = {
  target: 500000,
  transactions: [
    { id: "f01", date: dateOnly(40), amount: 200000, direction: "in", note: "Opening balance from previous months" },
    { id: "f02", date: dateOnly(20), amount: 50000, direction: "out", note: "Battery replacement — car would not start" },
    { id: "f03", date: dateOnly(8), amount: 120000, direction: "in", note: "Good week after Musanze" },
    { id: "f04", date: dateOnly(1), amount: 15000, direction: "in", note: "Weekly set-aside" },
  ],
};

export const seedSavings: EmergencyFund = {
  target: 1000000,
  transactions: [
    { id: "sv01", date: dateOnly(28), amount: 180000, direction: "in", note: "Brought forward from previous months" },
    { id: "sv02", date: dateOnly(3), amount: 20000, direction: "in", note: "Friday set-aside" },
  ],
};

export const seedActivities: DevelopmentActivity[] = [
  {
    id: "act01",
    date: dateOnly(2),
    area: "financial_literacy",
    title: "Recorded every fare for a full week",
    notes: "The book is becoming a habit, not a chore.",
  },
  {
    id: "act02",
    date: dateOnly(6),
    area: "defensive_driving",
    title: "Read one chapter on night driving",
    notes: "",
  },
];

export const seedShifts: Shift[] = [
  { id: "s_open", startedAt: at(0, 5, 45), endedAt: null, notes: "" },
  { id: "s_y", startedAt: at(1, 5, 30), endedAt: at(1, 20, 10), notes: "Long day including Muhanga" },
  { id: "s_2", startedAt: at(2, 6, 0), endedAt: at(2, 20, 30), notes: "" },
  { id: "s_3", startedAt: at(3, 6, 10), endedAt: at(3, 18, 40), notes: "" },
  { id: "s_4", startedAt: at(4, 5, 50), endedAt: at(4, 19, 0), notes: "Musanze return" },
  { id: "s_5", startedAt: at(5, 6, 20), endedAt: at(5, 21, 0), notes: "" },
];

export const seedMaintenance: MaintenanceRecord[] = [
  {
    id: "m01",
    date: dateOnly(8),
    kind: "oil",
    mileage: 185200,
    cost: 28000,
    description: "Oil and filter change, Gikondo garage",
    nextDueDate: futureDate(80),
    nextDueMileage: 195200,
    notes: "Use 10W-30 next time",
  },
  {
    id: "m02",
    date: dateOnly(9),
    kind: "tyres",
    mileage: 185040,
    cost: 8000,
    description: "Puncture repair, rear left",
    nextDueDate: futureDate(30),
    nextDueMileage: null,
    notes: "Front pair still thin — watch the tyre goal",
  },
];

export const seedDocuments: DriverDocument[] = [
  {
    id: "d01",
    name: "Driving licence",
    kind: "licence",
    issueDate: dateOnly(400),
    expiryDate: futureDate(37),
    notes: "Category B",
  },
  {
    id: "d02",
    name: "Vehicle insurance",
    kind: "insurance",
    issueDate: dateOnly(80),
    expiryDate: futureDate(110),
    notes: "Third party, SONARWA",
  },
  {
    id: "d03",
    name: "Technical inspection",
    kind: "inspection",
    issueDate: dateOnly(200),
    expiryDate: futureDate(55),
    notes: "",
  },
  {
    id: "d04",
    name: "Registration",
    kind: "registration",
    issueDate: dateOnly(900),
    expiryDate: futureDate(200),
    notes: "RAD 452 B",
  },
];

export const seedEvents: CalendarEvent[] = [
  {
    id: "ev01",
    date: futureDate(1),
    title: "Rest morning — church with family",
    category: "personal",
    notes: "",
  },
  {
    id: "ev02",
    date: futureDate(3),
    title: "Set aside school money",
    category: "money",
    notes: "RWF 10,000 if the week is decent",
  },
  {
    id: "ev03",
    date: futureDate(6),
    title: "Defensive driving reading",
    category: "development",
    notes: "One hour after the last trip",
  },
];

export const seedSkills: Skill[] = defaultSkills().map((s) => {
  if (s.area === "customer_service") return { ...s, status: "completed", notes: "Regulars keep requesting the same car." };
  if (s.area === "professional_conduct") return { ...s, status: "completed", notes: "Hotel desk asked for the number twice." };
  if (s.area === "navigation") return { ...s, status: "learning", notes: "Still learning the quieter KN routes at peak." };
  if (s.area === "financial_literacy") return { ...s, status: "learning", notes: "Started recording every fare this month." };
  if (s.area === "vehicle_knowledge") return { ...s, status: "learning", notes: "Oil interval is now in the book." };
  if (s.area === "defensive_driving") return { ...s, status: "learning", notes: "" };
  return s;
});

export const seedWeeklyReviews: WeeklyReview[] = [];

export function sampleBundle() {
  return {
    customers: seedCustomers,
    trips: seedTrips,
    expenses: seedExpenses,
    incomes: seedIncomes,
    allocations: seedAllocations,
    goals: seedGoals,
    contributions: seedContributions,
    shifts: seedShifts,
    fund: seedFund,
    savings: seedSavings,
    maintenance: seedMaintenance,
    documents: seedDocuments,
    events: seedEvents,
    skills: seedSkills,
    activities: seedActivities,
    weeklyReviews: seedWeeklyReviews,
    monthlyReviews: [] as { id: string; monthKey: string; whatWentWell: string; whatNeedsAttention: string; priorities: [string, string, string]; createdAt: string }[],
    settings: seedSettings,
  };
}
