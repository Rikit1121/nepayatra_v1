import { z } from 'zod'

export const saveTripSchema = z.object({
  title: z.string().optional(),
  origin_type: z.enum(['india', 'international', 'in-nepal']),
  travel_mode: z.enum(['flight', 'road']).nullable().optional(),
  border_slug: z.string().nullable().optional(),
  origin_country: z.string().nullable().optional(),
  origin_city: z.string().nullable().optional(),
  from_region: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  days: z.number().int().min(3).max(30),
  traveler_count: z.number().int().min(1).max(20),
  traveler_type: z.enum(['solo', 'couple', 'family', 'group']).nullable().optional(),
  travel_category: z.string().nullable().optional(),
  travel_style: z.enum(['budget', 'comfort', 'premium']).nullable().optional(),
  interests: z.array(z.string()).default([]),
  user_budget_npr: z.number().nullable().optional(),
  destination_slugs: z.array(z.string()).min(1),
  route_snapshot: z.record(z.any()),
  budget_snapshot: z.record(z.any()),
})

export type SaveTripSchemaInput = z.infer<typeof saveTripSchema>
