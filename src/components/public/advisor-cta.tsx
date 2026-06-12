import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { whatsappLink, cn } from '@/lib/utils'
import { getActiveAdvisors } from '@/lib/supabase/queries'
import { atlasCardPlanner, atlasDisplayMd } from '@/lib/design-system'

interface AdvisorCtaProps {
  heading?: string
  subheading?: string
  limit?: number
  context?: string
}

/**
 * Trust-gated advisor section. Rendered at the END of content flows.
 * Language is "talk to" / "ask" — never "book".
 */
export async function AdvisorCta({
  heading = 'Still have questions? Talk to someone who knows Nepal.',
  subheading = 'Our Nepal-based advisors help Indian travelers finalise their plans. No booking fees. No pressure.',
  limit = 3,
  context,
}: AdvisorCtaProps) {
  const advisors = await getActiveAdvisors(limit)
  if (advisors.length === 0) return null

  const baseMessage = context
    ? `Hi, I'm planning a Nepal trip (${context}) and would like some advice.`
    : `Hi, I'm planning a Nepal trip and would like some advice.`

  return (
    <section className="border-t">
      <div className="bg-[hsl(var(--atlas-blue))] px-4 py-10 text-center text-[hsl(var(--atlas-snow))] md:py-12">
        <div className="container mx-auto max-w-2xl">
          <h2 className={cn(atlasDisplayMd, 'text-[hsl(var(--atlas-snow))]')}>{heading}</h2>
          <p className="mt-3 text-[hsl(var(--atlas-snow))]/85">{subheading}</p>
        </div>
      </div>

      <div className="container py-10 md:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((advisor) => (
            <article key={advisor.id} className={cn(atlasCardPlanner, 'p-6 text-center')}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[hsl(var(--atlas-stone))]/25 bg-[hsl(var(--atlas-mist))] text-lg font-semibold text-[hsl(var(--atlas-blue))]">
                {advisor.name.charAt(0)}
              </div>
              <p className="mt-3 font-display font-semibold">{advisor.name}</p>
              {advisor.title && (
                <p className="text-sm text-muted-foreground">{advisor.title}</p>
              )}
              {advisor.languages.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {advisor.languages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="secondary"
                      className="border-[hsl(var(--atlas-blue))]/15 bg-[hsl(var(--atlas-blue))]/5 text-xs text-[hsl(var(--atlas-blue))]"
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}
              {advisor.whatsapp_number && (
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 w-full border-[hsl(var(--atlas-blue))]/30 text-[hsl(var(--atlas-blue))] hover:bg-[hsl(var(--atlas-blue))]/5"
                >
                  <a
                    href={whatsappLink(advisor.whatsapp_number, baseMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message on WhatsApp
                  </a>
                </Button>
              )}
            </article>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/contact"
            className="text-sm font-semibold text-[hsl(var(--atlas-blue))] hover:underline"
          >
            Or send us a message →
          </Link>
        </div>
      </div>
    </section>
  )
}
