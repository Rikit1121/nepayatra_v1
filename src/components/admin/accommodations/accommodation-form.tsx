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
import { MultiImageUploadField } from '@/components/admin/multi-image-upload-field'
import {
  createAccommodationSchema,
  updateAccommodationSchema,
  ACCOMMODATION_TIERS,
  type CreateAccommodationFormValues,
  type UpdateAccommodationFormValues,
  type AccommodationImageFormValue,
} from '@/lib/validations/admin'
import {
  createAccommodation,
  updateAccommodation,
} from '@/lib/actions/accommodations'
import type { Database, AccommodationImage } from '@/lib/supabase/types'

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

  // Prepare initial images: if accommodation.images array exists use it;
  // otherwise fallback to accommodation.image_url if present
  const initialImages: AccommodationImageFormValue[] = React.useMemo(() => {
    if (!accommodation) return []
    if (Array.isArray(accommodation.images) && accommodation.images.length > 0) {
      return (accommodation.images as unknown as AccommodationImageFormValue[]).map((img, idx) => ({
        url: img.url,
        caption: img.caption ?? '',
        sort_order: img.sort_order ?? idx,
        is_primary: img.is_primary ?? idx === 0,
      }))
    }
    if (accommodation.image_url) {
      return [
        {
          url: accommodation.image_url,
          caption: '',
          sort_order: 0,
          is_primary: true,
        },
      ]
    }
    return []
  }, [accommodation])

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateAccommodationSchema : createAccommodationSchema),
    defaultValues: accommodation
      ? {
          ...(accommodation as unknown as UpdateAccommodationFormValues),
          source: accommodation.source ?? '',
          source_date: accommodation.source_date ?? '',
          notes: accommodation.notes ?? '',
          image_url: accommodation.image_url ?? '',
          images: initialImages,
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
          images: [],
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

        {/* Data Source & Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues>
            name="source"
            label="Data Source"
            description="Where did this price or accommodation information come from?"
            placeholder="e.g. Nepal Travel Budget Guide 2026, Hotel tariff card"
          />
          <TextField<FormValues>
            name="source_date"
            label="Source Date"
            type="date"
          />
        </div>

        {/* Website / Booking URL */}
        <div>
          <TextField<FormValues>
            name="website_url"
            label="Website / Booking URL (Optional)"
            placeholder="https://..."
            description="Official direct hotel booking or inquiry link. Displayed as 'Enquire / Book' to visitors."
          />
        </div>

        {/* Multi-Photo Accommodation Gallery */}
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
          <MultiImageUploadField
            fieldName="images"
            primaryUrlFieldName="image_url"
            bucket="site-assets"
            pathPrefix="accommodations/"
            label="Accommodation Photos"
            description="Upload multiple photos (JPG, PNG, WebP ≤ 5MB). Designate one as Primary to be shown first."
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
