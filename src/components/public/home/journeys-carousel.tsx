'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MotionCard } from '@/components/motion'

export interface Journey {
  title: string
  route: string
  days: string
  href: string
}

const CARD_ACCENTS = [
  'border-[hsl(var(--atlas-blue))]/20 bg-[hsl(var(--atlas-blue))]/[0.06] shadow-sm backdrop-blur-sm',
  'border-[hsl(var(--atlas-saffron))]/25 bg-[hsl(var(--atlas-saffron))]/[0.08] shadow-sm backdrop-blur-sm',
  'border-emerald-300/30 bg-emerald-50/70 shadow-sm backdrop-blur-sm',
]

export function JourneysCarousel({ journeys }: { journeys: Journey[] }) {
  const track = [...journeys, ...journeys, ...journeys, ...journeys]

  return (
    <div className="overflow-hidden">
      <div className="marquee-left flex gap-5 py-1" style={{ width: 'max-content' }}>
        {track.map((journey, i) => (
          <Link
            key={i}
            href={journey.href}
            className="group block w-[272px] shrink-0 sm:w-[310px]"
          >
            <MotionCard>
              <article
                className={cn(
                  'h-full rounded-xl border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md',
                  CARD_ACCENTS[i % CARD_ACCENTS.length]
                )}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--atlas-saffron))]">
                  {journey.days}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold leading-snug transition-colors group-hover:text-[hsl(var(--atlas-blue))]">
                  {journey.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {journey.route}
                </p>
                <span className="mt-4 inline-flex min-h-[32px] items-center gap-1 text-sm font-semibold text-[hsl(var(--atlas-blue))]">
                  Use this route <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </article>
            </MotionCard>
          </Link>
        ))}
      </div>
    </div>
  )
}
