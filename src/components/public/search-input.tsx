'use client'

import * as React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  placeholder?: string
  /** URL param key to write the query to. Defaults to "q". */
  paramKey?: string
  label?: string
}

/** URL-synced, debounced search input for hub pages. */
export function SearchInput({
  placeholder = 'Search…',
  paramKey = 'q',
  label = 'Search',
}: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(paramKey, value)
    else params.delete(paramKey)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, 300)

  return (
    <div className="relative">
      <label htmlFor="hub-search" className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="hub-search"
        type="search"
        placeholder={placeholder}
        defaultValue={searchParams.get(paramKey) ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
