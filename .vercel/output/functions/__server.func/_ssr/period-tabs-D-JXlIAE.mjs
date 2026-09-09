import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-XGZ_Fm5w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/period-tabs-D-JXlIAE.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		key: "today",
		label: "Today"
	},
	{
		key: "week",
		label: "This week"
	},
	{
		key: "month",
		label: "This month"
	},
	{
		key: "all",
		label: "All"
	}
];
function PeriodTabs({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-secondary p-1",
		children: ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(item.key),
			className: cn("h-9 shrink-0 rounded-md px-3 text-sm font-medium transition-colors", value === item.key ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"),
			children: item.label
		}, item.key))
	});
}
//#endregion
export { PeriodTabs as t };
