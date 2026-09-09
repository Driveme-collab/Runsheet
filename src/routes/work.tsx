import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PeriodTabs } from "@/components/period-tabs";
import { PageHeader, StatCard } from "@/components/page-header";
import { TripDialog } from "@/components/trip-dialog";
import { Stars } from "@/components/stars";
import { useRunsheet } from "@/lib/store";
import { formatDayTime } from "@/lib/dates";
import { formatHoursDecimal, formatKm, formatMoney } from "@/lib/money";
import { byPlatform, moneySnapshot, shiftWindowStats, tripsIn, avgFare } from "@/lib/finance";
import { topCustomers } from "@/lib/stats";
import { PLATFORM_LABEL, type PeriodKey } from "@/lib/types";

export const Route = createFileRoute("/work")({ component: WorkPage });

function WorkPage() {
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const shifts = useRunsheet((s) => s.shifts);
  const customers = useRunsheet((s) => s.customers);
  const currency = useRunsheet((s) => s.settings.currency);
  const startShift = useRunsheet((s) => s.startShift);
  const endShift = useRunsheet((s) => s.endShift);
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [open, setOpen] = useState(false);

  const snap = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period }),
    [trips, incomes, expenses, allocations, fund, shifts, savings, period],
  );
  const list = useMemo(
    () => tripsIn(trips, period).sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [trips, period],
  );
  const platforms = byPlatform(list);
  const top = topCustomers(customers, list, 4);
  const openShift = shifts.find((s) => !s.endedAt);
  const shiftStats = openShift ? shiftWindowStats(openShift, trips, expenses, incomes) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Work"
        subtitle="How much did I work — and what did the time produce?"
        action={
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
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Log trip
            </Button>
          </div>
        }
      />

      {openShift && shiftStats ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">This shift</p>
            <p className="mt-1 font-display text-3xl tabular">{formatMoney(shiftStats.net, currency)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Net after today’s operate costs · {shiftStats.trips} trips · {formatHoursDecimal(shiftStats.hours)}
              {shiftStats.earningsPerHour != null
                ? ` · ${formatMoney(shiftStats.earningsPerHour, currency)} / hour`
                : ""}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <PeriodTabs value={period} onChange={setPeriod} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Trips" value={String(snap.trips)} hint={formatKm(snap.km)} />
        <StatCard label="Hours" value={formatHoursDecimal(snap.hours)} hint="Shifts, or trip minutes if none" />
        <StatCard
          label="Gross"
          value={formatMoney(snap.gross, currency)}
          hint={`Fares ${formatMoney(snap.fares, currency)} · tips ${formatMoney(snap.tips, currency)}`}
        />
        <StatCard
          label="Per hour"
          value={snap.earningsPerHour == null ? "—" : formatMoney(snap.earningsPerHour, currency)}
          hint="Net work income ÷ hours"
        />
        <StatCard
          label="Avg trip"
          value={avgFare(list) == null ? "—" : formatMoney(avgFare(list) ?? 0, currency)}
          hint="Gross per trip this period"
        />
        <StatCard
          label="Net work"
          value={formatMoney(snap.netWork, currency)}
          hint={`Work costs ${formatMoney(snap.workCosts, currency)}`}
        />
        <StatCard
          label="Rating"
          value={snap.rating == null ? "—" : snap.rating.toFixed(1)}
          hint={snap.rating == null ? "No ratings yet" : "Average this period"}
        />
        <StatCard
          label="Distance"
          value={formatKm(snap.km)}
          hint={snap.trips ? `${(snap.km / snap.trips).toFixed(1)} km / trip` : "Log km on trips"}
        />
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link to="/trips" className="rounded-lg bg-secondary px-4 py-3 hover:bg-muted">
          All trips
        </Link>
        <Link to="/shifts" className="rounded-lg bg-secondary px-4 py-3 hover:bg-muted">
          Shifts
        </Link>
        <Link to="/customers" className="rounded-lg bg-secondary px-4 py-3 hover:bg-muted">
          People
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-display text-xl">By platform</h2>
            {platforms.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No trips in this period.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {platforms.map((p) => (
                  <li key={p.platform} className="flex justify-between py-2 text-sm">
                    <span>
                      {PLATFORM_LABEL[p.platform]}{" "}
                      <span className="text-muted-foreground">({p.trips})</span>
                    </span>
                    <span className="tabular">{formatMoney(p.gross, currency)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-display text-xl">People this period</h2>
            {top.filter((t) => t.trips > 0).length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No named customers in this period.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {top
                  .filter((t) => t.trips > 0)
                  .map((row) => (
                    <li key={row.customer.id} className="flex items-center justify-between gap-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{row.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{row.trips} trips</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.avgRating != null ? <Stars value={Math.round(row.avgRating)} /> : null}
                        <p className="text-sm tabular">{formatMoney(row.gross, currency)}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Recent trips</h2>
            <Link to="/trips" className="text-sm text-muted-foreground hover:text-foreground">
              Open trips
            </Link>
          </div>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start recording your trips to see your real earnings.</p>
          ) : (
            <ul className="divide-y divide-border">
              {list.slice(0, 8).map((t) => (
                <li key={t.id} className="flex justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {t.pickup} → {t.dropoff}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDayTime(t.startedAt)} · {PLATFORM_LABEL[t.platform]}
                    </p>
                  </div>
                  <p className="text-sm tabular">{formatMoney(t.fare + t.tip, currency)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <TripDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
