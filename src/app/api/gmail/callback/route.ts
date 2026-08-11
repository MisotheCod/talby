import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/gmail-server";
import { scanForUser } from "@/lib/inbox-scan-run";

export const dynamic = "force-dynamic";

/**
 * Google OAuth callback. Stores the token server-side, scoped to the user.
 *
 * SESSION PRESERVATION: the middleware refreshes the Supabase auth cookie on
 * this request, but that refresh lives on the middleware's response. If we
 * return our own NextResponse.redirect() and that response doesn't carry the
 * session cookies, the (possibly refreshed) session is dropped -> after the
 * Google round-trip /app/settings finds no session and bounces to /login.
 * So before redirecting we (1) refresh the session through the auth-aware
 * client, and (2) copy every auth cookie onto the redirect response.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const origin = url.origin && url.origin !== "null" ? url.origin : (base || "https://www.talby.io");

  const cookieStore = await cookies();
  const stateJson = cookieStore.get("gmail_state")?.value;
  let user_id: string | null = null;
  if (stateJson) {
    try {
      const parsed = JSON.parse(stateJson);
      if (parsed.state === state) user_id = parsed.user_id;
    } catch {}
  }

  const redirect = (q: string) => {
    // Reflect the (possibly refreshed) session cookies onto the redirect so
    // the round-trip doesn't drop the user to /login.
    const res = NextResponse.redirect(`${origin}/app/settings?${q}`);
    const all = cookieStore.getAll();
    for (const c of all) {
      if (c.name.startsWith("sb-") || c.name.includes("auth-token")) {
        res.cookies.set(c.name, c.value, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      }
    }
    return res;
  };

  if (error || !code || !user_id) {
    return redirect("gmail=error");
  }

  try {
    // Keep the session alive across the OAuth round-trip: force a refresh via
    // the auth-aware client so its writes land in cookieStore, then copy them
    // onto the redirect above.
    const session = await createClient();
    await session.auth.getUser();

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
