import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRunsheet } from "@/lib/store";
import {
  CAREER_PATHS,
  CITY_PLACEHOLDER,
  CURRENCIES,
  DEFAULT_CURRENCY,
  DRIVING_SITUATION_LABEL,
  DRIVING_SITUATIONS,
  PLATFORM_LABEL,
  PLATFORMS,
  type CurrencyCode,
  type DrivingSituation,
  type Platform,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const complete = useRunsheet((s) => s.completeOnboarding);
  const addGoal = useRunsheet((s) => s.addGoal);
  const setFundTarget = useRunsheet((s) => s.setFundTarget);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [situation, setSituation] = useState<DrivingSituation>("own");
  const [sources, setSources] = useState<Platform[]>(["cash"]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [fundTarget, setFund] = useState("");
  const [career, setCareer] = useState("");

  const last = 6;
  const canNext =
    step === 0
      ? name.trim().length > 1
      : step === 2
        ? sources.length > 0
        : true;

  function toggleSource(p: Platform) {
    setSources((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  function finish() {
    const target = Number(goalAmount) || 0;
    complete({
      driverName: name.trim(),
      city: city.trim(),
      currency,
      drivingSituation: situation,
      workSources: sources,
      vehicleMake: make.trim(),
      vehicleModel: model.trim(),
      plate: plate.trim(),
      nextLevel: career.trim()
        ? {
            target: career.trim(),
            why: "",
            moneyRequired: 0,
            skillsNeeded: "",
            actions: "",
            deadline: "",
            progressPct: 0,
          }
        : null,
    });
    if (goalTitle.trim() && target > 0) {
      addGoal({
        title: goalTitle.trim(),
        category: "financial",
        targetAmount: target,
        savedAmount: 0,
        deadline: "",
        note: "",
      });
    }
    const ef = Number(fundTarget);
    if (Number.isFinite(ef) && ef > 0) setFundTarget(ef);
  }

  function skip() {
    complete({
      driverName: name.trim() || "Driver",
      city: city.trim(),
      currency,
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <picture className="absolute inset-0">
        <source media="(min-width: 640px)" srcSet="/cover-hero.jpg" />
        <img
          src="/cover-portrait.jpg"
          alt=""
          className="size-full object-cover object-top"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/45" />
      <div className="relative flex h-full items-end justify-center p-4 sm:items-center">
        <div className="w-full max-w-md rounded-xl bg-card/95 p-6 shadow-[var(--shadow-border)] backdrop-blur-md sm:p-8">
        <p className="font-display text-2xl italic tracking-tight">Runsheet</p>
        <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
          Work. Money. Vehicle. Goals. Growth.
        </p>
        <p className="mt-6 font-display text-3xl tracking-tight">
          {step === 0 && "What should we call you?"}
          {step === 1 && "How do you drive?"}
          {step === 2 && "Where does the work come from?"}
          {step === 3 && "The vehicle"}
          {step === 4 && "A first financial goal"}
          {step === 5 && "Emergency fund (optional)"}
          {step === 6 && "Your next level"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === 0 && "This is your space. Records stay on this device. City and currency can change later in Profile."}
          {step === 1 && "So the book can describe the car honestly."}
          {step === 2 && "Private jobs, platforms, or an operator — pick all that apply."}
          {step === 3 && "Add what you know. You can finish this later."}
          {step === 4 && "Name what the work is for. Skip if you are not ready."}
          {step === 5 && "A buffer if the car sits. Not financial advice — a number you choose."}
          {step === 6 && "Where do you want to go? You can write your own."}
        </p>

        <div className="mt-6">
          {step === 0 ? (
            <div className="grid gap-3">
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={CITY_PLACEHOLDER}
              />
              <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
                <SelectTrigger aria-label="Currency">
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
            </div>
          ) : null}
          {step === 1 ? (
            <div className="flex flex-col gap-2">
              {DRIVING_SITUATIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSituation(s)}
                  className={cn(
                    "h-12 rounded-lg px-4 text-left text-sm",
                    situation === s ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                  )}
                >
                  {DRIVING_SITUATION_LABEL[s]}
                </button>
              ))}
            </div>
          ) : null}
          {step === 2 ? (
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleSource(p)}
                  className={cn(
                    "h-11 rounded-lg px-3 text-sm",
                    sources.includes(p) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                  )}
                >
                  {PLATFORM_LABEL[p]}
                </button>
              ))}
            </div>
          ) : null}
          {step === 3 ? (
            <div className="grid gap-3">
              <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make — Toyota" />
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model — Succeed" />
              <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Plate — RAD 000 A" />
            </div>
          ) : null}
          {step === 4 ? (
            <div className="grid gap-3">
              <Input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="School fees, tyres, a deposit"
              />
              <Input
                inputMode="decimal"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="Target amount"
              />
            </div>
          ) : null}
          {step === 5 ? (
            <Input
              inputMode="decimal"
              value={fundTarget}
              onChange={(e) => setFund(e.target.value)}
              placeholder="e.g. 500000"
            />
          ) : null}
          {step === 6 ? (
            <div className="grid gap-3">
              <Input
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                placeholder="Write your own target"
              />
              <div className="flex flex-col gap-1.5">
                {CAREER_PATHS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCareer(p)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-left text-sm",
                      career === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-2">
          <button type="button" className="h-11 text-sm text-muted-foreground" onClick={skip}>
            Skip for now
          </button>
          <div className="flex gap-2">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            {step < last ? (
              <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button onClick={finish}>Open my book</Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Step {step + 1} of {last + 1}
        </p>
        </div>
      </div>
    </div>
  );
}
