import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as ScrollText, g as Flag, h as LayoutDashboard, l as Route, n as TriangleAlert, o as Settings, u as Receipt, x as BookUser } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-XGZ_Fm5w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}_${crypto.randomUUID()}`;
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function at(daysAgo, hour, minute = 0) {
	const d = /* @__PURE__ */ new Date();
	d.setHours(hour, minute, 0, 0);
	d.setDate(d.getDate() - daysAgo);
	return d.toISOString();
}
function dateOnly(daysAgo) {
	return at(daysAgo, 9, 0).slice(0, 10);
}
var seedSettings = {
	driverName: "Sipho Dlamini",
	vehicleMake: "Toyota",
	vehicleModel: "Quest",
	plate: "CY 482-191",
	year: "2018",
	currency: "ZAR",
	weeklyTarget: 6500,
	city: "Cape Town",
	sampleData: true
};
var seedCustomers = [
	{
		id: "c_naledi",
		name: "Naledi Khumalo",
		phone: "082 441 2290",
		notes: "School run, Claremont to Rondebosch. Prefers the quiet car. Pays cash on Fridays.",
		regular: true,
		createdAt: at(40, 8)
	},
	{
		id: "c_james",
		name: "James van der Merwe",
		phone: "021 555 0188",
		notes: "Corporate airport runs. Invoices via operator on month-end.",
		regular: true,
		createdAt: at(60, 9)
	},
	{
		id: "c_ayesha",
		name: "Ayesha Patel",
		phone: "073 220 8841",
		notes: "Lives in Sea Point. Often books late evening after shifts at the hospital.",
		regular: true,
		createdAt: at(25, 18)
	},
	{
		id: "c_thandi",
		name: "Thandi Maseko",
		phone: "084 119 3302",
		notes: "Weekend Wynberg market run with parcels.",
		regular: false,
		createdAt: at(12, 10)
	},
	{
		id: "c_pieter",
		name: "Pieter Botha",
		phone: "082 990 1144",
		notes: "",
		regular: false,
		createdAt: at(8, 14)
	},
	{
		id: "c_lereko",
		name: "Lereko Molefe",
		phone: "071 663 2209",
		notes: "Operator dispatch — Waterfront hotel transfers.",
		regular: true,
		createdAt: at(50, 7)
	},
	{
		id: "c_sam",
		name: "Sam Okonkwo",
		phone: "078 441 0091",
		notes: "Student. Bellville to campus. Always on time himself.",
		regular: false,
		createdAt: at(6, 7)
	},
	{
		id: "c_fatima",
		name: "Fatima Jacobs",
		phone: "021 447 1022",
		notes: "Weekly grocery run, Athlone. Tips in cash, never on the app.",
		regular: true,
		createdAt: at(30, 11)
	}
];
var seedTrips = [
	{
		id: "t01",
		startedAt: at(0, 6, 20),
		customerId: "c_naledi",
		pickup: "Claremont",
		dropoff: "Rondebosch Girls",
		fare: 95,
		tip: 20,
		platform: "cash",
		distanceKm: 4.2,
		durationMin: 14,
		rating: 5,
		appreciation: "Sipho is never late. The girls feel safe with him.",
		notes: "Morning school run",
		createdAt: at(0, 6, 20)
	},
	{
		id: "t02",
		startedAt: at(0, 7, 10),
		customerId: "c_james",
		pickup: "Constantia",
		dropoff: "Cape Town International",
		fare: 320,
		tip: 50,
		platform: "operator",
		distanceKm: 22.4,
		durationMin: 38,
		rating: 5,
		appreciation: "Quiet, professional, bags handled without asking.",
		notes: "Flight 06:55 — left 90 min early as requested",
		createdAt: at(0, 7, 10)
	},
	{
		id: "t03",
		startedAt: at(0, 9, 40),
		customerId: null,
		pickup: "Airport arrivals",
		dropoff: "Camps Bay",
		fare: 280,
		tip: 0,
		platform: "bolt",
		distanceKm: 28.1,
		durationMin: 47,
		rating: 4,
		appreciation: "",
		notes: "",
		createdAt: at(0, 9, 40)
	},
	{
		id: "t04",
		startedAt: at(0, 12, 5),
		customerId: "c_fatima",
		pickup: "Athlone",
		dropoff: "Canal Walk",
		fare: 140,
		tip: 30,
		platform: "cash",
		distanceKm: 11.6,
		durationMin: 26,
		rating: 5,
		appreciation: "Waited while I packed the boot. True gentleman.",
		notes: "Return trip later not taken — she got a lift",
		createdAt: at(0, 12, 5)
	},
	{
		id: "t05",
		startedAt: at(0, 15, 30),
		customerId: "c_sam",
		pickup: "Bellville",
		dropoff: "UWC",
		fare: 70,
		tip: 0,
		platform: "uber",
		distanceKm: 6.8,
		durationMin: 16,
		rating: 5,
		appreciation: "Music volume just right. Will request again.",
		notes: "",
		createdAt: at(0, 15, 30)
	},
	{
		id: "t06",
		startedAt: at(1, 5, 50),
		customerId: "c_ayesha",
		pickup: "Sea Point",
		dropoff: "Groote Schuur Hospital",
		fare: 110,
		tip: 20,
		platform: "bolt",
		distanceKm: 8.4,
		durationMin: 18,
		rating: 5,
		appreciation: "I start at 06:00. He is always downstairs at 05:50.",
		notes: "Night-to-morning handover shift",
		createdAt: at(1, 5, 50)
	},
	{
		id: "t07",
		startedAt: at(1, 8, 15),
		customerId: "c_lereko",
		pickup: "V&A Waterfront",
		dropoff: "Stellenbosch",
		fare: 450,
		tip: 80,
		platform: "operator",
		distanceKm: 52,
		durationMin: 55,
		rating: 5,
		appreciation: "Hotel guests asked for his number. Gold standard.",
		notes: "Two couples, luggage for a wine-farm stay",
		createdAt: at(1, 8, 15)
	},
	{
		id: "t08",
		startedAt: at(1, 14, 40),
		customerId: null,
		pickup: "Stellenbosch",
		dropoff: "Cape Town station",
		fare: 380,
		tip: 0,
		platform: "indrive",
		distanceKm: 48,
		durationMin: 58,
		rating: 4,
		appreciation: "Fair price, no talking. Perfect.",
		notes: "Empty return, accepted inDrive to cover fuel",
		createdAt: at(1, 14, 40)
	},
	{
		id: "t09",
		startedAt: at(1, 18, 10),
		customerId: "c_pieter",
		pickup: "Century City",
		dropoff: "Bloubergstrand",
		fare: 160,
		tip: 0,
		platform: "uber",
		distanceKm: 14.2,
		durationMin: 22,
		rating: 3,
		appreciation: "Car was fine. Took a long way.",
		notes: "Traffic on N1 — next time use R27 earlier",
		createdAt: at(1, 18, 10)
	},
	{
		id: "t10",
		startedAt: at(2, 6, 20),
		customerId: "c_naledi",
		pickup: "Claremont",
		dropoff: "Rondebosch Girls",
		fare: 95,
		tip: 0,
		platform: "cash",
		distanceKm: 4.2,
		durationMin: 13,
		rating: 5,
		appreciation: "",
		notes: "School run",
		createdAt: at(2, 6, 20)
	},
	{
		id: "t11",
		startedAt: at(2, 10, 0),
		customerId: "c_thandi",
		pickup: "Wynberg",
		dropoff: "Salt River market",
		fare: 120,
		tip: 15,
		platform: "cash",
		distanceKm: 9.5,
		durationMin: 24,
		rating: 5,
		appreciation: "Helped with the crates. My usual driver was away.",
		notes: "Parcels in the boot — keep a tarp",
		createdAt: at(2, 10, 0)
	},
	{
		id: "t12",
		startedAt: at(2, 13, 25),
		customerId: null,
		pickup: "Woodstock",
		dropoff: "Muizenberg",
		fare: 210,
		tip: 0,
		platform: "bolt",
		distanceKm: 24.8,
		durationMin: 41,
		rating: 4,
		appreciation: "",
		notes: "",
		createdAt: at(2, 13, 25)
	},
	{
		id: "t13",
		startedAt: at(2, 19, 45),
		customerId: "c_ayesha",
		pickup: "Groote Schuur Hospital",
		dropoff: "Sea Point",
		fare: 115,
		tip: 40,
		platform: "bolt",
		distanceKm: 8.6,
		durationMin: 21,
		rating: 5,
		appreciation: "Long day. He didn't fill the silence. Thank you.",
		notes: "Evening hospital pickup",
		createdAt: at(2, 19, 45)
	},
	{
		id: "t14",
		startedAt: at(3, 7, 5),
		customerId: "c_james",
		pickup: "Cape Town International",
		dropoff: "Constantia",
		fare: 300,
		tip: 40,
		platform: "operator",
		distanceKm: 21.9,
		durationMin: 36,
		rating: 5,
		appreciation: "On the board before the bags. That's why we book him.",
		notes: "Arrival from JNB",
		createdAt: at(3, 7, 5)
	},
	{
		id: "t15",
		startedAt: at(3, 11, 30),
		customerId: null,
		pickup: "Gardens",
		dropoff: "Khayelitsha",
		fare: 180,
		tip: 0,
		platform: "uber",
		distanceKm: 26.4,
		durationMin: 44,
		rating: 5,
		appreciation: "Safe driver. Dropped at the gate, not the corner.",
		notes: "",
		createdAt: at(3, 11, 30)
	},
	{
		id: "t16",
		startedAt: at(3, 16, 50),
		customerId: "c_fatima",
		pickup: "Athlone",
		dropoff: "Mitchells Plain",
		fare: 90,
		tip: 10,
		platform: "cash",
		distanceKm: 8.1,
		durationMin: 18,
		rating: 5,
		appreciation: "Always checks I got inside before he leaves.",
		notes: "",
		createdAt: at(3, 16, 50)
	},
	{
		id: "t17",
		startedAt: at(4, 6, 20),
		customerId: "c_naledi",
		pickup: "Claremont",
		dropoff: "Rondebosch Girls",
		fare: 95,
		tip: 0,
		platform: "cash",
		distanceKm: 4.2,
		durationMin: 15,
		rating: 5,
		appreciation: "",
		notes: "School run — rain, left 5 min early",
		createdAt: at(4, 6, 20)
	},
	{
		id: "t18",
		startedAt: at(4, 9, 15),
		customerId: "c_lereko",
		pickup: "Table Bay Hotel",
		dropoff: "Franschhoek",
		fare: 620,
		tip: 100,
		platform: "operator",
		distanceKm: 78,
		durationMin: 80,
		rating: 5,
		appreciation: "Guests said the drive was the highlight. Request Sipho next visit.",
		notes: "Return empty — did not take a cheap inDrive back",
		createdAt: at(4, 9, 15)
	},
	{
		id: "t19",
		startedAt: at(5, 8, 0),
		customerId: "c_sam",
		pickup: "Bellville",
		dropoff: "Cape Town station",
		fare: 160,
		tip: 0,
		platform: "uber",
		distanceKm: 22,
		durationMin: 35,
		rating: 4,
		appreciation: "",
		notes: "Train connection",
		createdAt: at(5, 8, 0)
	},
	{
		id: "t20",
		startedAt: at(5, 12, 40),
		customerId: null,
		pickup: "Observatory",
		dropoff: "Century City",
		fare: 95,
		tip: 0,
		platform: "bolt",
		distanceKm: 10.4,
		durationMin: 22,
		rating: 5,
		appreciation: "Clean car. Smells like citrus, not chemicals.",
		notes: "",
		createdAt: at(5, 12, 40)
	},
	{
		id: "t21",
		startedAt: at(5, 20, 15),
		customerId: "c_ayesha",
		pickup: "Sea Point",
		dropoff: "Groote Schuur Hospital",
		fare: 110,
		tip: 20,
		platform: "bolt",
		distanceKm: 8.5,
		durationMin: 19,
		rating: 5,
		appreciation: "Night shift again. Same calm driver.",
		notes: "",
		createdAt: at(5, 20, 15)
	},
	{
		id: "t22",
		startedAt: at(6, 7, 30),
		customerId: "c_james",
		pickup: "Constantia",
		dropoff: "V&A Waterfront",
		fare: 180,
		tip: 20,
		platform: "operator",
		distanceKm: 16.2,
		durationMin: 28,
		rating: 5,
		appreciation: "",
		notes: "Breakfast meeting",
		createdAt: at(6, 7, 30)
	},
	{
		id: "t23",
		startedAt: at(6, 11, 10),
		customerId: null,
		pickup: "Green Point",
		dropoff: "Hout Bay",
		fare: 170,
		tip: 0,
		platform: "bolt",
		distanceKm: 18.7,
		durationMin: 32,
		rating: 4,
		appreciation: "",
		notes: "",
		createdAt: at(6, 11, 10)
	},
	{
		id: "t24",
		startedAt: at(8, 6, 20),
		customerId: "c_naledi",
		pickup: "Claremont",
		dropoff: "Rondebosch Girls",
		fare: 95,
		tip: 20,
		platform: "cash",
		distanceKm: 4.2,
		durationMin: 14,
		rating: 5,
		appreciation: "Paid the week. See you Monday.",
		notes: "Friday cash settlement for the week",
		createdAt: at(8, 6, 20)
	},
	{
		id: "t25",
		startedAt: at(8, 15, 0),
		customerId: "c_thandi",
		pickup: "Wynberg",
		dropoff: "Khaya",
		fare: 85,
		tip: 0,
		platform: "cash",
		distanceKm: 7.2,
		durationMin: 18,
		rating: 5,
		appreciation: "",
		notes: "",
		createdAt: at(8, 15, 0)
	},
	{
		id: "t26",
		startedAt: at(9, 9, 45),
		customerId: "c_lereko",
		pickup: "Waterfront",
		dropoff: "Airport",
		fare: 240,
		tip: 40,
		platform: "operator",
		distanceKm: 20.5,
		durationMin: 30,
		rating: 5,
		appreciation: "Flight made with 40 minutes to spare.",
		notes: "",
		createdAt: at(9, 9, 45)
	},
	{
		id: "t27",
		startedAt: at(10, 18, 20),
		customerId: null,
		pickup: "Claremont",
		dropoff: "Kalk Bay",
		fare: 200,
		tip: 0,
		platform: "uber",
		distanceKm: 23.1,
		durationMin: 38,
		rating: 4,
		appreciation: "",
		notes: "Dinner booking",
		createdAt: at(10, 18, 20)
	}
];
var seedExpenses = [
	{
		id: "e01",
		date: dateOnly(0),
		category: "fuel",
		amount: 780,
		note: "Engen Claremont — tank to full",
		odometerKm: 186420
	},
	{
		id: "e02",
		date: dateOnly(1),
		category: "parking",
		amount: 28,
		note: "Airport short stay while waiting",
		odometerKm: null
	},
	{
		id: "e03",
		date: dateOnly(2),
		category: "data",
		amount: 149,
		note: "MTN 10GB — Bolt / Uber week",
		odometerKm: null
	},
	{
		id: "e04",
		date: dateOnly(3),
		category: "wash",
		amount: 80,
		note: "Hand wash + interior wipe, Wynberg",
		odometerKm: 185910
	},
	{
		id: "e05",
		date: dateOnly(4),
		category: "tolls",
		amount: 42,
		note: "N1 / N2 day",
		odometerKm: null
	},
	{
		id: "e06",
		date: dateOnly(5),
		category: "fuel",
		amount: 620,
		note: "Caltex Bellville",
		odometerKm: 185640
	},
	{
		id: "e07",
		date: dateOnly(8),
		category: "maintenance",
		amount: 450,
		note: "Oil + filter, independent garage",
		odometerKm: 185200
	},
	{
		id: "e08",
		date: dateOnly(9),
		category: "tyres",
		amount: 250,
		note: "Puncture repair, rear left",
		odometerKm: 185040
	},
	{
		id: "e09",
		date: dateOnly(12),
		category: "fuel",
		amount: 740,
		note: "Full tank after a long Franschhoek job",
		odometerKm: 184800
	},
	{
		id: "e10",
		date: dateOnly(14),
		category: "license",
		amount: 220,
		note: "Operating permit photocopy + stamp",
		odometerKm: null
	}
];
var seedGoals = [
	{
		id: "g01",
		title: "Emergency fund",
		targetAmount: 2e4,
		savedAmount: 6400,
		deadline: "",
		note: "Three months of fuel, data, and rent if the car sits."
	},
	{
		id: "g02",
		title: "New tyre set",
		targetAmount: 4800,
		savedAmount: 2100,
		deadline: new Date(Date.now() + 3456e6).toISOString().slice(0, 10),
		note: "Front pair is on the wear bars. Do not wait for a blowout."
	},
	{
		id: "g03",
		title: "School fees — first term",
		targetAmount: 12500,
		savedAmount: 3800,
		deadline: new Date(Date.now() + 8208e6).toISOString().slice(0, 10),
		note: "Pay before January. Put Friday cash tips here first."
	}
];
var seedShifts = [{
	id: "s_open",
	startedAt: at(0, 5, 45),
	endedAt: null
}, {
	id: "s_y",
	startedAt: at(1, 5, 30),
	endedAt: at(1, 20, 10)
}];
function emptySettings() {
	return {
		driverName: "",
		vehicleMake: "",
		vehicleModel: "",
		plate: "",
		year: "",
		currency: "ZAR",
		weeklyTarget: 0,
		city: "",
		sampleData: false
	};
}
var sample = {
	customers: seedCustomers,
	trips: seedTrips,
	expenses: seedExpenses,
	goals: seedGoals,
	shifts: seedShifts,
	settings: seedSettings
};
var useRunsheet = create()(persist((set, get) => ({
	...sample,
	hydrated: false,
	setHydrated: () => set({ hydrated: true }),
	updateSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	addCustomer: (input) => {
		const id = uid("c");
		set({ customers: [{
			...input,
			id,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...get().customers] });
		return id;
	},
	updateCustomer: (id, patch) => set({ customers: get().customers.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) }),
	deleteCustomer: (id) => set({
		customers: get().customers.filter((c) => c.id !== id),
		trips: get().trips.map((t) => t.customerId === id ? {
			...t,
			customerId: null
		} : t)
	}),
	addTrip: (input) => {
		const id = uid("t");
		set({ trips: [{
			...input,
			id,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...get().trips] });
		return id;
	},
	updateTrip: (id, patch) => set({ trips: get().trips.map((t) => t.id === id ? {
		...t,
		...patch
	} : t) }),
	deleteTrip: (id) => set({ trips: get().trips.filter((t) => t.id !== id) }),
	addExpense: (input) => {
		const id = uid("e");
		set({ expenses: [{
			...input,
			id
		}, ...get().expenses] });
		return id;
	},
	updateExpense: (id, patch) => set({ expenses: get().expenses.map((e) => e.id === id ? {
		...e,
		...patch
	} : e) }),
	deleteExpense: (id) => set({ expenses: get().expenses.filter((e) => e.id !== id) }),
	addGoal: (input) => {
		const id = uid("g");
		set({ goals: [{
			...input,
			id
		}, ...get().goals] });
		return id;
	},
	updateGoal: (id, patch) => set({ goals: get().goals.map((g) => g.id === id ? {
		...g,
		...patch
	} : g) }),
	deleteGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),
	startShift: () => {
		if (get().shifts.find((s) => !s.endedAt)) return;
		set({ shifts: [{
			id: uid("s"),
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			endedAt: null
		}, ...get().shifts] });
	},
	endShift: () => set({ shifts: get().shifts.map((s) => s.endedAt ? s : {
		...s,
		endedAt: (/* @__PURE__ */ new Date()).toISOString()
	}) }),
	loadSample: () => set({ ...sample }),
	startFresh: () => set({
		customers: [],
		trips: [],
		expenses: [],
		goals: [],
		shifts: [],
		settings: emptySettings()
	})
}), {
	name: "runsheet.v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (state) => ({
		customers: state.customers,
		trips: state.trips,
		expenses: state.expenses,
		goals: state.goals,
		shifts: state.shifts,
		settings: state.settings
	})
}));
var NAV = [
	{
		to: "/",
		label: "Board",
		icon: LayoutDashboard
	},
	{
		to: "/trips",
		label: "Trips",
		icon: Route
	},
	{
		to: "/customers",
		label: "People",
		icon: BookUser
	},
	{
		to: "/expenses",
		label: "Costs",
		icon: Receipt
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ScrollText
	},
	{
		to: "/goals",
		label: "Goals",
		icon: Flag
	}
];
function AppShell({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const settings = useRunsheet((s) => s.settings);
	(0, import_react.useEffect)(() => {
		const unsub = useRunsheet.persist.onFinishHydration(() => {
			useRunsheet.getState().setHydrated();
			setReady(true);
		});
		useRunsheet.persist.rehydrate();
		if (useRunsheet.persist.hasHydrated()) {
			useRunsheet.getState().setHydrated();
			setReady(true);
		}
		return unsub;
	}, []);
	const first = (settings.driverName || "Driver").split(" ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				"data-print-hide": true,
				className: "fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-background md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 pt-6 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[1.65rem] leading-none italic tracking-tight",
								children: "Runsheet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] tracking-wide text-muted-foreground uppercase",
								children: "Driver’s book of record"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-0.5 px-3",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/settings",
							className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors", pathname.startsWith("/settings") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), first]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				"data-print-hide": true,
				className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display text-xl italic tracking-tight",
					children: "Runsheet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/goals",
						className: "flex size-11 items-center justify-center rounded-md text-muted-foreground",
						"aria-label": "Goals",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "flex size-11 items-center justify-center rounded-md text-muted-foreground",
						"aria-label": "Settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "md:pl-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-5xl px-4 pt-5 pb-28 md:px-8 md:pt-8 md:pb-12",
					children: ready ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingPanel, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"data-print-hide": true,
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm md:hidden",
				style: { paddingBottom: "env(safe-area-inset-bottom)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: NAV.slice(0, 5).map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
function LoadingPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl italic tracking-tight",
				children: "Runsheet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Opening your records…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-xl bg-card shadow-[var(--shadow-border)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-xl bg-card shadow-[var(--shadow-border)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-xl bg-card shadow-[var(--shadow-border)]" })
				]
			})
		]
	});
}
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast bg-card text-card-foreground border-border shadow-[var(--shadow-border)]",
			description: "text-muted-foreground"
		} }
	});
}
var styles_default = "/assets/styles-ChIdKen8.css";
var APP_NAME = "Runsheet";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "The driver’s book of record — trips, customers, car costs, and operator reports."
			},
			{
				name: "theme-color",
				content: "#0c0d10"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$7 = () => import("./routes-B8ULv1fp.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./customers-Da7VdsAa.mjs");
var Route$7 = createFileRoute("/customers")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./expenses-CvhqjqLb.mjs");
var Route$6 = createFileRoute("/expenses")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./goals-BJ1uZbLw.mjs");
var Route$5 = createFileRoute("/goals")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./reports-OdxSUHEn.mjs");
var Route$4 = createFileRoute("/reports")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./settings-BHpaI_y-.mjs");
var Route$3 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./trips-CeaX2SGU.mjs");
var Route$2 = createFileRoute("/trips")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./customers._id-3P10agPV.mjs");
var Route$1 = createFileRoute("/customers/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var CustomersRoute = Route$7.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => Route$9
});
var ExpensesRoute = Route$6.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => Route$9
});
var GoalsRoute = Route$5.update({
	id: "/goals",
	path: "/goals",
	getParentRoute: () => Route$9
});
var ReportsRoute = Route$4.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$9
});
var SettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$9
});
var TripsRoute = Route$2.update({
	id: "/trips",
	path: "/trips",
	getParentRoute: () => Route$9
});
var CustomersRouteChildren = { CustomersIdRoute: Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => CustomersRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	CustomersRoute: CustomersRoute._addFileChildren(CustomersRouteChildren),
	ExpensesRoute,
	GoalsRoute,
	ReportsRoute,
	SettingsRoute,
	TripsRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as i, Route$1 as n, useRunsheet as r, router_exports as t };
