'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextField, TextareaField, SelectField, SwitchField, TagInputField } from '@/components/admin/form-field'
import {
  createTravelAlertSchema,
  updateTravelAlertSchema,
  ALERT_SEVERITIES,
  type CreateTravelAlertFormValues,
  type UpdateTravelAlertFormValues,
} from '@/lib/validations/admin'
import { createTravelAlert, updateTravelAlert } from '@/lib/actions/travel-alerts'
import type { Database } from '@/lib/supabase/types'
import { format } from 'date-fns'

type TravelAlert = Database['public']['Tables']['travel_alerts']['Row']

function toDatetimeLocal(iso?: string | null) {
  if (!iso) return ''
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm")
}

export function TravelAlertForm({ alert }: { alert?: TravelAlert }) {
  const router = useRouter()
  const isEditing = !!alert

  type FormValues = CreateTravelAlertFormValues | UpdateTravelAlertFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateTravelAlertSchema : createTravelAlertSchema),
    defaultValues: alert
      ? {
          ...(alert as unknown as UpdateTravelAlertFormValues),
          starts_at: toDatetimeLocal(alert.starts_at),
          expires_at: toDatetimeLocal(alert.expires_at),
          affected_regions: alert.affected_regions ?? [],
        }
      : {
          title: '',
          message: '',
          severity: undefined,
          starts_at: toDatetimeLocal(new Date().toISOString()),
          expires_at: '',
          affected_regions: [],
          active: true,
        },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateTravelAlert(values as UpdateTravelAlertFormValues)
      : await createTravelAlert(values as CreateTravelAlertFormValues)

    if (result.success) { toast.success(result.message); router.push('/admin/travel-alerts'); router.refresh() }
    else { toast.error(result.error) }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TextField<FormValues> name="title" label="Alert title" placeholder="e.g. Landslide risk on Prithvi Highway" required />
        <TextareaField<FormValues> name="message" label="Full message" rows={5} placeholder="Detailed alert message for travelers..." required />
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField<FormValues> name="severity" label="Severity" required
            options={ALERT_SEVERITIES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          />
          <TextField<FormValues> name="starts_at" label="Starts at" type="datetime-local" required />
          <TextField<FormValues> name="expires_at" label="Expires at (optional)" type="datetime-local" />
        </div>
        <TagInputField<FormValues> name="affected_regions" label="Affected regions" placeholder="e.g. gandaki, prithvi-highway" description="Tag each affected region slug and press Enter." />
        <Separator />
        <SwitchField<FormValues> name="active" label="Active — visible to visitors" description="Inactive alerts are stored but not shown on the public site." />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create alert'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/travel-alerts')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
