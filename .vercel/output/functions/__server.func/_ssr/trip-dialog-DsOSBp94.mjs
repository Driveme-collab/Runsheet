import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { n as Label, t as Input } from "./label-CSduPNKa.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-BXRUw8ZT.mjs";
import { t as Stars } from "./stars-CRpADltj.mjs";
import { S as todayInputValue, b as toDateTimeLocal, f as fromDateTimeLocal } from "./stats-CJqAhYbt.mjs";
import { a as PLATFORM_LABEL, i as PLATFORMS } from "./types-C3EtAFKl.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DuZF9ThO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trip-dialog-DsOSBp94.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyDraft() {
	return {
		startedAt: todayInputValue(),
		customerId: "none",
		newCustomer: "",
		pickup: "",
		dropoff: "",
		fare: "",
		tip: "",
		platform: "cash",
		distanceKm: "",
		durationMin: "",
		rating: null,
		appreciation: "",
		notes: ""
	};
}
function fromTrip(trip) {
	return {
		startedAt: toDateTimeLocal(trip.startedAt),
		customerId: trip.customerId ?? "none",
		newCustomer: "",
		pickup: trip.pickup,
		dropoff: trip.dropoff,
		fare: String(trip.fare),
		tip: String(trip.tip || ""),
		platform: trip.platform,
		distanceKm: trip.distanceKm ? String(trip.distanceKm) : "",
		durationMin: trip.durationMin ? String(trip.durationMin) : "",
		rating: trip.rating,
		appreciation: trip.appreciation,
		notes: trip.notes
	};
}
function TripDialog({ open, onOpenChange, trip, defaultCustomerId }) {
	const customers = useRunsheet((s) => s.customers);
	const addCustomer = useRunsheet((s) => s.addCustomer);
	const addTrip = useRunsheet((s) => s.addTrip);
	const updateTrip = useRunsheet((s) => s.updateTrip);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (trip) {
			setDraft(fromTrip(trip));
			return;
		}
		const d = emptyDraft();
		if (defaultCustomerId) d.customerId = defaultCustomerId;
		setDraft(d);
	}, [
		open,
		trip,
		defaultCustomerId
	]);
	const sorted = (0, import_react.useMemo)(() => [...customers].sort((a, b) => a.name.localeCompare(b.name)), [customers]);
	function set(key, value) {
		setDraft((d) => ({
			...d,
			[key]: value
		}));
	}
	function save() {
		const fare = Number(draft.fare);
		if (!draft.pickup.trim() || !draft.dropoff.trim() || !Number.isFinite(fare) || fare < 0) {
			toast.error("Pickup, drop-off and fare are required.");
			return;
		}
		let customerId = draft.customerId === "none" ? null : draft.customerId;
		if (draft.newCustomer.trim()) customerId = addCustomer({
			name: draft.newCustomer.trim(),
			phone: "",
			notes: "",
			regular: false
		});
		const payload = {
			startedAt: fromDateTimeLocal(draft.startedAt),
			customerId,
			pickup: draft.pickup.trim(),
			dropoff: draft.dropoff.trim(),
			fare,
			tip: Number(draft.tip) || 0,
			platform: draft.platform,
			distanceKm: Number(draft.distanceKm) || 0,
			durationMin: Number(draft.durationMin) || 0,
			rating: draft.rating,
			appreciation: draft.appreciation.trim(),
			notes: draft.notes.trim()
		};
		if (trip) {
			updateTrip(trip.id, payload);
			toast.success("Trip updated");
		} else {
			addTrip(payload);
			toast.success("Trip logged");
		}
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: trip ? "Edit trip" : "Log a trip" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Fare, customer and how they received the ride — the record your operator can trust." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "When",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "datetime-local",
							value: draft.startedAt,
							onChange: (e) => set("startedAt", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pickup",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.pickup,
								onChange: (e) => set("pickup", e.target.value),
								placeholder: "Claremont"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Drop-off",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.dropoff,
								onChange: (e) => set("dropoff", e.target.value),
								placeholder: "Airport"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Fare",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: draft.fare,
								onChange: (e) => set("fare", e.target.value),
								placeholder: "0"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tip",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: draft.tip,
								onChange: (e) => set("tip", e.target.value),
								placeholder: "0"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Platform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.platform,
								onValueChange: (v) => set("platform", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p,
									children: PLATFORM_LABEL[p]
								}, p)) })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Customer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.customerId,
								onValueChange: (v) => set("customerId", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Walk-up" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									children: "Walk-up / unknown"
								}), sorted.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id))] })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "New customer (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.newCustomer,
							onChange: (e) => set("newCustomer", e.target.value),
							placeholder: "Name to add to your book"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Distance (km)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: draft.distanceKm,
								onChange: (e) => set("distanceKm", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Duration (min)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: draft.durationMin,
								onChange: (e) => set("durationMin", e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "How they rated the ride" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
							value: draft.rating,
							onChange: (n) => set("rating", n),
							size: "md"
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "What they said",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft.appreciation,
							onChange: (e) => set("appreciation", e.target.value),
							placeholder: "On time. Bags handled. Will request again."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Private notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft.notes,
							onChange: (e) => set("notes", e.target.value),
							placeholder: "Traffic, route, anything to remember"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				children: trip ? "Save changes" : "Log trip"
			})] })
		] })
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { TripDialog as t };
