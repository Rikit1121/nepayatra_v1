import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { atlasDisplayMd, atlasSectionEyebrow } from '@/lib/design-system'

interface SectionProps {
  title: string
  description?: string
  eyebrow?: string
  viewAllHref?: string
  viewAllLabel?: string
  children: React.ReactNode
  className?: string
  muted?: boolean
}

export function Section({
  title,
  description,
  eyebrow,
  viewAllHref,
  viewAllLabel = 'View all',
  children,
  className,
  muted = false,
}: SectionProps) {
  return (
    <section className={cn(muted && 'bg-[hsl(var(--atlas-mist))]/60', className)}>
      <div className="container py-12 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className={atlasSectionEyebrow}>{eyebrow}</p>}
            <h2 className={cn('font-display font-bold tracking-tight', eyebrow ? 'mt-2' : '', atlasDisplayMd)}>
              {title}
            </h2>
            {description && (
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
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
        <div className="mt-8">{children}</div>
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
      </div>
    </section>
  )
}
