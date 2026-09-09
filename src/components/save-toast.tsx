"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Lightweight, dependency-free save-toast. Module-level pub/sub so any tab in
 * the deal drawer (details, notes, checklist, payments) can fire a save toast
 * without prop-drilling. Mount <SaveToastHost /> once; call notifySaved()
 * anywhere in the same app.
 */
let listeners = new Set<() => void>();

export function notifySaved(): void {
  listeners.forEach((l) => l());
}

export function SaveToastHost() {
  const [show, setShow] = useState(false);

  const sub = useCallback((l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const unsub = sub(() => {
      setShow(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setShow(false), 2000);
    });
    return () => {
      unsub();
      if (timeout) clearTimeout(timeout);
    };
  }, [sub]);

  return (
    <div className="fixed top-4 right-4 z-[90] pointer-events-none">
      <div
        className={
          "transition-all duration-300 font-semibold text-[13px] rounded-full px-4 py-2 shadow-lg border flex items-center gap-2 " +
          (show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
        }
        style={{ background: "var(--card)", borderColor: "var(--line)", color: "var(--ink)" }}
        role="status"
        aria-live="polite"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--paid)]" />
        Saved
      </div>
    </div>
  );
}