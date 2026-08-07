"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

export function ForgotForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg accent-fill grid place-items-center text-xs font-bold">T</span>
          <span className="font-display font-semibold text-lg tracking-tight">Talby</span>
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
              <Link href="/login" className="inline-block mt-4 text-sm accent-text font-medium">Back to log in</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium block mb-1.5">Email</span>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              {error && <p className="text-sm text-bad" role="alert">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
