-- ============================================================
-- 003_storage.sql  — Supabase Storage buckets & policies
-- ============================================================

-- ── Buckets ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('logos',    'logos',    true),   -- farm/florist logo images
  ('listings', 'listings', true);   -- flower listing photos

-- ── logos bucket policies ────────────────────────────────────
-- Anyone can read logos (public profiles)
create policy "logos: public read"
  on storage.objects for select
  using (bucket_id = 'logos');

-- Authenticated users can upload to their own folder: logos/<user_id>/*
create policy "logos: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "logos: owner update"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "logos: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── listings bucket policies ─────────────────────────────────
-- Anyone can read listing photos
create policy "listings: public read"
  on storage.objects for select
  using (bucket_id = 'listings');

-- Only farms can upload to their own folder: listings/<farm_id>/*
create policy "listings: farm upload"
  on storage.objects for insert
  with check (
    bucket_id = 'listings'
    and auth.uid()::text = (storage.foldername(name))[1]
    and (select role from public.profiles where id = auth.uid()) = 'farm'
  );

create policy "listings: farm update"
  on storage.objects for update
  using (
    bucket_id = 'listings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "listings: farm delete"
  on storage.objects for delete
  using (
    bucket_id = 'listings'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
