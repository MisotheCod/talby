-- ============================================================
-- 000047_trial_email_flags.sql
-- Idempotency flags for the trial lifecycle emails, so the cron
-- and the signup-time welcome never double-send.
--
--   trial_email_welcome_sent   timestamptz  (set after welcome)
--   trial_email_reminder_sent  timestamptz  (set after 3-day reminder)
--   trial_email_ended_sent     timestamptz  (set after trial-ended)
-- ============================================================

alter table public.profiles
  add column if not exists trial_email_welcome_sent timestamptz;

alter table public.profiles
  add column if not exists trial_email_reminder_sent timestamptz;

alter table public.profiles
  add column if not exists trial_email_ended_sent timestamptz;