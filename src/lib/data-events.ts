"use client";

/**
 * Cross-route data invalidation for the client-rendered app shell.
 *
 * Every route (Deals, Overview, Payments, Calendar) loads its own deal/payment
 * content in a client useEffect via a browser Supabase client. Next.js App
 * Router's client cache keeps previously-visited route segments mounted, so
 * navigating back to a page does NOT re-run its load effect — a save in the
 * deal drawer refreshed only the Deals page's own list, leaving Payments,
 * Overview and Calendar on stale cached data until a hard reload.
 *
 * This is a minimal hand-rolled invalidator (no React Query in the app): pages
 * subscribe and refetch on any mutation; mutations call notifyDataChange().
 */
type Listener = () => void;
const listeners = new Set<Listener>();

/** Subscribe a page's reload callback. Returns an unsubscribe fn. */
export function subscribeDataChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Fire on any deal/payment/content mutation so every mounted page refetches. */
export function notifyDataChange(): void {
  listeners.forEach((l) => l());
}

// ---------------------------------------------------------------------------
// Read-only upgrade signal. A blocked write (RLS 403 or a server read_only
// response) fires this so the app shell can surface the upgrade modal. Kept
// separate from data-change so a blocked write doesn't spuriously refetch.
// ---------------------------------------------------------------------------
const upgradeListeners = new Set<() => void>();
export function subscribeUpgradePrompt(cb: () => void): () => void {
  upgradeListeners.add(cb);
  return () => { upgradeListeners.delete(cb); };
}
export function notifyReadOnlyBlocked(): void {
  upgradeListeners.forEach((l) => l());
}