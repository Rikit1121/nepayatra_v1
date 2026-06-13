import type { PlannerDestination, PlannerTravelStyle } from '@/lib/route-planner/types'
import { CATEGORY_DEFAULT_DAYS } from '@/lib/route-planner/config'
import { DESTINATION_CATEGORY_LABELS } from '@/lib/site-config'

export interface InspirationCard {
  id: string
  title: string
  imageUrl: string
  styleBadge: string
  recommendedDays: string
  description: string
}

const CATEGORY_IMAGE_ID: Record<string, string> = {
  religious: 'photo-1585350584893-6bc7e17b6e4d',
  cultural: 'photo-1558618666-fcd25c85cd64',
  adventure: 'photo-1486911278844-a81c5267e227',
  trekking: 'photo-1540202404-a2f29016b523',
  wildlife: 'photo-1518877593221-1f28583780b4',
  scenic: 'photo-1544735716-392fe2489ffa',
  heritage: 'photo-1588392382834-a891154bca4d',
}

const DEFAULT_IMAGE_ID = 'photo-1506905925346-21bda4d32df4'

function unsplashUrl(id: string, w = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
}

function destinationImage(category: string) {
  return unsplashUrl(CATEGORY_IMAGE_ID[category] ?? DEFAULT_IMAGE_ID)
}

function recommendedDaysFor(category: string) {
  const base = CATEGORY_DEFAULT_DAYS[category as keyof typeof CATEGORY_DEFAULT_DAYS] ?? 2
  return `${base}–${base + 2} days`
}

function destinationToCard(d: PlannerDestination): InspirationCard {
  return {
    id: d.id,
    title: d.name,
    imageUrl: destinationImage(d.category),
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

const ROUTE_STYLE_IMAGES: Record<PlannerTravelStyle, string> = {
  adventure: 'photo-1486911278844-a81c5267e227',
  religious: 'photo-1585350584893-6bc7e17b6e4d',
  wildlife: 'photo-1518877593221-1f28583780b4',
  scenic: 'photo-1544735716-392fe2489ffa',
  family: 'photo-1558618666-fcd25c85cd64',
  mixed: 'photo-1506905925346-21bda4d32df4',
}

const ROUTE_INSPIRATION: InspirationCard[] = [
  {
    id: 'route-adventure',
    title: 'Adventure Route',
    imageUrl: unsplashUrl(ROUTE_STYLE_IMAGES.adventure),
    styleBadge: 'Adventure',
    recommendedDays: '8–12 days',
    description: 'Pokhara, Annapurna viewpoints and high-altitude trekking bases.',
  },
  {
    id: 'route-pilgrimage',
    title: 'Pilgrimage Route',
    imageUrl: unsplashUrl(ROUTE_STYLE_IMAGES.religious),
    styleBadge: 'Religious',
    recommendedDays: '6–9 days',
    description: 'Kathmandu, Lumbini and Janakpur — Nepal\'s most sacred sites.',
  },
  {
    id: 'route-wildlife',
    title: 'Wildlife Route',
    imageUrl: unsplashUrl(ROUTE_STYLE_IMAGES.wildlife),
    styleBadge: 'Wildlife',
    recommendedDays: '5–8 days',
    description: 'Chitwan and Bardia — jungle safaris and river plains.',
  },
  {
    id: 'route-scenic',
    title: 'Scenic Route',
    imageUrl: unsplashUrl(ROUTE_STYLE_IMAGES.scenic),
    styleBadge: 'Scenic',
    recommendedDays: '7–10 days',
    description: 'Kathmandu, Pokhara and lakeside Himalayan viewpoints.',
  },
  {
    id: 'route-family',
    title: 'Family Route',
    imageUrl: unsplashUrl(ROUTE_STYLE_IMAGES.family),
    styleBadge: 'Family',
    recommendedDays: '6–8 days',
    description: 'Easy cities, gentle hills and national parks for all ages.',
  },
  {
    id: 'route-mixed',
    title: 'Highlights Route',
    imageUrl: unsplashUrl(ROUTE_STYLE_IMAGES.mixed),
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
