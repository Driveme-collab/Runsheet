import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Field, StatCard } from "@/components/page-header";
import { useRunsheet } from "@/lib/store";
import { formatHoursDecimal, formatMoney } from "@/lib/money";
import { monthKey, weekStartKey } from "@/lib/dates";
import { moneySnapshot } from "@/lib/finance";
import { formatDelta, monthHighlights, weekHighlights } from "@/lib/review-narrative";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const shifts = useRunsheet((s) => s.shifts);
  const goals = useRunsheet((s) => s.goals);
  const skills = useRunsheet((s) => s.skills);
  const currency = useRunsheet((s) => s.settings.currency);
  const weeklyReviews = useRunsheet((s) => s.weeklyReviews);
  const monthlyReviews = useRunsheet((s) => s.monthlyReviews);
  const saveWeeklyReview = useRunsheet((s) => s.saveWeeklyReview);
  const saveMonthlyReview = useRunsheet((s) => s.saveMonthlyReview);

  const weekStart = weekStartKey();
  const month = monthKey();
  const existingW = weeklyReviews.find((r) => r.weekStart === weekStart);
  const existingM = monthlyReviews.find((r) => r.monthKey === month);

  const week = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period: "week" }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const lastWeek = useMemo(
    () =>
      moneySnapshot({
        trips,
        incomes,
        expenses,
        allocations,
        fund,
        shifts,
        savings,
        period: "week",
        now: new Date(Date.now() - 7 * 86400000),
      }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const thisMonth = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period: "month" }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const lastMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1, 15);
    return moneySnapshot({
      trips,
      incomes,
      expenses,
      allocations,
      fund,
      shifts,
      savings,
      period: "month",
      now: d,
    });
  }, [trips, incomes, expenses, allocations, fund, shifts, savings]);

  const weekN = weekHighlights(week, lastWeek, goals, currency);
  const monthN = monthHighlights(thisMonth, lastMonth, currency);
  const learning = skills.filter((s) => s.status === "learning" || s.status === "completed");

  const [well, setWell] = useState(existingW?.whatWentWell ?? "");
  const [attn, setAttn] = useState(existingW?.whatNeedsAttention ?? "");
  const [p1, setP1] = useState(existingW?.priorities[0] ?? "");
  const [p2, setP2] = useState(existingW?.priorities[1] ?? "");
  const [p3, setP3] = useState(existingW?.priorities[2] ?? "");

  const [mWell, setMWell] = useState(existingM?.whatWentWell ?? "");
  const [mAttn, setMAttn] = useState(existingM?.whatNeedsAttention ?? "");
  const [mp1, setMp1] = useState(existingM?.priorities[0] ?? "");
  const [mp2, setMp2] = useState(existingM?.priorities[1] ?? "");
  const [mp3, setMp3] = useState(existingM?.priorities[2] ?? "");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reviews"
        subtitle="A weekly ritual, then a monthly look back. Figures first, then your own words."
      />

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">My week</TabsTrigger>
          <TabsTrigger value="month">My month</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="flex flex-col gap-4">
          {week.trips === 0 && week.gross === 0 ? (
            <p className="text-sm text-muted-foreground">
              Complete your first weekly review after seven days of records.
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Trips" value={String(week.trips)} />
            <StatCard label="Hours" value={formatHoursDecimal(week.hours)} />
            <StatCard label="Gross" value={formatMoney(week.gross, currency)} />
            <StatCard
              label="Per hour"
              value={week.earningsPerHour == null ? "—" : formatMoney(week.earningsPerHour, currency)}
            />
            <StatCard label="Work costs" value={formatMoney(week.workCosts, currency)} />
            <StatCard label="Net work" value={formatMoney(week.netWork, currency)} />
            <StatCard label="Savings" value={formatMoney(week.savings, currency)} />
            <StatCard
              label="Family"
              value={formatMoney(week.provide + week.familyAllocated, currency)}
            />
          </div>
          <Card>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-xl">What went well</h2>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {weekN.well.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-xl">What needs attention</h2>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {weekN.attention.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Vehicle this week: fuel {formatMoney(week.fuelEnergy, currency)} · maintenance{" "}
            {formatMoney(week.maintenance, currency)} · total vehicle {formatMoney(week.vehicleCost, currency)}.
            Rating {week.rating == null ? "—" : week.rating.toFixed(1)}. Learning marks: {learning.length}.
          </p>
          <Card>
            <CardContent className="grid gap-4">
              <h2 className="font-display text-xl">Your notes</h2>
              <Field label="What went well">
                <Textarea value={well} onChange={(e) => setWell(e.target.value)} />
              </Field>
              <Field label="What needs attention">
                <Textarea value={attn} onChange={(e) => setAttn(e.target.value)} />
              </Field>
              <p className="text-sm text-muted-foreground">Next week — up to three priorities.</p>
              <Input value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Save a set amount" />
              <Input value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Complete one learning mark" />
              <Input value={p3} onChange={(e) => setP3(e.target.value)} placeholder="Schedule a service" />
              <Button
                className="w-fit"
                onClick={() => {
                  saveWeeklyReview({
                    weekStart,
                    whatWentWell: well,
                    whatNeedsAttention: attn,
                    priorities: [p1, p2, p3],
                  });
                  toast.success("Week saved");
                }}
              >
                Save this week
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {monthN.deltas.map((d) => (
              <div key={d.label} className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">{d.label}</p>
                <p className="mt-1 font-display text-3xl tabular">{formatDelta(d.pct)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Against last month, where data exists</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Gross" value={formatMoney(thisMonth.gross, currency)} />
            <StatCard label="Work costs" value={formatMoney(thisMonth.workCosts, currency)} />
            <StatCard label="Net work" value={formatMoney(thisMonth.netWork, currency)} />
            <StatCard label="Savings" value={formatMoney(thisMonth.savings, currency)} />
          </div>
          <Card>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-xl">What went well</h2>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {monthN.well.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-xl">What needs attention</h2>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {monthN.attention.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-4">
              <h2 className="font-display text-xl">Your notes</h2>
              <Field label="What went well">
                <Textarea value={mWell} onChange={(e) => setMWell(e.target.value)} />
              </Field>
              <Field label="What needs attention">
                <Textarea value={mAttn} onChange={(e) => setMAttn(e.target.value)} />
              </Field>
              <Input value={mp1} onChange={(e) => setMp1(e.target.value)} placeholder="Priority 1" />
              <Input value={mp2} onChange={(e) => setMp2(e.target.value)} placeholder="Priority 2" />
              <Input value={mp3} onChange={(e) => setMp3(e.target.value)} placeholder="Priority 3" />
              <Button
                className="w-fit"
                onClick={() => {
                  saveMonthlyReview({
                    monthKey: month,
                    whatWentWell: mWell,
                    whatNeedsAttention: mAttn,
                    priorities: [mp1, mp2, mp3],
                  });
                  toast.success("Month saved");
                }}
              >
                Save this month
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
