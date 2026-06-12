import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { MapSkeleton } from '@/components/map'
import { getRoutePlannerData } from '@/lib/supabase/queries'
import { RoutePlannerExperience } from '@/features/route-planner'
import { SITE } from '@/lib/site-config'
import { atlasBodyLg, atlasDisplayMd, atlasHeroGradient, atlasSectionEyebrow } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Route Planner',
  description:
    'Plan your Nepal route from India — choose where you start, how you enter, what you want to see and how many days you have.',
  alternates: { canonical: `${SITE.url}/route-planner` },
  openGraph: {
    title: 'Route Planner · NepaYatra',
    description: 'Plan your Nepal route from India, step by step.',
    url: `${SITE.url}/route-planner`,
  },
}

export default async function RoutePlannerPage() {
  const data = await getRoutePlannerData()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn('shrink-0 border-b px-4 py-4 sm:container sm:py-5', atlasHeroGradient)}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Route Planner' }]} />
        <p className={cn(atlasSectionEyebrow, 'mt-2')}>Route planner</p>
        <h1 className={cn('mt-1', atlasDisplayMd)}>Plan your Nepal route</h1>
        <p className={cn('mt-2 max-w-2xl', atlasBodyLg)}>
          Six quick steps — where you&apos;re coming from, how you enter, what you want to see, and
          how long you have. Your plan stays in the URL so you can refresh or share it.
        </p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Suspense fallback={<MapSkeleton className="min-h-[60vh] flex-1" />}>
          <RoutePlannerExperience data={data} />
        </Suspense>
      </div>
    </div>
  )
}
