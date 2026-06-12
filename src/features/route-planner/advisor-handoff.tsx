'use client'

import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { whatsappLink, cn } from '@/lib/utils'
import { atlasCardPlanner } from '@/lib/design-system'
import type { PlannerAdvisor } from '@/lib/route-planner/types'

interface AdvisorHandoffProps {
  advisors: PlannerAdvisor[]
  message: string
}

export function AdvisorHandoff({ advisors, message }: AdvisorHandoffProps) {
  const withWhatsApp = advisors.filter((a) => a.whatsapp_number)

  return (
    <article
      className={cn(
        atlasCardPlanner,
        'border-[hsl(var(--atlas-blue))]/25 bg-[hsl(var(--atlas-blue))]/[0.04] p-5 sm:p-6'
      )}
    >
      <div>
        <h3 className="font-display text-lg font-bold">Have a local expert review your route</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Share your plan on WhatsApp — no booking, no pressure. An advisor can fine-tune transport,
          timing and border formalities.
        </p>
      </div>

      {withWhatsApp.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {withWhatsApp.map((advisor) => (
            <Button key={advisor.id} asChild variant="outline" className="gap-2 border-[hsl(var(--atlas-saffron))]/50 text-[hsl(var(--atlas-blue))] hover:bg-[hsl(var(--atlas-saffron))]/10">
              <a
                href={whatsappLink(advisor.whatsapp_number!, message)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-[hsl(var(--atlas-saffron))]" />
                WhatsApp {advisor.name.split(' ')[0]}
              </a>
            </Button>
          ))}
        </div>
      ) : (
        <Button asChild className="mt-4 shadow-sm">
          <Link href="/contact">
            Contact an advisor <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </article>
  )
}
