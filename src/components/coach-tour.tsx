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

  // Measure the current target + tooltip, then position so it always fits.
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
      const vw = window.innerWidth, vh = window.innerHeight;
      const TIP = 320;
      const MARGIN = 12;

      // Try the preferred side, then its opposite if it overflows.
      const orbits = [s.side ?? "right", opposite(s.side ?? "right")];
      let placed = false;
      for (const side of orbits) {
        let tx = x, ty = y;
        if (side === "right") { tx = x + w + 16; ty = y + h / 2 - tipH / 2; }
        else if (side === "left") { tx = x - TIP - 16; ty = y + h / 2 - tipH / 2; }
        else if (side === "bottom") { tx = x + w / 2 - TIP / 2; ty = y + h + 16; }
        else { tx = x + w / 2 - TIP / 2; ty = y - tipH - 16; }

        // Clamp into the viewport.
        tx = Math.max(MARGIN, Math.min(tx, vw - TIP - MARGIN));
        ty = Math.max(MARGIN, Math.min(ty, vh - tipH - MARGIN));

        const fitsX = tx >= MARGIN && tx + TIP <= vw - MARGIN;
        const fitsY = ty >= MARGIN && ty + tipH <= vh - MARGIN;
        setTip({ x: tx, y: ty });
        if (fitsX && fitsY) { placed = true; break; }
      }
      // If neither side fits (very short/narrow viewport), keep the clamped
      // last attempt so it's at least on-screen as much as possible.
      if (!placed) {
        // final safety: force into view
        setTip((t) => ({
          x: Math.max(MARGIN, Math.min(t.x, vw - TIP - MARGIN)),
          y: Math.max(MARGIN, Math.min(t.y, vh - tipH - MARGIN)),
        }));
      }
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
  }, [open, step, steps, tip?.y]);

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

function opposite(side: "right" | "bottom" | "top" | "left") {
  return side === "right" ? "left" : side === "left" ? "right" : side === "top" ? "bottom" : "top";
}
