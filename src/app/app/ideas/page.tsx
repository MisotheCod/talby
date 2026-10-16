"use client";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toIdeasData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";

export default function IdeasPage() {
  return (
    <TalbyDataPage
      board="SIdeas"
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const { data } = await supabase.from("ideas").select("id, title, created_at, status").order("created_at", { ascending: true });
        const ideas = (data ?? []) as Array<{ id: string; title: string; created_at: string; status: string }>;
        return {
          data: toIdeasData({ ideas, today: TalbyDates.today() }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: ideas.filter((x) => x.status !== "archived").length === 0,
        };
      }}
    />
  );
}
