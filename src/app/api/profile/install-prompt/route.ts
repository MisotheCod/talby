import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Records a "Not now" on the Get the app prompt.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: 'auth' }, { status: 401 });
  const b = await req.json().catch(() => null);
  const n = Number(b && b.dismissals);
  const at = b && typeof b.lastDismissed === 'string' && !isNaN(Date.parse(b.lastDismissed)) ? b.lastDismissed : new Date().toISOString();
  if (!Number.isFinite(n) || n < 0 || n > 99) return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  const { error } = await supabase.from('profiles').update({ install_prompt_dismissals: Math.round(n), install_prompt_last_dismissed: at }).eq('id', user.id);
  if (error) return NextResponse.json({ code: 'failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
