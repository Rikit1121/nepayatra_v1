import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs, type Crumb } from '@/components/public/breadcrumbs'
import { ArticleCard } from '@/components/public/cards'
import { KB_CATEGORY_LABELS } from '@/lib/site-config'
import type { KnowledgeBaseArticle } from '@/lib/supabase/types'

interface ArticleViewProps {
  article: KnowledgeBaseArticle
  breadcrumbs: Crumb[]
  related: KnowledgeBaseArticle[]
  relatedBasePath?: string
}

/**
 * Renders a knowledge-base / guide article.
 * Content is treated as plain text with paragraph + line-break preservation.
 */
export function ArticleView({
  article,
  breadcrumbs,
  related,
  relatedBasePath = '/knowledge-base',
}: ArticleViewProps) {
  return (
    <>
      <section className="border-b bg-muted/30">
        <div className="container py-8 md:py-10">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary">
              {KB_CATEGORY_LABELS[article.category] ?? article.category}
            </Badge>
            {article.reading_time_minutes != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {article.reading_time_minutes} min read
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{article.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{article.summary}</p>
        </div>
      </section>

      <article className="container py-10">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4 text-base leading-relaxed text-foreground/90">
            {article.content.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          {article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t">
          <div className="container py-12">
            <h2 className="text-2xl font-bold tracking-tight">Related articles</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} basePath={relatedBasePath} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
