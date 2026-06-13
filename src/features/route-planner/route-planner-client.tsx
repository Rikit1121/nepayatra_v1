'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Check, ChevronLeft, ChevronRight, Map as MapIcon, Milestone } from 'lucide-react'
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

const STEP_LABELS = [
  'Where from?',
  'Entry border',
  'Travel style',
  'Destinations',
  'Trip length',
  'Generate',
]

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
    if (!state.style || state.style === 'mixed') return data.destinations
    const cats = STYLE_CATEGORIES[state.style]
    if (!cats) return data.destinations
    return data.destinations.filter((d) => cats.includes(d.category))
  }, [data.destinations, state.style])

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
    })
  }, [state.generated, validDestinationSlugs, state.days, data, border])

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
    if (border?.latitude != null && border?.longitude != null) {
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
  }, [generatedRoute, border])

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

  const canGenerate =
    state.borderSlug &&
    validDestinationCount >= MIN_DESTINATIONS &&
    state.days >= MIN_DAYS

  const handleGenerate = () => {
    if (!canGenerate) return
    update({ generated: true, step: PLANNER_STEPS + 1 })
    setMobileTab('map')
  }

  const whatsappMessage = buildPlannerWhatsAppMessage(
    state,
    border?.crossing_name ?? null,
    selectedDestinations.map((d) => d.name)
  )

  const goStep = (step: number) =>
    update((current) => ({
      step,
      generated: step <= PLANNER_STEPS ? false : current.generated,
    }))

  const wizardStep = React.useMemo(
    () => Math.min(PLANNER_STEPS, clampWizardStep(state.step)),
    [state.step]
  )

  const proceed = canProceed(state, validDestinationCount)

  const showInspiration = !state.generated && wizardStep <= 3

  const inspirationCards = React.useMemo(
    () => getPlannerInspirationCards(wizardStep, data.destinations),
    [wizardStep, data.destinations]
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

  const panelContent = (
    <div className="flex h-full min-h-0 flex-col">
      {/* Step indicator — mobile + desktop compact */}
      <div className="shrink-0 border-b px-4 py-3">
        <p className={atlasSectionEyebrow}>
          Step {wizardStep} of {PLANNER_STEPS}
          {state.generated && ' · Route ready'}
        </p>
        <p className="mt-1 font-display text-base font-bold sm:text-lg">
          {state.generated ? 'Your Nepal route' : STEP_LABELS[wizardStep - 1]}
        </p>
        <div className="mt-2 flex gap-1">
          {STEP_LABELS.map((_, i) => (
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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {state.generated && generatedRoute ? (
          <div className="space-y-6">
            <RouteResults route={generatedRoute} totalTripDays={state.days} />
            <AdvisorHandoff advisors={data.advisors} message={whatsappMessage} />
            <Button variant="outline" className="w-full border-[hsl(var(--atlas-blue))]/30" onClick={() => update({ generated: false, step: 5 })}>
              Adjust plan
            </Button>
          </div>
        ) : (
          <>
            {wizardStep === 1 && (
              <StepOrigin
                value={state.from}
                onChange={(from) =>
                  update({
                    from,
                    borderSlug: null,
                    step: 2,
                  })
                }
              />
            )}

            {wizardStep === 2 && (
              <StepBorder
                borders={data.borders}
                value={state.borderSlug}
                suggested={suggestedBorderSlugs}
                onChange={(borderSlug) => update({ borderSlug, step: 3 })}
              />
            )}

            {wizardStep === 3 && (
              <StepStyle
                value={state.style}
                onChange={(style) => update({ style, step: 4 })}
              />
            )}

            {wizardStep === 4 && (
              <StepDestinations
                destinations={filteredDestinations}
                selected={validDestinationSlugs}
                selectedCount={validDestinationCount}
                onToggle={toggleDestination}
                onContinue={() => goStep(5)}
                canContinue={proceed}
              />
            )}

            {wizardStep === 5 && (
              <StepDuration
                days={state.days}
                onChange={(days) => update({ days })}
              />
            )}

            {wizardStep === 6 && (
              <StepGenerate
                canGenerate={Boolean(canGenerate)}
                summary={{
                  from: state.from,
                  borderName: border?.crossing_name ?? null,
                  style: state.style,
                  destinations: selectedDestinations.map((d) => d.name),
                  days: state.days,
                }}
                onGenerate={handleGenerate}
              />
            )}
          </>
        )}
      </div>

      {!state.generated && (
        <div className="z-20 shrink-0 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-1px_0_0_hsl(var(--border))]">
          <div className="flex w-full items-center justify-between gap-3">
            {wizardStep > 1 ? (
              <Button variant="outline" size="sm" className="min-h-[44px] border-[hsl(var(--atlas-blue))]/30" onClick={() => goStep(wizardStep - 1)}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span aria-hidden className="w-px shrink-0" />
            )}
            {wizardStep < PLANNER_STEPS ? (
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
                disabled={!canGenerate}
                onClick={handleGenerate}
              >
                Generate route
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const mapPanel = (
    <PlannerMap
      destinations={mapDestinations}
      borders={mapBorders}
      selectedDestinationIds={selectedDestinations.map((d) => d.id)}
      selectedBorderId={border?.id ?? null}
      route={routePreview}
      numberedStops={numberedStops}
      onSelectDestination={state.step >= 4 && !state.generated ? handleMapSelect : undefined}
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
              'flex-1 py-3 text-sm font-medium',
              mobileTab === 'plan' && 'border-b-2 border-[hsl(var(--atlas-blue))] font-semibold text-[hsl(var(--atlas-blue))]'
            )}
            onClick={() => setMobileTab('plan')}
          >
            Your route
          </button>
          <button
            type="button"
            className={cn(
              'flex flex-1 items-center justify-center gap-1 py-3 text-sm font-medium',
              mobileTab === 'map' && 'border-b-2 border-[hsl(var(--atlas-blue))] font-semibold text-[hsl(var(--atlas-blue))]'
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
          state.step >= 4 && !state.generated && 'max-h-[58dvh] flex-1 lg:max-h-none'
        )}
      >
        {panelContent}
      </div>

      {/* Mobile inspiration — below planner on steps 1–3 */}
      {showInspiration && (
        <div className="shrink-0 border-t bg-[hsl(var(--atlas-mist))]/20 lg:hidden">
          {inspirationPanel}
        </div>
      )}

      {/* Inspiration (desktop steps 1–3) or map */}
      <div
        className={cn(
          'w-full min-h-0 flex-1 lg:h-full lg:w-[60%]',
          showInspiration && 'hidden lg:flex',
          !showInspiration && state.step < 4 && !state.generated && 'hidden lg:block',
          state.generated && mobileTab === 'plan' && 'hidden lg:block',
          state.step >= 4 && !state.generated && 'min-h-[32dvh] shrink-0 lg:min-h-0 lg:shrink'
        )}
      >
        {showInspiration ? inspirationPanel : mapPanel}
      </div>
    </div>
  )
}

function canProceed(state: PlannerState, validDestinationCount: number) {
  const step = Number(state.step)
  switch (step) {
    case 1:
      return Boolean(state.from)
    case 2:
      return Boolean(state.borderSlug)
    case 3:
      return Boolean(state.style)
    case 4:
      return validDestinationCount >= MIN_DESTINATIONS
    case 5:
      return state.days >= MIN_DAYS
    default:
      return true
  }
}

function StepOrigin({
  value,
  onChange,
}: {
  value: string | null
  onChange: (v: (typeof ORIGIN_OPTIONS)[0]['value']) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Where in India are you starting from? This helps us suggest the best border crossing.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {ORIGIN_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              atlasStepDefault,
              value === opt.value && atlasStepSelected
            )}
          >
            <p className="font-medium">{opt.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{opt.note}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepBorder({
  borders,
  value,
  suggested,
  onChange,
}: {
  borders: RoutePlannerData['borders']
  value: string | null
  suggested: Set<string>
  onChange: (slug: string) => void
}) {
  const sorted = [...borders].sort((a, b) => {
    const aS = suggested.has(slugify(a.crossing_name)) ? 0 : 1
    const bS = suggested.has(slugify(b.crossing_name)) ? 0 : 1
    return aS - bS || (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Choose how you&apos;ll enter Nepal. Suggested crossings for your region appear first.
      </p>
      <div className="space-y-2">
        {sorted.map((b) => {
          const slug = slugify(b.crossing_name)
          const isSuggested = suggested.has(slug)
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onChange(slug)}
              className={cn(
                'flex w-full items-start gap-3 text-left',
                atlasStepDefault,
                value === slug && atlasStepSelected
              )}
            >
              <Milestone className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--atlas-blue))]" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{b.crossing_name}</p>
                  {isSuggested && (
                    <Badge variant="secondary" className="border-[hsl(var(--atlas-saffron))]/30 bg-[hsl(var(--atlas-saffron))]/10 text-[10px] text-[hsl(var(--atlas-saffron))]">
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
  )
}

function StepStyle({
  value,
  onChange,
}: {
  value: string | null
  onChange: (v: (typeof STYLE_OPTIONS)[0]['value']) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        What kind of trip is this? We&apos;ll filter destination suggestions to match.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              atlasStepDefault,
              value === opt.value && atlasStepSelected
            )}
          >
            <p className="font-medium">{opt.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepDestinations({
  destinations,
  selected,
  selectedCount,
  onToggle,
  onContinue,
  canContinue,
}: {
  destinations: PlannerDestination[]
  selected: string[]
  selectedCount: number
  onToggle: (slug: string) => void
  onContinue: () => void
  canContinue: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Pick {MIN_DESTINATIONS}–{MAX_DESTINATIONS} destinations — tap cards or markers on the map (
        {selectedCount}/{MAX_DESTINATIONS} selected).
      </p>
      <div className="grid max-h-[min(50vh,28rem)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {destinations.map((d) => {
          const isSelected = selected.includes(d.slug)
          const disabled = !isSelected && selectedCount >= MAX_DESTINATIONS
          return (
            <button
              key={d.id}
              type="button"
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
      </div>
      <Button
        type="button"
        className="w-full"
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue to trip length
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function StepDuration({
  days,
  onChange,
}: {
  days: number
  onChange: (days: number) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        How many days do you have in Nepal? ({MIN_DAYS}–{MAX_DAYS} days)
      </p>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={MIN_DAYS}
          max={MAX_DAYS}
          value={days}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[hsl(var(--atlas-blue))]"
        />
        <span className="w-16 text-center font-display text-2xl font-bold tabular-nums text-[hsl(var(--atlas-blue))]">{days}</span>
      </div>
      <p className="text-xs text-muted-foreground">days in Nepal</p>
    </div>
  )
}

function StepGenerate({
  canGenerate,
  summary,
  onGenerate,
}: {
  canGenerate: boolean
  summary: {
    from: string | null
    borderName: string | null
    style: string | null
    destinations: string[]
    days: number
  }
  onGenerate: () => void
}) {
  return (
    <div className="space-y-4">
      <div className={cn(atlasCardPlanner, 'atlas-route-summary-accent p-4 text-sm')}>
        {summary.from && (
          <p>
            <span className="text-muted-foreground">From:</span>{' '}
            {summary.from.replace(/-/g, ' ')}
          </p>
        )}
        {summary.borderName && (
          <p>
            <span className="text-muted-foreground">Border:</span> {summary.borderName}
          </p>
        )}
        {summary.style && (
          <p>
            <span className="text-muted-foreground">Style:</span> {summary.style}
          </p>
        )}
        {summary.destinations.length > 0 && (
          <p>
            <span className="text-muted-foreground">Stops:</span>{' '}
            <span className="font-display font-semibold">{summary.destinations.join(', ')}</span>
          </p>
        )}
        <p>
          <span className="text-muted-foreground">Duration:</span> {summary.days} days
        </p>
      </div>
      <Button className="w-full shadow-sm" size="lg" disabled={!canGenerate} onClick={onGenerate}>
        Generate route
      </Button>
    </div>
  )
}
