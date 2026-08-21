// ============================================================
// TALBY ASSISTANT — server-only OpenRouter helpers.
// Every call carries the OpenRouter privacy params. Data-collection
// controls are set explicitly so the assistant never routes to a host
// that stores or trains on inputs. These are NOT a substitute for the
// account-level opt-out, but they're the request-level floor.
// ============================================================
import { OPENROUTER_API_KEY, ASSISTANT_MODEL_ID, EMBED_MODEL_ID } from "@/lib/config";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Privacy params sent on every assistant/embed request. */
const PRIVACY_PARAMS = {
  // NOTE: never pass provider.order here — under allow_fallbacks:false
  // OpenRouter returns 404 "No endpoints found" even for valid ZDR routes.
  provider: {
    zdr: true,                 // route only to zero-data-retention endpoints
    data_collection: "deny",   // block hosts that retain/train on inputs
    allow_fallbacks: false,    // fail rather than silently route to a non-compliant host
  },
};

export type AssistantMsg = { role: "system" | "user" | "assistant"; content: string };

/** Complete (chat) call for the grounded assistant. */
export async function complete({
  messages,
  max_tokens = 1600,
}: {
  messages: AssistantMsg[];
  max_tokens?: number;
}): Promise<string> {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": SITE,
      "X-Title": "Talby Assistant",
    },
    body: JSON.stringify({
      model: ASSISTANT_MODEL_ID,
      messages,
      max_tokens,
      temperature: 0.1,
      ...PRIVACY_PARAMS,
    }),
  });
  if (!resp.ok) {
    const raw = await resp.text().catch(() => "");
    throw new Error(`assistant completion failed: ${resp.status} ${raw.slice(0, 200)}`);
  }
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

/** Embed a single string -> float vector via OpenRouter /embeddings. */
export async function embed(text: string): Promise<number[]> {
  const resp = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": SITE,
      "X-Title": "Talby Assistant",
    },
    body: JSON.stringify({
      model: EMBED_MODEL_ID,
      input: text.slice(0, 8191),
      ...PRIVACY_PARAMS,
    }),
  });
  if (!resp.ok) {
    const raw = await resp.text().catch(() => "");
    throw new Error(`embed failed: ${resp.status} ${raw.slice(0, 200)}`);
  }
  const data = await resp.json();
  return data?.data?.[0]?.embedding ?? [];
}

/** Split a contract's text into overlapping chunks for retrieval.
 *  ~900-char chunks with 120 overlap keeps useful clause context. */
export function chunkText(text: string, size = 900, overlap = 120): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= size) return clean.length ? [clean] : [];
  const out: string[] = [];
  let i = 0;
  while (i < clean.length) {
    const slice = clean.slice(i, i + size).trim();
    if (slice) out.push(slice);
    if (i + size >= clean.length) break;
    i += size - overlap;
  }
  return out;
}