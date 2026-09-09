import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PeriodTabs } from "@/components/period-tabs";
import { PageHeader } from "@/components/page-header";
import { Stars } from "@/components/stars";
import { useRunsheet } from "@/lib/store";
import { formatRangeLabel } from "@/lib/dates";
import { formatHoursDecimal, formatKm, formatMoney } from "@/lib/money";
import { buildCompleteReport, buildOperatorReport } from "@/lib/report-text";
import {
  byExpense,
  byPlatform,
  expensesIn,
  goalProgress,
  moneySnapshot,
  tripsIn,
} from "@/lib/finance";
import { topCustomers } from "@/lib/stats";
import { growthReport } from "@/lib/growth";
import { EXPENSE_LABEL, PLATFORM_LABEL, type PeriodKey } from "@/lib/types";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

function ReportsPage() {
  const settings = useRunsheet((s) => s.settings);
  const tripsAll = useRunsheet((s) => s.trips);
  const expensesAll = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const shifts = useRunsheet((s) => s.shifts);
  const customers = useRunsheet((s) => s.customers);
  const goals = useRunsheet((s) => s.goals);
  const skills = useRunsheet((s) => s.skills);
  const documents = useRunsheet((s) => s.documents);
  const maintenance = useRunsheet((s) => s.maintenance);
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [copied, setCopied] = useState(false);
  const [kind, setKind] = useState<"work" | "complete">("complete");

  const snap = useMemo(
    () =>
      moneySnapshot({
        trips: tripsAll,
        incomes,
        expenses: expensesAll,
        allocations,
        fund,
        shifts,
        period,
      }),
    [tripsAll, incomes, expensesAll, allocations, fund, shifts, period],
  );
  const periodTrips = useMemo(() => tripsIn(tripsAll, period), [tripsAll, period]);
  const periodExpenses = useMemo(() => expensesIn(expensesAll, period), [expensesAll, period]);
  const platforms = byPlatform(periodTrips);
  const cats = byExpense(periodExpenses);
  const top = topCustomers(customers, periodTrips, 5);
  const currency = settings.currency;
  const vehicle = [settings.vehicleMake, settings.vehicleModel, settings.plate].filter(Boolean).join(" · ");
  const growth = useMemo(
    () =>
      growthReport({
        trips: tripsAll,
        incomes,
        expenses: expensesAll,
        allocations,
        fund,
        shifts,
        goals,
        skills,
        documents,
        maintenance,
      }),
    [tripsAll, incomes, expensesAll, allocations, fund, shifts, goals, skills, documents, maintenance],
  );

  const text = useMemo(() => {
    if (kind === "work") {
      return buildOperatorReport({
        settings,
        trips: periodTrips,
        expenses: periodExpenses,
        period,
      });
    }
    return buildCompleteReport({ settings, snap, period });
  }, [kind, settings, periodTrips, periodExpenses, period, snap]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(kind === "work" ? "Work report copied" : "Complete report copied — this is your private copy");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy. Select the text below instead.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        subtitle="Work figures you can send. A complete picture that stays yours."
        action={
          <div className="flex gap-2" data-print-hide>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" />
              Print
            </Button>
            <Button onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              Copy
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2" data-print-hide>
        <button
          type="button"
          onClick={() => setKind("complete")}
          className={
            kind === "complete"
              ? "h-11 rounded-md bg-primary px-4 text-sm text-primary-foreground"
              : "h-11 rounded-md bg-secondary px-4 text-sm"
          }
        >
          Complete (private)
        </button>
        <button
          type="button"
          onClick={() => setKind("work")}
          className={
            kind === "work"
              ? "h-11 rounded-md bg-primary px-4 text-sm text-primary-foreground"
              : "h-11 rounded-md bg-secondary px-4 text-sm"
          }
        >
          Work / operator
        </button>
      </div>

      <div data-print-hide>
        <PeriodTabs value={period} onChange={setPeriod} />
      </div>

      <article className="rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)] sm:px-7">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Runsheet</p>
        <h2 className="mt-1 font-display text-3xl tracking-tight">{formatRangeLabel(period)}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {settings.driverName || "Driver"}
          {vehicle ? ` · ${vehicle}` : ""}
          {settings.city ? ` · ${settings.city}` : ""}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Cell label="Trips" value={String(snap.trips)} />
          <Cell label="Hours" value={formatHoursDecimal(snap.hours)} />
          <Cell label="Distance" value={formatKm(snap.km)} />
          <Cell label="Rating" value={snap.rating == null ? "—" : snap.rating.toFixed(1)} />
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MoneyCell label="Gross income" value={formatMoney(snap.gross, currency)} />
          <MoneyCell label="Work costs" value={formatMoney(snap.workCosts, currency)} tone="expense" />
          <MoneyCell label="Net work income" value={formatMoney(snap.netWork, currency)} tone="income" />
        </div>

        {kind === "complete" ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <MoneyCell
              label="Personal / family"
              value={formatMoney(snap.provide + snap.familyAllocated, currency)}
            />
            <MoneyCell label="Savings & goals" value={formatMoney(snap.savings, currency)} tone="income" />
            <MoneyCell label="Vehicle cost" value={formatMoney(snap.vehicleCost, currency)} tone="expense" />
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Operator copy omits family goals, savings and private notes.
          </p>
        )}

        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {kind === "complete" ? "Available after recorded allocations" : "Net work income"}
          </p>
          <p className="mt-1 font-display text-5xl tracking-tight tabular">
            {formatMoney(kind === "complete" ? snap.available : snap.netWork, currency)}
          </p>
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-display text-xl">By platform</h2>
            {platforms.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No trips in this period.</p>
            ) : (
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platforms.map((p) => ({ ...p, name: PLATFORM_LABEL[p.platform] }))}>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ReTooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value) => formatMoney(Number(value ?? 0), currency)}
                    />
                    <Bar dataKey="gross" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-display text-xl">Costs by kind</h2>
            {cats.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No expenses in this period.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {cats.map((c) => (
                  <li key={c.category} className="flex justify-between py-2 text-sm">
                    <span>{EXPENSE_LABEL[c.category]}</span>
                    <span className="tabular text-expense">{formatMoney(c.amount, currency)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {kind === "complete" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="font-display text-xl">Goals</h2>
              {goals.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No goals yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {goals.map((g) => (
                    <li key={g.id} className="flex justify-between py-2 text-sm">
                      <span>{g.title}</span>
                      <span className="tabular">{Math.round(goalProgress(g))}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-display text-xl">Growth</h2>
              <p className="mt-2 font-display text-4xl tabular">{growth.total}</p>
              <p className="mt-1 text-sm text-muted-foreground">Personal development score — private.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent>
            <h2 className="font-display text-xl">Top customers this period</h2>
            {top.filter((t) => t.trips > 0).length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No named customers in this period.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {top
                  .filter((t) => t.trips > 0)
                  .map((row) => (
                    <li key={row.customer.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-medium">{row.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{row.trips} trips</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {row.avgRating != null ? <Stars value={Math.round(row.avgRating)} /> : null}
                        <p className="text-sm tabular">{formatMoney(row.gross, currency)}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      <Card data-print-hide>
        <CardContent>
          <h2 className="font-display text-xl">Plain-text copy</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Formatted for WhatsApp and email. The complete report is for you; the work report is what an
            operator can use.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {text}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular">{value}</dd>
    </div>
  );
}

function MoneyCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "income" | "expense";
}) {
  return (
    <div className="rounded-lg bg-secondary px-4 py-3">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p
        className={
          tone === "income"
            ? "mt-1 text-lg tabular text-income"
            : tone === "expense"
              ? "mt-1 text-lg tabular text-expense"
              : "mt-1 text-lg tabular"
        }
      >
        {value}
      </p>
    </div>
  );
}
