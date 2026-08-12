"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconPlus, IconDelete, IconIdea, IconGrid, IconList, IconClose } from "@/components/icons";
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
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
    setIdeas((data ?? []) as unknown as Idea[]);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const setStage = async (id: string, stage: string) => {
    await supabase.from("ideas").update({ stage }).eq("id", id);
    load();
  };
  const setPlatform = async (id: string, platform: string) => {
    await supabase.from("ideas").update({ platform: platform || null }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("ideas").delete().eq("id", id);
    load();
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
        <div className="flex items-center gap-2">
          {/* View toggle: board (kanban) vs table */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-line2 bg-card">
            <button onClick={() => setView("board")} aria-label="Board view" className={cn("h-9 px-3 rounded-lg grid place-items-center cursor-pointer text-inksoft", view === "board" && "bg-card2 text-ink border border-line")}><IconGrid size={18} /></button>
            <button onClick={() => setView("table")} aria-label="Table view" className={cn("h-9 px-3 rounded-lg grid place-items-center cursor-pointer text-inksoft", view === "table" && "bg-card2 text-ink border border-line")}><IconList size={18} /></button>
          </div>
          <Button onClick={() => setShowNew(true)}><IconPlus size={16} /> New idea</Button>
        </div>
      </div>

      {view === "board" ? (
        <BoardBoard ideas={ideas} counts={counts} onSetStage={setStage} onSetPlatform={setPlatform} onRemove={remove} />
      ) : (
        <TableView ideas={ideas} onSetStage={setStage} onSetPlatform={setPlatform} onRemove={remove} onAddNew={() => setShowNew(true)} />
      )}

      {showNew && <NewIdeaModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />}
    </div>
  );
}

/* ---------------- Board (kanban) with drag & drop ---------------- */
function BoardBoard({ ideas, counts, onSetStage, onSetPlatform, onRemove }: {
  ideas: Idea[]; counts: Record<string, number>;
  onSetStage: (id: string, stage: string) => void;
  onSetPlatform: (id: string, p: string) => void; onRemove: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const onDrop = (stage: string) => {
    if (dragId) onSetStage(dragId, stage);
    setDragId(null); setOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAGES.map((s) => (
        <div
          key={s}
          onDragOver={(e) => { e.preventDefault(); setOverCol(s); }}
          onDragLeave={() => setOverCol((c) => (c === s ? null : c))}
          onDrop={() => onDrop(s)}
          className={cn("card p-3 flex flex-col gap-2 min-h-[120px] transition-colors", overCol === s && "ring-2 ring-[var(--accent)]/40 bg-card2")}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold">{STAGE_LABEL[s]}</span>
            <span className="text-xs text-muted">{counts[s]}</span>
          </div>
          {ideas.filter((i) => i.stage === s).length === 0 && <p className="text-xs text-muted px-1 py-4 text-center">Drop an idea here.</p>}
          {ideas.filter((i) => i.stage === s).map((i) => (
            <div
              key={i.id}
              draggable
              onDragStart={() => setDragId(i.id)}
              onDragEnd={() => { setDragId(null); setOverCol(null); }}
              className={cn("border border-line rounded-lg p-3 bg-card cursor-grab active:cursor-grabbing", dragId === i.id && "opacity-40")}
            >
              <div className="font-medium text-sm">{i.title}</div>
              {i.platform && <div className="text-[11px] text-muted mt-0.5">{i.platform}</div>}
              {i.notes && <div className="text-xs text-muted mt-1 truncate">{i.notes}</div>}
              <div className="flex items-center justify-end mt-2">
                <button onClick={() => onRemove(i.id)} aria-label="Delete idea" className="p-1 text-muted hover:text-bad cursor-pointer"><IconDelete size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Table view ---------------- */
function TableView({ ideas, onSetStage, onSetPlatform, onRemove, onAddNew }: {
  ideas: Idea[]; onSetStage: (id: string, stage: string) => void;
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
            <th className="px-4 py-2.5 w-24" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((i) => (
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
                <div className="flex justify-end">
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

/* ---------------- New Idea Modal ---------------- */
function NewIdeaModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState("bucket");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const save = async () => {
    if (!title.trim()) { setError("Give your idea a title."); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error: err } = await supabase.from("ideas").insert({
      user_id: user.id, title: title.trim(), stage, status: stage, platform: platform || null, notes: notes.trim() || null,
    });
    if (err) setError(err.message);
    else onCreated();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-line2 rounded-2xl shadow-pop p-5 fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New idea</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs text-muted mb-1 block">Title *</span>
            <Input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="e.g. Summer GRWM campaign" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-muted mb-1 block">Platform</span>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="">Any</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </label>
            <label className="block">
              <span className="text-xs text-muted mb-1 block">Stage</span>
              <Select value={stage} onChange={(e) => setStage(e.target.value)}>
                {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
              </Select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted mb-1 block">Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything worth remembering…" rows={3} className="w-full rounded-xl border border-line2 bg-card px-3 py-2 text-sm outline-none focus:border-[var(--accent)] resize-none" />
          </label>
          {error && <p className="text-sm text-bad">{error}</p>}
          <Button onClick={save} disabled={saving} className="w-full">{saving ? <Spinner /> : <><IconPlus size={16} /> Add idea</>}</Button>
        </div>
      </div>
    </div>
  );
}