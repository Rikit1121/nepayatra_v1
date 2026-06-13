import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { SITE } from '@/lib/site-config'
import { getSiteSettings } from '@/lib/site-settings'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How NepaYatra collects, uses, and protects your personal information when you use our travel planning site or contact an advisor.',
  alternates: { canonical: `${SITE.url}/privacy` },
  openGraph: {
    title: 'Privacy Policy · NepaYatra',
    description: 'How we handle your personal information on NepaYatra.',
    url: `${SITE.url}/privacy`,
  },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  const lastUpdated = '13 June 2026'
  const contactEmail = settings.contact_email

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How ${settings.site_name} collects, uses, and protects information when you browse our site or get in touch.`}
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      </PageHero>

      <div className="container max-w-3xl space-y-10 py-12 md:py-16">
        <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <Section title="Who we are">
          <p>
            {settings.site_name} ({SITE.url}) is a travel planning resource for Indian travelers
            planning trips to Nepal. We provide guides, route tools, and advisor support. We are not
            a booking platform.
          </p>
          {contactEmail && (
            <p>
              For privacy-related questions, contact us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
              .
            </p>
          )}
        </Section>

        <Section title="Information we collect">
          <p>
            <strong className="font-medium text-foreground">When you browse the site</strong> — We do
            not require an account to read content. Our hosting and infrastructure may automatically
            log standard technical data such as your IP address, browser type, device type, and pages
            visited. This helps keep the site secure and running reliably.
          </p>
          <p>
            <strong className="font-medium text-foreground">When you contact us</strong> — If you
            use our contact form, we collect the details you submit: your name, email address,
            optional phone number, and message. We store these in our database so an advisor can
            respond.
          </p>
          <p>
            <strong className="font-medium text-foreground">Admin access</strong> — Staff who manage
            the site sign in through a separate admin area. Login uses secure session cookies managed
            by our authentication provider. Public visitors are not affected by this.
          </p>
          <p>
            <strong className="font-medium text-foreground">Maps</strong> — Interactive maps load
            map tiles from third-party providers (OpenStreetMap data via CARTO). Those providers may
            receive your IP address when tiles are requested, as is normal for map services.
          </p>
        </Section>

        <Section title="How we use your information">
          <ul className="list-disc space-y-2 pl-5">
            <li>To respond to questions and messages you send through the contact form</li>
            <li>To operate, maintain, and improve the website</li>
            <li>To protect the site against abuse, spam, and unauthorized access</li>
            <li>To comply with applicable legal obligations</li>
          </ul>
          <p>
            We do not sell your personal information. We do not use third-party advertising or
            analytics trackers on this site at the time of this policy.
          </p>
        </Section>

        <Section title="Legal basis (where applicable)">
          <p>
            If you are in a region with data protection laws (including India&apos;s Digital Personal
            Data Protection Act), we process contact form data based on your consent when you submit
            the form, and our legitimate interest in operating and securing the website when you
            browse it.
          </p>
        </Section>

        <Section title="How we store and protect data">
          <p>
            Contact submissions and site content are stored using Supabase, a hosted database service.
            Data is transmitted over encrypted connections (HTTPS). Access to admin tools and stored
            messages is restricted to authorized staff accounts.
          </p>
          <p>
            No method of transmission or storage is completely secure. We take reasonable steps to
            protect your information but cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="How long we keep data">
          <p>
            Contact form messages are kept for as long as needed to respond to you and for reasonable
            follow-up about your inquiry. We may retain records longer where required for legal,
            accounting, or dispute-resolution purposes, or delete them sooner when they are no longer
            needed.
          </p>
        </Section>

        <Section title="Sharing with third parties">
          <p>We share information only when necessary to run the site:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">Supabase</strong> — hosts our database
              and authentication for admin users
            </li>
            <li>
              <strong className="font-medium text-foreground">Hosting provider</strong> — serves the
              website (e.g. Vercel or similar, depending on deployment)
            </li>
            <li>
              <strong className="font-medium text-foreground">Map tile providers</strong> — serve map
              imagery when you use the map features
            </li>
          </ul>
          <p>
            We may also disclose information if required by law or to protect the rights, safety, or
            security of {settings.site_name}, our users, or others.
          </p>
        </Section>

        <Section title="Your choices and rights">
          <p>You can:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Choose not to submit the contact form if you prefer not to share personal details</li>
            <li>
              Ask us what information we hold about you, request correction, or ask us to delete
              contact messages you submitted
            </li>
            <li>Withdraw consent for future contact where processing is based on consent</li>
          </ul>
          <p>
            To exercise these rights, email us
            {contactEmail ? (
              <>
                {' '}
                at{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
              </>
            ) : (
              ' through our contact page'
            )}
            . We will respond within a reasonable time.
          </p>
        </Section>

        <Section title="Children">
          <p>
            This site is intended for adults planning travel. We do not knowingly collect personal
            information from children under 18. If you believe a child has submitted data through our
            contact form, please contact us so we can delete it.
          </p>
        </Section>

        <Section title="Links to other sites">
          <p>
            Our pages may link to external websites (for example, official border or tourism sites).
            We are not responsible for their privacy practices. Review their policies before sharing
            personal information with them.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the site after
            changes means you accept the updated policy.
          </p>
        </Section>

        <div className="border-t pt-8 text-sm text-muted-foreground">
          <p>
            Questions?{' '}
            <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">
              Contact us
            </Link>{' '}
            or read our{' '}
            <Link href="/about" className="font-medium text-foreground underline-offset-4 hover:underline">
              About
            </Link>{' '}
            page for more on how {settings.site_name} works.
          </p>
        </div>
      </div>
    </>
  )
}
