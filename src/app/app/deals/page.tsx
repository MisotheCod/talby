"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TalbyDataPage from "@/components/talby-app/TalbyDataPage";
import { TalbyDates } from "@/components/talby/_data";
import { toDealsData } from "@/lib/talby/to-board";
import { loadAccountContext } from "@/lib/talby/load-account";
import type { DealRow, PaymentRow, ContentRow } from "@/lib/talby/queries";

function DealsPageInner() {
  const sp = useSearchParams();
  const start = sp.get("start") ?? undefined;
  return (
    <TalbyDataPage
      board="SDeals"
      start={start}
      load={async (supabase) => {
        const ctx = await loadAccountContext(supabase);
        const [d, pay, c, ex, cl, fi] = await Promise.all([
          supabase.from("deals").select("*"),
          supabase.from("payments").select("*, deal:deals(id, brand)"),
          supabase.from("content").select("id, linked_deal_id, title, event_date"),
          supabase.from("deal_extras").select("user_id, deal_id, kind, amount, rate, condition, on_text"),
          supabase.from("deal_checklist").select("deal_id, title, done"),
          supabase.from("deal_files").select("id, deal_id, name, kind, path, created_at"),
        ]);
        const deals = (d.data ?? []) as unknown as DealRow[];
        const rawFiles = (fi.data ?? []) as Array<{ id: string; deal_id: string; name: string; kind: string | null; path: string; created_at: string }>;
        const files = await Promise.all(rawFiles.map(async (x) => {
          // Contracts from the New deal dialog live in the "contracts" bucket; deal-panel
          // uploads live in "deal-files". Try both so every file gets a working url.
          let url = (await supabase.storage.from("deal-files").createSignedUrl(x.path, 3600)).data?.signedUrl;
          if (!url) url = (await supabase.storage.from("contracts").createSignedUrl(x.path, 3600)).data?.signedUrl;
          return { id: x.id, deal_id: x.deal_id, name: x.name, kind: x.kind, created_at: x.created_at, url: url ?? x.path };
        }));
        const today = TalbyDates.today();
        return {
          data: toDealsData({
            deals, payments: (pay.data ?? []) as unknown as PaymentRow[], content: (c.data ?? []) as unknown as ContentRow[], today,
            extras: (ex.data ?? []) as unknown as Array<{ deal_id: string; kind: "bonus" | "commission"; amount: number | null; rate: number | null; condition: string | null; on_text: string | null }>,
            checklist: (cl.data ?? []) as unknown as Array<{ deal_id: string; title: string; done: boolean }>,
            files,
          }),
          account: ctx.account, plan: ctx.plan, look: ctx.look, readOnly: ctx.readOnly,
          empty: deals.length === 0,
        };
      }}
    />
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={null}>
      <DealsPageInner />
    </Suspense>
  );
}
