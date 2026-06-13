'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/admin/sidebar'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from 'sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </>
    )
  }

  return (
    <QueryProvider>
      <div className="min-h-screen bg-muted/20">
        <Sidebar />

        {/* Main content — offset by sidebar width on md+ */}
        <main className="md:pl-64">
          <div className="p-4 pt-14 md:pt-0 md:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </QueryProvider>
  )
}
