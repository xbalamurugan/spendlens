import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "@/lib/spendlens-data";

function TooltipCard({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-card">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{money(payload[0].value)}</p>
    </div>
  );
}

export function TrendChart({
  data,
  height = 280,
  showAxis = true,
}: {
  data: { month: string; value: number }[];
  height?: number;
  showAxis?: boolean;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: showAxis ? 0 : -30 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            hide={!showAxis}
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(v: number) =>
              v >= 1e7
                ? `₹${(v / 1e7).toFixed(1)}Cr`
                : v >= 1e5
                  ? `₹${(v / 1e5).toFixed(1)}L`
                  : `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toLocaleString("en-IN")}`
            }

          />
          <Tooltip content={<TooltipCard />} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#trendFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
