import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_COLORS, compactMoney, isSavings, money, type Txn } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";

export function TransactionRow({
  txn,
  selected,
  onToggle,
}: {
  txn: Txn;
  selected: boolean;
  onToggle: () => void;
}) {
  const savings = isSavings(txn);
  const income = !savings && txn.amount > 0;
  const date = new Date(`${txn.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onClick={onToggle}
      className={cn(
        "grid cursor-pointer grid-cols-[32px_110px_150px_1fr_110px] items-center gap-3 border-b border-border px-2 py-4 transition-colors last:border-0",
        selected ? "bg-primary-soft" : "hover:bg-muted/60",
      )}
    >
      <span
        onClick={(e) => e.stopPropagation()}
        className="flex h-8 w-8 items-center justify-center"
      >
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={`Select ${txn.note || txn.category}`}
        />
      </span>
      <span className="text-sm text-muted-foreground">{date}</span>
      <span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-foreground"
          style={{ backgroundColor: "var(--muted)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[txn.category] ?? "var(--chart-3)" }}
          />
          {savings ? `Savings · ${txn.category}` : txn.category}
        </span>
      </span>
      <span className="truncate text-sm text-muted-foreground">{txn.note}</span>
      <span
        title={money(Math.abs(txn.amount))}
        className={cn(
          "max-w-full truncate text-right text-sm font-semibold",
          savings ? "text-foreground" : income ? "text-primary" : "text-destructive",
        )}
      >
        {savings ? "💰 " : income ? "+" : "-"}
        {compactMoney(Math.abs(txn.amount))}
      </span>
    </div>
  );
}
