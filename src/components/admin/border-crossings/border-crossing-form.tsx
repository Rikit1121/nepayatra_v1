'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextField, TextareaField, SwitchField } from '@/components/admin/form-field'
import {
  createBorderCrossingSchema,
  updateBorderCrossingSchema,
  type CreateBorderCrossingFormValues,
  type UpdateBorderCrossingFormValues,
} from '@/lib/validations/admin'
import { createBorderCrossing, updateBorderCrossing } from '@/lib/actions/border-crossings'
import type { Database } from '@/lib/supabase/types'

type BorderCrossing = Database['public']['Tables']['border_crossings']['Row']

export function BorderCrossingForm({ crossing }: { crossing?: BorderCrossing }) {
  const router = useRouter()
  const isEditing = !!crossing

  type FormValues = CreateBorderCrossingFormValues | UpdateBorderCrossingFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateBorderCrossingSchema : createBorderCrossingSchema),
    defaultValues: crossing
      ? (crossing as unknown as UpdateBorderCrossingFormValues)
      : { crossing_name: '', india_side: '', nepal_side: '', featured: false },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateBorderCrossing(values as UpdateBorderCrossingFormValues)
      : await createBorderCrossing(values as CreateBorderCrossingFormValues)

    if (result.success) {
      toast.success(result.message)
      router.push('/admin/border-crossings')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues> name="crossing_name" label="Crossing name" placeholder="e.g. Raxaul–Birgunj" required />
          <TextField<FormValues> name="india_side" label="India side" placeholder="e.g. Raxaul, Bihar" required />
        </div>
        <TextField<FormValues> name="nepal_side" label="Nepal side" placeholder="e.g. Birgunj, Madhesh Province" required />
        <TextareaField<FormValues> name="description" label="Description" rows={4} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues> name="latitude" label="Latitude" placeholder="e.g. 27.0135" />
          <TextField<FormValues> name="longitude" label="Longitude" placeholder="e.g. 84.8706" />
        </div>
        <TextareaField<FormValues> name="operating_notes" label="Operating notes" rows={5} placeholder="Opening hours, document requirements, vehicle rules..." />
        <Separator />
        <SwitchField<FormValues> name="featured" label="Featured on Border Explorer page" description="Show this crossing prominently in the Border Explorer section." />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create crossing'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/border-crossings')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
