import { X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORY_COLORS, compactMoney, isSavings, money, type Txn } from "@/lib/spendlens-data";
import { cn } from "@/lib/utils";

export function TransactionRow({ txn, onDelete }: { txn: Txn; onDelete?: () => void }) {
  const savings = isSavings(txn);
  const income = !savings && txn.amount > 0;
  const date = new Date(`${txn.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-border px-2 py-4 transition-colors last:border-0 hover:bg-muted/60 sm:grid-cols-[120px_150px_1fr_120px_32px]">
      <span className="text-sm text-muted-foreground">{date}</span>
      <span className="justify-self-end sm:justify-self-start">
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
      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete transaction"
              className={cn(
                "group flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                "sm:order-last",
              )}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      )}
      <span className="col-span-3 text-sm text-muted-foreground sm:col-span-1">{txn.note}</span>
      <span
        title={money(Math.abs(txn.amount))}
        className={cn(
          "col-span-3 max-w-full truncate text-right text-sm font-semibold sm:col-span-1",
          savings ? "text-foreground" : income ? "text-primary" : "text-destructive",
        )}
      >
        {savings ? "💰 " : income ? "+" : "-"}
        {compactMoney(Math.abs(txn.amount))}
      </span>

    </div>
  );
}
