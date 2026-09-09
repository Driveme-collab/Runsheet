import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as Star } from "../_libs/lucide-react.mjs";
import { i as cn } from "./router-XGZ_Fm5w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stars-CRpADltj.js
var import_jsx_runtime = require_jsx_runtime();
function Stars({ value, onChange, size = "sm" }) {
	const dim = size === "md" ? "size-5" : "size-3.5";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex items-center gap-0.5",
		role: onChange ? "radiogroup" : "img",
		"aria-label": `${value ?? 0} of 5`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((n) => {
			const star = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn(dim, (value ?? 0) >= n ? "fill-primary text-primary" : "text-muted-foreground/40") });
			if (!onChange) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: star }, n);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "radio",
				"aria-checked": value === n,
				className: "rounded-sm p-1.5 transition-colors hover:bg-muted",
				onClick: () => onChange(n),
				children: star
			}, n);
		})
	});
}
//#endregion
export { Stars as t };
