import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { FilterSelect } from '@/components/public/filter-select'
import { PackageCard } from '@/components/public/cards'
import { EmptyState, CardGridSkeleton } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { SectionBackground } from '@/components/public/section-background'
import { getPackages } from '@/lib/supabase/queries'
import { PACKAGE_DIFFICULTY_LABELS, SITE } from '@/lib/site-config'
import { SITE_BACKGROUNDS } from '@/lib/site-backgrounds'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Suggested Trips',
  description:
    'Sample Nepal itineraries you can follow as-is or adapt — with durations, highlights and route summaries. Built for Indian travelers.',
  alternates: { canonical: `${SITE.url}/packages` },
  openGraph: {
    title: 'Suggested Trips · NepaYatra',
    description: 'Sample Nepal itineraries you can follow or adapt with an advisor.',
    url: `${SITE.url}/packages`,
  },
}

const DIFFICULTY_OPTIONS = Object.entries(PACKAGE_DIFFICULTY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

interface PageProps {
  searchParams: Promise<{ difficulty?: string }>
}

async function PackagesGrid({ difficulty }: { difficulty?: string }) {
  const packages = await getPackages(difficulty)
  if (packages.length === 0) {
    return (
      <EmptyState
        title="No trips here yet"
        description="Try a different difficulty, or talk to an advisor to build a custom plan."
        actionLabel="Clear filter"
        actionHref="/packages"
      />
    )
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  )
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const { difficulty } = await searchParams

  return (
    <>
      <PageHero
        eyebrow="Itineraries"
        title="Suggested trips"
        description="Tried-and-tested itineraries to start from. Take one as-is, or use it as a base and adjust the details with an advisor."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Suggested Trips' }]} />
      </PageHero>

      <SectionBackground
        imageSrc={SITE_BACKGROUNDS.listings}
        overlayClassName="bg-[#f8fafc]/94"
        imageClassName="opacity-30 saturate-[0.75]"
      >
        <div className="container py-8">
          <div className="max-w-xs">
            <FilterSelect
              paramKey="difficulty"
              placeholder="All difficulty levels"
              options={DIFFICULTY_OPTIONS}
            />
          </div>
          <div className="mt-8">
            <Suspense key={difficulty} fallback={<CardGridSkeleton />}>
              <PackagesGrid difficulty={difficulty} />
            </Suspense>
          </div>
        </div>
      </SectionBackground>

      <AdvisorCta context="choosing a suggested trip" />
    </>
  )
}
