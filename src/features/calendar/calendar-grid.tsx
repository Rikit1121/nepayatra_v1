'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PartyPopper,
  Building2,
  Calendar as CalendarIcon,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getMonthCalendarGrid,
  GREGORIAN_MONTHS,
  NEPALI_MONTHS,
  toDevanagariDigits,
  type CalendarDayItem,
} from '@/lib/calendar/nepali-date'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/lib/supabase/types'

interface CalendarGridProps {
  initialYear?: number
  initialMonth?: number
  events?: CalendarEvent[]
  className?: string
  showMonthLink?: boolean
}

const WEEKDAYS = [
  { en: 'Sun', np: 'आइत', isWeekend: false },
  { en: 'Mon', np: 'सोम', isWeekend: false },
  { en: 'Tue', np: 'मंगल', isWeekend: false },
  { en: 'Wed', np: 'बुध', isWeekend: false },
  { en: 'Thu', np: 'बिही', isWeekend: false },
  { en: 'Fri', np: 'शुक्र', isWeekend: false },
  { en: 'Sat', np: 'शनि', isWeekend: true }, // Nepal official weekly holiday
]

export function CalendarGrid({
  initialYear = 2026,
  initialMonth = 10,
  events = [],
  className,
  showMonthLink = true,
}: CalendarGridProps) {
  const [year, setYear] = React.useState(initialYear)
  const [month, setMonth] = React.useState(initialMonth) // 1..12
  const [selectedDay, setSelectedDay] = React.useState<CalendarDayItem | null>(null)

  const days = React.useMemo(() => {
    return getMonthCalendarGrid(year, month)
  }, [year, month])

  const currentMonthMeta = GREGORIAN_MONTHS[month - 1] ?? GREGORIAN_MONTHS[0]

  // Determine BS months spanned in this Gregorian month
  const bsMonthSummary = React.useMemo(() => {
    const currentDays = days.filter((d) => d.isCurrentMonth)
    if (currentDays.length === 0) return ''
    const firstBs = currentDays[0].bs
    const lastBs = currentDays[currentDays.length - 1].bs

    if (firstBs.month === lastBs.month) {
      return `${firstBs.monthNameNp} ${toDevanagariDigits(firstBs.year)} (${firstBs.monthNameEn} ${firstBs.year})`
    }
    return `${firstBs.monthNameNp} – ${lastBs.monthNameNp} ${toDevanagariDigits(firstBs.year)} (${firstBs.monthNameEn} – ${lastBs.monthNameEn} ${firstBs.year})`
  }, [days])

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
    setSelectedDay(null)
  }

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
    setSelectedDay(null)
  }

  const jumpToToday = () => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
    setSelectedDay(null)
  }

  // Find events matching a specific date string
  const getEventsForDate = (dateStr: string): CalendarEvent[] => {
    return events.filter((e) => {
      if (e.start_date_ad === dateStr || e.end_date_ad === dateStr) return true
      if (e.start_date_ad <= dateStr && e.end_date_ad >= dateStr) return true
      return false
    })
  }

  const selectedDayEvents = selectedDay ? getEventsForDate(selectedDay.dateAd) : []

  return (
    <div className={cn('space-y-4', className)}>
      {/* ── HEADER CONTROLS ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              {currentMonthMeta.name} {year}
            </h2>
            {showMonthLink && (
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-[hsl(var(--atlas-blue))]">
                <Link href={`/calendar/${year}/${currentMonthMeta.slug}`}>
                  Month Guide →
                </Link>
              </Button>
            )}
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[hsl(var(--atlas-saffron))]">
            {bsMonthSummary}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={jumpToToday} className="h-8 text-xs font-semibold">
            Today
          </Button>

          <div className="flex items-center rounded-lg border border-border/50 bg-muted/20">
            <Button
              size="icon"
              variant="ghost"
              onClick={prevMonth}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-mono text-xs font-bold text-muted-foreground">
              {String(month).padStart(2, '0')} / {year}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={nextMonth}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── CALENDAR GRID ── */}
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-xs">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30 text-center text-xs font-semibold">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd.en}
              className={cn(
                'py-2.5 px-1',
                wd.isWeekend ? 'text-rose-600 dark:text-rose-400 bg-rose-500/[0.04]' : 'text-muted-foreground'
              )}
            >
              <span className="block font-display">{wd.en}</span>
              <span className="block text-[10px] font-normal text-muted-foreground/70">{wd.np}</span>
            </div>
          ))}
        </div>

        {/* Day slots */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/30 text-xs">
          {days.map((item, idx) => {
            const dayEvents = getEventsForDate(item.dateAd)
            const hasHoliday = dayEvents.some((e) => e.is_public_holiday)
            const hasFestival = dayEvents.length > 0
            const isSaturday = item.dayOfWeek === 6
            const isSelected = selectedDay?.dateAd === item.dateAd

            return (
              <button
                key={`${item.dateAd}-${idx}`}
                type="button"
                onClick={() => setSelectedDay(item)}
                className={cn(
                  'group relative min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 text-left transition-colors flex flex-col justify-between',
                  !item.isCurrentMonth && 'bg-muted/15 opacity-40',
                  item.isCurrentMonth && 'hover:bg-accent/40',
                  item.isToday && 'bg-[hsl(var(--atlas-blue))]/[0.04]',
                  isSelected && 'ring-2 ring-inset ring-[hsl(var(--atlas-blue))] bg-[hsl(var(--atlas-blue))]/[0.08]',
                  isSaturday && item.isCurrentMonth && 'bg-rose-500/[0.02]'
                )}
              >
                {/* Top: AD day + BS day */}
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      'font-display text-sm sm:text-base font-bold',
                      item.isToday
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--atlas-blue))] text-white'
                        : isSaturday
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-foreground'
                    )}
                  >
                    {item.dayAd}
                  </span>

                  {/* BS date pill */}
                  <span
                    className={cn(
                      'font-mono text-[10px] sm:text-[11px] font-semibold px-1 rounded',
                      hasHoliday
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'text-[hsl(var(--atlas-saffron))] bg-[hsl(var(--atlas-saffron))]/10'
                    )}
                    title={`BS: ${item.bs.formattedEn} (${item.bs.formattedNp})`}
                  >
                    {item.bs.day}
                  </span>
                </div>

                {/* Bottom: Event indicators */}
                <div className="mt-1 space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 1).map((ev) => (
                    <div
                      key={ev.id}
                      className={cn(
                        'truncate rounded px-1 py-0.5 text-[9px] sm:text-[10px] font-medium leading-tight',
                        ev.is_public_holiday
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold'
                          : 'bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))]'
                      )}
                      title={ev.title}
                    >
                      {ev.title.replace(/\s*202[0-9]/, '')}
                    </div>
                  ))}
                  {dayEvents.length > 1 && (
                    <span className="text-[9px] text-muted-foreground">
                      +{dayEvents.length - 1} more
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── SELECTED DAY DETAILS DRAWER ── */}
      {selectedDay && (
        <article className={cn(atlasCardPlanner, 'p-4 bg-card border-[hsl(var(--atlas-blue))]/30')}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--atlas-blue))]">
                Selected Date Details
              </p>
              <h3 className="font-display text-lg font-bold text-foreground">
                {selectedDay.dateAd} (AD) · {selectedDay.bs.formattedEn} (BS)
              </h3>
              <p className="text-xs font-semibold text-[hsl(var(--atlas-saffron))]">
                {selectedDay.bs.formattedNp}
              </p>
            </div>

            <Button asChild size="sm" className="shadow-xs">
              <Link href="/route-planner">
                Plan Trip for This Period <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="mt-3 space-y-2">
              {selectedDayEvents.map((ev) => (
                <div key={ev.id} className="rounded-xl border border-border/40 bg-muted/20 p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-bold text-foreground">
                      {ev.title}
                    </h4>
                    {ev.is_public_holiday && (
                      <Badge variant="destructive" className="text-[10px]">
                        Public Holiday
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {ev.summary}
                  </p>
                  {ev.travel_impact && (
                    <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                      Travel note: {ev.travel_impact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              No major public holiday or national festival recorded on this specific date. Regular travel and transport operations.
            </p>
          )}
        </article>
      )}
    </div>
  )
}
