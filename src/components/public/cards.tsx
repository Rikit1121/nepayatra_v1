'use client'

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
import type {
  Destination,
  Package,
  KnowledgeBaseArticle,
  BorderCrossing,
} from '@/lib/supabase/types'

const CATEGORY_IMAGE_ID: Record<string, string> = {
  religious: 'photo-1585350584893-6bc7e17b6e4d',
  cultural: 'photo-1558618666-fcd25c85cd64',
  adventure: 'photo-1486911278844-a81c5267e227',
  trekking: 'photo-1540202404-a2f29016b523',
  wildlife: 'photo-1518877593221-1f28583780b4',
  scenic: 'photo-1544735716-392fe2489ffa',
  heritage: 'photo-1588392382834-a891154bca4d',
}

const DEFAULT_IMAGE_ID = 'photo-1506905925346-21bda4d32df4'

function unsplashUrl(id: string, w = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
}

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
  alt,
  category,
  reduceMotion,
}: {
  src: string | null
  alt: string
  category?: string
  reduceMotion: boolean | null
}) {
  const imageUrl =
    src ||
    unsplashUrl(
      category ? (CATEGORY_IMAGE_ID[category] ?? DEFAULT_IMAGE_ID) : DEFAULT_IMAGE_ID
    )

  if (reduceMotion) {
    return (
      <div className="atlas-dest-image-wrap overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} loading="lazy" />
        <div className="atlas-dest-image-scrim" aria-hidden />
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <motion.div className="atlas-dest-image-wrap" variants={imageZoom}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} loading="lazy" />
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

  return (
    <Link href={`/destinations/${destination.slug}`} className="group block">
      <CardShell className={cn(atlasCardDestination)} reduceMotion={reduceMotion}>
        <div className="relative">
          <DestinationCardImage
            src={destination.hero_image_url}
            alt={destination.name}
            category={destination.category}
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

const PKG_FALLBACK_IDS: string[] = [
  'photo-1506905925346-21bda4d32df4',
  'photo-1544735716-392fe2489ffa',
  'photo-1540202404-a2f29016b523',
]

export function PackageCard({ pkg }: { pkg: Package }) {
  const reduceMotion = useReducedMotion()
  const fallbackIdx =
    pkg.slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % PKG_FALLBACK_IDS.length
  const fallbackId = PKG_FALLBACK_IDS[fallbackIdx]

  return (
    <Link href={`/packages/${pkg.slug}`} className="group block">
      <CardShell className={cn(atlasCardDestination)} reduceMotion={reduceMotion}>
        <div className="relative">
          <DestinationCardImage
            src={pkg.hero_image_url ?? unsplashUrl(fallbackId)}
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

  return (
    <Link href={`/border-crossings/${slug}`} className="group block">
      <CardShell
        className={cn(atlasCardDestination, 'border-l-4 border-l-[hsl(var(--atlas-blue))]')}
        reduceMotion={reduceMotion}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--atlas-saffron))]/15 text-[hsl(var(--atlas-saffron))]">
              <Milestone className="h-5 w-5" />
            </div>
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
