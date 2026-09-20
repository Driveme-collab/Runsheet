import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  Car,
  Flag,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  Route as RouteIcon,
  ScrollText,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRunsheet } from "@/lib/store";
import { Onboarding } from "./onboarding";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  match?: string;
  search?: { tab?: "savings" | "purpose" | "budget" | "numbers" | "emergency" | "flow" };
};

const PRIMARY: NavItem[] = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/work", label: "Work", icon: RouteIcon, match: "/work" },
  { to: "/money", label: "Money", icon: Wallet, match: "/money" },
  { to: "/goals", label: "Goals", icon: Flag },
];

const MORE: NavItem[] = [
  { to: "/vehicle", label: "Vehicle", icon: Car },
  { to: "/growth", label: "Growth", icon: GraduationCap },
  { to: "/community", label: "Community", icon: Users },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/reviews", label: "My week", icon: BookOpen },
  { to: "/reports", label: "Reports", icon: ScrollText },
  { to: "/settings", label: "Profile", icon: Settings },
];

const DESKTOP: { heading: string; items: NavItem[] }[] = [
  { heading: "", items: [{ to: "/", label: "Home", icon: LayoutDashboard }] },
  {
    heading: "Work",
    items: [
      { to: "/work", label: "Overview", icon: RouteIcon },
      { to: "/trips", label: "Trips", icon: RouteIcon },
      { to: "/shifts", label: "Shifts", icon: RouteIcon },
      { to: "/customers", label: "People", icon: RouteIcon },
    ],
  },
  {
    heading: "Money",
    items: [
      { to: "/money", label: "Know your numbers", icon: Wallet, search: { tab: "numbers" } },
      { to: "/money", label: "Budget", icon: Wallet, search: { tab: "budget" } },
      { to: "/money", label: "Savings", icon: Wallet, search: { tab: "savings" } },
      { to: "/money", label: "Emergency", icon: Wallet, search: { tab: "emergency" } },
      { to: "/expenses", label: "Expenses", icon: Wallet },
    ],
  },
  {
    heading: "Build",
    items: [
      { to: "/vehicle", label: "Vehicle", icon: Car },
      { to: "/goals", label: "Goals", icon: Flag },
      { to: "/growth", label: "Growth", icon: GraduationCap },
    ],
  },
  {
    heading: "Together",
    items: [{ to: "/community", label: "Community", icon: Users }],
  },
  {
    heading: "Look back",
    items: [
      { to: "/calendar", label: "Calendar", icon: CalendarDays },
      { to: "/reviews", label: "Reviews", icon: BookOpen },
      { to: "/reports", label: "Reports", icon: ScrollText },
    ],
  },
];

function isActive(pathname: string, item: NavItem, searchTab?: string): boolean {
  if (item.to === "/") return pathname === "/";
  if (item.to === "/work") {
    return (
      pathname === "/work" ||
      pathname.startsWith("/trips") ||
      pathname.startsWith("/shifts") ||
      pathname.startsWith("/customers")
    );
  }
  if (item.search?.tab) {
    return pathname.startsWith("/money") && searchTab === item.search.tab;
  }
  if (item.to === "/money") {
    return pathname.startsWith("/money") || pathname.startsWith("/expenses");
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function NavLink({
  item,
  pathname,
  searchTab,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  searchTab?: string;
  onClick?: () => void;
}) {
  const active = isActive(pathname, item, searchTab);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      search={item.search}
      onClick={onClick}
      className={cn(
        "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchTab = useRouterState({
    select: (s) => {
      const search = s.location.search as { tab?: string };
      return search?.tab;
    },
  });
  const settings = useRunsheet((s) => s.settings);
  const hydrated = useRunsheet((s) => s.hydrated);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const unsub = useRunsheet.persist.onFinishHydration(() => {
      useRunsheet.getState().setHydrated();
    });
    void useRunsheet.persist.rehydrate();
    if (useRunsheet.persist.hasHydrated()) {
      useRunsheet.getState().setHydrated();
    }
    return unsub;
  }, []);

  useEffect(() => {
    setMore(false);
  }, [pathname]);

  const first = (settings.driverName || "Driver").split(" ")[0];
  const showOnboarding = hydrated && !settings.onboarded;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside
        data-print-hide
        className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-background lg:flex"
      >
        <div className="px-5 pt-6 pb-4">
          <Link to="/" className="block">
            <p className="font-display text-2xl leading-none italic tracking-tight">Runsheet</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
              Your personal driver system
            </p>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4">
          {DESKTOP.map((group) => (
            <div key={group.heading || "home"}>
              {group.heading ? (
                <p className="mb-1 px-3 text-[11px] tracking-wide text-muted-foreground uppercase">
                  {group.heading}
                </p>
              ) : null}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink key={item.to + item.label} item={item} pathname={pathname} searchTab={searchTab} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            to="/settings"
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
              pathname.startsWith("/settings")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="size-4" />
            {first}
          </Link>
        </div>
      </aside>

      <header
        data-print-hide
        className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm lg:hidden"
      >
        <Link to="/" className="font-display text-xl italic tracking-tight">
          Runsheet
        </Link>
        <Link
          to="/settings"
          className="flex size-11 items-center justify-center rounded-md text-muted-foreground"
          aria-label="Profile"
        >
          <Settings className="size-5" />
        </Link>
      </header>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 pt-5 pb-28 lg:px-8 lg:pt-8 lg:pb-12">{children}</div>
      </main>

      <nav
        data-print-hide
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {PRIMARY.map((item) => {
            const active = isActive(pathname, item, searchTab);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMore((v) => !v)}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium",
              more || MORE.some((i) => isActive(pathname, i, searchTab))
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            <MoreHorizontal className="size-4" />
            More
          </button>
        </div>
      </nav>

      {more ? (
        <div className="fixed inset-0 z-40 lg:hidden" data-print-hide>
          <button
            type="button"
            className="absolute inset-0 bg-ink/70"
            aria-label="Close menu"
            onClick={() => setMore(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-xl bg-card px-4 pt-4 shadow-[var(--shadow-border)]"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5.5rem)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xl italic">More</p>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-md text-muted-foreground"
                onClick={() => setMore(false)}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MORE.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item, searchTab);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex min-h-14 items-center gap-3 rounded-lg px-3 text-sm",
                      active ? "bg-secondary text-foreground" : "bg-secondary/50 text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {showOnboarding ? <Onboarding /> : null}
    </div>
  );
}
