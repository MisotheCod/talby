import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  completeDeletion,
  deleteUserContent,
  logDeletion,
  purgeUserStorage,
} from "@/lib/account-deletion";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Action 1 — "Delete my data". Wipes the user's content (deals, payments,
 * calendar/cycles, ideas, to-dos, inbox items, inbound mail + uploaded
 * files) but KEEPS the account, login, email, handler, theme and plan.
 *
 * The relational wipe runs in Postgres (public.delete_user_content,
 * SECURITY DEFINER) through the SESSION client so the auth.uid() = uid
 * guard is bound to the real session user — the RLS hard stop. Storage
 * objects (which don't cascade) are purged with the service client scoped
 * to the same server-verified uid. Never touches another user's rows.
 */
export async function POST(req: Request) {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  let body: { confirm?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  // The caller must type "DELETE" — a deliberate, non-single-click confirmation.
  if (body.confirm !== "DELETE") {
    return NextResponse.json({ error: "confirmation mismatch" }, { status: 403 });
  }

  const service = createServiceClient();
  const logId = await logDeletion(service, { userId: user.id, email: user.email ?? null, kind: "data" });

  try {
    await deleteUserContent(client, user.id); // RLS hard stop, as the user
    await purgeUserStorage(service, user.id); // uploaded files (keep avatar = identity)
    await completeDeletion(service, logId, "completed");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "deletion failed";
    await completeDeletion(service, logId, "failed", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}