/**
 * Static site configuration and navigation.
 * Dynamic values (contact, social) come from site_settings at runtime.
 */

const DEFAULT_SITE_URL = 'https://nepayatra.com'

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw || raw === 'NEXT_PUBLIC_SITE_URL') return DEFAULT_SITE_URL

  try {
    return new URL(raw).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE = {
  name: 'NepaYatra',
  identity: "Explorer's Companion",
  description:
    'Plan your Nepal trip from India — borders, destinations, routes, and real answers to the questions Indian travelers actually ask.',
  url: resolveSiteUrl(),
  locale: 'en_IN',
} as const

export const MAIN_NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Map', href: '/map' },
  { label: 'Border Crossings', href: '/border-crossings' },
  { label: 'Route Planner', href: '/route-planner' },
  { label: 'Travel Guides', href: '/guides' },
  { label: 'Packages', href: '/packages' },
  { label: 'FAQ', href: '/faq' },
]

export const TRAVEL_STYLES: {
  label: string
  value: string
  description: string
}[] = [
  { label: 'Religious', value: 'religious', description: 'Pashupatinath, Janakpur, Lumbini, Muktinath' },
  { label: 'Family', value: 'family', description: 'Easy trips with something for every age' },
  { label: 'Adventure', value: 'adventure', description: 'Trekking, peaks and the Annapurna region' },
  { label: 'Wildlife', value: 'wildlife', description: 'Chitwan and Bardia national parks' },
  { label: 'Scenic', value: 'scenic', description: 'Lakes, hills and Himalayan viewpoints' },
]

export const ORIGIN_REGIONS: { label: string; value: string; note: string }[] = [
  { label: 'Delhi', value: 'delhi', note: 'Fly to Kathmandu or train to Raxaul' },
  { label: 'Bihar', value: 'bihar', note: 'Raxaul–Birgunj is closest' },
  { label: 'Uttar Pradesh', value: 'uttar-pradesh', note: 'Sunauli–Bhairahawa via Gorakhpur' },
  { label: 'West Bengal', value: 'west-bengal', note: 'Panitanki–Kakarbhitta via Siliguri' },
  { label: 'Uttarakhand', value: 'uttarakhand', note: 'Banbasa–Mahendranagar in the far west' },
]

export const DESTINATION_CATEGORY_LABELS: Record<string, string> = {
  cultural: 'Cultural',
  heritage: 'Heritage',
  adventure: 'Adventure',
  trekking: 'Trekking',
  wildlife: 'Wildlife',
  religious: 'Religious',
  scenic: 'Scenic',
}

export const PROVINCE_LABELS: Record<string, string> = {
  koshi: 'Koshi',
  madhesh: 'Madhesh',
  bagmati: 'Bagmati',
  gandaki: 'Gandaki',
  lumbini: 'Lumbini',
  karnali: 'Karnali',
  sudurpashchim: 'Sudurpashchim',
}

export const KB_CATEGORY_LABELS: Record<string, string> = {
  entry_requirements: 'Entry Requirements',
  transport: 'Transport',
  safety: 'Safety',
  culture: 'Culture',
  currency: 'Currency',
  health: 'Health',
  trekking: 'Trekking',
  wildlife: 'Wildlife',
  general: 'General',
}

export const FAQ_CATEGORY_LABELS: Record<string, string> = {
  entry_requirements: 'Entry Requirements',
  visa: 'Visa',
  transport: 'Transport',
  safety: 'Safety',
  currency: 'Currency',
  culture: 'Culture',
  health: 'Health',
  general: 'General',
}

export const PACKAGE_DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  expert: 'Expert',
}
