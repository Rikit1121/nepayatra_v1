import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { SearchInput } from '@/components/public/search-input'
import { FilterSelect } from '@/components/public/filter-select'
import { ArticleCard } from '@/components/public/cards'
import { EmptyState, CardGridSkeleton } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { getKnowledgeBaseArticles } from '@/lib/supabase/queries'
import { KB_CATEGORY_LABELS, SITE } from '@/lib/site-config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nepal Travel Guides',
  description:
    'Practical Nepal travel guides for Indian travelers — entry rules, currency and UPI, SIM cards, transport, safety and seasons.',
  alternates: { canonical: `${SITE.url}/guides` },
  openGraph: {
    title: 'Nepal Travel Guides · NepaYatra',
    description: 'Practical Nepal travel guides for Indian travelers.',
    url: `${SITE.url}/guides`,
  },
}

const CATEGORY_OPTIONS = Object.entries(KB_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

async function GuidesGrid({ search, category }: { search?: string; category?: string }) {
  let articles = await getKnowledgeBaseArticles(category)
  if (search) {
    const q = search.toLowerCase()
    articles = articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    )
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No guides found"
        description="Try another search term or category."
        actionLabel="Clear filters"
        actionHref="/guides"
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} basePath="/guides" />
      ))}
    </div>
  )
}

export default async function GuidesPage({ searchParams }: PageProps) {
  const { q, category } = await searchParams

  return (
    <>
      <PageHero
        eyebrow="Know before you go"
        title="Travel guides"
        description="The practical stuff, explained plainly. No fluff — just what you actually need to sort before and during your trip."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Travel Guides' }]} />
      </PageHero>

      <div className="container py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput placeholder="Search guides…" />
          </div>
          <FilterSelect paramKey="category" placeholder="All topics" options={CATEGORY_OPTIONS} />
        </div>
        <div className="mt-8">
          <Suspense key={`${q}-${category}`} fallback={<CardGridSkeleton />}>
            <GuidesGrid search={q} category={category} />
          </Suspense>
        </div>
      </div>

      <AdvisorCta context="trip planning questions" />
    </>
  )
}
