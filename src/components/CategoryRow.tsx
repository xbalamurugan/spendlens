import { CATEGORY_COLORS, compactMoney, money } from "@/lib/spendlens-data";

export function CategoryRow({
  name,
  value,
  percent,
}: {
  name: string;
  value: number;
  percent: number;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-4 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[name] ?? "var(--chart-3)" }}
        />
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-foreground">{percent.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground" title={money(value)}>
          {compactMoney(value)}
        </p>
      </div>
    </div>

  );
}
