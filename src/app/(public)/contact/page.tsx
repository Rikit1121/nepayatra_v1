import type { Metadata } from 'next'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { ContactForm } from '@/components/public/contact-form'
import { getSiteSettings } from '@/lib/site-settings'
import { getActiveAdvisors } from '@/lib/supabase/queries'
import { whatsappLink } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact an Advisor',
  description:
    'Have a question about your Nepal trip? Send a message and a Nepal-based advisor will get back to you. No booking fees, no pressure.',
  alternates: { canonical: `${SITE.url}/contact` },
  openGraph: {
    title: 'Contact an Advisor · NepaYatra',
    description: 'Send a message and a Nepal-based advisor will get back to you.',
    url: `${SITE.url}/contact`,
  },
}

export default async function ContactPage() {
  const [settings, advisors] = await Promise.all([getSiteSettings(), getActiveAdvisors(3)])

  return (
    <>
      <PageHero
        eyebrow="We're here to help"
        title="Contact an advisor"
        description="Tell us what you're planning and where you're stuck. A Nepal-based advisor will get back to you — no booking fees, no pressure."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      </PageHero>

      <div className="container grid gap-10 py-10 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Contact info + advisors */}
        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-3 pt-6">
              <h2 className="text-base font-semibold">Other ways to reach us</h2>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {settings.contact_phone}
                </a>
              )}
              {settings.contact_whatsapp && (
                <a
                  href={whatsappLink(settings.contact_whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
              {settings.contact_address && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.contact_address}
                </p>
              )}
            </CardContent>
          </Card>

          {advisors.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="text-base font-semibold">Talk to an advisor directly</h2>
                {advisors.map((advisor) => (
                  <div key={advisor.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{advisor.name}</p>
                      {advisor.title && (
                        <p className="text-xs text-muted-foreground">{advisor.title}</p>
                      )}
                    </div>
                    {advisor.whatsapp_number && (
                      <a
                        href={whatsappLink(
                          advisor.whatsapp_number,
                          "Hi, I'm planning a Nepal trip and have a few questions."
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </>
  )
}
