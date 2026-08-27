-- 000025: inbox last-scanned timestamp on the gmail connection.
-- Lets the inbox page show "Last scanned" and lets us tell an account that's
-- connected but whose token is dead to re-connect instead of "connect Gmail".
alter table public.gmail_connections
  add column if not exists last_scanned_at timestamptz;