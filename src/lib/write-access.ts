import { createClient } from "@/lib/supabase/server";

/**
 * Server-side read-only gate for API routes that write through the
 * SERVICE-ROLE client (which bypasses RLS). RLS already guards direct
 * client writes; this is the belt for the few server routes that perform
 * destructive/write work as the service role.
 *
 * Returns true when the caller may write, false when they are read-only.
 * The caller should return 403 with a clear "trial ended" message.
 */
export async function userIsReadOnly(userId: string): Promise<boolean> {
  const supabase = await createClient();
  // Read the caller's own profile via their RLS-scoped client (cheap + safe).
  const { data } = await supabase
    .from("profiles")
    .select("plan_status, trial_end, email")
    .eq("id", userId)
    .maybeSingle();
  const p = data as unknown as { plan_status?: string | null; trial_end?: string | null; email?: string | null } | null;
  if (!p) return true; // unknown → deny

  const { hasFullAccess, isPinnedUnlimited } = await import("./access");
  if (isPinnedUnlimited(p.email ?? null)) return false;

  const status = (p.plan_status ?? "none") as Parameters<typeof hasFullAccess>[0];
  return !hasFullAccess(status, p.trial_end ?? null);
}
