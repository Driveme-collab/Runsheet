import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as Ellipsis, f as Plus, u as Receipt } from "../_libs/lucide-react.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { t as Badge } from "./badge-DOOmD4aS.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { _ as spendOf, i as expensesIn, n as byExpense, u as formatMoney } from "./stats-CJqAhYbt.mjs";
import { t as EmptyState } from "./empty-state-C6o3HKLm.mjs";
import { r as EXPENSE_LABEL } from "./types-C3EtAFKl.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuSeparator, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-edkzH-cY.mjs";
import { t as PeriodTabs } from "./period-tabs-D-JXlIAE.mjs";
import { t as ExpenseDialog } from "./expense-dialog-Cja8E-1v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-CvhqjqLb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExpensesPage() {
	const expenses = useRunsheet((s) => s.expenses);
	const currency = useRunsheet((s) => s.settings.currency);
	const deleteExpense = useRunsheet((s) => s.deleteExpense);
	const [period, setPeriod] = (0, import_react.useState)("week");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const list = (0, import_react.useMemo)(() => expensesIn(expenses, period).sort((a, b) => b.date.localeCompare(a.date)), [expenses, period]);
	const total = spendOf(list);
	const breakdown = byExpense(list);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight italic",
					children: "Car costs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Fuel, tyres, data, permits — what it takes to keep the car earning."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Record expense"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodTabs, {
				value: period,
				onChange: setPeriod
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card px-5 py-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Spent this period"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-4xl tabular",
						children: formatMoney(total, currency)
					}),
					breakdown.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 flex flex-col gap-2",
						children: breakdown.map((row) => {
							const pct = total ? Math.round(row.amount / total * 100) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: EXPENSE_LABEL[row.category] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular text-muted-foreground",
									children: [
										formatMoney(row.amount, currency),
										" · ",
										pct,
										"%"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-1.5 overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-expense/80",
									style: { width: `${pct}%` }
								})
							})] }, row.category);
						})
					}) : null
				]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Receipt,
				title: "No expenses in this period",
				body: "Log fuel as you fill up. Small costs disappear unless they are written down.",
				action: "Record expense",
				onAction: () => setOpen(true)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: list.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: EXPENSE_LABEL[e.category]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "expense",
									children: formatMoney(e.amount, currency)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [format(/* @__PURE__ */ new Date(`${e.date}T12:00:00`), "EEE d MMM"), e.odometerKm ? ` · ${e.odometerKm.toLocaleString("en-ZA")} km` : ""]
							}),
							e.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: e.note
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Expense actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => {
									setEditing(e);
									setOpen(true);
								},
								children: "Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								className: "text-expense",
								onClick: () => deleteExpense(e.id),
								children: "Delete"
							})
						]
					})] })]
				}, e.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseDialog, {
				open,
				onOpenChange: (v) => {
					setOpen(v);
					if (!v) setEditing(null);
				},
				expense: editing
			})
		]
	});
}
//#endregion
export { ExpensesPage as component };
