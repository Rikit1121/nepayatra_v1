import Link from 'next/link'
import { MapPin, Clock, Mountain, ArrowRight, Milestone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatInr, slugify, cn } from '@/lib/utils'
import { atlasCardDestination, atlasCardEditorial } from '@/lib/design-system'
import {
  DESTINATION_CATEGORY_LABELS,
  PROVINCE_LABELS,
  PACKAGE_DIFFICULTY_LABELS,
  KB_CATEGORY_LABELS,
} from '@/lib/site-config'
import type {
  Destination,
  Package,
  KnowledgeBaseArticle,
  BorderCrossing,
} from '@/lib/supabase/types'

function CardImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div
      className="flex aspect-[4/3] w-full items-center justify-center bg-[hsl(var(--atlas-mist))]"
      aria-hidden
    >
      <Mountain className="h-10 w-10 text-[hsl(var(--atlas-stone))]/40" aria-label={alt} />
    </div>
  )
}

function DestinationCardImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="atlas-dest-image-wrap">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <CardImagePlaceholder alt={alt} />
      )}
      <div className="atlas-dest-image-scrim" aria-hidden />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Destination card
// ─────────────────────────────────────────────────────────────

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/destinations/${destination.slug}`} className="group block">
      <article className={atlasCardDestination}>
        <div className="relative">
          <DestinationCardImage src={destination.hero_image_url} alt={destination.name} />
          <Badge className="atlas-dest-badge">
            {DESTINATION_CATEGORY_LABELS[destination.category] ?? destination.category}
          </Badge>
        </div>
        <div className="space-y-2 p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--atlas-stone))]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--atlas-blue-light))]" />
            {PROVINCE_LABELS[destination.province] ?? destination.province}
          </p>
          <h3 className="font-display text-lg font-bold leading-tight group-hover:text-[hsl(var(--atlas-blue))]">
            {destination.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {destination.short_description}
          </p>
          {destination.altitude_meters != null && (
            <p className="text-xs text-muted-foreground">
              {destination.altitude_meters.toLocaleString('en-IN')} m altitude
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────
// Package (Suggested Trip) card
// ─────────────────────────────────────────────────────────────

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <Link href={`/packages/${pkg.slug}`} className="group block">
      <article className={atlasCardDestination}>
        <div className="relative">
          <DestinationCardImage src={pkg.hero_image_url} alt={pkg.title} />
          <Badge className="atlas-dest-badge flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {pkg.duration_days} days
          </Badge>
        </div>
        <div className="space-y-2 p-4">
          <Badge variant="secondary" className="text-[11px]">
            {PACKAGE_DIFFICULTY_LABELS[pkg.difficulty] ?? pkg.difficulty}
          </Badge>
          <h3 className="font-display text-lg font-bold leading-tight group-hover:text-[hsl(var(--atlas-blue))]">
            {pkg.title}
          </h3>
          {pkg.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {pkg.description}
            </p>
          )}
          {pkg.price_inr_from != null && (
            <p className="text-sm font-semibold text-[hsl(var(--atlas-blue))]">
              From {formatInr(pkg.price_inr_from)}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────
// Knowledge base / guide article card
// ─────────────────────────────────────────────────────────────

export function ArticleCard({
  article,
  basePath = '/knowledge-base',
}: {
  article: KnowledgeBaseArticle
  basePath?: string
}) {
  const href =
    basePath === '/knowledge-base'
      ? `/knowledge-base/${article.category}/${article.slug}`
      : `${basePath}/${article.slug}`

  return (
    <Link href={href} className="group block">
      <article className={atlasCardEditorial}>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-[11px]">
              {KB_CATEGORY_LABELS[article.category] ?? article.category}
            </Badge>
            {article.reading_time_minutes != null && (
              <span>{article.reading_time_minutes} min read</span>
            )}
          </div>
          <h3 className="mt-3 font-display text-xl font-bold leading-snug group-hover:text-[hsl(var(--atlas-blue))]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--atlas-saffron))]">
            Read article <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────
// Border crossing card
// ─────────────────────────────────────────────────────────────

export function BorderCrossingCard({ crossing }: { crossing: BorderCrossing }) {
  const slug = slugify(crossing.crossing_name)
  return (
    <Link href={`/border-crossings/${slug}`} className="group block">
      <article
        className={cn(
          atlasCardDestination,
          'border-l-4 border-l-[hsl(var(--atlas-blue))]'
        )}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--atlas-saffron))]/15 text-[hsl(var(--atlas-saffron))]">
              <Milestone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold leading-tight group-hover:text-[hsl(var(--atlas-blue))]">
                {crossing.crossing_name}
              </h3>
              <p className="mt-2 text-sm font-medium text-[hsl(var(--atlas-blue))]">
                {crossing.india_side}
                <span className="mx-1.5 text-muted-foreground">→</span>
                {crossing.nepal_side}
              </p>
            </div>
          </div>
          {crossing.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {crossing.description}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--atlas-saffron))]">
            View crossing <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  )
}
