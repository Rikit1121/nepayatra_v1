'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RouteItem {
  id: string
  title: string
  duration: string
  gateway: string
  routeSummary: string
  stops: { name: string; desc: string; nights: string; altitude?: string }[]
  highlights: string[]
  href: string
}

const ROUTES: RouteItem[] = [
  {
    id: 'classic',
    title: 'Classic First Trip',
    duration: '7 Days / 6 Nights',
    gateway: 'Raxaul–Birgunj or TIA Flight',
    routeSummary: 'Birgunj → Kathmandu → Pokhara',
    stops: [
      { name: 'Birgunj Gateway', desc: 'Customs & vehicle Bhansar pass', nights: 'Day 1 Entry' },
      { name: 'Kathmandu Valley', desc: 'Pashupatinath & medieval pagoda squares', nights: '3 Nights', altitude: '1,400m' },
      { name: 'Pokhara Lakeside', desc: 'Phewa Lake boating & Sarangkot sunrise', nights: '3 Nights', altitude: '822m' },
    ],
    highlights: ['Fast-track road connection', 'Zero mountain permit hassles', 'Ideal for first-time visitors & families'],
    href: '/route-planner?border=raxaul-birgunj&dest=kathmandu,pokhara&days=7&step=4',
  },
  {
    id: 'golden-triangle',
    title: 'Golden Triangle (Peaks & Wildlife)',
    duration: '9 Days / 8 Nights',
    gateway: 'Kathmandu TIA or Sunauli',
    routeSummary: 'Kathmandu → Pokhara → Chitwan',
    stops: [
      { name: 'Kathmandu', desc: 'Boudhanath stupa & historic palaces', nights: '3 Nights', altitude: '1,400m' },
      { name: 'Pokhara', desc: 'Annapurna reflection on Phewa Lake', nights: '3 Nights', altitude: '822m' },
      { name: 'Chitwan National Park', desc: 'Rhino jeep safari & Tharu cultural night', nights: '2 Nights', altitude: '415m' },
    ],
    highlights: ['UNESCO cultural monuments', 'One-horned rhino safari', 'Panoramic Himalayan mountain flights'],
    href: '/route-planner?dest=kathmandu,pokhara,chitwan&days=9&step=4',
  },
  {
    id: 'heritage',
    title: 'Sacred Pilgrimage & Heritage',
    duration: '8 Days / 7 Nights',
    gateway: 'Sunauli–Bhairahawa or Raxaul',
    routeSummary: 'Sunauli → Lumbini → Kathmandu → Janakpur',
    stops: [
      { name: 'Sunauli Gateway', desc: 'Customs clearance & SIM card pickup', nights: 'Day 1 Entry' },
      { name: 'Lumbini Sacred Garden', desc: 'Buddha birthplace & Maya Devi Temple', nights: '2 Nights', altitude: '150m' },
      { name: 'Kathmandu', desc: 'Pashupatinath special darshan & evening aarti', nights: '3 Nights', altitude: '1,400m' },
      { name: 'Janakpurdham', desc: 'Marble Janaki Mandir & Mithila heritage', nights: '2 Nights', altitude: '70m' },
    ],
    highlights: ['Spiritual Buddhist & Hindu holy circuit', 'Pashupatinath Evening Aarti', 'Direct Gorakhpur / Bihar connection'],
    href: '/route-planner?border=sunauli-bhairahawa&dest=lumbini,kathmandu,janakpur&days=8&step=4',
  },
  {
    id: 'annapurna',
    title: 'Annapurna Sanctuary Trek',
    duration: '12 Days / 11 Nights',
    gateway: 'Pokhara / Kathmandu',
    routeSummary: 'Pokhara → Ghandruk → Chhomrong → ABC',
    stops: [
      { name: 'Pokhara Base', desc: 'ACAP trekking permit & gear prep', nights: '2 Nights', altitude: '822m' },
      { name: 'Ghandruk Village', desc: 'Traditional stone Gurung hospitality', nights: '1 Night', altitude: '1,940m' },
      { name: 'Chhomrong & Dovan', desc: 'Bamboo forests & rhododendron trails', nights: '2 Nights', altitude: '2,600m' },
      { name: 'Annapurna Base Camp', desc: 'High Himalayan amphitheater under ABC (4,130m)', nights: '2 Nights', altitude: '4,130m' },
    ],
    highlights: ['Breathtaking 360° views of Annapurna I & Machapuchare', 'Jhinu Danda natural riverside hot springs', 'Authentic mountain teahouse culture'],
    href: '/route-planner?dest=pokhara,ghandruk,annapurna-base-camp&days=12&step=4',
  },
  {
    id: 'mustang',
    title: 'Upper Mustang Trans-Himalayan',
    duration: '10 Days / 9 Nights',
    gateway: 'Pokhara / Jomsom',
    routeSummary: 'Pokhara → Jomsom → Muktinath → Lo Manthang',
    stops: [
      { name: 'Pokhara', desc: 'Gateway to the Kali Gandaki Gorge', nights: '2 Nights', altitude: '822m' },
      { name: 'Muktinath', desc: 'Sacred 108 holy water spouts at 3,710m', nights: '1 Night', altitude: '3,710m' },
      { name: 'Lo Manthang', desc: 'Ancient walled Buddhist capital & cave murals', nights: '3 Nights', altitude: '3,840m' },
    ],
    highlights: ['The ancient walled Kingdom of Lo', 'Trans-Himalayan rain shadow desert valleys', 'Centuries-old cliffside cave monasteries'],
    href: '/route-planner?dest=pokhara,mustang,muktinath&days=10&step=4',
  },
]

