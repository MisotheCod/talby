import { toast } from "sonner";

/**
 * Shared save helper (redesign v2, backend upgrade 2).
 *
 * Every mutation goes through `runSave` so a failure can never be silent:
 * on error it raises a sonner toast with the board's "Try again" action that
 * re-runs the SAME request. Idempotent mutations (`idempotencyKey`) can retry
 * safely; the POST /api/deals route is idempotent on that key by design.
 *
 * Rules:
 *  - Never swallow a failure — the caller's .then(ok) only runs when res.ok.
 *  - The error message comes from the server's { error } body; a network
 *    failure falls back to the offline message.
 *  - `context` prefixes the message (e.g. "Saving the deal: …").
 *  - Returns the Response on success, null on failure (the toast already
 *    reported it and offered Try again).
 */

type SaveOpts = {
  context?: string;
  retry?: () => void;                        // optional bespoke re-run
  offlineMsg?: string;
  onError?: (msg: string, retry: (() => void) | undefined, context?: string) => void;
};

function messageFor(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const m = (data as { message?: unknown; error?: unknown }).message;
    if (typeof m === "string" && m) return m;
    const e = (data as { error?: unknown }).error;
    if (typeof e === "string" && e) return e;
  }
  return fallback;
}

export function currentSaveErrorToToast(msg: string, retry?: () => void, context?: string) {
  toast.error(context ? `${context}: ${msg}` : msg, {
    duration: 6000,
    action: retry
      ? { label: "Try again", onClick: () => retry() }
      : undefined,
  });
}

export async function runSave(
  request: () => Promise<Response>,
  opts: SaveOpts = {}
): Promise<Response | null> {
  const { context = "Saving", onError = currentSaveErrorToToast } = opts;
  try {
    const res = await request();
    if (res.ok) return res;
    let data: unknown = null;
    try { data = await res.json(); } catch { /* non-JSON body */ }
    const msg = messageFor(data, res.status === 401 ? "You signed out. Sign in and try again." : "Something went wrong. Nothing was saved.");
    onError(msg, opts.retry, context);
    return null;
  } catch {
    onError(opts.offlineMsg ?? "Could not reach the server. Check your connection and try again.", opts.retry, context);
    return null;
  }
}
