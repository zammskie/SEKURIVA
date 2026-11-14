create type public.app_role as enum ('student', 'admin');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create function public.create_profile_for_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_profile_for_user();

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

create table public.simulation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  outcome text not null check (outcome in ('safe', 'mixed', 'risky')),
  choice_history jsonb not null check (jsonb_typeof(choice_history) = 'array'),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  check (started_at <= completed_at)
);
create index simulation_runs_user_time on public.simulation_runs(user_id, completed_at desc);

create table public.material_content (
  id text primary key,
  title text not null check (length(trim(title)) > 0),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.scenario_content (
  id text primary key,
  title text not null check (length(trim(title)) > 0),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.simulation_runs enable row level security;
alter table public.material_content enable row level security;
alter table public.scenario_content enable row level security;
revoke all on public.profiles, public.simulation_runs, public.material_content, public.scenario_content from anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert on public.simulation_runs to authenticated;
grant select, insert, update, delete on public.material_content, public.scenario_content to authenticated;
grant execute on function public.is_admin() to authenticated;

create policy "profile own or admin read" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));
create policy "run own or admin read" on public.simulation_runs for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "run own insert" on public.simulation_runs for insert to authenticated
with check (user_id = (select auth.uid()));
create policy "published material or admin read" on public.material_content for select to authenticated
using (published or (select public.is_admin()));
create policy "admin material insert" on public.material_content for insert to authenticated
with check ((select public.is_admin()));
create policy "admin material update" on public.material_content for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin material delete" on public.material_content for delete to authenticated
using ((select public.is_admin()));
create policy "published scenario or admin read" on public.scenario_content for select to authenticated
using (published or (select public.is_admin()));
create policy "admin scenario insert" on public.scenario_content for insert to authenticated
with check ((select public.is_admin()));
create policy "admin scenario update" on public.scenario_content for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin scenario delete" on public.scenario_content for delete to authenticated
using ((select public.is_admin()));
