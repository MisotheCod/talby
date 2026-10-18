'use client';
// Renders the new log in, sign up and password pages. Same pattern as TalbyPage: mount, then render the board.
import * as React from 'react';
import '@/lib/talby/auth-io';
import { TalbyRoot } from '@/components/talby/_runtime';
import SAuth from '@/components/talby/SAuth';

export default function TalbyAuthPage({ mode }: { mode: 'login' | 'signup' | 'forgot' | 'reset' }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => setOn(true), []);
  if (!on) return null;
  return <TalbyRoot><SAuth mode={mode} /></TalbyRoot>;
}
