import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** Notion OAuth callback. Stores the token server-side, scoped to the user. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://talby-one.vercel.app";
  const redirect = (q: string) => NextResponse.redirect(`${base}/app/settings?${q}`);

  const cookieStore = await cookies();
  const stateJson = cookieStore.get("notion_state")?.value;
  let user_id: string | null = null;
  if (stateJson) {
    try {
      const parsed = JSON.parse(stateJson);
      if (parsed.state === state) user_id = parsed.user_id;
    } catch {}
  }

  if (error || !code || !user_id) {
    return redirect("notion=error");
  }

  try {
    const tok = await exchangeCode(code);
    const supabase = createServiceClient();
    await supabase.from("notion_connections").upsert({
      user_id,
      access_token: tok.access_token,
      workspace_name: tok.workspace_name,
      workspace_id: tok.workspace_id,
      bot_id: tok.bot_id,
      notion_user_id: tok.notion_user_id,
    });
    cookieStore.delete("notion_state");
    return redirect("notion=connected");
  } catch (e) {
    console.error("notion callback error", e);
    return redirect("notion=error");
  }
}