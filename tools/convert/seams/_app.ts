// @ts-nocheck
/* eslint-disable */
'use client';
// Get the app: install, alerts and copy link for SOnboard, SOverview and SSettings.
//
// What lives here (browser only):
//   device()        iphone | android | inapp | desktop
//   isInstalled()   true when Talby was opened from the Home Screen
//   installApp()    Android: shows Chrome's own install box. Resolves true when they accept.
//   askAlerts()     asks for alert permission, then saves a push subscription. Resolves 'granted' | 'denied' | 'default'.
//   copyLink()      copies https://www.talby.io/app
//   dismissInstall(where, forever)   records a "Not now" so the prompt waits before it comes back
//   autoPrompt()    what the Overview banner should show right now: 'install' | 'alerts' | ''
//
// What the app provides (see src/lib/talby/app-io.ts): the profile's dismissal counts,
// how to save a dismissal, and how to save a push subscription. Register it with setTalbyAppIO(io).
// Until it is registered, the banner never shows and nothing is saved.

export type TalbyAppIO = {
  /** profiles.install_prompt_dismissals and profiles.install_prompt_last_dismissed (ISO string or null). */
  dismissals: number;
  lastDismissed: string | null;
  /** Saves a dismissal on the profile. forever = "Don't show again". */
  saveDismissal(next: { dismissals: number; lastDismissed: string }): Promise<void>;
  /** Saves a push subscription (PushSubscription.toJSON()) for the signed in user. */
  savePushSubscription(sub: any): Promise<void>;
  /** NEXT_PUBLIC_VAPID_PUBLIC_KEY */
  vapidPublicKey: string;
};

/** Anti nag rules. Change these numbers here, nowhere else. */
export const INSTALL_RULES = {
  /** After this many "Not now" taps the install prompt stops for good. */
  maxDismissals: 3,
  /** Days to wait after a "Not now" before the banner can show again. */
  waitDays: 3,
  /** "Don't show again" writes this count, which is always past maxDismissals. */
  foreverCount: 99,
};

const APP_URL = 'https://www.talby.io/app';
let io: TalbyAppIO | null = null;
const subs = new Set<() => void>();
function changed() { subs.forEach(function (f) { try { f(); } catch (e) {} }); }

export function setTalbyAppIO(next: TalbyAppIO | null) { io = next; changed(); }
export function getTalbyAppIO() { return io; }
/** Boards call this so they redraw when the profile or install state changes. Returns an unsubscribe. */
export function onTalbyAppChange(f: () => void) { subs.add(f); return function () { subs.delete(f); }; }

// Chrome fires beforeinstallprompt once, early. Catch it as soon as this file loads.
// The layout snippet in APP.md also catches it before React loads and leaves it on window.__talbyBip.
let bip: any = null;
let justInstalled = false;
if (typeof window !== 'undefined') {
  try {
    bip = (window as any).__talbyBip || null;
    window.addEventListener('beforeinstallprompt', function (e: any) { e.preventDefault(); bip = e; (window as any).__talbyBip = e; changed(); });
    window.addEventListener('appinstalled', function () { bip = null; justInstalled = true; (window as any).__talbyBip = null; changed(); });
  } catch (e) {}
}

export function device(): 'iphone' | 'android' | 'inapp' | 'desktop' {
  try {
    var ua = navigator.userAgent || '';
    if (/Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance|Snapchat|Pinterest|Line\//i.test(ua)) return 'inapp';
    if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iphone';
    if (/Android/.test(ua)) return 'android';
  } catch (e) {}
  return 'desktop';
}

export function isInstalled(): boolean {
  try { return justInstalled || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator as any).standalone === true; } catch (e) { return false; }
}

/** Android only. Resolves false when Chrome has no install box ready, so the board shows the Chrome menu tip instead. */
export function installApp(): Promise<boolean> {
  if (!bip) return Promise.resolve(false);
  var e = bip; bip = null; (window as any).__talbyBip = null;
  try {
    e.prompt();
    return e.userChoice.then(function (c: any) { var ok = c && c.outcome === 'accepted'; if (ok) { justInstalled = true; changed(); } return ok; }, function () { return false; });
  } catch (x) { return Promise.resolve(false); }
}

function pushSupported() {
  try { return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window; } catch (e) { return false; }
}
function alertsPermission(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!pushSupported()) return 'unsupported';
  try { return (Notification as any).permission; } catch (e) { return 'unsupported'; }
}
function keyBytes(b64: string) {
  var pad = '='.repeat((4 - (b64.length % 4)) % 4);
  var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  var out = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Must run from a tap. On iPhone this only works when Talby was opened from the Home Screen. */
export function askAlerts(): Promise<'granted' | 'denied' | 'default'> {
  if (!pushSupported()) return Promise.resolve('denied');
  return Promise.resolve(Notification.requestPermission()).then(function (perm: any) {
    if (perm !== 'granted') return perm;
    return navigator.serviceWorker.register('/sw.js').then(function () { return navigator.serviceWorker.ready; }).then(function (reg: any) {
      return reg.pushManager.getSubscription().then(function (old: any) {
        if (old) return old;
        if (!io || !io.vapidPublicKey) throw new Error('no vapid key');
        return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(io.vapidPublicKey) });
      });
    }).then(function (sub: any) {
      return io ? io.savePushSubscription(sub.toJSON()) : undefined;
    }).then(function () { changed(); return 'granted'; }, function () { changed(); return 'granted'; });
  }, function () { return 'denied'; });
}

export function copyLink(): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(APP_URL).then(function () { return true; }, fallback);
  } catch (e) {}
  return Promise.resolve(fallback());
  function fallback() {
    try {
      var t = document.createElement('textarea'); t.value = APP_URL; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); return true;
    } catch (e) { return false; }
  }
}

export function dismissInstall(where: string, forever?: boolean) {
  if (!io) return;
  var next = { dismissals: forever ? INSTALL_RULES.foreverCount : (io.dismissals || 0) + 1, lastDismissed: new Date().toISOString() };
  io.dismissals = next.dismissals; io.lastDismissed = next.lastDismissed; changed();
  io.saveDismissal(next).catch(function () {});
}

/** Same rule the server can use. Phones only, never once installed, and it backs off after each "Not now". */
export function shouldShowInstallPrompt(p: { dismissals: number; lastDismissed: string | null }, now?: number) {
  if ((p.dismissals || 0) >= INSTALL_RULES.maxDismissals) return false;
  if (!p.lastDismissed) return true;
  var t = Date.parse(p.lastDismissed);
  if (!isFinite(t)) return true;
  return (now || Date.now()) - t >= INSTALL_RULES.waitDays * 86400000;
}

/** What the Overview banner shows. '' means nothing. */
export function autoPrompt(): 'install' | 'alerts' | '' {
  if (!io) return '';
  var dev = device();
  if (dev === 'desktop') return '';
  if (isInstalled()) {
    var perm = alertsPermission();
    return perm === 'default' && shouldShowInstallPrompt(io) ? 'alerts' : '';
  }
  return shouldShowInstallPrompt(io) ? 'install' : '';
}
