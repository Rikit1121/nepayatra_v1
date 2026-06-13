import { cn } from '@/lib/utils'

interface SectionBackgroundProps {
  imageSrc: string
  children: React.ReactNode
  className?: string
  /** Soft wash over the image — keeps backgrounds light and text readable. */
  overlayClassName?: string
  imageClassName?: string
}

/**
 * Full-bleed section background with a light scrim so imagery stays subtle
 * and foreground text/cards remain legible.
 */
export function SectionBackground({
  imageSrc,
  children,
  className,
  overlayClassName = 'bg-[#f8fafc]/90',
  imageClassName = 'opacity-50 saturate-[0.85]',
}: SectionBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          className={cn('h-full w-full object-cover object-center', imageClassName)}
          loading="lazy"
        />
        <div className={cn('absolute inset-0', overlayClassName)} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
