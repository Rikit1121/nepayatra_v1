'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
  Milestone,
  Plane,
  Car,
  Globe,
  MapPin,
  Users,
  Calendar,
  Wallet,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapSkeleton } from '@/components/map'
import { cn, slugify } from '@/lib/utils'
import {
  atlasCardPlanner,
  atlasSectionEyebrow,
  atlasStepDefault,
  atlasStepSelected,
} from '@/lib/design-system'
import { DESTINATION_CATEGORY_LABELS } from '@/lib/site-config'
import { usePlannerUrlState } from '@/hooks/route-planner/use-planner-url-state'
import {
  generateRoute,
  buildPlannerWhatsAppMessage,
  STYLE_CATEGORIES,
  ORIGIN_OPTIONS,
  ORIGIN_BORDER_SUGGESTIONS,
  STYLE_OPTIONS,
  TRAVEL_BUDGET_STYLE_OPTIONS,
  INTEREST_OPTIONS,
  INDIA_FLIGHT_CITIES,
  MAX_DESTINATIONS,
  MIN_DESTINATIONS,
  MIN_DAYS,
  MAX_DAYS,
  PLANNER_STEPS,
  normalizeDestinationSlugs,
  resolveDestinationSlugs,
  clampWizardStep,
  type RoutePlannerData,
  type PlannerDestination,
  type PlannerState,
  type GeneratedRoute,
  type OriginType,
  type OriginRegion,
  type TravelMode,
  type TravelerType,
  type PlannerTravelCategory,
  type TravelBudgetStyle,
  type PlannerInterest,
} from '@/lib/route-planner'
import {
  buildRoutePreview,
  destinationToMarker,
  borderToMarker,
  findBorderBySlug,
} from './planner-map'
import { RouteResults } from './route-results'
import { AdvisorHandoff } from './advisor-handoff'
import { PlannerInspirationStack } from './planner-inspiration-stack'
import {
  getPlannerInspirationCards,
  getInspirationEyebrow,
} from './planner-inspiration-data'
import type { DestinationMapMarker } from '@/lib/map'
import type { RouteStop } from '@/components/map'

