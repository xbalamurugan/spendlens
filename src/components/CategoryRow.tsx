import { CATEGORY_COLORS, money } from "@/lib/spendlens-data";

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
    <div className="flex items-start justify-between border-b border-border py-4 last:border-0">
      <div className="flex items-center gap-3">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[name] ?? "var(--color-chart-3)" }}
        />
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{percent.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">{money(value)}</p>
      </div>
    </div>
  );
}
