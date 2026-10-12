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