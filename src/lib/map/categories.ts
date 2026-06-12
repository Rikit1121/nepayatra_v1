import type { DestinationCategory } from '@/lib/supabase/types'
import { CATEGORY_COLORS, DEFAULT_DESTINATION_COLOR } from './colors'

/**
 * Higher-level marker treatment for destinations, layered on top of the raw
 * database `category`. Capital and major cities get distinct emphasis, and a
 * curated set of headline destinations always show a label.
 */

export const CAPITAL_SLUGS = new Set(['kathmandu'])

export const MAJOR_CITY_SLUGS = new Set([
  'pokhara',
  'birgunj',
  'biratnagar',
  'bhairahawa',
  'janakpur',
  'nepalgunj',
])

/** Destinations that always render a label on the map (kept small to avoid clutter). */
export const LABELLED_SLUGS = new Set([
  'kathmandu',
  'pokhara',
  'chitwan',
  'lumbini',
  'janakpur',
  'mustang',
])

/** Distinct colour for the capital. */
export const CAPITAL_COLOR = '#ca8a04'

export type MarkerSize = 'sm' | 'md' | 'lg'

export interface DestinationMeta {
  color: string
  size: MarkerSize
  isCapital: boolean
  isMajorCity: boolean
  showLabel: boolean
  /** Human label for the popup "category" line. */
  groupLabel: string
}

const GROUP_LABELS: Record<DestinationCategory, string> = {
  cultural: 'Cultural Destination',
  heritage: 'Heritage Site',
  adventure: 'Adventure Destination',
  trekking: 'Trekking Destination',
  wildlife: 'Wildlife Destination',
  religious: 'Religious Destination',
  scenic: 'Scenic Destination',
}

export function getDestinationMeta(category: DestinationCategory, slug: string): DestinationMeta {
  const isCapital = CAPITAL_SLUGS.has(slug)
  const isMajorCity = !isCapital && MAJOR_CITY_SLUGS.has(slug)

  return {
    color: isCapital ? CAPITAL_COLOR : (CATEGORY_COLORS[category] ?? DEFAULT_DESTINATION_COLOR),
    size: isCapital ? 'lg' : isMajorCity ? 'md' : 'sm',
    isCapital,
    isMajorCity,
    showLabel: LABELLED_SLUGS.has(slug),
    groupLabel: isCapital
      ? 'Capital City'
      : isMajorCity
        ? 'Major City'
        : GROUP_LABELS[category],
  }
}

const STAY_BY_CATEGORY: Record<DestinationCategory, string> = {
  cultural: '1–2 days',
  heritage: '1 day',
  adventure: '3–7 days',
  trekking: '5–10 days',
  wildlife: '2–3 days',
  religious: '1 day',
  scenic: '1–2 days',
}

/**
 * Editorial "suggested stay" guidance for the popup.
 * This is UX guidance derived from the destination type, not a database field.
 */
export function getSuggestedStay(category: DestinationCategory, slug: string): string {
  if (CAPITAL_SLUGS.has(slug)) return '2–3 days'
  if (MAJOR_CITY_SLUGS.has(slug)) return '1–2 days'
  return STAY_BY_CATEGORY[category] ?? '1–2 days'
}
