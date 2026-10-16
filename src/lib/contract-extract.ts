import { OPENROUTER_API_KEY } from "@/lib/server-config";

/** Max upload: 20 MB (upgrade 13). */
export const MAX_BYTES = 20 * 1024 * 1024;

export type ReadResult = { text: string; pages: number } | { code: "too_big" | "bad_type" | "unreadable" | "empty" };

/**
 * Read the text out of an uploaded contract file.
 * PDF via unpdf, Word .docx via mammoth, plain text/markdown directly.
 * Returns a machine code on failure so the route can answer { code }.
 */
export async function readContractText(file: File): Promise<ReadResult> {
  if (file.size > MAX_BYTES) return { code: "too_big" };

  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isDocx = name.endsWith(".docx");
  const isText = name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/");

  let text = "";
  let pages = 1;
  if (isPdf) {
    try {
      const { extractText } = await import("unpdf");
      const data = new Uint8Array(await file.arrayBuffer());
      const out = await extractText(data);
      text = (out.text ?? []).join(" ");
      pages = (out as { totalPages?: number }).totalPages ?? 1;
    } catch (err) {
      console.error("contract pdf error:", err instanceof Error ? err.message : err);
      return { code: "unreadable" };
    }
  } else if (isDocx) {
    try {
      const mammoth = await import("mammoth");
      const out = await mammoth.extractRawText({ buffer: Buffer.from(await file.arrayBuffer()) });
      text = out.value;
    } catch (err) {
      console.error("contract docx error:", err instanceof Error ? err.message : err);
      return { code: "unreadable" };
    }
  } else if (isText) {
    text = await file.text();
  } else {
    return { code: "bad_type" };
  }

  text = text.slice(0, 30000);
  if (!text.trim()) return { code: "empty" };
  return { text, pages };
}

export const CONTRACT_SYSTEM = [
  "You are Talby's contract parser. You read a creator-influencer brand-deal contract or SOW and extract the deal's key terms into structured JSON.",
  "",
  "Extract EVERY field below. For anything absent or unstated, set it to null — NEVER invent values.",
  "- brand: the company/brand commissioning the work (from the contract, not the filer).",
  "- deliverable: the content/deliverables requested, e.g. '2 Instagram Reels + 3 Stories'.",
  "- value_total: the total compensation as a number (USD). Combine fees if multiple line items.",
  "- pay_terms: map payment timing to one of exactly: 'due_on_receipt','net_15','net_30','net_45','net_60','net_90','milestone'. If a Net term or due-on-receipt is stated, use it; if payment is split into installments/milestones, use 'milestone'; if nothing stated, null.",
  "- exclusivity_days: number of days of exclusivity (no competing brand posts), as an integer; if only dates are given, compute the approximate day count; if none, null.",
  "- revisions_included: the number of revision rounds included in the contract, as a whole number string (e.g. '2'); if the contract says revisions are unlimited, set it to the string 'Unlimited'; if the number of included revisions is not stated, set it to null. NEVER invent a number.",
  "- due_date: the deadline for final deliverables in YYYY-MM-DD; null if unstated.",
  "- post_dates: a JSON array of EVERY scheduled post/publish/live date the contract mentions, each as {\"date\":\"YYYY-MM-DD\", \"label\":\"Reel\"|\"Story 2\"|...}. A deal for one Reel and three Stories usually has FOUR dates. Extract every distinct one the contract states; if it names a platform/deliverable alongside a date, put that in label (e.g. 'Reel' or 'Story 2'); if only dates are given, label is \"\". Empty array [] if no dates are stated. NEVER invent a date.",
  "- rep_name: the brand's representative — the human contact at the commissioning company, never the creator/filer. If the only name or email found matches the account owner, set rep_name and rep_email to null (leave Rep contact empty).",
  "- rep_email: the representative's email; null if unknown or if it belongs to the creator.",
  "- platforms: comma-separated platforms (Instagram, TikTok, YouTube...); null if none.",
  "- payment_structure: the way the deal is paid, as {\"kind\":\"once\"|\"split\"|\"parts\"|\"monthly\", ...details}else null when a single all-at-once payment (the default). Detail fields by kind:\n     once:  {\"kind\":\"once\", \"timing\":\"when_posts\"|\"net_15\"|\"net_30\"|\"net_45\"|\"net_60\"}\n     split: {\"kind\":\"split\", \"upfront_pct\":<25|30|40|50>, \"balance_timing\":\"when_posts\"|\"net_15\"|\"net_30\"|\"net_60\"}\n     parts: {\"kind\":\"parts\", \"parts\":[{\"name\":\"Milestone 1\",\"amount\":<number>,\"date\":\"YYYY-MM-DD\"|null,\"trigger\":\"signing\"|\"approval\"|\"posting\"|\"campaign end\"|null}]}\n     monthly: {\"kind\":\"monthly\", \"months\":<3|6|12>, \"start_date\":\"YYYY-MM-DD\"|null}\n     Capture the exact timing and each part's amount/date/trigger. If none of these is clearly stated, set payment_structure to null (NOT 'once' with a guess); the deal form defaults to All at once / Net 30 and flags the Paid field for review.",
  "- extras: a JSON array of any bonuses or commissions the contract mentions: a bonus is {\"kind\":\"bonus\",\"amount\":<number>,\"condition\":\"the Reel passes 100K views\"}; a commission is {\"kind\":\"commission\",\"rate\":<number percent>,\"on\":\"sales with code CAMBO10\"}. Empty array [] when none stated.",
  "- payment_note: the EXACT sentence in the contract the payment terms came from, verbatim (e.g. 'Payment of $4,800 will be made net 30 after posting.'); null when no payment terms are stated.",
  "",
  "Respond with STRICT JSON only:",
  '{"brand":..., "deliverable":..., "value_total":<number|null>, "pay_terms":..., "exclusivity_days":<int|null>, "revisions_included":<string|null>, "due_date":..., "post_dates":[{"date":"YYYY-MM-DD","label":"Reel"}], "rep_name":..., "rep_email":..., "platforms":..., "payment_structure":{...}|null, "extras":[...], "payment_note":...}',
].join("\n");

export async function extractDealFields(text: string, ownerIdentity: string): Promise<Record<string, unknown>> {
  const ownerNote = ownerIdentity
    ? `\n\nThe account owner (the creator filing this contract) is: ${ownerIdentity}. Treat any name or email in the contract that matches this as the CREATOR, not as the brand's representative. The rep (rep_name/rep_email) must be a contact at the BRAND.`
    : "";
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Talby Contract",
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash-lite",
      messages: [{ role: "system", content: CONTRACT_SYSTEM }, { role: "user", content: text + ownerNote }],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) throw new Error("OpenRouter extraction failed: " + resp.status);
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    return JSON.parse(m ? m[1] : "{}");
  }
}

/** Identity of the filer, so the reader never mistakes the creator for the brand's rep. */
export function ownerIdentityOf(user: { email?: string | null; user_metadata?: unknown }): string {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  return [user.email ?? "", (meta.full_name as string) ?? "", (meta.name as string) ?? ""]
    .filter((s) => s.trim() !== "")
    .join("; ");
}
