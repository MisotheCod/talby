import { createClient } from "@/lib/supabase/server";
import { hasFullAccess, type PlanStatus } from "@/lib/access";

/**
 * Single gateway for "does this user have full access / what plan are they on?"
 *
 * Backend upgrade 6 (legacy plan check consolidation): BEFORE, three routes
 * (assistant, assistant/ingest, account/summary) each read the LEGACY `plan`
 * column directly. Now every server gate reads `plan_status` + `trial_end`
 * through the shared `hasFullAccess` helper in ONE place. When the legacy
 * `plan` column is dropped (morning step for Cam), this helper is untouched.
 */
export async function currentPlanState(
  userId: string
): Promise<{ planStatus: PlanStatus; hasAccess: boolean; trialEnd: string | null }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("plan_status, trial_end")
    .eq("id", userId)
    .single();
  const row = data as { plan_status?: string; trial_end?: string | null } | null;
  const planStatus = (row?.plan_status ?? "none") as PlanStatus;
  const trialEnd = row?.trial_end ?? null;
  return { planStatus, hasAccess: hasFullAccess(planStatus, trialEnd), trialEnd };
}
