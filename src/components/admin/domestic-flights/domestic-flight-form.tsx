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
  TagInputField,
} from '@/components/admin/form-field'
import {
  createDomesticFlightSchema,
  updateDomesticFlightSchema,
  type CreateDomesticFlightFormValues,
  type UpdateDomesticFlightFormValues,
} from '@/lib/validations/admin'
import {
  createDomesticFlight,
  updateDomesticFlight,
} from '@/lib/actions/domestic-flights'
import type { Database } from '@/lib/supabase/types'

type DomesticFlight = Database['public']['Tables']['domestic_flights']['Row']
type DestinationOption = { id: string; name: string }

interface DomesticFlightFormProps {
  flight?: DomesticFlight
  destinations: DestinationOption[]
}

export function DomesticFlightForm({
  flight,
  destinations,
}: DomesticFlightFormProps) {
  const router = useRouter()
  const isEditing = !!flight

  type FormValues = CreateDomesticFlightFormValues | UpdateDomesticFlightFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateDomesticFlightSchema : createDomesticFlightSchema),
    defaultValues: flight
      ? {
          ...(flight as unknown as UpdateDomesticFlightFormValues),
          origin_destination_id: flight.origin_destination_id ?? '',
          destination_destination_id: flight.destination_destination_id ?? '',
          duration_minutes: flight.duration_minutes ?? ('' as unknown as number),
          airlines: flight.airlines ?? [],
          flight_notes: flight.flight_notes ?? '',
          source: flight.source ?? '',
          source_date: flight.source_date ?? '',
          public_visible: flight.public_visible !== false,
        }
      : {
          origin_city: 'Kathmandu',
          origin_airport_code: 'KTM',
          origin_destination_id: '',
          destination_city: 'Pokhara',
          destination_airport_code: 'PKR',
          destination_destination_id: '',
          estimated_cost_min: 4500,
          estimated_cost_max: 8500,
          currency: 'NPR',
          duration_minutes: 25,
          airlines: ['Buddha Air', 'Yeti Airlines'],
          flight_notes: '',
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
      ? await updateDomesticFlight(values as UpdateDomesticFlightFormValues)
      : await createDomesticFlight(values as CreateDomesticFlightFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/domestic-flights')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const destinationOptions = [
    { value: '', label: '— None (Standalone Airport) —' },
    ...destinations.map((d) => ({
      value: d.id,
      label: d.name,
    })),
  ]

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="rounded-lg border p-4 bg-muted/10 space-y-4">
          <h3 className="text-sm font-semibold">Origin Airport</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField<FormValues>
              name="origin_city"
              label="Origin City"
              placeholder="e.g. Kathmandu"
              required
            />
            <TextField<FormValues>
              name="origin_airport_code"
              label="Airport Code (IATA)"
              placeholder="KTM"
              required
            />
            <SelectField<FormValues>
              name="origin_destination_id"
              label="Linked Destination (Optional)"
              options={destinationOptions}
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-muted/10 space-y-4">
          <h3 className="text-sm font-semibold">Destination Airport</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField<FormValues>
              name="destination_city"
              label="Destination City"
              placeholder="e.g. Pokhara"
              required
            />
            <TextField<FormValues>
              name="destination_airport_code"
              label="Airport Code (IATA)"
              placeholder="PKR"
              required
            />
            <SelectField<FormValues>
              name="destination_destination_id"
              label="Linked Destination (Optional)"
              options={destinationOptions}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField<FormValues>
            name="estimated_cost_min"
            label="Estimated Min Fare (NPR)"
            type="number"
            placeholder="e.g. 4500"
            required
          />
          <TextField<FormValues>
            name="estimated_cost_max"
            label="Estimated Max Fare (NPR)"
            type="number"
            placeholder="e.g. 8500"
            required
          />
          <TextField<FormValues>
            name="duration_minutes"
            label="Flight Duration (Minutes)"
            type="number"
            placeholder="e.g. 25"
          />
        </div>

        <TagInputField<FormValues>
          name="airlines"
          label="Airlines Operating This Route"
          placeholder="Type airline name and press Enter (e.g. Buddha Air, Yeti Airlines)"
        />

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
          name="flight_notes"
          label="Flight / Operational Notes"
          rows={3}
          placeholder="Weather sensitivity, mountain views, baggage limits, flight frequency..."
        />

        <div className="rounded-lg border p-4 bg-muted/20">
          <SwitchField<FormValues>
            name="public_visible"
            label="Public Visible"
            description="When enabled, this flight route is eligible for the public trip planner and cost engine."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create domestic flight'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/domestic-flights')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
