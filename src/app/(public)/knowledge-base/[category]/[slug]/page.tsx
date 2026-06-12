import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleView } from '@/components/public/article-view'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import {
  getArticleByCategoryAndSlug,
  getKnowledgeBaseParams,
  getRelatedArticles,
} from '@/lib/supabase/queries'
import { KB_CATEGORY_LABELS, SITE } from '@/lib/site-config'

export const revalidate = 3600

export async function generateStaticParams() {
  return getKnowledgeBaseParams()
}

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const article = await getArticleByCategoryAndSlug(category, slug)
  if (!article) return { title: 'Article not found' }

  const title = article.seo_title ?? article.title
  const description = article.seo_description ?? article.summary
  const url = `${SITE.url}/knowledge-base/${category}/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function KnowledgeBaseArticlePage({ params }: PageProps) {
  const { category, slug } = await params
  const article = await getArticleByCategoryAndSlug(category, slug)
  if (!article) notFound()

  const related = await getRelatedArticles(article, 3)
  const label = KB_CATEGORY_LABELS[article.category] ?? article.category

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.url}/knowledge-base/${article.category}/${article.slug}`,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleView
        article={article}
        related={related}
        relatedBasePath="/knowledge-base"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Knowledge Base', href: '/knowledge-base' },
          { label, href: `/knowledge-base/${article.category}` },
          { label: article.title },
        ]}
      />
      <AdvisorCta context={`the article: ${article.title}`} />
    </>
  )
}
