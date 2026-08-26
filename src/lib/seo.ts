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

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: item.href.startsWith('http') ? item.href : `${SITE.url}${item.href}` }
        : {}),
    })),
  }
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function eventJsonLd({
  name,
  description,
  startDate,
  endDate,
  url,
  locationName = 'Nepal',
}: {
  name: string
  description: string
  startDate?: string
  endDate?: string
  url: string
  locationName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    url,
    inLanguage: 'en-IN',
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    location: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NP',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  }
}

export function touristDestinationJsonLd({
  name,
  description,
  url,
  imageUrl,
  latitude,
  longitude,
  province,
  containedInPlace = 'Nepal',
}: {
  name: string
  description: string
  url: string
  imageUrl?: string
  latitude?: number
  longitude?: number
  province?: string
  containedInPlace?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(latitude != null && longitude != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude,
            longitude,
          },
        }
      : {}),
    ...(province
      ? {
          address: {
            '@type': 'PostalAddress',
            addressRegion: `${province} Province`,
            addressCountry: 'NP',
          },
        }
      : {
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NP',
          },
        }),
    containedInPlace: {
      '@type': 'Place',
      name: containedInPlace,
    },
  }
}

export function touristTripJsonLd({
  name,
  description,
  url,
  imageUrl,
  durationDays,
  estimatedCostInr,
}: {
  name: string
  description?: string
  url: string
  imageUrl?: string
  durationDays?: number
  estimatedCostInr?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(durationDays ? { itinerary: { '@type': 'ItemList', numberOfItems: durationDays } } : {}),
    ...(estimatedCostInr
      ? {
          offers: {
            '@type': 'Offer',
            price: estimatedCostInr,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            validFrom: '2026-01-01',
          },
        }
      : {}),
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  }
}

