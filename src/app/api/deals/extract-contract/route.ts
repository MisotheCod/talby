import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENROUTER_API_KEY } from "@/lib/server-config";
import { userIsReadOnly } from "@/lib/write-access";
import { readContractText, extractDealFields, ownerIdentityOf } from "@/lib/contract-extract";

export const dynamic = "force-dynamic";
// Contract text extraction is CPU/IO bound; Node runtime keeps unpdf's worker happy.
export const runtime = "nodejs";

/**
 * Contract upload -> auto-pulled deal.
 * POST /api/deals/extract-contract  (multipart form data, field "file")
 * Extraction lives in @/lib/contract-extract, shared with /api/upload/contract.
 * Returns { ok, fields, text } so the existing client keeps working unchanged.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (await userIsReadOnly(user.id)) {
    return NextResponse.json({ error: "Contract auto-fill is available on the Unlimited plan. Subscribe to keep using it." }, { status: 403 });
  }
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Extraction AI is not configured." }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const read = await readContractText(file);
  if ("code" in read) {
    const message = read.code === "too_big"
      ? "File too large (max 20 MB)."
      : read.code === "bad_type"
        ? "Please upload a PDF, Word (.docx), or text file."
        : "Couldn't read any text from that file.";
    const status = read.code === "too_big" ? 413 : read.code === "bad_type" ? 415 : 422;
    return NextResponse.json({ error: message, code: read.code }, { status });
  }

  let fields: Record<string, unknown>;
  try {
    // Owner identity is passed so the reader never mistakes the creator for the brand's rep.
    fields = await extractDealFields(read.text, ownerIdentityOf(user));
  } catch (err) {
    // Never crash serverless with an uncaught throw: that yields an HTML 500,
    // which the client misreads as "could not reach the contract parser."
    console.error("extract-contract field error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "The extraction AI returned an error. Please re-try, or add the deal manually.", code: "unreadable" },
      { status: 502 }
    );
  }
  // Return the extracted text too (additive) so the client can hand it to the
  // assistant ingest route for chunking + embedding. Extraction itself is unchanged.
  return NextResponse.json({ ok: true, fields, text: read.text });
}
