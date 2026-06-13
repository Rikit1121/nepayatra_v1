'use client'

import { FadeInView } from '@/components/motion'
import {
  atlasDisplayMd,
  atlasSectionDivider,
  atlasSectionEyebrow,
  atlasSectionMuted,
  atlasSectionPadding,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'
import { JourneysCarousel, type Journey } from './journeys-carousel'
import { SectionCta } from './section-cta'

interface RouteExamplesSectionProps {
  journeys: Journey[]
}

export function RouteExamplesSection({ journeys }: RouteExamplesSectionProps) {
  return (
    <section className={cn(atlasSectionMuted, atlasSectionDivider, 'overflow-hidden border-b border-border/30')}>
      <div className={cn('container', atlasSectionPadding, 'pb-8')}>
        <FadeInView>
          <p className={atlasSectionEyebrow}>Route examples</p>
          <h2 className={cn('mt-2', atlasDisplayMd)}>Routes other travelers actually take</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Open one to tweak it in the planner — change the border, add stops, adjust days.
          </p>
        </FadeInView>
      </div>

      <JourneysCarousel journeys={journeys} />

      <div className={cn('container', 'pb-14 md:pb-16')}>
        <SectionCta
          message="Need help choosing the best route?"
          buttonLabel="Talk to a route advisor"
          href="/contact"
        />
      </div>
    </section>
  )
}
