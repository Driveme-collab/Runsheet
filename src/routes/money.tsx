import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodTabs } from "@/components/period-tabs";
import { PageHeader, Field, StatCard } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ExpenseDialog } from "@/components/expense-dialog";
import { MoneyPillarsRow } from "@/components/money-pillars";
import {
  AllocationDialog,
  FundDialog,
  IncomeDialog,
  SavingsDialog,
} from "@/components/record-dialogs";
import { useRunsheet } from "@/lib/store";
import { formatHoursDecimal, formatMoney } from "@/lib/money";
import {
  actualBuildShare,
  allocatedOf,
  allocationsIn,
  budgetVsActual,
  byLane,
  emergencyBalance,
  emergencyProgress,
  expensesIn,
  incomesIn,
  intendedBuildShare,
  moneyPillars,
  moneySnapshot,
  monthsOfCover,
} from "@/lib/finance";
import {
  ALLOCATION_LABEL,
  EXPENSE_LABEL,
  EXPENSE_LANE,
  INCOME_SOURCE_LABEL,
  MONEY_LANE_SHORT,
  type MoneyBudget,
  type PeriodKey,
} from "@/lib/types";

const TABS = ["numbers", "purpose", "budget", "savings", "emergency", "flow"] as const;
type MoneyTab = (typeof TABS)[number];

function asTab(v: unknown): MoneyTab {
  return TABS.includes(v as MoneyTab) ? (v as MoneyTab) : "numbers";
}

export const Route = createFileRoute("/money")({
  validateSearch: (search: Record<string, unknown>): { tab: MoneyTab } => ({
    tab: asTab(search.tab),
  }),
  component: MoneyPage,
});

