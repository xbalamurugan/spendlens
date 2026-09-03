import { CATEGORY_COLORS, money, type Txn } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";

export function TransactionRow({ txn }: { txn: Txn }) {
  const income = txn.amount > 0;
  const date = new Date(`${txn.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-2 py-4 transition-colors last:border-0 hover:bg-muted/60 sm:grid-cols-[120px_150px_1fr_120px]">
      <span className="text-sm text-muted-foreground">{date}</span>
      <span className="justify-self-end sm:justify-self-start">
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
          style={{ backgroundColor: "var(--color-muted)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[txn.category] ?? "var(--color-chart-3)" }}
          />
          {txn.category}
        </span>
      </span>
      <span className="col-span-2 text-sm text-muted-foreground sm:col-span-1">{txn.note}</span>
      <span
        className={cn(
          "col-span-2 text-right text-sm font-semibold sm:col-span-1",
          income ? "text-primary" : "text-destructive",
        )}
      >
        {income ? "+" : "-"}
        {money(Math.abs(txn.amount))}
      </span>
    </div>
  );
}
