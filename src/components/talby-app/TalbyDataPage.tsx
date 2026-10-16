"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TalbyPage from "@/components/talby-app/TalbyPage";
import { makeOnAction } from "@/lib/talby/actions";
import type { AccountData } from "@/components/talby/_data";

export type LoadResult = {
  data: unknown;
  account: AccountData;
  plan: string;
  look: { theme: string; mode: string; sidebar: string } | null;
  empty: boolean;
  readOnly: boolean;
};

export type Loader = (supabase: ReturnType<typeof createClient>) => Promise<LoadResult>;

/** Generic board page: runs `load`, manages view/error/loading, passes data + account + onAction. */
export default function TalbyDataPage({ board, load }: { board: string; load: Loader }) {
  const supabase = createClient();
  const [view, setView] = useState<"loading" | "sample" | "empty" | "error">("loading");
  const [result, setResult] = useState<LoadResult | null>(null);

  const run = useCallback(async () => {
    setView("loading");
    try {
      const r = await load(supabase);
      setResult(r);
      setView(r.empty ? "empty" : "sample");
    } catch (e) {
      console.error(`${board} load`, e);
      setView("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  useEffect(() => { run(); }, [run]);

  const onAction = makeOnAction(supabase, run, result?.readOnly ?? false);

  return (
    <TalbyPage
      board={board}
      props={{ view, plan: result?.plan ?? "active", data: result?.data ?? null, account: result?.account ?? null, onAction }}
      look={result?.look ?? null}
    />
  );
}
