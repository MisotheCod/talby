"use client";

/** Shared tiny helpers for currency / dates / greeting. */

export function formatMoney(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatMoneyExact(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateLong(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

/** "Oct 25, 2026" — the canonical display date everywhere a date is shown as
 *  text (never raw YYYY-MM-DD). */
export function formatDateFull(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function isPastDue(dateIso: string | null | undefined): boolean {
  if (!dateIso) return false;
  const d = new Date(dateIso + (dateIso.length <= 10 ? "T00:00:00" : ""));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Split a stored multi-value list (comma-separated) into a trimmed, de-duped
 *  array of non-empty strings. Single legacy values (no comma) still work. */
export function splitList(v: string | null | undefined): string[] {
  if (!v) return [];
  const out: string[] = [];
  for (const p of String(v).split(",")) {
    const s = p.trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

/** Join a string array into the stored comma-separated form (null when empty). */
export function joinList(arr: string[]): string | null {
  const out = arr.filter((s) => s.trim() !== "");
  return out.length ? out.join(",") : null;
}
