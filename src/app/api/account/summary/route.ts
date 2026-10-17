import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { countContentFor, countLines } from "@/lib/account-deletion";
import { currentPlanState } from "@/lib/plan-gate";

export const dynamic = "force-dynamic";

/** Real counts for the confirmation modals, pulled from the user's own data. */
export async function GET() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { hasAccess } = await currentPlanState(user.id);
  const plan = hasAccess ? "paid" : "free";
  const counts = await countContentFor(client, user.id);

  return NextResponse.json({
    email: user.email ?? "",
    plan,
    counts,
    lines: countLines(counts),
  });
}