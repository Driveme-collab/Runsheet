import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as Ellipsis, f as Plus, l as Route } from "../_libs/lucide-react.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { t as Badge } from "./badge-DOOmD4aS.mjs";
import { t as Stars } from "./stars-CRpADltj.mjs";
import { c as formatHours, g as minutesOf, h as kmOf, l as formatKm, m as grossOf, s as formatDayTime, t as avgRating, u as formatMoney, w as tripsIn } from "./stats-CJqAhYbt.mjs";
import { t as EmptyState } from "./empty-state-C6o3HKLm.mjs";
import { a as PLATFORM_LABEL } from "./types-C3EtAFKl.mjs";
import { t as TripDialog } from "./trip-dialog-DsOSBp94.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuSeparator, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-edkzH-cY.mjs";
import { t as PeriodTabs } from "./period-tabs-D-JXlIAE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trips-CeaX2SGU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TripsPage() {
	const trips = useRunsheet((s) => s.trips);
	const customers = useRunsheet((s) => s.customers);
	const currency = useRunsheet((s) => s.settings.currency);
	const deleteTrip = useRunsheet((s) => s.deleteTrip);
	const [period, setPeriod] = (0, import_react.useState)("week");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const list = (0, import_react.useMemo)(() => tripsIn(trips, period).sort((a, b) => b.startedAt.localeCompare(a.startedAt)), [trips, period]);
	const names = (0, import_react.useMemo)(() => new Map(customers.map((c) => [c.id, c.name])), [customers]);
	const rating = avgRating(list);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				title: "Trips",
				subtitle: "Every job, fare, tip and word of thanks.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Log trip"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodTabs, {
				value: period,
				onChange: setPeriod
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Trips",
						value: String(list.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Gross",
						value: formatMoney(grossOf(list), currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Distance",
						value: formatKm(kmOf(list))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Hours / rating",
						value: `${formatHours(minutesOf(list))} · ${rating?.toFixed(1) ?? "—"}`
					})
				]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Route,
				title: "No trips in this period",
				body: "Log a job as you finish it — fare, platform, and how the customer received you.",
				action: "Log trip",
				onAction: () => {
					setEditing(null);
					setOpen(true);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: list.map((t) => {
					const name = t.customerId ? names.get(t.customerId) : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium",
										children: [
											t.pickup,
											" → ",
											t.dropoff
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											formatDayTime(t.startedAt),
											name ? ` · ${name}` : "",
											" · ",
											PLATFORM_LABEL[t.platform],
											t.distanceKm ? ` · ${formatKm(t.distanceKm)}` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm tabular",
										children: formatMoney(t.fare + t.tip, currency)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon-sm",
											"aria-label": "Trip actions",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => {
													setEditing(t);
													setOpen(true);
												},
												children: "Edit"
											}),
											t.customerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/customers/$id",
													params: { id: t.customerId },
													children: "View customer"
												})
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												className: "text-expense",
												onClick: () => deleteTrip(t.id),
												children: "Delete"
											})
										]
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-2",
								children: [t.tip > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "income",
									children: ["Tip ", formatMoney(t.tip, currency)]
								}) : null, t.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: t.rating }) : null]
							}),
							t.appreciation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-display text-base leading-snug italic text-foreground/90",
								children: [
									"“",
									t.appreciation,
									"”"
								]
							}) : null
						]
					}, t.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripDialog, {
				open,
				onOpenChange: (v) => {
					setOpen(v);
					if (!v) setEditing(null);
				},
				trip: editing
			})
		]
	});
}
function Header({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-tight italic",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: subtitle
		})] }), action]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm font-medium tabular",
			children: value
		})]
	});
}
//#endregion
export { TripsPage as component };
