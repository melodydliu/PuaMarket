-- ============================================================
-- 002_rls.sql  — Row Level Security policies
-- ============================================================

-- ── Helper: get caller's role ────────────────────────────────
create or replace function public.my_role()
returns public.role language sql stable security definer as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ─────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Anyone can read all profiles (public farm directory)
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- Users can only insert/update their own profile
create policy "profiles: owner insert"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles: owner update"
  on public.profiles for update
  using (id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- listings
-- ─────────────────────────────────────────────────────────────
alter table public.listings enable row level security;

-- Public: anyone can view active listings
create policy "listings: public read active"
  on public.listings for select
  using (is_active = true);

-- Farm owners can read all their own listings (including inactive)
create policy "listings: farm owner read all"
  on public.listings for select
  using (farm_id = auth.uid());

-- Only the owning farm can insert listings
create policy "listings: farm owner insert"
  on public.listings for insert
  with check (
    farm_id = auth.uid()
    and public.my_role() = 'farm'
  );

-- Only the owning farm can update/delete
create policy "listings: farm owner update"
  on public.listings for update
  using (farm_id = auth.uid());

create policy "listings: farm owner delete"
  on public.listings for delete
  using (farm_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────────────────────
alter table public.orders enable row level security;

-- Florists see their own orders; farms see orders addressed to them
create policy "orders: florist read own"
  on public.orders for select
  using (florist_id = auth.uid());

create policy "orders: farm read own"
  on public.orders for select
  using (farm_id = auth.uid());

-- Only florists can place orders
create policy "orders: florist insert"
  on public.orders for insert
  with check (
    florist_id = auth.uid()
    and public.my_role() = 'florist'
  );

-- Farms can update status (confirm/decline/fulfill); florists can update notes
create policy "orders: farm update status"
  on public.orders for update
  using (farm_id = auth.uid());

create policy "orders: florist update notes"
  on public.orders for update
  using (florist_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- order_items
-- ─────────────────────────────────────────────────────────────
alter table public.order_items enable row level security;

-- Visible to the florist or farm of the parent order
create policy "order_items: read via order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.florist_id = auth.uid() or o.farm_id = auth.uid())
    )
  );

-- Only florists can insert items (when creating an order)
create policy "order_items: florist insert"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.florist_id = auth.uid()
    )
  );
