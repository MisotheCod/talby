import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scanForUser } from "@/lib/inbox-scan-run";
import { getAccessToken } from "@/lib/gmail-server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Manual / on-demand inbox scan (and the same pipeline the cron uses).
 * Paid-tier: free users get 402. Requires a connected Gmail.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { data: prof } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  if ((prof as { plan?: string } | null)?.plan !== "paid") {
    return NextResponse.json({ error: "paid_required" }, { status: 402 });
  }

  // Distinguish "never connected" from "connected but the token is dead (for
  // example revoked or expired and unrefreshable)". Both make getAccessToken
  // return null, but only the first should say "connect Gmail".
  const { data: conn } = await supabase
    .from("gmail_connections").select("user_id, email").eq("user_id", user.id).maybeSingle();

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    if (conn) {
      return NextResponse.json({ error: "gmail_reconnect", email: (conn as { email?: string }).email ?? null }, { status: 400 });
    }
    return NextResponse.json({ error: "gmail_not_connected" }, { status: 400 });
  }

  const result = await scanForUser(user.id);
  return NextResponse.json({ scanned: result.scanned, newLeads: result.newLeads });
}