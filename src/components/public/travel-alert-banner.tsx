import { getActiveTravelAlerts } from '@/lib/supabase/queries'
import { TravelAlertClient } from './travel-alert-client'

/** Server component — fetches live alerts then hands off to client shell. */
export async function TravelAlertBanner() {
  const alerts = await getActiveTravelAlerts()
  if (alerts.length === 0) return null
  return <TravelAlertClient alerts={alerts} />
}
