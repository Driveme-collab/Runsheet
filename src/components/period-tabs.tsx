import { cn } from "@/lib/utils";
import type { PeriodKey } from "@/lib/types";

const ITEMS: { key: PeriodKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "all", label: "All" },
];

export function PeriodTabs({
  value,
  onChange,
}: {
  value: PeriodKey;
  onChange: (key: PeriodKey) => void;
}) {
  return (
    <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-secondary p-1">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={cn(
            "h-9 shrink-0 rounded-md px-3 text-sm font-medium transition-colors",
            value === item.key ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
