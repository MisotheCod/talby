import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { scanForUser } from "@/lib/inbox-scan-run";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Periodic inbox scan (polling, no Pub/Sub for v1). Runs the same pipeline
 * as the manual route for every paid user with a connected Gmail.
 * Guarded by CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const { data: connections } = await service
    .from("gmail_connections")
    .select("user_id");

  const userIds = (connections ?? []).map((c: { user_id: string }) => c.user_id);
  let total = 0;
  const done: string[] = [];

  for (const userId of userIds.slice(0, 50)) {
    try {
      const { data: prof } = await service.from("profiles").select("plan").eq("id", userId).single();
      if ((prof as { plan?: string } | null)?.plan !== "paid") continue;
      const r = await scanForUser(userId);
      total += r.newLeads;
      done.push(userId);
    } catch {
      // continue with next user
    }
  }

  return NextResponse.json({ usersScanned: done.length, newLeads: total });
}