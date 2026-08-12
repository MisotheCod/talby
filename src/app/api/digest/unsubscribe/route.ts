import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe for the daily digest, signed so it works from the email
 * without the user being logged in. Token = HMAC(userId, email, secret).
 * GET /api/digest/unsubscribe?uid={}&sig={} turns digest off and redirects home.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid") || "";
  const sig = url.searchParams.get("sig") || "";

  const secret = process.env.RESEND_API_KEY || process.env.CRON_SECRET || "";
  const service = createServiceClient();
  const { data: prof } = await service.from("profiles").select("email, digest_enabled").eq("id", uid).single();
  if (!prof) return NextResponse.redirect("https://www.talby.io/?digest=invalid", 302);

  const expected = createHmac("sha256", secret).update(`${uid}|${prof.email}`).digest("hex");
  const a = Buffer.from(sig); const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) return NextResponse.redirect("https://www.talby.io/?digest=invalid", 302);

  await service.from("profiles").update({ digest_enabled: false }).eq("id", uid);
  return NextResponse.redirect("https://www.talby.io/app/settings?section=notifications&digest=off", 302);
}