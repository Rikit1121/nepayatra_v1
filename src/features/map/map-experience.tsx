'use client'

import dynamic from 'next/dynamic'
import { MapSkeleton } from '@/components/map'
import type { MapData } from '@/lib/map'

// No SSR: the map bundle loads only in the browser.
const FullMap = dynamic(() => import('./full-map').then((m) => m.FullMap), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

export function MapExperience({ data }: { data: MapData }) {
  return (
    <div className="h-full min-h-0">
      <FullMap data={data} />
    </div>
  )
}
