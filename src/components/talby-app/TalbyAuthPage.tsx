'use client';
// Renders the new log in, sign up and password pages. Same pattern as TalbyPage: mount, then render the board.
import * as React from 'react';
import '@/lib/talby/auth-io';
import { initTalbyRoutes } from '@/components/talby-app/routes';
import { TalbyRoot } from '@/components/talby/_runtime';
import SAuth from '@/components/talby/SAuth';

// Route the auth boards' internal links (AuLogin.dc.html, AuSignup.dc.html,
// AuForgot.dc.html, SOverview.dc.html, SHome.dc.html …) to the real app paths
// before the board renders. Without this, setTalbyRoutes never runs on these
// pages and the links stay raw .dc.html filenames (e.g. /AuForgot.dc.html).
initTalbyRoutes();

export default function TalbyAuthPage({ mode }: { mode: 'login' | 'signup' | 'forgot' | 'reset' }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    // Log in and sign up are always light, whatever look the person uses inside Talby.
    const h = document.documentElement;
    h.classList.remove('dark'); h.setAttribute('data-mode', 'light'); h.style.background = '#FFFFFF'; h.style.colorScheme = 'light';
    setOn(true);
  }, []);
  if (!on) return null;
  return <TalbyRoot><SAuth mode={mode} theme="light" /></TalbyRoot>;
}
