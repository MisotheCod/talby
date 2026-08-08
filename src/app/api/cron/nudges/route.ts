import { NextResponse } from "next/server";
import { runAutoNudgeEngine } from "@/lib/nudge-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Vercel Cron: daily. The route verifies the CRON_SECRET to prevent
// unauthorized invocations. Runs the auto-nudge rules engine.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await runAutoNudgeEngine();
    return NextResponse.json(result);
  } catch (e) {
    console.error("nudge cron error", e);
    return NextResponse.json({ error: "engine failed" }, { status: 500 });
  }
}
