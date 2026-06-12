'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import {
  updateContactInquirySchema,
  type ActionResult,
  type UpdateContactInquiryFormValues,
} from '@/lib/validations/admin'

export async function updateContactInquiry(
  input: UpdateContactInquiryFormValues
): Promise<ActionResult> {
  const parsed = updateContactInquirySchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('contact_inquiries')
    .update(fields)
    .eq('id', id)

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidatePath('/admin/messages')
  revalidatePath(`/admin/messages/${id}`)

  return { success: true, data: undefined, message: 'Message updated.' }
}

export async function deleteContactInquiry(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: 'ID is required.' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('contact_inquiries').delete().eq('id', id)

  if (error) return { success: false, error: `Failed to delete: ${error.message}` }

  revalidatePath('/admin/messages')

  return { success: true, data: undefined, message: 'Message deleted.' }
}
