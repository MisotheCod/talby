"use client";

import { useState, useRef, useEffect } from "react";

/**
 * THE shared text/date/number input for the deal modal and drawer.
 *
 * Why this exists: the previous post-date inputs were CONTROLLED (`value=` +
 * `onChange` -> parent setState inside an index-keyed map). Every keystroke
 * re-rendered the parent and rebuilt the row, so focus dropped and typing
 * stalled — the same bug Exclusivity had before it was migrated to this
 * uncontrolled pattern. See deals/page.tsx + deal-form.tsx.
 *
 * This input is UNCONTROLLED:
 *   - React never passes it a `value` prop per keystroke. It holds its value
 *     in LOCAL state, so a parent re-render cannot rewrite it mid-keystroke.
 *   - onChange only updates local — no parent re-render per keystroke, so
 *     focus is never lost mid-typing.
 *   - It commits to the parent on BLUR via onCommit(value), never per key.
 *
 * External changes (contract extraction, undo, post-save baseline, opening a
 * different deal) reach the field either by CHANGING ITS KEY (remount with a
 * fresh value) or, while not focused, are adopted by the internal effect.
 *
 * `inputRef`: forwarded to the native <input> so a caller (the drawer's Save)
 * can read the live DOM value directly — the Save stays authoritative even if
 * the user never blurred the field.
 */
export function DealInput({
  value = "",
  onCommit,
  onChange,
  type,
  inputMode,
  placeholder,
  className = "",
  ariaLabel,
  disabled,
  inputRef,
  min,
  step,
}: {
  value?: string;
  onCommit?: (value: string) => void;
  onChange?: (value: string) => void;
  type?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | null> | ((el: HTMLInputElement | null) => void);
  min?: number;
  step?: number;
}) {
  // Local value while this node owns typing. Not driven by a value= prop, so a
  // parent re-render cannot rewrite it mid-keystroke.
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const first = useRef(true);
  const prev = useRef(value);
  useEffect(() => {
    if (focused.current) return; // user is typing — ignore external value
    if (first.current) { first.current = false; return; }
    if (value !== prev.current) { prev.current = value; setLocal(value); }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      min={min}
      step={step}
      value={local}
      onFocus={() => { focused.current = true; }}
      onChange={(e) => {
        setLocal(e.target.value);
        onChange?.(e.target.value);
        // Date inputs commit on SELECTION (change), never on blur. The native
        // picker is a separate focus surface: clicking its month arrows blurs
        // the input, and a blur-commit would re-render the row and close the
        // picker. Committing here means month navigation is a no-op (no value
        // change ⇒ no change event), while picking a day or typing a date
        // commits exactly once.
        if (type === "date") onCommit?.(e.target.value);
      }}
      onBlur={() => {
        focused.current = false;
        prev.current = local;
        // Text/number/email have pending typed text to flush on blur. Date
        // inputs do not — committing here is what closes the native picker
        // when focus moves into it (e.g. clicking a month arrow).
        if (type !== "date") onCommit?.(local);
      }}
    />
  );
}

/**
 * Multiline sibling of DealInput for notes. Same uncontrolled contract: local
 * value, commit on blur, external value adopted only while not focused.
 */
export function DealTextarea({
  value = "",
  onCommit,
  placeholder,
  className = "",
  ariaLabel,
  rows,
  inputRef,
}: {
  value?: string;
  onCommit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  rows?: number;
  inputRef?: React.MutableRefObject<HTMLTextAreaElement | null> | ((el: HTMLTextAreaElement | null) => void);
}) {
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const first = useRef(true);
  const prev = useRef(value);
  useEffect(() => {
    if (focused.current) return;
    if (first.current) { first.current = false; return; }
    if (value !== prev.current) { prev.current = value; setLocal(value); }
  }, [value]);

  return (
    <textarea
      ref={inputRef}
      rows={rows}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={className}
      value={local}
      onFocus={() => { focused.current = true; }}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        focused.current = false;
        prev.current = local;
        onCommit?.(local);
      }}
    />
  );
}