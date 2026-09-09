import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flag, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";
import { GoalDialog } from "@/components/goal-dialog";
import { ContributeDialog } from "@/components/record-dialogs";
import { PageHeader } from "@/components/page-header";
import { useRunsheet } from "@/lib/store";
import { formatMoney } from "@/lib/money";
import { goalProgress, moneySnapshot } from "@/lib/finance";
import {
  GOAL_CATEGORIES,
  GOAL_CATEGORY_LABEL,
  type Goal,
  type GoalCategory,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/goals")({ component: GoalsPage });

function GoalsPage() {
  const goals = useRunsheet((s) => s.goals);
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const shifts = useRunsheet((s) => s.shifts);
  const settings = useRunsheet((s) => s.settings);
  const deleteGoal = useRunsheet((s) => s.deleteGoal);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<GoalCategory | "all">("all");
  const [contributeId, setContributeId] = useState<string | null>(null);

  const week = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period: "week" }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );
  const currency = settings.currency;
  const family = goals.filter((g) => g.category === "family");
  const visible = filter === "all" ? goals : goals.filter((g) => g.category === filter);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Goals"
        subtitle="Today’s work can contribute to tomorrow’s family security."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            New goal
          </Button>
        }
      />

      <Card>
        <CardContent>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">This week’s net work income</p>
          <p className="mt-2 font-display text-4xl tabular">{formatMoney(week.netWork, currency)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The engine for every number below. Put some of it somewhere on purpose.
          </p>
        </CardContent>
      </Card>

      {family.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl">My family goals</h2>
          <p className="mt-1 text-sm text-muted-foreground">Private to you. Not shared with any employer.</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {family.map((g) => (
              <li key={g.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <p className="text-sm text-muted-foreground">{g.title}</p>
                <p className="mt-1 font-display text-2xl tabular">
                  {formatMoney(g.savedAmount, currency)}
                  <span className="text-muted-foreground"> / {formatMoney(g.targetAmount, currency)}</span>
                </p>
                <Progress className="mt-3" value={goalProgress(g)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-secondary p-1">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {GOAL_CATEGORIES.map((c) => (
          <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
            {GOAL_CATEGORY_LABEL[c]}
          </FilterChip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="Add your first goal to begin building your future."
          body="Family, vehicle, savings, a certificate — write the number. Add what you set aside after a good week."
          action="New goal"
          onAction={() => setOpen(true)}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((g) => {
            const pct = goalProgress(g);
            const remain = Math.max(0, g.targetAmount - g.savedAmount);
            return (
              <li key={g.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                      {GOAL_CATEGORY_LABEL[g.category]}
                    </p>
                    <h2 className="font-display text-2xl">{g.title}</h2>
                    {g.deadline ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        By {format(new Date(`${g.deadline}T12:00:00`), "d MMMM yyyy")}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-display text-2xl tabular">{Math.round(pct)}%</p>
                </div>
                <Progress className="mt-4" value={pct} />
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatMoney(g.savedAmount, currency)} of {formatMoney(g.targetAmount, currency)} ·{" "}
                  {formatMoney(remain, currency)} to go
                </p>
                {g.note ? <p className="mt-3 text-sm">{g.note}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setContributeId(g.id)}>
                    Add money
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(g);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-expense" onClick={() => deleteGoal(g.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <GoalDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        goal={editing}
        defaultCategory={filter === "all" ? undefined : filter}
      />
      <ContributeDialog
        open={contributeId != null}
        onOpenChange={(v) => {
          if (!v) setContributeId(null);
        }}
        goalId={contributeId}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-md px-3 text-sm font-medium",
        active ? "bg-card text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
