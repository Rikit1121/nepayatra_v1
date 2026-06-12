import type { DestinationCategory } from '@/lib/supabase/types'
import type { OriginRegion, PlannerTravelStyle } from './types'

export const MIN_DESTINATIONS = 1
export const MAX_DESTINATIONS = 5
export const MIN_DAYS = 3
export const MAX_DAYS = 21
export const PLANNER_STEPS = 6

export const ORIGIN_OPTIONS: { label: string; value: OriginRegion; note: string }[] = [
  { label: 'Delhi', value: 'delhi', note: 'Fly to Kathmandu or enter via Raxaul–Birgunj' },
  { label: 'Bihar', value: 'bihar', note: 'Raxaul–Birgunj or Jogbani–Biratnagar' },
  { label: 'Uttar Pradesh', value: 'uttar-pradesh', note: 'Sunauli–Bhairahawa via Gorakhpur' },
  { label: 'West Bengal', value: 'west-bengal', note: 'Panitanki–Kakarbhitta via Siliguri' },
  { label: 'Uttarakhand', value: 'uttarakhand', note: 'Banbasa–Mahendranagar in the far west' },
  { label: 'Other', value: 'other', note: 'Compare all border options' },
]

/** Suggested border crossing slugs per origin region (slugified crossing_name). */
export const ORIGIN_BORDER_SUGGESTIONS: Record<OriginRegion, string[]> = {
  delhi: ['raxaul-birgunj', 'sunauli-bhairahawa'],
  bihar: ['raxaul-birgunj', 'jogbani-biratnagar'],
  'uttar-pradesh': ['sunauli-bhairahawa'],
  'west-bengal': ['panitanki-kakarbhitta'],
  uttarakhand: ['banbasa-mahendranagar'],
  other: [],
}

export const STYLE_OPTIONS: {
  label: string
  value: PlannerTravelStyle
  description: string
}[] = [
  { label: 'Family', value: 'family', description: 'Easy cities, wildlife and scenic stops' },
  { label: 'Religious', value: 'religious', description: 'Temples, pilgrimage sites and heritage' },
  { label: 'Scenic', value: 'scenic', description: 'Lakes, hills and Himalayan viewpoints' },
  { label: 'Adventure', value: 'adventure', description: 'Trekking bases and high-altitude routes' },
  { label: 'Wildlife', value: 'wildlife', description: 'National parks and jungle safaris' },
  { label: 'Mixed', value: 'mixed', description: 'A bit of everything — no filter applied' },
]

/** Map planner travel style → destination categories for recommendations. */
export const STYLE_CATEGORIES: Record<PlannerTravelStyle, DestinationCategory[] | null> = {
  family: ['cultural', 'scenic', 'wildlife', 'heritage'],
  religious: ['religious', 'heritage', 'cultural'],
  scenic: ['scenic', 'heritage', 'cultural'],
  adventure: ['adventure', 'trekking'],
  wildlife: ['wildlife'],
  mixed: null,
}

/**
 * First destination on the Nepal side after crossing — used as the graph entry node.
 * Keys are slugified border crossing names.
 */
export const BORDER_ENTRY_DESTINATION_SLUG: Record<string, string> = {
  'raxaul-birgunj': 'birgunj',
  'sunauli-bhairahawa': 'lumbini',
  'jogbani-biratnagar': 'janakpur',
  'panitanki-kakarbhitta': 'ilam',
  'banbasa-mahendranagar': 'bardia-national-park',
}

/** Default days to suggest per destination category (for day allocation). */
export const CATEGORY_DEFAULT_DAYS: Partial<Record<DestinationCategory, number>> = {
  cultural: 2,
  heritage: 1,
  religious: 1,
  scenic: 2,
  wildlife: 2,
  adventure: 3,
  trekking: 4,
}
