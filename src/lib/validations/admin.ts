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

/** HTML number inputs and RHF often submit strings — normalize before Zod checks. */
function emptyToNull(val: unknown): unknown {
  if (val === '' || val === null || val === undefined) return null
  if (typeof val === 'number' && Number.isNaN(val)) return null
  return val
}

function emptyToUndefined(val: unknown): unknown {
  if (val === '' || val === null || val === undefined) return undefined
  if (typeof val === 'number' && Number.isNaN(val)) return undefined
  return val
}

/** `<input type="datetime-local">` returns `2026-06-15T14:01` — normalize to ISO for Zod/DB. */
function datetimeLocalToIso(val: unknown): unknown {
  if (val === '' || val === null || val === undefined) return null
  if (typeof val !== 'string') return val
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
    return new Date(val).toISOString()
  }
  return val
}

const requiredDatetime = z.preprocess(
  datetimeLocalToIso,
  z.string().datetime({ message: 'Invalid start date' })
)

const optionalDatetime = z.preprocess(
  datetimeLocalToIso,
  z.string().datetime({ message: 'Invalid expiry date' }).optional().nullable()
)

const optionalPositiveNumber = (label: string) =>
  z.preprocess(
    emptyToNull,
    z.coerce
      .number({ invalid_type_error: `${label} must be a number` })
      .positive(`${label} must be positive`)
      .optional()
      .nullable()
  )

const optionalPositiveInt = (label: string) =>
  z.preprocess(
    emptyToNull,
    z.coerce
      .number({ invalid_type_error: `${label} must be a number` })
      .int(`${label} must be a whole number`)
      .positive(`${label} must be positive`)
      .optional()
      .nullable()
  )

const requiredInt = (label: string, min: number, max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ invalid_type_error: `${label} must be a number` })
      .int(`${label} must be a whole number`)
      .min(min)
      .max(max)
  )

const requiredNumber = (label: string, min: number, max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ invalid_type_error: `${label} must be a number` })
      .min(min)
      .max(max)
  )

const optionalInt = (label: string, min: number) =>
  z.preprocess(
    emptyToNull,
    z.coerce
      .number({ invalid_type_error: `${label} must be a number` })
      .int(`${label} must be a whole number`)
      .min(min)
      .optional()
      .nullable()
  )

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

const imageUrlSchema = z.preprocess(
  (val) => (val === '' ? null : val),
  z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => val == null || val.startsWith('/') || /^https?:\/\/.+/.test(val),
      'Use a site path like /images/photo.jpg or a full https:// URL'
    )
)

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

export const ACCOMMODATION_TIERS = ['budget', 'mid_range', 'premium', 'luxury'] as const

export const TRANSPORT_TYPES = [
  'bus',
  'tourist_bus',
  'jeep',
  'shared_jeep',
  'private_vehicle',
  'taxi',
  'other',
] as const

export const PRICING_UNITS = [
  'per_person',
  'per_vehicle',
  'per_day',
  'per_trip',
] as const

export const DAILY_COST_TIERS = ['budget', 'comfort', 'premium'] as const

export const ACTIVITY_CATEGORIES = [
  'sightseeing',
  'trekking',
  'adventure',
  'wildlife',
  'cultural',
  'spiritual',
  'nature',
  'other',
] as const

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

  latitude: requiredNumber('Latitude', 26.0, 31.0),

  longitude: requiredNumber('Longitude', 79.0, 89.0),

  altitude_meters: optionalInt('Altitude', 0),

  best_season: z
    .array(z.string())
    .min(1, 'Select at least one season month'),

  featured: z.boolean().default(false),

  public_visible: z.boolean().default(true),

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

  latitude: z.preprocess(
    emptyToNull,
    z.coerce
      .number({ invalid_type_error: 'Latitude must be a number' })
      .min(26.0, 'Latitude must be within Nepal (26.0 – 31.0)')
      .max(31.0, 'Latitude must be within Nepal (26.0 – 31.0)')
      .optional()
      .nullable()
  ),

  longitude: z.preprocess(
    emptyToNull,
    z.coerce
      .number({ invalid_type_error: 'Longitude must be a number' })
      .min(79.0, 'Longitude must be within Nepal (79.0 – 89.0)')
      .max(89.0, 'Longitude must be within Nepal (79.0 – 89.0)')
      .optional()
      .nullable()
  ),

  operating_notes: z.string().optional().nullable(),

  featured: z.boolean().default(false),

  public_visible: z.boolean().default(true),
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

  distance_km: optionalPositiveNumber('Distance'),

  travel_time_hours: optionalPositiveNumber('Travel time'),

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

  duration_days: requiredInt('Duration', 1, 365),

  price_inr_from: optionalPositiveInt('Price'),

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

  order_index: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ invalid_type_error: 'Order must be a number' })
      .int('Order must be a whole number')
      .min(0, 'Order must be 0 or greater')
      .default(0)
  ),
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

  reading_time_minutes: optionalPositiveInt('Reading time'),

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

  starts_at: requiredDatetime,

  expires_at: optionalDatetime,

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

  homepage_featured_destinations_count: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(12).default(6)
  ),

  homepage_featured_packages_count: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(6).default(3)
  ),

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
// 11. ACCOMMODATIONS SCHEMA (Phase 2A)
// ─────────────────────────────────────────────────────────────

