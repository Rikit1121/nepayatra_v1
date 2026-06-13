import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE } from '@/lib/site-config'
import { SITE_BACKGROUNDS } from '@/lib/site-backgrounds'
import { SiteLogo } from '@/components/public/site-logo'

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
    title: 'Border Info',
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
    <footer className="relative overflow-hidden border-t text-white">
      {/* background2 image — /public/images/background2.jpg */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_BACKGROUNDS.footer}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[hsl(215,52%,6%)]/90" />
      </div>

      {/* Compact content */}
      <div className="relative z-10 container py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 font-display font-semibold text-white">
              <SiteLogo size={28} alt="" />
              <span>{settings.site_name}</span>
            </Link>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/55">
              {SITE.description}
            </p>
            <div className="mt-3 space-y-1 text-xs">
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 text-white/55 transition-colors hover:text-[hsl(var(--atlas-saffron))]">
                  <Mail className="h-3.5 w-3.5" />
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_phone && (
                <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2 text-white/55 transition-colors hover:text-[hsl(var(--atlas-saffron))]">
                  <Phone className="h-3.5 w-3.5" />
                  {settings.contact_phone}
                </a>
              )}
            </div>
            <Link
              href="/contact"
              className="mt-3 inline-flex text-xs font-semibold text-[hsl(var(--atlas-saffron))] transition-opacity hover:opacity-80"
            >
              Contact an advisor →
            </Link>
          </div>

          {/* Nav columns */}
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-white/50 transition-colors hover:text-[hsl(var(--atlas-saffron))]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/35">
            <span suppressHydrationWarning>© {new Date().getFullYear()} {settings.site_name}</span>
            <Link href="/about" className="hover:text-[hsl(var(--atlas-saffron))] transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-[hsl(var(--atlas-saffron))] transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-[hsl(var(--atlas-saffron))] transition-colors">Contact</Link>
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="rounded border border-white/10 p-1.5 text-white/40 transition-all hover:border-[hsl(var(--atlas-saffron))]/40 hover:text-[hsl(var(--atlas-saffron))]"
                >
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
