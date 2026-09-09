import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { n as Label, t as Input } from "./label-CSduPNKa.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-BXRUw8ZT.mjs";
import { x as todayDateInput } from "./stats-CJqAhYbt.mjs";
import { n as EXPENSE_CATEGORIES, r as EXPENSE_LABEL } from "./types-C3EtAFKl.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DuZF9ThO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expense-dialog-Cja8E-1v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyDraft() {
	return {
		date: todayDateInput(),
		category: "fuel",
		amount: "",
		note: "",
		odometerKm: ""
	};
}
function ExpenseDialog({ open, onOpenChange, expense }) {
	const addExpense = useRunsheet((s) => s.addExpense);
	const updateExpense = useRunsheet((s) => s.updateExpense);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (expense) setDraft({
			date: expense.date,
			category: expense.category,
			amount: String(expense.amount),
			note: expense.note,
			odometerKm: expense.odometerKm != null ? String(expense.odometerKm) : ""
		});
		else setDraft(emptyDraft());
	}, [open, expense]);
	function save() {
		const amount = Number(draft.amount);
		if (!Number.isFinite(amount) || amount <= 0) {
			toast.error("Enter an amount greater than zero.");
			return;
		}
		const payload = {
			date: draft.date,
			category: draft.category,
			amount,
			note: draft.note.trim(),
			odometerKm: draft.odometerKm ? Number(draft.odometerKm) : null
		};
		if (expense) {
			updateExpense(expense.id, payload);
			toast.success("Expense updated");
		} else {
			addExpense(payload);
			toast.success("Expense recorded");
		}
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: expense ? "Edit expense" : "Record an expense" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Fuel, tyres, data, permits — anything the car (or the job) took today." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.date,
								onChange: (e) => setDraft({
									...draft,
									date: e.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.category,
								onValueChange: (v) => setDraft({
									...draft,
									category: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c,
									children: EXPENSE_LABEL[c]
								}, c)) })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: draft.amount,
								onChange: (e) => setDraft({
									...draft,
									amount: e.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Odometer (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: draft.odometerKm,
								onChange: (e) => setDraft({
									...draft,
									odometerKm: e.target.value
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft.note,
							onChange: (e) => setDraft({
								...draft,
								note: e.target.value
							}),
							placeholder: "Station, garage, what was done"
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
				children: expense ? "Save changes" : "Record expense"
			})] })
		] })
	});
}
//#endregion
export { ExpenseDialog as t };