export const createAccommodationSchema = z
  .object({
    destination_id: z.string().uuid('Please select a valid destination'),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(200, 'Name must be under 200 characters'),
    tier: z.enum(ACCOMMODATION_TIERS, {
      errorMap: () => ({ message: 'Please select an accommodation tier' }),
    }),
    estimated_price_min: requiredInt('Min price', 1, 10_000_000),
    estimated_price_max: requiredInt('Max price', 1, 10_000_000),
    currency: z.string().default('NPR'),
    source: z.string().max(200).optional().nullable(),
    source_date: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    image_url: imageUrlSchema,
    website_url: urlSchema,
    public_visible: z.boolean().default(true),
  })
  .refine((data) => data.estimated_price_max >= data.estimated_price_min, {
    message: 'Max estimated price cannot be less than min price',
    path: ['estimated_price_max'],
  })

export const updateAccommodationSchema = createAccommodationSchema.and(
  z.object({ id: z.string().uuid() })
)

export type CreateAccommodationFormValues = z.infer<typeof createAccommodationSchema>
export type UpdateAccommodationFormValues = z.infer<typeof updateAccommodationSchema>

// ─────────────────────────────────────────────────────────────
// 12. TRANSPORT OPTIONS SCHEMA (Phase 2A)
// ─────────────────────────────────────────────────────────────

export const createTransportOptionSchema = z
  .object({
    origin_destination_id: z.string().uuid('Please select an origin destination'),
    destination_destination_id: z.string().uuid('Please select a target destination'),
    transport_type: z.enum(TRANSPORT_TYPES, {
      errorMap: () => ({ message: 'Please select a transport type' }),
    }),
    pricing_unit: z.enum(PRICING_UNITS).default('per_person'),
    vehicle_capacity: optionalPositiveInt('Vehicle capacity'),
    estimated_cost_min: requiredInt('Min cost', 1, 10_000_000),
    estimated_cost_max: requiredInt('Max cost', 1, 10_000_000),
    currency: z.string().default('NPR'),
    duration_hours: optionalPositiveNumber('Duration hours'),
    duration_text: z.string().max(100).optional().nullable(),
    route_notes: z.string().optional().nullable(),
    source: z.string().max(200).optional().nullable(),
    source_date: z.string().optional().nullable(),
    public_visible: z.boolean().default(true),
  })
  .refine((data) => data.origin_destination_id !== data.destination_destination_id, {
    message: 'Origin and destination must be different',
    path: ['destination_destination_id'],
  })
  .refine((data) => data.estimated_cost_max >= data.estimated_cost_min, {
    message: 'Max estimated cost cannot be less than min cost',
    path: ['estimated_cost_max'],
  })

export const updateTransportOptionSchema = createTransportOptionSchema.and(
  z.object({ id: z.string().uuid() })
)

export type CreateTransportOptionFormValues = z.infer<typeof createTransportOptionSchema>
export type UpdateTransportOptionFormValues = z.infer<typeof updateTransportOptionSchema>

// ─────────────────────────────────────────────────────────────
// 13. DOMESTIC FLIGHTS SCHEMA (Phase 2A)
// ─────────────────────────────────────────────────────────────

export const createDomesticFlightSchema = z
  .object({
    origin_destination_id: z.preprocess(emptyToNull, z.string().uuid().optional().nullable()),
    origin_city: z.string().min(2, 'Origin city is required').max(100),
    origin_airport_code: z
      .string()
      .min(2, 'Airport code required')
      .max(10)
      .transform((s) => s.toUpperCase()),
    destination_destination_id: z.preprocess(emptyToNull, z.string().uuid().optional().nullable()),
    destination_city: z.string().min(2, 'Destination city is required').max(100),
    destination_airport_code: z
      .string()
      .min(2, 'Airport code required')
      .max(10)
      .transform((s) => s.toUpperCase()),
    estimated_cost_min: requiredInt('Min cost', 1, 10_000_000),
    estimated_cost_max: requiredInt('Max cost', 1, 10_000_000),
    estimated_cost_foreigner_min: optionalPositiveInt('Foreigner min cost'),
    estimated_cost_foreigner_max: optionalPositiveInt('Foreigner max cost'),
    foreigner_currency: z.string().default('USD').optional().nullable(),
    currency: z.string().default('NPR'),
    duration_minutes: optionalPositiveInt('Duration minutes'),
    airlines: z.array(z.string()).default([]),
    flight_notes: z.string().optional().nullable(),
    source: z.string().max(200).optional().nullable(),
    source_date: z.string().optional().nullable(),
    public_visible: z.boolean().default(true),
  })
  .refine((data) => data.estimated_cost_max >= data.estimated_cost_min, {
    message: 'Max estimated flight cost cannot be less than min cost',
    path: ['estimated_cost_max'],
  })
  .refine(
    (data) =>
      !data.estimated_cost_foreigner_max ||
      !data.estimated_cost_foreigner_min ||
      data.estimated_cost_foreigner_max >= data.estimated_cost_foreigner_min,
    {
      message: 'Max foreigner flight cost cannot be less than min foreigner cost',
      path: ['estimated_cost_foreigner_max'],
    }
  )

