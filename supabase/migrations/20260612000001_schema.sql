-- ============================================================
-- Migration : 20260612000001_schema
-- Project   : NepaYatra
-- Purpose   : Initial database schema
--             Nepal travel information platform for Indian travelers.
--             Single admin role. No visitor accounts.
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------

create extension if not exists "uuid-ossp";       -- uuid_generate_v4() fallback
create extension if not exists "pg_trgm";          -- trigram indexes for text search

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------

create type public.destination_category as enum (
  'cultural',
  'heritage',
  'adventure',
  'trekking',
  'wildlife',
  'religious',
  'scenic'
);
comment on type public.destination_category is
  'Classification for Nepal travel destinations';

-- Seven provinces of Nepal (federal structure since 2015)
create type public.nepal_province as enum (
  'koshi',
  'madhesh',
  'bagmati',
  'gandaki',
  'lumbini',
  'karnali',
  'sudurpashchim'
);
comment on type public.nepal_province is
  'Seven federal provinces of Nepal';

create type public.package_difficulty as enum (
  'easy',
  'moderate',
  'hard',
  'expert'
);
comment on type public.package_difficulty is
  'Physical difficulty rating for travel packages';

create type public.faq_category as enum (
  'entry_requirements',
  'visa',
  'transport',
  'safety',
  'currency',
  'culture',
  'health',
  'general'
);
comment on type public.faq_category is
  'Topic category for FAQ entries';

create type public.alert_severity as enum (
  'info',
  'warning',
  'danger'
);
comment on type public.alert_severity is
  'Severity level for travel alerts — info (blue), warning (amber), danger (red)';

create type public.knowledge_base_category as enum (
  'entry_requirements',
  'transport',
  'safety',
  'culture',
  'currency',
  'health',
  'trekking',
  'wildlife',
  'general'
);
comment on type public.knowledge_base_category is
  'Topic category for knowledge base articles';

create type public.setting_value_type as enum (
  'text',
  'json',
  'boolean',
  'number',
  'image_url'
);
comment on type public.setting_value_type is
  'Data type of a site_settings value — determines how to parse setting_value';

-- ------------------------------------------------------------
-- UTILITY: updated_at auto-trigger
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
comment on function public.set_updated_at() is
  'Trigger function: automatically sets updated_at = now() on every UPDATE';

-- ============================================================
-- TABLE: destinations
-- ============================================================

