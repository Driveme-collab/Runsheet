import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-XGZ_Fm5w.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Progress({ className, value, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-secondary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			className: "h-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
			style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
		})
	});
}
//#endregion
export { Progress as t };
