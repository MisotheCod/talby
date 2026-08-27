"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TourStep = {
  selector: string;
  title: string;
  body: string;
  side?: "right" | "bottom" | "top" | "left";
};

/**
 * One-time coach-mark tour over the live dashboard. Renders a dimmed overlay
 * with a spotlight "hole" around the current target element and a tooltip card
 * next to it. The target is found by CSS selector and measured live, so it
 * tracks the real layout (and reacts to resize/scroll). Overlay sits at a high
 * z-index so it rises above the assistant fab and side foot.
 *
 * Positioning: the tooltip is placed on the preferred `side`, then flipped to
 * the opposite side if it doesn't fit, then clamped to the viewport — so it is
 * never cut off (e.g. the assistant-FAB tooltip near the bottom of the page).
 */
export function CoachTour({
  open,
  steps,
  onDone,
}: {
  open: boolean;
  steps: TourStep[];
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const tipRef = useRef<HTMLDivElement>(null);

  // Reset on open.
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Measure the current target + tooltip, then place the card so it anchors to
  // the target, never covers it, and stays in the viewport. Runs on open/step
  // change and re-runs on resize/scroll so it tracks the live layout.
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const s = steps[step];
      const el = s ? document.querySelector<HTMLElement>(s.selector) : null;
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      const x = r.left, y = r.top, w = r.width, h = r.height;
      setRect({ x, y, w, h });

      const tipH = tipRef.current?.offsetHeight ?? 160;
      const tipW = tipRef.current?.offsetWidth ?? 320;
      const vw = window.innerWidth, vh = window.innerHeight;
      const GAP = 14, MARGIN = 12;

      const clearOf = (tx: number, ty: number) =>
        // "clear of" = the card's box does not intersect the target's box.
        !(tx < x + w && tx + tipW > x && ty < y + h && ty + tipH > y);

      // Candidate positions for each side (adjacent to the target), clamped.
      const candidates = (side: Side) => {
        let tx = 0, ty = 0;
        switch (side) {
          case "right": tx = x + w + GAP; ty = y + h / 2 - tipH / 2; break;
          case "left": tx = x - tipW - GAP; ty = y + h / 2 - tipH / 2; break;
          case "bottom": tx = x + w / 2 - tipW / 2; ty = y + h + GAP; break;
          case "top": tx = x + w / 2 - tipW / 2; ty = y - tipH - GAP; break;
        }
        tx = Math.max(MARGIN, Math.min(tx, vw - tipW - MARGIN));
        ty = Math.max(MARGIN, Math.min(ty, vh - tipH - MARGIN));
        return { tx, ty };
      };
      const fits = (tx: number, ty: number) =>
        tx >= MARGIN && tx + tipW <= vw - MARGIN &&
        ty >= MARGIN && ty + tipH <= vh - MARGIN;

      // Try preferred side, then the perpendicular sides, then the opposite.
      const preferred: Side = s.side ?? "right";
      const orbit: Side[] = [preferred, sidePerp(preferred), sidePerp(preferred, true), opposite(preferred)];
      let chosen: { tx: number; ty: number } | null = null;
      for (const side of orbit) {
        if (chosen) break;
        const c = candidates(side);
        if (fits(c.tx, c.ty) && clearOf(c.tx, c.ty)) chosen = c;
      }
      if (!chosen) {
        // Nothing clears the target and fits; use the preferred side clamped so
        // the card is as close to its target as possible while on-screen.
        chosen = candidates(preferred);
      }
      setTip({ x: chosen.tx, y: chosen.ty });
    };
    // Wait one frame so the tooltip has rendered before measuring its height.
    const id = requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step, steps]);

  if (!open) return null;
  const cur = steps[step];
  const last = step === steps.length - 1;

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-label={cur.title}>
      {/* Dim + spotlight around the target */}
      {rect && (
        <div
          className="tour-spot"
          style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
        />
      )}

      {/* Tooltip card */}
      <div
        ref={tipRef}
        className="tour-tip"
        style={{ left: tip.x, top: tip.y, width: 320 }}
      >
        <div className="tour-kicker">Quick tour · {step + 1} of {steps.length}</div>
        <div className="tour-title">{cur.title}</div>
        <p className="tour-body">{cur.body}</p>

        <div className="tour-bar">
          <button className="tour-skip" onClick={onDone}>Skip</button>
          <div className="tour-dots">
            {steps.map((_, i) => (
              <span key={i} className={cn("tour-dot", i <= step && "on")} />
            ))}
          </div>
          {step > 0 && <button className="tour-btn ghost" onClick={() => setStep(step - 1)}>Back</button>}
          <button className="tour-btn" onClick={() => (last ? onDone() : setStep(step + 1))}>
            {last ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

type Side = "right" | "bottom" | "top" | "left";

function opposite(side: Side) {
  return side === "right" ? "left" : side === "left" ? "right" : side === "top" ? "bottom" : "top";
}

/** A perpendicular side; `tick` picks the second perpendicular if true. */
function sidePerp(side: Side, tick = false) {
  const perp: Record<Side, Side> = {
    right: "top", left: "top", top: "right", bottom: "right",
  };
  const p = perp[side];
  return tick ? opposite(p) : p;
}
