import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/gmail-server";

export const dynamic = "force-dynamic";

/** Google OAuth callback. Stores the token server-side, scoped to the user. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

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
    return NextResponse.redirect(`/app/settings?gmail=error`);
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
    return NextResponse.redirect(`/app/settings?gmail=connected`);
  } catch (e) {
    console.error("gmail callback error", e);
    return NextResponse.redirect(`/app/settings?gmail=error`);
  }
}
