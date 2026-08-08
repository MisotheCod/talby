"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT_PRESETS, HEADING_FONTS, DEFAULT_HSL, DEFAULT_HEAD_FONT, applyAccent, applyFont, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";

/**
 * Theme control — a "Theme" row with a live color dot at the bottom of the
 * sidebar. Opens a popover with three user choices, all previewing live:
 *   1. Accent hue (0-360)
 *   2. Accent saturation (20-100, track repaints with hue)
 *   3. Heading font (2x2 chips, each in its own typeface)
 * One Save persists the full set {h, s, font}; closing otherwise reverts all.
 */
export function ThemeControl({
  current,
  currentFont,
  onPreview,
  onSave,
  onPreviewFont,
  onSaveFont,
}: {
  current: HSL;
  currentFont: string;
  onPreview: (hsl: HSL) => void;
  onSave: (hsl: HSL) => Promise<void>;
  onPreviewFont: (name: string) => void;
  onSaveFont: (name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [sat, setSat] = useState(current.s); // saturation 20-100
  const [font, setFont] = useState<string>(currentFont);
  const [saved, setSaved] = useState(false);
  const [working, setWorking] = useState(false);
  const savedRef = useRef<{ hsl: HSL; font: string }>({ hsl: current, font: currentFont });
  const previewRef = useRef<{ hsl: HSL; font: string }>({ hsl: current, font: currentFont });
  const satRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shown = previewRef.current;

  // Repaint saturation track gradient from the current hue.
  useEffect(() => {
    if (satRef.current) {
      satRef.current.style.background = `linear-gradient(90deg, hsl(${shown.hsl.h},20%,50%), hsl(${shown.hsl.h},100%,50%))`;
    }
  }, [shown.hsl.h, open]);

  // Keep synced when persisted accent/font changes externally.
  useEffect(() => {
    const sync = { hsl: current, font: currentFont };
    savedRef.current = sync;
    previewRef.current = sync;
    setSat(current.s);
    setFont(currentFont);
  }, [current, currentFont]);

  const applyPreview = (hsl: HSL) => {
    previewRef.current = { ...previewRef.current, hsl };
    setSat(hsl.s);
    setSaved(false);
    onPreview(hsl);
  };
  const previewSat = (v: number) => {
    applyPreview({ h: shown.hsl.h, s: v, l: 50 });
  };
  const pickPreset = (p: (typeof ACCENT_PRESETS)[number]) => applyPreview({ h: p.h, s: p.s, l: p.l });
  const pickFont = (name: string) => {
    previewRef.current = { ...previewRef.current, font: name };
    setFont(name);
    setSaved(false);
    onPreviewFont(name);
  };

  const close = (revert: boolean) => {
    setOpen(false);
    openRef.current = false;
    if (revert) {
      const s = savedRef.current;
      previewRef.current = s;
      setSat(s.hsl.s);
      setFont(s.font);
      setSaved(false);
      onPreview(s.hsl);
      onPreviewFont(s.font);
    }
  };

  const openPop = () => {
    const s = savedRef.current;
    previewRef.current = s;
    setSat(s.hsl.s);
    setFont(s.font);
    setSaved(false);
    setOpen(true);
    openRef.current = true;
  };

  const handleSave = async () => {
    const toSave = previewRef.current;
    savedRef.current = toSave;
    setWorking(true);
    await onSave(toSave.hsl);
    await onSaveFont(toSave.font);
    setWorking(false);
    setSaved(true);
    // brief "Saved" then close without reverting
    setTimeout(() => close(false), 700);
  };

  // Outside click -> revert all three + close
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

  const isPresetOn = (p: (typeof ACCENT_PRESETS)[number]) =>
    Math.round(shown.hsl.h) === Math.round(p.h) &&
    Math.round(shown.hsl.s) === Math.round(p.s) &&
    Math.round(shown.hsl.l) === Math.round(p.l);

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
        <span className="dotcol" />
      </button>

      <div className={cn("theme-pop", open && "open")}>
        <div className="tp-h" style={{ fontFamily: "var(--font-head)" }}>Accent color</div>

        <div className="swatches">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.name}
              aria-label={p.name}
              onClick={(e) => { e.stopPropagation(); pickPreset(p); }}
              className={cn("sw", isPresetOn(p) && "on")}
              style={{ background: `hsl(${p.h},${p.s}%,${p.l}%)` }}
            />
          ))}
        </div>

        <div className="tp-label">Hue</div>
        <input type="range" className="hue" min={0} max={360} value={shown.hsl.h}
          aria-label="Accent hue"
          onChange={(e) => applyPreview({ h: Number(e.target.value), s: shown.hsl.s, l: 50 })} />

        <div className="tp-label">Saturation</div>
        <input ref={satRef} type="range" className="sat" min={20} max={100} value={sat}
          aria-label="Accent saturation"
          onChange={(e) => previewSat(Number(e.target.value))} />

        <div className="tp-label">Heading font</div>
        <div className="fontrow">
          {HEADING_FONTS.map((f) => (
            <button
              key={f.name}
              className={cn("fchip", font === f.name && "on")}
              style={{ fontFamily: f.cssVar }}
              onClick={(e) => { e.stopPropagation(); pickFont(f.name); }}
            >
              {f.name === "Bricolage Grotesque" ? "Bricolage" : f.name}
            </button>
          ))}
        </div>

        <button className="btn3d full" style={{ marginTop: 14 }} disabled={working}
          onClick={handleSave}>
          {saved ? "Saved" : "Save theme"}
        </button>
      </div>
    </div>
  );
}
