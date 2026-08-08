import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchDatabaseRows, getNotionToken } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/**
 * Query a chosen Notion database and flatten it into column/row shape,
 * then feed it to the SAME AI import-mapping pipeline as CSV.
 * Body: { databaseId: string, sourceName?: string }
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const databaseId: string = body?.databaseId || "";
  if (!databaseId) return NextResponse.json({ error: "No database selected." }, { status: 400 });

  const token = await getNotionToken(user.id);
  if (!token) return NextResponse.json({ error: "Notion not connected" }, { status: 400 });

  try {
    const out = await fetchDatabaseRows(token.access_token, databaseId, body?.sourceName || "");
    return NextResponse.json(out);
  } catch (e) {
    console.error("notion fetch error", e);
    return NextResponse.json({ error: "Could not read that Notion database." }, { status: 502 });
  }
}