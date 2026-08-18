/**
 * Server Actions — Transport Options (Phase 2A)
 * NepaYatra Admin CMS
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createTransportOptionSchema,
  updateTransportOptionSchema,
  type ActionResult,
  type CreateTransportOptionFormValues,
  type UpdateTransportOptionFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export async function createTransportOption(
  input: CreateTransportOptionFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createTransportOptionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('transport_options')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('transport_options', 'max')
  revalidatePath('/admin/transports')
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Transport option created successfully.' }
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export async function updateTransportOption(
  input: UpdateTransportOptionFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateTransportOptionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('transport_options')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('transport_options', 'max')
  revalidatePath('/admin/transports')
  revalidatePath(`/admin/transports/${id}/edit`)
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Transport option updated successfully.' }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteTransportOption(id: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('transport_options').delete().eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('transport_options', 'max')
  revalidatePath('/admin/transports')
  revalidatePath('/route-planner')

  return { success: true, data: undefined, message: 'Transport option deleted successfully.' }
}

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLIC VISIBILITY
// ─────────────────────────────────────────────────────────────

export async function toggleTransportOptionVisibility(
  id: string,
  public_visible: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('transport_options')
    .update({ public_visible })
    .eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('transport_options', 'max')
  revalidatePath('/admin/transports')
  revalidatePath('/route-planner')

  return {
    success: true,
    data: undefined,
    message: public_visible ? 'Transport option activated for public view.' : 'Transport option hidden from public view.',
  }
}
