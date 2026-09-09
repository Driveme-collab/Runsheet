import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
} from "recharts";
import { ArrowRight, Plus, Square, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TripDialog } from "@/components/trip-dialog";
import { ExpenseDialog } from "@/components/expense-dialog";
import { AllocationDialog } from "@/components/record-dialogs";
import { Stars } from "@/components/stars";
import { StatCard } from "@/components/page-header";
import { useRunsheet } from "@/lib/store";
import { formatHoursDecimal, formatMoney } from "@/lib/money";
import { formatDayTime, greeting } from "@/lib/dates";
import { buildInsights } from "@/lib/insights";
import { documentStatus } from "@/lib/calendar-items";
import {
  emergencyProgress,
  goalProgress,
  moneySnapshot,
  shiftWindowStats,
  weekSeries,
} from "@/lib/finance";
import { PLATFORM_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const settings = useRunsheet((s) => s.settings);
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const goals = useRunsheet((s) => s.goals);
  const shifts = useRunsheet((s) => s.shifts);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const documents = useRunsheet((s) => s.documents);
  const maintenance = useRunsheet((s) => s.maintenance);
  const startShift = useRunsheet((s) => s.startShift);
  const endShift = useRunsheet((s) => s.endShift);
  const [tripOpen, setTripOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [allocOpen, setAllocOpen] = useState(false);

  const today = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period: "today" }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const week = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period: "week" }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const month = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period: "month" }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const chart = useMemo(() => weekSeries(trips, expenses, incomes), [trips, expenses, incomes]);
  const insights = useMemo(
    () => buildInsights({ trips, incomes, expenses, allocations, fund, shifts, goals, savings }),
    [trips, incomes, expenses, allocations, fund, shifts, goals, savings],
  );
  const openShift = shifts.find((s) => !s.endedAt);
  const shiftStats = openShift ? shiftWindowStats(openShift, trips, expenses, incomes) : null;
  const currency = settings.currency;
  const first = (settings.driverName || "driver").split(" ")[0];
  const emptyBook = trips.length === 0 && expenses.length === 0 && goals.length === 0;
  const recent = [...trips].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 5);
  const quotes = trips.filter((t) => t.appreciation.trim()).slice(0, 3);
  const efPct = emergencyProgress(fund);
  const familyGoals = goals.filter((g) => g.category === "family");
  const vehicleGoals = goals.filter((g) => g.category === "vehicle");
  const careerGoals = goals.filter((g) => g.category === "career" || g.category === "personal");
  const alerts = documents
    .map((d) => ({ doc: d, st: documentStatus(d) }))
    .filter((x) => x.st.tone !== "ok");
  const dueService = settings.reminders.maintenance
    ? maintenance.filter((m) => m.nextDueDate)
    : [];
  const visibleAlerts = settings.reminders.documents ? alerts : [];

  return (
    <div className="flex flex-col gap-6">
      {settings.sampleData ? (
        <div className="flex flex-col gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>A Kigali sample week is loaded so you can look around. Your records stay on this device.</p>
          <Link to="/settings" className="font-medium text-foreground underline-offset-4 hover:underline">
            Start fresh in Profile
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE d MMMM")}</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight italic sm:text-5xl">
            {greeting()}, {first}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Don’t just drive for today. Build for tomorrow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {openShift ? (
            <Button variant="outline" onClick={endShift}>
              <Square className="size-3.5 fill-current" />
              End shift
            </Button>
          ) : (
            <Button variant="outline" onClick={startShift}>
              Start shift
            </Button>
          )}
          <Button variant="secondary" onClick={() => setExpenseOpen(true)}>
            Cost
          </Button>
          <Button onClick={() => setTripOpen(true)}>
            <Plus className="size-4" />
            Log trip
          </Button>
        </div>
      </div>

      {openShift && shiftStats ? (
        <Card>
          <CardContent className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="text-income">On shift</span>
              <span className="text-muted-foreground">
                {" "}
                since {format(new Date(openShift.startedAt), "HH:mm")}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {shiftStats.trips} trips · {formatMoney(shiftStats.gross, currency)} gross ·{" "}
              {formatHoursDecimal(shiftStats.hours)}
              {shiftStats.earningsPerHour != null
                ? ` · ${formatMoney(shiftStats.earningsPerHour, currency)}/h net`
                : ""}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {visibleAlerts.length > 0 ? (
        <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
          {visibleAlerts.map(({ doc, st }) => (
            <p key={doc.id}>
              <Link to="/vehicle" className="underline-offset-4 hover:underline">
                {doc.name} {st.label.toLowerCase()}.
              </Link>
            </p>
          ))}
          {dueService.slice(0, 2).map((m) => (
            <p key={m.id}>
              <Link to="/vehicle" className="underline-offset-4 hover:underline">
                Service due {m.nextDueDate} — {m.description || m.kind}.
              </Link>
            </p>
          ))}
        </div>
      ) : dueService.length > 0 ? (
        <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
          {dueService.slice(0, 2).map((m) => (
            <p key={m.id}>
              <Link to="/vehicle" className="underline-offset-4 hover:underline">
                Service due {m.nextDueDate} — {m.description || m.kind}.
              </Link>
            </p>
          ))}
        </div>
      ) : null}

      <section className="rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)] sm:px-7 sm:py-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Today</p>
        {emptyBook ? (
          <>
            <p className="mt-2 font-display text-4xl tracking-tight">Start with one trip.</p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Start recording your trips to see your real earnings. Nothing here is invented.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 font-display text-5xl tracking-tight tabular sm:text-6xl">
              {formatMoney(today.netWork, currency)}
            </p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Net work income today — {formatMoney(today.gross, currency)} earned, less{" "}
              {formatMoney(today.workCosts, currency)} to operate. Not profit; work costs only.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Tiny label="Trips" value={String(today.trips)} />
              <Tiny label="Hours" value={formatHoursDecimal(today.hours)} />
              <Tiny label="Expenses" value={formatMoney(today.workCosts + today.provide + today.enjoy, currency)} />
              <Tiny
                label="To goals"
                value={formatMoney(today.savings + today.familyAllocated, currency)}
              />
            </dl>
          </>
        )}
      </section>

      <div>
        <h2 className="font-display text-2xl">This week</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Earned"
            value={formatMoney(week.gross, currency)}
            hint={`${week.trips} trips`}
          />
          <StatCard
            label="Work costs"
            value={formatMoney(week.workCosts, currency)}
            hint="Operate lane only"
          />
          <StatCard
            label="Net work"
            value={formatMoney(week.netWork, currency)}
            hint={
              week.earningsPerHour != null
                ? `${formatMoney(week.earningsPerHour, currency)} / hour`
                : "Add shift hours for a rate"
            }
          />
          <StatCard
            label="Rating"
            value={week.rating == null ? "—" : week.rating.toFixed(1)}
            hint={week.rating == null ? "No ratings yet" : "Average this week"}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl">This month</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Gross income" value={formatMoney(month.gross, currency)} hint={`${month.trips} trips`} />
          <StatCard
            label="Work expenses"
            value={formatMoney(month.workCosts, currency)}
            hint="Operate lane only"
          />
          <StatCard
            label="Personal / family"
            value={formatMoney(month.provide + month.familyAllocated, currency)}
            hint="Provide lane and family allocations"
          />
          <StatCard
            label="Built for later"
            value={formatMoney(month.savings, currency)}
            hint="Savings, goals, emergency contributions"
          />
          <StatCard
            label="Net available"
            value={formatMoney(month.available, currency)}
            hint="After recorded costs and allocations"
          />
          <StatCard
            label="Emergency fund"
            value={`${Math.round(efPct)}%`}
            hint={fund.target > 0 ? `${formatMoney(fund.target, currency)} target` : "Set a target in Money"}
          />
        </div>
      </div>

      <Card>
        <CardContent>
          <h2 className="font-display text-xl">Personal progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Today’s work can contribute to tomorrow’s family security.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {fund.target > 0 ? (
              <ProgressRow
                label="Emergency fund"
                pct={efPct}
                detail={`${formatMoney(fund.transactions.reduce((s, t) => s + (t.direction === "out" ? -t.amount : t.amount), 0), currency)} / ${formatMoney(fund.target, currency)}`}
                to="/money"
              />
            ) : null}
            {familyGoals.map((g) => (
              <ProgressRow
                key={g.id}
                label={g.title}
                pct={goalProgress(g)}
                detail={`${formatMoney(g.savedAmount, currency)} / ${formatMoney(g.targetAmount, currency)}`}
                to="/goals"
              />
            ))}
            {vehicleGoals.slice(0, 1).map((g) => (
              <ProgressRow
                key={g.id}
                label={g.title}
                pct={goalProgress(g)}
                detail={`${formatMoney(g.savedAmount, currency)} / ${formatMoney(g.targetAmount, currency)}`}
                to="/goals"
              />
            ))}
            {settings.nextLevel ? (
              <ProgressRow
                label="Career — next level"
                pct={settings.nextLevel.progressPct}
                detail={settings.nextLevel.target}
                to="/growth"
              />
            ) : careerGoals.slice(0, 1).map((g) => (
              <ProgressRow
                key={g.id}
                label={g.title}
                pct={goalProgress(g)}
                detail={`${formatMoney(g.savedAmount, currency)} / ${formatMoney(g.targetAmount, currency)}`}
                to="/growth"
              />
            ))}
            {fund.target === 0 && familyGoals.length === 0 && !settings.nextLevel ? (
              <p className="text-sm text-muted-foreground">
                Add your first goal to begin building your future.
              </p>
            ) : null}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-xl">Week in motion</h2>
              <p className="text-xs text-muted-foreground">Income vs all recorded spend</p>
            </div>
            {chart.every((d) => d.income === 0 && d.spend === 0) ? (
              <p className="py-10 text-sm text-muted-foreground">
                Not enough data yet. Log a trip or an expense and the week will appear here.
              </p>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-income)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-income)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-expense)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--color-expense)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ReTooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        color: "var(--color-foreground)",
                        fontSize: 12,
                      }}
                      formatter={(value, name) => [
                        formatMoney(Number(value ?? 0), currency),
                        name === "income" ? "Income" : "Costs",
                      ]}
                    />
                    <Area type="monotone" dataKey="income" stroke="var(--color-income)" fill="url(#inc)" strokeWidth={1.6} />
                    <Area type="monotone" dataKey="spend" stroke="var(--color-expense)" fill="url(#exp)" strokeWidth={1.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="font-display text-xl">Driver insight</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {insights.map((i) => (
                <li key={i.id} className="text-sm leading-relaxed">
                  <span
                    className={cn(
                      "mr-2 inline-block size-1.5 rounded-full align-middle",
                      i.tone === "up" && "bg-income",
                      i.tone === "down" && "bg-expense",
                      (i.tone === "neutral" || i.tone === "empty") && "bg-muted-foreground",
                    )}
                  />
                  {i.text}
                </li>
              ))}
            </ul>
            <Link
              to="/reviews"
              className="mt-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Open this week’s review <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl">Latest trips</h2>
              <Link to="/trips" className="text-sm text-muted-foreground hover:text-foreground">
                All trips
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">No trips yet. Log the first one of the day.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {t.pickup} → {t.dropoff}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDayTime(t.startedAt)} · {PLATFORM_LABEL[t.platform]}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm tabular">{formatMoney(t.fare + t.tip, currency)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl">How they received you</h2>
              <Star className="size-4 text-muted-foreground" />
            </div>
            {quotes.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">
                After a kind word or a tip, save it on the trip. It becomes your record of the work.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {quotes.map((t) => (
                  <li key={t.id}>
                    <Stars value={t.rating} />
                    <p className="mt-1 font-display text-lg leading-snug italic">“{t.appreciation}”</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.pickup} → {t.dropoff}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <TripDialog
        open={tripOpen}
        onOpenChange={setTripOpen}
        onLogged={() => setAllocOpen(true)}
      />
      <ExpenseDialog open={expenseOpen} onOpenChange={setExpenseOpen} />
      <AllocationDialog open={allocOpen} onOpenChange={setAllocOpen} defaultAmount={today.netWork} />
    </div>
  );
}

function Tiny({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-medium tabular">{value}</dd>
    </div>
  );
}

function ProgressRow({
  label,
  pct,
  detail,
  to,
}: {
  label: string;
  pct: number;
  detail: string;
  to: string;
}) {
  return (
    <li>
      <Link to={to} className="block">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm tabular text-muted-foreground">{Math.round(pct)}%</p>
        </div>
        <Progress className="mt-2" value={Math.min(100, pct)} />
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </Link>
    </li>
  );
}
