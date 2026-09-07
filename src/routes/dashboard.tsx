import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { DonutChart } from "@/components/DonutChart";
import { Navbar } from "@/components/Navbar";
import { Card, SummaryCard, type PillTone } from "@/components/SummaryCard";
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
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const { transactions, savingsGoal, setSavingsGoal } = useSpendLens();
  const total = thisMonthTotal(transactions);
  const income = thisMonthIncome(transactions);

  // Savings goal: actual savings = income - spend, clamped to >= 0.
  const savings = Math.max(0, income - total);
  const progressPct = savingsGoal > 0 ? Math.min(100, Math.round((savings / savingsGoal) * 100)) : 0;
  let statusPill = "Overspending";
  let statusTone: PillTone = "negative";
  if (savings > 0 || income > 0) {
    if (progressPct >= 100) {
      statusPill = "Goal reached";
      statusTone = "positive";
    } else if (progressPct >= 70) {
      statusPill = "On track";
      statusTone = "primary";
    } else {
      statusPill = "Behind";
      statusTone = "warning";
    }
  }

  useEffect(() => {
    if (goalOpen) setGoalDraft(String(savingsGoal));
  }, [goalOpen, savingsGoal]);
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
            value={`${progressPct}%`}
            pill={statusPill}
            pillTone={statusTone}
            progress={progressPct}
            sub={`${money(savings)} saved of ${money(savingsGoal)} goal`}
            action={
              <button
                aria-label="Edit savings goal"
                onClick={() => setGoalOpen(true)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
            }
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
