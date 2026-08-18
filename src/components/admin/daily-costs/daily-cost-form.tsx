'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  TextField,
  TextareaField,
  SelectField,
  SwitchField,
} from '@/components/admin/form-field'
import {
  createDailyCostEstimateSchema,
  updateDailyCostEstimateSchema,
  DAILY_COST_TIERS,
  type CreateDailyCostEstimateFormValues,
  type UpdateDailyCostEstimateFormValues,
} from '@/lib/validations/admin'
import {
  createDailyCostEstimate,
  updateDailyCostEstimate,
} from '@/lib/actions/daily-costs'
import type { Database } from '@/lib/supabase/types'

type DailyCostEstimate = Database['public']['Tables']['daily_cost_estimates']['Row']
type DestinationOption = { id: string; name: string }

interface DailyCostFormProps {
  cost?: DailyCostEstimate
  destinations: DestinationOption[]
}

function toLabel(val: string) {
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function DailyCostForm({
  cost,
  destinations,
}: DailyCostFormProps) {
  const router = useRouter()
  const isEditing = !!cost

  type FormValues = CreateDailyCostEstimateFormValues | UpdateDailyCostEstimateFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateDailyCostEstimateSchema : createDailyCostEstimateSchema),
    defaultValues: cost
      ? {
          ...(cost as unknown as UpdateDailyCostEstimateFormValues),
          destination_id: cost.destination_id ?? '',
          estimated_daily_misc_cost: cost.estimated_daily_misc_cost ?? 0,
          notes: cost.notes ?? '',
          source: cost.source ?? '',
          source_date: cost.source_date ?? '',
          public_visible: cost.public_visible !== false,
        }
      : {
          region_name: 'All Nepal General',
          destination_id: '',
          travel_tier: 'comfort',
          estimated_daily_food_cost: 1800,
          estimated_daily_misc_cost: 400,
          currency: 'NPR',
          notes: '',
          source: '',
          source_date: '',
          public_visible: true,
        },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateDailyCostEstimate(values as UpdateDailyCostEstimateFormValues)
      : await createDailyCostEstimate(values as CreateDailyCostEstimateFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/daily-costs')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const destinationOptions = [
    { value: '', label: '— Region-Wide / General —' },
    ...destinations.map((d) => ({
      value: d.id,
      label: d.name,
    })),
  ]

  const tierOptions = DAILY_COST_TIERS.map((tier) => ({
    value: tier,
    label: toLabel(tier),
  }))

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="region_name"
            label="Region / Area Name"
            placeholder="e.g. Kathmandu Valley or Everest Trekking"
            required
          />
          <SelectField<FormValues>
            name="destination_id"
            label="Linked Destination (Optional)"
            options={destinationOptions}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField<FormValues>
            name="travel_tier"
            label="Travel Tier"
            required
            options={tierOptions}
          />
          <TextField<FormValues>
            name="estimated_daily_food_cost"
            label="Daily Food Cost (NPR/day)"
            type="number"
            placeholder="e.g. 1500"
            required
          />
          <TextField<FormValues>
            name="estimated_daily_misc_cost"
            label="Daily Misc / Water (NPR/day)"
            type="number"
            placeholder="e.g. 300"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="source"
            label="Source / Provenance"
            placeholder="e.g. Nepal Travel Budget Guide 2026"
          />
          <TextField<FormValues>
            name="source_date"
            label="Source Date"
            type="date"
          />
        </div>

        <TextareaField<FormValues>
          name="notes"
          label="Food & Expense Context"
          rows={3}
          placeholder="Local dal-bhat vs tourist cafes, mountain markup, bottled water guidelines..."
        />

        <div className="rounded-lg border p-4 bg-muted/20">
          <SwitchField<FormValues>
            name="public_visible"
            label="Public Visible"
            description="When enabled, this daily cost guideline is used by the public budget engine."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create daily cost guideline'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/daily-costs')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
