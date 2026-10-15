import { createClient } from "@/lib/supabase/server";
import TalbyPage from "@/components/talby-app/TalbyPage";

export const dynamic = "force-dynamic";

/**
 * Overview on /app. Renders the SOverview board via TalbyPage (the board
 * brings its own shell). `look` (theme/mode/sidebar) is synced into
 * localStorage from the profile so the board matches what the user saved;
 * `plan` drives the trial/past-due/canceled/read-only states.
 */
export default async function OverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let look: { theme: string; mode: string; sidebar: string } | null = null;
  let plan = "active";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("theme, mode, sidebar, plan_status")
      .eq("id", user.id)
      .maybeSingle();
    const prof = data as {
      theme?: string | null;
      mode?: string | null;
      sidebar?: string | null;
      plan_status?: string | null;
    } | null;
    if (prof) {
      if (prof.theme || prof.mode || prof.sidebar) {
        look = {
          theme: prof.theme ?? "studio",
          mode: prof.mode ?? "light",
          sidebar: prof.sidebar ?? "expanded",
        };
      }
      if (prof.plan_status === "trialing") plan = "trial";
      else if (prof.plan_status === "past_due") plan = "pastdue";
      else if (prof.plan_status === "canceled") plan = "canceled";
    }
  }

  return <TalbyPage board="SOverview" props={{ view: "sample", plan }} look={look} />;
}
