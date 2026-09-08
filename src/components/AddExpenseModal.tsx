import { X } from "lucide-react";
import { useState } from "react";
import { MAX_AMOUNT, money, useSpendLens } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";


const EXPENSE_PICKS = ["Food & Drink", "Transport", "Shopping", "Bills"];
const INCOME_PICKS = ["Salary", "Freelance", "Investment", "Gift", "Other Income"];
const SAVINGS_PICKS = ["Emergency Fund", "Investments", "Goal Deposit", "Other Savings"];

type Mode = "expense" | "income" | "savings";
const PICKS: Record<Mode, string[]> = {
  expense: EXPENSE_PICKS,
  income: INCOME_PICKS,
  savings: SAVINGS_PICKS,
};
const TITLES: Record<Mode, string> = {
  expense: "Add Expense",
  income: "Add Income",
  savings: "Add Savings",
};
const BUTTONS: Record<Mode, string> = {
  expense: "Save Expense",
  income: "Save Income",
  savings: "Add Savings",
};

const today = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

export function AddExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTransaction } = useSpendLens();
  const [mode, setMode] = useState<Mode>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_PICKS[0]!);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const isIncome = mode === "income";
  const isSavingsMode = mode === "savings";
  const picks = PICKS[mode];

  const switchMode = (m: Mode) => {
    setMode(m);
    setCategory(PICKS[m][0]!);
  };

  const onAmountChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    const [whole = "", frac] = cleaned.split(".");
    const next = frac === undefined ? whole : `${whole}.${frac.slice(0, 2)}`;
    if (next !== "" && Number(next) > MAX_AMOUNT) {
      setError(`Amount can't exceed ${money(MAX_AMOUNT)}`);
      return;
    }
    setError("");
    setAmount(next);
  };

  const save = () => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }
    if (n > MAX_AMOUNT) {
      setError(`Amount can't exceed ${money(MAX_AMOUNT)}`);
      return;
    }

    const [m, d, y] = date.split("/");
    const iso =
      m && d && y
        ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
        : new Date().toISOString().slice(0, 10);
    addTransaction({
      date: iso,
      category,
      note: note || (isSavingsMode ? "Savings" : isIncome ? "Income" : "Expense"),
      amount: isIncome || isSavingsMode ? n : -n,
      type: mode,
    });
    setAmount("");
    setNote("");
    setError("");
    setMode("expense");
    setCategory(EXPENSE_PICKS[0]!);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {TITLES[mode]}
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 rounded-lg bg-muted p-1">
          {(["expense", "income", "savings"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "rounded-md py-2 text-sm font-semibold capitalize transition-colors",
                mode === m
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
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
            {picks.map((c) => (
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
          {BUTTONS[mode]}
        </button>
      </div>
    </div>
  );
}
