"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button, Spinner, Pill } from "@/components/ui";
import { IconClose } from "@/components/icons";

type Lead = {
  id: string; gmail_message_id: string; subject: string | null; sender_email: string | null;
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
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState<Filter>("New");
  const [plan, setPlan] = useState<string>("free");
  const [gmailConnected, setGmailConnected] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "warn" | "bad"; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("inbox_leads").select("*").order("created_at", { ascending: false });
    setLeads((data ?? []) as unknown as Lead[]);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        setPlan((prof as { plan?: string } | null)?.plan ?? "free");
      }
      const { data: conn } = await supabase.from("gmail_connections").select("email").limit(1);
      setGmailConnected((conn ?? []).length > 0);
    })();
    load();
    setLoading(false);
  }, [supabase, load]);

  const scanNow = async () => {
    setScanning(true); setMessage(null);
    try {
      const res = await fetch("/api/inbox/scan", { method: "POST" });
      const data = await res.json();
      if (data.error === "paid_required") {
        setMessage({ kind: "warn", text: "The inbox scanner is on the paid plan. Go unlimited to catch brand deals from your inbox." });
      } else if (data.error === "gmail_not_connected") {
        setMessage({ kind: "warn", text: "Connect Gmail to scan your inbox for brand-deal outreach." });
      } else {
        setMessage({ kind: "ok", text: `Scan complete: found ${data.newLeads ?? 0} new lead${(data.newLeads ?? 0) === 1 ? "" : "s"}.` });
        await load();
      }
    } catch {
      setMessage({ kind: "bad", text: "Scan failed. Please try again." });
    }
    setScanning(false);
  };

  const act = async (id: string, action: "add" | "not_interested") => {
    const res = await fetch(`/api/inbox/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (data.duplicated) {
      setMessage({ kind: "ok", text: "A deal for this brand already exists. The email was attached to it as a note." });
    } else if (action === "add") {
      setMessage({ kind: "ok", text: "Added to deals as a Pipeline deal, with its rep contact filled in." });
    }
    await load();
  };

  if (plan !== "paid") {
    return (
      <div className="space-y-5 fade-up max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <p className="text-muted text-sm mt-1">Catch brand-deal outreach from your Gmail.</p>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Brand-deal detection is on the paid plan</h2>
          <p className="text-sm text-muted mt-2">
            Talby can read your inbox and surface genuine brand-deal outreach so you never miss a paid
            opportunity landing in Gmail. Upgrade to turn it on.
          </p>
          <a href="/pricing" className="inline-block mt-4"><Button>Go unlimited</Button></a>
        </div>
      </div>
    );
  }

  const newLeads = leads.filter((l) => l.status === "new");
  const shown = leads.filter((l) =>
    filter === "New" ? l.status === "new" :
    filter === "Added" ? l.status === "added" :
    l.status === "not_interested"
  );

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <p className="text-muted text-sm mt-1">Brand-deal outreach detected in your Gmail.</p>
        </div>
        <Button onClick={scanNow} disabled={scanning}>{scanning ? <Spinner /> : "Scan now"}</Button>
      </div>

      {!gmailConnected && (
        <div className="card p-4 text-sm flex items-center justify-between gap-3">
          <span className="text-muted">Connect Gmail to scan for brand-deal outreach.</span>
          <a href="/api/gmail/connect"><Button variant="secondary" size="sm">Connect Gmail</Button></a>
        </div>
      )}

      {message && <p className={cn("text-sm", message.kind === "warn" ? "text-due" : message.kind === "bad" ? "text-late" : "text-paid")}>{message.text}</p>}

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
            {filter === "New" ? "No new leads yet. Run a scan to check your inbox." :
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
                      <span className="text-xs text-paid font-semibold self-center">Added to deals{lead.linked_deal_id ? "" : ""}</span>
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