import { a as endOfMonth, c as startOfWeek, i as startOfMonth, n as format, o as endOfDay, r as endOfWeek, s as startOfDay, t as isWithinInterval } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stats-CJqAhYbt.js
function periodInterval(period, now = /* @__PURE__ */ new Date()) {
	if (period === "all") return null;
	if (period === "today") return {
		start: startOfDay(now),
		end: endOfDay(now)
	};
	if (period === "week") return {
		start: startOfWeek(now, { weekStartsOn: 1 }),
		end: endOfWeek(now, { weekStartsOn: 1 })
	};
	return {
		start: startOfMonth(now),
		end: endOfMonth(now)
	};
}
function inPeriod(iso, period, now = /* @__PURE__ */ new Date()) {
	const interval = periodInterval(period, now);
	if (!interval) return true;
	const date = new Date(iso);
	return isWithinInterval(date, interval);
}
function formatDay(iso) {
	return format(new Date(iso), "EEE d MMM");
}
function formatDayTime(iso) {
	return format(new Date(iso), "EEE d MMM · HH:mm");
}
function formatRangeLabel(period, now = /* @__PURE__ */ new Date()) {
	const interval = periodInterval(period, now);
	if (!interval) return "All records";
	if (period === "today") return format(now, "EEEE d MMMM");
	return `${format(interval.start, "d MMM")} – ${format(interval.end, "d MMM yyyy")}`;
}
function greeting(now = /* @__PURE__ */ new Date()) {
	const h = now.getHours();
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function toDateTimeLocal(iso) {
	const d = new Date(iso);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromDateTimeLocal(value) {
	return new Date(value).toISOString();
}
function todayInputValue(now = /* @__PURE__ */ new Date()) {
	return toDateTimeLocal(now.toISOString());
}
function todayDateInput(now = /* @__PURE__ */ new Date()) {
	return format(now, "yyyy-MM-dd");
}
var LOCALE = {
	ZAR: "en-ZA",
	USD: "en-US",
	GBP: "en-GB",
	EUR: "en-IE",
	BWP: "en-BW",
	NAD: "en-NA",
	ZMW: "en-ZM",
	KES: "en-KE"
};
function formatMoney(amount, currency, opts) {
	const abs = Math.abs(amount);
	const sign = amount < 0 ? "−" : "";
	if (opts?.compact && abs >= 1e3) return sign + new Intl.NumberFormat(LOCALE[currency], {
		style: "currency",
		currency,
		notation: "compact",
		maximumFractionDigits: 1
	}).format(abs);
	return sign + new Intl.NumberFormat(LOCALE[currency], {
		style: "currency",
		currency,
		maximumFractionDigits: abs % 1 === 0 ? 0 : 2
	}).format(abs);
}
function formatKm(km) {
	if (!km) return "—";
	return `${new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 1 }).format(km)} km`;
}
function formatHours(minutes) {
	if (!minutes) return "—";
	const h = Math.floor(minutes / 60);
	const m = Math.round(minutes % 60);
	if (h === 0) return `${m}m`;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
}
function tripsIn(trips, period) {
	return trips.filter((t) => inPeriod(t.startedAt, period));
}
function expensesIn(expenses, period) {
	return expenses.filter((e) => inPeriod(`${e.date}T12:00:00`, period));
}
function grossOf(trips) {
	return trips.reduce((sum, t) => sum + t.fare + t.tip, 0);
}
function faresOf(trips) {
	return trips.reduce((sum, t) => sum + t.fare, 0);
}
function tipsOf(trips) {
	return trips.reduce((sum, t) => sum + t.tip, 0);
}
function spendOf(expenses) {
	return expenses.reduce((sum, e) => sum + e.amount, 0);
}
function kmOf(trips) {
	return trips.reduce((sum, t) => sum + t.distanceKm, 0);
}
function minutesOf(trips) {
	return trips.reduce((sum, t) => sum + t.durationMin, 0);
}
function ratedTrips(trips) {
	return trips.filter((t) => t.rating != null);
}
function avgRating(trips) {
	const rated = ratedTrips(trips);
	if (rated.length === 0) return null;
	return rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length;
}
function byPlatform(trips) {
	const map = /* @__PURE__ */ new Map();
	for (const t of trips) {
		const cur = map.get(t.platform) ?? {
			trips: 0,
			gross: 0
		};
		cur.trips += 1;
		cur.gross += t.fare + t.tip;
		map.set(t.platform, cur);
	}
	return [...map.entries()].map(([platform, v]) => ({
		platform,
		...v
	})).sort((a, b) => b.gross - a.gross);
}
function byExpense(expenses) {
	const map = /* @__PURE__ */ new Map();
	for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
	return [...map.entries()].map(([category, amount]) => ({
		category,
		amount
	})).sort((a, b) => b.amount - a.amount);
}
function statsForCustomer(customer, trips) {
	const theirs = trips.filter((t) => t.customerId === customer.id).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
	const rated = ratedTrips(theirs);
	const lastWithWords = theirs.find((t) => t.appreciation.trim().length > 0);
	return {
		customer,
		trips: theirs.length,
		gross: grossOf(theirs),
		tips: tipsOf(theirs),
		avgRating: rated.length === 0 ? null : rated.reduce((s, t) => s + (t.rating ?? 0), 0) / rated.length,
		lastTripAt: theirs[0]?.startedAt ?? null,
		lastAppreciation: lastWithWords?.appreciation ?? ""
	};
}
function topCustomers(customers, trips, limit = 5) {
	return customers.map((c) => statsForCustomer(c, trips)).sort((a, b) => b.gross - a.gross).slice(0, limit);
}
function weekSeries(trips, expenses) {
	const start = /* @__PURE__ */ new Date(/* @__PURE__ */ new Date());
	const weekday = (start.getDay() + 6) % 7;
	start.setDate(start.getDate() - weekday);
	start.setHours(0, 0, 0, 0);
	return [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	].map((day, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		const key = localKey(d);
		return {
			day,
			income: trips.filter((t) => localKey(new Date(t.startedAt)) === key).reduce((s, t) => s + t.fare + t.tip, 0),
			spend: expenses.filter((e) => e.date === key).reduce((s, e) => s + e.amount, 0)
		};
	});
}
function localKey(d) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
//#endregion
export { topCustomers as C, todayInputValue as S, weekSeries as T, spendOf as _, faresOf as a, toDateTimeLocal as b, formatHours as c, formatRangeLabel as d, fromDateTimeLocal as f, minutesOf as g, kmOf as h, expensesIn as i, formatKm as l, grossOf as m, byExpense as n, formatDay as o, greeting as p, byPlatform as r, formatDayTime as s, avgRating as t, formatMoney as u, statsForCustomer as v, tripsIn as w, todayDateInput as x, tipsOf as y };
