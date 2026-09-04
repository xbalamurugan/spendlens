import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { DonutChart } from "@/components/DonutChart";
import { Navbar } from "@/components/Navbar";
import { Card, SummaryCard } from "@/components/SummaryCard";
import { TrendChart } from "@/components/TrendChart";
import { categoryTotals, money, monthlyTotals, thisMonthTotal, useSpendLens } from "@/lib/spendlens-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SpendLens" },
      {
        name: "description",
        content:
          "See monthly spend, your top category, savings goal progress and a six month spending trend at a glance.",
      },
      { property: "og:title", content: "Dashboard — SpendLens" },
      {
        property: "og:description",
        content: "Monthly spend, top category, savings progress and trends at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [open, setOpen] = useState(false);
  const { transactions } = useSpendLens();
  const total = thisMonthTotal(transactions);
  const categories = categoryTotals(transactions);
  const top = categories[0];
  const trend6 = monthlyTotals(transactions, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your money, at a glance.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SummaryCard
            label="Total Spent This Month"
            value={money(total)}
            pill="+12%"
            pillTone="negative"
          />
          <SummaryCard label="Top Category" value={top.name} sub={money(top.value)} />
          <SummaryCard
            label="Savings Goal Progress"
            value="68%"
            pill="On track"
            pillTone="positive"
            progress={68}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Category Breakdown
            </h2>
            <DonutChart data={CATEGORY_TOTALS} centerLabel="Top" centerValue={top.name} />
          </Card>
          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              6 Month Trend
            </h2>
            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[320px]">
                <TrendChart data={trend6} height={244} showAxis={false} />
              </div>
            </div>
          </Card>
        </div>
      </main>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:scale-105"
      >
        <Plus className="h-4 w-4" /> Add expense
      </button>

      <AddExpenseModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
