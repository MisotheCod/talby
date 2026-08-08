import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { authUrl, gmailConfigured } from "@/lib/gmail-server";

export const dynamic = "force-dynamic";

/** Start Gmail OAuth. Redirects to Google; state persisted in a signed cookie. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (!gmailConfigured()) {
    return NextResponse.json({ error: "Gmail is not configured on this deployment yet." }, { status: 503 });
  }

  const state = randomUUID();
  const res = NextResponse.redirect(authUrl(state));
  res.cookies.set("gmail_state", JSON.stringify({ state, user_id: user.id }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
