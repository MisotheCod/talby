'use client';
// Connects the new log in, sign up and password pages (SAuth) to Supabase.
// Import once from the auth pages' client wrapper:  import '@/lib/talby/auth-io';
// Uses the same browser client the old auth-form.tsx used. If its path differs, change this import.
import { createClient } from '@/lib/supabase/client';
import { setTalbyAuthIO, type TalbyAuthResult } from '@/components/talby/_auth';
import posthog from 'posthog-js';

const supabase = createClient();
const origin = () => (typeof window !== 'undefined' ? window.location.origin : 'https://www.talby.io');

function code(e: any, fallback = 'failed'): string {
  if (!e) return fallback;
  const m = String(e.message || '').toLowerCase(), c = String(e.code || '').toLowerCase(), s = Number(e.status || 0);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  if (m.includes('fetch') || m.includes('network')) return 'offline';
  if (s === 429 || c.includes('rate') || m.includes('rate limit') || m.includes('security purposes')) return 'rate';
  if (c === 'invalid_credentials' || m.includes('invalid login')) return 'wrong';
  if (c === 'user_already_exists' || m.includes('already registered')) return 'taken';
  if (c === 'same_password' || m.includes('different from the old')) return 'same';
  if (c === 'weak_password' || m.includes('password should')) return 'weak';
  if (c === 'otp_expired' || m.includes('expired') || m.includes('invalid')) return fallback === 'badcode' ? 'badcode' : 'expired';
  if (c === 'otp_disabled' || m.includes('signups not allowed')) return 'nouser';
  return fallback;
}
const ok = (): TalbyAuthResult => ({});

setTalbyAuthIO({
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: code(error) } : ok();
  },
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: origin() + '/onboarding' } });
    if (error) return { error: code(error) };
    // Supabase hides "already registered" when confirm is on: it returns a user with no identities.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return { error: 'taken' };
    // KEEP what the old auth-form.tsx did right after sign up (for example the /api/trial/welcome call). Put it here.
    try {
      if (data.user) {
        posthog.identify(data.user.id, { email });
        posthog.capture('account_created', { method: 'email' });
      }
      posthog.capture('signup_completed', {});
      // Fire-and-forget the welcome email (idempotent server-side).
      void fetch('/api/trial/welcome', { method: 'POST' });
    } catch { /* best-effort analytics/email */ }
    // Paid intent (was in the old auth-form): ?plan=unlimited sends the new account
    // straight to Stripe Checkout for Unlimited instead of onboarding.
    try {
      const plan = new URLSearchParams(window.location.search).get('plan');
      if (plan === 'unlimited') {
        const res = await fetch('/api/stripe/checkout', { method: 'POST' });
        const j = await res.json();
        if (j && j.url) { window.location.href = j.url; return { session: true }; }
      }
    } catch { /* fall through to normal signup flow */ }
    return { session: !!data.session };
  },
  async sendReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: origin() + '/reset-password' });
    // Never say whether the account exists. Only network and rate errors show.
    if (error) { const c = code(error); return c === 'offline' || c === 'rate' ? { error: c } : ok(); }
    return ok();
  },
  async setPassword(password) {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: code(error) } : ok();
  },
  async sendCode(email) {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    return error ? { error: code(error) } : ok();
  },
  async verifyCode(email, token) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    return error ? { error: code(error, 'badcode') } : ok();
  },
  async resendConfirm(email) {
    const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: origin() + '/onboarding' } });
    return error ? { error: code(error) } : ok();
  },
  async checkReset() {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
    if (url.searchParams.get('error_code') || hash.get('error_code')) return { error: 'expired' };
    const c = url.searchParams.get('code');
    if (c) {
      const { error } = await supabase.auth.exchangeCodeForSession(c);
      window.history.replaceState(null, '', url.pathname);
      if (error) return { error: 'expired' };
    }
    const { data } = await supabase.auth.getSession();
    return data.session ? ok() : { error: 'expired' };
  },
});
