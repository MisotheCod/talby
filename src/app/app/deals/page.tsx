"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDate, cn, isPastDue } from "@/lib/utils";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/config";
import { IconPlus, IconClose, IconCheck, IconLink, IconDelete, IconPaperclip, IconInfo } from "@/components/icons";
import { Button, Chip, Input, Textarea, Select, StatusPill, Spinner } from "@/components/ui";
import { UpgradeModal } from "@/components/upgrade-modal";

type Deal = {
  id: string; brand: string; status: string; deliverable: string | null;
  value: number | null; due_date: string | null; notes: string | null;
  links: { url: string; label?: string }[]; active: boolean;
};
type Payment = { id: string; deal_id: string | null; amount: number; expected_date: string | null; status: string; notes: string | null };
type ChecklistItem = { id: string; deal_id: string; title: string; done: boolean };
type DealFile = { id: string; deal_id: string; name: string; path: string; size_bytes: number | null; mime: string | null };

const FILTERS = ["Active", "Pipeline", "Unpaid", "Paid", "All"] as const;

export default function DealsPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Active");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDeals = useCallback(async () => {
    const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
    setDeals((data ?? []) as unknown as Deal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadDeals(); }, [loadDeals, supabase]);

  // Open drawer or new-deal modal via URL params (?open=id, ?new=1)
  useEffect(() => {
    if (searchParams.get("new") === "1") setShowNew(true);
    if (searchParams.get("open")) setSelectedId(searchParams.get("open"));
  }, [searchParams]);

  // Load plan
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
    })();
  }, [supabase]);

  const activeCount = deals.filter((d) => d.active && d.status !== "archived").length;

  const filtered = deals.filter((d) => {
    switch (filter) {
      case "Active": return d.active && d.status !== "archived";
      case "Pipeline": return d.status === "pipeline" || d.status === "active";
      case "Unpaid": return d.status === "unpaid";
      case "Paid": return d.status === "paid";
      default: return true;
    }
  });

  const selected = deals.find((d) => d.id === selectedId) ?? null;

  const onCreated = () => { setShowNew(false); loadDeals(); };
  const onUpdated = () => loadDeals();

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-56" /><div className="skeleton h-20" /><div className="skeleton h-20" /><div className="skeleton h-20" /></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Deals</h1>
          <p className="text-sm text-inksoft mt-1">
            {plan === "free"
              ? `${activeCount} of ${FREE_ACTIVE_DEAL_CAP} active deals`
              : `${activeCount} active deals`}
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}><IconPlus size={16} /> New deal</Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-10 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-inksoft">No deals in this view yet.</p>
          <Button variant="secondary" onClick={() => setShowNew(true)}><IconPlus size={16} /> Add a deal</Button>
        </div>
      ) : (
        <div className="panel">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={cn("w-full flex items-center gap-3.5 px-[22px] py-[15px] border-t border-line text-left hover:bg-card2 transition-colors cursor-pointer", selectedId === d.id && "bg-card2")}
            >
              <span className="h-10 w-10 rounded-xl flex-none flex items-center justify-center font-bold text-[15px] bg-card2 text-inksoft border border-line">
                {d.brand.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-semibold truncate">{d.brand}</span>
                <span className="block text-[12.5px] text-inkfaint mt-0.5 truncate">{d.deliverable || "No deliverable"}</span>
              </span>
              <span className="text-right flex-none">
                <span className="block money text-sm font-medium mb-1.5">{formatMoney(d.value)}</span>
                <DealStatusBadge status={d.status} active={d.active} due={d.due_date} />
              </span>
            </button>
          ))}
        </div>
      )}

      {showNew && (
        <NewDealModal
          plan={plan}
          activeCount={activeCount}
          onClose={() => setShowNew(false)}
          onCreated={onCreated}
          onUpgrade={() => { setShowNew(false); setShowUpgrade(true); }}
        />
      )}

      {selected && (
        <DealDrawer
          deal={selected}
          onClose={() => setSelectedId(null)}
          onUpdated={onUpdated}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

function DealStatusBadge({ status, active, due }: { status: string; active: boolean; due: string | null }) {
  const map: Record<string, { label: string; kind: "neutral" | "paid" | "due" | "late" | "pipeline" | "accent" }> = {
    active: { label: active ? "Active" : "Archived", kind: "accent" },
    pipeline: { label: "Pipeline", kind: "pipeline" },
    unpaid: { label: isPastDue(due) ? "Past due" : "Awaiting pay", kind: isPastDue(due) ? "late" : "due" },
    paid: { label: "Paid", kind: "paid" },
    archived: { label: "Archived", kind: "neutral" },
  };
  const m = map[status] ?? { label: status, kind: "neutral" as const };
  return <StatusPill kind={m.kind}>{m.label}</StatusPill>;
}

/* ---------------- New Deal Modal ---------------- */
function NewDealModal({ plan, activeCount, onClose, onCreated, onUpgrade }: { plan: "free" | "paid"; activeCount: number; onClose: () => void; onCreated: () => void; onUpgrade: () => void }) {
  const supabase = createClient();
  const [brand, setBrand] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("active");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const atCap = plan === "free" && activeCount >= FREE_ACTIVE_DEAL_CAP;

  const submit = async () => {
    if (!brand.trim()) { setError("Enter a brand name."); return; }
    if (atCap) { onUpgrade(); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error } = await supabase.from("deals").insert({
      user_id: user.id, brand: brand.trim(), deliverable: deliverable.trim() || null,
      value: value ? Number(value) : null, status, due_date: dueDate || null,
      notes: notes.trim() || null, active: status !== "archived",
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    onCreated();
  };

  return (
    <Modal onClose={onClose} title="New deal">
      {atCap && (
        <div className="rounded-xl bg-accenttint p-4 text-sm mb-4 flex items-start gap-3">
          <IconInfo size={18} className="shrink-0 mt-0.5 accent-ink" />
          <div>
            <div className="font-semibold accent-ink">You&apos;ve reached the free-plan limit</div>
            <p className="text-inksoft mt-0.5">You have {activeCount} active deals — the free plan holds {FREE_ACTIVE_DEAL_CAP}. Go unlimited to keep adding.</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Field label="Brand *"><Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Glossier" autoFocus /></Field>
        <Field label="Deliverable"><Input value={deliverable} onChange={(e) => setDeliverable(e.target.value)} placeholder="e.g. 2 IG posts + 1 story" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Value ($)"><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1500" /></Field>
          <Field label="Due date"><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
        </div>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option><option value="pipeline">Pipeline</option>
            <option value="unpaid">Unpaid</option><option value="paid">Paid</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
        <Field label="Notes"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any details…" /></Field>
        {error && <p className="text-sm text-late" role="alert">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Spinner /> : null}{atCap ? "Upgrade to add" : "Add deal"}</Button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-lg p-6 rounded-2xl border border-line2 shadow-pop fade-up" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Deal Detail Drawer ---------------- */
function DealDrawer({ deal, onClose, onUpdated }: { deal: Deal; onClose: () => void; onUpdated: () => void }) {
  const supabase = createClient();
  const [tab, setTab] = useState<"Fields" | "Checklist" | "Notes" | "Files" | "Payments">("Fields");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<DealFile[]>([]);
  const [plan, setPlan] = useState<"free" | "paid">("free");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const p = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan(((p.data as unknown as { plan: string } | null)?.plan ?? "free") as "free" | "paid");
      }
      const [pay, cl, fl] = await Promise.all([
        supabase.from("payments").select("*").eq("deal_id", deal.id),
        supabase.from("deal_checklist").select("*").eq("deal_id", deal.id),
        supabase.from("deal_files").select("*").eq("deal_id", deal.id),
      ]);
      setPayments((pay.data ?? []) as unknown as Payment[]);
      setChecklist((cl.data ?? []) as unknown as ChecklistItem[]);
      setFiles((fl.data ?? []) as unknown as DealFile[]);
    })();
  }, [supabase, deal.id]);

  const TABS = ["Fields", "Checklist", "Notes", "Files", "Payments"] as const;

  return (
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-line shadow-pop drawer-in flex flex-col" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="px-6 py-5 border-b border-line">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-xl flex items-center justify-center font-bold text-[16px] bg-card2 text-inksoft border border-line">{deal.brand.charAt(0).toUpperCase()}</span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{deal.brand}</h2>
                <p className="text-sm text-inksoft mt-0.5">{deal.deliverable || "No deliverable"}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close drawer" className="p-1.5 rounded-lg hover:bg-card2 cursor-pointer"><IconClose size={18} /></button>
          </div>
          <div className="mt-3"><DealStatusBadge status={deal.status} active={deal.active} due={deal.due_date} /></div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-line px-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px", tab === t ? "text-accentink border-[var(--accent)] font-semibold" : "text-inksoft hover:text-ink border-transparent")}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "Fields" && <FieldsTab deal={deal} onSaved={onUpdated} />}
          {tab === "Checklist" && <ChecklistTab dealId={deal.id} items={checklist} setItems={setChecklist} />}
          {tab === "Notes" && <NotesTab dealId={deal.id} deal={deal} onSaved={onUpdated} />}
          {tab === "Files" && <FilesTab dealId={deal.id} files={files} setFiles={setFiles} plan={plan} />}
          {tab === "Payments" && <DrawerPaymentsTab dealId={deal.id} payments={payments} setPayments={setPayments} onChanged={onUpdated} />}
        </div>
      </div>
    </div>
  );
}

function FieldsTab({ deal, onSaved }: { deal: Deal; onSaved: () => void }) {
  const supabase = createClient();
  const [value, setValue] = useState(deal.value?.toString() ?? "");
  const [status, setStatus] = useState(deal.status);
  const [dueDate, setDueDate] = useState(deal.due_date ?? "");
  const [deliverable, setDeliverable] = useState(deal.deliverable ?? "");
  const [links, setLinks] = useState<{ url: string; label?: string }[]>(deal.links as { url: string; label?: string }[] ?? []);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await supabase.from("deals").update({
      value: value ? Number(value) : null,
      status, due_date: dueDate || null,
      deliverable: deliverable || null,
      links: links.filter((l) => l.url).map((l) => ({ url: l.url, label: l.label || l.url })),
      active: status !== "archived",
    }).eq("id", deal.id);
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-4">
      <Field label="Deliverable"><Input value={deliverable} onChange={(e) => setDeliverable(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Value ($)"><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option><option value="pipeline">Pipeline</option>
            <option value="unpaid">Unpaid</option><option value="paid">Paid</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
      </div>
      <Field label="Due date"><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
      <Field label="Links">
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <Input value={l.url} onChange={(e) => { const n = [...links]; n[i] = { ...n[i], url: e.target.value }; setLinks(n); }} placeholder="https://…" />
              <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="px-2 text-inksoft hover:text-late cursor-pointer"><IconDelete size={16} /></button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => setLinks([...links, { url: "", label: "" }])}><IconLink size={14} /> Add link</Button>
        </div>
      </Field>
      <div className="flex justify-end"><Button onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save changes"}</Button></div>
    </div>
  );
}

function ChecklistTab({ dealId, items, setItems }: { dealId: string; items: ChecklistItem[]; setItems: (i: ChecklistItem[]) => void }) {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const add = async () => {
    if (!title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("deal_checklist").insert({ user_id: user.id, deal_id: dealId, title: title.trim() }).select().single();
    if (data) { setItems([data as unknown as ChecklistItem, ...items]); setTitle(""); }
  };
  const toggle = async (id: string, done: boolean) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done } : i)));
    await supabase.from("deal_checklist").update({ done }).eq("id", id);
  };
  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("deal_checklist").delete().eq("id", id);
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a checklist item…" />
        <Button onClick={add}><IconPlus size={16} /></Button>
      </div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 py-1.5">
            <button onClick={() => toggle(i.id, !i.done)} aria-label="Toggle" className={cn("h-5 w-5 rounded-md border grid place-items-center shrink-0 cursor-pointer", i.done ? "bg-accent border-[var(--accent)]" : "border-line2 hover:border-[var(--accent)]")}>
              {i.done && <IconCheck size={12} className="text-onaccent" />}
            </button>
            <span className={cn("text-sm flex-1", i.done && "line-through text-inksoft")}>{i.title}</span>
            <button onClick={() => remove(i.id)} aria-label="Delete" className="text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-sm text-inksoft py-2">No checklist items yet.</p>}
    </div>
  );
}

