import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Txn = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  note: string;
  amount: number; // negative = expense, positive = income/savings
  type?: "expense" | "income" | "savings";
};

/** True when the entry is a savings deposit (excluded from spend/income totals). */
export const isSavings = (t: Txn) => t.type === "savings";

export const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Bills",
  "Dining Out",
  "Income",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Dining Out": "var(--chart-1)",
  "Food & Drink": "var(--chart-2)",
  Transport: "var(--chart-3)",
  Shopping: "var(--chart-4)",
  Bills: "var(--chart-5)",
  Income: "var(--primary)",
  Salary: "var(--primary)",
  Freelance: "var(--primary)",
  Investment: "var(--primary)",
  Gift: "var(--primary)",
  "Other Income": "var(--primary)",
  "Emergency Fund": "var(--chart-2)",
  Investments: "var(--chart-2)",
  "Goal Deposit": "var(--chart-2)",
  "Other Savings": "var(--chart-2)",
};

const thisMonth = new Date().toISOString().slice(0, 7); // yyyy-mm

const seed: Txn[] = [
  // current month
  { id: "1", date: `${thisMonth}-12`, category: "Dining Out", note: "Sushi with Anna", amount: -84.2 },
  { id: "2", date: `${thisMonth}-10`, category: "Transport", note: "Monthly metro pass", amount: -75 },
  { id: "3", date: `${thisMonth}-08`, category: "Shopping", note: "Running shoes", amount: -139.99 },
  { id: "4", date: `${thisMonth}-05`, category: "Bills", note: "Electricity", amount: -96.4 },
  { id: "5", date: `${thisMonth}-03`, category: "Food & Drink", note: "Weekly groceries", amount: -152.3 },
  { id: "6", date: `${thisMonth}-01`, category: "Income", note: "Freelance invoice", amount: 1200 },
  // prior months
  { id: "7", date: "2026-08-22", category: "Dining Out", note: "Team lunch", amount: -58.4 },
  { id: "8", date: "2026-08-15", category: "Food & Drink", note: "Groceries", amount: -120.0 },
  { id: "9", date: "2026-08-04", category: "Bills", note: "Internet", amount: -60.0 },
  { id: "10", date: "2026-07-18", category: "Shopping", note: "Desk lamp", amount: -48.0 },
  { id: "11", date: "2026-07-09", category: "Transport", note: "Airport taxi", amount: -42.5 },
  { id: "12", date: "2026-06-14", category: "Food & Drink", note: "Farmers market", amount: -63.1 },
  { id: "13", date: "2026-05-11", category: "Dining Out", note: "Coffee & bagel", amount: -12.75 },
  { id: "14", date: "2026-04-06", category: "Bills", note: "Phone bill", amount: -35.0 },
];

/** Spend per category (expenses only), sorted descending. */
export function categoryTotals(txns: Txn[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const t of txns) {
    if (t.amount >= 0 || isSavings(t)) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + Math.abs(t.amount));
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Monthly expense totals for the last `months` months, oldest first. */
export function monthlyTotals(txns: Txn[], months: number): { month: string; value: number }[] {
  const now = new Date();
  const buckets: { key: string; month: string; value: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      month: MONTH_NAMES[d.getMonth()]!,
      value: 0,
    });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const t of txns) {
    if (t.amount >= 0 || isSavings(t)) continue;
    const b = byKey.get(t.date.slice(0, 7));
    if (b) b.value += Math.abs(t.amount);
  }
  return buckets.map((b) => ({ month: b.month, value: Math.round(b.value * 100) / 100 }));
}

/** Total expenses in the current calendar month. */
export function thisMonthTotal(txns: Txn[]): number {
  const key = new Date().toISOString().slice(0, 7);
  return Math.round(
    txns
      .filter((t) => t.amount < 0 && !isSavings(t) && t.date.startsWith(key))
      .reduce((s, t) => s + Math.abs(t.amount), 0) * 100,
  ) / 100;
}

/** Total income in the current calendar month. */
export function thisMonthIncome(txns: Txn[]): number {
  const key = new Date().toISOString().slice(0, 7);
  return Math.round(
    txns
      .filter((t) => t.amount > 0 && !isSavings(t) && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0) * 100,
  ) / 100;
}

/** Total income in a given calendar month key (yyyy-mm). */
export function monthIncome(txns: Txn[], monthKey: string): number {
  return Math.round(
    txns
      .filter((t) => t.amount > 0 && !isSavings(t) && t.date.startsWith(monthKey))
      .reduce((s, t) => s + t.amount, 0) * 100,
  ) / 100;
}

/** Total savings deposits in the current calendar month. */
export function thisMonthSavings(txns: Txn[]): number {
  const key = new Date().toISOString().slice(0, 7);
  return Math.round(
    txns
      .filter((t) => isSavings(t) && t.date.startsWith(key))
      .reduce((s, t) => s + Math.abs(t.amount), 0) * 100,
  ) / 100;
}

export const money = (n: number) =>
  n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Largest amount a single entry may have. */
export const MAX_AMOUNT = 99999999;

const trim = (n: number) => (Math.round(n * 10) / 10).toString();

/** Overflow-safe currency: abbreviates large values (₹1.2Cr, ₹12L). */
export const compactMoney = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7)}Cr`;
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5)}L`;
  return money(n);
};


type Ctx = {
  transactions: Txn[];
  addTransaction: (t: Omit<Txn, "id">) => void;
  clearAllTransactions: () => void;
  savingsGoal: number;
  setSavingsGoal: (n: number) => void;
};

const SpendLensContext = createContext<Ctx | null>(null);

export function SpendLensProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Txn[]>(seed);
  const [savingsGoal, setSavingsGoalState] = useState(DEFAULT_GOAL);

  // Load persisted goal after hydration (SSR-safe); writes happen in setSavingsGoal.
  useEffect(() => {
    setSavingsGoalState(readStoredGoal());
  }, []);
  const setSavingsGoal = (n: number) => {
    setSavingsGoalState(n);
    window.localStorage.setItem(GOAL_STORAGE_KEY, String(n));
  };



  const value = useMemo<Ctx>(
    () => ({
      transactions,
      addTransaction: (t) =>
        setTransactions((prev) =>
          [{ ...t, id: crypto.randomUUID() }, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
        ),
      clearAllTransactions: () => setTransactions([]),
      savingsGoal,
      setSavingsGoal,
    }),
    [transactions, savingsGoal],
  );

  return <SpendLensContext.Provider value={value}>{children}</SpendLensContext.Provider>;
}

export function useSpendLens() {
  const ctx = useContext(SpendLensContext);
  if (!ctx) throw new Error("useSpendLens must be used inside SpendLensProvider");
  return ctx;
}
