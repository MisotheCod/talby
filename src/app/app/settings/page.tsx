"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, LIVE_PALETTE } from "@/lib/config";
import { cn } from "@/lib/utils";
import { IconCheck, IconCrown } from "@/components/icons";
import { Badge, Button, Spinner } from "@/components/ui";

type Profile = { handler: string | null; accent: string; plan: string };

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("handler, accent, plan").eq("id", user.id).single();
      setProfile((data as unknown as Profile) ?? null);
      if (data) document.documentElement.setAttribute("data-accent", (data as unknown as Profile).accent);
    })();
  }, [supabase]);

  const applyAccent = async (accent: string) => {
    document.documentElement.setAttribute("data-accent", accent);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setProfile((p) => (p ? { ...p, accent } : p));
      await supabase.from("profiles").update({ accent }).eq("id", user.id);
    }
  };

  const startUpgrade = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError(data.error || "Could not start checkout."); setSaving(false); }
    } catch { setError("Could not start checkout."); setSaving(false); }
  };

  return (
    <div className="space-y-8 fade-up">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted text-sm mt-1">Your handle, plan, and the color of Talby.</p>
      </div>

      {/* Profile + plan */}
      <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-semibold">Your plan</h2>
          {profile?.plan === "free" ? (
            <p className="text-sm text-muted mt-1">Free — complete app, up to 5 active deals.</p>
          ) : (
            <p className="text-sm text-muted mt-1">Paid — unlimited active deals + file uploads.</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {profile?.plan === "free" ? (
            <Button onClick={startUpgrade} disabled={saving}>{saving ? <Spinner /> : <IconCrown size={16} />} Go unlimited</Button>
          ) : (
            <Badge tone="accent" className="px-3 py-1"><IconCrown size={14} /> Paid</Badge>
          )}
        </div>
      </div>

      {/* Theme */}
      <div className="card p-6 space-y-6">
        <div>
          <h2 className="font-semibold">Theme</h2>
          <p className="text-sm text-muted mt-1">
            The accent drives active nav, buttons, pills, and highlights. Your text and surfaces stay always-readable.
          </p>
        </div>

        {/* Preset swatches */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Presets</h3>
          <div className="flex flex-wrap gap-3">
            {ACCENT_PRESETS.map((a) => (
              <button
                key={a.id}
                onClick={() => applyAccent(a.id)}
                aria-label={`Apply ${a.name}`}
                className="relative h-10 w-10 rounded-full grid place-items-center shadow-sm cursor-pointer hover:scale-105 transition-transform"
                style={{ background: a.color }}
              >
                {profile?.accent === a.id && <IconCheck size={18} className="text-white" />}
                <span className="sr-only">{a.name}</span>
              </button>
            ))}
          </div>
        </div>

        <LivePicker current={profile?.accent ?? "coral"} onChange={applyAccent} />
      </div>

      {/* Handler */}
      <div className="card p-6">
        <h2 className="font-semibold mb-1">Creator handle</h2>
        <p className="text-sm text-muted mb-3">Shown in your greeting on the Overview.</p>
        <HandlerField initial={profile?.handler ?? ""} />
      </div>
    </div>
  );

  function HandlerField({ initial }: { initial: string }) {
    const [val, setVal] = useState(initial);
    const [saved, setSaved] = useState(false);
    const save = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("profiles").update({ handler: val.trim() || null }).eq("id", user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    };
    return (
      <div className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">@</span>
          <input
            value={val}
            onChange={(e) => { setVal(e.target.value.replace(/\s/g, "")); setSaved(false); }}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3.5 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            maxLength={30}
          />
        </div>
        <Button onClick={save} disabled={saved}>{saved ? "Saved" : "Save"}</Button>
      </div>
    );
  }
}

/* ---------------- Arc-style live picker ---------------- */
function LivePicker({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Map a live-palette color to a preset id (nearest).
  const colorToId = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    let best = "coral", bestDist = Infinity;
    for (const p of ACCENT_PRESETS) {
      const cr = parseInt(p.color.slice(1, 3), 16), cg = parseInt(p.color.slice(3, 5), 16), cb = parseInt(p.color.slice(5, 7), 16);
      const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
      if (dist < bestDist) { bestDist = dist; best = p.id; }
    }
    return best;
  };

  const pickFromEvent = (clientX: number) => {
    const el = pickerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = x / rect.width;
    const idx = Math.min(LIVE_PALETTE.length - 1, Math.floor(ratio * LIVE_PALETTE.length));
    const color = LIVE_PALETTE[idx];
    onChange(colorToId(color));
    setPreview(color);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-3">Drag across the palette</h3>
      <div
        ref={pickerRef}
        onMouseDown={() => setDragging(true)}
        onMouseMove={(e) => { if (dragging) pickFromEvent(e.clientX); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchMove={(e) => pickFromEvent(e.touches[0].clientX)}
        onTouchStart={() => setDragging(true)}
        onTouchEnd={() => setDragging(false)}
        className={cn("relative h-11 rounded-xl cursor-crosshair select-none touch-none overflow-hidden", dragging && "ring-2 ring-accent/50")}
      >
        <div className="absolute inset-0 flex">
          {LIVE_PALETTE.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-px bg-white/80 shadow" aria-hidden />
      </div>
      <p className="text-xs text-muted mt-2">
        {dragging && preview ? `Preview: ${preview}` : "Drag to try colors live — text and surfaces never break."}
      </p>
    </div>
  );
}
