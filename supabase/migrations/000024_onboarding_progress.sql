-- 000024: onboarding progress marker.
-- Lets a returning user resume where they left off (setup progresses in order
-- and closing mid-flow doesn't restart from zero). Stored on the profile with
-- every other durable onboarding setting.
alter table public.profiles
  add column if not exists onboarding_step integer not null default 0;