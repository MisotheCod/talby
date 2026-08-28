-- 000026: Gmail OAuth removal + nudges become draft reminders.
--
-- Sending is gone. Talby no longer mints Gmail tokens or sends on the user's
-- behalf; it GENERATES reminder items the user copies/starts themselves.
-- The `nudges` table is repurposed as the reminder store:
--   status 'ready'    -> an outstanding reminder the user can act on
--   status 'handled'  -> user copied / opened-in-email / marked manually
--   (legacy 'draft'/'sent'/'skipped' rows are kept; engine writes ready/handled)
--
-- The stored Google token table is dropped: no OAuth remains, so no tokens.

-- --- expand nudges status + add reminder fields ---
alter table public.nudges
  drop constraint if exists nudges_status_check;
alter table public.nudges
  alter column status set default 'ready';
alter table public.nudges
  add column if not exists rep_email text,
  add column if not exists handled_at timestamptz;
alter table public.nudges
  drop constraint if exists nudges_status_check;
alter table public.nudges
  add constraint nudges_status_check
    check (status in ('ready','handled','draft','sent','skipped'));

-- --- drop stored Google OAuth tokens ---
drop table if exists public.gmail_connections;