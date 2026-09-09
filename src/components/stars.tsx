import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  value,
  onChange,
  size = "sm",
}: {
  value: number | null;
  onChange?: (n: number) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "size-5" : "size-3.5";
  return (
    <div className="inline-flex items-center gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`${value ?? 0} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (value ?? 0) >= n;
        const star = (
          <Star
            className={cn(dim, filled ? "fill-primary text-primary" : "text-muted-foreground/40")}
          />
        );
        if (!onChange) return <span key={n}>{star}</span>;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            className="rounded-sm p-1.5 transition-colors hover:bg-muted"
            onClick={() => onChange(n)}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
