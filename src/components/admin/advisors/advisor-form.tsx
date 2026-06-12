'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextField, TextareaField, SwitchField, TagInputField } from '@/components/admin/form-field'
import {
  createAdvisorSchema,
  updateAdvisorSchema,
  type CreateAdvisorFormValues,
  type UpdateAdvisorFormValues,
} from '@/lib/validations/admin'
import { createAdvisor, updateAdvisor } from '@/lib/actions/advisors'
import type { Database } from '@/lib/supabase/types'

type Advisor = Database['public']['Tables']['advisors']['Row']

export function AdvisorForm({ advisor }: { advisor?: Advisor }) {
  const router = useRouter()
  const isEditing = !!advisor

  type FormValues = CreateAdvisorFormValues | UpdateAdvisorFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateAdvisorSchema : createAdvisorSchema),
    defaultValues: advisor
      ? { ...(advisor as unknown as UpdateAdvisorFormValues), languages: advisor.languages ?? [] }
      : { name: '', languages: [], active: true },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateAdvisor(values as UpdateAdvisorFormValues)
      : await createAdvisor(values as CreateAdvisorFormValues)

    if (result.success) { toast.success(result.message); router.push('/admin/advisors'); router.refresh() }
    else { toast.error(result.error) }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues> name="name" label="Full name" required />
          <TextField<FormValues> name="title" label="Title / role" placeholder="e.g. Nepal Trekking Specialist" />
        </div>
        <TextareaField<FormValues> name="bio" label="Bio" rows={5} placeholder="Brief bio about the advisor's Nepal expertise..." />
        <TagInputField<FormValues> name="languages" label="Languages spoken" placeholder="e.g. Hindi, English" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues> name="whatsapp_number" label="WhatsApp number" placeholder="+977XXXXXXXXXX" description="International format with country code." />
          <TextField<FormValues> name="phone_number" label="Phone number" placeholder="+977XXXXXXXXXX" />
        </div>
        <TextField<FormValues> name="photo_url" label="Photo URL" placeholder="https://..." />
        <Separator />
        <SwitchField<FormValues> name="active" label="Active — visible to visitors" description="Only active advisors appear on the public advisors page." />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create advisor'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/advisors')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
