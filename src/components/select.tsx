"use client";

// ONE shared custom dropdown (replaces every native <select> in the app).
//
// Why: native select menus open on top of the field on Mac (a per-platform
// artifact we can't style), so every select is now a popper-positioned list:
//   - opens closed under the trigger: 4px gap, left-aligned, the trigger's
//     exact width; flips ABOVE the trigger only when there is no room below.
//   - uses the same input look as the field it replaces (height/border/radius
//     come from `className`; the chevron is our IconDown, native arrow hidden).
//   - scrolls when the list is long; full keyboard support (↑/↓ move, Enter
//     selects, Esc closes, typing jumps to the matching option).
//   - renders through a portal into document.body (fixed positioning) so no
//     ancestor's overflow/transform/backdrop-filter can clip or misplace it.
//
// API mirrors a native select so every existing call site keeps working:
//   value / defaultValue / onChange({target:{value}}) / onBlur / className /
//   children (<option>s) / aria-label / disabled / placeholder / ref (an
//   explicit prop — a live { value } accessor object the drawer's explicit-save
//   model reads on Save; setting `.value` (undo) updates a display too).

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconDown } from "@/components/icons";

type Opt = { value: string; label: string; disabled?: boolean };

function text(node: React.ReactNode): string {
  let out = "";
  for (const c of React.Children.toArray(node)) {
    if (typeof c === "string" || typeof c === "number") out += String(c);
  }
  return out;
}

function collectOptions(children: React.ReactNode): Opt[] {
  const out: Opt[] = [];
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    const props = (child.props as { value?: unknown; children?: React.ReactNode; disabled?: boolean }) ?? {};
    if (child.type === "optgroup") {
      out.push(...collectOptions(props.children ?? []));
    } else if (child.type === "option") {
      const value = props.value === undefined ? "" : String(props.value);
      out.push({ value, label: props.children === undefined ? "" : text(props.children), disabled: !!props.disabled });
    }
  }
  return out;
}

function findIndex<T>(xs: T[], pred: (x: T) => boolean): number {
  for (let i = 0; i < xs.length; i++) if (pred(xs[i])) return i;
  return -1;
}

export function Select({
  className,
  children,
  value,
  defaultValue,
  onChange,
  onBlur,
  ref,
  disabled,
  placeholder,
  "aria-label": ariaLabel,
  id,
  name,
}: {
  className?: string;
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onBlur?: () => void;
  ref?: (el: { value: string }) => void;
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  id?: string;
  name?: string;
}) {
  const options = collectOptions(children);

  const controlled = value !== undefined;
  const [display, setDisplay] = React.useState(controlled ? value : (defaultValue ?? ""));
  React.useEffect(() => {
    if (value !== undefined && value !== display) setDisplay(value);
  }, [value]);

  // A stable accessor the caller reads (Save) and sets (undo). Its getter reads
  // a ref that always holds the latest effective value, so the same object can
  // be handed to bindRef once and stay correct across re-renders.
  const currentRef = React.useRef(controlled ? value : (defaultValue ?? ""));
  React.useEffect(() => { currentRef.current = controlled ? value : display; }, [value, display]);
  const live = React.useRef<{ value: string }>({
    get value() { return currentRef.current; },
    set value(v: string) { if (!controlled) setDisplay(v); },
  }).current;

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const trgRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const buf = React.useRef("");

  const current = live.value;
  const currentLabel = options.find((o) => o.value === current)?.label ?? "";

  const commitSelection = (v: string) => {
    if (!controlled) {
      setDisplay(v);
      currentRef.current = v;
    }
    setOpen(false);
    onChange?.({ target: { value: v } });
    onBlur?.();
    if (trgRef.current) trgRef.current.focus();
  };

  const listH = () => Math.min(options.length * 36 + 8, 280);

  const measure = () => {
    const el = trgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 4;
    let top = r.bottom + gap;
    if (top + listH() > window.innerHeight && r.top - gap - listH() > 0) {
      top = r.top - gap - listH(); // flip above only when there's no room below
    }
    setPos({ top, left: r.left, width: Math.max(r.width, 1) });
  };

  const openList = () => {
    if (disabled || options.length === 0) return;
    measure();
    setActive(Math.max(0, findIndex(options, (o) => o.value === current)));
    setOpen(true);
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

  React.useEffect(() => { if (open) buf.current = ""; }, [open]);

  const typedKey = (k: string) => {
    buf.current = (buf.current + k.toLowerCase()).slice(-40);
    const idx = findIndex(options, (o) => o.label.toLowerCase().startsWith(buf.current) || o.label.toLowerCase().startsWith(k.toLowerCase()));
    if (idx >= 0) setActive(idx);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " " || /^[\x20-\x7E]$/.test(e.key)) {
        e.preventDefault();
        openList();
        if (/^[\x20-\x7E]$/.test(e.key)) typedKey(e.key);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(options.length - 1, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[active]) commitSelection(options[active].value);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      default:
        if (/^[\x20-\x7E]$/.test(e.key)) { e.preventDefault(); typedKey(e.key); }
    }
  };

  React.useEffect(() => {
    const el = itemRefs.current[active];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Expose the live accessor to the caller's ref (drawer Save reads it).
  React.useEffect(() => {
    ref?.(live);
  }, [ref]);

  return (
    <>
      <button
        ref={trgRef}
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        role="combobox"
        onClick={openList}
        onKeyDown={handleKey}
        className={cn(
          "w-full flex items-center justify-between gap-2 bg-card border border-line2 rounded-lg px-2.5 h-9 text-sm text-ink text-left focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans appearance-none cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis pr-[40px]",
          className
        )}
      >
        <span className="flex-1 min-w-0 truncate whitespace-nowrap text-left">
          {currentLabel !== "" ? currentLabel : (placeholder ?? "\u00a0")}
        </span>
        <IconDown size={14} className="pointer-events-none shrink-0 text-inksoft" />
      </button>

      {open && pos && createPortal(
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className="fixed z-[120] bg-card border border-line2 rounded-xl shadow-pop py-1 overflow-y-auto"
          style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: 280 }}
        >
          {options.map((o, i) => {
            const isActive = i === active;
            const isCur = o.value === current;
            return (
              <div
                key={`${o.value}_${i}`}
                ref={(el) => { itemRefs.current[i] = el; }}
                role="option"
                aria-selected={isCur}
                className={cn(
                  "px-2.5 py-1.5 text-sm text-ink whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer flex items-center gap-2",
                  isActive && "bg-[var(--accent-tint)]",
                  isCur && "font-medium"
                )}
                onMouseDown={(e) => { e.preventDefault(); commitSelection(o.value); }}
                onMouseEnter={() => setActive(i)}
              >
                <span className="flex-1 min-w-0 truncate">{o.label}</span>
                {isCur && <span className="shrink-0 text-[12px] text-accentink">✓</span>}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}