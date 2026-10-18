'use client';
// Connects the Get the app boards (SOnboard, SOverview, SSettings) to the profile and to alerts.
// Call registerTalbyApp(profile) once on the client after the profile loads, in the same
// client wrapper that renders the boards (TalbyPage and the onboarding page).
// The banner on Overview stays hidden until this has run.
import { setTalbyAppIO } from '@/components/talby/_app';

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('failed');
}

export function registerTalbyApp(profile: { install_prompt_dismissals?: number | null; install_prompt_last_dismissed?: string | null }) {
  setTalbyAppIO({
    dismissals: profile.install_prompt_dismissals || 0,
    lastDismissed: profile.install_prompt_last_dismissed || null,
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    saveDismissal: (next) => post('/api/profile/install-prompt', next),
    savePushSubscription: (sub) => post('/api/push/subscribe', { subscription: sub, userAgent: navigator.userAgent }),
  });
}
