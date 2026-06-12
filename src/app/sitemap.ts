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
    '/guides',
    '/packages',
    '/knowledge-base',
    '/faq',
    '/contact',
    '/route-planner',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const [destSlugs, pkgSlugs, articleSlugs, kbParams, crossings] = await Promise.all([
    getDestinationSlugs(),
    getPackageSlugs(),
    getArticleSlugs(),
    getKnowledgeBaseParams(),
    getAllBorderCrossingsForStaticParams(),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...destSlugs.map((slug) => ({ url: `${base}/destinations/${slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...pkgSlugs.map((slug) => ({ url: `${base}/packages/${slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...articleSlugs.map((slug) => ({ url: `${base}/guides/${slug}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...kbParams.map((p) => ({ url: `${base}/knowledge-base/${p.category}/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...Object.keys(KB_CATEGORY_LABELS).map((category) => ({ url: `${base}/knowledge-base/${category}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...crossings.map((c) => ({ url: `${base}/border-crossings/${slugify(c.crossing_name)}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ].map((entry) => ({ ...entry, lastModified: new Date() }))

  return [...staticRoutes, ...dynamicRoutes]
}
