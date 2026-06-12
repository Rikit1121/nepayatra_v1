import { z } from 'zod'

export const contactInquirySchema = z.object({
  visitor_name: z
    .string()
    .min(2, 'Please enter your name')
    .max(200, 'Name is too long'),
  visitor_email: z.string().email('Please enter a valid email address'),
  visitor_phone: z
    .string()
    .max(30, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Please write at least a sentence so we can help')
    .max(2000, 'Message is too long'),
})

export type ContactInquiryFormValues = z.infer<typeof contactInquirySchema>

export type ContactActionResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
