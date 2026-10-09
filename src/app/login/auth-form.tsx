"use client";

import { useState } from "react";
import posthog from "posthog-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { readLandingVariant } from "@/lib/landing-experiment";
import { IconEye, IconEyeInvisible, IconCheck } from "@/components/icons";
import { Pill } from "@/components/ui";
import { TalbyLogo } from "@/components/marketing/talby-logo";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ---- Contract extraction card (shared by the panel + mobile preview) ---- */
function ContractCard() {
  return (
    <div className="auth-panel-card">
      <div className="ac-row">
        <span className="ac-badge"><IconCheck size={13} /></span>
        <span className="ac-file">Halcyon_Agreement.pdf</span>
      </div>
      <div className="ac-grid">
        <div className="ac-cell"><span className="ac-k">Brand</span><span className="ac-v">Halcyon Skincare</span></div>
        <div className="ac-cell ac-money"><span className="ac-k">Payment</span><span className="ac-v ac-v-money">$5,500</span></div>
        <div className="ac-cell"><span className="ac-k">Deliverable</span><span className="ac-v">1 Reel and 3 Stories</span></div>
        <div className="ac-cell"><span className="ac-k">Pay terms</span><span className="ac-v">Net 30</span></div>
      </div>
    </div>
  );
}

/* ---- Real "This week" card (mirrors the app Overview card, hardcoded) ---- */
const WEEK_DAYS: { dn: string; dd: string; sel?: boolean; dots?: string[] }[] = [
  { dn: "Sun", dd: "27" },
  { dn: "Mon", dd: "28", sel: true, dots: ["var(--due)", "var(--late)"] },
  { dn: "Tue", dd: "29" },
  { dn: "Wed", dd: "30", dots: ["var(--due)"] },
  { dn: "Thu", dd: "1" },
  { dn: "Fri", dd: "2", dots: ["var(--late)"] },
  { dn: "Sat", dd: "3" },
];

function ThisWeekCard() {
  return (
    <div className="auth-panel-card auth-week-card">
      <div className="auth-week-title">This week</div>
      <div className="week">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className={"day" + (d.sel ? " today sel" : "")} aria-label={`${d.dn} ${d.dd}`}>
            <div className="dn">{d.dn}</div>
            <div className="dd">{d.dd}</div>
            <div className="dots">
              {(d.dots ?? []).map((source, k) => <Pill key={k} size="dot" source={source} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="daylist">
        <div className="ditem">
          <Pill size="sm" source="var(--due)" className="px-2 py-0.5">PAY</Pill>
          <span className="n">Halcyon Skincare payment expected</span>
          <span className="a">$5,500</span>
        </div>
        <div className="ditem">
          <Pill size="sm" source="var(--late)" className="px-2 py-0.5">DUE</Pill>
          <span className="n">Meadowlark Tea deliverable due</span>
        </div>
      </div>
    </div>
  );
}

/* ---- The right blue panel content (desktop) ---- */
function BrandPanel() {
  return (
    <div className="auth-panel">
      <div className="auth-panel-inner">
        <h2 className="auth-panel-h">Never guess what a brand owes you.</h2>
        <p className="auth-panel-sub">Upload the contract, Talby fills in the deal.</p>

        <div className="auth-cards">
          <ContractCard />
          <ThisWeekCard />
          <div className="auth-panel-card">
            <div className="ac-income-label">Received this year</div>
            <div className="ac-income-val ac-v-money">$77,850</div>
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
  );
}

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
      if (data.user) {
        // Identify with the new user up front so every subsequent event (and the
        // user_signed_up event below) is attributed to the right person.
        posthog.identify(data.user.id, {
          email,
          name: handleClean || email,
          created_at: data.user.created_at,
        });
        // Funnel/registration event: method is how they signed up; plan is the
        // one they're registering for (unlimited when arriving via a plan link).
        const method = "email"; // Talby signup is email/password only today
        const plan = searchParams.get("plan") === "unlimited" ? "unlimited" : null;
        posthog.capture("user_signed_up", { method, plan });
        posthog.capture("signup");
      }
      // Primary metric for the landing-test experiment. Attach the assigned
      // variant so PostHog can segment signup_completed by arm. The server-side
      // vid cookie (and the PostHog ph_phc cookie via the same-origin redirect)
      // keep the distinct_id stable, so this attributes per visitor.
      posthog.capture("signup_completed", { landing_variant: readLandingVariant() ?? "unknown" });
      if (searchParams.get("plan") === "unlimited") {
        // Came from a "Go unlimited" affordance — keep the flow going to checkout.
        const { startUnlimited } = await import("@/lib/start-unlimited");
        const ok = await startUnlimited();
        if (!ok) router.push("/onboarding");
        return;
      }
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
            <h1 className="auth-heading">
              <span className="auth-heading-desk">{isLogin ? "Log in" : "Create your account"}</span>
              <span className="auth-heading-mobile">{isLogin ? "Log in" : "Never guess what a brand owes you."}</span>
            </h1>
            {!isLogin && (
              <p className="auth-sub">Track every brand deal: contracts, post dates, and payments.</p>
            )}
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
                <div className="auth-label-row">
                  <span className="auth-label">Password</span>
                  {isLogin && (
                    <Link href="/forgot-password" className="auth-forgot">Forgot your password?</Link>
                  )}
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

        {!isLogin && (
          <div className="auth-mobile-cards" aria-hidden>
            <div className="auth-mobile-cards-label">What Talby does</div>
            <ContractCard />
            <ThisWeekCard />
          </div>
        )}
      </div>

      {/* Right — brand panel */}
      <div className="auth-col auth-brand-col" aria-hidden="true">
        <BrandPanel />
      </div>
    </div>
  );
}