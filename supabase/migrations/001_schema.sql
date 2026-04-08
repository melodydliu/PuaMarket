-- ============================================================
-- 001_schema.sql  — Pua Market core tables
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Custom types ─────────────────────────────────────────────
create type public.role        as enum ('farm', 'florist');
create type public.island      as enum ('Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai', 'Lanai');
create type public.order_status as enum ('pending', 'confirmed', 'declined', 'fulfilled');
create type public.unit        as enum ('stem', 'bunch');

-- ── profiles ─────────────────────────────────────────────────
-- One row per auth.users row; created in the signup flow.
create table public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  role           public.role       not null,
  business_name  text              not null,
  island         public.island     not null,
  contact_email  text              not null,
  phone          text,
  bio            text,
  logo_url       text,
  created_at     timestamptz       not null default now(),
  updated_at     timestamptz       not null default now()
);

-- ── listings ─────────────────────────────────────────────────
-- Weekly availability postings by farms.
create table public.listings (
  id              uuid primary key default uuid_generate_v4(),
  farm_id         uuid             not null references public.profiles (id) on delete cascade,
  flower_name     text             not null,
  variety         text,
  color           text,
  qty_available   integer          not null check (qty_available >= 0),
  unit            public.unit      not null,
  price_per_unit  numeric(10, 2)   not null check (price_per_unit >= 0),
  ready_date      date             not null,
  photo_url       text,
  is_active       boolean          not null default true,
  created_at      timestamptz      not null default now(),
  updated_at      timestamptz      not null default now()
);

create index listings_farm_id_idx       on public.listings (farm_id);
create index listings_ready_date_idx    on public.listings (ready_date);
create index listings_is_active_idx     on public.listings (is_active);

-- ── orders ───────────────────────────────────────────────────
-- An order from a florist directed at one farm.
create table public.orders (
  id              uuid primary key default uuid_generate_v4(),
  florist_id      uuid             not null references public.profiles (id) on delete restrict,
  farm_id         uuid             not null references public.profiles (id) on delete restrict,
  status          public.order_status not null default 'pending',
  requested_date  date             not null,
  notes           text,
  total_price     numeric(10, 2)   not null check (total_price >= 0),
  created_at      timestamptz      not null default now(),
  updated_at      timestamptz      not null default now()
);

create index orders_florist_id_idx on public.orders (florist_id);
create index orders_farm_id_idx    on public.orders (farm_id);
create index orders_status_idx     on public.orders (status);

-- ── order_items ──────────────────────────────────────────────
-- Line items; unit_price is snapshotted at order time.
create table public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid           not null references public.orders (id) on delete cascade,
  listing_id  uuid           not null references public.listings (id) on delete restrict,
  quantity    integer        not null check (quantity > 0),
  unit_price  numeric(10, 2) not null check (unit_price >= 0)  -- snapshot
);

create index order_items_order_id_idx on public.order_items (order_id);

-- ── updated_at trigger ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
