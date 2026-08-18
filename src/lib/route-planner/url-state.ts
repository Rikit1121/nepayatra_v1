import {
  MAX_DAYS,
  MAX_DESTINATIONS,
  MIN_DAYS,
  PLANNER_STEPS,
} from './config'
import type {
  OriginRegion,
  OriginType,
  TravelMode,
  TravelerType,
  PlannerTravelCategory,
  TravelBudgetStyle,
  PlannerInterest,
  PlannerState,
} from './types'

// ─────────────────────────────────────────────────────────────
// Clamp helpers
// ─────────────────────────────────────────────────────────────

/** Clamp wizard step to a safe integer range. */
export function clampWizardStep(step: number): number {
  if (!Number.isFinite(step)) return 1
  return Math.min(PLANNER_STEPS + 1, Math.max(1, Math.trunc(step)))
}

/** Clamp trip days to configured bounds. */
export function clampTripDays(days: number): number {
  if (!Number.isFinite(days)) return 7
  return Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.trunc(days)))
}

/** Clamp traveler count to 1–20. */
export function clampTravelerCount(n: number): number {
  if (!Number.isFinite(n)) return 2
  return Math.min(20, Math.max(1, Math.trunc(n)))
}

// ─────────────────────────────────────────────────────────────
// Destination slug helpers
// ─────────────────────────────────────────────────────────────

/** Trim, dedupe, and cap destination slugs. */
export function normalizeDestinationSlugs(slugs: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of slugs) {
    const slug = raw.trim()
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    out.push(slug)
    if (out.length >= MAX_DESTINATIONS) break
  }
  return out
}

/** Count slugs that resolve against known planner destinations. */
export function countValidDestinationSlugs(
  slugs: string[],
  knownSlugs: ReadonlySet<string> | Iterable<string>
): number {
  const known =
    knownSlugs instanceof Set ? knownSlugs : new Set(Array.from(knownSlugs))
  let count = 0
  const seen = new Set<string>()
  for (const raw of slugs) {
    const slug = raw.trim()
    if (!slug || seen.has(slug) || !known.has(slug)) continue
    seen.add(slug)
    count += 1
  }
  return count
}

export function resolveDestinationSlugs(
  slugs: string[],
  knownSlugs: ReadonlySet<string> | Iterable<string>
): string[] {
  const known =
    knownSlugs instanceof Set ? knownSlugs : new Set(Array.from(knownSlugs))
  return normalizeDestinationSlugs(slugs).filter((slug) => known.has(slug))
}

// ─────────────────────────────────────────────────────────────
// Validated enum sets
// ─────────────────────────────────────────────────────────────

const ORIGIN_TYPES = new Set<OriginType>(['india', 'international', 'in-nepal'])
const TRAVEL_MODES = new Set<TravelMode>(['flight', 'road'])
const ORIGIN_TYPE_MAP: Record<string, OriginType> = {
  in: 'india',
  india: 'india',
  intl: 'international',
  international: 'international',
  np: 'in-nepal',
  'in-nepal': 'in-nepal',
}
const TRAVEL_MODE_MAP: Record<string, TravelMode> = {
  fl: 'flight',
  flight: 'flight',
  rd: 'road',
  road: 'road',
}
const TRAVELER_TYPES = new Set<TravelerType>(['solo', 'couple', 'family', 'group'])
const ORIGINS = new Set<OriginRegion>([
  'delhi', 'bihar', 'uttar-pradesh', 'west-bengal', 'uttarakhand', 'other',
])
const TRAVEL_CATEGORIES = new Set<PlannerTravelCategory>([
  'family', 'religious', 'scenic', 'adventure', 'wildlife', 'mixed',
])
const TRAVEL_BUDGET_STYLES = new Set<TravelBudgetStyle>(['budget', 'comfort', 'premium'])
const VALID_INTERESTS = new Set<PlannerInterest>([
  'nature', 'culture', 'adventure', 'wildlife', 'spiritual',
  'food', 'nightlife', 'relaxation', 'family',
])

