"use client";

// Shared multi-select dropdown (pick one or more). Same look, portal
// positioning, keyboard and outside-click behavior as `Select` (select.tsx),
// but each option is a checkbox and every selection shows as a chip inside
// the trigger. Choosing a value toggles it and KEEPS the list open (multi),
// so a user can tick several before clicking away.

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconDown, IconCheck, IconClose } from "@/components/icons";

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Choose…",
  className,
  ariaLabel,
  disabled,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const trgRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const selected = value.filter((v) => options.includes(v));

  const listH = () => Math.min(options.length * 36 + 8, 280);

  const measure = () => {
    const el = trgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 4;
    let top = r.bottom + gap;
    if (top + listH() > window.innerHeight && r.top - gap - listH() > 0) {
      top = r.top - gap - listH();
    }
    setPos({ top, left: r.left, width: Math.max(r.width, 1) });
  };

  const openList = () => {
    if (disabled || options.length === 0) return;
    measure();
    setOpen(true);
  };

  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt];
    onChange(next); // order preserved: appended at the end
  };

  // Remove a chip without opening the list.
  const removeChip = (opt: string) => {
    onChange(selected.filter((v) => v !== opt));
  };

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDoc = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      const t = e.target as Node;
      if (trgRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") { e.stopPropagation(); close(); return; }
        return;
      }
      close();
    };
    const reposition = () => measure();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onDoc);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onDoc);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={trgRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        role="combobox"
        onClick={openList}
        className={cn(
          "w-full flex items-center justify-between gap-2 bg-card border border-line2 rounded-lg pl-2.5 pr-2 min-h-9 text-sm text-ink text-left focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans cursor-pointer",
          className
        )}
      >
        {selected.length === 0 ? (
          <span className="flex-1 min-w-0 truncate text-inkfaint">{placeholder}</span>
        ) : (
          <span className="flex-1 min-w-0 flex flex-wrap gap-1 py-1">
            {selected.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-md bg-card2 border border-line px-1.5 py-0.5 text-[12px] text-ink">
                {s}
                <span
                  role="button"
                  aria-label={`Remove ${s}`}
                  onClick={(e) => { e.stopPropagation(); removeChip(s); }}
                  className="text-inksoft hover:text-ink cursor-pointer grid place-items-center"
                >
                  <IconClose size={11} />
                </span>
              </span>
            ))}
          </span>
        )}
        <IconDown size={14} className="pointer-events-none shrink-0 text-inksoft" />
      </button>

      {open && pos && createPortal(
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          aria-multiselectable
          className="fixed z-[120] bg-card border border-line2 rounded-xl shadow-pop py-1 overflow-y-auto"
          style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: 280 }}
        >
          {options.map((o) => {
            const isSel = selected.includes(o);
            return (
              <div
                key={o}
                role="option"
                aria-selected={isSel}
                className={cn(
                  "px-2.5 py-1.5 text-sm text-ink whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer flex items-center gap-2",
                  isSel && "font-medium"
                )}
                onMouseDown={(e) => { e.preventDefault(); toggle(o); }}
              >
                {/* checkbox */}
                <span className={cn(
                  "h-4 w-4 rounded border grid place-items-center shrink-0",
                  isSel ? "bg-[var(--accent)] border-[var(--accent)] text-onaccent" : "border-line2 bg-card"
                )}>
                  {isSel && <IconCheck size={11} />}
                </span>
                <span className="flex-1 min-w-0 truncate">{o}</span>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}