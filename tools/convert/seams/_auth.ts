// @ts-nocheck
/* eslint-disable */
'use client';
// Log in, sign up and passwords for SAuth. The app registers the real calls with
// setTalbyAuthIO (see src/lib/talby/auth-io.ts). Every call resolves {} on success
// or { error } with one of: wrong, taken, weak, same, offline, badcode, expired, nouser, rate, failed.
export type TalbyAuthResult = { error?: string; session?: boolean };
export type TalbyAuthIO = {
  signIn(email: string, password: string): Promise<TalbyAuthResult>;
  signUp(email: string, password: string): Promise<TalbyAuthResult>;
  sendReset(email: string): Promise<TalbyAuthResult>;
  setPassword(password: string): Promise<TalbyAuthResult>;
  sendCode(email: string): Promise<TalbyAuthResult>;
  verifyCode(email: string, code: string): Promise<TalbyAuthResult>;
  resendConfirm(email: string): Promise<TalbyAuthResult>;
  /** On /reset-password: finish the link. Resolves { error: 'expired' } when it is old or used. */
  checkReset(): Promise<TalbyAuthResult>;
};
let io: TalbyAuthIO | null = null;
export function setTalbyAuthIO(next: TalbyAuthIO | null) { io = next; }
export function getTalbyAuthIO() { return io; }
const NONE = function () { return Promise.resolve({ error: 'failed' }); };
export function auth(): TalbyAuthIO {
  return io || { signIn: NONE, signUp: NONE, sendReset: NONE, setPassword: NONE, sendCode: NONE, verifyCode: NONE, resendConfirm: NONE, checkReset: function () { return Promise.resolve({}); } };
}
/** ?next=/app/deals after log in, only for paths on this site. */
export function nextPath(fallback: string) {
  try {
    var n = new URLSearchParams(window.location.search).get('next') || '';
    if (/^\/(?!\/)/.test(n)) return n;
  } catch (e) {}
  return fallback;
}
