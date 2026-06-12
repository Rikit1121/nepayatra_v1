'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextField, TextareaField, SelectField } from '@/components/admin/form-field'
import {
  createDestinationConnectionSchema,
  updateDestinationConnectionSchema,
  type CreateDestinationConnectionFormValues,
  type UpdateDestinationConnectionFormValues,
} from '@/lib/validations/admin'
import { createRoute, updateRoute } from '@/lib/actions/routes'
import type { Database } from '@/lib/supabase/types'

type Connection = Database['public']['Tables']['destination_connections']['Row']
type Destination = Pick<Database['public']['Tables']['destinations']['Row'], 'id' | 'name'>

export function RouteForm({ connection, destinations }: { connection?: Connection; destinations: Destination[] }) {
  const router = useRouter()
  const isEditing = !!connection

  type FormValues = CreateDestinationConnectionFormValues | UpdateDestinationConnectionFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateDestinationConnectionSchema : createDestinationConnectionSchema),
    defaultValues: connection
      ? (connection as unknown as UpdateDestinationConnectionFormValues)
      : { from_destination_id: '', to_destination_id: '' },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateRoute(values as UpdateDestinationConnectionFormValues)
      : await createRoute(values as CreateDestinationConnectionFormValues)

    if (result.success) { toast.success(result.message); router.push('/admin/routes'); router.refresh() }
    else { toast.error(result.error) }
  }

  const destOptions = destinations.map((d) => ({ value: d.id, label: d.name }))

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField<FormValues> name="from_destination_id" label="From destination" required options={destOptions} />
          <SelectField<FormValues> name="to_destination_id" label="To destination" required options={destOptions} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField<FormValues> name="distance_km" label="Distance (km)" placeholder="e.g. 200" />
          <TextField<FormValues> name="travel_time_hours" label="Travel time (hours)" placeholder="e.g. 6.5" />
          <TextField<FormValues> name="recommended_transport" label="Recommended transport" placeholder="e.g. Bus / Private car" />
        </div>
        <TextareaField<FormValues> name="route_notes" label="Route notes" rows={4} placeholder="Road conditions, passes, seasonal closures, alternatives..." />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create connection'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/routes')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
