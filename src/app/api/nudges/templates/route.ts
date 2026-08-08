import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Save the user's custom nudge templates (array of {step, body}). */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  // Paid-tier gate.
  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const plan = (prof.data as unknown as { plan: string } | null)?.plan ?? "free";
  if (plan !== "paid") return NextResponse.json({ error: "paid_required" }, { status: 402 });

  const { templates } = (await req.json()) as { templates: { step: number; body: string }[] };
  const clean = (templates ?? [])
    .map((t) => ({ step: Math.min(3, Math.max(1, t.step)), body: typeof t.body === "string" ? t.body : "" }))
    .filter((t) => t.body && t.body.trim().length > 0);

  await supabase.from("profiles").update({ nudge_templates: clean }).eq("id", user.id);
  return NextResponse.json({ ok: true, count: clean.length });
}
