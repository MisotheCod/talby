"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Pricing-page upgrade button: starts Stripe checkout if the visitor is
 *  signed in, otherwise sends them to signup first. */
export function GoUnlimitedButton({ label = "Go unlimited" }: { label?: string }) {
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
      className="mt-8 block text-center px-6 h-12 rounded-lg accent-fill font-semibold inline-flex items-center justify-center w-full disabled:opacity-60"
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}