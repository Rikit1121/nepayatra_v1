import {
  MAX_DAYS,
  MAX_DESTINATIONS,
  MIN_DAYS,
  PLANNER_STEPS,
} from './config'
import type { OriginRegion, PlannerState, PlannerTravelStyle } from './types'

/** Legacy homepage / marketing links use short `entry` keys instead of full border slugs. */
const ENTRY_BORDER_ALIASES: Record<string, string> = {
  raxaul: 'raxaul-birgunj',
  sunauli: 'sunauli-bhairahawa',
  jogbani: 'jogbani-biratnagar',
  panitanki: 'panitanki-kakarbhitta',
  banbasa: 'banbasa-mahendranagar',
}

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

/** Trim, dedupe, and cap destination slugs from URL or toggles. */
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
  }
}

const ORIGINS = new Set([
  'delhi',
  'bihar',
  'uttar-pradesh',
  'west-bengal',
  'uttarakhand',
  'other',
])

const STYLES = new Set([
  'family',
  'religious',
  'scenic',
  'adventure',
  'wildlife',
  'mixed',
])

export function parsePlannerState(params: URLSearchParams): PlannerState {
  const fromRaw = params.get('from')
  const from =
    fromRaw && ORIGINS.has(fromRaw) ? (fromRaw as OriginRegion) : null

  const styleRaw = params.get('style')
  const style =
    styleRaw && STYLES.has(styleRaw) ? (styleRaw as PlannerTravelStyle) : null

  const destRaw = params.get('dest') ?? params.get('destinations') ?? ''
  const destinationSlugs = normalizeDestinationSlugs(destRaw.split(','))

  const borderRaw = params.get('border')
  const entryRaw = params.get('entry')?.trim().toLowerCase()
  const borderSlug =
    borderRaw ||
    (entryRaw ? ENTRY_BORDER_ALIASES[entryRaw] ?? entryRaw : null) ||
    null

  const daysRaw = parseInt(params.get('days') ?? '7', 10)
  const stepRaw = parseInt(params.get('step') ?? '1', 10)

  return {
    from,
    borderSlug,
    style,
    destinationSlugs,
    days: clampTripDays(daysRaw),
    step: clampWizardStep(stepRaw),
    generated: params.get('generated') === '1',
  }
}

export function serializePlannerPatch(
  current: PlannerState,
  patch: Partial<PlannerState>
): URLSearchParams {
  const next = mergePlannerState(current, patch)
  const params = new URLSearchParams()

  if (next.from) params.set('from', next.from)
  if (next.borderSlug) params.set('border', next.borderSlug)
  if (next.style) params.set('style', next.style)
  if (next.destinationSlugs.length > 0) {
    params.set('dest', next.destinationSlugs.join(','))
  }
  params.set('days', String(next.days))
  if (next.step > 1) params.set('step', String(next.step))
  if (next.generated) params.set('generated', '1')

  return params
}

export function buildPlannerWhatsAppMessage(
  state: PlannerState,
  borderName: string | null,
  destinationNames: string[]
): string {
  const lines = [
    "Hi, I'd like a local expert to review my Nepal route plan:",
    '',
    state.from ? `Coming from: ${state.from.replace(/-/g, ' ')}` : null,
    borderName ? `Entry border: ${borderName}` : null,
    state.style ? `Travel style: ${state.style}` : null,
    destinationNames.length > 0
      ? `Destinations: ${destinationNames.join(' → ')}`
      : null,
    `Trip length: ${state.days} days`,
  ].filter(Boolean)

  return lines.join('\n')
}
