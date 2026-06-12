import { cn } from '@/lib/utils'
import {
  atlasBodyLg,
  atlasDisplayMd,
  atlasHeroGradient,
  atlasSectionEyebrow,
} from '@/lib/design-system'

interface PageHeroProps {
  title: string
  description?: string
  eyebrow?: string
  children?: React.ReactNode
  className?: string
}

export function PageHero({ title, description, eyebrow, children, className }: PageHeroProps) {
  return (
    <section className={cn('border-b', atlasHeroGradient, className)}>
      <div className="container py-10 md:py-14">
        {eyebrow && <p className={atlasSectionEyebrow}>{eyebrow}</p>}
        <h1 className={cn('font-display font-bold tracking-tight', eyebrow ? 'mt-2' : '', atlasDisplayMd)}>
          {title}
        </h1>
        {description && (
          <p className={cn('mt-3 max-w-2xl', atlasBodyLg, 'text-muted-foreground')}>{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
