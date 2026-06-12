import Link from 'next/link'
import { ArrowRight, Compass, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ORIGIN_REGIONS, TRAVEL_STYLES } from '@/lib/site-config'
import {
  atlasCardPlanner,
  atlasDisplayMd,
  atlasSectionEyebrow,
  atlasStepDefault,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

export function ComingFromIndia() {
  return (
    <section className="bg-[hsl(var(--atlas-mist))]/60">
      <div className="container py-12 md:py-16">
        <p className={atlasSectionEyebrow}>Entry from India</p>
        <h2 className={`mt-2 ${atlasDisplayMd}`}>Coming from India?</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Where you start usually decides which border makes sense. Pick your region to see the
          closest way in.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ORIGIN_REGIONS.map((region) => (
            <Link
              key={region.value}
              href={`/route-planner?from=${region.value}`}
              className="group block"
            >
              <div className={cn(atlasStepDefault, 'h-full p-4 group-hover:border-[hsl(var(--atlas-blue-light))]')}>
                <p className="font-display font-bold group-hover:text-[hsl(var(--atlas-blue))]">
                  {region.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{region.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TravelStyles() {
  return (
    <section>
      <div className="container py-12 md:py-16">
        <p className={atlasSectionEyebrow}>Find your journey</p>
        <h2 className={`mt-2 ${atlasDisplayMd}`}>What kind of trip is this?</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Nepal works for very different travelers. Start from what you care about most.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TRAVEL_STYLES.map((style) => (
            <Link
              key={style.value}
              href={`/destinations?style=${style.value}`}
              className="group block"
            >
              <div className={cn(atlasStepDefault, 'h-full p-4 group-hover:border-[hsl(var(--atlas-blue-light))]')}>
                <p className="font-display font-bold group-hover:text-[hsl(var(--atlas-blue))]">
                  {style.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {style.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturePreviews() {
  return (
    <section className="bg-[hsl(var(--atlas-mist))]/60">
      <div className="container grid gap-6 py-12 md:grid-cols-2 md:py-16">
        <div className={cn(atlasCardPlanner, 'flex h-full flex-col p-6 sm:p-8')}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]">
            <MapIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-5 font-display text-xl font-bold">Border Explorer</h3>
          <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">
            Five road crossings connect India and Nepal. Compare them side by side — which is
            open, what is on each side, and where each one takes you.
          </p>
          <Button asChild variant="outline" className="mt-6 self-start border-[hsl(var(--atlas-blue))]/30">
            <Link href="/border-crossings">
              Compare crossings <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div
          className={cn(
            atlasCardPlanner,
            'flex h-full flex-col border-[hsl(var(--atlas-blue))]/25 bg-[hsl(var(--atlas-blue))]/[0.03] p-6 sm:p-8'
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--atlas-saffron))]/15 text-[hsl(var(--atlas-saffron))]">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="mt-5 font-display text-xl font-bold">Route Planner</h3>
          <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">
            Tell us where you are entering, what you want to see and how many days you have. We
            map a sensible route with travel times and transport.
          </p>
          <Button asChild className="mt-6 self-start shadow-sm">
            <Link href="/route-planner">
              Plan my route <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
