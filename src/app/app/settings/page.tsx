"use client";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toSettingsData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";

export default function SettingsPage() {
  return (
    <TalbyDataPage
      board="SSettings"
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const notion = await supabase.from("notion_connections").select("workspace_name").maybeSingle();
        let invoices: { id: string; date: string; amount: number; url?: string }[] = [];
        try {
          const res = await fetch("/api/stripe/invoices");
          const j = await res.json();
          invoices = (j?.invoices ?? []) as typeof invoices;
        } catch { /* billing list is best-effort */ }
        return {
          data: toSettingsData({ profile: ctx.profile, notion: (notion.data ?? null) as { workspace_name: string | null } | null, today: TalbyDates.today(), invoices }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: false,
        };
      }}
    />
  );
}
