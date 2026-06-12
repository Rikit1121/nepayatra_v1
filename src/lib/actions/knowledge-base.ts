'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createKnowledgeBaseSchema,
  updateKnowledgeBaseSchema,
  type ActionResult,
  type CreateKnowledgeBaseFormValues,
  type UpdateKnowledgeBaseFormValues,
} from '@/lib/validations/admin'

export async function createKnowledgeBaseArticle(
  input: CreateKnowledgeBaseFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = createKnowledgeBaseSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .insert(parsed.data)
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        error: 'An article with this slug already exists.',
        fieldErrors: { slug: ['Slug already in use'] },
      }
    }
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('knowledge-base')
  revalidatePath('/admin/knowledge-base')
  revalidatePath(`/knowledge-base/${data.slug}`)
  revalidatePath('/guides')

  return { success: true, data, message: 'Article created.' }
}

export async function updateKnowledgeBaseArticle(
  input: UpdateKnowledgeBaseFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = updateKnowledgeBaseSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .update(fields)
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        error: 'An article with this slug already exists.',
        fieldErrors: { slug: ['Slug already in use'] },
      }
    }
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('knowledge-base')
  revalidatePath('/admin/knowledge-base')
  revalidatePath(`/knowledge-base/${data.slug}`)
  revalidatePath('/guides')

  return { success: true, data, message: 'Article updated.' }
}

export async function deleteKnowledgeBaseArticle(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { data: existing } = await supabase
    .from('knowledge_base')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('knowledge_base').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('knowledge-base')
  revalidatePath('/admin/knowledge-base')
  if (existing?.slug) revalidatePath(`/knowledge-base/${existing.slug}`)
  revalidatePath('/guides')

  return { success: true, data: undefined, message: 'Article deleted.' }
}

export async function toggleKnowledgeBaseFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('knowledge_base').update({ featured }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidateTag('knowledge-base')
  revalidatePath('/admin/knowledge-base')

  return { success: true, data: undefined }
}
