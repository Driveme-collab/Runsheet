import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookUser, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CUSTOMER_STATUS_LABEL } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { CustomerDialog } from "@/components/customer-dialog";
import { Stars } from "@/components/stars";
import { useRunsheet } from "@/lib/store";
import { formatDay } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { statsForCustomer } from "@/lib/stats";

export const Route = createFileRoute("/customers")({ component: CustomersPage });

function CustomersPage() {
  const customers = useRunsheet((s) => s.customers);
  const trips = useRunsheet((s) => s.trips);
  const currency = useRunsheet((s) => s.settings.currency);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return customers
      .map((c) => statsForCustomer(c, trips))
      .filter((s) => {
        if (!needle) return true;
        const hay = `${s.customer.name} ${s.customer.phone} ${s.customer.notes}`.toLowerCase();
        return hay.includes(needle);
      })
      .sort((a, b) => {
        if (a.customer.regular !== b.customer.regular) return a.customer.regular ? -1 : 1;
        return b.gross - a.gross;
      });
  }, [customers, trips, q]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight italic">People</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personal customer record — not a company CRM.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add customer
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, notes"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={BookUser}
          title={customers.length === 0 ? "No customers yet" : "No matches"}
          body="Add the people you drive regularly. Their ratings and thanks live on their page."
          action={customers.length === 0 ? "Add customer" : undefined}
          onAction={customers.length === 0 ? () => setOpen(true) : undefined}
        />
      ) : (
        <ul className="grid gap-2">
          {rows.map((row) => (
            <li key={row.customer.id}>
              <Link
                to="/customers/$id"
                params={{ id: row.customer.id }}
                className="flex items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{row.customer.name}</p>
                    {row.customer.status !== "occasional" ? (
                      <Badge>{CUSTOMER_STATUS_LABEL[row.customer.status]}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {row.trips} trips
                    {row.lastTripAt ? ` · last ${formatDay(row.lastTripAt)}` : ""}
                    {row.customer.phone ? ` · ${row.customer.phone}` : ""}
                  </p>
                  {row.lastAppreciation ? (
                    <p className="mt-2 truncate font-display text-base italic">“{row.lastAppreciation}”</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="text-sm tabular">{formatMoney(row.gross, currency)}</p>
                  {row.avgRating != null ? <Stars value={Math.round(row.avgRating)} /> : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <CustomerDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
