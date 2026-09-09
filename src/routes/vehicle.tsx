import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Car, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodTabs } from "@/components/period-tabs";
import { PageHeader, Field, StatCard } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { DocumentDialog, MaintenanceDialog } from "@/components/record-dialogs";
import { useRunsheet } from "@/lib/store";
import { formatKm, formatMoney } from "@/lib/money";
import { documentStatus } from "@/lib/calendar-items";
import {
  costPerKm,
  expensesIn,
  fuelEnergyCost,
  kmOf,
  maintenanceCost,
  moneySnapshot,
  monthTrend,
  tripsIn,
  vehicleCosts,
  vehicleNetContribution,
} from "@/lib/finance";
import {
  DRIVING_SITUATION_LABEL,
  DRIVING_SITUATIONS,
  FUEL_TYPE_LABEL,
  FUEL_TYPES,
  MAINTENANCE_LABEL,
  type DrivingSituation,
  type FuelType,
  type PeriodKey,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/vehicle")({ component: VehiclePage });

function VehiclePage() {
  const settings = useRunsheet((s) => s.settings);
  const updateSettings = useRunsheet((s) => s.updateSettings);
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const shifts = useRunsheet((s) => s.shifts);
  const maintenance = useRunsheet((s) => s.maintenance);
  const documents = useRunsheet((s) => s.documents);
  const deleteMaintenance = useRunsheet((s) => s.deleteMaintenance);
  const deleteDocument = useRunsheet((s) => s.deleteDocument);
  const currency = settings.currency;
  const named = [settings.vehicleMake, settings.vehicleModel].filter(Boolean).join(" ");
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [mOpen, setMOpen] = useState(false);
  const [dOpen, setDOpen] = useState(false);

  const snap = useMemo(
    () => moneySnapshot({ trips, incomes, expenses, allocations, fund, shifts, savings, period }),
    [trips, incomes, expenses, allocations, fund, shifts, savings, period],
  );
  const periodTrips = tripsIn(trips, period);
  const periodExp = expensesIn(expenses, period);
  const veh = vehicleCosts(periodExp);
  const net = vehicleNetContribution(periodTrips, [], periodExp);
  const km = kmOf(periodTrips);
  const perKm = costPerKm(veh, km);
  const trend = useMemo(
    () => monthTrend({ trips, incomes, expenses, allocations, fund, shifts, savings }),
    [trips, incomes, expenses, allocations, fund, shifts, savings],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle"
        subtitle="Your vehicle is not only transportation. It is an income-producing asset."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setDOpen(true)}>
              Document
            </Button>
            <Button onClick={() => setMOpen(true)}>
              <Plus className="size-4" />
              Log service
            </Button>
          </div>
        }
      />

      {!named ? (
        <EmptyState
          icon={Car}
          title="Add your vehicle"
          body="Add your vehicle to start tracking its operating cost."
        />
      ) : (
        <section className="rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {settings.year} · {settings.plate || "No plate yet"} · {FUEL_TYPE_LABEL[settings.fuelType]}
          </p>
          <p className="mt-1 font-display text-4xl tracking-tight italic">{named}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {DRIVING_SITUATION_LABEL[settings.drivingSituation]}
            {settings.currentMileage
              ? ` · ${settings.currentMileage.toLocaleString("en-RW")} km on the clock`
              : ""}
          </p>
        </section>
      )}

      <Tabs defaultValue="performance">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="service">Maintenance</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="flex flex-col gap-4">
          <PeriodTabs value={period} onChange={setPeriod} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Revenue generated" value={formatMoney(snap.fares + snap.tips, currency)} hint={`${periodTrips.length} trips`} />
            <StatCard label="Operating cost" value={formatMoney(veh, currency)} hint="Vehicle categories only" />
            <StatCard label="Fuel / energy" value={formatMoney(fuelEnergyCost(periodExp), currency)} />
            <StatCard label="Maintenance" value={formatMoney(maintenanceCost(periodExp), currency)} />
            <StatCard label="Total vehicle cost" value={formatMoney(veh, currency)} />
            <StatCard
              label="Net contribution"
              value={formatMoney(net, currency)}
              hint={`${formatKm(km)} this period`}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              label="Cost per km"
              value={perKm == null ? "—" : formatMoney(perKm, currency)}
              hint={perKm == null ? "Log distance on trips to see this" : "Vehicle cost ÷ kilometres"}
            />
            <StatCard
              label="Revenue per km"
              value={costPerKm(snap.fares + snap.tips, km) == null ? "—" : formatMoney(costPerKm(snap.fares + snap.tips, km) ?? 0, currency)}
              hint="Trip revenue ÷ kilometres"
            />
          </div>
          {trend.some((r) => r.income > 0 || r.vehicle > 0) ? (
            <Card>
              <CardContent>
                <h3 className="font-display text-xl">Six-month vehicle cost</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Revenue against vehicle operating cost. Empty months stay empty.
                </p>
                <div className="mt-4 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ReTooltip
                        contentStyle={{
                          background: "var(--color-popover)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 8,
                          color: "var(--color-foreground)",
                          fontSize: 12,
                        }}
                        formatter={(value, name) => [
                          formatMoney(Number(value ?? 0), currency),
                          name === "income" ? "Revenue" : "Vehicle cost",
                        ]}
                      />
                      <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                      <Bar dataKey="vehicle" fill="var(--color-expense)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Net contribution is trip revenue minus vehicle operating cost. It is not take-home pay — work
            still has to cover family, savings and the rest of life.
          </p>
        </TabsContent>

        <TabsContent value="service">
          {maintenance.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No service on the book"
              body="Log oil, tyres, brakes. Upcoming dates appear on the calendar."
              action="Log service"
              onAction={() => setMOpen(true)}
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {maintenance.map((m) => (
                <li key={m.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{m.description || MAINTENANCE_LABEL[m.kind]}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {format(new Date(`${m.date}T12:00:00`), "d MMM yyyy")}
                        {m.mileage ? ` · ${m.mileage.toLocaleString("en-RW")} km` : ""}
                        {m.cost ? ` · ${formatMoney(m.cost, currency)}` : ""}
                      </p>
                      {m.nextDueDate ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Next: {format(new Date(`${m.nextDueDate}T12:00:00`), "d MMM yyyy")}
                          {m.nextDueMileage ? ` or ${m.nextDueMileage.toLocaleString("en-RW")} km` : ""}
                        </p>
                      ) : null}
                      {m.notes ? <p className="mt-2 text-sm">{m.notes}</p> : null}
                    </div>
                    <button
                      type="button"
                      className="text-xs text-expense"
                      onClick={() => deleteMaintenance(m.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="docs">
          {documents.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No documents yet"
              body="Licence, insurance, inspection — dates you choose, with a reminder when they draw near."
              action="Add a document"
              onAction={() => setDOpen(true)}
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {documents.map((d) => {
                const st = documentStatus(d);
                return (
                  <li key={d.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{d.name}</p>
                          <Badge variant={st.tone === "expired" ? "expense" : st.tone === "soon" ? "outline" : "default"}>
                            {st.label}
                          </Badge>
                        </div>
                        {d.expiryDate ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Expires {format(new Date(`${d.expiryDate}T12:00:00`), "d MMMM yyyy")}
                          </p>
                        ) : null}
                        {d.notes ? <p className="mt-2 text-sm">{d.notes}</p> : null}
                      </div>
                      <button type="button" className="text-xs text-expense" onClick={() => deleteDocument(d.id)}>
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Make">
                  <Input
                    value={settings.vehicleMake}
                    onChange={(e) => updateSettings({ vehicleMake: e.target.value, sampleData: false })}
                    placeholder="Toyota"
                  />
                </Field>
                <Field label="Model">
                  <Input
                    value={settings.vehicleModel}
                    onChange={(e) => updateSettings({ vehicleModel: e.target.value })}
                    placeholder="Succeed"
                  />
                </Field>
                <Field label="Year">
                  <Input
                    value={settings.year}
                    onChange={(e) => updateSettings({ year: e.target.value })}
                    placeholder="2016"
                  />
                </Field>
                <Field label="Plate">
                  <Input
                    value={settings.plate}
                    onChange={(e) => updateSettings({ plate: e.target.value })}
                    placeholder="RAD 000 A"
                  />
                </Field>
                <Field label="Fuel / energy">
                  <Select
                    value={settings.fuelType}
                    onValueChange={(v) => updateSettings({ fuelType: v as FuelType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {FUEL_TYPE_LABEL[f]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Driving situation">
                  <Select
                    value={settings.drivingSituation}
                    onValueChange={(v) => updateSettings({ drivingSituation: v as DrivingSituation })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DRIVING_SITUATIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {DRIVING_SITUATION_LABEL[d]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Current mileage (km)">
                  <Input
                    inputMode="numeric"
                    value={settings.currentMileage ? String(settings.currentMileage) : ""}
                    onChange={(e) => updateSettings({ currentMileage: Number(e.target.value) || 0 })}
                  />
                </Field>
                <Field label="Purchase value (optional)">
                  <Input
                    inputMode="decimal"
                    value={settings.purchaseValue != null ? String(settings.purchaseValue) : ""}
                    onChange={(e) =>
                      updateSettings({
                        purchaseValue: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </Field>
              </div>
              <Button
                variant="secondary"
                className="w-fit"
                onClick={() => toast.success("Vehicle profile saved")}
              >
                Saved as you type
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MaintenanceDialog open={mOpen} onOpenChange={setMOpen} />
      <DocumentDialog open={dOpen} onOpenChange={setDOpen} />
    </div>
  );
}
