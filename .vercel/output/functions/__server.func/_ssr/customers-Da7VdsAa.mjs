import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { f as Plus, s as Search, x as BookUser } from "../_libs/lucide-react.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { t as Badge } from "./badge-DOOmD4aS.mjs";
import { t as Input } from "./label-CSduPNKa.mjs";
import { t as CustomerDialog } from "./customer-dialog-Ddy3F37X.mjs";
import { t as Stars } from "./stars-CRpADltj.mjs";
import { o as formatDay, u as formatMoney, v as statsForCustomer } from "./stats-CJqAhYbt.mjs";
import { t as EmptyState } from "./empty-state-C6o3HKLm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-Da7VdsAa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const customers = useRunsheet((s) => s.customers);
	const trips = useRunsheet((s) => s.trips);
	const currency = useRunsheet((s) => s.settings.currency);
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return customers.map((c) => statsForCustomer(c, trips)).filter((s) => {
			if (!needle) return true;
			return `${s.customer.name} ${s.customer.phone} ${s.customer.notes}`.toLowerCase().includes(needle);
		}).sort((a, b) => {
			if (a.customer.regular !== b.customer.regular) return a.customer.regular ? -1 : 1;
			return b.gross - a.gross;
		});
	}, [
		customers,
		trips,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight italic",
					children: "People"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Everyone you have driven — and how they appreciated the work."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add customer"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search name, phone, notes"
				})]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: BookUser,
				title: customers.length === 0 ? "No customers yet" : "No matches",
				body: "Add the people you drive regularly. Their ratings and thanks live on their page.",
				action: customers.length === 0 ? "Add customer" : void 0,
				onAction: customers.length === 0 ? () => setOpen(true) : void 0
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/customers/$id",
					params: { id: row.customer.id },
					className: "flex items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: row.customer.name
								}), row.customer.regular ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Regular" }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									row.trips,
									" trips",
									row.lastTripAt ? ` · last ${formatDay(row.lastTripAt)}` : "",
									row.customer.phone ? ` · ${row.customer.phone}` : ""
								]
							}),
							row.lastAppreciation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 truncate font-display text-base italic",
								children: [
									"“",
									row.lastAppreciation,
									"”"
								]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 flex-col items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular",
							children: formatMoney(row.gross, currency)
						}), row.avgRating != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: Math.round(row.avgRating) }) : null]
					})]
				}) }, row.customer.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDialog, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
//#endregion
export { CustomersPage as component };
