import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { PeriodKey } from "./types";

export function periodInterval(period: PeriodKey, now = new Date()) {
  if (period === "all") return null;
  if (period === "today") {
    return { start: startOfDay(now), end: endOfDay(now) };
  }
  if (period === "week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

export function previousPeriodInterval(period: PeriodKey, now = new Date()) {
  if (period === "all") return null;
  if (period === "today") {
    const day = addDays(now, -1);
    return { start: startOfDay(day), end: endOfDay(day) };
  }
  if (period === "week") {
    const week = addWeeks(now, -1);
    return {
      start: startOfWeek(week, { weekStartsOn: 1 }),
      end: endOfWeek(week, { weekStartsOn: 1 }),
    };
  }
  const month = addMonths(now, -1);
  return { start: startOfMonth(month), end: endOfMonth(month) };
}

export function inInterval(
  iso: string,
  interval: { start: Date; end: Date } | null,
): boolean {
  if (!interval) return true;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return isWithinInterval(date, interval);
}

export function inPeriod(iso: string, period: PeriodKey, now = new Date()): boolean {
  return inInterval(iso, periodInterval(period, now));
}

export function inPreviousPeriod(iso: string, period: PeriodKey, now = new Date()): boolean {
  return inInterval(iso, previousPeriodInterval(period, now));
}

export function dateOnlyInPeriod(date: string, period: PeriodKey, now = new Date()): boolean {
  return inPeriod(`${date}T12:00:00`, period, now);
}

export function dateOnlyInPreviousPeriod(
  date: string,
  period: PeriodKey,
  now = new Date(),
): boolean {
  return inPreviousPeriod(`${date}T12:00:00`, period, now);
}

export function formatDay(iso: string): string {
  return format(new Date(iso), "EEE d MMM");
}

export function formatDayTime(iso: string): string {
  return format(new Date(iso), "EEE d MMM · HH:mm");
}

export function formatTime(iso: string): string {
  return format(new Date(iso), "HH:mm");
}

export function formatRangeLabel(period: PeriodKey, now = new Date()): string {
  const interval = periodInterval(period, now);
  if (!interval) return "All records";
  if (period === "today") return format(now, "EEEE d MMMM");
  return `${format(interval.start, "d MMM")} – ${format(interval.end, "d MMM yyyy")}`;
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function toDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDateTimeLocal(value: string): string {
  return new Date(value).toISOString();
}

export function todayInputValue(now = new Date()): string {
  return toDateTimeLocal(now.toISOString());
}

export function todayDateInput(now = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

export function localKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function weekStartKey(now = new Date()): string {
  return localKey(startOfWeek(now, { weekStartsOn: 1 }));
}

export function monthKey(now = new Date()): string {
  return format(now, "yyyy-MM");
}

export function daysUntil(date: string, now = new Date()): number | null {
  if (!date) return null;
  const target = startOfDay(new Date(`${date}T12:00:00`));
  if (Number.isNaN(target.getTime())) return null;
  const start = startOfDay(now);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export function hoursBetween(startIso: string, endIso: string | null, now = new Date()): number {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : now;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
}
