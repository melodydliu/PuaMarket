# Pua Market — TODO

## Auth & Credentials

- [ ] Create `.env.local` from `.env.local.example` and add real Supabase URL + anon key
- [ ] Wire up Supabase Auth in the signup flows
  - [ ] Farm signup: `(auth)/signup/farm/page.tsx` — collect farm name, island, specialties, contact info, photos
  - [ ] Florist signup: `(auth)/signup/florist/page.tsx` — collect business name, island, contact info
  - [ ] On signup completion, insert row into `public.profiles` with correct `role`
- [ ] Login page: `(auth)/login/page.tsx` — email/password via Supabase Auth
- [ ] Restore middleware auth guards in `src/lib/supabase/middleware.ts`
  - Currently bypassed; re-enable the `/farm/*` and `/florist/*` redirect-to-login logic
- [ ] Add Supabase session provider / server-side session refresh (middleware already wired, just needs credentials)

## Replace Mock Data with Real Supabase Queries

- [ ] `src/lib/mock-data.ts` is the single source of truth for now — swap each page's data source when auth is ready
- [ ] Farm directory (`/farms`) — query `profiles` where `role = 'farm'`, `is_active = true`
- [ ] Farm profile (`/farms/[id]`) — query single profile + their active listings
- [ ] Farm dashboard listings (`/farm/listings`) — query `listings` where `farm_id = auth.uid()`
- [ ] Farm dashboard orders (`/farm/orders`) — query `orders` where `farm_id = auth.uid()`
- [ ] Florist browse (`/florist/browse`) — query active `listings` with farm join, add filters
- [ ] Florist orders (`/florist/orders`) — query `orders` where `florist_id = auth.uid()` with items join
- [ ] Add `specialties` column to `profiles` (array of text) OR derive from `bio` — needed for farm cards/profiles

## Write Operations (currently UI-only / no-op)

- [ ] Create listing form → `INSERT` into `listings`
- [ ] Edit listing → `UPDATE listings`
- [ ] Toggle listing active/inactive → `UPDATE listings SET is_active`
- [ ] Delete listing → `DELETE FROM listings`
- [ ] Place order → `INSERT` into `orders` + `order_items` (snapshot `unit_price` at time of order)
- [ ] Farm confirm/decline order → `UPDATE orders SET status`
- [ ] Farm mark order fulfilled → `UPDATE orders SET status = 'fulfilled'`

## File Uploads (Supabase Storage)

- [ ] Farm logo upload on signup/profile edit → `logos/<user_id>/logo.jpg`
- [ ] Listing photo upload in listing form → `listings/<farm_id>/<listing_id>.jpg`
- [ ] Wire `photo_url` and `logo_url` columns to real Storage public URLs

## Post-MVP (design with these in mind)

- [ ] Stripe payment processing
- [ ] Delivery logistics / pickup hubs
- [ ] In-app messaging
- [ ] Reviews & ratings
- [ ] Recurring orders
- [ ] Email / SMS notifications (Supabase Edge Functions + Resend / Twilio)
- [ ] Multi-region / white-label support
