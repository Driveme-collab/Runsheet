import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CZVTn16t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-C6o3HKLm.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon: Icon, title, body, action, onAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-xl bg-card px-6 py-16 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted-foreground",
				children: body
			}),
			action && onAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: onAction,
				children: action
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };
