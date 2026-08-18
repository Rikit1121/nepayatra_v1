/**
 * Server Actions — Daily Cost Estimates (Phase 2A)
 * NepaYatra Admin CMS
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createDailyCostEstimateSchema,
  updateDailyCostEstimateSchema,
  type ActionResult,
  type CreateDailyCostEstimateFormValues,
  type UpdateDailyCostEstimateFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export async function createDailyCostEstimate(
  input: CreateDailyCostEstimateFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createDailyCostEstimateSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed. Please check your inputs.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('daily_cost_estimates')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('daily_cost_estimates', 'max')
  revalidatePath('/admin/daily-costs')
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Daily cost estimate created successfully.' }
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export async function updateDailyCostEstimate(
  input: UpdateDailyCostEstimateFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateDailyCostEstimateSchema.safeParse(input)
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
    .from('daily_cost_estimates')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('daily_cost_estimates', 'max')
  revalidatePath('/admin/daily-costs')
  revalidatePath(`/admin/daily-costs/${id}/edit`)
  revalidatePath('/route-planner')

  return { success: true, data, message: 'Daily cost estimate updated successfully.' }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export async function deleteDailyCostEstimate(id: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('daily_cost_estimates').delete().eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('daily_cost_estimates', 'max')
  revalidatePath('/admin/daily-costs')
  revalidatePath('/route-planner')

  return { success: true, data: undefined, message: 'Daily cost estimate deleted successfully.' }
}

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLIC VISIBILITY
// ─────────────────────────────────────────────────────────────

export async function toggleDailyCostEstimateVisibility(
  id: string,
  public_visible: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('daily_cost_estimates')
    .update({ public_visible })
    .eq('id', id)

  if (error) {
    return { success: false, error: `Database error: ${error.message}` }
  }

  revalidateTag('daily_cost_estimates', 'max')
  revalidatePath('/admin/daily-costs')
  revalidatePath('/route-planner')

  return {
    success: true,
    data: undefined,
    message: public_visible ? 'Daily cost estimate activated for public view.' : 'Daily cost estimate hidden from public view.',
  }
}
