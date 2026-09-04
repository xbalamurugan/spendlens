import { X } from "lucide-react";
import { useState } from "react";
import { useSpendLens } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";

const PICKS = ["Food & Drink", "Transport", "Shopping", "Bills"];

const today = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

export function AddExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTransaction } = useSpendLens();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(PICKS[0]!);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const save = () => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }
    const [m, d, y] = date.split("/");
    const iso =
      m && d && y
        ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
        : new Date().toISOString().slice(0, 10);
    addTransaction({ date: iso, category, note: note || "Expense", amount: -n });
    setAmount("");
    setNote("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-foreground">Add Expense</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Amount
          </label>
          <div className="mt-2 flex items-center gap-2 border-b-2 border-border pb-2 focus-within:border-primary">
            <span className="text-3xl font-semibold text-muted-foreground">₹</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Category
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PICKS.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Date
            </label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was this for?"
              className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>

        <button
          onClick={save}
          className="mt-8 w-full rounded-lg bg-primary py-3 text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
        >
          Save Expense
        </button>
      </div>
    </div>
  );
}
