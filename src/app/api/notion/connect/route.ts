import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { authUrl, notionConfigured } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** Start Notion OAuth. Redirects to Notion; state persisted in a signed cookie. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (!notionConfigured()) {
    return NextResponse.json({ error: "Notion is not configured on this deployment yet." }, { status: 503 });
  }

  const state = randomUUID();
  const res = NextResponse.redirect(authUrl(state));
  res.cookies.set("notion_state", JSON.stringify({ state, user_id: user.id }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}