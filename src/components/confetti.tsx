"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Lightweight, dependency-free confetti burst. Renders a fixed full-screen
 * layer of animated confetti pieces for a moment then removes itself.
 * Trigger anywhere via <Celebration /> mounted conditionally.
 */
export function ConfettiBurst({
  duration = 2600,
  count = 90,
  onDone,
}: {
  duration?: number;
  count?: number;
  onDone?: () => void;
}) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => {
      const hue = [210, 268, 46, 355, 22, 160, 340, 240][i % 8];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.45;
      const dur = 1.6 + Math.random() * 1.4;
      const size = 6 + Math.random() * 7;
      const drift = (Math.random() - 0.5) * 60;
      return { id: i, hue, left, delay, dur, size, drift, round: Math.random() > 0.5 };
    })
  );

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timer.current = setTimeout(() => onDone?.(), duration);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [duration, onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: `hsl(${p.hue} 76% 56%)`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.42,
            borderRadius: p.round ? "50%" : "2px",
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        .confetti-piece{
          position:absolute; top:-14px;
          animation: confetti-fall linear forwards;
        }
        @keyframes confetti-fall{
          0%{ transform:translate(0,0) rotate(0deg); opacity:1; }
          100%{ transform:translate(var(--drift), 108vh) rotate(720deg); opacity:0.85; }
        }
      `}</style>
    </div>
  );
}

/** Callback hook: returns [bursting, fire] — fire() triggers a burst. */
export function useCelebration(duration = 2600) {
  const [bursting, setBursting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fire = useCallback(() => {
    setBursting(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBursting(false), duration);
  }, [duration]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const El = bursting ? <ConfettiBurst duration={duration} onDone={() => setBursting(false)} /> : null;
  return { bursting, fire, ToastEl: El };
}
