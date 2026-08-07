"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, applyAccent, DEFAULT_HSL, parseHSL, serializeHSL, type HSL } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { IconCheck, IconArrowRight } from "@/components/icons";
import { Button, Input } from "@/components/ui";
import { DashboardPreview } from "@/components/dashboard-preview";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [handler, setHandler] = useState("");
  const [current, setCurrent] = useState<HSL>(DEFAULT_HSL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hue, setHue] = useState(DEFAULT_HSL.h);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("profiles").select("handler, accent").eq("id", data.user.id).single()
          .then((p) => {
            const row = p.data as unknown as { handler: string | null; accent: string } | null;
            if (row?.handler) setHandler(row.handler);
            if (row?.accent) {
              const hsl = parseHSL(row.accent) ?? DEFAULT_HSL;
              setCurrent(hsl);
              setHue(hsl.h);
              applyAccent(hsl);
            } else {
              applyAccent(DEFAULT_HSL);
            }
          });
      } else {
        applyAccent(DEFAULT_HSL);
      }
    });
  }, [supabase]);

  // Apply accent live whenever the user picks a preset or drags the hue.
  const pickPreset = (p: (typeof ACCENT_PRESETS)[number]) => {
    const hsl = { h: p.h, s: p.s, l: p.l };
    setCurrent(hsl);
    setHue(p.h);
    applyAccent(hsl);
  };
  const onHue = (val: number) => {
    const hsl = { h: val, s: current.s, l: current.l };
    setCurrent(hsl);
    setHue(val);
    applyAccent(hsl);
  };

  const isOn = (p: (typeof ACCENT_PRESETS)[number]) =>
    Math.round(current.h) === Math.round(p.h) &&
    Math.round(current.s) === Math.round(p.s) &&
    Math.round(current.l) === Math.round(p.l);

  const save = async () => {
    if (!userId) { setError("You need to be signed in first."); return; }
    setSaving(true);
    setError("");
    const { error } = await supabase.from("profiles").update({
      handler: handler.trim() || null,
      accent: serializeHSL(current),
    }).eq("id", userId);
    setSaving(false);
    if (error) { setError(error.message); return; }
    router.push("/app");
    router.refresh();
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-5">
        <span className="inline-flex items-center gap-2.5">
          <span className="sb-mark" aria-hidden />
          <span className="font-bold text-lg tracking-tight">Talby</span>
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            {[1, 2].map((n) => (
              <span key={n} className={cn("h-1.5 rounded-full transition-all", step === n ? "w-8 accent-fill" : "w-4 bg-line2")} />
            ))}
          </div>

          {step === 1 && (
            <div key="s1" className="fade-up">
              <h1 className="text-2xl font-semibold text-center tracking-tight">What should we call you?</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">
                This is the creator handle we&apos;ll greet you with.
              </p>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft font-medium">@</span>
                <Input
                  value={handler}
                  onChange={(e) => setHandler(e.target.value.replace(/\s/g, ""))}
                  placeholder="creatorhandle"
                  className="pl-9"
                  autoFocus
                  maxLength={30}
                />
              </div>
              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={() => setStep(2)} disabled={!handler.trim()}>
                  Continue <IconArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div key="s2" className="fade-up">
              <h1 className="text-2xl font-semibold text-center tracking-tight">Pick a color that feels like you</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">
                The preview below re-tints live. You can change it anytime in Settings.
              </p>

              <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                {/* Live dashboard preview */}
                <div className="w-full min-w-0">
                  <DashboardPreview />
                  <p className="text-center text-[11px] text-inkfaint mt-3">
                    This is what your dashboard will look like.
                  </p>
                </div>

                {/* Preset swatches + hue slider */}
                <div className="bg-card border border-line rounded-2xl p-5 shadow-card md:w-[240px]">
                  <div className="text-xs font-semibold mb-3 text-ink">Accent color</div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {ACCENT_PRESETS.map((a) => (
                      <button
                        key={a.name}
                        onClick={() => pickPreset(a)}
                        aria-label={a.name}
                        className={cn(
                          "h-10 rounded-xl cursor-pointer transition-transform hover:scale-105 grid place-items-center",
                          isOn(a) && "ring-2 ring-ink ring-offset-2"
                        )}
                        style={{ background: `hsl(${a.h},${a.s}%,${a.l}%)` }}
                      >
                        {isOn(a) && <IconCheck size={16} className="text-onaccent" />}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-inkfaint mt-4 mb-2">Or drag for any shade</div>
                  <input
                    type="range"
                    className="hue"
                    min={0}
                    max={360}
                    value={hue}
                    aria-label="Accent hue"
                    onChange={(e) => onHue(Number(e.target.value))}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-late text-center mt-4" role="alert">{error}</p>}

              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Finish"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
