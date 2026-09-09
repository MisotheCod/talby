import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { countContentFor, countLines } from "@/lib/account-deletion";

export const dynamic = "force-dynamic";

/** Real counts for the confirmation modals, pulled from the user's own data. */
export async function GET() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { data: profile } = await client
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = (profile as unknown as { plan?: string } | null)?.plan ?? "free";
  const counts = await countContentFor(client, user.id);

  return NextResponse.json({
    email: user.email ?? "",
    plan,
    counts,
    lines: countLines(counts),
  });
}