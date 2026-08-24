'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { MapSkeleton } from '@/components/map'
import type { RouteStop } from '@/components/map'
import type { DestinationMapMarker, BorderCrossingMapMarker, RoutePreview } from '@/lib/map'

const PlannerMap = dynamic(
  () => import('@/features/route-planner/planner-map').then((m) => m.PlannerMap),
  { ssr: false, loading: () => <MapSkeleton /> }
)

interface TripMapProps {
  destinations: DestinationMapMarker[]
  borders?: BorderCrossingMapMarker[]
  selectedDestinationIds: string[]
  selectedBorderId?: string | null
  route: RoutePreview | null
  numberedStops: RouteStop[]
  className?: string
}

export function TripMap({
  destinations,
  borders = [],
  selectedDestinationIds,
  selectedBorderId = null,
  route,
  numberedStops,
  className,
}: TripMapProps) {
  return (
    <div className={className ?? 'h-full w-full'}>
      <PlannerMap
        destinations={destinations}
        borders={borders}
        selectedDestinationIds={selectedDestinationIds}
        selectedBorderId={selectedBorderId}
        route={route}
        numberedStops={numberedStops}
        interactive={true}
      />
    </div>
  )
}
