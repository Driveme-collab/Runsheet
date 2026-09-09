import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { MoreHorizontal, Plus, Receipt } from "lucide-react";
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
import { ExpenseDialog } from "@/components/expense-dialog";
import { useRunsheet } from "@/lib/store";
import { formatMoney } from "@/lib/money";
import { byExpense, expensesIn, spendOf } from "@/lib/stats";
import { EXPENSE_LABEL, EXPENSE_LANE, MONEY_LANE_SHORT, type Expense, type PeriodKey } from "@/lib/types";

export const Route = createFileRoute("/expenses")({ component: ExpensesPage });

function ExpensesPage() {
  const expenses = useRunsheet((s) => s.expenses);
  const currency = useRunsheet((s) => s.settings.currency);
  const deleteExpense = useRunsheet((s) => s.deleteExpense);
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const list = useMemo(
    () => expensesIn(expenses, period).sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, period],
  );
  const total = spendOf(list);
  const breakdown = byExpense(list);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight italic">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Operate, provide, enjoy — what it cost to work, and what the household needed.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          Record expense
        </Button>
      </div>

      <PeriodTabs value={period} onChange={setPeriod} />

      <div className="rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Spent this period</p>
        <p className="mt-1 font-display text-4xl tabular">{formatMoney(total, currency)}</p>
        {breakdown.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-2">
            {breakdown.map((row) => {
              const pct = total ? Math.round((row.amount / total) * 100) : 0;
              return (
                <li key={row.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{EXPENSE_LABEL[row.category]}</span>
                    <span className="tabular text-muted-foreground">
                      {formatMoney(row.amount, currency)} · {pct}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-expense/80"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses in this period"
          body="Log fuel as you fill up. Small costs disappear unless they are written down."
          action="Record expense"
          onAction={() => setOpen(true)}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{EXPENSE_LABEL[e.category]}</p>
                  <Badge variant="expense">{formatMoney(e.amount, currency)}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(new Date(`${e.date}T12:00:00`), "EEE d MMM")}
                  {` · ${MONEY_LANE_SHORT[EXPENSE_LANE[e.category]]}`}
                  {e.odometerKm ? ` · ${e.odometerKm.toLocaleString("en-RW")} km` : ""}
                </p>
                {e.note ? <p className="mt-1 text-sm text-muted-foreground">{e.note}</p> : null}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Expense actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditing(e);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-expense" onClick={() => deleteExpense(e.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}

      <ExpenseDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        expense={editing}
      />
    </div>
  );
}
