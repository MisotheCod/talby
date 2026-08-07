import { createClient } from "@/lib/supabase/server";
import { AppShell } from "./app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { handler: string | null; accent: string; plan: string } | null =
    null;
  if (user) {
    const res = await supabase
      .from("profiles")
      .select("handler, accent, plan")
      .eq("id", user.id)
      .single();
    profile = res.data as unknown as {
      handler: string | null;
      accent: string;
      plan: string;
    } | null;
  }

  return (
    <AppShell
      handler={profile?.handler ?? null}
      accent={profile?.accent ?? "coral"}
      plan={profile?.plan ?? "free"}
    >
      {children}
    </AppShell>
  );
}
