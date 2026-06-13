import type { PlannerDestination, PlannerTravelStyle } from '@/lib/route-planner/types'
import { CATEGORY_DEFAULT_DAYS } from '@/lib/route-planner/config'
import { DESTINATION_CATEGORY_LABELS } from '@/lib/site-config'
import { resolveDestinationImage } from '@/lib/local-images'

export interface InspirationCard {
  id: string
  title: string
  imageUrl: string
  styleBadge: string
  recommendedDays: string
  description: string
}

const ROUTE_STYLE_IMAGES: Record<PlannerTravelStyle, string> = {
  adventure: '/images/Annapurna-base-camp-trek-8-days.jpg',
  religious: '/images/Pashupatinath.webp',
  wildlife: '/images/Chitwan.jpg',
  scenic: '/images/pokhara.jpg',
  family: '/images/Kathmandu.jpg',
  mixed: '/images/sarangkot.webp',
}

function recommendedDaysFor(category: string) {
  const base = CATEGORY_DEFAULT_DAYS[category as keyof typeof CATEGORY_DEFAULT_DAYS] ?? 2
  return `${base}–${base + 2} days`
}

function destinationToCard(d: PlannerDestination): InspirationCard {
  return {
    id: d.id,
    title: d.name,
    imageUrl: resolveDestinationImage(d.slug, d.category, null),
    styleBadge: DESTINATION_CATEGORY_LABELS[d.category] ?? d.category,
    recommendedDays: recommendedDaysFor(d.category),
    description: d.short_description,
  }
}

const PRIORITY_SLUGS = ['kathmandu', 'pokhara', 'chitwan', 'lumbini', 'janakpur', 'chitwan-national-park']

function pickDestinations(destinations: PlannerDestination[], slugs: string[]): InspirationCard[] {
  const picked: PlannerDestination[] = []
  const seen = new Set<string>()

  for (const slug of slugs) {
    const match = destinations.find((d) => d.slug === slug)
    if (match && !seen.has(match.id)) {
      picked.push(match)
      seen.add(match.id)
    }
  }

  for (const d of destinations.filter((item) => item.featured)) {
    if (picked.length >= 6) break
    if (!seen.has(d.id)) {
      picked.push(d)
      seen.add(d.id)
    }
  }

  for (const d of destinations) {
    if (picked.length >= 6) break
    if (!seen.has(d.id)) {
      picked.push(d)
      seen.add(d.id)
    }
  }

  return picked.map(destinationToCard)
}

const ROUTE_INSPIRATION: InspirationCard[] = [
  {
    id: 'route-adventure',
    title: 'Adventure Route',
    imageUrl: ROUTE_STYLE_IMAGES.adventure,
    styleBadge: 'Adventure',
    recommendedDays: '8–12 days',
    description: 'Pokhara, Annapurna viewpoints and high-altitude trekking bases.',
  },
  {
    id: 'route-pilgrimage',
    title: 'Pilgrimage Route',
    imageUrl: ROUTE_STYLE_IMAGES.religious,
    styleBadge: 'Religious',
    recommendedDays: '6–9 days',
    description: 'Kathmandu, Lumbini and Janakpur — Nepal\'s most sacred sites.',
  },
  {
    id: 'route-wildlife',
    title: 'Wildlife Route',
    imageUrl: ROUTE_STYLE_IMAGES.wildlife,
    styleBadge: 'Wildlife',
    recommendedDays: '5–8 days',
    description: 'Chitwan and Bardia — jungle safaris and river plains.',
  },
  {
    id: 'route-scenic',
    title: 'Scenic Route',
    imageUrl: ROUTE_STYLE_IMAGES.scenic,
    styleBadge: 'Scenic',
    recommendedDays: '7–10 days',
    description: 'Kathmandu, Pokhara and lakeside Himalayan viewpoints.',
  },
  {
    id: 'route-family',
    title: 'Family Route',
    imageUrl: ROUTE_STYLE_IMAGES.family,
    styleBadge: 'Family',
    recommendedDays: '6–8 days',
    description: 'Easy cities, gentle hills and national parks for all ages.',
  },
  {
    id: 'route-mixed',
    title: 'Highlights Route',
    imageUrl: ROUTE_STYLE_IMAGES.mixed,
    styleBadge: 'Mixed',
    recommendedDays: '7–14 days',
    description: 'A balanced first trip — culture, scenery and a taste of everything.',
  },
]

/** Build swipeable inspiration cards for early planner steps (visual only). */
export function getPlannerInspirationCards(
  step: number,
  destinations: PlannerDestination[]
): InspirationCard[] {
  if (step === 3) {
    return ROUTE_INSPIRATION
  }

  if (step === 2) {
    return pickDestinations(destinations, ['birgunj', 'lumbini', 'janakpur', 'kathmandu', 'pokhara', 'chitwan'])
  }

  return pickDestinations(destinations, PRIORITY_SLUGS)
}

export function getInspirationEyebrow(step: number) {
  if (step === 3) return 'Popular route ideas'
  return 'Trip inspiration'
}
