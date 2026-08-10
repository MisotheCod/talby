"use client";

import { useEffect, useState } from "react";
import { StatusPill, Button, Spinner } from "@/components/ui";
import { IconPlug } from "@/components/icons";
import { NotionLogo } from "@/components/marketing/notion-logo";
import { GmailLogo } from "@/components/marketing/gmail-logo";

// Real connections ship individually. Notion import + Gmail are live v1;
// the rest are roadmap cards.
const ROADMAP = [
  { name: "Instagram", desc: "Link posts to your calendar and deals." },
  { name: "YouTube", desc: "Track deliverables across videos." },
  { name: "TikTok", desc: "Plan posts and attach them to deals." },
  { name: "Google Calendar", desc: "Sync content dates to your calendar." },
];

type NotionStatus = { connected: boolean; workspace: string | null; configured: boolean };

export default function IntegrationsPage() {
  const [notion, setNotion] = useState<NotionStatus | null>(null);

  useEffect(() => {
    fetch("/api/notion/status").then((r) => r.json()).then(setNotion).catch(() => ({}));
  }, []);

  const disconnectNotion = async () => {
    await fetch("/api/notion/disconnect", { method: "POST" });
    setNotion({ connected: false, workspace: null, configured: notion?.configured ?? false });
  };

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-muted text-sm mt-1">
          Connect the tools you already use.
        </p>
      </div>

      {/* Notion — live */}
      <div className="card p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="h-10 w-10 rounded-xl grid place-items-center"><NotionLogo size={38} /></span>
          {notion?.connected && <StatusPill kind="paid">Connected</StatusPill>}
        </div>
        <h3 className="font-semibold mt-3">Notion</h3>
        <p className="text-sm text-muted mt-1 flex-1">
          {notion?.connected
            ? `Imports from ${notion.workspace || "your Notion"} — pull your brand deals straight in.`
            : "Import your current brand-deal setup from a Notion database."}
        </p>
        {notion === null ? (
          <Button variant="secondary" size="sm" className="mt-4 justify-center" disabled><Spinner /></Button>
        ) : notion.connected ? (
          <Button variant="secondary" size="sm" className="mt-4 justify-center" onClick={disconnectNotion}>Disconnect</Button>
        ) : (
          <Button size="sm" className="mt-4 justify-center" onClick={() => { window.location.href = "/api/notion/connect"; }}>
            {notion.configured ? "Connect" : "Connect"}
          </Button>
        )}
        {notion && !notion.configured && (
          <p className="text-xs text-muted mt-2">Notion isn&apos;t configured on this deployment yet.</p>
        )}
      </div>

      {/* Gmail — live (nudges + inbox scanner) */}
      <div className="card p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="h-10 w-10 rounded-xl grid place-items-center"><GmailLogo size={38} /></span>
          <StatusPill kind="neutral">Live</StatusPill>
        </div>
        <h3 className="font-semibold mt-3">Gmail</h3>
        <p className="text-sm text-muted mt-1 flex-1">
          Connect to send payment-follow-up nudges and scan your inbox for brand-deal outreach, all from your own Gmail.
        </p>
        <a href="/app/settings" className="no-underline"><Button variant="secondary" size="sm" className="mt-4 justify-center">Manage in Settings</Button></a>
      </div>

      {/* Roadmap cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROADMAP.map((c) => (
          <div key={c.name} className="card p-5 flex flex-col opacity-70">
            <div className="flex items-center justify-between">
              <span className="h-10 w-10 rounded-xl bg-subtle grid place-items-center text-lg font-semibold">
                {c.name[0]}
              </span>
              <StatusPill kind="neutral">Coming soon</StatusPill>
            </div>
            <h3 className="font-semibold mt-3">{c.name}</h3>
            <p className="text-sm text-muted mt-1">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="card p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl accent-soft grid place-items-center shrink-0"><IconPlug size={20} /></div>
        <div>
          <h3 className="font-semibold">More on the way</h3>
          <p className="text-sm text-muted mt-1">
            Notion import is live. More connections land after launch — Talby stays calm and self-contained until then.
          </p>
        </div>
      </div>
    </div>
  );
}