'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Calendar,
  Users,
  MapPin,
  Wallet,
  Clock,
  Bus,
  Building,
  Plane,
  Utensils,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Compass,
  MessageCircle,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { TripMap } from '@/features/trips/trip-map'
import { ShareTripControls } from '@/features/trips/share-trip-controls'
import { buildRoutePreview } from '@/features/route-planner/planner-map'
import { formatTripDateRange, formatShortDate, whatsappLink, cn } from '@/lib/utils'
import {
  atlasCardPlanner,
  atlasDisplayLg,
  atlasDisplayMd,
  atlasSectionDivider,
  atlasSectionEyebrow,
  atlasSectionPadding,
  atlasMapFrame,
} from '@/lib/design-system'
import type { ParsedSharedTrip } from '@/lib/trips/types'
import type { DestinationMapMarker, BorderCrossingMapMarker } from '@/lib/map'
import type { RouteStop } from '@/components/map'
import type { PlannerAdvisor } from '@/lib/route-planner/types'

interface SharedTripViewProps {
  trip: ParsedSharedTrip
  advisors?: PlannerAdvisor[]
  allDestinations?: DestinationMapMarker[]
  allBorders?: BorderCrossingMapMarker[]
}

export function SharedTripView({
  trip,
  advisors = [],
  allDestinations = [],
  allBorders = [],
}: SharedTripViewProps) {
  const route = trip.route_snapshot
  const budget = trip.budget_snapshot

  // Compute map markers and points for route preview
  const mapPoints = React.useMemo(() => {
    if (!route || !Array.isArray(route.orderedStops)) return []
    const points: { longitude: number; latitude: number; label: string }[] = []

    if (trip.travel_mode === 'road' && trip.border_slug) {
      const borderMarker = allBorders.find((b) => b.id === trip.border_slug)
      if (borderMarker?.latitude != null && borderMarker?.longitude != null) {
        points.push({
          longitude: borderMarker.longitude,
          latitude: borderMarker.latitude,
          label: borderMarker.crossing_name,
        })
      }
    }

    for (const stop of route.orderedStops) {
      if (stop.latitude != null && stop.longitude != null) {
        points.push({
          longitude: stop.longitude,
          latitude: stop.latitude,
          label: stop.name,
        })
      }
    }

    return points
  }, [route, trip.travel_mode, trip.border_slug, allBorders])

  const routePreview = React.useMemo(() => {
    if (mapPoints.length < 2) return null
    return buildRoutePreview(mapPoints)
  }, [mapPoints])

  const numberedStops: RouteStop[] = React.useMemo(() => {
    if (!route || !Array.isArray(route.orderedStops)) return []
    let n = 1
    return route.orderedStops
      .filter((s) => trip.destination_slugs.includes(s.slug))
      .map((s) => ({
        longitude: s.longitude,
        latitude: s.latitude,
        label: s.name,
        number: n++,
      }))
  }, [route, trip.destination_slugs])

  const selectedDestinationIds = React.useMemo(() => {
    if (!route || !Array.isArray(route.orderedStops)) return []
    return route.orderedStops.map((s) => s.id)
  }, [route])

  // Context line describing origin
  const originDescription = React.useMemo(() => {
    if (trip.origin_type === 'india') {
      if (trip.travel_mode === 'road' && trip.border_slug) {
        const border = allBorders.find((b) => b.id === trip.border_slug)
        return border ? `Overland from India via ${border.crossing_name}` : 'Overland from India'
      }
      return 'Flight from India to Kathmandu'
    }
    if (trip.origin_type === 'international') {
      return 'International Flight Arrival'
    }
    return 'Exploring within Nepal'
  }, [trip.origin_type, trip.travel_mode, trip.border_slug, allBorders])

  const dateText = formatTripDateRange(trip.start_date, trip.end_date, trip.days)

  const activeAdvisor = advisors.find((a) => a.whatsapp_number)
  const advisorWhatsappMessage = `Hi, I'm reviewing a shared Nepal trip on NepaYatra (${trip.title}): https://www.nepayatra.com/trip/${trip.share_id}`

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── HEADER & BREADCRUMBS ── */}
      <section className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container py-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Trip Planner', href: '/route-planner' },
              { label: 'Shared Itinerary' },
            ]}
          />

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <p className={atlasSectionEyebrow}>Shared Nepal Itinerary</p>
              <h1 className={cn('mt-1 font-bold text-foreground', atlasDisplayLg)}>
                {trip.title}
              </h1>

              {/* Meta tags */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="secondary" className="gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {dateText}
                </Badge>
                <Badge variant="secondary" className="gap-1.5 font-medium">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {trip.traveler_count} {trip.traveler_count === 1 ? 'Traveler' : 'Travelers'}
                  {trip.traveler_type ? ` · ${trip.traveler_type}` : ''}
                </Badge>
                <Badge variant="secondary" className="gap-1.5 font-medium">
                  <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                  {originDescription}
                </Badge>
                <Badge className="bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))] hover:bg-[hsl(var(--atlas-blue))]/15">
                  {(trip.travel_style ?? budget.effectiveTier).toUpperCase()} TIER
                </Badge>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex shrink-0 items-center gap-3">
              <Button asChild size="lg" className="gap-2 shadow-sm font-semibold">
                <Link href="/route-planner">
                  Plan a Trip Like This <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: ITINERARY & BUDGET (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Share Controls Bar */}
            <ShareTripControls
              shareId={trip.share_id}
              tripTitle={trip.title}
            />

            {/* Advisory note if present */}
            {route.routeQualityNote && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100">
                      Route Advisory Note
                    </p>
                    <p className="mt-1">{route.routeQualityNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className={cn(atlasCardPlanner, 'p-3.5 bg-card')}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Estimated Cost
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  NPR {budget.estimatedTotalNpr.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-muted-foreground">Total reference cost</p>
              </div>

              <div className={cn(atlasCardPlanner, 'p-3.5 bg-card')}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Duration
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {trip.days} Days
                </p>
                <p className="text-[10px] text-muted-foreground">{route.travelDays} travel legs</p>
              </div>

              <div className={cn(atlasCardPlanner, 'p-3.5 bg-card')}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Travel Distance
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {route.totalDistanceKm} km
                </p>
                <p className="text-[10px] text-muted-foreground">Road / transfer total</p>
              </div>

              <div className={cn(atlasCardPlanner, 'p-3.5 bg-card')}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Destinations
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {trip.destination_slugs.length} Stops
                </p>
                <p className="text-[10px] text-muted-foreground">Optimized sequence</p>
              </div>
            </div>

            {/* Budget Breakdown Card */}
            <article className={cn(atlasCardPlanner, 'p-5 bg-card border-[hsl(var(--atlas-blue))]/25')}>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-[hsl(var(--atlas-blue))]" />
                  <h3 className="font-display text-base font-bold sm:text-lg">
                    Estimated Budget Breakdown
                  </h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {trip.traveler_count} {trip.traveler_count === 1 ? 'Person' : 'Persons'} · {budget.roomCount} {budget.roomCount === 1 ? 'Room' : 'Rooms'}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building className="h-3.5 w-3.5 text-[hsl(var(--atlas-blue))]" />
                    Accommodation
                  </span>
                  <p className="mt-1 font-display text-base font-bold">
                    NPR {budget.categoryBreakdown.accommodationNpr.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Bus className="h-3.5 w-3.5 text-[hsl(var(--atlas-saffron))]" />
                    Transport
                  </span>
                  <p className="mt-1 font-display text-base font-bold">
                    NPR {budget.categoryBreakdown.transportNpr.toLocaleString('en-IN')}
                  </p>
                </div>

                {budget.categoryBreakdown.domesticFlightsNpr > 0 && (
                  <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Plane className="h-3.5 w-3.5 text-sky-500" />
                      Domestic Flights
                    </span>
                    <p className="mt-1 font-display text-base font-bold">
                      NPR {budget.categoryBreakdown.domesticFlightsNpr.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Utensils className="h-3.5 w-3.5 text-emerald-500" />
                    Food & Meals
                  </span>
                  <p className="mt-1 font-display text-base font-bold">
                    NPR {budget.categoryBreakdown.foodNpr.toLocaleString('en-IN')}
                  </p>
                </div>

                {budget.categoryBreakdown.activitiesNpr > 0 && (
                  <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                      Activities & Entry
                    </span>
                    <p className="mt-1 font-display text-base font-bold">
                      NPR {budget.categoryBreakdown.activitiesNpr.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    Misc & Buffer
                  </span>
                  <p className="mt-1 font-display text-base font-bold">
                    NPR {(budget.categoryBreakdown.miscNpr + budget.contingencyBufferNpr).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/80 italic">
                * Reference estimate based on typical seasonal rates and public transport/stay pricing. Not a guaranteed or live booking price.
              </p>
            </article>

            {/* Day-by-Day Itinerary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">
                  Day-by-Day Itinerary
                </h3>
                <span className="text-xs text-muted-foreground">
                  {budget.dailyItinerary.length} Days Planned
                </span>
              </div>

              <div className="space-y-3">
                {budget.dailyItinerary.map((day) => (
                  <article
                    key={day.dayNumber}
                    className={cn(
                      atlasCardPlanner,
                      'p-4 bg-card transition-all hover:border-[hsl(var(--atlas-blue))]/40'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--atlas-blue))]/10 font-mono text-xs font-bold text-[hsl(var(--atlas-blue))]">
                          {day.dayNumber}
                        </span>
                        <div>
                          <h4 className="font-display text-base font-bold text-foreground">
                            {day.destinationName}
                          </h4>
                          {day.isTravelDay && (
                            <span className="text-[11px] font-medium text-[hsl(var(--atlas-saffron))]">
                              Travel / Transit Day
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display text-sm font-bold text-foreground">
                          NPR {day.dayTotalNpr.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[10px] text-muted-foreground">Day total</p>
                      </div>
                    </div>

                    {/* Transport info if travel day */}
                    {day.transport && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                        <Bus className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--atlas-saffron))]" />
                        <span>
                          {day.transport.fromName} → {day.transport.toName} via {day.transport.transportType}
                          {day.transport.durationHours ? ` (~${day.transport.durationHours} hrs)` : ''}
                        </span>
                      </div>
                    )}

                    {/* Accommodation info */}
                    {day.accommodation && (
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-[hsl(var(--atlas-blue))]" />
                          {day.accommodation.name} ({day.accommodation.tier.toUpperCase()})
                        </span>
                        <span className="font-medium">
                          NPR {day.accommodation.totalCostNpr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    {/* Activities if any */}
                    {day.activities && day.activities.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {day.activities.map((act) => (
                          <div key={act.id} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 text-foreground/80">
                              <Sparkles className="h-3 w-3 text-purple-400" />
                              {act.name}
                            </span>
                            <span>NPR {act.totalCostNpr.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Secondary Advisor Consultation Card */}
            {activeAdvisor && (
              <article
                className={cn(
                  atlasCardPlanner,
                  'border-[hsl(var(--atlas-blue))]/25 bg-[hsl(var(--atlas-blue))]/[0.03] p-5 sm:p-6'
                )}
              >
                <div>
                  <h3 className="font-display text-base font-bold sm:text-lg">
                    Want a local advisor to review this route?
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    Connect with a local travel advisor in Nepal on WhatsApp for friendly advice on road conditions, transport choices, and timing. Free consultation, no booking required.
                  </p>
                </div>

                <div className="mt-4 flex">
                  <Button asChild variant="outline" className="gap-2 border-[hsl(var(--atlas-saffron))]/50 text-[hsl(var(--atlas-blue))] hover:bg-[hsl(var(--atlas-saffron))]/10">
                    <a
                      href={whatsappLink(activeAdvisor.whatsapp_number!, advisorWhatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 text-[hsl(var(--atlas-saffron))]" />
                      Message {activeAdvisor.name.split(' ')[0]} on WhatsApp
                    </a>
                  </Button>
                </div>
              </article>
            )}
          </div>

          {/* RIGHT COLUMN: MAP PREVIEW & STOPS (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Map Card */}
            <div className="sticky top-20 space-y-4">
              <div className={cn(atlasMapFrame, 'relative h-[360px] md:h-[420px] overflow-hidden border-border/50')}>
                <TripMap
                  destinations={allDestinations}
                  borders={allBorders}
                  selectedDestinationIds={selectedDestinationIds}
                  selectedBorderId={trip.border_slug}
                  route={routePreview}
                  numberedStops={numberedStops}
                />
              </div>

              {/* Stop Sequence Card */}
              <article className={cn(atlasCardPlanner, 'p-4 bg-card')}>
                <h4 className="font-display text-sm font-bold text-foreground">
                  Route Stop Sequence
                </h4>
                <div className="mt-3 space-y-2">
                  {route.dayAllocations.map((alloc, idx) => (
                    <div
                      key={alloc.slug}
                      className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--atlas-blue))] text-[10px] font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-foreground">{alloc.destinationName}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {alloc.days} {alloc.days === 1 ? 'Day' : 'Days'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </article>

              {/* Callout box */}
              <div className="rounded-xl border border-[hsl(var(--atlas-saffron))]/30 bg-[hsl(var(--atlas-saffron))]/5 p-4 text-center">
                <h4 className="font-display text-sm font-bold text-foreground">
                  Want to customize this route?
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Open our interactive planner to adjust stops, duration, travel style, and calculate realistic budgets.
                </p>
                <div className="mt-3">
                  <Button asChild size="sm" className="w-full shadow-sm">
                    <Link href="/route-planner">
                      Open Trip Planner <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
