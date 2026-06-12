'use client'

import type { GeneratedRoute } from '@/lib/route-planner/types'
import { DESTINATION_CATEGORY_LABELS } from '@/lib/site-config'
import { Badge } from '@/components/ui/badge'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import { Clock, MapPin, Route, Bus } from 'lucide-react'

interface RouteResultsProps {
  route: GeneratedRoute
  totalTripDays: number
}

export function RouteResults({ route, totalTripDays }: RouteResultsProps) {
  return (
    <div className="space-y-4">
      <article className={cn(atlasCardPlanner, 'atlas-route-summary-accent p-4 sm:p-5')}>
        <h3 className="flex items-center gap-2 font-display text-lg font-bold">
          <Route className="h-5 w-5 text-[hsl(var(--atlas-blue))]" />
          Route summary
        </h3>
        <p className="mt-3 font-display text-sm font-semibold leading-relaxed text-foreground">
          {route.orderedStops.map((s) => s.name).join(' → ')}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[hsl(var(--atlas-blue))]" />
            {route.totalDistanceKm.toLocaleString('en-IN')} km total
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[hsl(var(--atlas-blue))]" />~{route.totalTravelHours} hrs on the road
          </span>
          <span>{totalTripDays} days planned</span>
        </div>
      </article>

      <article className={cn(atlasCardPlanner, 'p-4 sm:p-5')}>
        <h3 className="font-display text-base font-bold">Day allocation</h3>
        <div className="mt-4 space-y-4">
          {route.dayAllocations.map((alloc, i) => (
            <div key={alloc.destinationId} className="relative flex items-start justify-between gap-3 pl-5">
              <span
                className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--atlas-blue))]"
                aria-hidden
              />
              {i < route.dayAllocations.length - 1 && (
                <span
                  className="absolute left-[4px] top-4 h-[calc(100%+0.5rem)] w-px bg-[hsl(var(--atlas-stone))]/25"
                  aria-hidden
                />
              )}
              <div>
                <p className="font-display font-semibold">{alloc.destinationName}</p>
                {alloc.highlights.length > 0 && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {alloc.highlights[0]}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0 bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]">
                {alloc.days}d
              </Badge>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          ~{route.travelDays} day{route.travelDays !== 1 ? 's' : ''} estimated for travel between stops.
        </p>
      </article>

      <article className={cn(atlasCardPlanner, 'p-4 sm:p-5')}>
        <h3 className="font-display text-base font-bold">Travel sequence</h3>
        <div className="mt-3 divide-y divide-[hsl(var(--atlas-stone))]/15">
          {route.legs.map((leg, i) => (
            <div key={`${leg.fromId}-${leg.toId}-${i}`} className="py-3 text-sm first:pt-0 last:pb-0">
              <p className="font-medium">
                {leg.fromName} → {leg.toName}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {leg.distance_km} km · ~{leg.travel_time_hours} hrs
                {leg.recommended_transport ? ` · ${leg.recommended_transport}` : ''}
              </p>
            </div>
          ))}
        </div>
      </article>

      {route.transportSuggestions.length > 0 && (
        <article className={cn(atlasCardPlanner, 'p-4 sm:p-5')}>
          <h3 className="flex items-center gap-2 font-display text-base font-bold">
            <Bus className="h-4 w-4 text-[hsl(var(--atlas-saffron))]" />
            Transport suggestions
          </h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {route.transportSuggestions.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      )}

      <article className={cn(atlasCardPlanner, 'p-4 sm:p-5')}>
        <h3 className="font-display text-base font-bold">Destination highlights</h3>
        <div className="mt-3 space-y-4">
          {route.dayAllocations.map((alloc) => {
            const stop = route.orderedStops.find((s) => s.id === alloc.destinationId)
            return (
              <div key={alloc.destinationId} className="border-b border-[hsl(var(--atlas-stone))]/15 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display font-semibold">{alloc.destinationName}</p>
                  {stop && (
                    <Badge variant="outline" className="border-[hsl(var(--atlas-blue))]/25 text-[10px]">
                      {DESTINATION_CATEGORY_LABELS[stop.category] ?? stop.category}
                    </Badge>
                  )}
                </div>
                <ul className="mt-1 list-inside list-disc text-xs leading-relaxed text-muted-foreground">
                  {alloc.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </article>
    </div>
  )
}
