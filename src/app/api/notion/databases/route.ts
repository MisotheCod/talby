import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNotionToken, listDatabases, countDatabaseRows, NotionError } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** "2 hours ago" style, from an ISO timestamp. */
function editedLabel(iso?: string): string {
  if (!iso) return "Edited recently";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "Edited recently";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `Edited ${mins <= 1 ? "just now" : `${mins} minutes ago`}`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Edited ${hours === 1 ? "an hour ago" : `${hours} hours ago`}`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Edited yesterday";
  if (days < 30) return `Edited ${days} days ago`;
  const months = Math.round(days / 30);
  return `Edited ${months <= 1 ? "a month ago" : `${months} months ago`}`;
}

/**
 * GET /api/notion/databases
 * -> [{ id, name, meta: "8 pages · Edited yesterday" }]
 * -> 401 { code: "notion_lost" } when the token is gone/revoked.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: "notion_lost" }, { status: 401 });

  const token = await getNotionToken(user.id);
  if (!token) return NextResponse.json({ code: "notion_lost" }, { status: 401 });

  try {
    const dbs = await listDatabases(token.access_token);
    const out = await Promise.all(
      dbs.map(async (d) => {
        let pages: number | null = null;
        try { pages = await countDatabaseRows(token.access_token, d.id); } catch { pages = null; }
        const meta = [pages != null ? `${pages} page${pages === 1 ? "" : "s"}` : null, editedLabel(d.edited)]
          .filter(Boolean).join(" · ");
        return { id: d.id, name: d.title, meta };
      })
    );
    return NextResponse.json(out);
  } catch (e) {
    const code = e instanceof NotionError ? e.code : "fetch_failed";
    console.error("notion databases error", e);
    return NextResponse.json({ code }, { status: code === "notion_lost" ? 401 : 502 });
  }
}
