'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  TextField,
  TextareaField,
  SelectField,
  SwitchField,
  TagInputField,
  CoordinateField,
} from '@/components/admin/form-field'
import {
  createDestinationSchema,
  updateDestinationSchema,
  DESTINATION_CATEGORIES,
  NEPAL_PROVINCES,
  type CreateDestinationFormValues,
  type UpdateDestinationFormValues,
} from '@/lib/validations/admin'
import {
  createDestination,
  updateDestination,
} from '@/lib/actions/destinations'
import type { Database } from '@/lib/supabase/types'

type Destination = Database['public']['Tables']['destinations']['Row']

interface DestinationFormProps {
  destination?: Destination
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toLabel(val: string) {
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function DestinationForm({ destination }: DestinationFormProps) {
  const router = useRouter()
  const isEditing = !!destination

  type FormValues = CreateDestinationFormValues | UpdateDestinationFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateDestinationSchema : createDestinationSchema),
    defaultValues: destination
      ? {
          ...(destination as unknown as UpdateDestinationFormValues),
          best_season: destination.best_season ?? [],
          gallery_images: destination.gallery_images ?? [],
          featured: destination.featured ?? false,
        }
      : {
          name: '',
          slug: '',
          short_description: '',
          full_description: '',
          category: undefined,
          province: undefined,
          latitude: undefined as unknown as number,
          longitude: undefined as unknown as number,
          altitude_meters: null,
          best_season: [],
          featured: false,
          hero_image_url: '',
          gallery_images: [],
          seo_title: '',
          seo_description: '',
        },
  })

  const { handleSubmit, setValue, watch, formState: { isSubmitting } } = form

  // Auto-generate slug from name
  const name = watch('name')
  React.useEffect(() => {
    if (!isEditing) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 120)
      setValue('slug', slug)
    }
  }, [name, isEditing, setValue])

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateDestination(values as UpdateDestinationFormValues)
      : await createDestination(values as CreateDestinationFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/destinations')
      router.refresh()
    } else {
      toast.error(result.error)
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          form.setError(field as keyof FormValues, { message: errors[0] })
        })
      }
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Basic Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<FormValues>
              name="name"
              label="Destination name"
              placeholder="e.g. Pokhara"
              required
            />
            <TextField<FormValues>
              name="slug"
              label="URL slug"
              placeholder="e.g. pokhara"
              description="Auto-generated from name. Changing this breaks existing links."
              required
            />
          </div>
          <TextareaField<FormValues>
            name="short_description"
            label="Short description"
            placeholder="1–2 sentences for cards and search results (max 400 chars)"
            rows={3}
            required
          />
          <TextareaField<FormValues>
            name="full_description"
            label="Full description"
            placeholder="Full travel guide content for the destination detail page. Markdown supported."
            rows={10}
          />
        </div>

        <Separator />

        {/* Classification */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Classification
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField<FormValues>
              name="category"
              label="Category"
              options={DESTINATION_CATEGORIES.map((c) => ({ value: c, label: toLabel(c) }))}
              required
            />
            <SelectField<FormValues>
              name="province"
              label="Province"
              options={NEPAL_PROVINCES.map((p) => ({ value: p, label: toLabel(p) }))}
              required
            />
          </div>
          <TagInputField<FormValues>
            name="best_season"
            label="Best season (months)"
            placeholder="Type month and press Enter"
            suggestions={MONTHS}
          />
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Location
          </h3>
          <CoordinateField<FormValues>
            latName="latitude"
            lngName="longitude"
            altName="altitude_meters"
          />
        </div>

        <Separator />

        {/* Media */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Media
          </h3>
          <TextField<FormValues>
            name="hero_image_url"
            label="Hero image URL"
            placeholder="https://..."
          />
          <TagInputField<FormValues>
            name="gallery_images"
            label="Gallery image URLs"
            placeholder="Paste an image URL and press Enter"
          />
        </div>

        <Separator />

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            SEO
          </h3>
          <TextField<FormValues>
            name="seo_title"
            label="SEO title"
            placeholder="e.g. Pokhara Travel Guide for Indian Tourists"
            description="Max 70 characters"
          />
          <TextareaField<FormValues>
            name="seo_description"
            label="SEO description"
            placeholder="Brief description for search engines (max 160 chars)"
            rows={2}
          />
        </div>

        <Separator />

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Display
          </h3>
          <SwitchField<FormValues>
            name="featured"
            label="Featured on homepage"
            description="Show this destination in the Featured Destinations section on the homepage."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create destination'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/destinations')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
