import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** POST /api/account/change-password
 *  Secure password change. Verifies the CURRENT password before applying the
 *  new one (a session token alone is not enough), updates via Supabase Auth,
 *  then emails the account a "password changed" alert so the user knows the
 *  instant it happens if it wasn't them.
 *  Supabase has no native password-change email; this is the app's own guard.
 *  The Resend key stays server-side. */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (typeof currentPassword !== "string" || !currentPassword) {
    return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
  }

  const email = user.email;
  if (!email) return NextResponse.json({ error: "No email on this account." }, { status: 400 });

  // 1) Prove the current password. signInWithPassword validates credentials and
  //    fails with 'invalid_credentials' if wrong.
  const { error: verifyErr } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (verifyErr) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  // 2) Apply the change. The just-verified sign-in is a fresh recent session,
  //    which the reauth window requires.
  const { error: upErr } = await supabase.auth.updateUser({ password: newPassword });
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  // 3) Notify the account the password changed.
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.talby.io";
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1d23">
        <h2 style="margin:0 0 8px">Your Talby password was changed</h2>
        <p style="margin:0 0 12px;color:#5c6470;font-size:15px;line-height:1.5">This is a security alert.
          If you made this change, nothing else is needed. If it wasn't you, reset your password right away
          to lock the account back down.</p>
        <a href="${base}/forgot-password" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:15px">Reset password</a>
        <p style="margin:16px 0 0;color:#8a919c;font-size:13px">Talby · brand deals for creators · talby.io</p>
      </div>`;
    const text = `Your Talby password was changed.\n\nThis is a security alert. If you made this change, nothing else is needed. If it wasn't you, reset your password right away: ${base}/forgot-password`;
    try {
      await resendSend(key, email, html, text);
    } catch (e) {
      // The password change still succeeded; the alert email must not fail it.
      console.error("password-change alert send error", String(e).slice(0, 200));
    }
  }

  return NextResponse.json({ ok: true });
}

function resendSend(key: string, to: string, html: string, text: string) {
  const resend = new Resend(key);
  return resend.emails.send({
    from: process.env.RESEND_FROM || "Talby <digest@talby.io>",
    to: [to],
    subject: "Your Talby password was changed",
    html,
    text,
  });
}