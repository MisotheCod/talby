"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconEye, IconEyeInvisible } from "@/components/icons";
import { Button, Input } from "@/components/ui";

export function ResetForm() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/onboarding");
    router.refresh();
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm card p-6">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">New password</span>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
              <button type="button" onClick={() => setShowPw((s) => !s)} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted cursor-pointer">
                {showPw ? <IconEyeInvisible size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </label>
          {error && <p className="text-sm text-bad" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving…" : "Save new password"}</Button>
        </form>
      </div>
    </div>
  );
}
