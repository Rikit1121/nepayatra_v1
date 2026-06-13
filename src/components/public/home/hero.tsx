import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HomeMap } from '@/features/map'
import { atlasMapFrame } from '@/lib/design-system'
import { resolveHeroImage } from '@/lib/local-images'
import type { DestinationMapMarker, BorderCrossingMapMarker } from '@/lib/map'

interface HeroProps {
  headline: string
  subheadline: string
  heroImageUrl?: string
  destinations: DestinationMapMarker[]
  borders: BorderCrossingMapMarker[]
}

export function Hero({ headline, subheadline, heroImageUrl, destinations, borders }: HeroProps) {
  const heroImage = resolveHeroImage(heroImageUrl)

  return (
    <section className="relative flex min-h-[600px] flex-col overflow-hidden border-b">
      {/* Nepal mountain background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="Himalayan mountains Nepal"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,52%,8%)]/95 via-[hsl(215,52%,8%)]/75 to-[hsl(215,52%,8%)]/40" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      {/* Main grid */}
      <div className="relative z-10 container flex flex-1 items-center py-14 md:py-20">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          {/* Left: text */}
          <div className="min-w-0">
            <p className="fade-up-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--atlas-saffron))]">
              Explorer&apos;s Companion · India to Nepal
            </p>
            <h1 className="fade-up-2 mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {headline}
            </h1>
            <p className="fade-up-3 mt-4 max-w-[480px] text-base leading-relaxed text-white/70 sm:text-lg">
              {subheadline}
            </p>

            <div className="fade-up-3 mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--atlas-saffron))] font-semibold text-white shadow-lg shadow-[hsl(var(--atlas-saffron))]/25 hover:bg-[hsl(var(--atlas-saffron))]/90"
              >
                <Link href="/route-planner">
                  Plan My Route <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/15"
              >
                <Link href="/map">Explore the Map</Link>
              </Button>
            </div>

            {/* Trust indicators — no emojis */}
            <div className="fade-up-3 mt-6 flex flex-wrap items-center gap-5 text-xs text-white/55">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No visa required for Indian citizens
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                UPI accepted at major destinations
              </span>
            </div>
          </div>

          {/* Right: map preview */}
          <div className={`relative h-[300px] fade-up-3 md:h-[390px] ${atlasMapFrame} border-white/20`}>
            <HomeMap destinations={destinations} borders={borders} />
            <Link
              href="/map"
              className="absolute bottom-3 right-3 rounded-lg border border-[hsl(var(--atlas-blue))]/20 bg-background/95 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--atlas-blue))] shadow-sm backdrop-blur hover:bg-background"
            >
              Open full map →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
