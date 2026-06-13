'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SiteLogo } from '@/components/public/site-logo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { NavLink } from '@/components/motion'
import { MAIN_NAV, SITE } from '@/lib/site-config'

const GLASS_TRANSITION = 'duration-[250ms] ease-out'

const glassPanelStyle = (scrolled: boolean): React.CSSProperties => ({
  backgroundColor: scrolled ? 'rgba(240, 246, 255, 0.88)' : 'rgba(240, 246, 255, 0.75)',
  backdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
  WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
})

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      style={glassPanelStyle(scrolled)}
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow,border-color]',
        GLASS_TRANSITION,
        scrolled
          ? 'border-[rgba(15,23,42,0.08)] shadow-[0_6px_24px_rgba(15,23,42,0.08)]'
          : 'border-[rgba(15,23,42,0.06)] shadow-[0_4px_20px_rgba(15,23,42,0.06)]'
      )}
    >
      {/* Subtle atlas-blue tint */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-[hsl(var(--atlas-blue))]/[0.04] transition-opacity',
          GLASS_TRANSITION,
          scrolled ? 'opacity-100' : 'opacity-80'
        )}
      />

      <div className="container relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-display font-semibold" aria-label={`${SITE.name} home`}>
          <SiteLogo size={32} />
          <span className="truncate text-lg">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} href={item.href} isActive={isActive(item.href)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden shadow-sm sm:inline-flex">
            <Link href="/route-planner">Plan My Trip</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              style={glassPanelStyle(false)}
              className={cn(
                'w-72 border-l border-[rgba(15,23,42,0.06)] shadow-[0_4px_20px_rgba(15,23,42,0.06)]',
                GLASS_TRANSITION
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[hsl(var(--atlas-blue))]/[0.04]"
              />
              <SheetHeader className="relative">
                <SheetTitle className="flex items-center gap-2.5 font-display">
                  <SiteLogo size={24} alt="" />
                  {SITE.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="relative mt-6 flex flex-col gap-1" aria-label="Mobile">
                {MAIN_NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'min-h-[44px] rounded-md px-3 py-2.5 text-sm font-medium',
                        isActive(item.href)
                          ? 'bg-[hsl(var(--atlas-blue))]/10 font-semibold text-[hsl(var(--atlas-blue))]'
                          : 'text-foreground hover:bg-background'
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild className="mt-3 w-full shadow-sm">
                    <Link href="/route-planner">Plan My Trip</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
