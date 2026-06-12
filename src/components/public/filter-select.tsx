'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterSelectProps {
  paramKey: string
  placeholder: string
  options: { value: string; label: string }[]
  label?: string
}

const ALL_VALUE = '__all__'

/** URL-synced filter dropdown for hub pages. */
export function FilterSelect({ paramKey, placeholder, options, label }: FilterSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = searchParams.get(paramKey) ?? ALL_VALUE

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== ALL_VALUE) params.set(paramKey, value)
    else params.delete(paramKey)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[200px]" aria-label={label ?? placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
