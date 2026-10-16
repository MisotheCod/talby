"use client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { TalbyDates } from "@/components/talby/_data";
import { toAccountData } from "@/lib/talby/to-board";
import type { AccountData } from "@/components/talby/_data";
import type { ProfileRow } from "@/lib/talby/queries";

/** Shared per-page account context: account object + plan + look + readOnly. */
export async function loadAccountContext(supabase: SupabaseClient): Promise<{
  account: AccountData; plan: string; look: { theme: string; mode: string; sidebar: string } | null; readOnly: boolean; profile: ProfileRow | null;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  const today = TalbyDates.today();
  let profile: ProfileRow | null = null;
  if (user) {
    const prof = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    profile = (prof.data ?? null) as unknown as ProfileRow | null;
  }
  const [deals, late, ideas, todos] = await Promise.all([
    supabase.from("deals").select("id, created_at"),
    supabase.from("payments").select("id, expected_date").neq("status", "received").neq("pay_status", "paid"),
    supabase.from("ideas").select("id").neq("status", "archived"),
    supabase.from("todos").select("id").eq("done", false),
  ]);
  const dealRows = (deals.data ?? []) as Array<{ created_at: string }>;
  const lateRows = (late.data ?? []) as Array<{ expected_date: string | null }>;
  const profileStatus = profile?.plan_status ?? null;
  const readOnly = profileStatus === "canceled" || profileStatus === "readonly";

  const plan = profileStatus === "trialing" ? "trial" : profileStatus === "past_due" ? "pastdue" : profileStatus === "canceled" ? "canceled" : "active";
  const account = toAccountData({
    profile: (profile ?? { handler: null, trial_end: null }) as ProfileRow,
    today,
    counts: {
      deals: dealRows.length,
      late: lateRows.filter((x) => x.expected_date && x.expected_date < today).length,
      ideas: (ideas.data ?? []).length,
      todos: (todos.data ?? []).length,
    },
    dealsThisYear: dealRows.filter((d) => (d.created_at ?? "").slice(0, 4) === today.slice(0, 4)).length,
    notifications: [],
  });
  const look = profile && (profile.theme || profile.mode || profile.sidebar)
    ? { theme: profile.theme ?? "studio", mode: profile.mode ?? "light", sidebar: profile.sidebar ?? "expanded" }
    : null;
  return { account, plan, look, readOnly, profile };
}
