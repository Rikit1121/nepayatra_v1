import type { MetadataRoute } from 'next'
import { SITE, KB_CATEGORY_LABELS } from '@/lib/site-config'
import {
  getDestinationSlugs,
  getPackageSlugs,
  getArticleSlugs,
  getKnowledgeBaseParams,
  getAllBorderCrossingsForStaticParams,
} from '@/lib/supabase/queries'
import { slugify } from '@/lib/utils'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/destinations',
    '/border-crossings',
    '/map',
    '/guides',
    '/packages',
    '/knowledge-base',
    '/faq',
    '/contact',
    '/about',
    '/privacy',
    '/route-planner',
    '/calendar',
    '/calendar/2026',
    '/calendar/2083',
    '/calendar/2025',
    '/calendar/festivals/dashain',
    '/calendar/festivals/tihar',
    '/calendar/festivals/holi',
    '/calendar/festivals/buddha-jayanti',
    '/calendar/festivals/indra-jatra',
    '/calendar/festivals/maha-shivaratri',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? ('weekly' as const) : ('weekly' as const),
    priority: path === '' ? 1 : path === '/border-crossings' || path === '/destinations' || path === '/calendar' ? 0.9 : 0.7,
  }))

  const [destSlugs, pkgSlugs, articleSlugs, kbParams, crossings] = await Promise.all([
    getDestinationSlugs(),
    getPackageSlugs(),
    getArticleSlugs(),
    getKnowledgeBaseParams(),
    getAllBorderCrossingsForStaticParams(),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...destSlugs.map((slug) => ({ url: `${base}/destinations/${slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...pkgSlugs.map((slug) => ({ url: `${base}/packages/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...articleSlugs.map((slug) => ({ url: `${base}/guides/${slug}`, changeFrequency: 'monthly' as const, priority: 0.75 })),
    ...kbParams.map((p) => ({ url: `${base}/knowledge-base/${p.category}/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.75 })),
    ...Object.keys(KB_CATEGORY_LABELS).map((category) => ({ url: `${base}/knowledge-base/${category}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...crossings.map((c) => ({ url: `${base}/border-crossings/${slugify(c.crossing_name)}`, changeFrequency: 'monthly' as const, priority: 0.85 })),
  ].map((entry) => ({ ...entry, lastModified: new Date() }))

  return [...staticRoutes, ...dynamicRoutes]
}
