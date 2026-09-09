import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { n as Label, t as Input } from "./label-CSduPNKa.mjs";
import { n as CardContent, t as Card } from "./card-C0KUkT6v.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-ClWJ85kQ.mjs";
import { t as CURRENCIES } from "./types-C3EtAFKl.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DuZF9ThO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BHpaI_y-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useRunsheet((s) => s.settings);
	const updateSettings = useRunsheet((s) => s.updateSettings);
	const startFresh = useRunsheet((s) => s.startFresh);
	const loadSample = useRunsheet((s) => s.loadSample);
	const trips = useRunsheet((s) => s.trips);
	const customers = useRunsheet((s) => s.customers);
	const expenses = useRunsheet((s) => s.expenses);
	const goals = useRunsheet((s) => s.goals);
	const [wipe, setWipe] = (0, import_react.useState)(false);
	const [sample, setSample] = (0, import_react.useState)(false);
	function exportJson() {
		const payload = {
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			settings,
			customers,
			trips,
			expenses,
			goals
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `runsheet-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Records downloaded");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight italic",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Your name on the report, the car you drive, the currency you count in."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-4 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Driver"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.driverName,
							onChange: (e) => updateSettings({
								driverName: e.target.value,
								sampleData: false
							}),
							placeholder: "Your name"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "City",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.city,
							onChange: (e) => updateSettings({ city: e.target.value }),
							placeholder: "Cape Town"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: settings.currency,
							onValueChange: (v) => updateSettings({ currency: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c,
								children: c
							}, c)) })]
						})
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-4 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Vehicle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Make",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: settings.vehicleMake,
								onChange: (e) => updateSettings({ vehicleMake: e.target.value }),
								placeholder: "Toyota"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Model",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: settings.vehicleModel,
								onChange: (e) => updateSettings({ vehicleModel: e.target.value }),
								placeholder: "Quest"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Year",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: settings.year,
								onChange: (e) => updateSettings({ year: e.target.value }),
								placeholder: "2018"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Plate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: settings.plate,
								onChange: (e) => updateSettings({ plate: e.target.value }),
								placeholder: "CA 000-000"
							})
						})]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Your records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Everything lives in this browser. Download a copy before you clear a device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: exportJson,
								children: "Download JSON"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setSample(true),
								children: "Load sample week"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "text-expense",
								onClick: () => setWipe(true),
								children: "Start fresh"
							})
						]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: wipe,
				onOpenChange: setWipe,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Clear every record?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Trips, customers, expenses and goals will be removed from this device. Download a copy first if you need it." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Keep records" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground",
					onClick: () => {
						startFresh();
						toast.success("Book cleared. Start logging.");
					},
					children: "Start fresh"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: sample,
				onOpenChange: setSample,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Replace with the sample week?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This overwrites what is on this device with Sipho’s sample Cape Town week, so you can explore the product." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						loadSample();
						toast.success("Sample week loaded");
					},
					children: "Load sample"
				})] })] })
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { SettingsPage as component };
