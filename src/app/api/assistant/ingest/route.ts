import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chunkText, embed } from "@/lib/assistant-ai";
import { EMBED_DIMENSIONS } from "@/lib/constants";

/**
 * POST /api/assistant/ingest  { dealId, text }
 * Paid-tier, server-only. Stores the full contract text and its embedding chunks
 * for grounded assistant Q&A. Ownership is enforced by RLS (deal must belong to
 * the caller); the caller only supplies dealId + extracted text.
 */
// Per-user rate limit (mirrors /api/assistant): 15 requests/minute. Stops a loop
// from hammering the embedding provider and draining OpenRouter credits.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15;
const ingestHits = new Map<string, number[]>();
function rateLimited(uid: string): boolean {
  const now = Date.now();
  const arr = (ingestHits.get(uid) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) return true;
  arr.push(now);
  ingestHits.set(uid, arr);
  return false;
}

// Hard ceiling on contract text we will embed per request (mirrors the extract
// route's cap). Prevents an oversized payload from generating unbounded chunks
// and embedding calls.
const MAX_INGEST_CHARS = 30_000;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  if (rateLimited(user.id)) {
    return NextResponse.json({ error: "slow_down", message: "That's a lot at once — give it a few seconds." }, { status: 429 });
  }

  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  if ((prof.data as unknown as { plan?: string } | null)?.plan !== "paid") {
    return NextResponse.json({ error: "paid_required" }, { status: 402 });
  }

  const body = (await req.json().catch(() => null)) as { dealId?: string; text?: string } | null;
  const dealId = body?.dealId?.trim();
  let text = body?.text?.trim();
  if (!dealId || !text) return NextResponse.json({ error: "dealId and text required" }, { status: 400 });
  if (text.length > MAX_INGEST_CHARS) {
    text = text.slice(0, MAX_INGEST_CHARS);
  }

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