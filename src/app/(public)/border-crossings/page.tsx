import { Suspense } from 'react'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { SearchInput } from '@/components/public/search-input'
import { BorderCrossingCard } from '@/components/public/cards'
import { EmptyState, CardGridSkeleton } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { SectionBackground } from '@/components/public/section-background'
import { getBorderCrossings } from '@/lib/supabase/queries'
import { SITE_BACKGROUNDS } from '@/lib/site-backgrounds'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildPageMetadata({
  title: 'India–Nepal Border Crossings — Raxaul, Sunauli, Jogbani & More',
  description:
    'Compare India–Nepal road borders for Indian travelers — Raxaul–Birgunj, Sunauli–Bhairahawa, Jogbani–Biratnagar, Panitanki–Kakarbhitta. Documents, routes and which crossing to choose.',
  path: '/border-crossings',
})

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

async function CrossingsGrid({ search }: { search?: string }) {
  const crossings = await getBorderCrossings(search)
  if (crossings.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No border crossings match your search"
        description="Try a different town name, or clear the search."
        actionLabel="Clear search"
        actionHref="/border-crossings"
      />
    )
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {crossings.map((crossing) => (
        <BorderCrossingCard key={crossing.id} crossing={crossing} />
      ))}
    </div>
  )
}

export default async function BorderCrossingsPage({ searchParams }: PageProps) {
  const { q } = await searchParams

  return (
    <>
      <PageHero
        eyebrow="Getting in"
        title="Border crossings"
        description="There are five main road borders between India and Nepal. Compare them and pick the one that fits where you're coming from."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Border Crossings' }]} />
      </PageHero>

      <SectionBackground
        imageSrc={SITE_BACKGROUNDS.listings}
        overlayClassName="bg-[#f8fafc]/94"
        imageClassName="opacity-30 saturate-[0.75]"
      >
        <div className="container py-8">
          <div className="max-w-md">
            <SearchInput placeholder="Search by town (e.g. Raxaul, Sunauli)…" />
          </div>
          <div className="mt-8">
            <Suspense key={q} fallback={<CardGridSkeleton />}>
              <CrossingsGrid search={q} />
            </Suspense>
          </div>
        </div>
      </SectionBackground>

      <AdvisorCta context="choosing a border crossing" />
    </>
  )
}
