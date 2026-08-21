"use client";

import { IconClose, IconCrown, IconCheck } from "@/components/icons";
import { Button } from "@/components/ui";

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
  const go = () => {
    onClose();
    window.location.href = "/#pricing";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-md p-7 rounded-2xl border border-line2 shadow-pop fade-up text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end -mt-2 -mr-2">
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer">
            <IconClose size={18} />
          </button>
        </div>
        <div className="h-14 w-14 mx-auto rounded-2xl bg-accent text-onaccent grid place-items-center">
          <IconCrown size={26} />
        </div>
        <h2 className="text-xl font-semibold mt-4 tracking-tight">You&apos;ve got more deals than the free plan holds</h2>
        <p className="text-inksoft text-sm mt-2">
          You&apos;ve hit the free plan&apos;s limit of active deals. Go unlimited
          to keep growing — unlock unlimited deals and file uploads.
        </p>
        <ul className="text-left mt-5 space-y-2 text-sm">
          <li className="flex items-center gap-2"><IconCheck size={16} className="text-accentink shrink-0" /> Unlimited active deals</li>
          <li className="flex items-center gap-2"><IconCheck size={16} className="text-accentink shrink-0" /> File &amp; attachment uploads</li>
          <li className="flex items-center gap-2"><IconCheck size={16} className="text-accentink shrink-0" /> Everything you use today, kept forever</li>
        </ul>
        <Button className="w-full mt-6" size="lg" onClick={go}>Go unlimited</Button>
        <p className="text-xs text-inksoft mt-3">Cancel anytime. Price: $20/month.</p>
      </div>
    </div>
  );
}
