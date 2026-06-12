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
  createKnowledgeBaseSchema,
  updateKnowledgeBaseSchema,
  KNOWLEDGE_BASE_CATEGORIES,
  type CreateKnowledgeBaseFormValues,
  type UpdateKnowledgeBaseFormValues,
} from '@/lib/validations/admin'
import { createKnowledgeBaseArticle, updateKnowledgeBaseArticle } from '@/lib/actions/knowledge-base'
import type { Database } from '@/lib/supabase/types'

type KBArticle = Database['public']['Tables']['knowledge_base']['Row']

export function KnowledgeBaseForm({ article }: { article?: KBArticle }) {
  const router = useRouter()
  const isEditing = !!article

  type FormValues = CreateKnowledgeBaseFormValues | UpdateKnowledgeBaseFormValues

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateKnowledgeBaseSchema : createKnowledgeBaseSchema),
    defaultValues: article
      ? { ...(article as unknown as UpdateKnowledgeBaseFormValues), tags: article.tags ?? [] }
      : { title: '', slug: '', category: undefined, summary: '', content: '', tags: [], featured: false },
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
      ? await updateKnowledgeBaseArticle(values as UpdateKnowledgeBaseFormValues)
      : await createKnowledgeBaseArticle(values as CreateKnowledgeBaseFormValues)

    if (result.success) { toast.success(result.message); router.push('/admin/knowledge-base'); router.refresh() }
    else { toast.error(result.error) }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Article Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<FormValues> name="title" label="Article title" required />
            <TextField<FormValues> name="slug" label="URL slug" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField<FormValues> name="category" label="Category" required
              options={KNOWLEDGE_BASE_CATEGORIES.map((c) => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }))}
            />
            <TextField<FormValues> name="reading_time_minutes" label="Reading time (minutes)" placeholder="e.g. 5" />
          </div>
          <TextareaField<FormValues> name="summary" label="Summary" rows={3} placeholder="1–2 sentences shown in article cards (max 500 chars)" required />
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</h3>
          <TextareaField<FormValues> name="content" label="Article content" rows={20} placeholder="Full article content. Markdown supported." required />
          <TagInputField<FormValues> name="tags" label="Tags" placeholder="Type a tag and press Enter" />
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SEO</h3>
          <TextField<FormValues> name="seo_title" label="SEO title" description="Max 70 characters" />
          <TextareaField<FormValues> name="seo_description" label="SEO description" rows={2} description="Max 160 characters" />
        </div>
        <Separator />
        <SwitchField<FormValues> name="featured" label="Featured in guides hub" description="Show on the homepage and Travel Guides hub." />
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create article'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/knowledge-base')} disabled={isSubmitting}>Cancel</Button>
        </div>
      </form>
    </FormProvider>
  )
}
