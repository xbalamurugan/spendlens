import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Txn = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  note: string;
  amount: number; // negative = expense, positive = income
};

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
};

const seed: Txn[] = [
  { id: "1", date: "2024-10-28", category: "Dining Out", note: "Sushi with Anna", amount: -84.2 },
  { id: "2", date: "2024-10-27", category: "Transport", note: "Monthly metro pass", amount: -75 },
  { id: "3", date: "2024-10-26", category: "Income", note: "Freelance invoice", amount: 1200 },
  { id: "4", date: "2024-10-24", category: "Shopping", note: "Running shoes", amount: -139.99 },
  { id: "5", date: "2024-10-22", category: "Bills", note: "Electricity", amount: -96.4 },
  { id: "6", date: "2024-10-19", category: "Food & Drink", note: "Weekly groceries", amount: -152.3 },
  { id: "7", date: "2024-10-17", category: "Dining Out", note: "Coffee & bagel", amount: -12.75 },
  { id: "8", date: "2024-10-14", category: "Shopping", note: "Desk lamp", amount: -48.0 },
  { id: "9", date: "2024-10-11", category: "Bills", note: "Internet", amount: -60.0 },
  { id: "10", date: "2024-10-08", category: "Transport", note: "Airport taxi", amount: -42.5 },
  { id: "11", date: "2024-10-05", category: "Food & Drink", note: "Farmers market", amount: -63.1 },
  { id: "12", date: "2024-10-02", category: "Dining Out", note: "Team lunch", amount: -58.4 },
];

export const CATEGORY_TOTALS = [
  { name: "Dining Out", value: 850 },
  { name: "Food & Drink", value: 620 },
  { name: "Shopping", value: 470 },
  { name: "Transport", value: 310 },
  { name: "Bills", value: 265 },
];

export const LAST_MONTH_TOTALS = [
  { name: "Dining Out", value: 690 },
  { name: "Food & Drink", value: 585 },
  { name: "Shopping", value: 610 },
  { name: "Transport", value: 280 },
  { name: "Bills", value: 258 },
];

export const TREND_ALL = [
  { month: "Jul", value: 1980 },
  { month: "Aug", value: 2240 },
  { month: "Sep", value: 2075 },
  { month: "Oct", value: 2410 },
  { month: "Nov", value: 2180 },
  { month: "Dec", value: 2680 },
  { month: "Jan", value: 2120 },
  { month: "Feb", value: 1890 },
  { month: "Mar", value: 2340 },
  { month: "Apr", value: 2050 },
  { month: "May", value: 2475 },
  { month: "Jun", value: 2515 },
];

export const money = (n: number) =>
  n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type Ctx = {
  transactions: Txn[];
  addTransaction: (t: Omit<Txn, "id">) => void;
  clearAllTransactions: () => void;
};

const SpendLensContext = createContext<Ctx | null>(null);

export function SpendLensProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Txn[]>(seed);

  const value = useMemo<Ctx>(
    () => ({
      transactions,
      addTransaction: (t) =>
        setTransactions((prev) =>
          [{ ...t, id: crypto.randomUUID() }, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
        ),
      clearAllTransactions: () => setTransactions([]),
    }),
    [transactions],
  );

  return <SpendLensContext.Provider value={value}>{children}</SpendLensContext.Provider>;
}

export function useSpendLens() {
  const ctx = useContext(SpendLensContext);
  if (!ctx) throw new Error("useSpendLens must be used inside SpendLensProvider");
  return ctx;
}
