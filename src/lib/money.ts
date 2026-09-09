import type { CurrencyCode } from "./types";

const LOCALE: Record<CurrencyCode, string> = {
  RWF: "en-RW",
  KES: "en-KE",
  UGX: "en-UG",
  TZS: "en-TZ",
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  ZAR: "en-ZA",
  BWP: "en-BW",
  NAD: "en-NA",
  ZMW: "en-ZM",
};

export function formatMoney(
  amount: number,
  currency: CurrencyCode,
  opts?: { compact?: boolean },
): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : "";
  const locale = LOCALE[currency] ?? "en-RW";
  if (opts?.compact && abs >= 1000) {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(abs);
    return sign + formatted;
  }
  const zeroDecimal = currency === "RWF" || currency === "UGX" || currency === "TZS";
  return (
    sign +
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: zeroDecimal || abs % 1 === 0 ? 0 : 2,
    }).format(abs)
  );
}

export function formatKm(km: number): string {
  if (!km) return "—";
  return `${new Intl.NumberFormat("en-RW", { maximumFractionDigits: 1 }).format(km)} km`;
}

export function formatHours(minutes: number): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatHoursDecimal(hours: number): string {
  if (!hours) return "—";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
