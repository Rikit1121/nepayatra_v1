'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { siteSettingsSchema, type ActionResult, type SiteSettingsFormValues } from '@/lib/validations/admin'
import type { SiteSettingInsert } from '@/lib/supabase/types'

export async function updateSiteSettings(
  input: SiteSettingsFormValues
): Promise<ActionResult> {
  const parsed = siteSettingsSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createServerClient()

  // Upsert each setting key individually
  const entries = Object.entries(parsed.data) as [string, unknown][]
  const upserts: SiteSettingInsert[] = entries.map(([key, value]) => ({
    setting_key: key,
    setting_value: value !== null && value !== undefined ? String(value) : null,
    value_type:
      typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text',
    setting_group: key.startsWith('homepage_')
      ? 'homepage'
      : key.startsWith('contact_')
        ? 'contact'
        : key.startsWith('social_')
          ? 'social'
          : 'general',
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(upserts, { onConflict: 'setting_key' })

  if (error) return { success: false, error: `Database error: ${error.message}` }

  revalidateTag('settings')
  revalidatePath('/admin/settings')
  revalidatePath('/')

  return { success: true, data: undefined, message: 'Settings saved.' }
}

export async function getSiteSettings(): Promise<
  Record<string, string | null>
> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')

  if (!data) return {}

  return Object.fromEntries(data.map((row) => [row.setting_key, row.setting_value]))
}
