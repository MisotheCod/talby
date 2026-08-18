import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/gmail-server";
import { scanForUser } from "@/lib/inbox-scan-run";

export const dynamic = "force-dynamic";

/**
 * Google OAuth callback. Stores the token server-side, scoped to the user.
 *
 * SESSION PRESERVATION: the middleware refreshes the Supabase session cookie on
 * this request, but the refresh writes live on the middleware's response. If we
 * return our own NextResponse.redirect() and that response doesn't carry the
 * session cookies, the (possibly refreshed) session is dropped -> after the
 * Google round-trip the app finds no session and bounces to /login. That looks
 * like the user's data vanished.
 *
 * Fix: build the supabase client with a cookie adapter bound directly to the
 * redirect response we will return, so getUser()'s session refresh writes the
 * auth cookies onto that same response. The redirect therefore always carries
 * the live session.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const origin = url.origin && url.origin !== "null" ? url.origin : (base || "https://www.talby.io");

  // Read the gmail_state cookie that /api/gmail/connect set before redirecting
  // to Google. It pins the OAuth round-trip to the signed-in user so we never
  // create or switch accounts.
  let user_id: string | null = null;
  const reqCookies = new Map<string, string>();
  for (const c of req.headers.get("cookie")?.split(";") ?? []) {
    const eq = c.indexOf("=");
    if (eq > 0) reqCookies.set(c.slice(0, eq).trim(), c.slice(eq + 1).trim());
  }
  const stateJson = reqCookies.get("gmail_state");
  if (stateJson) {
    try {
      const parsed = JSON.parse(stateJson);
      if (parsed.state === state) user_id = parsed.user_id;
    } catch {}
  }

  // Build the redirect response up front so the session cookie adapter can
  // write straight onto it.
  const res = NextResponse.redirect(`${origin}/app/settings?gmail=error`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Seed from the request cookies, then reflect any that the adapter
          // already wrote onto the response this request.
          const out: { name: string; value: string }[] = [];
          const seen = new Set<string>();
          for (const c of res.cookies.getAll()) { out.push(c); seen.add(c.name); }
          for (const [name, value] of reqCookies) {
            if (!seen.has(name)) out.push({ name, value });
          }
          return out;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  if (error || !code || !user_id) {
    // Keep the session alive: getUser() refreshes it and the adapter above
    // writes the refreshed cookies onto res, which we now return.
    await supabase.auth.getUser();
    res.cookies.delete("gmail_state");
    return res;
  }

  try {
    const tok = await exchangeCode(code);
    const service = createServiceClient();
    await service.from("gmail_connections").upsert({
      user_id,
      email: tok.email ?? null,
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      expires_at: new Date(Date.now() + tok.expires_in * 1000).toISOString(),
    });

    // Refresh the session through the adapter so its cookies land on res.
    await supabase.auth.getUser();

    res.cookies.delete("gmail_state");
    res.headers.set("Location", `${origin}/app/settings?gmail=connected`);

    // Fire-and-forget: scan the inbox once on connect so leads appear
    // without waiting for the first poll. Never blocks the redirect.
    scanForUser(user_id).catch(() => {});

    return res;
  } catch (e) {
    console.error("gmail callback error", e);
    await supabase.auth.getUser();
    res.cookies.delete("gmail_state");
    res.headers.set("Location", `${origin}/app/settings?gmail=error`);
    return res;
  }
}