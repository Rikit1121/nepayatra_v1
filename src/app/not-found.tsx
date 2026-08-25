import Link from 'next/link'
import {
  Compass,
  MapPin,
  Calendar,
  BookOpen,
  Route as RouteIcon,
  Home,
  FileText,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  atlasHeroGradient,
  atlasSectionEyebrow,
  atlasDisplayMd,
  atlasBodyLg,
  atlasCardPlanner,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

const RECOVERY_LINKS = [
  {
    label: 'Home',
    href: '/',
    description: 'Explore Nepal overview, featured spots & entry guides',
    icon: Home,
  },
  {
    label: 'Trip Planner',
    href: '/route-planner',
    description: 'Build your customized day-by-day Nepal itinerary',
    icon: Compass,
  },
  {
    label: 'Destinations',
    href: '/destinations',
    description: 'Browse Kathmandu, Pokhara, Chitwan, Mustang & more',
    icon: MapPin,
  },
  {
    label: 'Festival & Travel Calendar',
    href: '/calendar',
    description: 'Check 2026/2083 festivals, holidays, and AD/BS dates',
    icon: Calendar,
  },
  {
    label: 'Travel Guides',
    href: '/guides',
    description: 'Practical guides for Indian & international travelers',
    icon: BookOpen,
  },
  {
    label: 'India–Nepal Border Crossings',
    href: '/border-crossings',
    description: 'Raxaul, Sunauli, Jogbani, Kakarbhitta details & advice',
    icon: RouteIcon,
  },
  {
    label: 'Frequently Asked Questions',
    href: '/faq',
    description: 'Answers about visas, currency, transport, and safety',
    icon: HelpCircle,
  },
  {
    label: 'HTML / XML Sitemap',
    href: '/sitemap.xml',
    description: 'Complete index of all public pages on NepaYatra',
    icon: FileText,
  },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header Banner */}
      <section className={cn('border-b px-4 py-12 text-center sm:py-16', atlasHeroGradient)}>
        <div className="container mx-auto max-w-3xl">
          <p className={atlasSectionEyebrow}>HTTP 404 · Page Not Found</p>
          <h1 className={cn('mt-2 text-3xl font-extrabold sm:text-4xl', atlasDisplayMd)}>
            We couldn&apos;t find that page
          </h1>
          <p className={cn('mt-3 text-muted-foreground', atlasBodyLg)}>
            The page you are looking for may have been moved, renamed, or does not exist.
            Use the links below to navigate back to key sections of NepaYatra.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="font-semibold shadow-sm">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" className="font-semibold">
              <Link href="/route-planner">Plan a Trip</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recovery Links Grid */}
      <main className="container mx-auto flex-1 px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Popular Sections to Explore
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {RECOVERY_LINKS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    atlasCardPlanner,
                    'group flex items-start gap-3.5 p-4 rounded-xl border bg-card text-left transition-all hover:border-[hsl(var(--atlas-blue))]/40 hover:shadow-md'
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))] transition-colors group-hover:bg-[hsl(var(--atlas-blue))] group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-[hsl(var(--atlas-blue))] transition-colors">
                      {item.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
