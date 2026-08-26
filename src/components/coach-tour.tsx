"use client";

import { useEffect, useState } from "react";
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

  // Reset on open.
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Measure the current target and position the tooltip.
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const s = steps[step];
      const el = s ? document.querySelector<HTMLElement>(s.selector) : null;
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      const x = r.left, y = r.top, w = r.width, h = r.height;
      setRect({ x, y, w, h });
      const side = s.side ?? "right";
      const vw = window.innerWidth, vh = window.innerHeight;
      const TIP = 320;
      let tx = x, ty = y;
      if (side === "right") { tx = x + w + 16; ty = y + h / 2 - 40; }
      else if (side === "left") { tx = x - TIP - 16; ty = y + h / 2 - 40; }
      else if (side === "bottom") { tx = x + w / 2 - TIP / 2; ty = y + h + 16; }
      else { tx = x + w / 2 - TIP / 2; ty = y - 16; }
      // Clamp to viewport.
      tx = Math.max(12, Math.min(tx, vw - TIP - 12));
      ty = Math.max(12, Math.min(ty, vh - 40));
      setTip({ x: tx, y: ty });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
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
