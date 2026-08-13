import { createClient } from "@/lib/supabase/server";
import { AppShell } from "./app-shell";
import { accentVars, parseHSL, DEFAULT_HSL, DEFAULT_MODE, fontCssVar, DEFAULT_HEAD_FONT, type ThemeMode } from "@/lib/accent";

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
    avatar_url: string | null;
    theme_mode: string | null;
  } | null = null;
  if (user) {
    const res = await supabase
      .from("profiles")
      .select("handler, accent, plan, head_font, avatar_url, theme_mode")
      .eq("id", user.id)
      .single();
    profile = res.data as unknown as {
      handler: string | null;
      accent: string | null;
      plan: string;
      head_font: string | null;
      avatar_url: string | null;
      theme_mode: string | null;
    } | null;
  }

  // Apply the saved accent + heading font server-side (before first paint) to
  // avoid a flash of defaults. Both are DOM-free.
  const mode: ThemeMode = profile?.theme_mode === "dark" ? "dark" : DEFAULT_MODE;
  const accentCss = accentVars(parseHSL(profile?.accent) ?? DEFAULT_HSL, mode);
  const fontCss = `--font-head:${fontCssVar(profile?.head_font ?? DEFAULT_HEAD_FONT)}`;

  return (
    <>
      <style>{`:root{${accentCss};${fontCss}}`}</style>
      {/* Set dark mode on <html> before first paint (no flash of light). */}
      {mode === "dark" && (
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.setAttribute("data-theme","dark")` }} />
      )}
      <AppShell
        handler={profile?.handler ?? null}
        accent={profile?.accent ?? null}
        plan={profile?.plan ?? "free"}
        headFont={profile?.head_font ?? DEFAULT_HEAD_FONT}
        avatarUrl={profile?.avatar_url ?? null}
        themeMode={mode}
      >
        {children}
      </AppShell>
    </>
  );
}
