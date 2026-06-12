-- ============================================================
-- Migration : 20260612000002_rls
-- Project   : NepaYatra
-- Purpose   : Row Level Security policies for all tables
--
-- Auth model:
--   anon        = public visitor (no account, uses anon API key)
--   authenticated = admin user (single role, Supabase Auth login)
--
-- Policy summary:
--   Content tables      → anon SELECT, authenticated ALL
--   contact_inquiries   → anon INSERT only, authenticated ALL
--   site_settings       → anon SELECT, authenticated ALL
-- ============================================================

-- ============================================================
-- destinations
-- ============================================================

alter table public.destinations enable row level security;

create policy "destinations: public read"
  on public.destinations
  for select
  to anon, authenticated
  using (true);

create policy "destinations: admin insert"
  on public.destinations
  for insert
  to authenticated
  with check (true);

create policy "destinations: admin update"
  on public.destinations
  for update
  to authenticated
  using (true)
  with check (true);

create policy "destinations: admin delete"
  on public.destinations
  for delete
  to authenticated
  using (true);

-- ============================================================
-- border_crossings
-- ============================================================

alter table public.border_crossings enable row level security;

create policy "border_crossings: public read"
  on public.border_crossings
  for select
  to anon, authenticated
  using (true);

create policy "border_crossings: admin insert"
  on public.border_crossings
  for insert
  to authenticated
  with check (true);

create policy "border_crossings: admin update"
  on public.border_crossings
  for update
  to authenticated
  using (true)
  with check (true);

create policy "border_crossings: admin delete"
  on public.border_crossings
  for delete
  to authenticated
  using (true);

-- ============================================================
-- destination_connections
-- Public visitors need to read connections to use the route planner.
-- ============================================================

alter table public.destination_connections enable row level security;

create policy "destination_connections: public read"
  on public.destination_connections
  for select
  to anon, authenticated
  using (true);

create policy "destination_connections: admin insert"
  on public.destination_connections
  for insert
  to authenticated
  with check (true);

create policy "destination_connections: admin update"
  on public.destination_connections
  for update
  to authenticated
  using (true)
  with check (true);

create policy "destination_connections: admin delete"
  on public.destination_connections
  for delete
  to authenticated
  using (true);

-- ============================================================
-- packages
-- ============================================================

alter table public.packages enable row level security;

create policy "packages: public read"
  on public.packages
  for select
  to anon, authenticated
  using (true);

create policy "packages: admin insert"
  on public.packages
  for insert
  to authenticated
  with check (true);

create policy "packages: admin update"
  on public.packages
  for update
  to authenticated
  using (true)
  with check (true);

create policy "packages: admin delete"
  on public.packages
  for delete
  to authenticated
  using (true);

-- ============================================================
-- faqs
-- ============================================================

alter table public.faqs enable row level security;

create policy "faqs: public read"
  on public.faqs
  for select
  to anon, authenticated
  using (true);

create policy "faqs: admin insert"
  on public.faqs
  for insert
  to authenticated
  with check (true);

create policy "faqs: admin update"
  on public.faqs
  for update
  to authenticated
  using (true)
  with check (true);

create policy "faqs: admin delete"
  on public.faqs
  for delete
  to authenticated
  using (true);

-- ============================================================
-- advisors
-- ============================================================

alter table public.advisors enable row level security;

create policy "advisors: public read active only"
  on public.advisors
  for select
  to anon
  using (active = true);

-- Admin sees all advisors including inactive ones
create policy "advisors: admin read all"
  on public.advisors
  for select
  to authenticated
  using (true);

create policy "advisors: admin insert"
  on public.advisors
  for insert
  to authenticated
  with check (true);

create policy "advisors: admin update"
  on public.advisors
  for update
  to authenticated
  using (true)
  with check (true);

create policy "advisors: admin delete"
  on public.advisors
  for delete
  to authenticated
  using (true);

-- ============================================================
-- travel_alerts
-- Public only sees alerts that are active and within their validity window.
-- ============================================================

alter table public.travel_alerts enable row level security;

create policy "travel_alerts: public read active and current"
  on public.travel_alerts
  for select
  to anon
  using (
    active = true
    and starts_at <= now()
    and (expires_at is null or expires_at > now())
  );

-- Admin sees all alerts regardless of status or date
create policy "travel_alerts: admin read all"
  on public.travel_alerts
  for select
  to authenticated
  using (true);

create policy "travel_alerts: admin insert"
  on public.travel_alerts
  for insert
  to authenticated
  with check (true);

create policy "travel_alerts: admin update"
  on public.travel_alerts
  for update
  to authenticated
  using (true)
  with check (true);

create policy "travel_alerts: admin delete"
  on public.travel_alerts
  for delete
  to authenticated
  using (true);

-- ============================================================
-- knowledge_base
-- ============================================================

alter table public.knowledge_base enable row level security;

create policy "knowledge_base: public read"
  on public.knowledge_base
  for select
  to anon, authenticated
  using (true);

create policy "knowledge_base: admin insert"
  on public.knowledge_base
  for insert
  to authenticated
  with check (true);

create policy "knowledge_base: admin update"
  on public.knowledge_base
  for update
  to authenticated
  using (true)
  with check (true);

create policy "knowledge_base: admin delete"
  on public.knowledge_base
  for delete
  to authenticated
  using (true);

-- ============================================================
-- site_settings
-- Public can read all settings (needed for SSR/SSG: site title, SEO, etc.)
-- ============================================================

alter table public.site_settings enable row level security;

create policy "site_settings: public read"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy "site_settings: admin insert"
  on public.site_settings
  for insert
  to authenticated
  with check (true);

create policy "site_settings: admin update"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

create policy "site_settings: admin delete"
  on public.site_settings
  for delete
  to authenticated
  using (true);

-- ============================================================
-- contact_inquiries
-- Visitors can submit forms (INSERT) but cannot read any submissions.
-- Admin can read, update (status + notes), and delete.
-- ============================================================

alter table public.contact_inquiries enable row level security;

create policy "contact_inquiries: anon can submit"
  on public.contact_inquiries
  for insert
  to anon
  with check (true);

create policy "contact_inquiries: admin read all"
  on public.contact_inquiries
  for select
  to authenticated
  using (true);

create policy "contact_inquiries: admin update"
  on public.contact_inquiries
  for update
  to authenticated
  using (true)
  with check (true);

create policy "contact_inquiries: admin delete"
  on public.contact_inquiries
  for delete
  to authenticated
  using (true);
