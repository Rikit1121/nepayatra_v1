import 'server-only'
import { cache } from 'react'
import { createPublicClient } from './supabase/public-client'

export interface SiteSettingsMap {
  site_name: string
  site_tagline: string
  homepage_hero_headline: string
  homepage_hero_subheadline: string
  homepage_hero_image_url: string
  homepage_featured_destinations_count: number
  homepage_featured_packages_count: number
  homepage_show_travel_alerts: boolean
  homepage_show_knowledge_base: boolean
  contact_email: string
  contact_phone: string
  contact_whatsapp: string
  contact_address: string
  social_facebook: string
  social_instagram: string
  social_youtube: string
  social_twitter: string
}

const DEFAULTS: SiteSettingsMap = {
  site_name: 'NepaYatra',
  site_tagline: 'Plan your Nepal trip from India',
  homepage_hero_headline: 'Plan Your Nepal Trip — Step by Step',
  homepage_hero_subheadline:
    'From which border to cross, to how many days in Pokhara — everything a first-time Indian traveler needs to know.',
  homepage_hero_image_url: '',
  homepage_featured_destinations_count: 6,
  homepage_featured_packages_count: 3,
  homepage_show_travel_alerts: true,
  homepage_show_knowledge_base: true,
  contact_email: '',
  contact_phone: '',
  contact_whatsapp: '',
  contact_address: '',
  social_facebook: '',
  social_instagram: '',
  social_youtube: '',
  social_twitter: '',
}

/**
 * Reads all site_settings rows and returns a typed, merged map with defaults.
 * Cached per-request via React cache().
 */
export const getSiteSettings = cache(async (): Promise<SiteSettingsMap> => {
  const supabase = createPublicClient()
  const { data } = await supabase.from('site_settings').select('setting_key, setting_value, value_type')

  const result: SiteSettingsMap = { ...DEFAULTS }
  if (!data) return result

  for (const row of data) {
    const key = row.setting_key as keyof SiteSettingsMap
    if (!(key in DEFAULTS)) continue
    const raw = row.setting_value
    if (raw === null) continue

    if (row.value_type === 'boolean') {
      ;(result[key] as boolean) = raw === 'true'
    } else if (row.value_type === 'number') {
      ;(result[key] as number) = Number(raw)
    } else {
      ;(result[key] as string) = raw
    }
  }

  return result
})
