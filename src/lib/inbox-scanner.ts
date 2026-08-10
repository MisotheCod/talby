import "server-only";
import { OPENROUTER_API_KEY } from "@/lib/config";

/**
 * Inbox deal-scanner pipeline. Signals only SELECT candidates (cheap filter);
 * the LLM makes the semantic decision and extracts structured data. This is
 * inspired by the import-mapping engine (same model, same strict-JSON
 * discipline, never hallucinate missing fields -> null/TBD).
 *
 * Key principle: signals NEVER mean "this is a deal". They just gate which
 * emails get an LLM call so we don't run the whole inbox through the model.
 */

export const SIGNAL_TERMS = [
  "collab", "partnership", "campaign", "opportunity", "paid",
  "compensation", "budget", "rate", "fee", "gifting", "pr ",
  "product seed", "affiliate", "commission", "deliverables", "reel",
  "tiktok", "story", "ugc", "brief", "contract", "sow",
  "agreement", "deadline", "draft due", "live date", "posting date",
  "working together", "your content", "come across", "explore working",
  "would love", "love your", "reaching out", "reach out", "creator",
  "sponsor", "endorsement", "promote", "featured", "gifting campaign",
  "we came across",
];

/** Cheap gate: does this email hit any signal term? NOT a verdict. */
export function hitsSignal(subject: string, body: string, snippet: string): boolean {
  const hay = `${subject}\n${snippet}\n${body}`.toLowerCase();
  return SIGNAL_TERMS.some((t) => hay.includes(t));
}

const DEAL_TYPES = [
  "Paid Partnership",
  "UGC",
  "Gifted / PR",
  "Affiliate / Commission",
  "Event / Experience",
  "Ambassador",
  "Potential Opportunity / TBD",
];

const EXTRACT_FIELDS = [
  "brand_name", "agency_name", "contact_name", "contact_email",
  "deal_type", "compensation", "currency", "deliverables", "platforms",
  "draft_deadline", "post_date", "usage_rights", "exclusivity",
  "payment_terms", "campaign_name", "summary", "next_action", "confidence",
];

const SYSTEM = [
  "You are Talby's brand-deal detector. You read an incoming email to a creator and decide whether it represents a commercial or potential-commercial relationship.",
  "",
  "DECISION — answer this conceptual question, NOT keyword matching:",
  "\"Is this email part of a legitimate commercial or potential-commercial relationship between a creator and a brand, agency, platform, or representative?\"",
  "",
  "It must CATCH intent without exact keywords: 'we came across your content and would love to explore working together' IS a deal. An intro email with no compensation yet is a real lead.",
  "It must REJECT false positives: a retailer newsletter that says 'Paid partnership opportunities for creators!' is NOT a deal. A mass blast, a job ad, or spam is NOT a deal.",
  "",
  "Only classify as relevant=true for genuine direct outreach tied to the creator's work/content.",
  "",
  `KIND — classify into one of: ${DEAL_TYPES.join(", ")}. 'Potential Opportunity / TBD' is valid when it is a lead but compensation/type is not yet clear.`,
  "",
  "EXTRACTION — only after relevant=true. Extract ALL of these fields. For anything missing or unknown use null OR the literal string 'TBD' (for textual fields) — NEVER invent values: ",
  EXTRACT_FIELDS.join(", "),
  "",
  "Rules:",
  "- brand_name: the company/brand (from sender domain/name or body).",
  "- contact_name / contact_email: the human representative; from the sender header.",
  "- compensation: numeric amount or description as written; currency: e.g. USD/EUR.",
  "- deliverables: what content/outcomes are requested (e.g. '1 Reel + 2 Stories').",
  "- platforms: which social networks (TikTok, Instagram, YouTube...) as a comma list.",
  "- draft_deadline / post_date: dates in YYYY-MM-DD if stated, else null/TBD.",
  "- usage_rights / exclusivity / payment_terms: free-text as written, else TBD.",
  "- campaign_name: the campaign/brand deal name if stated.",
  "- summary: ONE clear sentence of what this outreach is.",
  "- next_action: what the creator should do next (e.g. 'Reply with rate card', 'Review brief').",
  "- confidence: 0.0 to 1.0 — how confident you are this is relevant. < 0.6 is a low-confidence flag.",
  "",
  "Respond with STRICT JSON only, shape:",
  '{"relevant":true|false,"confidence":0.0..1.0,"type":"<KIND or null>","extracted":{<all extract fields, null/TBD when missing>}}',
].join("\n");

type ScanMessage = { subject: string; from: string; body: string; snippet: string };

export async function classifyEmail(msg: ScanMessage): Promise<{
  relevant: boolean;
  confidence: number;
  type: string | null;
  extracted: Record<string, unknown>;
}> {
  const user =
    `Subject: ${msg.subject}\nFrom: ${msg.from}\nBody:\n${(msg.body || msg.snippet || "").slice(0, 6000)}`;

  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Talby Inbox",
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash-lite",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    throw new Error("OpenRouter classification failed: " + resp.status);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  let parsed: Record<string, any>;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    parsed = JSON.parse(m ? m[1] : "{}");
  }

  const extracted = (parsed.extracted && typeof parsed.extracted === "object") ? parsed.extracted : {};
  return {
    relevant: parsed.relevant === true,
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    type: typeof parsed.type === "string" ? parsed.type : null,
    extracted,
  };
}