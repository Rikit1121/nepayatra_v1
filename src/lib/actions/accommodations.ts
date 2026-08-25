/**
 * Server Actions — Accommodations (Phase 2A)
 * NepaYatra Admin CMS
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createAccommodationSchema,
  updateAccommodationSchema,
  type ActionResult,
  type CreateAccommodationFormValues,
  type UpdateAccommodationFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export async function createAccommodation(
  input: CreateAccommodationFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createAccommodationSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const payload = { ...parsed.data }
  if (Array.isArray(payload.images) && payload.images.length > 0) {
    const primary = payload.images.find((img) => img.is_primary) ?? payload.images[0]
    if (primary?.url && !payload.image_url) {
      payload.image_url = primary.url
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('accommodations')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('accommodations', 'max')
  revalidatePath('/admin/accommodations')
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Accommodation created successfully.' }
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export async function updateAccommodation(
  input: UpdateAccommodationFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateAccommodationSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id, ...fields } = parsed.data
  const payload = { ...fields }
  if (Array.isArray(payload.images) && payload.images.length > 0) {
    const primary = payload.images.find((img) => img.is_primary) ?? payload.images[0]
    if (primary?.url && !payload.image_url) {
      payload.image_url = primary.url
    }
  }

  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('accommodations')
    .update(payload)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('accommodations', 'max')
  revalidatePath('/admin/accommodations')
  revalidatePath(`/admin/accommodations/${id}/edit`)
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Accommodation updated successfully.' }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteAccommodation(id: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('accommodations').delete().eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('accommodations', 'max')
  revalidatePath('/admin/accommodations')
  revalidatePath('/route-planner')

  return { success: true, data: undefined, message: 'Accommodation deleted successfully.' }
}

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLIC VISIBILITY
// ─────────────────────────────────────────────────────────────

export async function toggleAccommodationVisibility(
  id: string,
  public_visible: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('accommodations')
    .update({ public_visible })
    .eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('accommodations', 'max')
  revalidatePath('/admin/accommodations')
  revalidatePath('/route-planner')

  return {
    success: true,
    data: undefined,
    message: public_visible ? 'Accommodation activated for public view.' : 'Accommodation hidden from public view.',
  }
}
