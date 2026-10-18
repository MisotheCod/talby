import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Saves this phone's alert subscription for the signed in user.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: 'auth' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const sub = body && body.subscription;
  if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: user.id, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth,
    user_agent: String(body.userAgent || '').slice(0, 400), updated_at: new Date().toISOString(),
  }, { onConflict: 'endpoint' });
  if (error) return NextResponse.json({ code: 'failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
