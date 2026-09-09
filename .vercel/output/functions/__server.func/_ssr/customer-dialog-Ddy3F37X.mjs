import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, r as useRunsheet } from "./router-XGZ_Fm5w.mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
import { n as Label, t as Input } from "./label-CSduPNKa.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-BXRUw8ZT.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customer-dialog-Ddy3F37X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 rounded-full bg-foreground shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-primary-foreground" })
	});
}
function CustomerDialog({ open, onOpenChange, customer }) {
	const addCustomer = useRunsheet((s) => s.addCustomer);
	const updateCustomer = useRunsheet((s) => s.updateCustomer);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [regular, setRegular] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setName(customer?.name ?? "");
		setPhone(customer?.phone ?? "");
		setNotes(customer?.notes ?? "");
		setRegular(customer?.regular ?? false);
	}, [open, customer]);
	function save() {
		if (!name.trim()) {
			toast.error("A name is required.");
			return;
		}
		const payload = {
			name: name.trim(),
			phone: phone.trim(),
			notes: notes.trim(),
			regular
		};
		if (customer) {
			updateCustomer(customer.id, payload);
			toast.success("Customer updated");
		} else {
			addCustomer(payload);
			toast.success("Customer added");
		}
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: customer ? "Edit customer" : "Add a customer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Keep the people you drive for — regulars, operator clients, and anyone worth remembering." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Full name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "082 000 0000"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-secondary px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Regular"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "School runs, airport contracts, weekly work"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: regular,
							onCheckedChange: setRegular
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							placeholder: "Preferences, address notes, how they like to be driven"
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
				children: customer ? "Save changes" : "Add customer"
			})] })
		] })
	});
}
//#endregion
export { CustomerDialog as t };