export function RouteExamplesSection() {
  const [selectedRouteId, setSelectedRouteId] = React.useState('classic')
  const currentRoute = ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0]

  return (
    <section className="relative overflow-hidden bg-background py-20 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header: Clean typography, no star icon */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            TESTED OVERLAND &amp; MOUNTAIN ROUTES
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Routes other travelers actually take.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Proven itineraries with verified road conditions, optimal night stops, and seamless arrival logistics.
          </p>

          {/* Interactive Route Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {ROUTES.map((r) => {
              const isActive = r.id === selectedRouteId
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRouteId(r.id)}
                  className={cn(
                    'rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-200 shadow-sm select-none',
                    isActive
                      ? 'bg-amber-600 text-white shadow-amber-600/25 scale-[1.02]'
                      : 'bg-card border border-border text-foreground hover:bg-muted'
                  )}
                >
                  {r.title} ({r.duration.split('/')[0].trim()})
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Route Spotlight Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Detail Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                  {currentRoute.duration}
                </span>
                <span className="text-xs text-muted-foreground">
                  Arrival: <strong className="text-foreground">{currentRoute.gateway}</strong>
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {currentRoute.title}
              </h3>

              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {currentRoute.routeSummary}
              </p>

              {/* Highlights */}
              <div className="pt-2 border-t border-border/60 space-y-2">
                {currentRoute.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={currentRoute.href}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 px-6 py-3 text-xs font-semibold text-white shadow-md shadow-amber-900/20 transition-all hover:scale-[1.02]"
                >
                  <span>Customize this route in Trip Planner</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: Genuine Stop-by-Stop Itinerary Breakdown (Replaces fake curve) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-muted/40 p-5 sm:p-6 border border-border space-y-3 shadow-inner">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/60 flex items-center justify-between">
                  <span>Day-by-Day Stop Breakdown</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{currentRoute.stops.length} Major Hubs</span>
                </div>

                <div className="space-y-3 pt-1">
                  {currentRoute.stops.map((stop, idx) => (
                    <div
                      key={stop.name}
                      className="flex items-start justify-between gap-3 rounded-xl bg-card p-3 border border-border/70 shadow-sm"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[11px] font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{stop.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{stop.desc}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                          {stop.nights}
                        </span>
                        {stop.altitude && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {stop.altitude}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground text-center">
                  Includes highway distances, mountain road passes &amp; hotel recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
