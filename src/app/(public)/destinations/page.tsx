import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { SearchInput } from '@/components/public/search-input'
import { FilterSelect } from '@/components/public/filter-select'
import { DestinationCard } from '@/components/public/cards'
import { EmptyState, CardGridSkeleton } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { SectionBackground } from '@/components/public/section-background'
import { getDestinations } from '@/lib/supabase/queries'
import { DESTINATION_CATEGORY_LABELS, PROVINCE_LABELS } from '@/lib/site-config'
import { SITE_BACKGROUNDS } from '@/lib/site-backgrounds'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildPageMetadata({
  title: 'Nepal Destinations Guide: Cultural, Trekking & Pilgrimage Places',
  description:
    'Explore top destinations across Nepal — Kathmandu, Pokhara, Ghandruk, Lumbini, Chitwan, Mustang, and Himalayan viewpoints with practical access and route connections.',
  path: '/destinations',
})

const CATEGORY_OPTIONS = Object.entries(DESTINATION_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))
const PROVINCE_OPTIONS = Object.entries(PROVINCE_LABELS).map(([value, label]) => ({ value, label }))

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; province?: string }>
}

async function DestinationsGrid({
  search,
  category,
  province,
}: {
  search?: string
  category?: string
  province?: string
}) {
  const destinations = await getDestinations({ search, category, province })

  if (destinations.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No destinations match your filters"
        description="Try clearing the search or choosing a different category."
        actionLabel="Clear filters"
        actionHref="/destinations"
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  )
}

export default async function DestinationsPage({ searchParams }: PageProps) {
  const { q, category, province } = await searchParams

  return (
    <>
      <PageHero
        eyebrow="Explore Nepal"
        title="Destinations"
        description="From temple towns to trekking bases. Filter by what you want to see and where in Nepal it is."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Destinations' }]} />
      </PageHero>

      <SectionBackground
        imageSrc={SITE_BACKGROUNDS.listings}
        overlayClassName="bg-[#f8fafc]/94"
        imageClassName="opacity-30 saturate-[0.75]"
      >
        <div className="container py-8">
          {/* Planner banner */}
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-[hsl(var(--atlas-blue))]/25 bg-[hsl(var(--atlas-blue))]/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="font-display font-bold text-foreground">Planning a multi-destination journey?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Connect destinations into an optimized route with automatic travel sequence, day allocations, and estimated budget.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0 shadow-sm">
              <Link href="/route-planner">
                Open Trip Planner <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchInput placeholder="Search destinations…" />
            </div>
            <FilterSelect paramKey="category" placeholder="All categories" options={CATEGORY_OPTIONS} />
            <FilterSelect paramKey="province" placeholder="All provinces" options={PROVINCE_OPTIONS} />
          </div>

          <div className="mt-8">
            <Suspense key={`${q}-${category}-${province}`} fallback={<CardGridSkeleton />}>
              <DestinationsGrid search={q} category={category} province={province} />
            </Suspense>
          </div>
        </div>
      </SectionBackground>

      <AdvisorCta context="choosing destinations" />
    </>
  )
}
