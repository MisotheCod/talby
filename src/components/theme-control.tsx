"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT_PRESETS, HEADING_FONTS, DEFAULT_HSL, DEFAULT_HEAD_FONT, DEFAULT_MODE, applyAccent, applyFont, type HSL, type ThemeMode } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { IconPalette } from "@/components/icons";

/**
 * Theme control. Two variants:
 *  - "fab" (default): a circular icon button floating in the bottom-right
 *    corner of the app. Opens the theme popover above it.
 *  - "row": a nav-item-style row (kept for backward-compat / inline use).
 * Both open the same full popover: 6 presets + Hue + Saturation + Heading
 * font. One Save persists {h, s, font}; closing otherwise reverts all.
 */
export function ThemeControl({
  variant = "fab",
  current,
  currentFont,
  currentMode = DEFAULT_MODE,
  onPreview,
  onSave,
  onPreviewFont,
  onSaveFont,
  onPreviewMode,
  onSaveMode,
}: {
  variant?: "fab" | "row";
  current: HSL;
  currentFont: string;
  currentMode?: ThemeMode;
  onPreview: (hsl: HSL) => void;
  onSave: (hsl: HSL) => Promise<void>;
  onPreviewFont: (name: string) => void;
  onSaveFont: (name: string) => Promise<void>;
  onPreviewMode?: (m: ThemeMode) => void;
  onSaveMode?: (m: ThemeMode) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [sat, setSat] = useState(current.s); // saturation 20-100
  const [font, setFont] = useState<string>(currentFont);
  const [mode, setMode] = useState<ThemeMode>(currentMode);
  const [saved, setSaved] = useState(false);
  const [working, setWorking] = useState(false);
  // Tick forces a re-render after every preview so controlled inputs (hue/sat
  // sliders) repaint. Without it, dragging hue with constant saturation passes
  // the same value to setSat/setSaved, React bails out, and the slider snaps back.
  const [, setTick] = useState(0);
  const savedRef = useRef<{ hsl: HSL; font: string; mode: ThemeMode }>({ hsl: current, font: currentFont, mode: currentMode });
  const previewRef = useRef<{ hsl: HSL; font: string; mode: ThemeMode }>({ hsl: current, font: currentFont, mode: currentMode });
  const satRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shown = previewRef.current;
  const presets = ACCENT_PRESETS;

  // Repaint saturation track gradient from the current hue.
  useEffect(() => {
    if (satRef.current) {
      satRef.current.style.background = `linear-gradient(90deg, hsl(${shown.hsl.h},20%,50%), hsl(${shown.hsl.h},100%,50%))`;
    }
  }, [shown.hsl.h, open]);

  // Keep synced when persisted accent/font/mode changes externally.
  useEffect(() => {
    const sync = { hsl: current, font: currentFont, mode: currentMode };
    savedRef.current = sync;
    previewRef.current = sync;
    setSat(current.s);
    setFont(currentFont);
    setMode(currentMode);
  }, [current, currentFont, currentMode]);

  const applyPreview = (hsl: HSL) => {
    previewRef.current = { ...previewRef.current, hsl };
    setSat(hsl.s);
    setSaved(false);
    setTick((t) => t + 1);
    onPreview(hsl);
  };
  const previewSat = (v: number) => {
    applyPreview({ h: shown.hsl.h, s: v, l: 50 });
  };
  const pickPreset = (p: (typeof presets)[number]) => applyPreview({ h: p.h, s: p.s, l: p.l });
  const pickFont = (name: string) => {
    previewRef.current = { ...previewRef.current, font: name };
    setFont(name);
    setSaved(false);
    onPreviewFont(name);
  };
  const pickMode = (m: ThemeMode) => {
    previewRef.current = { ...previewRef.current, mode: m };
    setMode(m);
    setSaved(false);
    onPreviewMode?.(m);
  };

  const close = (revert: boolean) => {
    setOpen(false);
    openRef.current = false;
    if (revert) {
      const s = savedRef.current;
      previewRef.current = s;
      setSat(s.hsl.s);
      setFont(s.font);
      setMode(s.mode);
      setSaved(false);
      onPreview(s.hsl);
      onPreviewFont(s.font);
      onPreviewMode?.(s.mode);
    }
  };

  const openPop = () => {
    const s = savedRef.current;
    previewRef.current = s;
    setSat(s.hsl.s);
    setFont(s.font);
    setMode(s.mode);
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
    await onSaveMode?.(toSave.mode);
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

  const isPresetOn = (p: (typeof presets)[number]) =>
    Math.round(shown.hsl.h) === Math.round(p.h) &&
    Math.round(shown.hsl.s) === Math.round(p.s) &&
    Math.round(shown.hsl.l) === Math.round(p.l);

  const trigger =
    variant === "fab" ? (
      <button
        onClick={(e) => { e.stopPropagation(); open ? close(true) : openPop(); }}
        aria-label="Theme"
        aria-expanded={open}
        className="theme-fab"
      >
        <IconPalette size={22} className="ic" />
        <span className="theme-fab-dot" />
      </button>
    ) : (
      <button onClick={(e) => { e.stopPropagation(); open ? close(true) : openPop(); }} className="theme-btn">
        <IconPalette size={18} className="ic" />
        Theme
        <span className="dotcol" />
      </button>
    );

  return (
    <div ref={wrapRef} className={cn("theme-launch relative", variant === "fab" && "theme-fab-wrap")}>
      {trigger}
      <div className={cn("theme-pop", open && "open")}>
        {/* Light / Dark mode toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-card2 mb-4">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              onClick={(e) => { e.stopPropagation(); pickMode(m); }}
              className={cn("flex-1 h-8 rounded-lg text-[12.5px] font-semibold cursor-pointer transition-colors", mode === m ? "bg-card text-ink shadow-sm border border-line2" : "text-inkfaint hover:text-ink")}
            >
              {m === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>

        <div className="tp-h" style={{ fontFamily: "var(--font-head)" }}>Accent color</div>

        <div className="swatches">
          {presets.map((p) => (
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