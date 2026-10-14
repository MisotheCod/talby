// Shared payment-structure generator — no "use client", so it is callable from
// BOTH server API routes (POST /api/deals) and client components (the modal
// preview). `pay-status.ts` ("use client") re-exports these for client callers;
// the API route imports this file directly.

export type PaymentStructureKind = "once" | "split" | "parts" | "monthly";

export const NET_DAYS: Record<string, number> = {
  due_on_receipt: 0, net_15: 15, net_30: 30, net_45: 45, net_60: 60, net_90: 90,
};

/**
 * Generate the deal's payment rows from its structure (spec 1b: every deal has
 * at least one payment). Pure function — no React, no I/O — so server and
 * client produce identical rows.
 */
export function generatePaymentsFromStructure(s: {
  structureKind: PaymentStructureKind | null;
  amount: number | null;
  structure_timing?: string | null;
  structure_upfront_pct?: number | null;
  structure_balance_timing?: string | null;
  structure_months?: number | null;
  post_date?: string | null;
  parts?: { name?: string | null; amount?: number | null; date?: string | null }[];
}): { amount: number | null; expected_date: string | null; notes: string | null }[] {
  const amt = s.amount ?? 0;
  const post = s.post_date || null;
  const timingDate = (netKey: string | null | undefined): string | null => {
    const days = netKey ? NET_DAYS[netKey] : undefined;
    if (netKey === "when_posts") return post;
    if (days !== undefined && post) {
      const d = new Date(post + "T00:00:00");
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    }
    return null;
  };
  switch (s.structureKind) {
    case "split": {
      const up = Math.round((amt * (s.structure_upfront_pct ?? 50)) / 100);
      return [
        { amount: up, expected_date: null, notes: null },                       // upfront
        { amount: amt - up, expected_date: timingDate(s.structure_balance_timing ?? "net_30"), notes: null }, // balance
      ];
    }
    case "monthly": {
      const m = Math.max(1, s.structure_months ?? 3);
      const per = Math.round(amt / m);
      return Array.from({ length: m }, () => ({ amount: per, expected_date: null, notes: null }));
    }
    case "parts":
      return (s.parts ?? []).map((p) => ({ amount: p.amount ?? null, expected_date: p.date || null, notes: p.name?.trim() || null }));
    case "once":
    default:
      return [{ amount: amt, expected_date: timingDate(s.structure_timing ?? "net_30"), notes: null }];
  }
}