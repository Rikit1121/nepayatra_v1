import { cn } from '@/lib/utils'

const LOGO_SRC = '/images/logo.png'

interface SiteLogoProps {
  size?: number
  className?: string
  /** Defaults to site name from caller context — pass empty string for decorative use. */
  alt?: string
}

export function SiteLogo({ size = 32, className, alt = 'NepaYatra' }: SiteLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={alt}
      width={size}
      height={size}
      className={cn('shrink-0 rounded-md object-contain', className)}
    />
  )
}

export { LOGO_SRC }
