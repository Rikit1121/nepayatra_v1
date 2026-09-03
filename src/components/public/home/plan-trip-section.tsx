'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, Clock, Wallet, Plane, Car, Mountain, Building2, Trees } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EstimatorConfig {
  entry: 'flight' | 'sunauli' | 'raxaul' | 'kakarbhitta'
  style: 'scenic' | 'heritage' | 'wildlife'
  duration: '7' | '10' | '14'
}

export function PlanTripSection() {
  const [config, setConfig] = React.useState<EstimatorConfig>({
    entry: 'flight',
    style: 'scenic',
    duration: '7',
  })

  // Dynamic calculation based on user selection
  const estimate = React.useMemo(() => {
    let routeTitle = 'Kathmandu & Pokhara Valley Loop'
    let stops = 'Kathmandu (3N) → Pokhara (3N)'
    let transport = 'Scenic tourist coach or 25-min mountain flight'
    let budgetInr = '₹16,000 – ₹22,000'
    let budgetUsd = '$210 – $290'
    let plannerQuery = 'dest=kathmandu,pokhara&days=7&step=4'

    if (config.style === 'heritage') {
      routeTitle = 'Cultural Heritage & Sacred Pilgrimage'
      stops = 'Kathmandu (3N) → Lumbini (2N) → Janakpur (2N)'
      transport = 'Private AC tourist cab or express highway coach'
      budgetInr = '₹18,000 – ₹25,000'
      budgetUsd = '$240 – $330'
      plannerQuery = 'dest=kathmandu,lumbini,janakpur&days=8&step=4'
    } else if (config.style === 'wildlife') {
      routeTitle = 'Himalayan Peaks & Rhino Wilderness'
      stops = 'Kathmandu (2N) → Pokhara (3N) → Chitwan Jungle (2N)'
      transport = 'Private Scorpio Jeep or air-conditioned tourist van'
      budgetInr = '₹22,000 – ₹30,000'
      budgetUsd = '$280 – $390'
      plannerQuery = 'dest=kathmandu,pokhara,chitwan&days=9&step=4'
    }

    if (config.entry === 'sunauli') {
      plannerQuery += '&border=sunauli-bhairahawa'
    } else if (config.entry === 'raxaul') {
      plannerQuery += '&border=raxaul-birgunj'
    } else if (config.entry === 'kakarbhitta') {
      plannerQuery += '&border=panitanki-kakarbhitta'
    }

    if (config.duration === '10') {
      budgetInr = '₹28,000 – ₹38,000'
      budgetUsd = '$360 – $490'
    } else if (config.duration === '14') {
      budgetInr = '₹42,000 – ₹55,000'
      budgetUsd = '$540 – $710'
    }

    return { routeTitle, stops, transport, budgetInr, budgetUsd, plannerQuery }
  }, [config])

  const gateways = [
    { name: 'Kathmandu TIA', type: 'Flight Hub', desc: 'Direct international flights from Delhi, Dubai, Singapore, Bangkok', href: '/route-planner?step=1' },
    { name: 'Sunauli / Belahiya', type: 'Overland UP', desc: 'Closest gateway to Pokhara & Lumbini (24/7 border crossing)', href: '/route-planner?border=sunauli-bhairahawa' },
    { name: 'Raxaul / Birgunj', type: 'Overland Bihar', desc: 'Direct fast-track commercial road corridor to Kathmandu', href: '/route-planner?border=raxaul-birgunj' },
    { name: 'Panitanki / Kakarbhitta', type: 'Overland Bengal', desc: 'Direct access from Siliguri/Darjeeling to Eastern tea hills & capital', href: '/route-planner?border=panitanki-kakarbhitta' },
  ]

  return (
    <section className="relative overflow-hidden bg-background py-20 text-foreground border-b border-border/40">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* ── Left Column: Value Prop & Gateways ── */}
          <div className="lg:col-span-6 space-y-6">
            {/* Clean Tagline, no star icon */}
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              YOUR JOURNEY, YOUR WAY
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
              Plan your Nepal trip in minutes.
            </h2>

            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-xl">
              Choose your arrival point, pick destinations, and we&apos;ll help you design the perfect route with accurate travel times, mountain roads, and transparent reference budgets.
            </p>

            <div className="pt-2">
              <Link
                href="/route-planner"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-amber-900/20 transition-all hover:scale-[1.02]"
              >
                <span>Open Custom Trip Planner</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Entry Gateways Strip (Broadened beyond India-only) */}
            <div className="pt-6 border-t border-border/60 space-y-3">
              <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                <span>Key Arrival Corridors (Flights &amp; Overland Checkpoints):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {gateways.map((g) => (
                  <Link
                    key={g.name}
                    href={g.href}
                    className="group rounded-xl border border-border bg-card p-3 transition-all hover:border-amber-500/40 hover:bg-muted/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {g.name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                        {g.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      {g.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Instant Route & Budget Estimator Card (Replaces duplicate map) ── */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
              <div className="border-b border-border pb-4 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Instant Itinerary Blueprint
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mt-1">
                  Preview your personalized route
                </h3>
              </div>

              {/* Selector Controls */}
              <div className="space-y-4">
                {/* Step 1: Entry Point */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-amber-500" />
                    <span>How will you arrive?</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'flight', label: '✈️ Flight TIA' },
                      { id: 'sunauli', label: '🚗 Sunauli' },
                      { id: 'raxaul', label: '🚗 Raxaul' },
                      { id: 'kakarbhitta', label: '🚗 Panitanki' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, entry: item.id as any }))}
                        className={cn(
                          'rounded-lg px-2.5 py-2 text-xs font-medium transition-all text-center border',
                          config.entry === item.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Trip Style */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Mountain className="h-3.5 w-3.5 text-amber-500" />
                    <span>Travel Style</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'scenic', label: 'Lakes & Peaks' },
                      { id: 'heritage', label: 'Temples & Peace' },
                      { id: 'wildlife', label: 'Jungle & Safari' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, style: item.id as any }))}
                        className={cn(
                          'rounded-lg px-2.5 py-2 text-xs font-medium transition-all text-center border',
                          config.style === item.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Duration */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Duration</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: '7', label: '7 Days Express' },
                      { id: '10', label: '10 Days Balanced' },
                      { id: '14', label: '14 Days Deep' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, duration: item.id as any }))}
                        className={cn(
                          'rounded-lg px-2.5 py-2 text-xs font-medium transition-all text-center border',
                          config.duration === item.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Result Box */}
              <div className="mt-6 rounded-2xl bg-muted/40 p-4 border border-border/80 space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Recommended Itinerary:</div>
                  <div className="text-sm font-bold text-foreground">{estimate.routeTitle}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                    {estimate.stops}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Est. Reference Budget:</span>
                    <strong className="text-foreground text-sm font-bold">{estimate.budgetInr}</strong>
                    <span className="text-muted-foreground text-[10px] block">({estimate.budgetUsd} / person)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Recommended Transit:</span>
                    <span className="text-foreground font-medium line-clamp-2">{estimate.transport}</span>
                  </div>
                </div>

                <Link
                  href={`/route-planner?${estimate.plannerQuery}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 py-2.5 text-xs font-semibold text-white shadow transition-all hover:scale-[1.01]"
                >
                  <span>Build This Custom Itinerary in Planner</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
