import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-card sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "positive" | "negative";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "primary" && "bg-primary-soft text-primary",
        tone === "positive" && "bg-success/12 text-success",
        tone === "negative" && "bg-destructive/12 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function SummaryCard({
  label,
  value,
  pill,
  pillTone,
  sub,
  progress,
}: {
  label: string;
  value: string;
  pill?: string;
  pillTone?: "primary" | "positive" | "negative";
  sub?: string;
  progress?: number;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        {pill && <Pill tone={pillTone}>{pill}</Pill>}
      </div>
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
      {progress !== undefined && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Card>
  );
}