function MoneyPage() {
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const shifts = useRunsheet((s) => s.shifts);
  const settings = useRunsheet((s) => s.settings);
  const updateSettings = useRunsheet((s) => s.updateSettings);
  const currency = settings.currency;
  const setFundTarget = useRunsheet((s) => s.setFundTarget);
  const setSavingsTarget = useRunsheet((s) => s.setSavingsTarget);
  const deleteIncome = useRunsheet((s) => s.deleteIncome);
  const deleteAllocation = useRunsheet((s) => s.deleteAllocation);
  const deleteFundTx = useRunsheet((s) => s.deleteFundTx);
  const deleteSavingsTx = useRunsheet((s) => s.deleteSavingsTx);
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [allocOpen, setAllocOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [targetDraft, setTargetDraft] = useState(String(fund.target || ""));
  const [savingsTargetDraft, setSavingsTargetDraft] = useState(String(savings.target || ""));
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/money" });

  const snap = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period }),
    [trips, incomes, expenses, allocations, fund, shifts, savings, period],
  );
  const periodExpenses = expensesIn(expenses, period);
  const periodIncomes = incomesIn(incomes, period);
  const periodAlloc = allocationsIn(allocations, period);
  const lanes = byLane(periodExpenses);
  const pillars = moneyPillars(snap);
  const builtPct = actualBuildShare(snap.gross, snap.savings);
  const intended = intendedBuildShare(settings.priorities);
  const balance = emergencyBalance(fund);
  const savingsBal = emergencyBalance(savings);
  const efPct = emergencyProgress(fund);
  const savPct = emergencyProgress(savings);
  const cover = monthsOfCover(balance, expenses);
  const empty = trips.length === 0 && incomes.length === 0 && expenses.length === 0;
  const budgetRows = budgetVsActual(settings.budget, expensesIn(expenses, "month"), moneySnapshot({
    trips, incomes, expenses, allocations, fund, shifts, savings, period: "month",
  }).savings);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Money"
        subtitle="Earn. Operate. Provide. Build. Know the numbers — not a second set of books."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setExpenseOpen(true)}>
              Expense
            </Button>
            <Button variant="outline" onClick={() => setIncomeOpen(true)}>
              Other income
            </Button>
            <Button onClick={() => setAllocOpen(true)}>
              <Plus className="size-4" />
              Give money a purpose
            </Button>
          </div>
        }
      />

      <PeriodTabs value={period} onChange={setPeriod} />

      {!empty ? <MoneyPillarsRow pillars={pillars} currency={currency} /> : null}

      <Tabs
        value={tab}
        onValueChange={(v) => navigate({ search: { tab: asTab(v) } })}
      >
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="numbers">Numbers</TabsTrigger>
          <TabsTrigger value="purpose">Purpose</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="flow">Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="numbers">
          {empty ? (
            <EmptyState
              icon={Wallet}
              title="No money recorded yet"
              body="Start recording your trips to see your real earnings. Gross is fares, tips and other income — not profit."
              action="Log a cost"
              onAction={() => setExpenseOpen(true)}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <section className="rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)]">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">Net work income</p>
                <p className="mt-1 font-display text-5xl tabular">{formatMoney(snap.netWork, currency)}</p>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Gross income minus work-related expenses. Personal and family spending is counted separately
                  below — it is not a business cost.
                </p>
              </section>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  label="Gross income"
                  value={formatMoney(snap.gross, currency)}
                  hint={`Trips ${formatMoney(snap.fares + snap.tips, currency)} · other ${formatMoney(snap.otherIncome, currency)}`}
                />
                <StatCard
                  label="Work costs"
                  value={formatMoney(snap.workCosts, currency)}
                  hint="Fuel, service, data, permits — operate lane"
                />
                <StatCard
                  label="Personal commitments"
                  value={formatMoney(snap.provide + snap.familyAllocated, currency)}
                  hint="Rent, food, school, family support"
                />
                <StatCard
                  label="Savings & goals"
                  value={formatMoney(snap.savings, currency)}
                  hint="What you kept for later"
                />
                <StatCard
                  label="Available"
                  value={formatMoney(snap.available, currency)}
                  hint="After recorded costs and allocations"
                />
                <StatCard
                  label="Earnings / hour"
                  value={
                    snap.earningsPerHour == null ? "—" : formatMoney(snap.earningsPerHour, currency)
                  }
                  hint={`${formatHoursDecimal(snap.hours)} worked · vehicle ${formatMoney(snap.vehicleCost, currency)}`}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Of the money you earned, {builtPct == null ? "—" : `${Math.round(builtPct)}%`} went toward
                building your future. You aimed for about {Math.round(intended)}% — a guide, not a rule.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="purpose">
          <Card>
            <CardContent>
              <h2 className="font-display text-xl">Give your money a purpose</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You set the priorities. No fixed percentages.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(["work", "family", "savings", "goals", "personal"] as const).map((p) => (
                  <div key={p} className="rounded-lg bg-secondary px-3 py-3">
                    <p className="text-xs text-muted-foreground">{ALLOCATION_LABEL[p]}</p>
                    <p className="mt-1 font-display text-2xl tabular">
                      {formatMoney(allocatedOf(periodAlloc, p), currency)}
                    </p>
                  </div>
                ))}
              </div>
              {periodAlloc.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  After a good day, send money somewhere on purpose.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border">
                  {periodAlloc.map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-medium">{ALLOCATION_LABEL[a.purpose]}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(`${a.date}T12:00:00`), "EEE d MMM")}
                          {a.note ? ` · ${a.note}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm tabular">{formatMoney(a.amount, currency)}</p>
                        <button
                          type="button"
                          className="text-xs text-expense"
                          onClick={() => deleteAllocation(a.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Button className="mt-4" onClick={() => setAllocOpen(true)}>
                Allocate
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <BudgetPanel
            budget={settings.budget}
            rows={budgetRows}
            currency={currency}
            onSave={(budget) => updateSettings({ budget, sampleData: false })}
          />
        </TabsContent>

        <TabsContent value="savings">
          <Card>
            <CardContent>
              <h2 className="font-display text-xl">Savings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Money that improves the future. Separate from the emergency fund.
              </p>
              {savings.target <= 0 && savingsBal <= 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Set a target, then deposit after a good week. Allocating to “savings” also lands here.
                </p>
              ) : (
                <>
                  <p className="mt-2 font-display text-4xl tabular">
                    {formatMoney(savingsBal, currency)}
                    <span className="text-muted-foreground"> / {formatMoney(savings.target, currency)}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Progress: {Math.round(savPct)}%</p>
                  <Progress className="mt-3" value={savPct} />
                </>
              )}
              <form
                className="mt-5 flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSavingsTarget(Number(savingsTargetDraft) || 0);
                }}
              >
                <Input
                  inputMode="decimal"
                  value={savingsTargetDraft}
                  onChange={(e) => setSavingsTargetDraft(e.target.value)}
                  placeholder="Savings target"
                  aria-label="Savings target"
                />
                <Button type="submit" variant="secondary">
                  Save target
                </Button>
              </form>
              <Button className="mt-3" onClick={() => setSaveOpen(true)}>
                Record movement
              </Button>
              <ul className="mt-4 divide-y divide-border">
                {savings.transactions.map((t) => (
                  <li key={t.id} className="flex justify-between gap-3 py-3 text-sm">
                    <div>
                      <p>
                        {t.direction === "in" ? "In" : "Out"} ·{" "}
                        {format(new Date(`${t.date}T12:00:00`), "d MMM")}
                      </p>
                      {t.note ? <p className="text-xs text-muted-foreground">{t.note}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={t.direction === "in" ? "tabular text-income" : "tabular text-expense"}>
                        {t.direction === "in" ? "+" : "−"}
                        {formatMoney(t.amount, currency)}
                      </p>
                      <button type="button" className="text-xs text-muted-foreground" onClick={() => deleteSavingsTx(t.id)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardContent>
              <h2 className="font-display text-xl">Emergency fund</h2>
              {fund.target <= 0 && balance <= 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Add your first buffer. This is your number, not a product of anyone else’s advice.
                </p>
              ) : (
                <>
                  <p className="mt-2 font-display text-4xl tabular">
                    {formatMoney(balance, currency)}
                    <span className="text-muted-foreground"> / {formatMoney(fund.target, currency)}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Progress: {Math.round(efPct)}%</p>
                  <Progress className="mt-3" value={efPct} />
                  {cover != null ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      At the rate of essential (provide) costs you have recorded, this reserve would cover about{" "}
                      {cover < 1 ? `${Math.round(cover * 30)} days` : `${cover.toFixed(1)} months`}. That is an
                      estimate from your book, not a guarantee.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Record rent, food or family costs to estimate how long the reserve could cover essentials.
                    </p>
                  )}
                </>
              )}
              <form
                className="mt-5 flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFundTarget(Number(targetDraft) || 0);
                }}
              >
                <Input
                  inputMode="decimal"
                  value={targetDraft}
                  onChange={(e) => setTargetDraft(e.target.value)}
                  placeholder="Target amount"
                  aria-label="Emergency fund target"
                />
                <Button type="submit" variant="secondary">
                  Save target
                </Button>
              </form>
              <Button className="mt-3" onClick={() => setFundOpen(true)}>
                Record movement
              </Button>
              <ul className="mt-4 divide-y divide-border">
                {fund.transactions.map((t) => (
                  <li key={t.id} className="flex justify-between gap-3 py-3 text-sm">
                    <div>
                      <p>
                        {t.direction === "in" ? "In" : "Out"} ·{" "}
                        {format(new Date(`${t.date}T12:00:00`), "d MMM")}
                      </p>
                      {t.note ? <p className="text-xs text-muted-foreground">{t.note}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={t.direction === "in" ? "tabular text-income" : "tabular text-expense"}>
                        {t.direction === "in" ? "+" : "−"}
                        {formatMoney(t.amount, currency)}
                      </p>
                      <button type="button" className="text-xs text-muted-foreground" onClick={() => deleteFundTx(t.id)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent>
                <h2 className="font-display text-xl">Where recorded spend went</h2>
                {lanes.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No expenses in this period.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-3">
                    {lanes.map((row) => {
                      const total = periodExpenses.reduce((s, e) => s + e.amount, 0);
                      const pct = total ? Math.round((row.amount / total) * 100) : 0;
                      return (
                        <li key={row.lane}>
                          <div className="flex justify-between text-sm">
                            <span>{MONEY_LANE_SHORT[row.lane]}</span>
                            <span className="tabular text-muted-foreground">
                              {formatMoney(row.amount, currency)} · {pct}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                            <div
                              className={
                                row.lane === "operate"
                                  ? "h-full bg-expense/80"
                                  : row.lane === "provide"
                                    ? "h-full bg-foreground/70"
                                    : "h-full bg-muted-foreground"
                              }
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <Link to="/expenses" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
                  Open the expense book
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h2 className="font-display text-xl">Other income</h2>
                {periodIncomes.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Private jobs and extras that are not already on a trip.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-border">
                    {periodIncomes.map((i) => (
                      <li key={i.id} className="flex justify-between gap-3 py-3 text-sm">
                        <div>
                          <p>{INCOME_SOURCE_LABEL[i.source]}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(`${i.date}T12:00:00`), "d MMM")}
                            {i.note ? ` · ${i.note}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="tabular text-income">{formatMoney(i.amount, currency)}</p>
                          <button type="button" className="text-xs text-expense" onClick={() => deleteIncome(i.id)}>
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Button className="mt-4" variant="secondary" onClick={() => setIncomeOpen(true)}>
                  Record other income
                </Button>
              </CardContent>
            </Card>
          </div>
          {periodExpenses.length > 0 ? (
            <ul className="mt-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {periodExpenses.slice(0, 8).map((e) => (
                <li key={e.id} className="flex justify-between px-4 py-3 text-sm">
                  <span>
                    {EXPENSE_LABEL[e.category]}{" "}
                    <span className="text-muted-foreground">({MONEY_LANE_SHORT[EXPENSE_LANE[e.category]]})</span>
                  </span>
                  <span className="tabular">{formatMoney(e.amount, currency)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </TabsContent>
      </Tabs>

      <ExpenseDialog open={expenseOpen} onOpenChange={setExpenseOpen} />
      <IncomeDialog open={incomeOpen} onOpenChange={setIncomeOpen} />
      <AllocationDialog open={allocOpen} onOpenChange={setAllocOpen} />
      <FundDialog open={fundOpen} onOpenChange={setFundOpen} />
      <SavingsDialog open={saveOpen} onOpenChange={setSaveOpen} />
    </div>
  );
}

function BudgetPanel({
  budget,
  rows,
  currency,
  onSave,
}: {
  budget: MoneyBudget;
  rows: ReturnType<typeof budgetVsActual>;
  currency: ReturnType<typeof useRunsheet.getState>["settings"]["currency"];
  onSave: (budget: MoneyBudget) => void;
}) {
  const [draft, setDraft] = useState({
    operate: budget.operate ? String(budget.operate) : "",
    provide: budget.provide ? String(budget.provide) : "",
    enjoy: budget.enjoy ? String(budget.enjoy) : "",
    build: budget.build ? String(budget.build) : "",
  });
  const hasBudget = rows.some((r) => r.budget > 0);

  return (
    <Card>
      <CardContent className="grid gap-5">
        <div>
          <h2 className="font-display text-xl">This month’s plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional ceilings you choose. They are a compass, not a lock.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["operate", "Operate — work costs"],
              ["provide", "Provide — family & home"],
              ["enjoy", "Enjoy — personal"],
              ["build", "Build — savings & future"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <Input
                inputMode="decimal"
                value={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                placeholder="0"
              />
            </Field>
          ))}
        </div>
        <Button
          className="w-fit"
          onClick={() =>
            onSave({
              operate: Number(draft.operate) || 0,
              provide: Number(draft.provide) || 0,
              enjoy: Number(draft.enjoy) || 0,
              build: Number(draft.build) || 0,
            })
          }
        >
          Save budget
        </Button>
        {!hasBudget ? (
          <p className="text-sm text-muted-foreground">
            Add amounts to see this month against the plan.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row) => {
              const pct = row.budget > 0 ? Math.min(100, (row.actual / row.budget) * 100) : 0;
              const over = row.budget > 0 && row.actual > row.budget;
              return (
                <li key={row.lane}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{row.lane}</span>
                    <span className="tabular text-muted-foreground">
                      {formatMoney(row.actual, currency)}
                      {row.budget > 0 ? ` / ${formatMoney(row.budget, currency)}` : ""}
                    </span>
                  </div>
                  <Progress className="mt-1.5" value={pct} />
                  {over ? (
                    <p className="mt-1 text-xs text-expense">Over the amount you planned.</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
