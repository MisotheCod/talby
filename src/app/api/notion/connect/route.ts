import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { authUrl, notionConfigured } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** Start Notion OAuth. Redirects to Notion; state persisted in a signed cookie. */
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (!notionConfigured()) {
    return NextResponse.json({ error: "Notion is not configured on this deployment yet." }, { status: 503 });
  }

  // Where to return the user after the OAuth round-trip. Only allow app
  // pages to avoid an open redirect. Defaults to the deal flow (Notion step).
  const u = new URL(req.url);
  let redirectTo = u.searchParams.get("redirect_to") || "/app/deals?start=notion";
  // Allow an optional ?start=notion (routes into the database flow); the base
  // path must stay a /app page to avoid an open redirect.
  const [rtBase, rtQs] = redirectTo.split("?");
  if (!/^\/app\/[a-z0-9/_-]*$/i.test(rtBase)) redirectTo = "/app/deals?start=notion";
  else redirectTo = rtQs ? `${rtBase}?${rtQs}` : rtBase;

  const state = randomUUID();
  const res = NextResponse.redirect(authUrl(state));
  res.cookies.set("notion_state", JSON.stringify({ state, user_id: user.id, redirect_to: redirectTo }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}