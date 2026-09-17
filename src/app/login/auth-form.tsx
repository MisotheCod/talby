"use client";

import { useState } from "react";
import posthog from "posthog-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconEye, IconEyeInvisible, IconCheck } from "@/components/icons";
import { TalbyLogo } from "@/components/marketing/talby-logo";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) { posthog.identify(data.user.id, { email }); posthog.capture("login"); }
      const next = searchParams.get("next");
      router.push(next || "/app");
      router.refresh();
    } else {
      const handleClean = handle.trim().replace(/\s+/g, "");
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/onboarding`, data: { handler: handleClean || null } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      // Persist the creator handle onto the fresh profile row (auto-created by
      // the on_auth_user_created trigger). Onboarding reads it to auto-fill.
      if (data.user && handleClean) {
        await supabase.from("profiles").update({ handler: handleClean }).eq("id", data.user.id);
      }
      if (data.user) { posthog.identify(data.user.id, { email }); posthog.capture("signup"); }
      router.push("/onboarding");
      router.refresh();
    }
  };

  return (
    <div className="auth-split">
      {/* Left — the form */}
      <div className="auth-col auth-form-col">
        <div className="auth-top">
          <Link href="/" className="auth-brand no-underline">
            <TalbyLogo width={26} />
            <span className="auth-wordmark">Talby</span>
          </Link>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form-inner">
            <h1 className="auth-heading">{isLogin ? "Log in" : "Create your account"}</h1>
            <p className="auth-switch">
              {isLogin ? "New to Talby? " : "Already have an account? "}
              <Link href={isLogin ? "/signup" : "/login"} className="auth-switch-link">
                {isLogin ? "Create an account" : "Log in"}
              </Link>
            </p>

            <form onSubmit={submit} className="auth-fields" noValidate>
              {!isLogin && (
                <label className="auth-field">
                  <span className="auth-label">Creator handle</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@creator"
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="auth-input"
                  />
                </label>
              )}

              <label className="auth-field">
                <span className="auth-label">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="auth-input"
                />
              </label>

              <div className="auth-pw-wrap">
                <div className="auth-label-row" style={{ visibility: isLogin ? "visible" : "hidden" }} aria-hidden={!isLogin}>
                  <span className="auth-label">Password</span>
                  <Link href="/forgot-password" className="auth-forgot">Forgot your password?</Link>
                </div>
                <div className="auth-pw-input">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="auth-input auth-input-pw"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="auth-eye"
                  >
                    {showPw ? <IconEyeInvisible size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : isLogin ? "Log in" : "Create account"}
              </button>
            </form>

            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="auth-term-link">Terms</Link> and{" "}
              <Link href="/privacy" className="auth-term-link">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="auth-col auth-brand-col" aria-hidden="true">
        <div className="auth-panel">
          <div className="auth-panel-inner">
            <h2 className="auth-panel-h">Never guess what a brand owes you.</h2>
            <p className="auth-panel-sub">Upload the contract, Talby fills in the deal.</p>

            <div className="auth-cards">
              {/* Card 1: contract extraction */}
              <div className="auth-panel-card">
                <div className="ac-row">
                  <span className="ac-badge"><IconCheck size={13} /></span>
                  <span className="ac-file">Halcyon_Agreement.pdf</span>
                  <span className="ac-check"><IconCheck size={15} /></span>
                </div>
                <div className="ac-grid">
                  <div className="ac-cell"><span className="ac-k">Brand</span><span className="ac-v">Halcyon Health</span></div>
                  <div className="ac-cell ac-money"><span className="ac-k">Payment</span><span className="ac-v ac-v-money">$12,500</span></div>
                  <div className="ac-cell"><span className="ac-k">Deliverable</span><span className="ac-v">3 Reels</span></div>
                  <div className="ac-cell"><span className="ac-k">Pay terms</span><span className="ac-v">Net 30</span></div>
                </div>
              </div>

              {/* Card 2: this week */}
              <div className="auth-panel-card">
                <div className="ac-week-label">This week</div>
                <div className="ac-week">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className={i === 2 ? "ac-day ac-day-today" : "ac-day"}>
                      <span className="ac-dw">{d}</span>
                      <span className="ac-dot" style={{ background: i === 0 ? "#e0a32e" : i === 1 ? "#2f9e6f" : i === 3 ? "#f2705b" : "transparent" }} />
                    </div>
                  ))}
                </div>
                <div className="ac-paychip"><span className="ac-paydot" />Halcyon &middot; $12,500 due</div>
              </div>

              {/* Card 3: income */}
              <div className="auth-panel-card">
                <div className="ac-income-label">Received this year</div>
                <div className="ac-income-val ac-v-money">$58,400</div>
                <div className="ac-bars">
                  <i className="ac-bar" style={{ height: "45%" }} /><i className="ac-bar" style={{ height: "70%" }} />
                  <i className="ac-bar" style={{ height: "55%" }} /><i className="ac-bar" style={{ height: "85%" }} />
                  <i className="ac-bar" style={{ height: "65%" }} /><i className="ac-bar" style={{ height: "100%" }} />
                  <i className="ac-bar" style={{ height: "78%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}