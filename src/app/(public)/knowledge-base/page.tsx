import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { ArticleCard } from '@/components/public/cards'
import { EmptyState } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { getKnowledgeBaseArticles } from '@/lib/supabase/queries'
import { KB_CATEGORY_LABELS, SITE } from '@/lib/site-config'
import type { KnowledgeBaseArticle } from '@/lib/supabase/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description:
    'Everything Indian travelers need to know about Nepal — entry requirements, currency and UPI, SIM cards, transport, safety, culture and trekking.',
  alternates: { canonical: `${SITE.url}/knowledge-base` },
  openGraph: {
    title: 'Knowledge Base · NepaYatra',
    description: 'Everything Indian travelers need to know about visiting Nepal.',
    url: `${SITE.url}/knowledge-base`,
  },
}

export default async function KnowledgeBasePage() {
  const articles = await getKnowledgeBaseArticles()

  // Group by category
  const grouped = new Map<string, KnowledgeBaseArticle[]>()
  for (const article of articles) {
    const list = grouped.get(article.category) ?? []
    list.push(article)
    grouped.set(article.category, list)
  }

  const featured = articles.filter((a) => a.featured).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow="Everything, explained"
        title="Knowledge base"
        description="Browse by topic, or jump straight to what you're unsure about. Written for first-time Indian visitors to Nepal."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Knowledge Base' }]} />
      </PageHero>

      <div className="container py-10">
        {/* Category tiles */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(KB_CATEGORY_LABELS).map(([value, label]) => {
            const count = grouped.get(value)?.length ?? 0
            return (
              <Link
                key={value}
                href={`/knowledge-base/${value}`}
                className="group"
                aria-disabled={count === 0}
              >
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <p className="font-semibold group-hover:text-primary">{label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {count} {count === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {articles.length === 0 && (
          <div className="mt-10">
            <EmptyState title="No articles published yet" description="Check back soon." />
          </div>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Start here</h2>
              <Badge variant="secondary">Most useful</Badge>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>

      <AdvisorCta context="a knowledge-base question" />
    </>
  )
}
