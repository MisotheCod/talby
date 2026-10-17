/**
 * import-fields.ts — the Talby import field keys and the guesses for them.
 * Env-free so both the routes and the tests can import it.
 */

export type ImportField =
  | "brand" | "amt" | "post" | "payby" | "status" | "pay" | "plats" | "rep" | "repEmail" | "notes" | "skip";

/** Guess the Talby field a column/property supplies. */
export function guessField(name: string): ImportField {
  const n = name.toLowerCase();
  if (/skip|ignore/.test(n)) return "skip";
  if (/brand|company|client|campaign|partner|\bname\b/.test(n)) return "brand";
  if (/amount|value|fee|total|price|rate|comp|\$/.test(n)) return "amt";
  if (/pay\s*by|due|invoice/.test(n)) return "payby";
  if (/post|publish|live|date|when/.test(n)) return "post";
  if (/status|stage|state/.test(n)) return "status";
  if (/paid|payment|terms|schedule/.test(n)) return "pay";
  if (/platform|channel|where/.test(n)) return "plats";
  // repEmail needs both an email-ish and a contact-ish word, so a plain
  // "Email" column does not beat a real rep column.
  if (/e-?mail/.test(n) && /rep|contact|manager/.test(n)) return "repEmail";
  if (/rep|contact|manager|owner/.test(n)) return "rep";
  if (/note|comment|remark|detail/.test(n)) return "notes";
  return "skip";
}

/** Guess the Talby value a column's own value maps to. */
export function guessValue(v: string): string {
  const s = v.toLowerCase();
  if (/negotiat|pipeline|talk|lead|prospect|outreach/.test(s)) return "Negotiating";
  if (/active|in progress|live|ongoing|posted|confirmed/.test(s)) return "Active";
  if (/paid|complete|done|closed/.test(s)) return "Paid";
  if (/cancel|archiv|lost|declined/.test(s)) return "Archived";
  return v;
}

/** Parse "$6,000" / "6000" / "6,000.50" to a number; NaN when it is not one. */
export function money(v: string | undefined): number {
  if (!v) return NaN;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}
