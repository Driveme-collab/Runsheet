import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { EventDialog } from "@/components/record-dialogs";
import { useRunsheet } from "@/lib/store";
import { gatherCalendarItems, itemsOnDate } from "@/lib/calendar-items";
import { CALENDAR_CATEGORY_LABEL, type CalendarCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { localKey } from "@/lib/dates";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

const CAT_DOT: Record<CalendarCategory, string> = {
  work: "bg-foreground",
  money: "bg-income",
  vehicle: "bg-expense",
  development: "bg-muted-foreground",
  personal: "bg-primary",
};

function CalendarPage() {
  const events = useRunsheet((s) => s.events);
  const documents = useRunsheet((s) => s.documents);
  const maintenance = useRunsheet((s) => s.maintenance);
  const shifts = useRunsheet((s) => s.shifts);
  const goals = useRunsheet((s) => s.goals);
  const deleteEvent = useRunsheet((s) => s.deleteEvent);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(localKey(new Date()));
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => gatherCalendarItems({ events, documents, maintenance, shifts, goals }),
    [events, documents, maintenance, shifts, goals],
  );

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
  });
  const onDay = itemsOnDate(items, selected);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calendar"
        subtitle="Work, bills, service, learning and personal commitments — one quiet grid."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">{format(cursor, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setCursor((d) => addMonths(d, -1))} aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setCursor((d) => addMonths(d, 1))} aria-label="Next month">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] tracking-wide text-muted-foreground uppercase">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = localKey(day);
          const dots = itemsOnDate(items, key);
          const cats = [...new Set(dots.map((d) => d.category))];
          const inMonth = isSameMonth(day, cursor);
          const isSel = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={cn(
                "flex min-h-12 flex-col items-center justify-start rounded-md px-0.5 py-1 text-sm",
                isSel ? "bg-primary text-primary-foreground" : inMonth ? "bg-card" : "text-muted-foreground/50",
              )}
            >
              {format(day, "d")}
              <span className="mt-1 flex gap-0.5">
                {cats.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className={cn(
                      "size-1 rounded-full",
                      isSel ? "bg-primary-foreground" : CAT_DOT[c],
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {(Object.keys(CAT_DOT) as CalendarCategory[]).map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", CAT_DOT[c])} />
            {CALENDAR_CATEGORY_LABEL[c]}
          </span>
        ))}
      </div>

      <section>
        <h2 className="font-display text-xl">
          {format(new Date(`${selected}T12:00:00`), "EEEE d MMMM")}
        </h2>
        {onDay.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nothing on this day. Add a commitment if you need one.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {onDay.map((item) => (
              <li key={item.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                      {CALENDAR_CATEGORY_LABEL[item.category]}
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{item.title}</p>
                    {item.notes ? <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p> : null}
                  </div>
                  {item.source === "event" ? (
                    <button
                      type="button"
                      className="text-xs text-expense"
                      onClick={() => deleteEvent(item.id)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <EventDialog open={open} onOpenChange={setOpen} defaultDate={selected} />
    </div>
  );
}
