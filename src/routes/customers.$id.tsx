import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomerDialog } from "@/components/customer-dialog";
import { TripDialog } from "@/components/trip-dialog";
import { Stars } from "@/components/stars";
import { useRunsheet } from "@/lib/store";
import { formatDayTime } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { statsForCustomer } from "@/lib/stats";
import { PLATFORM_LABEL, CUSTOMER_STATUS_LABEL } from "@/lib/types";

export const Route = createFileRoute("/customers/$id")({ component: CustomerDetail });

function CustomerDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const customer = useRunsheet((s) => s.customers.find((c) => c.id === id));
  const trips = useRunsheet((s) => s.trips);
  const currency = useRunsheet((s) => s.settings.currency);
  const deleteCustomer = useRunsheet((s) => s.deleteCustomer);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);

  const theirs = useMemo(
    () => trips.filter((t) => t.customerId === id).sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [trips, id],
  );
  const stats = customer ? statsForCustomer(customer, trips) : null;

  if (!customer || !stats) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl">No such customer</p>
        <Link to="/customers" className="mt-3 inline-block text-sm text-muted-foreground hover:underline">
          Back to people
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/customers"
          className="inline-flex h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          People
        </Link>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-4xl tracking-tight italic">{customer.name}</h1>
              {customer.status !== "occasional" ? (
                <Badge>{CUSTOMER_STATUS_LABEL[customer.status]}</Badge>
              ) : null}
            </div>
            {customer.phone ? (
              <a
                href={`tel:${customer.phone.replace(/\s/g, "")}`}
                className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="size-3.5" />
                {customer.phone}
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEdit(true)}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button variant="outline" className="text-expense" onClick={() => setConfirm(true)}>
              <Trash2 className="size-4" />
              Remove
            </Button>
            <Button onClick={() => setTripOpen(true)}>Log trip</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Spent with you</p>
            <p className="mt-1 font-display text-3xl tabular">{formatMoney(stats.gross, currency)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stats.trips} trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Tips</p>
            <p className="mt-1 font-display text-3xl tabular">{formatMoney(stats.tips, currency)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Cash thanks, counted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">How they rate you</p>
            <p className="mt-1 font-display text-3xl tabular">
              {stats.avgRating == null ? "—" : stats.avgRating.toFixed(1)}
            </p>
            <div className="mt-1">
              <Stars value={stats.avgRating == null ? null : Math.round(stats.avgRating)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {customer.notes ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Notes</p>
            <p className="mt-2 text-sm leading-relaxed">{customer.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <section>
        <h2 className="font-display text-2xl">Appreciation</h2>
        <div className="mt-3 flex flex-col gap-3">
          {theirs.filter((t) => t.appreciation.trim()).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              When they thank you — a rating, a sentence, a tip — log it on the trip. It lives here.
            </p>
          ) : (
            theirs
              .filter((t) => t.appreciation.trim())
              .map((t) => (
                <blockquote key={t.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <Stars value={t.rating} />
                  <p className="mt-2 font-display text-xl leading-snug italic">“{t.appreciation}”</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDayTime(t.startedAt)} · {t.pickup} → {t.dropoff}
                  </p>
                </blockquote>
              ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Trip history</h2>
        {theirs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No trips on file yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {theirs.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {t.pickup} → {t.dropoff}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDayTime(t.startedAt)} · {PLATFORM_LABEL[t.platform]}
                  </p>
                </div>
                <p className="text-sm tabular">{formatMoney(t.fare + t.tip, currency)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CustomerDialog open={edit} onOpenChange={setEdit} customer={customer} />
      <TripDialog open={tripOpen} onOpenChange={setTripOpen} defaultCustomerId={customer.id} />
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {customer.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Their trips stay in the book, unlinked. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                deleteCustomer(customer.id);
                void navigate({ to: "/customers" });
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
