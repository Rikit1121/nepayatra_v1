'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createDestinationConnectionSchema,
  updateDestinationConnectionSchema,
  type ActionResult,
  type CreateDestinationConnectionFormValues,
  type UpdateDestinationConnectionFormValues,
} from '@/lib/validations/admin'

export async function createRoute(
  input: CreateDestinationConnectionFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createDestinationConnectionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()

  // Check for duplicate connection
  const { data: existing } = await supabase
    .from('destination_connections')
    .select('id')
    .eq('from_destination_id', parsed.data.from_destination_id)
    .eq('to_destination_id', parsed.data.to_destination_id)
    .maybeSingle()

  if (existing) {
    return {
      success: false,
      error: 'A connection between these two destinations already exists.',
      fieldErrors: { to_destination_id: ['Connection already exists'] },
    }
  }

  const { data, error } = await supabase
    .from('destination_connections')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('routes', 'max')
  revalidatePath('/admin/routes')

  return { success: true, data, message: 'Route connection created.' }
}

export async function updateRoute(
  input: UpdateDestinationConnectionFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateDestinationConnectionSchema.safeParse(input)
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
    .from('destination_connections')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('routes', 'max')
  revalidatePath('/admin/routes')

  return { success: true, data, message: 'Route connection updated.' }
}

export async function deleteRoute(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('destination_connections').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('routes', 'max')
  revalidatePath('/admin/routes')

  return { success: true, data: undefined, message: 'Route connection deleted.' }
}
