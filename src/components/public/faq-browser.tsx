'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaqAccordion } from '@/components/public/faq-accordion'
import { EmptyState } from '@/components/public/states'
import { FAQ_CATEGORY_LABELS } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import type { Faq } from '@/lib/supabase/types'

export function FaqBrowser({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<string>('all')

  const categories = React.useMemo(() => {
    const present = new Set(faqs.map((f) => f.category))
    return Object.entries(FAQ_CATEGORY_LABELS).filter(([value]) => present.has(value as Faq['category']))
  }, [faqs])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs.filter((faq) => {
      if (category !== 'all' && faq.category !== category) return false
      if (!q) return true
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    })
  }, [faqs, query, category])

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-xl">
        <label htmlFor="faq-search" className="sr-only">
          Search FAQs
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="faq-search"
          type="search"
          placeholder="Search questions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
        <Button
          variant={category === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategory('all')}
          role="tab"
          aria-selected={category === 'all'}
        >
          All
        </Button>
        {categories.map(([value, label]) => (
          <Button
            key={value}
            variant={category === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(value)}
            role="tab"
            aria-selected={category === value}
            className={cn(category === value && 'pointer-events-none')}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8 max-w-3xl">
        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No questions match"
            description="Try a different search term or category."
          />
        ) : (
          <FaqAccordion faqs={filtered} />
        )}
      </div>
    </div>
  )
}
