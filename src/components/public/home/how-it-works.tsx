import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  atlasCardPlanner,
  atlasDisplayMd,
  atlasSectionDivider,
  atlasSectionEyebrow,
  atlasSectionPadding,
  atlasSectionWhite,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    step: '1',
    title: 'Choose your destinations',
    description:
      'Pick the places you want to visit in Nepal — from Kathmandu and Pokhara to trekking bases, national parks, and pilgrimage sites.',
    icon: MapPin,
  },
  {
    step: '2',
    title: 'Set dates, travelers & budget',
    description:
      'Specify your trip duration, starting point, number of travelers, and preferred style to shape the plan.',
    icon: Calendar,
  },
  {
    step: '3',
    title: 'Get a personalized itinerary',
    description:
      'NepaYatra calculates an efficient travel sequence, day allocations, and estimated budget using reference travel data.',
    icon: Compass,
  },
]

export function HowItWorks() {
  return (
    <section className={cn(atlasSectionWhite, atlasSectionDivider, 'border-b border-border/30')}>
      <div className={cn('container', atlasSectionPadding)}>
        <div className="max-w-2xl">
          <p className={atlasSectionEyebrow}>How it works</p>
          <h2 className={cn('mt-2', atlasDisplayMd)}>Plan Nepal in three steps</h2>
          <p className="mt-3 text-muted-foreground">
            A sensible journey built around your time, chosen destinations, and estimated costs.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className={cn(
                  atlasCardPlanner,
                  'relative flex flex-col justify-between p-6 bg-card'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display text-2xl font-bold text-muted-foreground/30">
                      0{item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-start">
          <Button asChild size="lg" className="shadow-sm">
            <Link href="/route-planner">
              Build My Trip <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
