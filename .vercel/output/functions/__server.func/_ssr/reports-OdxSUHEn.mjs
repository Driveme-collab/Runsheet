import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as Check, d as Printer, v as Copy } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { t as Stars } from "./stars-CRpADltj.mjs";
import { C as topCustomers, _ as spendOf, a as faresOf, c as formatHours, d as formatRangeLabel, g as minutesOf, h as kmOf, i as expensesIn, l as formatKm, n as byExpense, r as byPlatform, t as avgRating, u as formatMoney, w as tripsIn, y as tipsOf } from "./stats-CJqAhYbt.mjs";
import { n as CardContent, t as Card } from "./card-C0KUkT6v.mjs";
import { a as PLATFORM_LABEL, r as EXPENSE_LABEL } from "./types-C3EtAFKl.mjs";
import { t as PeriodTabs } from "./period-tabs-D-JXlIAE.mjs";
import { c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-OdxSUHEn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function buildOperatorReport(opts) {
	const { settings, trips, expenses, period } = opts;
	const currency = settings.currency;
	const fares = faresOf(trips);
	const tips = tipsOf(trips);
	const spend = spendOf(expenses);
	const net = fares + tips - spend;
	const rating = avgRating(trips);
	const vehicle = [
		settings.vehicleMake,
		settings.vehicleModel,
		settings.plate
	].filter(Boolean).join(" · ");
	const lines = [
		`*Runsheet* — ${formatRangeLabel(period)}`,
		[settings.driverName || "Driver", vehicle].filter(Boolean).join(" · "),
		"",
		`Trips: ${trips.length}`,
		`Hours: ${formatHours(minutesOf(trips))}`,
		`Distance: ${formatKm(kmOf(trips))}`,
		`Rating: ${rating == null ? "—" : rating.toFixed(1)}`,
		"",
		`Gross fares: ${formatMoney(fares, currency)}`,
		`Tips: ${formatMoney(tips, currency)}`,
		`Expenses: ${formatMoney(spend, currency)}`,
		`*Net: ${formatMoney(net, currency)}*`
	];
	const platforms = byPlatform(trips);
	if (platforms.length) {
		lines.push("", "By platform:");
		for (const row of platforms) lines.push(`• ${PLATFORM_LABEL[row.platform]}  ${formatMoney(row.gross, currency)}  (${row.trips})`);
	}
	const cats = byExpense(expenses);
	if (cats.length) {
		lines.push("", "Expenses:");
		for (const row of cats) lines.push(`• ${EXPENSE_LABEL[row.category]}  ${formatMoney(row.amount, currency)}`);
	}
	lines.push("", "Ready for operator.");
	return lines.join("\n");
}
function ReportsPage() {
	const settings = useRunsheet((s) => s.settings);
	const tripsAll = useRunsheet((s) => s.trips);
	const expensesAll = useRunsheet((s) => s.expenses);
	const customers = useRunsheet((s) => s.customers);
	const [period, setPeriod] = (0, import_react.useState)("week");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const trips = (0, import_react.useMemo)(() => tripsIn(tripsAll, period), [tripsAll, period]);
	const expenses = (0, import_react.useMemo)(() => expensesIn(expensesAll, period), [expensesAll, period]);
	const fares = faresOf(trips);
	const tips = tipsOf(trips);
	const spend = spendOf(expenses);
	const net = fares + tips - spend;
	const rating = avgRating(trips);
	const platforms = byPlatform(trips);
	const cats = byExpense(expenses);
	const top = topCustomers(customers, trips, 5);
	const currency = settings.currency;
	const vehicle = [
		settings.vehicleMake,
		settings.vehicleModel,
		settings.plate
	].filter(Boolean).join(" · ");
	const text = (0, import_react.useMemo)(() => buildOperatorReport({
		settings,
		trips,
		expenses,
		period
	}), [
		settings,
		trips,
		expenses,
		period
	]);
	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Report copied — paste it to your operator");
			window.setTimeout(() => setCopied(false), 1800);
		} catch {
			toast.error("Could not copy. Select the text below instead.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				"data-print-hide": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight italic",
					children: "Reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Accurate figures for your operator — copy, print, or just read them back."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: copy,
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy for operator"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-print-hide": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodTabs, {
					value: period,
					onChange: setPeriod
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)] sm:px-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Runsheet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-3xl tracking-tight",
						children: formatRangeLabel(period)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							settings.driverName || "Driver",
							vehicle ? ` · ${vehicle}` : "",
							settings.city ? ` · ${settings.city}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Trips",
								value: String(trips.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Hours",
								value: formatHours(minutesOf(trips))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Distance",
								value: formatKm(kmOf(trips))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Rating",
								value: rating == null ? "—" : rating.toFixed(1)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyCell, {
								label: "Gross fares",
								value: formatMoney(fares, currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyCell, {
								label: "Tips",
								value: formatMoney(tips, currency),
								tone: "income"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyCell, {
								label: "Expenses",
								value: formatMoney(spend, currency),
								tone: "expense"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 border-t border-border pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Net to driver"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-5xl tracking-tight tabular",
							children: formatMoney(net, currency)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "By platform"
						}),
						platforms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "No trips in this period."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-52",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: platforms.map((p) => ({
										...p,
										name: PLATFORM_LABEL[p.platform]
									})),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											stroke: "var(--color-border)",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											tick: {
												fill: "var(--color-muted-foreground)",
												fontSize: 11
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												background: "var(--color-popover)",
												border: "1px solid var(--color-border)",
												borderRadius: 8,
												fontSize: 12
											},
											formatter: (value) => formatMoney(Number(value ?? 0), currency)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "gross",
											fill: "var(--color-primary)",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 divide-y divide-border",
							children: platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									PLATFORM_LABEL[p.platform],
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"(",
											p.trips,
											")"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: formatMoney(p.gross, currency)
								})]
							}, p.platform))
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Costs by kind"
					}), cats.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "No expenses in this period."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border",
						children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: EXPENSE_LABEL[c.category] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular text-expense",
								children: formatMoney(c.amount, currency)
							})]
						}, c.category))
					})]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Top customers this period"
				}), top.filter((t) => t.trips > 0).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No named customers in this period."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: top.filter((t) => t.trips > 0).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: row.customer.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [row.trips, " trips"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [row.avgRating != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: Math.round(row.avgRating) }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm tabular",
								children: formatMoney(row.gross, currency)
							})]
						})]
					}, row.customer.id))
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				"data-print-hide": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Plain-text copy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Formatted for WhatsApp and email. Stars become bold on most operator chats."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-4 overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap",
							children: text
						})
					]
				})
			})
		]
	});
}
function Cell({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[11px] tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-display text-2xl tabular",
		children: value
	})] });
}
function MoneyCell({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-secondary px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: tone === "income" ? "mt-1 text-lg tabular text-income" : tone === "expense" ? "mt-1 text-lg tabular text-expense" : "mt-1 text-lg tabular",
			children: value
		})]
	});
}
//#endregion
export { ReportsPage as component };
