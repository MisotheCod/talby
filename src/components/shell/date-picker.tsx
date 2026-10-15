"use client";

/**
 * DatePicker — SDatePicker (spec 01 §9). Trigger (md/sm, fill/outline) +
 * popover (296px, rTile, header prev/next + Month Year, Su..Sa grid with 42
 * cells, Presets Today / Tomorrow / In a week). No native date input.
 */

import { useState, useRef, useEffect } from "react";

const WD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function DatePicker({
  value,
  placeholder = "Pick a date",
  size = "md",
  align = "start",
  tone = "fill",
  label = "Date",
  clearable = true,
  presets = true,
  onChange,
}: {
  value: string;
  placeholder?: string;
  size?: "md" | "sm";
  align?: "start" | "end";
  tone?: "fill" | "outline";
  label?: string;
  clearable?: boolean;
  presets?: boolean;
  onChange: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [yt, mt] = (() => {
    const v = value.length === 10 ? new Date(value + "T00:00:00") : new Date();
    return [v.getFullYear(), v.getMonth()];
  })();
  const [viewY, setViewY] = useState(yt);
  const [viewM, setViewM] = useState(mt);

  const openAt = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return setOpen(true);
    let left = align === "end" ? r.right - 296 : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - 296 - 8));
    let top = r.bottom + 6;
    if (top + 372 > window.innerHeight - 8 && r.top - 372 - 6 > 8) top = r.top - 372 - 6;
    setPos({ top, left });
    // jump view to value month
    if (value.length === 10) {
      const d = new Date(value + "T00:00:00");
      setViewY(d.getFullYear()); setViewM(d.getMonth());
    } else {
      const n = new Date(); setViewY(n.getFullYear()); setViewM(n.getMonth());
    }
    setOpen(true);
  };

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const fmtFull = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return `${MS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };
  const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const shown = value || placeholder;
  const isCurrentYear = (() => { const d = value.length === 10 ? new Date(value + "T00:00:00") : today; return d.getFullYear() === today.getFullYear(); })();
  const triggerText = value ? (size === "sm" && isCurrentYear ? fmtFull(value).split(", ").slice(0, 2).join(", ") : fmtFull(value)) : placeholder;

  // build 42 cells (6 weeks Sunday first)
  const first = new Date(viewY, viewM, 1);
  const startOffset = first.getDay();
  const cells: { iso: string; day: number; inMonth: boolean }[] = [];
  const gridStart = new Date(viewY, viewM, 1 - startOffset);
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart); d.setDate(gridStart.getDate() + i);
    cells.push({ iso: isoOf(d), day: d.getDate(), inMonth: d.getMonth() === viewM });
  }

  return (
    <div className="relative w-full box-border">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}: ${shown}`}
        onClick={() => (open ? setOpen(false) : openAt())}
        className="tb tg ti flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-[var(--t-r-ctl)] text-left whitespace-nowrap"
        style={{
          height: size === "md" ? 36 : 32,
          fontSize: size === "md" ? 14 : 13,
          paddingLeft: size === "md" ? 14 : 12,
          paddingRight: 12,
          background: tone === "fill" ? "var(--t-fill)" : "var(--t-card)",
          border: tone === "outline" ? "1px solid var(--t-border)" : "none",
          color: value ? "var(--t-fg)" : "var(--t-muted-fg)",
          ["--hv" as string]: "var(--t-fill-hover)",
        } as React.CSSProperties}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /></svg>
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis tabular-nums">{triggerText}</span>
        {value && clearable && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
            className="tb inline-flex size-5 shrink-0 items-center justify-center rounded-[10px] text-[color:var(--t-muted-fg)]"
            style={{ background: "var(--t-off)", ["--hv" as string]: "var(--t-off)" } as React.CSSProperties}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </span>
        )}
        {!(value && clearable) && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}><path d="m6 9 6 6 6-6" /></svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[119]" onClick={() => setOpen(false)} />
          <div role="dialog" aria-label="Choose a date" className="a-drop fixed z-[120] w-[296px] box-border p-3"
            style={{ top: pos?.top, left: pos?.left, background: "var(--t-card)", color: "var(--t-fg)", border: "1px solid var(--t-border)", borderRadius: "var(--t-r-tile)", boxShadow: "var(--t-sh-pop)", transformOrigin: "top left" }}>
            <div className="mb-1.5 flex h-8 items-center justify-between">
              <button type="button" aria-label="Previous month" onClick={() => { const m = viewM - 1; setViewY(m < 0 ? viewY - 1 : viewY); setViewM((m + 12) % 12); }}
                className="tb tg inline-flex size-[30px] items-center justify-center rounded-[var(--t-r-ctl)] border" style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-fg)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <span className="font-medium whitespace-nowrap">{MONTHS[viewM]} {viewY}</span>
              <button type="button" aria-label="Next month" onClick={() => { const m = viewM + 1; setViewY(m > 11 ? viewY + 1 : viewY); setViewM(m % 12); }}
                className="tb tg inline-flex size-[30px] items-center justify-center rounded-[var(--t-r-ctl)] border" style={{ borderColor: "var(--t-border)", background: "var(--t-card)", color: "var(--t-fg)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {WD.map((w) => (
                <div key={w} className="h-7 text-center text-xs leading-7 text-[color:var(--t-muted-fg)]">{w}</div>
              ))}
              {cells.map((c) => {
                const selected = c.iso === value;
                const isToday = c.iso === todayIso;
                return (
                  <button key={c.iso} type="button" aria-label={fmtFull(c.iso)} aria-pressed={selected}
                    onClick={() => { onChange(c.iso); setOpen(false); }}
                    className="tb td h-9 border-0 text-[13px] tabular-nums"
                    style={{
                      borderRadius: "var(--t-r-day)",
                      background: selected ? "var(--t-primary)" : "transparent",
                      color: selected ? "var(--t-primary-fg)" : isToday ? "var(--t-fg)" : c.inMonth ? "var(--t-fg)" : "var(--t-muted-fg)",
                      fontWeight: selected || isToday ? 600 : 400,
                      boxShadow: isToday && !selected ? "inset 0 0 0 1px var(--t-border)" : "none",
                      ["--hvd" as string]: selected ? "var(--t-primary)" : "var(--t-hv)",
                    } as React.CSSProperties}
                  >
                    {c.day}
                  </button>
                );
              })}
            </div>
            {presets && (
              <div className="mt-2.5 flex items-center gap-1.5 pt-2.5" style={{ borderTop: "1px solid var(--t-line)" }}>
                {[
                  ["Today", todayIso],
                  ["Tomorrow", isoOf(addDays(today, 1))],
                  ["In a week", isoOf(addDays(today, 7))],
                ].map(([label2, iso]) => (
                  <button key={label2} type="button" onClick={() => { onChange(iso); setOpen(false); }}
                    className="tb tg h-7 rounded-[var(--t-r-ctl)] border-0 px-[11px] text-xs font-medium text-[color:var(--t-fg)]"
                    style={{ background: "var(--t-fill)", ["--hv" as string]: "var(--t-fill-hover)" } as React.CSSProperties}>
                    {label2}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}