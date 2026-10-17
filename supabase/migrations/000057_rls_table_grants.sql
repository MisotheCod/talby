-- 000057_rls_table_grants.sql
-- Ensure PostgREST roles can use the public tables through RLS.
-- Production already carries these grants (created before the redesign). New
-- environments and Supabase branches created by replaying the migrations do NOT
-- inherit them, which silently breaks every authenticated write (and read) that
-- goes through the user scoped client -> 42501 "permission denied for table".
-- GRANT is idempotent, so re-running on production is a safe no-op and makes the
-- grants durable instead of relying on whatever created them originally.
grant select, insert, update, delete on all tables in schema public to authenticated, anon;
grant usage, select on all sequences in schema public to authenticated, anon;
