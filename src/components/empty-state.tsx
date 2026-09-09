import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-card px-6 py-16 text-center shadow-[var(--shadow-border)]">
      <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {action}
        </Button>
      ) : null}
    </div>
  );
}
