import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Inbox } from "lucide-react";
import { useState } from "react";
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

function Transactions() {
  const { transactions } = useSpendLens();
  const [category, setCategory] = useState("All Categories");

  const filtered =
    category === "All Categories"
      ? transactions
      : transactions.filter((t) => t.category === category);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-card">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Oct 1 - Oct 31, 2024
          </span>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-10 text-sm text-foreground shadow-card outline-none transition-colors hover:border-primary"
            >
              <option>All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <button
            onClick={() => setCategory("All Categories")}
            className="ml-auto text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
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
            </div>
          ) : (
            filtered.map((t) => <TransactionRow key={t.id} txn={t} />)
          )}
        </Card>
      </main>
    </div>
  );
}
