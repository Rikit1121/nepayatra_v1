'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { MapSkeleton } from '@/components/map'

const HeroPopularRouteMapInner = dynamic(
  () =>
    import('./hero-popular-route-map-inner').then(
      (m) => m.HeroPopularRouteMapInner
    ),
  {
    ssr: false,
    loading: () => <MapSkeleton className="h-full w-full rounded-2xl" />,
  }
)

export function HeroPopularRouteMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <HeroPopularRouteMapInner />
    </div>
  )
}
