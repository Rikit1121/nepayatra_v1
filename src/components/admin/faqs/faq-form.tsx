'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextField, TextareaField, SelectField } from '@/components/admin/form-field'
import {
  createFaqSchema,
  updateFaqSchema,
  FAQ_CATEGORIES,
  type CreateFaqFormValues,
  type UpdateFaqFormValues,
} from '@/lib/validations/admin'
import { createFaq, updateFaq } from '@/lib/actions/faqs'
import type { Database } from '@/lib/supabase/types'

type Faq = Database['public']['Tables']['faqs']['Row']

export function FaqForm({ faq }: { faq?: Faq }) {
  const router = useRouter()
  const isEditing = !!faq

  type FormValues = CreateFaqFormValues | UpdateFaqFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateFaqSchema : createFaqSchema),
    defaultValues: faq
      ? (faq as unknown as UpdateFaqFormValues)
      : { category: undefined, question: '', answer: '', order_index: 0 },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updateFaq(values as UpdateFaqFormValues)
      : await createFaq(values as CreateFaqFormValues)

    if (result.success) { toast.success(result.message); router.push('/admin/faqs'); router.refresh() }
    else { toast.error(result.error) }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField<FormValues> name="category" label="Category" required
            options={FAQ_CATEGORIES.map((c) => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }))}
          />
          <TextField<FormValues> name="order_index" label="Order" placeholder="0" description="Lower numbers appear first within a category." />
        </div>
        <TextField<FormValues> name="question" label="Question" placeholder="e.g. Do I need a passport to enter Nepal from India?" required />
        <TextareaField<FormValues> name="answer" label="Answer" rows={8} placeholder="Clear, practical answer. You can use markdown." required />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create FAQ'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/faqs')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
