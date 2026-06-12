'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mountain, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--atlas-blue))]/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-display font-semibold" aria-label={`${SITE.name} home`}>
          <Mountain className="h-6 w-6 shrink-0 text-[hsl(var(--atlas-blue))]" />
          <span className="truncate text-lg">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium',
                isActive(item.href)
                  ? 'font-semibold text-[hsl(var(--atlas-blue))]'
                  : 'text-muted-foreground hover:text-[hsl(var(--atlas-blue))]'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
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
            <SheetContent side="right" className="w-72 bg-[hsl(var(--atlas-mist))]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-display">
                  <Mountain className="h-5 w-5 text-[hsl(var(--atlas-blue))]" />
                  {SITE.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
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
