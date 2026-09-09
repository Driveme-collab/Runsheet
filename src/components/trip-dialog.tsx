import { useEffect, useMemo, useState } from "react";
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
import { Stars } from "./stars";
import { Field } from "./page-header";
import { fromDateTimeLocal, todayInputValue, toDateTimeLocal } from "@/lib/dates";
import { useRunsheet } from "@/lib/store";
import {
  PAYMENT_LABEL,
  PAYMENT_TYPES,
  PLATFORM_LABEL,
  PLATFORMS,
  type PaymentType,
  type Platform,
  type Trip,
} from "@/lib/types";

type Draft = {
  startedAt: string;
  endedAt: string;
  customerId: string;
  newCustomer: string;
  pickup: string;
  dropoff: string;
  fare: string;
  tip: string;
  platform: Platform;
  paymentType: PaymentType;
  distanceKm: string;
  durationMin: string;
  rating: number | null;
  appreciation: string;
  notes: string;
};

function emptyDraft(): Draft {
  return {
    startedAt: todayInputValue(),
    endedAt: "",
    customerId: "none",
    newCustomer: "",
    pickup: "",
    dropoff: "",
    fare: "",
    tip: "",
    platform: "cash",
    paymentType: "cash",
    distanceKm: "",
    durationMin: "",
    rating: null,
    appreciation: "",
    notes: "",
  };
}

function fromTrip(trip: Trip): Draft {
  return {
    startedAt: toDateTimeLocal(trip.startedAt),
    endedAt: trip.endedAt ? toDateTimeLocal(trip.endedAt) : "",
    customerId: trip.customerId ?? "none",
    newCustomer: "",
    pickup: trip.pickup,
    dropoff: trip.dropoff,
    fare: String(trip.fare),
    tip: String(trip.tip || ""),
    platform: trip.platform,
    paymentType: trip.paymentType,
    distanceKm: trip.distanceKm ? String(trip.distanceKm) : "",
    durationMin: trip.durationMin ? String(trip.durationMin) : "",
    rating: trip.rating,
    appreciation: trip.appreciation,
    notes: trip.notes,
  };
}

export function TripDialog({
  open,
  onOpenChange,
  trip,
  defaultCustomerId,
  onLogged,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip?: Trip | null;
  defaultCustomerId?: string;
  onLogged?: (amount: number) => void;
}) {
  const customers = useRunsheet((s) => s.customers);
  const addCustomer = useRunsheet((s) => s.addCustomer);
  const addTrip = useRunsheet((s) => s.addTrip);
  const updateTrip = useRunsheet((s) => s.updateTrip);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  useEffect(() => {
    if (!open) return;
    if (trip) {
      setDraft(fromTrip(trip));
      return;
    }
    const d = emptyDraft();
    if (defaultCustomerId) d.customerId = defaultCustomerId;
    setDraft(d);
  }, [open, trip, defaultCustomerId]);

  const sorted = useMemo(
    () => [...customers].sort((a, b) => a.name.localeCompare(b.name)),
    [customers],
  );

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function save() {
    const fare = Number(draft.fare);
    if (!draft.pickup.trim() || !draft.dropoff.trim() || !Number.isFinite(fare) || fare < 0) {
      toast.error("Pickup, drop-off and fare are required.");
      return;
    }
    let customerId: string | null = draft.customerId === "none" ? null : draft.customerId;
    if (draft.newCustomer.trim()) {
      customerId = addCustomer({
        name: draft.newCustomer.trim(),
        phone: "",
        notes: "",
        regular: false,
        status: "occasional",
      });
    }
    const durationMin = Number(draft.durationMin) || 0;
    const startedAt = fromDateTimeLocal(draft.startedAt);
    let endedAt = draft.endedAt ? fromDateTimeLocal(draft.endedAt) : null;
    if (!endedAt && durationMin > 0) {
      endedAt = new Date(new Date(startedAt).getTime() + durationMin * 60_000).toISOString();
    }
    const payload = {
      startedAt,
      endedAt,
      customerId,
      pickup: draft.pickup.trim(),
      dropoff: draft.dropoff.trim(),
      fare,
      tip: Number(draft.tip) || 0,
      platform: draft.platform,
      paymentType: draft.paymentType,
      distanceKm: Number(draft.distanceKm) || 0,
      durationMin,
      rating: draft.rating,
      appreciation: draft.appreciation.trim(),
      notes: draft.notes.trim(),
    };
    if (trip) {
      updateTrip(trip.id, payload);
      toast.success("Trip updated");
    } else {
      addTrip(payload);
      toast.success("Trip logged", {
        action: onLogged
          ? {
              label: "Give it a purpose",
              onClick: () => onLogged(fare + (Number(draft.tip) || 0)),
            }
          : undefined,
        duration: 7000,
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{trip ? "Edit trip" : "Log a trip"}</DialogTitle>
          <DialogDescription>
            Fare, customer and how they received the ride — recorded while it is still clear.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start">
              <Input
                type="datetime-local"
                value={draft.startedAt}
                onChange={(e) => set("startedAt", e.target.value)}
              />
            </Field>
            <Field label="End (optional)">
              <Input
                type="datetime-local"
                value={draft.endedAt}
                onChange={(e) => set("endedAt", e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pickup">
              <Input
                value={draft.pickup}
                onChange={(e) => set("pickup", e.target.value)}
                placeholder="Remera"
              />
            </Field>
            <Field label="Drop-off">
              <Input
                value={draft.dropoff}
                onChange={(e) => set("dropoff", e.target.value)}
                placeholder="Kanombe Airport"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fare">
              <Input
                inputMode="decimal"
                value={draft.fare}
                onChange={(e) => set("fare", e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Tip">
              <Input
                inputMode="decimal"
                value={draft.tip}
                onChange={(e) => set("tip", e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Platform">
              <Select
                value={draft.platform}
                onValueChange={(v) => {
                  const platform = v as Platform;
                  set("platform", platform);
                  if (platform === "cash") set("paymentType", "cash");
                  else if (platform === "operator") set("paymentType", "momo");
                  else set("paymentType", "platform");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PLATFORM_LABEL[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payment">
              <Select value={draft.paymentType} onValueChange={(v) => set("paymentType", v as PaymentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PAYMENT_LABEL[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Customer">
            <Select value={draft.customerId} onValueChange={(v) => set("customerId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Walk-up" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Walk-up / unknown</SelectItem>
                {sorted.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="New customer (optional)">
            <Input
              value={draft.newCustomer}
              onChange={(e) => set("newCustomer", e.target.value)}
              placeholder="Name to add to your book"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Distance (km)">
              <Input
                inputMode="decimal"
                value={draft.distanceKm}
                onChange={(e) => set("distanceKm", e.target.value)}
              />
            </Field>
            <Field label="Duration (min)">
              <Input
                inputMode="numeric"
                value={draft.durationMin}
                onChange={(e) => set("durationMin", e.target.value)}
              />
            </Field>
          </div>
          <div>
            <p className="text-sm font-medium">How they rated the ride</p>
            <div className="mt-1">
              <Stars value={draft.rating} onChange={(n) => set("rating", n)} size="md" />
            </div>
          </div>
          <Field label="What they said">
            <Textarea
              value={draft.appreciation}
              onChange={(e) => set("appreciation", e.target.value)}
              placeholder="On time. Bags handled. Will request again."
            />
          </Field>
          <Field label="Private notes">
            <Textarea
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Traffic, route, anything to remember"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{trip ? "Save changes" : "Log trip"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
