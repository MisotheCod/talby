import { createClient } from "@/lib/supabase/server";
import { AppShell } from "./app-shell";
import { accentVars, parseHSL, DEFAULT_HSL } from "@/lib/accent";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: {
    handler: string | null;
    accent: string | null;
    plan: string;
  } | null = null;
  if (user) {
    const res = await supabase
      .from("profiles")
      .select("handler, accent, plan")
      .eq("id", user.id)
      .single();
    profile = res.data as unknown as {
      handler: string | null;
      accent: string | null;
      plan: string;
    } | null;
  }

  // Apply the saved accent server-side (before first paint) to avoid a
  // flash of the default color. accentVars() is DOM-free.
  const accentCss = accentVars(parseHSL(profile?.accent) ?? DEFAULT_HSL);

  return (
    <>
      <style>{`:root{${accentCss}}`}</style>
      <AppShell
        handler={profile?.handler ?? null}
        accent={profile?.accent ?? null}
        plan={profile?.plan ?? "free"}
      >
        {children}
      </AppShell>
    </>
  );
}
