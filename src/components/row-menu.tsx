"use client";

// Shared row action menu ("⋯") — the ONE dropdown every table row menu uses.
// Portal'd to document.body (position: fixed) so no ancestor's overflow/transform
// can clip it; opens below the trigger right-aligned to it, flips above when
// there's no room below; dismisses on outside click/touch and Escape. Items list
// supports a `divider: true` entry for hairline separators and `hidden` entries
// (e.g. the option that matches the row's current status).

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconMore } from "@/components/icons";

export type RowMenuItem =
  | { divider: true }
  | {
      label: string;
      onClick: () => void;
      danger?: boolean;
      icon?: React.ReactNode;
      hidden?: boolean;
    };

export function RowMenu({
  open,
  onToggle,
  items,
  ariaLabel = "Actions",
  width = 176,
}: {
  open: boolean;
  onToggle: () => void;
  items: RowMenuItem[];
  ariaLabel?: string;
  width?: number;
}) {
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

  // Position the portal'd menu when opened, based on the trigger's rect.
  React.useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const visible = items.filter((i) => !("divider" in i) && !i.hidden);
    const dividers = items.filter((i) => "divider" in i).length;
    const H = 8 + visible.length * 36 + dividers * 9; // approximate menu height
    const spaceBelow = window.innerHeight - r.bottom - 8;
    const up = spaceBelow < H && r.top > H + 8;
    const x = Math.max(8, Math.min(r.right - width, window.innerWidth - width - 8));
    const y = up ? r.top - H - 4 : r.bottom + 4;
    setPos({ x, y });
  }, [open, items, width]);

  // Outside click / touch + Escape dismiss (owned here, so item clicks don't
  // race the close).
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      onToggle();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onToggle]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className="p-1.5 rounded-lg text-inksoft hover:text-ink hover:bg-card2 cursor-pointer"
      >
        <IconMore size={16} />
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ left: pos.x, top: pos.y, width }}
            className="fixed z-[95] bg-card border border-line2 rounded-xl shadow-pop py-1 fade-up text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((it, i) =>
              "divider" in it ? (
                <div key={`d${i}`} className="my-1 h-px bg-line" />
              ) : it.hidden ? null : (
                <button
                  key={i}
                  onClick={() => {
                    onToggle();
                    it.onClick();
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer flex items-center gap-2",
                    it.danger && "text-late"
                  )}
                >
                  {it.icon}
                  {it.label}
                </button>
              )
            )}
          </div>,
          document.body
        )}
    </>
  );
}