import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { TravelAlertForm } from '@/components/admin/travel-alerts/travel-alert-form'

export default async function EditTravelAlertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('travel_alerts').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading={`Edit: ${data.title}`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Travel Alerts', href: '/admin/travel-alerts' }, { label: data.title }]} />
      <TravelAlertForm alert={data} />
    </div>
  )
}
