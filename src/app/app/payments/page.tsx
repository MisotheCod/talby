"use client";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toPaymentsData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";
import type { DealRow, PaymentRow } from "@/lib/talby/queries";

export default function PaymentsPage() {
  return (
    <TalbyDataPage
      board="SPayments"
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const [pay, d] = await Promise.all([
          supabase.from("payments").select("*, deal:deals(id, brand)"),
          supabase.from("deals").select("id, brand, value, status, active"),
        ]);
        const payments = (pay.data ?? []) as unknown as PaymentRow[];
        const today = TalbyDates.today();
        return {
          data: toPaymentsData({ payments, deals: (d.data ?? []) as unknown as DealRow[], today }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: payments.length === 0,
        };
      }}
    />
  );
}
