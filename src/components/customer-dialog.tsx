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
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerStatus,
} from "@/lib/types";

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}) {
  const addCustomer = useRunsheet((s) => s.addCustomer);
  const updateCustomer = useRunsheet((s) => s.updateCustomer);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<CustomerStatus>("occasional");

  useEffect(() => {
    if (!open) return;
    setName(customer?.name ?? "");
    setPhone(customer?.phone ?? "");
    setNotes(customer?.notes ?? "");
    setStatus(customer?.status ?? (customer?.regular ? "regular" : "occasional"));
  }, [open, customer]);

  function save() {
    if (!name.trim()) {
      toast.error("A name is required.");
      return;
    }
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      status,
      regular: status === "regular" || status === "vip",
    };
    if (customer) {
      updateCustomer(customer.id, payload);
      toast.success("Customer updated");
    } else {
      addCustomer(payload);
      toast.success("Customer added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? "Edit customer" : "Add a customer"}</DialogTitle>
          <DialogDescription>
            Your personal record of the people you drive — not a company CRM.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="078 000 0000" />
          </Field>
          <Field label="Standing">
            <Select value={status} onValueChange={(v) => setStatus(v as CustomerStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {CUSTOMER_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferences, address notes, how they like to be driven"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{customer ? "Save changes" : "Add customer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
