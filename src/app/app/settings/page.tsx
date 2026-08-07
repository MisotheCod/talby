"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, applyAccent, DEFAULT_HSL, parseHSL, serializeHSL, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { IconCheck, IconCrown } from "@/components/icons";
import { StatusPill, Button, Spinner } from "@/components/ui";

type Profile = { handler: string | null; accent: string | null; plan: string };

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<HSL>(DEFAULT_HSL);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("handler, accent, plan").eq("id", user.id).single();
      const p = (data as unknown as Profile) ?? null;
      setProfile(p);
      const hsl = parseHSL(p?.accent) ?? DEFAULT_HSL;
      setCurrent(hsl);
      applyAccent(hsl);
    })();
  }, [supabase]);

  const persist = async (hsl: HSL) => {
    applyAccent(hsl);
    setCurrent(hsl);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setProfile((pr) => (pr ? { ...pr, accent: serializeHSL(hsl) } : pr));
      await supabase.from("profiles").update({ accent: serializeHSL(hsl) }).eq("id", user.id);
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

  const isOn = (p: (typeof ACCENT_PRESETS)[number]) =>
    Math.round(current.h) === Math.round(p.h) &&
    Math.round(current.s) === Math.round(p.s) &&
    Math.round(current.l) === Math.round(p.l);

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-inksoft mt-1">Your handle, plan, and the color of Talby.</p>
      </div>

      {/* Plan */}
      <div className="bg-card border border-line rounded-[16px] p-6 flex items-center justify-between flex-wrap gap-4 shadow-card">
        <div>
          <h2 className="font-semibold">Your plan</h2>
          <p className="text-sm text-inksoft mt-1">
            {profile?.plan === "free" ? "Free — complete app, up to 5 active deals." : "Paid — unlimited active deals + file uploads."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile?.plan === "free" ? (
            <Button onClick={startUpgrade} disabled={saving}>{saving ? <Spinner /> : <IconCrown size={16} />} Go unlimited</Button>
          ) : (
            <StatusPill kind="accent" className="px-3 py-1"><IconCrown size={14} /> Paid</StatusPill>
          )}
        </div>
      </div>

      {/* Theme */}
      <div className="bg-card border border-line rounded-[16px] p-6 space-y-6 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Theme</h2>
            <p className="text-sm text-inksoft mt-1">
              The accent drives active nav, buttons, pills, and highlights. Your text and surfaces stay always-readable.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => persist({ h: p.h, s: p.s, l: p.l })}
              aria-label={p.name}
              className={cn("relative h-10 w-10 rounded-full grid place-items-center shadow-sm cursor-pointer hover:scale-105 transition-transform", isOn(p) && "ring-2 ring-ink ring-offset-2")}
              style={{ background: `hsl(${p.h},${p.s}%,${p.l}%)` }}
            >
              {isOn(p) && <IconCheck size={18} className="text-onaccent" />}
              <span className="sr-only">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Handler */}
      <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
        <h2 className="font-semibold mb-1">Creator handle</h2>
        <p className="text-sm text-inksoft mb-3">Shown in your greeting on the Overview.</p>
        <HandlerField initial={profile?.handler ?? ""} />
      </div>

      {error && <p className="text-sm text-late" role="alert">{error}</p>}
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
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft">@</span>
          <input
            value={val}
            onChange={(e) => { setVal(e.target.value.replace(/\s/g, "")); setSaved(false); }}
            className="w-full bg-card border border-line2 rounded-xl pl-9 pr-3.5 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 font-sans"
            maxLength={30}
          />
        </div>
        <Button onClick={save} disabled={saved}>{saved ? "Saved" : "Save"}</Button>
      </div>
    );
  }
}
