"use client";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toCalendarData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";
import type { ContentRow, PaymentRow, TodoRow } from "@/lib/talby/queries";

export default function CalendarPage() {
  return (
    <TalbyDataPage
      board="SCalendar"
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const [c, pay, t] = await Promise.all([
          supabase.from("content").select("*"),
          supabase.from("payments").select("*, deal:deals(id, brand)"),
          supabase.from("todos").select("*"),
        ]);
        const content = (c.data ?? []) as unknown as ContentRow[];
        const payments = (pay.data ?? []) as unknown as PaymentRow[];
        const todos = (t.data ?? []) as unknown as TodoRow[];
        return {
          data: toCalendarData({ content, payments, todos, today: TalbyDates.today() }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: content.length === 0 && payments.length === 0 && todos.length === 0,
        };
      }}
    />
  );
}
