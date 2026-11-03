import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Inbox } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/SummaryCard";
import { TransactionRow } from "@/components/TransactionRow";
import { CATEGORIES, money, useSpendLens, type Txn } from "@/lib/spendlens-data";

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

const TABLE_GRID = "grid grid-cols-[32px_110px_150px_1fr_110px] gap-3 px-2";

function Transactions() {
  const { transactions, deleteTransactions } = useSpendLens();
  const [category, setCategory] = useState("All Categories");
  const [range, setRange] = useState<RangeId>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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

  const visibleIds = useMemo(() => new Set(filtered.map((t) => t.id)), [filtered]);

  // If a filter change hides a ticked row, drop it from the selection.
  useEffect(() => {
    setSelected((prev) => {
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (visibleIds.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [visibleIds]);

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allVisibleSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.id));
  const someSelected = selected.size > 0 && !allVisibleSelected;

  const toggleSelectAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });

  const count = selected.size;
  const isFiltered = category !== "All Categories" || range !== "all";

  const clearFilters = () => {
    setCategory("All Categories");
    setRange("all");
  };

  const handleDeleteSelected = () => {
    const ids = [...selected];
    const n = ids.length;
    if (n === 0) return;
    deleteTransactions(ids);
    setSelected(new Set());
    setSelectionMode(false);
    setConfirmOpen(false);
    toast.success(`${n} transaction${n === 1 ? "" : "s"} deleted`);
  };

  const singleTxn =
    count === 1 ? transactions.find((t) => t.id === [...selected][0]) : undefined;

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
          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            {isFiltered && !selectionMode && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-primary transition-colors hover:underline"
              >
                Clear filters
              </button>
            )}
            {selectionMode ? (
              <>
                <span
                  aria-live="polite"
                  className="text-sm font-medium text-foreground"
                >
                  {count} selected
                </span>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={count === 0}
                  className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => {
                    setSelectionMode(false);
                    setSelected(new Set());
                  }}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setSelectionMode(true)}
                disabled={transactions.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/60 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
              >
                Clear Transactions
              </button>
            )}
          </div>
        </div>

        <Card className="mt-6 overflow-x-auto p-2 sm:p-4">
          <div className="min-w-[640px]">
            <div
              className={`${TABLE_GRID} items-center border-b border-border pb-3 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground`}
            >
              <Checkbox
                checked={allVisibleSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
                disabled={filtered.length === 0}
                className="mt-0.5"
              />
              <span>Date</span>
              <span>Category</span>
              <span>Note</span>
              <span className="text-right">Amount</span>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Inbox className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  {isFiltered ? "No transactions match your filters" : "No transactions found."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFiltered
                    ? "Try a different category or clear the filters."
                    : "Add an expense from the Dashboard to get started."}
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
              filtered.map((t) => (
                <TransactionRow
                  key={t.id}
                  txn={t}
                  selected={selected.has(t.id)}
                  onToggle={() => toggleRow(t.id)}
                />
              ))
            )}
          </div>
        </Card>
      </main>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {count} transaction{count === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
              {singleTxn &&
                ` ${singleTxn.note} — ${singleTxn.category} — ${money(
                  Math.abs(singleTxn.amount),
                )}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