function NotesTab({ dealId, deal, onSaved }: { dealId: string; deal: Deal; onSaved: () => void }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(deal.notes ?? "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await supabase.from("deals").update({ notes }).eq("id", dealId);
    setSaving(false);
    onSaved();
  };
  return (
    <div className="space-y-3">
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this deal…" className="min-h-[160px]" />
      <div className="flex justify-end"><Button onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save notes"}</Button></div>
    </div>
  );
}

function FilesTab({ dealId, files, setFiles, plan }: { dealId: string; files: DealFile[]; setFiles: (f: DealFile[]) => void; plan: "free" | "paid" }) {
  const supabase = createClient();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (plan !== "paid") { setShowUpgrade(true); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const path = `${user.id}/${dealId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("deal-files").upload(path, file);
    if (error) return;
    await supabase.from("deal_files").insert({ user_id: user.id, deal_id: dealId, name: file.name, path, size_bytes: file.size, mime: file.type });
    const { data } = await supabase.from("deal_files").select("*").eq("deal_id", dealId);
    setFiles((data ?? []) as unknown as DealFile[]);
  };
  return (
    <div className="space-y-3">
      <label className="cursor-pointer">
        <span className="flex items-center justify-center gap-2 border-2 border-dashed border-line2 rounded-xl p-6 text-sm text-inksoft hover:border-[var(--accent)] hover:text-ink transition">
          <IconPaperclip size={16} /> {plan === "paid" ? "Upload a file" : "Files are on the paid plan"}
        </span>
        <input type="file" className="hidden" onChange={onUpload} disabled={plan !== "paid"} />
      </label>
      <ul className="space-y-1">
        {files.map((f) => (
          <li key={f.id} className="flex items-center gap-3 py-2 text-sm">
            <IconPaperclip size={16} className="text-inksoft" />
            <span className="flex-1 truncate">{f.name}</span>
            {f.size_bytes != null && <span className="text-xs text-inkfaint">{Math.round(f.size_bytes / 1024)} KB</span>}
            <button onClick={() => supabase.storage.from("deal-files").remove([f.path]).then(() => supabase.from("deal_files").delete().eq("id", f.id).then(() => setFiles(files.filter((x) => x.id !== f.id))))} aria-label="Delete" className="text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
          </li>
        ))}
      </ul>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

function DrawerPaymentsTab({ dealId, payments, setPayments, onChanged }: { dealId: string; payments: Payment[]; setPayments: (p: Payment[]) => void; onChanged: () => void }) {
  const supabase = createClient();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const add = async () => {
    if (!amount) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("payments").insert({ user_id: user.id, deal_id: dealId, amount: Number(amount), expected_date: date || null }).select().single();
    if (data) { setPayments([data as unknown as Payment, ...payments]); setAmount(""); setDate(""); onChanged(); }
  };
  const markReceived = async (id: string) => {
    await supabase.from("payments").update({ status: "received" }).eq("id", id);
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "received" } : p)));
    onChanged();
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <Button onClick={add} className="w-full"><IconPlus size={16} /> Add payment</Button>
      <ul className="space-y-2">
        {payments.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-2 border-b border-line last:border-0">
            <div>
              <div className="font-semibold money tabular-nums">{formatMoney(p.amount)}</div>
              <div className={cn("text-xs", p.status === "received" ? "text-paid" : isPastDue(p.expected_date) ? "text-late" : "text-inksoft")}>
                {p.status === "received" ? "Received" : isPastDue(p.expected_date) ? "Past due" : formatDate(p.expected_date)}
              </div>
            </div>
            {p.status !== "received" && (
              <Button size="sm" variant="secondary" onClick={() => markReceived(p.id)}><IconCheck size={14} /> Mark received</Button>
            )}
          </li>
        ))}
      </ul>
      {payments.length === 0 && <p className="text-sm text-inksoft py-2">No payments on this deal yet.</p>}
    </div>
  );
}
