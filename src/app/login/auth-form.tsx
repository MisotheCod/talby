"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconEye, IconEyeInvisible } from "@/components/icons";
import { Button, Input, Spinner } from "@/components/ui";
import { TalbyLogo } from "@/components/marketing/talby-logo";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      const next = searchParams.get("next");
      router.push(next || "/app");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/onboarding` } });
      if (error) { setError(error.message); setLoading(false); return; }
      // Auto-signed-in on Supabase; go to onboarding.
      router.push("/onboarding");
      router.refresh();
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
            <TalbyLogo width={24} height={23} />
            <span className="font-semibold text-lg tracking-tight">Talby</span>
          </Link>
        <Link href={isLogin ? "/signup" : "/login"} className="text-sm accent-text font-medium">
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center">
            {isLogin ? "Welcome back" : "Create your Talby account"}
          </h1>
          <p className="text-muted text-sm text-center mt-1.5 mb-8">
            {isLogin
              ? "Log in to your brand deal command center."
              : "Track deals, money, and content in one calm place."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium block mb-1.5">Email</span>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium block mb-1.5">Password</span>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Your password" : "At least 8 characters"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                >
                  {showPw ? <IconEyeInvisible size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </label>

            {error && <p className="text-sm text-bad" role="alert">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Spinner /> : isLogin ? "Log in" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-sm text-center">
            {isLogin && (
              <Link href="/forgot-password" className="accent-text font-medium">Forgot password?</Link>
            )}
            <div className="text-muted">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="accent-text">Terms</Link> and{" "}
              <Link href="/privacy" className="accent-text">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
