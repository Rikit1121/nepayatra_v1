/**
 * Server Actions — Activities (Phase 2A)
 * NepaYatra Admin CMS
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createActivitySchema,
  updateActivitySchema,
  type ActionResult,
  type CreateActivityFormValues,
  type UpdateActivityFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export async function createActivity(
  input: CreateActivityFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createActivitySchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('activities')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('activities', 'max')
  revalidatePath('/admin/activities')
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Activity created successfully.' }
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export async function updateActivity(
  input: UpdateActivityFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateActivitySchema.safeParse(input)
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
    .from('activities')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('activities', 'max')
  revalidatePath('/admin/activities')
  revalidatePath(`/admin/activities/${id}/edit`)
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Activity updated successfully.' }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteActivity(id: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('activities').delete().eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('activities', 'max')
  revalidatePath('/admin/activities')
  revalidatePath('/route-planner')

  return { success: true, data: undefined, message: 'Activity deleted successfully.' }
}

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLIC VISIBILITY
// ─────────────────────────────────────────────────────────────

export async function toggleActivityVisibility(
  id: string,
  public_visible: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('activities')
    .update({ public_visible })
    .eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('activities', 'max')
  revalidatePath('/admin/activities')
  revalidatePath('/route-planner')

  return {
    success: true,
    data: undefined,
    message: public_visible ? 'Activity activated for public view.' : 'Activity hidden from public view.',
  }
}
