import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as ArrowRight, a as Square, f as Plus, g as Flag, i as Star } from "../_libs/lucide-react.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { t as Badge } from "./badge-DOOmD4aS.mjs";
import { t as Stars } from "./stars-CRpADltj.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { T as weekSeries, _ as spendOf, c as formatHours, g as minutesOf, h as kmOf, i as expensesIn, l as formatKm, m as grossOf, p as greeting, s as formatDayTime, t as avgRating, u as formatMoney, w as tripsIn } from "./stats-CJqAhYbt.mjs";
import { n as CardContent, t as Card } from "./card-C0KUkT6v.mjs";
import { a as PLATFORM_LABEL } from "./types-C3EtAFKl.mjs";
import { t as TripDialog } from "./trip-dialog-DsOSBp94.mjs";
import { t as ExpenseDialog } from "./expense-dialog-Cja8E-1v.mjs";
import { t as Progress } from "./progress-DIyUNxwn.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, o as CartesianGrid, r as YAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B8ULv1fp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const settings = useRunsheet((s) => s.settings);
	const trips = useRunsheet((s) => s.trips);
	const expenses = useRunsheet((s) => s.expenses);
	const goals = useRunsheet((s) => s.goals);
	const shifts = useRunsheet((s) => s.shifts);
	const startShift = useRunsheet((s) => s.startShift);
	const endShift = useRunsheet((s) => s.endShift);
	const [tripOpen, setTripOpen] = (0, import_react.useState)(false);
	const [expenseOpen, setExpenseOpen] = (0, import_react.useState)(false);
	const todayTrips = (0, import_react.useMemo)(() => tripsIn(trips, "today"), [trips]);
	const weekTrips = (0, import_react.useMemo)(() => tripsIn(trips, "week"), [trips]);
	const monthTrips = (0, import_react.useMemo)(() => tripsIn(trips, "month"), [trips]);
	const weekExp = (0, import_react.useMemo)(() => expensesIn(expenses, "week"), [expenses]);
	const monthExp = (0, import_react.useMemo)(() => expensesIn(expenses, "month"), [expenses]);
	const todayExp = (0, import_react.useMemo)(() => expensesIn(expenses, "today"), [expenses]);
	const weekGross = grossOf(weekTrips);
	const weekSpend = spendOf(weekExp);
	const weekNet = weekGross - weekSpend;
	const todayNet = grossOf(todayTrips) - spendOf(todayExp);
	const monthNet = grossOf(monthTrips) - spendOf(monthExp);
	const rating = avgRating(weekTrips);
	const chart = (0, import_react.useMemo)(() => weekSeries(trips, expenses), [trips, expenses]);
	const openShift = shifts.find((s) => !s.endedAt);
	const primaryGoal = [...goals].sort((a, b) => {
		const pa = a.targetAmount ? a.savedAmount / a.targetAmount : 0;
		return (b.targetAmount ? b.savedAmount / b.targetAmount : 0) - pa;
	})[0];
	const targetPct = settings.weeklyTarget > 0 ? Math.min(100, Math.round(weekNet / settings.weeklyTarget * 100)) : 0;
	const first = (settings.driverName || "driver").split(" ")[0];
	const recent = [...trips].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 5);
	const quotes = trips.filter((t) => t.appreciation.trim()).slice(0, 3);
	const currency = settings.currency;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			settings.sampleData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A sample week is loaded so you can look around. Your records stay on this device." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "font-medium text-foreground underline-offset-4 hover:underline",
					children: "Start fresh in Settings"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: format(/* @__PURE__ */ new Date(), "EEEE d MMMM")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-4xl tracking-tight italic sm:text-5xl",
					children: [
						greeting(),
						", ",
						first
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						openShift ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: endShift,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "End shift"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: startShift,
							children: "Start shift"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setExpenseOpen(true),
							children: "Cost"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setTripOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Log trip"]
						})
					]
				})]
			}),
			openShift ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-income",
						children: "On shift"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							" ",
							"since ",
							format(new Date(openShift.startedAt), "HH:mm")
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Today ",
						todayTrips.length,
						" trips · ",
						formatMoney(grossOf(todayTrips), currency),
						" gross ·",
						" ",
						formatKm(kmOf(todayTrips))
					]
				})]
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card px-5 py-6 shadow-[var(--shadow-border)] sm:px-7 sm:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "This week you kept"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-5xl tracking-tight tabular sm:text-6xl",
						children: formatMoney(weekNet, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 max-w-xl text-sm text-muted-foreground",
						children: [
							formatMoney(weekGross, currency),
							" in fares and tips, less ",
							formatMoney(weekSpend, currency),
							" in running costs.",
							settings.weeklyTarget > 0 ? ` Weekly target ${formatMoney(settings.weeklyTarget, currency)} — ${targetPct}% there.` : null
						]
					}),
					settings.weeklyTarget > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						className: "mt-5",
						value: targetPct
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Today",
						value: formatMoney(todayNet, currency),
						hint: `${todayTrips.length} trips`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "This month",
						value: formatMoney(monthNet, currency),
						hint: `${monthTrips.length} trips · ${formatHours(minutesOf(monthTrips))}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Week rating",
						value: rating == null ? "—" : rating.toFixed(1),
						hint: rating == null ? "No ratings yet" : `${weekTrips.filter((t) => t.rating).length} scored rides`,
						icon: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Week in motion"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Income vs costs"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-52",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: chart,
									margin: {
										top: 8,
										right: 8,
										left: 0,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "inc",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "var(--color-income)",
												stopOpacity: .35
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "var(--color-income)",
												stopOpacity: 0
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "exp",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "var(--color-expense)",
												stopOpacity: .3
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "var(--color-expense)",
												stopOpacity: 0
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											stroke: "var(--color-border)",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "day",
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
												color: "var(--color-foreground)",
												fontSize: 12
											},
											formatter: (value, name) => [formatMoney(Number(value ?? 0), currency), name === "income" ? "Income" : "Costs"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "income",
											stroke: "var(--color-income)",
											fill: "url(#inc)",
											strokeWidth: 1.6
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "spend",
											stroke: "var(--color-expense)",
											fill: "url(#exp)",
											strokeWidth: 1.6
										})
									]
								})
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex h-full flex-col pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Toward a goal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4 text-muted-foreground" })]
						}), primaryGoal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: primaryGoal.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl tabular",
								children: formatMoney(primaryGoal.savedAmount, currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["of ", formatMoney(primaryGoal.targetAmount, currency)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-4",
								value: Math.min(100, Math.round(primaryGoal.savedAmount / primaryGoal.targetAmount * 100))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/goals",
								className: "mt-auto flex items-center gap-1 pt-5 text-sm text-muted-foreground hover:text-foreground",
								children: ["All goals ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Name what you are driving toward — tyres, fees, a quieter month."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/goals",
								className: "pt-5 text-sm font-medium hover:underline",
								children: "Add a goal"
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Latest trips"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/trips",
								className: "text-sm text-muted-foreground hover:text-foreground",
								children: "All trips"
							})]
						}), recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted-foreground",
							children: "No trips yet. Log the first one of the day."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: recent.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm font-medium",
										children: [
											t.pickup,
											" → ",
											t.dropoff
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											formatDayTime(t.startedAt),
											" · ",
											PLATFORM_LABEL[t.platform]
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "shrink-0 text-sm tabular",
									children: formatMoney(t.fare + t.tip, currency)
								})]
							}, t.id))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "How they received you"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 text-muted-foreground" })]
						}), quotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted-foreground",
							children: "After a kind word or a tip, save it on the trip. It becomes your record of the work."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-4",
							children: quotes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: t.rating }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-display text-lg leading-snug italic",
									children: [
										"“",
										t.appreciation,
										"”"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										t.pickup,
										" → ",
										t.dropoff
									]
								})
							] }, t.id))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripDialog, {
				open: tripOpen,
				onOpenChange: setTripOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseDialog, {
				open: expenseOpen,
				onOpenChange: setExpenseOpen
			})
		]
	});
}
function Stat({ label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex items-center gap-2 font-display text-3xl tabular",
				children: [value, icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "income",
					children: "avg"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	}) });
}
//#endregion
export { Home as component };
