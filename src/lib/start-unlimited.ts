"use client";

import { createClient } from "@/lib/supabase/client";

/** Start the Unlimited plan purchase: Stripe checkout if signed in,
 *  signup (plan tagged) if not. Every "Go unlimited" affordance should
 *  route through this so the funnel always ends at checkout. */
export async function startUnlimited() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "/signup?plan=unlimited";
    return false;
  }
  const res = await fetch("/api/stripe/checkout", { method: "POST" });
  let url: string | null = null;
  try {
    const j = await res.json();
    url = j.url ?? null;
  } catch {
    url = null;
  }
  if (url) {
    window.location.href = url;
    return true;
  }
  return false;
}