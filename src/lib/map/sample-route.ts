import type { RoutePreview } from './types'

/**
 * Verified Popular Route for the hero map:
 * Kathmandu (Start) → Pokhara → Ghandruk → Annapurna Base Camp → Chitwan (End).
 */
export const HERO_POPULAR_ROUTE: RoutePreview = {
  id: 'popular-annapurna-sanctuary-circuit',
  points: [
    { longitude: 85.324, latitude: 27.7172, label: 'Kathmandu' },
    { longitude: 83.9856, latitude: 28.2096, label: 'Pokhara' },
    { longitude: 83.808, latitude: 28.375, label: 'Ghandruk' },
    { longitude: 83.878, latitude: 28.5303, label: 'Annapurna Base Camp' },
    { longitude: 84.4533, latitude: 27.5341, label: 'Chitwan' },
  ],
}

/**
 * Overland Border Sample Route:
 * Raxaul–Birgunj border → Kathmandu → Pokhara.
 */
export const SAMPLE_ROUTE: RoutePreview = {
  id: 'sample-india-kathmandu-pokhara',
  points: [
    { longitude: 84.85, latitude: 26.98, label: 'Raxaul (India)' },
    { longitude: 84.88, latitude: 27.0, label: 'Birgunj' },
    { longitude: 85.324, latitude: 27.7172, label: 'Kathmandu' },
    { longitude: 83.9856, latitude: 28.2096, label: 'Pokhara' },
  ],
}
