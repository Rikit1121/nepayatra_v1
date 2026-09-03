'use client'

import * as React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/lib/supabase/types'
import { HelpCircle } from 'lucide-react'

const DEFAULT_FAQS: Faq[] = [
  {
    id: 'faq-visa-entry',
    question: 'What are the visa and passport entry requirements for Nepal?',
    answer:
      'Most international travelers can obtain a Visa on Arrival at Kathmandu Airport (TIA) or designated overland border checkpoints (15, 30, or 90 days). Indian citizens do not require a visa and can enter with a valid Passport or Voter ID Card. A quick online pre-arrival immigration form is recommended for all visitors.',
    category: 'entry_requirements',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-currency',
    question: 'What currencies, credit cards, and digital payments work in Nepal?',
    answer:
      'The official currency is the Nepalese Rupee (NPR). Major foreign currencies (USD, EUR, GBP) are easily exchanged at banks and licensed counters. International Visa and Mastercard credit/debit cards work at ATMs across Kathmandu, Pokhara, and Chitwan. Indian Rupees (INR ₹100 and lower notes) are accepted widely, and cross-border UPI QR payments are increasingly supported.',
    category: 'currency',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-vehicle',
    question: 'How do overland road trips and vehicle permits (Bhansar) work?',
    answer:
      'Visitors driving private cars or motorcycles across overland checkpoints (such as Sunauli, Raxaul, or Banbasa) can obtain an official vehicle customs permit (Bhansar) directly at the border gate by presenting the vehicle Registration Certificate (RC), driving license, and insurance.',
    category: 'transport',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-season',
    question: 'What is the best season to explore Nepal?',
    answer:
      'Autumn (September to November) brings crystal-clear mountain views and festival energy (Dashain & Tihar). Spring (March to May) features blooming rhododendrons and ideal climbing temperatures. Winter (December to February) is great for cultural cities and Chitwan wildlife safaris.',
    category: 'general',
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function FaqAccordion({ faqs = [] }: { faqs?: Faq[] }) {
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((faq) => (
          <Accordion key={faq.id} type="single" collapsible className="w-full">
            <AccordionItem
              value={faq.id}
              className="rounded-2xl border border-border bg-card px-5 py-1 shadow-sm transition-all hover:border-amber-500/40"
            >
              <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:no-underline py-4">
                <span className="flex items-start gap-2.5">
                  <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-1" />
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6.5 pb-4">
                <p className="whitespace-pre-line">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  )
}
