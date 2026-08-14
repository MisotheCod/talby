import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/**
 * Notion OAuth callback. Stores the token server-side, scoped to the user.
 * SESSION PRESERVATION: the middleware's refreshed session cookie isn't
 * carried onto a fresh redirect, so we refresh via the auth-aware client and
 * copy the auth cookies onto the redirect response to avoid dropping the user
 * to /login after the round-trip.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://talby-one.vercel.app";
  const origin = url.origin && url.origin !== "null" ? url.origin : base;

  const cookieStore = await cookies();
  const stateJson = cookieStore.get("notion_state")?.value;
  let user_id: string | null = null;
  let redirect_to: string = "/app/import";
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

  const build = (q: string, path?: string) => {
    const res = NextResponse.redirect(`${origin}${path ?? "/app/settings"}?${q}`);
    const all = cookieStore.getAll();
    for (const c of all) {
      if (c.name.startsWith("sb-") || c.name.includes("auth-token")) {
        res.cookies.set(c.name, c.value, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      }
    }
    return res;
  };

  if (error || !code || !user_id) {
    console.error("notion callback early-return", { hasError: !!error, error, hasCode: !!code, hasUser: !!user_id, stateParam: state, hasStateCookie: !!stateJson, stateCookieMatch: stateJson ? JSON.parse(stateJson || "{}").state === state : false });
    return build("notion=error", redirect_to);
  }

  try {
    // Refresh the session so its cookies land in the store, then copy them.
    const session = await createClient();
    await session.auth.getUser();

    const tok = await exchangeCode(code);
    const supabase = createServiceClient();
    const { error: upsertErr } = await supabase.from("notion_connections").upsert({
      user_id,
      access_token: tok.access_token,
      workspace_name: tok.workspace_name,
      workspace_id: tok.workspace_id,
      bot_id: tok.bot_id,
      notion_user_id: tok.notion_user_id,
    });
    if (upsertErr) { console.error("notion_connections upsert error", upsertErr); }
    cookieStore.delete("notion_state");
    return build("notion=connected", redirect_to);
  } catch (e) {
    console.error("notion callback error", e);
    return build("notion=error", redirect_to);
  }
}