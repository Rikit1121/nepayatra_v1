-- ============================================================
-- Migration : 20260818000010_planner_visibility
-- Project   : NepaYatra
-- Purpose   : Add public_visible column to destinations and
--             border_crossings tables.
--
--             DATABASE = what NepaYatra knows about
--             ADMIN    = what is currently allowed for public use
--             PLANNER  = only queries public_visible = true rows
--
--             DEFAULT true ensures zero disruption to existing data.
--             All existing destinations and border crossings remain
--             visible in the planner unless an admin explicitly
--             deactivates them.
-- ============================================================

-- ── destinations ─────────────────────────────────────────────

alter table public.destinations
  add column if not exists public_visible boolean not null default true;

comment on column public.destinations.public_visible is
  'When false, this destination is hidden from the public trip planner '
  'and cannot be selected by users. The record still exists in the admin '
  'database. Defaults to true so all existing destinations remain visible.';

create index if not exists idx_destinations_public_visible
  on public.destinations (public_visible)
  where public_visible = true;

-- ── border_crossings ─────────────────────────────────────────

alter table public.border_crossings
  add column if not exists public_visible boolean not null default true;

comment on column public.border_crossings.public_visible is
  'When false, this border crossing is hidden from the public trip planner. '
  'Defaults to true so all existing crossings remain usable.';

create index if not exists idx_border_crossings_public_visible
  on public.border_crossings (public_visible)
  where public_visible = true;
