"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";
import { TalbyLogo } from "@/components/marketing/talby-logo";

/** Supabase enforces a minimum interval between emails to the same address.
 *  We surface our own countdown matching that so a user never hits a silent
 *  rate limit. */
const RESEND_COOLDOWN_SECONDS = 60;

export function ForgotForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Timestamp of the last sent email; the cooldown counts down live from it so
  // a user can't click into a silent Supabase rate limit.
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const emailRef = useRef<HTMLInputElement>(null);

  const cooldownRemaining = () =>
    Math.max(0, RESEND_COOLDOWN_SECONDS - Math.floor((now - (lastSentAt ?? 0)) / 1000));

  // Tick once a second while a cooldown is active so the "Resend in Ns" label
  // actually counts down (and flips back to an enabled "Resend").
  useEffect(() => {
    if (!lastSentAt || cooldownRemaining() <= 0) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  });

  const sendReset = async (): Promise<boolean> => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return false; }
    const ts = Date.now();
    setLastSentAt(ts);
    setNow(ts);
    setSent(true);
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendReset();
  };

  const resend = async () => {
    if (cooldownRemaining() > 0 || loading) return;
    await sendReset();
  };

  // "Wrong email? Try another address" — return to the form with the field
  // cleared and focused, NOT to the login page (which would lose the flow).
  // Focus must wait a frame: the email input isn't mounted until `sent` flips
  // false and React re-renders, so focus() in the same event would hit null.
  const backToForm = () => {
    setSent(false);
    setError("");
    setEmail("");
    requestAnimationFrame(() => emailRef.current?.focus());
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 no-underline">
          <TalbyLogo width={24} />
          <span className="font-semibold text-lg tracking-tight">Talby</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center">Reset your password</h1>
          <p className="text-muted text-sm text-center mt-1.5 mb-8">
            We&apos;ll email you a link to set a new one.
          </p>
          {sent ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-foreground">Check your inbox for a reset link.</p>
              <p className="text-xs text-muted mt-2">Sent to {email}</p>

              <div className="mt-5 space-y-3 text-sm">
                <button
                  type="button"
                  onClick={backToForm}
                  className="accent-text font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Wrong email? Try another address
                </button>
                <span className="block">
                  <button
                    type="button"
                    onClick={resend}
                    disabled={cooldownRemaining() > 0}
                    className="accent-text text-muted font-medium cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {cooldownRemaining() > 0
                      ? `Didn\u2019t get it? Resend in ${cooldownRemaining()}s`
                      : "Didn\u2019t get it? Resend"}
                  </button>
                </span>
                <span className="block">
                  <Link href="/login" className="text-muted font-medium">
                    Back to log in
                  </Link>
                </span>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium block mb-1.5">Email</span>
                  <Input
                    type="email"
                    value={email}
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                {error && <p className="text-sm text-bad" role="alert">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</Button>
              </form>
              <div className="text-center text-sm mt-5">
                <Link href="/login" className="text-muted font-medium">Back to log in</Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}