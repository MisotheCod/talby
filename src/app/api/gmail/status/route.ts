import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gmailConfigured } from "@/lib/gmail-server";

export const dynamic = "force-dynamic";

/** Report connection status (never returns the token). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const { data } = await supabase
    .from("gmail_connections")
    .select("email, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  return NextResponse.json({
    connected: !!data && !!data.email && !data.email.startsWith("pending:"),
    email: data?.email ?? null,
    configured: gmailConfigured(),
  });
}
