import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Inbox, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/SummaryCard";
import { TransactionRow } from "@/components/TransactionRow";
import { CATEGORIES, useSpendLens } from "@/lib/spendlens-data";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — SpendLens" },
      {
        name: "description",
        content:
          "Browse and filter every expense and income entry by date range and category in your SpendLens ledger.",
      },
      { property: "og:title", content: "Transactions — SpendLens" },
      {
        property: "og:description",
        content: "Browse and filter every expense and income entry by date and category.",
      },
    ],
  }),
  component: Transactions,
});

const RANGES = [
  { id: "all", label: "All time" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
] as const;

type RangeId = (typeof RANGES)[number]["id"];

function withinRange(isoDate: string, range: RangeId) {
  if (range === "all") return true;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return new Date(isoDate) >= cutoff;
}

function Transactions() {
  const { transactions, clearAllTransactions } = useSpendLens();
  const [category, setCategory] = useState("All Categories");
  const [range, setRange] = useState<RangeId>("all");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (category === "All Categories" || t.category === category) &&
          withinRange(t.date, range),
      ),
    [transactions, category, range],
  );

  const isFiltered = category !== "All Categories" || range !== "all";
  const clearFilters = () => {
    setCategory("All Categories");
    setRange("all");
  };

  const handleDeleteAll = () => {
    clearAllTransactions();
    setConfirmOpen(false);
    clearFilters();
    toast.success("All transactions deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeId)}
              aria-label="Date range"
              className="appearance-none rounded-full border border-border bg-card py-2 pl-9 pr-10 text-sm text-foreground shadow-card outline-none transition-colors hover:border-primary"
            >
              {RANGES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
              className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-10 text-sm text-foreground shadow-card outline-none transition-colors hover:border-primary"
            >
              <option>All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-primary transition-colors hover:underline"
              >
                Clear filters
              </button>
            )}
            {transactions.length > 0 && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/60 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Transactions
              </button>
            )}
          </div>
        </div>

        <Card className="mt-6 p-2 sm:p-4">
          <div className="hidden grid-cols-[120px_150px_1fr_120px] gap-3 border-b border-border px-2 pb-3 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Date</span>
            <span>Category</span>
            <span>Note</span>
            <span className="text-right">Amount</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No transactions match your filters</p>
              <p className="text-sm text-muted-foreground">
                Try a different category or clear the filters.
              </p>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="mt-1 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filtered.map((t) => <TransactionRow key={t.id} txn={t} />)
          )}
        </Card>
      </main>
    </div>
  );
}
