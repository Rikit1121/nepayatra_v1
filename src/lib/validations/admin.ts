/**
 * Zod Validation Schemas — Admin CMS
 * NepaYatra
 *
 * All form inputs for the admin panel are validated against these schemas.
 * Each schema is used in:
 *  - React Hook Form (client-side validation)
 *  - Server Actions (server-side re-validation before DB write)
 *
 * Naming convention:
 *  - createXSchema  → used for "new" forms (no id required)
 *  - updateXSchema  → extends create with required id field
 *  - XFormValues    → TypeScript type inferred from createXSchema
 */

import { z } from 'zod'

// ─────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────

const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .max(120, 'Slug must be under 120 characters')
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Slug must be lowercase letters, numbers, and hyphens only')

const urlSchema = z
  .string()
  .url('Must be a valid URL')
  .or(z.literal(''))
  .optional()
  .nullable()

const imageUrlSchema = z
  .string()
  .min(1, 'Image URL is required')
  .or(z.literal(''))
  .optional()
  .nullable()

const seoTitleSchema = z
  .string()
  .max(70, 'SEO title should be under 70 characters for best results')
  .optional()
  .nullable()

const seoDescriptionSchema = z
  .string()
  .max(160, 'SEO description should be under 160 characters for best results')
  .optional()
  .nullable()

// ─────────────────────────────────────────────────────────────
// ENUM LITERALS — mirror the Postgres ENUMs
// ─────────────────────────────────────────────────────────────

export const DESTINATION_CATEGORIES = [
  'cultural',
  'heritage',
  'adventure',
  'trekking',
  'wildlife',
  'religious',
  'scenic',
] as const

export const NEPAL_PROVINCES = [
  'koshi',
  'madhesh',
  'bagmati',
  'gandaki',
  'lumbini',
  'karnali',
  'sudurpashchim',
] as const

export const PACKAGE_DIFFICULTIES = ['easy', 'moderate', 'hard', 'expert'] as const

export const FAQ_CATEGORIES = [
  'entry_requirements',
  'visa',
  'transport',
  'safety',
  'currency',
  'culture',
  'health',
  'general',
] as const

export const ALERT_SEVERITIES = ['info', 'warning', 'danger'] as const

export const KNOWLEDGE_BASE_CATEGORIES = [
  'entry_requirements',
  'transport',
  'safety',
  'culture',
  'currency',
  'health',
  'trekking',
  'wildlife',
  'general',
] as const

export const CONTACT_STATUSES = ['new', 'read', 'replied', 'closed'] as const

// ─────────────────────────────────────────────────────────────
// 1. DESTINATION SCHEMA
// ─────────────────────────────────────────────────────────────

export const createDestinationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be under 200 characters'),

  slug: slugSchema,

  short_description: z
    .string()
    .min(20, 'Short description must be at least 20 characters')
    .max(400, 'Short description must be under 400 characters'),

  full_description: z.string().optional().nullable(),

  category: z.enum(DESTINATION_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),

  province: z.enum(NEPAL_PROVINCES, {
    errorMap: () => ({ message: 'Please select a province' }),
  }),

  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(26.0, 'Latitude must be within Nepal (26.0 – 31.0)')
    .max(31.0, 'Latitude must be within Nepal (26.0 – 31.0)'),

  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(79.0, 'Longitude must be within Nepal (79.0 – 89.0)')
    .max(89.0, 'Longitude must be within Nepal (79.0 – 89.0)'),

  altitude_meters: z
    .number({ invalid_type_error: 'Altitude must be a number' })
    .int('Altitude must be a whole number')
    .min(0, 'Altitude cannot be negative')
    .optional()
    .nullable(),

  best_season: z
    .array(z.string())
    .min(1, 'Select at least one season month'),

  featured: z.boolean().default(false),

  hero_image_url: imageUrlSchema,

  gallery_images: z.array(z.string()).default([]),

  seo_title: seoTitleSchema,

  seo_description: seoDescriptionSchema,
})