/** Legacy border URL aliases (short keys → full slugs). */
const ENTRY_BORDER_ALIASES: Record<string, string> = {
  raxaul: 'raxaul-birgunj',
  sunauli: 'sunauli-bhairahawa',
  jogbani: 'jogbani-biratnagar',
  panitanki: 'panitanki-kakarbhitta',
  banbasa: 'banbasa-mahendranagar',
}

// ─────────────────────────────────────────────────────────────
// State helpers
// ─────────────────────────────────────────────────────────────

/** Merge planner patches and normalize all fields before URL serialization. */
export function mergePlannerState(
  current: PlannerState,
  patch: Partial<PlannerState>
): PlannerState {
  const merged = { ...current, ...patch }
  return {
    ...merged,
    destinationSlugs: normalizeDestinationSlugs(merged.destinationSlugs),
    days: clampTripDays(merged.days),
    step: clampWizardStep(merged.step),
    travelerCount: clampTravelerCount(merged.travelerCount),
    interests: (merged.interests ?? []).filter((i): i is PlannerInterest =>
      VALID_INTERESTS.has(i)
    ),
  }
}

// ─────────────────────────────────────────────────────────────
// Parse
// ─────────────────────────────────────────────────────────────

/** Reconstruct PlannerState from URL search params. All invalid values fail gracefully. */
export function parsePlannerState(params: URLSearchParams): PlannerState {
  // ── Origin / entry ───────────────────────────────────────
  const otRaw = params.get('ot')?.trim().toLowerCase()
  const originType = otRaw && ORIGIN_TYPE_MAP[otRaw] ? ORIGIN_TYPE_MAP[otRaw] : null

  const originCountry = params.get('ocn') ?? null
  const originCity = params.get('oc') ?? null

  const tmRaw = params.get('tm')?.trim().toLowerCase()
  const travelMode = tmRaw && TRAVEL_MODE_MAP[tmRaw] ? TRAVEL_MODE_MAP[tmRaw] : null

  // Backward-compat: old `entry` short key aliases
  const borderRaw = params.get('border')
  const entryRaw = params.get('entry')?.trim().toLowerCase()
  const borderSlug =
    borderRaw ||
    (entryRaw ? ENTRY_BORDER_ALIASES[entryRaw] ?? entryRaw : null) ||
    null

  const fromRaw = params.get('from')
  const from =
    fromRaw && ORIGINS.has(fromRaw as OriginRegion)
      ? (fromRaw as OriginRegion)
      : null

  // ── Dates ────────────────────────────────────────────────
  const startDate = params.get('sd') ?? null
  const endDate = params.get('ed') ?? null
  const daysRaw = parseInt(params.get('days') ?? '7', 10)

  // ── Travelers ────────────────────────────────────────────
  const ttRaw = params.get('tt')
  const travelerType = ttRaw && TRAVELER_TYPES.has(ttRaw as TravelerType)
    ? (ttRaw as TravelerType)
    : null
  const tcRaw = parseInt(params.get('tc') ?? '2', 10)

  // ── Destinations ─────────────────────────────────────────
  const destRaw = params.get('dest') ?? params.get('destinations') ?? ''
  const destinationSlugs = normalizeDestinationSlugs(destRaw.split(','))

  // ── Style / preferences ──────────────────────────────────
  // Backward-compat: old `style` key maps to travelCategory
  const styleRaw = params.get('style')
  const travelCategory =
    styleRaw && TRAVEL_CATEGORIES.has(styleRaw as PlannerTravelCategory)
      ? (styleRaw as PlannerTravelCategory)
      : null

  const tsRaw = params.get('ts')
  const travelStyle = tsRaw && TRAVEL_BUDGET_STYLES.has(tsRaw as TravelBudgetStyle)
    ? (tsRaw as TravelBudgetStyle)
    : null

  const interestsRaw = params.get('int') ?? ''
  const interests = interestsRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is PlannerInterest => VALID_INTERESTS.has(s as PlannerInterest))

  const bnprRaw = parseInt(params.get('bnpr') ?? '', 10)
  const budgetNpr = Number.isFinite(bnprRaw) && bnprRaw > 0 ? bnprRaw : null

  // ── Wizard navigation ────────────────────────────────────
  const stepRaw = parseInt(params.get('step') ?? '1', 10)

  return {
    originType,
    originCountry,
    originCity,
    travelMode,
    borderSlug,
    from,
    startDate,
    endDate,
    days: clampTripDays(daysRaw),
    travelerType,
    travelerCount: clampTravelerCount(tcRaw),
    destinationSlugs,
    travelCategory,
    travelStyle,
    interests,
    budgetNpr,
    step: clampWizardStep(stepRaw),
    generated: params.get('generated') === '1',
  }
}

