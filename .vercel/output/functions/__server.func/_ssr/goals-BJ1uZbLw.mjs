import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as Plus, g as Flag } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { n as Label, t as Input } from "./label-CSduPNKa.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-BXRUw8ZT.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { _ as spendOf, i as expensesIn, m as grossOf, u as formatMoney, w as tripsIn } from "./stats-CJqAhYbt.mjs";
import { t as EmptyState } from "./empty-state-C6o3HKLm.mjs";
import { n as CardContent, t as Card } from "./card-C0KUkT6v.mjs";
import { t as Progress } from "./progress-DIyUNxwn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goals-BJ1uZbLw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoalDialog({ open, onOpenChange, goal }) {
	const addGoal = useRunsheet((s) => s.addGoal);
	const updateGoal = useRunsheet((s) => s.updateGoal);
	const [title, setTitle] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)("");
	const [deadline, setDeadline] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle(goal?.title ?? "");
		setTarget(goal ? String(goal.targetAmount) : "");
		setSaved(goal ? String(goal.savedAmount) : "");
		setDeadline(goal?.deadline ?? "");
		setNote(goal?.note ?? "");
	}, [open, goal]);
	function save() {
		const targetAmount = Number(target);
		if (!title.trim() || !Number.isFinite(targetAmount) || targetAmount <= 0) {
			toast.error("A title and a target amount are required.");
			return;
		}
		const payload = {
			title: title.trim(),
			targetAmount,
			savedAmount: Number(saved) || 0,
			deadline,
			note: note.trim()
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: goal ? "Edit goal" : "New goal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Put a number on the thing you are driving toward — tyres, fees, a deposit." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "What is it for" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "School fees"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: target,
								onChange: (e) => setTarget(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Already set aside" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: saved,
								onChange: (e) => setSaved(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deadline (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: deadline,
							onChange: (e) => setDeadline(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: note,
							onChange: (e) => setNote(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				children: goal ? "Save changes" : "Add goal"
			})] })
		] })
	});
}
function GoalsPage() {
	const goals = useRunsheet((s) => s.goals);
	const trips = useRunsheet((s) => s.trips);
	const expenses = useRunsheet((s) => s.expenses);
	const settings = useRunsheet((s) => s.settings);
	const updateGoal = useRunsheet((s) => s.updateGoal);
	const deleteGoal = useRunsheet((s) => s.deleteGoal);
	const updateSettings = useRunsheet((s) => s.updateSettings);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [weekly, setWeekly] = (0, import_react.useState)(String(settings.weeklyTarget || ""));
	const weekNet = (0, import_react.useMemo)(() => {
		return grossOf(tripsIn(trips, "week")) - spendOf(expensesIn(expenses, "week"));
	}, [trips, expenses]);
	const monthNet = (0, import_react.useMemo)(() => {
		return grossOf(tripsIn(trips, "month")) - spendOf(expensesIn(expenses, "month"));
	}, [trips, expenses]);
	const currency = settings.currency;
	const targetPct = settings.weeklyTarget > 0 ? Math.min(100, Math.round(weekNet / settings.weeklyTarget * 100)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight italic",
					children: "Goals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "The week’s net is the engine. Name what it is for."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New goal"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Weekly income target"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-4xl tabular",
						children: formatMoney(weekNet, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: ["kept this week", settings.weeklyTarget > 0 ? ` of ${formatMoney(settings.weeklyTarget, currency)} (${targetPct}%)` : ". Set a target below."]
					}),
					settings.weeklyTarget > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						className: "mt-4",
						value: targetPct
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 flex flex-col gap-2 sm:flex-row",
						onSubmit: (e) => {
							e.preventDefault();
							updateSettings({ weeklyTarget: Number(weekly) || 0 });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 flex-1 rounded-md border border-input bg-secondary/50 px-3 text-sm",
							inputMode: "decimal",
							value: weekly,
							onChange: (e) => setWeekly(e.target.value),
							placeholder: "Weekly target",
							"aria-label": "Weekly target"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							children: "Save target"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [
							"This month so far: ",
							formatMoney(monthNet, currency),
							" net.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/reports",
								className: "underline-offset-4 hover:underline",
								children: "Open the operator report"
							})
						]
					})
				]
			}) }),
			goals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Flag,
				title: "Nothing named yet",
				body: "Tyres, school fees, a deposit — write the number. Add what you set aside after a good week.",
				action: "New goal",
				onAction: () => setOpen(true)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: goals.map((g) => {
					const pct = g.targetAmount ? Math.min(100, Math.round(g.savedAmount / g.targetAmount * 100)) : 0;
					const remain = Math.max(0, g.targetAmount - g.savedAmount);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: g.title
								}), g.deadline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: ["By ", format(/* @__PURE__ */ new Date(`${g.deadline}T12:00:00`), "d MMMM yyyy")]
								}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-2xl tabular",
									children: [pct, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-4",
								value: pct
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									formatMoney(g.savedAmount, currency),
									" of ",
									formatMoney(g.targetAmount, currency),
									" ·",
									" ",
									formatMoney(remain, currency),
									" to go"
								]
							}),
							g.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm",
								children: g.note
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => updateGoal(g.id, { savedAmount: g.savedAmount + Math.max(0, Math.round(weekNet * .2)) }),
										children: "Add 20% of this week"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											setEditing(g);
											setOpen(true);
										},
										children: "Edit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-expense",
										onClick: () => deleteGoal(g.id),
										children: "Remove"
									})
								]
							})
						]
					}, g.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalDialog, {
				open,
				onOpenChange: (v) => {
					setOpen(v);
					if (!v) setEditing(null);
				},
				goal: editing
			})
		]
	});
}
//#endregion
export { GoalsPage as component };
