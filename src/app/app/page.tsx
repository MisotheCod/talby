"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TalbyPage from "@/components/talby-app/TalbyPage";
import { toOverviewData, toAccountData } from "@/lib/talby/to-board";
import { TalbyDates } from "@/components/talby/_data";
import type { OverviewData, AccountData } from "@/components/talby/_data";
import type { DealRow, PaymentRow, ContentRow, TodoRow, ProfileRow } from "@/lib/talby/queries";

type View = "loading" | "sample" | "empty" | "error";

/** Item C: Overview on /app with real data + account + onAction. */
export default function OverviewPage() {
  const supabase = createClient();
  const [view, setView] = useState<View>("loading");
  const [data, setData] = useState<OverviewData | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [plan, setPlan] = useState("active");
  const [look, setLook] = useState<{ theme: string; mode: string; sidebar: string } | null>(null);

  const load = async () => {
    setView("loading");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const prof = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const profile = (prof.data ?? null) as unknown as ProfileRow | null;

      const [d, pay, c, todoRes, ideasR] = await Promise.all([
        supabase.from("deals").select("*"),
        supabase.from("payments").select("*, deal:deals(id, brand)"),
        supabase.from("content").select("*"),
        supabase.from("todos").select("*"),
        supabase.from("ideas").select("id").neq("status", "archived"),
      ]);
      const deals = (d.data ?? []) as unknown as DealRow[];
      const payments = (pay.data ?? []) as unknown as PaymentRow[];
      const content = (c.data ?? []) as unknown as ContentRow[];
      const todoRows = (todoRes.data ?? []) as unknown as TodoRow[];

      const today = TalbyDates.today();
      const late = payments.filter((x) => x.status !== "received" && x.pay_status !== "paid" && x.expected_date && x.expected_date < today).length;
      const openTodos = todoRows.filter((t) => !t.done);
      const ideas = ideasR.data ?? [];
      const dealsThisYear = deals.filter((x) => (x.created_at ?? "").slice(0, 4) === today.slice(0, 4)).length;

      setData(toOverviewData({ deals, payments, content, todos: todoRows, today }));
      setAccount(toAccountData({
        profile: profile as ProfileRow, today,
        counts: { deals: deals.length, late, ideas: ideas.length, todos: openTodos.length },
        dealsThisYear, notifications: [],
      }));
      if (profile?.theme || profile?.mode || profile?.sidebar)
        setLook({ theme: profile.theme ?? "studio", mode: profile.mode ?? "light", sidebar: profile.sidebar ?? "expanded" });
      switch (profile?.plan_status) {
        case "trialing": setPlan("trial"); break;
        case "past_due": setPlan("pastdue"); break;
        case "canceled": setPlan("canceled"); break;
      }
      setView(deals.length === 0 ? "empty" : "sample");
    } catch (e) {
      console.error("overview load", e);
      setView("error");
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  /** Board saves: it updates optimistically, then we persist; reject -> Try again. */
  const onAction = async (type: string, payload: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      if (type === "look.update") {
        const t = payload as { theme?: string; mode?: string; sidebar?: string };
        await supabase.from("profiles").update({
          theme: t.theme ?? "studio", mode: t.mode ?? "light", sidebar: t.sidebar ?? "expanded",
        }).eq("id", user.id);
        return true;
      }
      if (type === "data.reload") { await load(); return true; }
      if (type === "payment.markPaid") {
        const { brand } = payload as { brand?: string };
        const { data: deals } = await supabase.from("deals").select("id").eq("brand", brand ?? "");
        const ids = ((deals as Array<{ id: string }> | null) ?? []).map((x) => x.id);
        if (ids.length) await supabase.from("payments").update({ status: "received", pay_status: "paid" }).in("deal_id", ids).neq("status", "received");
        return true;
      }
      if (type === "todo.setDone") { const { id, done } = payload as { id?: string | number; done?: boolean }; await supabase.from("todos").update({ done: done ?? true }).eq("id", String(id)); return true; }
      if (type === "todo.create") { const { text } = payload as { text?: string }; await supabase.from("todos").insert({ title: text ?? "" }); await load(); return true; }
      return false; // not wired yet -> Try again (never a silent save)
    } catch { return false; }
  };

  return <TalbyPage board="SOverview" props={{ view, plan, data, account, onAction }} look={look} />;
}
