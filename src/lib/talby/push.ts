// Server only. Sends an alert to every phone a user turned alerts on for.
// npm install web-push  (and npm install -D @types/web-push)
// Env (Vercel and .env.local, never in chat or git):
//   NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT=mailto:hello@talby.io
// Make the keys once with:  npx web-push generate-vapid-keys
import 'server-only';
import webpush from 'web-push';
import type { SupabaseClient } from '@supabase/supabase-js';

let ready = false;
function setup() {
  if (ready) return;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:hello@talby.io', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
  ready = true;
}

export type TalbyAlert = { title: string; body: string; url?: string; tag?: string };

/** admin must be the service role client (it reads every subscription for the user). */
export async function sendAlert(admin: SupabaseClient, userId: string, alert: TalbyAlert) {
  setup();
  const { data: subs } = await admin.from('push_subscriptions').select('id, endpoint, p256dh, auth').eq('user_id', userId);
  let sent = 0;
  for (const s of subs || []) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(alert), { TTL: 60 * 60 * 24 });
      sent++;
    } catch (e: any) {
      // 404 and 410 mean the phone removed Talby or turned alerts off. Drop that subscription.
      if (e && (e.statusCode === 404 || e.statusCode === 410)) await admin.from('push_subscriptions').delete().eq('id', s.id);
    }
  }
  return sent;
}
