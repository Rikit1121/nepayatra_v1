import type { Metadata } from 'next'
import { SITE, FOOTER_CONTACT } from '@/lib/site-config'
import { SITE_HERO_IMAGE, absoluteImageUrl } from '@/lib/local-images'

export const DEFAULT_OG_IMAGE = SITE_HERO_IMAGE

export function absoluteOgImage(imagePath: string = DEFAULT_OG_IMAGE): string {
  return absoluteImageUrl(imagePath, SITE.url)
}

/** Consistent canonical URLs, Open Graph and Twitter cards for public pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  imagePath = DEFAULT_OG_IMAGE,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  imagePath?: string
  type?: 'website' | 'article'
}): Metadata {
  const url = `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
  const image = absoluteOgImage(imagePath)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/images/logo.png`,
    description: SITE.description,
    email: FOOTER_CONTACT.email,
    sameAs: [FOOTER_CONTACT.instagram, FOOTER_CONTACT.facebook],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  }
}

export function travelGuideJsonLd({
  title,
  description,
  url,
  dateModified,
}: {
  title: string
  description: string
  url: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelGuide',
    name: title,
    description,
    url,
    inLanguage: 'en-IN',
    ...(dateModified ? { dateModified } : {}),
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  }
}
