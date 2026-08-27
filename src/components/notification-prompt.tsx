"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconRemind } from "@/components/icons";
import { Button, Spinner } from "@/components/ui";

/**
 * Notification permission prompt — Phase 3 of onboarding, shown right after the
 * tour. Asks the browser for permission ONLY when the user explicitly taps
 * "Allow notifications". Skipping just closes it; there's no penalty and the
 * in-app notifications bell still works regardless (that needs no permission).
 */
export function NotificationPrompt({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const allow = async () => {
    setBusy(true);
    setNote("");
    try {
      if (typeof Notification === "undefined") {
        setNote("Notifications aren't supported in this browser.");
      } else if (Notification.permission === "granted") {
        setNote("Notifications are already on.");
      } else if (Notification.permission === "denied") {
        setNote("Notifications are blocked in your browser settings.");
      } else {
        const res = await Notification.requestPermission();
        if (res === "granted") setNote("Thanks, we'll let you know when something needs you.");
        else setNote("No problem, you can turn these on anytime in your browser.");
      }
    } catch {
      setNote("Couldn't request permission right now.");
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/25 grid place-items-center px-4" onClick={onDone}>
      <div
        className="w-full max-w-sm bg-card border border-line2 rounded-2xl shadow-pop p-7 fade-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Turn on notifications"
      >
        <div className="mx-auto h-14 w-14 rounded-2xl accent-soft accent-ink grid place-items-center mb-4">
          <IconRemind size={26} />
        </div>
        <h2 className="text-center font-head font-semibold text-lg tracking-tight">Turn on notifications</h2>
        <p className="text-center text-muted text-sm mt-2 leading-relaxed">
          Get notified of payment reminders, deliverable due dates, and new deals detected in your inbox.
        </p>

        {note && <p className={cn("text-xs text-center mt-3", note.includes("Thanks") || note.includes("already") ? "text-paid" : "text-inksoft")}>{note}</p>}

        <div className="mt-6 space-y-2.5">
          <Button className="w-full" onClick={allow} disabled={busy}>
            {busy ? <Spinner /> : <><IconRemind size={16} /> Allow notifications</>}
          </Button>
          <Button variant="secondary" className="w-full" onClick={onDone}>Skip for now</Button>
        </div>
      </div>
    </div>
  );
}