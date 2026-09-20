import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useRunsheet } from "@/lib/store";
import { CURRENCIES, type CurrencyCode } from "@/lib/types";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useRunsheet((s) => s.settings);
  const updateSettings = useRunsheet((s) => s.updateSettings);
  const startFresh = useRunsheet((s) => s.startFresh);
  const loadSample = useRunsheet((s) => s.loadSample);
  const state = useRunsheet();
  const [wipe, setWipe] = useState(false);
  const [sample, setSample] = useState(false);

  function exportJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      customers: state.customers,
      trips: state.trips,
      expenses: state.expenses,
      incomes: state.incomes,
      allocations: state.allocations,
      goals: state.goals,
      contributions: state.contributions,
      shifts: state.shifts,
      fund: state.fund,
      maintenance: state.maintenance,
      documents: state.documents,
      events: state.events,
      skills: state.skills,
      activities: state.activities,
      weeklyReviews: state.weeklyReviews,
      monthlyReviews: state.monthlyReviews,
      milestones: state.milestones,
      insights: state.insights,
      availability: state.availability,
      handoffs: state.handoffs,
      conversations: state.conversations,
      messages: state.messages,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `runsheet-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Records downloaded");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
        <img
          src="/cover-bg.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative px-5 py-8 sm:px-7">
          <h1 className="font-display text-4xl tracking-tight italic">Profile</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            This is your space. Preferences, privacy, and a copy of the book.
          </p>
        </div>
      </section>

      <Card>
        <CardContent className="grid gap-3">
          <h2 className="font-display text-xl">Privacy</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Family goals, savings, allocations and private notes live on this device. They are not sent to an
            employer, a platform, or Hillride. A future work connection could share trips or hours you choose —
            never this private layer, unless you export it yourself.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4">
          <h2 className="font-display text-xl">Driver</h2>
          <Field label="Name">
            <Input
              value={settings.driverName}
              onChange={(e) => updateSettings({ driverName: e.target.value, sampleData: false })}
              placeholder="Your name"
            />
          </Field>
          <Field label="City">
            <Input
              value={settings.city}
              onChange={(e) => updateSettings({ city: e.target.value })}
              placeholder="Kigali"
            />
          </Field>
          <Field label="Currency">
            <Select
              value={settings.currency}
              onValueChange={(v) => updateSettings({ currency: v as CurrencyCode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Weekly net-work target">
            <Input
              inputMode="decimal"
              value={settings.weeklyTarget ? String(settings.weeklyTarget) : ""}
              onChange={(e) => updateSettings({ weeklyTarget: Number(e.target.value) || 0 })}
              placeholder="0"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-3">
          <h2 className="font-display text-xl">Your records</h2>
          <p className="text-sm text-muted-foreground">
            Everything lives in this browser. Download a copy before you clear a device.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportJson}>
              Download JSON
            </Button>
            <Button variant="outline" onClick={() => setSample(true)}>
              Load Kigali sample
            </Button>
            <Button variant="outline" className="text-expense" onClick={() => setWipe(true)}>
              Start fresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={wipe} onOpenChange={setWipe}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear every record?</AlertDialogTitle>
            <AlertDialogDescription>
              Trips, money, goals and growth will be removed from this device. You will be asked a few setup
              questions again. Download a copy first if you need it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep records</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                startFresh();
                toast.success("Book cleared.");
              }}
            >
              Start fresh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={sample} onOpenChange={setSample}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace with the Kigali sample week?</AlertDialogTitle>
            <AlertDialogDescription>
              This overwrites what is on this device with Jean-Bosco’s sample Kigali week, so you can explore
              the product. RWF figures, Remera to Kanombe — not Cape Town.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                loadSample();
                toast.success("Sample week loaded");
              }}
            >
              Load sample
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
