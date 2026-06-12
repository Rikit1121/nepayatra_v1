'use client'

import dynamic from 'next/dynamic'
import { MapSkeleton } from '@/components/map'
import type { DestinationMapMarker, BorderCrossingMapMarker } from '@/lib/map'

const HomeMapPreview = dynamic(
  () => import('./home-map-preview').then((m) => m.HomeMapPreview),
  { ssr: false, loading: () => <MapSkeleton /> }
)

interface HomeMapProps {
  destinations: DestinationMapMarker[]
  borders: BorderCrossingMapMarker[]
}

export function HomeMap({ destinations, borders }: HomeMapProps) {
  return (
    <div className="h-full w-full">
      <HomeMapPreview destinations={destinations} borders={borders} />
    </div>
  )
}
