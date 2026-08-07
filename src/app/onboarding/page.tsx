"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS } from "@/lib/config";
import { cn } from "@/lib/utils";
import { IconCheck, IconArrowRight } from "@/components/icons";
import { Button, Input } from "@/components/ui";

function accentName(id: string) {
  return ACCENT_PRESETS.find((a) => a.id === id)?.name ?? id;
}

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [handler, setHandler] = useState("");
  const [accent, setAccent] = useState("coral");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        // Prefill current settings if present.
        supabase.from("profiles").select("handler, accent").eq("id", data.user.id).single()
          .then((p) => {
            const row = p.data as unknown as { handler: string | null; accent: string } | null;
            if (row?.handler) setHandler(row.handler);
            if (row?.accent) { setAccent(row.accent); document.documentElement.setAttribute("data-accent", row.accent); }
          });
      }
    });
  }, [supabase]);

  const save = async () => {
    if (!userId) { setError("You need to be signed in first."); return; }
    setSaving(true);
    setError("");
    const { error } = await supabase.from("profiles").update({
      handler: handler.trim() || null,
      accent,
    }).eq("id", userId);
    setSaving(false);
    if (error) { setError(error.message); return; }
    router.push("/app");
    router.refresh();
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-5">
        <span className="inline-flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg accent-fill grid place-items-center text-xs font-bold">T</span>
          <span className="font-display font-semibold text-lg tracking-tight">Talby</span>
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            {[1, 2].map((n) => (
              <span key={n} className={cn("h-1.5 rounded-full transition-all", step === n ? "w-8 accent-fill" : "w-4 bg-border")} />
            ))}
          </div>

          {step === 1 && (
            <div key="s1" className="fade-up">
              <h1 className="text-2xl font-semibold text-center">What should we call you?</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">
                This is the creator handle we&apos;ll greet you with.
              </p>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-medium">@</span>
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
              <h1 className="text-2xl font-semibold text-center">Pick a color that feels like you</h1>
              <p className="text-muted text-sm text-center mt-1.5 mb-8">
                Pick a preset now — you can change it anytime in Settings.
              </p>

              {/* Preset swatches */}
              <div className="grid grid-cols-3 gap-3">
                {ACCENT_PRESETS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setAccent(a.id); document.documentElement.setAttribute("data-accent", a.id); }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors cursor-pointer",
                      accent === a.id ? "border-accent bg-subtle" : "border-border hover:bg-subtle"
                    )}
                  >
                    <span
                      className="h-9 w-9 rounded-full grid place-items-center shadow-sm"
                      style={{ background: a.color }}
                    >
                      {accent === a.id && <IconCheck size={18} className="text-white" />}
                    </span>
                    <span className="text-xs font-medium">{a.name}</span>
                  </button>
                ))}
              </div>

              {error && <p className="text-sm text-bad text-center mt-4" role="alert">{error}</p>}

              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : `Finish with ${accentName(accent)}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
