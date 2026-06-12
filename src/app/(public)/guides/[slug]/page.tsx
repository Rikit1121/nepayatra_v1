import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleView } from '@/components/public/article-view'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/supabase/queries'
import { SITE } from '@/lib/site-config'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Guide not found' }

  const title = article.seo_title ?? article.title
  const description = article.seo_description ?? article.summary
  const url = `${SITE.url}/guides/${article.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const related = await getRelatedArticles(article, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.url}/guides/${article.slug}`,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleView
        article={article}
        related={related}
        relatedBasePath="/guides"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Travel Guides', href: '/guides' },
          { label: article.title },
        ]}
      />
      <AdvisorCta context={`the guide: ${article.title}`} />
    </>
  )
}
