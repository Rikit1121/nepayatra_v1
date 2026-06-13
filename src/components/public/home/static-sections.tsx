'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeInView, MotionCard } from '@/components/motion'
import { ORIGIN_REGIONS, TRAVEL_STYLES } from '@/lib/site-config'
import {
  atlasDisplayMd,
  atlasSectionDivider,
  atlasSectionEyebrow,
  atlasSectionMuted,
  atlasSectionPadding,
  atlasSectionWhite,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Coming from India? — interactive region selector
// ─────────────────────────────────────────────────────────────

const REGION_BORDER_INFO: Record<string, {
  crossing: string
  distance: string
  tip: string
  nepaliSide: string
}> = {
  delhi:           { crossing: 'Raxaul–Birgunj', distance: '~1,150 km from Delhi', tip: 'Overnight train to Raxaul is the classic route', nepaliSide: 'Birgunj → Kathmandu (5 h)' },
  bihar:           { crossing: 'Raxaul–Birgunj', distance: '~100 km from Patna', tip: 'Most popular crossing for Bihar travelers', nepaliSide: 'Birgunj → Kathmandu (5 h)' },
  'uttar-pradesh': { crossing: 'Sunauli–Bhairahawa', distance: '~135 km from Gorakhpur', tip: 'Great access to Lumbini and Pokhara', nepaliSide: 'Bhairahawa → Pokhara (2.5 h)' },
  'west-bengal':   { crossing: 'Panitanki–Kakarbhitta', distance: '~75 km from Siliguri', tip: 'Eastern Nepal gateway near the tea hills', nepaliSide: 'Kakarbhitta → Biratnagar (1.5 h)' },
  uttarakhand:     { crossing: 'Banbasa–Mahendranagar', distance: '~95 km from Pithoragarh', tip: 'Far-west Nepal — quiet and uncrowded', nepaliSide: 'Mahendranagar → Dhangadhi (2 h)' },
}

// Accent colors for each region card (no emojis)
const REGION_ACCENT: Record<string, { bar: string; activeBg: string; activeRing: string }> = {
  delhi:           { bar: 'bg-[hsl(var(--atlas-blue))]',     activeBg: 'bg-[hsl(var(--atlas-blue))]/8',     activeRing: 'ring-[hsl(var(--atlas-blue))]/30' },
  bihar:           { bar: 'bg-emerald-500',                  activeBg: 'bg-emerald-50',                      activeRing: 'ring-emerald-300' },
  'uttar-pradesh': { bar: 'bg-[hsl(var(--atlas-saffron))]',  activeBg: 'bg-[hsl(var(--atlas-saffron))]/8',  activeRing: 'ring-[hsl(var(--atlas-saffron))]/30' },
  'west-bengal':   { bar: 'bg-purple-500',                   activeBg: 'bg-purple-50',                       activeRing: 'ring-purple-300' },
  uttarakhand:     { bar: 'bg-rose-500',                     activeBg: 'bg-rose-50',                         activeRing: 'ring-rose-300' },
}

export function ComingFromIndia({ tone = 'white' }: { tone?: 'white' | 'muted' }) {
  const [selected, setSelected] = React.useState<string | null>(null)
  const info = selected ? REGION_BORDER_INFO[selected] : null
  const region = ORIGIN_REGIONS.find((r) => r.value === selected)
  const bg = tone === 'muted' ? atlasSectionMuted : atlasSectionWhite

  return (
    <section className={cn(bg, atlasSectionDivider, 'border-b border-border/30')}>
      <div className={cn('container', atlasSectionPadding)}>
        <FadeInView>
          <p className={atlasSectionEyebrow}>Entry from India</p>
          <h2 className={`mt-2 ${atlasDisplayMd}`}>Coming from India?</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Where you start decides which border makes sense.{' '}
            <strong className="text-foreground">Click your region</strong> to see the nearest crossing.
          </p>
        </FadeInView>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ORIGIN_REGIONS.map((r) => {
            const isActive = selected === r.value
            const accent = REGION_ACCENT[r.value]
            return (
              <MotionCard key={r.value}>
                <button
                  onClick={() => setSelected(isActive ? null : r.value)}
                  className={cn(
                    'group relative w-full overflow-hidden rounded-xl border bg-card p-4 text-left shadow-sm transition-colors duration-200',
                    isActive
                      ? `border-transparent ${accent.activeBg} ring-2 ${accent.activeRing} shadow-md`
                      : 'border-border hover:border-[hsl(var(--atlas-blue-light))]/50 hover:shadow-md'
                  )}
                >
                {/* Colored top accent bar */}
                <div className={cn('mb-3 h-1 w-8 rounded-full', accent.bar)} />
                {/* Active check */}
                {isActive && (
                  <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-[hsl(var(--atlas-blue))]" />
                )}
                <p className={cn('font-display font-bold transition-colors', isActive ? 'text-[hsl(var(--atlas-blue))]' : 'group-hover:text-[hsl(var(--atlas-blue))]')}>
                  {r.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.note}</p>
                </button>
              </MotionCard>
            )
          })}
        </div>

        {/* Animated info panel */}
        {info && region && (
          <div
            key={selected}
            className="fade-up-1 mt-6 overflow-hidden rounded-xl border border-[hsl(var(--atlas-blue))]/20 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[hsl(var(--atlas-saffron))]">
                    Nearest Border Crossing
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-[hsl(var(--atlas-blue))]">
                    {info.crossing}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-border bg-[hsl(var(--atlas-mist))]/60 px-3 py-1 text-xs font-medium">
                    {info.distance}
                  </span>
                  <span className="rounded-full border border-border bg-[hsl(var(--atlas-mist))]/60 px-3 py-1 text-xs font-medium">
                    {info.nepaliSide}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{info.tip}</p>
              </div>
              <div className="shrink-0">
                <Button asChild size="sm" className="whitespace-nowrap shadow-sm">
                  <Link href={`/route-planner?from=${selected}`}>
                    Plan from {region.label} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Once you know your entry point, explore real route examples below.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Travel Styles — right-scrolling carousel
// ─────────────────────────────────────────────────────────────

const STYLE_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  religious: { bg: 'bg-amber-50  border-amber-200/50',  bar: 'bg-amber-400',  text: 'text-amber-700' },
  family:    { bg: 'bg-sky-50    border-sky-200/50',    bar: 'bg-sky-400',    text: 'text-sky-700' },
  adventure: { bg: 'bg-emerald-50 border-emerald-200/50', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  wildlife:  { bg: 'bg-lime-50   border-lime-200/50',   bar: 'bg-lime-500',   text: 'text-lime-700' },
  scenic:    { bg: 'bg-violet-50 border-violet-200/50', bar: 'bg-violet-500', text: 'text-violet-700' },
}

export function TravelStyles({ tone = 'muted' }: { tone?: 'white' | 'muted' }) {
  const items = [...TRAVEL_STYLES, ...TRAVEL_STYLES, ...TRAVEL_STYLES, ...TRAVEL_STYLES]
  const bg = tone === 'muted' ? atlasSectionMuted : atlasSectionWhite

  return (
    <section className={cn(bg, atlasSectionDivider, 'overflow-hidden border-b border-border/30')}>
      <div className={cn('container mb-8', atlasSectionPadding, 'pb-0')}>
        <FadeInView>
          <p className={atlasSectionEyebrow}>Travel styles</p>
          <h2 className={`mt-2 ${atlasDisplayMd}`}>What kind of trip is this?</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Nepal works for very different travelers. Pick what you care about most — then explore
            destinations that match your style.
          </p>
        </FadeInView>
      </div>

      <div className="overflow-hidden pb-14 md:pb-16">
        <div className="marquee-right flex gap-4 pb-1" style={{ width: 'max-content' }}>
          {items.map((style, i) => {
            const colors = STYLE_COLORS[style.value] ?? { bg: 'bg-gray-50 border-gray-200/50', bar: 'bg-gray-400', text: 'text-gray-700' }
            return (
              <Link
                key={`${style.value}-${i}`}
                href={`/destinations?style=${style.value}`}
                className="group block w-[220px] shrink-0 sm:w-[250px]"
              >
                <MotionCard>
                  <div
                    className={cn(
                      'h-full rounded-xl border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md',
                      colors.bg
                    )}
                  >
                  {/* Colored accent bar instead of emoji */}
                  <div className={cn('mb-4 h-1 w-10 rounded-full', colors.bar)} />
                  <p className={cn('font-display font-bold', colors.text)}>{style.label}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {style.description}
                  </p>
                  <span className={cn('mt-3 inline-flex items-center gap-1 text-xs font-semibold', colors.text)}>
                    Explore <ChevronRight className="h-3 w-3" />
                  </span>
                  </div>
                </MotionCard>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
