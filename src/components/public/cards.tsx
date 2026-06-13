'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Clock, ArrowRight, Milestone, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatInr, slugify, cn } from '@/lib/utils'
import { atlasCardDestination, atlasCardEditorial } from '@/lib/design-system'
import { cardHover, imageHover } from '@/lib/motion'
import {
  DESTINATION_CATEGORY_LABELS,
  PROVINCE_LABELS,
  PACKAGE_DIFFICULTY_LABELS,
  KB_CATEGORY_LABELS,
} from '@/lib/site-config'
import { resolveDestinationImage, resolvePackageImage, resolveBorderCrossingImage, categoryFallbackImage } from '@/lib/local-images'
import type {
  Destination,
  Package,
  KnowledgeBaseArticle,
  BorderCrossing,
} from '@/lib/supabase/types'

const cardLift = {
  rest: { y: 0 },
  hover: cardHover,
}

const imageZoom = {
  rest: { scale: 1 },
  hover: imageHover,
}

function DestinationCardImage({
  src,
  fallbackSrc,
  alt,
  reduceMotion,
}: {
  src: string
  fallbackSrc: string
  alt: string
  reduceMotion: boolean | null
}) {
  const [activeSrc, setActiveSrc] = React.useState(src)

  React.useEffect(() => {
    setActiveSrc(src)
  }, [src])

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={activeSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc)
      }}
    />
  )

  if (reduceMotion) {
    return (
      <div className="atlas-dest-image-wrap overflow-hidden">
        {img}
        <div className="atlas-dest-image-scrim" aria-hidden />
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <motion.div className="atlas-dest-image-wrap" variants={imageZoom}>
        {img}
        <div className="atlas-dest-image-scrim" aria-hidden />
      </motion.div>
    </div>
  )
}

function CardShell({
  children,
  className,
  reduceMotion,
}: {
  children: React.ReactNode
  className?: string
  reduceMotion: boolean | null
}) {
  if (reduceMotion) {
    return <article className={className}>{children}</article>
  }

  return (
    <motion.article
      className={className}
      initial="rest"
      whileHover="hover"
      variants={cardLift}
    >
      {children}
    </motion.article>
  )
}

export function DestinationCard({ destination }: { destination: Destination }) {
  const reduceMotion = useReducedMotion()
  const imageUrl = resolveDestinationImage(
    destination.slug,
    destination.category,
    destination.hero_image_url
  )

  return (
    <Link href={`/destinations/${destination.slug}`} className="group block">
      <CardShell className={cn(atlasCardDestination)} reduceMotion={reduceMotion}>
        <div className="relative">
          <DestinationCardImage
            src={imageUrl}
            fallbackSrc={categoryFallbackImage(destination.category)}
            alt={destination.name}
            reduceMotion={reduceMotion}
          />
          <Badge className="atlas-dest-badge">
            {DESTINATION_CATEGORY_LABELS[destination.category] ?? destination.category}
          </Badge>
        </div>
        <div className="space-y-2 p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--atlas-stone))]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--atlas-blue-light))]" />
            {PROVINCE_LABELS[destination.province] ?? destination.province}
          </p>
          <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-[hsl(var(--atlas-blue))]">
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
      </CardShell>
    </Link>
  )
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const reduceMotion = useReducedMotion()
  const imageUrl = resolvePackageImage(pkg.slug, pkg.hero_image_url)

  return (
    <Link href={`/packages/${pkg.slug}`} className="group block">
      <CardShell className={cn(atlasCardDestination)} reduceMotion={reduceMotion}>
        <div className="relative">
          <DestinationCardImage
            src={imageUrl}
            fallbackSrc="/images/pokhara.jpg"
            alt={pkg.title}
            reduceMotion={reduceMotion}
          />
          <Badge className="atlas-dest-badge flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {pkg.duration_days} days
          </Badge>
        </div>
        <div className="space-y-2 p-4">
          <Badge variant="secondary" className="text-[11px]">
            {PACKAGE_DIFFICULTY_LABELS[pkg.difficulty] ?? pkg.difficulty}
          </Badge>
          <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-[hsl(var(--atlas-blue))]">
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
      </CardShell>
    </Link>
  )
}

export function ArticleCard({
  article,
  basePath = '/knowledge-base',
}: {
  article: KnowledgeBaseArticle
  basePath?: string
}) {
  const reduceMotion = useReducedMotion()
  const href =
    basePath === '/knowledge-base'
      ? `/knowledge-base/${article.category}/${article.slug}`
      : `${basePath}/${article.slug}`

  return (
    <Link href={href} className="group block">
      <CardShell className={cn(atlasCardEditorial)} reduceMotion={reduceMotion}>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--atlas-saffron))]/10 text-[hsl(var(--atlas-saffron))]">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[11px]">
                {KB_CATEGORY_LABELS[article.category] ?? article.category}
              </Badge>
              {article.reading_time_minutes != null && (
                <span>{article.reading_time_minutes} min read</span>
              )}
            </div>
          </div>
          <h3 className="mt-3 font-display text-xl font-bold leading-snug transition-colors group-hover:text-[hsl(var(--atlas-blue))]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--atlas-saffron))]">
            Read article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </CardShell>
    </Link>
  )
}

export function BorderCrossingCard({ crossing }: { crossing: BorderCrossing }) {
  const reduceMotion = useReducedMotion()
  const slug = slugify(crossing.crossing_name)
  const imageUrl = resolveBorderCrossingImage(slug)

  return (
    <Link href={`/border-crossings/${slug}`} className="group block">
      <CardShell
        className={cn(atlasCardDestination, 'border-l-4 border-l-[hsl(var(--atlas-blue))]')}
        reduceMotion={reduceMotion}
      >
        {imageUrl && (
          <DestinationCardImage
            src={imageUrl}
            fallbackSrc="/images/birgunj.jpeg"
            alt={`${crossing.crossing_name} border crossing`}
            reduceMotion={reduceMotion}
          />
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            {!imageUrl && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--atlas-saffron))]/15 text-[hsl(var(--atlas-saffron))]">
                <Milestone className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-[hsl(var(--atlas-blue))]">
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
            View crossing <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </CardShell>
    </Link>
  )
}
