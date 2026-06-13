import type { Metadata } from 'next'
import {
  getDestinationMapMarkers,
  getBorderMapMarkers,
  getActiveTravelAlerts,
} from '@/lib/supabase/queries'
import { buildAlertMarkers, type MapData } from '@/lib/map'
import { MapExperience } from '@/features/map'
import { SITE } from '@/lib/site-config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Interactive Nepal Map',
  description:
    'Explore Nepal on an interactive map — destinations, border crossings from India, and current travel alerts, all in one place.',
  alternates: { canonical: `${SITE.url}/map` },
  openGraph: {
    title: 'Interactive Nepal Map | NepaYatra',
    description:
      'Explore destinations, India–Nepal border crossings and live travel alerts on one interactive map.',
    url: `${SITE.url}/map`,
  },
}

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
