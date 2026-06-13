'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createBorderCrossingSchema,
  updateBorderCrossingSchema,
  type ActionResult,
  type CreateBorderCrossingFormValues,
  type UpdateBorderCrossingFormValues,
} from '@/lib/validations/admin'

export async function createBorderCrossing(
  input: CreateBorderCrossingFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createBorderCrossingSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('border_crossings')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('border-crossings', 'max')
  revalidatePath('/admin/border-crossings')
  revalidatePath('/border-crossings')

  return { success: true, data, message: 'Border crossing created.' }
}

export async function updateBorderCrossing(
  input: UpdateBorderCrossingFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateBorderCrossingSchema.safeParse(input)
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
    .from('border_crossings')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('border-crossings', 'max')
  revalidatePath('/admin/border-crossings')
  revalidatePath('/border-crossings')

  return { success: true, data, message: 'Border crossing updated.' }
}

export async function deleteBorderCrossing(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('border_crossings').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('border-crossings', 'max')
  revalidatePath('/admin/border-crossings')
  revalidatePath('/border-crossings')

  return { success: true, data: undefined, message: 'Border crossing deleted.' }
}

export async function toggleBorderCrossingFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('border_crossings')
    .update({ featured })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidateTag('border-crossings', 'max')
  revalidatePath('/admin/border-crossings')

  return { success: true, data: undefined }
}
