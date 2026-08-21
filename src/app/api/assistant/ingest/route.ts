import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chunkText, embed } from "@/lib/assistant-ai";
import { EMBED_DIMENSIONS } from "@/lib/config";

/**
 * POST /api/assistant/ingest  { dealId, text }
 * Paid-tier, server-only. Stores the full contract text and its embedding chunks
 * for grounded assistant Q&A. Ownership is enforced by RLS (deal must belong to
 * the caller); the caller only supplies dealId + extracted text.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  if ((prof.data as unknown as { plan?: string } | null)?.plan !== "paid") {
    return NextResponse.json({ error: "paid_required" }, { status: 402 });
  }

  const body = (await req.json().catch(() => null)) as { dealId?: string; text?: string } | null;
  const dealId = body?.dealId?.trim();
  const text = body?.text?.trim();
  if (!dealId || !text) return NextResponse.json({ error: "dealId and text required" }, { status: 400 });

  // Ownership check + hard non-empty. RLS would block a cross-user write anyway,
  // but fail fast with a clear message rather than an opaque null update.
  const { data: deal, error: dealErr } = await supabase
    .from("deals").select("id").eq("id", dealId).eq("user_id", user.id).single();
  if (dealErr || !deal) {
    return NextResponse.json({ error: "deal not found" }, { status: 404 });
  }

  // Upsert full text (one text row per deal).
  await supabase.from("deal_contracts").delete().eq("deal_id", dealId);
  const { error: textErr } = await supabase.from("deal_contracts").insert({
    user_id: user.id, deal_id: dealId, text,
  });
  if (textErr) return NextResponse.json({ error: textErr.message }, { status: 500 });

  // Replace chunks (re-embed on re-upload).
  await supabase.from("contract_chunks").delete().eq("deal_id", dealId);
  const chunks = chunkText(text);
  let embedded = 0;
  for (let i = 0; i < chunks.length; i++) {
    const vec = await embed(chunks[i]);
    if (!vec.length || vec.length !== EMBED_DIMENSIONS) continue;
    const { error } = await supabase.from("contract_chunks").insert({
      user_id: user.id, deal_id: dealId, chunk_idx: i, content: chunks[i],
      embedding: vec,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    embedded++;
  }

  return NextResponse.json({ ok: true, chunksTotal: chunks.length, embedded });
}