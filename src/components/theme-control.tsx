"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT_PRESETS, DEFAULT_HSL, applyAccent, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";

/**
 * Theme control — a "Theme" row with a live color dot at the bottom of the
 * sidebar. Clicking opens a popover with 6 preset swatches, a hue slider,
 * and a "Save theme" 3D button.
 *
 * Preview / Save / Revert:
 *  - Picking a swatch or dragging the slider previews live (onPreview).
 *  - Pressing "Save theme" persists (onSave) then closes.
 *  - Closing the popover any other way (outside click / toggling shut)
 *    reverts to the last saved accent.
 */
export function ThemeControl({
  current,
  onPreview,
  onSave,
}: {
  current: HSL;
  onPreview: (hsl: HSL) => void;
  onSave: (hsl: HSL) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(current.h);
  const [saved, setSaved] = useState(false);
  const [working, setWorking] = useState(false);
  const savedRef = useRef<HSL>(current);
  const previewRef = useRef<HSL>(current);
  const openRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shown = previewRef.current;
  const dotColor = `hsl(${shown.h},${shown.s}%,${shown.l}%)`;

  // Keep synced when the persisted accent changes externally.
  useEffect(() => {
    savedRef.current = current;
    previewRef.current = current;
    setHue(current.h);
  }, [current]);

  const applyPreview = (hsl: HSL) => {
    previewRef.current = hsl;
    setHue(hsl.h);
    setSaved(false);
    onPreview(hsl);
  };

  const pickPreset = (p: (typeof ACCENT_PRESETS)[number]) => applyPreview({ h: p.h, s: p.s, l: p.l });
  const onSlider = (v: number) => applyPreview({ h: v, s: shown.s, l: shown.l });

  const close = (revert: boolean) => {
    setOpen(false);
    openRef.current = false;
    if (revert) {
      onPreview(savedRef.current);
      previewRef.current = savedRef.current;
      setHue(savedRef.current.h);
      setSaved(false);
    }
  };

  const openPop = () => {
    // reset preview to saved on each open
    previewRef.current = savedRef.current;
    setHue(savedRef.current.h);
    setSaved(false);
    setOpen(true);
    openRef.current = true;
  };

  const handleSave = async () => {
    const toSave = previewRef.current;
    savedRef.current = toSave;
    setWorking(true);
    await onSave(toSave);
    setWorking(false);
    setSaved(true);
    // brief "Saved" then close without reverting
    setTimeout(() => close(false), 700);
  };

  // Outside click -> revert + close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openRef.current && wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close(true);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="theme-launch relative">
      <button onClick={(e) => { e.stopPropagation(); open ? close(true) : openPop(); }} className="theme-btn">
        <svg className="ic" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 000 18c1.7 0 2-1.5 1.2-2.5-.7-1 .2-2 1.3-2H17a4 4 0 004-4c0-5-4-9-9-9z" />
          <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
        </svg>
        Theme
        <span className="dotcol" style={{ background: dotColor }} />
      </button>

      <div className={cn("theme-pop", open && "open")}>
        <div className="tp-h" style={{ fontFamily: "var(--font-lexend)" }}>Accent color</div>
        <div className="swatches">
          {ACCENT_PRESETS.map((p) => {
            const isOn =
              Math.round(shown.h) === Math.round(p.h) &&
              Math.round(shown.s) === Math.round(p.s) &&
              Math.round(shown.l) === Math.round(p.l);
            return (
              <button
                key={p.name}
                aria-label={p.name}
                onClick={(e) => { e.stopPropagation(); pickPreset(p); }}
                className={cn("sw", isOn && "on")}
                style={{ background: `hsl(${p.h},${p.s}%,${p.l}%)` }}
              />
            );
          })}
        </div>
        <div className="tp-label">Or drag for any shade</div>
        <input type="range" className="hue" min={0} max={360} value={hue}
          aria-label="Accent hue"
          onChange={(e) => onSlider(Number(e.target.value))} />
        <button className="btn3d full" style={{ marginTop: 14 }} disabled={working}
          onClick={handleSave}>
          {saved ? "Saved" : "Save theme"}
        </button>
      </div>
    </div>
  );
}
