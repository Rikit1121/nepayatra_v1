'use client'

import * as React from 'react'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { ActionResult } from '@/lib/validations/admin'

interface FeaturedToggleProps {
  id: string
  checked: boolean
  onToggle: (id: string, value: boolean) => Promise<ActionResult>
  label?: string
}

export function FeaturedToggle({ id, checked, onToggle, label = 'Featured' }: FeaturedToggleProps) {
  const [optimistic, setOptimistic] = React.useState(checked)
  const [isPending, setIsPending] = React.useState(false)

  async function handleChange(value: boolean) {
    setOptimistic(value)
    setIsPending(true)
    try {
      const result = await onToggle(id, value)
      if (!result.success) {
        setOptimistic(!value)
        toast.error(result.error)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={optimistic}
        onCheckedChange={handleChange}
        disabled={isPending}
        aria-label={label}
      />
    </div>
  )
}
