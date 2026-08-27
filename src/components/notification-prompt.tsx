"use client";

import { useEffect, useRef, useState } from "react";
import { IconRemind } from "@/components/icons";
import { Button, Spinner } from "@/components/ui";

/*
 * Notification permission prompt — Phase 3 of onboarding, shown right after the
 * tour. Handles every permission state and always ends with a visible outcome:
 *
 *   default -> "Allow notifications" calls requestPermission on click (only
 *              then). While the browser prompt is open we show a pending state.
 *              If they grant we fire a test notification and show a confirmed
 *              state; if they deny or dismiss the prompt we surface that and
 *              let them continue.
 *   granted -> the ask is NOT shown; we confirm and advance, firing a test
 *            notification so the user sees it worked.
 *   denied  -> the browser won't re-prompt, so a working "Allow" button is
 *            impossible. We replace it: explain notifications are blocked for
 *            talby.io, give the short path to re-enable in the browser's site
 *            settings, and offer only Continue. No dead button.
 *
 * Delivery is the standard Notification API: OS-level notifications while the
 * Talby web app is open (the in-app bell covers reminders regardless). It is
 * NOT web push (service worker + VAPID), which would be needed to deliver when
 * the browser tab is fully closed.
 */
type Phase = "ask" | "pending" | "confirmed" | "denied" | "unsupported";

function isMacOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac OS X|Macintosh/i.test(navigator.userAgent);
}

export function NotificationPrompt({ onDone }: { onDone: () => void }) {
  // Resolve the persisted permission once, up front, so granted users are never
  // re-asked and denied users never get a dead "Allow" button.
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof Notification === "undefined") return "unsupported";
    const p = Notification.permission;
    if (p === "granted") return "confirmed";
    if (p === "denied") return "denied";
    return "ask";
  });
  const [macHint, setMacHint] = useState(false);
  const firedRef = useRef(false);

  // Fire one test notification on a confirmed grant so the user sees it land,
  // and on macOS flag the System Settings swallow if it wouldn't be visible.
  useEffect(() => {
    if (phase !== "confirmed" || firedRef.current) return;
    firedRef.current = true;
    let fired = false;
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("Talby", {
          body: "Payment reminders, due dates, and new deals in your inbox will land here.",
        });
        fired = true;
      }
    } catch {
      fired = false;
    }
    if (isMacOS() && !fired) {
      // Defer so the hint renders after the confirmed state, not synchronously
      // inside the effect.
      const t = setTimeout(() => setMacHint(true), 0);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const ask = async () => {
    if (typeof Notification === "undefined") { setPhase("unsupported"); return; }
    setPhase("pending");
    try {
      const res = await Notification.requestPermission();
      // Resolves when the user acts on the browser prompt (allow / block / x).
      if (res === "granted") setPhase("confirmed");
      else if (res === "denied") setPhase("denied");
      else setPhase("ask"); // dismissed without choosing -> stays skippable
    } catch {
      setPhase("ask");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/25 grid place-items-center px-4" onClick={onDone}>
      <div
        className="w-full max-w-sm bg-card border border-line2 rounded-2xl shadow-pop p-7 fade-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <div className="mx-auto h-14 w-14 rounded-2xl accent-soft accent-ink grid place-items-center mb-4">
          <IconRemind size={26} />
        </div>

        {phase === "confirmed" && (
          <>
            <h2 className="text-center font-head font-semibold text-lg tracking-tight">You&apos;re all set</h2>
            <p className="text-center text-muted text-sm mt-2 leading-relaxed">
              Notifications are on. Payment reminders, due dates, and new deals will reach you without digging for them.
            </p>
            {macHint && (
              <p className="text-center text-xs text-inksoft mt-3 leading-relaxed">
                If you didn&apos;t see a test notification, open System Settings, then Notifications, and make sure your browser is allowed to send notifications.
              </p>
            )}
            <div className="mt-6"><Button className="w-full" onClick={onDone}>Continue</Button></div>
          </>
        )}

        {phase === "denied" && (
          <>
            <h2 className="text-center font-head font-semibold text-lg tracking-tight">Notifications are off</h2>
            <p className="text-center text-muted text-sm mt-2 leading-relaxed">
              Your browser has notifications blocked for talby.io. Re-enable them in your browser&apos;s site settings to get payment reminders and due-date alerts.
            </p>
            <div className="mt-6"><Button variant="secondary" className="w-full" onClick={onDone}>Continue</Button></div>
          </>
        )}

        {phase === "unsupported" && (
          <>
            <h2 className="text-center font-head font-semibold text-lg tracking-tight">Notifications aren&apos;t supported here</h2>
            <p className="text-center text-muted text-sm mt-2 leading-relaxed">Your browser doesn&apos;t offer them, so in-app reminders cover due dates and payments.</p>
            <div className="mt-6"><Button className="w-full" onClick={onDone}>Continue</Button></div>
          </>
        )}

        {(phase === "ask" || phase === "pending") && (
          <>
            <h2 className="text-center font-head font-semibold text-lg tracking-tight">Turn on notifications</h2>
            <p className="text-center text-muted text-sm mt-2 leading-relaxed">
              Get notified of payment reminders, deliverable due dates, and new deals detected in your inbox.
            </p>
            <div className="mt-6 space-y-2.5">
              <Button className="w-full" onClick={ask} disabled={phase === "pending"}>
                {phase === "pending" ? <Spinner /> : <><IconRemind size={16} /> Allow notifications</>}
              </Button>
              <Button variant="secondary" className="w-full" onClick={onDone} disabled={phase === "pending"}>Skip for now</Button>
            </div>
            {phase === "pending" && <p className="text-xs text-inksoft text-center mt-3">Waiting on your browser…</p>}
          </>
        )}
      </div>
    </div>
  );
}