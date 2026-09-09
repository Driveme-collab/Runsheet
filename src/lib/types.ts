export const PLATFORMS = [
  "cash",
  "bolt",
  "uber",
  "yego",
  "indrive",
  "operator",
  "other",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABEL: Record<Platform, string> = {
  cash: "Cash / private",
  bolt: "Bolt",
  uber: "Uber",
  yego: "Yego",
  indrive: "inDrive",
  operator: "Operator",
  other: "Other",
};

export const PAYMENT_TYPES = ["cash", "momo", "card", "platform"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_LABEL: Record<PaymentType, string> = {
  cash: "Cash",
  momo: "Mobile money",
  card: "Card",
  platform: "Platform wallet",
};

export const MONEY_LANES = ["operate", "provide", "enjoy"] as const;
export type MoneyLane = (typeof MONEY_LANES)[number];

export const MONEY_LANE_LABEL: Record<MoneyLane, string> = {
  operate: "Operate — costs of working",
  provide: "Provide — family and personal duties",
  enjoy: "Enjoy — discretionary spending",
};

export const MONEY_LANE_SHORT: Record<MoneyLane, string> = {
  operate: "Operate",
  provide: "Provide",
  enjoy: "Enjoy",
};

export const EXPENSE_CATEGORIES = [
  "fuel",
  "charging",
  "maintenance",
  "tyres",
  "insurance",
  "parking",
  "tolls",
  "wash",
  "data",
  "license",
  "other",
  "rent",
  "food",
  "school",
  "utilities",
  "family",
  "household",
  "personal",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_LABEL: Record<ExpenseCategory, string> = {
  fuel: "Fuel",
  charging: "Charging",
  maintenance: "Maintenance",
  tyres: "Tyres",
  insurance: "Insurance",
  parking: "Parking",
  tolls: "Tolls",
  wash: "Car wash",
  data: "Data / airtime",
  license: "Licence / permits",
  other: "Other work cost",
  rent: "Rent",
  food: "Food",
  school: "School",
  utilities: "Utilities",
  family: "Family support",
  household: "Household",
  personal: "Personal",
};

export const EXPENSE_LANE: Record<ExpenseCategory, MoneyLane> = {
  fuel: "operate",
  charging: "operate",
  maintenance: "operate",
  tyres: "operate",
  insurance: "operate",
  parking: "operate",
  tolls: "operate",
  wash: "operate",
  data: "operate",
  license: "operate",
  other: "operate",
  rent: "provide",
  food: "provide",
  school: "provide",
  utilities: "provide",
  family: "provide",
  household: "provide",
  personal: "enjoy",
};

export const EXPENSE_CATEGORIES_BY_LANE: Record<MoneyLane, ExpenseCategory[]> = {
  operate: [
    "fuel",
    "charging",
    "maintenance",
    "tyres",
    "insurance",
    "parking",
    "tolls",
    "wash",
    "data",
    "license",
    "other",
  ],
  provide: ["rent", "food", "school", "utilities", "family", "household"],
  enjoy: ["personal"],
};

export const VEHICLE_COST_CATEGORIES: ExpenseCategory[] = [
  "fuel",
  "charging",
  "maintenance",
  "tyres",
  "insurance",
  "parking",
  "tolls",
  "wash",
  "license",
];

export const CURRENCIES = [
  "RWF",
  "KES",
  "UGX",
  "TZS",
  "USD",
  "EUR",
  "GBP",
  "ZAR",
  "BWP",
  "NAD",
  "ZMW",
] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const DRIVING_SITUATIONS = ["own", "employer", "rented", "other"] as const;
export type DrivingSituation = (typeof DRIVING_SITUATIONS)[number];

export const DRIVING_SITUATION_LABEL: Record<DrivingSituation, string> = {
  own: "I drive my own vehicle",
  employer: "I drive an employer vehicle",
  rented: "I drive a rented vehicle",
  other: "Other arrangement",
};

export const FUEL_TYPES = ["petrol", "diesel", "hybrid", "ev", "other"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const FUEL_TYPE_LABEL: Record<FuelType, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  ev: "Electric",
  other: "Other",
};

export const GOAL_CATEGORIES = ["family", "financial", "vehicle", "personal", "career"] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GOAL_CATEGORY_LABEL: Record<GoalCategory, string> = {
  family: "Family",
  financial: "Financial",
  vehicle: "Vehicle",
  personal: "Personal",
  career: "Career",
};

export const ALLOCATION_PURPOSES = ["work", "family", "savings", "goals", "personal"] as const;
export type AllocationPurpose = (typeof ALLOCATION_PURPOSES)[number];

export const ALLOCATION_LABEL: Record<AllocationPurpose, string> = {
  work: "Work / operating reserve",
  family: "Family",
  savings: "Savings",
  goals: "A named goal",
  personal: "Personal",
};

export const DEFAULT_PRIORITIES: Record<AllocationPurpose, number> = {
  work: 15,
  family: 30,
  savings: 20,
  goals: 20,
  personal: 15,
};

export type AllocationPriorities = Record<AllocationPurpose, number>;

export const MONEY_PILLARS = ["earn", "operate", "provide", "build", "enjoy"] as const;
export type MoneyPillar = (typeof MONEY_PILLARS)[number];

export const MONEY_PILLAR_LABEL: Record<MoneyPillar, string> = {
  earn: "Earn",
  operate: "Operate",
  provide: "Provide",
  build: "Build",
  enjoy: "Enjoy",
};

export const MONEY_PILLAR_HINT: Record<MoneyPillar, string> = {
  earn: "Trip fares, tips and other driver income",
  operate: "Costs required to do the work",
  provide: "Family and personal responsibilities",
  build: "Savings, emergency fund and goals",
  enjoy: "Personal discretionary spending",
};

export type MoneyBudget = {
  operate: number;
  provide: number;
  enjoy: number;
  build: number;
};

export const EMPTY_BUDGET: MoneyBudget = {
  operate: 0,
  provide: 0,
  enjoy: 0,
  build: 0,
};

export type Reminders = {
  documents: boolean;
  maintenance: boolean;
  weeklyReview: boolean;
};

export const DEFAULT_REMINDERS: Reminders = {
  documents: true,
  maintenance: true,
  weeklyReview: true,
};

export const INCOME_SOURCES = ["private", "bonus", "other"] as const;
export type IncomeSource = (typeof INCOME_SOURCES)[number];

export const INCOME_SOURCE_LABEL: Record<IncomeSource, string> = {
  private: "Private job",
  bonus: "Bonus / extra",
  other: "Other income",
};

export const CUSTOMER_STATUSES = ["regular", "occasional", "vip", "inactive"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  regular: "Regular",
  occasional: "Occasional",
  vip: "VIP",
  inactive: "Inactive",
};

export const MAINTENANCE_KINDS = [
  "oil",
  "tyres",
  "brakes",
  "battery",
  "filters",
  "suspension",
  "electrical",
  "bodywork",
  "other",
] as const;
export type MaintenanceKind = (typeof MAINTENANCE_KINDS)[number];

export const MAINTENANCE_LABEL: Record<MaintenanceKind, string> = {
  oil: "Oil / service",
  tyres: "Tyres",
  brakes: "Brakes",
  battery: "Battery",
  filters: "Filters",
  suspension: "Suspension",
  electrical: "Electrical",
  bodywork: "Bodywork",
  other: "Other maintenance",
};

export const DOCUMENT_KINDS = ["licence", "insurance", "inspection", "registration", "other"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const DOCUMENT_KIND_LABEL: Record<DocumentKind, string> = {
  licence: "Driving licence",
  insurance: "Vehicle insurance",
  inspection: "Vehicle inspection",
  registration: "Registration",
  other: "Other document",
};

export const CALENDAR_CATEGORIES = ["work", "money", "vehicle", "development", "personal"] as const;
export type CalendarCategory = (typeof CALENDAR_CATEGORIES)[number];

export const CALENDAR_CATEGORY_LABEL: Record<CalendarCategory, string> = {
  work: "Work",
  money: "Money",
  vehicle: "Vehicle",
  development: "Development",
  personal: "Personal",
};

export const SKILL_AREAS = [
  "customer_service",
  "communication",
  "defensive_driving",
  "navigation",
  "vehicle_knowledge",
  "financial_literacy",
  "time_management",
  "professional_conduct",
  "ev_knowledge",
  "leadership",
  "business_skills",
] as const;
export type SkillArea = (typeof SKILL_AREAS)[number];

export const SKILL_AREA_LABEL: Record<SkillArea, string> = {
  customer_service: "Customer service",
  communication: "Communication",
  defensive_driving: "Defensive driving",
  navigation: "Navigation",
  vehicle_knowledge: "Vehicle knowledge",
  financial_literacy: "Financial literacy",
  time_management: "Time management",
  professional_conduct: "Professional conduct",
  ev_knowledge: "EV knowledge",
  leadership: "Leadership",
  business_skills: "Business skills",
};

export const SKILL_STATUSES = ["learning", "completed", "improve"] as const;
export type SkillStatus = (typeof SKILL_STATUSES)[number];

export const SKILL_STATUS_LABEL: Record<SkillStatus, string> = {
  learning: "Learning",
  completed: "Completed",
  improve: "Need improvement",
};

export const FUND_DIRECTIONS = ["in", "out"] as const;
export type FundDirection = (typeof FUND_DIRECTIONS)[number];

export const CAREER_PATHS = [
  "Become a better professional driver",
  "Obtain additional training",
  "Become a certified professional driver",
  "Own my first vehicle",
  "Become an independent operator",
  "Become a supervisor",
  "Build another business",
  "Move into another career",
  "Become a fleet owner",
] as const;

export type Customer = {
  id: string;
  name: string;
  phone: string;
  notes: string;
  regular: boolean;
  status: CustomerStatus;
  createdAt: string;
};

export type Trip = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  customerId: string | null;
  pickup: string;
  dropoff: string;
  fare: number;
  tip: number;
  platform: Platform;
  paymentType: PaymentType;
  distanceKm: number;
  durationMin: number;
  rating: number | null;
  appreciation: string;
  notes: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  note: string;
  odometerKm: number | null;
};

export type Income = {
  id: string;
  date: string;
  amount: number;
  source: IncomeSource;
  note: string;
};

export type Allocation = {
  id: string;
  date: string;
  amount: number;
  purpose: AllocationPurpose;
  goalId: string | null;
  note: string;
};

export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  note: string;
};

export type GoalContribution = {
  id: string;
  goalId: string;
  date: string;
  amount: number;
  note: string;
};

export type Shift = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  notes: string;
};

export type FundTransaction = {
  id: string;
  date: string;
  amount: number;
  direction: FundDirection;
  note: string;
};

export type EmergencyFund = {
  target: number;
  transactions: FundTransaction[];
};

export type SavingsAccount = EmergencyFund;

export type MaintenanceRecord = {
  id: string;
  date: string;
  kind: MaintenanceKind;
  mileage: number | null;
  cost: number;
  description: string;
  nextDueDate: string;
  nextDueMileage: number | null;
  notes: string;
};

export type DriverDocument = {
  id: string;
  name: string;
  kind: DocumentKind;
  issueDate: string;
  expiryDate: string;
  notes: string;
};

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  category: CalendarCategory;
  notes: string;
};

