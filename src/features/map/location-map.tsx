'use client'

import dynamic from 'next/dynamic'
import { MapSkeleton } from '@/components/map'
import type { DestinationMapMarker } from '@/lib/map'

const MiniMap = dynamic(() => import('./mini-map').then((m) => m.MiniMap), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

interface LocationMapProps {
  center: { longitude: number; latitude: number }
  primaryLabel: string
  primaryKind: 'destination' | 'border'
  nearby?: DestinationMapMarker[]
  className?: string
}

/** Dynamic (no-SSR) wrapper for the detail-page mini map. */
export function LocationMap({ className, ...props }: LocationMapProps) {
  return (
    <div className={className ?? 'h-64 w-full overflow-hidden rounded-xl border'}>
      <MiniMap {...props} />
    </div>
  )
}
