"use client";

// Neutral "+ N extras" chip shown under a deal's amount in both the mobile card
// and the desktop table. Replaces the old "+ $1,000 bonus, + 10% commission"
// line with a single count. On desktop, hovering shows a read-only card listing
// each extra (portal'd so the table's overflow:hidden can't clip it); on mobile
// the details live in the deal drawer, so the chip is informational only.

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";
import { Pill } from "@/components/ui";
import type { DealExtra } from "@/lib/pay-status";

export function ExtrasChip({
  extras,
  className,
}: {
  extras: DealExtra[];
  className?: string;
}) {
  const isMobile = useIsMobile();
  const chipRef = React.useRef<HTMLSpanElement | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [hover, setHover] = React.useState(false);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

  const count = extras.length;
  const label = `+ ${count} extra${count === 1 ? "" : "s"}`;

  const show = () => {
    if (isMobile) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const r = chipRef.current?.getBoundingClientRect();
    if (!r) return;
    const W = 232;
    const H = 12 + extras.length * 56;
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const up = spaceBelow < H && r.top > H + 8;
    const x = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8));
    const y = up ? r.top - H - 4 : r.bottom + 4;
    setPos({ x, y });
    setHover(true);
  };

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHover(false), 120);
  };

  return (
    <>
      <span
        ref={chipRef}
        className={className}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
      >
        <Pill size="sm" source="var(--ink-soft)">
          {label}
        </Pill>
      </span>
      {hover && pos && createPortal(
        <div
          className="fixed z-[95] w-[232px] bg-card border border-line2 rounded-xl shadow-pop p-2.5"
          style={{ left: pos.x, top: pos.y }}
          onMouseEnter={() => hideTimer.current && clearTimeout(hideTimer.current)}
          onMouseLeave={scheduleHide}
        >
          {extras.map((e, i) => (
            <div
              key={e.id || i}
              className={cn("py-1.5 px-1", i > 0 && "border-t border-line mt-1")}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wide text-inksoft">
                {e.kind === "bonus" ? "Bonus" : "Commission"}
              </div>
              <div className="text-[13px] font-medium text-ink">
                {e.kind === "bonus"
                  ? formatMoney(e.amount ?? 0)
                  : `${e.rate ?? 0}% of sales`}
              </div>
              {(e.kind === "bonus" ? e.condition : e.on_text) && (
                <div className="text-[11px] text-inksoft">
                  {e.kind === "bonus" ? e.condition : e.on_text}
                </div>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}