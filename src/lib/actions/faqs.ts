'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createFaqSchema,
  updateFaqSchema,
  type ActionResult,
  type CreateFaqFormValues,
  type UpdateFaqFormValues,
} from '@/lib/validations/admin'

export async function createFaq(
  input: CreateFaqFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createFaqSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('faqs')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('faqs')
  revalidatePath('/admin/faqs')
  revalidatePath('/faq')

  return { success: true, data, message: 'FAQ created.' }
}

export async function updateFaq(
  input: UpdateFaqFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateFaqSchema.safeParse(input)
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
    .from('faqs')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('faqs')
  revalidatePath('/admin/faqs')
  revalidatePath('/faq')

  return { success: true, data, message: 'FAQ updated.' }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('faqs')
  revalidatePath('/admin/faqs')
  revalidatePath('/faq')

  return { success: true, data: undefined, message: 'FAQ deleted.' }
}
