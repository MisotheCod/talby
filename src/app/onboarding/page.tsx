"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import TalbyPage from "@/components/talby-app/TalbyPage";
import { createClient } from "@/lib/supabase/client";
import { makeOnAction } from "@/lib/talby/actions";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const refresh = useCallback(async () => { router.push("/app"); }, [router]);
  const onAction = makeOnAction(supabase, refresh, false);
  return <TalbyPage board="SOnboard" props={{ view: "sample", plan: "active", onAction }} look={null} />;
}
