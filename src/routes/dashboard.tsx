import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { DonutChart } from "@/components/DonutChart";
import { Navbar } from "@/components/Navbar";
import { Card, SummaryCard } from "@/components/SummaryCard";
import { TrendChart } from "@/components/TrendChart";
import { categoryTotals, money, monthlyTotals, thisMonthIncome, thisMonthTotal, useSpendLens } from "@/lib/spendlens-data";

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
  const income = thisMonthIncome(transactions);
  const categories = categoryTotals(transactions);
  const top = categories[0];
  const trend6 = monthlyTotals(transactions, 6);
  const lastMonth = trend6[trend6.length - 2]?.value ?? 0;
  const changePct =
    lastMonth > 0 ? Math.round(((total - lastMonth) / lastMonth) * 100) : total > 0 ? 100 : 0;

  // Income month-over-month change vs. last month.
  const lastMonthKey = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  })();
  const lastMonthIncome = transactions
    .filter((t) => t.amount > 0 && t.date.startsWith(lastMonthKey))
    .reduce((s, t) => s + t.amount, 0);
  const incomeChangePct =
    lastMonthIncome > 0
      ? Math.round(((income - lastMonthIncome) / lastMonthIncome) * 100)
      : income > 0
        ? 100
        : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your money, at a glance.</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Add expense
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SummaryCard
            label="Total Spent This Month"
            value={money(total)}
            pill={`${changePct >= 0 ? "+" : ""}${changePct}%`}
            pillTone={changePct > 0 ? "negative" : "positive"}
          />
          <SummaryCard
            label="Total Income This Month"
            value={money(income)}
            {...(income > 0
              ? {
                  pill: `${incomeChangePct >= 0 ? "+" : ""}${incomeChangePct}%`,
                  pillTone: (incomeChangePct >= 0 ? "positive" : "negative") as
                    | "positive"
                    | "negative",
                }
              : {})}
          />
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
            {categories.length > 0 ? (
              <DonutChart
                data={categories}
                centerLabel="Top"
                centerValue={top?.name ?? "—"}
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                No expenses yet — add one to see your breakdown.
              </div>
            )}
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

      <AddExpenseModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
