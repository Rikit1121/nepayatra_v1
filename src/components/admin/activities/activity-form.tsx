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
  createActivitySchema,
  updateActivitySchema,
  ACTIVITY_CATEGORIES,
  type CreateActivityFormValues,
  type UpdateActivityFormValues,
} from '@/lib/validations/admin'
import {
  createActivity,
  updateActivity,
} from '@/lib/actions/activities'
import type { Database } from '@/lib/supabase/types'

type Activity = Database['public']['Tables']['activities']['Row']
type DestinationOption = { id: string; name: string }

interface ActivityFormProps {
  activity?: Activity
  destinations: DestinationOption[]
}

function toLabel(val: string) {
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ActivityForm({
  activity,
  destinations,
}: ActivityFormProps) {
  const router = useRouter()
  const isEditing = !!activity

  type FormValues = CreateActivityFormValues | UpdateActivityFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateActivitySchema : createActivitySchema),
    defaultValues: activity
      ? {
          ...(activity as unknown as UpdateActivityFormValues),
          estimated_cost: activity.estimated_cost ?? ('' as unknown as number),
          duration: activity.duration ?? '',
          description: activity.description ?? '',
          source: activity.source ?? '',
          source_date: activity.source_date ?? '',
          public_visible: activity.public_visible !== false,
        }
      : {
          name: '',
          destination_id: destinations[0]?.id ?? '',
          category: 'sightseeing',
          estimated_cost: 1000,
          currency: 'NPR',
          duration: '',
          description: '',
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
      ? await updateActivity(values as UpdateActivityFormValues)
      : await createActivity(values as CreateActivityFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/activities')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: d.name,
  }))

  const categoryOptions = ACTIVITY_CATEGORIES.map((cat) => ({
    value: cat,
    label: toLabel(cat),
  }))

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="name"
            label="Activity Name"
            placeholder="e.g. Sunrise View from Sarangkot"
            required
          />
          <SelectField<FormValues>
            name="destination_id"
            label="Destination"
            required
            options={destinationOptions}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField<FormValues>
            name="category"
            label="Activity Category"
            required
            options={categoryOptions}
          />
          <TextField<FormValues>
            name="estimated_cost"
            label="Estimated Cost (NPR)"
            type="number"
            placeholder="e.g. 1500 (0 if free)"
          />
          <TextField<FormValues>
            name="duration"
            label="Typical Duration"
            placeholder="e.g. 2–3 hours / Half Day"
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
          name="description"
          label="Activity Description & Guidance"
          rows={3}
          placeholder="Entry fees, permits required, best time of day, guide requirements..."
        />

        <div className="rounded-lg border p-4 bg-muted/20">
          <SwitchField<FormValues>
            name="public_visible"
            label="Public Visible"
            description="When enabled, this activity is eligible for the public trip planner and cost engine."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create activity'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/activities')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
