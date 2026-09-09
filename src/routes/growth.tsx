import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Field } from "@/components/page-header";
import { ActivityDialog } from "@/components/record-dialogs";
import { useRunsheet } from "@/lib/store";
import { formatMoney } from "@/lib/money";
import { growthReport, milestones } from "@/lib/growth";
import { CAREER_PATHS, SKILL_AREA_LABEL, SKILL_STATUS_LABEL, type SkillStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/growth")({ component: GrowthPage });

function GrowthPage() {
  const settings = useRunsheet((s) => s.settings);
  const updateSettings = useRunsheet((s) => s.updateSettings);
  const skills = useRunsheet((s) => s.skills);
  const upsertSkill = useRunsheet((s) => s.upsertSkill);
  const trips = useRunsheet((s) => s.trips);
  const expenses = useRunsheet((s) => s.expenses);
  const incomes = useRunsheet((s) => s.incomes);
  const allocations = useRunsheet((s) => s.allocations);
  const fund = useRunsheet((s) => s.fund);
  const savings = useRunsheet((s) => s.savings);
  const shifts = useRunsheet((s) => s.shifts);
  const goals = useRunsheet((s) => s.goals);
  const documents = useRunsheet((s) => s.documents);
  const maintenance = useRunsheet((s) => s.maintenance);
  const activities = useRunsheet((s) => s.activities);
  const deleteActivity = useRunsheet((s) => s.deleteActivity);
  const currency = settings.currency;
  const nl = settings.nextLevel;
  const [target, setTarget] = useState(nl?.target ?? "");
  const [why, setWhy] = useState(nl?.why ?? "");
  const [moneyRequired, setMoneyRequired] = useState(nl ? String(nl.moneyRequired || "") : "");
  const [skillsNeeded, setSkillsNeeded] = useState(nl?.skillsNeeded ?? "");
  const [actions, setActions] = useState(nl?.actions ?? "");
  const [deadline, setDeadline] = useState(nl?.deadline ?? "");
  const [progressPct, setProgressPct] = useState(nl ? String(nl.progressPct || "") : "");
  const [actOpen, setActOpen] = useState(false);

  const report = useMemo(
    () =>
      growthReport({
        trips,
        incomes,
        expenses,
        allocations,
        fund,
        shifts,
        goals,
        skills,
        documents,
        maintenance,
        savings,
      }),
    [trips, incomes, expenses, allocations, fund, shifts, goals, skills, documents, maintenance, savings],
  );
  const marks = useMemo(
    () => milestones({ trips, expenses, incomes, goals, fund, skills, maintenance }),
    [trips, expenses, incomes, goals, fund, skills, maintenance],
  );

  function saveNext() {
    updateSettings({
      nextLevel: {
        target: target.trim(),
        why: why.trim(),
        moneyRequired: Number(moneyRequired) || 0,
        skillsNeeded: skillsNeeded.trim(),
        actions: actions.trim(),
        deadline,
        progressPct: Math.max(0, Math.min(100, Number(progressPct) || 0)),
      },
      sampleData: false,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Growth"
        subtitle="Become the driver you are driving toward — skills, a next level, and a fair score."
      />

      <Tabs defaultValue="next">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="next">My next level</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="learn">Learning</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="marks">Look how far</TabsTrigger>
        </TabsList>

        <TabsContent value="next" className="flex flex-col gap-4">
          <Card>
            <CardContent className="grid gap-4">
              <p className="font-display text-2xl">Where do I want to go?</p>
              <Field label="Target">
                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Own my first vehicle"
                />
              </Field>
              <div className="flex flex-wrap gap-1.5">
                {CAREER_PATHS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTarget(p)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs",
                      target === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Field label="Why this matters">
                <Textarea value={why} onChange={(e) => setWhy(e.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Money that may be required">
                  <Input
                    inputMode="decimal"
                    value={moneyRequired}
                    onChange={(e) => setMoneyRequired(e.target.value)}
                  />
                </Field>
                <Field label="Deadline">
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </Field>
              </div>
              <Field label="Skills I need to learn">
                <Textarea value={skillsNeeded} onChange={(e) => setSkillsNeeded(e.target.value)} />
              </Field>
              <Field label="Actions I must take">
                <Textarea value={actions} onChange={(e) => setActions(e.target.value)} />
              </Field>
              <Field label="Progress (0–100)">
                <Input
                  inputMode="numeric"
                  value={progressPct}
                  onChange={(e) => setProgressPct(e.target.value)}
                />
              </Field>
              {nl ? <Progress value={nl.progressPct} /> : null}
              {nl && nl.moneyRequired > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Money side: {formatMoney(nl.moneyRequired, currency)} may be required. Pair this with a
                  goal if you are saving toward it.
                </p>
              ) : null}
              <Button className="w-fit" onClick={saveNext}>
                Save my next level
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <p className="mb-3 text-sm text-muted-foreground">
            Independent of any academy. Mark learning, complete, or need improvement.
          </p>
          <ul className="flex flex-col gap-2">
            {skills.map((s) => (
              <li key={s.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium">{SKILL_AREA_LABEL[s.area]}</p>
                  <div className="flex flex-wrap gap-1">
                    {(["learning", "completed", "improve"] as SkillStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() =>
                          upsertSkill({ ...s, status: st, updatedAt: new Date().toISOString() })
                        }
                        className={cn(
                          "h-9 rounded-md px-3 text-xs",
                          s.status === st ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {SKILL_STATUS_LABEL[st]}
                      </button>
                    ))}
                  </div>
                </div>
                {s.notes !== undefined ? (
                  <Textarea
                    className="mt-3"
                    rows={2}
                    value={s.notes}
                    onChange={(e) => upsertSkill({ ...s, notes: e.target.value, updatedAt: new Date().toISOString() })}
                    placeholder="A short private note"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="learn">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              A personal log of what you practised. Future training records can sit beside this.
            </p>
            <Button onClick={() => setActOpen(true)}>Log learning</Button>
          </div>
          {activities.length === 0 ? (
            <p className="rounded-xl bg-card p-5 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
              Complete one learning mark this week. It does not have to be a course.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activities.map((a) => (
                <li key={a.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.date} · {SKILL_AREA_LABEL[a.area]}
                      </p>
                      {a.notes ? <p className="mt-2 text-sm text-muted-foreground">{a.notes}</p> : null}
                    </div>
                    <button type="button" className="text-xs text-expense" onClick={() => deleteActivity(a.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="score">
          <Card>
            <CardContent>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Driver growth score</p>
              <p className="mt-1 font-display text-5xl tabular">{report.total}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Average of seven visible dimensions. Not a mysterious rating, and not shared with any employer.
              </p>
              {report.improved.length ? (
                <p className="mt-3 text-sm">Your stronger areas: {report.improved.join(", ")}.</p>
              ) : null}
              {report.focus.length ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Worth attention: {report.focus.join(", ")}.
                </p>
              ) : null}
              <ul className="mt-5 flex flex-col gap-4">
                {report.dimensions.map((d) => (
                  <li key={d.key}>
                    <div className="flex justify-between text-sm">
                      <span>{d.label}</span>
                      <span className="tabular">{d.score}</span>
                    </div>
                    <Progress className="mt-1.5" value={d.score} />
                    <p className="mt-1 text-xs text-muted-foreground">{d.why}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks">
          <p className="mb-3 text-sm text-muted-foreground">Look how far you’ve come — not a game, a record.</p>
          <ul className="flex flex-col gap-2">
            {marks.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
                  !m.unlocked && "opacity-60",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
                  </div>
                  <Badge variant={m.unlocked ? "income" : "default"}>
                    {m.unlocked ? "Reached" : "Still open"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
      <ActivityDialog open={actOpen} onOpenChange={setActOpen} />
    </div>
  );
}
