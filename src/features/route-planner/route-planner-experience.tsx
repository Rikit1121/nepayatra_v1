'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { MapSkeleton } from '@/components/map'
import type { RoutePlannerData } from '@/lib/route-planner'

const RoutePlannerClient = dynamic(
  () => import('./route-planner-client').then((m) => m.RoutePlannerClient),
  { ssr: false, loading: () => <MapSkeleton className="min-h-[60vh]" /> }
)

export function RoutePlannerExperience({ data }: { data: RoutePlannerData }) {
  return (
    <div className="h-full min-h-0">
      <React.Suspense fallback={<MapSkeleton className="h-full min-h-[60vh]" />}>
        <RoutePlannerClient data={data} />
      </React.Suspense>
    </div>
  )
}