create table public.destinations (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  slug              text        not null unique,
  short_description text        not null,
  full_description  text,
  category          public.destination_category not null,
  province          public.nepal_province       not null,
  latitude          numeric(9, 6) not null,
  longitude         numeric(9, 6) not null,
  altitude_meters   integer,
  best_season       text[]      not null default '{}',
  featured          boolean     not null default false,
  hero_image_url    text,
  gallery_images    text[]      not null default '{}',
  seo_title         text,
  seo_description   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint destinations_name_length
    check (char_length(name) between 2 and 200),
  constraint destinations_slug_format
    check (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
  constraint destinations_short_desc_length
    check (char_length(short_description) between 20 and 400),
  constraint destinations_latitude_nepal
    check (latitude between 26.0 and 31.0),
  constraint destinations_longitude_nepal
    check (longitude between 79.0 and 89.0),
  constraint destinations_altitude_positive
    check (altitude_meters is null or altitude_meters >= 0)
);

comment on table  public.destinations                 is 'Nepal travel destinations — cultural, heritage, trekking, wildlife, religious, scenic';
comment on column public.destinations.slug            is 'URL-safe identifier, lowercase kebab-case, used in page routes';
comment on column public.destinations.short_description is 'Brief teaser for listing cards (max 400 chars)';
comment on column public.destinations.full_description  is 'Full rich-text / markdown content for the destination detail page';
comment on column public.destinations.best_season       is 'Array of month names when visiting is optimal, e.g. {October, November}';
comment on column public.destinations.gallery_images    is 'Array of Supabase Storage public URLs';
comment on column public.destinations.altitude_meters   is 'Elevation in metres above sea level — relevant for trekking and high-altitude destinations';
comment on column public.destinations.featured          is 'When true the destination appears in homepage featured sections';

create index idx_destinations_slug      on public.destinations (slug);
create index idx_destinations_category  on public.destinations (category);
create index idx_destinations_province  on public.destinations (province);
create index idx_destinations_featured  on public.destinations (featured) where featured = true;
create index idx_destinations_created   on public.destinations (created_at desc);
create index idx_destinations_name_trgm on public.destinations using gin (name gin_trgm_ops);

create trigger trg_destinations_updated_at
  before update on public.destinations
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: border_crossings
-- ============================================================

create table public.border_crossings (
  id               uuid        primary key default gen_random_uuid(),
  crossing_name    text        not null unique,
  india_side       text        not null,
  nepal_side       text        not null,
  description      text,
  latitude         numeric(9, 6),
  longitude        numeric(9, 6),
  operating_notes  text,
  featured         boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint border_crossings_name_length
    check (char_length(crossing_name) between 3 and 200),
  constraint border_crossings_latitude_range
    check (latitude is null or latitude between 26.0 and 31.0),
  constraint border_crossings_longitude_range
    check (longitude is null or longitude between 79.0 and 89.0)
);

comment on table  public.border_crossings                is 'Nepal–India land border crossings with operational guidance';
comment on column public.border_crossings.india_side     is 'Indian border town / checkpoint name';
comment on column public.border_crossings.nepal_side     is 'Nepali border town / checkpoint name';
comment on column public.border_crossings.operating_notes is 'Admin-curated guidance: hours, required documents, vehicle categories, seasonal closures';
comment on column public.border_crossings.featured       is 'Highlighted crossing shown prominently on the border crossings page';

create index idx_border_crossings_featured on public.border_crossings (featured) where featured = true;
create index idx_border_crossings_created  on public.border_crossings (created_at desc);

create trigger trg_border_crossings_updated_at
  before update on public.border_crossings
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: destination_connections
-- Powers the interactive route planner feature.
-- Directed graph: A→B and B→A are stored as separate rows.
-- ============================================================

create table public.destination_connections (
  id                    uuid          primary key default gen_random_uuid(),
  from_destination_id   uuid          not null
    references public.destinations (id) on delete cascade,
  to_destination_id     uuid          not null
    references public.destinations (id) on delete cascade,
  distance_km           numeric(7, 1),
  travel_time_hours     numeric(5, 1),
  recommended_transport text,
  route_notes           text,
  created_at            timestamptz   not null default now(),

  constraint destination_connections_no_self_loop
    check (from_destination_id <> to_destination_id),
  constraint destination_connections_unique_pair
    unique (from_destination_id, to_destination_id)
);

comment on table  public.destination_connections                      is 'Directed travel connections between destinations — graph edges for the route planner';
comment on column public.destination_connections.distance_km          is 'Approximate road or air distance in kilometres';
comment on column public.destination_connections.travel_time_hours    is 'Typical travel time in decimal hours for the recommended transport mode';
comment on column public.destination_connections.recommended_transport is 'Transport type, e.g. Tourist Bus, Jeep, Domestic Flight, Helicopter';
comment on column public.destination_connections.route_notes          is 'Additional guidance: road conditions, seasonal availability, transfer points';

create index idx_dest_connections_from on public.destination_connections (from_destination_id);
create index idx_dest_connections_to   on public.destination_connections (to_destination_id);

-- ============================================================
-- TABLE: packages
-- ============================================================

create table public.packages (
  id               uuid                    primary key default gen_random_uuid(),
  title            text                    not null,
  slug             text                    not null unique,
  description      text,
  duration_days    integer                 not null,
  price_inr_from   integer,
  highlights       text[]                  not null default '{}',
  includes         text[]                  not null default '{}',
  excludes         text[]                  not null default '{}',
  difficulty       public.package_difficulty not null default 'moderate',
  featured         boolean                 not null default false,
  hero_image_url   text,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz             not null default now(),
  updated_at       timestamptz             not null default now(),

  constraint packages_title_length
    check (char_length(title) between 5 and 300),
  constraint packages_slug_format
    check (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
  constraint packages_duration_positive
    check (duration_days > 0),
  constraint packages_price_positive
    check (price_inr_from is null or price_inr_from > 0)
);

comment on table  public.packages               is 'Curated Nepal travel packages shown for reference — not a booking system';
comment on column public.packages.price_inr_from is 'Approximate starting price in Indian Rupees for informational reference only';
comment on column public.packages.highlights     is 'Array of key experience highlights';
comment on column public.packages.includes       is 'Array of items included in the package description';
comment on column public.packages.excludes       is 'Array of items not included (international flights, personal expenses, etc.)';

create index idx_packages_slug      on public.packages (slug);
create index idx_packages_difficulty on public.packages (difficulty);
create index idx_packages_featured  on public.packages (featured) where featured = true;
create index idx_packages_created   on public.packages (created_at desc);

create trigger trg_packages_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: faqs
-- ============================================================

create table public.faqs (
  id          uuid                  primary key default gen_random_uuid(),
  category    public.faq_category   not null,
  question    text                  not null,
  answer      text                  not null,
  order_index integer               not null default 0,
  created_at  timestamptz           not null default now(),
  updated_at  timestamptz           not null default now(),

  constraint faqs_question_length
    check (char_length(question) between 10 and 500),
  constraint faqs_answer_length
    check (char_length(answer) >= 20),
  constraint faqs_order_index_positive
    check (order_index >= 0)
);

comment on table  public.faqs             is 'Frequently asked questions grouped by topic category';
comment on column public.faqs.answer      is 'Markdown-supported answer text';
comment on column public.faqs.order_index is 'Display order within a category — lower values appear first';

create index idx_faqs_category on public.faqs (category);
create index idx_faqs_order    on public.faqs (category, order_index);
create index idx_faqs_created  on public.faqs (created_at desc);

create trigger trg_faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: advisors
-- ============================================================

create table public.advisors (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  title           text,
  bio             text,
  languages       text[]      not null default '{}',
  whatsapp_number text,
  phone_number    text,
  photo_url       text,
  active          boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint advisors_name_length
    check (char_length(name) between 2 and 200)
);

comment on table  public.advisors                 is 'Nepal-based travel advisor directory — admin-managed, no linked user accounts';
comment on column public.advisors.title           is 'Professional title, e.g. Senior Trekking Guide, Cultural Tourism Expert';
comment on column public.advisors.whatsapp_number is 'WhatsApp contact in international format (+977...)';
comment on column public.advisors.active          is 'When false, the advisor is hidden from the public directory';

create index idx_advisors_active  on public.advisors (active) where active = true;
create index idx_advisors_created on public.advisors (created_at desc);

create trigger trg_advisors_updated_at
  before update on public.advisors
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: travel_alerts
-- ============================================================

create table public.travel_alerts (
  id               uuid                   primary key default gen_random_uuid(),
  title            text                   not null,
  message          text                   not null,
  severity         public.alert_severity  not null default 'info',
  starts_at        timestamptz            not null default now(),
  expires_at       timestamptz,
  affected_regions text[]                 not null default '{}',
  active           boolean                not null default true,
  created_at       timestamptz            not null default now(),
  updated_at       timestamptz            not null default now(),

  constraint travel_alerts_title_length
    check (char_length(title) between 5 and 300),
  constraint travel_alerts_expiry_after_start
    check (expires_at is null or expires_at > starts_at)
);

comment on table  public.travel_alerts                 is 'Admin-published travel warnings and notices displayed site-wide';
comment on column public.travel_alerts.message         is 'Full alert body — markdown supported';
comment on column public.travel_alerts.affected_regions is 'Array of province names or destination slugs affected by this alert';
comment on column public.travel_alerts.expires_at      is 'Alert auto-expires at this timestamp — null means indefinite';
comment on column public.travel_alerts.active          is 'Quick toggle to show/hide without deleting the alert record';

create index idx_travel_alerts_active   on public.travel_alerts (active) where active = true;
create index idx_travel_alerts_severity on public.travel_alerts (severity);
create index idx_travel_alerts_starts   on public.travel_alerts (starts_at desc);
create index idx_travel_alerts_created  on public.travel_alerts (created_at desc);

create trigger trg_travel_alerts_updated_at
  before update on public.travel_alerts
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: knowledge_base
-- ============================================================

create table public.knowledge_base (
  id                   uuid                            primary key default gen_random_uuid(),
  title                text                            not null,
  slug                 text                            not null unique,
  category             public.knowledge_base_category  not null,
  summary              text                            not null,
  content              text                            not null,
  tags                 text[]                          not null default '{}',
  reading_time_minutes integer,
  featured             boolean                         not null default false,
  seo_title            text,
  seo_description      text,
  created_at           timestamptz                     not null default now(),
  updated_at           timestamptz                     not null default now(),

  constraint knowledge_base_title_length
    check (char_length(title) between 5 and 300),
  constraint knowledge_base_slug_format
    check (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
  constraint knowledge_base_summary_length
    check (char_length(summary) between 20 and 500),
  constraint knowledge_base_reading_time_positive
    check (reading_time_minutes is null or reading_time_minutes > 0)
);

comment on table  public.knowledge_base                       is 'In-depth travel guide articles: entry requirements, safety, culture, transport, health';
comment on column public.knowledge_base.summary               is 'Short excerpt for listing pages (max 500 chars)';
comment on column public.knowledge_base.content               is 'Full MDX/Markdown article body';
comment on column public.knowledge_base.tags                  is 'Searchable tags array, e.g. {passport, documents, e-visa}';
comment on column public.knowledge_base.reading_time_minutes  is 'Estimated reading time — set by admin or auto-computed from word count';
comment on column public.knowledge_base.featured              is 'Featured articles appear on the homepage knowledge section';

create index idx_knowledge_base_slug      on public.knowledge_base (slug);
create index idx_knowledge_base_category  on public.knowledge_base (category);
create index idx_knowledge_base_featured  on public.knowledge_base (featured) where featured = true;
create index idx_knowledge_base_tags      on public.knowledge_base using gin (tags);
create index idx_knowledge_base_created   on public.knowledge_base (created_at desc);
create index idx_knowledge_base_title_trgm on public.knowledge_base using gin (title gin_trgm_ops);

create trigger trg_knowledge_base_updated_at
  before update on public.knowledge_base
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: site_settings
-- ============================================================

create table public.site_settings (
  id            uuid                       primary key default gen_random_uuid(),
  setting_key   text                       not null unique,
  setting_value text,
  value_type    public.setting_value_type  not null default 'text',
  setting_group text                       not null default 'general',
  updated_at    timestamptz                not null default now(),

  constraint site_settings_key_format
    check (setting_key ~ '^[a-z_][a-z0-9_]*$'),
  constraint site_settings_group_values
    check (setting_group in ('general', 'seo', 'contact', 'social', 'homepage'))
);

comment on table  public.site_settings               is 'Admin-controlled key-value store for all configurable site content and settings';
comment on column public.site_settings.setting_key   is 'Unique snake_case identifier, e.g. site_title, contact_email, og_image_url';
comment on column public.site_settings.setting_value is 'Serialised string value — parse according to value_type';
comment on column public.site_settings.setting_group is 'Groups for admin UI sections: general | seo | contact | social | homepage';

create index idx_site_settings_group on public.site_settings (setting_group);

create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE: contact_inquiries
-- ============================================================

create table public.contact_inquiries (
  id             uuid        primary key default gen_random_uuid(),
  visitor_name   text        not null,
  visitor_email  text        not null,
  visitor_phone  text,
  message        text        not null,
  status         text        not null default 'new',
  admin_notes    text,
  created_at     timestamptz not null default now(),

  constraint contact_inquiries_status_values
    check (status in ('new', 'read', 'replied', 'closed')),
  constraint contact_inquiries_email_format
    check (visitor_email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  constraint contact_inquiries_name_length
    check (char_length(visitor_name) between 2 and 200),
  constraint contact_inquiries_message_length
    check (char_length(message) between 10 and 5000)
);

comment on table  public.contact_inquiries             is 'Visitor-submitted contact form entries — actioned by admin';
comment on column public.contact_inquiries.status      is 'Workflow state: new → read → replied → closed';
comment on column public.contact_inquiries.admin_notes is 'Internal notes visible only to admin — not shared with the visitor';

create index idx_contact_inquiries_status  on public.contact_inquiries (status);
create index idx_contact_inquiries_created on public.contact_inquiries (created_at desc);
