import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { compactMoney, money, useSpendLens } from "@/lib/spendlens-data";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/categories", label: "Categories" },
  { to: "/trends", label: "Trends" },
] as const;

type Panel = "notifications" | "account" | null;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [seenCount, setSeenCount] = useState<number | null>(null);
  const { transactions } = useSpendLens();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const recent = transactions.slice(0, 4);
  const hasUnread = seenCount === null || recent.length > seenCount;

  useEffect(() => {
    if (panel === null) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [panel]);

  const togglePanel = (p: Exclude<Panel, null>) => {
    setPanel((cur) => (cur === p ? null : p));
    if (p === "notifications") setSeenCount(recent.length);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link to="/dashboard" className="wordmark text-2xl">
          SpendLens
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="border-b-2 border-transparent pb-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "border-primary font-bold text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div ref={rootRef} className="relative ml-auto flex items-center gap-2">
          <button
            aria-label="Notifications"
            onClick={() => togglePanel("notifications")}
            className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            )}
          </button>
          <button
            aria-label="Account"
            onClick={() => togglePanel("account")}
            className="rounded-full bg-primary-soft p-2 text-primary transition-colors hover:bg-accent"
          >
            <UserRound className="h-5 w-5" />
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {panel === "notifications" && (
            <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold text-foreground">Recent activity</span>
                <Link
                  to="/transactions"
                  onClick={() => setPanel(null)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {recent.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{t.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category} · {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span
                      title={money(Math.abs(t.amount))}
                      className={`max-w-[45%] shrink-0 truncate text-sm font-semibold ${
                        t.amount < 0 ? "text-destructive" : "text-primary"
                      }`}
                    >
                      {t.amount < 0 ? "-" : "+"}
                      {compactMoney(Math.abs(t.amount))}
                    </span>

                  </li>
                ))}
                {recent.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No recent activity yet.
                  </li>
                )}
              </ul>
            </div>
          )}

          {panel === "account" && (
            <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <UserRound className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">Guest User</p>
                  <p className="truncate text-xs text-muted-foreground">guest@spendlens.app</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPanel(null);
                  navigate({ to: "/" });
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border bg-card px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              activeProps={{ className: "text-primary font-bold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