export type Skill = {
  id: string;
  area: SkillArea;
  status: SkillStatus;
  notes: string;
  updatedAt: string;
};

export type DevelopmentActivity = {
  id: string;
  date: string;
  area: SkillArea;
  title: string;
  notes: string;
};

export type NextLevel = {
  target: string;
  why: string;
  moneyRequired: number;
  skillsNeeded: string;
  actions: string;
  deadline: string;
  progressPct: number;
};

export type WeeklyReview = {
  id: string;
  weekStart: string;
  whatWentWell: string;
  whatNeedsAttention: string;
  priorities: [string, string, string];
  createdAt: string;
};

export type MonthlyReview = {
  id: string;
  monthKey: string;
  whatWentWell: string;
  whatNeedsAttention: string;
  priorities: [string, string, string];
  createdAt: string;
};

export type Settings = {
  driverName: string;
  vehicleMake: string;
  vehicleModel: string;
  plate: string;
  year: string;
  currency: CurrencyCode;
  weeklyTarget: number;
  city: string;
  sampleData: boolean;
  onboarded: boolean;
  drivingSituation: DrivingSituation;
  workSources: Platform[];
  fuelType: FuelType;
  currentMileage: number;
  purchaseValue: number | null;
  nextLevel: NextLevel | null;
  budget: MoneyBudget;
  priorities: AllocationPriorities;
  reminders: Reminders;
};

export type PeriodKey = "today" | "week" | "month" | "all";
