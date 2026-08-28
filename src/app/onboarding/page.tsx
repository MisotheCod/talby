"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, applyAccent, applyMode, DEFAULT_HSL, DEFAULT_MODE, parseHSL, serializeHSL, type HSL, type ThemeMode } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { IconCheck, IconArrowRight, IconArrowLeft, IconCamera } from "@/components/icons";
import { Button, Input } from "@/components/ui";
import { DashboardPreview } from "@/components/dashboard-preview";
import { CropEditor, type CropEditorHandle } from "@/components/crop-editor";
import { TalbyLogo } from "@/components/marketing/talby-logo";
import { NotionLogo } from "@/components/marketing/notion-logo";

/** Small Notion mark for button/card affordances. */
function NotionMark() {
  return <NotionLogo size={18} className="shrink-0" />;
}

/* Onboarding = SETUP first (this page), then the app shell fires the coach tour
 * on /app, then notifications last. Every step except the handle is skippable.
 * Progress is persisted as they go so closing mid-flow resumes, not restarts. */
type SetupStep = "handle" | "photo" | "crop" | "theme" | "import";
const ORDER: SetupStep[] = ["handle", "photo", "crop", "theme", "import"];
const STEP_NO: Record<SetupStep, number> = { handle: 0, photo: 1, crop: 2, theme: 3, import: 4 };
const PHASES = [0, 1, 2, 3];
const headerActive = (s: SetupStep) => (s === "crop" ? 1 : s === "import" ? 3 : STEP_NO[s]);

