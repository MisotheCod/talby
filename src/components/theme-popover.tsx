"use client";

import { useRef, useState } from "react";
import { ACCENT_PRESETS, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";

/**
 * Theme control — lives at the bottom of the sidebar as a nav item
 * with a small color dot showing the current accent. Opens a popover
 * (NOT a top bar) with preset swatches plus a hue slider. Changing
 * the accent re-tints the whole app live via applyAccent().
 */
export function ThemePopover({
  current,
  onChange,
}: {
  current: HSL;
  onChange: (hsl: HSL) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(current.h);
  const wrapRef = useRef<HTMLDivElement>(null);

  const dotColor = `hsl(${current.h},${current.s}%,${current.l}%)`;

  const pickPreset = (p: (typeof ACCENT_PRESETS)[number]) => {
    setHue(p.h);
    onChange({ h: p.h, s: p.s, l: p.l });
  };

  const onSlider = (val: number) => {
    setHue(val);
    onChange({ h: val, s: current.s, l: current.l });
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-inksoft hover:bg-card2 hover:text-ink cursor-pointer font-medium bg-transparent border-none font-sans"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 000 18c1.7 0 2-1.5 1.2-2.5-.7-1 .2-2 1.3-2H17a4 4 0 004-4c0-5-4-9-9-9z" />
          <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
        Theme
        <span
          className="w-[14px] h-[14px] rounded-full ml-auto border-2 border-white"
          style={{ background: dotColor, boxShadow: "0 0 0 1px var(--line-2)" }}
        />
      </button>

      {open && (
        <div className="theme-pop absolute bottom-[calc(100%+10px)] left-0 right-0 z-40 fade-up">
          <div className="text-xs font-semibold mb-3">Accent color</div>
          <div className="swatches">
            {ACCENT_PRESETS.map((p) => {
              const isOn =
                Math.round(current.h) === Math.round(p.h) &&
                Math.round(current.s) === Math.round(p.s) &&
                Math.round(current.l) === Math.round(p.l);
              return (
                <button
                  key={p.name}
                  aria-label={p.name}
                  className={cn("sw", isOn && "on")}
                  style={{ background: `hsl(${p.h},${p.s}%,${p.l}%)` }}
                  onClick={() => pickPreset(p)}
                />
              );
            })}
          </div>
          <div className="text-[11px] text-inkfaint mb-[7px]">Or drag for any shade</div>
          <input
            type="range"
            className="hue"
            min={0}
            max={360}
            value={hue}
            aria-label="Accent hue"
            onChange={(e) => onSlider(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