// ─────────────────────────────────────────────────────────────
// Serialize
// ─────────────────────────────────────────────────────────────

/** Serialize a state patch into URL search params. Omits default/empty values to keep URLs short. */
export function serializePlannerPatch(
  current: PlannerState,
  patch: Partial<PlannerState>
): URLSearchParams {
  const next = mergePlannerState(current, patch)
  const params = new URLSearchParams()

  // ── Origin / entry ───────────────────────────────────────
  if (next.originType) params.set('ot',
    next.originType === 'india' ? 'in' :
    next.originType === 'international' ? 'intl' : 'np'
  )
  if (next.originCountry) params.set('ocn', next.originCountry)
  if (next.originCity) params.set('oc', next.originCity)
  if (next.travelMode) params.set('tm', next.travelMode === 'flight' ? 'fl' : 'rd')
  if (next.borderSlug) params.set('border', next.borderSlug)
  if (next.from) params.set('from', next.from)

  // ── Dates / duration ─────────────────────────────────────
  if (next.startDate) params.set('sd', next.startDate)
  if (next.endDate) params.set('ed', next.endDate)
  params.set('days', String(next.days))

  // ── Travelers ────────────────────────────────────────────
  if (next.travelerType) params.set('tt', next.travelerType)
  if (next.travelerCount !== 2) params.set('tc', String(next.travelerCount))

  // ── Destinations ─────────────────────────────────────────
  if (next.destinationSlugs.length > 0) {
    params.set('dest', next.destinationSlugs.join(','))
  }

  // ── Style / preferences ──────────────────────────────────
  if (next.travelCategory) params.set('style', next.travelCategory)
  if (next.travelStyle) params.set('ts', next.travelStyle)
  if (next.interests.length > 0) params.set('int', next.interests.join(','))
  if (next.budgetNpr != null) params.set('bnpr', String(next.budgetNpr))

  // ── Navigation ───────────────────────────────────────────
  if (next.step > 1) params.set('step', String(next.step))
  if (next.generated) params.set('generated', '1')

  return params
}

// ─────────────────────────────────────────────────────────────
// WhatsApp message builder
// ─────────────────────────────────────────────────────────────

export function buildPlannerWhatsAppMessage(
  state: PlannerState,
  borderName: string | null,
  destinationNames: string[]
): string {
  const originLine = (() => {
    if (state.originType === 'india') {
      if (state.travelMode === 'flight' && state.originCity) {
        return `Coming from: ${state.originCity.replace(/-/g, ' ')} (India) by flight`
      }
      if (state.from) {
        return `Coming from: ${state.from.replace(/-/g, ' ')} (India) by road`
      }
      return 'Coming from: India'
    }
    if (state.originType === 'international') {
      const parts = [state.originCity, state.originCountry].filter(Boolean).join(', ')
      return parts ? `Coming from: ${parts} (international)` : 'Coming from: international'
    }
    if (state.originType === 'in-nepal') return 'Starting: Already in Nepal'
    return null
  })()

  const lines = [
    "Hi, I'd like a local expert to review my Nepal trip plan:",
    '',
    originLine,
    borderName ? `Entry border: ${borderName}` : null,
    state.travelStyle ? `Budget preference: ${state.travelStyle}` : null,
    destinationNames.length > 0
      ? `Destinations: ${destinationNames.join(' → ')}`
      : null,
    `Trip length: ${state.days} days`,
    state.travelerType ? `Travelers: ${state.travelerType} (${state.travelerCount} people)` : null,
    state.budgetNpr ? `Budget: NPR ${state.budgetNpr.toLocaleString('en-NP')}` : null,
  ].filter(Boolean)

  return lines.join('\n')
}