-- 000023: one-time onboarding coach tour flag.
-- Profiles gains `tour_seen` (default false). The app-shell shows a guided
-- overlay spotlighting the nav / Add deal / inbox scan / Talby Assistant the
-- first time a user lands on the Overview, then sets this true so it never
-- re-appears. A user re-onboarding (or a fresh account) sees it once per user.
alter table public.profiles
  add column if not exists tour_seen boolean not null default false;