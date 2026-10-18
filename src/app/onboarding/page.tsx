"use client";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import TalbyPage from "@/components/talby-app/TalbyPage";
import { createClient } from "@/lib/supabase/client";
import { makeOnAction } from "@/lib/talby/actions";
import { registerTalbyApp } from "@/lib/talby/app-io";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const refresh = useCallback(async () => { router.push("/app"); }, [router]);
  const onAction = makeOnAction(supabase, refresh, false);

  // Get the app: once the profile loads, hand its install-prompt state to the
  // boards so SOnboard's "app" step (and later the Overview banner) can decide
  // what to show. Runs once.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const prof = await supabase
          .from("profiles")
          .select("install_prompt_dismissals, install_prompt_last_dismissed")
          .eq("id", user.id)
          .maybeSingle();
        if (active && prof.data) registerTalbyApp(prof.data as { install_prompt_dismissals?: number | null; install_prompt_last_dismissed?: string | null });
      } catch { /* registration is best-effort */ }
    })();
    return () => { active = false; };
  }, [supabase]);

  return <TalbyPage board="SOnboard" props={{ view: "sample", plan: "active", onAction }} look={null} />;
}