export const updateDestinationSchema = createDestinationSchema.extend({
  id: z.string().uuid('Invalid destination ID'),
})

export type CreateDestinationFormValues = z.infer<typeof createDestinationSchema>
export type UpdateDestinationFormValues = z.infer<typeof updateDestinationSchema>

// ─────────────────────────────────────────────────────────────
// 2. BORDER CROSSING SCHEMA
// ─────────────────────────────────────────────────────────────

export const createBorderCrossingSchema = z.object({
  crossing_name: z
    .string()
    .min(3, 'Crossing name must be at least 3 characters')
    .max(200, 'Crossing name must be under 200 characters'),

  india_side: z
    .string()
    .min(2, 'India side location is required')
    .max(200, 'India side location must be under 200 characters'),

  nepal_side: z
    .string()
    .min(2, 'Nepal side location is required')
    .max(200, 'Nepal side location must be under 200 characters'),

  description: z.string().optional().nullable(),

  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(26.0, 'Latitude must be within Nepal (26.0 – 31.0)')
    .max(31.0, 'Latitude must be within Nepal (26.0 – 31.0)')
    .optional()
    .nullable(),

  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(79.0, 'Longitude must be within Nepal (79.0 – 89.0)')
    .max(89.0, 'Longitude must be within Nepal (79.0 – 89.0)')
    .optional()
    .nullable(),

  operating_notes: z.string().optional().nullable(),

  featured: z.boolean().default(false),
})

export const updateBorderCrossingSchema = createBorderCrossingSchema.extend({
  id: z.string().uuid(),
})

export type CreateBorderCrossingFormValues = z.infer<typeof createBorderCrossingSchema>
export type UpdateBorderCrossingFormValues = z.infer<typeof updateBorderCrossingSchema>

// ─────────────────────────────────────────────────────────────
// 3. DESTINATION CONNECTION (Route) SCHEMA
// ─────────────────────────────────────────────────────────────

const destinationConnectionBaseSchema = z.object({
  from_destination_id: z
    .string({ required_error: 'Please select the starting destination' })
    .uuid('Invalid destination ID'),

  to_destination_id: z
    .string({ required_error: 'Please select the ending destination' })
    .uuid('Invalid destination ID'),

  distance_km: z
    .number({ invalid_type_error: 'Distance must be a number' })
    .positive('Distance must be positive')
    .optional()
    .nullable(),

  travel_time_hours: z
    .number({ invalid_type_error: 'Travel time must be a number' })
    .positive('Travel time must be positive')
    .optional()
    .nullable(),

  recommended_transport: z
    .string()
    .max(200, 'Transport description must be under 200 characters')
    .optional()
    .nullable(),

  route_notes: z.string().optional().nullable(),
})

const differentEndpoints = (data: { from_destination_id: string; to_destination_id: string }) =>
  data.from_destination_id !== data.to_destination_id

const differentEndpointsError = {
  message: 'From and To destinations cannot be the same',
  path: ['to_destination_id'],
}

export const createDestinationConnectionSchema = destinationConnectionBaseSchema.refine(
  differentEndpoints,
  differentEndpointsError
)

export const updateDestinationConnectionSchema = destinationConnectionBaseSchema
  .extend({ id: z.string().uuid() })
  .refine(differentEndpoints, differentEndpointsError)

export type CreateDestinationConnectionFormValues = z.infer<typeof createDestinationConnectionSchema>
export type UpdateDestinationConnectionFormValues = z.infer<typeof updateDestinationConnectionSchema>

// ─────────────────────────────────────────────────────────────
// 4. PACKAGE SCHEMA
// ─────────────────────────────────────────────────────────────

