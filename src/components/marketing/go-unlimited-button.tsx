"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Pricing-page upgrade button: starts Stripe checkout if the visitor is
 *  signed in, otherwise sends them to signup first. */
export function GoUnlimitedButton({ label = "Go unlimited", className = "" }: { label?: string; className?: string }) {
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/signup";
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={go}
      disabled={loading}
      className={"btn btn-3d btn-lg w-full " + className}
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}