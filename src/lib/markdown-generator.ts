import {
  getDestinations,
  getDestinationBySlug,
  getBorderCrossings,
  getBorderCrossingBySlug,
  getArticleBySlug,
  getArticleByCategoryAndSlug,
  getKnowledgeBaseArticles,
  getPackages,
  getPackageBySlug,
  getFaqs,
  getCalendarEventBySlug,
  getCalendarEvents,
} from '@/lib/supabase/queries'
import { SITE, FOOTER_CONTACT, KB_CATEGORY_LABELS } from '@/lib/site-config'
import { slugify } from '@/lib/utils'
import type { Destination, BorderCrossing, Package, CalendarEvent, KnowledgeBaseArticle } from '@/lib/supabase/types'

export async function generateMarkdownForPath(path: string): Promise<string | null> {
  const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/'

  // 1. Homepage
  if (cleanPath === '/') {
    const destinations = await getDestinations()
    const crossings = await getBorderCrossings()
    const packages = await getPackages()

    return `# NepaYatra — Plan Your Nepal Trip

> ${SITE.description}

## Quick Navigation
- Trip Planner: ${SITE.url}/route-planner
- Destinations: ${SITE.url}/destinations
- India–Nepal Border Crossings: ${SITE.url}/border-crossings
- Travel Calendar (AD · BS): ${SITE.url}/calendar
- Travel Guides: ${SITE.url}/guides
- Suggested Trips: ${SITE.url}/packages
- Knowledge Base: ${SITE.url}/knowledge-base
- FAQ: ${SITE.url}/faq

## Popular Destinations in Nepal
${destinations
  .slice(0, 10)
  .map(
    (d: Destination) =>
      `- **[${d.name}](${SITE.url}/destinations/${d.slug})** (${d.category} · ${d.province} Province)\n  ${d.short_description || ''}`
  )
  .join('\n\n')}

## Major India–Nepal Border Crossings (Road Entry)
${crossings
  .map(
    (b: BorderCrossing) =>
      `- **[${b.crossing_name}](${SITE.url}/border-crossings/${slugify(b.crossing_name)})**: Connects ${b.india_side} (India) to ${b.nepal_side} (Nepal).`
  )
  .join('\n')}

## Suggested Itineraries
${packages
  .map(
    (p: Package) =>
      `- **[${p.title}](${SITE.url}/packages/${p.slug})** (${p.duration_days} Days · ${p.difficulty || 'Moderate'})\n  ${p.description || ''}`
  )
  .join('\n\n')}

---
*Published by NepaYatra (${SITE.url}) · Contact: ${FOOTER_CONTACT.email}*
`
  }

  // 2. Destinations List
  if (cleanPath === '/destinations') {
    const destinations = await getDestinations()
    return `# Destinations in Nepal — NepaYatra

Explore cities, trekking hubs, national parks, and pilgrimage centers across Nepal.

${destinations
  .map(
    (d: Destination) => `### [${d.name}](${SITE.url}/destinations/${d.slug})
- **Category**: ${d.category}
- **Province**: ${d.province} Province
- **Overview**: ${d.short_description || 'No description available.'}
- **Best Season**: ${Array.isArray(d.best_season) ? d.best_season.join(', ') : 'All year'}
`
  )
  .join('\n')}

---
*Back to [NepaYatra Home](${SITE.url})*
`
  }

  // 3. Destination Detail: /destinations/[slug]
  if (cleanPath.startsWith('/destinations/')) {
    const slug = cleanPath.replace('/destinations/', '')
    const dest = await getDestinationBySlug(slug)
    if (!dest) return null

    return `# ${dest.name} — Travel Guide & Information

- **Category**: ${dest.category}
- **Province**: ${dest.province} Province
- **Best Season**: ${Array.isArray(dest.best_season) ? dest.best_season.join(', ') : 'All year'}
${dest.altitude_meters ? `- **Altitude**: ${dest.altitude_meters}m` : ''}
${dest.latitude && dest.longitude ? `- **Coordinates**: ${dest.latitude}, ${dest.longitude}` : ''}

## Overview
${dest.full_description || dest.short_description || 'Information available on NepaYatra.'}

---
*Plan your route to ${dest.name} using the [NepaYatra Trip Planner](${SITE.url}/route-planner).*
`
  }

  // 4. Border Crossings List
  if (cleanPath === '/border-crossings') {
    const crossings = await getBorderCrossings()
    return `# India–Nepal Border Crossings

Guide to entering Nepal overland by car, bus, or motorbike from India.

${crossings
  .map(
    (b: BorderCrossing) => `### [${b.crossing_name}](${SITE.url}/border-crossings/${slugify(b.crossing_name)})
- **India Side**: ${b.india_side}
- **Nepal Side**: ${b.nepal_side}
- **Details**: ${b.description || 'Major entry checkpoint for Indian and foreign passport holders.'}
`
  )
  .join('\n')}

## Essential Border Checklist for Indian Travelers
1. Valid Government ID (Voter ID card or Passport).
2. Vehicle documentation (Registration Certificate RC, Driving License, Insurance, Pollution Certificate).
3. Bhansar (Customs permit) and Yatyayat entry passes obtained directly at Nepal customs counter.

---
*More details at [NepaYatra](${SITE.url})*
`
  }

  // 5. Border Crossing Detail: /border-crossings/[slug]
  if (cleanPath.startsWith('/border-crossings/')) {
    const slug = cleanPath.replace('/border-crossings/', '')
    const crossings = await getBorderCrossings()
    const border = crossings.find((c: BorderCrossing) => slugify(c.crossing_name) === slug)
    if (!border) return null

    return `# ${border.crossing_name} Border Crossing

- **Indian Checkpoint**: ${border.india_side}
- **Nepalese Checkpoint**: ${border.nepal_side}
${border.latitude && border.longitude ? `- **Coordinates**: ${border.latitude}, ${border.longitude}` : ''}

## Description & Access
${border.description || 'Major transit route connecting India and Nepal.'}

${border.operating_notes ? `## Operating Notes\n${border.operating_notes}` : ''}

## Key Transit Rules
- Indian citizens require a valid Voter ID card or Passport.
- Private Indian vehicles require a Bhansar vehicle entry permit obtained at the border.
- Nepalese Rupee (NPR) is accepted everywhere at fixed exchange (100 INR = 160 NPR).

---
*Plan an overland route from ${border.crossing_name} using the [NepaYatra Trip Planner](${SITE.url}/route-planner).*
`
  }

  // 6. Calendar Hub & Yearly Pages
  if (cleanPath === '/calendar' || cleanPath.startsWith('/calendar/')) {
    if (cleanPath === '/calendar' || cleanPath === '/calendar/2026' || cleanPath === '/calendar/2083') {
      const events = await getCalendarEvents()
      return `# Nepal Travel & Festival Calendar 2026 / 2083 (AD · BS)

Comprehensive calendar of festivals, auspicious travel seasons, and national public holidays in Nepal.

## Key Festivals & Holidays
${events
  .slice(0, 15)
  .map(
    (e: CalendarEvent) =>
      `- **${e.title}** (${e.event_type}): ${e.start_date_ad || '2026'} (BS ${e.start_date_bs || ''})\n  ${e.summary || e.description || ''}`
  )
  .join('\n\n')}

## Dual Calendar System
Nepal officially uses Bikram Sambat (BS), which is approximately 56.7 years ahead of the Gregorian calendar (AD). Use the [Interactive AD/BS Calendar Tool](${SITE.url}/calendar) to convert dates.

---
*View interactive calendar at [NepaYatra Calendar](${SITE.url}/calendar)*
`
    }

    if (cleanPath.startsWith('/calendar/festivals/')) {
      const slug = cleanPath.replace('/calendar/festivals/', '')
      const fest = await getCalendarEventBySlug(slug)
      if (!fest) return null

      return `# ${fest.title} — Festival Details

- **Event Type**: ${fest.event_type}
- **Gregorian (AD)**: ${fest.start_date_ad} to ${fest.end_date_ad}
- **Bikram Sambat (BS)**: ${fest.start_date_bs} to ${fest.end_date_bs}
- **Significance**: ${fest.description || fest.summary || ''}

---
*Explore all festivals at [NepaYatra Calendar](${SITE.url}/calendar)*
`
    }
  }

  // 7. Travel Guides & Knowledge Base
  if (cleanPath === '/guides') {
    const articles = await getKnowledgeBaseArticles()
    return `# Nepal Travel Guides — NepaYatra

In-depth travel advice, border procedures, and cost guides.

${articles
  .map(
    (a: KnowledgeBaseArticle) => `### [${a.title}](${SITE.url}/guides/${a.slug})
- **Summary**: ${a.summary || ''}
- **Category**: ${a.category || 'General'}
`
  )
  .join('\n')}

---
*Read full articles at [NepaYatra Guides](${SITE.url}/guides)*
`
  }

  if (cleanPath.startsWith('/guides/')) {
    const slug = cleanPath.replace('/guides/', '')
    const guide = await getArticleBySlug(slug)
    if (!guide) return null

    return `# ${guide.title}

*Published on NepaYatra · Category: ${guide.category || 'Travel Guide'}*

${guide.summary ? `> ${guide.summary}\n\n` : ''}
${guide.content || guide.summary || 'Detailed guide available on NepaYatra.'}

---
*Source: [${SITE.url}/guides/${guide.slug}](${SITE.url}/guides/${guide.slug})*
`
  }

  // 8. Knowledge Base
  if (cleanPath === '/knowledge-base') {
    const articles = await getKnowledgeBaseArticles()
    return `# NepaYatra Knowledge Base

Essential reference topics for traveling to Nepal.

${Object.entries(KB_CATEGORY_LABELS)
  .map(([catKey, catLabel]) => {
    const catArticles = articles.filter((a: KnowledgeBaseArticle) => a.category === catKey)
    return `### ${catLabel} (${catKey})
${
  catArticles.length > 0
    ? catArticles
        .map((a: KnowledgeBaseArticle) => `- [${a.title}](${SITE.url}/knowledge-base/${a.category}/${a.slug})`)
        .join('\n')
    : `- Check online category at ${SITE.url}/knowledge-base/${catKey}`
}
`
  })
  .join('\n')}

---
*Explore online at [NepaYatra Knowledge Base](${SITE.url}/knowledge-base)*
`
  }

  if (cleanPath.startsWith('/knowledge-base/')) {
    const segments = cleanPath.replace('/knowledge-base/', '').split('/')
    if (segments.length === 1) {
      const category = segments[0]
      const label = (KB_CATEGORY_LABELS as Record<string, string>)[category] || category
      const articles = await getKnowledgeBaseArticles(category)
      return `# Knowledge Base: ${label}

${articles
  .map(
    (a: KnowledgeBaseArticle) => `### [${a.title}](${SITE.url}/knowledge-base/${a.category}/${a.slug})
${a.summary || a.seo_description || ''}
`
  )
  .join('\n')}

---
*Back to [Knowledge Base](${SITE.url}/knowledge-base)*
`
    }

    if (segments.length >= 2) {
      const [category, slug] = segments
      const article = await getArticleByCategoryAndSlug(category, slug)
      if (!article) return null

      return `# ${article.title}

*Category: ${(KB_CATEGORY_LABELS as Record<string, string>)[article.category] || article.category}*

${article.summary ? `> ${article.summary}\n\n` : ''}
${article.content || article.seo_description || 'Detailed reference article.'}

---
*Source: [NepaYatra](${SITE.url}/knowledge-base/${article.category}/${article.slug})*
`
    }
  }

  // 9. Packages
  if (cleanPath === '/packages') {
    const pkgs = await getPackages()
    return `# Suggested Nepal Trip Circuits & Packages

${pkgs
  .map(
    (p: Package) => `### [${p.title}](${SITE.url}/packages/${p.slug})
- **Duration**: ${p.duration_days} Days
- **Difficulty**: ${p.difficulty || 'Moderate'}
- **Overview**: ${p.description || ''}
`
  )
  .join('\n')}

---
*Customize your own itinerary with the [NepaYatra Trip Planner](${SITE.url}/route-planner)*
`
  }

  if (cleanPath.startsWith('/packages/')) {
    const slug = cleanPath.replace('/packages/', '')
    const pkg = await getPackageBySlug(slug)
    if (!pkg) return null

    return `# ${pkg.title} — Suggested Itinerary

- **Duration**: ${pkg.duration_days} Days
- **Difficulty**: ${pkg.difficulty || 'Moderate'}
${pkg.price_inr_from ? `- **Price Guide**: From ₹${pkg.price_inr_from.toLocaleString('en-IN')}` : ''}

## Description
${pkg.description || 'Curated Nepal travel package.'}

${
  pkg.highlights && pkg.highlights.length > 0
    ? `## Highlights\n${pkg.highlights.map((h: string) => `- ${h}`).join('\n')}`
    : ''
}

---
*Build and customize this route in the [NepaYatra Trip Planner](${SITE.url}/route-planner).*
`
  }

  // 10. FAQ
  if (cleanPath === '/faq') {
    const faqs = await getFaqs()
    return `# Frequently Asked Questions — NepaYatra

${faqs
  .map(
    (f: any) => `### Q: ${f.question}
**A:** ${f.answer}
`
  )
  .join('\n')}

---
*Have more questions? Contact [NepaYatra](${SITE.url}/contact).*
`
  }

  // 11. Route Planner info
  if (cleanPath === '/route-planner') {
    return `# Nepal Route & Trip Planner — NepaYatra

Build your custom day-by-day Nepal itinerary based on:
1. **Origin & Entry Method**: Overland road via India border crossings or international flight to Kathmandu/Pokhara.
2. **Trip Dates & Duration**: Flexible days and seasons.
3. **Travel Group**: Solo, couple, family, or friends.
4. **Destinations**: Pick from top cultural, trekking, and nature destinations.
5. **Travel Style & Budget**: Budget, Comfort, or Premium tiers with cost estimates in NPR / INR.

Visit the interactive tool at [${SITE.url}/route-planner](${SITE.url}/route-planner) to build and save your itinerary in the URL.
`
  }

  // 12. About, Contact, Privacy
  if (cleanPath === '/about') {
    return `# About NepaYatra

NepaYatra is an independent digital travel guide dedicated to helping travelers plan authentic, well-prepared journeys to Nepal.

- **Website**: ${SITE.url}
- **Contact**: ${FOOTER_CONTACT.email}
- **Built by**: ${FOOTER_CONTACT.builtBy.name} (${FOOTER_CONTACT.builtBy.url})
`
  }

  if (cleanPath === '/contact') {
    return `# Contact NepaYatra

For feedback, questions, or partnerships:
- **Email**: ${FOOTER_CONTACT.email}
- **Instagram**: ${FOOTER_CONTACT.instagram}
- **Facebook**: ${FOOTER_CONTACT.facebook}
`
  }

  if (cleanPath === '/privacy') {
    return `# Privacy Policy — NepaYatra

NepaYatra respects traveler privacy. Trip plans created in the planner are stored in the URL query string or in secure database records when explicitly saved.

- **Website**: ${SITE.url}
- **Inquiries**: ${FOOTER_CONTACT.email}
`
  }

  return null
}
