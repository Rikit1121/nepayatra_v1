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
import { ImageUploadField } from '@/components/admin/image-upload-field'
import {
  createAccommodationSchema,
  updateAccommodationSchema,
  ACCOMMODATION_TIERS,
  type CreateAccommodationFormValues,
  type UpdateAccommodationFormValues,
} from '@/lib/validations/admin'
import {
  createAccommodation,
  updateAccommodation,
} from '@/lib/actions/accommodations'
import type { Database } from '@/lib/supabase/types'

type Accommodation = Database['public']['Tables']['accommodations']['Row']
type DestinationOption = { id: string; name: string }

interface AccommodationFormProps {
  accommodation?: Accommodation
  destinations: DestinationOption[]
}

function toLabel(val: string) {
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AccommodationForm({
  accommodation,
  destinations,
}: AccommodationFormProps) {
  const router = useRouter()
  const isEditing = !!accommodation

  type FormValues = CreateAccommodationFormValues | UpdateAccommodationFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateAccommodationSchema : createAccommodationSchema),
    defaultValues: accommodation
      ? {
          ...(accommodation as unknown as UpdateAccommodationFormValues),
          source: accommodation.source ?? '',
          source_date: accommodation.source_date ?? '',
          notes: accommodation.notes ?? '',
          image_url: accommodation.image_url ?? '',
          website_url: accommodation.website_url ?? '',
          public_visible: accommodation.public_visible !== false,
        }
      : {
          name: '',
          destination_id: destinations[0]?.id ?? '',
          tier: 'mid_range',
          estimated_price_min: 2500,
          estimated_price_max: 5000,
          currency: 'NPR',
          source: '',
          source_date: '',
          notes: '',
          image_url: '',
          website_url: '',
          public_visible: true,
        },
  })

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateAccommodation(values as UpdateAccommodationFormValues)
      : await createAccommodation(values as CreateAccommodationFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/accommodations')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: d.name,
  }))

  const tierOptions = ACCOMMODATION_TIERS.map((tier) => ({
    value: tier,
    label: toLabel(tier),
  }))

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="name"
            label="Hotel / Accommodation Name"
            placeholder="e.g. Hotel Tibet Heritage"
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
            name="tier"
            label="Accommodation Tier"
            required
            options={tierOptions}
          />
          <TextField<FormValues>
            name="estimated_price_min"
            label="Estimated Min Price (NPR)"
            type="number"
            placeholder="e.g. 2000"
            required
          />
          <TextField<FormValues>
            name="estimated_price_max"
            label="Estimated Max Price (NPR)"
            type="number"
            placeholder="e.g. 4500"
            required
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

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="website_url"
            label="Website / Booking URL (Optional)"
            placeholder="https://..."
          />
          <ImageUploadField
            fieldName="image_url"
            label="Featured Image (Optional)"
            bucket="site-assets"
            pathPrefix="accommodations/"
          />
        </div>

        <TextareaField<FormValues>
          name="notes"
          label="Internal / Reference Notes"
          rows={3}
          placeholder="Amenities, seasonal rates, tea-house context, location details..."
        />

        <div className="rounded-lg border p-4 bg-muted/20">
          <SwitchField<FormValues>
            name="public_visible"
            label="Public Visible"
            description="When enabled, this accommodation is eligible for the public trip planner and cost engine."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create accommodation'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/accommodations')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
