"use client";

import { useEffect, useState } from "react";

// CCPA / state-privacy opt-out gate. A real opt-out: when set, PostHog is
// never initialized (see src/instrumentation-client.ts) and its cookie is
// dropped, so no analytics are collected from this device going forward.
const KEY = "talby_do_not_sell";

export function readOptOut(): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setOptOut(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
  // Drop the PostHog cookie so opting out removes the existing identifier.
  // Host-only cookie: clear without a domain attribute (adding one would fail).
  try {
    const m = document.cookie.match(/(^|;\s*)(ph_phc_[^;=]+_posthog)=([^;]*)/);
    if (m) {
      const name = m[2];
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    }
  } catch {
    /* cookie cleanup best-effort */
  }
  // Reload so instrumentation-client can apply the gate cleanly.
  window.location.reload();
}

/** Do Not Sell or Share toggle used on the Privacy page. */
export function DoNotSellControl() {
  const [on, setOn] = useState(readOptOut());
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => {
          const next = !on;
          setOptOut(next);
          setOn(next);
        }}
        style={{ backgroundColor: on ? "var(--accent)" : "var(--line)" }}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        aria-label={on ? "Opt out of data sharing is on" : "Opt out of data sharing is off"}
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-white transition-transform"
          style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
      <span className="text-sm text-muted">
        {on ? "Opt out is on. Talby will not collect analytics from this device." : "Opt out is off. Talby collects basic, anonymous analytics."}
      </span>
    </label>
  );
}