"use client";

import { useRef, useState } from "react";
import { ACCENT_PRESETS, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui";

/**
 * Theme control — lives at the bottom of the sidebar as a nav item with a
 * small color dot. Opens a popover (NOT a top bar) with preset swatches plus
 * a hue slider.
 *
 * Selection previews live (onPreview) but does NOT persist. A "Save color"
 * button commits the chosen accent (onSave). If you change the color and
 * don't save, the app reverts to the saved accent on next load.
 */
export function ThemePopover({
  current,
  onPreview,
  onSave,
}: {
  current: HSL;
  onPreview: (hsl: HSL) => void;
  onSave: (hsl: HSL) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState<HSL>(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shown = dirty ? preview : current;
  const dotColor = `hsl(${shown.h},${shown.s}%,${shown.l}%)`;

  const previewPreset = (p: (typeof ACCENT_PRESETS)[number]) => {
    const hsl = { h: p.h, s: p.s, l: p.l };
    setPreview(hsl);
    setDirty(true);
    setSaved(false);
    onPreview(hsl);
  };

  const onSlider = (val: number) => {
    const hsl = { h: val, s: current.s, l: current.l };
    setPreview(hsl);
    setDirty(true);
    setSaved(false);
    onPreview(hsl);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(preview);
    setSaving(false);
    setDirty(false);
    setSaved(true);
  };

  // Cancel unsaved changes: re-apply the saved accent.
  const handleCancel = () => {
    setPreview(current);
    setDirty(false);
    setSaved(false);
    onPreview(current);
  };

  const isOn = (p: (typeof ACCENT_PRESETS)[number]) =>
    Math.round(shown.h) === Math.round(p.h) &&
    Math.round(shown.s) === Math.round(p.s) &&
    Math.round(shown.l) === Math.round(p.l);

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
            {ACCENT_PRESETS.map((p) => (
              <button
                key={p.name}
                aria-label={p.name}
                className={cn("sw", isOn(p) && "on")}
                style={{ background: `hsl(${p.h},${p.s}%,${p.l}%)` }}
                onClick={() => previewPreset(p)}
              />
            ))}
          </div>
          <div className="text-[11px] text-inkfaint mb-[7px]">Or drag for any shade</div>
          <input
            type="range"
            className="hue"
            min={0}
            max={360}
            value={shown.h}
            aria-label="Accent hue"
            onChange={(e) => onSlider(Number(e.target.value))}
          />

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-9 rounded-lg accent-fill text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {saving ? <Spinner /> : null}
              {saved ? "Saved" : "Save color"}
            </button>
            {dirty && (
              <button
                onClick={handleCancel}
                className="h-9 px-3 rounded-lg border border-line2 bg-card text-[13px] font-semibold text-inksoft hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
