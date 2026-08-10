import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/gmail-server";
import { scanForUser } from "@/lib/inbox-scan-run";

export const dynamic = "force-dynamic";

/** Google OAuth callback. Stores the token server-side, scoped to the user. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Redirect back to the SAME origin the OAuth began on, so the user's
  // session cookie (which is host-scoped) survives the Google round-trip.
  // A hardcoded SITE_URL redirect would bounce preview domains (and any
  // non-site_url host) to a different origin and drop the session -> logout.
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const origin = url.origin && url.origin !== "null" ? url.origin : (base || "https://www.talby.io");
  const redirect = (q: string) => NextResponse.redirect(`${origin}/app/settings?${q}`);

  const cookieStore = await cookies();
  const stateJson = cookieStore.get("gmail_state")?.value;
  let user_id: string | null = null;
  if (stateJson) {
    try {
      const parsed = JSON.parse(stateJson);
      if (parsed.state === state) user_id = parsed.user_id;
    } catch {}
  }

  if (error || !code || !user_id) {
    return redirect("gmail=error");
  }

  try {
    const tok = await exchangeCode(code);
    const supabase = createServiceClient();
    await supabase.from("gmail_connections").upsert({
      user_id,
      email: tok.email ?? null,
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      expires_at: new Date(Date.now() + tok.expires_in * 1000).toISOString(),
    });
    cookieStore.delete("gmail_state");

    // Fire-and-forget: scan the inbox once on connect so leads appear
    // without waiting for the first poll. Never blocks the redirect.
    scanForUser(user_id).catch(() => {});

    return redirect("gmail=connected");
  } catch (e) {
    console.error("gmail callback error", e);
    return redirect("gmail=error");
  }
}
