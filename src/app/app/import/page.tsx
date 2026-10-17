"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * The old standalone /app/import page is retired: the New deal dialog's import
 * flows now live on /app/deals. This stub only keeps legacy deep links working
 * by sending the user to the deal flow with the right start step (Notion vs
 * upload/csv). No import happens here anymore.
 */
function ImportRedirect() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const src = sp.get("source");
    router.replace(src === "notion" ? "/app/deals?start=notion" : "/app/deals?start=upload");
  }, [router, sp]);
  return null;
}

export default function ImportPage() {
  return (
    <Suspense fallback={null}>
      <ImportRedirect />
    </Suspense>
  );
}
