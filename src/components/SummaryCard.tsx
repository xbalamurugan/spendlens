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

export type PillTone = "primary" | "positive" | "negative" | "warning" | undefined;

export function Pill({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: PillTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "primary" && "bg-primary-soft text-primary",
        tone === "positive" && "bg-success/12 text-success",
        tone === "negative" && "bg-destructive/12 text-destructive",
        tone === "warning" && "bg-warning/15 text-warning",
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
  action,
}: {
  label: string;
  value: string;
  pill?: string;
  pillTone?: PillTone;
  sub?: string;
  progress?: number;
  action?: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        {action}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          title={value}
          className="max-w-full truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {value}
        </span>
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
