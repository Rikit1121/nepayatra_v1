'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createAdvisorSchema,
  updateAdvisorSchema,
  type ActionResult,
  type CreateAdvisorFormValues,
  type UpdateAdvisorFormValues,
} from '@/lib/validations/admin'

export async function createAdvisor(
  input: CreateAdvisorFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createAdvisorSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('advisors')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('advisors', 'max')
  revalidatePath('/admin/advisors')
  revalidatePath('/advisors')
  revalidatePath('/')

  return { success: true, data, message: 'Advisor created.' }
}

export async function updateAdvisor(
  input: UpdateAdvisorFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateAdvisorSchema.safeParse(input)
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
    .from('advisors')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('advisors', 'max')
  revalidatePath('/admin/advisors')
  revalidatePath('/advisors')
  revalidatePath('/')

  return { success: true, data, message: 'Advisor updated.' }
}

export async function deleteAdvisor(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('advisors').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('advisors', 'max')
  revalidatePath('/admin/advisors')
  revalidatePath('/advisors')
  revalidatePath('/')

  return { success: true, data: undefined, message: 'Advisor deleted.' }
}

export async function toggleAdvisorActive(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('advisors').update({ active }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidateTag('advisors', 'max')
  revalidatePath('/admin/advisors')
  revalidatePath('/advisors')

  return { success: true, data: undefined }
}
