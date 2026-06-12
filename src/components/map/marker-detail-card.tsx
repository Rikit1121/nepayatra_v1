'use client'

import Link from 'next/link'
import { Popup } from 'react-map-gl/maplibre'
import { ArrowRight, MapPin, Clock, Milestone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { slugify } from '@/lib/utils'
import { DESTINATION_CATEGORY_LABELS, PROVINCE_LABELS } from '@/lib/site-config'
import { getDestinationMeta, getSuggestedStay, type SelectedMarker } from '@/lib/map'

interface MarkerDetailCardProps {
  selected: NonNullable<SelectedMarker>
  onClose: () => void
}

/** Card-style detail popup shown when a marker is selected. */
export function MarkerDetailCard({ selected, onClose }: MarkerDetailCardProps) {
  const coords = getCoords(selected)
  if (!coords) return null

  return (
    <Popup
      longitude={coords.longitude}
      latitude={coords.latitude}
      anchor="bottom"
      offset={26}
      closeOnClick={false}
      onClose={onClose}
      maxWidth="320px"
      className="nepayatra-popup [&_.maplibregl-popup-content]:rounded-xl [&_.maplibregl-popup-content]:p-0 [&_.maplibregl-popup-content]:shadow-xl [&_.maplibregl-popup-content]:ring-1 [&_.maplibregl-popup-content]:ring-[#1e3a5f]/10"
    >
      <div className="w-72 overflow-hidden">
        <div className="h-1.5 bg-[#1e3a5f]" aria-hidden />
        <div className="p-4">{renderContent(selected)}</div>
      </div>
    </Popup>
  )
}

function getCoords(selected: NonNullable<SelectedMarker>) {
  if (selected.kind === 'border') {
    if (selected.data.longitude == null || selected.data.latitude == null) return null
    return { longitude: selected.data.longitude, latitude: selected.data.latitude }
  }
  return { longitude: selected.data.longitude, latitude: selected.data.latitude }
}

function renderContent(selected: NonNullable<SelectedMarker>) {
  if (selected.kind === 'destination') {
    const d = selected.data
    const meta = getDestinationMeta(d.category, d.slug)
    return (
      <>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className="text-white" style={{ backgroundColor: meta.color }}>
            {DESTINATION_CATEGORY_LABELS[d.category] ?? d.category}
          </Badge>
          <span className="flex items-center gap-0.5 text-xs text-[hsl(var(--atlas-stone))]">
            <MapPin className="h-3 w-3" />
            {PROVINCE_LABELS[d.province] ?? d.province}
          </span>
        </div>

        <h3 className="mt-2 font-display text-base font-bold leading-tight text-foreground">{d.name}</h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Recommended stay:{' '}
          <span className="font-medium text-foreground">{getSuggestedStay(d.category, d.slug)}</span>
        </p>

        {d.short_description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {d.short_description}
          </p>
        )}

        <Button
          asChild
          size="sm"
          className="mt-3 w-full border-[hsl(var(--atlas-saffron))]/50 bg-[hsl(var(--atlas-saffron))] text-white hover:bg-[hsl(var(--atlas-saffron))]/90"
        >
          <Link href={`/destinations/${d.slug}`}>
            View Destination <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </>
    )
  }

  if (selected.kind === 'border') {
    const b = selected.data
    return (
      <>
        <Badge variant="secondary" className="gap-1 bg-[#1e3a5f]/10 text-[#1e3a5f]">
          <Milestone className="h-3 w-3" />
          {b.featured ? 'Major border crossing' : 'Border crossing'}
        </Badge>

        <h3 className="mt-2 font-display text-base font-bold leading-tight text-foreground">
          {b.crossing_name}
        </h3>

        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {b.india_side} <span className="text-[#1e3a5f]">→</span> {b.nepal_side}
        </p>

        {b.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {b.description}
          </p>
        )}

        <Button asChild size="sm" className="mt-3 w-full shadow-sm">
          <Link href={`/border-crossings/${slugify(b.crossing_name)}`}>
            View Border Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </>
    )
  }

  const a = selected.data
  const tone =
    a.severity === 'danger'
      ? 'text-red-700'
      : a.severity === 'warning'
        ? 'text-amber-700'
        : 'text-[#1e3a5f]'
  return (
    <>
      <Badge variant="outline" className={`capitalize ${tone}`}>
        {a.severity} alert
      </Badge>
      <h3 className="mt-2 font-display text-base font-bold leading-tight text-foreground">{a.title}</h3>
      <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-muted-foreground">{a.message}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">Region: {a.region}</p>
    </>
  )
}
