import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Disconnect Notion: remove the stored token. */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  await supabase.from("notion_connections").delete().eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}