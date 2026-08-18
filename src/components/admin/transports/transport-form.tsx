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
  createTransportOptionSchema,
  updateTransportOptionSchema,
  TRANSPORT_TYPES,
  type CreateTransportOptionFormValues,
  type UpdateTransportOptionFormValues,
} from '@/lib/validations/admin'
import {
  createTransportOption,
  updateTransportOption,
} from '@/lib/actions/transport-options'
import type { Database } from '@/lib/supabase/types'

type TransportOption = Database['public']['Tables']['transport_options']['Row']
type DestinationOption = { id: string; name: string }

interface TransportFormProps {
  transport?: TransportOption
  destinations: DestinationOption[]
}

function toLabel(val: string) {
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function TransportForm({
  transport,
  destinations,
}: TransportFormProps) {
  const router = useRouter()
  const isEditing = !!transport

  type FormValues = CreateTransportOptionFormValues | UpdateTransportOptionFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateTransportOptionSchema : createTransportOptionSchema),
    defaultValues: transport
      ? {
          ...(transport as unknown as UpdateTransportOptionFormValues),
          duration_hours: transport.duration_hours ?? ('' as unknown as number),
          duration_text: transport.duration_text ?? '',
          route_notes: transport.route_notes ?? '',
          source: transport.source ?? '',
          source_date: transport.source_date ?? '',
          public_visible: transport.public_visible !== false,
        }
      : {
          origin_destination_id: destinations[0]?.id ?? '',
          destination_destination_id: destinations[1]?.id ?? destinations[0]?.id ?? '',
          transport_type: 'tourist_bus',
          estimated_cost_min: 1000,
          estimated_cost_max: 2000,
          currency: 'NPR',
          duration_hours: undefined,
          duration_text: '',
          route_notes: '',
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
      ? await updateTransportOption(values as UpdateTransportOptionFormValues)
      : await createTransportOption(values as CreateTransportOptionFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/transports')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: d.name,
  }))

  const typeOptions = TRANSPORT_TYPES.map((type) => ({
    value: type,
    label: toLabel(type),
  }))

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField<FormValues>
            name="origin_destination_id"
            label="Origin Destination"
            required
            options={destinationOptions}
          />
          <SelectField<FormValues>
            name="destination_destination_id"
            label="Target Destination"
            required
            options={destinationOptions}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField<FormValues>
            name="transport_type"
            label="Transport Type"
            required
            options={typeOptions}
          />
          <TextField<FormValues>
            name="estimated_cost_min"
            label="Estimated Min Cost (NPR)"
            type="number"
            placeholder="e.g. 1200"
            required
          />
          <TextField<FormValues>
            name="estimated_cost_max"
            label="Estimated Max Cost (NPR)"
            type="number"
            placeholder="e.g. 2500"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="duration_hours"
            label="Approximate Duration (Hours)"
            type="number"
            step="0.5"
            placeholder="e.g. 6.5"
          />
          <TextField<FormValues>
            name="duration_text"
            label="Duration Teaser / Text"
            placeholder="e.g. 6–8 hrs scenic highway"
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
          name="route_notes"
          label="Route / Operational Notes"
          rows={3}
          placeholder="Boarding spots (e.g. Gongabu Bus Park), road conditions, comfort advice..."
        />

        <div className="rounded-lg border p-4 bg-muted/20">
          <SwitchField<FormValues>
            name="public_visible"
            label="Public Visible"
            description="When enabled, this transport option is eligible for the public trip planner and cost engine."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create transport option'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/transports')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
