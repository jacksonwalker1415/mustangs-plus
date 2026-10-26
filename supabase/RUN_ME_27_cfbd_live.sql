-- SMU+ live football data from CollegeFootballData.com (applied 2026-10-26 via migrations cfbd_live_scores + cfbd_cron).
-- Tables: public.live_games, public.game_plays (anon/authenticated SELECT only; writes by the service role only),
-- public.cfbd_sync_state (no public access). Secrets: Vault "cfbd_api_key" and "cfbd_cron_token" (never in this repo).
-- Edge function: supabase/functions/cfbd-sync (verify_jwt off; it checks x-cron-token against Vault).

-- 1) tables (migration cfbd_live_scores + cfbd_tbd_flag)
create extension if not exists pg_cron;
create extension if not exists pg_net;
create table if not exists public.live_games (
  game_id bigint primary key, season int not null, week int, season_type text, start_date timestamptz,
  start_time_tbd boolean not null default false, home_team text not null, away_team text not null,
  home_points int, away_points int, home_line_scores int[], away_line_scores int[],
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','final')),
  period int, clock text, possession text, situation text, last_play text,
  plays_loaded boolean not null default false, updated_at timestamptz not null default now());
create table if not exists public.game_plays (
  play_id text primary key, game_id bigint not null references public.live_games(game_id) on delete cascade,
  seq int not null, period int, clock text, offense text, home_score int, away_score int,
  play_type text, play_text text, yards int, scoring boolean, updated_at timestamptz not null default now());
create index if not exists game_plays_game_seq on public.game_plays (game_id, seq desc);
create table if not exists public.cfbd_sync_state (id int primary key default 1 check (id = 1), tier_ok boolean,
  calls_remaining int, last_mode text, last_run timestamptz, last_error text);
insert into public.cfbd_sync_state (id) values (1) on conflict do nothing;
alter table public.live_games enable row level security;
alter table public.game_plays enable row level security;
alter table public.cfbd_sync_state enable row level security;
create policy "live_games read" on public.live_games for select to anon, authenticated using (true);
create policy "game_plays read" on public.game_plays for select to anon, authenticated using (true);
revoke all on public.live_games, public.game_plays, public.cfbd_sync_state from anon, authenticated;
grant select on public.live_games, public.game_plays to anon, authenticated;
grant all on public.live_games, public.game_plays, public.cfbd_sync_state to service_role;
-- Secrets are created once in the SQL editor / out of band, never in this file:
--   vault.create_secret('<key>', 'cfbd_api_key')  and  vault.create_secret(encode(gen_random_bytes(32),'hex'), 'cfbd_cron_token')
create or replace function public.cfbd_secret(p_name text)
returns text language sql security definer set search_path = '' as $$
  select decrypted_secret from vault.decrypted_secrets
  where name = p_name and p_name in ('cfbd_api_key','cfbd_cron_token') limit 1
$$;
revoke all on function public.cfbd_secret(text) from public, anon, authenticated;
grant execute on function public.cfbd_secret(text) to service_role;

-- 2) cron (migration cfbd_cron; cfbd_tick updated in cfbd_tbd_flag to skip games whose time is TBA)

-- Calls the edge function with the Vault token. pg_net is async; nothing waits on the response.
create or replace function public.cfbd_invoke(p_mode text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare tok text;
begin
  select decrypted_secret into tok from vault.decrypted_secrets where name = 'cfbd_cron_token';
  if tok is null then return null; end if;
  return net.http_post(
    url := 'https://lpoguzstqpwzcmjxeaik.supabase.co/functions/v1/cfbd-sync',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-token',tok),
    body := jsonb_build_object('mode', p_mode),
    timeout_milliseconds := 30000);
end $$;
revoke all on function public.cfbd_invoke(text) from public, anon, authenticated;

-- Runs every minute; only calls CFBD while an SMU football game is in its live window:
-- from 15 minutes before kickoff until CFBD marks it final (hard stop 6 hours after kickoff).
-- Every minute on Tier 2; every 5 minutes if the key is on the free tier (no live scoreboard).
create or replace function public.cfbd_tick()
returns void language plpgsql security definer set search_path = '' as $$
declare live boolean; tier boolean;
begin
  select exists (select 1 from public.live_games
                 where status <> 'final' and not start_time_tbd and start_date <= now() + interval '15 minutes'
                   and start_date >= now() - interval '6 hours') into live;
  if not live then return; end if;
  select tier_ok into tier from public.cfbd_sync_state where id = 1;
  if coalesce(tier, true) or extract(minute from now())::int % 5 = 0 then
    perform public.cfbd_invoke('live');
  end if;
end $$;
revoke all on function public.cfbd_tick() from public, anon, authenticated;

select cron.unschedule(jobname) from cron.job where jobname in ('cfbd-live-tick','cfbd-schedule');
select cron.schedule('cfbd-live-tick', '* * * * *', 'select public.cfbd_tick()');
-- schedule + finals + play-by-play backfill: 4x a day (00:20, 06:20, 12:20, 18:20 UTC)
select cron.schedule('cfbd-schedule', '20 */6 * * *', $$select public.cfbd_invoke('schedule')$$);
