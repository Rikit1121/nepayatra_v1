import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CtaSectionProps {
  title: string
  description?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}

export function CtaSection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: CtaSectionProps) {
  return (
    <section className={cn('border-t bg-muted/30', className)}>
      <div className="container py-12 text-center md:py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{description}</p>
        )}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
