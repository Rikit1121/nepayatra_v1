/**
 * Server Actions — Domestic Flights (Phase 2A)
 * NepaYatra Admin CMS
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createDomesticFlightSchema,
  updateDomesticFlightSchema,
  type ActionResult,
  type CreateDomesticFlightFormValues,
  type UpdateDomesticFlightFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export async function createDomesticFlight(
  input: CreateDomesticFlightFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createDomesticFlightSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('domestic_flights')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('domestic_flights', 'max')
  revalidatePath('/admin/domestic-flights')
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Domestic flight route created successfully.' }
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export async function updateDomesticFlight(
  input: UpdateDomesticFlightFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateDomesticFlightSchema.safeParse(input)
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
    .from('domestic_flights')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('domestic_flights', 'max')
  revalidatePath('/admin/domestic-flights')
  revalidatePath(`/admin/domestic-flights/${id}/edit`)
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Domestic flight route updated successfully.' }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteDomesticFlight(id: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('domestic_flights').delete().eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('domestic_flights', 'max')
  revalidatePath('/admin/domestic-flights')
  revalidatePath('/route-planner')

  return { success: true, data: undefined, message: 'Domestic flight route deleted successfully.' }
}

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLIC VISIBILITY
// ─────────────────────────────────────────────────────────────

export async function toggleDomesticFlightVisibility(
  id: string,
  public_visible: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('domestic_flights')
    .update({ public_visible })
    .eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('domestic_flights', 'max')
  revalidatePath('/admin/domestic-flights')
  revalidatePath('/route-planner')

  return {
    success: true,
    data: undefined,
    message: public_visible ? 'Flight route activated for public view.' : 'Flight route hidden from public view.',
  }
}
