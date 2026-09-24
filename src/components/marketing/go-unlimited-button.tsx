"use client";

import { useState } from "react";
import { startUnlimited } from "@/lib/start-unlimited";

/** Pricing-page upgrade button: starts Stripe checkout if the visitor is
 *  signed in, otherwise sends them to signup first. */
export function GoUnlimitedButton({ label = "Go unlimited", className = "" }: { label?: string; className?: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        startUnlimited().then((ok) => setLoading(!ok));
      }}
      disabled={loading}
      className={"btn " + className}
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}