import { createFileRoute } from "@tanstack/react-router";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/SummaryCard";
import { TrendChart } from "@/components/TrendChart";
import { money, monthlyTotals, useSpendLens } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";

const RANGES = { "3M": 3, "6M": 6, "1Y": 12, ALL: 24 } as const;
type RangeKey = keyof typeof RANGES;

export const Route = createFileRoute("/trends")({
  head: () => ({
    meta: [
      { title: "Spending Trends — SpendLens" },
      {
        name: "description",
        content:
          "Track how your total expenditure moves over 3 months, 6 months, a year or your full history.",
      },
      { property: "og:title", content: "Spending Trends — SpendLens" },
      {
        property: "og:description",
        content: "Track how your total expenditure moves over time.",
      },
    ],
  }),
  component: Trends,
});

function Trends() {
  const [range, setRange] = useState<RangeKey>("6M");
  const { transactions } = useSpendLens();
  const data = monthlyTotals(transactions, RANGES[range]);
  const avg = data.reduce((s: number, d: { value: number }) => s + d.value, 0) / data.length;
  const up = (data.at(-1)?.value ?? 0) >= (data[0]?.value ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Spending Trends</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your overall expenditure over time.
            </p>
          </div>
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-card">
            {(Object.keys(RANGES) as RangeKey[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  range === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Card className="mt-6">
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <TrendChart data={data} height={340} />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-sm">
            {up ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-success" />
            )}
            <span className="text-muted-foreground">
              Spending is trending {up ? "up" : "down"} over this period, averaging{" "}
              <span className="font-semibold text-foreground">{money(avg)}</span> per month.
            </span>
          </div>
        </Card>
      </main>
    </div>
  );
}
