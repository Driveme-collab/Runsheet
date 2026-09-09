import { formatMoney } from "@/lib/money";
import type { MoneyPillars } from "@/lib/finance";
import { MONEY_PILLAR_HINT, MONEY_PILLAR_LABEL, type CurrencyCode, type MoneyPillar } from "@/lib/types";

const ORDER: MoneyPillar[] = ["earn", "operate", "provide", "build", "enjoy"];

export function MoneyPillarsRow({
  pillars,
  currency,
}: {
  pillars: MoneyPillars;
  currency: CurrencyCode;
}) {
  const earn = pillars.earn || 1;
  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {ORDER.map((key) => {
        const amount = pillars[key];
        const pct = Math.round((amount / earn) * 100);
        return (
          <div key={key} className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {MONEY_PILLAR_LABEL[key]}
            </p>
            <p className="mt-1 font-display text-2xl tabular sm:text-3xl">
              {formatMoney(amount, currency)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {key === "earn" ? MONEY_PILLAR_HINT[key] : `${pct}% of earned · ${MONEY_PILLAR_HINT[key]}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
