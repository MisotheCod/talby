import { createClient } from "@/lib/supabase/server";
import { AppShell } from "./app-shell";
import { accentVars, parseHSL, DEFAULT_HSL, fontCssVar, DEFAULT_HEAD_FONT } from "@/lib/accent";

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
    head_font: string | null;
  } | null = null;
  if (user) {
    const res = await supabase
      .from("profiles")
      .select("handler, accent, plan, head_font")
      .eq("id", user.id)
      .single();
    profile = res.data as unknown as {
      handler: string | null;
      accent: string | null;
      plan: string;
      head_font: string | null;
    } | null;
  }

  // Apply the saved accent + heading font server-side (before first paint) to
  // avoid a flash of defaults. Both are DOM-free.
  const accentCss = accentVars(parseHSL(profile?.accent) ?? DEFAULT_HSL);
  const fontCss = `--font-head:${fontCssVar(profile?.head_font ?? DEFAULT_HEAD_FONT)}`;

  return (
    <>
      <style>{`:root{${accentCss};${fontCss}}`}</style>
      <AppShell
        handler={profile?.handler ?? null}
        accent={profile?.accent ?? null}
        plan={profile?.plan ?? "free"}
        headFont={profile?.head_font ?? DEFAULT_HEAD_FONT}
      >
        {children}
      </AppShell>
    </>
  );
}
