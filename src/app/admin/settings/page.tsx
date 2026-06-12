import { AdminHeader } from '@/components/admin/header'
import { SiteSettingsForm } from '@/components/admin/settings/site-settings-form'
import { getSiteSettings } from '@/lib/actions/settings'

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader
        heading="Website Settings"
        description="Control homepage content, contact details, and social links."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Settings' }]}
      />
      <SiteSettingsForm settings={settings} />
    </div>
  )
}
