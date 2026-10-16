"use client";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toTodosData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";
import type { DealRow, TodoRow } from "@/lib/talby/queries";

export default function TodosPage() {
  return (
    <TalbyDataPage
      board="STodos"
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const [t, d] = await Promise.all([
          supabase.from("todos").select("*").order("created_at", { ascending: true }),
          supabase.from("deals").select("id, brand, value, status").eq("active", true).not("status", "eq", "archived"),
        ]);
        const todos = (t.data ?? []) as unknown as TodoRow[];
        return {
          data: toTodosData({ todos, deals: (d.data ?? []) as unknown as DealRow[], today: TalbyDates.today() }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: todos.length === 0,
        };
      }}
    />
  );
}
