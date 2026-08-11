"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, HEADING_FONTS, applyAccent, applyFont, DEFAULT_HSL, DEFAULT_HEAD_FONT, parseHSL, serializeHSL, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { IconCheck, IconCrown } from "@/components/icons";
import { StatusPill, Button, Spinner } from "@/components/ui";
import { NudgeSettings } from "@/components/nudge-settings";
import { NotionLogo } from "@/components/marketing/notion-logo";
import { GmailLogo } from "@/components/marketing/gmail-logo";

type Profile = { handler: string | null; accent: string | null; plan: string; head_font: string | null };

// Settings are grouped into sections with a side-scroll section nav.
const SECTIONS = [
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "connections", label: "Connections" },
  { id: "nudges", label: "Nudges" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [section, setSection] = useState<SectionId>("account");

  // Theme editor state (shared preview/save logic)
  const [current, setCurrent] = useState<HSL>(DEFAULT_HSL);
  const [currentFont, setCurrentFont] = useState<string>(DEFAULT_HEAD_FONT);
  const [savedTheme, setSavedTheme] = useState<HSL>(DEFAULT_HSL);
  const [savedFont, setSavedFont] = useState<string>(DEFAULT_HEAD_FONT);
  const [sat, setSat] = useState(DEFAULT_HSL.s);
  const [dirty, setDirty] = useState(false);
  const [themeSaving, setThemeSaving] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("handler, accent, plan, head_font").eq("id", user.id).single();
      const p = (data as unknown as Profile) ?? null;
      setProfile(p);
      const hsl = parseHSL(p?.accent) ?? DEFAULT_HSL;
      setCurrent(hsl);
      setSavedTheme(hsl);
      setSat(hsl.s);
      const font = p?.head_font ?? DEFAULT_HEAD_FONT;
      setCurrentFont(font);
      setSavedFont(font);
      applyAccent(hsl);
      applyFont(font);
    })();
  }, [supabase]);

  // Preview a theme change live; does NOT persist.
  const previewTheme = (hsl: HSL) => {
    applyAccent(hsl);
    setCurrent(hsl);
    setSat(hsl.s);
    setDirty(true);
    setThemeSaved(false);
  };
  const previewSat = (v: number) => previewTheme({ h: current.h, s: v, l: 50 });
  const previewFont = (name: string) => {
    applyFont(name);
    setCurrentFont(name);
    setDirty(true);
    setThemeSaved(false);
  };

  // Persist the chosen theme {h,s,font} to the profile.
  const saveTheme = async () => {
    setThemeSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setProfile((pr) => (pr ? { ...pr, accent: serializeHSL(current), head_font: currentFont } : pr));
      await supabase.from("profiles").update({ accent: serializeHSL(current), head_font: currentFont }).eq("id", user.id);
    }
    setSavedTheme(current);
    setSavedFont(currentFont);
    setDirty(false);
    setThemeSaving(false);
    setThemeSaved(true);
  };

  // Revert unsaved changes to the last saved theme + font.
  const cancelTheme = () => {
    applyAccent(savedTheme);
    applyFont(savedFont);
    setCurrent(savedTheme);
    setCurrentFont(savedFont);
    setSat(savedTheme.s);
    setDirty(false);
    setThemeSaved(false);
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
    <div className="fade-up">
      <div className="mb-2">
        <h1 className="text-[24px] font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-inksoft mt-1">Your account, appearance, and connections.</p>
      </div>

      {/* Section nav */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "px-3.5 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer border",
              section === s.id ? "accent-soft border-accent/30 font-semibold" : "border-line bg-card text-inksoft hover:text-ink"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* ============ ACCOUNT ============ */}
        {section === "account" && (
          <>
            <div className="bg-card border border-line rounded-[16px] p-6 flex items-center justify-between flex-wrap gap-4 shadow-card">
              <div>
                <h2 className="font-semibold">Your plan</h2>
                <p className="text-sm text-inksoft mt-1">
                  {profile?.plan === "free" ? "Free, complete app up to 5 active deals." : "Paid, unlimited active deals + file uploads."}
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

            <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
              <h2 className="font-semibold mb-1">Creator handle</h2>
              <p className="text-sm text-inksoft mb-3">Shown in your greeting on the Overview.</p>
              <HandlerField initial={profile?.handler ?? ""} />
            </div>

            <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
              <h2 className="font-semibold mb-1">Password</h2>
              <p className="text-sm text-inksoft mb-3">Set a new password for your Talby account.</p>
              <PasswordField />
            </div>
          </>
        )}

        {/* ============ APPEARANCE ============ */}
        {section === "appearance" && (
          <div className="bg-card border border-line rounded-[16px] p-6 space-y-6 shadow-card">
            <div>
              <h2 className="font-semibold">Accent color</h2>
              <p className="text-sm text-inksoft mt-1">
                Drives active nav, buttons, pills, and highlights. Your text and surfaces stay always-readable.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {ACCENT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => previewTheme({ h: p.h, s: p.s, l: p.l })}
                  aria-label={p.name}
                  className={cn("relative h-10 w-10 rounded-full grid place-items-center shadow-sm cursor-pointer hover:scale-105 transition-transform", isOn(p) && "ring-2 ring-ink ring-offset-2")}
                  style={{ background: `hsl(${p.h},${p.s}%,${p.l}%)` }}
                >
                  {isOn(p) && <IconCheck size={18} className="text-onaccent" />}
                  <span className="sr-only">{p.name}</span>
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] text-inkfaint mb-[7px]">Hue</div>
                <input
                  type="range"
                  className="hue w-full"
                  min={0} max={360}
                  value={current.h}
                  aria-label="Accent hue"
                  onChange={(e) => previewTheme({ h: Number(e.target.value), s: current.s, l: current.l })}
                />
              </div>
              <div>
                <div className="text-[11px] text-inkfaint mb-[7px]">Saturation</div>
                <input
                  type="range"
                  className="sat w-full"
                  min={20} max={100}
                  value={sat}
                  style={{ background: `linear-gradient(90deg, hsl(${current.h},20%,50%), hsl(${current.h},100%,50%))` }}
                  aria-label="Accent saturation"
                  onChange={(e) => previewSat(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] text-inkfaint mb-2">Heading font</div>
              <div className="fontrow max-w-sm">
                {HEADING_FONTS.map((f) => (
                  <button
                    key={f.name}
                    className={cn("fchip", currentFont === f.name && "on")}
                    style={{ fontFamily: f.cssVar }}
                    onClick={() => previewFont(f.name)}
                  >
                    {f.name === "Bricolage Grotesque" ? "Bricolage" : f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button onClick={saveTheme} disabled={themeSaving}>
                {themeSaving ? <Spinner /> : null}
                {themeSaved ? "Theme saved" : "Save theme"}
              </Button>
              {dirty && (
                <Button variant="secondary" onClick={cancelTheme}>Cancel</Button>
              )}
              {dirty && !themeSaved && (
                <span className="text-xs text-inksoft">Previewing, not saved yet</span>
              )}
            </div>
          </div>
        )}

        {/* ============ CONNECTIONS ============ */}
        {section === "connections" && (
          <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
            <h2 className="font-semibold mb-1">Connected accounts</h2>
            <p className="text-sm text-inksoft mb-4">
              Manage the tools you connect to Talby.
            </p>
            <ConnectionsList />
          </div>
        )}

        {/* ============ NUDGES ============ */}
        {section === "nudges" && <NudgeSettings />}

        {error && <p className="text-sm text-late" role="alert">{error}</p>}
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

  function PasswordField() {
    const [pw, setPw] = useState("");
    const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const change = async () => {
      if (pw.length < 8) { setMsg({ kind: "bad", text: "Password must be at least 8 characters." }); return; }
      setBusy(true); setMsg(null);
      const { error } = await supabase.auth.updateUser({ password: pw });
      setBusy(false);
      if (error) { setMsg({ kind: "bad", text: error.message }); return; }
      setPw("");
      setMsg({ kind: "ok", text: "Password updated." });
    };
    return (
      <div className="max-w-sm">
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setMsg(null); }}
          placeholder="New password"
          className="w-full bg-card border border-line2 rounded-xl px-3.5 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 font-sans"
          autoComplete="new-password"
        />
        <div className="flex items-center gap-3 mt-3">
          <Button onClick={change} disabled={busy || !pw}>{busy ? <Spinner /> : "Update password"}</Button>
        </div>
        {msg && <p className={cn("text-sm mt-2", msg.kind === "ok" ? "text-paid" : "text-late")}>{msg.text}</p>}
      </div>
    );
  }
}

/** Connection cards (Notion + Gmail) with their official logos. */
function ConnectionsList() {
  const supabase = createClient();
  const [notion, setNotion] = useState<{ connected: boolean; workspace: string | null; configured: boolean } | null>(null);
  const [gmail, setGmail] = useState<{ connected: boolean; email: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      const n = await fetch("/api/notion/status").then((r) => r.json()).catch(() => ({}));
      setNotion(n);
      const g = await fetch("/api/gmail/status").then((r) => r.json()).catch(() => ({}));
      setGmail(g);
    })();
  }, []);

  const disconnectNotion = async () => {
    await fetch("/api/notion/disconnect", { method: "POST" });
    setNotion({ connected: false, workspace: null, configured: notion?.configured ?? false });
  };
  const disconnectGmail = async () => {
    await fetch("/api/gmail/disconnect", { method: "POST" });
    setGmail({ connected: false, email: null });
  };

  return (
    <div className="space-y-3">
      {/* Gmail */}
      <div className="border border-line rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <GmailLogo size={34} />
          <div className="min-w-0">
            <div className="font-semibold">Gmail</div>
            <div className="text-xs text-inksoft truncate">
              {gmail?.connected ? `Connected${gmail.email ? ` as ${gmail.email}` : ""}` : "Not connected"}
            </div>
            <div className="text-[11px] text-inkfaint mt-0.5">Nudges + inbox deal scanner</div>
          </div>
        </div>
        {gmail?.connected ? (
          <Button variant="secondary" size="sm" onClick={disconnectGmail}>Disconnect</Button>
        ) : (
          <Button size="sm" onClick={() => { window.location.href = "/api/gmail/connect"; }}>Connect</Button>
        )}
      </div>

      {/* Notion */}
      <div className="border border-line rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <NotionLogo size={34} />
          <div className="min-w-0">
            <div className="font-semibold">Notion</div>
            <div className="text-xs text-inksoft truncate">
              {notion?.connected ? `Imports from ${notion.workspace || "your Notion"}` : "Not connected"}
            </div>
            <div className="text-[11px] text-inkfaint mt-0.5">Import brand-deal setup</div>
          </div>
        </div>
        {notion?.connected ? (
          <Button variant="secondary" size="sm" onClick={disconnectNotion}>Disconnect</Button>
        ) : (
          <Button size="sm" onClick={() => { window.location.href = "/api/notion/connect?redirect_to=/app/settings"; }}>Connect</Button>
        )}
      </div>
    </div>
  );
}