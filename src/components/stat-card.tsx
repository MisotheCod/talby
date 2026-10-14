import { cn } from "@/lib/utils";

/**
 * Shared stat-card — the ONE card used by the Overview and the Payments pages.
 * Renders `.statcard` > `.lbl` (uppercase gray label) + `.val` (large number) +
 * `.sub` (one small gray line). Any future change to this component applies to
 * both pages.
 */
export function StatCard({
  label,
  value,
  sub,
  color,
  className,
  valueClassName,
  dataN,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  color?: string;
  className?: string;
  valueClassName?: string;
  dataN?: number;
}) {
  return (
    <div className={cn("statcard", className)}>
      <div className="lbl">{label}</div>
      <div
        className={cn("val", valueClassName)}
        style={color ? { color } : undefined}
        {...(dataN !== undefined ? { "data-n": dataN } : {})}
      >
        {value}
      </div>
      {sub != null && sub !== "" && <div className="sub">{sub}</div>}
    </div>
  );
}