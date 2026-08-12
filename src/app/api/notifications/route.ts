import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** GET /api/notifications?limit=20 — the current user's notifications, newest first. */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const limit = Number(new URL(req.url).searchParams.get("limit") || 20);
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 50));

  // unread count
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return NextResponse.json({ notifications: data ?? [], unread: count ?? 0 });
}

/** POST /api/notifications — mark one or all read. body { id?, all? } */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { id, all } = await req.json().catch(() => ({}));
  if (all) {
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  } else if (id) {
    await supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user.id);
  }
  return NextResponse.json({ ok: true });
}