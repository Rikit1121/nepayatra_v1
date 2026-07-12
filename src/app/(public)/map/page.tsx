import {
  getDestinationMapMarkers,
  getBorderMapMarkers,
  getActiveTravelAlerts,
} from '@/lib/supabase/queries'
import { buildAlertMarkers, type MapData } from '@/lib/map'
import { MapExperience } from '@/features/map'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildPageMetadata({
  title: 'Interactive Nepal Map — Destinations & Border Crossings',
  description:
    'Explore Nepal on an interactive map — destinations, India–Nepal border crossings from Bihar, UP and West Bengal, plus current travel alerts.',
  path: '/map',
})

export default async function MapPage() {
  const [destinations, borders, alerts] = await Promise.all([
    getDestinationMapMarkers(),
    getBorderMapMarkers(),
    getActiveTravelAlerts(),
  ])

  const data: MapData = {
    destinations,
    borders,
    alerts: buildAlertMarkers(alerts),
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-background">
        <div className="container py-4">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Explore Nepal on the map
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse destinations, border crossings and travel alerts. Tap a marker for details, or
            use the layer panel to focus on what matters.
          </p>
        </div>
      </div>
      <div className="relative min-h-[420px] flex-1 h-[calc(100svh-13rem)] md:h-[calc(100svh-12rem)]">
        <MapExperience data={data} />
      </div>
    </div>
  )
}