export const createPackageSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(300, 'Title must be under 300 characters'),

  slug: slugSchema,

  description: z.string().optional().nullable(),

  duration_days: z
    .number({ invalid_type_error: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration must be under 365 days'),

  price_inr_from: z
    .number({ invalid_type_error: 'Price must be a number' })
    .int('Price must be a whole number')
    .positive('Price must be positive')
    .optional()
    .nullable(),

  highlights: z
    .array(z.string().min(1, 'Highlight cannot be empty'))
    .min(1, 'Add at least one highlight'),

  includes: z
    .array(z.string().min(1, 'Include item cannot be empty'))
    .default([]),

  excludes: z
    .array(z.string().min(1, 'Exclude item cannot be empty'))
    .default([]),

  difficulty: z.enum(PACKAGE_DIFFICULTIES, {
    errorMap: () => ({ message: 'Please select a difficulty level' }),
  }),

  featured: z.boolean().default(false),

  hero_image_url: imageUrlSchema,

  seo_title: seoTitleSchema,

  seo_description: seoDescriptionSchema,
})

export const updatePackageSchema = createPackageSchema.extend({
  id: z.string().uuid(),
})

export type CreatePackageFormValues = z.infer<typeof createPackageSchema>
export type UpdatePackageFormValues = z.infer<typeof updatePackageSchema>

// ─────────────────────────────────────────────────────────────
// 5. FAQ SCHEMA
// ─────────────────────────────────────────────────────────────

export const createFaqSchema = z.object({
  category: z.enum(FAQ_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),

  question: z
    .string()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question must be under 500 characters'),

  answer: z
    .string()
    .min(20, 'Answer must be at least 20 characters'),

  order_index: z
    .number({ invalid_type_error: 'Order must be a number' })
    .int('Order must be a whole number')
    .min(0, 'Order must be 0 or greater')
    .default(0),
})

export const updateFaqSchema = createFaqSchema.extend({
  id: z.string().uuid(),
})

export type CreateFaqFormValues = z.infer<typeof createFaqSchema>
export type UpdateFaqFormValues = z.infer<typeof updateFaqSchema>

// ─────────────────────────────────────────────────────────────
// 6. KNOWLEDGE BASE SCHEMA
// ─────────────────────────────────────────────────────────────

export const createKnowledgeBaseSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(300, 'Title must be under 300 characters'),

  slug: slugSchema,

  category: z.enum(KNOWLEDGE_BASE_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),

  summary: z
    .string()
    .min(20, 'Summary must be at least 20 characters')
    .max(500, 'Summary must be under 500 characters'),

  content: z
    .string()
    .min(50, 'Article content must be at least 50 characters'),

  tags: z.array(z.string().min(1)).default([]),

  reading_time_minutes: z
    .number({ invalid_type_error: 'Reading time must be a number' })
    .int('Reading time must be a whole number')
    .positive('Reading time must be positive')
    .optional()
    .nullable(),

  featured: z.boolean().default(false),

  seo_title: seoTitleSchema,

  seo_description: seoDescriptionSchema,
})

export const updateKnowledgeBaseSchema = createKnowledgeBaseSchema.extend({
  id: z.string().uuid(),
})

export type CreateKnowledgeBaseFormValues = z.infer<typeof createKnowledgeBaseSchema>
export type UpdateKnowledgeBaseFormValues = z.infer<typeof updateKnowledgeBaseSchema>

// ─────────────────────────────────────────────────────────────
// 7. ADVISOR SCHEMA
// ─────────────────────────────────────────────────────────────

export const createAdvisorSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be under 200 characters'),

  title: z
    .string()
    .max(200, 'Title must be under 200 characters')
    .optional()
    .nullable(),

  bio: z.string().optional().nullable(),

  languages: z
    .array(z.string().min(1, 'Language cannot be empty'))
    .min(1, 'Add at least one language'),

  whatsapp_number: z
    .string()
    .regex(/^\+\d{7,15}$/, 'WhatsApp number must be in international format (+977...)')
    .optional()
    .nullable()
    .or(z.literal('')),

  phone_number: z
    .string()
    .optional()
    .nullable(),

  photo_url: imageUrlSchema,

  active: z.boolean().default(true),
})

export const updateAdvisorSchema = createAdvisorSchema.extend({
  id: z.string().uuid(),
})

