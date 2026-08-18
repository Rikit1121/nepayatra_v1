'use client'

import * as React from 'react'
import { ImageIcon } from 'lucide-react'

interface DestinationHeroImageProps {
  src: string
  alt: string
  fallbackSrc: string
}

/**
 * Hero image for destination detail page.
 * Shows a styled placeholder on load error instead of a broken icon.
 */
export function DestinationHeroImage({ src, alt, fallbackSrc }: DestinationHeroImageProps) {
  const [activeSrc, setActiveSrc] = React.useState(src)
  const [broken, setBroken] = React.useState(false)

  const handleError = () => {
    if (activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc)
    } else {
      setBroken(true)
    }
  }

  if (broken) {
    return (
      <div className="flex aspect-[21/9] w-full items-center justify-center rounded-xl bg-[hsl(var(--atlas-mist))]">
        <div className="flex flex-col items-center gap-2 text-[hsl(var(--atlas-stone))]">
          <ImageIcon className="h-10 w-10 opacity-40" />
          <span className="text-sm font-medium opacity-60">{alt}</span>
        </div>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={activeSrc}
      alt={alt}
      className="aspect-[21/9] w-full rounded-xl object-cover"
      onError={handleError}
    />
  )
}

interface GalleryImageProps {
  src: string
  alt: string
  index: number
}

/**
 * Single gallery image with fallback placeholder.
 */
export function GalleryImage({ src, alt, index }: GalleryImageProps) {
  const [failed, setFailed] = React.useState(false)

  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-[hsl(var(--atlas-mist))]">
        <ImageIcon className="h-6 w-6 text-[hsl(var(--atlas-stone))] opacity-40" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="aspect-square w-full rounded-lg object-cover"
      loading={index < 3 ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  )
}
