import Link from 'next/link'
import { Mountain, Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE } from '@/lib/site-config'
import { atlasFooterBand } from '@/lib/design-system'

const FOOTER_SECTIONS = [
  {
    title: 'Explore Nepal',
    links: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Route Planner', href: '/route-planner' },
      { label: 'Suggested Trips', href: '/packages' },
      { label: 'Religious Sites', href: '/destinations?category=religious' },
    ],
  },
  {
    title: 'Travel Guides',
    links: [
      { label: 'All Guides', href: '/guides' },
      { label: 'Knowledge Base', href: '/knowledge-base' },
      { label: 'Entry Requirements', href: '/knowledge-base/entry_requirements' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Border Information',
    links: [
      { label: 'All Crossings', href: '/border-crossings' },
      { label: 'Currency & UPI', href: '/knowledge-base/currency' },
      { label: 'Transport', href: '/knowledge-base/transport' },
      { label: 'Safety', href: '/knowledge-base/safety' },
    ],
  },
]

export async function SiteFooter() {
  const settings = await getSiteSettings()

  const socials = [
    { href: settings.social_facebook, icon: Facebook, label: 'Facebook' },
    { href: settings.social_instagram, icon: Instagram, label: 'Instagram' },
    { href: settings.social_youtube, icon: Youtube, label: 'YouTube' },
    { href: settings.social_twitter, icon: Twitter, label: 'X' },
  ].filter((s) => s.href)

  return (
    <footer className={atlasFooterBand}>
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display font-semibold text-[hsl(var(--atlas-snow))]">
              <Mountain className="h-6 w-6 text-[hsl(var(--atlas-saffron))]" />
              <span className="text-lg">{settings.site_name}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-[hsl(var(--atlas-snow))]/75">{SITE.description}</p>

            <div className="mt-4 space-y-1.5 text-sm">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 text-[hsl(var(--atlas-snow))]/75 hover:text-[hsl(var(--atlas-saffron))]"
                >
                  <Mail className="h-4 w-4" />
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2 text-[hsl(var(--atlas-snow))]/75 hover:text-[hsl(var(--atlas-saffron))]"
                >
                  <Phone className="h-4 w-4" />
                  {settings.contact_phone}
                </a>
              )}
            </div>

            <Link
              href="/contact"
              className="mt-4 inline-flex text-sm font-semibold text-[hsl(var(--atlas-saffron))] hover:underline"
            >
              Contact an advisor →
            </Link>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="font-display text-sm font-semibold text-[hsl(var(--atlas-snow))]">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--atlas-snow))]/70 hover:text-[hsl(var(--atlas-saffron))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[hsl(var(--atlas-snow))]/15 pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--atlas-snow))]/60">
            <span suppressHydrationWarning>
              © {new Date().getFullYear()} {settings.site_name}
            </span>
            <Link href="/about" className="hover:text-[hsl(var(--atlas-saffron))]">About</Link>
            <Link href="/contact" className="hover:text-[hsl(var(--atlas-saffron))]">Contact</Link>
          </div>

          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-[hsl(var(--atlas-snow))]/70 hover:text-[hsl(var(--atlas-saffron))]"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
