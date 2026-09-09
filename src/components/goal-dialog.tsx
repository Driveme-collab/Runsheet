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
import { useRunsheet } from "@/lib/store";
import {
  GOAL_CATEGORIES,
  GOAL_CATEGORY_LABEL,
  type Goal,
  type GoalCategory,
} from "@/lib/types";

export function GoalDialog({
  open,
  onOpenChange,
  goal,
  defaultCategory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  defaultCategory?: GoalCategory;
}) {
  const addGoal = useRunsheet((s) => s.addGoal);
  const updateGoal = useRunsheet((s) => s.updateGoal);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("financial");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(goal?.title ?? "");
    setCategory(goal?.category ?? defaultCategory ?? "financial");
    setTarget(goal ? String(goal.targetAmount) : "");
    setSaved(goal ? String(goal.savedAmount) : "");
    setDeadline(goal?.deadline ?? "");
    setNote(goal?.note ?? "");
  }, [open, goal, defaultCategory]);

  function save() {
    const targetAmount = Number(target);
    if (!title.trim() || !Number.isFinite(targetAmount) || targetAmount <= 0) {
      toast.error("A title and a target amount are required.");
      return;
    }
    const payload = {
      title: title.trim(),
      category,
      targetAmount,
      savedAmount: Number(saved) || 0,
      deadline,
      note: note.trim(),
    };
    if (goal) {
      updateGoal(goal.id, payload);
      toast.success("Goal updated");
    } else {
      addGoal(payload);
      toast.success("Goal added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Edit goal" : "New goal"}</DialogTitle>
          <DialogDescription>
            Today’s work can contribute to tomorrow’s security. Put a number on it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="What is it for">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="School support" />
          </Field>
          <Field label="Category">
            <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {GOAL_CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target">
              <Input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
            </Field>
            <Field label="Already set aside">
              <Input inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value)} />
            </Field>
          </div>
          <Field label="Deadline (optional)">
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{goal ? "Save changes" : "Add goal"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
