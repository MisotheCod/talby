"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { IconPlus, IconClose, IconLink, IconPaperclip, IconCheck, IconUpload } from "@/components/icons";
import { Button, Input, Select } from "@/components/ui";

type IdeaStatus = "unsorted" | "pitch-ready" | "parked" | "archived";

type Idea = {
  id: string;
  title: string;
  notes: string | null;
  platform: string | null;
  tags: string[];
  status: IdeaStatus;
  linked_deal_id: string | null;
  refs: IdeaRef[];
  created_at: string | null;
  updated_at: string | null;
};

type Deal = { id: string; brand: string };

// A reference is either a pasted link (kind 'link' with a url) or an uploaded
// file (kind 'file' with a public url + name).
type IdeaRef = { kind: "link" | "file"; url: string; name?: string };

const FILTERS = ["All", "Unsorted", "Pitch-ready", "Parked"] as const;
type Filter = (typeof FILTERS)[number];

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "YouTube Shorts", "Twitch", "X", "Facebook", "LinkedIn", "Pinterest", "Snapchat", "Threads", "Blog", "Newsletter", "Podcast", "Other"] as const;

const STATUS_LABEL: Record<IdeaStatus, string> = {
  unsorted: "Unsorted",
  "pitch-ready": "Pitch-ready",
  parked: "Parked",
  archived: "Archived",
};

function relTime(iso: string | null): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function IdeasPage() {
  const supabase = createClient();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [undo, setUndo] = useState<Idea | null>(null);
  // Keep the input reachable while scrolling a long grid.
  const captureWrapRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const [i, d] = await Promise.all([
      supabase.from("ideas").select("*").order("created_at", { ascending: false }),
      supabase.from("deals").select("id, brand").order("brand", { ascending: true }).limit(200),
    ]);
    setIdeas((i.data ?? []).map(normalizeIdea) as Idea[]);
    setDeals((d.data ?? []) as Deal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // Scroll the capture field back into view if a long grid scrolled it away
  // and the user returns focus to it.
  const focusCapture = () => {
    captureWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const visible = useMemo(() => {
    let list = ideas.filter((i) => i.status !== "archived");
    if (filter !== "All") list = list.filter((i) => i.status === filter.toLowerCase());
    if (sort === "newest") list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    else if (sort === "oldest") list.sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
    else list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [ideas, filter, sort]);

  const openIdea = ideas.find((i) => i.id === openId) ?? null;

  const onSaved = (updated: Idea) => {
    setIdeas((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  };
  const onCreated = (idea: Idea) => {
    setIdeas((prev) => [idea, ...prev]);
  };

  const undoRestore = async () => {
    if (!undo) return;
    await supabase.from("ideas").update({ status: (undo.status === "archived" ? "unsorted" : undo.status) as IdeaStatus }).eq("id", undo.id);
    setIdeas((prev) => prev.map((x) => (x.id === undo.id ? { ...x, status: undo.status === "archived" ? "unsorted" : undo.status } : x)));
    setUndo(null);
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-16 w-full" /><div className="grid grid-cols-3 gap-4"><div className="skeleton h-40" /><div className="skeleton h-40" /><div className="skeleton h-40" /></div></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ideas</h1>
          <p className="text-muted text-sm mt-1">Capture ideas fast, nurture the good ones.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="!w-[130px] !h-9 text-xs">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A-Z</option>
          </Select>
        </div>
      </div>

      {/* Capture field (sticky-ish so it stays reachable on long grids) */}
      <div ref={captureWrapRef} className="scroll-mt-6">
        <CaptureField
          deals={deals}
          onCreated={onCreated}
          onFocus={focusCapture}
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("px-3.5 h-8 rounded-full text-xs font-medium transition cursor-pointer border", filter === f ? "seg-seg on bg-card text-ink border-line2 font-semibold shadow-sm" : "seg-seg bg-card2 text-inksoft border-line")}>
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyIdeas hasAny={ideas.length > 0} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} dealLabel={dealLabel(idea, deals)} onOpen={() => setOpenId(idea.id)} />
          ))}
        </div>
      )}

      {openIdea && (
        <IdeaModal
          idea={openIdea}
          deals={deals}
          onClose={() => setOpenId(null)}
          onSaved={onSaved}
          onArchived={(archived) => { setUndo(archived); setOpenId(null); }}
        />
      )}

      {undo && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-ink text-canvas rounded-xl px-4 py-3 shadow-pop">
          <span className="text-sm">{undo.title} archived</span>
          <button onClick={undoRestore} className="text-sm font-semibold text-accent-ink underline cursor-pointer">Undo</button>
          <button onClick={() => setUndo(null)} aria-label="Dismiss" className="cursor-pointer"><IconClose size={16} /></button>
        </div>
      )}
    </div>
  );
}

