-- ============================================================
-- Migration : 20260818000005_storage_buckets
-- Project   : NepaYatra
-- Purpose   : Create Supabase Storage buckets for admin image uploads.
--             All three buckets are publicly readable (no sign-in needed
--             to serve images on the public site). Writes are restricted
--             to the service-role key used by the upload server action.
-- ============================================================

-- ── Buckets ──────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'destination-images',
    'destination-images',
    true,
    5242880,  -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'package-images',
    'package-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'advisor-photos',
    'advisor-photos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do nothing;


-- ── RLS Policies ─────────────────────────────────────────────
-- Public read: anyone can GET (needed to show images on the public site).
-- Write: only service role (bypasses RLS entirely), so no INSERT/UPDATE policy needed.

-- destination-images: public read
create policy "destination-images public read"
  on storage.objects for select
  using (bucket_id = 'destination-images');

-- package-images: public read
create policy "package-images public read"
  on storage.objects for select
  using (bucket_id = 'package-images');

-- advisor-photos: public read
create policy "advisor-photos public read"
  on storage.objects for select
  using (bucket_id = 'advisor-photos');
