'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Milestone,
  Route,
  Package,
  HelpCircle,
  BookOpen,
  Users,
  AlertTriangle,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SiteLogo } from '@/components/public/site-logo'
import * as React from 'react'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Content',
    items: [
      { label: 'Destinations', href: '/admin/destinations', icon: MapPin },
      { label: 'Border Crossings', href: '/admin/border-crossings', icon: Milestone },
      { label: 'Routes', href: '/admin/routes', icon: Route },
      { label: 'Packages', href: '/admin/packages', icon: Package },
      { label: 'Knowledge Base', href: '/admin/knowledge-base', icon: BookOpen },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Advisors', href: '/admin/advisors', icon: Users },
      { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Travel Alerts', href: '/admin/travel-alerts', icon: AlertTriangle },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

function NavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ElementType
  label: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 font-semibold text-foreground">
          <SiteLogo size={24} alt="" />
          <span>NepaYatra</span>
          <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((section) => {
          if ('href' in section) {
            return (
              <NavLink
                key={section.href}
                href={section.href as string}
                icon={section.icon as React.ElementType}
                label={section.label}
                onClick={onLinkClick}
              />
            )
          }

          return (
            <div key={section.label} className="pt-3 first:pt-0">
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items?.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={onLinkClick}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-background">
        <SidebarContent />
      </aside>
    </>
  )
}
