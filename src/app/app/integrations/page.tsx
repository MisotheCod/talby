"use client";

import { useState } from "react";
import { StatusPill, Button } from "@/components/ui";
import { IconPlug } from "@/components/icons";

// Placeholder integrations grid — designed toward a Connect/Connected card
// pattern (Charma-style) but with NO actual connections built in v1.
const COMING = [
  { name: "Notion", desc: "Import your current brand-deal setup." },
  { name: "Instagram", desc: "Link posts to your calendar and deals." },
  { name: "YouTube", desc: "Track deliverables across videos." },
  { name: "TikTok", desc: "Plan posts and attach them to deals." },
  { name: "Gmail", desc: "Surface deal emails in one place." },
  { name: "Google Calendar", desc: "Sync content dates to your calendar." },
];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<string[]>([]);

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-muted text-sm mt-1">
          Connect the tools you already use. Coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMING.map((c) => {
          const isOn = connected.includes(c.name);
          return (
            <div key={c.name} className="card p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="h-10 w-10 rounded-xl bg-subtle grid place-items-center text-lg font-semibold">
                  {c.name[0]}
                </span>
                {isOn && <StatusPill kind="paid">Connected</StatusPill>}
              </div>
              <h3 className="font-semibold mt-3">{c.name}</h3>
              <p className="text-sm text-muted mt-1 flex-1">{c.desc}</p>
              <Button
                variant={isOn ? "secondary" : "primary"}
                size="sm"
                className="mt-4 justify-center"
                onClick={() => { if (isOn) return; setConnected([...connected, c.name]); }}
              >
                {isOn ? "Connected" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="card p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl accent-soft grid place-items-center shrink-0"><IconPlug size={20} /></div>
        <div>
          <h3 className="font-semibold">More on the way</h3>
          <p className="text-sm text-muted mt-1">
            These connection cards are placeholders, real integrations land after launch. Talby stays calm and self-contained until then.
          </p>
        </div>
      </div>
    </div>
  );
}
