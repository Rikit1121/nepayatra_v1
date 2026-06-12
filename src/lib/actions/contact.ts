'use server'

import { createPublicClient } from '@/lib/supabase/public-client'
import {
  contactInquirySchema,
  type ContactInquiryFormValues,
  type ContactActionResult,
} from '@/lib/validations/contact'

export async function submitContactInquiry(
  input: ContactInquiryFormValues
): Promise<ContactActionResult> {
  const parsed = contactInquirySchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the form and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = createPublicClient()
  const { error } = await supabase.from('contact_inquiries').insert({
    visitor_name: parsed.data.visitor_name,
    visitor_email: parsed.data.visitor_email,
    visitor_phone: parsed.data.visitor_phone || null,
    message: parsed.data.message,
  })

  if (error) {
    return { success: false, error: 'Something went wrong. Please try again in a moment.' }
  }

  return {
    success: true,
    message: "Thanks — your message is in. A local advisor will get back to you soon.",
  }
}