type ProfileRow = {
  handler: string | null; accent: string | null; theme_mode?: string;
  avatar_url: string | null; onboarding_step?: number;
};

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<SetupStep>("handle");

  const [handler, setHandler] = useState("");
  const [error, setError] = useState("");

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [current, setCurrent] = useState<HSL>(DEFAULT_HSL);
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE);
  const [hue, setHue] = useState(DEFAULT_HSL.h);

  const resume = useRef<{ handler: boolean; photo: boolean; theme: boolean; no: number }>({ handler: false, photo: false, theme: false, no: 0 });

  const saveProgress = useCallback(async () => {
    if (userId) await supabase.from("profiles").update({ onboarding_step: STEP_NO[step] }).eq("id", userId);
  }, [supabase, userId, step]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);
      const p = await supabase.from("profiles")
        .select("handler, accent, theme_mode, avatar_url, onboarding_step").eq("id", user.id).single();
      const row = (p.data ?? null) as unknown as ProfileRow | null;
      if (!active) return;
      if (row?.handler) { setHandler(row.handler); resume.current.handler = true; }
      if (row?.avatar_url) { setPhotoPreview(RowAvatarUrl(row.avatar_url)); resume.current.photo = true; }
      const savedMode: ThemeMode = row?.theme_mode === "dark" ? "dark" : DEFAULT_MODE;
      setMode(savedMode); applyMode(savedMode);
      if (row?.accent) {
        const parsed = parseHSL(row.accent);
        // Only a parseable HSL means the user actually saved a theme. Fresh
        // profiles default to accent: "coral" (a preset name, not HSL), which
        // must NOT look like a saved theme or onboarding would skip past it.
        const h = parsed ?? DEFAULT_HSL;
        setCurrent(h); setHue(h.h); applyAccent(h, savedMode);
        if (parsed) resume.current.theme = true;
      } else applyAccent(DEFAULT_HSL, savedMode);

      resume.current.no = Math.min(4, Math.max(0, row?.onboarding_step ?? 0));
      // Resume forward: pick the first step not already satisfied.
      let s: SetupStep = "handle";
      const r = resume.current;
      if (r.no >= 4) s = "import";
      else if (r.no >= 3 || r.theme) s = "import";
      else if (r.no >= 2) s = "theme";
      else if (r.no >= 1 || r.photo) s = "photo";
      setStep(s);
      setReady(true);
    })();
    return () => { active = false; };
  }, [supabase]);

  useEffect(() => { if (ready) saveProgress(); }, [step, ready, saveProgress]);

  const go = (s: SetupStep) => setStep(s);

  // ---- Handle (required; cannot be skipped)
  const advanceFromHandle = async () => {
    if (!handler.trim() || !userId) return;
    setError("");
    const { error } = await supabase.from("profiles").update({ handler: handler.trim() }).eq("id", userId);
    if (error) { setError(error.message); return; }
    resume.current.handler = true;
    go("photo");
  };

  // ---- Photo
  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoDataUrl(URL.createObjectURL(f));
    setError("");
    go("crop");
  };
  const skipPhoto = () => go("theme");

  const applyCrop = async (dataUrl: string, blob: Blob) => {
    if (!userId) return;
    setPhotoBusy(true); setError("");
    const path = `${userId}/avatar-${Date.now()}.png`;
    const up = await supabase.storage.from("avatars").upload(path, blob, { upsert: true, contentType: "image/png" });
    if (up.error) { setError(up.error.message); setPhotoBusy(false); return; }
    const pr = await supabase.from("profiles").update({ avatar_url: path }).eq("id", userId);
    if (pr.error) { setError(pr.error.message); setPhotoBusy(false); return; }
    setPhotoPreview(RowAvatarUrl(path));
    if (photoDataUrl) URL.revokeObjectURL(photoDataUrl);
    setPhotoDataUrl(null);
    resume.current.photo = true;
    setPhotoBusy(false);
    go("theme");
  };

  // ---- Theme
  const pickPreset = (a: (typeof ACCENT_PRESETS)[number]) => { const h = { h: a.h, s: a.s, l: a.l }; setCurrent(h); setHue(a.h); applyAccent(h, mode); };
  const onHue = (v: number) => { const h = { h: v, s: current.s, l: current.l }; setCurrent(h); setHue(v); applyAccent(h, mode); };
  const pickMode = (m: ThemeMode) => { setMode(m); applyMode(m); applyAccent(current, m); };
  const isOn = (a: (typeof ACCENT_PRESETS)[number]) => Math.round(current.h) === Math.round(a.h) && Math.round(current.s) === Math.round(a.s) && Math.round(current.l) === Math.round(a.l);

  const applyTheme = async () => {
    if (userId) await supabase.from("profiles").update({ accent: serializeHSL(current), theme_mode: mode }).eq("id", userId);
    resume.current.theme = true;
    go("import");
  };

  // ---- Import (optional) -> finish setup -> app fires the coach tour.
  const finishSetup = async () => {
    if (userId) await supabase.from("profiles").update({ onboarding_step: 4 }).eq("id", userId);
    router.push("/app");
    router.refresh();
  };

  if (!ready) return <div className="min-h-screen grid place-items-center"><div className="skeleton h-24 w-64" /></div>;

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-5">
        <span className="inline-flex items-center gap-2.5">
          <TalbyLogo width={24} />
          <span className="font-bold text-lg tracking-tight">Talby</span>
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-2 mb-8 justify-center">
            {PHASES.map((p) => (
              <span key={p} className={cn("h-1.5 rounded-full transition-all", p <= headerActive(step) ? "w-6 accent-fill" : "w-3 bg-line2")} />
            ))}
          </div>

          {step === "handle" && (
            <div className="fade-up">
              <h1 className="text-2xl font-semibold text-center tracking-tight">What should we call you?</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">This is the creator handle we greet you by.</p>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft font-medium">@</span>
                <Input value={handler} onChange={(e) => setHandler(e.target.value.replace(/\s/g, ""))}
                  placeholder="creatorhandle" className="pl-9" autoFocus maxLength={30} />
              </div>
              {error && <p className="text-sm text-late text-center mt-3" role="alert">{error}</p>}
              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={advanceFromHandle} disabled={!handler.trim()}>Continue <IconArrowRight size={16} /></Button>
              </div>
            </div>
          )}

          {step === "photo" && (
            <div className="fade-up text-center">
              <h1 className="text-2xl font-semibold text-center tracking-tight">Add a profile photo</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">Nice to put a face to your deals.</p>
              <button onClick={() => fileRef.current?.click()} className="mx-auto relative h-28 w-28 rounded-full overflow-hidden bg-card2 border border-line2 hover:border-[var(--accent)] transition-colors cursor-pointer grid place-items-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <IconCamera size={30} className="text-inksoft" />
                )}
              </button>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Button size="lg" onClick={() => fileRef.current?.click()}>Choose a photo</Button>
                <button onClick={skipPhoto} className="text-sm text-muted hover:text-ink cursor-pointer">Skip for now</button>
              </div>
            </div>
          )}

          {step === "crop" && photoDataUrl && <CropStepView src={photoDataUrl} busy={photoBusy} error={error} onApply={applyCrop} onBack={() => { resume.current.photo = false; go("photo"); }} />}

          {step === "theme" && (
            <div className="fade-up">
              <h1 className="text-2xl font-semibold text-center tracking-tight">Pick a color that feels like you</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">The preview below re-tints live. You can change it anytime in Settings.</p>
              <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                <div className="w-full min-w-0"><DashboardPreview /><p className="text-center text-[11px] text-inkfaint mt-3">This is what your dashboard will look like.</p></div>
                <div className="bg-card border border-line rounded-2xl p-5 shadow-card md:w-[240px]">
                  <div className="text-xs font-semibold mb-3 text-ink">Appearance</div>
                  <div className="flex gap-1 p-1 rounded-xl bg-card2 mb-4">
                    {(["light", "dark"] as const).map((m) => (
                      <button key={m} onClick={() => pickMode(m)} className={cn("flex-1 h-8 rounded-lg text-[12.5px] font-semibold cursor-pointer transition-colors", mode === m ? "bg-card text-ink shadow-sm border border-line2" : "text-inkfaint hover:text-ink")}>{m === "light" ? "Light" : "Dark"}</button>
                    ))}
                  </div>
                  <div className="text-xs font-semibold mb-3 text-ink">Accent color</div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {ACCENT_PRESETS.map((a) => (
                      <button key={a.name} onClick={() => pickPreset(a)} aria-label={a.name}
                        className={cn("h-10 rounded-xl cursor-pointer transition-transform hover:scale-105 grid place-items-center", isOn(a) && "ring-2 ring-ink ring-offset-2")}
                        style={{ background: `hsl(${a.h},${a.s}%,${a.l}%)` }}>
                        {isOn(a) && <IconCheck size={16} className="text-onaccent" />}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-inkfaint mt-4 mb-2">Or drag for any shade</div>
                  <input type="range" className="hue" min={0} max={360} value={hue} aria-label="Accent hue" onChange={(e) => onHue(Number(e.target.value))} />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="secondary" onClick={() => go("photo")}>Back</Button>
                <Button size="lg" onClick={applyTheme}>Continue <IconArrowRight size={16} /></Button>
                <Button variant="ghost" onClick={() => go("import")}>Skip</Button>
              </div>
            </div>
          )}

          {step === "import" && (
            <div className="fade-up text-center">
              <h1 className="text-2xl font-semibold text-center tracking-tight">Already have deals?</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">Bring your pipeline in from a spreadsheet or Notion so it&apos;s waiting for you. Optional, and you can do it anytime.</p>
              <div className="mx-auto max-w-xs flex flex-col items-stretch gap-2.5">
                <a href="/app/import"><Button variant="secondary" size="lg" className="w-full"><NotionMark /> Import deals</Button></a>
                <Button size="lg" onClick={finishSetup}>Continue <IconArrowRight size={16} /></Button>
              </div>
              <button onClick={() => go("theme")} className="mt-6 text-sm text-muted hover:text-ink cursor-pointer inline-flex items-center gap-1"><IconArrowLeft size={15} /> Back</button>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={pickFile} />
        </div>
      </main>
    </div>
  );
}

function RowAvatarUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return path.startsWith("http") ? path : `${base}/storage/v1/object/public/avatars/${path}`;
}

/** Crop step: back arrow + "Edit photo" title, crop editor, Apply bottom center
 *  (in line with every other onboarding screen). The CropEditor exposes apply()
 *  via ref so the Apply button triggers the exact-frame render. */
function CropStepView({ src, busy, error, onApply, onBack }: {
  src: string; busy: boolean; error: string;
  onApply: (d: string, b: Blob) => void; onBack: () => void;
}) {
  const editorRef = useRef<CropEditorHandle | null>(null);
  return (
    <div className="fade-up">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} aria-label="Back" className="p-2 -ml-2 rounded-lg hover:bg-card2 cursor-pointer"><IconArrowLeft size={18} /></button>
        <h1 className="text-xl font-semibold tracking-tight">Edit photo</h1>
        <span className="w-9" />
      </div>
      <CropEditor ref={editorRef} src={src} onApply={onApply} />
      {error && <p className="text-sm text-late text-center mt-3" role="alert">{error}</p>}
      <div className="mt-8 flex justify-center">
        <Button size="lg" disabled={busy} onClick={() => editorRef.current?.apply()}>
          {busy ? "Saving…" : (<><IconCheck size={16} /> Apply</>)}
        </Button>
      </div>
    </div>
  );
}