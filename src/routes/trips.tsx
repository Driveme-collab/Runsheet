import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MoreHorizontal, Plus, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/empty-state";
import { PeriodTabs } from "@/components/period-tabs";
import { PageHeader, MiniStat } from "@/components/page-header";
import { Stars } from "@/components/stars";
import { TripDialog } from "@/components/trip-dialog";
import { useRunsheet } from "@/lib/store";
import { formatDayTime } from "@/lib/dates";
import { formatHours, formatKm, formatMoney } from "@/lib/money";
import { avgRating, kmOf, minutesOf, tripGrossOf, tripsIn } from "@/lib/finance";
import { PAYMENT_LABEL, PLATFORM_LABEL, type PeriodKey, type Trip } from "@/lib/types";

export const Route = createFileRoute("/trips")({ component: TripsPage });

function TripsPage() {
  const trips = useRunsheet((s) => s.trips);
  const customers = useRunsheet((s) => s.customers);
  const currency = useRunsheet((s) => s.settings.currency);
  const deleteTrip = useRunsheet((s) => s.deleteTrip);
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);

  const list = useMemo(
    () => tripsIn(trips, period).sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [trips, period],
  );
  const names = useMemo(() => new Map(customers.map((c) => [c.id, c.name])), [customers]);
  const rating = avgRating(list);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trips"
        subtitle="Every job, fare, tip and word of thanks."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Log trip
          </Button>
        }
      />
      <PeriodTabs value={period} onChange={setPeriod} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Trips" value={String(list.length)} />
        <MiniStat label="Gross" value={formatMoney(tripGrossOf(list), currency)} />
        <MiniStat label="Distance" value={formatKm(kmOf(list))} />
        <MiniStat label="Hours / rating" value={`${formatHours(minutesOf(list))} · ${rating?.toFixed(1) ?? "—"}`} />
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={RouteIcon}
          title="No trips in this period"
          body="Start recording your trips to see your real earnings."
          action="Log trip"
          onAction={() => {
            setEditing(null);
            setOpen(true);
          }}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((t) => {
            const name = t.customerId ? names.get(t.customerId) : null;
            return (
              <li key={t.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {t.pickup} → {t.dropoff}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDayTime(t.startedAt)}
                      {name ? ` · ${name}` : ""} · {PLATFORM_LABEL[t.platform]} · {PAYMENT_LABEL[t.paymentType]}
                      {t.distanceKm ? ` · ${formatKm(t.distanceKm)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-sm tabular">{formatMoney(t.fare + t.tip, currency)}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Trip actions">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(t);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        {t.customerId ? (
                          <DropdownMenuItem asChild>
                            <Link to="/customers/$id" params={{ id: t.customerId }}>
                              View customer
                            </Link>
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-expense" onClick={() => deleteTrip(t.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {t.tip > 0 ? <Badge variant="income">Tip {formatMoney(t.tip, currency)}</Badge> : null}
                  {t.rating ? <Stars value={t.rating} /> : null}
                </div>
                {t.appreciation ? (
                  <p className="mt-2 font-display text-base leading-snug italic text-foreground/90">
                    “{t.appreciation}”
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <TripDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        trip={editing}
      />
    </div>
  );
}
