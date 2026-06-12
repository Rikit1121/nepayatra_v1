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