const PlannerMap = dynamic(() => import('./planner-map').then((m) => m.PlannerMap), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

interface RoutePlannerClientProps {
  data: RoutePlannerData
}

// ─────────────────────────────────────────────────────────────
// Step configurations
// ─────────────────────────────────────────────────────────────

export type PlannerContentStep =
  | 'origin'
  | 'entry'
  | 'dates'
  | 'travelers'
  | 'destinations'
  | 'style'
  | 'review'

export interface PlannerStepDef {
  id: PlannerContentStep
  label: string
}

export function getEffectiveSteps(originType: OriginType | null): PlannerStepDef[] {
  if (originType === 'in-nepal') {
    return [
      { id: 'origin', label: 'Where from?' },
      { id: 'dates', label: 'Dates' },
      { id: 'travelers', label: 'Travelers' },
      { id: 'destinations', label: 'Destinations' },
      { id: 'style', label: 'Style & Budget' },
      { id: 'review', label: 'Review & Build' },
    ]
  }
  return [
    { id: 'origin', label: 'Where from?' },
    { id: 'entry', label: 'How entering?' },
    { id: 'dates', label: 'Dates' },
    { id: 'travelers', label: 'Travelers' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'style', label: 'Style & Budget' },
    { id: 'review', label: 'Review & Build' },
  ]
}

// ─────────────────────────────────────────────────────────────
// canProceed — per step
// ─────────────────────────────────────────────────────────────

function canProceed(
  stepId: PlannerContentStep,
  state: PlannerState,
  validDestinationCount: number
): boolean {
  switch (stepId) {
    case 'origin':
      return Boolean(state.originType)
    case 'entry':
      if (state.originType === 'india') {
        if (state.travelMode === 'flight') return true
        if (state.travelMode === 'road') return Boolean(state.borderSlug)
        return false
      }
      if (state.originType === 'international') {
        return Boolean(state.travelMode) || Boolean(state.originType)
      }
      return true
    case 'dates':
      return state.days >= MIN_DAYS
    case 'travelers':
      return Boolean(state.travelerType)
    case 'destinations':
      return validDestinationCount >= MIN_DESTINATIONS
    case 'style':
      return true // style/budget optional
    case 'review':
      return true
    default:
      return true
  }
}

// ─────────────────────────────────────────────────────────────
// Main client
// ─────────────────────────────────────────────────────────────

export function RoutePlannerClient({ data }: RoutePlannerClientProps) {
  const { state, update } = usePlannerUrlState()
  const [mobileTab, setMobileTab] = React.useState<'plan' | 'map'>('plan')

  const border = React.useMemo(
    () => findBorderBySlug(data.borders, state.borderSlug),
    [data.borders, state.borderSlug]
  )

  const suggestedBorderSlugs = React.useMemo(() => {
    if (!state.from) return new Set<string>()
    return new Set(ORIGIN_BORDER_SUGGESTIONS[state.from] ?? [])
  }, [state.from])

  const filteredDestinations = React.useMemo(() => {
    if (!state.travelCategory || state.travelCategory === 'mixed') return data.destinations
    const cats = STYLE_CATEGORIES[state.travelCategory]
    if (!cats) return data.destinations
    return data.destinations.filter((d) => cats.includes(d.category))
  }, [data.destinations, state.travelCategory])

  const knownDestinationSlugs = React.useMemo(
    () => new Set(data.destinations.map((d) => d.slug)),
    [data.destinations]
  )

  const validDestinationSlugs = React.useMemo(
    () => resolveDestinationSlugs(state.destinationSlugs, knownDestinationSlugs),
    [state.destinationSlugs, knownDestinationSlugs]
  )

  const validDestinationCount = validDestinationSlugs.length

  const selectedDestinations = React.useMemo(
    () =>
      validDestinationSlugs
        .map((slug) => data.destinations.find((d) => d.slug === slug))
        .filter((d): d is PlannerDestination => Boolean(d)),
    [validDestinationSlugs, data.destinations]
  )

  const generatedRoute: GeneratedRoute | null = React.useMemo(() => {
    if (!state.generated) return null
    return generateRoute({
      destinations: data.destinations,
      connections: data.connections,
      border: border ?? null,
      selectedSlugs: validDestinationSlugs,
      totalDays: state.days,
      travelMode: state.travelMode,
    })
  }, [state.generated, state.travelMode, validDestinationSlugs, state.days, data, border])

  const mapDestinations = React.useMemo(
    () => data.destinations.map(destinationToMarker),
    [data.destinations]
  )

  const mapBorders = React.useMemo(
    () =>
      data.borders
        .map(borderToMarker)
        .filter((b): b is NonNullable<ReturnType<typeof borderToMarker>> => b != null),
    [data.borders]
  )

  const routePreview = React.useMemo(() => {
    if (!generatedRoute) return null
    const points: { longitude: number; latitude: number; label: string }[] = []
    // For road travelers only: show the border as the route start point
    if (
      state.travelMode === 'road' &&
      border?.latitude != null &&
      border?.longitude != null
    ) {
      points.push({
        longitude: border.longitude,
        latitude: border.latitude,
        label: border.crossing_name,
      })
    }
    for (const stop of generatedRoute.orderedStops) {
      points.push({
        longitude: stop.longitude,
        latitude: stop.latitude,
        label: stop.name,
      })
    }
    if (points.length < 2) return null
    return buildRoutePreview(points)
  }, [generatedRoute, border, state.travelMode])

  const numberedStops: RouteStop[] = React.useMemo(() => {
    if (!generatedRoute) return []
    let n = 1
    return generatedRoute.orderedStops
      .filter((s) => validDestinationSlugs.includes(s.slug))
      .map((s) => ({
        longitude: s.longitude,
        latitude: s.latitude,
        label: s.name,
        number: n++,
      }))
  }, [generatedRoute, validDestinationSlugs])

  const toggleDestination = (slug: string) => {
    update((current) => {
      const selected = resolveDestinationSlugs(
        current.destinationSlugs,
        knownDestinationSlugs
      )
      const has = selected.includes(slug)
      let next: string[]
      if (has) {
        next = selected.filter((s) => s !== slug)
      } else if (selected.length >= MAX_DESTINATIONS) {
        return {}
      } else {
        next = normalizeDestinationSlugs([...selected, slug])
      }
      return { destinationSlugs: next }
    })
  }

  const handleMapSelect = (d: DestinationMapMarker) => {
    toggleDestination(d.slug)
  }

  // ── canBuild ─────────────────────────────────────────────
  const canBuild = React.useMemo(() => {
    if (validDestinationCount < MIN_DESTINATIONS) return false
    if (state.days < MIN_DAYS) return false
    if (state.originType === 'india' && state.travelMode === 'road') {
      return Boolean(state.borderSlug)
    }
    return true
  }, [state.originType, state.travelMode, state.borderSlug, validDestinationCount, state.days])

  // ── Wizard navigation ─────────────────────────────────────
  const steps = React.useMemo(
    () => getEffectiveSteps(state.originType),
    [state.originType]
  )
  const effectiveStepCount = steps.length
  const wizardStep = React.useMemo(
    () => Math.min(effectiveStepCount, clampWizardStep(state.step)),
    [state.step, effectiveStepCount]
  )
  const currentStepDef = steps[wizardStep - 1] ?? steps[0]
  const currentStepId = currentStepDef.id

  const goStep = (step: number) =>
    update((current) => ({
      step,
      generated: step <= effectiveStepCount ? false : current.generated,
    }))

  const handleBuild = () => {
    if (!canBuild) return
    update({ generated: true, step: effectiveStepCount + 1 })
    setMobileTab('map')
  }

  const proceed = canProceed(currentStepId, state, validDestinationCount)

  const whatsappMessage = buildPlannerWhatsAppMessage(
    state,
    border?.crossing_name ?? null,
    selectedDestinations.map((d) => d.name)
  )

  // ── Inspiration ───────────────────────────────────────────
  const showInspiration = !state.generated && wizardStep <= 2

  const inspirationCards = React.useMemo(
    () => getPlannerInspirationCards(wizardStep, data.destinations),
    [wizardStep, data.destinations]
  )

  // ── Map interactivity — show only on destinations step ────
  const mapOnSelect = currentStepId === 'destinations' && !state.generated ? handleMapSelect : undefined

  // ── Step progress bar — use effective steps ───────────────
  const progressSteps = Array.from({ length: effectiveStepCount })

  // ─────────────────────────────────────────────────────────
  // Panel: step content
  // ─────────────────────────────────────────────────────────

  const panelContent = (
    <div className="flex h-full min-h-0 flex-col">
      {/* Step indicator */}
      <div className="shrink-0 border-b px-4 py-3">
        <p className={atlasSectionEyebrow}>
          Step {wizardStep} of {effectiveStepCount}
          {state.generated && ' · Plan ready'}
        </p>
        <p className="mt-1 font-display text-base font-bold sm:text-lg">
          {state.generated ? 'Your Nepal Trip' : currentStepDef.label}
        </p>
        <div className="mt-2 flex gap-1">
          {progressSteps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full',
                i + 1 <= wizardStep || state.generated
                  ? 'bg-[hsl(var(--atlas-blue))]'
                  : 'bg-[hsl(var(--atlas-stone))]/25'
              )}
            />
          ))}
        </div>
      </div>

      {/* Step body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {state.generated && generatedRoute ? (
          <div className="space-y-6">
            <RouteResults route={generatedRoute} totalTripDays={state.days} />
            <AdvisorHandoff advisors={data.advisors} message={whatsappMessage} />
            <Button
              variant="outline"
              className="w-full border-[hsl(var(--atlas-blue))]/30"
              onClick={() => update({ generated: false, step: effectiveStepCount - 1 })}
            >
              Adjust plan
            </Button>
          </div>
        ) : (
          <>
            {/* STEP 1: Origin */}
            {currentStepId === 'origin' && (
              <StepOriginType
                value={state.originType}
                onChange={(originType) => {
                  if (originType === 'in-nepal') {
                    update({
                      originType,
                      travelMode: null,
                      borderSlug: null,
                      from: null,
                      originCity: null,
                      originCountry: null,
                      step: 2,
                    })
                  } else if (originType === 'international') {
                    update({
                      originType,
                      travelMode: 'flight',
                      borderSlug: null,
                      from: null,
                      originCity: null,
                      originCountry: null,
                      step: 2,
                    })
                  } else {
                    update({
                      originType,
                      travelMode: null,
                      borderSlug: null,
                      from: null,
                      originCity: null,
                      originCountry: null,
                      step: 2,
                    })
                  }
                }}
              />
            )}

            {/* STEP 2: Entry Method (india / international only) */}
            {currentStepId === 'entry' && (
              <StepEntry
                originType={state.originType}
                travelMode={state.travelMode}
                borderSlug={state.borderSlug}
                originRegion={state.from}
                originCity={state.originCity}
                originCountry={state.originCountry}
                borders={data.borders}
                suggestedBorderSlugs={suggestedBorderSlugs}
                onTravelModeChange={(travelMode) =>
                  update({
                    travelMode,
                    borderSlug: null,
                    from: null,
                    originCity: null,
                  })
                }
                onBorderChange={(borderSlug) => update({ borderSlug })}
                onOriginRegionChange={(from) => update({ from, borderSlug: null })}
                onCityChange={(originCity) => update({ originCity })}
                onCountryChange={(originCountry) => update({ originCountry })}
              />
            )}

            {/* STEP 3 (or 2 for in-nepal): Dates */}
            {currentStepId === 'dates' && (
              <StepDates
                startDate={state.startDate}
                endDate={state.endDate}
                days={state.days}
                onStartDateChange={(startDate) => update({ startDate })}
                onEndDateChange={(endDate) => update({ endDate })}
                onDaysChange={(days) => update({ days })}
              />
            )}

            {/* STEP 4 (or 3 for in-nepal): Travelers */}
            {currentStepId === 'travelers' && (
              <StepTravelers
                travelerType={state.travelerType}
                travelerCount={state.travelerCount}
                onTypeChange={(travelerType) => update({ travelerType })}
                onCountChange={(travelerCount) => update({ travelerCount })}
              />
            )}

            {/* STEP 5 (or 4 for in-nepal): Destinations */}
            {currentStepId === 'destinations' && (
              <StepDestinations
                destinations={filteredDestinations}
                selected={validDestinationSlugs}
                selectedCount={validDestinationCount}
                travelCategory={state.travelCategory}
                onToggle={toggleDestination}
                onCategoryChange={(travelCategory) => update({ travelCategory })}
              />
            )}

            {/* STEP 6 (or 5 for in-nepal): Style & Budget */}
            {currentStepId === 'style' && (
              <StepStyleBudget
                travelStyle={state.travelStyle}
                interests={state.interests}
                budgetNpr={state.budgetNpr}
                onStyleChange={(travelStyle) => update({ travelStyle })}
                onInterestsChange={(interests) => update({ interests })}
                onBudgetChange={(budgetNpr) => update({ budgetNpr })}
              />
            )}

            {/* STEP 7 (or 6 for in-nepal): Review & Build */}
            {currentStepId === 'review' && (
              <StepReview
                state={state}
                borderName={border?.crossing_name ?? null}
                selectedDestinations={selectedDestinations}
                canBuild={canBuild}
                onBuild={handleBuild}
                onEditStep={(targetStepId) => {
                  const idx = steps.findIndex((s) => s.id === targetStepId)
                  if (idx !== -1) {
                    goStep(idx + 1)
                  }
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom nav — back / next */}
      {!state.generated && (
        <div className="z-20 shrink-0 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-1px_0_0_hsl(var(--border))]">
          <div className="flex w-full items-center justify-between gap-3">
            {wizardStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px] border-[hsl(var(--atlas-blue))]/30"
                onClick={() => goStep(wizardStep - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span aria-hidden className="w-px shrink-0" />
            )}

            {wizardStep < effectiveStepCount ? (
              <Button
                size="sm"
                className="min-h-[44px] shrink-0 shadow-sm"
                disabled={!proceed}
                onClick={() => goStep(wizardStep + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                className="min-h-[44px] shrink-0 shadow-sm"
                disabled={!canBuild}
                onClick={handleBuild}
              >
                Build My Trip
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const inspirationPanel = (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-[hsl(var(--atlas-mist))]/25 px-4 py-8 lg:px-8">
      <PlannerInspirationStack
        cards={inspirationCards}
        eyebrow={getInspirationEyebrow(wizardStep)}
        className="w-full max-w-md lg:max-w-none"
      />
    </div>
  )

  const mapPanel = (
    <PlannerMap
      destinations={mapDestinations}
      borders={state.travelMode === 'road' || !state.originType ? mapBorders : []}
      selectedDestinationIds={selectedDestinations.map((d) => d.id)}
      selectedBorderId={state.travelMode === 'road' ? (border?.id ?? null) : null}
      route={routePreview}
      numberedStops={numberedStops}
      onSelectDestination={mapOnSelect}
      className="h-full min-h-[280px] w-full"
    />
  )

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* Mobile tabs when route generated */}
      {state.generated && (
        <div className="flex shrink-0 border-b lg:hidden">
          <button
            type="button"
            className={cn(
              'flex-1 min-h-[44px] py-3 text-sm font-medium',
              mobileTab === 'plan' &&
                'border-b-2 border-[hsl(var(--atlas-blue))] font-semibold text-[hsl(var(--atlas-blue))]'
            )}
            onClick={() => setMobileTab('plan')}
          >
            Your trip
          </button>
          <button
            type="button"
            className={cn(
              'flex flex-1 min-h-[44px] items-center justify-center gap-1 py-3 text-sm font-medium',
              mobileTab === 'map' &&
                'border-b-2 border-[hsl(var(--atlas-blue))] font-semibold text-[hsl(var(--atlas-blue))]'
            )}
            onClick={() => setMobileTab('map')}
          >
            <MapIcon className="h-4 w-4" />
            Map
          </button>
        </div>
      )}

      {/* Planner panel — 40% desktop */}
      <div
        className={cn(
          'flex min-h-0 w-full flex-col lg:h-full lg:w-[40%] lg:max-w-xl lg:border-r',
          state.generated && mobileTab === 'map' && 'hidden lg:flex',
          currentStepId === 'destinations' && !state.generated && 'max-h-[58dvh] flex-1 lg:max-h-none'
        )}
      >
        {panelContent}
      </div>

      {/* Mobile inspiration — below planner on steps 1–2 */}
      {showInspiration && (
        <div className="shrink-0 border-t bg-[hsl(var(--atlas-mist))]/20 lg:hidden">
          {inspirationPanel}
        </div>
      )}

      {/* Right panel — inspiration (early steps) or map */}
      <div
        className={cn(
          'w-full min-h-0 flex-1 lg:h-full lg:w-[60%]',
          showInspiration && 'hidden lg:flex',
          !showInspiration && currentStepId !== 'destinations' && !state.generated && 'hidden lg:block',
          state.generated && mobileTab === 'plan' && 'hidden lg:block',
          currentStepId === 'destinations' && !state.generated && 'min-h-[32dvh] shrink-0 lg:min-h-0 lg:shrink'
        )}
      >
        {showInspiration ? inspirationPanel : mapPanel}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────────────────────

// Step 1 — Where from?
function StepOriginType({
  value,
  onChange,
}: {
  value: OriginType | null
  onChange: (v: OriginType) => void
}) {
  const options: { value: OriginType; icon: React.ReactNode; label: string; note: string }[] = [
    {
      value: 'india',
      icon: <MapPin className="h-5 w-5" />,
      label: 'India',
      note: 'Fly to Kathmandu or enter by road via a border crossing',
    },
    {
      value: 'international',
      icon: <Globe className="h-5 w-5" />,
      label: 'International',
      note: 'Flying in from outside India — direct to Kathmandu',
    },
    {
      value: 'in-nepal',
      icon: <Check className="h-5 w-5" />,
      label: 'Already in Nepal',
      note: 'Skip entry — start planning from Nepal directly',
    },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Where are you travelling from? This shapes your entry experience.
      </p>
      <div className="grid gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            id={`origin-type-${opt.value}`}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-start gap-3 text-left',
              atlasStepDefault,
              value === opt.value && atlasStepSelected
            )}
          >
            <span className="mt-0.5 shrink-0 text-[hsl(var(--atlas-blue))]">{opt.icon}</span>
            <div>
              <p className="font-medium">{opt.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{opt.note}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Step 2 — How entering?
function StepEntry({
  originType,
  travelMode,
  borderSlug,
  originRegion,
  originCity,
  originCountry,
  borders,
  suggestedBorderSlugs,
  onTravelModeChange,
  onBorderChange,
  onOriginRegionChange,
  onCityChange,
  onCountryChange,
}: {
  originType: OriginType | null
  travelMode: TravelMode | null
  borderSlug: string | null
  originRegion: OriginRegion | null
  originCity: string | null
  originCountry: string | null
  borders: RoutePlannerData['borders']
  suggestedBorderSlugs: Set<string>
  onTravelModeChange: (v: TravelMode) => void
  onBorderChange: (slug: string) => void
  onOriginRegionChange: (region: OriginRegion | null) => void
  onCityChange: (city: string) => void
  onCountryChange: (country: string) => void
}) {
  if (originType === 'india') {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            How are you entering Nepal?
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              id="travel-mode-flight"
              onClick={() => onTravelModeChange('flight')}
              className={cn(
                'flex items-start gap-3 text-left',
                atlasStepDefault,
                travelMode === 'flight' && atlasStepSelected
              )}
            >
              <span className="mt-0.5 shrink-0 text-[hsl(var(--atlas-blue))]">
                <Plane className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Flight</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Fly from an Indian city to Kathmandu (TIA)
                </p>
              </div>
            </button>

            <button
              type="button"
              id="travel-mode-road"
              onClick={() => onTravelModeChange('road')}
              className={cn(
                'flex items-start gap-3 text-left',
                atlasStepDefault,
                travelMode === 'road' && atlasStepSelected
              )}
            >
              <span className="mt-0.5 shrink-0 text-[hsl(var(--atlas-blue))]">
                <Car className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Road</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Cross the border overland — bus, taxi or private vehicle
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* If Flight selected */}
        {travelMode === 'flight' && (
          <div className="space-y-3 border-t pt-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Departure city (optional)
              </p>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                {INDIA_FLIGHT_CITIES.map((city) => (
                  <button
                    key={city.value}
                    type="button"
                    id={`flight-city-${city.value}`}
                    onClick={() => onCityChange(city.value)}
                    className={cn(
                      atlasStepDefault,
                      'text-xs py-2 justify-center text-center',
                      originCity === city.value && atlasStepSelected
                    )}
                  >
                    <span className="font-medium">{city.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={cn(atlasCardPlanner, 'flex items-center gap-2 p-3 text-sm')}>
              <Plane className="h-4 w-4 shrink-0 text-[hsl(var(--atlas-blue))]" />
              <span className="text-muted-foreground">
                Your route starts at <span className="font-semibold text-foreground">Kathmandu (TIA)</span> — no land border crossing involved.
              </span>
            </div>
          </div>
        )}

        {/* If Road selected */}
        {travelMode === 'road' && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Starting region in India
                </p>
                {originRegion && (
                  <button
                    type="button"
                    onClick={() => onOriginRegionChange(null)}
                    className="text-xs text-[hsl(var(--atlas-blue))] hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ORIGIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`origin-region-${opt.value}`}
                    onClick={() =>
                      onOriginRegionChange(originRegion === opt.value ? null : opt.value)
                    }
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      originRegion === opt.value
                        ? 'border-[hsl(var(--atlas-blue))] bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]'
                        : 'border-muted-foreground/30 text-muted-foreground hover:border-[hsl(var(--atlas-blue))]/50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Select border crossing
              </p>
              <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
                {[...borders]
                  .sort((a, b) => {
                    const aS = suggestedBorderSlugs.has(slugify(a.crossing_name)) ? 0 : 1
                    const bS = suggestedBorderSlugs.has(slugify(b.crossing_name)) ? 0 : 1
                    return aS - bS || (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
                  })
                  .map((b) => {
                    const slug = slugify(b.crossing_name)
                    const isSuggested = suggestedBorderSlugs.has(slug)
                    return (
                      <button
                        key={b.id}
                        type="button"
                        id={`border-${slug}`}
                        onClick={() => onBorderChange(slug)}
                        className={cn(
                          'flex w-full items-start gap-3 text-left',
                          atlasStepDefault,
                          borderSlug === slug && atlasStepSelected
                        )}
                      >
                        <Milestone className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--atlas-blue))]" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{b.crossing_name}</p>
                            {isSuggested && (
                              <Badge
                                variant="secondary"
                                className="border-[hsl(var(--atlas-saffron))]/30 bg-[hsl(var(--atlas-saffron))]/10 text-[10px] text-[hsl(var(--atlas-saffron))]"
                              >
                                Suggested
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {b.india_side} → {b.nepal_side}
                          </p>
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // International flow:
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Where are you flying from? Your route will begin at Kathmandu (TIA).
      </p>

      <div
        className={cn(
          'flex items-start gap-3 text-left',
          atlasStepDefault,
          atlasStepSelected
        )}
      >
        <span className="mt-0.5 shrink-0 text-[hsl(var(--atlas-blue))]">
          <Plane className="h-5 w-5" />
        </span>
        <div>
          <p className="font-medium">International Flight</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Fly into Kathmandu (TIA) from your country
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="flight-country"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Country (optional)
          </label>
          <input
            type="text"
            id="flight-country"
            value={originCountry ?? ''}
            onChange={(e) => onCountryChange(e.target.value)}
            placeholder="e.g. United States, United Kingdom, Australia"
            className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--atlas-blue))]/50"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="flight-city-intl"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            City (optional)
          </label>
          <input
            type="text"
            id="flight-city-intl"
            value={originCity ?? ''}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="e.g. New York, London, Sydney"
            className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--atlas-blue))]/50"
          />
        </div>
      </div>

      <div className={cn(atlasCardPlanner, 'flex items-center gap-2 p-3 text-sm')}>
        <Plane className="h-4 w-4 shrink-0 text-[hsl(var(--atlas-blue))]" />
        <span className="text-muted-foreground">
          Your route starts at <span className="font-semibold text-foreground">Kathmandu (TIA)</span> — no land border crossing involved.
        </span>
      </div>
    </div>
  )
}

// Step 4 — Dates
function StepDates({
  startDate,
  endDate,
  days,
  onStartDateChange,
  onEndDateChange,
  onDaysChange,
}: {
  startDate: string | null
  endDate: string | null
  days: number
  onStartDateChange: (v: string) => void
  onEndDateChange: (v: string) => void
  onDaysChange: (v: number) => void
}) {
  const today = new Date().toISOString().split('T')[0]

  // Auto-calculate days when both dates set
  const handleEndDate = (ed: string) => {
    onEndDateChange(ed)
    if (startDate && ed) {
      const diff = Math.round(
        (new Date(ed).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (diff >= MIN_DAYS && diff <= MAX_DAYS) onDaysChange(diff)
    }
  }

  const handleStartDate = (sd: string) => {
    onStartDateChange(sd)
    if (sd && endDate) {
      const diff = Math.round(
        (new Date(endDate).getTime() - new Date(sd).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (diff >= MIN_DAYS && diff <= MAX_DAYS) onDaysChange(diff)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        When are you planning to travel? ({MIN_DAYS}–{MAX_DAYS} days in Nepal)
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="trip-start-date"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Start date
          </label>
          <input
            type="date"
            id="trip-start-date"
            min={today}
            value={startDate ?? ''}
            onChange={(e) => handleStartDate(e.target.value)}
            className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--atlas-blue))]/50"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="trip-end-date"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            End date
          </label>
          <input
            type="date"
            id="trip-end-date"
            min={startDate ?? today}
            value={endDate ?? ''}
            onChange={(e) => handleEndDate(e.target.value)}
            className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--atlas-blue))]/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Days in Nepal
          </label>
          <span className="font-display text-2xl font-bold tabular-nums text-[hsl(var(--atlas-blue))]">
            {days}
          </span>
        </div>
        <input
          type="range"
          min={MIN_DAYS}
          max={MAX_DAYS}
          value={days}
          id="trip-days-slider"
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className="w-full accent-[hsl(var(--atlas-blue))]"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{MIN_DAYS} days</span>
          <span>{MAX_DAYS} days</span>
        </div>
      </div>
    </div>
  )
}

// Step 5 — Travelers
function StepTravelers({
  travelerType,
  travelerCount,
  onTypeChange,
  onCountChange,
}: {
  travelerType: TravelerType | null
  travelerCount: number
  onTypeChange: (v: TravelerType) => void
  onCountChange: (v: number) => void
}) {
  const options: { value: TravelerType; label: string; note: string }[] = [
    { value: 'solo', label: 'Solo', note: 'Travelling alone' },
    { value: 'couple', label: 'Couple', note: 'Two travelers' },
    { value: 'family', label: 'Family', note: 'With children' },
    { value: 'group', label: 'Group', note: 'Friends or organised group' },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Who are you travelling with?</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            id={`traveler-type-${opt.value}`}
            onClick={() => onTypeChange(opt.value)}
            className={cn(atlasStepDefault, travelerType === opt.value && atlasStepSelected)}
          >
            <p className="font-medium">{opt.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{opt.note}</p>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Users className="mr-1.5 inline h-3.5 w-3.5" />
            Number of travelers
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="traveler-count-minus"
              onClick={() => onCountChange(Math.max(1, travelerCount - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center font-display text-2xl font-bold tabular-nums text-[hsl(var(--atlas-blue))]">
              {travelerCount}
            </span>
            <button
              type="button"
              id="traveler-count-plus"
              onClick={() => onCountChange(Math.min(20, travelerCount + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 6 — Destinations
function StepDestinations({
  destinations,
  selected,
  selectedCount,
  travelCategory,
  onToggle,
  onCategoryChange,
}: {
  destinations: PlannerDestination[]
  selected: string[]
  selectedCount: number
  travelCategory: PlannerTravelCategory | null
  onToggle: (slug: string) => void
  onCategoryChange: (v: PlannerTravelCategory | null) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Pick {MIN_DESTINATIONS}–{MAX_DESTINATIONS} destinations ({selectedCount}/{MAX_DESTINATIONS}{' '}
        selected). Also tap markers on the map.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            !travelCategory
              ? 'border-[hsl(var(--atlas-blue))] bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]'
              : 'border-muted-foreground/30 text-muted-foreground hover:border-[hsl(var(--atlas-blue))]/50'
          )}
        >
          All
        </button>
        {STYLE_OPTIONS.filter((o) => o.value !== 'mixed').map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onCategoryChange(opt.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              travelCategory === opt.value
                ? 'border-[hsl(var(--atlas-blue))] bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]'
                : 'border-muted-foreground/30 text-muted-foreground hover:border-[hsl(var(--atlas-blue))]/50'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid max-h-[min(50vh,28rem)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {destinations.map((d) => {
          const isSelected = selected.includes(d.slug)
          const disabled = !isSelected && selectedCount >= MAX_DESTINATIONS
          return (
            <button
              key={d.id}
              type="button"
              id={`dest-${d.slug}`}
              disabled={disabled}
              onClick={() => onToggle(d.slug)}
              className={cn(
                atlasStepDefault,
                'disabled:opacity-40',
                isSelected && atlasStepSelected
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium leading-tight">{d.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {DESTINATION_CATEGORY_LABELS[d.category]}
                  </p>
                </div>
                {isSelected && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--atlas-saffron))] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
            </button>
          )
        })}
        {destinations.length === 0 && (
          <p className="col-span-2 py-4 text-center text-sm text-muted-foreground">
            No destinations match this filter. Select &quot;All&quot; to see everything.
          </p>
        )}
      </div>
    </div>
  )
}

// Step 7 — Style & Budget
function StepStyleBudget({
  travelStyle,
  interests,
  budgetNpr,
  onStyleChange,
  onInterestsChange,
  onBudgetChange,
}: {
  travelStyle: TravelBudgetStyle | null
  interests: PlannerInterest[]
  budgetNpr: number | null
  onStyleChange: (v: TravelBudgetStyle) => void
  onInterestsChange: (v: PlannerInterest[]) => void
  onBudgetChange: (v: number | null) => void
}) {
  const toggleInterest = (v: PlannerInterest) => {
    const next = interests.includes(v)
      ? interests.filter((i) => i !== v)
      : [...interests, v]
    onInterestsChange(next)
  }

  return (
    <div className="space-y-5">
      {/* Budget tier */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Travel style
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {TRAVEL_BUDGET_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              id={`travel-style-${opt.value}`}
              onClick={() => onStyleChange(opt.value)}
              className={cn(atlasStepDefault, travelStyle === opt.value && atlasStepSelected)}
            >
              <p className="font-medium">{opt.label}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Interests <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              id={`interest-${opt.value}`}
              onClick={() => toggleInterest(opt.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                interests.includes(opt.value)
                  ? 'border-[hsl(var(--atlas-saffron))] bg-[hsl(var(--atlas-saffron))]/10 text-[hsl(var(--atlas-saffron))]'
                  : 'border-muted-foreground/30 text-muted-foreground hover:border-[hsl(var(--atlas-saffron))]/50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label
          htmlFor="budget-npr"
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          <Wallet className="mr-1.5 inline h-3.5 w-3.5" />
          Total trip budget (NPR){' '}
          <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">NPR</span>
          <input
            type="number"
            id="budget-npr"
            min={0}
            step={5000}
            value={budgetNpr ?? ''}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              onBudgetChange(Number.isFinite(v) && v > 0 ? v : null)
            }}
            placeholder="e.g. 50000"
            className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--atlas-blue))]/50"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Budget is saved with your plan. Detailed cost breakdowns come in a future update.
        </p>
      </div>
    </div>
  )
}

// Step 7 (or 6 for in-nepal) — Review & Build
function StepReview({
  state,
  borderName,
  selectedDestinations,
  canBuild,
  onBuild,
  onEditStep,
}: {
  state: PlannerState
  borderName: string | null
  selectedDestinations: PlannerDestination[]
  canBuild: boolean
  onBuild: () => void
  onEditStep: (stepId: PlannerContentStep) => void
}) {
  const originLine = (() => {
    if (state.originType === 'india') {
      if (state.travelMode === 'flight' && state.originCity) {
        return `India · ${state.originCity.replace(/-/g, ' ')} → ✈️ Kathmandu`
      }
      if (state.from) return `India · ${state.from.replace(/-/g, ' ')} (road)`
      return 'India'
    }
    if (state.originType === 'international') {
      const parts = [state.originCity, state.originCountry].filter(Boolean).join(', ')
      return parts ? `${parts} → ✈️ Kathmandu` : 'International flight'
    }
    if (state.originType === 'in-nepal') return 'Already in Nepal'
    return null
  })()

  type ReviewRow = { label: string; value: string; editStepId: PlannerContentStep }
  const rows: ReviewRow[] = [
    originLine ? { label: 'Origin', value: originLine, editStepId: 'origin' } : null,
    state.travelMode === 'road' && borderName
      ? { label: 'Border', value: borderName, editStepId: 'entry' }
      : null,
    {
      label: 'Dates',
      value:
        state.startDate && state.endDate
          ? `${state.startDate} → ${state.endDate} (${state.days} days)`
          : `${state.days} days`,
      editStepId: 'dates',
    },
    {
      label: 'Travelers',
      value: state.travelerType
        ? `${state.travelerType.charAt(0).toUpperCase() + state.travelerType.slice(1)} · ${state.travelerCount} ${state.travelerCount === 1 ? 'person' : 'people'}`
        : `${state.travelerCount} ${state.travelerCount === 1 ? 'person' : 'people'}`,
      editStepId: 'travelers',
    },
    {
      label: 'Destinations',
      value:
        selectedDestinations.length > 0
          ? selectedDestinations.map((d) => d.name).join(' → ')
          : 'None selected',
      editStepId: 'destinations',
    },
    state.travelStyle
      ? {
          label: 'Style',
          value:
            state.travelStyle.charAt(0).toUpperCase() + state.travelStyle.slice(1),
          editStepId: 'style',
        }
      : null,
    state.budgetNpr
      ? {
          label: 'Budget',
          value: `NPR ${state.budgetNpr.toLocaleString('en-NP')}`,
          editStepId: 'style',
        }
      : null,
  ].filter((r): r is ReviewRow => r !== null)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review your plan then hit <strong>Build My Trip</strong> to generate your route.
      </p>

      <div className={cn(atlasCardPlanner, 'divide-y text-sm')}>
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {row.label}
              </p>
              <p className="mt-0.5 font-medium">{row.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(row.editStepId)}
              className="shrink-0 text-xs text-[hsl(var(--atlas-blue))] underline-offset-2 hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {!canBuild && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Please select at least one destination to build your trip.
        </p>
      )}

      <Button
        id="build-my-trip"
        className="w-full shadow-sm"
        size="lg"
        disabled={!canBuild}
        onClick={onBuild}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Build My Trip
      </Button>
    </div>
  )
}
