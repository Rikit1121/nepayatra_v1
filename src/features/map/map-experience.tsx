'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { MapSkeleton, MapErrorBoundary } from '@/components/map'
import type { MapData } from '@/lib/map'

const FullMap = dynamic(
  () =>
    import('./full-map').then((m) => m.FullMap)
      .catch((err) => {
        console.error('[MapExperience] FullMap dynamic import failed', err)
        throw err
      }),
  {
    ssr: false,
    loading: () => <MapSkeleton className="min-h-[420px]" />,
  }
)

export function MapExperience({ data }: { data: MapData }) {
  return (
    <div className="h-full min-h-[inherit] w-full">
      <MapErrorBoundary>
        <FullMap data={data} />
      </MapErrorBoundary>
    </div>
  )
}
