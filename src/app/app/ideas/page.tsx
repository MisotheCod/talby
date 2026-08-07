"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconPlus, IconArrowRight, IconDelete, IconIdea } from "@/components/icons";
import { Button, Input, Spinner, Badge } from "@/components/ui";

type Idea = { id: string; title: string; stage: string; notes: string | null };

const STAGES = [
  { id: "bucket", label: "Bucket" },
  { id: "developing", label: "Developing" },
  { id: "ready", label: "Ready" },
  { id: "executed", label: "Executed" },
] as const;

const STAGE_TONE: Record<string, "neutral" | "accent" | "info" | "ok"> = {
  bucket: "neutral",
  developing: "accent",
  ready: "info",
  executed: "ok",
};

export default function IdeasPage() {
  const supabase = createClient();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeStage, setActiveStage] = useState<string>("bucket");
  const [quick, setQuick] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
    setIdeas((data ?? []) as unknown as Idea[]);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const counts = STAGES.reduce((acc, s) => { acc[s.id] = ideas.filter((i) => i.stage === s.id).length; return acc; }, {} as Record<string, number>);

  const quickAdd = async () => {
    if (!quick.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("ideas").insert({ user_id: user.id, title: quick.trim(), stage: "bucket" });
    setQuick("");
    load();
  };

  const advance = async (id: string, stage: string) => {
    const idx = STAGES.findIndex((s) => s.id === stage);
    const next = STAGES[Math.min(idx + 1, STAGES.length - 1)].id;
    await supabase.from("ideas").update({ stage: next }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("ideas").delete().eq("id", id);
    load();
  };

  const visible = ideas.filter((i) => i.stage === activeStage);

  if (loading) return <div className="skeleton h-48" />;

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-semibold">Ideas</h1>
        <p className="text-muted text-sm mt-1">Capture ideas fast, nurture the good ones.</p>
      </div>

      {/* Quick add */}
      <div className="flex gap-2">
        <Input value={quick} onChange={(e) => setQuick(e.target.value)} onKeyDown={(e) => e.key === "Enter" && quickAdd()} placeholder="Drop an idea in the bucket…" />
        <Button onClick={quickAdd}><IconPlus size={16} /> Add</Button>
      </div>

      {/* Stage filter with counts */}
      <div className="flex gap-2 flex-wrap">
        {STAGES.map((s) => (
          <button key={s.id} onClick={() => setActiveStage(s.id)} className={cn("px-3.5 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer border flex items-center gap-2", activeStage === s.id ? "accent-soft border-accent/30 font-semibold" : "border-border bg-surface text-muted hover:text-foreground")}>
            {s.label}
            <span className={activeStage === s.id ? "text-accent-strong" : "text-muted"}>({counts[s.id]})</span>
          </button>
        ))}
      </div>

      {/* Idea list */}
      {visible.length === 0 ? (
        <div className="card p-10 text-center flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl accent-soft grid place-items-center"><IconIdea size={20} /></div>
          <p className="text-muted text-sm">No ideas in {STAGES.find((s) => s.id === activeStage)?.label.toLowerCase()} yet.</p>
          {activeStage === "bucket" && <Button variant="secondary" onClick={() => document.querySelector("input")?.focus()}><IconPlus size={16} /> Add an idea</Button>}
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((i) => (
            <li key={i.id} className="card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">{i.title}</div>
                {i.notes && <div className="text-sm text-muted truncate mt-0.5">{i.notes}</div>}
                <div className="mt-1.5"><Badge tone={STAGE_TONE[i.stage]}>{STAGES.find((s) => s.id === i.stage)?.label}</Badge></div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {i.stage !== "executed" ? (
                  <Button size="sm" variant="secondary" onClick={() => advance(i.id, i.stage)}>
                    Advance <IconArrowRight size={14} />
                  </Button>
                ) : (
                  <span className="text-xs text-ok font-medium">Done</span>
                )}
                <button onClick={() => remove(i.id)} aria-label="Delete idea" className="p-2 text-muted hover:text-bad cursor-pointer"><IconDelete size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
