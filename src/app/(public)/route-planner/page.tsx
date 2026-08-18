import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { MapSkeleton } from '@/components/map'
import { getRoutePlannerData } from '@/lib/supabase/queries'
import { RoutePlannerExperience } from '@/features/route-planner'
import { buildPageMetadata } from '@/lib/seo'
import { atlasBodyLg, atlasDisplayMd, atlasHeroGradient, atlasSectionEyebrow } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export const metadata = buildPageMetadata({
  title: 'Nepal Trip Planner — Build Your Itinerary Step by Step',
  description:
    'Plan your Nepal trip from India or anywhere in the world. Pick your entry method, dates, destinations, travel style and budget. Free trip planner that saves in the URL.',
  path: '/route-planner',
})

export default async function RoutePlannerPage() {
  const data = await getRoutePlannerData()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn('shrink-0 border-b px-4 py-4 sm:container sm:py-5', atlasHeroGradient)}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Route Planner' }]} />
        <p className={cn(atlasSectionEyebrow, 'mt-2')}>Trip planner</p>
        <h1 className={cn('mt-1', atlasDisplayMd)}>Build your Nepal trip</h1>
        <p className={cn('mt-2 max-w-2xl', atlasBodyLg)}>
          Eight quick steps — where you&apos;re coming from, how you enter, your dates, who&apos;s
          travelling, destinations, style, and budget. Your plan stays in the URL so you can
          refresh or share it.
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
