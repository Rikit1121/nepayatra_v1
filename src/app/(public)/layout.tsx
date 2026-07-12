import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { TravelAlertBanner } from '@/components/public/travel-alert-banner'
import { GlobalJsonLd } from '@/components/public/global-json-ld'
import { Toaster } from '@/components/ui/sonner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalJsonLd />
      <TravelAlertBanner />
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <SiteFooter />
      <Toaster richColors position="top-center" />
    </div>
  )
}