// Refs may have been stored as plain URL strings (legacy) or as {kind,url,name}.
function normalizeRefs(raw: unknown): IdeaRef[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r): IdeaRef => {
    if (typeof r === "string") return { kind: "link", url: r };
    const o = r as Record<string, unknown>;
    return {
      kind: o.kind === "file" ? "file" : "link",
      url: (o.url as string) ?? "",
      name: o.name ? (o.name as string) : undefined,
    };
  });
}

function normalizeIdea(raw: Record<string, unknown>): Idea {
  return {
    id: raw.id as string,
    title: (raw.title as string) ?? "",
    notes: (raw.notes as string) ?? null,
    platform: (raw.platform as string) ?? null,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    status: ((raw.status as IdeaStatus) ?? "unsorted"),
    linked_deal_id: (raw.linked_deal_id as string) ?? null,
    refs: normalizeRefs(raw.refs),
    created_at: (raw.created_at as string) ?? null,
    updated_at: (raw.updated_at as string) ?? null,
  };
}

function dealLabel(idea: Idea, deals: Deal[]): string | null {
  return idea.linked_deal_id ? (deals.find((d) => d.id === idea.linked_deal_id)?.brand ?? "Linked deal") : null;
}

/* ---------------- Capture field ---------------- */
function CaptureField({ deals, onCreated, onFocus }: {
  deals: Deal[];
  onCreated: (idea: Idea) => void;
  onFocus: () => void;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [refs, setRefs] = useState<IdeaRef[]>([]);
  const [refInput, setRefInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<IdeaStatus>("unsorted");
  const [linkedDealId, setLinkedDealId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle(""); setPlatform(""); setNotes(""); setRefs([]); setRefInput("");
    setTags([]); setTagInput(""); setStatus("unsorted"); setLinkedDealId(""); setError("");
    setAdvanced(false); setFocused(false);
  };

  const save = async () => {
    if (!title.trim()) { setError("Give your idea a title."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { data, error: err } = await supabase.from("ideas").insert({
      user_id: user.id, title: title.trim(), platform: platform || null,
      notes: notes.trim() || null, tags, refs,
      status: status === "archived" ? "unsorted" : status,
      linked_deal_id: linkedDealId || null,
    }).select().single();
    setSaving(false);
    if (err) { setError(err.message); return; }
    onCreated(normalizeIdea((data ?? {}) as Record<string, unknown>));
    reset();
    inputRef.current?.focus();
  };

  const addRef = () => {
    const v = refInput.trim();
    if (v && !refs.some((r) => r.kind === "link" && r.url === v)) setRefs((r) => [...r, { kind: "link", url: v }]);
    setRefInput("");
  };
  const uploadRef = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("idea-files").upload(path, file);
    setUploading(false);
    if (error) return;
    const { data: pub } = supabase.storage.from("idea-files").getPublicUrl(path);
    setRefs((r) => [...r, { kind: "file", url: pub.publicUrl, name: file.name }]);
  };
  const addTag = () => {
    const v = tagInput.trim().replace(/^#/, "");
    if (v && !tags.includes(v)) setTags((t) => [...t, v]);
    setTagInput("");
  };

  return (
    <div className="card p-4">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => { setTitle(e.target.value); setError(""); }}
        onFocus={() => { setFocused(true); onFocus(); }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !advanced) save(); }}
        placeholder="What&apos;s the idea?"
        className="w-full bg-transparent text-[15px] font-medium outline-none placeholder:text-inkfaint"
      />

      {focused && (
        <div className="mt-3 pt-3 border-t border-line">
          {!advanced ? (
            <div className="flex items-center gap-2 flex-wrap">
              {/* platform quick-chips */}
              {(["TikTok", "Instagram", "YouTube"] as const).map((p) => (
                <button key={p} onClick={() => { setPlatform(p); }} className={cn("px-3 h-8 rounded-full text-xs font-medium border cursor-pointer transition", platform === p ? "bg-card text-ink border-line2 font-semibold" : "bg-card2 text-inksoft border-line hover:text-ink")}>
                  {p}
                </button>
              ))}
              <span className="text-inkfaint text-xs mx-1">or</span>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="!w-[130px] !h-8 text-xs">
                <option value="">Other</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Other">Other…</option>
              </Select>
              <button onClick={() => setAdvanced(true)} className="ml-auto text-xs font-medium text-accent-ink hover:underline cursor-pointer">Advanced</button>
              <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: notes + references */}
              <div className="space-y-3">
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes… (Shift+Enter for a new line)" rows={3} />
                <div className="space-y-1.5">
                  {refs.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-inksoft">
                      <IconPaperclip size={13} className="shrink-0" />
                      {r.kind === "link" ? (
                        <a href={r.url} target="_blank" rel="noreferrer" className="truncate flex-1 text-accent-ink underline decoration-accent/30 hover:decoration-accent">{r.url}</a>
                      ) : (
                        <a href={r.url} target="_blank" rel="noreferrer" className="truncate flex-1 text-accent-ink underline decoration-accent/30 hover:decoration-accent">{r.name ?? r.url}</a>
                      )}
                      <button onClick={() => setRefs((x) => x.filter((_, j) => j !== i))} aria-label="Remove reference" className="text-inkfaint hover:text-ink cursor-pointer"><IconClose size={13} /></button>
                    </div>
                  ))}
                  <div className="flex gap-1.5">
                    <Input value={refInput} onChange={(e) => setRefInput(e.target.value)} placeholder="Paste a link" className="!h-8 text-xs" onKeyDown={(e) => { if (e.key === "Enter") addRef(); }} />
                    <button onClick={() => fileRef.current?.click()} aria-label="Upload reference" title="Upload a doc or image" className="h-8 w-8 grid place-items-center rounded-lg border border-line text-inksoft hover:text-ink hover:border-line2 cursor-pointer shrink-0"><IconUpload size={15} /></button>
                    {uploading && <span className="text-xs text-inkfaint self-center">Uploading…</span>}
                    <Button size="sm" variant="secondary" onClick={addRef}>Add</Button>
                  </div>
                  <input ref={fileRef} type="file" className="hidden" onChange={uploadRef} />
                </div>
              </div>
              {/* Right: status + links */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-inksoft w-16 shrink-0">Status</span>
                  <Select value={status} onChange={(e) => setStatus(e.target.value as IdeaStatus)} className="!h-8 text-xs">
                    <option value="unsorted">Unsorted</option>
                    <option value="pitch-ready">Pitch-ready</option>
                    <option value="parked">Parked</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-inksoft w-16 shrink-0">Tag</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {tags.map((t) => (
                      <span key={t} className="pill pill-accent text-[11px]">{t}</span>
                    ))}
                    <div className="flex gap-1">
                      <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="!h-7 !w-24 text-xs" onKeyDown={(e) => { if (e.key === "Enter") addTag(); }} />
                      <button onClick={addTag} aria-label="Add tag" className="h-7 w-7 grid place-items-center rounded-md border border-line text-inksoft hover:text-ink cursor-pointer"><IconPlus size={14} /></button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-inksoft w-16 shrink-0">Deal</span>
                  <Select value={linkedDealId} onChange={(e) => setLinkedDealId(e.target.value)} className="!h-8 text-xs">
                    <option value="">No linked deal</option>
                    {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
                  </Select>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-bad mt-2" role="alert">{error}</p>}
          {advanced && (
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-line">
              <button onClick={() => { setAdvanced(false); inputRef.current?.focus(); }} className="text-xs text-inkfaint hover:text-ink cursor-pointer">Collapse</button>
              <div className="flex gap-2 items-center">
                {advanced && (
                  <span className="text-xs text-inkfaint">Enter saves · Shift+Enter for a new line</span>
                )}
                <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn("w-full bg-card border border-line2 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y min-h-[70px] font-sans", props.className)}
    />
  );
}

/* ---------------- Card grid ---------------- */
function IdeaCard({ idea, dealLabel, onOpen }: {
  idea: Idea;
  dealLabel: string | null;
  onOpen: () => void;
}) {
  const showDot = idea.status === "pitch-ready" || !!idea.linked_deal_id;
  const meta = dealLabel ?? idea.platform ?? "Untagged";
  return (
    <button onClick={onOpen} className="card p-4 text-left hover:border-line2 transition-colors cursor-pointer">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug line-clamp-3">{idea.title}</h3>
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-inkfaint">
            {showDot && <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: idea.status === "pitch-ready" ? "var(--accent)" : "var(--ink-soft)" }} />}
            <span className="truncate">{meta}</span>
            <span>·</span>
            <span className="shrink-0">{relTime(idea.updated_at ?? idea.created_at)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function EmptyIdeas({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="card p-14 text-center flex flex-col items-center gap-3">
      <div className="h-10 w-10 rounded-xl accent-soft grid place-items-center"><IconLink size={20} /></div>
      <p className="text-muted text-sm">{hasAny ? "No ideas match this filter." : "No ideas yet. Capture your first one above."}</p>
    </div>
  );
}

/* ---------------- Detail modal ---------------- */
function IdeaModal({ idea, deals, onClose, onSaved, onArchived }: {
  idea: Idea;
  deals: Deal[];
  onClose: () => void;
  onSaved: (i: Idea) => void;
  onArchived: (archived: Idea) => void;
}) {
  const supabase = createClient();
  const [title, setTitle] = useState(idea.title);
  const [notes, setNotes] = useState(idea.notes ?? "");
  const [platform, setPlatform] = useState(idea.platform ?? "");
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [linkedDealId, setLinkedDealId] = useState(idea.linked_deal_id ?? "");
  const [refs, setRefs] = useState<IdeaRef[]>(idea.refs);
  const [refInput, setRefInput] = useState("");
  const modalFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>(idea.tags);
  const [tagInput, setTagInput] = useState("");
  const [turning, setTurning] = useState(false);

  // Commit on blur/close: persist whatever changed.
  const persist = useCallback(async () => {
    const patch: Record<string, unknown> = {
      title: title.trim() || "Untitled",
      notes: notes.trim() || null,
      platform: platform || null,
      status,
      tags,
      refs,
      linked_deal_id: linkedDealId || null,
    };
    const { data } = await supabase.from("ideas").update(patch).eq("id", idea.id).select().single();
    if (data) onSaved(normalizeIdea((data as Record<string, unknown>) as Record<string, unknown>));
  }, [supabase, idea.id, title, notes, platform, status, tags, refs, linkedDealId, onSaved]);

  const close = () => { persist(); onClose(); };

  // Escape closes (and commits).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  const addRef = () => {
    const v = refInput.trim();
    if (v && !refs.some((r) => r.kind === "link" && r.url === v)) setRefs((r) => [...r, { kind: "link", url: v }]);
    setRefInput("");
  };
  const uploadRef = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("idea-files").upload(path, file);
    setUploading(false);
    if (error) return;
    const { data: pub } = supabase.storage.from("idea-files").getPublicUrl(path);
    setRefs((r) => [...r, { kind: "file", url: pub.publicUrl, name: file.name }]);
    persist();
  };
  const addTag = () => {
    const v = tagInput.trim().replace(/^#/, "");
    if (v && !tags.includes(v)) setTags((t) => [...t, v]);
    setTagInput("");
  };

  const archive = async () => {
    await supabase.from("ideas").update({ status: "archived" }).eq("id", idea.id);
    onArchived({ ...idea, status: "archived" });
  };

  const turnIntoDeal = async () => {
    setTurning(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("deals").insert({
      user_id: user.id, brand: title.trim() || idea.title || "New deal",
      notes: notes.trim() || null, deliverable: null,
    }).select().single();
    setTurning(false);
    if (data) {
      window.location.href = "/app/deals?open=" + (data as { id: string }).id;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30" onClick={close} />
      <div className="relative w-full max-w-2xl bg-card border border-line2 rounded-2xl shadow-pop overflow-hidden flex flex-col max-h-[90vh]" role="dialog" aria-modal="true">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-line">
          <div className="flex-1 min-w-0">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={persist}
              placeholder="Untitled"
              className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-inkfaint"
            />
          </div>
          <button onClick={close} aria-label="Close" className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5 px-5 py-4">
          {/* Left: editable title(already up top), notes, references */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1">Notes</div>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={persist} placeholder="Add notes…" rows={5} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1.5">References</div>
              <div className="space-y-1.5">
                {refs.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-inksoft bg-card2 rounded-lg px-2.5 py-1.5">
                    <IconPaperclip size={13} className="shrink-0" />
                    {r.kind === "link" ? (
                      <a href={r.url} target="_blank" rel="noreferrer" className="truncate flex-1 text-accent-ink underline decoration-accent/30 hover:decoration-accent">{r.url}</a>
                    ) : (
                      <a href={r.url} target="_blank" rel="noreferrer" className="truncate flex-1 text-accent-ink underline decoration-accent/30 hover:decoration-accent">{r.name ?? r.url}</a>
                    )}
                    <button onClick={() => setRefs((x) => x.filter((_, j) => j !== i))} aria-label="Remove reference" className="text-inkfaint hover:text-ink cursor-pointer"><IconClose size={13} /></button>
                  </div>
                ))}
                <div className="flex gap-1.5">
                  <Input value={refInput} onChange={(e) => setRefInput(e.target.value)} placeholder="Add link reference" className="!h-8 text-xs" onKeyDown={(e) => { if (e.key === "Enter") addRef(); }} onBlur={persist} />
                  <button onClick={() => modalFileRef.current?.click()} aria-label="Upload reference" title="Upload a doc or image" className="h-8 w-8 grid place-items-center rounded-lg border border-line text-inksoft hover:text-ink hover:border-line2 cursor-pointer shrink-0"><IconUpload size={15} /></button>
                  {uploading && <span className="text-xs text-inkfaint self-center">Uploading…</span>}
                  <Button size="sm" variant="secondary" onClick={addRef}>Add</Button>
                </div>
                <input ref={modalFileRef} type="file" className="hidden" onChange={uploadRef} />
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1.5">Platform</div>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)} onBlur={persist} className="!h-8 text-xs">
                <option value="">None</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1.5">Status</div>
              <Select value={status} onChange={(e) => setStatus(e.target.value as IdeaStatus)} onBlur={persist} className="!h-8 text-xs">
                <option value="unsorted">Unsorted</option>
                <option value="pitch-ready">Pitch-ready</option>
                <option value="parked">Parked</option>
              </Select>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1.5">Linked deal</div>
              <Select value={linkedDealId} onChange={(e) => setLinkedDealId(e.target.value)} onBlur={persist} className="!h-8 text-xs">
                <option value="">None</option>
                {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
              </Select>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint mb-1.5">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="pill pill-accent text-[11px] inline-flex items-center gap-1">{t} <button onClick={() => setTags((x) => x.filter((y) => y !== t))} aria-label={`Remove ${t}`} className="cursor-pointer opacity-70 hover:opacity-100"><IconClose size={11} /></button></span>
                ))}
                <div className="flex gap-1">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="!h-7 !w-24 text-xs" onKeyDown={(e) => { if (e.key === "Enter") addTag(); }} onBlur={persist} />
                  <button onClick={addTag} aria-label="Add tag" className="h-7 w-7 grid place-items-center rounded-md border border-line text-inksoft hover:text-ink cursor-pointer"><IconPlus size={14} /></button>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-inkfaint">
              <div>Created {relTime(idea.created_at)}</div>
              <div className="mt-0.5">Edited {relTime(idea.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-line">
          <button onClick={archive} className="text-sm text-inkfaint hover:text-ink cursor-pointer">Archive</button>
          <Button onClick={turnIntoDeal} disabled={turning}>{turning ? "Creating…" : <><IconCheck size={16} /> Turn into deal</>}</Button>
        </div>
      </div>
    </div>
  );
}