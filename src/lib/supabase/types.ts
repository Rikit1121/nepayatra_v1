/**
 * Supabase TypeScript Database Types
 * Project: NepaYatra
 *
 * Auto-usage: pass this type to the Supabase client for full type-safety.
 *
 * @example
 * import { createClient } from '@supabase/supabase-js'
 * import type { Database } from '@/lib/supabase/types'
 *
 * const supabase = createClient<Database>(url, key)
 *
 * // Fully typed query:
 * const { data } = await supabase.from('destinations').select('*')
 * // data is Destination[] | null
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─────────────────────────────────────────────────────────────
// ENUM TYPES
// ─────────────────────────────────────────────────────────────

export type DestinationCategory =
  | 'cultural'
  | 'heritage'
  | 'adventure'
  | 'trekking'
  | 'wildlife'
  | 'religious'
  | 'scenic'

export type NepalProvince =
  | 'koshi'
  | 'madhesh'
  | 'bagmati'
  | 'gandaki'
  | 'lumbini'
  | 'karnali'
  | 'sudurpashchim'

export type PackageDifficulty = 'easy' | 'moderate' | 'hard' | 'expert'

export type FaqCategory =
  | 'entry_requirements'
  | 'visa'
  | 'transport'
  | 'safety'
  | 'currency'
  | 'culture'
  | 'health'
  | 'general'

export type AlertSeverity = 'info' | 'warning' | 'danger'

export type KnowledgeBaseCategory =
  | 'entry_requirements'
  | 'transport'
  | 'safety'
  | 'culture'
  | 'currency'
  | 'health'
  | 'trekking'
  | 'wildlife'
  | 'general'

export type SettingValueType = 'text' | 'json' | 'boolean' | 'number' | 'image_url'

export type SettingGroup = 'general' | 'seo' | 'contact' | 'social' | 'homepage'

export type ContactInquiryStatus = 'new' | 'read' | 'replied' | 'closed'

export type AccommodationTier = 'budget' | 'mid_range' | 'premium' | 'luxury'

export type TransportType =
  | 'bus'
  | 'tourist_bus'
  | 'jeep'
  | 'shared_jeep'
  | 'private_vehicle'
  | 'taxi'
  | 'other'

export type PricingUnit = 'per_person' | 'per_vehicle' | 'per_day' | 'per_trip'

export type DailyCostTier = 'budget' | 'comfort' | 'premium'

export type ActivityCategory =
  | 'sightseeing'
  | 'trekking'
  | 'adventure'
  | 'wildlife'
  | 'cultural'
  | 'spiritual'
  | 'nature'
  | 'other'

// ─────────────────────────────────────────────────────────────
// FULL DATABASE TYPE (Supabase Client Generic)
// ─────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {

      // ── destinations ──────────────────────────────────────

      destinations: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string
          full_description: string | null
          category: DestinationCategory
          province: NepalProvince
          latitude: number
          longitude: number
          altitude_meters: number | null
          best_season: string[]
          featured: boolean
          public_visible: boolean
          hero_image_url: string | null
          gallery_images: string[]
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description: string
          full_description?: string | null
          category: DestinationCategory
          province: NepalProvince
          latitude: number
          longitude: number
          altitude_meters?: number | null
          best_season?: string[]
          featured?: boolean
          public_visible?: boolean
          hero_image_url?: string | null
          gallery_images?: string[]
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string
          full_description?: string | null
          category?: DestinationCategory
          province?: NepalProvince
          latitude?: number
          longitude?: number
          altitude_meters?: number | null
          best_season?: string[]
          featured?: boolean
          public_visible?: boolean
          hero_image_url?: string | null
          gallery_images?: string[]
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── border_crossings ──────────────────────────────────

      border_crossings: {
        Row: {
          id: string
          crossing_name: string
          india_side: string
          nepal_side: string
          description: string | null
          latitude: number | null
          longitude: number | null
          operating_notes: string | null
          featured: boolean
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          crossing_name: string
          india_side: string
          nepal_side: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          operating_notes?: string | null
          featured?: boolean
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          crossing_name?: string
          india_side?: string
          nepal_side?: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          operating_notes?: string | null
          featured?: boolean
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── destination_connections ───────────────────────────

      destination_connections: {
        Row: {
          id: string
          from_destination_id: string
          to_destination_id: string
          distance_km: number | null
          travel_time_hours: number | null
          recommended_transport: string | null
          route_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          from_destination_id: string
          to_destination_id: string
          distance_km?: number | null
          travel_time_hours?: number | null
          recommended_transport?: string | null
          route_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          from_destination_id?: string
          to_destination_id?: string
          distance_km?: number | null
          travel_time_hours?: number | null
          recommended_transport?: string | null
          route_notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'destination_connections_from_destination_id_fkey'
            columns: ['from_destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'destination_connections_to_destination_id_fkey'
            columns: ['to_destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          },
        ]
      }

      // ── packages ──────────────────────────────────────────

      packages: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          duration_days: number
          price_inr_from: number | null
          highlights: string[]
          includes: string[]
          excludes: string[]
          difficulty: PackageDifficulty
          featured: boolean
          hero_image_url: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          duration_days: number
          price_inr_from?: number | null
          highlights?: string[]
          includes?: string[]
          excludes?: string[]
          difficulty?: PackageDifficulty
          featured?: boolean
          hero_image_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          duration_days?: number
          price_inr_from?: number | null
          highlights?: string[]
          includes?: string[]
          excludes?: string[]
          difficulty?: PackageDifficulty
          featured?: boolean
          hero_image_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── faqs ──────────────────────────────────────────────

      faqs: {
        Row: {
          id: string
          category: FaqCategory
          question: string
          answer: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: FaqCategory
          question: string
          answer: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: FaqCategory
          question?: string
          answer?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── advisors ──────────────────────────────────────────

      advisors: {
        Row: {
          id: string
          name: string
          title: string | null
          bio: string | null
          languages: string[]
          whatsapp_number: string | null
          phone_number: string | null
          photo_url: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title?: string | null
          bio?: string | null
          languages?: string[]
          whatsapp_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string | null
          bio?: string | null
          languages?: string[]
          whatsapp_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── travel_alerts ─────────────────────────────────────

      travel_alerts: {
        Row: {
          id: string
          title: string
          message: string
          severity: AlertSeverity
          starts_at: string
          expires_at: string | null
          affected_regions: string[]
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          severity?: AlertSeverity
          starts_at?: string
          expires_at?: string | null
          affected_regions?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          severity?: AlertSeverity
          starts_at?: string
          expires_at?: string | null
          affected_regions?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── knowledge_base ────────────────────────────────────

      knowledge_base: {
        Row: {
          id: string
          title: string
          slug: string
          category: KnowledgeBaseCategory
          summary: string
          content: string
          tags: string[]
          reading_time_minutes: number | null
          featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: KnowledgeBaseCategory
          summary: string
          content: string
          tags?: string[]
          reading_time_minutes?: number | null
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: KnowledgeBaseCategory
          summary?: string
          content?: string
          tags?: string[]
          reading_time_minutes?: number | null
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── site_settings ─────────────────────────────────────

      site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string | null
          value_type: SettingValueType
          setting_group: SettingGroup
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: string | null
          value_type?: SettingValueType
          setting_group?: SettingGroup
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string | null
          value_type?: SettingValueType
          setting_group?: SettingGroup
          updated_at?: string
        }
        Relationships: []
      }

      // ── contact_inquiries ─────────────────────────────────

      contact_inquiries: {
        Row: {
          id: string
          visitor_name: string
          visitor_email: string
          visitor_phone: string | null
          message: string
          status: ContactInquiryStatus
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          visitor_name: string
          visitor_email: string
          visitor_phone?: string | null
          message: string
          status?: ContactInquiryStatus
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          visitor_name?: string
          visitor_email?: string
          visitor_phone?: string | null
          message?: string
          status?: ContactInquiryStatus
          admin_notes?: string | null
          created_at?: string
        }
        Relationships: []
      }

      // ── shared_trips ──────────────────────────────────────

      shared_trips: {
        Row: {
          id: string
          share_id: string
          title: string
          origin_type: 'india' | 'international' | 'in-nepal'
          travel_mode: 'flight' | 'road' | null
          border_slug: string | null
          origin_country: string | null
          origin_city: string | null
          from_region: string | null
          start_date: string | null
          end_date: string | null
          days: number
          traveler_count: number
          traveler_type: 'solo' | 'couple' | 'family' | 'group' | null
          travel_category: string | null
          travel_style: 'budget' | 'comfort' | 'premium' | null
          interests: string[]
          user_budget_npr: number | null
          destination_slugs: string[]
          route_snapshot: Json
          budget_snapshot: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          share_id: string
          title: string
          origin_type: 'india' | 'international' | 'in-nepal'
          travel_mode?: 'flight' | 'road' | null
          border_slug?: string | null
          origin_country?: string | null
          origin_city?: string | null
          from_region?: string | null
          start_date?: string | null
          end_date?: string | null
          days: number
          traveler_count: number
          traveler_type?: 'solo' | 'couple' | 'family' | 'group' | null
          travel_category?: string | null
          travel_style?: 'budget' | 'comfort' | 'premium' | null
          interests?: string[]
          user_budget_npr?: number | null
          destination_slugs?: string[]
          route_snapshot: Json
          budget_snapshot: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          share_id?: string
          title?: string
          origin_type?: 'india' | 'international' | 'in-nepal'
          travel_mode?: 'flight' | 'road' | null
          border_slug?: string | null
          origin_country?: string | null
          origin_city?: string | null
          from_region?: string | null
          start_date?: string | null
          end_date?: string | null
          days?: number
          traveler_count?: number
          traveler_type?: 'solo' | 'couple' | 'family' | 'group' | null
          travel_category?: string | null
          travel_style?: 'budget' | 'comfort' | 'premium' | null
          interests?: string[]
          user_budget_npr?: number | null
          destination_slugs?: string[]
          route_snapshot?: Json
          budget_snapshot?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── calendar_events ───────────────────────────────────

      calendar_events: {
        Row: {
          id: string
          slug: string
          title: string
          nepali_title: string | null
          event_type: 'festival' | 'public_holiday' | 'cultural_event' | 'travel_season' | 'national_day'
          start_date_ad: string
          end_date_ad: string
          start_date_bs: string
          end_date_bs: string
          year_ad: number
          year_bs: number
          is_public_holiday: boolean
          summary: string
          description: string | null
          travel_impact: string | null
          recommended_destinations: string[]
          featured: boolean
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          nepali_title?: string | null
          event_type: 'festival' | 'public_holiday' | 'cultural_event' | 'travel_season' | 'national_day'
          start_date_ad: string
          end_date_ad: string
          start_date_bs: string
          end_date_bs: string
          year_ad: number
          year_bs: number
          is_public_holiday?: boolean
          summary: string
          description?: string | null
          travel_impact?: string | null
          recommended_destinations?: string[]
          featured?: boolean
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          nepali_title?: string | null
          event_type?: 'festival' | 'public_holiday' | 'cultural_event' | 'travel_season' | 'national_day'
          start_date_ad?: string
          end_date_ad?: string
          start_date_bs?: string
          end_date_bs?: string
          year_ad?: number
          year_bs?: number
          is_public_holiday?: boolean
          summary?: string
          description?: string | null
          travel_impact?: string | null
          recommended_destinations?: string[]
          featured?: boolean
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── accommodations ───────────────────────────────────

      accommodations: {
        Row: {
          id: string
          destination_id: string
          name: string
          tier: AccommodationTier
          estimated_price_min: number
          estimated_price_max: number
          currency: string
          source: string | null
          source_date: string | null
          notes: string | null
          image_url: string | null
          website_url: string | null
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          destination_id: string
          name: string
          tier: AccommodationTier
          estimated_price_min: number
          estimated_price_max: number
          currency?: string
          source?: string | null
          source_date?: string | null
          notes?: string | null
          image_url?: string | null
          website_url?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          destination_id?: string
          name?: string
          tier?: AccommodationTier
          estimated_price_min?: number
          estimated_price_max?: number
          currency?: string
          source?: string | null
          source_date?: string | null
          notes?: string | null
          image_url?: string | null
          website_url?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accommodations_destination_id_fkey'
            columns: ['destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── transport_options ─────────────────────────────────

      transport_options: {
        Row: {
          id: string
          origin_destination_id: string
          destination_destination_id: string
          transport_type: TransportType
          pricing_unit: PricingUnit
          vehicle_capacity: number | null
          estimated_cost_min: number
          estimated_cost_max: number
          currency: string
          duration_hours: number | null
          duration_text: string | null
          route_notes: string | null
          source: string | null
          source_date: string | null
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          origin_destination_id: string
          destination_destination_id: string
          transport_type: TransportType
          pricing_unit?: PricingUnit
          vehicle_capacity?: number | null
          estimated_cost_min: number
          estimated_cost_max: number
          currency?: string
          duration_hours?: number | null
          duration_text?: string | null
          route_notes?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          origin_destination_id?: string
          destination_destination_id?: string
          transport_type?: TransportType
          pricing_unit?: PricingUnit
          vehicle_capacity?: number | null
          estimated_cost_min?: number
          estimated_cost_max?: number
          currency?: string
          duration_hours?: number | null
          duration_text?: string | null
          route_notes?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transport_options_origin_destination_id_fkey'
            columns: ['origin_destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transport_options_destination_destination_id_fkey'
            columns: ['destination_destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── domestic_flights ──────────────────────────────────

      domestic_flights: {
        Row: {
          id: string
          origin_destination_id: string | null
          origin_city: string
          origin_airport_code: string
          destination_destination_id: string | null
          destination_city: string
          destination_airport_code: string
          estimated_cost_min: number
          estimated_cost_max: number
          estimated_cost_foreigner_min: number | null
          estimated_cost_foreigner_max: number | null
          foreigner_currency: string | null
          currency: string
          duration_minutes: number | null
          airlines: string[]
          flight_notes: string | null
          source: string | null
          source_date: string | null
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          origin_destination_id?: string | null
          origin_city: string
          origin_airport_code: string
          destination_destination_id?: string | null
          destination_city: string
          destination_airport_code: string
          estimated_cost_min: number
          estimated_cost_max: number
          estimated_cost_foreigner_min?: number | null
          estimated_cost_foreigner_max?: number | null
          foreigner_currency?: string | null
          currency?: string
          duration_minutes?: number | null
          airlines?: string[]
          flight_notes?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          origin_destination_id?: string | null
          origin_city?: string
          origin_airport_code?: string
          destination_destination_id?: string | null
          destination_city?: string
          destination_airport_code?: string
          estimated_cost_min?: number
          estimated_cost_max?: number
          estimated_cost_foreigner_min?: number | null
          estimated_cost_foreigner_max?: number | null
          foreigner_currency?: string | null
          currency?: string
          duration_minutes?: number | null
          airlines?: string[]
          flight_notes?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'domestic_flights_origin_destination_id_fkey'
            columns: ['origin_destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'domestic_flights_destination_destination_id_fkey'
            columns: ['destination_destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── activities ────────────────────────────────────────

      activities: {
        Row: {
          id: string
          destination_id: string
          name: string
          category: ActivityCategory
          estimated_cost: number | null
          estimated_cost_max: number | null
          currency: string
          duration: string | null
          description: string | null
          source: string | null
          source_date: string | null
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          destination_id: string
          name: string
          category: ActivityCategory
          estimated_cost?: number | null
          estimated_cost_max?: number | null
          currency?: string
          duration?: string | null
          description?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          destination_id?: string
          name?: string
          category?: ActivityCategory
          estimated_cost?: number | null
          estimated_cost_max?: number | null
          currency?: string
          duration?: string | null
          description?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_destination_id_fkey'
            columns: ['destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── daily_cost_estimates ──────────────────────────────

      daily_cost_estimates: {
        Row: {
          id: string
          destination_id: string | null
          region_name: string
          travel_tier: DailyCostTier
          estimated_daily_food_cost: number
          estimated_daily_misc_cost: number
          currency: string
          notes: string | null
          source: string | null
          source_date: string | null
          public_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          destination_id?: string | null
          region_name: string
          travel_tier: DailyCostTier
          estimated_daily_food_cost: number
          estimated_daily_misc_cost?: number
          currency?: string
          notes?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          destination_id?: string | null
          region_name?: string
          travel_tier?: DailyCostTier
          estimated_daily_food_cost?: number
          estimated_daily_misc_cost?: number
          currency?: string
          notes?: string | null
          source?: string | null
          source_date?: string | null
          public_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'daily_cost_estimates_destination_id_fkey'
            columns: ['destination_id']
            isOneToOne: false
            referencedRelation: 'destinations'
            referencedColumns: ['id']
          }
        ]
      }
    }

    Views: Record<string, never>

    Functions: {
      set_updated_at: {
        Args: Record<string, never>
        Returns: unknown
      }
    }

    Enums: {
      destination_category: DestinationCategory
      nepal_province: NepalProvince
      package_difficulty: PackageDifficulty
      faq_category: FaqCategory
      alert_severity: AlertSeverity
      knowledge_base_category: KnowledgeBaseCategory
      setting_value_type: SettingValueType
    }

    CompositeTypes: Record<string, never>
  }
}

// ─────────────────────────────────────────────────────────────
// CONVENIENCE ROW TYPES
// Use these throughout the application instead of Database['public']['Tables']['x']['Row']
// ─────────────────────────────────────────────────────────────

export type Destination         = Database['public']['Tables']['destinations']['Row']
export type DestinationInsert   = Database['public']['Tables']['destinations']['Insert']
export type DestinationUpdate   = Database['public']['Tables']['destinations']['Update']

export type BorderCrossing      = Database['public']['Tables']['border_crossings']['Row']
export type BorderCrossingInsert = Database['public']['Tables']['border_crossings']['Insert']
export type BorderCrossingUpdate = Database['public']['Tables']['border_crossings']['Update']

export type DestinationConnection       = Database['public']['Tables']['destination_connections']['Row']
export type DestinationConnectionInsert = Database['public']['Tables']['destination_connections']['Insert']
export type DestinationConnectionUpdate = Database['public']['Tables']['destination_connections']['Update']

export type Package       = Database['public']['Tables']['packages']['Row']
export type PackageInsert = Database['public']['Tables']['packages']['Insert']
export type PackageUpdate = Database['public']['Tables']['packages']['Update']

export type Faq       = Database['public']['Tables']['faqs']['Row']
export type FaqInsert = Database['public']['Tables']['faqs']['Insert']
export type FaqUpdate = Database['public']['Tables']['faqs']['Update']

export type Advisor       = Database['public']['Tables']['advisors']['Row']
export type AdvisorInsert = Database['public']['Tables']['advisors']['Insert']
export type AdvisorUpdate = Database['public']['Tables']['advisors']['Update']

export type TravelAlert       = Database['public']['Tables']['travel_alerts']['Row']
export type TravelAlertInsert = Database['public']['Tables']['travel_alerts']['Insert']
export type TravelAlertUpdate = Database['public']['Tables']['travel_alerts']['Update']

export type KnowledgeBaseArticle       = Database['public']['Tables']['knowledge_base']['Row']
export type KnowledgeBaseArticleInsert = Database['public']['Tables']['knowledge_base']['Insert']
export type KnowledgeBaseArticleUpdate = Database['public']['Tables']['knowledge_base']['Update']

export type SiteSetting       = Database['public']['Tables']['site_settings']['Row']
export type SiteSettingInsert = Database['public']['Tables']['site_settings']['Insert']
export type SiteSettingUpdate = Database['public']['Tables']['site_settings']['Update']

export type ContactInquiry       = Database['public']['Tables']['contact_inquiries']['Row']
export type ContactInquiryInsert = Database['public']['Tables']['contact_inquiries']['Insert']
export type ContactInquiryUpdate = Database['public']['Tables']['contact_inquiries']['Update']

export type SharedTrip       = Database['public']['Tables']['shared_trips']['Row']
export type SharedTripInsert = Database['public']['Tables']['shared_trips']['Insert']
export type SharedTripUpdate = Database['public']['Tables']['shared_trips']['Update']

export type CalendarEvent       = Database['public']['Tables']['calendar_events']['Row']
export type CalendarEventInsert = Database['public']['Tables']['calendar_events']['Insert']
export type CalendarEventUpdate = Database['public']['Tables']['calendar_events']['Update']
export type CalendarEventType   = CalendarEvent['event_type']

export type Accommodation       = Database['public']['Tables']['accommodations']['Row']
export type AccommodationInsert = Database['public']['Tables']['accommodations']['Insert']
export type AccommodationUpdate = Database['public']['Tables']['accommodations']['Update']

export type TransportOption       = Database['public']['Tables']['transport_options']['Row']
export type TransportOptionInsert = Database['public']['Tables']['transport_options']['Insert']
export type TransportOptionUpdate = Database['public']['Tables']['transport_options']['Update']

export type DomesticFlight       = Database['public']['Tables']['domestic_flights']['Row']
export type DomesticFlightInsert = Database['public']['Tables']['domestic_flights']['Insert']
export type DomesticFlightUpdate = Database['public']['Tables']['domestic_flights']['Update']

export type Activity       = Database['public']['Tables']['activities']['Row']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']

export type DailyCostEstimate       = Database['public']['Tables']['daily_cost_estimates']['Row']
export type DailyCostEstimateInsert = Database['public']['Tables']['daily_cost_estimates']['Insert']
export type DailyCostEstimateUpdate = Database['public']['Tables']['daily_cost_estimates']['Update']

// ─────────────────────────────────────────────────────────────
// ENRICHED / JOIN TYPES
// For queries that join related tables
// ─────────────────────────────────────────────────────────────

/** Destination with its outgoing route connections, each including the target destination's name and slug. */
export type DestinationWithConnections = Destination & {
  outgoing_connections: Array<
    DestinationConnection & {
      to_destination: Pick<Destination, 'id' | 'name' | 'slug' | 'province' | 'category'>
    }
  >
}

