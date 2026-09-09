import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field } from "./page-header";
import { todayDateInput } from "@/lib/dates";
import { useRunsheet } from "@/lib/store";
import {
  EXPENSE_CATEGORIES_BY_LANE,
  EXPENSE_LABEL,
  MONEY_LANE_SHORT,
  MONEY_LANES,
  type Expense,
  type ExpenseCategory,
} from "@/lib/types";

type Draft = {
  date: string;
  category: ExpenseCategory;
  amount: string;
  note: string;
  odometerKm: string;
};

function emptyDraft(): Draft {
  return {
    date: todayDateInput(),
    category: "fuel",
    amount: "",
    note: "",
    odometerKm: "",
  };
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
}) {
  const addExpense = useRunsheet((s) => s.addExpense);
  const updateExpense = useRunsheet((s) => s.updateExpense);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  useEffect(() => {
    if (!open) return;
    if (expense) {
      setDraft({
        date: expense.date,
        category: expense.category,
        amount: String(expense.amount),
        note: expense.note,
        odometerKm: expense.odometerKm != null ? String(expense.odometerKm) : "",
      });
    } else {
      setDraft(emptyDraft());
    }
  }, [open, expense]);

  function save() {
    const amount = Number(draft.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    const payload = {
      date: draft.date,
      category: draft.category,
      amount,
      note: draft.note.trim(),
      odometerKm: draft.odometerKm ? Number(draft.odometerKm) : null,
    };
    if (expense) {
      updateExpense(expense.id, payload);
      toast.success("Expense updated");
    } else {
      addExpense(payload);
      toast.success("Expense recorded");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit expense" : "Record an expense"}</DialogTitle>
          <DialogDescription>
            Operate is the cost of working. Provide is family duty. Enjoy is personal spending. They are not
            mixed into “profit.”
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as ExpenseCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONEY_LANES.map((lane) => (
                    <div key={lane}>
                      <p className="px-2 py-1.5 text-[11px] tracking-wide text-muted-foreground uppercase">
                        {MONEY_LANE_SHORT[lane]}
                      </p>
                      {EXPENSE_CATEGORIES_BY_LANE[lane].map((c) => (
                        <SelectItem key={c} value={c}>
                          {EXPENSE_LABEL[c]}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount">
              <Input
                inputMode="decimal"
                value={draft.amount}
                onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
              />
            </Field>
            <Field label="Odometer (optional)">
              <Input
                inputMode="numeric"
                value={draft.odometerKm}
                onChange={(e) => setDraft({ ...draft, odometerKm: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Note">
            <Textarea
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              placeholder="Station, garage, who it was for"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{expense ? "Save changes" : "Record expense"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
