import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNotionToken, listDatabases } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** List the user's accessible Notion databases for import. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const token = await getNotionToken(user.id);
  if (!token) return NextResponse.json({ error: "Notion not connected" }, { status: 400 });

  try {
    const databases = await listDatabases(token.access_token);
    return NextResponse.json({ databases });
  } catch (e) {
    console.error("notion databases error", e);
    return NextResponse.json({ error: "Could not load your Notion databases." }, { status: 502 });
  }
}