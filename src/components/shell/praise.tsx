"use client";

/**
 * Praise — SPraise (spec 01 §8). Celebration card: confetti burst + check
 * badge, title, green chip, line, dismiss, and the 4.8s shrink timer bar.
 * Desktop bottom-center (520px), phone bottom full width.
 */

import { useEffect, useMemo, useState } from "react";

export interface PraiseData {
  id?: number;
  title?: string;
  chip?: string;
  line?: string;
  action?: string;
  href?: string;
}

const CONF = ["var(--t-primary)", "#22C55E", "#F59E0B", "#EC4899", "#8B5CF6", "var(--t-primary)", "#22C55E", "#F59E0B", "#EC4899", "#8B5CF6", "#F59E0B", "var(--t-primary)"];

export function Praise({ data, mob = false, onClose }: { data: PraiseData | null; mob?: boolean; onClose?: () => void }) {
  const [shown, setShown] = useState<PraiseData | null>(null);

  useEffect(() => { setShown(data); }, [data]);

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(null), 5200);
    return () => clearTimeout(t);
  }, [shown]);

  const conf = useMemo(() => {
    const seed = (shown?.id ?? Date.now()) % 7 || 1;
    return Array.from({ length: 12 }, (_, i) => {
      const ang = (i / 12) * Math.PI * 2 + seed * 0.37;
      const dist = 30 + ((i * 7 + seed) % 4) * 5;
      const s = 5 + (i % 3);
      return {
        s,
        dx: Math.round(Math.cos(ang) * dist),
        dy: Math.round(Math.sin(ang) * dist),
        rot: (i % 2 ? 140 : -120),
        delay: (0.14 + (i % 4) * 0.02).toFixed(2),
        color: CONF[i % CONF.length],
        round: i % 3 !== 0,
      };
    });
  }, [shown]);

  if (!shown) return null;

  return (
    <div
      className="pointer-events-none fixed z-[95] flex flex-col gap-3.5"
      style={mob ? { left: 12, right: 12, bottom: 76 } : { left: "50%", transform: "translateX(-50%)", bottom: 28, width: 520 }}
    >
      <div role="status" aria-live="polite" className="a-rise pointer-events-auto relative flex items-center gap-3.5 overflow-hidden rounded-[var(--t-r-card)] py-3.5 pr-2.5 pl-3.5"
        style={{ background: "var(--t-card)", border: "1px solid var(--t-border)", boxShadow: "var(--t-sh-pop)" }}>
        <span className="relative size-11 shrink-0">
          {conf.map((c, i) => (
            <span key={i} className="a-burst absolute top-1/2 left-1/2"
              style={{
                width: c.s, height: c.s, marginTop: -c.s / 2, marginLeft: -c.s / 2,
                borderRadius: c.round ? "50%" : 1, background: c.color,
                ["--dx" as string]: `${c.dx}px`, ["--dy" as string]: `${c.dy}px`, ["--rot" as string]: `${c.rot}deg`,
                animationDelay: `${c.delay}s`,
              } as React.CSSProperties}
            />
          ))}
          <span className="a-badge absolute inset-0 flex items-center justify-center"
            style={{ borderRadius: "var(--t-r-avatar, 16px)", background: "var(--t-primary)", color: "var(--t-primary-fg)", boxShadow: "0 6px 16px -6px color-mix(in srgb, var(--t-primary) 55%, transparent)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="a-draw"><path d="M20 6 9 17l-5-5" /></svg>
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex min-w-0 items-center gap-2">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap font-heading text-base font-semibold tracking-[-0.2px]">{shown.title || "Done"}</span>
            {shown.chip && (
              <span className="a-chip inline-flex h-[22px] items-center rounded-[var(--t-r-ctl)] px-2 text-xs font-semibold tabular-nums whitespace-nowrap"
                style={{ background: "var(--t-ok-bg)", color: "var(--t-ok-fg)" }}>{shown.chip}</span>
            )}
          </span>
          {shown.line && <span className="overflow-hidden text-[13px] text-ellipsis whitespace-nowrap text-[color:var(--t-muted-fg)]">{shown.line}</span>}
        </span>
        <button type="button" aria-label="Dismiss" onClick={() => { setShown(null); onClose?.(); }}
          className="tb tg inline-flex size-7 shrink-0 items-center justify-center rounded-[var(--t-r-item)] text-[color:var(--t-muted-fg)]"
          style={{ ["--hv" as string]: "var(--t-fill)" } as React.CSSProperties}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <span className="a-shrink absolute right-0 bottom-0 left-0 h-0.5" style={{ background: "var(--t-primary)", opacity: 0.35 }} />
      </div>
    </div>
  );
}
