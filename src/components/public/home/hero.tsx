import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HomeMap } from '@/features/map'
import {
  atlasBodyLg,
  atlasDisplayLg,
  atlasHeroGradient,
  atlasMapFrame,
  atlasSectionEyebrow,
} from '@/lib/design-system'
import type { DestinationMapMarker, BorderCrossingMapMarker } from '@/lib/map'

interface HeroProps {
  headline: string
  subheadline: string
  destinations: DestinationMapMarker[]
  borders: BorderCrossingMapMarker[]
}

export function Hero({ headline, subheadline, destinations, borders }: HeroProps) {
  return (
    <section className={`border-b ${atlasHeroGradient}`}>
      <div className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div className="min-w-0">
          <p className={atlasSectionEyebrow}>Explorer&apos;s Companion</p>
          <h1 className={`mt-3 ${atlasDisplayLg}`}>{headline}</h1>
          <p className={`mt-4 max-w-xl ${atlasBodyLg}`}>{subheadline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/route-planner">
                Plan My Route <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[hsl(var(--atlas-saffron))]/50 text-[hsl(var(--atlas-blue))] hover:bg-[hsl(var(--atlas-saffron))]/10"
            >
              <Link href="/map">Explore the Map</Link>
            </Button>
          </div>
        </div>

        <div className={`relative h-[320px] md:h-[380px] ${atlasMapFrame}`}>
          <HomeMap destinations={destinations} borders={borders} />
          <Link
            href="/map"
            className="absolute bottom-3 right-3 rounded-md border border-[hsl(var(--atlas-blue))]/20 bg-background/95 px-2.5 py-1.5 text-xs font-semibold text-[hsl(var(--atlas-blue))] shadow-sm backdrop-blur hover:bg-background"
          >
            Open full map →
          </Link>
        </div>
      </div>
    </section>
  )
}
