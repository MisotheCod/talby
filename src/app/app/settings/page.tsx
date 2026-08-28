"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, HEADING_FONTS, applyAccent, applyFont, DEFAULT_HSL, DEFAULT_HEAD_FONT, parseHSL, serializeHSL, type HSL } from "@/lib/accent";
import { FREE_ACTIVE_DEAL_CAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconCheck } from "@/components/icons";
import { Button, Spinner } from "@/components/ui";
import { NudgeSettings } from "@/components/nudge-settings";
import { NotionLogo } from "@/components/marketing/notion-logo";

type Profile = { handler: string | null; accent: string | null; plan: string; head_font: string | null; avatar_url: string | null };

function userName(handler: string | null): string {
  return (handler || "").replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Settings are grouped into sections with a side-scroll section nav.
const SECTIONS = [
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "connections", label: "Connections" },
  { id: "notifications", label: "Notifications" },
  { id: "nudges", label: "Nudges" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

export default function SettingsPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeCount, setActiveCount] = useState(0);
  const handlerRef = useRef<{ save: () => Promise<void>; saved: boolean } | null>(null);
  const pwRef = useRef<{ update: () => Promise<void>; busy: boolean; hasValue: boolean } | null>(null);
  const [section, setSection] = useState<SectionId>(
    (searchParams.get("section") as SectionId) && SECTIONS.some((s) => s.id === searchParams.get("section"))
      ? (searchParams.get("section") as SectionId)
      : "account"
  );

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
      const { data } = await supabase.from("profiles").select("handler, accent, plan, head_font, avatar_url").eq("id", user.id).single();
      const p = (data as unknown as Profile) ?? null;
      setProfile(p);
      const { data: deals } = await supabase
        .from("deals")
        .select("id")
        .eq("active", true)
        .not("status", "eq", "archived")
        .not("brand", "is", "")
        .gt("brand", "");
      setActiveCount((deals ?? []).length);
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
    setSaving(false);
    window.location.href = "/#pricing";
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
                    {/* Profile header card: identity, not a setting */}
                    <AvatarField handler={profile?.handler ?? ""} initial={profile?.avatar_url ?? null} onChanged={(url) => setProfile((p) => (p ? { ...p, avatar_url: url } : p))} />

                    {/* Settings card: three labeled rows */}
                    <div className="bg-card border border-line rounded-[16px] shadow-card overflow-hidden">
                      {/* Creator handle */}
                      <div className="flex items-center gap-4 px-6 py-5 border-b border-line flex-wrap">
                        <div className="w-[140px] shrink-0 text-sm text-inksoft">Creator handle</div>
                        <div className="flex-1 min-w-0">
                          <HandlerField initial={profile?.handler ?? ""} />
                        </div>
                        <Button onClick={() => handlerRef.current?.save()} disabled={handlerRef.current?.saved}>{handlerRef.current?.saved ? "Saved" : "Save"}</Button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center gap-4 px-6 py-5 border-b border-line flex-wrap">
                        <div className="w-[140px] shrink-0 text-sm text-inksoft">Password</div>
                        <div className="flex-1 min-w-0">
                          <PasswordField />
                        </div>
                        <Button onClick={() => pwRef.current?.update()} disabled={pwRef.current?.busy || !pwRef.current?.hasValue}>{pwRef.current?.busy ? <Spinner /> : "Update"}</Button>
                      </div>

                      {/* Plan */}
                      {profile?.plan === "free" ? (
                        <FreePlanPanel used={activeCount} cap={FREE_ACTIVE_DEAL_CAP} onUpgrade={startUpgrade} saving={saving} />
                      ) : (
                        <div className="flex items-center gap-4 px-6 py-5 border-b border-line">
                          <div className="w-[140px] shrink-0 text-sm text-inksoft">Plan</div>
                          <div className="flex-1 min-w-0 text-sm">Paid · unlimited deals + file uploads</div>
                          <Button variant="ghost" size="sm" onClick={startUpgrade} disabled={saving}>Manage</Button>
                        </div>
                      )}
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

        {/* ============ NOTIFICATIONS ============ */}
        {section === "notifications" && <NotificationSettings />}

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
    handlerRef.current = { save, saved };
    return (
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft">@</span>
        <input
          value={val}
          onChange={(e) => { setVal(e.target.value.replace(/\s/g, "")); setSaved(false); }}
          className="w-full bg-card border border-line2 rounded-xl pl-9 pr-3.5 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 font-sans"
          maxLength={30}
          aria-label="Creator handle"
        />
      </div>
    );
  }

  function AvatarField({ handler, initial, onChanged }: { handler: string; initial: string | null; onChanged: (url: string | null) => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
    const initialLetter = (handler || "C").charAt(0).toUpperCase();
    const preview = initial
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${initial}`
      : null;

    const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setBusy(true); setMsg(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg({ kind: "bad", text: "Not signed in." }); setBusy(false); return; }
      const path = `${user.id}/avatar-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) { setMsg({ kind: "bad", text: upErr.message }); setBusy(false); return; }
      await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
      onChanged(path);
      setMsg({ kind: "ok", text: "Photo saved." });
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    };

    const remove = async () => {
      setBusy(true); setMsg(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (initial) await supabase.storage.from("avatars").remove([initial]);
        await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
        onChanged(null);
      }
      setMsg({ kind: "ok", text: "Photo removed." });
      setBusy(false);
    };

    return (
      <div className="bg-card border border-line rounded-[16px] px-6 py-5 flex items-center gap-4 shadow-card flex-wrap">
        <div className="avatar h-12 w-12 text-lg overflow-hidden grid place-items-center flex-none">
          {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : initialLetter}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{userName(handler)}</div>
          <div className="text-sm text-inksoft truncate">@{handler || "your handle"}</div>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={upload} />
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? <Spinner /> : <>Change photo</>}</Button>
          {initial && <Button variant="ghost" size="sm" disabled={busy} onClick={remove}>Remove</Button>}
        </div>
        {msg && <span className={cn("w-full text-xs", msg.kind === "ok" ? "text-paid" : "text-late")}>{msg.text}</span>}
      </div>
    );
  }

  function PasswordField() {
    const [pw, setPw] = useState("");
    const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const update = async () => {
      if (pw.length < 8) { setMsg({ kind: "bad", text: "Password must be at least 8 characters." }); return; }
      setBusy(true); setMsg(null);
      const { error } = await supabase.auth.updateUser({ password: pw });
      setBusy(false);
      if (error) { setMsg({ kind: "bad", text: error.message }); return; }
      setPw("");
      setMsg({ kind: "ok", text: "Password updated." });
    };
    pwRef.current = { update, busy, hasValue: pw.length > 0 };
    return (
      <div>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setMsg(null); }}
          placeholder="New password"
          className="w-full bg-card border border-line2 rounded-xl px-3.5 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 font-sans"
          autoComplete="new-password"
          aria-label="New password"
        />
        {msg && <p className={cn("text-sm mt-2", msg.kind === "ok" ? "text-paid" : "text-late")}>{msg.text}</p>}
      </div>
    );
  }
}

