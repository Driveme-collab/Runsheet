import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader, MiniStat } from "@/components/page-header";
import { useRunsheet } from "@/lib/store";
import { formatDayTime, formatTime } from "@/lib/dates";
import { formatHoursDecimal, formatMoney } from "@/lib/money";
import { shiftHours, shiftWindowStats, shiftsIn } from "@/lib/finance";

export const Route = createFileRoute("/shifts")({ component: ShiftsPage });

function ShiftsPage() {
  const shifts = useRunsheet((s) => s.shifts);
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const currency = useRunsheet((s) => s.settings.currency);
  const startShift = useRunsheet((s) => s.startShift);
  const endShift = useRunsheet((s) => s.endShift);
  const deleteShift = useRunsheet((s) => s.deleteShift);
  const openShift = shifts.find((s) => !s.endedAt);
  const week = useMemo(() => shiftsIn(shifts, "week"), [shifts]);
  const weekHours = shiftHours(week);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shifts"
        subtitle="What did today’s working time actually produce?"
        action={
          openShift ? (
            <Button onClick={endShift}>
              <Square className="size-3.5 fill-current" />
              End shift
            </Button>
          ) : (
            <Button onClick={startShift}>Start shift</Button>
          )
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="This week" value={formatHoursDecimal(weekHours)} />
        <MiniStat label="Shifts recorded" value={String(shifts.length)} />
      </div>

      {shifts.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No shifts yet"
          body="Start a shift when you leave. End it when you park. Hours then sit under every earning figure."
          action="Start shift"
          onAction={startShift}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {shifts.map((s) => {
            const stats = shiftWindowStats(s, trips, expenses, incomes);
            return (
              <li key={s.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {formatDayTime(s.startedAt)}
                      {s.endedAt ? ` – ${formatTime(s.endedAt)}` : " · open"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatHoursDecimal(stats.hours)} · {stats.trips} trips ·{" "}
                      {formatMoney(stats.gross, currency)} gross · {formatMoney(stats.net, currency)} net
                      {stats.earningsPerHour != null
                        ? ` · ${formatMoney(stats.earningsPerHour, currency)}/h`
                        : ""}
                    </p>
                    {s.notes ? <p className="mt-2 text-sm">{s.notes}</p> : null}
                  </div>
                  {!s.endedAt ? (
                    <Button size="sm" variant="outline" onClick={endShift}>
                      End
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" className="text-expense" onClick={() => deleteShift(s.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
