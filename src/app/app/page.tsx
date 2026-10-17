"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TalbyPage from "@/components/talby-app/TalbyPage";
import { toOverviewData, toAccountData } from "@/lib/talby/to-board";
import { makeOnAction } from "@/lib/talby/actions";
import { TalbyDates } from "@/components/talby/_data";
import { showWelcome, deriveIdentity } from "@/lib/talby/account-gate";
import type { OverviewData, AccountData, WelcomeData } from "@/components/talby/_data";
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
  const [welcome, setWelcome] = useState<WelcomeData | null>(null);
  const [firstVisit, setFirstVisit] = useState(false);

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
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const identity = deriveIdentity({
        handler: profile?.handler ?? null,
        fullName: (meta.full_name as string) ?? (meta.name as string) ?? null,
        email: user.email ?? null,
      });
      setAccount(toAccountData({
        profile: { ...(profile ?? {}), handler: identity.handle } as ProfileRow, today,
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
      const pr = profile as unknown as Record<string, unknown> | null;
      setWelcome({ done: {
        profile: !!profile?.handler,
        deal: deals.length > 0,
        import: deals.length > 1,
        payby: payments.some((x) => !!x.expected_date),
        ask: !!pr?.assistant_used,
        remind: !!pr?.digest_enabled,
      } });
      setFirstVisit(showWelcome({ deals: deals.length, tourSeen: (pr?.tour_seen as boolean) ?? null }));
      setView(deals.length === 0 ? "empty" : "sample");
    } catch (e) {
      console.error("overview load", e);
      setView("error");
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  /** Board saves via the shared dispatcher (deal.create, idea, todo, mark-paid, theme, …). */
  const onAction = makeOnAction(supabase, load);

  return <TalbyPage key={account ? "ready" : "loading"} board={firstVisit ? "SWelcome" : "SOverview"} props={{ view, plan, data: (firstVisit ? welcome : data) as never, account, onAction }} look={look} />;
}