/** Free-plan upgrade panel: accent-tinted, growth-framed, sits at the card bottom. */
function FreePlanPanel({ used, cap, onUpgrade, saving }: { used: number; cap: number; onUpgrade: () => void; saving: boolean }) {
  const chips = ["Unlimited deals", "File uploads", "Payment nudges"];
  const left = cap - used;
  return (
    <div className="accent-soft px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <div className="font-semibold text-sm">Free · {used} of {cap} deals used</div>
        <p className="text-[13px] mt-1">
          {left > 0 ? `One more and you'll want unlimited. Good problem to have.` : "You're at the free limit. Upgrade for unlimited deals."}
        </p>
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {chips.map((c) => (
            <span key={c} className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-accenttint2 text-accentink">{c}</span>
          ))}
        </div>
      </div>
      <Button onClick={onUpgrade} disabled={saving}>{saving ? <Spinner /> : "Go unlimited"}</Button>
    </div>
  );
}

/** Connection cards (Notion) with their official logo. */
function ConnectionsList() {
  const supabase = createClient();
  const [notion, setNotion] = useState<{ connected: boolean; workspace: string | null; configured: boolean } | null>(null);

  useEffect(() => {
    (async () => {
      const n = await fetch("/api/notion/status").then((r) => r.json()).catch(() => ({}));
      setNotion(n);
    })();
  }, []);

  const disconnectNotion = async () => {
    await fetch("/api/notion/disconnect", { method: "POST" });
    setNotion({ connected: false, workspace: null, configured: notion?.configured ?? false });
  };

  return (
    <div className="space-y-3">
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

/** Notification preference toggles (in-app + digest). */
function NotificationSettings() {
  const supabase = createClient();
  const [inapp, setInapp] = useState(true);
  const [digest, setDigest] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("notify_calendar_inapp, digest_enabled").eq("id", user.id).single();
      const p = (data as unknown as { notify_calendar_inapp?: boolean; digest_enabled?: boolean } | null) ?? null;
      setInapp(p?.notify_calendar_inapp !== false);
      setDigest(p?.digest_enabled === true);
    })();
  }, [supabase]);

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ notify_calendar_inapp: inapp, digest_enabled: digest }).eq("id", user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const Toggle = ({ on, onChange, label, sub }: { on: boolean; onChange: (v: boolean) => void; label: string; sub: string }) => (
    <button onClick={() => onChange(!on)} className="w-full flex items-center justify-between gap-4 py-3 cursor-pointer">
      <span className="text-left min-w-0">
        <span className="block font-medium text-sm">{label}</span>
        <span className="block text-xs text-inksoft mt-0.5">{sub}</span>
      </span>
      <span className={cn("h-6 w-11 rounded-full p-0.5 transition-colors shrink-0", on ? "accent-fill" : "bg-line2")}>
        <span className={cn("block h-5 w-5 rounded-full bg-white shadow transition-transform", on && "translate-x-5")} />
      </span>
    </button>
  );

  return (
    <div className="bg-card border border-line rounded-[16px] p-6 shadow-card">
      <h2 className="font-semibold mb-1">Notifications</h2>
      <p className="text-sm text-inksoft mb-4">Choose how Talby tells you about upcoming calendar events, payments, and deliverables.</p>

      <div className="divide-y divide-line">
        <Toggle
          on={inapp}
          onChange={setInapp}
          label="In-app notifications"
          sub="A bell in your navigation flags what's happening today."
        />
        <Toggle
          on={digest}
          onChange={setDigest}
          label="Daily digest"
          sub="A morning email with only the things you have that day: payments, deliverables, posts, and dated to-dos."
        />
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button onClick={save} disabled={saved}>{saved ? "Saved" : "Save preferences"}</Button>
      </div>
    </div>
  );
}