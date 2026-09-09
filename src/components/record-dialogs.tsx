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
  ALLOCATION_LABEL,
  ALLOCATION_PURPOSES,
  CALENDAR_CATEGORIES,
  CALENDAR_CATEGORY_LABEL,
  DOCUMENT_KIND_LABEL,
  DOCUMENT_KINDS,
  INCOME_SOURCE_LABEL,
  INCOME_SOURCES,
  MAINTENANCE_KINDS,
  MAINTENANCE_LABEL,
  SKILL_AREA_LABEL,
  SKILL_AREAS,
  type AllocationPurpose,
  type CalendarCategory,
  type CalendarEvent,
  type DocumentKind,
  type DriverDocument,
  type FundDirection,
  type Income,
  type IncomeSource,
  type MaintenanceKind,
  type MaintenanceRecord,
  type SkillArea,
} from "@/lib/types";

export function IncomeDialog({
  open,
  onOpenChange,
  income,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income?: Income | null;
}) {
  const addIncome = useRunsheet((s) => s.addIncome);
  const updateIncome = useRunsheet((s) => s.updateIncome);
  const [date, setDate] = useState(todayDateInput());
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<IncomeSource>("private");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(income?.date ?? todayDateInput());
    setAmount(income ? String(income.amount) : "");
    setSource(income?.source ?? "private");
    setNote(income?.note ?? "");
  }, [open, income]);

  function save() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    const payload = { date, amount: n, source, note: note.trim() };
    if (income) {
      updateIncome(income.id, payload);
      toast.success("Income updated");
    } else {
      addIncome(payload);
      toast.success("Income recorded");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{income ? "Edit income" : "Record other income"}</DialogTitle>
          <DialogDescription>
            Private jobs, bonuses, and extras that are not already on a trip.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Amount">
              <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
          </div>
          <Field label="Source">
            <Select value={source} onValueChange={(v) => setSource(v as IncomeSource)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INCOME_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {INCOME_SOURCE_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AllocationDialog({
  open,
  onOpenChange,
  defaultAmount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAmount?: number;
}) {
  const addAllocation = useRunsheet((s) => s.addAllocation);
  const goals = useRunsheet((s) => s.goals);
  const [date, setDate] = useState(todayDateInput());
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState<AllocationPurpose>("savings");
  const [goalId, setGoalId] = useState("none");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(todayDateInput());
    setAmount(defaultAmount && defaultAmount > 0 ? String(Math.round(defaultAmount)) : "");
    setPurpose("savings");
    setGoalId("none");
    setNote("");
  }, [open, defaultAmount]);

  function save() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    if (purpose === "goals" && goalId === "none") {
      toast.error("Choose the goal this money is for.");
      return;
    }
    addAllocation({
      date,
      amount: n,
      purpose,
      goalId: purpose === "goals" ? goalId : null,
      note: note.trim(),
    });
    toast.success("Money given a purpose");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Give your money a purpose</DialogTitle>
          <DialogDescription>
            You choose the split. Nothing is forced. This is how earned money becomes a future.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Amount">
              <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
          </div>
          <Field label="Purpose">
            <Select
              value={purpose}
              onValueChange={(v) => setPurpose(v as AllocationPurpose)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALLOCATION_PURPOSES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {ALLOCATION_LABEL[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {purpose === "goals" ? (
            <Field label="Goal">
              <Select value={goalId} onValueChange={setGoalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Choose…</SelectItem>
                  {goals.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Allocate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FundDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addFundTx = useRunsheet((s) => s.addFundTx);
  const [date, setDate] = useState(todayDateInput());
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<FundDirection>("in");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(todayDateInput());
    setAmount("");
    setDirection("in");
    setNote("");
  }, [open]);

  function save() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    addFundTx({ date, amount: n, direction, note: note.trim() });
    toast.success(direction === "in" ? "Contribution recorded" : "Withdrawal recorded");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emergency fund movement</DialogTitle>
          <DialogDescription>
            A buffer if work stops. Estimates of cover are not a guarantee.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Amount">
              <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
          </div>
          <Field label="Direction">
            <Select value={direction} onValueChange={(v) => setDirection(v as FundDirection)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Contribution in</SelectItem>
                <SelectItem value="out">Withdrawal out</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MaintenanceDialog({
  open,
  onOpenChange,
  record,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: MaintenanceRecord | null;
}) {
  const addMaintenance = useRunsheet((s) => s.addMaintenance);
  const updateMaintenance = useRunsheet((s) => s.updateMaintenance);
  const mileage = useRunsheet((s) => s.settings.currentMileage);
  const [date, setDate] = useState(todayDateInput());
  const [kind, setKind] = useState<MaintenanceKind>("oil");
  const [miles, setMiles] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [nextDueMileage, setNextDueMileage] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(record?.date ?? todayDateInput());
    setKind(record?.kind ?? "oil");
    setMiles(record?.mileage != null ? String(record.mileage) : mileage ? String(mileage) : "");
    setCost(record ? String(record.cost) : "");
    setDescription(record?.description ?? "");
    setNextDueDate(record?.nextDueDate ?? "");
    setNextDueMileage(record?.nextDueMileage != null ? String(record.nextDueMileage) : "");
    setNotes(record?.notes ?? "");
  }, [open, record, mileage]);

  function save() {
    const payload = {
      date,
      kind,
      mileage: miles ? Number(miles) : null,
      cost: Number(cost) || 0,
      description: description.trim() || MAINTENANCE_LABEL[kind],
      nextDueDate,
      nextDueMileage: nextDueMileage ? Number(nextDueMileage) : null,
      notes: notes.trim(),
    };
    if (record) {
      updateMaintenance(record.id, payload);
      toast.success("Service updated");
    } else {
      addMaintenance(payload);
      toast.success("Service recorded");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{record ? "Edit service" : "Log maintenance"}</DialogTitle>
          <DialogDescription>
            Oil, tyres, brakes — the work that keeps the asset earning.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Kind">
              <Select value={kind} onValueChange={(v) => setKind(v as MaintenanceKind)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {MAINTENANCE_LABEL[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mileage">
              <Input inputMode="numeric" value={miles} onChange={(e) => setMiles(e.target.value)} />
            </Field>
            <Field label="Cost">
              <Input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} />
            </Field>
          </div>
          <Field label="What was done">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Next due (date)">
              <Input type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
            </Field>
            <Field label="Next due (km)">
              <Input
                inputMode="numeric"
                value={nextDueMileage}
                onChange={(e) => setNextDueMileage(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DocumentDialog({
  open,
  onOpenChange,
  doc,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc?: DriverDocument | null;
}) {
  const addDocument = useRunsheet((s) => s.addDocument);
  const updateDocument = useRunsheet((s) => s.updateDocument);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<DocumentKind>("licence");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(doc?.name ?? "");
    setKind(doc?.kind ?? "licence");
    setIssueDate(doc?.issueDate ?? "");
    setExpiryDate(doc?.expiryDate ?? "");
    setNotes(doc?.notes ?? "");
  }, [open, doc]);

  function save() {
    const title = name.trim() || DOCUMENT_KIND_LABEL[kind];
    const payload = { name: title, kind, issueDate, expiryDate, notes: notes.trim() };
    if (doc) {
      updateDocument(doc.id, payload);
      toast.success("Document updated");
    } else {
      addDocument(payload);
      toast.success("Document added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{doc ? "Edit document" : "Add a document"}</DialogTitle>
          <DialogDescription>
            Licence, insurance, inspection — dates you set, not legal advice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Driving licence" />
          </Field>
          <Field label="Kind">
            <Select value={kind} onValueChange={(v) => setKind(v as DocumentKind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_KINDS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {DOCUMENT_KIND_LABEL[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Issued">
              <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </Field>
            <Field label="Expires">
              <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultDate?: string;
}) {
  const addEvent = useRunsheet((s) => s.addEvent);
  const updateEvent = useRunsheet((s) => s.updateEvent);
  const [date, setDate] = useState(todayDateInput());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CalendarCategory>("personal");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(event?.date ?? defaultDate ?? todayDateInput());
    setTitle(event?.title ?? "");
    setCategory(event?.category ?? "personal");
    setNotes(event?.notes ?? "");
  }, [open, event, defaultDate]);

  function save() {
    if (!title.trim()) {
      toast.error("A title is required.");
      return;
    }
    const payload = { date, title: title.trim(), category, notes: notes.trim() };
    if (event) {
      updateEvent(event.id, payload);
      toast.success("Updated");
    } else {
      addEvent(payload);
      toast.success("Added to calendar");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit commitment" : "Add a commitment"}</DialogTitle>
          <DialogDescription>Work, bills, service, learning, or personal — your week, in one place.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Category">
            <Select value={category} onValueChange={(v) => setCategory(v as CalendarCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CALENDAR_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CALENDAR_CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ContributeDialog({
  open,
  onOpenChange,
  goalId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string | null;
}) {
  const addAllocation = useRunsheet((s) => s.addAllocation);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setNote("");
  }, [open]);

  function save() {
    if (!goalId) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    addAllocation({
      date: todayDateInput(),
      amount: n,
      purpose: "goals",
      goalId,
      note: note.trim(),
    });
    toast.success("Contribution recorded");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to this goal</DialogTitle>
          <DialogDescription>Moves the progress bar and records a purpose for the money.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Amount">
            <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SavingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addSavingsTx = useRunsheet((s) => s.addSavingsTx);
  const [date, setDate] = useState(todayDateInput());
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<FundDirection>("in");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(todayDateInput());
    setAmount("");
    setDirection("in");
    setNote("");
  }, [open]);

  function save() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    addSavingsTx({ date, amount: n, direction, note: note.trim() });
    toast.success(direction === "in" ? "Saved" : "Withdrawal recorded");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Savings movement</DialogTitle>
          <DialogDescription>
            Money set aside for later — separate from the emergency buffer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Amount">
              <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
          </div>
          <Field label="Direction">
            <Select value={direction} onValueChange={(v) => setDirection(v as FundDirection)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Deposit in</SelectItem>
                <SelectItem value="out">Withdrawal out</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ActivityDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addActivity = useRunsheet((s) => s.addActivity);
  const [date, setDate] = useState(todayDateInput());
  const [area, setArea] = useState<SkillArea>("customer_service");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(todayDateInput());
    setArea("customer_service");
    setTitle("");
    setNotes("");
  }, [open]);

  function save() {
    if (!title.trim()) {
      toast.error("What did you learn or practise?");
      return;
    }
    addActivity({ date, area, title: title.trim(), notes: notes.trim() });
    toast.success("Learning recorded");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log learning</DialogTitle>
          <DialogDescription>
            Independent of any academy. A short note is enough.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Skill area">
            <Select value={area} onValueChange={(v) => setArea(v as SkillArea)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_AREAS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {SKILL_AREA_LABEL[a]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="What you did">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Practised a quieter night route"
            />
          </Field>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
