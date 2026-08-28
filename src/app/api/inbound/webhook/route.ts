import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { RESEND_INBOUND_WEBHOOK_SECRET } from "@/lib/server-config";
import { verifySvix } from "@/lib/svix";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Part 1 — log-only inbound webhook.
 *
 * Deliberately minimal: verify the Svix signature on every request (REJECT
 * unsigned), log + STORE the entire raw Resend payload, return 200. No parsing,
 * no recipient check, no pipeline. The point is to capture the real Gmail
 * confirmation email and a real auto-forward so we can observe header values
 * (received_for, Delivered-To, X-Forwarded-To) before building on them.
 */
export async function POST(req: Request) {
  const payload = await req.text();

  // 1. Verify Svix signature. Reject unsigned/mismatched/stale outright.
  const svixId = req.headers.get("svix-id");
  const svixTs = req.headers.get("svix-timestamp");
  const svixSig = req.headers.get("svix-signature");
  if (!svixId || !svixTs || !svixSig || !RESEND_INBOUND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }
  if (!verifySvix(RESEND_INBOUND_WEBHOOK_SECRET, { id: svixId, timestamp: svixTs, signature: svixSig }, payload)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // 2. Store the FULL raw payload. Keep the original string too (inside jsonb)
  //    so nothing the provider sent is lost to drift.
  let parsed: unknown = null;
  try { parsed = JSON.parse(payload); } catch { parsed = { raw: payload }; }
  const data = (parsed ?? {}) as Record<string, unknown>;
  const inner = (data.data as Record<string, unknown> | undefined) ?? {};
  const emailId = (data.email_id as string) ?? (inner.email_id as string) ?? "";
  const to = Array.isArray(inner.to) ? (inner.to as unknown[]).join(", ") : ((inner.to as string) ?? "");
  const from = (inner.from as string) ?? (data.from as string) ?? "";
  const subject = (inner.subject as string) ?? (data.subject as string) ?? "";

  const service = createServiceClient();
  try {
    await service.from("inbound_emails").insert({
      email_id: emailId,
      to_address: to,
      from_address: from,
      subject,
      raw: parsed,
      status: "received",
    });
  } catch (e) {
    // Persistence failure: still log server-side; return 200 so Resend doesn't
    // hammer retries on a logging gap.
    console.error("inbound persist failed", e);
  }

  console.log("inbound received", JSON.stringify({
    email_id: emailId, to, from, subject, time: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true }, { status: 200 });
}