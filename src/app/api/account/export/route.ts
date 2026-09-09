import { createClient } from "@/lib/supabase/server";
import { buildDealsAndPaymentsCsv } from "@/lib/account-deletion";

export const dynamic = "force-dynamic";

/**
 * CSV export of the user's deals + payments, offered inside both deletion
 * modals so someone leaving still owns their data. Served from the SESSION
 * client, so it is RLS-scoped to the signed-in user only.
 */
export async function GET() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return new Response("not signed in", { status: 401 });

  const { data: dealsRaw } = await client
    .from("deals")
    .select("id,brand,value,due_date,status,deliverable,notes,created_at")
    .eq("user_id", user.id);
  const { data: paymentsRaw } = await client
    .from("payments")
    .select("deal_id,amount,expected_date,status,notes,created_at")
    .eq("user_id", user.id);

  const deals = (dealsRaw ?? []) as Array<Record<string, unknown>>;
  const brandById = new Map<string, string>();
  for (const d of deals) {
    if (d.id) brandById.set(String(d.id), String(d.brand ?? ""));
  }
  const payments = ((paymentsRaw ?? []) as Array<Record<string, unknown>>).map((p) => ({
    ...p,
    brand: p.deal_id ? brandById.get(String(p.deal_id)) ?? "" : "",
  }));

  const csv = buildDealsAndPaymentsCsv(deals, payments);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="talby-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}