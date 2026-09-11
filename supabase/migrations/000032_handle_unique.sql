-- Enforce unique creator handles at the database level.
--
-- The Settings handle save previously ran a client-side "is this taken?" query,
-- but the profiles RLS policy (for select using auth.uid() = id) hides other
-- users' rows, so the check silently saw nothing and a duplicate still saved.
-- That produced two accounts with the same handle. The authoritative guard must
-- live on the column, where RLS does not apply.
--
-- Why a case-insensitive unique INDEX (not a constraint / not the client):
--  * the index is RLS-proof, so it fires on every write path (settings, and
--    the upcoming onboarding handle step) even though clients can't see peers
--  * lower(handler) makes "DiagNewHandle" and "diagnewhandle" the same handle
--  * NULLs are distinct in a Postgres unique index, and most profiles have a
--    NULL handler, so they coexist freely
--
-- Existing data was de-duplicated before applying (test rows shifted to unique
-- values), so this should apply cleanly on a healthy DB.

create unique index if not exists profiles_handler_lower_uq
  on public.profiles (lower(handler));