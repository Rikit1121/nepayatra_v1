/**
 * Local images in /public/images mapped to site content.
 * Used when Supabase hero_image_url is empty.
 */

const CATEGORY_UNSPLASH_ID: Record<string, string> = {
  religious: 'photo-1585350584893-6bc7e17b6e4d',
  cultural: 'photo-1558618666-fcd25c85cd64',
  adventure: 'photo-1486911278844-a81c5267e227',
  trekking: 'photo-1540202404-a2f29016b523',
  wildlife: 'photo-1518877593221-1f28583780b4',
  scenic: 'photo-1544735716-392fe2489ffa',
  heritage: 'photo-1588392382834-a891154bca4d',
}

const DEFAULT_UNSPLASH_ID = 'photo-1506905925346-21bda4d32df4'

/** Homepage hero — Annapurna sunrise from Sarangkot */
export const SITE_HERO_IMAGE = '/images/sarangkot.webp'

const DESTINATION_IMAGES: Record<string, string> = {
  kathmandu: '/images/Kathmandu.jpg',
  bhaktapur: '/images/Bhaktapur.jpg',
  patan: '/images/Patan.jpg',
  pokhara: '/images/pokhara.jpg',
  chitwan: '/images/Chitwan.jpg',
  janakpur: '/images/Janakpur-Temple.jpg',
  lumbini: '/images/Lumbini.jpg',
  dhulikhel: '/images/Dhulikhel.jpg',
  bandipur: '/images/Bandipur.jpg',
  sarangkot: '/images/sarangkot.webp',
  'rara-lake': '/images/rara-lake.jpg',
  muktinath: '/images/The_Muktinath_Temple.jpg',
  pashupatinath: '/images/Pashupatinath.webp',
  mustang: '/images/MUSTANG-NEPAL.jpg',
  manang: '/images/manang.avif',
  'bardia-national-park': '/images/bardiya.jpg',
  birgunj: '/images/birgunj.jpeg',
  'annapurna-base-camp': '/images/Annapurna-base-camp-trek-8-days.jpg',
  nagarkot: '/images/nagarkot1.jpg',
  ilam: '/images/ilam.jpg',
  ghandruk: '/images/ghandruk.jpg',
}

const PACKAGE_IMAGES: Record<string, string> = {
  'golden-triangle-nepal': '/images/Kathmandu.jpg',
  'annapurna-base-camp-trek': '/images/Annapurna-base-camp-trek-8-days.jpg',
  'nepal-pilgrimage-circuit': '/images/Pashupatinath.webp',
  'upper-mustang-expedition': '/images/MUSTANG-NEPAL.jpg',
}

const BORDER_CROSSING_IMAGES: Record<string, string> = {
  'raxaul-birgunj': '/images/birgunj.jpeg',
  'sunauli-bhairahawa': '/images/bhairahwa_border.jpg',
  'jogbani-biratnagar': '/images/biratnagar_border.jpg',
  'panitanki-kakarbhitta': '/images/Kakarbhitta_border.jpg',
  'banbasa-mahendranagar': '/images/banbasa_border.webp',
}

function unsplashUrl(id: string, w = 800): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
}

export function categoryFallbackImage(category: string, w = 800): string {
  return unsplashUrl(CATEGORY_UNSPLASH_ID[category] ?? DEFAULT_UNSPLASH_ID, w)
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export function resolveDestinationImage(
  slug: string,
  category: string,
  heroImageUrl?: string | null
): string {
  // Prefer uploaded local assets for known destinations.
  const local = DESTINATION_IMAGES[slug]
  if (local) return local

  const remote = heroImageUrl?.trim()
  if (remote && isExternalUrl(remote)) return remote

  return categoryFallbackImage(category)
}

export function resolvePackageImage(slug: string, heroImageUrl?: string | null): string {
  const local = PACKAGE_IMAGES[slug]
  if (local) return local

  const remote = heroImageUrl?.trim()
  if (remote && isExternalUrl(remote)) return remote

  return PACKAGE_IMAGES['golden-triangle-nepal'] ?? '/images/pokhara.jpg'
}

export function resolveBorderCrossingImage(slug: string): string | null {
  return BORDER_CROSSING_IMAGES[slug] ?? null
}

export function resolveHeroImage(settingsUrl?: string | null): string {
  const remote = settingsUrl?.trim()
  if (remote && isExternalUrl(remote)) return remote
  if (remote?.startsWith('/images/')) return remote
  return SITE_HERO_IMAGE
}

/** Turn `/images/foo.jpg` into an absolute URL for Open Graph metadata. */
export function absoluteImageUrl(imageUrl: string, siteUrl: string): string {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${siteUrl.replace(/\/$/, '')}${path}`
}
