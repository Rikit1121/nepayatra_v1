import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { ArticleCard } from '@/components/public/cards'
import { EmptyState } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { getKnowledgeBaseArticles } from '@/lib/supabase/queries'
import { KB_CATEGORY_LABELS, SITE } from '@/lib/site-config'

export const revalidate = 3600

const VALID_CATEGORIES = Object.keys(KB_CATEGORY_LABELS)

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }))
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const label = KB_CATEGORY_LABELS[category]
  if (!label) return { title: 'Not found' }

  const title = `${label} — Nepal Travel Knowledge`
  const description = `Articles about ${label.toLowerCase()} for Indian travelers visiting Nepal.`
  const url = `${SITE.url}/knowledge-base/${category}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

export default async function KnowledgeBaseCategoryPage({ params }: PageProps) {
  const { category } = await params
  const label = KB_CATEGORY_LABELS[category]
  if (!label) notFound()

  const articles = await getKnowledgeBaseArticles(category)

  return (
    <>
      <PageHero
        eyebrow="Knowledge base"
        title={label}
        description={`What Indian travelers should know about ${label.toLowerCase()} in Nepal.`}
      >
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Knowledge Base', href: '/knowledge-base' },
            { label },
          ]}
        />
      </PageHero>

      <div className="container py-10">
        {articles.length === 0 ? (
          <EmptyState
            title="No articles in this topic yet"
            description="Browse other topics in the knowledge base."
            actionLabel="Back to knowledge base"
            actionHref="/knowledge-base"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      <AdvisorCta context={`${label.toLowerCase()} in Nepal`} />
    </>
  )
}
