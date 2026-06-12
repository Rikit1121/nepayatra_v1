'use client'

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextField, TextareaField, SelectField, SwitchField, ListInputField } from '@/components/admin/form-field'
import {
  createPackageSchema,
  updatePackageSchema,
  PACKAGE_DIFFICULTIES,
  type CreatePackageFormValues,
  type UpdatePackageFormValues,
} from '@/lib/validations/admin'
import { createPackage, updatePackage } from '@/lib/actions/packages'
import type { Database } from '@/lib/supabase/types'

type Package = Database['public']['Tables']['packages']['Row']

export function PackageForm({ pkg }: { pkg?: Package }) {
  const router = useRouter()
  const isEditing = !!pkg

  type FormValues = CreatePackageFormValues | UpdatePackageFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updatePackageSchema : createPackageSchema),
    defaultValues: pkg
      ? (pkg as unknown as UpdatePackageFormValues)
      : { title: '', slug: '', duration_days: 7, highlights: [], includes: [], excludes: [], difficulty: undefined, featured: false },
  })

  const { handleSubmit, setValue, watch, formState: { isSubmitting } } = form
  const title = watch('title')

  React.useEffect(() => {
    if (!isEditing) {
      setValue('slug', title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 120))
    }
  }, [title, isEditing, setValue])

  async function onSubmit(values: FormValues) {
    const result = isEditing
      ? await updatePackage(values as UpdatePackageFormValues)
      : await createPackage(values as CreatePackageFormValues)

    if (result.success) { toast.success(result.message); router.push('/admin/packages'); router.refresh() }
    else { toast.error(result.error) }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<FormValues> name="title" label="Package title" required />
            <TextField<FormValues> name="slug" label="URL slug" required />
          </div>
          <TextareaField<FormValues> name="description" label="Description" rows={6} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField<FormValues> name="duration_days" label="Duration (days)" placeholder="e.g. 10" required />
            <TextField<FormValues> name="price_inr_from" label="Price from (₹)" placeholder="e.g. 25000" />
            <SelectField<FormValues> name="difficulty" label="Difficulty" required
              options={PACKAGE_DIFFICULTIES.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Highlights & Inclusions</h3>
          <ListInputField<FormValues> name="highlights" label="Highlights" placeholder="Add highlight and press Enter" />
          <ListInputField<FormValues> name="includes" label="What's included" placeholder="Add included item" />
          <ListInputField<FormValues> name="excludes" label="What's excluded" placeholder="Add excluded item" />
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Media & SEO</h3>
          <TextField<FormValues> name="hero_image_url" label="Hero image URL" placeholder="https://..." />
          <TextField<FormValues> name="seo_title" label="SEO title" description="Max 70 characters" />
          <TextareaField<FormValues> name="seo_description" label="SEO description" rows={2} description="Max 160 characters" />
        </div>
        <Separator />
        <SwitchField<FormValues> name="featured" label="Featured on homepage" />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create package'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/packages')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
