import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  title: 'Suggested Trips & Curated Itineraries',
  description:
    'Sample Nepal itineraries you can follow as-is or open in the Trip Planner to customize destinations, duration, and budget.',
  alternates: { canonical: `${SITE.url}/packages` },
  openGraph: {
    title: 'Suggested Trips · NepaYatra',
    description: 'Sample Nepal itineraries you can follow as-is or customize in the Trip Planner.',
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
        description="Try a different difficulty, or build a custom plan in the Trip Planner."
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
        description="Tried-and-tested itineraries to start from. Follow one as-is, or open it in the Trip Planner to customize destinations, duration, and estimated budget."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Suggested Trips' }]} />
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
              <p className="font-display font-bold text-foreground">Want to build your own trip from scratch?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use our interactive Trip Planner to pick custom stops, set your dates, and calculate realistic budget estimates.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0 shadow-sm">
              <Link href="/route-planner">
                Open Trip Planner <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="max-w-xs">
            <FilterSelect
              paramKey="difficulty"
              placeholder="All difficulty levels"
              options={DIFFICULTY_OPTIONS}
            />
          </div>
          <div className="mt-6">
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
