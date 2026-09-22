import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/SummaryCard";
import { MAX_AMOUNT, money, useSpendLens } from "@/lib/spendlens-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SpendLens" },
      {
        name: "description",
        content: "Manage your SpendLens preferences, including your monthly savings goal.",
      },
      { property: "og:title", content: "Settings — SpendLens" },
      {
        property: "og:description",
        content: "Manage your SpendLens preferences, including your monthly savings goal.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { savingsGoal, setSavingsGoal } = useSpendLens();
  const [draft, setDraft] = useState(String(savingsGoal));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(String(savingsGoal));
  }, [savingsGoal]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(draft);
    if (!Number.isFinite(n) || n <= 0) {
      setError("Enter a goal greater than zero.");
      return;
    }
    if (n > MAX_AMOUNT) {
      setError(`Goal can't exceed ${money(MAX_AMOUNT)}.`);
      return;
    }
    setError(null);
    setSavingsGoal(n);
    toast.success("Savings goal updated.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your preferences, saved on this device.</p>

        <Card className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
            Monthly Savings Goal
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Used by the Savings Goal Progress card on your dashboard. Saved automatically and kept
            after refresh.
          </p>
          <form className="mt-5" onSubmit={onSubmit}>
            <label className="flex items-center gap-2 border-b-2 border-border pb-2 focus-within:border-primary">
              <span className="text-2xl font-bold text-muted-foreground">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60"
                placeholder="5,000"
                aria-label="Monthly savings goal"
              />
            </label>
            {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              Save Goal
            </button>
          </form>
        </Card>
      </main>
    </div>
  );
}
