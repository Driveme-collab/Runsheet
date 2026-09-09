import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as ArrowLeft, m as Pencil, p as Phone, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as Route$1, r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { t as Badge } from "./badge-DOOmD4aS.mjs";
import { t as CustomerDialog } from "./customer-dialog-Ddy3F37X.mjs";
import { t as Stars } from "./stars-CRpADltj.mjs";
import { s as formatDayTime, u as formatMoney, v as statsForCustomer } from "./stats-CJqAhYbt.mjs";
import { n as CardContent, t as Card } from "./card-C0KUkT6v.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-ClWJ85kQ.mjs";
import { a as PLATFORM_LABEL } from "./types-C3EtAFKl.mjs";
import { t as TripDialog } from "./trip-dialog-DsOSBp94.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers._id-3P10agPV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerDetail() {
	const { id } = Route$1.useParams();
	const navigate = useNavigate();
	const customer = useRunsheet((s) => s.customers.find((c) => c.id === id));
	const trips = useRunsheet((s) => s.trips);
	const currency = useRunsheet((s) => s.settings.currency);
	const deleteCustomer = useRunsheet((s) => s.deleteCustomer);
	const [edit, setEdit] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [tripOpen, setTripOpen] = (0, import_react.useState)(false);
	const theirs = (0, import_react.useMemo)(() => trips.filter((t) => t.customerId === id).sort((a, b) => b.startedAt.localeCompare(a.startedAt)), [trips, id]);
	const stats = customer ? statsForCustomer(customer, trips) : null;
	if (!customer || !stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "No such customer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/customers",
			className: "mt-3 inline-block text-sm text-muted-foreground hover:underline",
			children: "Back to people"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/customers",
				className: "inline-flex h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "People"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight italic",
						children: customer.name
					}), customer.regular ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Regular" }) : null]
				}), customer.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${customer.phone.replace(/\s/g, "")}`,
					className: "mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), customer.phone]
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setEdit(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "text-expense",
							onClick: () => setConfirm(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setTripOpen(true),
							children: "Log trip"
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-wide text-muted-foreground uppercase",
								children: "Spent with you"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-3xl tabular",
								children: formatMoney(stats.gross, currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [stats.trips, " trips"]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-wide text-muted-foreground uppercase",
								children: "Tips"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-3xl tabular",
								children: formatMoney(stats.tips, currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Cash thanks, counted"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-wide text-muted-foreground uppercase",
								children: "How they rate you"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-3xl tabular",
								children: stats.avgRating == null ? "—" : stats.avgRating.toFixed(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: stats.avgRating == null ? null : Math.round(stats.avgRating) })
							})
						]
					}) })
				]
			}),
			customer.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-wide text-muted-foreground uppercase",
					children: "Notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed",
					children: customer.notes
				})]
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Appreciation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-col gap-3",
				children: theirs.filter((t) => t.appreciation.trim()).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "When they thank you — a rating, a sentence, a tip — log it on the trip. It lives here."
				}) : theirs.filter((t) => t.appreciation.trim()).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: t.rating }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-display text-xl leading-snug italic",
							children: [
								"“",
								t.appreciation,
								"”"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								formatDayTime(t.startedAt),
								" · ",
								t.pickup,
								" → ",
								t.dropoff
							]
						})
					]
				}, t.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Trip history"
			}), theirs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "No trips on file yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: theirs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							t.pickup,
							" → ",
							t.dropoff
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							formatDayTime(t.startedAt),
							" · ",
							PLATFORM_LABEL[t.platform]
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm tabular",
						children: formatMoney(t.fare + t.tip, currency)
					})]
				}, t.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDialog, {
				open: edit,
				onOpenChange: setEdit,
				customer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripDialog, {
				open: tripOpen,
				onOpenChange: setTripOpen,
				defaultCustomerId: customer.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirm,
				onOpenChange: setConfirm,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Remove ",
					customer.name,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Their trips stay in the book, unlinked. This cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Keep" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground",
					onClick: () => {
						deleteCustomer(customer.id);
						navigate({ to: "/customers" });
					},
					children: "Remove"
				})] })] })
			})
		]
	});
}
//#endregion
export { CustomerDetail as component };
