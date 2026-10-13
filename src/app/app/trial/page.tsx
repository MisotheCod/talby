"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";
import { startUnlimited } from "@/lib/start-unlimited";
import { TalbyLogo } from "@/components/marketing/talby-logo";

/**
 * Start-trial screen. Shown to a signed-in user who has no active trial or
 * subscription (plan_status 'none' or 'canceled') — e.g. they left Checkout
 * without finishing. Full access is behind the 14-day trial; this screen is
 * the only route forward other than completing Checkout.
 */
export default function TrialPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abandoned checkout: they hit cancel_url. Funnel it.
  const wasAbandoned = searchParams.get("checkout") === "abandoned";
  useEffect(() => {
    if (wasAbandoned) posthog.capture("checkout_abandoned", { method: "email" });
  }, [wasAbandoned]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) setEmail(data.user.email ?? null);
    })();
  }, []);

  const begin = async () => {
    setStarting(true);
    setError(null);
    posthog.capture("checkout_opened", { method: "email", source: "trial_screen" });
    const ok = await startUnlimited();
    if (!ok) {
      setError("Couldn't start Checkout. Try again in a moment.");
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <TalbyLogo width={28} />
          <span className="font-bold text-lg tracking-tight">Talby</span>
        </div>

        <div className="bg-card border border-line rounded-2xl p-8 shadow-card text-center">
          <h1 className="text-xl font-semibold tracking-tight">Start your 14 day free trial</h1>
          <p className="text-inksoft text-sm mt-2">
            {email ? <>Signed in as <span className="text-ink font-medium">{email}</span>.</> : "Your deals are safe."}{" "}
            Add a card to unlock everything and keep adding and editing deals.
          </p>

          <div className="mt-6 space-y-2 text-sm text-left bg-card2 rounded-xl p-4">
            <div className="flex justify-between"><span>First 14 days</span><span className="font-medium">Free</span></div>
            <div className="flex justify-between"><span>Then</span><span className="font-medium">$9 a month</span></div>
            <div className="flex justify-between"><span>Cancel</span><span className="font-medium">Anytime</span></div>
          </div>

          <button
            onClick={begin}
            disabled={starting}
            className="mt-6 w-full h-11 rounded-xl accent-fill text-sm font-semibold disabled:opacity-50 cursor-pointer"
          >
            {starting ? <span className="inline-block animate-spin">—</span> : "Start free trial"}
          </button>

          {error && <p className="text-late text-sm mt-3" role="alert">{error}</p>}
          <p className="text-inksoft text-xs mt-4">
            You won&apos;t be charged until the trial ends. Cancel anytime before then.
          </p>
        </div>

        <p className="text-center text-sm mt-6">
          <Link href="/login" className="accent-ink font-semibold underline underline-offset-2">Switch account</Link>
        </p>
      </div>
    </div>
  );
}