import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notionConfigured } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** Report Notion connection status (never returns the token). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const { data } = await supabase
    .from("notion_connections")
    .select("workspace_name, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  return NextResponse.json({
    connected: !!data,
    workspace: (data as unknown as { workspace_name?: string })?.workspace_name ?? null,
    configured: notionConfigured(),
  });
}