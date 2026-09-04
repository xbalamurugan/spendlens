import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CategoryRow } from "@/components/CategoryRow";
import { DonutChart } from "@/components/DonutChart";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/SummaryCard";
import { categoryTotals, money, useSpendLens } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Category Breakdown — SpendLens" },
      {
        name: "description",
        content:
          "Analyze how your spending is distributed across categories this month versus last month.",
      },
      { property: "og:title", content: "Category Breakdown — SpendLens" },
      {
        property: "og:description",
        content: "See how your spending is distributed across categories.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  const [range, setRange] = useState<"this" | "last">("this");
  const { transactions } = useSpendLens();
  const now = new Date();
  const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const thisKey = monthKey(now);
  const lastKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const key = range === "this" ? thisKey : lastKey;
  const data = categoryTotals(transactions.filter((t) => t.date.startsWith(key)));
  const total = data.reduce((s: number, c: { value: number }) => s + c.value, 0);
  const top = data[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Category Breakdown
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Analyze your spending distribution.
            </p>
          </div>
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-card">
            {(["this", "last"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  range === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r === "this" ? "This Month" : "Last Month"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-primary-soft px-5 py-4 text-sm text-foreground">
          <span className="font-bold text-primary">Insight:</span>{" "}
          {top && total > 0 ? (
            <>
              {top.name} accounts for {((top.value / total) * 100).toFixed(0)}% of your spend —
              about {money(top.value - total / data.length)} above your typical category average.
            </>
          ) : (
            <>No expenses recorded for this period yet.</>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <DonutChart
              data={data}
              centerLabel="Total"
              centerValue={money(total)}
              height={320}
            />
          </Card>
          <Card>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Categories
            </h2>
            <div className="mt-2">
              {data.map((c) => (
                <CategoryRow
                  key={c.name}
                  name={c.name}
                  value={c.value}
                  percent={(c.value / total) * 100}
                />
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