export type CreateAdvisorFormValues = z.infer<typeof createAdvisorSchema>
export type UpdateAdvisorFormValues = z.infer<typeof updateAdvisorSchema>

// ─────────────────────────────────────────────────────────────
// 8. TRAVEL ALERT SCHEMA
// ─────────────────────────────────────────────────────────────

const travelAlertBaseSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(300, 'Title must be under 300 characters'),

  message: z.string().min(20, 'Message must be at least 20 characters'),

  severity: z.enum(ALERT_SEVERITIES, {
    errorMap: () => ({ message: 'Please select a severity level' }),
  }),

  starts_at: z.string().datetime({ message: 'Invalid start date' }),

  expires_at: z.string().datetime({ message: 'Invalid expiry date' }).optional().nullable(),

  affected_regions: z.array(z.string()).default([]),

  active: z.boolean().default(true),
})

const validExpiry = (data: { starts_at: string; expires_at?: string | null }) => {
  if (!data.expires_at) return true
  return new Date(data.expires_at) > new Date(data.starts_at)
}

const validExpiryError = {
  message: 'Expiry date must be after start date',
  path: ['expires_at'],
}

export const createTravelAlertSchema = travelAlertBaseSchema.refine(validExpiry, validExpiryError)

export const updateTravelAlertSchema = travelAlertBaseSchema
  .extend({ id: z.string().uuid() })
  .refine(validExpiry, validExpiryError)

export type CreateTravelAlertFormValues = z.infer<typeof createTravelAlertSchema>
export type UpdateTravelAlertFormValues = z.infer<typeof updateTravelAlertSchema>

// ─────────────────────────────────────────────────────────────
// 9. SITE SETTINGS SCHEMA
// ─────────────────────────────────────────────────────────────

export const siteSettingsSchema = z.object({
  // Homepage
  homepage_hero_headline: z
    .string()
    .min(5, 'Hero headline must be at least 5 characters')
    .max(200, 'Hero headline must be under 200 characters'),

  homepage_hero_subheadline: z
    .string()
    .max(400, 'Hero subheadline must be under 400 characters')
    .optional(),

  homepage_hero_image_url: imageUrlSchema,

  homepage_featured_destinations_count: z
    .number()
    .int()
    .min(1)
    .max(12)
    .default(6),

  homepage_featured_packages_count: z
    .number()
    .int()
    .min(1)
    .max(6)
    .default(3),

  homepage_show_travel_alerts: z.boolean().default(true),

  homepage_show_knowledge_base: z.boolean().default(true),

  // Contact
  contact_email: z
    .string()
    .email('Must be a valid email address')
    .optional()
    .or(z.literal('')),

  contact_phone: z.string().optional(),

  contact_whatsapp: z
    .string()
    .regex(/^\+\d{7,15}$/, 'WhatsApp must be in international format (+977...)')
    .optional()
    .or(z.literal('')),

  contact_address: z.string().optional(),

  // Social
  social_facebook: urlSchema,
  social_instagram: urlSchema,
  social_youtube: urlSchema,
  social_twitter: urlSchema,

  // General
  site_name: z
    .string()
    .min(1, 'Site name is required')
    .max(100, 'Site name must be under 100 characters'),

  site_tagline: z
    .string()
    .max(200, 'Tagline must be under 200 characters')
    .optional(),
})

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>

// ─────────────────────────────────────────────────────────────
// 10. CONTACT INQUIRY UPDATE SCHEMA
// (Visitors can only INSERT — admins can UPDATE status + notes)
// ─────────────────────────────────────────────────────────────

export const updateContactInquirySchema = z.object({
  id: z.string().uuid(),
  status: z.enum(CONTACT_STATUSES),
  admin_notes: z.string().optional().nullable(),
})

export type UpdateContactInquiryFormValues = z.infer<typeof updateContactInquirySchema>

// ─────────────────────────────────────────────────────────────
// UTILITY: Server Action Response shape
// Used as the return type for all Server Actions
// ─────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
