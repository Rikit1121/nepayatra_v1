import type { DestinationCategory } from '@/lib/supabase/types'
import type {
  OriginRegion,
  PlannerTravelCategory,
  TravelBudgetStyle,
  PlannerInterest,
} from './types'

// ─────────────────────────────────────────────────────────────
// Planner wizard limits
// ─────────────────────────────────────────────────────────────

export const MIN_DESTINATIONS = 1
export const MAX_DESTINATIONS = 8
export const MIN_DAYS = 3
export const MAX_DAYS = 30
export const PLANNER_STEPS = 8

// ─────────────────────────────────────────────────────────────
// Origin — India road regions
// ─────────────────────────────────────────────────────────────

export const ORIGIN_OPTIONS: { label: string; value: OriginRegion; note: string }[] = [
  { label: 'Delhi', value: 'delhi', note: 'Fly to Kathmandu or enter via Raxaul–Birgunj' },
  { label: 'Bihar', value: 'bihar', note: 'Raxaul–Birgunj or Jogbani–Biratnagar' },
  { label: 'Uttar Pradesh', value: 'uttar-pradesh', note: 'Sunauli–Bhairahawa via Gorakhpur' },
  { label: 'West Bengal', value: 'west-bengal', note: 'Panitanki–Kakarbhitta via Siliguri' },
  { label: 'Uttarakhand', value: 'uttarakhand', note: 'Banbasa–Mahendranagar in the far west' },
  { label: 'Other', value: 'other', note: 'Compare all border options' },
]

/** Suggested border crossing slugs per India origin region. */
export const ORIGIN_BORDER_SUGGESTIONS: Record<OriginRegion, string[]> = {
  delhi: ['raxaul-birgunj', 'sunauli-bhairahawa'],
  bihar: ['raxaul-birgunj', 'jogbani-biratnagar'],
  'uttar-pradesh': ['sunauli-bhairahawa'],
  'west-bengal': ['panitanki-kakarbhitta'],
  uttarakhand: ['banbasa-mahendranagar'],
  other: [],
}

// ─────────────────────────────────────────────────────────────
// India flight cities
// ─────────────────────────────────────────────────────────────

export const INDIA_FLIGHT_CITIES: { label: string; value: string }[] = [
  { label: 'Delhi', value: 'delhi' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Kolkata', value: 'kolkata' },
  { label: 'Bangalore', value: 'bangalore' },
  { label: 'Hyderabad', value: 'hyderabad' },
  { label: 'Chennai', value: 'chennai' },
  { label: 'Other', value: 'other' },
]

// ─────────────────────────────────────────────────────────────
// Travel category (destination filter)
// ─────────────────────────────────────────────────────────────

export const STYLE_OPTIONS: {
  label: string
  value: PlannerTravelCategory
  description: string
}[] = [
  { label: 'Family', value: 'family', description: 'Easy cities, wildlife and scenic stops' },
  { label: 'Religious', value: 'religious', description: 'Temples, pilgrimage sites and heritage' },
  { label: 'Scenic', value: 'scenic', description: 'Lakes, hills and Himalayan viewpoints' },
  { label: 'Adventure', value: 'adventure', description: 'Trekking bases and high-altitude routes' },
  { label: 'Wildlife', value: 'wildlife', description: 'National parks and jungle safaris' },
  { label: 'Mixed', value: 'mixed', description: 'A bit of everything — no filter applied' },
]

/** Map travel category → destination categories for recommendations. */
export const STYLE_CATEGORIES: Record<PlannerTravelCategory, DestinationCategory[] | null> = {
  family: ['cultural', 'scenic', 'wildlife', 'heritage'],
  religious: ['religious', 'heritage', 'cultural'],
  scenic: ['scenic', 'heritage', 'cultural'],
  adventure: ['adventure', 'trekking'],
  wildlife: ['wildlife'],
  mixed: null,
}

// ─────────────────────────────────────────────────────────────
// Budget style (tier preference signal — NOT a budget engine)
// ─────────────────────────────────────────────────────────────

export const TRAVEL_BUDGET_STYLE_OPTIONS: {
  label: string
  value: TravelBudgetStyle
  description: string
}[] = [
  { label: 'Budget', value: 'budget', description: 'Guesthouses, local transport, street food' },
  { label: 'Comfort', value: 'comfort', description: 'Mid-range hotels, tourist buses, restaurants' },
  { label: 'Premium', value: 'premium', description: '4–5 star hotels, private transfers, guides' },
]

// ─────────────────────────────────────────────────────────────
// Interests (optional multi-select)
// ─────────────────────────────────────────────────────────────

export const INTEREST_OPTIONS: { label: string; value: PlannerInterest }[] = [
  { label: 'Nature', value: 'nature' },
  { label: 'Culture & Heritage', value: 'culture' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Wildlife', value: 'wildlife' },
  { label: 'Spiritual', value: 'spiritual' },
  { label: 'Food', value: 'food' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Relaxation', value: 'relaxation' },
  { label: 'Family', value: 'family' },
]

// ─────────────────────────────────────────────────────────────
// Route graph helpers
// ─────────────────────────────────────────────────────────────

/**
 * First destination on the Nepal side after crossing — used as the graph
 * entry node for road travelers. Keys are slugified border crossing names.
 */
export const BORDER_ENTRY_DESTINATION_SLUG: Record<string, string> = {
  'raxaul-birgunj': 'birgunj',
  'sunauli-bhairahawa': 'lumbini',
  'jogbani-biratnagar': 'janakpur',
  'panitanki-kakarbhitta': 'ilam',
  'banbasa-mahendranagar': 'bardia-national-park',
}

/**
 * For flight travelers, Kathmandu is the implicit arrival point.
 * Used to set the graph start node when the traveler flies in.
 */
export const FLIGHT_ARRIVAL_DESTINATION_SLUG = 'kathmandu'

/** Default days per destination category for day allocation. */
export const CATEGORY_DEFAULT_DAYS: Partial<Record<DestinationCategory, number>> = {
  cultural: 2,
  heritage: 1,
  religious: 1,
  scenic: 2,
  wildlife: 2,
  adventure: 3,
  trekking: 4,
}
