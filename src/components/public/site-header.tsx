'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiteLogo } from '@/components/public/site-logo'
import { ThemeToggle } from '@/components/public/theme-toggle'
import { SearchDialog } from '@/components/public/search-dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { MAIN_NAV, SITE } from '@/lib/site-config'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  const isHome = pathname === '/'

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Transparent on homepage when at the top; frosted glass on scroll or inner pages
  const isTransparent = isHome && !scrolled

  return (
    <>
      <header
        className={cn(
          'z-40 w-full transition-all duration-300',
          isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0',
          isTransparent
            ? 'bg-transparent border-b border-transparent py-4'
            : 'bg-zinc-950/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg shadow-black/25'
        )}
      >
        <div className="container flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 font-display font-semibold text-white tracking-wide"
            aria-label={`${SITE.name} home`}
          >
            <SiteLogo size={32} />
            <span className="whitespace-nowrap text-xl font-bold tracking-tight">{SITE.name}</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-1',
                    active
                      ? 'text-white font-semibold'
                      : 'text-white/75 hover:text-white'
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-amber-500" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Controls: Search, Lang, Theme, Plan My Trip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Search destinations"
              title="Search destinations (Cmd+K)"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Language Selector Indicator */}
            <div className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white/75 hover:text-white md:flex select-none cursor-pointer">
              <span>EN</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </div>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Plan My Trip Saffron Pill CTA */}
            <Link
              href="/route-planner"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#e05a36] hover:bg-[#cf4e2b] px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Plan My Trip
            </Link>

            {/* Mobile Menu Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 border-l border-white/10 bg-zinc-950/95 text-white backdrop-blur-2xl"
              >
                <SheetHeader className="relative">
                  <SheetTitle className="flex items-center gap-2.5 font-display text-white">
                    <SiteLogo size={24} alt="" />
                    {SITE.name}
                  </SheetTitle>
                </SheetHeader>
                <nav className="relative mt-8 flex flex-col gap-2" aria-label="Mobile">
                  {MAIN_NAV.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex min-h-[44px] items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-white/10 font-semibold text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="pt-4 border-t border-white/10 mt-2 flex items-center justify-between px-3">
                    <span className="text-xs text-white/50">Theme Mode</span>
                    <ThemeToggle />
                  </div>
                  <SheetClose asChild>
                    <Link
                      href="/route-planner"
                      className="mt-4 flex items-center justify-center rounded-full bg-[#e05a36] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40"
                    >
                      Plan My Trip
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