export const updateDomesticFlightSchema = createDomesticFlightSchema.and(
  z.object({ id: z.string().uuid() })
)

export type CreateDomesticFlightFormValues = z.infer<typeof createDomesticFlightSchema>
export type UpdateDomesticFlightFormValues = z.infer<typeof updateDomesticFlightSchema>

// ─────────────────────────────────────────────────────────────
// 14. ACTIVITIES SCHEMA (Phase 2A)
// ─────────────────────────────────────────────────────────────

export const createActivitySchema = z
  .object({
    destination_id: z.string().uuid('Please select a valid destination'),
    name: z
      .string()
      .min(2, 'Activity name must be at least 2 characters')
      .max(200, 'Name must be under 200 characters'),
    category: z.enum(ACTIVITY_CATEGORIES, {
      errorMap: () => ({ message: 'Please select an activity category' }),
    }),
    estimated_cost: optionalInt('Estimated cost', 0),
    estimated_cost_max: optionalInt('Max cost', 0),
    currency: z.string().default('NPR'),
    duration: z.string().max(100).optional().nullable(),
    description: z.string().optional().nullable(),
    source: z.string().max(200).optional().nullable(),
    source_date: z.string().optional().nullable(),
    public_visible: z.boolean().default(true),
  })
  .refine(
    (data) =>
      data.estimated_cost == null ||
      data.estimated_cost_max == null ||
      data.estimated_cost_max >= data.estimated_cost,
    {
      message: 'Max activity cost cannot be less than min cost',
      path: ['estimated_cost_max'],
    }
  )

export const updateActivitySchema = createActivitySchema.and(
  z.object({ id: z.string().uuid() })
)

export type CreateActivityFormValues = z.infer<typeof createActivitySchema>
export type UpdateActivityFormValues = z.infer<typeof updateActivitySchema>

// ─────────────────────────────────────────────────────────────
// 15. DAILY COST ESTIMATES SCHEMA (Phase 2A)
// ─────────────────────────────────────────────────────────────

export const createDailyCostEstimateSchema = z.object({
  destination_id: z.preprocess(emptyToNull, z.string().uuid().optional().nullable()),
  region_name: z
    .string()
    .min(2, 'Region / Area name is required')
    .max(150),
  travel_tier: z.enum(DAILY_COST_TIERS, {
    errorMap: () => ({ message: 'Please select a travel tier' }),
  }),
  estimated_daily_food_cost: requiredInt('Daily food cost', 1, 1_000_000),
  estimated_daily_misc_cost: z.preprocess(
    emptyToNull,
    z.coerce.number().int().min(0).default(0)
  ),
  currency: z.string().default('NPR'),
  notes: z.string().optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  source_date: z.string().optional().nullable(),
  public_visible: z.boolean().default(true),
})

export const updateDailyCostEstimateSchema = createDailyCostEstimateSchema.and(
  z.object({ id: z.string().uuid() })
)

export type CreateDailyCostEstimateFormValues = z.infer<typeof createDailyCostEstimateSchema>
export type UpdateDailyCostEstimateFormValues = z.infer<typeof updateDailyCostEstimateSchema>

// ─────────────────────────────────────────────────────────────
// CALENDAR EVENT SCHEMAS
// ─────────────────────────────────────────────────────────────

export const CALENDAR_EVENT_TYPES = [
  'festival',
  'public_holiday',
  'cultural_event',
  'travel_season',
  'national_day',
] as const

export const calendarEventBaseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(150),
  slug: slugSchema,
  nepali_title: z.string().max(150).optional().nullable(),
  event_type: z.enum(CALENDAR_EVENT_TYPES),
  start_date_ad: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid start date (YYYY-MM-DD) is required'),
  end_date_ad: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid end date (YYYY-MM-DD) is required'),
  start_date_bs: z.string().min(4, 'BS start date is required'),
  end_date_bs: z.string().min(4, 'BS end date is required'),
  year_ad: z.coerce.number().int().min(2000).max(2100),
  year_bs: z.coerce.number().int().min(2050).max(2150),
  is_public_holiday: z.boolean().default(false),
  summary: z.string().min(5, 'Summary must be at least 5 characters').max(500),
  description: z.string().optional().nullable(),
  travel_impact: z.string().optional().nullable(),
  recommended_destinations: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  public_visible: z.boolean().default(true),
})

export const createCalendarEventSchema = calendarEventBaseSchema
export const updateCalendarEventSchema = calendarEventBaseSchema.extend({
  id: z.string().uuid(),
})

export type CreateCalendarEventFormValues = z.infer<typeof createCalendarEventSchema>
export type UpdateCalendarEventFormValues = z.infer<typeof updateCalendarEventSchema>

// ─────────────────────────────────────────────────────────────
// UTILITY: Server Action Response shape
// Used as the return type for all Server Actions
// ─────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

