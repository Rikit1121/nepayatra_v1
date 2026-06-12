/**
 * Server Actions — Destinations
 * NepaYatra Admin CMS
 *
 * All mutations go through Server Actions for:
 *  1. Server-side Zod re-validation (never trust the client)
 *  2. Supabase server-client (service role) write
 *  3. ISR cache invalidation via revalidatePath / revalidateTag
 *
 * Pattern is identical for all entities — replace schema, table name,
 * and revalidation paths accordingly.
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createDestinationSchema,
  updateDestinationSchema,
  type ActionResult,
  type CreateDestinationFormValues,
  type UpdateDestinationFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export async function createDestination(
  input: CreateDestinationFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = createDestinationSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('destinations')
    .insert(parsed.data)
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        error: 'A destination with this slug already exists. Please choose a different slug.',
        fieldErrors: { slug: ['Slug already in use'] },
      }
    }
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('destinations')
  revalidatePath('/admin/destinations')
  revalidatePath(`/destinations/${data.slug}`)
  revalidatePath('/')

  return { success: true, data, message: 'Destination created successfully.' }
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export async function updateDestination(
  input: UpdateDestinationFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = updateDestinationSchema.safeParse(input)
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
    .from('destinations')
    .update(fields)
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return {
        success: false,
        error: 'A destination with this slug already exists.',
        fieldErrors: { slug: ['Slug already in use'] },
      }
    }
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('destinations')
  revalidatePath('/admin/destinations')
  revalidatePath(`/admin/destinations/${id}/edit`)
  revalidatePath(`/destinations/${data.slug}`)
  revalidatePath('/')

  return { success: true, data, message: 'Destination updated successfully.' }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteDestination(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'Destination ID is required.' }

  const supabase = await createServerClient()

  // Fetch slug before delete (for revalidation)
  const { data: existing } = await supabase
    .from('destinations')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('destinations').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidateTag('destinations')
  revalidatePath('/admin/destinations')
  if (existing?.slug) revalidatePath(`/destinations/${existing.slug}`)
  revalidatePath('/')

  return { success: true, data: undefined, message: 'Destination deleted.' }
}

// ─────────────────────────────────────────────────────────────
// TOGGLE FEATURED
// (Quick action — no full form validation needed)
// ─────────────────────────────────────────────────────────────

export async function toggleDestinationFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('destinations')
    .update({ featured })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidateTag('destinations')
  revalidatePath('/admin/destinations')
  revalidatePath('/')

  return { success: true, data: undefined }
}
