import type { Metadata } from 'next'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { FaqBrowser } from '@/components/public/faq-browser'
import { EmptyState } from '@/components/public/states'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { getFaqs } from '@/lib/supabase/queries'
import { SITE } from '@/lib/site-config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers to the questions Indian travelers ask most about Nepal — passports, visas, currency, UPI, SIM cards, safety and transport.',
  alternates: { canonical: `${SITE.url}/faq` },
  openGraph: {
    title: 'FAQ · NepaYatra',
    description: 'Answers to the questions Indian travelers ask most about visiting Nepal.',
    url: `${SITE.url}/faq`,
  },
}

export default async function FaqPage() {
  const faqs = await getFaqs()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      {faqs.length > 0 && <JsonLd data={jsonLd} />}

      <PageHero
        eyebrow="Quick answers"
        title="Frequently asked questions"
        description="The practical things first-time Indian visitors ask us. Can't find your question? Ask an advisor."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
      </PageHero>

      <div className="container py-10">
        {faqs.length === 0 ? (
          <EmptyState title="No FAQs published yet" description="Check back soon." />
        ) : (
          <FaqBrowser faqs={faqs} />
        )}
      </div>

      <AdvisorCta context="a question not covered in the FAQ" />
    </>
  )
}
