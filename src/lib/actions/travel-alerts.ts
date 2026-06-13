'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createTravelAlertSchema,
  updateTravelAlertSchema,
  type ActionResult,
  type CreateTravelAlertFormValues,
  type UpdateTravelAlertFormValues,
} from '@/lib/validations/admin'

export async function createTravelAlert(
  input: CreateTravelAlertFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createTravelAlertSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('travel_alerts')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('travel-alerts', 'max')
  revalidatePath('/admin/travel-alerts')
  revalidatePath('/')

  return { success: true, data, message: 'Travel alert created.' }
}

export async function updateTravelAlert(
  input: UpdateTravelAlertFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateTravelAlertSchema.safeParse(input)
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
    .from('travel_alerts')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('travel-alerts', 'max')
  revalidatePath('/admin/travel-alerts')
  revalidatePath('/')

  return { success: true, data, message: 'Travel alert updated.' }
}

export async function deleteTravelAlert(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('travel_alerts').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('travel-alerts', 'max')
  revalidatePath('/admin/travel-alerts')
  revalidatePath('/')

  return { success: true, data: undefined, message: 'Alert deleted.' }
}

export async function toggleTravelAlertActive(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('travel_alerts').update({ active }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidateTag('travel-alerts', 'max')
  revalidatePath('/admin/travel-alerts')
  revalidatePath('/')

  return { success: true, data: undefined }
}
