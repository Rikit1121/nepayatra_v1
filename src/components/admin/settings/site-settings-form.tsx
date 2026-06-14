'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextField, TextareaField, SwitchField } from '@/components/admin/form-field'
import { siteSettingsSchema, type SiteSettingsFormValues } from '@/lib/validations/admin'
import { updateSiteSettings } from '@/lib/actions/settings'

interface SiteSettingsFormProps {
  settings: Record<string, string | null>
}

function parse(settings: Record<string, string | null>): SiteSettingsFormValues {
  return {
    site_name: settings.site_name ?? 'NepaYatra',
    site_tagline: settings.site_tagline ?? '',
    homepage_hero_headline: settings.homepage_hero_headline ?? 'Plan Your Nepal Trip — Step by Step',
    homepage_hero_subheadline: settings.homepage_hero_subheadline ?? '',
    homepage_hero_image_url: settings.homepage_hero_image_url ?? '',
    homepage_featured_destinations_count: Number(settings.homepage_featured_destinations_count ?? 6),
    homepage_featured_packages_count: Number(settings.homepage_featured_packages_count ?? 3),
    homepage_show_travel_alerts: settings.homepage_show_travel_alerts !== 'false',
    homepage_show_knowledge_base: settings.homepage_show_knowledge_base !== 'false',
    contact_email: settings.contact_email ?? '',
    contact_phone: settings.contact_phone ?? '',
    contact_whatsapp: settings.contact_whatsapp ?? '',
    contact_address: settings.contact_address ?? '',
    social_facebook: settings.social_facebook ?? '',
    social_instagram: settings.social_instagram ?? '',
    social_youtube: settings.social_youtube ?? '',
    social_twitter: settings.social_twitter ?? '',
  }
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: parse(settings),
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: SiteSettingsFormValues) {
    const result = await updateSiteSettings(values)
    if (result.success) toast.success(result.message ?? 'Settings saved.')
    else toast.error(result.error)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">General</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<SiteSettingsFormValues> name="site_name" label="Site name" required />
            <TextField<SiteSettingsFormValues> name="site_tagline" label="Site tagline" />
          </div>
        </div>

        <Separator />

        {/* Homepage */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Homepage</h3>
          <TextField<SiteSettingsFormValues> name="homepage_hero_headline" label="Hero headline" required />
          <TextareaField<SiteSettingsFormValues> name="homepage_hero_subheadline" label="Hero subheadline" rows={2} />
          <TextField<SiteSettingsFormValues> name="homepage_hero_image_url" label="Hero image URL" placeholder="/images/sarangkot.webp" description="Leave blank for the default hero, or use /images/your-file.jpg" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<SiteSettingsFormValues> name="homepage_featured_destinations_count" label="Featured destinations count" type="number" placeholder="6" />
            <TextField<SiteSettingsFormValues> name="homepage_featured_packages_count" label="Featured packages count" type="number" placeholder="3" />
          </div>
          <SwitchField<SiteSettingsFormValues> name="homepage_show_travel_alerts" label="Show travel alerts on homepage" />
          <SwitchField<SiteSettingsFormValues> name="homepage_show_knowledge_base" label="Show knowledge base section on homepage" />
        </div>

        <Separator />

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<SiteSettingsFormValues> name="contact_email" label="Contact email" placeholder="hello@nepayatra.com" />
            <TextField<SiteSettingsFormValues> name="contact_phone" label="Phone number" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<SiteSettingsFormValues> name="contact_whatsapp" label="WhatsApp number" placeholder="+977XXXXXXXXX" />
            <TextField<SiteSettingsFormValues> name="contact_address" label="Address" />
          </div>
        </div>

        <Separator />

        {/* Social */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Social Media</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<SiteSettingsFormValues> name="social_facebook" label="Facebook URL" placeholder="https://facebook.com/..." />
            <TextField<SiteSettingsFormValues> name="social_instagram" label="Instagram URL" placeholder="https://instagram.com/..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField<SiteSettingsFormValues> name="social_youtube" label="YouTube URL" placeholder="https://youtube.com/..." />
            <TextField<SiteSettingsFormValues> name="social_twitter" label="X / Twitter URL" placeholder="https://x.com/..." />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save settings
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
