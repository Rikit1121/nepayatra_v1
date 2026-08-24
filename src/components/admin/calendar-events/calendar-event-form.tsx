'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextField, TextareaField, SelectField, SwitchField, TagInputField } from '@/components/admin/form-field'
import {
  createCalendarEventSchema,
  updateCalendarEventSchema,
  CALENDAR_EVENT_TYPES,
  type CreateCalendarEventFormValues,
  type UpdateCalendarEventFormValues,
} from '@/lib/validations/admin'
import { createCalendarEvent, updateCalendarEvent } from '@/lib/actions/calendar-events'
import { adToBs } from '@/lib/calendar/nepali-date'
import type { CalendarEvent } from '@/lib/supabase/types'

export function CalendarEventForm({ event }: { event?: CalendarEvent }) {
  const router = useRouter()
  const isEditing = !!event

  type FormValues = CreateCalendarEventFormValues | UpdateCalendarEventFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateCalendarEventSchema : createCalendarEventSchema),
    defaultValues: event
      ? {
          ...(event as unknown as UpdateCalendarEventFormValues),
          recommended_destinations: event.recommended_destinations ?? [],
        }
      : {
          title: '',
          slug: '',
          nepali_title: '',
          event_type: 'festival',
          start_date_ad: new Date().toISOString().split('T')[0],
          end_date_ad: new Date().toISOString().split('T')[0],
          start_date_bs: '',
          end_date_bs: '',
          year_ad: new Date().getFullYear(),
          year_bs: 2083,
          is_public_holiday: false,
          summary: '',
          description: '',
          travel_impact: '',
          recommended_destinations: [],
          featured: false,
          public_visible: true,
        },
  })

  const { handleSubmit, setValue, watch, formState: { isSubmitting } } = form

  const startDateAd = watch('start_date_ad')
  const endDateAd = watch('end_date_ad')

  // Auto-sync BS dates when AD dates change
  React.useEffect(() => {
    if (startDateAd && /^\d{4}-\d{2}-\d{2}$/.test(startDateAd)) {
      try {
        const bs = adToBs(startDateAd)
        setValue('start_date_bs', bs.formatted)
        setValue('year_ad', Number(startDateAd.split('-')[0]))
        setValue('year_bs', bs.year)
      } catch {
        // ignore
      }
    }
  }, [startDateAd, setValue])

  React.useEffect(() => {
    if (endDateAd && /^\d{4}-\d{2}-\d{2}$/.test(endDateAd)) {
      try {
        const bs = adToBs(endDateAd)
        setValue('end_date_bs', bs.formatted)
      } catch {
        // ignore
      }
    }
  }, [endDateAd, setValue])

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateCalendarEvent(values as UpdateCalendarEventFormValues)
      : await createCalendarEvent(values as CreateCalendarEventFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/calendar-events')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField<FormValues>
            name="title"
            label="Event Title"
            placeholder="e.g. Dashain Festival 2026"
            required
          />
          <TextField<FormValues>
            name="slug"
            label="Slug (URL identifier)"
            placeholder="e.g. dashain-2026"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField<FormValues>
            name="nepali_title"
            label="Nepali Title (Devanagari)"
            placeholder="e.g. दशैं / बडा दशैं २०८३"
          />
          <SelectField<FormValues>
            name="event_type"
            label="Event Type"
            options={CALENDAR_EVENT_TYPES.map((t) => ({
              label: t.replace('_', ' ').toUpperCase(),
              value: t,
            }))}
            required
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <TextField<FormValues>
            name="start_date_ad"
            label="Start Date (AD)"
            placeholder="YYYY-MM-DD"
            required
          />
          <TextField<FormValues>
            name="end_date_ad"
            label="End Date (AD)"
            placeholder="YYYY-MM-DD"
            required
          />
          <TextField<FormValues>
            name="start_date_bs"
            label="Start Date (BS)"
            placeholder="YYYY-MM-DD"
            required
          />
          <TextField<FormValues>
            name="end_date_bs"
            label="End Date (BS)"
            placeholder="YYYY-MM-DD"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField<FormValues>
            name="year_ad"
            label="Year (AD)"
            type="number"
            required
          />
          <TextField<FormValues>
            name="year_bs"
            label="Year (BS)"
            type="number"
            required
          />
        </div>

        <Separator />

        <TextareaField<FormValues>
          name="summary"
          label="Short Summary"
          placeholder="Brief 1-2 sentence description of this event"
          rows={2}
          required
        />

        <TextareaField<FormValues>
          name="description"
          label="Detailed Description / Cultural Background"
          placeholder="Detailed story, significance, and rituals"
          rows={4}
        />

        <TextareaField<FormValues>
          name="travel_impact"
          label="Travel Impact & Tips"
          placeholder="Closures, highway traffic, flight congestion, holiday notes"
          rows={3}
        />

        <TagInputField<FormValues>
          name="recommended_destinations"
          label="Recommended Destination Slugs"
          placeholder="e.g. kathmandu, pokhara, bhaktapur"
        />

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <SwitchField<FormValues> name="is_public_holiday" label="Official Public Holiday" />
          <SwitchField<FormValues> name="featured" label="Featured Event" />
          <SwitchField<FormValues> name="public_visible" label="Public Visible" />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/calendar-events')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
