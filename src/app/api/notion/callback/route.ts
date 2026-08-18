import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/**
 * Notion OAuth callback. Stores the token server-side, scoped to the user.
 *
 * SESSION PRESERVATION: the middleware refreshes the Supabase session cookie
 * on this request, but the refresh writes on the middleware's response. If we
 * return our own redirect without carrying the session cookies, the session is
 * dropped -> after the round-trip the app bounces to /login, which looks like
 * the user's data vanished.
 *
 * Fix: bind the supabase cookie adapter directly to the redirect response we
 * will return, so getUser()'s session refresh writes the auth cookies onto that
 * same response and the redirect always carries the live session.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.talby.io";
  const origin = url.origin && url.origin !== "null" ? url.origin : base;

  // Read the notion_state cookie /api/notion/connect set before redirecting to
  // Notion. It pins the round-trip to the signed-in user (no account switch).
  let user_id: string | null = null;
  let redirect_to: string = "/app/import";
  const reqCookies = new Map<string, string>();
  for (const c of req.headers.get("cookie")?.split(";") ?? []) {
    const eq = c.indexOf("=");
    if (eq > 0) reqCookies.set(c.slice(0, eq).trim(), c.slice(eq + 1).trim());
  }
  const stateJson = reqCookies.get("notion_state");
  if (stateJson) {
    try {
      const parsed = JSON.parse(stateJson);
      if (parsed.state === state) {
        user_id = parsed.user_id;
        if (typeof parsed.redirect_to === "string" && /^\/app\/[a-z0-9/_-]*$/i.test(parsed.redirect_to)) {
          redirect_to = parsed.redirect_to;
        }
      }
    } catch {}
  }

  // Build the redirect response up front so the session cookie adapter can
  // write straight onto it.
  const res = NextResponse.redirect(`${origin}${redirect_to}?notion=error`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
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
    console.error("notion callback early-return", { hasError: !!error, error, hasCode: !!code, hasUser: !!user_id, stateParam: state, hasStateCookie: !!stateJson, stateCookieMatch: stateJson ? JSON.parse(stateJson || "{}").state === state : false });
    // Refresh the session through the adapter so its cookies land on res.
    await supabase.auth.getUser();
    res.cookies.delete("notion_state");
    return res;
  }

  try {
    const tok = await exchangeCode(code);
    const service = createServiceClient();
    const { error: upsertErr } = await service.from("notion_connections").upsert({
      user_id,
      access_token: tok.access_token,
      workspace_name: tok.workspace_name,
      workspace_id: tok.workspace_id,
      bot_id: tok.bot_id,
      notion_user_id: tok.notion_user_id,
    });
    if (upsertErr) { console.error("notion_connections upsert error", upsertErr); }

    // Refresh the session through the adapter so its cookies land on res.
    await supabase.auth.getUser();

    res.cookies.delete("notion_state");
    res.headers.set("Location", `${origin}${redirect_to}?notion=connected`);
    return res;
  } catch (e) {
    console.error("notion callback error", e);
    await supabase.auth.getUser();
    res.cookies.delete("notion_state");
    res.headers.set("Location", `${origin}${redirect_to}?notion=error`);
    return res;
  }
}