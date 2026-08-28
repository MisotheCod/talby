"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button, Pill } from "@/components/ui";
import { IconClose, IconCheck, IconMail } from "@/components/icons";

type Lead = {
  id: string; subject: string | null; sender_email: string | null;
  brand_name: string | null; deal_type: string | null; summary: string | null;
  confidence: number | null; status: string; contact_name: string | null; contact_email: string | null;
  linked_deal_id: string | null;
};

type Filter = "New" | "Added" | "Not interested";

function confidenceLabel(c: number | null): { text: string; source: string } {
  if (c == null) return { text: "low", source: "var(--due)" };
  if (c >= 0.7) return { text: `${Math.round(c * 100)}%`, source: "var(--paid)" };
  if (c >= 0.5) return { text: `${Math.round(c * 100)}%`, source: "var(--due)" };
  return { text: `${Math.round(c * 100)}%`, source: "var(--late)" };
}

export default function InboxPage() {
  const supabase = createClient();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("New");
  const [message, setMessage] = useState<{ kind: "ok" | "warn" | "bad"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("inbox_leads").select("*").order("created_at", { ascending: false });
      setLeads((data ?? []) as unknown as Lead[]);
      setLoading(false);
    })();
  }, [supabase]);

  const act = async (id: string, action: "add" | "not_interested") => {
    try {
      const res = await fetch(`/api/inbox/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.status >= 400) {
        setMessage({ kind: "bad", text: data.error || "Something went wrong. Try again." });
      } else if (data.duplicated) {
        setMessage({ kind: "ok", text: "A deal for this brand already exists. The email was attached to it as a note." });
        setFilter("Added");
      } else if (action === "add" && data.dealId) {
        setMessage({ kind: "ok", text: "Added to deals!" });
        setFilter("Added");
      }
    } catch {
      setMessage({ kind: "bad", text: "Could not reach the server. Try again." });
    }
    const { data } = await supabase.from("inbox_leads").select("*").order("created_at", { ascending: false });
    setLeads((data ?? []) as unknown as Lead[]);
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-56" /><div className="skeleton h-64" /></div>;

  const newLeads = leads.filter((l) => l.status === "new");
  const shown = leads.filter((l) =>
    filter === "New" ? l.status === "new" :
    filter === "Added" ? l.status === "added" :
    l.status === "not_interested"
  );

  return (
    <div className="space-y-5 fade-up">
      <div>
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-muted text-sm mt-1">Brand-deal outreach detected for you.</p>
      </div>

      {/* Gate: the Gmail scanner switched to a forward-any-email path that lands
          on a future build. Existing detected leads still show below. */}
      <div className="card p-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-10 w-10 rounded-xl accent-soft accent-ink grid place-items-center shrink-0"><IconMail size={18} /></span>
          <div className="min-w-0">
            <div className="font-semibold">Brand-deal scanning is changing</div>
            <p className="text-sm text-muted mt-0.5">
              Talby is moving to a forward-any-email address that works with any inbox. Detected leads already here stay visible.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className={cn(
          "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
          message.kind === "ok" ? "bg-paid/10 border-paid/30 text-paid" : "bg-late/10 border-late/30 text-late"
        )}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} aria-label="Dismiss" className="shrink-0 text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer">Dismiss</button>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(["New", "Added", "Not interested"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn(
            "px-3.5 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer border",
            filter === f ? "accent-soft border-accent/30 font-semibold" : "border-border bg-surface text-muted hover:text-foreground"
          )}>
            {f}
            {f === "New" && newLeads.length > 0 && <span className="ml-1.5 text-xs font-bold">{newLeads.length}</span>}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-muted text-sm">
            {filter === "New" ? "No new leads right now." :
             filter === "Added" ? "Nothing added yet." : "Nothing marked not interested."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((lead) => {
            const conf = confidenceLabel(lead.confidence);
            return (
              <div key={lead.id} className="card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-10 w-10 rounded-lg grid place-items-center font-bold text-white text-sm shrink-0" style={{ background: "var(--purple)" }}>
                    {(lead.brand_name || lead.sender_email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{lead.brand_name || lead.subject || "Detected lead"}</span>
                      <Pill size="sm" source={conf.source} className="px-2 py-0.5">{conf.text}</Pill>
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {lead.deal_type || "Potential lead"} {lead.sender_email && <>· from {lead.sender_email}</>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {lead.status === "new" ? (
                      <>
                        <Button size="sm" onClick={() => act(lead.id, "add")}>Add to deals</Button>
                        <Button size="sm" variant="secondary" onClick={() => act(lead.id, "not_interested")}><IconClose size={14} /> Not interested</Button>
                      </>
                    ) : lead.status === "added" ? (
                      <span className="inline-flex items-center gap-2 self-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-paid bg-paid/10 border border-paid/30 rounded-full px-2.5 py-1">
                          <IconCheck size={13} /> Added
                        </span>
                        {lead.linked_deal_id && (
                          <a href={`/app/deals?open=${lead.linked_deal_id}`} className="text-xs font-semibold accent-text hover:underline no-underline">View deal</a>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-muted self-center">Suppressed</span>
                    )}
                  </div>
                </div>
                {lead.summary && <p className="text-sm text-muted mt-3">{lead.summary}</p>}
                {lead.contact_name && (
                  <p className="text-xs text-muted mt-2">Rep: {lead.contact_name}{lead.contact_email ? ` (${lead.contact_email})` : ""}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}