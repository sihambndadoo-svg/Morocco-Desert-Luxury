create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.experiences (
  slug text primary key,
  category text not null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  duration_label text not null,
  duration_days integer not null default 1,
  starting_price numeric(10,2) not null default 0,
  base_adult_price numeric(10,2) not null default 0,
  base_child_price numeric(10,2) not null default 0,
  private_surcharge numeric(10,2) not null default 0,
  transfer_price numeric(10,2) not null default 0,
  capacity_default integer not null default 10,
  unit_capacity_default integer not null default 0,
  featured_media_url text,
  featured_media_fallback_url text,
  add_ons jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_experiences_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

create table if not exists public.booking_reference_counters (
  booking_year integer primary key,
  current_value integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  booking_reference text unique,
  full_name text not null,
  email text not null,
  phone text not null,
  whatsapp text,
  country text not null,
  preferred_language text not null,
  preferred_contact_method text not null,
  experience_slug text not null,
  experience_name text not null,
  selected_services jsonb not null default '[]'::jsonb,
  check_in_date date,
  check_out_date date,
  preferred_date date,
  adults integer not null default 1,
  children integer not null default 0,
  guest_count integer not null default 1,
  add_ons jsonb not null default '[]'::jsonb,
  special_requests text,
  estimated_total numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  payment_method text not null default 'confirm_first',
  payment_status text not null default 'payment_pending',
  booking_status text not null default 'pending',
  source text default 'direct',
  medium text default 'none',
  campaign text,
  referrer text,
  owner_notes text,
  session_token text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists booking_requests_created_at_idx on public.booking_requests (created_at desc);
create index if not exists booking_requests_status_idx on public.booking_requests (booking_status, payment_status);
create index if not exists booking_requests_dates_idx on public.booking_requests (check_in_date, preferred_date);
create index if not exists booking_requests_source_idx on public.booking_requests (source, medium, campaign);

create or replace function public.assign_booking_reference()
returns trigger
language plpgsql
as $$
declare
  yr integer;
  next_number integer;
begin
  if new.booking_reference is not null then
    return new;
  end if;

  yr := extract(year from coalesce(new.created_at, timezone('utc', now())))::integer;

  insert into public.booking_reference_counters (booking_year, current_value)
  values (yr, 1)
  on conflict (booking_year)
  do update set current_value = public.booking_reference_counters.current_value + 1,
                updated_at = timezone('utc', now())
  returning current_value into next_number;

  new.booking_reference := format('ECL-%s-%s', yr, lpad(next_number::text, 4, '0'));
  return new;
end;
$$;

create trigger assign_booking_reference_trigger
before insert on public.booking_requests
for each row execute function public.assign_booking_reference();

create trigger set_booking_requests_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();

create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.booking_requests(id) on delete cascade,
  from_status text,
  to_status text not null,
  from_payment_status text,
  to_payment_status text not null,
  note text,
  changed_by text not null default 'system',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists booking_status_history_booking_idx on public.booking_status_history (booking_id, created_at asc);

create table if not exists public.payment_links (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.booking_requests(id) on delete cascade,
  provider text not null,
  payment_type text not null default 'deposit',
  amount numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  payment_url text,
  status text not null default 'pending',
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_payment_links_updated_at
before update on public.payment_links
for each row execute function public.set_updated_at();

create table if not exists public.availability_calendar (
  id uuid primary key default gen_random_uuid(),
  experience_slug text not null,
  date date not null,
  status text not null default 'available',
  guest_capacity integer,
  remaining_capacity integer,
  unit_capacity integer,
  units_remaining integer,
  waitlist_enabled boolean not null default false,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (experience_slug, date)
);

create index if not exists availability_calendar_lookup_idx on public.availability_calendar (experience_slug, date);
create trigger set_availability_calendar_updated_at
before update on public.availability_calendar
for each row execute function public.set_updated_at();

create table if not exists public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  experience_slug text not null,
  rule_name text not null,
  rule_type text not null,
  start_date date,
  end_date date,
  specific_date date,
  weekday integer,
  amount_mode text not null,
  adult_amount numeric(10,2) not null default 0,
  child_amount numeric(10,2),
  private_surcharge numeric(10,2),
  transfer_amount numeric(10,2),
  currency text not null default 'EUR',
  is_active boolean not null default true,
  priority integer not null default 100,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists pricing_rules_lookup_idx on public.pricing_rules (experience_slug, is_active, priority desc);
create trigger set_pricing_rules_updated_at
before update on public.pricing_rules
for each row execute function public.set_updated_at();

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  media_type text not null,
  url text not null,
  fallback_url text,
  page_key text,
  category text,
  alt jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  country text not null,
  experience_slug text,
  rating integer not null default 5,
  quote jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone_or_whatsapp text,
  subject text not null,
  message text not null,
  preferred_language text not null default 'en',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

create table if not exists public.visitor_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text not null unique,
  started_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now()),
  entry_page text,
  last_page text,
  referrer text,
  source text default 'direct',
  medium text default 'none',
  campaign text,
  device_type text,
  browser text,
  user_agent text,
  locale text default 'en',
  ip_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists visitor_sessions_started_at_idx on public.visitor_sessions (started_at desc);
create index if not exists visitor_sessions_source_idx on public.visitor_sessions (source, medium, campaign);
create trigger set_visitor_sessions_updated_at
before update on public.visitor_sessions
for each row execute function public.set_updated_at();

create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.visitor_sessions(id) on delete set null,
  event_type text not null,
  page_path text not null,
  page_title text,
  referrer text,
  source text default 'direct',
  medium text default 'none',
  campaign text,
  locale text default 'en',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists page_events_created_at_idx on public.page_events (created_at desc);
create index if not exists page_events_page_idx on public.page_events (page_path, event_type);

create table if not exists public.admin_recent_activity (
  id uuid primary key default gen_random_uuid(),
  activity_type text not null,
  entity_type text,
  entity_id text,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'system',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_recent_activity_created_at_idx on public.admin_recent_activity (created_at desc);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by text not null default 'system',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  block_key text not null,
  locale text not null,
  title text,
  body text,
  data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (block_key, locale)
);

create trigger set_content_blocks_updated_at
before update on public.content_blocks
for each row execute function public.set_updated_at();
