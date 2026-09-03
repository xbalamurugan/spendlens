import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "@/lib/spendlens-data";

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 260,
}: {
  data: { name: string; value: number }[];
  centerLabel: string;
  centerValue: string;
  height?: number;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="66%"
            outerRadius="94%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={CATEGORY_COLORS[d.name] ?? "var(--color-chart-3)"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {centerLabel}
        </span>
        <span className="mt-1 text-xl font-bold text-foreground">{centerValue}</span>
      </div>
    </div>
  );
}
