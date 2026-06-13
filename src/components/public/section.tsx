'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  atlasDisplayMd,
  atlasSectionDivider,
  atlasSectionEyebrow,
  atlasSectionMuted,
  atlasSectionPadding,
  atlasSectionWhite,
} from '@/lib/design-system'
import { FadeInView } from '@/components/motion/fade-in-view'
import { StaggerGrid } from '@/components/motion/stagger-grid'
import { SectionBackground } from '@/components/public/section-background'

type SectionTone = 'white' | 'muted'

const toneClasses: Record<SectionTone, string> = {
  white: atlasSectionWhite,
  muted: atlasSectionMuted,
}

interface SectionProps {
  title: string
  description?: string
  eyebrow: string
  viewAllHref?: string
  viewAllLabel?: string
  children: React.ReactNode
  className?: string
  tone?: SectionTone
  divider?: boolean
  /** Stagger-animate direct children into view. */
  stagger?: boolean
  staggerClassName?: string
  footer?: React.ReactNode
  /** Optional background image path (e.g. /images/background3.jpg). */
  backgroundImage?: string
}

export function Section({
  title,
  description,
  eyebrow,
  viewAllHref,
  viewAllLabel = 'View all',
  children,
  className,
  tone = 'white',
  divider = true,
  stagger = false,
  staggerClassName,
  footer,
  backgroundImage,
}: SectionProps) {
  const content = stagger ? (
    <StaggerGrid className={cn('mt-10', staggerClassName)}>{children}</StaggerGrid>
  ) : (
    <div className="mt-10">{children}</div>
  )

  const inner = (
    <>
      <FadeInView>
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className={atlasSectionEyebrow}>{eyebrow}</p>
            <h2 className={cn('mt-2 font-display font-bold tracking-tight text-foreground', atlasDisplayMd)}>
              {title}
            </h2>
            {description && (
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[hsl(var(--atlas-blue))] hover:underline sm:inline-flex"
            >
              {viewAllLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </FadeInView>
      {content}
      {footer}
      {viewAllHref && (
        <div className="mt-6 sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--atlas-blue))] hover:underline"
          >
            {viewAllLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </>
  )

  return (
    <section
      className={cn(
        !backgroundImage && toneClasses[tone],
        divider && atlasSectionDivider,
        'border-b border-border/30',
        className
      )}
    >
      {backgroundImage ? (
        <SectionBackground imageSrc={backgroundImage}>
          <div className={cn('container', atlasSectionPadding)}>{inner}</div>
        </SectionBackground>
      ) : (
        <div className={cn('container', atlasSectionPadding)}>{inner}</div>
      )}
    </section>
  )
}