/** Route connection enriched with both endpoint destination names (for the route planner graph). */
export type ConnectionWithDestinations = DestinationConnection & {
  from_destination: Pick<Destination, 'id' | 'name' | 'slug' | 'latitude' | 'longitude'>
  to_destination: Pick<Destination, 'id' | 'name' | 'slug' | 'latitude' | 'longitude'>
}

// ─────────────────────────────────────────────────────────────
// SITE SETTINGS HELPERS
// ─────────────────────────────────────────────────────────────

/** Type-safe parsed value variants for site settings. */
export type ParsedSettingValue =
  | { type: 'text';      value: string }
  | { type: 'json';      value: Json }
  | { type: 'boolean';   value: boolean }
  | { type: 'number';    value: number }
  | { type: 'image_url'; value: string }

/** Site settings grouped by their setting_group key — convenient for the admin settings page. */
export type GroupedSiteSettings = Record<SettingGroup, SiteSetting[]>

// ─────────────────────────────────────────────────────────────
// MAP / ROUTE PLANNER TYPES
// ─────────────────────────────────────────────────────────────

/** Lightweight destination record for map markers — only fields needed for the map layer. */
export type DestinationMapMarker = Pick<
  Destination,
  | 'id'
  | 'name'
  | 'slug'
  | 'latitude'
  | 'longitude'
  | 'category'
  | 'province'
  | 'featured'
  | 'short_description'
>

/** Lightweight border crossing record for map markers. */
export type BorderCrossingMapMarker = Pick<
  BorderCrossing,
  | 'id'
  | 'crossing_name'
  | 'india_side'
  | 'nepal_side'
  | 'latitude'
  | 'longitude'
  | 'featured'
  | 'description'
>

/** Route planner graph node. */
export type RoutePlannerNode = Pick<
  Destination,
  'id' | 'name' | 'slug' | 'latitude' | 'longitude' | 'province' | 'altitude_meters'
>

/** Route planner graph edge. */
export type RoutePlannerEdge = Pick<
  DestinationConnection,
  'id' | 'from_destination_id' | 'to_destination_id' |
  'distance_km' | 'travel_time_hours' | 'recommended_transport'
>
