"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconPlus, IconArrowRight, IconDelete, IconIdea, IconGrid, IconList } from "@/components/icons";
import { Button, Input, Select, Spinner, StatusPill } from "@/components/ui";

type Idea = { id: string; title: string; stage: string; status: string; platform: string | null; notes: string | null };

const STAGES = ["bucket", "developing", "ready", "executed"] as const;
const STAGE_LABEL: Record<string, string> = { bucket: "Bucket", developing: "Developing", ready: "Ready", executed: "Executed" };
const PLATFORMS = ["TikTok", "Instagram", "YouTube", "YouTube Shorts", "Twitch", "X", "Facebook", "LinkedIn", "Pinterest", "Snapchat", "Threads", "Blog", "Newsletter", "Podcast", "Other"];
const STAGE_TONE: Record<string, "neutral" | "accent" | "paid"> = { bucket: "neutral", developing: "accent", ready: "accent", executed: "paid" };

export default function IdeasPage() {
  const supabase = createClient();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [view, setView] = useState<"board" | "table">("board");
  const [quick, setQuick] = useState("");
  const [quickPlatform, setQuickPlatform] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
    setIdeas((data ?? []) as unknown as Idea[]);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const quickAdd = async () => {
    if (!quick.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("ideas").insert({ user_id: user.id, title: quick.trim(), stage: "bucket", status: "bucket", platform: quickPlatform || null });
    setQuick(""); setQuickPlatform("");
    load();
  };

  const setStage = async (id: string, stage: string) => {
    await supabase.from("ideas").update({ stage }).eq("id", id);
    load();
  };
  const advance = async (id: string, stage: string) => {
    const idx = STAGES.indexOf(stage as (typeof STAGES)[number]);
    setStage(id, STAGES[Math.min(idx + 1, STAGES.length - 1)]);
  };
  const setPlatform = async (id: string, platform: string) => {
    await supabase.from("ideas").update({ platform: platform || null }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("ideas").delete().eq("id", id);
    load();
  };

  // Reorder an idea up/down in the current view.
  const move = async (id: string, dir: "up" | "down") => {
    const order = ["bucket", "developing", "ready", "executed"];
    const sorted = [...ideas].sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage) || a.title.localeCompare(b.title));
    const idx = sorted.findIndex((i) => i.id === id);
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= sorted.length) return;
    const tmp = sorted[idx]; sorted[idx] = sorted[j]; sorted[j] = tmp;
    setIdeas(sorted);
  };

  if (loading) return <div className="skeleton h-48" />;

  const counts = STAGES.reduce((acc, s) => { acc[s] = ideas.filter((i) => i.stage === s).length; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ideas</h1>
          <p className="text-muted text-sm mt-1">Capture ideas fast, nurture the good ones.</p>
        </div>
        {/* View toggle: board (kanban) vs table */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-line2 bg-card">
          <button onClick={() => setView("board")} aria-label="Board view" className={cn("h-9 px-3 rounded-lg grid place-items-center cursor-pointer text-inksoft", view === "board" && "bg-card2 text-ink border border-line")}><IconGrid size={18} /></button>
          <button onClick={() => setView("table")} aria-label="Table view" className={cn("h-9 px-3 rounded-lg grid place-items-center cursor-pointer text-inksoft", view === "table" && "bg-card2 text-ink border border-line")}><IconList size={18} /></button>
        </div>
      </div>

      {/* Quick add */}
      <div className="flex gap-2">
        <Input value={quick} onChange={(e) => setQuick(e.target.value)} onKeyDown={(e) => e.key === "Enter" && quickAdd()} placeholder="Drop an idea in the bucket…" className="flex-1" />
        <Select value={quickPlatform} onChange={(e) => setQuickPlatform(e.target.value)} className="!w-[150px] shrink-0">
          <option value="">Platform</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Button onClick={quickAdd}><IconPlus size={16} /> Add</Button>
      </div>

      {view === "board" ? (
        <BoardBoard ideas={ideas} counts={counts} onAdvance={advance} onSetStage={setStage} onSetPlatform={setPlatform} onRemove={remove} />
      ) : (
        <TableView ideas={ideas} onMove={move} onAdvance={advance} onSetStage={setStage} onSetPlatform={setPlatform} onRemove={remove} onAddNew={() => { (document.querySelector("input[placeholder*='Drop an idea']") as HTMLInputElement | null)?.focus(); }} />
      )}
    </div>
  );
}

function BoardBoard({ ideas, counts, onAdvance, onSetStage, onSetPlatform, onRemove }: {
  ideas: Idea[]; counts: Record<string, number>;
  onAdvance: (id: string, stage: string) => void; onSetStage: (id: string, stage: string) => void;
  onSetPlatform: (id: string, p: string) => void; onRemove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAGES.map((s) => (
        <div key={s} className="card p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold">{STAGE_LABEL[s]}</span>
            <span className="text-xs text-muted">{counts[s]}</span>
          </div>
          {ideas.filter((i) => i.stage === s).length === 0 && <p className="text-xs text-muted px-1 py-4 text-center">Nothing here yet.</p>}
          {ideas.filter((i) => i.stage === s).map((i) => (
            <div key={i.id} className="border border-line rounded-lg p-3 bg-card">
              <div className="font-medium text-sm">{i.title}</div>
              {i.platform && <div className="text-[11px] text-muted mt-0.5">{i.platform}</div>}
              {i.notes && <div className="text-xs text-muted mt-1 truncate">{i.notes}</div>}
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => onAdvance(i.id, i.stage)}
                  disabled={i.stage === "executed"}
                  className="text-[11px] font-medium text-accent-strong hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-default"
                >
                  {i.stage === "executed" ? "Done" : "Advance"}
                </button>
                <button onClick={() => onRemove(i.id)} aria-label="Delete idea" className="p-1 text-muted hover:text-bad cursor-pointer"><IconDelete size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TableView({ ideas, onMove, onAdvance, onSetStage, onSetPlatform, onRemove, onAddNew }: {
  ideas: Idea[]; onMove: (id: string, dir: "up" | "down") => void;
  onAdvance: (id: string, stage: string) => void; onSetStage: (id: string, stage: string) => void;
  onSetPlatform: (id: string, p: string) => void; onRemove: (id: string) => void; onAddNew: () => void;
}) {
  const order = ["bucket", "developing", "ready", "executed"];
  const sorted = [...ideas].sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage) || a.title.localeCompare(b.title));
  if (sorted.length === 0) {
    return (
      <div className="card p-10 text-center flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl accent-soft grid place-items-center"><IconIdea size={20} /></div>
        <p className="text-muted text-sm">No ideas yet.</p>
        <Button variant="secondary" onClick={onAddNew}><IconPlus size={16} /> Add an idea</Button>
      </div>
    );
  }
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-line">
            <th className="px-4 py-2.5 font-semibold">Idea</th>
            <th className="px-4 py-2.5 font-semibold">Platform</th>
            <th className="px-4 py-2.5 font-semibold">Stage</th>
            <th className="px-4 py-2.5 font-semibold w-24">Reorder</th>
            <th className="px-4 py-2.5 w-24" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((i, idx) => (
            <tr key={i.id} className="border-b border-line last:border-0 hover:bg-card2">
              <td className="px-4 py-3 font-medium max-w-[240px] truncate">{i.title}</td>
              <td className="px-4 py-3">
                <Select value={i.platform ?? ""} onChange={(e) => onSetPlatform(i.id, e.target.value)} className="!w-[140px] text-xs h-8">
                  <option value="">Any</option>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </td>
              <td className="px-4 py-3">
                <select value={i.stage} onChange={(e) => onSetStage(i.id, e.target.value)} className="px-2 py-1 rounded-md border border-line2 bg-card text-xs font-medium cursor-pointer">
                  {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                </select>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => onMove(i.id, "up")} disabled={idx === 0} aria-label="Move up" className="px-1.5 py-0.5 rounded border border-line2 text-muted hover:text-ink cursor-pointer disabled:opacity-30">▲</button>
                  <button onClick={() => onMove(i.id, "down")} disabled={idx === sorted.length - 1} aria-label="Move down" className="px-1.5 py-0.5 rounded border border-line2 text-muted hover:text-ink cursor-pointer disabled:opacity-30">▼</button>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  {i.stage !== "executed" && (
                    <Button size="sm" variant="secondary" onClick={() => onAdvance(i.id, i.stage)}>Advance <IconArrowRight size={13} /></Button>
                  )}
                  <button onClick={() => onRemove(i.id)} aria-label="Delete idea" className="p-1.5 text-muted hover:text-bad cursor-pointer"><IconDelete size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}