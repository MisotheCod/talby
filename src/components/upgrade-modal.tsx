"use client";

import { useState } from "react";
import { IconClose, IconCrown, IconCheck } from "@/components/icons";
import { Button, Spinner } from "@/components/ui";

/**
 * Upgrade prompt shown when a free user hits the active-deal cap.
 * Framed around growth — never as a punishment.
 */
export function UpgradeModal({
  onClose,
  feature = "6th active deal",
}: {
  onClose: () => void;
  feature?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not start checkout.");
        setLoading(false);
      }
    } catch {
      setError("Could not start checkout.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-7 fade-up text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end -mt-2 -mr-2">
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-subtle cursor-pointer">
            <IconClose size={18} />
          </button>
        </div>
        <div className="h-14 w-14 mx-auto rounded-2xl accent-fill grid place-items-center">
          <IconCrown size={26} />
        </div>
        <h2 className="text-xl font-semibold mt-4">You&apos;ve got more deals than the free plan holds</h2>
        <p className="text-muted text-sm mt-2">
          You&apos;ve hit the free plan&apos;s limit of active deals. Go unlimited
          to keep growing — unlock unlimited deals and file uploads.
        </p>
        <ul className="text-left mt-5 space-y-2 text-sm">
          <li className="flex items-center gap-2"><IconCheck size={16} className="accent-text shrink-0" /> Unlimited active deals</li>
          <li className="flex items-center gap-2"><IconCheck size={16} className="accent-text shrink-0" /> File &amp; attachment uploads</li>
          <li className="flex items-center gap-2"><IconCheck size={16} className="accent-text shrink-0" /> Everything you use today, kept forever</li>
        </ul>
        <Button className="w-full mt-6" size="lg" onClick={startCheckout} disabled={loading}>
          {loading ? <Spinner /> : "Go unlimited"}
        </Button>
        {error && <p className="text-sm text-bad mt-3" role="alert">{error}</p>}
        <p className="text-xs text-muted mt-3">Cancel anytime. Price: $9/month.</p>
      </div>
    </div>
  );
}
