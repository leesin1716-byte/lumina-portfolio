-- LUMINA referrer analytics — run AFTER schema.sql + analytics.sql.
-- Aggregates where each portfolio's visits come from (per source host), so the
-- dashboard can show a "유입 경로" breakdown alongside the daily-view chart.

create table if not exists public.portfolio_referrers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  portfolio_slug text not null,
  source text not null,
  count integer not null default 0,
  unique (portfolio_slug, source)
);

alter table public.portfolio_referrers enable row level security;

create policy "Owners read their referrers"
  on public.portfolio_referrers for select
  using (auth.uid() = owner_id);

create index if not exists pr_owner_count_idx
  on public.portfolio_referrers (owner_id, count desc);

-- Upsert a source row (+1) for a published portfolio. Called from /api/track
-- via the service role; the source is already normalized server-side.
create or replace function public.increment_referrer(p_slug text, p_source text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_owner uuid;
begin
  select user_id into v_owner from public.portfolios
    where slug = p_slug and published = true;
  if v_owner is null then
    return;
  end if;
  insert into public.portfolio_referrers (owner_id, portfolio_slug, source, count)
    values (
      v_owner,
      p_slug,
      left(coalesce(nullif(trim(p_source), ''), 'direct'), 120),
      1
    )
    on conflict (portfolio_slug, source)
    do update set count = public.portfolio_referrers.count + 1;
end;
$$;
