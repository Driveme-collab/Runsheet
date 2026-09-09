import { daysUntil, localKey } from "./dates";
import type {
  CalendarCategory,
  CalendarEvent,
  DriverDocument,
  Goal,
  MaintenanceRecord,
  Shift,
} from "./types";

export type CalendarItem = {
  id: string;
  date: string;
  title: string;
  category: CalendarCategory;
  notes: string;
  source: "event" | "document" | "maintenance" | "shift" | "goal";
};

export function documentStatus(doc: DriverDocument, now = new Date()): {
  label: string;
  tone: "ok" | "soon" | "expired";
  days: number | null;
} {
  const days = daysUntil(doc.expiryDate, now);
  if (days == null) return { label: "No expiry", tone: "ok", days: null };
  if (days < 0) return { label: `Expired ${Math.abs(days)} days ago`, tone: "expired", days };
  if (days === 0) return { label: "Expires today", tone: "soon", days };
  if (days <= 45) return { label: `Expires in ${days} days`, tone: "soon", days };
  return { label: `${days} days remaining`, tone: "ok", days };
}

export function gatherCalendarItems(opts: {
  events: CalendarEvent[];
  documents: DriverDocument[];
  maintenance: MaintenanceRecord[];
  shifts: Shift[];
  goals: Goal[];
  now?: Date;
}): CalendarItem[] {
  const items: CalendarItem[] = [];

  for (const e of opts.events) {
    items.push({
      id: e.id,
      date: e.date,
      title: e.title,
      category: e.category,
      notes: e.notes,
      source: "event",
    });
  }

  for (const d of opts.documents) {
    if (!d.expiryDate) continue;
    items.push({
      id: `doc-${d.id}`,
      date: d.expiryDate,
      title: `${d.name} renewal`,
      category: "vehicle",
      notes: d.notes,
      source: "document",
    });
  }

  for (const m of opts.maintenance) {
    if (!m.nextDueDate) continue;
    items.push({
      id: `mnt-${m.id}`,
      date: m.nextDueDate,
      title: `Service due — ${m.description || m.kind}`,
      category: "vehicle",
      notes: m.notes,
      source: "maintenance",
    });
  }

  for (const s of opts.shifts) {
    items.push({
      id: `sh-${s.id}`,
      date: localKey(new Date(s.startedAt)),
      title: s.endedAt ? "Worked a shift" : "Shift in progress",
      category: "work",
      notes: s.notes,
      source: "shift",
    });
  }

  for (const g of opts.goals) {
    if (!g.deadline) continue;
    items.push({
      id: `goal-${g.id}`,
      date: g.deadline,
      title: `Goal: ${g.title}`,
      category: g.category === "career" ? "development" : g.category === "vehicle" ? "vehicle" : "money",
      notes: g.note,
      source: "goal",
    });
  }

  return items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

export function itemsOnDate(items: CalendarItem[], date: string): CalendarItem[] {
  return items.filter((i) => i.date === date);
}
