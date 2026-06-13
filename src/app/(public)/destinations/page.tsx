import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { SearchInput } from '@/components/public/search-input'
import { FilterSelect } from '@/components/public/filter-select'
import { DestinationCard } from '@/components/public/cards'
import { EmptyState, CardGridSkeleton } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { SectionBackground } from '@/components/public/section-background'
import { getDestinations } from '@/lib/supabase/queries'
import { DESTINATION_CATEGORY_LABELS, PROVINCE_LABELS, SITE } from '@/lib/site-config'
import { SITE_BACKGROUNDS } from '@/lib/site-backgrounds'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Destinations in Nepal',
  description:
    'Browse Nepal destinations by category and province — cultural cities, trekking regions, wildlife parks and Himalayan viewpoints. Built for Indian travelers.',
  alternates: { canonical: `${SITE.url}/destinations` },
  openGraph: {
    title: 'Destinations in Nepal · NepaYatra',
    description:
      'Browse Nepal destinations by category and province — cultural cities, trekking regions, wildlife parks and Himalayan viewpoints.',
    url: `${SITE.url}/destinations`,
  },
}

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
