'use client'

import * as React from 'react'
import type { GeneratedRoute } from '@/lib/route-planner/types'
import type { BudgetResult } from '@/lib/route-planner/budget'
import { DESTINATION_CATEGORY_LABELS } from '@/lib/site-config'
import { Badge } from '@/components/ui/badge'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import {
  Clock,
  MapPin,
  Route,
  Bus,
  Wallet,
  Building,
  Plane,
  Utensils,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface RouteResultsProps {
  route: GeneratedRoute
  totalTripDays: number
  budgetResult?: BudgetResult | null
}

export function RouteResults({
  route,
  totalTripDays,
  budgetResult,
}: RouteResultsProps) {
  const [showAllDays, setShowAllDays] = React.useState(false)

  const displayedDays = React.useMemo(() => {
    if (!budgetResult?.dailyItinerary) return []
    if (showAllDays || budgetResult.dailyItinerary.length <= 4) {
      return budgetResult.dailyItinerary
    }
    return budgetResult.dailyItinerary.slice(0, 3)
  }, [budgetResult?.dailyItinerary, showAllDays])

  return (
    <div className="space-y-4">
      {/* ── BUDGET & COST ESTIMATE CARD ── */}
      {budgetResult && (
        <article
          className={cn(
            atlasCardPlanner,
            'p-4 sm:p-5',
            budgetResult.budgetStatus === 'over_budget'
              ? 'border-amber-500/40 bg-amber-500/5'
              : 'border-[hsl(var(--atlas-blue))]/30'
          )}
        >
          {/* Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
            <h3 className="flex items-center gap-2 font-display text-base font-bold sm:text-lg">
              <Wallet className="h-5 w-5 text-[hsl(var(--atlas-blue))]" />
              Trip Budget Estimate
            </h3>

            {budgetResult.userBudgetNpr != null ? (
              budgetResult.budgetStatus === 'within_budget' ? (
                <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-400">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Within Budget
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-amber-600/20 text-amber-700 hover:bg-amber-600/25 dark:text-amber-300">
                  <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                  Exceeds Budget by NPR {budgetResult.shortfallNpr?.toLocaleString('en-IN')}
                </Badge>
              )
            ) : (
              <Badge variant="secondary" className="bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]">
                {budgetResult.effectiveTier.toUpperCase()} TIER ESTIMATE
              </Badge>
            )}
          </div>

          {/* Numbers Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-background/80 p-3 border border-border/30">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {budgetResult.budgetStatus === 'over_budget'
                  ? 'Min. Realistic Cost'
                  : 'Estimated Cost'}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl">
                NPR {budgetResult.estimatedTotalNpr.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-muted-foreground">
                For {budgetResult.travelerCount} traveler{budgetResult.travelerCount !== 1 ? 's' : ''} ({budgetResult.roomCount} room{budgetResult.roomCount !== 1 ? 's' : ''})
              </p>
            </div>

            {budgetResult.userBudgetNpr != null ? (
              <>
                <div className="rounded-lg bg-background/80 p-3 border border-border/30">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Your Budget
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl">
                    NPR {budgetResult.userBudgetNpr.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Total available for party
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-lg bg-background/80 p-3 border border-border/30">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {budgetResult.budgetStatus === 'within_budget'
                      ? 'Remaining Buffer'
                      : 'Shortfall'}
                  </p>
                  <p
                    className={cn(
                      'mt-1 font-display text-lg font-bold sm:text-xl',
                      budgetResult.budgetStatus === 'within_budget'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    )}
                  >
                    {budgetResult.budgetStatus === 'within_budget'
                      ? `+NPR ${(budgetResult.remainingBudgetNpr ?? 0).toLocaleString('en-IN')}`
                      : `-NPR ${(budgetResult.shortfallNpr ?? 0).toLocaleString('en-IN')}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ~{Math.round((budgetResult.contingencyBufferNpr / (budgetResult.estimatedTotalNpr || 1)) * 100)}% contingency buffer
                  </p>
                </div>
              </>
            ) : (
              <div className="col-span-1 rounded-lg bg-background/80 p-3 border border-border/30">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Contingency Buffer
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl">
                  ~NPR {budgetResult.contingencyBufferNpr.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Recommended 8% emergency reserve
                </p>
              </div>
            )}
          </div>

          {/* Over-budget optimization suggestions */}
          {budgetResult.budgetStatus === 'over_budget' &&
            budgetResult.adjustments.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  Ways to optimize this trip to fit your budget:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-amber-950/90 dark:text-amber-100/90">
                  {budgetResult.adjustments.map((adj) => (
                    <li key={adj.id} className="flex items-start justify-between gap-2">
                      <span>
                        <strong className="font-medium">{adj.title}:</strong> {adj.description}
                      </span>
                      {adj.potentialSavingsNpr ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-amber-500/40 bg-amber-500/20 text-[10px] text-amber-900 dark:text-amber-200"
                        >
                          Save ~NPR {adj.potentialSavingsNpr.toLocaleString('en-IN')}
                        </Badge>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Category Breakdown Breakdown */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <p className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">
              Cost Allocation Breakdown
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded bg-muted/30 p-2">
                <Building className="h-4 w-4 text-[hsl(var(--atlas-blue))] shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Accommodation</span>
                  <span className="font-semibold text-foreground">
                    NPR {budgetResult.categoryBreakdown.accommodationNpr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded bg-muted/30 p-2">
                <Bus className="h-4 w-4 text-[hsl(var(--atlas-saffron))] shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Ground Transport</span>
                  <span className="font-semibold text-foreground">
                    NPR {budgetResult.categoryBreakdown.transportNpr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {budgetResult.categoryBreakdown.domesticFlightsNpr > 0 && (
                <div className="flex items-center gap-2 rounded bg-muted/30 p-2">
                  <Plane className="h-4 w-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Domestic Flights</span>
                    <span className="font-semibold text-foreground">
                      NPR {budgetResult.categoryBreakdown.domesticFlightsNpr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded bg-muted/30 p-2">
                <Utensils className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Food & Meals</span>
                  <span className="font-semibold text-foreground">
                    NPR {budgetResult.categoryBreakdown.foodNpr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded bg-muted/30 p-2">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Activities & Sights</span>
                  <span className="font-semibold text-foreground">
                    NPR {budgetResult.categoryBreakdown.activitiesNpr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded bg-muted/30 p-2">
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">Misc & Water</span>
                  <span className="font-semibold text-foreground">
                    NPR {budgetResult.categoryBreakdown.miscNpr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scope notice */}
          <div className="mt-4 flex items-start gap-1.5 text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/20 pt-2.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              {budgetResult.scopeNote} ({budgetResult.dataProvenance})
            </span>
          </div>
        </article>
      )}

      {/* ── DAY-BY-DAY ITINERARY & EXPENSE ALLOCATION ── */}
      {budgetResult?.dailyItinerary && budgetResult.dailyItinerary.length > 0 && (
        <article className={cn(atlasCardPlanner, 'p-4 sm:p-5')}>
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h3 className="flex items-center gap-2 font-display text-base font-bold">
              <Calendar className="h-4 w-4 text-[hsl(var(--atlas-blue))]" />
              Day-by-Day Plan & Expense Detail
            </h3>
            <Badge variant="outline" className="text-xs">
              {budgetResult.dailyItinerary.length} Days Total
            </Badge>
          </div>

          <div className="mt-4 space-y-3.5">
            {displayedDays.map((day) => (
              <div
                key={day.dayNumber}
                className="rounded-lg border border-border/40 bg-card/60 p-3.5 text-xs shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--atlas-blue))]/15 text-[10px] font-bold text-[hsl(var(--atlas-blue))]">
                      {day.dayNumber}
                    </span>
                    <span className="font-display font-semibold text-sm text-foreground">
                      {day.destinationName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {day.isTravelDay && (
                      <Badge variant="outline" className="text-[10px] border-[hsl(var(--atlas-saffron))]/40 text-[hsl(var(--atlas-saffron))]">
                        Travel Day
                      </Badge>
                    )}
                    <span className="font-bold text-foreground">
                      ~NPR {day.dayTotalNpr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 space-y-2 text-muted-foreground">
                  {/* Transport Leg */}
                  {day.transport && (
                    <div className="flex items-start gap-2">
                      {day.transport.isDomesticFlight ? (
                        <Plane className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                      ) : (
                        <Bus className="h-3.5 w-3.5 text-[hsl(var(--atlas-saffron))] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-medium text-foreground">
                          {day.transport.fromName} → {day.transport.toName}
                        </span>{' '}
                        via {day.transport.transportType}
                        {day.transport.durationText ? ` (${day.transport.durationText})` : ''}
                        {' · '}
                        <span className="font-semibold text-foreground">
                          NPR {day.transport.totalCostNpr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Lodging */}
                  {day.accommodation && (
                    <div className="flex items-start gap-2">
                      <Building className="h-3.5 w-3.5 text-[hsl(var(--atlas-blue))] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">
                          {day.accommodation.name}
                        </span>{' '}
                        ({day.accommodation.tier.replace(/_/g, ' ')})
                        {' · '}
                        <span className="font-semibold text-foreground">
                          NPR {day.accommodation.totalCostNpr.toLocaleString('en-IN')}
                        </span>{' '}
                        ({day.accommodation.rooms} room{day.accommodation.rooms !== 1 ? 's' : ''})
                      </div>
                    </div>
                  )}

                  {/* Food */}
                  <div className="flex items-start gap-2">
                    <Utensils className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span>Daily Meals & Misc</span>
                      {' · '}
                      <span className="font-semibold text-foreground">
                        NPR {(day.food.totalFoodForDayNpr + day.food.totalMiscForDayNpr).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Activities */}
                  {day.activities.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Activities: </span>
                        {day.activities.map((act, i) => (
                          <span key={act.id}>
                            {i > 0 ? ', ' : ''}
                            {act.name}
                            {act.costPerPersonNpr > 0
                              ? ` (NPR ${act.totalCostNpr.toLocaleString('en-IN')})`
                              : ' (Free)'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {budgetResult.dailyItinerary.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAllDays((prev) => !prev)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border/40 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/30 transition-colors"
            >
              {showAllDays ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> View all {budgetResult.dailyItinerary.length} days
                </>
              )}
            </button>
          )}
        </article>
      )}

      {/* ── ROUTE SUMMARY ── */}
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

      {/* ── DAY ALLOCATION ── */}
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

      {/* ── TRAVEL SEQUENCE ── */}
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

      {/* ── DESTINATION HIGHLIGHTS ── */}
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
