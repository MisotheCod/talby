"use client";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toDealsData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";
import type { DealRow, PaymentRow, ContentRow } from "@/lib/talby/queries";

export default function DealsPage() {
  return (
    <TalbyDataPage
      board="SDeals"
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const [d, pay, c] = await Promise.all([
          supabase.from("deals").select("*"),
          supabase.from("payments").select("*, deal:deals(id, brand)"),
          supabase.from("content").select("id, linked_deal_id, title, event_date"),
        ]);
        const deals = (d.data ?? []) as unknown as DealRow[];
        const today = TalbyDates.today();
        return {
          data: toDealsData({ deals, payments: (pay.data ?? []) as unknown as PaymentRow[], content: (c.data ?? []) as unknown as ContentRow[], today }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: deals.length === 0,
        };
      }}
    />
  );
}
