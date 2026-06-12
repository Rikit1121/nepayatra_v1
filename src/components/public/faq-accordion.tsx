'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/lib/supabase/types'

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="whitespace-pre-line leading-relaxed">{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
