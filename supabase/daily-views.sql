-- LUMINA daily analytics — run AFTER schema.sql + analytics.sql.
-- Per-day view counts so the dashboard can chart recent traffic.

create table if not exists public.portfolio_daily_views (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  portfolio_slug text not null,
  day date not null default current_date,
  count integer not null default 0,
  unique (portfolio_slug, day)
);

alter table public.portfolio_daily_views enable row level security;

create policy "Owners read their daily views"
  on public.portfolio_daily_views for select
  using (auth.uid() = owner_id);

create index if not exists pdv_owner_day_idx
  on public.portfolio_daily_views (owner_id, day desc);

-- Upsert today's row (+1). Called from /api/track via the service role.
create or replace function public.increment_daily_view(p_slug text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_owner uuid;
begin
  select user_id into v_owner from public.portfolios
    where slug = p_slug and published = true;
  if v_owner is null then
    return;
  end if;
  insert into public.portfolio_daily_views (owner_id, portfolio_slug, day, count)
    values (v_owner, p_slug, current_date, 1)
    on conflict (portfolio_slug, day)
    do update set count = public.portfolio_daily_views.count + 1;
end;
$$;
