'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  createCalendarEventSchema,
  updateCalendarEventSchema,
  type ActionResult,
  type CreateCalendarEventFormValues,
  type UpdateCalendarEventFormValues,
} from '@/lib/validations/admin'

export async function createCalendarEvent(
  input: CreateCalendarEventFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createCalendarEventSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('calendar_events')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('calendar_events', 'max')
  revalidatePath('/calendar')
  revalidatePath('/admin/calendar-events')

  return { success: true, data, message: 'Calendar event created.' }
}

export async function updateCalendarEvent(
  input: UpdateCalendarEventFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = updateCalendarEventSchema.safeParse(input)
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
    .from('calendar_events')
    .update(fields)
    .eq('id', id)
    .select('id')
    .single()

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('calendar_events', 'max')
  revalidatePath('/calendar')
  revalidatePath('/admin/calendar-events')

  return { success: true, data, message: 'Calendar event updated.' }
}

export async function deleteCalendarEvent(id: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('calendar_events').delete().eq('id', id)

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('calendar_events', 'max')
  revalidatePath('/calendar')
  revalidatePath('/admin/calendar-events')

  return { success: true, data: undefined, message: 'Calendar event deleted.' }
}

export async function toggleCalendarEventVisibility(
  id: string,
  public_visible: boolean
): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('calendar_events')
    .update({ public_visible })
    .eq('id', id)

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('calendar_events', 'max')
  revalidatePath('/calendar')
  revalidatePath('/admin/calendar-events')

  return {
    success: true,
    data: undefined,
    message: public_visible ? 'Event is now public.' : 'Event is hidden.',
  }
}
